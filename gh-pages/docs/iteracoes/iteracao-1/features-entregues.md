# IT1 — Features Entregues

## Histórico de Revisão

| Versão | Data       | Descrição                                  | Autor(es) |
| ------ | ---------- | ------------------------------------------ | --------- |
| 1.0    | 06/06/2026 | Criação do documento                       | Lucas Z.  |
| 1.1    | 06/06/2026 | Adicionei os diagramas de sequência formal | Lucas Z.  |

---

Registro das features entregues na IT1 — Vitrine Pública (28/04 – 25/05). Para cada feature estão reservados espaços para evidências de funcionamento, validação do cliente e rastreabilidade de PRs/issues.

---

## CP5 — Painel de Gerenciamento do Administrador

### F09 — Autenticar administradores

> **Issues:** [#54](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/54)  
> **RFs cobertos:** RF08, RF09  
> **RNFs cobertos:** RNF01, RNF03

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant U as Usuário
    participant SK as SvelteKit
    participant SA as Supabase Auth
    participant CK as Cookie httpOnly

    Note over U,CK: Cenário 1 — Login com credenciais válidas
    U->>SK: POST /admin/login { email, senha }
    SK->>SA: signInWithPassword({ email, password })
    SA-->>SK: { access_token, refresh_token, user }
    SK->>CK: Set-Cookie: sb-access-token (httpOnly, Secure, SameSite=Strict)
    SK-->>U: 302 → /admin/dashboard

    Note over U,CK: Cenário 2 — Credenciais inválidas
    U->>SK: POST /admin/login { email, senha errada }
    SK->>SA: signInWithPassword(...)
    SA-->>SK: 401 AuthApiError
    SK-->>U: mensagem genérica de erro (sem detalhes internos)

    Note over U,CK: Cenário 3 — Logout
    U->>SK: POST /admin/logout
    SK->>SA: signOut()
    SA-->>SK: ok
    SK->>CK: clear sb-access-token
    SK-->>U: 302 → /admin/login
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                                              | RF / RNF     | Status |
| ------------------------------------------------------------------------------------------- | ------------ | ------ |
| Login com credenciais válidas → Supabase Auth gera sessão JWT → redirect `/admin/dashboard` | RF08         | ✅     |
| MFA ativo → código TOTP solicitado antes de emitir sessão                                   | RF08 · RNF08 | ✅     |
| Credenciais inválidas → 401 + mensagem genérica sem expor detalhes internos                 | RF08         | ✅     |
| Logout → `signOut()` + invalida `refresh_token` + limpa cookie + redirect `/admin/login`    | RF09         | ✅     |
| Acesso a `/admin` sem sessão → redirect `/admin/login` sem renderizar dados do painel       | RF09 · RNF01 | ✅     |
| Tempo de autenticação ≤ 2s                                                                  | RNF03        | ✅     |

#### Evidências de Funcionamento

**Tela de Login**

![Página de login com campos de e-mail e senha](./images/F09.1.png)

---

**Autenticação de Dois Fatores (2FA)**

Após inserir as credenciais, o usuário escaneia o QR Code no aplicativo autenticador e digita o código TOTP gerado.

![QR Code exibido para configuração do 2FA](./images/F09.2.png)

![Tela de inserção do código 2FA](./images/F09.3.png)

---

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ✅        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### Observações

- Sessão gerenciada inteiramente pelo Supabase Auth; token armazenado em cookie `httpOnly` (não `localStorage`) para mitigar XSS.
- Erro 401 retorna mensagem genérica intencionalmente — não diferencia "e-mail inexistente" de "senha errada", prevenindo enumeração de usuários.
- MFA via TOTP (RFC 6238): o QR Code é gerado pelo Supabase Auth SDK no cliente e não trafega pelo backend da aplicação.

---

### F10 — Acessar painel administrativo

> **Issues:** [#57](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/57)  
> **RFs cobertos:** RF10  
> **RNFs cobertos:** RNF01, RNF03, RNF09

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant U as Usuário
    participant SK as SvelteKit
    participant CK as Cookie httpOnly
    participant SA as Supabase Auth
    participant EX as Express API
    participant DB as Supabase DB

    Note over U,DB: Cenário 1 — JWT válido com role owner
    U->>SK: GET /admin/dashboard
    SK->>CK: lê sb-access-token
    CK-->>SK: access_token
    SK->>EX: GET /api/dashboard Authorization: Bearer <access_token>
    EX->>SA: verifyToken(access_token)
    SA-->>EX: { user, role }
    EX->>DB: query (RLS filtra por auth.uid() + auth.role())
    DB-->>EX: dados autorizados (JSON)
    EX-->>SK: 200 { dados protegidos }
    SK-->>U: painel renderizado

    Note over U,DB: Cenário 2 — JWT expirado
    U->>SK: GET /admin/dashboard
    SK->>CK: lê sb-access-token (expirado)
    SK->>SA: refreshSession(refresh_token)
    alt refresh bem-sucedido
        SA-->>SK: novo access_token
        SK->>CK: atualiza cookie
        SK->>EX: GET /api/dashboard (novo token)
        EX-->>SK: 200 dados
        SK-->>U: painel renderizado
    else refresh falhou
        SA-->>SK: erro de refresh
        SK->>CK: clear cookie
        SK-->>U: 302 → /admin/login
    end

    Note over U,DB: Cenário 3 — Sem role owner
    U->>EX: GET /api/dashboard (token sem role owner)
    EX->>SA: verifyToken(access_token)
    SA-->>EX: { user, role: 'member' }
    EX-->>SK: 403 Forbidden
    SK-->>U: 302 → /admin/login (sem renderizar dados)
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                                                              | RF / RNF     | Status |
| ----------------------------------------------------------------------------------------------------------- | ------------ | ------ |
| JWT válido com `role = owner` → RLS filtra por `auth.uid()` + `auth.role()` → painel renderizado sem reload | RF10 · RNF09 | ⬜     |
| JWT expirado → `refreshSession()` tentado; se falhar, redirect `/admin/login` sem renderizar dados          | RF10         | ⬜     |
| Token inválido ou sem `role = owner` → 401/403 + redirect `/admin/login` sem expor estrutura                | RF10 · RNF01 | ⬜     |
| Operação no painel → resposta entregue em ≤ 2s em condições normais                                         | RNF03        | ⬜     |

#### Evidências de Funcionamento

_Evidências a serem adicionadas._

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ⬜        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### PRs Vinculadas

_A preencher._

#### Observações

- RLS do Supabase opera como segunda camada de autorização; validação de `role = owner` no Express é a primeira — defesa em profundidade intencional.
- O refresh automático de token é tratado no hook `+layout.server.ts` do SvelteKit, transparente ao usuário.
- Redirecionamento ao expirar a sessão ocorre sem flash de conteúdo protegido: o guard corre no servidor antes de qualquer renderização.

---

### F11 — Gerenciar membros da Crianex

> **Issues:** [#58](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/58)  
> **RFs cobertos:** RF11, RF12, RF13, RF14  
> **RNFs cobertos:** RNF03, RNF09

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant O as Owner (Admin)
    participant SK as SvelteKit
    participant EX as Express API
    participant SA as Supabase Auth
    participant DB as Supabase DB

    Note over O,DB: Cadastrar novo membro
    O->>SK: POST /admin/members { nome, email, role }
    SK->>EX: POST /api/members Authorization: Bearer <token>
    EX->>EX: validateJWT + requireRole('owner')
    EX->>SA: admin.createUser({ email, password })
    SA-->>EX: { user_id }
    EX->>DB: INSERT INTO profiles (user_id, nome, role, active=true)
    DB-->>EX: { profile }
    EX-->>SK: 201 { novo membro }
    SK-->>O: lista atualizada sem reload

    Note over O,DB: Inativar membro (RF13)
    O->>SK: PATCH /admin/members/:id { active: false }
    SK->>EX: PATCH /api/members/:id Authorization: Bearer
    EX->>EX: validateJWT + requireRole('owner')
    EX->>EX: verifica uid ≠ target (bloqueia auto-inativação)
    EX->>DB: UPDATE profiles SET active = false WHERE id = :id
    DB-->>EX: ok
    EX-->>SK: 200
    SK-->>O: status atualizado sem reload

    Note over O,DB: Remover membro (RF14)
    O->>SK: DELETE /admin/members/:id
    SK->>EX: DELETE /api/members/:id Authorization: Bearer
    EX->>EX: validateJWT + requireRole('owner')
    EX->>EX: verifica uid ≠ target (bloqueia auto-remoção)
    EX->>DB: DELETE FROM profiles WHERE id = :id
    EX->>SA: admin.deleteUser(user_id)
    SA-->>EX: ok
    EX-->>SK: 200
    SK-->>O: lista atualizada sem reload

    Note over O,DB: Tentativa sem role owner
    O->>EX: POST /api/members (token sem role owner)
    EX->>EX: requireRole falha
    EX-->>SK: 403 Forbidden
    SK-->>O: operação bloqueada (nenhuma alteração no banco)
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                                                   | RF / RNF     | Status |
| ------------------------------------------------------------------------------------------------ | ------------ | ------ |
| Owner cadastra novo membro → `createUser()` + insert em `profiles` → lista atualizada sem reload | RF12         | ⬜     |
| Email duplicado → erro informativo sem criar registro duplicado                                  | RF12         | ⬜     |
| Owner edita dados de membro → RLS valida `role = owner` → persiste sem reload                    | RF11 · RNF09 | ⬜     |
| Edição sem `role = owner` → bloqueio 403 pelo RLS sem persistir nada                             | RF11 · RNF09 | ⬜     |
| Owner inativa membro → `active = false` + lista atualizada sem reload                            | RF13         | ⬜     |
| Owner tenta inativar a própria conta → operação bloqueada com mensagem de erro                   | RF13         | ⬜     |
| Owner remove membro → `deleteUser()` + remoção de `profiles` → lista atualizada sem reload       | RF14         | ⬜     |
| Owner tenta remover a própria conta → bloqueado (ao menos um owner ativo garantido)              | RF14         | ⬜     |

#### Evidências de Funcionamento

_Evidências a serem adicionadas._

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ⬜        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### PRs Vinculadas

_A preencher._

#### Observações

- Criação de usuário usa `supabase.auth.admin.createUser()` com service role — senha inicial gerada aleatoriamente e enviada por e-mail pelo Supabase.
- A proteção contra auto-inativação/auto-remoção compara o `uid` do token com o `id` alvo na camada Express, evitando lockout acidental do único owner.
- Deleção remove o registro em `profiles` e em seguida chama `admin.deleteUser()` — operação irreversível; soft-delete via `active = false` está disponível para desativação temporária.

---

## CP4 — Vitrine Pública de Produtos SaaS

### F12 — Exibir catálogo de produtos SaaS

> **Issues:** [#55](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/55)  
> **RFs cobertos:** RF21, RF22, RF23  
> **RNFs cobertos:** RNF02, RNF06, RNF21

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant A as Admin
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB
    participant V as Vitrine Pública

    Note over A,V: Cadastrar produto (RF21)
    A->>SK: POST /admin/products { nome, descrição, diferenciais }
    SK->>EX: POST /api/products Authorization: Bearer <token>
    EX->>EX: validateJWT + requireRole
    EX->>DB: INSERT INTO products (nome, descricao, published=false) — ACID
    DB-->>EX: { product }
    EX-->>SK: 201 { produto criado }
    SK-->>A: lista atualizada sem reload

    Note over A,V: Editar produto (RF22)
    A->>SK: PUT /admin/products/:id { campos atualizados }
    SK->>EX: PUT /api/products/:id Authorization: Bearer
    EX->>EX: validateJWT + requireRole
    EX->>DB: UPDATE products SET ... WHERE id = :id
    DB-->>EX: { produto atualizado }
    EX-->>SK: 200
    SK-->>A: dados atualizados na lista

    Note over A,V: Remover produto (RF23)
    A->>SK: DELETE /admin/products/:id
    SK->>EX: DELETE /api/products/:id Authorization: Bearer
    EX->>EX: validateJWT + requireRole
    EX->>DB: DELETE FROM products WHERE id = :id
    DB-->>EX: ok
    EX-->>SK: 200
    SK-->>A: produto removido da lista

    Note over A,V: Visitante acessa vitrine (RNF02 ≤ 2s)
    V->>EX: GET /api/products?published=true
    EX->>DB: SELECT * FROM products WHERE published = true
    DB-->>EX: lista de produtos
    EX-->>V: 200 JSON (≤ 2s — RNF02)

    Note over A,V: Tentativa sem autorização
    A->>EX: PUT /api/products/:id (token inválido)
    EX->>EX: validateJWT falha
    EX-->>A: 401 Unauthorized
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                                 | RF / RNF        | Status |
| ------------------------------------------------------------------------------ | --------------- | ------ |
| Admin cadastra produto → persistido em transação ACID → apto para publicação   | RF21 · RNF06    | ⬜     |
| Admin edita produto → dados substituídos no banco sem intervenção de dev       | RF22            | ⬜     |
| Admin remove produto → excluído do catálogo e ausente na vitrine imediatamente | RF23            | ⬜     |
| Requisição sem autorização → 401/403 sem executar operação no banco            | RF21–23 · RNF01 | ⬜     |
| Vitrine pública renderiza via SSR → apenas `published = true` em ≤ 2s sem JS   | RNF02 · RNF21   | ⬜     |
| Falha no banco → ROLLBACK completo sem registro parcial                        | RNF06           | ⬜     |

#### Evidências de Funcionamento

_Evidências a serem adicionadas._

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ⬜        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### PRs Vinculadas

_A preencher._

#### Observações

- A vitrine usa SSR via `load()` em `+page.server.ts` do SvelteKit — nenhum JS necessário no cliente para renderizar os cards de produto.
- O campo `published` filtra em nível de query; RLS não restringe leitura pública de produtos, apenas escrita/atualização (sem autenticação para visualizar).
- Upload de assets (imagens dos produtos) não estava no escopo desta feature — tratado como extensão futura do painel admin.

---

### F13 — Publicar / despublicar produto SaaS

> **Issues:** [#56](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/56)  
> **RFs cobertos:** RF25, RF59  
> **RNFs cobertos:** RNF03

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant A as Admin
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB
    participant V as Vitrine Pública

    Note over A,V: Publicar produto (RF25)
    A->>SK: toggle ON → PATCH /admin/products/:id/status
    SK-->>A: loading state imediato
    SK->>EX: PATCH /api/products/:id/status { published: true } Authorization: Bearer
    EX->>EX: validateJWT + requireRole
    EX->>DB: UPDATE products SET published = true WHERE id = :id
    DB-->>EX: ok
    EX-->>SK: 200 { published: true }
    SK-->>A: toggle confirmado (≤ 2s — RNF03)
    V->>DB: GET products WHERE published = true
    DB-->>V: produto agora incluso na vitrine

    Note over A,V: Despublicar produto (RF59)
    A->>SK: toggle OFF → PATCH /admin/products/:id/status
    SK->>EX: PATCH /api/products/:id/status { published: false } Authorization: Bearer
    EX->>EX: validateJWT + requireRole
    EX->>DB: UPDATE products SET published = false WHERE id = :id
    DB-->>EX: ok (dados preservados no banco)
    EX-->>SK: 200 { published: false }
    SK-->>A: toggle desativado (≤ 2s — RNF03)
    V->>DB: GET products WHERE published = true
    DB-->>V: produto ausente na vitrine

    Note over A,V: Tentativa sem permissão
    A->>EX: PATCH /api/products/:id/status (token inválido)
    EX->>EX: validateJWT falha
    EX-->>SK: 403 Forbidden
    SK-->>A: toggle revertido ao estado original + mensagem de erro
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                                                 | RF / RNF     | Status |
| ---------------------------------------------------------------------------------------------- | ------------ | ------ |
| Admin aciona toggle para publicar → `published = true` + confirmação visual em ≤ 2s            | RF25 · RNF03 | ⬜     |
| Admin aciona toggle para despublicar → produto ocultado da vitrine, dados preservados no banco | RF59 · RNF03 | ⬜     |
| Credenciais inválidas no toggle → API rejeita → toggle revertido + mensagem de erro            | RF25 · RF59  | ⬜     |

#### Evidências de Funcionamento

_Evidências a serem adicionadas._

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ⬜        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### PRs Vinculadas

_A preencher._

#### Observações

- Toggle implementado com atualização otimista no cliente: estado muda imediatamente na UI e é revertido em caso de erro da API.
- Operação é um `PATCH` de flag booleana — sem transação multi-tabela, portanto sem risco de estado parcial no banco.
- Decisão de escopo: despublicar preserva todos os dados e mídias do produto; remoção permanente é ação separada (RF23) para evitar perda acidental.

---

### F14 — Formulário de contato

> **Issues:** [#61](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/61)  
> **RFs cobertos:** RF27  
> **RNFs cobertos:** RNF06, RNF10

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant V as Visitante
    participant SK as SvelteKit
    participant EX as Express API
    participant RL as Rate Limiter
    participant DB as Supabase DB

    Note over V,DB: Envio válido do formulário (RF27)
    V->>SK: clica "Enviar" { nome, email, mensagem }
    SK->>EX: POST /api/public/contact { payload }
    EX->>RL: verifica limite (5 req / IP / 10 min — RNF10)
    RL-->>EX: permitido
    EX->>EX: valida campos obrigatórios
    EX->>DB: BEGIN — INSERT INTO leads (nome, email, mensagem) — COMMIT (ACID — RNF06)
    DB-->>EX: ok
    EX-->>SK: 200 { success: true }
    SK-->>V: alerta visual de sucesso (≤ 2s — RNF02)

    Note over V,DB: Rate limit excedido (spam / bot — RNF10)
    V->>SK: POST (além do limite)
    SK->>EX: POST /api/public/contact
    EX->>RL: verifica limite
    RL-->>EX: bloqueado (429)
    EX-->>SK: 429 Too Many Requests
    SK-->>V: "Tente novamente mais tarde"

    Note over V,DB: Falha no banco — rollback (RNF06)
    V->>SK: POST { payload válido }
    SK->>EX: POST /api/public/contact
    EX->>RL: permitido
    EX->>DB: BEGIN — INSERT INTO leads
    DB-->>EX: erro inesperado
    EX->>DB: ROLLBACK
    EX-->>SK: 500
    SK-->>V: mensagem de erro (registro não salvo)
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                               | RF / RNF             | Status |
| ---------------------------------------------------------------------------- | -------------------- | ------ |
| Formulário válido → persistido em transação ACID → alerta de sucesso em ≤ 2s | RF27 · RNF02 · RNF06 | ⬜     |
| Rate limit excedido (5 req/IP/10min) → 429 + "Tente novamente mais tarde"    | RNF10                | ⬜     |
| Falha no banco → ROLLBACK completo sem registro parcial                      | RNF06                | ⬜     |

#### Evidências de Funcionamento

_Evidências a serem adicionadas._

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ⬜        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### PRs Vinculadas

_A preencher._

#### Observações

- Rate limit de 5 req/IP/10min implementado via `express-rate-limit` como middleware, antes de qualquer validação de payload — bloqueia bots antes de tocar no banco.
- Campos opcionais (telefone, empresa) não incluídos no MVP — escopo deliberadamente mínimo para IT1.
- Leads salvos na tabela `leads` sem vínculo com contas de usuário; integração com o CRM (CP1) está prevista para IT2.

---

### F15 — Página institucional (Sobre a Crianex)

> **Issues:** [#63](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/63)  
> **RFs cobertos:** RF28  
> **RNFs cobertos:** RNF02, RNF21

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant V as Visitante / Bot indexador
    participant SK as SvelteKit (SSR)
    participant I18N as i18n JSON (pt / en)

    Note over V,I18N: Acesso à página institucional — SSR (RF28, RNF04)
    V->>SK: GET /sobre
    SK->>SK: nenhum guard intercepta (rota pública — RNF20)
    SK->>I18N: carrega src/lib/i18n/pt/about.json
    I18N-->>SK: { titulo, descricao, missao, valores, ... }
    SK-->>V: HTML completo com h1, OG tags e metadados SEO (≤ 2s — RNF02)
    Note right of V: conteúdo já no HTML inicial — indexável sem JS (RNF21)

    Note over V,I18N: Troca de idioma PT → EN (RNF13)
    V->>SK: clica "EN" no header
    SK->>I18N: carrega src/lib/i18n/en/about.json
    I18N-->>SK: { title, description, mission, values, ... }
    SK-->>V: textos substituídos reativamente (sem reload — ≤ 1 clique)

    Note over V,I18N: Bot de indexação
    V->>SK: GET /sobre (User-Agent: Googlebot)
    SK->>I18N: carrega about.json (pt)
    SK-->>V: HTML com metadados Open Graph preenchidos para locale PT
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                                           | RF / RNF             | Status |
| ---------------------------------------------------------------------------------------- | -------------------- | ------ |
| Visitante acessa `/sobre` → SSR carrega i18n estático em ≤ 2s sem chamada a API ou banco | RF28 · RNF02 · RNF04 | ⬜     |
| Visitante clica "EN" → textos trocam para `en/about.json` em ≤ 1 clique sem reload       | RNF13                | ⬜     |
| Bot de indexação → HTML inicial com h1, textos e metadados Open Graph sem depender de JS | RNF04 · RNF21        | ⬜     |
| Visitante sem autenticação → nenhum guard intercepta → conteúdo exibido normalmente      | RNF20                | ⬜     |

#### Evidências de Funcionamento

_Evidências a serem adicionadas._

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ⬜        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### PRs Vinculadas

_A preencher._

#### Observações

- Todo conteúdo carregado de arquivos JSON estáticos em `src/lib/i18n/` — zero chamadas a banco ou API, tempo de carregamento depende apenas do SSR.
- Troca de idioma reativa via Svelte store; locale persiste em `localStorage` entre navegações.
- Metadados Open Graph gerados no `+page.server.ts`; sem `<svelte:head>` dinâmico no cliente, garantindo indexabilidade independente de JS.

---

## CP6 — FAQ e Base de Conhecimentos por Produto

### F16 — CRUD de artigos de FAQ

> **Issues:** [#59](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/59)  
> **RFs cobertos:** RF30, RF31, RF32, RF33  
> **RNFs cobertos:** RNF01, RNF04, RNF05

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant A as Admin
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB
    participant AGT as Agente Externo

    Note over A,AGT: Cadastrar artigo (RF30)
    A->>SK: POST /admin/faq { titulo, conteudo, product_id, category_id }
    SK->>EX: POST /api/faq Authorization: Bearer <token>
    EX->>EX: validateJWT + requireRole (RNF01)
    EX->>DB: INSERT INTO faq_articles (titulo, conteudo, product_id, category_id, published=false)
    DB-->>EX: { article }
    EX-->>SK: 201 { artigo criado }
    SK-->>A: lista atualizada

    Note over A,AGT: Editar artigo (RF31)
    A->>SK: PUT /admin/faq/:id { campos atualizados }
    SK->>EX: PUT /api/faq/:id Authorization: Bearer
    EX->>EX: validateJWT + requireRole
    EX->>DB: UPDATE faq_articles SET ... WHERE id = :id (id original preservado)
    DB-->>EX: ok
    EX-->>SK: 200
    SK-->>A: artigo atualizado

    Note over A,AGT: Categorizar artigo (RF33)
    A->>SK: PATCH /admin/faq/:id/category { product_id, category_id }
    SK->>EX: PATCH /api/faq/:id/category Authorization: Bearer
    EX->>EX: validateJWT + requireRole
    EX->>DB: verifica existência de product_id e category_id (integridade referencial)
    DB-->>EX: ok
    EX->>DB: UPDATE faq_articles SET product_id = :pid, category_id = :cid WHERE id = :id
    DB-->>EX: ok
    EX-->>SK: 200
    SK-->>A: categorização atualizada

    Note over A,AGT: Tentativa forjada — acesso direto ao Supabase (RNF01)
    AGT->>DB: INSERT / UPDATE direto sem token válido
    DB->>DB: RLS verifica auth.uid() + permissão do perfil
    DB-->>AGT: 403 Forbidden (nenhuma alteração executada)
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                                                   | RF / RNF      | Status |
| ------------------------------------------------------------------------------------------------ | ------------- | ------ |
| Admin cadastra artigo (título, conteúdo, produto, categoria) → persistido e apto para publicação | RF30 · RNF01  | ⬜     |
| Admin edita artigo → dados substituídos, ID original preservado                                  | RF31          | ⬜     |
| Admin remove artigo → excluído do banco e ausente na vitrine imediatamente                       | RF32          | ⬜     |
| Admin categoriza artigo → vínculos `product_id` + `category_id` com integridade referencial      | RF33          | ⬜     |
| Agente externo forja requisição sem token → RLS bloqueia com 403 sem alterar dados               | RNF01 · RNF09 | ⬜     |
| Artigos publicados → conteúdo no SSR indexável; despublicados ausentes da resposta SSR           | RNF04 · RNF05 | ⬜     |

#### Evidências de Funcionamento

_Evidências a serem adicionadas._

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ⬜        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### PRs Vinculadas

_A preencher._

#### Observações

- Artigos criados com `published = false` por padrão — publicação é ação explícita separada (F17), evitando publicação acidental.
- Integridade referencial entre `faq_articles`, `products` e `faq_categories` garantida por FK no banco; deleção em cascata não habilitada — artigos com produto/categoria inexistente retornam erro informativo.
- RLS bloqueia acesso direto ao Supabase sem passar pelo Express, dupla validação intencional reforçando RNF01.

---

### F17 — Publicar / despublicar artigo de FAQ

> **Issues:** [#60](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/60)  
> **RFs cobertos:** RF34, RF35  
> **RNFs cobertos:** RNF01, RNF04, RNF05

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant A as Admin
    participant SK as SvelteKit
    participant EX as Express API
    participant DB as Supabase DB
    participant V as Vitrine Pública (SSR)
    participant AGT as Agente Externo

    Note over A,AGT: Publicar artigo (RF34)
    A->>SK: toggle ON → PATCH /admin/faq/:id/status
    SK->>EX: PATCH /api/faq/:id/status { published: true } Authorization: Bearer
    EX->>EX: validateJWT + requireRole (RNF01)
    EX->>DB: UPDATE faq_articles SET published = true WHERE id = :id
    DB-->>EX: ok
    EX-->>SK: 200 { published: true }
    SK-->>A: toggle confirmado sem reload
    V->>DB: SELECT * FROM faq_articles WHERE published = true (RLS)
    DB-->>V: artigo agora incluso (SSR indexável — RNF04/RNF05)

    Note over A,AGT: Despublicar artigo (RF35)
    A->>SK: toggle OFF → PATCH /admin/faq/:id/status
    SK->>EX: PATCH /api/faq/:id/status { published: false } Authorization: Bearer
    EX->>EX: validateJWT + requireRole
    EX->>DB: UPDATE faq_articles SET published = false WHERE id = :id
    DB-->>EX: ok (registro preservado no banco)
    EX-->>SK: 200 { published: false }
    SK-->>A: toggle desativado sem reload
    V->>DB: SELECT * FROM faq_articles WHERE published = true
    DB-->>V: artigo imediatamente ausente da vitrine

    Note over A,AGT: Tentativa forjada sem token (RNF01)
    AGT->>DB: PATCH direto no Supabase sem auth
    DB->>DB: RLS verifica permissão do perfil
    DB-->>AGT: 403 (status de publicação não alterado)
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                                                  | RF / RNF      | Status |
| ----------------------------------------------------------------------------------------------- | ------------- | ------ |
| Admin publica artigo → `published = true` → visível na próxima requisição da vitrine sem reload | RF34 · RNF01  | ⬜     |
| Admin despublica artigo → artigo ausente da vitrine imediatamente, conteúdo preservado no banco | RF35          | ⬜     |
| Agente externo forja requisição sem token → RLS bloqueia com 403 sem alterar status             | RNF01 · RNF09 | ⬜     |
| Artigo publicado → conteúdo e metadados SEO no HTML inicial sem depender de JS                  | RNF04 · RNF05 | ⬜     |

#### Evidências de Funcionamento

_Evidências a serem adicionadas._

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ⬜        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### PRs Vinculadas

_A preencher._

#### Observações

- Mesmo padrão de toggle otimista da F13 — consistência intencional na UX do painel admin.
- Despublicar artigo não afeta avaliações já registradas; histórico de ratings preservado para análise futura (Dashboard CP3/IT3).
- A vitrine recarrega artigos publicados a cada requisição SSR; não há cache CDN configurado nesta iteração.

---

### F18 — Avaliação de artigos de FAQ

> **Issues:** [#62](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/62)  
> **RFs cobertos:** RF37  
> **RNFs cobertos:** RNF02, RNF04, RNF05

#### Diagrama de Sequência Formal

```mermaid
sequenceDiagram
    participant V as Visitante
    participant SK as SvelteKit (Vitrine)
    participant SS as Session Storage
    participant EX as Express API
    participant DB as Supabase DB

    Note over V,DB: Avaliar artigo — primeira vez na sessão (RF37)
    V->>SK: clica "Útil" ou "Não Útil"
    SK->>SS: verifica se artigo já foi avaliado nesta sessão
    SS-->>SK: não avaliado
    SK->>EX: POST /api/public/faq/:id/rating { rating: 'useful', session_hash }
    EX->>DB: verifica dedup (article_id, session_hash)
    DB-->>EX: sem duplicata
    EX->>DB: INSERT INTO faq_ratings (article_id, rating, session_hash) — anônimo
    DB-->>EX: ok
    EX-->>SK: 200 { success: true }
    SK->>SS: marca artigo como avaliado na sessão
    SK-->>V: feedback visual de confirmação (≤ 2s — RNF02)
    Note right of V: componente de avaliação não bloqueia SSR da página (RNF04/RNF05)

    Note over V,DB: Tentativa de avaliar novamente (duplicata de sessão)
    V->>SK: clica botão de avaliação novamente
    SK->>SS: verifica sessão
    SS-->>SK: já avaliado
    SK-->>V: "Você já avaliou este artigo" (bloqueado no cliente, sem chamada à API)

    Note over V,DB: Duplicata detectada pelo backend (session_hash)
    V->>SK: POST (nova aba / session storage limpo)
    SK->>EX: POST /api/public/faq/:id/rating { session_hash idêntico }
    EX->>DB: verifica dedup (article_id, session_hash)
    DB-->>EX: duplicata encontrada
    EX-->>SK: 409 Conflict
    SK-->>V: aviso de avaliação já registrada
```

#### Critérios de Aceite Atendidos

| Critério (BDD)                                                                                     | RF / RNF      | Status |
| -------------------------------------------------------------------------------------------------- | ------------- | ------ |
| Visitante clica "Útil" ou "Não Útil" → avaliação persistida anonimamente + feedback visual em ≤ 2s | RF37 · RNF02  | ⬜     |
| Visitante já avaliou o artigo na sessão → interface bloqueia sem chamar a API                      | RF37          | ⬜     |
| `session_hash` já existe no banco para o artigo → backend retorna 409 sem registrar duplicata      | RF37          | ⬜     |
| Componente de avaliação presente → SSR não bloqueado nem degradado                                 | RNF04 · RNF05 | ⬜     |

#### Evidências de Funcionamento

_Evidências a serem adicionadas._

#### Validação do Cliente

| Tipo               | Data | Resultado | Observação |
| ------------------ | ---- | --------- | ---------- |
| Partial Validation | —    | ⬜        | —          |
| Formal Validation  | —    | ⬜        | —          |

#### PRs Vinculadas

_A preencher._

#### Observações

- `session_hash` gerado no cliente via hash de `sessionStorage` + `article_id` — nenhum dado pessoal trafega na requisição de avaliação.
- Deduplicação em dois níveis: `sessionStorage` evita chamada redundante no cliente; constraint única no banco garante consistência mesmo com múltiplas abas abertas.
- Avaliações são anônimas e não expostas na vitrine nesta iteração — análise de utilidade reservada para o Dashboard executivo (CP3/IT3).
