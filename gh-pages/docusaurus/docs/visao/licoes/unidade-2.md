# 10.2 Lições Aprendidas

---


## Retrospectiva da Unidade 2 — IT2: Vitrine Pública

Esta seção registra as **lições aprendidas** ao longo da segunda unidade do projeto Crianex (IT2 — Vitrine Pública), com foco na consolidação dos requisitos, estruturação do backlog e alinhamento da aplicação da metodologia FDD.

---

## Tabela de Lições Aprendidas

| Categoria                  | Lição Aprendida                                                                                                                                                                                             | Ação Corretiva                                                                                                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Processo e Metodologia** | A Engenharia de Requisitos descrevia as cerimônias das etapas 1–3 do FDD como se fossem iterativas, gerando confusão sobre o que se repete a cada iteração e o que ocorre somente no início do projeto      | Reescrever a seção 4 separando explicitamente etapas únicas (1–3) das etapas iterativas (4–5); deixar claro no processo que Domain Modeling, Feature Discovery e Plan by Feature são fundação única do projeto         |
| **Entregas em Sala**       | Tivemos que mudar nosso modelo de captação de requisitos, para atender as necessidade da matéria de requisitos, uma vez que o professor exigiu todos os requisitos prontos e rastráveis para a apresentação | Fizemos uma reunião rápida com o cliente para para ouvir as necessidades e desejos das CPs de outras iterações e então poder montar a rastreabilidade delas                                                            |
| **Rastreabilidade**        | A numeração e os nomes das Características de Produto (CPs) apresentavam inconsistências entre o arquivo `solucao.md` e o `rastreabilidade.md`, causando divergência nos mapeamentos de features e RFs      | Definir um único arquivo como fonte da verdade para cada tipo de artefato e registrá-lo explicitamente no CLAUDE.md; qualquer atualização deve ser propagada a partir da fonte, não feita isoladamente em cada arquivo |
| **Backlog e Requisitos**   | O backlog foi estruturado inicialmente com Épicos e User Stories ao invés do formato FDD (Feature Sets → Features → RFs com rastreabilidade OE→CP→Feature→RF)                                               | Restruturar o backlog seguindo a hierarquia FDD com Feature List, tabela de RFs rastreáveis e cenários BDD; usar a `rastreabilidade.md` como documento central                                                         |
| **Backlog e Requisitos**   | As iterações dentro do backlog tinham mapeamentos de CPs incorretos, divergindo do cronograma oficial definido em `cronograma.md`                                                                           | Sempre consultar `cronograma.md` como fonte da verdade para a distribuição de CPs por iteração; não preencher iterações no backlog sem confirmar com o cronograma                                                      |
| **Gestão do Tempo**        | A organização dos artefatos de documentação (er.md, backlog, iterações) foi deixada para o final da unidade, gerando acúmulo de ajustes no prazo de entrega                                                 | Definir no Iteration Commitment quais artefatos de documentação precisam ser atualizados e atribuir responsáveis com prazo intermediário, não apenas no Artifact Closure                                               |

---

## O que foi bem

| #   | Ponto positivo                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | A infraestrutura de documentação (MkDocs, GitHub Pages, estrutura de pastas) funcionou de forma estável durante toda a unidade                    |
| 2   | A tabela de rastreabilidade OE → CP → Feature → RF/RNF foi construída de forma completa e coerente, cobrindo todos os 47 RFs e 24 RNFs do produto |
| 3   | A separação da lição aprendida sobre as etapas únicas vs. iterativas do FDD aumentou a clareza do processo para toda a equipe                     |
| 4   | A estrutura de evidências de entrega foi adicionada a todas as iterações, preparando o registro formal de validações para as próximas entregas    |
| 5   | O contexto do projeto foi organizado e segmentado adequadamente, facilitando o trabalho incremental nas próximas iterações                        |

---

## Ações até a Próxima Unidade — IT2: Lead Capture

| Ação                                                                 | Responsável | Prazo |
| -------------------------------------------------------------------- | ----------- | ----- |
| Continuar a IT1 entregando as funcionalidades                        | Todos       | 25/05 |
| Dar andamento as cerimônias da IT2 e realizar as entregas iterativas | Todos       | ---   |

---

<details className="crianex-revisions">
<summary>Histórico de Revisão</summary>
<div className="crianex-revisions__body">

| Versão | Data       | Descrição                                                   | Autor(es)        |
| ------ | ---------- | ----------------------------------------------------------- | ---------------- |
| 1.0    | 18/05/2026 | Criação da retrospectiva da Unidade 2 — IT1 Vitrine Pública | Lucas A. Zanetti |

</div>
</details>

