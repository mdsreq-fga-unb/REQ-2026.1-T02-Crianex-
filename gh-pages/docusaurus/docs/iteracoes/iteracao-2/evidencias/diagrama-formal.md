---
title: IT2 — Diagramas de Sequência Formais
sidebar_label: "Diagramas Formais (IT2)"
---

# IT2 — Diagramas de Sequência Formais

Para cada feature da **IT2 — Lead Capture**: o **diagrama de sequência formal** (Mermaid, renderizado na página) e o **feature card** correspondente. Os detalhes completos (critérios de aceite, evidências) ficam na página específica de cada feature.

:::info[Iteração em andamento]
A IT2 está **em andamento** — os diagramas formais refletem o design técnico acordado na Technical Design Review; o status de cada critério é acompanhado na página de cada feature.
:::

---

## CP1 — CRM Interno de Clientes

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F19 — Gerenciar clientes e leads no CRM</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama de Sequência Formal</span>

```mermaid
sequenceDiagram
    participant A as Admin
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB (RLS)

    Note over A,DB: Cadastrar lead (RF37)
    A->>SK: POST /admin/crm/clients { nome, contato }
    SK->>EX: POST /api/clients Authorization: Bearer
    EX->>EX: validateJWT + requireRole
    EX->>DB: INSERT clients + client_cards (coluna inicial)
    DB-->>EX: { card }
    EX-->>SK: 201
    SK-->>A: card criado na coluna inicial sem reload

    Note over A,DB: Editar dados do cliente/lead (RF35)
    A->>SK: PATCH /admin/crm/clients/:id
    SK->>EX: PATCH /api/clients/:id
    EX->>DB: UPDATE clients SET ... WHERE id = :id
    DB-->>EX: ok (sem duplicar registro)
    EX-->>SK: 200

    Note over A,DB: Mover card entre colunas (RF41 / RNF25)
    A->>SK: drag-and-drop card → nova coluna
    SK-->>A: atualização otimista imediata (≤ 1,5s)
    SK->>EX: PATCH /api/cards/:id { column_id }
    EX->>DB: UPDATE client_cards SET column_id
    DB-->>EX: ok
    EX-->>SK: 200

    Note over A,DB: Inativar cliente/lead (RF36 — soft-delete)
    A->>SK: PATCH /admin/crm/clients/:id { active: false }
    SK->>EX: PATCH /api/clients/:id/inactivate
    EX->>DB: UPDATE clients SET active = false (preserva registro)
    DB-->>EX: ok
    EX-->>SK: 200
    SK-->>A: card sai do fluxo ativo (não excluído)
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card</span>

**RFs:** RF35, RF36, RF37, RF41 · **Detalhes:** [F19](/iteracoes/iteracao-2/features/f19)

![Feature Card — F19](../images/featurecard19.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F20 — Gerenciar colunas do funil</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama de Sequência Formal</span>

```mermaid
sequenceDiagram
    participant A as Admin
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB (RLS)

    Note over A,DB: Adicionar coluna (RF38)
    A->>SK: POST /admin/crm/columns { nome }
    SK->>EX: POST /api/columns Authorization: Bearer
    EX->>EX: valida nome (não vazio/duplicado)
    EX->>DB: INSERT INTO crm_columns
    DB-->>EX: { column }
    EX-->>SK: 201
    SK-->>A: nova coluna no board

    Note over A,DB: Editar / reordenar coluna (RF40 / RNF22)
    A->>SK: renomeia ou arrasta coluna
    SK->>EX: PATCH /api/columns/:id { nome | ordem }
    EX->>DB: UPDATE crm_columns
    DB-->>EX: ok
    EX-->>SK: 200 (reflexo ≤ 1,5s)

    Note over A,DB: Remover coluna (RF39 — invariante de board)
    A->>SK: DELETE coluna
    SK->>EX: DELETE /api/columns/:id
    EX->>EX: verifica coluna padrão / com cards
    alt coluna vazia e não-padrão
        EX->>DB: DELETE FROM crm_columns WHERE id = :id
        DB-->>EX: ok
        EX-->>SK: 200
    else coluna com cards ou padrão
        EX-->>SK: 409 (exige realocação — board não vazio)
        SK-->>A: remoção bloqueada
    end
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card</span>

**RFs:** RF38, RF39, RF40 · **Detalhes:** [F20](/iteracoes/iteracao-2/features/f20)

![Feature Card — F20](../images/featurecard20.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F21 — Registrar interações comerciais</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama de Sequência Formal</span>

```mermaid
sequenceDiagram
    participant A as Admin
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB (RLS)

    Note over A,DB: Adicionar interação (RF42)
    A->>SK: abre card → nova interação { tipo, conteúdo }
    SK->>EX: POST /api/cards/:id/interactions
    EX->>EX: valida tipo/conteúdo
    EX->>DB: INSERT INTO interactions (timestamp, tipo)
    DB-->>EX: { interaction }
    EX-->>SK: 201
    SK-->>A: interação na timeline do card

    Note over A,DB: Editar interação (RF59)
    A->>SK: edita interação
    SK->>EX: PATCH /api/interactions/:id
    EX->>DB: UPDATE interactions SET ... (sem duplicar)
    DB-->>EX: ok
    EX-->>SK: 200

    Note over A,DB: Remover interação (RF53 — hard-delete)
    A->>SK: remove interação (confirma)
    SK->>EX: DELETE /api/interactions/:id
    EX->>DB: DELETE FROM interactions WHERE id = :id
    DB-->>EX: ok (exclusão permanente)
    EX-->>SK: 200
    SK-->>A: interação removida do histórico
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card</span>

**RFs:** RF42, RF53, RF59 · **Detalhes:** [F21](/iteracoes/iteracao-2/features/f21)

![Feature Card — F21](../images/featurecard21.png)

</div>
</div>
</div>

---

## CP9 — Sistema de Notificações no Sistema

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F07 — Acompanhar histórico e status de notificações</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama de Sequência Formal</span>

```mermaid
sequenceDiagram
    participant A as Admin
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB (RLS)

    Note over A,DB: Listar histórico (RF46)
    A->>SK: abre central de notificações
    SK->>EX: GET /api/notifications
    EX->>DB: SELECT notifications (RLS) ORDER BY created_at DESC
    DB-->>EX: lista + contador de não lidas
    EX-->>SK: 200 (≤ 2s)
    SK-->>A: histórico ordenado + contador

    Note over A,DB: Marcar como lida (RF47)
    A->>SK: clica notificação não lida
    SK-->>A: atualização otimista (contador decrementa)
    SK->>EX: PATCH /api/notifications/:id/read
    EX->>DB: UPDATE notifications SET read = true
    DB-->>EX: ok
    EX-->>SK: 200

    Note over A,DB: Acesso sem permissão
    A->>EX: GET /api/notifications (sem token)
    EX-->>SK: 401/403 (RLS bloqueia)
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card</span>

**RFs:** RF46, RF47 · **Detalhes:** [F07](/iteracoes/iteracao-2/features/f07)

![Feature Card — F07](../images/featurecard07.png)

</div>
</div>
</div>

<div className="crianex-feature-evidence">
<div className="crianex-feature-evidence__header"><strong>F08 — Gerenciar templates de notificações</strong></div>
<div className="crianex-feature-evidence__body">
<div className="crianex-feature-evidence__diagram">
<span className="crianex-feature-evidence__label">Diagrama de Sequência Formal</span>

```mermaid
sequenceDiagram
    participant A as Admin
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB (RLS)

    Note over A,DB: Adicionar template (RF15)
    A->>SK: cria template { evento, conteúdo }
    SK->>EX: POST /api/notification-templates
    EX->>EX: valida campos + unicidade por evento
    EX->>DB: INSERT INTO notification_templates
    DB-->>EX: { template }
    EX-->>SK: 201

    Note over A,DB: Editar template (RF56)
    A->>SK: edita template
    SK->>EX: PATCH /api/notification-templates/:id
    EX->>DB: UPDATE notification_templates (sem duplicar)
    DB-->>EX: ok
    EX-->>SK: 200

    Note over A,DB: Remover template (RF57 — fallback)
    A->>SK: remove template (confirma)
    SK->>EX: DELETE /api/notification-templates/:id
    EX->>DB: DELETE FROM notification_templates WHERE id = :id
    DB-->>EX: ok
    EX-->>SK: 200
    Note right of DB: novos disparos do evento usam o template padrão de fallback
```

</div>
<div className="crianex-feature-evidence__card">
<span className="crianex-feature-evidence__label">Feature Card</span>

**RFs:** RF15, RF56, RF57 · **Detalhes:** [F08](/iteracoes/iteracao-2/features/f08)

![Feature Card — F08](../images/featurecard08.png)

</div>
</div>
</div>

---
