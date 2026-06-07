# 5. Cronograma e Entregas

## Histórico de Revisão

| Versão | Data       | Descrição                                                                                              | Autor(es)        |
| ------ | ---------- | ------------------------------------------------------------------------------------------------------ | ---------------- |
| 1.0    | 11/04/2026 | Criação do cronograma de sprints                                                                       | Lucas A. Zanetti |
| 1.1    | 13/04/2026 | Revisão da seção 5                                                                                     | Equipe Crianex   |
| 1.2    | 04/05/2026 | Atualização do cronograma para Processo Híbrido (Iterações)                                            | Heitor           |
| 1.3    | 05/05/2026 | Reestruturação completa: ciclo de vida, cadência semanal e marcos de validação                         | Lucas A. Zanetti |
| 1.4    | 05/05/2026 | Seções 5.1 e 5.4 convertidas para fluxogramas Mermaid                                                  | Lucas A. Zanetti |
| 1.5    | 06/05/2026 | Remoção da coluna OEs e rastreabilidade de CPs na tabela 5.2                                           | Equipe Crianex   |
| 1.6    | 06/05/2026 | Renumeração de CPs (remoção de CP10/CP12 como RNFs) e renomeação IT5 para Pós-venda                    | Lucas A. Zanetti |
| 1.7    | 06/05/2026 | Adição de CP14 (Portal do Cliente) na iteração Pós-venda                                               | Lucas A. Zanetti |
| 1.8    | 06/06/2026 | Substituição da imagem por fluxograma Mermaid corrigido (modelo FDD sem Modelar/Descobrir/Especificar) | Lucas A. Zanetti |

---

## 5.1 O Ciclo de Vida de uma Feature

Toda Feature percorre um fluxo padronizado, do primeiro insight até a entrega validada. Não há atalhos: cada etapa depende da conclusão da anterior.

```mermaid
flowchart TD
    A([ Feature Discovery Session]) --> B([ Iteration Replenishment\npriorização por IP = VB / PT])
    B --> C([ Iteration Commitment\nescopo + Iteration Goal formalizados])
    C --> D([ Feature Slicing\nfatias verticais atômicas · INVEST])
    D --> E([ Acceptance Criteria Review\nDado / Quando / Então por issue])
    E --> F([ Technical Design Review\nChief Programmer lidera · FDD etapa 4])
    F --> G([ Kanban Pull Execution\nFDD etapa 5 · WIP ≤ 2 por Class Owner])
    G --> H([ Internal Code & Design Review\nPR aprovado por outro Class Owner + CI verde])
    H --> I([ Partial Client Validation\nOtavio valida assincronamente])
    I --> J([ Formal Client Validation\ndemo orientada a valor ao fim da iteração])

    style A fill:#e3f2fd,stroke:#1565c0
    style J fill:#e8f5e9,stroke:#2e7d32
    style I fill:#fff8e1,stroke:#f57f17
```

### Regras do fluxo

| Regra                          | Descrição                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Sem atalhos**                | Uma issue não pode pular colunas no Kanban (ex.: In Progress direto para Done).                              |
| **WIP limit é lei**            | Máx. 2 issues In Progress por Class Owner. Ao atingir o limite, ajude a destravar antes de iniciar uma nova. |
| **Design antes de código**     | Nenhuma linha de código é escrita sem Technical Design Review e critérios de aceite definidos.               |
| **Entrega contínua**           | Features são entregues a Otavio conforme ficam prontas — não há espera pela data da unidade acadêmica.       |
| **Rastreabilidade mandatória** | Toda issue precisa estar linkada à Feature parent no Miro e à CP correspondente no Documento de Visão.       |

---

## 5.2 Roadmap de Iterações

O quadro abaixo apresenta os ciclos de trabalho planejados, organizados por **Valor de Negócio** entregue ao cliente real (Otavio Maya, CTO Crianex).

> **Nota:** O planejamento é orientado ao Índice de Prioridade determinado pelo [valorXesforco](solucao.md#mapeamento-de-valor-das-características-feature-setvalue-matrix). A ordem das CPs dentro de cada iteração pode ser reordenada conforme feedback do cliente.

| Iteração | Status | Período         | Valor de Negócio       | CPs                                                                                                                                                   | Iteration Goal                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Validação                                                                                |
| -------- | ------ | --------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **IT1**  | 🔄     | 28/04 até 25/05 | **Vitrine Pública**    | [CP4](solucao.md#características-do-produto-cp) · [CP5](solucao.md#características-do-produto-cp) · [CP6](solucao.md#características-do-produto-cp)   | Ao fim da IT1: "(1) qualquer visitante sem autenticação navega pela vitrine pública, visualiza o catálogo de produtos SaaS publicados, consulta informações institucionais e canais de contato da Crianex; (2) um administrador autenticado cadastra, edita, publica e despublica produtos e gerencia usuários via painel seguro; e (3) visitantes consultam e avaliam artigos do FAQ categorizados — tudo em layout responsivo verificado em mobile (≥ 375 px) e desktop (≥ 1 280 px), com Formal Client Validation aprovada por Otavio. " | Partial Validation contínua. Formal Validation com demo focada em conversão e navegação. |
| **IT2**  | ⏳     | 26/05 até 18/06 | **Lead Capture**       | [CP1](solucao.md#características-do-produto-cp) · [CP8](solucao.md#características-do-produto-cp) · [CP9](solucao.md#características-do-produto-cp)   | "Leads de novos visitantes são capturados via formulário público e registrados automaticamente no CRM; dúvidas comuns são resolvidas pelo FAQ sem abertura de ticket; e receitas por produto são controladas centralmente com exportação de relatórios."                                                                                                                                                                                                                                                                                    | Validação ponta a ponta: lead submetido no formulário aparece como card no CRM;          |
| **IT3**  | ⏳     | 19/06 até 07/07 | **Núcleo Operacional** | [CP2](solucao.md#características-do-produto-cp) · [CP3](solucao.md#características-do-produto-cp) · [CP7](solucao.md#características-do-produto-cp) · | "A equipe interna acessa o CRM Kanban, o Dashboard Executivo e o painel de logs unificados a partir de um único ponto de autenticação."                                                                                                                                                                                                                                                                                                                                                                                                     | Validação do cruzamento de logs e tickets; métricas operacionais com os sócios.          |

---

## 5.3 Cadência Semanal de uma Iteração

A cadência semanal — cerimônias, formatos e tabelas de atividades por semana — está documentada em **[6.3 Cadência de Cerimônias](equipe.md#63-cadencia-de-cerimonias)** na página de Interação Equipe-Cliente, onde faz mais sentido contextualmente.

---

## 5.4 Sequência de Execução em uma Iteração

A sequência abaixo apresenta a ordem obrigatória de atividades dentro de qualquer iteração, agrupada por fase. Nenhuma etapa pode ser invertida ou suprimida — desvios são registrados na retrospectiva e tratados na próxima iteração.

```mermaid
flowchart TD
    subgraph P["Fase 1 — Planejamento"]
        A([Iteration Replenishment · IP = VB / PT]) --> B([Iteration Commitment · Iteration Goal])
    end

    subgraph D["Fase 2 — Design & Build"]
        C([Acceptance Criteria · Dado / Quando / Então])
        C --> F([Technical Design Review])
        F --> G([Kanban Pull Execution · WIP ≤ 2])
        G --> H([Code & Design Review])
        H --> I([Partial Client Validation])
        I -.->|"ciclo de produção · repete por issue"| C
    end

    subgraph E2["Fase 3 — Encerramento"]
        K([Formal Client Validation]) --> L([Auditoria de Rastreabilidade])
        L --> M([Geração de Artefatos])
        M --> N([Reorganizar Backlog])
    end

    B --> C
    I -->|"todas as issues concluídas"| K

    style P fill:#dbeafe,stroke:#1d4ed8,color:#1e3a5f
    style D fill:#fce7f3,stroke:#be185d,color:#831843
    style E2 fill:#ede9fe,stroke:#7c3aed,color:#3b0764
```

<figure class="crianex-figure">
  <figcaption>Figura 1 — Sequence Execution: Sequência de execução das cerimônias dentro de uma iteração FDD. Fonte: Elaborado pelos autores (2026).</figcaption>
</figure>

---

## 5.5 Marcos e Critérios de Encerramento por Iteração

Cada iteração só é considerada **encerrada** quando todos os critérios abaixo estão satisfeitos:

| #   | Critério                                                                                    | Responsável               |
| --- | ------------------------------------------------------------------------------------------- | ------------------------- |
| 1   | Todas as issues comprometidas estão em Done ou com justificativa de carry-over documentada. | Development Manager       |
| 2   | Formal Client Validation realizada e aprovação de Otavio registrada na ata.                 | Responsável por Validação |
| 3   | Matriz de rastreabilidade OE → CP → VN → Feature → Issue → PR → Validação atualizada.       | Documentation Lead        |
| 4   | Documento de Visão (GitHub Pages) atualizado com artefatos da iteração.                     | Documentation Lead + PM   |
| 5   | Retrospectiva realizada e lições aprendidas registradas.                                    | Facilitador Metodológico  |
| 6   | Backlog macro reordenado por IP para a próxima iteração.                                    | Project Manager           |
