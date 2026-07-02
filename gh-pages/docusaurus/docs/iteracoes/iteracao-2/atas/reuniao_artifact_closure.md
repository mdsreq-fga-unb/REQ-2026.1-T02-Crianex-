# Artifact Closure — Fechamento IT2 — 30/06/2026

**Data:** 30 de junho de 2026  
**Horário:** 21h30  
**Duração:** ~25 minutos  
**Local:** Google Meet  
**Assunto:** Artifact Closure — Revisão final de artefatos, rastreabilidade, engenharia de requisitos e validação do sistema para o encerramento da última iteração da disciplina

---

## Artefatos Relacionados

| # | Artefato | Papel na Cerimônia | Link |
|---|----------|--------------------|------|
| 1 | Home / Painel Inicial | Revisado — 5 blocos de redirecionamento; 3 críticos para avaliação do professor (Rastreabilidade, Priorização, Cronograma) | [Ver Home →](/) |
| 2 | Matriz de Rastreabilidade (React Flow) | Revisado — navegação interativa, cores de status (verde = concluído, amarelo = parcial, sem cor = não iniciado), RFs/RNFs clicáveis | [Ver rastreabilidade →](/backlog/rastreabilidade) |
| 3 | Cronograma e Histórico de Validações | Revisado — links para Protótipo V2 (tela cheia), feedbacks e Diagrama Leve/Formal com zoom | [Ver cronograma →](/visao/cronograma) |
| 4 | Resultados V&V IT1 → IT2 | Revisado — mudanças entre iterações, protótipo revisado do CRM e mapa de dependências | [Ver V&V IT2 →](/iteracoes/iteracao-2/vv) |
| 5 | Engenharia de Requisitos (Cerimônias) | Revisado — estrutura em abas por técnica, legenda Síncrona/Assíncrona por cerimônia | [Ver ER →](/visao/er#cerimonias) |
| 6 | Priorização (Matriz Valor × Esforço) | Revisado — todos os itens concluídos, ferramenta externa para renderização visual e clicável | [Ver priorização →](/backlog/priorizacao) |
| 7 | Ambiente de Produção (Render) | Validado — homologação com deploy ativo e funcional | [crianex.onrender.com →](https://crianex.onrender.com/) |

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

1. Visão geral da Home Page e blocos de redirecionamento
2. Rastreabilidade e evidências (Matriz React Flow)
3. Cronograma e histórico de validações
4. Engenharia de requisitos e priorização
5. Validação do ambiente de produção e encerramento

---

<details className="crianex-revisions">
<summary>📋 Ata completa — Discussões, decisões e encaminhamentos</summary>
<div className="crianex-revisions__body">

## Discussões e Decisões

### 1. Visão Geral da Home Page

O painel inicial apresenta 5 blocos principais de redirecionamento. Três desses blocos foram apontados como críticos para a avaliação do professor: **Rastreabilidade**, **Priorização** e **Cronograma**. Os outros dois blocos atuam de forma complementar.

### 2. Rastreabilidade e Evidências

- **Matriz de Rastreabilidade:** desenvolvida com **React Flow**, centralizando a visualização e permitindo navegar diretamente para cada ponto de forma interativa.
- **Sistema de cores (status):** verde = concluído; amarelo = parcial (partes ainda não finalizadas); sem cor de destaque = não iniciado.
- **Interatividade:** RFs e RNFs são clicáveis e redirecionam para suas respectivas páginas de detalhes.
- **Segurança visual:** na exibição das credenciais de teste do painel (e-mail e senha), foi aplicado efeito de blur na senha, revelada apenas sob ação explícita do usuário.
- **DoR e DoD:** inclusão explícita do ciclo de vida das features (DoR até DoD) associado às evidências de funcionamento (protótipos para RFs, logs/testes para RNFs), atendendo a solicitação direta do professor.

### 3. Cronograma e Histórico de Validações

- **Organização:** dividido por iterações, apresentando resultados de cada ciclo, status e cerimônias.
- **Navegação de artefatos:** links diretos e funcionais para o Protótipo V2 (com opção de tela cheia), feedbacks e o Diagrama Leve/Formal (com suporte a zoom para facilitar a correção do professor).
- **Mudanças no planejamento de validação:**
  - **Validação com o cliente:** realizada com sucesso no dia da reunião, consolidando a aprovação do que foi entregue.
  - **Ajuste de processo:** a equipe optou por pular a etapa de **Partial Client Validation** e avançar diretamente para a **Formal Client Validation**, decisão tomada em comum acordo com o cliente devido à indisponibilidade de agenda dele. Ver justificativa em [Partial Validation IT2](/iteracoes/iteracao-2/validacao/partial).
- **V&V:** registro detalhado das mudanças entre a IT1 e a IT2, incluindo o protótipo revisado do CRM e o mapa de dependências.

### 4. Engenharia de Requisitos e Priorização

**Engenharia de Requisitos**

- Estrutura organizada em abas e barras superiores, separando as técnicas utilizadas.
- Detalhamento do processo baseado em FDD, dividindo etapas, atividades de requisitos, artefatos e diagramas associados.
- Inclusão de legenda explicativa para cada cerimônia, classificando-as em **Síncronas** ou **Assíncronas** para guiar a leitura do professor.

**Priorização e Matriz de Valor × Esforço**

- Status de priorização exibido com todos os itens marcados como concluídos, observações de mudanças e índices de esforço.
- Ferramenta externa utilizada para renderizar a matriz de Valor × Esforço de forma visual e clicável, para rastreamento do MVP.
- **Incidente técnico observado:** durante a apresentação desta tela, o sistema apresentou recarregamento intermitente, retornando a uma versão antiga da página. A equipe debateu se a falha decorria de instabilidade de internet ou de um comportamento conhecido do MkDocs, já que um integrante relatou problema semelhante em outro projeto.

### 5. Validação do Ambiente de Produção e Encerramento

- **Homologação:** site testado em ambiente de produção, com deploy ativo e funcional ([crianex.onrender.com](https://crianex.onrender.com/)).
- **Painel administrativo (`/admin`):** login e módulos internos (Notificações, Produtos e CRM) carregaram corretamente.
- **Funcionalidades do CRM:** testadas com sucesso em produção, incluindo o comportamento de arrastar e soltar (_drag-and-drop_) dos cards.
- **Considerações finais:** devido ao tempo escasso antes da entrega, a equipe não conseguiu realizar uma rotina de testes 100% exaustiva em produção, mas validou o fluxo principal e considerou o projeto pronto para a apresentação final.

## Encaminhamentos

| # | Tarefa | Responsável | Prazo |
|---|--------|-------------|-------|
| 1 | Monitorar o comportamento de recarregamento intermitente identificado durante a apresentação da Priorização | Equipe | Pós-disciplina |
| 2 | Registrar a decisão de pular a Partial Client Validation e avançar direto para a Formal Client Validation | Equipe | Concluído nesta ata |
| 3 | Considerar o projeto pronto para a apresentação final da disciplina | Lucas | 30/06/2026 |

</div>
</details>

---

## Gravação da Reunião

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', margin: '1rem 0', boxShadow: '0 4px 16px rgba(0,0,0,0.12)'}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
    src="https://www.youtube.com/embed/5m65fVITzEM"
    title="Artifact Closure — Fechamento IT2 — 30/06/2026"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen>
  </iframe>
</div>

---

_Ata redigida para registro e consulta dos membros da equipe._
