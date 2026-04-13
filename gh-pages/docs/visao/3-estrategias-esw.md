# 3. Estratégias de ESW

---

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 12/04/2026 | Criação das seções 3.1, 3.2 e 3.3 | Camile e Leonardo |

---

## 3.1 Ciclo de Vida e Abordagem de Desenvolvimento

O projeto Crianex adota uma abordagem **Ágil** com ciclo de vida **Iterativo e Incremental**, permitindo entregas frequentes de valor, adaptação contínua a mudanças de requisitos e feedback regular dos stakeholders.

### Justificativa da Abordagem

| Critério | Escolha | Justificativa |
|----------|---------|---------------|
| Complexidade do Produto | Alta | Dois módulos integrados (Área Adm. + Vitrine) com múltiplos perfis de usuário |
| Requisitos | Parcialmente estáveis | Definidos em alto nível; detalhes serão refinados iterativamente com o cliente |
| Tamanho da Equipe | Pequena (7 membros) | Times ágeis menores se beneficiam de ciclos curtos e comunicação direta |
| Prazo | Definido por unidades acadêmicas | Entregas incrementais alinham-se ao cronograma da disciplina |

---

### Comparativo: Desenvolvimento em Cascata vs. FDD + Scrumban

| Característica | Cascata | FDD + Scrumban |
|----------------|---------|----------------|
| **Organização do trabalho** | Fases sequenciais (Req → Design → Impl → Teste → Deploy) | Por funcionalidades entregues incrementalmente em sprints |
| **Flexibilidade a mudanças** | Baixa — mudanças tardias têm alto custo | Alta — backlog repriorizado a cada sprint |
| **Entrega de valor** | Somente ao final do projeto | A cada sprint (valor incremental) |
| **Feedback do cliente** | Tardio — apenas na aceitação final | Contínuo — Sprint Review quinzenal |
| **Visibilidade do progresso** | Baixa durante o desenvolvimento | Alta — board Scrumban e métricas de sprint |
| **Adequação a requisitos parcialmente definidos** | Baixa — exige especificação completa no início | Alta — detalhamento progressivo ao longo do projeto |
| **Gestão de risco** | Riscos identificados tardiamente | Riscos identificados e tratados sprint a sprint |
| **Documentação** | Pesada — toda antes da implementação | Leve e incremental — atualizada ao longo do desenvolvimento |
| **Adequação a equipes acadêmicas** | Baixa — difícil de adaptar ao ritmo de disciplina | Alta — sprints mapeáveis a entregas por unidade acadêmica |
| **Rastreabilidade de features** | Via documentação de requisitos estática | Via GitHub Issues e PRs com critérios de aceite versionados |

---

## 3.2 Metodologias Adotadas

### 3.2.1 Gestão de Produto — FDD (Feature Driven Development)

O FDD organiza o desenvolvimento em torno de **funcionalidades** do produto, com foco em entregas concretas e rastreáveis. As 5 etapas do FDD serão seguidas:

| Etapa | Atividade |
|-------|-----------|
| 1 | **Desenvolver Modelo Geral** — Modelagem de alto nível do domínio |
| 2 | **Construir Lista de Funcionalidades** — Identificação e catalogação das features |
| 3 | **Planejar por Funcionalidade** — Priorização e sequenciamento das features |
| 4 | **Projetar por Funcionalidade** — Design técnico de cada feature antes da implementação |
| 5 | **Construir por Funcionalidade** — Implementação e entrega de cada feature |

A lista de funcionalidades do FDD está diretamente mapeada nas **Características do Produto (CP01–CP15)** definidas na seção 2.3, permitindo rastreabilidade direta entre planejamento e implementação.

### 3.2.2 Gestão de Equipe — Scrumban

A equipe combina **Scrum** (estrutura de sprints e cerimônias) com **Kanban** (fluxo visual contínuo), formando o **Scrumban**:

| Dimensão | Detalhe |
|----------|---------|
| Duração dos Sprints | 2 semanas |
| Board de Acompanhamento | GitHub Projects (colunas: Backlog → In Progress → Review → Done) |
| Cerimônias | Planning, Review e Retrospectiva ao final de cada sprint |
| Backlog | Gerenciado pelo Product Owner no GitHub Issues |
| Limite de WIP | Máximo de 2 tarefas em progresso por membro simultaneamente |

---

## 3.3 Justificativa das Metodologias

A combinação de **FDD + Scrumban** é a escolha mais adequada para o projeto Crianex pelos seguintes motivos:

### Alinhamento com o Contexto do Projeto

| Fator | Como FDD + Scrumban Atende |
|-------|---------------------------|
| **Prazo acadêmico definido** | Sprints de 2 semanas mapeiam diretamente às entregas por unidade, com marcos claros e previsíveis |
| **Equipe distribuída de 7 membros** | Cerimônias do Scrumban criam pontos de sincronização regulares sem sobrecarregar o time com processos pesados |
| **Requisitos parcialmente definidos** | Refinamento incremental do backlog permite descobrir detalhes ao longo do projeto com o PO |
| **Dois módulos integrados** | FDD organiza as features por módulo, facilitando o planejamento de dependências entre Área Adm. e Vitrine |
| **Rastreabilidade para entrega acadêmica** | GitHub Issues + PRs vinculados a CPs fornecem trilha auditável de todas as entregas |

### Por que não Scrum puro

O Scrum puro com sprints fechadas e backlog estático cria rigidez desnecessária para um contexto onde os requisitos ainda estão sendo refinados com o cliente. O Kanban visual do Scrumban permite que tarefas de suporte (documentação, infraestrutura, reviews) fluam continuamente sem travar o sprint.

### Por que não Kanban puro

O Kanban puro sem cerimônias estruturadas (Planning, Review, Retro) reduz a previsibilidade das entregas e dificulta a validação regular com o PO e os stakeholders da Crianex. As cerimônias do Scrum garantem que o produto evolua alinhado às expectativas do cliente.

---

## 3.4 Papéis e Responsabilidades da Equipe

| Papel | Membro(s) | Responsabilidade |
|-------|-----------|-----------------|
| **Product Owner (PO)** | Otávio / Vitor | Interface com o cliente, gestão do backlog, validação de entregas |
| **Tech Lead** | Lucas A. Zanetti | Coordenação técnica, arquitetura, revisão de código e cronograma |
| **QA (Quality Assurance)** | Philipe, Heitor | Revisão de Pull Requests, critérios de aceite, testes |
| **Dev Team** | Hugo, Camile, Leonardo, Philipe, Heitor | Desenvolvimento das funcionalidades do produto |

### Fluxo de Trabalho

```
PO (backlog) → Dev Team (implementação) → QA (revisão PR) → Tech Lead (merge) → Deploy
```

### Canais de Comunicação

| Canal | Finalidade |
|-------|-----------|
| Discord | Comunicação principal — organizado por categorias: Backlogs, Knowledge, Gravações, Arquitetura |
| GitHub Projects | Board visual de tarefas (Scrumban) |
| GitHub Issues | Registro de user stories, bugs e tarefas |
| GitHub Pull Requests | Code review, aprovação QA |
