# 6. Interação Equipe-Cliente

## Histórico de Revisão

| Versão | Data       | Descrição                                                                      | Autor(es)        |
| ------ | ---------- | ------------------------------------------------------------------------------ | ---------------- |
| 1.0    | 11/04/2026 | Criação das seções 6.1 a 6.6                                                   | Lucas A. Zanetti |
| 1.1    | 13/04/2026 | Revisão das seções 6.1 a 6.6                                                   | Equipe Crianex   |
| 1.2    | 03/05/2026 | Atualização da composição da equipe                                            | Lucas A. Zanetti |
| 1.3    | 05/05/2026 | Seções 6.2–6.6 reescritas: metodologia FDD + fluxogramas de validação e Kanban | Lucas A. Zanetti |

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

---

## 6.3 Cadência de Cerimônias

> **Princípio:** máximo **2–3 reuniões por semana**. Cerimônias relacionadas são agrupadas no mesmo dia. O Midweek Sync e a validação parcial com o cliente são sempre **assíncronos**; apenas o encerramento formal de iteração ocorre via **reunião**.

---

### _Cerimônias por Iteração_

| Cerimônia                                | Formato               | Frequência                                        | Participantes               | Duração est. |
| ---------------------------------------- | --------------------- | ------------------------------------------------- | --------------------------- | ------------ |
| **Domain Modeling**                      | Reunião               | Início da Sem 1                                   | PM, Chief Arch, Otavio      | ~30h         |
| **Feature Discovery**                    | Reunião               | Sem 1                                             | Todos, menos o Cliente      | ~1h          |
| **Iteration Replenishment + Commitment** | Reunião               | Sem 1                                             | PM, Chief Arch, CPs, Otavio | ~1h          |
| **Technical Design Review**              | Reunião               | Início da Sem 2 (e Sem 3 se necessário)           | PM, CPs, Class Owners       | ~1h          |
| **Midweek Sync/Kanban Pull Execution**   | Assíncrono — Discord  | Meio de cada semana de execução (sexta ou sábado) | Toda a equipe               | -            |
| **Partial Client Validation**            | Assíncrono — WhatsApp | Fim de cada Sem                                   | Resp. Validação + Otavio    | —            |
| **Formal Client Validation**             | Reunião               | Fim da última semana da iteração                  | Toda a equipe + Otavio      | ~1h          |
| **Artifact Closure**                     | Reunião               | Fim da unidade + fim da iteração                  | Toda a equipe               | ~1h 30min    |
| **Feature Build Consolidation**          | Reunião               | Fim da semana 2 e semana 3                        | Toda a equipe               | ~45min       |

---

### _Cadência Detalhada por Semana_

Cada iteração padrão segue três semanas com objetivos distintos.

#### Semana 1 — Planejamento e Refinamento

Dedicada ao alinhamento estratégico e ao refinamento de requisitos. Devs podem trabalhar em carry-over, spikes ou dívida técnica — novas features da iteração corrente só iniciam após o Technical Design Review da Semana 2.

| Atividade                                      | Etapa FDD    | Formato               |
| ---------------------------------------------- | ------------ | --------------------- |
| Domain Modeling Workshop                       | Etapas 1     | Síncrono              |
| Feature Discovery Session                      | Etapas 2     | Síncrono              |
| Iteration Replenishment + Iteration Commitment | Etapas 3 e 4 | Síncrono e Assíncrono |

#### Semana 2 — Build Controlado e Execução Kanban

Todas as Features comprometidas começam a fluir pelo Kanban. A validação parcial ocorre de forma assíncrona ao fim da semana.

| Atividade                            | Etapa FDD | Formato    |
| ------------------------------------ | --------- | ---------- |
| Technical Design Review              | Etapa 5   | Síncrono   |
| Midweek Sync + Kanban Pull Execution | Etapa 6   | Assíncrono |
| Feature Build Consolidation (Sem 2)  | Etapa 7   | Síncrono   |
| Partial Client Validation            | Etapa 6   | Assíncrono |

#### Semana 3 — Consolidação, Validação e Encerramento

Features consolidadas, rastreabilidade auditada e artefatos empacotados. Apenas o encerramento formal reúne a equipe e o cliente.

| Atividade                                                 | Etapa FDD | Formato    |
| --------------------------------------------------------- | --------- | ---------- |
| Feature Build Consolidation                               | Etapa 7   | Síncrono   |
| Preparação da demo e fechamento de PRs pendentes          | —         | Assíncrono |
| Formal Client Validation                                  | Etapa 7   | Síncrono   |
| Artifact Closure + Backlog Reorganization caso necessário | Etapa 7   | Síncrono   |
