# Rastreabilidade de Requisitos — Crianex

## Histórico de Revisão

| Versão | Data       | Descrição                                                        | Autor(es)        | Revisores(es)         |
| ------ | ---------- | ---------------------------------------------------------------- | ---------------- | --------------------- |
| 1.0    | 14/05/2026 | Templete do backlog                                              | Lucas A. Zanetti | Heitor Macedo Ricardo |
| 1.1    | 17/05/2026 | Coloquei todos OEs, CPs, Features, RFs, RNFs com rastreabilidade | Lucas A. Zanetti | Heitor Macedo Ricardo |

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
| CP1 | CRM Interno de Clientes                          | OE3 | F19, F20, F21, F22  |
| CP2 | Histórico de Logs e Monitoramento                | OE1 | F01, F02            |
| CP3 | Dashboard Executivo de Métricas                  | OE1 | F03, F04, F05       |
| CP4 | Plataforma Pública de Apresentação da Empresa    | OE2 | F12, F13, F14, F15  |
| CP5 | Painel de Gerenciamento do Administrador         | OE2 | F09, F10, F11       |
| CP6 | FAQ e Base de Conhecimentos por Produto          | OE2 | F16, F17, F18       |
| CP7 | Controle de Faturamento e Relatórios Financeiros | OE1 | F06, F07, F08       |
| CP8 | Sistema de Tickets de Suporte                    | OE3 | F23, F24            |
| CP9 | Sistema de notificações no sistema               | OE3 | F25, F26, F27       |

---

## Features

| ID  | Nome                                                                                                                    | CP  | RFs Vinculados         | RNFs Vinculados                   |
| --- | ----------------------------------------------------------------------------------------------------------------------- | --- | ---------------------- | --------------------------------- |
| F01 | Consultar logs operacionais para auditoria de atividades                                                                | CP2 | RF01, RF02             | RNF09, RNF01, RNF02, RNF03        |
| F02 | Auditar alterações administrativas para rastrear ações do sistema                                                       | CP2 | RF03                   | —                                 |
| F03 | Visualizar indicadores operacionais para acompanhamento estratégico                                                     | CP3 | RF04, RF05             | RNF09, RNF03, RNF01               |
| F04 | Visualizar indicadores financeiros para análise gerencial                                                               | CP3 | RF06                   | RNF11                             |
| F05 | Filtrar métricas executivas para análise segmentada                                                                     | CP3 | RF07                   | —                                 |
| F06 | Consultar registros financeiros para acompanhamento de faturamento                                                      | CP7 | RF16, RF17             | RNF09, RNF03, RNF01, RNF11        |
| F07 | Filtrar dados financeiros para análise contábil                                                                         | CP7 | RF18                   | —                                 |
| F08 | Gerar relatórios financeiros para exportação de dados                                                                   | CP7 | RF19, RF20             | —                                 |
| F09 | Autenticar para acesso seguro ao sistema                                                                                | CP5 | RF08, RF09             | RNF01, RNF03, RNF08               |
| F10 | Permitir acesso ao painel administrativo para gerenciamento da plataforma                                               | CP5 | RF10                   | RNF09                             |
| F11 | Gerenciar usuarios da plataforma para controle operacional                                                              | CP5 | RF11, RF12, RF13, RF14 | —                                 |
| F12 | Gerenciar produtos SaaS da vitrine para manutenção do portifólio                                                        | CP4 | RF21, RF22, RF23, RF24 | RNF19, RNF04, RNF05, RNF13, RNF15 |
| F13 | Controlar publicação de produto SaaS para exibição pública                                                              | CP4 | RF25, RF26             | RNF03                             |
| F14 | Exibir canais de contato na Vitrine                                                                                     | CP4 | RF27                   | RNF10, RNF06, RNF02               |
| F15 | Disponibilizar informações institucionais para apresentação da empresa                                                  | CP4 | —                      | RNF20                             |
| F16 | Gerenciar artigos de FAQs para manuntenção da base de conhecimento                                                      | CP6 | RF28, RF29, RF30, RF31 | RNF05, RNF04, RNF01               |
| F17 | Controlar publicação de artigos FAQ's para disponibilização pública                                                     | CP6 | RF32, RF33             | —                                 |
| F18 | Coletar avaliação de utilidade do artigo pelo visitante para melhorar a correspondência do FAQ com as dúvidas dos leads | CP6 | RF34                   | RNF02                             |
| F19 | Gerenciar clientes e leads para organização do relacionamento comercial                                                 | CP1 | RF35, RF36, RF37       | RNF09, RNF03, RNF01, RNF11, RNF21 |
| F20 | Gerenciar colunas do funil para personalização do processo comercial                                                    | CP1 | RF38, RF39, RF40       | RNF21                             |
| F21 | Gerenciar cards do CRM para acompanhamento de oportunidades                                                             | CP1 | RF41                   | RNF23, RNF24                      |
| F22 | Registrar interações comerciais para rastreamento do relacionamento                                                     | CP1 | RF42                   | —                                 |
| F23 | Acessar tickets para acompanhamento dos atendimentos                                                                    | CP8 | RF43                   | RNF09, RNF03, RNF01, RNF22        |
| F24 | Gerenciar tickets para manutenção da operação de suporte                                                                | CP8 | RF44, RF45             | —                                 |
| F25 | Exibir o histórico de notificações para acompanhamento operacional                                                      | CP9 | RF46                   | RNF03, RNF09                      |
| F26 | Controlar estado das notificações para acompanhamento de envio                                                          | CP9 | RF47                   | —                                 |
| F27 | Gerenciar notificações para o controle do sistema                                                                       | CP9 | RF15                   | —                                 |

---

## Requisitos Funcionais (RFs)

| ID   | Nome                                                | Feature | CP  | OE  |
| ---- | --------------------------------------------------- | ------- | --- | --- |
| RF01 | Consultar histórico de logs                         | F01     | CP2 | OE1 |
| RF02 | Filtrar logs do sistema                             | F01     | CP2 | OE1 |
| RF03 | Auditar alterações realizadas                       | F02     | CP2 | OE1 |
| RF04 | Exibir indicadores operacionais de tickets          | F03     | CP3 | OE1 |
| RF05 | Exibir indicadores operacionais sistema             | F03     | CP3 | OE1 |
| RF06 | Exibir indicadores financeiros                      | F04     | CP3 | OE1 |
| RF07 | Filtrar métricas executivas                         | F05     | CP3 | OE1 |
| RF08 | Autenticar perfil de usuario                        | F09     | CP5 | OE2 |
| RF09 | Encerrar sessão                                     | F09     | CP5 | OE2 |
| RF10 | Acessar painel administrativo                       | F10     | CP5 | OE2 |
| RF11 | Editar informações de usuários da crianex           | F11     | CP5 | OE2 |
| RF12 | Cadastrar novo membro                               | F11     | CP5 | OE2 |
| RF13 | Inativar membro cadastrado                          | F11     | CP5 | OE2 |
| RF14 | Remover membro cadastrado                           | F11     | CP5 | OE2 |
| RF15 | Configurar template de notificações                 | F27     | CP9 | OE3 |
| RF16 | Consultar histórico financeiro                      | F06     | CP7 | OE1 |
| RF17 | Consultar detalhes de registro financeiro           | F06     | CP7 | OE1 |
| RF18 | Filtrar registros financeiros                       | F07     | CP7 | OE1 |
| RF19 | Exportar relatório financeiro                       | F08     | CP7 | OE1 |
| RF20 | Gerar relatório financeiro                          | F08     | CP7 | OE1 |
| RF21 | Cadastrar produto SaaS                              | F12     | CP4 | OE2 |
| RF22 | Editar produto SaaS                                 | F12     | CP4 | OE2 |
| RF23 | Remover produto SaaS                                | F12     | CP4 | OE2 |
| RF24 | Reordenar produtos SaaS                             | F12     | CP4 | OE2 |
| RF25 | Publicar produto SaaS                               | F13     | CP4 | OE2 |
| RF26 | Despubliciar produto SaaS                           | F13     | CP4 | OE2 |
| RF27 | Cadastrar contato com a empresa                     | F14     | CP4 | OE2 |
| RF28 | Cadastrar artigo de FAQ                             | F16     | CP6 | OE2 |
| RF29 | Editar artigo de FAQ                                | F16     | CP6 | OE2 |
| RF30 | Remover artigo de FAQ                               | F16     | CP6 | OE2 |
| RF31 | Categorizar artigo de FAQ                           | F16     | CP6 | OE2 |
| RF32 | Publicar artigo de FAQ                              | F17     | CP6 | OE2 |
| RF33 | Despubliciar artigo de FAQ                          | F17     | CP6 | OE2 |
| RF34 | Avaliar artigo de FAQ                               | F18     | CP6 | OE2 |
| RF35 | Editar dados do cliente/lead                        | F19     | CP1 | OE3 |
| RF36 | Inativar cliente/lead                               | F19     | CP1 | OE3 |
| RF37 | Cadastrar lead no CRM                               | F19     | CP1 | OE3 |
| RF38 | Adicionar colunas no CRM                            | F20     | CP1 | OE3 |
| RF39 | Remover colunas no CRM                              | F20     | CP1 | OE3 |
| RF40 | Editar colunas no CRM                               | F20     | CP1 | OE3 |
| RF41 | Atualizar informações operacionais dos cards no CRM | F21     | CP1 | OE3 |
| RF42 | Registrar histórico de interação                    | F22     | CP1 | OE3 |
| RF43 | Consultar histórico de tickets                      | F23     | CP8 | OE3 |
| RF44 | Alterar status do ticket                            | F24     | CP8 | OE3 |
| RF45 | Ocultar tickets                                     | F24     | CP8 | OE3 |
| RF46 | Listar histórico de notificações                    | F25     | CP9 | OE3 |
| RF47 | Alterar status da notificação                       | F26     | CP9 | OE3 |

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
