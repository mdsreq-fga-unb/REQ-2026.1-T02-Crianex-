## Feature entregue

> Formato FDD: **[ação] [resultado] [objeto]**

`<!-- ex: Exibir vitrine de produtos SaaS para visitantes anônimos -->`

| Campo | Valor |
|---|---|
| **CP** | CP<!-- número --> — <!-- nome --> |
| **Iteração** | IT<!-- número --> |
| **Issue** | Closes #<!-- número --> |
| **Chief Programmer** | @<!-- usuário --> |

---

## O que foi implementado

<!-- Bullet points objetivos — sem narrar o óbvio do diff -->

- 
- 

---

## DoD — Definition of Done

- [ ] Critérios de aceite todos validados (Given/When/Then cobertos)
- [ ] Testes automatizados passando (unitários + integração onde há lógica de negócio)
- [ ] Lint sem erros (ESLint + Prettier)
- [ ] CI verde (build + testes + lint)
- [ ] Migration de banco aplicada em staging sem erros (se existir)
- [ ] Validação parcial registrada pelo cliente na issue (ou agendada para próxima validação formal)
- [ ] Documentação atualizada (README, ADR ou gh-pages) se necessário
- [ ] Sem vulnerabilidades críticas abertas no SAST/linting de segurança

---

## Checklist de revisão (para o revisor)

- [ ] Lógica de negócio correta segundo os critérios de aceitação da issue
- [ ] Sem código morto ou TODO não rastreado
- [ ] Nenhuma credencial, secret ou dado sensível exposto
- [ ] Nomes de variáveis/funções seguem convenção do projeto

---

## Evidências

<!-- Screenshots, vídeo curto, link de preview ou output de teste — o que for mais claro -->

---

## Notas para o revisor

<!-- Decisões de design, trade-offs, contexto que não está óbvio no diff -->
