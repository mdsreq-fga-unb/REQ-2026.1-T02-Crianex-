# Crianex Hub — Documentação (Docusaurus)

Migração da documentação MkDocs (`../docs`) para **Docusaurus 3**. O site MkDocs original **não foi removido** — esta pasta é independente.

## Requisito: Node 22 LTS

Use **Node 20 ou 22 LTS** (pinado em `.nvmrc` e `.mise.toml`). **Não use Node 25/26** — o SSG do Docusaurus falha ao pré-renderizar várias páginas (HTML sem corpo) sob Node ≥ 25.

```bash
mise use node@22     # ou: nvm use   (lê o .nvmrc)
```

## Rodar localmente

```bash
npm install      # reinstale se trocar de versão de Node
npm start        # dev server em http://localhost:3000/REQ-2026.1-T02-Crianex-/
```

Build de produção:

```bash
npm run build
npm run serve    # serve a pasta build/
```

## Decisões da migração

- **Design system** em `src/css/custom.css` — paleta Crianex (rosa `#E71F84`, verde `#66DF7A`, roxo `#7F3FE5`), cards, hero, badges, tabelas e histórico recolhível.
- **Componentes** em `src/components/`:
  - `RevisionHistory` — histórico de revisão recolhível (começa minimizado), inserido ao fim de cada página.
  - `TraceabilityFlow` — matriz de rastreabilidade interativa em **React Flow** (`@xyflow/react`). Nós OE/CP abrem a [Solução](docs/visao/solucao.mdx); nós de Feature abrem a [Tabela de Requisitos](docs/backlog/requisitos.mdx).
- **Rastreabilidade** (`docs/backlog/rastreabilidade.mdx`) contém apenas o **Miro** + a **matriz React Flow**. As tabelas de RF/RNF/RN vivem em `docs/backlog/requisitos.mdx`; OEs e CPs em `docs/visao/solucao.mdx`.
- **Tabs** (`@theme/Tabs`) usadas para compactar seções densas (Solução, Eng. de Requisitos, Tabela de Requisitos).
- Páginas de evidências/atas foram convertidas automaticamente do MkDocs (admonitions `!!!` → `:::`, tabs `===` → `<Tabs>`, histórico movido para o fim).

## ⚠️ Pin de versão obrigatório

`package.json` fixa `"overrides": { "webpack": "5.95.0" }`. O webpack ≥ 5.108 introduziu validação estrita no `ProgressPlugin` que quebra o `webpackbar` do Docusaurus 3.7 (erro _"Progress Plugin … unknown property 'name'"_) sob Node 25+. **Não remova esse override** sem testar o build.

## Protótipos

Os protótipos HTML interativos estão em `static/proto/` e são embarcados via `pathname:///proto/...` nas páginas de protótipo de cada iteração.
