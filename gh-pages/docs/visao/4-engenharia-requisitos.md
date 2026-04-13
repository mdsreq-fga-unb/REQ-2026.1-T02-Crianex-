# 4. Engenharia de Requisitos

---

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 12/04/2026 | Criação das seções 4.1 e 4.2 | Heitor |

---

## 4.1 Abordagem de Engenharia de Requisitos

O projeto Crianex adota uma abordagem **ágil de engenharia de requisitos**, alinhada ao ciclo de vida iterativo e incremental e às práticas do FDD. Os requisitos são levantados, refinados e priorizados continuamente ao longo das sprints.

### Atividades de Requisitos

| Atividade | Descrição | Técnicas Utilizadas | Quando |
|-----------|-----------|---------------------|--------|
| **Elicitação** | Levantamento das necessidades reais do cliente e dos usuários | Entrevistas com PO e stakeholders, análise de problemas (Ishikawa, Rich Picture), observação do contexto operacional da Crianex | Início de projeto e início de cada sprint |
| **Análise e Negociação** | Refinamento das user stories, identificação de conflitos e dependências, negociação de prioridades | MoSCoW, backlog refinement com PO e equipe, matriz de rastreabilidade | Durante o sprint planning |
| **Declaração (Especificação)** | Escrita formal dos requisitos em formato estruturado | User stories no padrão "Como [perfil], quero [ação], para [benefício]" com critérios de aceite; GitHub Issues como artefato vivo | Durante e pré-sprint |
| **Representação** | Representação visual dos requisitos e do sistema | Rich Picture, Diagrama de Ishikawa, Mapa de Stakeholders, protótipos/mockups de tela (quando aplicável) | Início de projeto; antes de sprints com novas features |
| **Verificação** | Checagem de que os requisitos foram implementados corretamente | Code review por QA via Pull Requests, revisão de critérios de aceite, testes de aceite manuais | Durante e ao final de cada sprint |
| **Organização e Gerência** | Rastreabilidade, versionamento e controle de mudanças dos requisitos | GitHub Issues (rastreamento), GitHub Projects (board), PRs vinculados a issues, histórico de revisão nos documentos | Contínuo ao longo do projeto |

### Priorização — MoSCoW

Os requisitos são priorizados usando a técnica **MoSCoW**:

| Prioridade | Significado | Aplicação no Crianex |
|------------|-------------|---------------------|
| **Must Have** | Essencial para o MVP — sem isso o produto não funciona | CP01–CP05, CP09, CP10, CP12 |
| **Should Have** | Importante, mas não crítico para o lançamento inicial | CP06, CP07, CP11, CP13, CP14 |
| **Could Have** | Desejável, implementado se houver capacidade | CP08, CP15 |
| **Won't Have** | Fora do escopo desta versão | Integrações externas, módulo financeiro, app mobile |

---

## 4.2 Alinhamento FDD – Engenharia de Requisitos

O FDD (Feature Driven Development) possui etapas que mapeiam diretamente para as atividades de ER. A tabela abaixo mostra como as práticas se complementam:

| Etapa do FDD | Atividade de ER Correspondente | Artefato Gerado |
|--------------|-------------------------------|-----------------|
| 1 — Desenvolver Modelo Geral | Elicitação + Representação | Rich Picture, Ishikawa, Mapa de Stakeholders |
| 2 — Construir Lista de Funcionalidades | Declaração + Análise | Backlog inicial com CPs (CP01–CP15), user stories no GitHub Issues |
| 3 — Planejar por Funcionalidade | Organização + Priorização | Roadmap de sprints, MoSCoW aplicado ao backlog |
| 4 — Projetar por Funcionalidade | Representação + Verificação | Mockups, protótipos, critérios de aceite detalhados |
| 5 — Construir por Funcionalidade | Verificação + Validação | Pull Requests, testes de aceite, Sprint Review |

---

## 4.3 Definition of Ready (DoR) e Definition of Done (DoD)

### Definition of Ready (DoR)

Uma user story está **pronta para entrar no sprint** quando:

- [ ] Está escrita no formato "Como [perfil], quero [ação], para [benefício]"
- [ ] Possui critérios de aceite claros e testáveis
- [ ] Foi priorizada pelo PO no backlog
- [ ] Não possui dependências bloqueantes não resolvidas
- [ ] Foi estimada pela equipe (pontos de esforço)
- [ ] O mockup ou fluxo de tela está disponível (quando aplicável)

### Definition of Done (DoD)

Uma user story está **concluída** quando:

- [ ] O código foi implementado conforme os critérios de aceite
- [ ] Testes unitários e/ou de integração foram escritos e passam
- [ ] O Pull Request foi revisado e aprovado pelo QA
- [ ] O código foi mergeado na branch principal (via PR aprovado)
- [ ] A funcionalidade foi validada pelo PO na Sprint Review
- [ ] A documentação relevante foi atualizada (quando aplicável)
- [ ] Não há regressões identificadas em funcionalidades existentes

---

## 4.4 Tabela Consolidada de Engenharia de Requisitos

| Atividade de ER | Abordagem | Ferramenta / Artefato | Responsável |
|-----------------|-----------|----------------------|-------------|
| Elicitação | Entrevistas com PO, análise de problema | Notas de reunião, atas, Ishikawa, Rich Picture | PO + Equipe |
| Análise e Negociação | Refinamento de backlog com PO e equipe | GitHub Issues, reuniões de sprint planning | PO + Tech Lead |
| Declaração | User stories com critérios de aceite | GitHub Issues (formato padronizado) | PO |
| Representação | Diagramas e mockups | Rich Picture, protótipos de tela | Tech Lead + Dev |
| Verificação | Code review por QA | Pull Requests no GitHub | QA (Philipe, Heitor) |
| Validação | Sprint Review com PO | Demonstração ao vivo, feedback do cliente | Toda a equipe |
| Gerência de Requisitos | Rastreabilidade via issues e PRs | GitHub Projects, GitHub Issues, histórico de revisão | Tech Lead |
