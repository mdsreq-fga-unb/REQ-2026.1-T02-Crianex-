# 4. Engenharia de Requisitos

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 12/04/2026 | Criação das seções 4.1 a 4.4 | Heitor e Lucas |
| 1.1 | 13/04/2026 | Revisão da seção 4 | Equipe Crianex |
| 1.2 | 04/05/2026 | Ajustes da seção 4.1 | Heitor |

---

## 4.1 Abordagem de Engenharia de Requisitos

O projeto Crianex adota um Processo Híbrido (FDD + Kanban), focado em equilibrar a previsibilidade de valor para o cliente com a previsibilidade de fluxo para a equipe. Nesta abordagem, o FDD (Feature-Driven Development) estrutura o planejamento orientado a valor (o que construir), enquanto o Kanban fornece o controle visual da execução (quando puxar o trabalho e quando parar) através da limitação de Work in Progress (WIP).

A seguir, detalhamos as atividades da Engenharia de Requisitos e explicamos como cada técnica será estritamente aplicada no contexto da Crianex para orientar o desenvolvimento:

### Atividades e Técnicas de Requisitos

1. **Elicitação e Descoberta**: Levantamento das necessidades reais do cliente e dos usuários.
> **Feature Discovery Session**: Reuniões estruturadas com o Domain Expert (CTO da Crianex) para capturar o contexto, as regras de negócio e os exemplos concretos das funcionalidades desejadas, transformando necessidades puras em intenções de desenvolvimento.

2. **Análise e Consenso**: Resolução de conflitos, refinamento e negociação das prioridades do escopo.
> **Iteration Replenishment**: Sessões de alinhamento nas quais as intenções capturadas são priorizadas e a equipe firma um compromisso (Iteration Commitment) sobre qual escopo será puxado para a iteração corrente, garantindo que haja um entendimento viável entre a capacidade técnica e a expectativa de negócio.

3. **Declaração**: Escrita formal e estruturada das intenções e requisitos.
> **Feature Card Specification (Padrão FDD)**: Os requisitos são declarados usando o template normativo do FDD no formato `<ação> <resultado> <de/para/no/com> <objeto>` (ex: "Listar produtos SaaS com filtro por categoria na vitrine pública"), garantindo foco total no valor da entrega.
> **Feature Slicing e Critérios de Aceitação**: Decomposição (vertical slicing) das Features em fatias atômicas executáveis que sigam o padrão INVEST. Para cada fatia, são declarados critérios de aceitação objetivos, frequentemente no formato Given/When/Then, estipulando as condições exatas de satisfação.

4. **Representação**: Comunicação visual das relações, fluxos e domínio do sistema.
> **Domain Modeling Workshop**: Técnica de modelagem aplicada (como o Color Modeling do FDD) para construir diagramas de classe e identificar os agregados de negócio com o Domain Expert. Isso representa visualmente as entidades do sistema antes da escrita das Features.
> **Technical Design Review**: Representação de soluções através de diagramas de sequência leves para ilustrar integrações e validar o design estrutural das Features com o Chief Programmer antes do início da codificação.

5. **Verificação e Validação**: Confirmação da qualidade interna dos requisitos e do alinhamento com a necessidade externa.
> **Revisão de Design e Regras (Verificação)**: Inspeções conduzidas na etapa de Technical Design Review (FDD Etapa 4) para checar a completude do requisito, analisando pontos de extensão, riscos técnicos e garantindo que o requisito atende ao Definition of Ready (DoR).
> **Formal Client Validation (Validação)**: Sessões de demonstração contínua ao Domain Expert para atestar que a funcionalidade construída resolve efetivamente a dor operacional da Crianex (fechando o ciclo de aceitação).

6. **Organização e Atualização**: Manutenção do conjunto de requisitos de forma rastreável ao longo do ciclo de vida.
> **Gestão de Fluxo Visual (Kanban)**: O estado dos requisitos é gerenciado e atualizado continuamente através de um quadro visual com políticas explícitas, controlando o fluxo de trabalho de Discovery até Done e evitando gargalos pela limitação de tarefas simultâneas (WIP).
> **Rastreabilidade Bidirecional**: Técnica utilizada para garantir que o fatiamento (slicing) técnico executado pela equipe esteja obrigatoriamente ligado (linkado) ao Feature Card pai de negócio e ao Objetivo Estratégico de origem, permitindo auditar o impacto de qualquer mudança de escopo.

### Priorização — Índice de Prioridade (IP)

Para o sequenciamento das entregas e organização do fluxo macro, o projeto abandonou técnicas de categorização qualitativa e adotou o cálculo do Índice de Prioridade (IP).

Essa técnica quantitativa matemática é aplicada na fase de Discovery para ordenar o backlog. O IP é calculado a partir da relação direta entre a importância para a Crianex e o custo da implementação técnica, utilizando a seguinte fórmula estabelecida pela equipe técnica:

`IP = Valor de Negócio / Média(CX, ES, PT)`

Onde o Valor de Negócio é a nota de impacto definida em conjunto com o Domain Expert e as variáveis do divisor representam os custos de execução (Complexidade, Esforço, e Risco/Pesquisa Técnica). Isso permite que a equipe puxe (via Kanban) primeiramente as Features que entregam o maior valor com o menor custo/risco relativo, formando o escopo principal do Produto Mínimo Viável (MVP) do Crianex Hub de forma estruturada e objetiva.

---

## 4.2 Alinhamento FDD – Engenharia de Requisitos

O FDD (Feature-Driven Development) possui cinco etapas sequenciais que mapeiam diretamente as atividades da Engenharia de Requisitos. Para garantir que os objetivos de negócio sejam traduzidos corretamente em software executável, o projeto adota uma cadeia de rastreabilidade explícita em múltiplos níveis de abstração:

**Cadeia de Rastreabilidade**: OE → CP → Feature FDD → User Story → Critério de Aceite → Teste/Validação

É fundamental distinguir os elementos dessa cadeia:

- **OE (Objetivo Específico)**: A meta de negócio que a Crianex deseja alcançar.
- **CP (Característica de Produto)**: Um agrupamento de alto nível ou módulo que contribui para o OE (ex: CRM Interno). Representa o "O Quê" na visão do usuário.
- **Feature FDD**: É a decomposição da CP em uma pequena funcionalidade valorizada pelo cliente, que pode ser construída em poucos dias. É escrita no formato estrito `<ação> <resultado> <objeto>` (ex: "Listar produtos SaaS com filtro").
- **User Story (Fatia)**: É o fatiamento técnico (vertical slicing) da Feature FDD em pedaços ainda menores para facilitar o fluxo (Kanban).
- **Critério de Aceite**: A regra de negócio ou restrição exata (frequentemente em formato Given/When/Then) que prova que a Story/Feature está concluída.

A tabela a seguir demonstra o mapeamento formal das etapas do FDD com as atividades dominantes de ER e as técnicas exatas aplicadas em cada fase:

| Etapa do FDD | ER Dominante | Técnicas de ER Adotadas | Artefatos Gerados |
|--------------|--------------|--------------------------|-------------------|
| 1 — Desenvolver Modelo Geral | Elicitação + Análise + Representação | Feature Discovery Session e Domain Modeling Workshop. Foco em entender o contexto, os atores e delimitar o problema junto ao Domain Expert. | Modelo de domínio validado, Glossário de termos e Rich Picture. |
| 2 — Construir Lista de Funcionalidades | Declaração + Organização | Feature Card Specification (declaração no padrão `<ação> <resultado> <objeto>`) e Decomposição Estruturada. Mapeamento bidirecional garantindo a rastreabilidade (OE → CP → Feature). | Backlog macro de Features (Feature List) rastreável e estruturado. |
| 3 — Planejar por Funcionalidade | Análise + Priorização (Organização) | Cálculo do Índice de Prioridade (IP) (Matemática de Valor x Custo) e Iteration Replenishment (negociação de escopo viável com os stakeholders). | Lista de Features comprometidas para a iteração (Iteration Commitment). |
| 4 — Projetar por Funcionalidade | Declaração Detalhada + Representação + Verificação | Feature Slicing (decomposição em User Stories), Definição de Critérios de Aceitação (no formato Given/When/Then) e Technical Design Review (para verificação de regras antes da codificação). | User Stories "Ready" com critérios de aceite precisos e Notas de Design. |
| 5 — Construir por Funcionalidade | Verificação + Validação + Atualização | Inspeção Formal (revisão de qualidade do design/código pelos pares), Formal Client Validation (demonstração focada em valor) e Auditoria de Rastreabilidade para refletir a entrega no escopo. | Funcionalidade validada pelo cliente e Matriz de Rastreabilidade atualizada. |
