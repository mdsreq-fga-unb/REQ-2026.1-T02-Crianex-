# Rastreabilidade de Requisitos — Crianex

## Histórico de Revisão

| Versão | Data       | Descrição                                                                                                                         | Autor(es)        | Revisores(es)         |
| ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------------- |
| 1.0    | 14/05/2026 | Templete do backlog                                                                                                               | Lucas A. Zanetti | Heitor Macedo Ricardo |
| 1.1    | 17/05/2026 | Coloquei todos OEs, CPs, Features, RFs, RNFs com rastreabilidade                                                                  | Lucas A. Zanetti | Heitor Macedo Ricardo |
| 1.2    | 06/06/2026 | Adição da coluna INVEST na tabela de Features                                                                                     | Lucas A. Zanetti | Hugo Freitas Silva                  |
| 1.3    | 09/06/2026 | Marcação de status de conclusão (✅/⚠️/❌) em Features, RFs e RNFs da IT1 (CP4/CP5/CP6)                                           | Lucas A. Zanetti | Hugo Freitas Silva                |
| 1.4    | 09/06/2026 | Adição de RF49, RF54, RF55; seção de Regras de Negócio (RN01–RN12) com rastreabilidade                                            | Lucas A. Zanetti | Hugo Freitas Silva                   |
| 1.5    | 10/06/2026 | RF08 marcado ✅; RF49 (Aceitar LGPD) inserido; RF49→RF50, RF50→RF51 renumerados; RF52–RF53 adicionados; refs cruzadas atualizadas | Lucas A. Zanetti | Hugo Freitas Silva                    |
| 1.6    | 14/06/2026 | Alterações referentes aos ajustes sugeridos pelo professor, acerca de relações 1:1 (um para um) | Hugo Freitas Silva |Lucas A. Zanetti                  |

---

## Árvore de Rastreabilidade — Versão Visual (Miro)

<iframe
  src="https://miro.com/app/live-embed/uXjVGl991V0=/?moveToWidget=3458764671557949874&cot=14"
  width="100%"
  height="620"
  frameborder="0"
  scrolling="no"
  allow="fullscreen; clipboard-read; clipboard-write"
  allowfullscreen>
</iframe>

---

## Objetivos Estratégicos (OEs)

| ID  | Nome                                                            | CPs Vinculadas |
| --- | --------------------------------------------------------------- | -------------- |
| OE1 | Centralizar a gestão operacional do negócio                     | CP2, CP3, CP7  |
| OE2 | Aumentar a visibilidade do portfólio de projetos no mercado B2B | CP4, CP5, CP6  |
| OE3 | Centralizar a gestão de Leads e clientes                        | CP1, CP8, CP9  |

---

## Características do Produto (CPs)

| ID  | Nome                                             | OE  | Features Vinculadas |
| --- | ------------------------------------------------ | --- | ------------------- |
| CP1 | CRM Interno de Clientes                          | OE3 | F19, F20, F21  |
| CP2 | Histórico de Logs e Monitoramento                | OE1 | F01, F02            |
| CP3 | Dashboard Executivo de Métricas                  | OE1 | F03, F04     |
| CP4 | Plataforma Pública de Apresentação da Empresa    | OE2 | F12, F13, F14, F15  |
| CP5 | Painel de Gerenciamento do Administrador         | OE2 | F09, F10, F11       |
| CP6 | FAQ e Base de Conhecimentos por Produto          | OE2 | F16, F17, F18       |
| CP7 | Controle de Faturamento e Relatórios Financeiros | OE1 | F05, F06      |
| CP8 | Sistema de Tickets de Suporte                    | OE3 | F22, F23           |
| CP9 | Sistema de notificações no sistema               | OE3 | F07, F08    |

---

## Features

| ID  | Status IT1 | Nome                                                                                                                    | CP  | RFs Vinculados         | RNFs Vinculados                   | INVEST      |
| --- | ---------- | ----------------------------------------------------------------------------------------------------------------------- | --- | ---------------------- | --------------------------------- | ----------- |
| F01 | —          | Monitorar eventos de segurança para rastreamento de acessos ao sistema                                                            | CP2 | RF01, RF02             | RNF09, RNF01, RNF02, RNF03        | I-N-V-E-S-T |
| F02 | —          | Monitorar estado dos componentes para garantia de disponibilidade do sistema                                                       | CP2 | RF03, RF54         | RNF01, RNF03, RNF09                        | N-V-E-S-T   |
| F03 | —          | Visualizar indicadores operacionais para acompanhamento estratégico                                                     | CP3 | RF04, RF05, RF06             | RNF01, RNF03, RNF09, RNF11               | I-N-V-E-S-T |
| F04 | —          | Visualizar indicadores financeiros para análise gerencial                                                               | CP3 | RF07, RF55                  | RNF01, RNF03, RNF09, RNF11                          | I-N-V-E-S-T |
| F05 | —          | Consultar registros financeiros para acompanhamento de faturamento                                                                     | CP7 | RF16, RF17, RF18               | RNF01, RNF03, RNF09, RNF11                           | N-V-E-S-T   |
| F06 | —          | Gerar relatórios financeiros para exportação de dados                                                    | CP7 | RF19, RF20             | RNF01, RNF03, RNF09, RNF11      | I-N-V-E-S-T |
| F07 | —          | Acompanhar histórico e status de notificações                                                                        | CP9 | RF46, RF47                  | RNF03, RNF09             | N-V-E-S-T   |
| F08 | —          | Gerenciar templates de notificações                                                  | CP9 | RF15, RF56, RF57            | RNF03, RNF09                            | N-V-E-S-T   |
| F09 | ✅         | Autenticar para acesso seguro ao sistema                                                                                | CP5 | RF08, RF09             | RNF01, RNF03, RNF08               | I-N-V-E-S-T |
| F10 | ✅         | Permitir acesso ao painel administrativo para gerenciamento da plataforma                                               | CP5 | RF10, RF48            | RNF09                             | N-V-E-S-T   |
| F11 | ✅         | Gerenciar usuarios da plataforma para controle operacional                                                              | CP5 | RF11, RF12, RF13, RF14 | RNF09                                 | N-V-E-S-T   |
| F12 | ✅         | Gerenciar produtos SaaS da vitrine para manutenção do portifólio                                                        | CP4 | RF21, RF22, RF23, RF24 | RNF19, RNF04, RNF05, RNF13, RNF15, RNF03 | N-V-E-T     |
| F13 | ✅         | Controlar publicação de produto SaaS para exibição pública                                                              | CP4 | RF25, RF26             | RNF03                             | N-V-E-S-T   |
| F14 | ✅         | Exibir canais de contato na Vitrine                                                                                     | CP4 | RF27, RF49 | RNF10, RNF06, RNF02, RNF11        | N-V-E-S-T   |
| F15 | ✅         | Disponibilizar informações institucionais para apresentação da empresa                                                  | CP4 | RF50, RF51             | RNF02, RNF 21                            | I-N-V-E-S-T |
| F16 | ✅         | Gerenciar artigos de FAQs para manuntenção da base de conhecimento                                                      | CP6 | RF28, RF29, RF30, RF31 | RNF05, RNF04, RNF01               | N-V-E-S-T   |
| F17 | ✅         | Controlar publicação de artigos FAQ's para disponibilização pública                                                     | CP6 | RF32, RF33             | RNF01                               | N-V-E-S-T   |
| F18 | ✅         | Melhorar a correspondência entre artigos do FAQ e dúvidas dos leads | CP6 | RF34, RF52             | RNF02                             | N-V-E-S-T   |
| F19 | —          | Gerenciar clientes e leads para organização do relacionamento comercial                                                 | CP1 | RF35, RF36, RF37, RF41       | RNF09, RNF03, RNF01, RNF11, RNF21 | I-N-V-E-S-T |
| F20 | —          | Gerenciar colunas do funil para personalização do processo comercial                                                    | CP1 | RF38, RF39, RF40       | RNF01, RNF03, RNF09, RNF11, RNF22                             | N-V-E-S-T   |
| F21 | —          | Registrar interações comerciais para rastreamento do relacionamento                                                     | CP1 | RF42, RF53, RF59                   | —                                 | N-V-E-S-T   |
| F22 | —          | Acessar tickets para acompanhamento dos atendimentos                                                                    | CP8 | RF43, RF58                  | RNF09, RNF03, RNF01, RNF22        | I-N-V-E-S-T |
| F23 | —          | Gerenciar tickets para manutenção da operação de suporte                                                                | CP8 | RF44, RF45             | —                                 | N-V-E-S-T   |


---

## Requisitos Funcionais (RFs)

| ID   | Status IT1 | Nome                                                | Feature | CP  | OE  | Observação                                                                     |
| ---- | ---------- | --------------------------------------------------- | ------- | --- | --- | ------------------------------------------------------------------------------ |
| RF01 | —          | Consultar histórico de eventos de segurança                        | F01     | CP2 | OE1 | IT3                                                                            |
| RF02 | —          | Filtrar eventos de segurança                            | F01     | CP2 | OE1 | IT3                                                                            |
| RF03 | —          | Consultar status de disponibilidade dos componentes do sistema                       | F02     | CP2 | OE1 | IT3                                                                            |
| RF04 | —          | Exibir indicadores operacionais de tickets          | F03     | CP3 | OE1 | IT3                                                                            |
| RF05 | —          | Exibir indicadores operacionais sistema             | F03     | CP3 | OE1 | IT3                                                                            |
| RF06 | —          | Filtrar indicadores operacionais                     | F03     | CP3 | OE1 | IT3                                                                            |
| RF07 | —          | Exibir indicadores financeiros                        | F04     | CP3 | OE1 | IT3                                                                            |
| RF08 | ✅         | Autenticar perfil de usuario                        | F09     | CP5 | OE2 | Login implementado; MFA (TOTP) sem rotas ativas — optou-se por não implementar |
| RF09 | ✅         | Encerrar sessão                                     | F09     | CP5 | OE2 | Botão de logout no ProfileModal                                                |
| RF10 | ✅         | Acessar painel administrativo                       | F10     | CP5 | OE2 | Rotas protegidas por hooks.server.ts + Supabase session                        |
| RF11 | ✅         | Editar informações dos membros                      | F11     | CP5 | OE2 | MemberModal com edição de perfil e permissões                                  |
| RF12 | ✅         | Cadastrar novo membro                               | F11     | CP5 | OE2 | Geração de senha segura + scaffold de e-mail de boas-vindas                    |
| RF13 | ✅         | Inativar membro cadastrado                          | F11     | CP5 | OE2 | toggleStatus no menu de ações da tabela de membros                             |
| RF14 | ✅         | Remover membro cadastrado                           | F11     | CP5 | OE2 | Modal de confirmação de remoção + API DELETE                                   |
| RF15 | —          | Adicionar template de notificações                | F08    | CP9 | OE3 | IT2                                                                            |
| RF16 | —          | Consultar histórico financeiro                      | F05     | CP7 | OE1 | IT3                                                                            |
| RF17 | —          | Consultar detalhes de registro financeiro           | F05     | CP7 | OE1 | IT3                                                                            |
| RF18 | —          | Filtrar registros financeiros                       | F05     | CP7 | OE1 | IT3                                                                            |
| RF19 | —          | Exportar relatório financeiro                       | F06     | CP7 | OE1 | IT3                                                                            |
| RF20 | —          | Gerar relatório financeiro                          | F06     | CP7 | OE1 | IT3                                                                            |
| RF21 | ✅         | Cadastrar produto SaaS                              | F12     | CP4 | OE2 | ProductModal + POST /admin/products                                            |
| RF22 | ✅         | Editar produto SaaS                                 | F12     | CP4 | OE2 | ProductModal + PATCH /admin/products/:id                                       |
| RF23 | ✅         | Remover produto SaaS                                | F12     | CP4 | OE2 | DeleteModal + DELETE /admin/products/:id                                       |
| RF24 | ✅         | Reordenar produtos SaaS                             | F12     | CP4 | OE2 | Drag-and-drop + PATCH /admin/products/reorder                                  |
| RF25 | ✅         | Publicar produto SaaS                               | F13     | CP4 | OE2 | Toggle publicação via PATCH published=true                                     |
| RF26 | ✅         | Despublicar produto SaaS                            | F13     | CP4 | OE2 | Toggle publicação via PATCH published=false                                    |
| RF27 | ✅         | Cadastrar contato com a empresa                     | F14     | CP4 | OE2 | Formulário de contato na vitrine pública                                       |
| RF28 | ✅         | Cadastrar artigo de FAQ                             | F16     | CP6 | OE2 | Modal de criação + POST /admin/faq/articles                                    |
| RF29 | ✅         | Editar artigo de FAQ                                | F16     | CP6 | OE2 | Modal de edição + PATCH /admin/faq/articles/:id                                |
| RF30 | ✅         | Remover artigo de FAQ                               | F16     | CP6 | OE2 | Modal de confirmação + DELETE /admin/faq/articles/:id                          |
| RF31 | ✅         | Categorizar artigo de FAQ                           | F16     | CP6 | OE2 | Gestão de categorias via modal dedicado                                        |
| RF32 | ✅         | Publicar artigo de FAQ                              | F17     | CP6 | OE2 | togglePublish via PATCH published=true                                         |
| RF33 | ✅         | Despublicar artigo de FAQ                           | F17     | CP6 | OE2 | togglePublish via PATCH published=false                                        |
| RF34 | ✅         | Avaliar artigo de FAQ                               | F18     | CP6 | OE2 | Botões útil/não útil na vitrine pública; contadores no admin                   |
| RF35 | —          | Editar dados do cliente/lead                        | F19     | CP1 | OE3 | IT2                                                                            |
| RF36 | —          | Inativar cliente/lead                               | F19     | CP1 | OE3 | IT2                                                                            |
| RF37 | —          | Cadastrar lead no CRM                               | F19     | CP1 | OE3 | IT2                                                                            |
| RF38 | —          | Adicionar colunas no CRM                            | F20     | CP1 | OE3 | IT2                                                                            |
| RF39 | —          | Remover colunas no CRM                              | F20     | CP1 | OE3 | IT2                                                                            |
| RF40 | —          | Editar colunas no CRM                               | F20     | CP1 | OE3 | IT2                                                                            |
| RF41 | —          | Atualizar informações operacionais dos cards no CRM | F21     | CP1 | OE3 | IT2                                                                            |
| RF42 | —          | Adicionar interação comercial                    | F21     | CP1 | OE3 | IT2                                                                            |
| RF43 | —          | Consultar histórico de tickets                      | F23     | CP8 | OE3 | IT2                                                                            |
| RF44 | —          | Alterar status do ticket                            | F24     | CP8 | OE3 | IT2                                                                            |
| RF45 | —          | Ocultar tickets                                     | F24     | CP8 | OE3 | IT2                                                                            |
| RF46 | —          | Listar histórico de notificações                    | F25     | CP9 | OE3 | IT2                                                                            |
| RF47 | —          | Alterar status da notificação                       | F26     | CP9 | OE3 | IT2                                                                            |
| RF48 | ✅         | Editar próprio perfil no painel                     | F10     | CP5 | OE2 | ProfileModal + PATCH /profile/me e /profile/me/password                        |
| RF49 | ✅         | Detalhar os tópicos de conformidade com a LGPD        | F14     | CP4 | OE2 | Páginas /privacidade (política de privacidade) e /cookies (uso de cookies)                                                                      |
| RF50 | ✅         | Consultar detalhes de produto SaaS na vitrine       | F15     | CP4 | OE2 | Página /produtos/[slug] com detalhes completos do produto                      |
| RF51 | ✅         | Permitir a utilização de cookies no sistema      | F15     | CP4 | OE2 | Páginas /privacidade (política de privacidade) e /cookies (uso de cookies)     |
| RF52 | ✅         | Filtrar artigos faq         | F18     | CP6 | OE2 | —                                                                              |
| RF53 | —      | Remover interação comercial                                 | F21    | CP1 | OE3 | IT2                                                                          |
| RF54 | —          | Configurar limiar de alerta para evento operacional crítico                             | F02     | CP2 | OE1 | IT3                                                                                    |
| RF55 | —          | Filtrar indicadores financeiros                             | F04     | CP3 | OE1 | IT3                                                                                   |
| RF56 | —          | Editar template de notifações                        | F08     | CP9 | OE3 | IT2                                                                             |
| RF57 | —          | Remover template de notifações                            | F08     | CP9 | OE3 | IT2                                                                               |
| RF58 | —          | Detalhar informações do ticket                            | F22     | CP8 | OE3 | IT2                                                                             |
| RF59 | —          | Editar interação comercial                           | F21     | CP1 | OE3 | IT2                                                                             |

---

## Requisitos Não Funcionais (RNFs)

### RNFs Globais

> Aplicam-se ao sistema inteiro.

| ID    | Nome                          | Classificação Sommerville         | Tags do Projeto                                  | Features Vinculadas | Descrição                                                                                                                                    |
| ----- | ----------------------------- | --------------------------------- | ------------------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF07 | Conformidade com OWASP Top 10 | Produto > Segurança da Informação | 1.Produto / 2.Segurança / 3.Integridade          | Global              | A aplicação deve mitigar todas as vulnerabilidades listadas no OWASP Top 10 vigente.                                                         |
| RNF12 | Responsividade                | Produto > Usabilidade             | 1.Produto / 2.Usabilidade / 3.Consistência       | Global              | A interface deve manter usabilidade e integridade visual nos breakpoints mobile, tablet e desktop definidos pelo design system da aplicação. |
| RNF14 | Escalabilidade horizontal     | Produto > Eficiência              | 1.Produto / 2.Eficiência / 3.Escalabilidade      | Global              | A arquitetura deve permitir aumento horizontal de instâncias do backend e do frontend sem necessidade de reescrita de código.                |
| RNF16 | Stack tecnológico obrigatório | Organizacional > Implementação    | 1.Organizacional / 2.Projeto / 3.Implementação   | Global              | O frontend deve ser implementado em SvelteKit com TypeScript; o backend em Express.js com TypeScript; o banco em PostgreSQL via Supabase.    |
| RNF17 | Cobertura mínima de testes    | Produto > Dependabilidade         | 1.Produto / 2.Manutenibilidade / 3.Testabilidade | Global              | O código de produção deve manter cobertura mínima de 45% por testes automatizados.                                                           |
| RNF18 | Portabilidade de navegador    | Produto > Usabilidade             | 1.Produto / 2.Portabilidade / 3.Compatibilidade  | Global              | A interface deve operar corretamente nas duas versões mais recentes dos navegadores Chrome, Firefox, Safari e Edge.                          |

### RNFs Específicos

> Vinculados a Features ou CPs.

| ID    | Nome                                                | Classificação Sommerville         | Tags do Projeto                                            | Features Vinculadas                    | Descrição                                                                                                                                                                                                                                                       |
| ----- | --------------------------------------------------- | --------------------------------- | ---------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF01 | Isolamento de acesso administrativo                 | Produto > Segurança da Informação | 1.Produto / 2.Segurança / 3.Controle de acesso             | F01, F03, F06, F09, F16, F19, F23      | A área administrativa deve ser servida em endpoint distinto e não referenciado publicamente, acessível apenas mediante autenticação.                                                                                                                            |
| RNF02 | Tempo de resposta da vitrine                        | Produto > Eficiência              | 1.Produto / 2.Eficiência / 3.Desempenho                    | F01, F14, F18                          | O carregamento inicial das páginas públicas deve ocorrer em até 2 segundos em 95% das requisições sob conexão 4G.                                                                                                                                               |
| RNF03 | Tempo de resposta da área administrativa            | Produto > Eficiência              | 1.Produto / 2.Eficiência / 2.Arquitetura                   | F01, F03, F06, F09, F13, F19, F23, F25 | Operações de leitura no painel administrativo devem retornar em até 2 segundo em 95% das requisições.                                                                                                                                                           |
| RNF04 | Renderização server-side da vitrine pública         | Produto > Eficiência              | 1.Produto / 2.Eficiência / 3.Desempenho                    | F12, F15, F16                          | As páginas públicas devem ser renderizadas via SSR para permitir indexação completa por motores de busca.                                                                                                                                                       |
| RNF05 | Otimização para mecanismos de busca (SEO)           | Produto > Usabilidade             | 1.Produto / 2.Usabilidade / 3.Encontrabilidade             | F12, F16                               | A vitrine pública deve implementar boas práticas de SEO, incluindo metadados semânticos, sitemap.xml, robots.txt, URLs amigáveis e tags Open Graph.                                                                                                             |
| RNF06 | Integridade transacional                            | Produto > Dependabilidade         | 1.Produto / 2.Confiabilidade / 3.Integridade e Recuperação | F14                                    | Operações de captação de Lead devem ser executadas em transações ACID, sem perda parcial de dados em caso de falha.                                                                                                                                             |
| RNF08 | Criptografia de credenciais                         | Produto > Segurança da Informação | 1.Produto / 2.Segurança / 3.Confidencialidade              | F09                                    | Senhas de usuários devem ser armazenadas exclusivamente na forma de hash criptográfico utilizando Argon2id ou bcrypt com salt individual e fator de custo mínimo 12.                                                                                            |
| RNF09 | Controle de acesso por linha (RLS)                  | Produto > Segurança da Informação | 1.Produto / 2.Segurança / 3.Controle de acesso             | F01, F03, F06, F10, F19, F23, F25      | O banco deve aplicar Row Level Security (RLS) para restringir leitura aos registros autorizados ao perfil do administrador.                                                                                                                                     |
| RNF10 | Proteção contra abuso do formulário público         | Produto > Segurança da Informação | 1.Produto / 2.Segurança / 3.Integridade                    | F14                                    | O formulário público de captação de leads deve aplicar mecanismo de rating limit, limitando 5 submissões por IP a cada 10 minutos.                                                                                                                              |
| RNF11 | Conformidade parcial com LGPD                       | Externo > Legal                   | 1.Externo / 2.Legal / 3.Questões Legais                    | F04, F06, F19                          | A aplicação deve implementar mecanismos compatíveis com os princípios de consentimento, finalidade, minimização de dados e direito de exclusão previstos na Lei nº 13.709/2018 (LGPD).                                                                          |
| RNF13 | Bilinguismo da vitrine                              | Produto > Usabilidade             | 1.Produto / 2.Usabilidade / 3.Internacionalização          | F12                                    | A vitrine pública deve disponibilizar conteúdo integral em Português e Inglês, com troca de idioma em até 1 clique. Usando I18n para a tradução de forma rápida e eficiente.                                                                                    |
| RNF15 | Suporte a carga concorrente                         | Produto > Eficiência              | 1.Produto / 2.Usabilidade / 3.Capacidade                   | F12                                    | O sistema deve suportar 50 requisições simultâneas mantendo os tempos definidos em RNF02 e RNF03.                                                                                                                                                               |
| RNF19 | Facilidade de navegação da vitrine                  | Produto > Usabilidade             | 1.Produto / 2.Usabilidade / 3.Navegabilidade               | F12                                    | As principais seções da vitrine pública devem estar acessíveis em no máximo 3 interações a partir da página inicial.                                                                                                                                            |
| RNF20 | Disponibilidade das informações institucionais      | Produto > Dependabilidade         | 1.Produto / 2.Usabilidade / 3.Encontrabilidade             | F15                                    | As informações institucionais da empresa devem permanecer acessíveis publicamente sem necessidade de autenticação durante toda a operação do sistema.                                                                                                           |
| RNF21 | Reorganização intuitiva do CRM                      | Produto > Usabilidade             | 1.Produto / 2.Usabilidade / 3.Eficiência de Interação      | F19, F20                               | O reordenamento de colunas e cards no CRM deve ocorrer por interação drag-and-drop com atualização visual em no máximo 1,5 segundos.                                                                                                                            |
| RNF22 | Resumo expansível de tickets                        | Produto > Usabilidade             | 1.Produto / 2.Usabilidade / 3.Navegabilidade               | F23                                    | A listagem de tickets deve exibir as informações essenciais de cada chamado — status, prioridade, responsável e última atualização — diretamente no resumo do ticket, permitindo expansão da visualização para consulta detalhada sem recarregamento da página. |
| RNF23 | Visualização resumida e expansível dos cards do CRM | Produto > Usabilidade             | 1.Produto / 2.Usabilidade / 3.Eficiência de Interação      | F21                                    | Os cards do CRM devem exibir informações essenciais — responsável, estágio, produto vinculado e última interação — diretamente na visualização do quadro, permitindo expansão do card para consulta detalhada sem redirecionamento de página.                   |
| RNF24 | Atualização intuitiva dos cards do CRM              | Produto > Usabilidade             | 1.Produto / 2.Usabilidade / 3.Eficiência de Interação      | F21                                    | As alterações operacionais dos cards do CRM devem ocorrer com atualização visual imediata de até 1,5 segundos e interação direta no quadro Kanban, sem necessidade de recarregamento da página.                                                                 |

---

## Regras de Negócio (RNs)

> Políticas e restrições que governam o comportamento do sistema, independentes de tecnologia. Complementam os RFs definindo **o que é permitido**, **quando** e **sob quais condições**.

| ID   | Nome                                                      | Descrição                                                                                                                                                                                                                                       | Features      | RFs              | RNFs         |
| ---- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------- | ------------ |
| RN01 | Visibilidade de produtos na vitrine                       | Somente produtos com `published = true` são exibidos na vitrine pública. A alteração de status tem efeito imediato — não há fila de publicação ou aprovação adicional.                                                                          | F12, F13 | RF25, RF26, RF54 | RNF04        |
| RN02 | Visibilidade de artigos FAQ na vitrine                    | Artigos FAQ com `published = false` não aparecem na vitrine pública, independentemente da categoria. A despublicação é imediata e não exclui o artigo.                                                                                          | F16, F17      | RF32, RF33       | RNF04        |
| RN03 | Controle de acesso modular por permissão                  | Membros com papel `member` só podem operar módulos para os quais possuem ao menos a permissão `v` (visualizar). Editar requer `e`; excluir e aprovar requerem `a`.                                                                              | F10, F11      | RF10, RF11, RF50 | RNF01, RNF09 |
| RN04 | Owner com acesso irrestrito                               | Membros com papel `owner` têm acesso completo a todos os módulos e ações do painel, ignorando a matriz de permissões individuais.                                                                                                               | F10, F11      | RF10, RF50       | RNF01, RNF09 |
| RN05 | Membro inativo bloqueado no painel                        | Membros com `status = inactive` não conseguem autenticar nem acessar nenhuma rota protegida do painel administrativo, mesmo com sessão ativa.                                                                                                   | F09, F10      | RF08, RF09, RF10 | RNF01        |
| RN06 | Senha temporária no cadastro de membro                    | Ao cadastrar um novo membro, o sistema gera automaticamente uma senha segura. O membro deve alterá-la no primeiro acesso; a senha temporária não é retornada pela API.                                                                          | F11           | RF12, RF50       | RNF08        |
| RN07 | Avaliação anônima de artigo FAQ                           | Visitantes da vitrine podem avaliar artigos FAQ sem autenticação. Cada interação incrementa `helpful_count` ou `not_helpful_count` diretamente, sem persistência de sessão ou identificação do visitante.                                       | F18           | RF34             | RNF02        |
| RN08 | Consentimento de cookies obrigatório                      | Ao primeiro acesso à vitrine pública, o sistema deve exibir banner de consentimento de cookies. O visitante pode aceitar ou recusar; a preferência é persistida e respeitada em acessos subsequentes.                                           | F15           | RF49, RF51             | RNF11        |
| RN09 | Acessibilidade permanente das políticas de conformidade   | Links para política de privacidade e política de cookies devem estar presentes no rodapé de todas as páginas da vitrine, acessíveis sem autenticação e em qualquer idioma ativo.                                                                | F14, F15      | RF49, RF51           | RNF11, RNF20 |
| RN10 | Conformidade com o design system da Crianex               | Todos os componentes da vitrine pública e do painel administrativo devem utilizar exclusivamente a paleta oficial da Crianex (rosa #E71F84, verde #66DF7A, roxo #7F3FE5) e a tipografia definida no design system, sem variações não aprovadas. | F12, F14, F15 | —                | RNF12        |
| RN11 | Conteúdo institucional obrigatório na vitrine             | A página institucional deve exibir obrigatoriamente os três pilares da empresa — Missão, Visão e Valores — além de logotipo e apresentação da marca, como parte da proposta de valor ao mercado B2B.                                            | F15           | —                | RNF20        |
| RN12 | Ordem de exibição de produtos definida pelo administrador | Os produtos são renderizados na vitrine na sequência estabelecida pelo administrador via reordenação drag-and-drop, refletindo a curadoria do portfólio como estratégia de posicionamento B2B.                                                  | F12, F13, F15 | RF24, RF25, RF54 | RNF04        |
