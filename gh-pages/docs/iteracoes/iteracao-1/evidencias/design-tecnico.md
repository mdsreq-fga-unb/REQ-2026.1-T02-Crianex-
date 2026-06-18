# IT1 — Design Técnico

Artefatos produzidos durante a fase de **Technical Design Review (TDR)** da IT1, aplicando a **Formalização Seletiva**: diagramas leves e acordos de arquitetura para mitigar riscos antes do desenvolvimento, seguidos de validação com os stakeholders.

---

## O que é um Diagrama Leve?

Representação visual simplificada do fluxo de comunicação entre as entidades do sistema (Frontend, API, Banco de Dados, etc.). Em vez de utilizar toda a notação formal da UML, o diagrama leve foca no essencial: ilustrar de forma clara e ágil como os dados transitam para resolver uma funcionalidade específica. Facilita o alinhamento técnico sem gerar sobrecarga de documentação.

## O que é um Feature Card?

Elemento visual utilizado na fase de planejamento que documenta uma funcionalidade de forma atômica. Consolida título da feature, regras de negócio e critérios de aceitação (formato BDD — _Dado/Quando/Então_). Garante que toda a equipe tenha clareza do escopo antes de escrever a primeira linha de código, servindo como insumo direto para a criação das issues.

---

## Exemplos de Referência

<div align="center">
  <p><strong>Figura 1</strong> — Exemplo de Diagrama Leve</p>
  <img src="../../images/diagramaleveex.png" alt="Exemplo de Diagrama Leve" width="800">
  <p><em>Fonte: Wondershare, 2026.</em></p>
</div>

<div align="center">
  <p><strong>Figura 2</strong> — Exemplo de Feature Card</p>
  <img src="../../images/featurecardex.png" alt="Exemplo de Feature Card" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

## Artefatos de Domain Modeling

### Glossário de Domínio

Artefato gerado a partir da **Domain Modeling** do FDD em reunião com os stakeholders Otávio e Vitor. Lista e explica palavras que devem ter significado explícito para o consenso do grupo.

<div align="center">
  <p><strong>Figura 3</strong> — Glossário de Palavras (parte 1)</p>
  <img src="../../images/gloassario1.png" alt="Glossário de Palavras — parte 1" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

<div align="center">
  <p><strong>Figura 4</strong> — Glossário de Palavras (parte 2)</p>
  <img src="../../images/glossario2.png" alt="Glossário de Palavras — parte 2" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

### Diagrama de Domínio

<div align="center">
  <p><strong>Figura 5</strong> — Diagrama de Domínio</p>
  <img src="../../images/diagrama_dominio.png" alt="Diagrama de Domínio" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

## Diagramas Leves e Feature Cards por Feature

### CP5 — Painel de Gerenciamento do Administrador

#### F09 — Autenticar administradores

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF09.png" alt="Diagrama Leve — F09" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/featurecardF09.png" alt="Feature Card — F09" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

#### F10 — Acessar painel administrativo

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF10.png" alt="Diagrama Leve — F10" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/featurecardF10.png" alt="Feature Card — F10" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

#### F11 — Gerenciar membros da Crianex

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF11.png" alt="Diagrama Leve — F11" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/featurecardF11.png" alt="Feature Card — F11" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

### CP4 — Vitrine Pública de Produtos SaaS

#### F12 — Gerenciar produtos SaaS

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF12.png" alt="Diagrama Leve — F12" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/feturecardF12.png" alt="Feature Card — F12" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

#### F13 — Publicar / despublicar produto SaaS

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF13.png" alt="Diagrama Leve — F13" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/featurecardF13.png" alt="Feature Card — F13" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

#### F14 — Formulário de contato

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF14.png" alt="Diagrama Leve — F14" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/featurecardF14.png" alt="Feature Card — F14" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

#### F15 — Página institucional

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF15.png" alt="Diagrama Leve — F15" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/featurecardF15.png" alt="Feature Card — F15" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

### CP6 — FAQ e Base de Conhecimentos por Produto

#### F16 — CRUD de artigos de FAQ

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF16.png" alt="Diagrama Leve — F16" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/featurecardF16.png" alt="Feature Card — F16" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

#### F17 — Publicar / despublicar artigo de FAQ

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF17.png" alt="Diagrama Leve — F17" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/featurecardF17.png" alt="Feature Card — F17" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

#### F18 — Avaliação de artigos de FAQ

**Diagrama Leve**

<div align="center">
  <img src="../../images/diagrama_sequencia/diagramaleveF18.png" alt="Diagrama Leve — F18" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

**Feature Card**

<div align="center">
  <img src="../../images/feature_card/featurecardF18.png" alt="Feature Card — F18" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>

---

## Validação pelo Cliente (Domain Expert)

### Feedback sobre a Priorização do Backlog

<div align="center">
  <p><strong>Figura 6</strong> — Feedback do cliente Otávio sobre a Priorização do Backlog</p>
  <img src="../../images/feedback_priorizacao.png" alt="Feedback sobre priorização" width="600">
  <p><em>Fonte: Comunicação direta com o cliente (Domain Expert), 17/05/2026.</em></p>
</div>

| Feedback Recebido                                                                   | Aprovação | Ação Tomada                                                                                           |
| ----------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| Formato de priorização muito claro — motivo de cada item priorizado está explícito  | Elogio    | Mantido                                                                                               |
| Features (RFs agrupados) não estão ordenados por prioridade — ao contrário dos RNFs | Correção  | Tabela de Features reordenada por IP decrescente em [priorizacao.md](../../../backlog/priorizacao.md) |
| Ausência de flag ou coluna indicando o que entra no MVP                             | Adição    | Coluna **MVP** adicionada nas tabelas de Features e RNFs (Q1 = Alta / Q2 em diante)                   |
| Dificuldade de leitura de algumas tabelas no GitHub Pages                           | Registro  | Tabelas revisadas                                                                                     |

### Feedback sobre o Protótipo

O feedback do cliente sobre o protótipo está registrado na página dedicada: [Protótipo de Alta Fidelidade](./prototipo.md#validação-pelo-cliente).

### Feedback Geral

<div align="center">
  <p><strong>Figura 8</strong> — Feedback geral do cliente (Domain Expert)</p>
  <img src="../../images/feedback.png" alt="Feedback geral do cliente" width="800">
  <p><em>Fonte: Elaborado pelos autores.</em></p>
</div>
