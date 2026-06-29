# IT1 — Design Técnico

Artefatos produzidos durante a fase de **Technical Design Review (TDR)** da IT1, aplicando a **Formalização Seletiva**: diagramas leves e acordos de arquitetura para mitigar riscos antes do desenvolvimento, seguidos de validação com os stakeholders.

Esta página reúne os **diagramas de sequência leves** e os **feature cards iniciais** (planejamento). Os **diagramas formais** e os **feature cards finais** (pós-implementação, com status de cada critério) estão em [Features Entregues — Diagramas Formais](/iteracoes/iteracao-1/evidencias/diagrama-formal).

---

## O que é um Diagrama Leve?

Representação visual simplificada do fluxo de comunicação entre as entidades do sistema (Frontend, API, Banco de Dados, etc.), focando no **caminho feliz** sem cobrir cenários de erro. Renderizado em [Mermaid](https://mermaid.js.org/) diretamente na página — não é mais uma captura de tela.

## O que é um Feature Card?

Documenta uma funcionalidade de forma atômica: título, regras de negócio e critérios de aceitação (BDD — _Dado/Quando/Então_). A versão abaixo é a **inicial** (planejamento); a **final** (com status de cada critério) está em [Features Entregues](/iteracoes/iteracao-1/evidencias/diagrama-formal).

---

## Mapa de Dependências {#mapa-dependencias}

Artefato do TDR que mapeia o bloqueio lógico entre as features comprometidas na IT1 — usado para sequenciar o início das issues e verificar o DoR. Versão completa, com legenda, em [Mapa de Dependências — IT1](/backlog/dependencias#it1).

## Artefatos de Domain Modeling {#color-modeling}

### Glossário de Domínio {#glossario}

Artefato gerado a partir da **Domain Modeling** do FDD em reunião com os stakeholders Otávio e Vitor. Lista e explica palavras que devem ter significado explícito para o consenso do grupo.

**Figura 1** — Glossário de Palavras (parte 1)

![Glossário de Palavras — parte 1](../images/gloassario1.png)

_Fonte: Elaborado pelos autores._

**Figura 2** — Glossário de Palavras (parte 2)

![Glossário de Palavras — parte 2](../images/glossario2.png)

_Fonte: Elaborado pelos autores._

### Diagrama de Domínio {#diagrama-dominio}

**Figura 3** — Diagrama de Domínio

![Diagrama de Domínio](../images/diagrama_dominio.png)

_Fonte: Elaborado pelos autores._

---

## Diagramas Leves e Feature Cards por Feature {#feature-cards}

### CP5 — Painel de Gerenciamento do Administrador

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F09 — Autenticar administradores</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant U as Usuário
    participant SK as SvelteKit
    participant SA as Supabase Auth
    U->>SK: POST /admin/login (email, senha)
    SK->>SA: signInWithPassword()
    SA-->>SK: sessão JWT
    SK-->>U: redireciona para /admin/dashboard
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F09](../images/feature_card/featurecardF09.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F10 — Acessar painel administrativo</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant U as Usuário
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB
    U->>SK: GET /admin/dashboard
    SK->>EX: Authorization Bearer token
    EX->>DB: query (RLS por auth.uid)
    DB-->>EX: dados autorizados
    EX-->>SK: 200 OK
    SK-->>U: painel renderizado
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F10](../images/feature_card/featurecardF10.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F11 — Gerenciar membros da Crianex</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant O as Owner
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB
    O->>SK: cadastrar/editar/remover membro
    SK->>EX: requisição autenticada
    EX->>EX: requireRole owner
    EX->>DB: insert/update/delete em profiles
    DB-->>EX: ok
    EX-->>SK: 200
    SK-->>O: lista atualizada sem reload
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F11](../images/feature_card/featurecardF11.png)

</div>
</div>
</div>

### CP4 — Vitrine Pública de Produtos SaaS

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F12 — Gerenciar produtos SaaS</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant A as Admin
    participant EX as Express API
    participant DB as Supabase DB
    participant V as Vitrine
    A->>EX: cadastrar/editar/remover produto
    EX->>DB: persiste alteração (ACID)
    DB-->>EX: ok
    EX-->>A: lista atualizada
    V->>DB: GET produtos published true
    DB-->>V: catálogo público
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F12](../images/feature_card/feturecardF12.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F13 — Publicar / despublicar produto SaaS</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant A as Admin
    participant EX as Express API
    participant DB as Supabase DB
    participant V as Vitrine
    A->>EX: toggle publicar/despublicar
    EX->>DB: UPDATE products SET published
    DB-->>EX: ok
    EX-->>A: confirmação visual (<= 2s)
    V->>DB: vitrine reflete o novo estado
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F13](../images/feature_card/featurecardF13.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F14 — Formulário de contato</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant V as Visitante
    participant EX as Express API
    participant RL as Rate Limiter
    participant DB as Supabase DB
    V->>EX: POST /api/public/contact
    EX->>RL: verifica limite (5/IP/10min)
    RL-->>EX: permitido
    EX->>DB: INSERT lead (transação ACID)
    DB-->>EX: ok
    EX-->>V: alerta de sucesso
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F14](../images/feature_card/featurecardF14.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F15 — Página institucional</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant V as Visitante
    participant SK as SvelteKit SSR
    participant I18N as i18n JSON
    V->>SK: GET /sobre
    SK->>I18N: carrega conteúdo (pt/en)
    I18N-->>SK: missão, visão, valores
    SK-->>V: HTML com SEO/OG (<= 2s)
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F15](../images/feature_card/featurecardF15.png)

</div>
</div>
</div>

### CP6 — FAQ e Base de Conhecimentos por Produto

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F16 — CRUD de artigos de FAQ</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant A as Admin
    participant EX as Express API
    participant DB as Supabase DB
    A->>EX: cadastrar/editar/categorizar artigo
    EX->>EX: requireRole (RNF01)
    EX->>DB: insert/update em faq_articles
    DB-->>EX: ok (published false por padrão)
    EX-->>A: lista atualizada
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F16](../images/feature_card/featurecardF16.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F17 — Publicar / despublicar artigo de FAQ</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant A as Admin
    participant EX as Express API
    participant DB as Supabase DB
    participant V as Vitrine SSR
    A->>EX: toggle publicar/despublicar artigo
    EX->>DB: UPDATE faq_articles SET published
    DB-->>EX: ok (registro preservado)
    EX-->>A: confirmação sem reload
    V->>DB: SSR reflete o novo estado
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F17](../images/feature_card/featurecardF17.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F18 — Avaliação de artigos de FAQ</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama Leve</span>

```mermaid
sequenceDiagram
    participant V as Visitante
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB
    V->>SK: clica Útil / Não Útil
    SK->>EX: POST rating + session_hash
    EX->>DB: verifica dedup + INSERT (anônimo)
    DB-->>EX: ok
    EX-->>V: feedback visual (<= 2s)
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card (inicial — completo)</span>

![Feature Card inicial — F18](../images/feature_card/featurecardF18.png)

</div>
</div>
</div>

---

<details className="crianex-revisions">
<summary>Histórico de Revisão</summary>
<div className="crianex-revisions__body">

| Versão | Data       | Descrição                                                   | Autor(es)      |
| ------ | ---------- | ------------------------------------------------------------ | -------------- |
| 1.1    | 29/06/2026 | Adição do Mapa de Dependências da IT1 como artefato do TDR | Equipe Crianex |

</div>
</details>
