# 3.1 Ciclo de Vida e Abordagem de Desenvolvimento

O projeto Crianex adota uma abordagem **Ágil** com ciclo de vida **Iterativo e Incremental**, permitindo entregas frequentes de valor, adaptação contínua a mudanças de requisitos e feedback regular dos stakeholders.

---

### Justificativa da Abordagem

| Critério | Escolha | Justificativa |
|----------|---------|---------------|
| Complexidade do Produto | Alta | Dois módulos integrados (Área Adm. + Vitrine) com múltiplos perfis de usuário |
| Requisitos | Parcialmente estáveis | Definidos em alto nível; detalhes serão refinados iterativamente com o cliente |
| Tamanho da Equipe | Pequena (7 membros) | Times ágeis menores se beneficiam de ciclos curtos e comunicação direta |
| Prazo | Definido por unidades acadêmicas | Entregas incrementais alinham-se ao cronograma da disciplina |

---

### Comparativo: Cascata vs. FDD + Scrumban

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
