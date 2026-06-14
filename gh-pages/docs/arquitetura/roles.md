# ADR-001 — Modelo de Roles e Permissões

## Histórico de Revisão

| Versão | Data       | Descrição                                                                                                              | Autor |
| ------ | ---------- | ---------------------------------------------------------------------------------------------------------------------- | ----- |
| v1.0   | 31/05/2026 | Criação inicial                                                                                                        | Lucas |
| v1.1   | 14/06/2026 | Atualização para refletir implementação real: cookie dual-name, lookup por email, `requirePermission`, bypass de teste | Lucas |

---

## Status

**Aceito**

---

## Contexto

O Crianex Hub possui duas superfícies distintas: uma vitrine pública (sem autenticação) e uma área administrativa protegida. É necessário um modelo de controle de acesso que:

- Bloqueie toda mutação de dados administrativos para usuários não autenticados;
- Permita granularidade futura sem refatoração estrutural;
- Seja auditável e testável de forma isolada;
- Não vaze informações de estrutura interna em respostas de erro (requisito OWASP — RNF07).

---

## Decisão

### Roles disponíveis

| Role     | Descrição                                                                         |
| -------- | --------------------------------------------------------------------------------- |
| `owner`  | Acesso completo ao painel administrativo; bypass implícito em `requirePermission` |
| `member` | Acesso granular definido pela coluna `permissions` em `public.profiles`           |

Roles adicionais (ex: `viewer`, `support`) podem ser introduzidos sem quebrar a implementação atual — o middleware `requireRole` aceita qualquer string como parâmetro. Contudo, apenas `owner` e `member` são reconhecidos como roles administrativos válidos (`ADMIN_ROLES`); qualquer outro valor resolve em 403 na fase de `loadAdminProfile`.

### Como o role é codificado no JWT

O role **não é codificado diretamente no JWT do Supabase**. O fluxo é:

1. O JWT emitido pelo Supabase Auth contém apenas o `sub` (UUID do usuário) e claims padrão do OpenID Connect.
2. O middleware `validateJWT` extrai o access token da requisição (ver seção abaixo) e valida-o via `GET /auth/v1/user` da API REST do Supabase — delegando a verificação de assinatura ao Supabase.
3. Após validação, `loadAdminProfile` busca o campo `role` e `status` na tabela `public.profiles` usando o `id` do usuário. Se não encontrar (ou o status não for `active`), faz um segundo lookup por `email` como fallback.
4. O role resolvido é injetado em `response.locals.auth.user.role`.

Essa abordagem evita que o role seja forjável via payload do JWT e mantém o role como atributo do banco de dados, onde o RLS é soberano.

### Extração do token de acesso

`validateJWT` aceita o token de duas fontes, nesta ordem de precedência:

1. **Header `Authorization: Bearer <token>`** — fluxo padrão para chamadas de API;
2. **Cookie** — aceita dois nomes alternativos:
   - `crianex_admin_access_token` — cookie gravado pelo fluxo de login via SvelteKit (browser);
   - `access_token` — cookie gravado pela rota de auth direta do backend (acesso via API).

### Lookup de perfil e guarda de status

`loadAdminProfile` ([`backend/src/auth/auth.service.ts`](../../../../backend/src/auth/auth.service.ts)) aplica a seguinte lógica:

1. Busca o perfil por `id = userId` em `public.profiles`;
2. Se encontrado **e** `status = 'active'`, valida que `role` pertence a `ADMIN_ROLES = {'owner', 'member'}` — caso contrário, retorna 403;
3. Se não encontrado ou `status ≠ 'active'`, faz um segundo lookup por `email` (normalizado para minúsculas);
4. Se ainda assim ausente ou inativo, retorna 403 sem expor detalhes;
5. `normalizeRole` retorna `'member'` como padrão para valores nulos ou vazios.

### Implementação dos middlewares

**Fluxo padrão (rotas de owner):**

```
validateJWT  →  requireRole('owner')  →  handler
```

**Fluxo com permissão granular (rotas de member):**

```
validateJWT  →  requirePermission(module, action)  →  handler
```

- **`validateJWT`** ([`backend/src/middleware/validate-jwt.ts`](../../../../backend/src/middleware/validate-jwt.ts)): valida o token (Bearer ou cookie) e popula `response.locals.auth`. Retorna `401 { error: "Unauthorized" }` sem detalhes adicionais se o token estiver ausente ou inválido. Em ambiente não-produtivo, aceita o escape hatch `ADMIN_AUTH_BYPASS=true` (ver abaixo).
- **`requireRole(role)`** ([`backend/src/middleware/require-role.ts`](../../../../backend/src/middleware/require-role.ts)): lê `response.locals.auth.user.role` e retorna `403 { error: "Forbidden" }` se o role não coincidir. Não expõe qual role é esperado.
- **`requirePermission(module, action)`** ([`backend/src/middleware/require-permission.ts`](../../../../backend/src/middleware/require-permission.ts)): permite acesso direto a `owner`; para `member`, consulta a coluna `permissions` (JSONB `Record<string, string[]>`) em `public.profiles` e verifica se `permissions[module]` contém `action`. Ações suportadas: `'v'` (view), `'e'` (edit), `'a'` (admin). Retorna `403 { error: "Forbidden", module, action }` em caso de recusa — este body expõe `module` e `action`, aceitável por ser um endpoint autenticado.

### Escape hatch de teste

`validateJWT` possui um bypass de autenticação para testes de integração:

```
ADMIN_AUTH_BYPASS=true  +  NODE_ENV ≠ 'production'
→ injeta { id: 'bypass', name: 'Bypass', role: 'owner' } sem chamar o Supabase
```

A combinação das duas condições é hard-disabled em produção, prevenindo que uma variável de ambiente mal configurada conceda acesso administrativo inautenticado.

### Como o RLS do Supabase referencia o role

O RLS usa a função auxiliar `public.is_owner(user_id uuid)` (definida com `SECURITY DEFINER` para evitar recursão):

```sql
create or replace function public.is_owner(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'owner'
  );
$$;
```

Policies que dependem de role referenciam esta função. Queries client-side sem token válido retornam **zero rows** (comportamento RLS padrão para `anon`) — não um erro 403 — o que evita enumeração de recursos.

---

## Consequências

### Positivas

- Role check isolado em middleware testável independentemente;
- `requirePermission` permite acesso granular sem novo middleware por rota;
- Nenhum detalhe interno vaza em respostas de erro de `requireRole` (401/403 sem body descritivo);
- RLS atua como segunda camada de defesa mesmo que o middleware seja bypassado;
- Extensível: adicionar `requireRole('member')` ou `requirePermission('novo-modulo', 'v')` sem mudança estrutural;
- Lookup por email como fallback garante retrocompatibilidade para perfis criados antes da sincronização de UUIDs.

### Trade-offs

- O role requer um round-trip ao banco a cada requisição autenticada;
- `requirePermission` faz um segundo round-trip ao banco para membros (owner é short-circuited);
- O body de 403 de `requirePermission` expõe `module` e `action` — aceitável em endpoints autenticados, mas diverge do comportamento de `requireRole`;
- JWTs não carregam o role — necessário se o Supabase emitir tokens auto-suficientes no futuro.

---

## Alternativas Descartadas

| Alternativa                                               | Motivo da rejeição                                                                                       |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Codificar role no `app_metadata` do JWT                   | Requer privilégio de service-role para escrita; cria inconsistência entre JWT e banco após troca de role |
| Middleware único `requireAdminAuth` sem distinção de role | Não permite granularidade futura; foi o estado anterior, substituído por esta decisão                    |
| ABAC completo (Attribute-Based Access Control)            | Over-engineering para o escopo atual; `requirePermission` entrega granularidade suficiente               |

---

## Rastreabilidade

| Artefato | Referência                                       |
| -------- | ------------------------------------------------ |
| Feature  | F10 — Permitir acesso ao painel administrativo   |
| Issue    | #71                                              |
| CP       | CP5 — Painel de gerenciamento do administrador   |
| RNF      | RNF07 (OWASP), RNF08 (RLS), RNF09 (autenticação) |
| RF       | RF relacionados à autenticação e CRUD admin      |
