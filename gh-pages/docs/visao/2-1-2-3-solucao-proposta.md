# 2. Solução Proposta

---

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 01/04/2026 | Criação das seções 2.1, 2.2 e 2.3 | Lucas A. Zanetti |
| 1.1 | 03/04/2026 | Revisão geral e ajuste de objetivos | Equipe Crianex |
| 1.2 | 09/04/2026 | Revisão pós reunião de alinhamento | Equipe Crianex |

---

## 2.1 Perspectiva do Produto

O **Crianex** é uma plataforma SaaS web composta por dois módulos principais e complementares:

| Módulo | Acesso | Descrição |
|--------|--------|-----------|
| **Área Administrativa** | Autenticado (login) | Gestão interna de projetos, status, logs e alocação de pessoas em tempo real |
| **Vitrine Digital** | Público | Exposição do portfólio de projetos e cases para aumento de engajamento e captação B2B |

A plataforma é acessível via navegador web moderno, sem necessidade de instalação, e utiliza uma arquitetura SaaS com banco de dados centralizado e interface responsiva.

---

## 2.2 Declaração de Posição do Produto

| Campo | Descrição |
|-------|-----------|
| **Para** | A Crianex Software House e seus gestores, colaboradores e potenciais clientes B2B |
| **Que** | Necessita de visibilidade centralizada dos projetos e de uma vitrine digital profissional |
| **O Crianex** | É uma plataforma SaaS de gestão e portfólio de projetos |
| **Que** | Unifica a gestão interna (área administrativa) e a apresentação pública (vitrine digital) numa única solução |
| **Diferente de** | Ferramentas genéricas de gestão (Jira, Trello) ou sites institucionais estáticos |
| **Nosso produto** | Integra em tempo real a operação interna com a comunicação de portfólio ao mercado |

---

## 2.3 Objetivos Estratégicos e Características do Produto

### Objetivos Estratégicos (OE)

| ID | Objetivo Estratégico |
|----|----------------------|
| OE1 | Centralizar a gestão de projetos da Crianex numa única plataforma |
| OE2 | Aumentar a visibilidade do portfólio de projetos no mercado B2B |
| OE3 | Reduzir o tempo gasto com relatórios manuais e consolidação de informações |
| OE4 | Facilitar a alocação e o acompanhamento de pessoas em projetos em tempo real |
| OE5 | Fortalecer a presença digital da Crianex como Software House de referência |

---

### Características do Produto (CP)

| ID | Característica | Módulo | OE Relacionado |
|----|----------------|--------|----------------|
| CP01 | Autenticação e controle de acesso por perfil (admin, gestor, colaborador) | Área Administrativa | OE1 |
| CP02 | Dashboard com visão geral de todos os projetos ativos | Área Administrativa | OE1, OE3 |
| CP03 | Cadastro e gerenciamento de projetos (nome, status, datas, responsáveis) | Área Administrativa | OE1 |
| CP04 | Gestão de status de projetos com histórico de atualizações (logs) | Área Administrativa | OE1, OE3 |
| CP05 | Alocação de pessoas em projetos com visualização em tempo real | Área Administrativa | OE4 |
| CP06 | Gestão de sprints e tarefas por projeto (board Kanban) | Área Administrativa | OE1, OE4 |
| CP07 | Notificações internas para atualizações críticas de projetos | Área Administrativa | OE3, OE4 |
| CP08 | Relatórios e métricas de projetos exportáveis | Área Administrativa | OE3 |
| CP09 | Galeria pública de projetos e cases (vitrine) | Vitrine Digital | OE2, OE5 |
| CP10 | Página de detalhe de cada projeto com descrição, tecnologias e resultados | Vitrine Digital | OE2, OE5 |
| CP11 | Seção "Sobre a Empresa" e apresentação da equipe | Vitrine Digital | OE5 |
| CP12 | Formulário de contato e captação de leads B2B | Vitrine Digital | OE2, OE5 |
| CP13 | Integração entre área administrativa e vitrine (publicação seletiva de projetos) | Ambos | OE1, OE2 |
| CP14 | Interface responsiva (desktop e mobile) | Ambos | OE2, OE5 |
| CP15 | Painel de configurações da empresa (logo, cores, textos da vitrine) | Área Administrativa | OE5 |
