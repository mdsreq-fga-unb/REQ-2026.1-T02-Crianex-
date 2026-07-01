# IT1 — Vitrine Pública

**Período:** 28/04/2026 – 07/06/2026  
**Status:** <span className="badge badge--green">Concluída</span>

## Iteration Goal

Ao fim da IT1: (1) qualquer visitante navega pela vitrine pública, visualiza o catálogo de produtos SaaS e consulta informações institucionais e de contato; (2) um administrador autenticado gerencia produtos, membros e FAQ via painel seguro; e (3) visitantes consultam e avaliam artigos do FAQ — com Formal Client Validation aprovada pelo cliente.

## Observações

A entrega da unidade 2 ocorreu dia 19 de maio de 2026. Nossa iteração encerrou dia 25 de maio de 2026; por isso alguns objetivos ainda estavam em fase de conclusão na data da entrega da unidade.

---

## Características de Produto (CPs) Trabalhadas

| CP      | Característica de Produto                     | OE Relacionado | Prioridade |
| ------- | --------------------------------------------- | -------------- | ---------- |
| **CP4** | Plataforma Pública de Apresentação da Empresa | OE2            | Alta       |
| **CP5** | Painel de Gerenciamento do Administrador      | OE2            | Alta       |
| **CP6** | FAQ e Base de Conhecimentos por Produto       | OE2            | Alta       |

---

## Features Desenvolvidas {#features}

Cada feature tem sua **própria página de evidências** — com mini-navbar por requisito (RF/RNF): critérios BDD, regras de negócio, demonstração no protótipo e deploy.

<div className="crianex-cards">
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f09"><div className="crianex-card__eyebrow">F09 · CP5</div><div className="crianex-card__title">Autenticar</div></a>
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f10"><div className="crianex-card__eyebrow">F10 · CP5</div><div className="crianex-card__title">Painel administrativo</div></a>
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f11"><div className="crianex-card__eyebrow">F11 · CP5</div><div className="crianex-card__title">Gerenciar usuários</div></a>
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f12"><div className="crianex-card__eyebrow">F12 · CP4</div><div className="crianex-card__title">Produtos SaaS</div></a>
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f13"><div className="crianex-card__eyebrow">F13 · CP4</div><div className="crianex-card__title">Publicar produto</div></a>
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f14"><div className="crianex-card__eyebrow">F14 · CP4</div><div className="crianex-card__title">Contato / Leads</div></a>
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f15"><div className="crianex-card__eyebrow">F15 · CP4</div><div className="crianex-card__title">Institucional</div></a>
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f16"><div className="crianex-card__eyebrow">F16 · CP6</div><div className="crianex-card__title">Artigos de FAQ</div></a>
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f17"><div className="crianex-card__eyebrow">F17 · CP6</div><div className="crianex-card__title">Publicar FAQ</div></a>
  <a className="crianex-card" href="/REQ-2026.1-T02-Crianex-/iteracoes/iteracao-1/features/f18"><div className="crianex-card__eyebrow">F18 · CP6</div><div className="crianex-card__title">Avaliação de FAQ</div></a>
</div>

---

## Cerimônias e Reuniões (FDD + Kanban)

| Data       | Cerimônia                                                  | Participantes                                   | Ata                             |
| ---------- | ---------------------------------------------------------- | ----------------------------------------------- | ------------------------------- |
| 29/04/2026 | **Domain Modeling & Iteration Replenishment & Commitment** | Lucas, Heitor, Hugo, Otávio (Cliente)           | [Ver ata](/iteracoes/iteracao-1/atas/ata_replenishment_micro_commitment) |
| 09/05/2026 | **Feature Discovery & Slicing**                            | Lucas, Heitor, Hugo, Philipe, Leonardo          | [Ver ata](/iteracoes/iteracao-1/atas/ata_feature_discovery_session) |
| 14/05/2026 | **Midweek Sync**                                           | Lucas, Heitor, Philipe, Hugo, Leonardo, Camille | Assíncrono                      |
| 17/05/2026 | **Technical Design Review**                                | Lucas, Heitor, Philipe, Hugo, Leonardo, Camille | [Ver ata](/iteracoes/iteracao-1/atas/ata_technical_design_review) |
| 25/05/2026 | **Feature Build Consolidation**                            | Lucas, Philipe, Heitor, Hugo                    | Optado por fazer assíncrono     |
| 26/05/2026 | **Midweek Sync**                                           | Lucas, Heitor, Philipe, Hugo, Leonardo, Camille | Assíncrono                      |
| 06/06/2026 | **Artifact Closure — Unidade 3**                           | Lucas, Philipe, Heitor, Hugo, Camile            | [Ver ata](/iteracoes/iteracao-1/atas/ata_artifact_closure) |

---

## Evidências e Validação

| #   | Evidência                    | Descrição                                                                                    | Link                                             |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | Design Técnico               | Diagramas leves, feature cards, glossário de domínio e diagrama de domínio produzidos na TDR | [Ver detalhes →](/iteracoes/iteracao-1/evidencias/design-tecnico) |
| 2   | Features Entregues (F09–F18) | Página por feature com evidências por requisito (BDD, regras de negócio, protótipo, deploy)   | [Ver features →](#features)                                       |
| 3   | Protótipo de Alta Fidelidade | Protótipo interativo em HTML produzido antes do desenvolvimento                              | [Ver detalhes →](/iteracoes/iteracao-1/evidencias/prototipo)      |
| 4   | Validação Parcial do Cliente | Vídeo compilado das sessões de validação parcial com o cliente + feedbacks registrados       | [Ver detalhes →](/iteracoes/iteracao-1/validacao/partial)         |
| 5   | Validação Formal do Cliente  | Reunião formal de aceite com o cliente Otávio                                                | [Ver detalhes →](/iteracoes/iteracao-1/validacao/formal)          |

---

## Rastreabilidade e Priorização

- [Rastreabilidade de Requisitos](/backlog/rastreabilidade) — mapeamento completo OEs → CPs → Features → RFs/RNFs com vínculos bidirecionais.
- [Priorização do Backlog](/backlog/priorizacao) — método IP = VB/ES com diagramas de Valor × Esforço e tabelas de prioridade por Feature e RNF.
