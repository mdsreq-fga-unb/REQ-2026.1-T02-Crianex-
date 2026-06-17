# 4. Engenharia de Requisitos

## Histórico de Revisão

| Versão | Data       | Descrição                                                                                                                                                                  | Autor(es)        |
| ------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 1.0    | 12/04/2026 | Criação das seções 4.1 a 4.4                                                                                                                                               | Heitor e Lucas   |
| 1.1    | 13/04/2026 | Revisão da seção 4                                                                                                                                                         | Equipe Crianex   |
| 1.2    | 04/05/2026 | Ajustes da seção 4.1                                                                                                                                                       | Heitor           |
| 1.3    | 04/05/2026 | Ajustes da seção 4.2                                                                                                                                                       | Heitor           |
| 1.4    | 06/05/2026 | Revisão dos ajustes da seção 4.1 e reajustes                                                                                                                               | Philipe          |
| 1.5    | 05/05/2026 | Ajustes de clareza e consistência na seção 4                                                                                                                               | Hugo             |
| 1.6    | 08/05/2026 | Ajustes de cerimônias e técnicas                                                                                                                                           | Lucas e Philipe  |
| 1.7    | 18/05/2026 | Reestruturação completa: separação entre etapas únicas e iterativas do FDD; adição da tabela de atividades de ER                                                           | Lucas A. Zanetti |
| 1.8    | 06/06/2026 | Reestruturação da tabela 4.5: colunas Etapa FDD · Atividade de ER · Técnicas; enunciação explícita das 6 atividades de ER                                                  | Lucas A. Zanetti |
| 1.9    | 17/06/2026 | Inversão da lógica de apresentação: a seção passa a partir das **atividades de ER** (o quê e como) antes de encaixá-las nas **etapas do FDD** (quando e em qual cerimônia) | Lucas A. Zanetti |

---

## 4.1 Abordagem de Engenharia de Requisitos

O projeto Crianex adota um **Processo Híbrido (FDD + Kanban)**. O FDD (Feature-Driven Development) estrutura o planejamento orientado a valor (o que construir), enquanto o Kanban fornece o controle visual da execução (quando puxar o trabalho e quando parar) por meio da limitação de Work in Progress (WIP).

Antes de descrever **quando** cada técnica é usada (etapas e cerimônias do FDD), é preciso deixar claro **o quê** é feito em termos de Engenharia de Requisitos e **como** cada técnica é aplicada. Por isso, a seção segue uma ordem deliberada:

1. **4.2 — Atividades e Técnicas de ER**: tabela mestre com todas as técnicas utilizadas no projeto, a atividade clássica de ER à qual cada uma pertence e o formato/especificação concreta de uso.
2. **4.3 a 4.6 — Etapas do FDD**: como essas mesmas técnicas (já apresentadas em 4.2) são encaixadas nas etapas e cerimônias do FDD, distinguindo o que é feito uma única vez do que se repete a cada iteração.

---

## 4.2 Atividades e Técnicas de Engenharia de Requisitos

Esta tabela é a fonte da verdade sobre **o que** o projeto Crianex usa de Engenharia de Requisitos, independentemente de qual etapa do FDD a aplica. Toda técnica do processo está classificada em uma das seis atividades clássicas de ER — **Elicitação e Descoberta**, **Análise e Consenso**, **Declaração**, **Representação**, **Verificação e Validação** e **Organização e Atualização** — e acompanhada do formato/especificação concreta usado pela equipe (não apenas o nome da técnica).

| Atividade de ER                 | Técnica                               | Especificação / Formato de uso                                                                                                                                               |
| ------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Elicitação e Descoberta**     | Color Modeling                        | Workshop com o Domain Expert (Otávio) para identificar visualmente classes, papéis, eventos e agregados do domínio, antes de qualquer feature ser escrita.                   |
|                                 | Feature Discovery Session             | Sessão dedicada com o Domain Expert para transformar necessidades de negócio brutas em candidatas a feature, ainda sem formato final.                                        |
| **Análise e Consenso**          | Vertical Slicing                      | Toda feature é decomposta em fatias que entregam valor de ponta a ponta (UI → API → dado), nunca em camadas técnicas isoladas.                                               |
|                                 | Matriz Valor × Esforço                | Cada feature é posicionada em quadrantes (alto/baixo valor × alto/baixo esforço) para apoiar a priorização macro e por iteração.                                             |
|                                 | Priorização por IP                    | `IP = VB / PT`, onde `PT = (CX + ES) / 2`. VB, CX e ES em escala 1–5. IP ≥ 1,50 = alta prioridade; 1,00–1,49 = média; < 1,00 = baixa.                                        |
|                                 | Iteration Goal Statement              | Uma frase única, demonstrável e orientada a valor que sintetiza o objetivo da iteração, acordada na Iteration Commitment.                                                    |
| **Declaração de Requisitos**    | Feature Card Specification            | Toda feature é escrita no formato fixo `<ação> <resultado> <de/para/no/com> <objeto>` (ex.: "Cadastrar produto SaaS para o portfólio").                                      |
|                                 | Critérios de aceite em BDD            | Cada issue/feature tem critérios de aceite escritos em **Dado / Quando / Então**, nunca como User Story solta — é parte do Definition of Ready.                              |
| **Representação de Requisitos** | Diagrama de domínio + Glossário       | Diagrama de classes do domínio produzido no Color Modeling, acompanhado de um glossário de termos de negócio compartilhado pela equipe.                                      |
|                                 | Feature Cards (Miro)                  | Cada feature aprovada é registrada como card visual no Miro, linkado à sua CP de origem e rastreável até os RFs/RNFs.                                                        |
|                                 | Diagrama de sequência leve            | Esboço rápido de interações entre componentes/integrações de uma feature, usado na Technical Design Review antes do diagrama formal.                                         |
|                                 | Diagrama de sequência formal          | Versão detalhada do diagrama de sequência para features com integrações ou regras de negócio complexas, produzida quando o esboço leve não é suficiente.                     |
|                                 | Prototipagem                          | Mockup ou protótipo de tela usado quando a feature tem impacto direto de UI/UX, para validar fluxo antes da codificação.                                                     |
| **Verificação e Validação**     | INVEST                                | Checklist aplicado a cada fatia de feature: Independente, Negociável, Valiosa, Estimável, Pequena, Testável — usado para verificar se a fatia está apta a entrar no backlog. |
|                                 | Smoke test end-to-end                 | Teste rápido de ponta a ponta executado na Feature Build Consolidation para confirmar que todas as fatias da feature estão integradas.                                       |
|                                 | Verificação de critérios de aceite    | Conferência item a item dos critérios BDD/checklist da feature contra o comportamento implementado.                                                                          |
|                                 | Validação assíncrona                  | Vídeo curto ou screenshots + checklist de critérios de aceite, enviados a Otávio via WhatsApp em até 24h, sem esperar reunião formal.                                        |
|                                 | Demo orientada a valor                | Demonstração na Formal Client Validation narrada pelo Iteration Goal ("o cliente consegue X"), não por lista de features isoladas.                                           |
| **Organização e Atualização**   | Backlog macro priorizado              | Lista de todas as features do projeto, ordenada por IP, mantida no Miro/GitHub Projects e revisada a cada replenishment macro.                                               |
|                                 | Roadmap de iterações + Feature Matrix | Visão de qual feature entra em qual iteração e quem é o Chief Programmer responsável, atualizada no Plan by Feature.                                                         |
|                                 | Requirements Traceability Matrix      | Tabela viva ligando OE → CP → Feature → RF/RNF, atualizada a cada Feature Build Consolidation (ver `rastreabilidade.md`).                                                    |
|                                 | Backlog Reorganization                | Sessão (eventual) de reordenação do backlog a partir do feedback capturado na Formal Client Validation.                                                                      |
|                                 | Checklist de empacotamento            | Lista de verificação usada na Iteration Artifact Closure para garantir que todos os artefatos exigidos pelo cliente acadêmico foram entregues.                               |

A partir de 4.3, o documento mostra **onde** (em qual etapa e cerimônia do FDD) cada uma dessas técnicas é efetivamente colocada em prática.

---

## 4.3 Etapas Únicas — Realizadas uma vez no início do projeto

As três primeiras etapas do FDD constroem a fundação do produto: o modelo de domínio, a lista de funcionalidades e o plano de desenvolvimento. São executadas **uma única vez**, antes da primeira iteração de construção, e seus artefatos servem de insumo para todas as iterações seguintes.

### Etapa 1 — Develop an Overall Model (Desenvolver Modelo Global)

O objetivo é construir uma visão compartilhada e abrangente do domínio do problema antes de qualquer detalhe funcional ser discutido. A equipe e o Domain Expert (Otávio Maya) exploram juntos o negócio, suas entidades, relacionamentos e regras centrais.

**Cerimônia:** Domain Modeling Workshop

Reunião em que a equipe e o Domain Expert constroem o modelo de domínio que sustenta as features do projeto. O resultado é um entendimento coletivo e documentado sobre as entidades do sistema — não apenas uma lista de requisitos.

**Técnica:** Color Modeling — organização visual dos elementos do domínio para identificar classes, papéis, eventos e agregados.

**Artefatos gerados:** diagrama de domínio e glossário de termos.

---

### Etapa 2 — Build a Feature List (Construir Lista de Funcionalidades)

Com o modelo de domínio estabelecido, a equipe decompõe o sistema em funcionalidades concretas e orientadas ao cliente. Cada feature representa uma ação de valor entregável e verificável.

**Cerimônia:** Feature Discovery Session

Cerimônia dedicada à descoberta e ao refinamento de funcionalidades com o Domain Expert. A equipe transforma necessidades de negócio em features claras, compreensíveis e orientadas a valor.

**Técnicas:**

- _Feature Card Specification_ — padroniza a escrita da feature na formulação `<ação> <resultado> <de/para/no/com> <objeto>`
- _Vertical Slicing_ — orienta a decomposição em partes menores com valor demonstrável de ponta a ponta
- _INVEST_ — garante que cada fatia seja independente, negociável, valiosa, estimável, pequena e testável

**Artefatos gerados:** Feature Cards e ata da sessão.

---

### Etapa 3 — Plan by Feature (Planejar por Funcionalidade)

Com a lista de features construída, a equipe organiza e prioriza o trabalho no horizonte completo do projeto: quais features vão para qual iteração, quem é o Chief Programmer responsável por cada conjunto e qual a sequência de entrega orientada a valor de negócio.

**Cerimônia:** Iteration Replenishment (versão macro — planejamento do roadmap completo)

A priorização é feita com base na matriz **Valor × Esforço** e no **Índice de Prioridade (IP = VB / PT)**, garantindo que as features de maior valor e menor esforço relativo entrem primeiro no fluxo de desenvolvimento.

**Técnicas:**

- _Matriz Valor × Esforço_ — posiciona cada feature em quadrantes de prioridade
- _Priorização IP_ — ordena features por IP = VB / PT, onde PT = (CX + ES) / 2

**Artefatos gerados:** backlog macro priorizado, roadmap de iterações com CPs por iteração e Feature Matrix.

---

## 4.4 Etapas Iterativas — Repetidas em cada iteração

As duas últimas etapas do FDD são executadas **a cada iteração**, para cada conjunto de features comprometido. É aqui que o Kanban entra como sistema de gestão de fluxo, complementando o FDD com visibilidade operacional e controle de WIP.

### Etapa 4 — Design by Feature (Projetar por Funcionalidade)

No início de cada iteração, as features do escopo são refinadas tecnicamente antes de qualquer linha de código ser escrita. Essa etapa produz os critérios de aceite, o design técnico e o compromisso formal da equipe com o objetivo da iteração.

#### Cerimônia 1 — Iteration Replenishment Micro + Commitment

A Iteration Replenishment seleciona as features candidatas para a iteração corrente com base no IP e na capacidade da equipe. O Iteration Commitment formaliza o compromisso da equipe e do cliente com o Iteration Goal — uma frase única e demonstrável que sintetiza o valor a ser entregue.

**Técnicas:**

- _Matriz Valor × Esforço_ e _Priorização IP_ — reordenação das features conforme contexto da iteração
- _Iteration Goal Statement_ — formulação do objetivo principal da iteração

**Artefatos gerados:** backlog priorizado da iteração, lista de features comprometidas e Iteration Goal documentado.

---

#### Cerimônia 2 — Technical Design Review

Cerimônia em que a solução técnica de cada feature comprometida é analisada antes da implementação. O Chief Programmer lidera a sessão com o objetivo de validar a abordagem estrutural e reduzir riscos antes da codificação.

**Técnicas:**

- Diagrama de sequência leve — representa interações e integrações relevantes da solução
- Análise de impacto e identificação de pontos de extensão
- Prototipagem quando aplicável
- Diagrama de sequência formal

**Artefatos gerados:** notas de design e especificação técnica por feature.

---

### Etapa 5 — Build by Feature (Construir por Funcionalidade)

Com o design validado, as features entram no fluxo de execução Kanban. A construção é acompanhada por validações contínuas com o cliente e consolidações formais ao final da iteração.

#### Cerimônia 3 — Midweek Sync / Kanban Pull Execution

Alinhamento rápido e assíncrono da equipe, combinado com a regulação do fluxo de execução das issues pelo Kanban. Garante visibilidade do trabalho em andamento e controle de WIP.

**Técnicas:**

- _Kanban_ e _Pull System_ — novas issues só são puxadas conforme capacidade disponível
- _WIP limits_ — máx. 2 issues In Progress por Class Owner

**Artefatos gerados:** board atualizado, comentários de bloqueio, commits, branches e Pull Requests.

---

#### Cerimônia 4 — Feature Build Consolidation

Cerimônia realizada ao final de cada semana de produção para garantir que todas as fatias de uma feature foram integradas e são rastreáveis de ponta a ponta.

**Técnicas:**

- Smoke test end-to-end
- Verificação de critério de aceite da feature
- Requirements Traceability Matrix

**Artefatos gerados:** features em ambiente de homologação e matriz de rastreabilidade atualizada.

---

#### Cerimônia 5 — Partial Client Validation

Validação assíncrona de entregas intermediárias com Otávio, realizada ao final de cada semana, para acelerar o ciclo de feedback sem aguardar a reunião formal.

**Técnicas:**

- Validação assíncrona via vídeo curto ou screenshots + checklists de critérios de aceite

**Artefatos gerados:** comentário de validação na issue, checklist marcado e organização de feedback para o backlog.

---

#### Cerimônia 6 — Formal Client Validation

Reunião de demo ao final de cada iteração. Confirma com Otávio se o valor de negócio foi de fato entregue. A demo é orientada ao valor entregue — narrativa "o cliente consegue X" —, não a features individuais.

**Técnicas:**

- Demo orientada a valor: narrativa centrada no Iteration Goal, não em funcionalidades isoladas

**Artefatos gerados:** ata da demo, aprovação formal de Otávio e lista de feedback para o backlog. Pode gerar uma sessão extra de **Backlog Reorganization** a partir do feedback capturado.

---

#### Cerimônia 7 — Iteration Artifact Closure

Cerimônia de fechamento da iteração que empacota todos os artefatos que o cliente acadêmico (professor George Marsicano) precisa receber na unidade correspondente.

**Técnicas:**

- Checklist de empacotamento
- Revisão cruzada entre membros da equipe

**Artefatos gerados:** Documento de Visão e GitHub Pages atualizados; backlog congelado da iteração; atas de reunião entregues; matriz de rastreabilidade; evidências de validação da metodologia.

---

## 4.5 Visão Consolidada do Processo

```mermaid
flowchart TD
    subgraph unico[" Etapas Únicas — Início do Projeto"]
        E1["Etapa 1\nDevelop an Overall Model\n─────────────────\nDomain Modeling Workshop"]
        E2["Etapa 2\nBuild a Feature List\n─────────────────\nFeature Discovery Session"]
        E3["Etapa 3\nPlan by Feature\n─────────────────\nReplenishment Macro + Feature Matrix"]
        E1 --> E2 --> E3
    end

    subgraph iter[" Etapas Iterativas — Por Iteração"]
        E4A["Etapa 4 — Design by Feature\n─────────────────\nIteration Replenishment + Commitment\nTechnical Design Review"]
        E5A["Etapa 5 — Build by Feature\n─────────────────\nKanban Pull Execution\nFeature Build Consolidation\nPartial Client Validation\nFormal Client Validation\nIteration Artifact Closure"]
        E4A --> E5A
        E5A -->|próxima iteração| E4A
    end

    E3 --> E4A

    style unico fill:#e3f2fd,stroke:#1565c0,color:#000
    style iter fill:#e8f5e9,stroke:#2e7d32,color:#000
```
