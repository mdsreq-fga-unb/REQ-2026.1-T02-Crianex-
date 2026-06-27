# Reunião — 17/05/2026

**Data:** 17 de Maio de 2026
**Local:** Google meets / Compartilhamento de Tela (Miro e Figma)
**Assunto:** Technical Design Review, Matriz de Priorização Matemática e Homologação de Protótipo

---

## Participantes

| Nome          | Papel                                                           | Status   |
| ------------- | --------------------------------------------------------------- | -------- |
| Lucas Zanetti | Project Manager · Chief Architect · Development Manager(Backup) | Presente |
| Heitor        | Development Manager · Class Owner                               | Presente |
| Hugo          | Class Owner                                                     | Presente |
| Philipe       | Chief Programmer · Class Owner                                  | Presente |
| Leonardo      | Chief Programmer · Class Owner                                  | Presente |
| Camile        | Class Owner · Documentation Lead · Requirements Custodian       | Presente |

---

## Pauta

1. Priorização Matemática Objetiva e Critérios do MVP
2. Ajustes Estruturais e Impacto no Cronograma
3. Alinhamento do GitHub e Governança (DOR / DOD)
4. Technical Design Review (Diagramas e Feature Cards)
5. Homologação do Protótipo de Alta Fidelidade (Figma)

---

## Discussões e Decisões

### 1. Priorização Matemática Objetiva e Critérios do MVP

O PM Lucas Zanetti apresentou a estruturação matemática utilizada para gerar a Matriz de Valor x Esforço de forma 100% objetiva, atendendo aos feedbacks do professor orientador. O cálculo foi dividido em pesos específicos:

- **Cálculo de Valor:** Valor = (Impacto de Negócio x 3) + (Frequência de Uso x 3) + (Valor para o Usuário x 2) + (Impacto Estratégico x 2)
- **Cálculo de Esforço:** Esforço = (Complexidade Técnica x 3) + (Dependências x 2) + (Risco x 2) + (Tempo x 1)
- **Índice de Prioridade (IP):** Determinado pela razão Valor/Esforço. Toda feature ou requisito com **IP > 1,5** foi automaticamente classificado como integrante do **MVP (Quadrante 1)**. As tabelas calculadas foram enviadas para validação final assíncrona do cliente Otávio.

### 2. Ajustes Estruturais e Impacto no Cronograma

- **Redução definitiva de CPs:** Três CPs redundantes foram formalmente eliminadas ou fundidas na árvore de rastreabilidade (ex: unificação da parte institucional na CP4).
- **Antecipação do Painel Admin:** O Painel de Gerenciamento do Administrador foi trazido para a iteração atual (atrelado à OE2), visto que as operações de CRUD e reordenação por _drag-and-drop_ da CP4 dependem diretamente dessa estrutura de login e rotas seguras.
- **Nova Timeline:** A entrega final de software/código funcional da Interação 1 foi estendida para o dia **25/05/2026** (uma segunda-feira). A iteração subsequente será focada em _Lead Capture_ devido ao seu maior peso de prioridade frente ao Núcleo Operacional.

### 3. Alinhamento do GitHub e Governança (DOR / DOD)

Foi aberta uma macro issue de governança com 7 sub-issues para organizar as pendências imediatas do repositório:

- **Philipe e Hugo:** Revisar e aprovar o PR com a árvore de requisitos no GitHub Pages.
- **Camile:** Finalizar a seção de "Estratégias" no documento de visão e Git Pages.
- **Lucas:** Ajustar as definições de DOR (_Definition of Ready_) e DOD (_Definition of Done_) no Pages para refletir as especificidades do rito do FDD.

### 4. Technical Design Review (Diagramas e Feature Cards)

O grupo validou o fluxo de dados dos Diagramas de Sequência Leves, mapeando cada macro feature como uma issue mãe e seus desdobramentos técnicos (requisitos, RNFs e critérios de design) como sub-issues.

#### 4.1 Módulo Plataforma Pública (CP4)

- **Feature 12 (Gerenciar Produto SAS):** Admin atua → Frontend valida básico → API intercepta → Supabase Auth/RLS valida privilégios do token JWT → DB processa a transação (`INSERT`/`UPDATE`/`DELETE`) sem quebrar integridade com histórico de tickets. O fluxo foi simplificado para mover o grosso das validações lógicas e de privilégios para a camada do Supabase. Esforço estimado: **3**.
- **Feature 13 (Controlar Publicação):** Fluxo simplificado para gerenciar a flag ativo/inativo de exibição pública. Em caso de requisição direta maliciosa via console do navegador sem token válido, o backend interceptará via RLS e retornará erro 403 (_Forbidden_). No frontend, os elementos visuais de controle serão ocultados nativamente para usuários sem a role administrativa. Esforço estimado: **2**.
- **Feature 14 (Exibir Contato / Capturar Lead):** Fluxo público de envio. Foi decidido a **eliminação do ReCAPTCHA** para mitigar estresse na experiência do usuário, substituindo-o estritamente por regras robustas de **Rate Limit** na API contra ataques de spam. O backend garante transações ACID para evitar salvamento de leads parciais ou corrompidos. Esforço estimado: **2**.
- **Feature 16 (Disponibilizar Informações Institucionais):** Simplificação total do fluxo. Removida a necessidade de cache complexo no backend para dados institucionais, assumindo que textos e imagens de apresentação serão renderizados de forma direta e estática pela interface. Esforço estimado: **1**.

#### 4.2 Módulo Autenticação e Gestão Interna (CP6/CP7 antiga)

- **Feature 26 (Autenticar Acesso Seguro):** Mapeamento do login via Supabase Auth com geração de sessão JWT e redirecionamento para `/admin`. Tentativas inválidas disparam mensagens genéricas para segurança. O Logout executa o _signout_ no banco, limpa o _local storage_ e protege a rota via _refresh token_ no _server-side_, bloqueando acessos diretos por URL. Removida a ideia de login social com Google por complexidade desnecessária neste MVP. Esforço estimado: **4**.
- **Feature 27 (Permitir Acesso ao Painel Admin):** Validação em tempo real do JWT e da _role_ do administrador, garantindo o isolamento completo de dados por perfil. Esforço estimado: **3**.
- **Feature 28 (Gerenciar Membros):** Interface para CRUD completo da equipe técnica Crianex com tratamento nativo de falhas de autorização. Esforço estimado: **4**.

#### 4.3 Módulo FAQ e Base de Conhecimento (CP8)

- **Leonardo** apresentou os feature cards do FAQ, padronizando as operações de CRUD e categorização em macro-estruturas (`Gerenciar Artigos de FAQ` e `Controlar Publicação de FAQ`) com integridade referencial ligada aos IDs dos produtos. Esforço estimado: **2**.
- **Feature 17 (Coletar Avaliação de Utilidade):** Fluxo de feedback anônimo ("Útil / Não Útil") integrado no final dos artigos. O clique envia a requisição de forma assíncrona dentro do limite de 2 segundos, desabilita os botões e oculta o componente sem a necessidade de alertas intrusivos ou _reloads_ na tela. Esforço estimado: **1**.

### 5. Homologação do Protótipo de Alta Fidelidade (Figma)

O PM Lucas demonstrou o protótipo de alta fidelidade em ambiente navegável. A interface pública conta com a Home corporativa, carrossel de produtos com métricas integradas, seção "Sobre Nós", suporte a Dark Mode e internacionalização funcional (PT/EN via i18n). A área administrativa compreende a tela de login isolada, dashboard com histórico de notificações, visão em Kanban das colunas do CRM de Leads, painel de inventário de produtos SAS, gerenciador de FAQ e histórico de logs de auditoria. A equipe aprovou o layout por unanimidade, pontuando apenas a necessidade futura de uma seção dedicada para relatórios financeiros.

---

## Encaminhamentos

| #   | Tarefa                                                              | Responsável     | Prazo      |
| --- | ------------------------------------------------------------------- | --------------- | ---------- |
| 1   | Gravação e edição do vídeo de apresentação da Unidade 2             | Toda a Equipe   | 18/05/2026 |
| 2   | Ajustar no Miro as correções levantadas nos fluxos (F13, F14 e F16) | Philipe / Lucas | 18/05/2026 |
| 3   | Revisar e aprovar o PR com a tabela de requisitos no Git Pages      | Philipe / Hugo  | 18/05/2026 |

---

## Metas para a Entrega de Terça-Feira (19/05) — Foco em Processo

Para a apresentação oficial com o professor no dia 19/05, a equipe se compromete a entregar todos os artefatos de planejamento prontos e validados:

- **Miro:** Árvore de Rastreabilidade, Matrizes de Valor x Esforço calculadas e Diagramas de Sequência revisados.
- **GitHub:** Issues totalmente cadastradas e descritas com critérios de aceitação em formato BDD.
- **Protótipo HTML:** Evidências do protótipo e validação do Cliente.

---

## Gravação da Reunião

<iframe width="560" height="315" src="https://www.youtube.com/embed/N9WbRTMmQks?si=xEf4q-teQCbsJvT6" title="Gravação da Reunião" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

---

_Ata redigida por Heitor Macedo Ricardo para registro e consulta dos membros da equipe._
