# 10.4 Lições Aprendidas

---

## Retrospectiva da IT2 — Lead Capture (e encerramento do projeto)

Esta seção registra as **lições aprendidas** ao longo da IT2 do projeto Crianex, com foco em **Engenharia de Requisitos**, **Verificação & Validação** e **gestão de mudanças de plano**. Como a Unidade 4 é a última entrega acadêmica do semestre, esta retrospectiva também consolida o encerramento do projeto dentro da disciplina. As lições aqui documentadas decorrem diretamente dos achados formalizados em [`vv.md` da IT2](/iteracoes/iteracao-2/vv) e do processo real vivido durante a iteração.

---

## Tabela de Lições Aprendidas

| Categoria | Lição Aprendida | Ação Corretiva |
| --------- | ---------------- | --------------- |
| **Auditoria de rastreabilidade tardia** | RF36 (F19) tinha um critério de aceite marcado como concluído — reativação de lead — sem que a funcionalidade existisse (nem endpoint, nem UI). Só foi descoberto ao auditar a rastreabilidade linha a linha antes de marcar as features como Concluída ([MR.01](/iteracoes/iteracao-2/vv#mr01)) | Auditar a rastreabilidade (AC documentado × comportamento implementado) **antes** de fechar cada feature, não só antes de marcar a iteração inteira como concluída |
| **Divergência entre texto e implementação mais segura** | RF53/RN22 (F21) descreviam remoção de interação como exclusão permanente (hard-delete); a implementação real sempre foi soft-delete — mais seguro, mas divergente do texto ([MR.01](/iteracoes/iteracao-2/vv#mr01)) | Quando a implementação diverge do requisito documentado de forma **mais segura**, o padrão passa a ser corrigir o texto para refletir a realidade, em vez de reescrever o código para bater com um requisito desatualizado |
| **RNF sem lastro em evidência real** | RNF20 ("disponibilidade 24/7 institucional, uptime ≥ 99%") nunca foi medido nem monitorado de fato — era um RNF que a equipe não tinha meios de verificar | RNFs que descrevem uma métrica não instrumentada/monitorada devem ser convertidos em Regra de Negócio (escopo/comportamento) em vez de permanecerem como RNF não verificável. Ver [RN27](/backlog/requisitos#rns) |
| **Gap de LGPD não coberto por um RNF existente** | F15 (institucional) não tinha nenhum RNF de LGPD, embora RNF11 já cobrisse LGPD para outras features de captação de dados — F15 não captura dado, mas precisa declarar isso explicitamente | Ao revisar RNFs "globais" (como LGPD), checar explicitamente cada feature que lida com dado de visitante, mesmo as que aparentemente não capturam nada — resultou na criação de [RNF27](/backlog/requisitos#rnf27) |
| **RNF listado na rastreabilidade sem página correspondente** | RNF11 aparecia na tabela de rastreabilidade como aplicável a F19, mas a página da feature nunca teve a aba correspondente — só foi percebido numa auditoria manual, não automatizada | Rastreabilidade (tabela) e página de evidências por feature podem divergir silenciosamente; precisa de checagem cruzada periódica entre as duas fontes, não só confiança na tabela central |
| **Escopo maior que a capacidade da iteração** | CP8 (Sistema de Tickets de Suporte, F22/F23) estava planejado para a IT2 desde o início, mas não coube no tempo disponível após o adiamento do prazo final | Escopo deve ser reavaliado a cada replanejamento de cronograma — CP8 foi removido do escopo da IT2 e fica sem iteração associada até ser replanejado (registrado em 01/07/2026) |
| **Permissão granular ignorada em módulos novos** | CRM e templates de notificação foram implementados como *owner-only*, ignorando a matriz de permissões (`profiles.permissions`) já usada no restante do sistema — só apareceu ao testar com um membro não-owner | Todo módulo novo precisa ser testado com um perfil `member` (não só `owner`) antes de ser considerado pronto — permissão granular não é opcional para módulos que reaproveitam uma matriz de permissões já existente |
| **Rate limit sem considerar uso normal** | O rate limiter de `/auth` estava configurado de forma agressiva o suficiente para derrubar a sessão de um usuário em uso normal do sistema, não só de um atacante | Limites de segurança (rate limit, lockout) precisam ser validados contra um cenário de uso legítimo intenso antes de ir para produção, não só contra o cenário de ataque que motivou a regra |
| **Evidência de formulário nunca virava histórico do lead** | A mensagem que o visitante escreve no formulário público de contato nunca era registrada como a primeira interação do histórico do lead no CRM — só a notificação guardava o texto, não a timeline do card | Ao desenhar uma feature que "alimenta" outra (formulário → CRM), verificar explicitamente se cada dado relevante do primeiro fluxo aparece no segundo, não só se o registro principal (o lead) é criado |
| **Validação parcial depende da disponibilidade do cliente** | O cliente pediu para concentrar toda a validação da IT2 numa única reunião final, por estar num período de alto volume comercial — não houve nenhuma sessão de Partial Client Validation nesta iteração | Partial Client Validation é uma cerimônia assíncrona e depende da disponibilidade do cliente; quando ela não é possível, a ausência deve ser documentada e justificada (não simplesmente omitida), e o cronograma deve sinalizar isso visualmente — ver [Partial Validation IT2](/iteracoes/iteracao-2/validacao/partial) |

---

## O que foi bem

| # | Ponto positivo |
| --- | --------------- |
| 1 | A Formal Client Validation da IT2 foi realizada com sucesso — CRM (CP1) e Notificações (CP9) aprovados pelo cliente, com destaque para a organização do CRM e o valor agregado ao dashboard do modelo SaaS |
| 2 | A auditoria de rastreabilidade feita antes de fechar a iteração revelou dois achados reais (RF36, RF53/RN22) que teriam passado despercebidos — o processo de V&V cumpriu exatamente o papel para o qual foi desenhado |
| 3 | Gaps de segurança (permissões owner-only, rate limit agressivo) foram identificados e corrigidos ainda dentro da disciplina, antes da entrega final, em vez de virarem dívida técnica silenciosa |
| 4 | A decisão de converter um RNF não-verificável (RNF20) em Regra de Negócio, em vez de mantê-lo como está ou simplesmente apagá-lo, preserva o requisito original com uma classificação mais honesta |
| 5 | A ausência de Partial Client Validation foi documentada com a justificativa real (print da conversa com o cliente) em vez de deixar a lacuna sem explicação na rastreabilidade |
| 6 | O carrossel de evidências (uma screenshot por vez, navegação finita) e a paridade de estrutura (DoR/DoD) entre todas as features da IT1 e da IT2 deixaram a documentação de evidências consistente entre as duas iterações |

---

## O que devemos melhorar

| # | Área | Melhoria concreta |
| --- | ---------------- | ------------------ |
| 1 | **Verificação contínua** | Testar cada módulo novo com um perfil `member` (permissão restrita), não só `owner`, antes de considerar a feature pronta |
| 2 | **RNFs mensuráveis** | Antes de escrever um RNF, confirmar que existe (ou vai existir) uma forma real de medir/monitorar o critério — senão, é Regra de Negócio, não RNF |
| 3 | **Sincronismo rastreabilidade × páginas de feature** | Criar uma checagem cruzada periódica entre a tabela de rastreabilidade e as páginas de evidência por feature, para não depender só de auditoria manual esporádica |
| 4 | **Testes de segurança com cenário legítimo** | Validar rate limits e travas de segurança contra um cenário de uso intenso e legítimo, além do cenário de ataque que motivou a regra |
| 5 | **Rastreamento de dados entre features acopladas** | Ao desenhar uma feature que alimenta outra (formulário público → CRM, por exemplo), mapear explicitamente todo dado que deveria "atravessar" para o segundo fluxo |
| 6 | **Replanejamento de escopo** | Reavaliar explicitamente, a cada mudança de cronograma, se todas as CPs planejadas ainda cabem no tempo restante — CP8 deveria ter sido reavaliada mais cedo, não só ao final da IT2 |

---

## Encerramento do Projeto na Disciplina

A Unidade 4 é a última entrega acadêmica do semestre (prazo adiado, ver [MP.03](/iteracoes/iteracao-2/vv#mp03)). Com o encerramento da IT2, o projeto Crianex Hub entrega, dentro da disciplina:

- **IT1 — Vitrine Pública** (CP4, CP5, CP6): concluída e validada na Unidade 3.
- **IT2 — Lead Capture** (CP1, CP9): concluída e validada nesta unidade.
- **IT3 — Núcleo Operacional** (CP2, CP3, CP7) e **CP8 — Tickets de Suporte**: fora do escopo da disciplina, sem data prevista — só serão retomados caso equipe e cliente decidam continuar o projeto pós-disciplina (ver [MP.04](/iteracoes/iteracao-2/vv#mp04)).

O acesso do cliente ao repositório, o preenchimento da página "Sobre" com os dados da equipe da Crianex e o deploy no domínio definitivo ficam como ações de transição pós-disciplina, registradas na ata da [Formal Client Validation da IT2](/iteracoes/iteracao-2/validacao/formal).

---

<details className="crianex-revisions">
<summary>Histórico de Revisão</summary>
<div className="crianex-revisions__body">

| Versão | Data | Descrição | Autor(es) |
| ------ | ---- | --------- | --------- |
| 1.0 | 02/07/2026 | Criação da retrospectiva da IT2 — foco em ER, V&V, segurança e encerramento do projeto na disciplina | Equipe Crianex |

</div>
</details>
