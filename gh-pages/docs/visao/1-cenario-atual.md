# 1. Cenário Atual

---

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 01/04/2026 | Criação das seções 1.1 a 1.7 | Lucas A. Zanetti |
| 1.1 | 03/04/2026 | Revisão geral | Equipe Crianex |
| 1.2 | 09/04/2026 | Ajustes pós reunião de alinhamento | Equipe Crianex |

---

## 1.1 Identificação do Cliente

| Campo | Informação |
|-------|-----------|
| **Empresa** | Crianex Software House |
| **Segmento** | Desenvolvimento de software B2B sob demanda |
| **CTO** | Otávio Maya |
| **CSO** | Vitor Marconi |
| **Modelo de negócio** | Software House que desenvolve soluções digitais para clientes corporativos |
| **Perfil operacional** | Múltiplos projetos simultâneos com equipe distribuída |

---

## 1.2 Introdução ao Problema

A **Crianex** é uma Software House B2B especializada no desenvolvimento de soluções digitais sob demanda para empresas. Atuando com múltiplos projetos simultâneos e uma equipe distribuída, a organização enfrenta dificuldades crescentes para gerenciar internamente o status de cada projeto e, ao mesmo tempo, apresentar seu portfólio de maneira eficaz ao mercado externo.

A empresa não possui atualmente uma ferramenta centralizada que unifique a gestão operacional interna com a divulgação profissional dos seus produtos e entregas, o que gera retrabalho, falta de visibilidade e perda de oportunidades comerciais.

### 1.2.1 Contexto Organizacional

A Crianex opera com uma estrutura enxuta onde gestores técnicos acumulam responsabilidades de acompanhamento de projetos e relacionamento com clientes. A ausência de uma plataforma centralizada força o uso paralelo de planilhas, chats e ferramentas genéricas de gestão que não se comunicam entre si.

### 1.2.2 Problema de Visibilidade Interna

O acompanhamento do status de projetos é feito de forma descentralizada: cada gestor mantém seu próprio registro, sem uma visão consolidada para a liderança. Isso resulta em reuniões frequentes de alinhamento e dificuldade para identificar gargalos ou riscos em tempo real.

### 1.2.3 Problema de Visibilidade Externa

A Crianex não possui uma vitrine digital estruturada para apresentar seu portfólio ao mercado. O portfólio é comunicado ad hoc, via apresentações manuais ou conversas, sem um canal digital profissional que facilite a captação de novos clientes B2B.

### 1.2.4 Oportunidade Identificada

A unificação da gestão operacional interna com uma vitrine digital pública em uma única plataforma representa uma oportunidade de alto valor para a Crianex: reduz retrabalho interno e aumenta simultaneamente a capacidade de captação comercial.

---

## 1.3 Diagrama de Ishikawa

O diagrama abaixo sintetiza as causas raiz que levam ao problema central identificado: a baixa visibilidade e a gestão descentralizada.

![Diagrama de Ishikawa](images/ishikawa.png)
<figure class="crianex-figure">
  <figcaption>Figura 1 — Diagrama de Ishikawa: causas da gestão descentralizada e baixa visibilidade. Fonte: Elaborado pelos autores (2026).</figcaption>
</figure>

---

## 1.3.1 Rich Picture

O Rich Picture abaixo representa o contexto do sistema e os fluxos de informação entre os principais atores e componentes do produto.

![Rich Picture](images/rich-picture.png)
<figure class="crianex-figure">
  <figcaption>Figura 2 — Rich Picture: contexto do sistema e fluxos de informação. Fonte: Elaborado pelos autores (2026).</figcaption>
</figure>

---

## 1.4 Detalhamento do Problema

| Campo | Descrição |
|-------|-----------|
| **O problema de** | Gestão descentralizada de projetos e baixa visibilidade do portfólio no mercado |
| **Afeta** | A equipe interna da Crianex (colaboradores, gestores e liderança técnica) e potenciais clientes B2B |
| **Cujo impacto é** | Dificuldade no acompanhamento em tempo real do status dos projetos, retrabalho na consolidação de informações e oportunidades comerciais perdidas por falta de vitrine digital |
| **Uma solução bem-sucedida seria** | Uma plataforma unificada com área administrativa para gestão interna e uma vitrine digital pública para exposição do portfólio |

---

## 1.5 Desafios

Os principais desafios técnicos e organizacionais identificados para o desenvolvimento do produto são:

| # | Desafio | Descrição |
|---|---------|-----------|
| 1 | **Interface** | Desenvolver uma interface que atenda simultaneamente dois perfis muito distintos — usuários internos técnicos (área administrativa) e visitantes externos B2B (vitrine) — mantendo usabilidade e clareza em ambos os contextos |
| 2 | **Integração de Gestão** | Integrar em tempo real os dados de gestão de projetos (status, alocação, logs) com a apresentação pública do portfólio, garantindo que as publicações na vitrine reflitam sempre o estado atual sem expor dados internos sensíveis |
| 3 | **Segurança** | Implementar controle de acesso granular (perfis: admin, gestor, colaborador) com Row Level Security no banco de dados, garantindo que cada usuário acesse apenas os dados pertinentes ao seu perfil, inclusive em acessos diretos ao Supabase pelo frontend |

---

## 1.6 Mapa de Stakeholders

O diagrama abaixo representa os principais stakeholders do projeto e sua relação com o produto.

![Diagrama de Stakeholders](images/stakeholders.png)
<figure class="crianex-figure">
  <figcaption>Figura 3 — Mapa de Stakeholders: principais partes interessadas e seu relacionamento com o produto. Fonte: Elaborado pelos autores (2026).</figcaption>
</figure>

| Stakeholder | Papel | Interesse principal |
|-------------|-------|---------------------|
| **Otávio Maya (CTO)** | Patrocinador técnico e cliente principal | Plataforma confiável que reflita as operações reais da Crianex |
| **Vitor Marconi (CSO)** | Patrocinador comercial | Vitrine digital que aumente captação de clientes B2B |
| **Gestores de Projeto** | Usuário primário — área administrativa | Acompanhamento em tempo real do status, alocação e logs dos projetos |
| **Colaboradores Técnicos** | Usuário secundário — área administrativa | Atualização de tarefas e acompanhamento de sprints sem retrabalho |
| **Clientes B2B Potenciais** | Visitante — vitrine digital | Conhecer o portfólio, avaliar capacidades técnicas e entrar em contato |
| **Equipe de Vendas/Marketing** | Usuário — vitrine digital | Apresentar projetos e cases de sucesso em negociações |

---

## 1.7 Segmentação de Clientes

O produto atende quatro perfis de usuário distintos, agrupados em dois módulos:

### Módulo — Área Administrativa (usuários autenticados)

| Perfil | Descrição | Principais Necessidades |
|--------|-----------|------------------------|
| **Administrador** | Responsável pela configuração geral da plataforma; acesso irrestrito a todos os módulos e dados | Gestão de usuários e permissões; configuração da vitrine digital (logo, cores, textos); auditoria de acessos |
| **Gestor de Projeto** | Gerencia um ou mais projetos; acompanha status e alocação em tempo real | Atualizar status de projetos; alocar colaboradores; visualizar logs; receber notificações de eventos críticos |
| **Colaborador** | Membro técnico da equipe de desenvolvimento | Consultar tarefas atribuídas; atualizar progresso; visualizar informações do sprint atual |

### Módulo — Vitrine Digital (acesso público)

| Perfil | Descrição | Principais Necessidades |
|--------|-----------|------------------------|
| **Visitante Anônimo (Potencial Cliente B2B)** | Empresas ou profissionais avaliando contratar os serviços da Crianex | Navegar no portfólio de projetos; visualizar cases com tecnologias e resultados; acessar canal de contato direto |

---

## 1.8 Ambiente dos Usuários

Os usuários internos acessam a plataforma principalmente por meio de navegadores web em ambiente corporativo. O acesso se dá via autenticação (login com credenciais da empresa), e as operações são realizadas em tempo real, com múltiplos usuários podendo operar simultaneamente.

Os usuários externos acessam a vitrine digital publicamente, sem necessidade de cadastro ou autenticação, por qualquer dispositivo com navegador moderno (desktop e mobile). O SSR do SvelteKit garante que a vitrine seja indexada por motores de busca.
