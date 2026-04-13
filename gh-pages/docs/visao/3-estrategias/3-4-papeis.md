# 3.4 Composição da Equipe

A equipe de desenvolvimento é composta por seis integrantes, com responsabilidades e áreas de atuação definidas a partir de um formulário de mapeamento de perfil técnico realizado no início do projeto. O **Tech Lead** (Lucas Zanetti) possui disponibilidade de 10–11h/semana e experiência em ambas as camadas da aplicação, sendo o ponto de contato técnico com o cliente. Os demais integrantes têm disponibilidade variada (de até 4h até 8h semanais), o que impacta diretamente na granularidade das tarefas atribuídas em cada sprint.

---

## Tabela de Papéis

| Papel / Função | Integrante | Responsabilidades Técnicas | Principais Entregas | Observações |
|---|---|---|---|---|
| **Tech Lead / Dev Fullstack** | Lucas Andrade Zanetti | Decisões de arquitetura e stack. Definição de padrões de código e condução de code reviews. Coordenação técnica entre frontend e backend. Desenvolvimento de features críticas em ambas as camadas (SvelteKit + Express.js + TypeScript). Garantia de integridade das políticas RLS no Supabase. Ponto de contato técnico com o cliente (Otavio / Vitor). | Estrutura do repositório e padrões de projeto. Features transversais de alta complexidade. Decisões de arquitetura documentadas (ADRs). Revisão e aceite de todos os PRs antes do merge em main. | Tech Lead da equipe. Atua em frontend e backend conforme demanda da sprint. Responsável pela coerência técnica geral do projeto. Disponível 10–11h/sem. |
| **Dev Backend / Infra** | Leonardo Fachinello Bonetti | Desenvolvimento das APIs REST com Express.js + TypeScript. Modelagem do banco PostgreSQL, migrations e seeds. Configuração do pipeline CI/CD (GitHub Actions). Deploy e configuração dos manifests no cluster Kubernetes da Crianex. Implementação e auditoria de políticas RLS no Supabase. | Módulos de API: projetos, pessoas, vitrine. Schema do banco + migrations versionadas. Pipelines CI/CD funcionais. Manifests Kubernetes para staging e produção. | Perfil técnico mais amplo entre os respondentes. Disponível 5–8h/sem. Assume infra pelo perfil mais adequado da equipe. |
| **Dev Backend** | Hugo Freitas Silva | Desenvolvimento de rotas e controllers Express.js + TypeScript. Escrita de queries SQL e definição de índices no PostgreSQL. Implementação de políticas RLS em conjunto com Leonardo. Integração de regras de negócio no lado do servidor. | Módulos de API: autenticação, controle de acesso. Políticas RLS das tabelas de dados sensíveis. Testes unitários dos serviços de backend. | Restrição explícita: não atuar no frontend. Disponível até 4h/sem — tarefas devem ser bem delimitadas e sem dependências externas não resolvidas. |
| **Dev Fullstack** | Heitor Macedo Ricardo | Desenvolvimento de features end-to-end (SvelteKit + integração Supabase client SDK). Cobertura de testes automatizados (unitários e integração com Vitest/Jest). Contribuição na documentação técnica de endpoints e contratos. Suporte à integração direta front–Supabase nos fluxos de menor latência. | Features end-to-end do módulo de vitrine digital. Suite de testes automatizados. Documentação de contratos de API e schemas. | Disponível 5–8h/sem, sem restrições declaradas. Perfil versátil — atua como suporte à integração entre squads e responsável principal pelos testes. |
| **Dev Frontend / QA** | Philipe Amancio Reis Caetano | Componentização da interface com SvelteKit + Shadcn/ui. Integração do frontend com APIs e Supabase client SDK. Responsividade, acessibilidade e consistência visual dos componentes. Suporte a testes de interface. Code reviews principalmente de frontend e integração. | Componentes reutilizáveis com Shadcn/ui. Páginas do painel de gestão de projetos e pessoas. Páginas públicas da vitrine digital. Revisar e trazer feedbacks de PR do frontend e integração. | Preferência declarada por frontend e fullstack. Disponível até 4h/sem — features devem ser bem específicas para manter a cadência. |
| **DevOps / QA / Documentação** | Camile Barbosa Gonzaga de Oliveira | Suporte ao deploy no cluster Kubernetes via API de deploy da Crianex. Escrita e manutenção da documentação técnica (MkDocs / GitHub Pages). Execução e registro de testes de qualidade por sprint. Monitoramento pós-sprint e triagem de issues. | Documentação de processo e deploy. GitHub Pages atualizado a cada sprint. Relatórios de QA e registro de bugs. | Preferência por infra, documentação e testes. Restrição: reuniões somente até 22h de seg–sáb. Disponível até 4h/sem. |

---

## Fluxo de Trabalho

O fluxo de trabalho da equipe segue a cadência do FDD com Scrumban, com cada feature percorrendo as etapas abaixo antes de ser integrada ao produto:

```
PO (backlog) → Dev Team (branch dedicada) → QA/Review (Pull Request) → Tech Lead (aceite) → merge em main
```

Cada feature é desenvolvida em uma **branch dedicada** com nome no padrão `feature/<id>-<descricao>`, integrada via Pull Request com aprovação mínima de 1 revisor. O uso de **Conventional Commits** é obrigatório para garantir rastreabilidade no histórico do repositório.

---
