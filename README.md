# REQ-2026.1-T02-Crianex

Repositório da disciplina **Requisitos de Software** — REQ-T02, 2026.1 · UnB  
Produto: **Crianex Hub** — plataforma administrativa centralizada e vitrine digital bilíngue para a Software House Crianex.

- **Cliente:** Crianex (CTO: Otávio Maya)
- **Metodologia:** FDD + Kanban
- **Docs publicadas:** [mdsreq-fga-unb.github.io/REQ-2026.1-T02-Crianex-](https://mdsreq-fga-unb.github.io/REQ-2026.1-T02-Crianex-)

---

## Rodar a documentação localmente

A documentação fica em `gh-pages/` e usa [MkDocs](https://www.mkdocs.org/) com o tema Cinder.

```bash
# 1. Entre na pasta da documentação
cd gh-pages

# 2. Crie e ative um virtualenv (recomendado, só na primeira vez)
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# 3. Instale as dependências (só na primeira vez ou após mudanças no requirements.txt)
pip install -r requirements.txt

# 4. Suba o servidor local com live-reload
mkdocs serve
```

Acesse em `http://127.0.0.1:8000`.  
Edições nos arquivos `.md` recarregam automaticamente.

Para gerar o site estático em `site/`:

```bash
mkdocs build
```

---

## Estrutura do repositório

```
gh-pages/
├── docs/               # Fontes da documentação (Markdown)
│   ├── visao/          # Documento de Visão (seções 1–6, 10)
│   ├── iteracoes/      # Registro por iteração (atas, evidências, cronograma)
│   ├── backlog/        # FDD Feature List + Requirements List + BDD
│   └── arquitetura/    # ADRs e diagramas
├── mkdocs.yml          # Configuração do MkDocs
└── requirements.txt    # Dependências Python
```

---

## Equipe

| Integrante | Papel FDD |
|------------|-----------|
| Lucas Andrade Zanetti | PM + Chief Architect |
| Leonardo Fachinello Bonetti | Dev Manager + Backend/Infra |
| Hugo Freitas Silva | Chief Programmer + Backend |
| Heitor Macedo Ricardo | Chief Programmer + Fullstack |
| Philipe Amancio Reis Caetano | Chief Programmer + Frontend/QA |
| Camile Barbosa Gonzaga de Oliveira | Chief Architect + DevOps/QA/Docs |
