# IT2 — Resultados de V&V

Registro formal das mudanças de processo e cronograma identificadas durante a IT2, decorrentes do adiamento do prazo final da disciplina comunicado pelo professor em 18/06/2026.

- **Estratégia:** Verificação
- **Técnica:** Análise de rastreabilidade e Inspeção

> **Legenda:** <span className="badge badge--green">Aplicado</span> aplicado · <span className="badge badge--yellow">Pendente</span> pendente de aplicação · <span className="badge badge--red">Crítico</span> achado crítico · <span className="badge badge--yellow">Atenção</span> achado de atenção

---

## 1. Mudanças de Processo

<details className="crianex-change" id="mp03">
<summary><span className="crianex-change__id">MP.03</span> <span className="crianex-change__sum">Adiamento do prazo final da disciplina — Unidade 4 passa a ser a última entrega</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MP.03 — Adiamento do Prazo Final da Disciplina**

| Campo         | Conteúdo                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **De**        | Calendário previa entregas acadêmicas até a Unidade 4 (29/06–07/07), com possibilidade de uma IT3 executada em paralelo/sequência ainda dentro da disciplina               |
| **Para**      | O professor adiou o prazo final da disciplina. A **Unidade 4 passa a ser a última entrega acadêmica do semestre** — não há mais nenhuma unidade prevista além dela          |
| **Motivação** | Comunicação do professor George Marsicano em 18/06/2026 sobre adiamento do tempo de entrega da atividade                                                                   |
| **Impacto**   | Recalendarização de IT2 (encerramento) e da Unidade 4; pausa da IT3                                                                                                         |
| **Status**    | <span className="badge badge--green">Aplicado</span> em [Cronograma 5.2/5.6](/visao/cronograma#iteracoes)                                                                                     |

</div>
</details>

<details className="crianex-change" id="mp04">
<summary><span className="crianex-change__id">MP.04</span> <span className="crianex-change__sum">IT3 — Núcleo Operacional pausada (sem janela dentro da disciplina)</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MP.04 — Pausa da IT3 — Núcleo Operacional**

| Campo         | Conteúdo                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **De**        | IT3 planejada para iniciar em 29/06, em sequência imediata à IT2, com requisitos não priorizados ("extra")                                                |
| **Para**      | IT3 **pausada** — sem data prevista dentro da disciplina. Poderá ser executada **pós-disciplina**, caso a equipe e o cliente decidam continuar o projeto |
| **Motivação** | Sem janela de tempo remanescente no semestre após o adiamento (MP.03) para iniciar uma terceira iteração                                                  |
| **Impacto**   | CP2, CP3 e CP7 (Núcleo Operacional) não serão entregues nem validados dentro da disciplina                                                                |
| **Status**    | <span className="badge badge--green">Aplicado</span> Atualizado em [IT3 — Resumo](/iteracoes/iteracao-3/) e [Iterações — Visão Geral](/iteracoes/)                                                          |

</div>
</details>

<details className="crianex-change" id="mp05">
<summary><span className="crianex-change__id">MP.05</span> <span className="crianex-change__sum">Extensão da IT2 de 28/06 para 30/06, com remarcação de Validação e Artifact Closure</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MP.05 — Extensão da IT2**

| Campo         | Conteúdo                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **De**        | IT2 com término em 28/06: Partial + Formal Client Validation em 27/06, Iteration Artifact Closure em 28/06                   |
| **Para**      | IT2 estendida até **30/06**: Partial Client Validation em 27/06, **Formal Client Validation em 29/06**, **Iteration Artifact Closure em 30/06** |
| **Motivação** | Folga adicional de 2 dias liberada pelo adiamento do prazo final (MP.03), usada para consolidar a entrega da IT2 com mais segurança |
| **Status**    | <span className="badge badge--green">Aplicado</span> em [Cronograma 5.6 — Calendário (Junho)](/visao/cronograma#calendario)                                |

</div>
</details>

<details className="crianex-change" id="mp06">
<summary><span className="crianex-change__id">MP.06</span> <span className="crianex-change__sum">Gravação e apresentações da Unidade 4 remarcadas (gravação 01/07, apresentações 02–09/07)</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MP.06 — Remarcação da Unidade 4**

| Campo         | Conteúdo                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **De**        | Gravação do vídeo em 06/07; apresentações em 07, 08 e 09/07                                                                                        |
| **Para**      | **Gravação do vídeo e preparação dos slides em 01/07**; **apresentações de 02/07 até 09/07**                                                       |
| **Motivação** | Alinhamento ao novo prazo final comunicado pelo professor em 18/06/2026                                                                            |
| **Status**    | <span className="badge badge--green">Aplicado</span> em [Cronograma 5.6 — Calendário (Julho)](/visao/cronograma#calendario) e em [Entrega — Unidade 4](/entregas/unidade-4) |

</div>
</details>

---

## 2. Mudanças de Requisitos

Registro da auditoria de rastreabilidade realizada em 01/07/2026 sobre as features F07, F08, F19, F20 e F21 (IT2 — CP1 e CP9), decorrente da conclusão da implementação dessas features. Cobre: status atualizado (Em andamento → Concluída), requisitos funcionais novos identificados a partir de capacidades já implementadas mas não documentadas, um critério de aceite existente revisado, e dois achados de auditoria (itens em aberto) a levar para a próxima reunião de refinamento.

<details className="crianex-change" id="mr01">
<summary><span className="crianex-change__id">MR.01</span> <span className="crianex-change__sum">Achados de auditoria — ACs marcados concluídos sem implementação/documentação correspondente</span> <span className="badge badge--green">Concluído</span></summary>
<div className="crianex-change__body">

**MR.01 — Descasamentos entre AC documentado e comportamento real**

| Campo         | Conteúdo                                                                                                                                                                                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Achado 1**  | [RF36](/iteracoes/iteracao-2/features/f19?tab=rf36) (F19) tinha um AC marcado concluído — *"Dado cliente/lead inativo, quando reativar, então volta ao fluxo ativo"* — mas **não existia reativação implementada** (nem endpoint, nem UI); só a inativação (soft-delete) existia.                                        |
| **Achado 2**  | [RF53](/iteracoes/iteracao-2/features/f21?tab=rf53) (F21) e [RN22](/backlog/requisitos#rns) descreviam remoção de interação comercial como **exclusão permanente (hard-delete)**. A implementação real sempre foi **remoção lógica (soft-delete, `removed=true`)** — preserva o histórico, comportamento mais seguro, mas divergia do texto documentado.                |
| **Motivação** | Auditoria de rastreabilidade realizada ao atualizar o status de F07/F08/F19/F20/F21 para Concluída — comparação linha a linha entre AC documentado e código implementado.                                                                                                                                            |
| **Resolução** | **Achado 1:** reativação de lead implementada em 01/07/2026 — `POST /api/admin/crm/clients/:id/reactivate` + `GET /api/admin/crm/clients/inactive` no backend, e um painel "Leads inativos" no CRM (`admin/crm`) com ação de reativar por lead. **Achado 2:** optou-se pela correção recomendada — o texto de RF53/RN22 foi corrigido para descrever soft-delete, já que é o comportamento mais seguro e o que está implementado; nenhuma mudança de código foi necessária para este achado. |
| **Status**    | <span className="badge badge--green">Concluído</span> em 01/07/2026 — [F19 — RF36](/iteracoes/iteracao-2/features/f19?tab=rf36) e [F21 — RF53](/iteracoes/iteracao-2/features/f21?tab=rf53) atualizados e consistentes com o código                                                                                                        |

</div>
</details>

<details className="crianex-change" id="mr02">
<summary><span className="crianex-change__id">MR.02</span> <span className="crianex-change__sum">RF60–RF62 novos — busca, filtros, exportação CSV, tabela e indicadores do CRM (F19)</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MR.02 — Novos Requisitos Funcionais de F19**

| Campo         | Conteúdo                                                                                                                                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **De**        | F19 cobria apenas CRUD de leads (RF35, RF36, RF37, RF41) — sem nenhum RF de consulta, filtro ou exportação, apesar de o protótipo de alta fidelidade do CRM já prever busca, filtros por produto/pessoa, exportação CSV, visualização em tabela e mini-dashboard. |
| **Para**      | Três RFs novos, mesmo nível de abstração dos RFs existentes de F19 (um por capacidade, seguindo o padrão de RF52/RF19 no restante do catálogo): **RF60** — Filtrar e buscar leads no CRM · **RF61** — Exportar leads do CRM em CSV · **RF62** — Visualizar leads em tabela e indicadores do funil. Critérios de aceite BDD completos em [F19 — RF60](/iteracoes/iteracao-2/features/f19?tab=rf60) / [RF61](/iteracoes/iteracao-2/features/f19?tab=rf61) / [RF62](/iteracoes/iteracao-2/features/f19?tab=rf62). |
| **Motivação** | Capacidades já implementadas e comparadas com o protótipo de alta fidelidade do CRM, mas sem RF correspondente no backlog — gap identificado na auditoria de rastreabilidade.                                             |
| **Rastreabilidade** | [Issue #177 (F19)](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/177) atualizada · sub-issue [#243](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/243) criada e fechada · [Tabela de Requisitos](/backlog/requisitos#rfs) · [Priorização](/backlog/priorizacao) · [Árvore de Rastreabilidade](/backlog/rastreabilidade) |
| **Status**    | <span className="badge badge--green">Aplicado</span> — implementado, documentado e rastreado                                                                                                                              |

</div>
</details>

<details className="crianex-change" id="mr03">
<summary><span className="crianex-change__id">MR.03</span> <span className="crianex-change__sum">RF15 revisado — bloqueio de duplicidade de template substituído por ativação automática (F08)</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MR.03 — Critério de Aceite Revisado (incremento, não requisito novo)**

| Campo         | Conteúdo                                                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **De**        | RF15, AC 3: *"Dado tipo de evento que já possui template, quando criar outro para o mesmo evento, então o sistema impede a duplicidade"* (erro 409, exige remoção manual antes de criar um novo).    |
| **Para**      | *"Dado tipo de evento que já possui um template ativo, quando criar outro template para o mesmo evento, então o template anterior é desativado automaticamente e o novo passa a ser o único ativo"* — ativação automática por substituição. Ver [F08 — RF15](/iteracoes/iteracao-2/features/f08?tab=rf15). |
| **Motivação** | Melhoria de UX solicitada pelo Product Manager: escolher um tipo já deve deixá-lo ativo imediatamente, sem exigir que o admin remova manualmente o template anterior primeiro.                       |
| **Classificação** | Incremento/refinamento de AC existente — **não é requisito novo** (RF15 continua sendo "Adicionar template de notificações").                                                                  |
| **Rastreabilidade** | [Issue #180 (F08)](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/180) atualizada · [Tabela de Requisitos](/backlog/requisitos#rfs)                                        |
| **Status**    | <span className="badge badge--green">Aplicado</span>                                                                                                                                                 |

</div>
</details>

<details className="crianex-change" id="mr04">
<summary><span className="crianex-change__id">MR.04</span> <span className="crianex-change__sum">RF63 novo — cor e catálogo fixo de tipos para templates de notificação (F08)</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MR.04 — Novo Requisito Funcional de F08**

| Campo         | Conteúdo                                                                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **De**        | Templates de notificação tinham `tipo_evento` como campo de texto livre, sem cor associada — qualquer string era aceita, sem checagem contra os eventos reais do sistema.                                            |
| **Para**      | **RF63 — Personalizar cor e tipo de template de notificação**: tipo escolhido a partir de um catálogo fixo (tipos ainda não implementados aparecem desabilitados) + cor personalizável por template, usada para destacar as notificações resultantes na central. Critérios de aceite BDD completos em [F08 — RF63](/iteracoes/iteracao-2/features/f08?tab=rf63). |
| **Motivação** | Necessidade de diferenciar visualmente notificações por categoria (ex.: segurança e controle) e de impedir tipos de evento inválidos/inexistentes no cadastro de template.                                          |
| **Rastreabilidade** | [Issue #180 (F08)](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/180) atualizada · sub-issue [#244](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/244) criada e fechada · [Tabela de Requisitos](/backlog/requisitos#rfs) · [Priorização](/backlog/priorizacao) · [Árvore de Rastreabilidade](/backlog/rastreabilidade) |
| **Status**    | <span className="badge badge--green">Aplicado</span> — implementado, documentado e rastreado                                                                                                                        |

</div>
</details>

<details className="crianex-change" id="mr05">
<summary><span className="crianex-change__id">MR.05</span> <span className="crianex-change__sum">Status de F07/F08/F19/F20/F21 atualizado para Concluída — impacto na priorização</span> <span className="badge badge--green">Aplicado</span></summary>
<div className="crianex-change__body">

**MR.05 — Status e Priorização**

| Campo         | Conteúdo                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **De**        | F07, F08, F19, F20 e F21 marcadas <span className="badge badge--blue">Em andamento</span> em [Priorização](/backlog/priorizacao) e com os RFs correspondentes na aba "Planejados (IT2/IT3)" da [Tabela de Requisitos](/backlog/requisitos#rfs), apesar de todas as sub-issues das 5 features estarem fechadas. |
| **Para**      | As 5 features marcadas <span className="badge badge--green">Concluída</span>; RFs movidos para a aba "Implementados (IT1 + IT2)"; badge "Concluída" adicionado nas 5 páginas individuais de feature.        |
| **Impacto na priorização** | **RF60–RF63 (novos) e o AC revisado de RF15 não reduzem a prioridade das features F19 e F08.** O cálculo de IP (`VB/ES`) permanece o registrado originalmente nas issues #177 e #180 — essas capacidades foram um refinamento de escopo dentro de features já priorizadas como Q1/Alta (F19: IP 2,5) e aceita conscientemente fora do Quadrante I por dependência lógica (F08: IP 1,31, depende de F07). Se algo, o valor de negócio entregue por F19 e F08 é **maior** do que o estimado originalmente — reforça a prioridade já atribuída, não a enfraquece. Nenhum recálculo de VB/ES/IP foi feito; ver nota na [Tabela MVP](/backlog/priorizacao#features-do-mvp). |
| **Rastreabilidade** | [Tabela de Requisitos v2.2](/backlog/requisitos#features) · [Priorização v3.3](/backlog/priorizacao#features-do-mvp) · [Árvore de Rastreabilidade](/backlog/rastreabilidade) (nós de F19/F08 e RF60–RF63 já apontam para as páginas de feature, não mais para a tabela genérica) |
| **Status**    | <span className="badge badge--green">Aplicado</span>                                                                                                                                                        |

</div>
</details>
