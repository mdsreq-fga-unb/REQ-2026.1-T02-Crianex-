# 2.4 Tecnologias Utilizadas

O stack tecnológico do Crianex foi escolhido com base em três critérios principais: **alinhamento com os requisitos técnicos do produto**, **curva de aprendizado da equipe** e **suporte a SEO e performance** necessários para a vitrine digital pública.

---

### Visão Geral da Arquitetura

```
[ SvelteKit + Shadcn/ui ]  ──→  [ Express.js + TypeScript ]  ──→  [ Supabase / PostgreSQL ]
       (Frontend)                        (Backend API)                    (Banco de Dados)
            │                                                                    │
            └──────────────────  Supabase Client (fluxos simples)  ─────────────┘
                                                  │
                                    [ Kubernetes (Crianex Infra) ]
                                        (Deploy — Sprint 6)
```

---

### 2.4.1 Frontend — SvelteKit + Shadcn/ui

| Atributo | Detalhe |
|----------|---------|
| **Framework** | SvelteKit |
| **Biblioteca de UI** | Shadcn/ui (componentes acessíveis e customizáveis) |
| **Renderização** | SSR (Server-Side Rendering) |
| **Linguagem** | TypeScript |

**Justificativa para SvelteKit em vez de React:**

| Critério | SvelteKit | React/Next.js |
|----------|-----------|---------------|
| **Bundle size** | Muito menor — sem runtime virtual DOM | Runtime React incluído |
| **Curva de aprendizado** | Sintaxe mais próxima de HTML/CSS/JS puro | Requer conhecimento de JSX e hooks |
| **Performance** | Compilação estática sem overhead de runtime | Diferenças notáveis em payloads grandes |
| **Adequação ao projeto** | Vitrine pública exige SEO; área adm. exige reatividade | Ambos alcançáveis, porém com maior complexidade |

O SSR do SvelteKit é essencial para que a **vitrine digital** seja indexada corretamente por motores de busca, aumentando a visibilidade da Crianex no mercado B2B.

---

### 2.4.2 Backend — Express.js + TypeScript

| Atributo | Detalhe |
|----------|---------|
| **Framework** | Express.js |
| **Linguagem** | TypeScript |
| **Arquitetura** | REST API |
| **Autenticação** | JWT integrado ao Supabase Auth |

O backend atua como camada de negócio intermediária para os fluxos de maior complexidade — especialmente operações que envolvem múltiplas tabelas, validações de negócio e geração de relatórios. Para fluxos mais simples (como leitura de dados públicos da vitrine), o frontend pode acessar o Supabase diretamente via cliente.

---

### 2.4.3 Banco de Dados — Supabase + PostgreSQL + RLS

| Atributo | Detalhe |
|----------|---------|
| **BaaS** | Supabase |
| **Banco** | PostgreSQL |
| **Segurança de acesso** | Row Level Security (RLS) |
| **Autenticação** | Supabase Auth (JWT) |
| **Acesso direto** | Supabase Client JS (fluxos de leitura simples) |

O **Row Level Security (RLS)** do PostgreSQL garante que cada usuário só acessa os dados aos quais tem permissão, mesmo em acessos diretos pelo frontend — eliminando a necessidade de um proxy de backend para todos os endpoints de leitura.

---

### 2.4.4 Infraestrutura — Kubernetes

| Atributo | Detalhe |
|----------|---------|
| **Orquestrador** | Kubernetes |
| **Operado por** | Crianex (infraestrutura própria) |
| **Previsão de deploy** | Sprint 6 |

O deploy da aplicação será realizado no cluster Kubernetes gerenciado pela própria Crianex. O time de desenvolvimento integrará a pipeline de CI/CD ao cluster nas etapas finais do projeto. Até lá, os ambientes de desenvolvimento e homologação utilizam Docker Compose localmente.

---

### Resumo do Stack

| Camada | Tecnologia | Versão / Notas |
|--------|-----------|---------------|
| Frontend | SvelteKit + Shadcn/ui | TypeScript, SSR |
| Backend | Express.js | TypeScript, REST API |
| Banco de Dados | PostgreSQL (via Supabase) | RLS habilitado |
| BaaS | Supabase | Auth + Storage + RLS |
| Infra / Deploy | Kubernetes | Gerenciado pela Crianex |
| CI/CD | GitHub Actions | Build, test, deploy automático |
| Controle de versão | Git / GitHub | Monorepo |
