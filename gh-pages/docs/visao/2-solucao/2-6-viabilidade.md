# 2.6 Viabilidade do Projeto

Esta seção avalia a viabilidade do projeto Crianex sob três dimensões: **escopo acadêmico**, **capacidade técnica da equipe** e **riscos de infraestrutura**.

---

### 2.6.1 Viabilidade de Escopo — Semestre Acadêmico

O projeto precisa ser entregue dentro do cronograma da disciplina de Requisitos de Software (REQ-2026.1), organizado em 3 unidades com sprints quinzenais.

| Dimensão | Avaliação | Justificativa |
|----------|-----------|---------------|
| **Escopo do MVP** | Viável | As 15 características do produto (CP01–CP15) foram priorizadas com MoSCoW; o MVP cobre Must Have e Should Have até a Unidade 2 |
| **Prazo total** | Viável | 7 sprints de 2 semanas cobrem o desenvolvimento incremental sem necessidade de paralelismo excessivo |
| **Entregas incrementais** | Viável | A arquitetura modular (Área Adm. + Vitrine) permite entregas independentes por sprint |
| **Alinhamento acadêmico** | Alto | As entregas de cada unidade estão alinhadas aos critérios de avaliação da disciplina |

O escopo foi deliberadamente contido no MVP para garantir que as funcionalidades essenciais sejam entregues com qualidade dentro do prazo. Funcionalidades de menor prioridade (Could Have / Won't Have) foram explicitamente excluídas desta versão.

---

### 2.6.2 Viabilidade Técnica — Alinhamento de Skills da Equipe

A equipe é composta por 7 membros com experiência em tecnologias web modernas.

| Tecnologia | Nível de Familiaridade da Equipe | Risco | Mitigação |
|------------|----------------------------------|-------|-----------|
| **SvelteKit** | Médio (maioria conhece Vue/React; Svelte é novo para alguns) | Médio | Documentação excelente; curva de aprendizado curta — estimativa de 1 semana de onboarding |
| **TypeScript** | Alto (toda a equipe tem experiência prévia) | Baixo | — |
| **Express.js** | Alto | Baixo | — |
| **PostgreSQL** | Alto | Baixo | — |
| **Supabase** | Médio | Baixo | BaaS bem documentado; simplifica Auth, Storage e RLS sem necessidade de configuração de infraestrutura |
| **Kubernetes** | Baixo (infraestrutura gerenciada pela Crianex) | Médio | Ver seção 2.6.3 |

---

### 2.6.3 Viabilidade de Infraestrutura — Kubernetes e API da Crianex

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Indisponibilidade do cluster Kubernetes** | Baixa | Alto | Ambiente de desenvolvimento local com Docker Compose; deploy no Kubernetes apenas na Sprint 6 |
| **Alterações na API da Crianex sem aviso prévio** | Média | Médio | Contratos de API documentados via OpenAPI; versionamento de endpoints; comunicação direta com CTO |
| **Acesso ao cluster não liberado no prazo** | Média | Alto | Pipeline de CI/CD preparada antecipadamente; acesso solicitado com 2 sprints de antecedência |
| **Mudanças de requisitos de infraestrutura** | Baixa | Médio | PO mantém contato direto com a liderança da Crianex para alinhamento contínuo |

**Estratégia de mitigação principal:** o desenvolvimento é independente de infraestrutura até a Sprint 6. Todos os ambientes locais e de homologação usam Docker Compose.

---

### 2.6.4 Conclusão de Viabilidade

| Dimensão | Veredicto |
|----------|-----------|
| Escopo dentro do semestre acadêmico | **Viável** |
| Capacidade técnica da equipe | **Viável** (com onboarding em SvelteKit) |
| Infraestrutura Kubernetes | **Viável com risco gerenciado** |
| **Veredicto geral** | **Projeto viável para execução** |
