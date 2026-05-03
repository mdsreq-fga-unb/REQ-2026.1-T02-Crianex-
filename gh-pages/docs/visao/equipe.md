# 6. Interação Equipe-Cliente

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 11/04/2026 | Criação das seções 6.1 a 6.6 | Lucas A. Zanetti |
| 1.1 | 13/04/2026 | Revisão das seções 6.1 a 6.6 | Equipe Crianex |

---

## 6.1 Composição da Equipe

Os papéis seguem o modelo FDD + Kanban adotado pela equipe. Cada integrante pode acumular mais de um papel; as responsabilidades, no entanto, permanecem individuais e rastreáveis.

| Integrante | Papel FDD | Responsabilidades Principais | Disponibilidade |
|---|---|---|---|
| **Lucas Andrade Zanetti** | Project Manager · Chief Architect · Strategic Technical Contributor | Conduz Replenishment e Iteration Commitment; mantém roadmap no Miro; arbitra decisões arquiteturais; interface principal com o cliente acadêmico; garante datas-limite das unidades | 10–11 h/sem |
| **Heitor Macedo Ricardo** | Development Manager · Chief Programmer | Coordena progresso técnico da iteração; acompanha board diariamente; desbloqueia issues em até 24 h; conduz Technical Design Review; lidera Build & Integrate (FDD etapa 5) | 5–8 h/sem |
| **Leonardo Fachinello Bonetti** | Chief Programmer · Development Manager (backup) · Class Owner | Conduz Design Review; aprova PRs estruturais; mentora decisões técnicas; responsável por infra e Kubernetes | 5–8 h/sem |
| **Philipe Amancio Reis Caetano** | Chief Programmer · Class Owner | Conduz Design Review; aprova PRs estruturais; implementação frontend e QA | até 4 h/sem |
| **Hugo Freitas Silva** | Class Owner | Implementação backend; code review; atualização do board em tempo real | até 4 h/sem |
| **Camile Barbosa Gonzaga de Oliveira** | Class Owner · Documentation Lead · Requirements Custodian | Atualização do GH Pages e Documento de Visão; gestão dos artefatos de ER (feature cards, critérios de aceite, rastreabilidade); consolidação de evidências por iteração | até 4 h/sem |

**Papéis rotativos por iteração**

| Papel | Responsabilidade |
|---|---|
| **Facilitador Metodológico** | Conduz cerimônias semanais; garante adesão ao processo; sinaliza desvios na retrospectiva |
| **Responsável por Validação** | Coordena Partial e Formal Client Validation com Otavio; prepara checklists e materiais de demo; documenta aprovações nas issues |

---

## 6.2 Estrutura de Comunicação

Cada ferramenta tem escopo exclusivo — o que vai para o Miro não vai para o Discord, e vice-versa. Isso evita decisões tomadas no canal errado e mantém rastreabilidade.

### Ferramentas de Comunicação

| Ferramenta | Tipo | Finalidade | Frequência |
|---|---|---|---|
| **Miro** | Assíncrono + Síncrono | Gestão estratégica e visual: roadmap IT1–IT5, backlog macro por iteração, Feature Cards, Iteration Goal, modelo de domínio, atas de cerimônias, lições aprendidas | Contínuo |
| **GitHub Projects (Kanban)** | Assíncrono | Acompanhamento operacional de issues: features e subfeatures fluindo pelas colunas Backlog → Done; WIP limit visível | Contínuo |
| **GitHub (repositório)** | Assíncrono | Código-fonte, Pull Requests, code review, CI/CD, evidências de execução nos comentários das issues | Por entrega |
| **GitHub Pages (MkDocs)** | Assíncrono | Documento de Visão, rastreabilidade OE → CP → Feature, artefatos formais das unidades | Por iteração |
| **Discord** | Assíncrono + Síncrono | Comunicação do dia a dia, dúvidas técnicas, Midweek Sync assíncrono ("Ontem fiz / Hoje farei / Bloqueios") | Diário |
| **Google Meet** | Síncrono | Cerimônias formais: Replenishment, Iteration Commitment, Formal Client Validation, Retrospectiva | Por iteração |
| **WhatsApp** | Assíncrono | Canal direto com Otavio (CTO Crianex) para validações parciais rápidas e alinhamentos urgentes | Sob demanda |

---

## 6.3 Cadência de Cerimônias

| Cerimônia | Frequência | Participantes | Duração | Objetivo |
|-----------|-----------|---------------|---------|---------|
| **Sprint Planning** | Quinzenal (início de sprint) | Toda a equipe + PO | 1h | Priorizar e detalhar as user stories da próxima sprint |
| **Daily Stand-up** | Diário (assíncrono via Discord) | Toda a equipe | 15 min | O que foi feito, o que será feito, impedimentos |
| **Sprint Review** | Quinzenal (fim de sprint) | Toda a equipe + PO + cliente | 1h | Demonstrar as entregas e validar com o cliente |
| **Sprint Retrospectiva** | Quinzenal (fim de sprint) | Equipe de desenvolvimento | 45 min | Identificar melhorias de processo para o próximo sprint |
| **Backlog Refinement** | Semanal | PO + Tech Lead | 30 min | É um processo contínuo no Scrum, no qual o Dono do Produto e a Equipe de Desenvolvimento colaboram para revisar, atualizar e esclarecer itens no Backlog do Produto, garantindo que estejam prontos para as próximas sprints.|

---

## 6.4 Processo de Validação com o Cliente

O Product Owner atua como interface direta com os representantes da Crianex (Otávio / Vitor), sendo responsável por:

1. **Coletar requisitos** e transformá-los em user stories no backlog
2. **Priorizar** o backlog conforme o valor de negócio
3. **Validar entregas** ao final de cada sprint na Sprint Review
4. **Comunicar feedback** do cliente para a equipe técnica

### Critérios de Prontidão e Conclusão

| Critério | Verificado por | Quando |
|----------|---------------|--------|
| Story com critérios de aceite claros (DoR) | PO + Tech Lead | Sprint Planning |
| Implementação conforme critérios de aceite (DoD) | QA | Durante a sprint |
| Aprovação de PR por QA (DoD) | QA | Antes do merge |
| Validação funcional pelo PO (DoD) | PO | Sprint Review |

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

### Fluxo de Validação

```
Cliente → PO → Backlog refinado → Sprint → Entrega → Sprint Review → Validação do Cliente
                                                                          ↓
                                                               Feedback incorporado
                                                               no próximo backlog
```

---

## 6.5 Gestão de Mudanças de Requisitos

Mudanças de requisitos são gerenciadas pelo PO em conjunto com o Tech Lead:

| Tipo de Mudança | Processo |
|-----------------|---------|
| Pequeno ajuste em story existente | PO atualiza a issue no GitHub, comunica no Discord |
| Nova feature de média prioridade | PO cria nova issue, prioriza no backlog, entra no próximo sprint planning |
| Mudança de escopo significativa | Reunião de alinhamento com toda a equipe e aprovação do Tech Lead |
| Remoção de feature do escopo | PO fecha a issue com justificativa documentada |

---

## 6.6 Riscos de Comunicação

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| PO indisponível para validação | Média | Alto | Decisões urgentes podem ser tomadas pelo Tech Lead com registro documentado; PO valida retroativamente na próxima cerimônia |
| Requisito mal interpretado pela equipe | Média | Médio | DoR rigorosa exige critérios de aceite antes de iniciar a implementação; refinamento semanal de backlog |
| Sobrecarga de membros com outras disciplinas | Alta | Médio | Distribuição equilibrada de tarefas e comunicação proativa de impedimentos no daily stand-up |
| Falta de feedback do cliente em tempo hábil | Baixa | Alto | PO estabelece SLA de resposta com o cliente no início do projeto; decisões não bloqueantes são tomadas pelo PO |
| Divergência entre expectativa do cliente e entrega | Baixa | Alto | Sprint Reviews regulares com demonstração ao vivo garantem alinhamento contínuo |
