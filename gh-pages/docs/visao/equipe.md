# 6. Interação Equipe-Cliente

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 11/04/2026 | Criação das seções 6.1 a 6.6 | Lucas A. Zanetti |
| 1.1 | 13/04/2026 | Revisão das seções 6.1 a 6.6 | Equipe Crianex |
| 1.2 | 05/05/2026 | Alinhamento das seções 6.2, 6.3 e 6.4 ao processo FDD | Leonardo Bonetti |

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

Cada ferramenta tem escopo exclusivo — o que vai para o Miro não vai para o Discord, e vice-versa. Isso evita decisões tomadas no canal errado e mantém rastreabilidade plena dos artefatos.

### Ferramentas de Comunicação

| Ferramenta | Tipo | Finalidade | Frequência |
|---|---|---|---|
| **Miro** | Assíncrono + Síncrono | Gestão visual do processo FDD: roadmap de iterações (IT1–IT4), Feature List por iteração, Feature Cards, Iteration Goal, modelo de domínio (Overall Model), atas de cerimônias e lições aprendidas | Contínuo |
| **GitHub Projects (Feature Tracking)** | Assíncrono | Rastreamento operacional do progresso das features: Feature Cards fluindo pelas etapas FDD (Design → Code → Inspect → Done); evidências de progresso nas issues | Contínuo |
| **GitHub (repositório)** | Assíncrono | Código-fonte, Pull Requests, Code Inspections, CI/CD, rastreabilidade de features via commits e comentários de issues | Por feature |
| **GitHub Pages (MkDocs)** | Assíncrono | Documento de Visão, rastreabilidade OE → CP → Feature, Feature List formal, artefatos das unidades | Por iteração |
| **Discord** | Assíncrono + Síncrono | Comunicação do dia a dia, dúvidas técnicas, Midweek Sync assíncrono de progresso de features ("Feature X: Design feito / Code em andamento / Bloqueios") | Diário |
| **Google Meet** | Síncrono | Cerimônias formais: Replenishment Meeting, Iteration Commitment, Technical Design Review, Formal Client Validation, Retrospectiva de Iteração | Por iteração / por feature |
| **WhatsApp** | Assíncrono | Canal direto com Otávio (Domain Expert / CTO Crianex) para Partial Client Validations rápidas e alinhamentos urgentes sobre requisitos | Sob demanda |

---

## 6.3 Cadência de Cerimônias

| Cerimônia | Frequência | Participantes | Duração | Objetivo |
|-----------|-----------|---------------|---------|---------|
| **Replenishment Meeting** | Quinzenal (início de iteração) | Project Manager + Development Manager + Chief Programmers | 30 min | Selecionar da Feature List as features que entram na iteração, respeitando dependências e capacidade da equipe |
| **Iteration Commitment Meeting** | Quinzenal (início de iteração) | Toda a equipe | 30 min | Equipe revisa e se compromete formalmente com o Iteration Goal; Class Owners são designados por feature |
| **Daily Stand-up** | Diário (assíncrono via Discord) | Toda a equipe | 15 min | Atualização de progresso por feature no formato FDD: etapa atual (Design / Code / Inspect), bloqueios e próxima ação |
| **Technical Design Review** | Por feature (conforme necessário) | Chief Programmer + Class Owners da feature | 30–45 min | Revisar e aprovar o design package antes de iniciar a implementação |
| **Code Inspection** | Por feature (antes do merge) | Chief Programmer + Class Owners | 20–30 min | Inspeção formal do código produzido para a feature; pré-requisito para marcar a feature como Done |
| **Partial Client Validation** | Sob demanda (durante iteração) | Domain Expert (Otávio/Vitor) + Project Manager | 30 min | Validação informal de features em andamento; coleta antecipada de feedback para evitar retrabalho ao final |
| **Formal Client Validation** | Quinzenal (fim de iteração) | Toda a equipe + Domain Experts (Otávio e Vitor) | 1h | Demonstração das features completadas na iteração; aprovação formal e registro de feedback para a próxima Feature List |
| **Retrospectiva de Iteração** | Quinzenal (fim de iteração) | Equipe de desenvolvimento | 45 min | Avaliar adesão ao processo FDD, identificar impedimentos recorrentes e definir melhorias para a próxima iteração |

---

## 6.4 Processo de Validação com o Cliente

No FDD, os **Domain Experts** (Otávio e Vitor, representantes da Crianex) participam ativamente em dois momentos distintos do ciclo iterativo: como fonte de conhecimento de domínio durante o design das features e como validadores formais ao final de cada iteração.

O **Project Manager** atua como interface principal com os Domain Experts, sendo responsável por:

1. **Elicitar requisitos de domínio** junto aos Domain Experts e traduzi-los em features na Feature List
2. **Priorizar a Feature List** conforme valor de negócio e dependências técnicas
3. **Convocar Partial Client Validations** durante a iteração para antecipar desvios
4. **Conduzir a Formal Client Validation** ao final de cada iteração com demonstração das features concluídas
5. **Registrar o feedback** nas issues do GitHub e atualizar a Feature List para a próxima iteração

### Critérios de Prontidão e Conclusão

| Critério | Verificado por | Quando |
|----------|---------------|--------|
| Feature descrita com critérios de aceite claros | Chief Programmer + Domain Expert | Replenishment Meeting |
| Design package aprovado | Chief Programmer + Class Owners | Technical Design Review |
| Código inspecionado e aprovado | Chief Programmer + Class Owners | Code Inspection |
| Feature validada funcionalmente pelos Domain Experts | Domain Expert (Otávio/Vitor) | Formal Client Validation |

### Definition of Ready (DoR)

Uma feature está **pronta para entrar em Design by Feature** quando:

- [ ] Está descrita no formato de feature FDD: `<ação> o/a <resultado> do/da <objeto>`
- [ ] Possui critérios de aceite claros e testáveis, revisados com o Domain Expert
- [ ] Pertence a um conjunto de funcionalidades priorizado para a iteração
- [ ] Não possui dependências bloqueantes não resolvidas com outras features
- [ ] O Class Owner responsável pela implementação foi designado

### Definition of Done (DoD)

Uma feature está **concluída** quando:

- [ ] O design package foi produzido e aprovado no Technical Design Review
- [ ] O código foi implementado conforme os critérios de aceite da feature
- [ ] A Code Inspection foi realizada e aprovada pelo Chief Programmer
- [ ] O Pull Request foi mergeado na branch principal
- [ ] A feature foi demonstrada e aprovada pelo Domain Expert na Formal Client Validation
- [ ] O Feature Card no GitHub Projects foi atualizado para **Done**
- [ ] A rastreabilidade OE → CP → Feature está documentada no GitHub Pages

### Fluxo de Validação

```
[ Domain Expert ]
       │ (Define as necessidades de negócio)
       ▼
[ Feature List ] ◄─────────────────────────────────────────┐
       │ (Priorização quinzenal)                           │
       ▼                                                   │
[ Replenishment ]                                          │
       │ (Decomposição técnica)                            │
       ▼                                                   │
[ Design by Feature ]                                      │
       │ (Aprovação da arquitetura)                        │
       ▼                                                   │
[ Build by Feature ]                                       │
       │                                                   │
       ├─► [ Partial Client Validation ] (Durante a iteração)
       │                                                   │
       ▼                                                   │
[ Formal Client Validation ] (Fim da iteração)             │
       │ (Gera ajustes e novos requisitos)                 │
       ▼                                                   │
[ Feedback Incorporado ] ──────────────────────────────────┘
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
