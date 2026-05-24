## Histórico de Revisão

| Versão | Data | Descrição | Autor |
|--------|------|-----------|-------|
| v1.0 | 20/05/2026 | Documentação inicial da arquitetura | Equipe Crianex |

# Arquitetura do Sistema — Crianex Hub
Visão técnica da plataforma Crianex Hub — diagramas, decisões de arquitetura (ADRs) e descrição dos componentes.

---

## 1. Visão Geral

O Crianex Hub é uma plataforma SaaS composta por duas áreas funcionais distintas: uma **vitrine pública** (sem autenticação) voltada ao portfólio de produtos, captação de leads e FAQ institucional; e uma **área administrativa autenticada** que concentra o CRM Kanban, dashboard executivo, gestão financeira, tickets de suporte e notificações.

A arquitetura adotada é **Monolito Modular** — uma aplicação Express.js com separação lógica por módulos internos, servida por um frontend SvelteKit com SSR. Essa decisão foi guiada por quatro critérios principais:

1. **Prazo:** ~2,5 semanas de desenvolvimento ativo, 3 iterações de entrega, 6 desenvolvedores com WIP limit de 2 por Class Owner — overhead de orquestração de microsserviços é incompatível com essa cadência.
2. **Latência:** RNF02 e RNF03 exigem resposta ≤ 2s em 95% das requisições; a comunicação intra-processo do monolito elimina a latência de rede entre serviços.
3. **Integridade ACID:** RNF06 exige consistência transacional na captação de leads; transações distribuídas (padrão Saga) adicionariam complexidade sem benefício no escopo atual.
4. **Superfície de segurança:** RNF07 (OWASP Top 10) é mais simples de cumprir com um único ponto de entrada e RLS centralizado no banco, em vez de múltiplos endpoints independentes.

A estrutura modular garante que, se necessário no futuro, módulos possam ser extraídos como microsserviços sem refatoração estrutural — o desacoplamento lógico já está preservado.

---

## 2. Diagrama de Arquitetura Geral

```mermaid
graph TD
    subgraph BROWSER["🌐 Navegador Web"]
        B[Browser]
    end

    subgraph FRONTEND["Frontend — SvelteKit + Vite + TypeScript"]
        PUB["(public)\nvitrine · FAQ · lead"]
        ADM["(admin)\nCRM · dashboard · financeiro"]
    end

    subgraph BACKEND["Backend — Express.js + TypeScript"]
        AUTH_MOD[auth]
        CRM_MOD[crm]
        PROD_MOD[products]
        TICK_MOD[tickets]
        FIN_MOD[finance]
        NOTIF_MOD[notifications]
    end

    subgraph DADOS["Dados — Supabase / PostgreSQL"]
        SUPA_AUTH[Supabase Auth]
        SUPA_STORE[Supabase Storage]
        SUPA_RLS[RLS Policies]
        PG[(PostgreSQL)]
    end

    subgraph INFRA["Infra / CI-CD"]
        GHA[GitHub Actions]
        K8S["Kubernetes\n(pós-venda)"]
    end

    B -->|"GET /\nSSR + hydration"| PUB
    B -->|"GET /admin\nSSR + JWT cookie"| ADM
    PUB -->|"Supabase Client\nselect (RLS)"| SUPA_RLS
    ADM -->|"fetch /api/*\nBearer JWT"| AUTH_MOD
    AUTH_MOD --> SUPA_AUTH
    AUTH_MOD --> CRM_MOD
    AUTH_MOD --> PROD_MOD
    AUTH_MOD --> TICK_MOD
    AUTH_MOD --> FIN_MOD
    AUTH_MOD --> NOTIF_MOD
    CRM_MOD --> PG
    PROD_MOD --> PG
    TICK_MOD --> PG
    FIN_MOD --> PG
    NOTIF_MOD --> PG
    SUPA_RLS --> PG
    SUPA_STORE --> PG
    GHA -->|"build → image → deploy"| K8S

    style BROWSER fill:#e3f2fd,stroke:#1565c0
    style FRONTEND fill:#fff3e0,stroke:#e65100
    style BACKEND fill:#e8f5e9,stroke:#2e7d32
    style DADOS fill:#fce4ec,stroke:#880e4f
    style INFRA fill:#f3e5f5,stroke:#4a148c
```

!!! note "Kubernetes — pós-venda"
    O nó Kubernetes está presente na arquitetura, mas não é utilizado durante as iterações de desenvolvimento (IT1–IT3). O ambiente de desenvolvimento usa Docker Compose local + Supabase gerenciado na nuvem.

---

## 3. Fluxo de Requisição — Vitrine Pública

A vitrine pública acessa o Supabase diretamente via Supabase Client no servidor SvelteKit, sem passar pelo Express. Isso elimina um round-trip de rede e atende ao RNF02 (≤ 2s em 95% das requisições).

```mermaid
sequenceDiagram
    participant Nav as Navegador
    participant SK as SvelteKit SSR
    participant SC as Supabase Client
    participant RLS as RLS / PostgreSQL

    Nav->>SK: GET /produtos
    activate SK
    SK->>SC: select * from produtos where publicado = true
    activate SC
    SC->>RLS: query com política RLS ativa
    RLS-->>SC: rows[] (apenas produtos publicados)
    deactivate SC
    SC-->>SK: rows[]
    SK-->>Nav: HTML renderizado (SSR) + hydration bundle
    deactivate SK
```

!!! note "Segurança via RLS"
    A política RLS `WHERE publicado = true AND ativo = true` é aplicada **no banco de dados**, não na aplicação. Isso garante que dados não publicados nunca chegam ao cliente — mesmo que o Supabase Client seja chamado diretamente, sem backend intermediário validando os filtros.

---

## 4. Fluxo de Requisição — Área Administrativa

Toda rota sob `/admin` passa pelo Express, que valida o JWT antes de executar qualquer query. Isso cria um único ponto de controle de acesso (RNF01) e permite filtragem por tenant no nível da aplicação.

```mermaid
sequenceDiagram
    participant Nav as Navegador
    participant SK as SvelteKit
    participant API as Express API
    participant SA as Supabase Auth
    participant PG as PostgreSQL

    Nav->>SK: GET /admin/crm
    activate SK
    SK->>API: GET /api/crm/leads\nAuthorization: Bearer <JWT>
    activate API
    API->>SA: verifyToken(JWT)
    activate SA
    SA-->>API: { user_id, role, tenant_id }
    deactivate SA
    API->>PG: SELECT * FROM leads WHERE tenant_id = $1
    activate PG
    PG-->>API: leads[]
    deactivate PG
    API-->>SK: 200 OK — JSON payload
    deactivate API
    SK-->>Nav: página /admin/crm renderizada
    deactivate SK
```

---

## 5. Fluxo de Autenticação

A autenticação usa Supabase Auth como provedor de identidade. O SvelteKit armazena os tokens em cookie `httpOnly`, impedindo acesso por JavaScript no cliente — mitigação direta da vulnerabilidade OWASP A07 (XSS).

```mermaid
sequenceDiagram
    participant U as Usuário
    participant SK as SvelteKit
    participant SA as Supabase Auth
    participant CK as Cookie httpOnly
    participant API as Express API

    U->>SK: POST /admin/login\n{ email, senha }
    activate SK
    SK->>SA: signInWithPassword({ email, password })
    activate SA
    SA-->>SK: { access_token, refresh_token, user }
    deactivate SA
    SK->>CK: Set-Cookie: sb-access-token (httpOnly, Secure, SameSite=Strict)
    SK-->>U: 302 → /admin/dashboard
    deactivate SK

    U->>SK: GET /admin/dashboard
    activate SK
    SK->>API: GET /api/dashboard\nAuthorization: Bearer <access_token>
    activate API
    API->>SA: verifyToken(access_token)
    activate SA
    SA-->>API: { user, role, tenant_id }
    deactivate SA
    API-->>SK: dados protegidos (JSON)
    deactivate API
    SK-->>U: página /admin/dashboard renderizada
    deactivate SK
```

!!! warning "Mitigação OWASP A07 — XSS"
    O cookie `httpOnly` impede que qualquer script client-side acesse o token de sessão. Combinado com `Secure` (HTTPS only) e `SameSite=Strict` (bloqueio CSRF), essa configuração atende ao controle A07 do OWASP Top 10 sem necessidade de lógica adicional na aplicação.

---

## 6. Estrutura de Módulos do Backend

O Express é organizado em módulos independentes, cada um com seu próprio `router`, `service` e `repository`. O módulo `auth` é transversal: todos os módulos que expõem rotas protegidas passam pelo middleware de validação JWT antes de executar qualquer lógica de negócio.

```mermaid
graph LR
    Router[Express Router]

    Router --> auth[auth\nmiddleware JWT]
    Router --> crm[crm\nleads · cards · histórico]
    Router --> products[products\ncatálogo SaaS]
    Router --> tickets[tickets\nsuporte]
    Router --> finance[finance\nrelatórios · exportação]
    Router --> notifications[notifications\neventos · push]

    auth -.->|protege| crm
    auth -.->|protege| products
    auth -.->|protege| tickets
    auth -.->|protege| finance
    auth -.->|protege| notifications

    crm -->|evento: novo lead| notifications
    tickets -->|vincula cliente/lead| crm

    crm --> DB[(Supabase / PostgreSQL)]
    products --> DB
    tickets --> DB
    finance --> DB
    notifications --> DB
```

!!! tip "Isolamento entre módulos"
    `finance` não tem dependência de nenhum outro módulo além de `auth`. Isso facilita eventual extração futura como serviço independente, caso o volume de relatórios justifique escala separada.

---

## 7. ADR-001 — Monolito Modular vs. Microsserviços

**Título:** ADR-001 — Adoção de Monolito Modular em vez de Microsserviços

**Status:** Aceito

**Data:** 20/05/2026

---

### Contexto

O projeto Crianex Hub possui as seguintes restrições e requisitos não-funcionais que condicionaram a escolha arquitetural:

- **Prazo:** ~10 semanas de desenvolvimento, 3 iterações de entrega, 6 desenvolvedores operando com WIP limit de 2 por Class Owner (metodologia FDD + Scrumban Enxuto).
- **RNF02 e RNF03:** Tempo de resposta ≤ 2s em 95% das requisições, tanto na vitrine pública quanto na área administrativa.
- **RNF06:** Integridade transacional ACID obrigatória na captação de leads (inserção atômica de lead + evento de notificação).
- **RNF07:** Conformidade com OWASP Top 10 — minimizar superfície de ataque e pontos de falha de autenticação/autorização.
- **Infra:** Kubernetes disponível apenas na fase pós-venda; durante o desenvolvimento, o ambiente é Docker Compose local.

---

### Decisão

Adotar **Monolito Modular** com separação lógica por módulos dentro do Express.js, compartilhando um único banco PostgreSQL via Supabase, e servido por um único frontend SvelteKit com rotas separadas por contexto (`(public)` e `(admin)`).

---

### Alternativa Rejeitada — Microsserviços

A alternativa de microsserviços foi avaliada e rejeitada pelos seguintes motivos:

| Critério | Problema com Microsserviços |
|----------|----------------------------|
| **Latência (RNF02, RNF03)** | Comunicação inter-serviço via HTTP/gRPC adiciona latência de rede não controlável, tornando difícil garantir ≤ 2s em 95% das requisições sem camada de cache adicional. |
| **ACID (RNF06)** | Transações distribuídas exigem o padrão Saga ou Two-Phase Commit — complexidade desproporcional ao escopo do projeto e com risco real de inconsistência eventual. |
| **Segurança (RNF07)** | Múltiplos endpoints independentes ampliam a superfície de ataque. Cada serviço precisa de sua própria validação JWT, aumentando o risco de lacunas de autorização. |
| **Prazo e capacidade** | Service mesh, service discovery, múltiplos Dockerfiles, comunicação assíncrona (mensageria) e observabilidade distribuída são inviáveis em 10 semanas com 6 desenvolvedores. |

---

### Consequências Positivas

- Entrega incremental possível desde a IT1 sem dependência de infra complexa.
- Isolamento lógico por módulo sem custo de latência de rede entre serviços.
- Path claro de extração futura: a separação por módulos já respeita fronteiras de domínio — extrair um módulo como microsserviço no futuro requer mover código, não refatorar arquitetura.
- Testes mais simples: uma codebase, um banco, uma pipeline CI — cobertura de 45% (RNF17) é mais fácil de atingir e medir.
- Transações ACID nativas sem padrões de consistência eventual.

---

### Consequências Negativas e Riscos

| Risco | Mitigação |
|-------|-----------|
| O monolito escala inteiro mesmo quando apenas um módulo está sob carga | Kubernetes com réplicas do Express (pós-venda) — aceitável no prazo atual |
| Acoplamento acidental entre módulos (imports diretos fora da interface pública) | Revisão de imports no code review é critério de DoD; proibido chamar repositórios de outro módulo diretamente |
| Banco compartilhado como ponto único de falha | Supabase gerenciado tem SLA de 99.9% e backup automático — risco aceito para o escopo do projeto |

---

## 8. Estrutura do Monorepo

```
apps/
  web/                        ← SvelteKit (SSR + CSR)
    src/
      routes/
        (public)/             ← vitrine, FAQ, formulário de lead
        (admin)/              ← painel autenticado, CRM, dashboard
      lib/
        components/           ← componentes Shadcn/ui
        stores/               ← estado global (Svelte stores)
        api/                  ← wrappers de chamada ao Express
  api/                        ← Express.js
    src/
      modules/
        auth/                 ← JWT validation, middleware, hooks
        crm/                  ← leads, cards Kanban, histórico
        products/             ← catálogo SaaS CRUD
        tickets/              ← suporte, SLA, histórico
        finance/              ← relatórios, exportação PDF/CSV
        notifications/        ← eventos, push, log de atividades
      shared/                 ← utilitários internos do Express
packages/
  shared/                     ← tipos TypeScript compartilhados (web + api)
    src/
      types/                  ← interfaces de domínio
      schemas/                ← validações Zod compartilhadas
supabase/                     ← schema e migrations do banco (Supabase CLI)
  migrations/                 ← arquivos SQL versionados (1 arquivo por issue de DB)
    YYYYMMDDHHMMSS_<descricao>.sql
  seed.sql                    ← dados iniciais (about_sections, faq_categories, etc.)
  config.toml                 ← configuração do projeto Supabase CLI
```

!!! note "Tipos compartilhados"
    O pacote `packages/shared` é a única fonte de verdade para os contratos de API — os tipos TypeScript gerados aqui são consumidos tanto pelo frontend quanto pelo backend, eliminando divergências de contrato em tempo de desenvolvimento.

---

## 9. Estratégia de Deploy por Fase

### Ambientes

| Fase | Ambiente | Estratégia |
|------|----------|------------|
| Individual (dev) | Local — `supabase start` (Docker) | Supabase CLI sobe instância completa localmente; sem conta necessária |
| Integração (equipe) | Projeto Supabase da equipe (free tier) | Migrations aplicadas via `supabase db push`; compartilhado pela equipe |
| Produção | Projeto Supabase da Crianex (Otávio) | `supabase db push --linked` após validação em staging; acesso liberado pela Crianex |
| Pós-venda | Cluster Kubernetes Crianex | GitHub Actions: build → push image → `kubectl apply` |

!!! note "Fluxo de schema (issues de DB)"
    Cada issue de schema gera **um arquivo de migration SQL** em `supabase/migrations/`. O dev escreve
    a migration localmente (`supabase start` + `supabase db diff`), testa com `supabase db reset` e
    abre PR com o arquivo versionado. O CI aplica automaticamente no projeto de integração da equipe.
    O projeto da Crianex só recebe a migration na entrega de cada iteração.

### Pipeline CI/CD

O pipeline é executado pelo GitHub Actions a cada push na branch `main` (via Pull Request aprovado):

```
Push → main
  │
  ├── lint (ESLint + Prettier)
  ├── typecheck (tsc --noEmit)
  ├── test (Vitest — cobertura mínima 45%)
  └── build
        ├── Docker image: crianex/web:sha
        └── Docker image: crianex/api:sha
              │
              └── [pós-venda] push → registry → kubectl apply -f k8s/
```

Durante as iterações IT1–IT3, o pipeline para após o `build` — o deploy em Kubernetes não está ativo. O ambiente de homologação usa `docker compose up` com as imagens geradas localmente.

!!! warning "Proteção da branch main"
    Todo merge em `main` requer ao menos 1 aprovação de revisor via Pull Request. Commits diretos na `main` são bloqueados por regra de branch protection no GitHub. Essa regra está alinhada com o DoD da metodologia FDD + Scrumban Enxuto do projeto.

### ADR-001 — SvelteKit em vez de React/Next.js

**Contexto:** necessidade de SSR para SEO (OE2) e bundle pequeno para vitrine pública.

| Critério | SvelteKit | React / Next.js |
|----------|-----------|-----------------|
| Bundle size | Sem runtime virtual DOM | Runtime React incluído |
| SSR + SEO | Nativo, simples | Configuração extra |
| Curva de aprendizado | HTML/CSS/JS puro | JSX + hooks |
| Bilinguismo | paraglide-js nativo SvelteKit | next-intl ou react-i18next |

**Decisão:** SvelteKit com `adapter-node` para SSR em produção.

### ADR-002 — paraglide-js para i18n

**Contexto:** vitrine bilíngue PT/EN com troca em 1 clique (RNF13), SSR obrigatório.

**Decisão:** `@inlang/paraglide-sveltekit` — integração nativa com SvelteKit, mensagens tree-shakeable (só o que é usado vai para o bundle), sem overhead de runtime no cliente.

### ADR-003 — Argon2id / bcrypt para senhas

Supabase Auth gerencia o hash. Fator mínimo 12 (RNF08).

### ADR-004 — RLS como primeira linha de defesa

Row Level Security no PostgreSQL garante isolamento de dados mesmo em acessos diretos do frontend via Supabase JS client — não depender apenas de validações da camada de aplicação.


## 10. Rastreabilidade Arquitetural → RNFs

| Decisão Arquitetural | RNFs Atendidos | Justificativa |
|----------------------|----------------|---------------|
| SvelteKit SSR (`load()` server-side) | RNF02, RNF04, RNF05 | HTML pré-renderizado no servidor reduz TTFB; SSR nativo; metadados Open Graph e sitemap por rota |
| Acesso direto Supabase Client (leitura pública) | RNF02 | Elimina round-trip ao Express para rotas públicas, mantendo latência abaixo de 2s |
| Express modular — chamada local, sem rede inter-serviço | RNF03 | Latência intra-processo (< 1ms) em vez de HTTP entre serviços; resposta admin ≤ 2s garantida |
| Supabase Auth + JWT + cookie `httpOnly` | RNF01, RNF07 | Isolamento da rota `/admin` via middleware; cookie `httpOnly` mitiga XSS (OWASP A07) |
| RLS no PostgreSQL | RNF07 | Controle de acesso no nível do banco elimina privilege escalation mesmo em falhas de aplicação |
| Transação única PostgreSQL via Supabase | RNF06 | ACID nativo sem saga; inserção atômica de lead + notificação sem risco de inconsistência |
| Shadcn/ui + design tokens (Tailwind) | RNF12 | Componentes responsivos por padrão; uma codebase para mobile, tablet e desktop |
| Monorepo TypeScript com `packages/shared` | RNF16, RNF17 | Stack obrigatória preservada; tipos compartilhados reduzem superfície de bug; cobertura unificada |
| Kubernetes + réplicas Express (pós-venda) | RNF14 | Escala horizontal do backend sem alterações de código; orquestração via cluster gerenciado pela Crianex |
