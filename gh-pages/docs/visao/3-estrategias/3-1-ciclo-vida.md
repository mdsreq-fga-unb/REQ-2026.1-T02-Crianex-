# 3.1 Estratégia Priorizada

Para a construção da plataforma Crianex Hub, a equipe adotou uma estratégia de desenvolvimento que equilibra rigor técnico com agilidade de entrega. As quatro dimensões da estratégia estão detalhadas abaixo.

---

## Abordagem: Ágil

A abordagem ágil foi escolhida por ser orientada a valor de negócio de forma contínua. O software é construído incrementalmente, focado em entregar funcionalidades tangíveis ao cliente a cada ciclo, permitindo adaptação rápida às mudanças de requisitos — algo essencial no cenário de uma startup B2B como a Crianex, onde as necessidades evoluem constantemente.

---

## Ciclo de Vida: Iterativo e Incremental

O ciclo de vida iterativo e incremental organiza o desenvolvimento em ciclos curtos (sprints quinzenais), ao final dos quais uma versão parcial e funcional do produto é entregue. Cada iteração incorpora o feedback do cliente e refina os requisitos, garantindo que o produto evolua de forma alinhada às expectativas reais — sem esperar pelo final do projeto para descobrir desvios.

---

## Processo de ESW: FDD (Feature Driven Development)

O FDD (Feature Driven Development) é o processo de Engenharia de Software adotado. Ele organiza todo o desenvolvimento em torno de **funcionalidades** claras e rastreáveis, seguindo cinco etapas:

| Etapa | Atividade |
|-------|-----------|
| 1 | **Desenvolver Modelo Global** — Entendimento do domínio, contexto e ecossistema Crianex via brainstorming, entrevistas e Rich Picture |
| 2 | **Construir Lista de Funcionalidades** — Decomposição dos requisitos em features, organizadas em épicos e user stories no backlog Kanban |
| 3 | **Planejar por Funcionalidade** — Priorização estratégica via MoSCoW e negociação de conflitos; backlog priorizado e plano de releases definido |
| 4 | **Projetar por Funcionalidade** — Detalhamento visual e técnico com protótipos de baixa fidelidade, wireframes e critérios de aceitação |
| 5 | **Construir por Funcionalidade** — Inspeção e homologação contínua com inspeções formais, checklists de qualidade e backlog grooming |

A lista de funcionalidades do FDD está diretamente mapeada nas **Características do Produto (CP01–CP15)** definidas na seção 2.3, garantindo rastreabilidade total entre planejamento e implementação.

---

## Gestão de Equipe: Scrumban (Scrum + Kanban)

O Scrumban combina a estrutura de cerimônias e sprints do **Scrum** com a gestão de fluxo visual contínuo do **Kanban**, formando um modelo híbrido especialmente adequado à realidade da equipe:

| Dimensão | Detalhe |
|----------|---------|
| **Duração dos Sprints** | 2 semanas (exceto sprints 6 e 7, com janelas menores próximas à entrega final) |
| **Board de Acompanhamento** | GitHub Projects — colunas: Backlog → In Progress → Review → Done |
| **Cerimônias** | Sprint Planning (início), Sprint Review e Retrospectiva (fim de cada sprint) |
| **Daily assíncrono** | Check-in diário via texto: o que fiz / o que vou fazer / bloqueios |
| **Backlog** | Gerenciado no GitHub Issues, refinado (grooming) a cada sprint com base no feedback recebido |
| **Limite de WIP** | Limita o Trabalho em Progresso, reduzindo gargalos e focando o esforço técnico exigido pelo FDD |
