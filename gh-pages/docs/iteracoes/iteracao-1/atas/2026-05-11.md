# Reunião — 11/05/2026

**Data:** 11 de Maio de 2026
**Local:** Google Meet / Chamada de Vídeo (Miro)
**Assunto:** Feature Discovery Session e Otimização do Backlog — Crianex

---

## Participantes

| Nome          | Papel                                                           | Status   |
| ------------- | --------------------------------------------------------------- | -------- |
| Lucas Zanetti | Project Manager · Chief Architect · Development Manager(Backup) | Presente |
| Heitor        | Development Manager · Class Owner                               | Presente |
| Hugo          | Class Owner                                                     | Presente |
| Philipe       | Chief Programmer · Class Owner                                  | Presente |
| Leonardo      | Chief Programmer · Class Owner                                  | Presente |
| Camile        | Class Owner · Documentation Lead · Requirements Custodian       | Ausente  |

---

## Pauta

1. Otimização do Backlog Macro e Prazos
2. Revisão das Etapas e Cerimônias do FDD
3. Consolidação e Refinamento do Backlog de Features (Miro)

---

## Discussões e Decisões

### 1. Otimização do Backlog Macro e Prazos

- **Redução do Escopo Acadêmico:** Para contornar o calendário enxuto da Unidade 2 e os ritos do FDD, o escopo macro foi otimizado. O backlog foi reduzido para **11 Características de Produto (CPs) e 3 iterações** (anteriormente planejadas em 4), sem perda de valor para o cliente.
- **Impacto do Cronograma:** Devido ao tempo gasto na resolução das issues da Unidade 1, o prazo para a Interação 2 (Vitrine Pública) ficou severamente reduzido. A equipe tem pouco mais de uma semana (com entrega na terça-feira da semana subsequente) para planejar, codificar e validar o incremento.
- **Pendência Documental:** O documento de introdução (PID) está avançado, restando apenas a seção de **Estratégias** que havia sido delegada à Camile (ausente nesta reunião).

### 2. Revisão das Etapas e Cerimônias do FDD

O PM Lucas Zanetti relembrou a estrutura das ritos metodológicos adotados pelo grupo:

1. **Domain Modeling Workshop:** Alinhamento de dores e entidades conceituais (concluída com o cliente Otávio).
2. **Feature Discovery Session:** (Fase atual da reunião) Brainstorming e refinamento técnico da equipe de desenvolvimento.
3. **Planejamento e Priorização por Funcionalidade:** Distribuição das entregas ao longo das semanas da iteração.
4. **Compromisso de Interação (_Commitment_):** Formalização e validação dos requisitos finais com o cliente.
5. **Technical Design Review & Código:** Fluxo real de implementação (conduzido pelos _Chief Programmers_ e _Class Owners_).

### 3. Consolidação e Refinamento do Backlog de Features (Miro)

Após 30 minutos de brainstorming silencioso, a equipe agrupou os post-its, eliminou duplicatas e refinou a granularidade das seguintes características voltadas para a Interação 2:

#### CP4 — Vitrine Pública de Produtos SAS

- **Visão do Visitante:** Exibição de cards individuais com nome, descrição comercial, logotipos, ícones e tags de público-alvo dos 3 produtos SAS atuais. Inclusão de uma galeria/carrossel de fotos organizadas (screenshots) e links diretos para ambientes de demonstração (_demos_), caso existam.
- **Métricas Dinâmicas:** Exibição no card de dados operacionais reais consumidos via API nativa do cliente (ex: volume de alunos/escolas ativos no sistema de correção de provas).
- **Internacionalização:** Alternância de idioma nativo (PT/EN) via dropdown utilizando a biblioteca **i18n**.
- **Gestão do Admin:** Área administrativa com CRUD para os produtos (adicionar, editar, remover e desativar produtos em manutenção) com capacidade de upload de screenshots e reordenação visual dos cards na vitrine via _drag-and-drop_. O Admin terá uma função de _preview_ do card antes de publicá-lo.

#### CP5 — Página Institucional da Empresa

- **Conteúdo Institucional:** Seções dedicadas à história ("Quem Somos"), missão, visão, valores e diferenciais técnicos da Crianex. Exibição estruturada dos membros/sócios da empresa, clientes de destaque e parceiros corporativos.
- **Contatos Externos:** Disponibilização visual e acessível de canais de contato externos (E-mail e botão clicável do WhatsApp utilizando rotas com mensagens automáticas pré-configuradas baseadas no interesse do lead).
- **Otimização Geral:** Implementação de metatags de **SEO** focadas em indexação orgânica tanto para a Home corporativa quanto para as páginas de produtos, além de garantia de responsividade global (com foco em _mobile_).

#### CP6 — Formulário de Contato e Captação de Leads

- **Fluxo de Captura:** Formulário simples para envio de dados essenciais (Nome Completo, E-mail, Telefone, Mensagem e um campo _select_ do produto de interesse — contendo obrigatoriamente a opção "Geral").
- **Regras de Validação e Segurança:** Bloqueio de campos vazios, tratamento de erros no frontend, exibição de dicas amigáveis (_hints_) ao usuário e toasts/mensagens de sucesso/erro. Proteção do formulário contra ataques de _spam_ e injeções de banco de dados (_SQL Injection_).
- **Conformidade Legal:** Inclusão de um checkbox obrigatório de consentimento de privacidade alinhado às diretrizes da LGPD.
- **Persistência e Arquitetura:** Submissão do formulário salva os dados diretamente no Supabase, registrando data, hora e origem do lead. Funcionalidades avançadas de CRM (como mover leads em formato Kanban e exportar dados em CSV) foram formalmente postergadas para a iteração de gestão (Interação 3/4).
- **Área do Admin (Acesso):** O painel do administrador não terá botões públicos na vitrine. O acesso será feito por uma rota URL personalizada (`/admin`) que levará à tela de login. Para poupar tempo de desenvolvimento no MVP, as credenciais administrativas de Otávio e Vitor serão cadastradas diretamente no Supabase pela equipe, eliminando a necessidade de uma tela pública de registro de novos administradores.

#### CP8 — FAQ e Base de Conhecimento por Produto

- **Visualização:** Listagem estruturada de perguntas e respostas em formato expansível (_Accordion_ - expandir/recolher). Os artigos serão agrupados por produto ou por contexto geral da empresa, contando com filtros e busca rápida por palavra-chave.
- **Feedback:** Botões de utilidade rápida ("Esta resposta foi útil? Sim / Não") para retroalimentar as métricas do Admin.
- **Navegação:** Implementação de rotas limpas ou _breadcrumbs_ para permitir o compartilhamento de links permanentes de perguntas específicas do FAQ via WhatsApp.
- **CRUD do FAQ:** Interface administrativa interna para criar, editar e remover artigos do FAQ vinculados a um produto ou contexto.

---

## Encaminhamentos

Ficou acordado que, para otimizar o tempo de chamada síncrona, as etapas de dimensionamento e checagem de qualidade dos requisitos serão descentralizadas.

| #   | Tarefa                                                                                      | Responsável    | Prazo      |
| --- | ------------------------------------------------------------------------------------------- | -------------- | ---------- |
| 1   | Concluir seção de Estratégias no PID/Documento de Visão                                     | Camile         | 12/05/2026 |
| 2   | Atribuir _T-shirt Sizing_ (XS, S, M, L, XL) nas features do Miro de forma assíncrona        | Toda a Equipe  | 12/05/2026 |
| 3   | Realizar o fatiamento vertical (_Vertical Slicing_) de cards avaliados como "M" ou superior | Toda a Equipe  | 12/05/2026 |
| 4   | Validar o backlog final sob os critérios do INVEST                                          | Lucas / Heitor | 13/05/2026 |
| 5   | Migrar as features refinadas para a tabela de _Feature Card Specification_ no Backlog       | Lucas          | 13/05/2026 |

---

## Cronograma Imediato

| Data                       | Atividade                                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **12/05**                  | Alinhamento assíncrono no Miro para estabelecer o mesmo nível de abstração das características (Slicing/INVEST). |
| **A definir**              | Alinhamento interno rápido para consolidar a estimativa de esforço.                                              |
| **A definir**              | Reunião de Compromisso de Iteração (_Commitment_) com o cliente para validação das features geradas.             |
| **Terça (Próxima semana)** | Data limite para a entrega final de Engenharia de Requisitos (Unidade 2).                                        |

!!! info "Nível de Abstração"
Conforme diretrizes do professor orientador, todas as features do backlog devem ser refinadas para manter rigorosamente o mesmo nível de abstração (específico/funcional) antes de serem transformadas em Issues e branches no repositório.

## Gravação da Reunião

## <iframe width="560" height="315" src="https://www.youtube.com/embed/P-xbrmhVW1w" title="Gravação da Reunião" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

_Ata redigida por Heitor Macedo Ricardo para registro e consulta dos membros da equipe._
