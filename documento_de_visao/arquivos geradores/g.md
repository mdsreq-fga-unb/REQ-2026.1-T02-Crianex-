# 7. DoR, DoD e Fluxo Kanban

## Histórico de Revisão

| Versão | Data       | Descrição                                                        | Autor(es)        |
| ------ | ---------- | ---------------------------------------------------------------- | ---------------- |
| 1.0    | 18/05/2026 | Extração das seções 6.4–6.6 de equipe.md para documento dedicado | Lucas A. Zanetti |

---

## 7.1 Processo de Validação com o Cliente

O processo opera em dois modos complementares: **Partial** (contínua e assíncrona, durante a iteração) e **Formal** (reunião de demo ao fim de cada iteração).

![Processo de Validação com o Cliente](docs/visao/images/processo_validacao_cliente.jpeg)

_Figura 1 — Fluxo de validação: Partial (assíncrona, contínua por feature) → Formal (reunião, fim da iteração)._

### Definition of Ready (DoR)

!!! info "Uma issue está pronta para entrar em execução quando:"

    - [ ] Título no padrão FDD: `<ação> <resultado> <de/para/no/com> <objeto>`
    - [ ] Critérios de aceite escritos e verificáveis (Given/When/Then)
    - [ ] Estimativa registrada: VB, CX, ES e IP calculado
    - [ ] Dependências identificadas; bloqueantes resolvidos
    - [ ] Class Owner designado e linkada à Feature parent e à CP de origem
    - [ ] Protótipo revisado pelo cliente (se houver interface envolvida)
    - [ ] Ao menos um critério de segurança identificado (RLS, validação de input, autenticação)

### Definition of Done (DoD)

!!! tip "Uma issue está concluída quando:"

    - [ ] Critérios de aceite todos validados (Given/When/Then cobertos)
    - [ ] Testes automatizados passando — unitários + integração onde há lógica de negócio
    - [ ] Lint sem erros e formatação OK (ESLint + Prettier)
    - [ ] CI verde (build + testes + lint)
    - [ ] PR aprovado por Chief Programmer
    - [ ] Migration de banco aplicada em staging sem erros (se existir)
    - [ ] Sem vulnerabilidades críticas no SAST/linting de segurança
    - [ ] Validação parcial registrada pelo cliente na issue (ou agendada para próxima validação formal)
    - [ ] Documentação atualizada se houve mudança de contrato, comportamento ou arquitetura
    - [ ] Issue movida para Done no GitHub Projects

---

## 7.2 Fluxo das Issues pelo Kanban

Toda issue percorre as colunas abaixo em ordem estrita. Cada avanço depende de critério explícito — sem atalhos.

![Fluxo das Issues pelo Kanban](docs/visao/images/processo_validacao_cliente.jpeg)
_Figura 2 — Fluxo Kanban: progressão linear obrigatória com desvio via Blocked. CO = Class Owner._
{: style="text-align:center; font-size:0.83rem; color:#666;" }

### Critérios de Transição

| De → Para                     | Critério de avanço                                                                    | Quem move                       |
| ----------------------------- | ------------------------------------------------------------------------------------- | ------------------------------- |
| **Backlog → Ready**           | Critérios de aceite escritos; design aprovado; dependências resolvidas (DoR atendido) | Class Owner ou Chief Programmer |
| **Ready → In Progress**       | Class Owner inicia; WIP limit verificado                                              | Class Owner que pega            |
| **In Progress → Review**      | PR aberto (`closes #N`); CI verde; auto-revisão feita                                 | Class Owner autor               |
| **Review → Validation**       | PR aprovado por outro Class Owner; merge realizado                                    | Revisor após approve            |
| **Validation → Done**         | Otavio aprovou na Partial Client Validation; checklist marcado                        | Responsável por Validação       |
| **\* → Blocked**              | Bloqueio externo identificado; comentário com motivo na issue                         | Quem identificou                |
| **Blocked → coluna anterior** | Bloqueio resolvido                                                                    | Quem desbloqueou                |

### Regras invioláveis

| Regra                  | Descrição                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Sem atalhos**        | Issue não pode pular colunas (ex.: In Progress direto para Done).                                                  |
| **WIP limit é lei**    | Máx. 2 In Progress por Class Owner. Ao atingir o limite, ajude a destravar antes de iniciar nova issue.            |
| **Blocked é visível**  | Toda issue em Blocked precisa de comentário com motivo e responsável por destravar.                                |
| **Issue fecha via PR** | Não fechar issue manualmente — ela é fechada pelo merge (`closes #N`) e movida para Done após validação de Otavio. |

---

## 7.3 Gestão de Mudanças de Requisitos

Toda mudança segue o ciclo de vida de Feature — não há alteração informal de escopo. Decisões de escopo **nunca** são tomadas no Discord; qualquer mudança que altere o Iteration Goal exige reunião com ata no Miro.

| Origem                                 | Canal de entrada                            | Processo                                                                              |
| -------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Feedback de Otavio na demo**         | Feature Card capturado na Formal Validation | PM incorpora ao backlog; entra na próxima Replenishment com IP calculado              |
| **Dúvida crítica durante execução**    | Discord + issue de bloqueio                 | Feature Discovery pontual com Otavio; issue vai para Blocked até resolução            |
| **Issue do professor**                 | Issue aberta no repositório                 | PM triagem em até 24h; se escopo → Feature Card + backlog; se correção → issue direta |
| **Ajuste menor em critério de aceite** | Class Owner atualiza a issue                | Chief Programmer revisa e aprova; sem nova cerimônia                                  |
| **Mudança de escopo significativa**    | PM convoca reunião de alinhamento           | Equipe avalia impacto; IP recalculado; Iteration Goal pode ser renegociado com Otavio |
