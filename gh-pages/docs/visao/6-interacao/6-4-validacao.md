# 6.4 Processo de Validação com o Cliente

O Product Owner atua como interface direta com os representantes da Crianex (Otávio / Vitor), sendo responsável por:

1. **Coletar requisitos** e transformá-los em user stories no backlog
2. **Priorizar** o backlog conforme o valor de negócio
3. **Validar entregas** ao final de cada sprint na Sprint Review
4. **Comunicar feedback** do cliente para a equipe técnica

---

### Critérios de Prontidão e Conclusão

| Critério | Verificado por | Quando |
|----------|---------------|--------|
| Story com critérios de aceite claros (DoR) | PO + Tech Lead | Sprint Planning |
| Implementação conforme critérios de aceite (DoD) | QA | Durante a sprint |
| Aprovação de PR por QA (DoD) | QA | Antes do merge |
| Validação funcional pelo PO (DoD) | PO | Sprint Review |

---


### Definition of Ready (DoR)

Uma user story está **pronta para entrar no sprint** quando:

- [ ] Está escrita no formato "Como [perfil], quero [ação], para [benefício]"
- [ ] Possui critérios de aceite claros e testáveis
- [ ] Foi priorizada pelo PO no backlog
- [ ] Não possui dependências bloqueantes não resolvidas
- [ ] Foi estimada pela equipe (pontos de esforço)
- [ ] O mockup ou fluxo de tela está disponível (quando aplicável)

---

### Definition of Done (DoD)

Uma user story está **concluída** quando:

- [ ] O código foi implementado conforme os critérios de aceite
- [ ] Testes unitários e/ou de integração foram escritos e passam
- [ ] O Pull Request foi revisado e aprovado pelo QA
- [ ] O código foi mergeado na branch principal (via PR aprovado)
- [ ] A funcionalidade foi validada pelo PO na Sprint Review
- [ ] A documentação relevante foi atualizada (quando aplicável)
- [ ] Não há regressões identificadas em funcionalidades existentes

---

### Fluxo de Validação

```
Cliente → PO → Backlog refinado → Sprint → Entrega → Sprint Review → Validação do Cliente
                                                                          ↓
                                                               Feedback incorporado
                                                               no próximo backlog
```
