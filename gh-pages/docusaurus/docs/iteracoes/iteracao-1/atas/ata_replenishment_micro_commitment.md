# Iteration Replenishment + Domain Modeling Workshop — 10/05/2026

**Data:** 10 de Maio de 2026  
**Local:** Google Meet / Chamada de Vídeo (Miro)  
**Assunto:** Iteration Replenishment, Commitment & Domain Modeling Workshop — IT1 com cliente Otávio

---

## Artefatos Relacionados

| # | Artefato | Papel na Cerimônia | Link |
|---|----------|--------------------|------|
| 1 | Glossário de Domínio | Gerado — levantamento de entidades conceituais (Produto, Empresa, FAQ, Lead) | [Ver design técnico →](/iteracoes/iteracao-1/evidencias/design-tecnico#glossario) |
| 2 | Matriz de Valor × Esforço | Gerado — priorização inicial com cliente Otávio | [Ver priorização →](/backlog/priorizacao) |
| 3 | Miro board | Usado — estruturação visual das funcionalidades e fluxos | [Abrir Miro →](https://miro.com/app/board/uXjVGl991V0=/?share_link_id=878597873452) |
| 4 | Backlog macro | Revisado — escopo validado com o cliente (remoção do Portal do Cliente) | [Ver rastreabilidade →](/backlog/rastreabilidade) |

---

## Participantes

| Nome | Papel |
|------|-------|
| Lucas Zanetti | Project Manager · Chief Architect · Development Manager (Backup) |
| Heitor | Development Manager · Class Owner |
| Hugo | Class Owner |
| Otávio | Cliente / Domain Expert |

---

## Pauta

1. Metodologia e Ciclo de Vida do Projeto
2. Escopo do Produto e Matriz de Valor x Esforço
3. Critérios de Validação — IT1
4. Domain Modeling Workshop (Modelagem Conceitual)
5. Decisões de Arquitetura e Banco de Dados

---

<details className="crianex-revisions">
<summary>📋 Ata completa — Discussões, decisões e encaminhamentos</summary>
<div className="crianex-revisions__body">

## Discussões e Decisões

### 1. Metodologia e Ciclo de Vida do Projeto

- **Transição Concluída:** O PM Lucas Zanetti contextualizou a transição formal para o FDD (_Feature Driven Development_). O progresso até o momento concentrou-se na documentação inicial exigida para a Unidade 1.
- **Foco em Valor:** O desenvolvimento a partir da IT1 será estritamente incremental e guiado por Valores de Negócio mapeados a partir dos objetivos específicos (OEs).
- **Esta Reunião:** Combinou os ritos de _Iteration Replenishment_ (puxar o backlog macro da IT1) e _Commitment_ (demonstração de comprometimento da equipe com os prazos).

### 2. Escopo do Produto e Matriz de Valor x Esforço

A equipe revisou as características gerais do produto com o cliente. O cliente validou que a **IT1 (Vitrine Pública)** é a escolha ideal para iniciar as entregas de produto devido ao quadrante na Matriz (Baixa Dificuldade Técnica x Alto Valor Imediato).

A análise das funcionalidades gerou as seguintes decisões de escopo:

- **CRM Interno (Estilo Kanban):** Mantido como prioridade para a gestão interna dos leads pelo time de vendas. O fluxo de prospecção será puramente manual (Lista Fria → Conversa Inicial → Reunião, etc.).
- **Portal do Cliente (Histórico de Tickets):** **Removido do Escopo.** O cliente pontuou que o esforço de integração e segurança de APIs com outros produtos SAS da empresa seria muito alto para um valor baixo, já que os clientes finais preferem contato direto via WhatsApp.
- **Métricas na Vitrine:** Em vez de exibir tickets respondidos, o backend da Crianex fornecerá endpoints para expor métricas reais dos produtos (ex: quantidade de provas corrigidas, número de escolas/alunos associados).

### 3. Critérios de Validação — IT1

O brainstorm com o cliente definiu os critérios aceitáveis para o fechamento da Vitrine Pública:

#### 3.1 Vitrine de Produtos e Página Institucional

- Exibição coesa dos 3 produtos SAS atuais da Crianex, focando em uma linguagem comercial (não excessivamente técnica) para atrair leads.
- Inclusão de uma galeria visual com screenshots reais das telas internas dos produtos (abas/carrossel automático).
- Layout moderno, limpo e responsivo que siga o **Guia de Estilo / Paleta de Cores Oficial** da Crianex.
- Seção institucional contendo a história, missão, visão, diferenciais da empresa e logotipos de clientes atuais.
- Suporte nativo a **Dark Mode**.
- Otimização técnica voltada para **SEO** (_Search Engine Optimization_).

#### 3.2 Formulário de Contato e Captação de Leads

- Os campos obrigatórios do formulário serão: _Nome Completo_, _E-mail_, _Telefone_ e _Mensagem (Motivo do contato)_.
- Inclusão de um campo de seleção (_Dropdown/Dialog_) para especificar sobre qual projeto/produto o lead deseja falar, contendo uma opção "Geral".
- O fluxo de dados consistirá no envio para um endpoint que alimentará o dashboard do Admin. O contato subsequente com o lead continuará manual via WhatsApp.

#### 3.3 Suporte Multilíngue (Internacionalização)

- Implementação obrigatória de tradução para **Português (PT)** e **Inglês (EN)**.
- A arquitetura deve utilizar a abordagem **i18n** (arquivos JSON de tradução estruturados por chaves), acessível ao usuário por um botão de seleção na interface.

### 4. Domain Modeling Workshop (Modelagem Conceitual)

A equipe realizou o levantamento de entidades e atributos base para estruturar o modelo de domínio do banco de dados na persistência dos dados da vitrine:

- **Entidade `Produto`:** ID, Nome, Descrição Comercial, Lista de Screenshots (URLs), Audiência-Alvo (Público-alvo) e Métricas associadas.
- **Entidade `Empresa` (Institucional):** Nome, Missão, Visão, Valores, Diferenciais, E-mail de Contato e Links de Redes Sociais.
- **Entidade `FAQ`:** Tabela de perguntas e respostas recorrentes atreladas aos produtos. Na vitrine funcionará inicialmente como _placeholder_ de leitura, mas já mapeada para o CRUD dinâmico que será construído no Núcleo Admin.
- **Entidade `Lead / Contato`:** Nome, E-mail, Telefone, Mensagem e Referência do Projeto (ID ou Geral).

### 5. Decisões de Arquitetura e Banco de Dados

- **Supabase:** Confirmado o uso do Supabase/PostgreSQL. A equipe de desenvolvimento criará uma instância própria e isolada para o projeto durante o ciclo acadêmico. A transferência de propriedade para a conta oficial da Crianex será efetuada na entrega final.
- **Persistência Imediata:** Para acelerar a entrega da Vitrine no prazo curto da Unidade 2, os dados da vitrine poderão ser consumidos temporariamente via Mock/JSON estruturado no frontend, mas a arquitetura de tabelas do banco de dados já deve ser integrada em paralelo para evitar retrabalho na fase do Admin.

---

## Encaminhamentos

| # | Tarefa | Responsável | Prazo |
|---|--------|-------------|-------|
| 1 | Envio do Guia de Estilo e Paleta de Cores da Crianex | Otávio | Imediato |
| 2 | Refinamento do Backlog de Features no Miro (Equipe) | Lucas, Heitor e Hugo | 12/05/2026 |
| 3 | Modelagem oficial do Diagrama de Classes UML | Lucas | 13/05/2026 |
| 4 | Criação do protótipo de alta fidelidade (Figma) da Vitrine | Lucas / Camile | 14/05/2026 |
| 5 | Setup do Banco de Dados no Supabase (Tabelas Iniciais) | Leonardo / Hugo | 15/05/2026 |
| 6 | Desenvolvimento do Frontend responsivo, i18n e Dark Mode | Heitor / Philipe | 17/05/2026 |

---

## Cronograma de Entregas e Validações — IT1

| Data | Atividade |
|------|-----------|
| **12/05 a 14/05** | Envio de atualizações assíncronas (vídeos/links do Figma) para feedback do cliente (_Validação Parcial_). |
| **17/05** | Prazo limite interno para finalização do código e deploy da Vitrine Pública. |
| **18/05** | Reunião de fechamento de artefato e homologação com o cliente (_Validação Final_). |
| **19/05** | Prazo final para a entrega da Unidade 2 para o professor orientador. |

## Validação pelo Cliente (Domain Expert)

| Data | Origem | Feedback do Otávio (CTO) | Ação Tomada | Resolvida |
|------|--------|--------------------------|-------------|-----------|
| 10/05 | Iteration Replenishment | "Acho que tá muito bom... se vocês conseguirem fazer tudo isso vai ser incrível. É ver se realmente dá para colocar tudo isso no MVP, porque tem algumas coisas aí que eu imagino que são chatas de fazer, que talvez demore." | Mapeamento das prioridades por meio da Matriz de Valor x Esforço, elegendo as CPs da Vitrine Pública para a primeira iteração de entrega do MVP. | <span className="badge badge--green">Sim</span> |
| 10/05 | Iteration Replenishment | "A gente tem uma página muito boa que fosse muito moderna... e a gente ter ela preparada pro SEO (Search Engine Optimization)... se você não tiver ele certinho o Google não acha seu site." | Inclusão de critérios técnicos de otimização de indexação e estruturação de metatags de SEO no backlog das macrofeatures da Vitrine. | <span className="badge badge--green">Sim</span> |
| 10/05 | Domain Modeling | "A vitrine atual foi feita em 5 minutos... essa nova tem que ser mais coesa, mais chamativa pro olhar do cliente... não precisa ser muito específico/técnico, usar palavras difíceis que a galera não entende. Deixa simples." | Ajuste no escopo de conteúdo das soluções SaaS, retirando jargões de engenharia e focando em descrições comerciais de alto impacto visual. | <span className="badge badge--green">Sim</span> |
| 10/05 | Domain Modeling | "Ter imagem do produto mesmo, eu acho que seria muito bom... coloca uma lista de screenshots, porque animação ou vídeo de interface nunca fica com qualidade boa." | Exclusão de mídias de vídeo e inclusão de requisitos para uma galeria de imagens estáticas em alta fidelidade com capturas reais das telas dos sistemas. | <span className="badge badge--green">Sim</span> |
| 10/05 | Domain Modeling | "Acho que tickets respondidos não é uma métrica muito boa... poderia ter métricas dos produtos... quantas provas foram corrigidas no último mês, quantas escolas temos associados, quantos alunos têm usando." | Substituição da exibição de logs de suporte por endpoints que consumam dados volumétricos operacionais de uso real das plataformas da Crianex. | <span className="badge badge--green">Sim</span> |
| 10/05 | Domain Modeling | "Portal do cliente eu acho que pode inclusive tirar... é muito menos útil do quanto de trabalho que isso vai dar..." | Corte definitivo de escopo da característica de Portal de Chamados/Histórico de Clientes do backlog do MVP por inviabilidade técnica e baixo valor de negócio. | <span className="badge badge--green">Sim</span> |
| 10/05 | Domain Modeling | "O site que a gente tem não segue a nossa paleta de cores. Eu vou mandar para você a paleta de cores... como esse é o site institucional, é para refletir o que a empresa é." | Alinhamento da equipe para paralisar definições estéticas até o recebimento oficial do guia de identidade visual e paletas cromáticas da Software House. | <span className="badge badge--green">Sim</span> |

</div>
</details>

---

## Gravação da Reunião

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', margin: '1rem 0', boxShadow: '0 4px 16px rgba(0,0,0,0.12)'}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
    src="https://www.youtube.com/embed/mtWLlMVWzw0"
    title="Iteration Replenishment + Domain Modeling Workshop — 10/05/2026"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen>
  </iframe>
</div>

---

_Ata redigida por Heitor Macedo Ricardo para registro e consulta dos membros da equipe._
