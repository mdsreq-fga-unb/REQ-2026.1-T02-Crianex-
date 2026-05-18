---
name: "Feature (FDD)"
about: Nova feature ou User Story a ser desenvolvida no ciclo FDD
title: "[FEATURE] <ação> <resultado> <objeto>"
labels: feature
assignees: ""
---

## Identificação

| Campo | Valor |
|---|---|
| **CP** | CP<!-- número --> — <!-- nome da característica --> |
| **Iteração** | IT<!-- número --> |
| **Chief Programmer** | @<!-- usuário --> |
| **Class Owner** | @<!-- usuário --> |
| **Prioridade (IP)** | <!-- VB / ((CX + ES) / 2) = resultado --> |

---

## Feature FDD

> Formato obrigatório: **[ação] [resultado] [objeto]**

`<!-- ex: Exibir vitrine de produtos SaaS para visitantes anônimos -->`

---

## Critérios de Aceitação

> Formato: **Dado / Quando / Então**

- [ ] **Dado** que <!-- contexto --> **Quando** <!-- ação --> **Então** <!-- resultado esperado -->
- [ ] **Dado** que <!-- contexto --> **Quando** <!-- ação --> **Então** <!-- resultado esperado -->

---

## Estimativa

| Critério | Valor (1–5) |
|---|---|
| Valor de Negócio (VB) | |
| Complexidade Técnica (CX) | |
| Esforço de Implementação (ES) | |
| **IP = VB / ((CX+ES)/2)** | |

---

## DoR — Definition of Ready

> Marque todos antes de mover para *In Progress*

- [ ] US com critérios de aceitação no formato Dado/Quando/Então
- [ ] Feature estimada (VB, CX, ES preenchidos e IP calculado)
- [ ] Dependências identificadas; bloqueantes resolvidos
- [ ] Class Owner designado
- [ ] Protótipo revisado pelo cliente (se houver interface envolvida)
- [ ] Ao menos um critério de segurança identificado (RLS, validação de input, autenticação)

---

## Dependências

- Depende de: <!-- #issue ou CP -->
- Bloqueia: <!-- #issue ou CP -->

---

## Notas técnicas / Contexto adicional

<!-- ADRs relevantes, contratos de API, regras de negócio do cliente, etc. -->
