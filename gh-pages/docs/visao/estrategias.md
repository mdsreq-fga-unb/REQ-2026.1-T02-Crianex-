# 3. Estratégias de Engenharia de Software

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 12/04/2026 | Criação das seções 3.1 a 3.4 | Camile e Leonardo |
| 1.1 | 13/04/2026 | Revisão da seção 3 | Equipe Crianex |

---

## 3.1 Estratégia Priorizada

Para a construção da plataforma Crianex Hub, a equipe adotou uma estratégia de desenvolvimento que equilibra rigor técnico com agilidade de entrega. As quatro dimensões da estratégia estão detalhadas abaixo.

### Abordagem: Ágil

A abordagem ágil foi escolhida por ser orientada a valor de negócio de forma contínua. O software é construído incrementalmente, focado em entregar funcionalidades tangíveis ao cliente a cada ciclo, permitindo adaptação rápida às mudanças de requisitos — algo essencial no cenário de uma startup B2B como a Crianex, onde as necessidades evoluem constantemente.

### Ciclo de Vida: Iterativo e Incremental

O ciclo de vida iterativo e incremental organiza o desenvolvimento em ciclos curtos (sprints quinzenais), ao final dos quais uma versão parcial e funcional do produto é entregue. Cada iteração incorpora o feedback do cliente e refina os requisitos, garantindo que o produto evolua de forma alinhada às expectativas reais — sem esperar pelo final do projeto para descobrir desvios.

### Processo de ESW: FDD (Feature Driven Development)

O FDD (Feature Driven Development) é o processo de Engenharia de Software adotado. Ele organiza todo o desenvolvimento em torno de **funcionalidades** claras e rastreáveis, seguindo cinco etapas:

| Etapa | Atividade |
|-------|-----------|
| 1 | **Desenvolver Modelo Global** — Entendimento do domínio, contexto e ecossistema Crianex via brainstorming, entrevistas e Rich Picture |
| 2 | **Construir Lista de Funcionalidades** — Decomposição dos requisitos em features, organizadas em épicos e user stories no backlog Kanban |
| 3 | **Planejar por Funcionalidade** — Priorização estratégica via Valor × Esforço (IP = VB/PT); backlog priorizado por índice de prioridade e plano de releases definido por iteração |
| 4 | **Projetar por Funcionalidade** — Detalhamento visual e técnico com protótipos de baixa fidelidade, wireframes e critérios de aceitação |
| 5 | **Construir por Funcionalidade** — Inspeção e homologação contínua com inspeções formais, checklists de qualidade e backlog grooming |

A lista de funcionalidades do FDD está diretamente mapeada nas **Características do Produto (CP01–CP13)** definidas na seção 2.3, garantindo rastreabilidade total entre planejamento e implementação.

### Gestão de Equipe: Scrumban (Scrum + Kanban)

O Scrumban combina a estrutura de cerimônias e sprints do **Scrum** com a gestão de fluxo visual contínuo do **Kanban**, formando um modelo híbrido especialmente adequado à realidade da equipe:

| Dimensão | Detalhe |
|----------|---------|
| **Duração das Iterações** | ~2 semanas por iteração (IT2 → IT3 → IT4 → Pós-venda) |
| **Board de Acompanhamento** | GitHub Projects — colunas: Backlog → In Progress → Review → Done |
| **Cerimônias** | Iteration Planning (início de cada iteração) · Retrospectiva (fim de cada iteração) |
| **Sync assíncrono** | Check-in diário via texto no Discord: o que fiz / o que vou fazer / bloqueios |
| **Backlog** | Gerenciado no GitHub Issues, refinado (grooming) a cada sprint com base no feedback recebido |
| **Limite de WIP** | Limita o Trabalho em Progresso, reduzindo gargalos e focando o esforço técnico exigido pelo FDD |

---

## 3.2 Quadro Comparativo

A tabela a seguir apresenta um comparativo entre o **Modelo em Cascata** e o **Processo Ágil Híbrido (FDD + Scrumban)** adotado, analisando as principais características relevantes para o contexto do projeto Crianex.

| Características | Modelo em Cascata | Processo Ágil Híbrido (FDD + Scrumban) |
|---|---|---|
| **Abordagem Geral** | Linear e preditiva. O desenvolvimento flui em uma única direção através de fases restritas e isoladas. | Orientada a valor de negócio de forma contínua. O software é construído incrementalmente, focado em entregar features tangíveis. |
| **Foco em Arquitetura** | Forte ênfase na definição de uma arquitetura estática e detalhada antes de qualquer codificação. | Arquitetura focada na Modelagem de Domínio Global, que evolui iterativamente à medida que novas funcionalidades são projetadas. |
| **Estrutura de Processos** | Fases rígidas e bem demarcadas (Requisitos, Design, Implementação, Testes e Manutenção). | Fluxo de trabalho contínuo guiado por demanda (Kanban), mas mantendo processos essenciais de equipe (Scrum). |
| **Flexibilidade de Requisitos** | Baixíssima. Requisitos são congelados no início do projeto. Mudanças geram muito retrabalho. | Altíssima. Novas necessidades entram no backlog e podem ser priorizadas e "puxadas" para o desenvolvimento a qualquer momento, ideal para o cenário incerto de startups. |
| **Colaboração com Cliente** | Envolvimento concentrado nas fases iniciais e na entrega final do sistema. | Visibilidade total. O cliente acompanha o progresso por meio de funcionalidades concluídas (features do FDD) que são fáceis de entender em linguagem de negócio. |
| **Complexidade do Processo** | Burocrático, baseado em documentação extensa para transição de fases. | O Scrumban limita o Trabalho em Progresso, reduzindo gargalos e focando no esforço técnico que o FDD exige para cada feature. |
| **Qualidade Técnica** | Testes e validações ocorrem maciçamente apenas no fim do ciclo de desenvolvimento. | Garantida processo a processo. O FDD exige modelar por Feature e inspeção do código antes da integração, enquanto o fluxo ágil garante testes contínuos. |
| **Práticas de Desenvolvimento** | Estrutura formal focada na transição de fases e aprovação de documentos. Não prescreve práticas técnicas específicas de codificação para a equipe. | Inclui práticas robustas de engenharia (modelagem orientada a domínio e inspeção de código do FDD) aliadas à gestão de fluxo contínuo e limitação de WIP. |
| **Adaptação ao Projeto da Crianex** | Aplicável em cenários onde os clientes da Crianex exijam um escopo fixo e requisitos definidos integralmente no início do contrato. | O Scrumban permite acomodar demandas urgentes de múltiplos clientes de forma visual, enquanto o FDD garante a qualidade e robustez do software entregue ao mercado B2B. |
| **Documentação** | Documentação detalhada e padronizada é um pré-requisito obrigatório para a validação e transição entre as fases do projeto. | Focada no essencial para o negócio. A documentação principal reside no modelo de domínio global e nas listas detalhadas de features, mantendo a agilidade sem perder a organização. |
| **Controle de Qualidade** | Realizado primordialmente em uma fase específica e dedicada a testes, alocada após a conclusão da fase de implementação do código. | Embutido no processo. Cada funcionalidade (feature) passa por Design e Inspeção antes de ser considerada pronta, e o quadro Scrumban expõe rapidamente qualquer gargalo nos testes. |
| **Escalabilidade** | Aplicado a projetos de grande porte através da segmentação do cronograma e gestão rigorosa dos artefatos de cada fase. | Altamente escalável. O FDD foi criado originalmente para escalar projetos grandes, dividindo-os por funcionalidades, e o Scrumban se adapta facilmente ao crescimento orgânico da equipe da startup. |
| **Suporte a Equipes de Desenvolvimento** | Funciona em silos estruturados e hierárquicos, e consequentemente em equipes de desenvolvimento grandes. | Suporta equipes colaborativas. O FDD traz papeis claros de liderança técnica, e o Scrumban promove a auto-organização e visibilidade do trabalho para todos. |

---

## 3.3 Justificativa

A escolha do **Processo Ágil Híbrido (FDD + Scrumban)** se justifica principalmente pela necessidade de adaptação, velocidade de entrega e foco em valor de negócio no contexto do produto proposto.

Diferentemente do modelo em cascata, que exige requisitos totalmente definidos desde o início e apresenta baixa flexibilidade para mudanças, o cenário da Crianex — típico de startups e produtos B2B — envolve incertezas, evolução constante de necessidades e demandas simultâneas de diferentes clientes. Nesse contexto, a abordagem ágil híbrida permite incorporar mudanças de forma natural, priorizando continuamente o que gera mais valor.

### Por que FDD?

O uso do **FDD (Feature Driven Development)** garante uma base técnica sólida, pois organiza o desenvolvimento em torno de funcionalidades claras (features), facilita a comunicação com o cliente em linguagem de negócio e assegura qualidade por meio de modelagem de domínio e inspeções frequentes de código. Isso é essencial para manter a robustez do software mesmo com entregas incrementais.

Cada feature passa obrigatoriamente por **Design** e **Inspeção** antes de ser integrada ao produto, garantindo que nenhuma funcionalidade seja considerada pronta sem validação técnica formal. Esse rigor é especialmente relevante para os módulos críticos da plataforma — como autenticação, CRM, sistema de tickets e controle financeiro.

### Por que Scrumban?

Já o **Scrumban** complementa essa abordagem ao oferecer uma gestão de fluxo mais flexível e visual, permitindo lidar com múltiplas demandas, limitar o trabalho em progresso (WIP) e identificar rapidamente gargalos no processo. Essa característica é especialmente importante para equipes que precisam responder rapidamente a solicitações urgentes sem perder o controle da produtividade.

A comunicação do projeto segue um modelo **assíncrono por padrão**, com momentos síncronos reservados para as cerimônias de iteração (Iteration Planning e Retrospectiva) e alinhamentos com o cliente — escolha que leva em consideração que três dos seis integrantes têm disponibilidade limitada (até 4h/semana), tornando reuniões síncronas frequentes inviáveis sem impacto na produtividade.

### O que a integração FDD + Scrumban promove

Além disso, a integração entre FDD e Scrumban promove:

- Entregas contínuas e incrementais de valor ao cliente;
- Maior transparência e colaboração;
- Redução de riscos, já que problemas são identificados mais cedo;
- Melhor escalabilidade conforme o crescimento da equipe e do produto.

### Conclusão

Portanto, o processo ágil híbrido é a escolha mais adequada por alinhar qualidade técnica, flexibilidade e eficiência operacional, atendendo de forma mais eficaz às necessidades dinâmicas do projeto da Crianex.
