# 8. Engenharia de Requisitos

---

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 12/04/2026 | Criação das seções 4.1 e 4.2 | Heitor |

---

!!! warning "Em andamento"
    Esta seção está sendo desenvolvida por **Heitor**. Prazo: **12/04/2026**.

---

## 4.1 Abordagem de Engenharia de Requisitos

O projeto Crianex adota uma abordagem **ágil de engenharia de requisitos**, alinhada ao ciclo de vida iterativo e incremental e às práticas do FDD. Os requisitos são levantados, refinados e priorizados continuamente ao longo das sprints.

### Atividades de Requisitos

| Atividade | Descrição | Quando |
|-----------|-----------|--------|
| **Elicitação** | Entrevistas com PO e stakeholders, análise de problemas (Ishikawa, Rich Picture) | Início de projeto e início de cada sprint |
| **Análise** | Refinamento das user stories, identificação de conflitos e dependências | Durante o sprint planning |
| **Especificação** | Escrita de user stories no padrão "Como [perfil], quero [ação], para [benefício]" com critérios de aceite | Durante e pré-sprint |
| **Verificação e Validação** | Code review (QA) e validação com PO ao final de cada sprint (Sprint Review) | Ao final de cada sprint |

### Priorização — MoSCoW

Os requisitos são priorizados usando a técnica **MoSCoW**:

| Prioridade | Significado |
|------------|-------------|
| **Must Have** | Essencial para o MVP — sem isso o produto não funciona |
| **Should Have** | Importante, mas não crítico para o lançamento inicial |
| **Could Have** | Desejável, implementado se houver capacidade |
| **Won't Have** | Fora do escopo desta versão |

---

## 4.2 Definition of Ready (DoR) e Definition of Done (DoD)

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

## Tabela de Engenharia de Requisitos

| Atividade de ER | Abordagem | Ferramenta/Artefato |
|-----------------|-----------|---------------------|
| Elicitação | Entrevistas com PO, análise de problema | Notas de reunião, Atas, Ishikawa |
| Análise e Negociação | Refinamento de backlog com PO e equipe | GitHub Issues, reuniões de sprint planning |
| Especificação | User stories com critérios de aceite | GitHub Issues (formato padronizado) |
| Verificação | Code review por QA | Pull Requests no GitHub |
| Validação | Sprint Review com PO | Demonstração ao vivo, feedback do cliente |
| Gerência de Requisitos | Rastreabilidade via issues e PRs | GitHub Projects, GitHub Issues |
