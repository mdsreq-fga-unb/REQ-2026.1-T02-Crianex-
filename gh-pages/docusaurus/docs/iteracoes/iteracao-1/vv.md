# IT1 — Resultados de V&V

Registro formal das mudanças de processo, escopo e achados de verificação identificados durante e após a IT1. As alterações de backlog aqui documentadas **ainda não foram aplicadas na tabela de rastreabilidade** — ficam registradas para atualização futura.

- **Estratégia:** Verificação
- **Técnica:** Análise de rastreabilidade e Inspeção

> **Legenda:** <span className="badge badge--green">Aplicado</span> aplicado no backlog · <span className="badge badge--green">Resolvido</span> achado resolvido · <span className="badge badge--yellow">Pendente</span> pendente de aplicação · <span className="badge badge--red">Crítico</span> achado crítico · <span className="badge badge--yellow">Atenção</span> achado de atenção

---

## 1. Mudanças de Processo

<details className="crianex-change">
<summary><span className="crianex-change__id">MP.01</span> <span className="crianex-change__sum">Modelo FDD: 100% iterativo → fase de construção iterativa</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MP.01 — Modelo FDD**

| Campo         | Conteúdo                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **De**        | FDD 100% iterativo — todas as fases (Domain Modeling, Feature List, Planning, Design, Build) repetidas integralmente a cada iteração                 |
| **Para**      | FDD com **fase de construção iterativa** — Domain Modeling e Feature List realizados uma vez; Planning, Design e Build repetidos por iteração        |
| **Motivação** | O domínio do produto Crianex foi suficientemente mapeado na IT1; repetir Domain Modeling a cada ciclo gerava overhead sem ganho real de conhecimento |
| **Status**    | <span className="badge badge--green">Aplicado</span> Adotado desde IT1                                                                                                                                 |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">MP.02</span> <span className="crianex-change__sum">Direção da priorização: bottom-up → top-down</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MP.02 — Abordagem de Priorização**

| Campo              | Conteúdo                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **De (incorreto)** | **Bottom-up:** IP calculado nos RFs individuais; prioridade da Feature derivada dos requisitos                                                                            |
| **Para (correto)** | **Top-down:** cada Feature recebe seu próprio cálculo **IP = VB/ES** validado pelo cliente; RFs dentro da feature podem ou não ter priorização interna                    |
| **Motivação**      | Feature é a unidade de entrega de valor — o cliente prioriza funcionalidades, não requisitos individuais. Calcular IP no nível errado distorce o planejamento de iteração |
| **Impacto**        | Reprocessar tabela de priorização do backlog aplicando o método correto                                                                                                   |
| **Status**         | <span className="badge badge--green">Aplicado</span> realizado IT2                                                                                                                                                          |

</div>
</details>


## 2. Mudanças de Escopo

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.01</span> <span className="crianex-change__sum">F02 removida — absorvida por F01</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.01 — F02 Removida**

| Campo                | Conteúdo                                                                                                                                                                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature removida** | **F02** — Auditar alterações administrativas para rastrear ações do sistema                                                                                                                                                                                                                  |
| **RF removido**      | **RF03** — Auditar alterações realizadas                                                                                                                                                                                                                                                     |
| **Motivo**           | Auditoria é uma atividade dos gestores realizada **a partir** de F01 (RF01 — Consultar histórico de logs + RF02 — Filtrar logs do sistema). Ter feature e requisito separados para "auditar" é redundante — o ato de auditar emerge do uso de F01, não exige comportamento sistêmico próprio |
| **Absorvida por**    | F01 — Consultar logs operacionais para auditoria de atividades                                                                                                                                                                                                                               |
| **Status**           | <span className="badge badge--green">Aplicado</span> F02/RF03 (audit) removidos; F01 cobre o comportamento via RF01 (consultar histórico) + RF02 (filtrar). Os IDs F02/RF03 foram reaproveitados na renumeração geral de CPs (17/05–26/06) para a feature "Monitorar estado dos componentes" — sem relação com a antiga                                                                                                                                                                                                                                                     |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.02</span> <span className="crianex-change__sum">F05 removida — RF07 reproposto + novo RF para F04</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.02 — F05 Removida e RF07 Reproposto**

| Campo                | Conteúdo                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Feature removida** | **F05** — Filtrar métricas executivas para análise segmentada                                                                                                            |
| **RF removido**      | **RF07** — Filtrar métricas executivas (escopo genérico, único RF na feature)                                                                                            |
| **Motivo**           | Feature com único RF funcional não justifica existência autônoma. Indicadores operacionais e financeiros têm contextos distintos e não devem compartilhar o mesmo filtro |
| **Substituído por**  | **RF07 (renomeado)** — Filtrar indicadores operacionais → pertence a **F03**                                                                                             |
|                      | **Novo RF** — Filtrar indicadores financeiros → pertence a **F04**                                                                                                       |
| **Status**           | <span className="badge badge--green">Aplicado</span> Na tabela atual: RF06 = "Filtrar indicadores operacionais" (F03) e RF55 (novo) = "Filtrar indicadores financeiros" (F04); a antiga F05/RF07 (filtro genérico) não existe mais — IDs F05/RF07 reaproveitados para features distintas na renumeração geral                                                                                                          |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.03</span> <span className="crianex-change__sum">F07 absorvida por F06 — RF18 migra para F06</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.03 — F07 Absorvida por F06**

| Campo                | Conteúdo                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Feature removida** | **F07** — Filtrar dados financeiros para análise contábil agrupada                                                                                                                                     |
| **RF migrado**       | **RF18** — Filtrar registros financeiros → passa a integrar **F06**                                                                                                                                    |
| **F06 antes**        | RF16, RF17                                                                                                                                                                                             |
| **F06 depois**       | RF16, RF17, RF18                                                                                                                                                                                       |
| **Motivo**           | Filtro de registros financeiros é subcomportamento natural de F06 (consulta de registros financeiros). Feature isolada com um único RF de filtro não é atômica o suficiente para existir separadamente |
| **Status**           | <span className="badge badge--green">Aplicado</span> Na tabela atual, RF18 (Filtrar registros financeiros) está agrupado com RF16/RF17 em **F05 — Consultar registros financeiros**; a feature isolada de filtro não existe mais — consolidação equivalente à proposta, sob ID de feature diferente após a renumeração geral                                                                                                                                                 |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.04</span> <span className="crianex-change__sum">F22 — RF42 detalhado em 3 RFs</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.04 — F22: RF42 Detalhado em 3 RFs**

| Campo            | Conteúdo                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Feature**      | **F22** — Registrar interações comerciais para rastreamento do relacionamento                                                    |
| **RF original**  | RF42 — Adicionar interação comercial (operação única, escopo vago)                                                               |
| **Detalhamento** | **RF42** — Registrar histórico de interação _(base, já atualizado)_                                                              |
|                  | **Novo RF** — Remover interação comercial                                                                                        |
|                  | **Novo RF** — Editar anotação de interação comercial                                                                             |
| **Motivo**       | CRUD completo para interações comerciais; RF único agregava comportamentos distintos que geram critérios de aceite independentes |
| **Status**       | <span className="badge badge--green">Aplicado</span> Os 2 novos RFs foram numerados e estão na tabela atual: **RF53** — Remover interação comercial · **RF59** — Editar interação comercial. As 3 RFs (RF42, RF53, RF59) estão agrupadas em **F21 — Registrar interações comerciais** (ID renumerado de F22 para F21 na renumeração geral)                                                            |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.05</span> <span className="crianex-change__sum">F25/F26/F27 — agrupadora dividida em 3 features atômicas</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.05 — F25/F26/F27: Agrupadora Dividida**

| Campo               | Conteúdo                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Versão anterior** | **F25 (agrupadora)** — Gerenciar notificações para acompanhamento operacional · RFs: RF46, RF47, RF15                                                                                      |
| **Versão atual**    | **F25** — Exibir o histórico de notificações para acompanhamento operacional (RF46)                                                                                                        |
|                     | **F26** — Controlar estado das notificações para acompanhamento de envio (RF47)                                                                                                            |
|                     | **F27** — Gerenciar notificações para o controle do sistema (RF15)                                                                                                                         |
| **Motivo**          | CP9 não pode ter uma única feature (regra metodológica). Cada comportamento — listar histórico, alterar status, configurar template — tem critérios de aceite e complexidade independentes |
| **Status**          | <span className="badge badge--green">Aplicado</span> Já refletido na rastreabilidade                                                                                                                                                         |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.06</span> <span className="crianex-change__sum">F10 — Adicionado RF48 para edição de dados do próprio perfil</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.06 — F10: Adicionado RF48 para Edição de Perfil**

| Campo         | Conteúdo                                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature**   | **F10** — Permitir acesso ao painel administrativo para gerenciamento da plataforma                                                                   |
| **Novo RF**   | **RF48** — Editar dados do próprio perfil                                                                                                             |
| **Descrição** | O sistema deve permitir que administradores autenticados alterem as informações cadastrais do seu próprio perfil diretamente no painel administrativo |
| **Motivo**    | Desmembramento necessário da gestão de acesso (F10) para garantir a autonomia do usuário logado sobre suas informações de perfil sem intermediários   |
| **Status**    | <span className="badge badge--green">Aplicado</span> Já refletido na rastreabilidade                                                                                                                    |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.07</span> <span className="crianex-change__sum">F14 — Adicionado RF49 para consentimento e detalhamento de LGPD</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.07 — F14: Adicionado RF49 para Consentimento de LGPD**

| Campo         | Conteúdo                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Feature**   | **F14** — Exibir canais de contato na vitrine                                                                                                                                              |
| **Novo RF**   | **RF49** — Detalhar as leis LGPDs seguidas                                                                                                                                                 |
| **Descrição** | O sistema deve disponibilizar os termos de privacidade e exigir o aceite explícito das diretrizes da LGPD pelo usuário antes de permitir a submissão do formulário de captação de contatos |
| **Motivo**    | A coleta de dados de visitantes na vitrine exige base legal de consentimento e transparência sobre o tratamento das informações armazenadas                                                |
| **Status**    | <span className="badge badge--green">Aplicado</span> Já refletido na rastreabilidade                                                                                                                                                         |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.08</span> <span className="crianex-change__sum">F15 — Adicionado RF50 para consulta de detalhes de produtos SaaS</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.08 — F15: Adicionado RF50 para Detalhes de Produtos SaaS**

| Campo         | Conteúdo                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature**   | **F15** — Disponibilizar informações institucionais para apresentação da empresa                                                                           |
| **Novo RF**   | **RF50** — Consultar detalhes dos produto SaaS                                                                                                             |
| **Descrição** | O sistema deve permitir o redirecionamento de visitantes a partir de links específicos da vitrine para páginas dedicadas ao detalhamento dos produtos SaaS |
| **Motivo**    | Necessidade de segmentação do catálogo institucional; permite que o lead aprofunde o conhecimento sobre os módulos específicos antes da captação           |
| **Status**    | <span className="badge badge--green">Aplicado</span> Já refletido na rastreabilidade                                                                                                                         |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.09</span> <span className="crianex-change__sum">F15 — Adicionado RF51 para consentimento e política de cookies</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.09 — F15: Adicionado RF51 para Gerenciamento de Cookies**

| Campo         | Conteúdo                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature**   | **F15** — Disponibilizar informações institucionais para apresentação da empresa                                                                        |
| **Novo RF**   | **RF51** — Permitir a utilização de cookies no sistema                                                                                                  |
| **Descrição** | O sistema deve exibir um banner de consentimento de rastreamento de dados, permitindo ao usuário aceitar ou rejeitar políticas de cookies da plataforma |
| **Motivo**    | Conformidade obrigatória com a LGPD para navegação e auditoria na camada pública (vitrine); garante transparência no uso de dados de navegação          |
| **Status**    | <span className="badge badge--green">Aplicado</span> Já refletido na rastreabilidade                                                                                                                      |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">ES.10</span> <span className="crianex-change__sum">F08 — Antigo RF15 refatorado em 3 RFs atômicos (CRUD de templates) e movido de F27 para F08</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**ES.10 — F08: Refatoração e Desmembramento do Gerenciamento de Templates**

| Campo       | Conteúdo                                                                                                                                                                                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature** | **F08** — Gerenciar templates de notificações _(Destino)_ <br/> **F27** — Gerenciar notificações para o controle do sistema _(Origem)_ [Removida]                                                                                                                                                   |
| **Mudança** | Remoção do escopo macro **RF15 — Configurar template de notificações** (vinculado a F27) para a criação de 3 requisitos atômicos em F08: <br/> • **RF15** — Adicionar template de notificações <br/> • **RF56** — Editar template de notificações <br/> • **RF57** — Remover template de notificações |
| **Motivo**  | Correção de granularidade e alinhamento com o modelo FDD. "Configurar" mascarava um comportamento complexo de CRUD. O desmembramento isola as operações de persistência e expõe os critérios de aceite de forma independente.                                                                      |
| **Impacto** | Alteração do mapeamento de rastreabilidade do RF15 (agora aponta para F08) e abertura de novos IDs (RF56 e RF57) no backlog da IT2.                                                                                                                                                                |
| **Status**  | <span className="badge badge--green">Aplicado</span> e refletido no mapeamento visual do Miro                                                                                                                                                                                                                                               |

</div>
</details>


## 3. Achados de Verificação

<details className="crianex-change">
<summary><span className="crianex-change__id">V.01</span> <span className="crianex-change__sum">MFA/2FA: decisão de não implementar por solicitação do cliente</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**V.01 — Decisão: MFA/2FA Não Implementado (CP5 · F09 · RF08)**

| Campo                  | Conteúdo                                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contexto**           | O requisito RNF08 previa autenticação de dois fatores (TOTP) para o painel administrativo                                                     |
| **Decisão**            | O cliente (Otávio) sinalizou que **não é necessário implementar 2FA** no produto                                                              |
| **Impacto no backlog** | O critério de aceite "MFA ativo → código TOTP solicitado antes de emitir sessão" deve ser **removido de F09** e **RNF08 revisto ou removido** |
| **Impacto técnico**    | O código TOTP existente em `backend/src/auth/auth.service.ts` pode ser removido para evitar código morto                                      |
| **Validado por**       | Cliente Otávio                                                                                                                                |
| **Status**             | <span className="badge badge--green">Aplicado</span> Decisão documentada — ajustes de backlog pendentes                                                                                         |

</div>
</details>

<details className="crianex-change">
<summary><span className="crianex-change__id">V.02</span> <span className="crianex-change__sum">Conflito de numeração RF53 após mudanças de escopo</span> <span className="badge badge--green">Resolvido</span></summary>
<div className="crianex-change__body">

| Campo | Conteúdo |
| --- | --- |
| **Achado** | Durante os desmembramentos de escopo (ES.01–ES.10), o ID **RF53** chegou a ficar referenciado por mais de um requisito em rascunhos da rastreabilidade |
| **Risco** | Ambiguidade na matriz de rastreabilidade OE → CP → Feature → RF |
| **Ação** | Auditoria de numeração de RFs realizada durante a renumeração geral de CPs/Features (17/05–26/06) |
| **Status** | <span className="badge badge--green">Resolvido</span> Na tabela atual, RF53 referencia exclusivamente "Remover interação comercial" (F21) — sem ambiguidade |

</div>
</details>
