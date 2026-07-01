# Technical Design Review — IT2 — 11/06/2026

**Data:** 11 de junho de 2026  
**Horário:** 21h12  
**Duração:** 28 minutos e 50 segundos  
**Local:** Teams  
**Assunto:** Technical Design Review — Iteração 2 (CRM, Notificações)

---

## Artefatos Relacionados

| # | Artefato | Papel na Cerimônia | Link |
|---|----------|--------------------|------|
| 1 | Diagramas de Sequência Leve IT2 | Gerado/Validado — fluxos de F19, F20, F21, F07, F08 revisados e aprovados | [Ver design técnico IT2 →](/iteracoes/iteracao-2/evidencias/design-tecnico) |
| 2 | Feature Cards IT2 | Gerado — mapeamento das features CRM e Notificações como issues-mãe | [Ver feature cards IT2 →](/iteracoes/iteracao-2/evidencias/design-tecnico) |
| 3 | Protótipo CRM | Usado/Validado — apresentado e validado tecnicamente na reunião | [Ver Protótipo CRM →](/iteracoes/iteracao-2/evidencias/prototipo) |
| 4 | Mapa de Dependências IT2 | Gerado — relacionamento entre features para ordenação de build | [Ver dependências →](/backlog/dependencias#it2) |
| 5 | Critérios de aceite (BDD) | Atualizado — RF39 (deleção de colunas) revisado durante a reunião | [Ver rastreabilidade →](/backlog/rastreabilidade) |

---

## Participantes

| Nome | Papel | Status |
|------|-------|--------|
| Lucas Zanetti | Project Manager · Chief Architect · Development Manager (Backup) | Presente |
| Heitor | Development Manager · Class Owner | Presente |
| Hugo | Class Owner | Presente |
| Philipe | Chief Programmer · Class Owner | Presente |
| Camile | Class Owner | Presente |
| Leonardo | Chief Programmer · Class Owner | Presente |

---

## Pauta

1. Objetivo da Reunião
2. Discussões e Deliberações por Feature (F19, F20, F21, F07/F08, CP9)
3. Mapeamento de Dependências e Próximos Passos

---

<details className="crianex-revisions">
<summary>📋 Ata completa — Discussões, decisões e encaminhamentos</summary>
<div className="crianex-revisions__body">

## Objetivo da Reunião

Realizar o **Technical Design Review (TDR)** da iteração corrente. O foco foi validar os diagramas de sequência leves, os _feature cards_ e os critérios de aceite das entregas planejadas para as metas **CP1** e **CP9**.

### Funcionalidades Avaliadas

- **F19:** Gerenciar clientes e leads.
- **F20:** Gerenciar colunas do funil.
- **F21:** Gerenciar os cards do CRM.
- **F07:** Exibir histórico.
- **F08:** Controlar o estado.

---

## Discussões e Deliberações por Feature

### F19: Gerenciar Clientes e Leads (CP1)

- **Status Atual:** O fluxo inicial de captura de leads via formulário público (envolvendo consentimento da LGPD, rota POST, validações na API Express, _rate limit_ de 5 requisições e sanitização dos dados para o Supabase DB) já se encontra totalmente implementado. A principal mudança agora é a exposição adequada desses dados no painel Kanban.
- **Estratégia contra Superlotação do CRM:** Lucas levantou a preocupação de o painel ficar poluído visualmente caso ocorra uma grande quantidade de envios simultâneos.
  - **Decisão:** O time optou por realizar o **agrupamento por e-mail**. Se um mesmo usuário preencher o formulário múltiplas vezes, as mensagens adicionais serão anexadas e acessíveis dentro do card de perfil dele, em vez de gerar cards duplicados no board.
- **Inativação de Registros:** Philipe reforçou que a funcionalidade de inativar cliente/lead (RF36) altera o status do registro para `inativo` via SQL, mas **não realiza a exclusão física** do banco de dados.

### F20: Gerenciar Colunas do Funil (CP1)

- **Fluxo de Deleção de Colunas (Alteração Crítica):** O critério original bloqueava a exclusão de uma coluna caso ela contivesse cards ativos, respondendo com um erro `409 Conflict`.
- **Nova Proposta de UX:** O time decidiu flexibilizar o comportamento do sistema para melhorar a usabilidade:
  - Ao tentar excluir uma coluna populada, o sistema exibirá uma **caixa de diálogo/pop-up de confirmação**.
  - O aviso deixará claro que, ao confirmar a ação, **todos os cards contidos naquela coluna também serão permanentemente excluídos**.
  - Também foi discutida a adição de um botão específico na interface para limpar os cards sem deletar a estrutura da coluna.
- **Ação:** Um _post-it_ foi adicionado ao board para readequar o diagrama de sequência e o critério de aceite do requisito (RF39).

### F21: Gerenciar os Cards do CRM (CP1)

- **Movimentação Intuitiva:** Validou-se o fluxo onde o administrador atualiza e move os cards entre as etapas do funil utilizando interações de _drag and drop_.
- **Segurança de Acesso:** Tentativas de alteração feitas sem tokens válidos ou por usuários sem os privilégios definidos nas regras de RLS (_Row Level Security_) serão interceptadas e rejeitadas com erro `401 Unauthorized`.

### CP9: Exibir Histórico (F07) e Controlar o Estado (F08)

- **Central de Notificações:** O administrador terá acesso a uma listagem cronológica de notificações com um contador de itens não lidos. Ao clicar e marcar como lida, o contador decrementa, mas a notificação não some, permanecendo guardada temporariamente no histórico.
- **Configuração de Templates:** A capacidade de criar e editar templates de notificações (F08) será restrita estritamente a usuários de nível superior (Administradores e _Owners_).
- **Mapeamento de Gatilhos:** Lucas alertou que o time precisa definir explicitamente no _feature card_ quais ações ou eventos exatos dispararão uma notificação no sistema.
- **Retenção:** O tempo de permanência das notificações lidas no histórico do painel será alinhado e validado em conjunto com o cliente.

---

## Mapeamento de Dependências e Próximos Passos

1. **Atualização da Documentação:** Heitor fará os ajustes nos critérios de aceite modificados durante o debate (especialmente na deleção de colunas e mapeamento de notificações).
2. **Sincronização com o Pages:** O mapa visual de dependências apresentado na reunião será traduzido e padronizado por Heitor no formato textual exigido na documentação oficial do projeto (_Pages_).
3. **Abertura de Tarefas:** Com os fluxos técnicos e de segurança aprovados, o time está autorizado a abrir a _feature pai_ e as respectivas _sub-issues_ de desenvolvimento diretamente no GitHub.

> **Nota:** Esta ata consolida as decisões arquiteturais tomadas pelo time de engenharia e deve ser anexada à documentação do repositório.

</div>
</details>

---

## Gravação da Reunião

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', margin: '1rem 0', boxShadow: '0 4px 16px rgba(0,0,0,0.12)'}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
    src="https://www.youtube.com/embed/aUDWP5v4xGM"
    title="Technical Design Review — IT2 — 11/06/2026"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen>
  </iframe>
</div>
