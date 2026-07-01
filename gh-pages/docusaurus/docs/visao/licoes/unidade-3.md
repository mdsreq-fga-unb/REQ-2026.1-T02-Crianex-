# 10.3 Lições Aprendidas

---


## Retrospectiva da IT1 — Vitrine Pública

Esta seção registra as **lições aprendidas** ao longo da IT1 do projeto Crianex, com foco em **Engenharia de Requisitos**, **Verificação & Validação** e **gestão de mudanças de plano**. As lições aqui documentadas decorrem diretamente dos achados formalizados em [`vv.md`](/iteracoes/iteracao-1/vv) e do processo real vivido durante a iteração.

---

## Tabela de Lições Aprendidas

| Categoria                        | Lição Aprendida                                                                                                                                                                                                                                     | Ação Corretiva                                                                                                                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Granularidade de Requisitos**  | Features com um único RF não possuem valor isolado entregável — são comportamentos, não capacidades. As features F02, F05 e F07 foram criadas com RF único e precisaram ser removidas ou absorvidas durante a V&V da IT1                            | Ao escrever a Feature List, aplicar o critério: _"uma feature com menos de 2 RFs funcionais distintos provavelmente é um comportamento filho de outra feature"_. Revisar a atomicidade antes do Iteration Commitment |
| **Escopo de RF**                 | Um RF vago que agrega comportamentos distintos (ex.: RF42 "Adicionar interação comercial") gera critérios de aceite ambíguos e só revela seu escopo real durante a implementação                                                                    | Ao escrever RFs, verificar se o enunciado descreve **uma única ação com um único resultado observável**. Se cobrir criar + editar + remover, deve ser decomposto já na Feature Discovery                             |
| **Nível de Priorização (IP)**    | A priorização foi calculada inicialmente de forma _bottom-up_ — IPs nos RFs individuais, derivando prioridade da feature. O método correto é _top-down_: o cliente prioriza features (unidades de entrega de valor), não requisitos atomizados      | Calcular `IP = VB / ((CX + ES) / 2)` sempre no nível de Feature. RFs só recebem prioridade interna quando a feature já está comprometida em uma iteração e há risco de entrega parcial                               |
| **Consistência de Numeração**    | A criação de novos RFs durante mudanças de escopo (ES.02, ES.04) gerou conflito de numeração: o número RF53 estava em uso e foi referenciado provisoriamente para um RF novo                                                                        | Antes de criar um RF, consultar o número máximo atual na `rastreabilidade.md` e reservar o próximo disponível. Nunca usar número provisório sem registrar formalmente                                                |
| **Mudança de Processo FDD**      | O processo foi planejado com FDD 100% iterativo (todas as fases repetidas a cada iteração). Na prática, Domain Modeling e Feature Discovery são fundações únicas do projeto e repetí-las gera overhead sem ganho                                    | Documentar explicitamente no `er.md` quais etapas FDD são únicas (1–3) e quais são iterativas (4–5), para que novos membros não repitam o erro e o processo fique legível para avaliação                             |
| **Replanejamento de Cronograma** | A antecipação do Painel Admin (CP5) para a IT1 e a extensão do prazo de entrega para 25/05 foram tomadas corretamente, mas a decisão ficou registrada apenas na ata da reunião interna — sem atualização formal do cronograma no documento de visão | Qualquer mudança de escopo ou prazo deve ser refletida em `cronograma.md` na mesma semana da decisão. A ata registra a decisão; o cronograma é a fonte da verdade para quem não acompanhou a reunião                 |
| **Validação Formal como Gate**   | A Formal Client Validation só foi realizada após todas as CPs entregues, o que é correto metodologicamente. Porém, a tabela de resultado da validação foi preenchida apenas retroativamente, sem registro do momento da aprovação                   | Preencher a tabela de resultado da `formal.md` **durante** a reunião de validação, não depois. Isso garante que o aceite seja rastreável ao momento exato em que ocorreu                                             |

---

## O que foi bem

| #   | Ponto positivo                                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | A Formal Client Validation foi realizada com sucesso — CP4, CP5 e CP6 aprovadas pelo CEO da Crianex com feedback positivo sobre design, animações e identidade visual           |
| 2   | As mudanças de escopo (ES.01–ES.05) e processo (MP.01–MP.02) foram identificadas e documentadas formalmente em `vv.md`, criando um histórico rastreável de evolução do backlog  |
| 3   | A decisão de não implementar 2FA (V.01) foi registrada com impacto técnico e de backlog, evitando que o requisito permaneça como dívida não documentada                         |
| 4   | O Painel Admin foi entregue na mesma iteração da vitrine, permitindo que o cliente validasse tanto a vitrine quanto o painel de gestão em uma única sessão de Formal Validation |
| 5   | A priorização matemática objetiva (IP = VB / ((CX + ES) / 2)) foi apresentada e aprovada pelo professor, resolvendo o feedback anterior sobre subjetividade na priorização      |
| 6   | O suporte a múltiplos idiomas (PT/EN) foi implementado com i18n e validado sem retrabalho — decisão técnica tomada cedo e corretamente mantida                                  |

---

## O que devemos melhorar

| #   | Área                         | Melhoria concreta                                                                                                                                  |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Engenharia de Requisitos** | Revisar atomicidade de features antes de comprometê-las: ≥ 2 RFs distintos por feature como critério mínimo                                        |
| 2   | **Verificação**              | Criar checklist de V&V durante cada iteração com campo de status e responsável por aplicar cada mudança                                            |
| 3   | **Validação Parcial**        | Preencher `partial.md` após cada sessão com o cliente, não acumular para o final da iteração                                                       |
| 4   | **Rastreabilidade**          | Atualizar `rastreabilidade.md` antes de fechar a iteração — mudanças de escopo na V&V não podem migrar para a próxima iteração sem serem aplicadas |
| 5   | **Comunicação de mudanças**  | Qualquer alteração de prazo ou escopo deve ser refletida em `cronograma.md` na mesma semana — não apenas registrada em ata                         |
| 6   | **RNFs com cliente**         | Incluir RNFs críticos (segurança, performance) como itens de validação explícita com o cliente antes da implementação                              |

---

## Ações para a Unidade 4

| Ação                                                                                                             | Responsável               | Prazo                 |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------- | --------------------- |
| Aplicar mais verificações e validações continuamente para não termos acumulos de problemas no final da iterações | todos                     | Contínuo              |
| Remover código TOTP morto do backend (decisão V.01)                                                              | Tech Lead                 | IT2 — semana 1        |
| Preencher tabela de feedbacks de Partial Validation conforme ocorrem                                             | Responsável por Validação | Contínuo              |
| Atualizar `cronograma.md` sempre que houver mudança de prazo ou escopo                                           | PM                        | Imediato após decisão |

---

<details className="crianex-revisions">
<summary>Histórico de Revisão</summary>
<div className="crianex-revisions__body">

| Versão | Data       | Descrição                                                               | Autor(es)             |
| ------ | ---------- | ----------------------------------------------------------------------- | --------------------- |
| 1.0    | 14/06/2026 | Criação da retrospectiva da IT1 — foco em ER, V&V e mudanças de plano   | Lucas A. Zanetti      |
| 1.1    | 15/06/2026 | Correção da fórmula IP para `IP = VB / ((CX + ES) / 2)` (2 ocorrências) | Heitor Macedo Ricardo |

</div>
</details>

