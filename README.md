<p align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=waving&color=0:004d1a,50:800040,100:33001a&height=100&section=header&animation=fadeIn"
    width="100%"
  />
</p>

# REQ-2026.1-T02-Crianex

<div align="center">
<img width="370" height="326" alt="logo" src="https://github.com/user-attachments/assets/6eb74023-5c3c-4284-a655-d0ce62751881" />
</div>

Repositório da disciplina **Requisitos de Software** — REQ-T02, 2026.1 · UnB  
Produto: **Crianex Hub** — plataforma administrativa centralizada e vitrine digital bilíngue para a Software House Crianex.

- **Cliente:** Crianex (CTO: Otávio Maya)
- **Metodologia:** FDD + Kanban (WIP)
- **Docs (Unidade 2):** [/unidade2](https://mdsreq-fga-unb.github.io/REQ-2026.1-T02-Crianex-/)
- **Docs (Unidade 3):** [/unidade3](https://mdsreq-fga-unb.github.io/REQ-2026.1-T02-Crianex-/unidade3/)

<p align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:004d1a,50:800040,100:33001a&height=2&section=header"
    width="80%"
  />
</p>

## Links

- **Miro Board:** https://miro.com/app/board/uXjVGl991V0=/?share_link_id=878597873452
- **GitHub Projects (Kanban):** https://github.com/orgs/mdsreq-fga-unb/projects/96

<p align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:004d1a,50:800040,100:33001a&height=2&section=header"
    width="80%"
  />
</p>

## Stack

| Camada    | Tecnologia                                     |
| --------- | ---------------------------------------------- |
| Frontend  | SvelteKit + TypeScript · SSR · `adapter-node`  |
| Backend   | Express.js + TypeScript                        |
| Banco     | PostgreSQL via Supabase (Auth + Storage + RLS) |
| i18n      | paraglide-js (`@inlang/paraglide-sveltekit`)   |
| Dev local | Docker Compose + Supabase CLI                  |
| CI/CD     | GitHub Actions                                 |

<p align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:004d1a,50:800040,100:33001a&height=2&section=header"
    width="80%"
  />
</p>

## Setup rápido

### Pré-requisitos

- Node.js 22+
- Docker + Docker Compose
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 1 · Clone e instale dependências

```bash
git clone https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-Crianex-.git
cd REQ-2026.1-T02-Crianex-
npm install        # instala frontend + backend via workspaces
```

### 2 · Configure o ambiente

```bash
cp .env.example .env
# Edite .env e preencha os valores (veja instruções nos comentários)
```

### 3 · Suba o Supabase local

```bash
supabase start              # sobe Postgres, Auth, Storage, Studio
supabase status             # copie ANON_KEY e SERVICE_ROLE_KEY para o .env
```

Supabase Studio disponível em `http://localhost:54323`.

### 4 · Aplique as migrations e seed

```bash
supabase db reset           # aplica todas as migrations + seed.sql
```

### 5 · Suba os serviços de aplicação

**Opção A — Docker Compose (recomendado):**

```bash
docker compose up
```

| Serviço              | URL                    |
| -------------------- | ---------------------- |
| Frontend (SvelteKit) | http://localhost:5173  |
| Backend (Express)    | http://localhost:3000  |
| Supabase API         | http://localhost:54321 |
| Supabase Studio      | http://localhost:54323 |

**Opção B — npm workspaces (sem Docker):**

```bash
npm run dev       # inicia frontend e backend simultaneamente
```

<p align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:004d1a,50:800040,100:33001a&height=2&section=header"
    width="80%"
  />
</p>

## Estrutura do repositório

```
frontend/                    # SvelteKit app
├── src/
│   ├── routes/
│   │   ├── (vitrine)/       # páginas públicas — layout com Header + Footer
│   │   └── (admin)/         # painel admin — layout .admin-root (tema escuro)
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/          # shadcn-svelte (primitivos de UI)
│   │   │   ├── vitrine/     # componentes da vitrine pública
│   │   │   └── admin/       # componentes do painel admin
│   │   ├── i18n/            # pt.json + en.json (paraglide-js)
│   │   ├── stores/          # Svelte stores globais
│   │   ├── utils/           # helpers tipados
│   │   └── api/             # supabase.ts + backend.ts
│   └── app.css              # design tokens + reset global
├── svelte.config.js
├── vite.config.ts
└── package.json

backend/                     # Express.js API
├── src/
│   ├── routes/              # routers por feature
│   ├── middleware/          # auth, rate-limit, validation
│   └── lib/                 # helpers e clients reutilizáveis
└── package.json

supabase/                    # Supabase CLI
├── migrations/              # SQL versionado — 1 arquivo por issue de DB
├── seed.sql                 # dados iniciais para dev local
└── config.toml

gh-pages/                    # Documentação MkDocs Material
```

---

## Workflow de schema (Supabase)

```bash
supabase start                        # instância local
# escreva/edite a migration SQL
supabase db diff -f <descricao>       # gera arquivo em supabase/migrations/
supabase db reset                     # aplica tudo do zero (valida idempotência)
# abra PR com o arquivo gerado
```

<p align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:004d1a,50:800040,100:33001a&height=2&section=header"
    width="80%"
  />
</p>

## Documentação local (MkDocs)

```bash
cd gh-pages
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve    # acessa em http://127.0.0.1:8000
```

<p align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:004d1a,50:800040,100:33001a&height=2&section=header"
    width="80%"
  />
</p>

## Equipe

| Integrante                         | Papel FDD                        |
| ---------------------------------- | -------------------------------- |
| Lucas Andrade Zanetti              | PM + Chief Architect             |
| Leonardo Fachinello Bonetti        | Dev Manager + Backend/Infra      |
| Hugo Freitas Silva                 | Chief Programmer + Backend       |
| Heitor Macedo Ricardo              | Chief Programmer + Fullstack     |
| Philipe Amancio Reis Caetano       | Chief Programmer + Frontend/QA   |
| Camile Barbosa Gonzaga de Oliveira | Chief Architect + DevOps/QA/Docs |

<p align="center">
  <img 
    src="https://capsule-render.vercel.app/api?type=waving&color=0:004d1a,50:800040,100:33001a&height=100&section=footer&animation=fadeIn"
    width="100%"
  />
</p>
