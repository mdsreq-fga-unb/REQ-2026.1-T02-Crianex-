# IT2 — Resultados de V&V

Registro formal das mudanças de processo, escopo e achados de verificação identificados durante e após a IT2. As alterações de backlog aqui documentadas **ainda não foram aplicadas na tabela de rastreabilidade** — ficam registradas para atualização futura.

> **Legenda:** ✅ Aplicado no backlog · ⏳ Pendente de aplicação · 🔴 Achado crítico · ⚠️ Achado de atenção

---

## Resumo das Mudanças

| Categoria   | ID    | Descrição resumida                                                            | Status |
| ----------- | ----- | ----------------------------------------------------------------------------- | ------ |
| Processo    | MP.01 | Seção de Regras de Negócio (RN01–RN12) formalizada na rastreabilidade         | ✅     |
| Processo    | MP.02 | Coluna INVEST adicionada à tabela de Features                                 | ✅     |
| Escopo      | ES.01 | RF48 adicionado — Editar próprio perfil no painel (F10, CP5)                  | ✅     |
| Escopo      | ES.02 | RF49 adicionado — Aceitar conformidade LGPD (F14, CP4)                        | ✅     |
| Escopo      | ES.03 | RF50 adicionado — Consultar detalhes de produto SaaS na vitrine (F15, CP4)    | ✅     |
| Escopo      | ES.04 | RF51 adicionado — Acessar página de conformidade LGPD na vitrine (F14, CP4)   | ✅     |
| Escopo      | ES.05 | RF52 adicionado — Permitir utilização de cookies no sistema (F14, CP4)        | ✅     |
| Escopo      | ES.06 | RF53 atribuído — Filtrar artigos FAQ (F18, CP6); resolve conflito V.02 da IT1 | ✅     |
| Escopo      | ES.07 | RF49→RF50 e RF50→RF51 renumerados após inserção do novo RF49                  | ✅     |
| Escopo      | ES.08 | IT1 pendentes (ES.01–ES.04): F02/F05/F07 e RF42 ainda não corrigidos          | ⏳     |
| Verificação | V.01  | RF54 e RF55 referenciados em Features mas ausentes na tabela de RFs           | ⚠️     |
| Verificação | V.02  | Referência cruzada incorreta: F10 aponta RF50 (deveria ser RF48)              | ⚠️     |

---

## 1. Mudanças de Processo

### MP.01 — Seção de Regras de Negócio Formalizada

| Campo         | Conteúdo                                                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Adição**    | Seção "Regras de Negócio (RNs)" criada na `rastreabilidade.md` (versão 1.4, 09/06/2026) com RN01–RN12                                                                                          |
| **Motivação** | RNs descrevem políticas e restrições que governam o comportamento do sistema independente de tecnologia — complementam RFs sem serem comportamentos de sistema em si                           |
| **Cobertura** | RN01–RN12 cobrem: visibilidade de produtos/FAQ, controle de acesso por papel (Owner/Member), inativação, senha temporária, avaliação anônima, cookies, LGPD, design system e ordem de produtos |
| **Status**    | ✅ Aplicado                                                                                                                                                                                    |

---

### MP.02 — Coluna INVEST Adicionada à Tabela de Features

| Campo         | Conteúdo                                                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Adição**    | Coluna INVEST inserida na tabela de Features (versão 1.2, 06/06/2026), avaliando cada feature pelos critérios I/N/V/E/S/T        |
| **Motivação** | Evidenciar quais critérios INVEST cada feature satisfaz e identificar features que ainda faltam atributos como Independência (I) |
| **Achado**    | F12 (Gerenciar produtos SaaS) apresenta `N-V-E-T` — ausente de I (não independente de F09/F10) e S (escopo não pequeno)          |
| **Status**    | ✅ Aplicado — revisão de features sem `I` fica como ação para IT3                                                                |

---

## 2. Mudanças de Escopo

### ES.01 — RF48 Adicionado: Editar Próprio Perfil no Painel

| Campo             | Conteúdo                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **RF adicionado** | **RF48** — Editar próprio perfil no painel                                                                                |
| **Feature / CP**  | F10 · CP5 · OE2                                                                                                           |
| **Motivo**        | Comportamento implementado (ProfileModal + PATCH /profile/me) que não possuía RF correspondente na rastreabilidade da IT1 |
| **Status**        | ✅ Adicionado na versão 1.4; marcado ✅ na v1.5                                                                           |

---

### ES.02 — RF49 Adicionado: Aceitar Conformidade LGPD

| Campo             | Conteúdo                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RF adicionado** | **RF49** — Aceitar as leis LGPDs                                                                                                                  |
| **Feature / CP**  | F14 · CP4 · OE2                                                                                                                                   |
| **Motivo**        | Requisito de conformidade legal identificado durante a implementação do formulário de contato; campo de aceite de política de privacidade exigido |
| **Impacto**       | Inserção deste RF deslocou os anteriores RF49→RF50 e RF50→RF51 (ver ES.07)                                                                        |
| **Status**        | ✅ Inserido na versão 1.5; marcado ✅                                                                                                             |

---

### ES.03 — RF50 Adicionado: Consultar Detalhes de Produto SaaS na Vitrine

| Campo             | Conteúdo                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| **RF adicionado** | **RF50** — Consultar detalhes de produto SaaS na vitrine                                            |
| **Feature / CP**  | F15 · CP4 · OE2                                                                                     |
| **Implementação** | Página `/produtos/[slug]` com detalhes completos do produto                                         |
| **Motivo**        | Comportamento implementado sem RF correspondente — cada produto possui página de detalhe individual |
| **Status**        | ✅ Adicionado (originalmente como RF49, renumerado para RF50 na v1.5)                               |

---

### ES.04 — RF51 Adicionado: Acessar Página de Conformidade LGPD na Vitrine

| Campo             | Conteúdo                                                                                |
| ----------------- | --------------------------------------------------------------------------------------- |
| **RF adicionado** | **RF51** — Acessar página de conformidade LGPD na vitrine                               |
| **Feature / CP**  | F14 · CP4 · OE2                                                                         |
| **Implementação** | Páginas `/privacidade` (política de privacidade) e `/cookies` (uso de cookies)          |
| **Motivo**        | Exigência LGPD de acesso público às políticas de privacidade e cookies sem autenticação |
| **Status**        | ✅ Adicionado (originalmente como RF50, renumerado para RF51 na v1.5)                   |

---

### ES.05 — RF52 Adicionado: Permitir Utilização de Cookies

| Campo             | Conteúdo                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| **RF adicionado** | **RF52** — Permitir a utilização de cookies no sistema                                                          |
| **Feature / CP**  | F14 · CP4 · OE2                                                                                                 |
| **Motivo**        | Banner de consentimento de cookies implementado — comportamento sem RF correspondente na rastreabilidade da IT1 |
| **Status**        | ✅ Adicionado na versão 1.5                                                                                     |

---

### ES.06 — RF53 Atribuído: Filtrar Artigos FAQ (resolve conflito V.02 da IT1)

| Campo         | Conteúdo                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Resolução** | O número **RF53** foi formalmente atribuído a "Filtrar artigos FAQ" (F18 · CP6 · OE2), resolvendo o conflito de numeração V.02 registrado na IT1                    |
| **Decisão**   | O RF de filtro financeiro proposto na IT1 (ES.02) não foi criado nesta iteração; RF53 permanece com a funcionalidade de FAQ já implementada                         |
| **Impacto**   | O RF de filtro financeiro (originalmente cogitado como RF53) deverá receber numeração RF56 ou superior quando criado, conforme determinado na ação corretiva da IT1 |
| **Status**    | ✅ Conflito resolvido                                                                                                                                               |

---

### ES.07 — Renumeração RF49→RF50 e RF50→RF51

| Campo      | Conteúdo                                                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Antes**  | RF49: Consultar detalhes de produto SaaS · RF50: Acessar página de conformidade LGPD                                                          |
| **Depois** | RF49: Aceitar LGPDs (novo) · RF50: Consultar detalhes de produto SaaS · RF51: Acessar página de conformidade LGPD                             |
| **Motivo** | Inserção de RF49 (LGPD) no início do bloco deslocou os dois RFs seguintes; referências cruzadas nas Features e RNFs foram atualizadas na v1.5 |
| **Status** | ✅ Aplicado — verificar se todas as referências cruzadas foram propagadas corretamente (ver V.02)                                             |

---

### ES.08 — Pendentes da IT1 Não Aplicados (carry-forward)

| Item IT1 | Descrição                                           | Estado atual na rastreabilidade |
| -------- | --------------------------------------------------- | ------------------------------- |
| ES.01    | Remover F02 (RF único — absorvida por F01)          | ⏳ F02 e RF03 ainda existem     |
| ES.02    | Remover F05 (RF único), renomear RF07, criar RF F04 | ⏳ F05 e RF07 ainda existem     |
| ES.03    | Remover F07 (RF único), mover RF18 para F06         | ⏳ F07 e RF18 ainda existem     |
| ES.04    | Decompor RF42 em 3 RFs (registrar, remover, editar) | ⏳ RF42 permanece como RF único |
| MP.02    | Recalcular priorização top-down (IP = VB/ES)        | ⏳ Não recalculado              |

> Estes itens devem ser priorizados no início da IT3 antes do Iteration Commitment.

---

## 3. Achados de Verificação

### V.01 — RF54 e RF55 Referenciados em Features sem Detalhe na Tabela de RFs

| Campo               | Conteúdo                                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Achado**          | As features F14 (RF55) e F15 (RF54) referenciam RF54 e RF55, mas esses requisitos **não possuem entradas na tabela de RFs**       |
| **Impacto**         | Rastreabilidade incompleta: não é possível saber o nome, descrição ou critérios de aceite desses requisitos a partir do documento |
| **Ação necessária** | Adicionar RF54 e RF55 à tabela de Requisitos Funcionais com nome, feature, CP e observação de implementação                       |
| **Severidade**      | ⚠️ Atenção                                                                                                                        |

---

### V.02 — Referência Cruzada Incorreta: F10 Aponta RF50

| Campo               | Conteúdo                                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Achado**          | A tabela de Features lista F10 com os RFs `RF10, RF50`. Porém, RF50 ("Consultar detalhes de produto SaaS") pertence a **F15**, não a F10 |
| **Causa provável**  | Durante a renumeração ES.07 (v1.5), a célula de F10 foi atualizada para RF50 sem verificar se o RF corresponde à feature correta         |
| **Correto deveria** | F10 deve referenciar **RF10** e **RF48** (Editar próprio perfil) — RF48 aponta para F10 na tabela de RFs mas F10 não o lista             |
| **Ação necessária** | Corrigir F10 na tabela de Features: substituir `RF10, RF50` por `RF10, RF48`; verificar se F15 já lista RF50 corretamente                |
| **Severidade**      | ⚠️ Atenção                                                                                                                               |
