# Reunião — 15/06/2026

**Data:** 11 de junho de 2026  
**Horário:** 21:12  
**Duração:** 28 minutos e 50 segundos  
**Local:** Teams  
**Assunto:** Technical Design Review - Iteração 2

---

## Participantes

| Nome          | Papel                                                            | Status   |
| ------------- | ---------------------------------------------------------------- | -------- |
| Lucas Zanetti | Project Manager · Chief Architect · Development Manager (Backup) | Presente |
| Heitor        | Development Manager · Class Owner                                | Presente |
| Hugo          | Class Owner                                                      | Presente |
| Philipe       | Chief Programmer · Class Owner                                   | Presente |
| Camile        | Class Owner                                                      | Presente |
| Leonardo      | Chief Programmer · Class Owner                                   | Presente |

---

## 1. Objetivo da Reunião

Realizar o **Technical Design Review (TDR)** da iteração corrente. O foco foi validar os diagramas de sequência leves, os _feature cards_ e os critérios de aceite das entregas planejadas para as metas **CP1** e **CP9**.

### Funcionalidades Avaliadas:

- **F19:** Gerenciar clientes e leads.
- **F20:** Gerenciar colunas do funil.
- **F21:** Gerenciar os cards do CRM.
- **F07:** Exibir histórico.
- **F08:** Controlar o estado.

---

## 2. Discussões e Deliberações por Feature

### F19: Gerenciar Clientes e Leads (CP1)

- **Status Atual:** O fluxo inicial de captura de leads via formulário público (envolvendo consentimento da LGPD, rota POST, validações na API Express, _rate limit_ de 5 requisições e sanitização dos dados para o Supabase DB) já se encontra totalmente implementado. A principal mudança agora é a exposição adequada desses dados no painel Kanban.
- **Estratégia contra Superlotação do CRM:** Lucas levantou a preocupação de o painel ficar poluído visualmente caso ocorra uma grande quantidade de envios simultâneos.
  - **Decisão:** O time optou por realizar o **agrupamento por e-mail**. Se um mesmo usuário preencher o formulário múltiplas vezes, as mensagens adicionais serão anexadas e acessíveis dentro do card de perfil dele, em vez de gerar cards duplicados no board.
- **Inativação de Registros:** Philipe reforçou que a funcionalidade de inativar cliente/lead (RF36) altera o status do registro para `inativo` via SQL, mas **não realiza a exclusão física** do banco de dados. Isso permite que os dados históricos permaneçam salvos e que o cliente possa ser reativado caso volte a interagir.

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
- **Configuração de Templates:** A capacidade de criar e editar templates de notificações (F08) será restrita estritamente a usuários de nível superior (como Administradores e _Owners_).
- **Mapeamento de Gatilhos:** Lucas alertou que o time precisa definir explicitamente no _feature card_ quais ações ou eventos exatos dispararão uma notificação no sistema. Um lembrete foi inserido para documentar essas regras de negócio.
- **Retenção:** O tempo de permanência das notificações lidas no histórico do painel será alinhado e validado em conjunto com o cliente.

---

## 3. Mapeamento de Dependências e Próximos Passos

1. **Atualização da Documentação:** Heitor fará os ajustes nos critérios de aceite modificados durante o debate (especialmente na deleção de colunas e mapeamento de notificações).
2. **Sincronização com o Pages:** O mapa visual de dependências apresentado na reunião será traduzido e padronizado por Heitor no formato textual exigido na documentação oficial do projeto (_Pages_), focando no relacionamento das _features_ principais.
3. **Abertura de Tarefas:** Com os fluxos técnicos e de segurança aprovados, o time está autorizado a abrir a _feature pai_ e as respectivas _sub-issues_ de desenvolvimento diretamente no GitHub.

---

> **Nota:** Esta ata consolida as decisões arquiteturais tomadas pelo time de engenharia e deve ser anexada à documentação do repositório.

## Gravação da Reunião

<div style="width: 100%; max-width: 900px; margin: 1.5rem 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
  <iframe 
    style="width: 100%; aspect-ratio: 16/9; display: block;" 
    src="https://youtu.be/aUDWP5v4xGM" 
    title="Apresentação da Unidade 3" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>
