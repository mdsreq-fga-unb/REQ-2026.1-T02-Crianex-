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

## Feedbacks e Ações

| #   | Feedback do Cliente                                                                                                       | Ação à ser tomada                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1   | Elogios ao design, animações e diferenciação de cores por seção                                                           | Mantido — condizente com identidade da Crianex    |
| 2   | Fazer uma reunião ou troca de mensagens para alterar as informações (texto e imagens) dentro do site caso seja necessário | Agendar reunião ou mandar screenshots e perguntar |
| 3   | 2FA não essencial no momento                                                                                              | Adiado para iterações futuras                     |
| 4   | Desejo de testar o dashboard                                                                                              | Acesso será disponibilizado ao CEO                |
| 5   | Colocar uma visualização da senha durante o login                                                                         | techdebt jogado para IT2                          |
| 6   | Implementar esqueci minha senha no login direto com o email(com verficação antecipada da existência do email)             | techdebt jogado para IT2                          |
| 6   | Implementar esqueci minha senha no login direto com o email(com verficação antecipada da existência do email)             | techdebt jogado para IT2                          |
