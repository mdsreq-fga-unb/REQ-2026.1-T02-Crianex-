# IT2 — Validação Formal do Cliente (Formal Client Validation)

Registro da reunião formal de aceite realizada com o cliente ao final da IT2. A Formal Client Validation marca o encerramento oficial da iteração e é pré-requisito para a abertura da próxima. Nesta iteração, toda a validação do incremento (Módulo de CRM e Sistema de Notificações) foi concentrada nesta reunião — ver justificativa em [Validação Parcial da IT2](/iteracoes/iteracao-2/validacao/partial).

**Data:** 29 de junho de 2026  
**Assunto:** Validação da Iteração 2 (MVP) — Módulo de CRM e Sistema de Notificações  
**Participantes:** Vitor (Representante da Crianex), Desenvolvedor/Apresentador (Equipe de Desenvolvimento)

---

## Artefatos Relacionados

| # | Artefato | Papel na Cerimônia | Link |
|---|----------|--------------------|------|
| 1 | F19 — Gerenciar clientes e leads | Demonstrado/Validado — Kanban, personalização de colunas, interações, atribuição de responsável, drag-and-drop, cadastro manual | [Ver feature F19 →](/iteracoes/iteracao-2/features/f19) |
| 2 | F20 — Gerenciar colunas do funil | Demonstrado/Validado — criação/edição/remoção de colunas do pipeline | [Ver feature F20 →](/iteracoes/iteracao-2/features/f20) |
| 3 | F21 — Registrar interações comerciais | Demonstrado/Validado — notas, ligações e mensagens registradas no histórico do card | [Ver feature F21 →](/iteracoes/iteracao-2/features/f21) |
| 4 | F07 — Acompanhar histórico de notificações | Demonstrado/Validado — notificação em tempo real no dashboard ao captar um lead | [Ver feature F07 →](/iteracoes/iteracao-2/features/f07) |
| 5 | F08 — Gerenciar templates de notificações | Demonstrado — template do evento "novo lead" acionado na demonstração ao vivo | [Ver feature F08 →](/iteracoes/iteracao-2/features/f08) |
| 6 | RF60, RF61, RF62 — Filtros, exportação CSV e visualização em tabela | Demonstrado/Validado — mini-dashboard de indicadores, filtros por produto/responsável, alternância Kanban/tabela | [Ver rastreabilidade →](/backlog/requisitos#f19) |
| 7 | RNF10 — Proteção do formulário público (rate limit) | Demonstrado — trava de segurança contra envios simultâneos (anti-spam/bot) | [Ver RNF10 →](/backlog/requisitos#rnf10) |
| 8 | Resultados V&V da IT2 | Referenciado — status de conclusão das features CP1/CP9 | [Ver V&V IT2 →](/iteracoes/iteracao-2/vv) |
| 9 | Mapa de Dependências IT2 | Referenciado — features CP1/CP9 concluídas nesta iteração | [Ver dependências →](/backlog/dependencias#it2) |

---

## Gravação da Reunião

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', margin: '1rem 0', boxShadow: '0 4px 16px rgba(0,0,0,0.12)'}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
    src="https://www.youtube.com/embed/ZNuCPiqid1o"
    title="IT2 — Validação Formal do Cliente (Formal Client Validation)"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen>
  </iframe>
</div>

---

## Ata da Reunião

**Participantes:** Vitor (Representante da Crianex), Desenvolvedor/Apresentador (Equipe de Desenvolvimento)

### Pauta

Validação das entregas da Iteração 2 (Módulo de CRM e Sistema de Notificações) e alinhamento dos próximos passos para a homologação do MVP.

### Pontos Discutidos

<details className="crianex-revisions">
<summary>📋 Ata completa — Discussões, decisões e encaminhamentos</summary>
<div className="crianex-revisions__body">

#### 1. Objetivos da Reunião

Validar as funcionalidades desenvolvidas para o fechamento do MVP (Produto Mínimo Viável), focando no gerenciamento de leads (CRM), rastreabilidade e sistema de notificações de segurança e captação.

#### 2. Pontos Discutidos e Funcionalidades Demonstradas

**Módulo de CRM**

- **Visualização em Kanban:** apresentação das colunas padrão que determinam as etapas do funil de vendas (Novo Lead, Qualificado, Em Negociação, Fechado, Perdido).
- **Personalização do Fluxo:** demonstração da flexibilidade do CRM, permitindo que o usuário edite, remova, altere cores, mude nomes ou crie novas colunas para adaptar à sua realidade de negócio.
- **Gerenciamento de Cards (Leads):**
  - Possibilidade de registrar interações internas (notas de reuniões, chamadas ou mensagens de WhatsApp) para alinhamento da equipe de vendas.
  - Atribuição de membros da equipe como corresponsáveis por leads específicos.
  - Edição de informações do lead (como alteração do produto de interesse).
  - Movimentação dos cards por meio de drag-and-drop (arrastar e soltar).
- **Segurança e Anti-Spam:** o sistema conta com uma trava de segurança que bloqueia o IP do usuário caso ocorram mais de 4 requisições simultâneas no formulário, mitigando ataques de bots.
- **Filtros e Indicadores:** inclusão de um mini-dashboard com métricas (ex.: leads sem interação há mais de 7 dias) e filtros avançados por produto e responsável.
- **Visualização Alternativa e Exportação:** opção de alternar a visualização para o formato de tabela, botão direto para redirecionamento de e-mail e funcionalidade de exportação dos dados em formato CSV.
- **Cadastro Manual:** opção de cadastrar um novo lead manualmente para os casos em que o primeiro contato ocorra fora do site (ex.: prospecção direta via WhatsApp).

**Demonstração Prática (Fluxo de Lead e Notificação)**

Foi realizado um teste em tempo real simulando o envio de um formulário por um lead fictício (Marina, interessada no produto "Avali"). O sistema processou a requisição instantaneamente, posicionando o novo lead na coluna correspondente do CRM e disparando uma notificação em tempo real no dashboard com os detalhes do contato.

#### 3. Feedback do Cliente (Crianex)

Vitor validou positivamente a entrega, destacando que o CRM ficou muito bem organizado e agrega grande valor ao dashboard do modelo SaaS da empresa. Pontuou que a funcionalidade será extremamente útil, principalmente para a gestão de clientes de maior porte.

#### 4. Próximos Passos e Definições (Ações)

- **Acesso ao Repositório:** a equipe de desenvolvimento adicionará os representantes da Crianex ao repositório do projeto para que a equipe técnica da empresa possa revisar o código, validar requisitos de segurança e planejar a integração com o ecossistema atual.
- **Página "Sobre":** Vitor enviará os dados da equipe da Crianex (fotos, nomes e funções) para que os desenvolvedores preencham a seção institucional antes da entrega final.
- **Design e Redação (Copies):** a definição final dos textos (copies), imagens e frames dos produtos na vitrine do site será realizada após o término da disciplina acadêmica. O processo contará com o apoio do designer da Crianex.
- **Estratégia de Deploy (Implantação):**
  - A equipe de desenvolvimento realizará o deploy inicial em um domínio próprio temporário para fins de apresentação e avaliação acadêmica com o professor.
  - Durante o período de férias, as duas partes se reunirão em um workshop para configurar o deploy definitivo no domínio oficial da Crianex.

</div>
</details>

### Decisões

- Módulo de CRM (F19, F20, F21) e Sistema de Notificações (F07, F08) aprovados conforme demonstração ao vivo.
- Toda a validação do incremento da IT2 concentrada nesta reunião única, a pedido do cliente (sem sessões de validação parcial — ver [justificativa](/iteracoes/iteracao-2/validacao/partial)).
- Página "Sobre" a ser preenchida com dados enviados pelo cliente antes da entrega final.
- Copies/imagens/frames dos produtos definidos após o término da disciplina, com apoio do designer da Crianex.
- Deploy em domínio temporário para a avaliação acadêmica; domínio definitivo configurado em workshop pós-disciplina.

### Itens de Ação

| #   | Tarefa                                                                              | Responsável |
| --- | ------------------------------------------------------------------------------------ | ----------- |
| 1   | Adicionar representantes da Crianex ao repositório do projeto                        | Developer   |
| 2   | Enviar dados da equipe (fotos, nomes, funções) para a página "Sobre"                  | Crianex     |
| 3   | Preencher a seção institucional da vitrine com os dados recebidos                     | Developer   |
| 4   | Realizar deploy inicial em domínio temporário para avaliação acadêmica               | Developer   |
| 5   | Agendar workshop pós-disciplina para configurar o domínio definitivo da Crianex       | Ambos       |

---

## Resultado da Validação

| Item Validado                                    | Status | Observação |
| ------------------------------------------------- | ------ | ---------- |
| CRM Interno de Clientes — Kanban (CP1)             | <span className="badge badge--green">Aprovado</span> | Board, personalização de colunas, cards e interações validados na demonstração |
| Sistema de Notificações (CP9)                      | <span className="badge badge--green">Aprovado</span> | Notificação em tempo real validada no fluxo de captação de lead |
| Filtros, indicadores e exportação CSV do CRM       | <span className="badge badge--green">Aprovado</span> | RF60–RF62 demonstrados ao vivo |
| Proteção anti-spam do formulário público (RNF10)   | <span className="badge badge--green">Aprovado</span> | Trava de rate limit explicada e aceita pelo cliente |
