# 3. Estratégias de Engenharia de Software

## Histórico de Revisão

| Versão | Data       | Descrição                    | Autor(es)         |
| ------ | ---------- | ---------------------------- | ----------------- |
| 1.0    | 12/04/2026 | Criação das seções 3.1 a 3.4 | Camile e Leonardo |
| 1.1    | 13/04/2026 | Revisão da seção 3           | Equipe Crianex    |

---

## 3.1 Estratégia Priorizada

Para a construção da plataforma Crianex Hub, a equipe adotou uma estratégia de desenvolvimento que equilibra rigor técnico com agilidade de entrega. As quatro dimensões da estratégia estão detalhadas abaixo.

### Abordagem: Ágil

A abordagem ágil foi escolhida por ser orientada a valor de negócio de forma contínua. O software é construído incrementalmente, focado em entregar funcionalidades tangíveis ao cliente a cada ciclo, permitindo adaptação rápida às mudanças de requisitos — algo essencial no cenário de uma startup B2B como a Crianex, onde as necessidades evoluem constantemente.

### Ciclo de Vida: Iterativo e Incremental

O ciclo de vida iterativo e incremental organiza o desenvolvimento em iterações de 3 à 4 semanas, ao final dos quais uma versão parcial e funcional do produto é entregue. Cada iteração incorpora o feedback do cliente e refina os requisitos, garantindo que o produto evolua de forma alinhada às expectativas reais — sem esperar pelo final do projeto para descobrir desvios.

### Processo de ESW: FDD (Feature Driven Development)

O FDD (Feature Driven Development) é o processo de Engenharia de Software adotado. Ele organiza todo o desenvolvimento em torno de **funcionalidades** claras e rastreáveis, seguindo cinco etapas:

| Etapa | Atividade                                                                                                                                                                         |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | **Desenvolver Modelo Global** — Entendimento do domínio, contexto e ecossistema Crianex via brainstorming, entrevistas e Rich Picture                                             |
| 2     | **Construir Lista de Funcionalidades** — Decomposição dos requisitos em features, organizadas em épicos e user stories no backlog Kanban                                          |
| 3     | **Planejar por Funcionalidade** — Priorização estratégica via Valor × Esforço (IP = VB/PT); backlog priorizado por índice de prioridade e plano de releases definido por iteração |
| 4     | **Projetar por Funcionalidade** — Detalhamento visual e técnico com protótipos de baixa fidelidade, wireframes e critérios de aceitação                                           |
| 5     | **Construir por Funcionalidade** — Inspeção e homologação contínua com inspeções formais, checklists de qualidade e backlog grooming                                              |

A lista de funcionalidades do FDD está diretamente mapeada nas **Características do Produto (CP01–CP13)** definidas na seção 2.3, garantindo rastreabilidade total entre planejamento e implementação.

### Gestão de Equipe: Kanban (WIP Limits)

O **Kanban** é utilizado para gestão visual do fluxo de trabalho das features, com limites de Trabalho em Progresso (_Work In Progress — WIP_) que reduzem gargalos e mantêm foco no esforço técnico exigido pelo FDD:

| Dimensão                    | Detalhe                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Duração das Iterações**   | ~2 semanas por iteração (IT2 → IT3 → IT4 → Pós-venda)                                                    |
| **Board de Acompanhamento** | GitHub Projects — colunas: Backlog → Ready → In Progress → Review → Validation → Done                    |
| **Cerimônias**              | Iteration Planning (início de cada iteração) · Retrospectiva (fim de cada iteração)                      |
| **Sync assíncrono**         | Check-in via texto no Discord: o que fiz / o que vou fazer / bloqueios                                   |
| **Backlog**                 | Gerenciado no GitHub Issues, refinado (grooming) a cada iteração com base no feedback recebido           |
| **Limite de WIP**           | Máx. 2 issues em andamento por Class Owner; ao atingir o limite, destravar antes de iniciar nova feature |

---

## 3.2 Quadro Comparativo

A tabela a seguir apresenta um comparativo entre o Scrum Tradicional e o Processo Ágil Híbrido (FDD + Kanban) adotado no projeto Crianex, analisando características relevantes para o contexto de desenvolvimento da solução.

| Características                          | Scrum Tradicional                                                                                                | Processo Ágil Híbrido (FDD + Kanban)                                                                                                                               |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Abordagem Geral**                      | Desenvolvimento iterativo e incremental baseado em Sprints com entregas frequentes de valor.                     | Desenvolvimento incremental orientado a funcionalidades (features), com fluxo contínuo de trabalho e foco em entrega de valor ao negócio.                          |
| **Foco em Arquitetura**                  | A arquitetura evolui conforme as Sprints e necessidades do produto.                                              | Forte foco inicial em modelagem de domínio global, permitindo evolução estruturada das funcionalidades.                                                            |
| **Estrutura de Processos**               | Baseado em eventos fixos e cadenciados, como Sprint Planning, Daily Scrum, Sprint Review e Sprint Retrospective. | Combina fluxo contínuo do Kanban com etapas estruturadas do FDD para desenvolvimento por funcionalidades.                                                          |
| **Flexibilidade de Requisitos**          | Alta. Mudanças podem ser incorporadas nas próximas Sprints conforme priorização do backlog.                      | Altíssima. Novas funcionalidades entram continuamente no backlog e podem ser priorizadas conforme a demanda do negócio.                                            |
| **Colaboração com Cliente**              | O cliente participa ativamente das revisões de Sprint e da priorização do Product Backlog.                       | O cliente acompanha continuamente a evolução das funcionalidades concluídas e priorizadas.                                                                         |
| **Complexidade do Processo**             | Estrutura relativamente simples, focada em cerimônias ágeis e organização iterativa da equipe.                   | Combina práticas técnicas robustas do FDD com gestão visual contínua do Kanban, exigindo maior coordenação técnica.                                                |
| **Qualidade Técnica**                    | Incentiva integração contínua, revisões e testes frequentes ao longo das Sprints.                                | Garantida funcionalidade por funcionalidade. O FDD exige modelagem e inspeção de código antes da integração, enquanto o fluxo contínuo favorece testes constantes. |
| **Práticas de Desenvolvimento**          | Baseado em entregas incrementais, reuniões periódicas e colaboração contínua da equipe.                          | Inclui práticas de engenharia robustas, como modelagem orientada a domínio, inspeção de código e limitação de WIP.                                                 |
| **Adaptação ao Projeto da Crianex**      | Adequado para organização iterativa das entregas e acompanhamento contínuo das necessidades do cliente.          | O Kanban acomoda demandas simultâneas sem sobrecarga de cerimônias, enquanto o FDD garante robustez técnica para o mercado B2B.                                    |
| **Documentação**                         | Documentação enxuta, priorizando comunicação rápida e software funcional.                                        | Documentação focada no modelo de domínio global e nas listas de funcionalidades, mantendo organização sem comprometer a agilidade.                                 |
| **Controle de Qualidade**                | Realizado continuamente durante as Sprints através de revisões, testes e validações incrementais.                | Embutido no processo. Cada feature passa por Design e Inspeção antes de ser considerada concluída, enquanto o board Kanban evidencia gargalos rapidamente.         |
| **Escalabilidade**                       | Funciona bem em equipes pequenas e médias, podendo exigir adaptações em projetos maiores.                        | Altamente escalável. O FDD permite divisão eficiente por funcionalidades e o Kanban se adapta ao crescimento gradual da equipe.                                    |
| **Suporte a Equipes de Desenvolvimento** | Promove equipes multidisciplinares e auto-organizadas com colaboração contínua.                                  | Combina liderança técnica especializada do FDD com transparência e auto-organização proporcionadas pelo Kanban.                                                    |

---

## 3.3 Justificativa

A escolha do **Processo Ágil Híbrido (FDD + Kanban)** se justifica pela necessidade de combinar flexibilidade, organização do fluxo de trabalho e qualidade técnica no desenvolvimento do projeto Crianex.

Dentre as abordagens ágeis analisadas, observou-se que o Scrum Tradicional oferece uma estrutura eficiente para organização iterativa do desenvolvimento e acompanhamento contínuo das entregas. Entretanto, devido às características específicas do projeto — como múltiplas demandas simultâneas, evolução frequente de requisitos e necessidade de maior controle técnico sobre funcionalidades críticas — optou-se pela adoção de um processo híbrido baseado em FDD e Kanban.

Enquanto o Scrum tradicional concentra a organização do trabalho em ciclos fixos de Sprint, o modelo híbrido adotado permite maior flexibilidade operacional por meio de fluxo contínuo, mantendo ao mesmo tempo práticas estruturadas de engenharia de software.

### Por que FDD?

O uso do **FDD (Feature Driven Development)** proporciona uma estrutura técnica mais robusta ao organizar o desenvolvimento em torno de funcionalidades claras (_features_). Essa abordagem facilita a comunicação com o cliente em linguagem de negócio e melhora o acompanhamento da evolução do sistema.

Além disso, o FDD incorpora atividades formais de modelagem, design e inspeção de código para cada funcionalidade desenvolvida, promovendo maior controle de qualidade durante todo o processo. Diferentemente de abordagens ágeis mais genéricas, o FDD enfatiza práticas técnicas específicas que contribuem para a consistência arquitetural e manutenção do software.

Essa característica é especialmente importante para módulos críticos da plataforma, como autenticação, CRM, sistema de tickets e controle financeiro, que exigem maior confiabilidade e estabilidade.

### Por que Kanban?

O **Kanban** complementa o FDD ao oferecer uma gestão de fluxo visual e adaptável. A utilização do board de acompanhamento com limites de WIP (_Work In Progress_) permite identificar gargalos rapidamente, equilibrar a carga de trabalho da equipe e melhorar a previsibilidade das entregas.

Em comparação ao Scrum tradicional, que organiza o trabalho em Sprints fixas com cerimônias pesadas, o Kanban permite incorporar mudanças e demandas urgentes de maneira mais dinâmica, sem a sobrecarga de ritos obrigatórios — característica relevante para o contexto de equipe acadêmica da Crianex.

Além disso, a comunicação do projeto ocorre predominantemente de forma assíncrona, mantendo encontros síncronos apenas para alinhamentos estratégicos, planejamento das iterações e retrospectivas. Essa organização melhora a gestão da disponibilidade dos integrantes e reduz impactos na produtividade da equipe.

### O que a integração FDD + Kanban promove

A integração entre FDD e Kanban permite reunir características importantes de diferentes abordagens ágeis, proporcionando:

- Entregas contínuas e incrementais de funcionalidades;
- Maior flexibilidade na priorização de demandas;
- Melhor controle técnico sobre o desenvolvimento;
- Maior transparência no acompanhamento das atividades;
- Redução de gargalos no fluxo de trabalho;
- Melhor escalabilidade conforme o crescimento da equipe e do produto.

### Conclusão

Portanto, o Processo Ágil Híbrido (FDD + Kanban) foi escolhido por oferecer um equilíbrio entre flexibilidade operacional e rigor técnico. Em comparação ao Scrum tradicional, a abordagem híbrida mostra-se mais adequada às necessidades do projeto Crianex, especialmente pela capacidade de lidar com múltiplas demandas simultâneas, manter fluxo contínuo de desenvolvimento e garantir maior controle de qualidade sobre as funcionalidades implementadas.
