# 5. Cronograma e Entregas

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 11/04/2026 | Criação do cronograma de sprints | Lucas A. Zanetti |
| 1.1 | 13/04/2026 | Revisão da seção 5 | Equipe Crianex |
| 1.2 | 04/05/2026 | Atualização do cronograma para Processo Híbrido (Iterações) | Heitor |

---

A partir da adoção do processo híbrido (FDD + Kanban), o projeto abandona o conceito rígido de "Sprints" do framework Scrum e passa a organizar o cronograma em Iterações orientadas a valor. A dinâmica de trabalho deixa de ser em lotes fixos fechados e passa a ser um fluxo contínuo puxado pela capacidade da equipe (limitada pelo WIP).

## 5.1 O Ciclo de Vida de uma Feature no Cronograma

Para garantir a consistência metodológica entre o FDD e a execução no tempo, toda Feature percorre um fluxo padronizado dentro de cada iteração:

- **Entrada e Refinamento**: A feature nasce em uma Feature Discovery Session com o cliente (CTO da Crianex). Ela entra no backlog macro e é selecionada na reunião de Iteration Replenishment. A partir daí, ela sofre o Feature Slicing, sendo fatiada em entregas menores atômicas com critérios de aceitação.
- **Design e Construção**: Antes de qualquer código ser escrito, a fatia passa por um Technical Design Review (Etapa 4 do FDD) conduzido pelo Chief Programmer. Aprovado o design estrutural, o desenvolvedor (Class Owner) puxa a tarefa para execução (Kanban Pull Execution), garantindo a etapa 5 do FDD.
- **Validação**: Entregas intermediárias passam por Partial Client Validation contínua com o cliente ao longo do ciclo. Ao final da iteração, o conjunto consolidado de features que formam um Valor de Negócio passa pela Formal Client Validation.

## 5.2 Roadmap de Iterações

O quadro a seguir apresenta os ciclos de trabalho planejados, alinhados aos Valores de Negócio e às Características de Produto (CPs) originadas no documento de visão.

> **Nota**: O planejamento é preliminar e sofre reordenação contínua baseada no Índice de Prioridade (IP).

| Iteração e Período | Valor de Negócio (Objetivo) | Escopo FDD e Entregas Esperadas | Validação com o Cliente |
|--------------------|-----------------------------|---------------------------------|-------------------------|
| **IT1** <br> (Finalizada) | Documentação Inicial e Setup | Levantamento, documentação da Visão de Produto, configuração de ambiente e definição da arquitetura macro. | Reunião inicial para validação de escopo, entendimento do domínio e priorização do MVP. |
| **IT2** <br> (Até 19/05) | Vitrine Pública | Modelagem e Construção: CP2, CP5, CP7 e CP15. Envolve o módulo de autenticação e a vitrine pública de produtos SaaS. | Partial Validation contínua da navegação. Demonstração final (Formal Validation) focada na conversão da nova vitrine. |
| **IT3** <br> (20/05 a 16/06) | Núcleo Admin | Modelagem e Construção: CP1, CP3 e CP4. Envolve o CRM Interno em Kanban, Dashboard Executivo e o sistema de monitoramento de logs unificados. | Demonstração do cruzamento de logs e tickets; validação das métricas operacionais diretamente com os sócios. |
| **IT4** <br> (17/06 a 30/06) | Operação Digital | Modelagem e Construção: CP6, CP8 e CP9. Foco na operação de suporte e gestão contínua. | Feedback focado na usabilidade da equipe de suporte e fluxos administrativos. |
| **IT5** <br> (01/07 a 07/07) | Confiança e Consolidação | Construção e Auditoria: CP10, CP11, CP12, CP13 e CP14. Envolve segurança OWASP, módulo financeiro/faturamento e testes end-to-end do MVP. | Homologação final do cliente em ambiente de produção; aprovação final do MVP para o mercado. |
