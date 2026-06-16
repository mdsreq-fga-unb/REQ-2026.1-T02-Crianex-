# Reunião — 09/06/2026

**Data:** 09 de junho de 2026  
**Horário:** 00h30  
**Duração:** 34 minutos e 45 segundos  
**Local:** Google Meet  
**Assunto:** Iteration 2 Replenishment Micro e Commitment — Kickoff e Backlog da IT2

---

## Participantes

| Nome          | Papel                                                            | Status   |
| ------------- | ---------------------------------------------------------------- | -------- |
| Lucas Zanetti | Project Manager · Chief Architect · Development Manager (Backup) | Presente |
| Heitor        | Development Manager · Class Owner                                | Presente |
| Hugo          | Class Owner                                                      | Presente |
| Philipe       | Chief Programmer · Class Owner                                   | Presente |

---

## Pauta

1. Formalizar encerramento da IT1 e consolidar validação com o cliente
2. Analisar mapa de prioridades FDD para selecionar escopo da IT2
3. Detalhar RFs das features de CRM, Autenticação, Logs e Notificações
4. Distribuir frentes de trabalho (Frontend e Backend) entre os membros

---

## Discussões e Decisões

### 1. Definição de Escopo e Prioridades (FDD)

- **Status da IT1:** Features Green, Light Blue e Dark Blue foram integralmente concluídas. Resta finalizar a publicação da documentação no GitHub Pages.
- **Foco do MVP (IT2):** Features Laranja e Roxa — especificamente **F07**, **F08** e o bloco CRM: **F19**, **F20** e **F21**.
- O grupo adotou abordagem realista para garantir código robusto e testável, evitando inflar o escopo além da capacidade de entrega do ciclo acadêmico.

### 2. Detalhamento dos Requisitos por Feature

#### F19, F20 e F21 — Módulo CRM (Ações Comerciais e Leads)

- **Mapeamento de Interações:** Sistema deve registrar e listar interações comerciais com leads. Cada interação contém: descrição, data do contato e canal utilizado (WhatsApp, Email, Reunião).
- **Funil de Vendas / Kanban:** Estrutura de visualização em colunas para estágios dos leads (ex: Prospecção, Proposta, Fechado).
- **Valores e Métricas:** Campo de valor monetário estimado por lead para geração de indicadores financeiros simples.
- **Histórico do Lead:** Perfil unificado com todas as interações passadas em ordem cronológica.

#### F07 & F08 — Autenticação e Segurança (Débitos Técnicos)

- **Recuperação de Senha:** Adição obrigatória do fluxo "Esqueci minha senha" via e-mail de recuperação.
- **Toggle de Visibilidade:** Ícone de "olho" nas caixas de senha para alternar visibilidade da digitação.
- **Separação de Roles:** Refinamento da arquitetura para separar permissões de _Owner_ (dono do workspace) e _Membro_ comum.

#### Módulo de Notificações e Logs

- **Ações do Sistema:** Notificar usuários sobre eventos importantes — novo lead no sistema, alertas de segurança.
- **Gerenciamento de Notificações:** Telas para marcar como lida, apagar histórico de alertas e configurar permissões de exibição por tipo de alerta.
- **Estilização Dinâmica:** Cores e templates estruturados por nível de severidade ou categoria do evento.

### 3. Arquitetura e Engenharia de Software

- **Modelagem Técnica:** Lucas documentou na Wiki novo diagrama arquitetural com foco em gestão de _roles_ e controle de acessos (RBAC).
- **Diagramas de Sequência:** Equipe alinhou produção de diagramas simplificados para as features da IT2 antes da publicação no GitHub Pages.

---

## Encaminhamentos

| #   | Tarefa                                                                       | Responsável | Prazo      |
| --- | ---------------------------------------------------------------------------- | ----------- | ---------- |
| 1   | Publicar documentação da IT1 finalizada no GitHub Pages                      | Equipe      | 16/06/2026 |
| 2   | Iniciar implementação do módulo CRM (F19–F21) — Frontend                     | Heitor      | A definir  |
| 3   | Iniciar implementação do módulo CRM (F19–F21) — Backend                      | Philipe     | A definir  |
| 4   | Implementar fluxo de recuperação de senha e toggle de visibilidade (F07/F08) | Hugo        | A definir  |
| 5   | Publicar diagrama RBAC na Wiki do projeto                                    | Lucas       | 16/06/2026 |

---

## Gravação da Reunião

<iframe width="560" height="315" src="https://www.youtube.com/embed/x13gsi8StuA" title="IT2 Replenishment Micro e Commitment — Kickoff e Backlog" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

_Ata redigida para registro e consulta dos membros da equipe._
