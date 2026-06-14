# 6. Interação Equipe-Cliente

## Histórico de Revisão

| Versão | Data       | Descrição                                                                                                                      | Autor(es)        |
| ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| 1.0    | 11/04/2026 | Criação das seções 6.1 a 6.6                                                                                                   | Lucas A. Zanetti |
| 1.1    | 13/04/2026 | Revisão das seções 6.1 a 6.6                                                                                                   | Equipe Crianex   |
| 1.2    | 03/05/2026 | Atualização da composição da equipe                                                                                            | Lucas A. Zanetti |
| 1.3    | 05/05/2026 | Seções 6.2–6.6 reescritas: metodologia FDD + fluxogramas de validação e Kanban                                                 | Lucas A. Zanetti |
| 1.4    | 06/06/2026 | Separação de cerimônias únicas e iterativas; distinção Replenishment Macro/Micro; correção das Etapas FDD nas tabelas semanais | Lucas A. Zanetti |

---

## 6.1 Composição da Equipe

Os papéis seguem o modelo FDD + Kanban adotado pela equipe. Cada integrante pode acumular mais de um papel; as responsabilidades, no entanto, permanecem individuais e rastreáveis.

| Integrante                             | Papel FDD                                                       | Responsabilidades Principais                                                                                                                                                                                                                                                       | Disponibilidade |
| -------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| **Lucas Andrade Zanetti**              | Project Manager · Chief Architect · Development Manager(Backup) | **(PM/DM):** Gerenciar o roadmap, prazos e interface principal com o cliente/professor; conduzir _Replenishment_.<br>**(Chief Architect):** Liderar a modelagem de domínio e arbitrar decisões estruturais gerais da arquitetura.<br>**(DM Backup):** Desbloquear issues críticas. | 9 h/sem         |
| **Heitor Macedo Ricardo**              | Development Manager · Class Owner                               | **(DM):** Coordenar o progresso técnico diário da iteração (Kanban), acompanhar WIP limits, desbloquear issues da equipe e liderar a consolidação final da fase de Build.<br>**(Class Owner):** Assumir o desenvolvimento e testes de classes/features específicas.                | 5–8 h/sem       |
| **Leonardo Fachinello Bonetti**        | Chief Programmer · Class Owner                                  | **(Chief Programmer):** Conduzir o _Technical Design Review_ e mentorar decisões técnicas (especialmente Backend/Infra/K8s); aprovar Pull Requests estruturais.<br>**(Class Owner):** Desenvolver o código das responsabilidades que assumiu no design.                            | 5–8 h/sem       |
| **Philipe Amancio Reis Caetano**       | Chief Programmer · Class Owner                                  | **(Chief Programmer):** Conduzir decisões técnicas e revisões de código (PRs) focadas em Frontend e QA; auxiliar no design detalhado de features.<br>**(Class Owner):** Implementar de ponta a ponta as partes da interface pelas quais é responsável.                             | até 4 h/sem     |
| **Hugo Freitas Silva**                 | Class Owner                                                     | **(Class Owner):** Implementação primária de código , garantindo que as regras de negócio e critérios de aceite sejam codificados e testados; atualização do _board_ em tempo real e _code review_ em PRs entre pares.                                                             | até 4 h/sem     |
| **Camile Barbosa Gonzaga de Oliveira** | Class Owner · Documentation Lead · Requirements Custodian       | **(Requirements/Docs):** Gestão dos artefatos (feature cards, rastreabilidade e critérios de aceite); manutenção do Documento de Visão no MkDocs e consolidação das evidências de fechamento das iterações.<br>**(Class Owner):** Desenvolver e testar features alocadas.          | até 4 h/sem     |

**Papéis rotativos por iteração**

| Papel                         | Responsabilidade                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Facilitador Metodológico**  | Conduz cerimônias semanais; garante adesão ao processo; sinaliza desvios na retrospectiva                                       |
| **Responsável por Validação** | Coordena Partial e Formal Client Validation com Otavio; prepara checklists e materiais de demo; documenta aprovações nas issues |

---

## 6.2 Estrutura de Comunicação

Cada ferramenta tem escopo exclusivo — o que vai para o Miro não vai para o Discord. Isso evita decisões tomadas no canal errado e mantém rastreabilidade.

| Ferramenta                   | Tipo                  | Finalidade                                                                                                              | Não é usado para                     |
| ---------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Miro**                     | Assíncrono + Síncrono | Roadmap IT1–IT5, backlog macro, Feature Cards, Iteration Goal, modelo de domínio, atas de cerimônias, lições aprendidas | Acompanhamento operacional de issues |
| **GitHub Projects (Kanban)** | Assíncrono            | Issues fluindo pelas colunas Backlog → Done; WIP limit visível                                                          | Cerimônias, alinhamento estratégico  |
| **GitHub (repositório)**     | Assíncrono            | Código-fonte, Pull Requests, code review, CI/CD, evidências de execução                                                 | —                                    |
| **GitHub Pages (MkDocs)**    | Assíncrono            | Documento de Visão, rastreabilidade OE → CP → Feature, artefatos formais                                                | Operação diária                      |
| **Discord**                  | Assíncrono e Síncrono | Comunicação da semana e reuniões da equipe, dúvidas técnicas, MidWeek Sync ("Ontem fiz / Hoje farei / Bloqueios")       | -                                    |
| **WhatsApp**                 | Assíncrono            | Canal direto com Otavio para validações parciais e alinhamentos urgentes                                                | —                                    |
| **Google Meets**             | Síncrono              | Reuniões formais com o cliente                                                                                          | —                                    |

### Links das Ferramentas

| Ferramenta                   | Link                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| **Miro** (board principal)   | [Acessar board](https://miro.com/app/board/uXjVGl991V0=/?share_link_id=878597873452) |
| **GitHub Projects (Kanban)** | [Acessar board](https://github.com/orgs/mdsreq-fga-unb/projects/96)                  |

---

## 6.3 Cadência de Cerimônias

> **Princípio:** máximo **2–3 reuniões por semana**. Cerimônias relacionadas são agrupadas no mesmo dia. O Midweek Sync e a validação parcial com o cliente são sempre **assíncronos**; apenas o encerramento formal de iteração ocorre via **reunião**.

---

### 6.4 Cerimônias Únicas — Início do Projeto

Realizadas **uma única vez** antes da primeira iteração de construção. Correspondem às Etapas 1–3 do FDD e produzem os artefatos que servem de insumo para todas as iterações seguintes.

| Cerimônia | Formato | Quando | Participantes | Duração est. |
| --------------------------------- | ------- | ------------ | --------------------------- | ------------ |lc-facultativo
| **Domain Modeling Workshop** | Reunião | Antes da IT1 | PM, Chief Architect, Otavio | ~3h |
| **Feature Discovery Session** | Reunião | Antes da IT1 | Equipe (sem cliente) | ~1h |
| **Iteration Replenishment Macro** | Reunião | Antes da IT1 | PM, CPs, Otavio | ~1h |

> **Nota:** Devido correções de urgência ao modelo FDD implementado à partir do feedback do professor George, tanto _Feature Discovery Session_ como _Iteration Replenishment Macro_ foram feitas no ínicio da Iteração 1, uma vez que já haviamos iniciado.

---

### 6.5 Cerimônias Iterativas — Repetidas em Cada Iteração

Correspondem às Etapas 4–5 do FDD. O **Replenishment Micro** é a versão iterativa do planejamento: seleciona as features da iteração corrente com base no IP e na capacidade disponível, diferente do Macro que definiu o roadmap completo.

| Cerimônia                                      | Formato                       | Frequência                   | Participantes            | Duração est. |
| ---------------------------------------------- | ----------------------------- | ---------------------------- | ------------------------ | ------------ |
| **Iteration Replenishment Micro + Commitment** | Reunião                       | Início de cada iteração      | PM, CPs, Otavio          | ~1h          |
| **Technical Design Review**                    | Reunião                       | Por feature comprometida     | PM, CPs, Class Owners    | ~1h          |
| **Midweek Sync / Kanban Pull Execution**       | Assíncrono — Discord/Whatsapp | Meio de cada semana de Build | Toda a equipe            | —            |
| **Feature Build Consolidation**                | Reunião                       | Fim de cada semana de Build  | Toda a equipe            | ~45min       |
| **Partial Client Validation**                  | Assíncrono — WhatsApp         | Fim de cada semana de Build  | Resp. Validação + Otavio | —            |
| **Formal Client Validation**                   | Reunião                       | Fim da iteração              | Toda a equipe + Otavio   | ~1h          |
| **Iteration Artifact Closure**                 | Reunião                       | Fim da iteração              | Toda a equipe            | ~1h          |

---

### 6.6 Cadência Detalhada por Semana

Cada iteração segue fases com objetivos distintos. As cerimônias únicas (Domain Modeling, Feature Discovery, Replenishment Macro) **não se repetem** — apenas o Replenishment Micro inicia cada ciclo.

#### Fase de Planejamento — Início da Iteração

Seleção e comprometimento com o escopo da iteração. Novas features só entram no Kanban após o Technical Design Review estar concluído.

| Atividade                                  | Etapa FDD | Formato  |
| ------------------------------------------ | --------- | -------- |
| Iteration Replenishment Micro + Commitment | Etapa 4   | Síncrono |
| Technical Design Review                    | Etapa 4   | Síncrono |

#### Fase de Build — Semanas de Execução

Features fluem pelo Kanban. Pode se repetir por mais de uma semana conforme o escopo da iteração.

| Atividade                   | Etapa FDD | Formato    |
| --------------------------- | --------- | ---------- |
| Kanban Pull Execution       | Etapa 5   | Contínuo   |
| Midweek Sync                | Etapa 5   | Assíncrono |
| Feature Build Consolidation | Etapa 5   | Síncrono   |
| Partial Client Validation   | Etapa 5   | Assíncrono |

#### Fase de Encerramento — Fim da Iteração

Features consolidadas, rastreabilidade auditada e artefatos empacotados.

| Atividade                              | Etapa FDD | Formato    |
| -------------------------------------- | --------- | ---------- |
| Preparação da demo e fechamento de PRs | —         | Assíncrono |
| Formal Client Validation               | Etapa 5   | Síncrono   |
| Iteration Artifact Closure             | Etapa 5   | Síncrono   |
| Backlog Reorganization (se necessário) | Etapa 5   | Síncrono   |
