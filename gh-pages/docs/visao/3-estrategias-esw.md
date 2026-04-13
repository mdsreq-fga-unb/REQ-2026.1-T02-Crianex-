# 3 — Estratégias de Engenharia de Software

---

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 12/04/2026 | Criação das seções 3.1, 3.2 e 3.3 | Camile e Leonardo |

---

!!! warning "Em andamento"
    Esta seção está sendo desenvolvida por **Camile e Leonardo**. Prazo: **12/04/2026**.

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

### 3.2.2 Gestão de Equipe — Scrumban

A equipe combina **Scrum** (estrutura de sprints e cerimônias) com **Kanban** (fluxo visual contínuo), formando o **Scrumban**:

| Dimensão | Detalhe |
|----------|---------|
| Duração dos Sprints | 2 semanas |
| Board de Acompanhamento | GitHub Projects (colunas: Backlog → In Progress → Review → Done) |
| Cerimônias | Planning, Review e Retrospectiva ao final de cada sprint |
| Backlog | Gerenciado pelo Product Owner no GitHub Issues |

---

## 3.3 Papéis e Responsabilidades da Equipe

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
