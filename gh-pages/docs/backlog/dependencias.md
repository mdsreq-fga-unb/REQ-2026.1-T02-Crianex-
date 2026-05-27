# Mapa de Dependências

Rastreabilidade visual entre as features e sub-issues do projeto. Use este mapa para:

- Identificar o caminho crítico antes de iniciar uma issue
- Verificar se todos os bloqueantes de uma issue estão fechados (DoR)
- Planejar o que pode ser paralelizado

---

## Visão Geral — Features

Dependências entre as 10 features ativas. Cada nó é a issue pai de especificação.

```mermaid
graph LR
    classDef feat fill:#7f3fe5,color:#fff,stroke:#5a2ba8,font-weight:bold
    classDef ext  fill:#e71f84,color:#fff,stroke:#c01870

    EXT(["⚙ i18n SvelteKit"]):::ext

    F09["#54 · F09\nAutenticar admins"]:::feat
    F10["#57 · F10\nPainel admin"]:::feat
    F11["#58 · F11\nMembros"]:::feat
    F12["#55 · F12\nProdutos SaaS"]:::feat
    F13["#56 · F13\nPublicar produto"]:::feat
    F14["#61 · F14\nFormulário contato"]:::feat
    F15["#63 · F15\nInfo institucional"]:::feat
    F16["#59 · F16\nCRUD FAQ"]:::feat
    F17["#60 · F17\nPublicar FAQ"]:::feat
    F18["#62 · F18\nAvaliação FAQ"]:::feat

    F09 --> F10
    F09 --> F11
    F09 --> F12
    F09 --> F16
    F10 --> F11
    F10 --> F16
    F11 --> F16
    F12 --> F13
    F12 --> F14
    F15 --> F14
    F16 --> F17
    F16 --> F18
    F17 --> F18
    EXT --> F15
```

---

## Mapa Completo — Sub-issues

Cada bloco agrupa as sub-issues de uma feature. As setas mostram bloqueios diretos — dentro e entre features.

```mermaid
graph LR
    classDef sub fill:#f4f3f1,color:#060606,stroke:#d4d1cc,font-size:12px
    classDef ext fill:#e71f84,color:#fff,stroke:#c01870

    EXT(["⚙ i18n SvelteKit"]):::ext

    subgraph SG09["#54 · F09 — Autenticar admins"]
        n66["#66 Schema + Auth config"]:::sub
        n67["#67 Endpoints login / logout"]:::sub
        n68["#68 Tela de login"]:::sub
        n69["#69 Tela 2FA TOTP"]:::sub
        n70["#70 Guards SvelteKit"]:::sub
    end

    subgraph SG10["#57 · F10 — Painel admin"]
        n71["#71 Middleware + ADR roles"]:::sub
        n72["#72 Shell sidebar / topbar"]:::sub
        n73["#73 Nav state + placeholders"]:::sub
    end

    subgraph SG11["#58 · F11 — Membros"]
        n74["#74 Schema profiles + RLS"]:::sub
        n75["#75 CRUD membros (backend)"]:::sub
        n76["#76 Listagem membros (admin)"]:::sub
        n77["#77 Modal criação / edição"]:::sub
    end

    subgraph SG12["#55 · F12 — Produtos SaaS"]
        n78["#78 Schema produtos + Storage"]:::sub
        n79["#79 CRUD + reordenação"]:::sub
        n80["#80 Listagem + drag-and-drop"]:::sub
        n81["#81 Modal bilíngue"]:::sub
        n82["#82 SEO + sitemap + robots"]:::sub
    end

    subgraph SG13["#56 · F13 — Publicar produto"]
        n83["#83 Endpoint PATCH publicação"]:::sub
        n84["#84 Toggle publicação (UI)"]:::sub
    end

    subgraph SG14["#61 · F14 — Formulário contato"]
        n85["#85 Schema leads + LGPD"]:::sub
        n86["#86 Endpoint + rate limit"]:::sub
        n87["#87 Página contato (vitrine)"]:::sub
        n88["#88 Validação client-side"]:::sub
        n89["#89 Footer da vitrine"]:::sub
    end

    subgraph SG15["#63 · F15 — Info institucional"]
        n92["#92 Página About — SSR + i18n"]:::sub
        n93["#93 Animações + responsividade"]:::sub
    end

    subgraph SG16["#59 · F16 — CRUD FAQ"]
        n94["#94 Schema artigos + categorias"]:::sub
        n95["#95 CRUD backend"]:::sub
        n96["#96 Listagem FAQ (admin)"]:::sub
        n97["#97 Modal artigo bilíngue"]:::sub
    end

    subgraph SG17["#60 · F17 — Publicar FAQ"]
        n98["#98 Endpoint PATCH publicação"]:::sub
        n99["#99 Toggle publicação (UI)"]:::sub
    end

    subgraph SG18["#62 · F18 — Avaliação FAQ"]
        n100["#100 Schema ratings"]:::sub
        n101["#101 Endpoint + dedup"]:::sub
        n102["#102 Componente 'Foi útil?'"]:::sub
    end

    %% ── Intra-feature ────────────────────────
    n66 --> n67
    n66 --> n68
    n68 --> n69
    n67 --> n70
    n68 --> n70

    n72 --> n73

    n74 --> n75
    n75 --> n76
    n76 --> n77

    n78 --> n79
    n79 --> n80
    n80 --> n81
    n79 --> n82

    n83 --> n84

    n85 --> n86
    n86 --> n87
    n87 --> n88

    n92 --> n93

    n94 --> n95
    n95 --> n96
    n96 --> n97

    n98 --> n99

    n100 --> n101
    n101 --> n102

    %% ── Cross-feature ────────────────────────
    n66 --> n71
    n66 --> n72
    n66 --> n74
    n66 --> n78

    n71 --> n75
    n71 --> n79
    n71 --> n95

    n72 --> n76
    n72 --> n80
    n72 --> n96

    n78 --> n83
    n78 --> n94

    n79 --> n83
    n80 --> n84
    n80 --> n89

    EXT --> n92
    n92 --> n89

    n94 --> n100
    n95 --> n98
    n96 --> n99
    n98 --> n101
```

---

## Legenda

| Elemento                    | Significado                                                 |
| --------------------------- | ----------------------------------------------------------- |
| Bloco roxo (visão geral)    | Feature pai — issue de especificação da CP                  |
| Bloco claro (mapa completo) | Sub-issue de implementação                                  |
| Bloco rosa                  | Dependência externa ao backlog de issues                    |
| `→` seta sólida             | Bloqueio direto — destino não inicia antes da origem fechar |
