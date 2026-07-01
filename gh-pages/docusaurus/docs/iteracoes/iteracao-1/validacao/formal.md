# IT1 — Validação Formal do Cliente (Formal Client Validation)

Registro da reunião formal de aceite realizada com o cliente (CEO da Crianex) ao final da IT1. A Formal Client Validation marca o encerramento oficial da iteração e é pré-requisito para a abertura da próxima.

---

## Gravação da Reunião

<div className="video-wrapper">
  <iframe
    width="100%"
    height="480"
    src="https://www.youtube.com/embed/xCj1GN0pBkA"
    title="IT1 — Validação Formal do Cliente"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen>
  </iframe>
</div>

---

## Ata da Reunião

**Participantes:** Lucas Zanetti (Developer), Vitor (CEO da Crianex)

### Pauta

1. Validação da IT1 — Vitrine Pública e Painel Admin
2. Feedback sobre a Vitrine
3. Demonstração do Painel Admin (Produtos, Perfil, Membros, FAQ)
4. Próximos Passos — CRM e Notificações (IT2)

### Pontos Discutidos

#### Vitrine Pública

- Objetivo da iteração: criar vitrine para a Crianex, aumentar visibilidade dos produtos e desenvolver painel de gestão operacional.
- A vitrine inclui portfólio de produtos, seção "Sobre Nós" e formulário de contato.
- Textos e imagens são editáveis via painel admin.
- Formulário de contato possui campo de aceite da política de privacidade (requisito legal).
- Funcionalidade de envio de e-mail de contato implementada e pronta para ativação.
- Seção "Sobre" com animações e perfis da equipe (atualizáveis).
- FAQ categorizado por produto com avaliação de utilidade pelo usuário.
- Suporte a múltiplos idiomas (PT/EN) via biblioteca i18n.
- **Feedback do CEO:** elogiou design, animações e diferenciação de cores por seção — considerou condizente com a identidade da Crianex.
- Sugestão: puxar imagens de capa dos produtos diretamente do site dos produtos (ex: avali, notify, pontua).

#### Painel Admin

- Acessível via subdomínio separado (ex: `admin.crianex.com`) para segurança.
- Login com Google disponível (temporariamente desativado).
- **Gestão de Produtos:** alterar imagem de capa, reordenar exibição na vitrine, cadastrar/publicar/despublicar/rascunho, suporte PT/EN.
- **Gestão de Membros:** dashboard com distribuição por papel, membros ativos e total; papéis Owner/Membro.
- **Gestão de FAQ:** categorias e artigos em PT/EN, associados a produtos; métricas de utilidade.
- **Perfil:** alteração de senha, encerramento de sessão; 2FA não essencial no momento.

#### Próximos Passos — CRM (IT2)

- CRM para visualizar leads, enviar e-mails/mensagens e registrar reuniões.
- Sistema de etapas (campanha) para acompanhar o lead até tornar-se cliente.
- 4 features divididas em sub-funcionalidades: editar cliente, inativar cliente, cadastrar lead, adicionar/remover colunas do CRM.
- **CEO:** elogiou organização e dashboard; parabenizou equipe por seguir o cronograma.

### Decisões

- Vitrine e painel admin aprovados conforme protótipo e feedbacks anteriores.
- Funcionalidade de envio de e-mail pronta para ativação.
- Próxima iteração: implementação do CRM.

### Itens de Ação

| #   | Tarefa                                                                           | Responsável |
| --- | -------------------------------------------------------------------------------- | ----------- |
| 1   | Ajustar textos e imagens da vitrine com base no feedback do cliente              | Developer   |
| 2   | Implementar pull de imagens de capa dos produtos a partir dos sites dos produtos | Developer   |
| 3   | Reativar login com Google no painel admin                                        | Developer   |
| 4   | Implementar módulo CRM (leads, e-mails, reuniões, etapas)                        | Developer   |
| 5   | Testar o dashboard                                                               | CEO         |
| 6   | Repassar informações ao time comercial                                           | CEO         |

---

## Resultado da Validação

| Item Validado                          | Status | Observação               |
| -------------------------------------- | ------ | ------------------------ |
| Vitrine Pública (CP4)                  | <span className="badge badge--green">Aprovado</span>     | Aprovado pelo CEO        |
| Painel de Gerenciamento Admin (CP5)    | <span className="badge badge--green">Aprovado</span>     | Aprovado pelo CEO        |
| FAQ e Base de Conhecimentos (CP6)      | <span className="badge badge--green">Aprovado</span>     | Aprovado pelo CEO        |
| Layout responsivo mobile (≥ 375 px)    | <span className="badge badge--green">Aprovado</span>     | Validado na demonstração |
| Layout responsivo desktop (≥ 1 280 px) | <span className="badge badge--green">Aprovado</span>     | Validado na demonstração |

---

## Feedbacks e Ações — Rastreabilidade

Consolidação de todo feedback registrado na Formal Client Validation da IT1, rastreado até issue e status. Resolve a auditoria pedida pelo professor em [issue #214](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/214) (nem todo feedback formal virava issue/status rastreável).

| #  | Feedback do Cliente                                                                                                   | Origem            | Feature afetada                                  | Decisão                                                            | Issue                                                                              | Responsável | Status                            |
| -- | ----------------------------------------------------------------------------------------------------------------------| ------------------| --------------------------------------------------| --------------------------------------------------------------------| -------------------------------------------------------------------------------------| ----------- | -----------------------------------|
| 1  | Elogios ao design, animações e diferenciação de cores por seção                                                       | Ata IT1, pauta 2  | [F15 — Institucional](/iteracoes/iteracao-1/features/f15) | Mantido — condizente com identidade da Crianex                     | —                                                                                      | Developer   | <span className="badge badge--green">Feito</span> |
| 2  | Ajustar textos e imagens da vitrine com base no feedback do cliente (reunião/troca de mensagens)                      | Item de ação #1   | [F12 — Produtos SaaS](/iteracoes/iteracao-1/features/f12) / [F15](/iteracoes/iteracao-1/features/f15) | Canal de ajuste contínuo via painel admin                          | —                                                                                      | Developer   | <span className="badge badge--green">Feito</span> |
| 3  | Puxar imagens de capa dos produtos diretamente do site de cada produto                                                | Item de ação #2   | [F12 — Produtos SaaS](/iteracoes/iteracao-1/features/f12) | Aceito — implementar pull automático de imagem de capa              | [#218](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/218)           | Developer   | <span className="badge badge--blue">Pós-MVP / IT3</span> |
| 4  | Reativar login com Google no painel admin                                                                             | Item de ação #3   | [F09 — Autenticar](/iteracoes/iteracao-1/features/f09) | Aceito — reativar OAuth Google                                      | [#219](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/219)           | Developer   | <span className="badge badge--orange">IT2 / Pendente</span> |
| 5  | 2FA não essencial no momento                                                                                          | Ata IT1, pauta 3  | [F09 — Autenticar](/iteracoes/iteracao-1/features/f09) | Adiado — sem prioridade para o cliente                              | —                                                                                      | —           | <span className="badge badge--blue">Pós-MVP</span> |
| 6  | Desejo de testar o dashboard / liberar acesso do CEO                                                                  | Item de ação #5   | [F10 — Painel administrativo](/iteracoes/iteracao-1/features/f10) | Aceito — credencial owner liberada ao CEO                           | [#220](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/220)           | Developer   | <span className="badge badge--green">Feito</span> |
| 7  | Colocar uma visualização da senha durante o login                                                                     | Ata IT1, pauta 2  | [F09 — Autenticar](/iteracoes/iteracao-1/features/f09) | Aceito — toggle de visualização no campo de senha                   | [#222](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/222)           | Developer   | <span className="badge badge--orange">IT2 / Pendente</span> |
| 8  | Implementar "esqueci minha senha" no login, com verificação antecipada da existência do e-mail                       | Ata IT1, pauta 2  | [F09 — Autenticar](/iteracoes/iteracao-1/features/f09) | Aceito — fluxo de recuperação via Supabase Auth, sem enumeração de e-mail | [#223](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/223)           | Developer   | <span className="badge badge--orange">IT2 / Pendente</span> |

:::note[Duplicidade textual corrigida]
O registro original desta ata continha o item #8 ("esqueci minha senha") duplicado verbatim em duas linhas. Consolidado em uma única entrada acima — ver [issue #214](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-/issues/214), critério de aceite 3.
:::
