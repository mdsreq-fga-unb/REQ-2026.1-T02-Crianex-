# Entrega — Unidade 4

## Contexto

A Unidade 4 é a entrega final da disciplina. Cobre o encerramento da IT2 — Lead Capture, com a entrega do CRM Interno de Clientes (CP1) e do Sistema de Notificações (CP9). Também inclui a retrospectiva final do projeto, as lições aprendidas consolidadas e a rastreabilidade completa de todas as iterações.

:::info[Adiamento do prazo final da disciplina (18/06/2026)]
:::

O professor adiou o prazo final da disciplina: a Unidade 4 passa a ser a **última entrega acadêmica do semestre**, e a IT3 — Núcleo Operacional fica pausada (pós-disciplina). Detalhes em [Resultados V&V da IT2](/iteracoes/iteracao-2/vv#mp03).

:::info[CP8 — Tickets de Suporte fora do escopo da IT2]
:::

O Sistema de Tickets de Suporte (CP8, F22/F23) foi removido do escopo da IT2 em 01/07/2026 — não coube no tempo disponível após o adiamento do prazo final. Fica sem iteração associada até ser replanejado pós-disciplina.

**Período:** 29/06/2026 – 09/07/2026  
**Data de entrega (vídeo gravado e slides preparados):** 01/07/2026  
**Apresentações:** 02 a 09/07/2026

---

## Apresentação em Vídeo

<div style={{width: '100%', maxWidth: '900px', margin: '1.5rem 0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.15)'}}>
  <iframe 
    style={{width: '100%', aspectRatio: '16/9', display: 'block'}} 
    src="https://youtube.com/embed/n5Gr9AuKYvo" 
    title="Apresentação da Unidade 4" 
    frameBorder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowFullScreen>
  </iframe>
</div>

---

## O Que Planejamos Entregar

OBJ1 — Verificação e Validação de requisitos
OBJ2 — Organização e Atualização de requisitos

| Entregável exigido (PDF) | Como a equipe atendeu | Objetivo(s) | Evidência (link) | Status |
| --- | --- | --- | --- | --- |
| Visão de Produto e Projeto atualizada | Sincronização Visão × backlog mantida ao longo da IT2 | OBJ2 | [Home](/) · [Visão 1–7](/visao/cenario) | <span className="badge badge--green">Concluído</span> |
| Backlog atualizado | Backlog congelado da IT2; CP8 removido do escopo e sinalizado sem iteração associada | OBJ2 | [Rastreabilidade](/backlog/rastreabilidade) · [Priorização](/backlog/priorizacao) · [Dependências](/backlog/dependencias) | <span className="badge badge--green">Concluído</span> |
| MVP (evidências) | Kanban Build F19–F21, F07–F08 + evidências por feature (screenshots em carrossel) | OBJ1 | [Features Entregues IT2](/iteracoes/iteracao-2/#features) | <span className="badge badge--green">Concluído</span> |
| DoR e DoD | Critérios verificáveis + abas DoR/DoD em todas as features da IT2, no mesmo padrão da IT1 | OBJ1 + OBJ2 | [Visão](/visao/er) · [7 · DoR e DoD](/visao/dor-dod) | <span className="badge badge--green">Concluído</span> |
| Rastreabilidade atualizada | Matriz OE→CP→Feature→RF→RNF→RN revisada; RNF20 convertido em RN27; RNF11 e RNF27 adicionados; RF60–RF63 e RN24–RN26 incorporados | OBJ2 | [Backlog](/backlog/priorizacao) · [Rastreabilidade](/backlog/rastreabilidade) · [Tabela de Requisitos](/backlog/requisitos) | <span className="badge badge--green">Concluído</span> |
| Evidências de execução de ESw e ER | Atas, auditoria de rastreabilidade (MR.01–MR.05), Formal Client Validation, registro V&V da IT2 | OBJ1 + OBJ2 | [Atas IT2](/iteracoes/iteracao-2/atas/reuniao_TDR2) · [V&V IT2](/iteracoes/iteracao-2/vv) · [Formal Validation IT2](/iteracoes/iteracao-2/validacao/formal) | <span className="badge badge--green">Concluído</span> |
| Site do Projeto (GitPages) | Documentação Docusaurus versionada e publicada | — (meio) | [Todo o site](/) | <span className="badge badge--green">Concluído</span> |
| Retrospectiva final e lições aprendidas | Retrospectiva da IT2 com foco em ER, V&V, segurança e encerramento do projeto na disciplina | OBJ1 + OBJ2 | [10.4 · Lições da Unidade 4](/visao/licoes/unidade-4) | <span className="badge badge--green">Concluído</span> |
| Vídeo de apresentação | Gravação e apresentação (02–09/07/2026) | — (formato) | [Entrega — Unidade 4](/entregas/unidade-4) | <span className="badge badge--green">Concluído</span> |

---

## O Que Foi Feito

### IT2 — Lead Capture (Encerrada)

A IT2 foi concluída com Formal Client Validation realizada em 29/06/2026. As CPs comprometidas foram entregues:

| CP | Característica | Features | Status |
| --- | --- | --- | --- |
| CP1 | CRM Interno de Clientes (Kanban de leads) | F19, F20, F21 | <span className="badge badge--green">Aprovado</span> |
| CP9 | Sistema de Notificações no Sistema | F07, F08 | <span className="badge badge--green">Aprovado</span> |

CP8 (Sistema de Tickets de Suporte) **não foi entregue nesta iteração** — removido do escopo por falta de tempo após o adiamento do prazo final (ver contexto acima).

O registro completo das features entregues, com evidências e validações, está em: [Features Entregues IT2](/iteracoes/iteracao-2/#features)

### Auditoria de Rastreabilidade e Mudanças de Requisitos

Antes de marcar F07, F08, F19, F20 e F21 como concluídas, foi feita uma auditoria linha a linha entre os critérios de aceite documentados e o comportamento efetivamente implementado. O resultado está consolidado em [Resultados V&V da IT2 — Mudanças de Requisitos](/iteracoes/iteracao-2/vv#mr01):

- **RF60–RF63 novos** — busca/filtros, exportação CSV, tabela/indicadores do CRM e personalização de templates de notificação, capacidades já implementadas mas sem RF correspondente no backlog.
- **RF15 revisado** — ativação automática de template por tipo de evento, no lugar do bloqueio de duplicidade original.
- **RF36 (F19)** — reativação de lead implementada (estava documentada como concluída sem existir).
- **RF53/RN22 (F21)** — texto corrigido para refletir soft-delete, o comportamento real e mais seguro já implementado.
- **RNF20 removido e convertido em RN27** — a disponibilidade 24/7 institucional nunca foi medida/monitorada; virou uma regra de escopo (só disponibilizar as informações institucionais), não um RNF verificável.
- **RNF27 criado** — conformidade com a LGPD nas páginas institucionais (F15), gap identificado na mesma auditoria.
- **RNF11 adicionado a F19** — estava listado na tabela de rastreabilidade como aplicável, mas sem aba correspondente na página da feature.

### Correções de Segurança Identificadas na IT2

Duas falhas de segurança foram encontradas e corrigidas antes da entrega final:

- **Permissões granulares ignoradas:** CRM e templates de notificação foram implementados como *owner-only*, ignorando a matriz de permissões (`profiles.permissions`) já usada no restante do sistema. Corrigido para respeitar permissão `v`/`e`/`a` por módulo.
- **Rate limit agressivo demais:** o limitador de requisições de `/auth` derrubava a sessão de um usuário em uso normal do sistema, não só de um atacante. Ajustado para não interferir no uso legítimo.

### Correção no Fluxo de Captação de Lead

A mensagem escrita pelo visitante no formulário público de contato não virava a primeira interação registrada no histórico do lead no CRM — só a notificação guardava o texto. Corrigido via nova migração (`capture_lead`), que agora registra a mensagem como a primeira interação do card, com o lead como autor.

### Cerimônias Realizadas

| Cerimônia | Data | Registro |
| --- | --- | --- |
| Technical Design Review IT2 | 11/06/2026 | [Technical Design Review](/iteracoes/iteracao-2/atas/reuniao_TDR2) |
| Feature Build Consolidation | 26/06/2026 | [V&V IT2](/iteracoes/iteracao-2/vv) |
| Partial Client Validation IT2 | — | **Não realizada** — ver [justificativa](/iteracoes/iteracao-2/validacao/partial) |
| Formal Client Validation IT2 | 29/06/2026 | [Formal Validation IT2](/iteracoes/iteracao-2/validacao/formal) |
| Artifact Closure IT2 | 30/06/2026 | [Ata — Artifact Closure IT2](/iteracoes/iteracao-2/atas/reuniao_artifact_closure) · [V&V IT2 — MP.05](/iteracoes/iteracao-2/vv#mp05) |

### Evidências IT2

| Artefato | Link |
| --- | --- |
| Features entregues com evidências (F07, F08, F19–F21) | [Features Entregues IT2](/iteracoes/iteracao-2/#features) |
| Resultados V&V IT2 | [V&V IT2](/iteracoes/iteracao-2/vv) |
| Formal Client Validation | [Formal Validation IT2](/iteracoes/iteracao-2/validacao/formal) |
| Partial Client Validation (justificativa de ausência) | [Partial Validation IT2](/iteracoes/iteracao-2/validacao/partial) |
| Diagrama de Sequência Leve | [Design Técnico IT2](/iteracoes/iteracao-2/evidencias/design-tecnico) |

---

## Lições Aprendidas

As lições desta unidade estão registradas em: [10.4 · Lições da Unidade 4](/visao/licoes/unidade-4)

---

<details className="crianex-revisions">
<summary>Histórico de Revisão</summary>
<div className="crianex-revisions__body">

| Versão | Data | Descrição | Autor(es) |
| --- | --- | --- | --- |
| 1.0 | 15/06/2026 | Criação da página | Equipe Crianex |
| 1.1 | 18/06/2026 | Remarcação de datas após adiamento do prazo final da disciplina | Equipe Crianex |
| 2.0 | 02/07/2026 | Página atualizada com o que foi de fato entregue na IT2 (CP1, CP9), auditoria de rastreabilidade, correções de segurança e lições aprendidas; CP8 sinalizada como fora do escopo | Equipe Crianex |
| 2.1 | 02/07/2026 | Vídeo de apresentação embutido | Equipe Crianex |

</div>
</details>
