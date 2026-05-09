# 4. Engenharia de Requisitos

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 12/04/2026 | Criação das seções 4.1 a 4.4 | Heitor e Lucas |
| 1.1 | 13/04/2026 | Revisão da seção 4 | Equipe Crianex |
| 1.2 | 04/05/2026 | Ajustes da seção 4.1  | Heitor |
| 1.3 | 04/05/2026 | Ajustes da seção 4.2  | Heitor |
| 1.4 | 06/05/2026 | Revisão dos ajustes da seção 4.1 e reajustes | Philipe |
| 1.5 | 05/05/2026 | Ajustes de clareza e consistência na seção 4 | Hugo |
| 1.6 | 08/05/2026 | Ajustes de cerimônias e técnicas | Lucas e Philipe |

---

## 4.1 Abordagem de Engenharia de Requisitos

O projeto Crianex adota um Processo Híbrido (FDD + Kanban). Nesta abordagem, o FDD (Feature-Driven Development) estrutura o planejamento orientado a valor (o que construir), enquanto o Kanban fornece o controle visual da execução (quando puxar o trabalho e quando parar) através da limitação de Work in Progress (WIP).
A seguir, detalhamos as atividades da Engenharia de Requisitos e explicamos como cada técnica será aplicada no desenvolviemnto de requisitos:

### Cerimônias, Técnicas e Artefatos do Processo Híbrido

#### 1. Domain Modeling Workshop
O *Domain Modeling Workshop* é a cerimônia em que a equipe e o *Domain Expert* constroem ou refinam o modelo de domínio que sustenta as *features* da iteração. Seu objetivo é alinhar o entendimento sobre entidades, relacionamentos e regras de negócio antes do detalhamento funcional.

**Técnica:** *Color Modeling*. Essa técnica organiza visualmente os elementos do domínio, ajudando a identificar classes, papéis, eventos e agregados relevantes para o sistema.  

**Artefatos gerados:** diagrama de domínio atualizado e glossário de termos.

#### 2. Feature Discovery Session
A *Feature Discovery Session* é a cerimônia dedicada à descoberta e ao refinamento de funcionalidades com o *Domain Expert*. Nela, a equipe transforma necessidades de negócio em *features* claras, compreensíveis e orientadas a valor.

**Técnicas:** *Feature Card Specification*, *Vertical Slicing* e critérios *INVEST*. O *Feature Card Specification* padroniza a escrita da *feature* em uma formulação objetiva; o *Vertical Slicing* orienta a decomposição funcional em partes menores com valor demonstrável; e o INVEST ajuda a garantir que cada fatia seja independente, negociável, valiosa, estimável, pequena e testável.  

**Artefatos gerados:** *Feature Cards* novas ou revisadas e ata da sessão.

#### 3. Iteration Replenishment
A *Iteration Replenishment* é a cerimônia em que as *features* candidatas são analisadas e selecionadas para a iteração corrente. O foco é montar um escopo viável, compatível com a capacidade da equipe e com o valor de negócio esperado.

**Técnicas:** matriz Valor × Esforço e *Priorização IP*. Essas técnicas apoiam a ordenação das *features* conforme valor, esforço e viabilidade de execução.  
**Artefatos gerados:** backlog priorizado da iteração e lista de *features* comprometidas.

#### 4. Iteration Commitment
A *Iteration Commitment* é a cerimônia em que a equipe formaliza o compromisso com o escopo e com o objetivo principal da iteração. Ela garante que todos compartilhem o mesmo entendimento sobre a entrega esperada.

**Técnica:** *Iteration Goal Statement*. Essa técnica consiste em formular uma frase clara, única e demonstrável que sintetize o valor de negócio a ser entregue ao final da iteração.  

**Artefatos gerados:** *Iteration Goal* documentado e ata do compromisso.

#### 5. Technical Design Review
O *Technical Design Review* é a cerimônia em que a solução técnica da *feature* é analisada antes da implementação. Seu objetivo é validar a abordagem estrutural da solução e reduzir riscos antes da codificação.

**Técnica:** diagrama de sequência leve. Essa técnica representa as interações e integrações relevantes da solução, ajudando a equipe a antecipar dependências e pontos de extensão.  

**Artefatos gerados:** notas de design e especificação técnica da *feature*.

#### 6. Formal Client Validation 
A *Formal Client Validation* confirma com o cliente real se o valor de negócio foi de fato entregue. 

**Técnicas:** Demo orietada a valor (Não a feature) - narrativa: "o cliente consegue X". Essas técnicas ajudam a verificar completude, coerência e ligação entre objetivo estratégico.  

**Artefatos gerados:** Atas da demo; aprovação formal do Otávio; lista de feedback para o backlog. Essa etapa pode gerar um cerimônia extra chamada Backlog Reorganization a partir do feedback do cliente.


#### 7. Feature Build Consolidation
A *Feature Build Consolidation* é uma cerimômina que garante que todas as fatias de uma feature foram integradas e possíveis de rastrea-las, com as featuras end-to-end. Será realizado todo final da semana de produção.

**Técnicas**: Smoke test end-to-end, verficação de critério de aceite da feature e requirements traceability matrix.

**Artefatos gerados**: Features em ambiente de homologação; matrix de rastreabilidade atualizada. 

#### 8. Partial Client Validation
O *Partial Client Validation* é uma cerimônia que valida entregas intermediárias com o cliente, idealmente assincronamente, para acelerar feedbacks.

**Técnicas**: Validação assincrona via vídeo curto ou screenshots + checklists.

**Artefatos gerados**: Comentário de validação na issue; checklist marcado; organização de feedback. 
#### 9. Iteration Artifact Closure
O *Iteration Artifact Closure* é uma cerimônia para empacotar tudo que o cliente acadêmico (professor) precisa receber na unidade correspondente.

**Técnicas**: Checklist de empacontamento e revisão cruzada.

**Artefatos gerados**: Documento de visão e GitHub pages atualizado; Backlog congelado da iteração; Reuniões e atas entrengues; Matriz de rastreabilidade; Evidências de validação da metodologia.

#### 10. Midweek Sync / Kanban Pull Execution
O *Midweek Sync* é a cerimônia de alinhamento rápido da equipe, enquanto o *Kanban Pull Execution* regula o fluxo de execução das issues ao longo da iteração. Em conjunto, essas cerimônias promovem visibilidade do trabalho e controle do andamento das entregas.

**Técnicas:** *Kanban*, *Pull System* e *WIP limits*. Essas técnicas organizam o fluxo visual, limitam o trabalho simultâneo e garantem que novas atividades só sejam puxadas conforme a capacidade disponível.  

**Artefatos gerados:** board atualizado, comentários de bloqueio, commits, branches e Pull Requests.

### Tabela de Cerimônias e Técnicas do Processo Híbrido FDD + Kanban

| Processo de Desenvolvimento | Descrição do Processo | Cerimônia | Técnicas de Apoio | Artefatos | Critérios / Políticas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Desenvolvimento de Domínio** | Modelagem colaborativa para criar uma visão compartilhada do sistema e identificar o domínio do problema. | **Domain Modeling Workshop** | *Color Modeling*. | Diagrama de domínio; glossário de termos. | — |
| **2. Decomposição Funcional** | Divisão do sistema em áreas de funcionalidade, conjuntos de *features* e *features* específicas orientadas ao cliente. | **Feature Discovery Session** | *Feature Card Specification*;*Vertical Slicing*; *INVEST*. | *Feature Cards*; ata da sessão. | — |
| **3. Planejamento e Priorização** | Organização das *features* em conjuntos relacionais e priorização com base em valor, dependências e complexidade. | **Iteration Replenishment** | *Matriz Valor × Esforço*; *Priorização IP*. | Backlog priorizado; lista de *features* comprometidas. | — |
| **4. Compromisso da Iteração** | Formalização do escopo da iteração e do objetivo principal a ser entregue. | **Iteration Commitment** | *Iteration Goal Statement*. | *Iteration Goal* documentado; ata do compromisso. | *Definition of Ready*; *Definition of Done*. |
| **5. Documentação e Design** | Produção de documentação prática e objetiva, incluindo especificação funcional e decisões de design. | **Technical Design Review** |  Diagrama de sequência leve; Prototipagem; Análise de impacto; Identiifcação de pontos de extensão | Notas de design; especificação da *feature*. | — |
| **6. Gestão de Fluxo** | Controle contínuo do estado das *features* ao longo do ciclo de vida de desenvolvimento. | **Midweek Sync**; **Kanban Pull Execution** | *Kanban*; *Pull System*; *WIP limits*. | Board atualizado; comentários de bloqueio; PRs. | — |
| **7. Verificação e Rastreabilidade** | Acompanhamento do progresso das *features* com base em marcos, inspeções e mecanismos de rastreabilidade. | **Feature Build Consolidation**; **Partial Client Validation**; **Formal Client Validation**; **Iteration Artifact Closure**. | *Inspeção formal de design e código*; *Rastreabilidade Bidirecional*; *Backlog Reorganization Session*; *Checklist de empacontamento e revisão cruzada*. | Matriz de rastreabilidade; evidências de validação; Documento de visão e GitHub pages atualizado; Backlog congelado da iteração; Reuniões e atas entrengues; Matriz de rastreabilidade; Evidências de validação da metodologia. | — |

---
