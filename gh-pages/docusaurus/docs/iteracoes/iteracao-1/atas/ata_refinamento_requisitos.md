# Refinamento de Requisitos (V&V) — 14/05/2026

**Data:** 14 de Maio de 2026  
**Local:** Google Meet / Ferramenta Miro (Duração: ~3h10)  
**Assunto:** Engenharia de Requisitos, Matriz de Rastreabilidade e Planejamento Estratégico de Entrega

---

## Artefatos Relacionados

| # | Artefato | Papel na Cerimônia | Link |
|---|----------|--------------------|------|
| 1 | Tabela de Requisitos (RFs e RNFs) | Gerado/Atualizado — mapeamento de RNFs por classificação de Sommerville e reestruturação de CPs | [Ver requisitos →](/backlog/requisitos) |
| 2 | Rastreabilidade | Atualizado — fusão de CPs, nova nomenclatura e separação de contextos Admin/Público | [Ver rastreabilidade →](/backlog/rastreabilidade) |
| 3 | Priorização (Matriz Valor × Esforço) | Atualizado — refinamento com feedbacks do cliente para os quadrantes | [Ver priorização →](/backlog/priorizacao) |
| 4 | Miro board | Usado — estruturação visual de RNFs e separação por feature | [Abrir Miro →](https://miro.com/app/board/uXjVGl991V0=/?share_link_id=878597873452) |

---

## Participantes

| Nome | Papel | Status |
|------|-------|--------|
| Lucas Zanetti | Project Manager · Chief Architect · Development Manager (Backup) | Presente |
| Heitor | Development Manager · Class Owner | Presente |
| Hugo | Class Owner | Presente |
| Philipe | Chief Programmer · Class Owner | Presente |
| Leonardo | Chief Programmer · Class Owner | Presente |
| Camile | Class Owner · Documentation Lead · Requirements Custodian | Presente (Afastou-se aos 01h11m) |

---

## Pauta

1. Reorganização das Características de Produto (CPs)
2. Mapeamento de Requisitos Não Funcionais (RNFs)
3. Matriz de Valor x Esforço
4. Mudança Estratégica no Cronograma (O Pivô da Unidade 2)

---

<details className="crianex-revisions">
<summary>📋 Ata completa — Discussões, decisões e encaminhamentos</summary>
<div className="crianex-revisions__body">

## Discussões e Decisões

### 1. Reorganização das Características de Produto (CPs)

Para sanar críticas anteriores do professor ("Páginas não são funcionalidades") e otimizar o escopo, o grupo tomou uma decisão estrutural importante:

- **Fusão de CPs:** A antiga CP5 (Página Institucional) foi formalmente extinta e integrada como sub-funcionalidade dentro da CP4.
- **Nova Nomenclatura:** A CP4 foi renomeada de "Vitrine Pública de Produtos SAS" para **Plataforma Pública de Apresentação da Empresa**. Essa macroestrutura agora centraliza tanto a exibição do portfólio de produtos quanto as seções institucionais de credibilidade ("Sobre Nós").
- **Separação de Contextos:** Dentro da CP4, dividiu-se nitidamente as features de **Exibição Pública** das features de **Gerenciamento Administrativo** (CRUD de produtos, despublicar, reordenar por drag-and-drop). Isso foi feito para permitir que os Requisitos Não Funcionais de segurança e isolamento de rotas fossem aplicados cirurgicamente apenas nas features do painel interno.

### 2. Mapeamento de Requisitos Não Funcionais (RNFs)

O grupo utilizou a classificação de Sommerville (organizacional, produto e externo) para vincular os RNFs diretamente às features do Miro:

- **Desempenho (Tempo de Resposta):** Fixou-se o limite tolerável de **3 segundos** para o carregamento de relatórios e indicadores na área administrativa (módulo financeiro e dashboard executivo), garantindo uma margem de segurança técnica realista.
- **Segurança e RLS (Row Level Security):** O RLS foi mapeado como obrigatório em todas as tabelas do banco de dados (Supabase) que envolvem dados internos, logs de auditoria, CRM, faturamento e tickets de suporte, restringindo os acessos estritamente aos perfis autorizados. A Vitrine Pública é a única isenta.
- **Criptografia e OWASP:** Requisitos de criptografia de credenciais foram vinculados à feature de autenticação de perfis. A conformidade com as diretrizes do OWASP (contra injeções de SQL/HTTP) foi movida para o escopo global.
- **LGPD (Privacidade):** Mapeado o direito de exclusão e anonimização de dados pessoais de forma restrita às features de "Inativar cliente/lead" e históricos de tickets de suporte. Dados agregados não herdarão essa regra.
- **Integridade Transacional (ACID):** Aplicada especificamente ao fluxo de captação de leads para assegurar que nenhuma submissão de formulário sofra perda parcial de dados em caso de falha de conexão.

#### 2.1 Centralização de RNFs Globais

Para evitar redundâncias visuais exaustivas no Miro, definiu-se uma seção de **RNFs Globais** para comportar os critérios que regem o sistema como um todo:

- Portabilidade de navegador (_cross-browser_).
- Responsividade global da interface (Vitrine e Admin).
- Cobertura mínima de **50% de testes automatizados**.
- Definição unificada da Stack Tecnológica.

### 3. Matriz de Valor x Esforço

A equipe refinou o quadrante de priorização com base nos feedbacks coletados do cliente (Otávio):

- **Alto Valor / Médio-Alto Esforço:** Toda a estrutura do CRM interno e controle de colunas (Kanban).
- **Médio-Baixo Valor / Alto Esforço:** Módulo de faturamento/relatórios financeiros e o sistema de tickets de suporte. O cliente havia sinalizado que essas ferramentas têm menor urgência no MVP.
- **Alto Valor / Baixo Esforço:** Features da Plataforma Pública (Vitrine e Institucional), consolidando-as como o foco de largada da iteração.

### 4. Mudança Estratégica no Cronograma (O Pivô da Unidade 2)

Diante do tempo escasso para codificação até a data limite da Unidade 2 (**19/05/2026**), o Development Manager Leonardo propôs uma mudança de estratégia aceita por unanimidade:

- **Foco nas Cerimônias e Processo:** Como a disciplina avalia a maturidade do processo de engenharia e não apenas o software, o grupo focará em consolidar **100% das evidências metodológicas até terça-feira (19/05)**.
- **Extensão do Prazo do Código:** A entrega final do incremento de software funcional (código e issues resolvidas da Vitrine) foi estendida internamente para a **sexta-feira subsequente (22/05)**.

---

## Encaminhamentos

| # | Tarefa | Responsável | Prazo |
|---|--------|-------------|-------|
| 1 | Desenvolver os Diagramas de Sequência Leves baseados nas macro-features do Miro | Heitor e Lucas | 15/05/2026 |
| 2 | Finalizar as seções pendentes (3 e 4) do Documento de Visão no GitHub | Camile | 15/05/2026 |
| 3 | Resolver a issue pendente de Estratégias no repositório | Camile | 16/05/2026 |
| 4 | Atualizar a numeração, nomenclatura de CPs (1 a 10) e rastreabilidade no Git Pages | Lucas | 17/05/2026 |
| 5 | Concluir o protótipo de alta fidelidade no Figma para validação do cliente | Lucas / Camile | 18/05/2026 |
| 6 | Transcrever e estruturar as _Features Cards Specifications_ (BDD) de cada item validado | Toda a Equipe | 18/05/2026 |

---

## Próximos Passos Coletivos

- **Reunião de Technical Design Review:** Agendada para o início da próxima semana para revisar os diagramas criados, fechar os consensos de arquitetura e pastas do monorrepo antes da abertura oficial das branches/issues de código.

</div>
</details>

---

## Gravação da Reunião

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', margin: '1rem 0', boxShadow: '0 4px 16px rgba(0,0,0,0.12)'}}>
  <iframe
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}}
    src="https://www.youtube.com/embed/dwk5SJKgG3I"
    title="Refinamento de Requisitos (V&V) — 14/05/2026"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen>
  </iframe>
</div>

_Ata redigida por Heitor Macedo Ricardo para registro e consulta dos membros da equipe._
