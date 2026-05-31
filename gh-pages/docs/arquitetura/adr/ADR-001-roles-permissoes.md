# ADR-001 — Modelo de Roles e Permissões

## Histórico de Revisão

| Versão | Data       | Descrição          | Autor   |
|--------|------------|--------------------|---------|
| v1.0   | 31/05/2026 | Criação inicial    | Bappoz  |

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

| Role     | Descrição                                         |
|----------|---------------------------------------------------|
| `owner`  | Acesso completo ao painel administrativo          |
| `member` | Acesso de leitura interno; sem acesso ao admin público |

Roles adicionais (ex: `viewer`, `support`) podem ser introduzidos sem quebrar a implementação atual — o middleware aceita qualquer string como parâmetro.

### Como o role é codificado no JWT

O role **não é codificado diretamente no JWT do Supabase**. O fluxo é:

1. O JWT emitido pelo Supabase Auth contém apenas o `sub` (UUID do usuário) e claims padrão do OpenID Connect.
2. O middleware `validateJWT` valida o JWT via `supabase.auth.getUser(token)` — delegando a verificação de assinatura ao Supabase.
3. Após validação, `loadAdminProfile` busca o campo `role` na tabela `public.profiles` usando o `id` do usuário.
4. O role resolvido é injetado em `response.locals.auth.user.role`.

Essa abordagem evita que o role seja forjável via payload do JWT e mantém o role como atributo do banco de dados, onde o RLS é soberano.

### Implementação do middleware

```
validateJWT  →  requireRole('owner')  →  handler
```

- **`validateJWT`** ([`backend/src/middleware/validate-jwt.ts`](../../../../backend/src/middleware/validate-jwt.ts)): valida o JWT e popula `response.locals.auth`. Retorna `401 { error: "Unauthorized" }` sem detalhes adicionais se o token estiver ausente ou inválido.
- **`requireRole(role)`** ([`backend/src/middleware/require-role.ts`](../../../../backend/src/middleware/require-role.ts)): lê `response.locals.auth.user.role` e retorna `403 { error: "Forbidden" }` se o role não coincidir. Não expõe qual role é esperado.

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
- Nenhum detalhe interno vaza em respostas de erro (401/403 sem body descritivo);
- RLS atua como segunda camada de defesa mesmo que o middleware seja bypassado;
- Extensível: adicionar `requireRole('member')` em rotas futuras sem nenhuma mudança estrutural.

### Trade-offs

- O role requer um round-trip ao banco a cada requisição autenticada (resolvido pela validação existente em `validateJWT` que já busca o profile);
- JWTs não carregam o role — necessário se o Supabase emitir tokens auto-suficientes no futuro.

---

## Alternativas Descartadas

| Alternativa | Motivo da rejeição |
|---|---|
| Codificar role no `app_metadata` do JWT | Requer privilégio de service-role para escrita; cria inconsistência entre JWT e banco após troca de role |
| Middleware único `requireAdminAuth` sem distinção de role | Não permite granularidade futura; foi o estado anterior, substituído por esta decisão |
| ABAC completo (Attribute-Based Access Control) | Over-engineering para o escopo atual (2 roles, ~10 rotas protegidas) |

---

## Rastreabilidade

| Artefato | Referência |
|---|---|
| Feature | F10 — Permitir acesso ao painel administrativo |
| Issue | #71 |
| CP | CP8 — Painel de gerenciamento de produtos SaaS (admin) |
| RNF | RNF07 (OWASP), RNF08 (RLS), RNF09 (autenticação) |
| RF | RF relacionados à autenticação e CRUD admin |
