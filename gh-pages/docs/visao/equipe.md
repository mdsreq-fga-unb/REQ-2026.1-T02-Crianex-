# 6. Interação Equipe-Cliente

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 11/04/2026 | Criação das seções 6.1 a 6.6 | Lucas A. Zanetti |
| 1.1 | 13/04/2026 | Revisão das seções 6.1 a 6.6 | Equipe Crianex |

---

## 6.1 Composição da Equipe

Esta seção descreve a composição da equipe de desenvolvimento, os canais e cerimônias de comunicação adotados e o processo formal de validação das entregas ao longo do projeto. Todas as decisões aqui registradas foram baseadas no mapeamento de perfil técnico dos integrantes, realizado via formulário estruturado no início do projeto.

![Equipe](images/responsabilidades.png)
<figure class="crianex-figure">
</figure>

---

## 6.2 Estrutura de Comunicação

A comunicação entre a equipe de desenvolvimento e o cliente segue uma estrutura organizada para garantir rastreabilidade e eficiência.

### Ferramentas de Comunicação

| Ferramenta | Tipo | Finalidade | Frequência |
|------------|------|-----------|-----------|
| **Discord** | Assíncrono + Síncrono | Comunicação do dia a dia, discussões técnicas, compartilhamento de materiais | Diário |
| **GitHub Issues** | Assíncrono | Registro de user stories, bugs, tarefas e decisões técnicas | Contínuo |
| **GitHub Pull Requests** | Assíncrono | Code review, aprovação QA, rastreamento de entregas | Por entrega |
| **GitHub Projects** | Assíncrono | Board Scrumban — visibilidade do fluxo de trabalho da sprint | Contínuo |
| **Google Meet** | Síncrono | Cerimônias de sprint (Planning, Review, Retrospectiva) | Quinzenal |
| **Supabase Dashboard** | Assíncrono | Monitoramento do banco de dados e logs de produção | Sob demanda |

---

## 6.3 Cadência de Cerimônias

| Cerimônia | Frequência | Participantes | Duração | Objetivo |
|-----------|-----------|---------------|---------|---------|
| **Sprint Planning** | Quinzenal (início de sprint) | Toda a equipe + PO | 1h | Priorizar e detalhar as user stories da próxima sprint |
| **Daily Stand-up** | Diário (assíncrono via Discord) | Toda a equipe | 15 min | O que foi feito, o que será feito, impedimentos |
| **Sprint Review** | Quinzenal (fim de sprint) | Toda a equipe + PO + cliente | 1h | Demonstrar as entregas e validar com o cliente |
| **Sprint Retrospectiva** | Quinzenal (fim de sprint) | Equipe de desenvolvimento | 45 min | Identificar melhorias de processo para o próximo sprint |
| **Backlog Refinement** | Semanal | PO + Tech Lead | 30 min | É um processo contínuo no Scrum, no qual o Dono do Produto e a Equipe de Desenvolvimento colaboram para revisar, atualizar e esclarecer itens no Backlog do Produto, garantindo que estejam prontos para as próximas sprints.|

---

## 6.4 Processo de Validação com o Cliente

O Product Owner atua como interface direta com os representantes da Crianex (Otávio / Vitor), sendo responsável por:

1. **Coletar requisitos** e transformá-los em user stories no backlog
2. **Priorizar** o backlog conforme o valor de negócio
3. **Validar entregas** ao final de cada sprint na Sprint Review
4. **Comunicar feedback** do cliente para a equipe técnica

### Critérios de Prontidão e Conclusão

| Critério | Verificado por | Quando |
|----------|---------------|--------|
| Story com critérios de aceite claros (DoR) | PO + Tech Lead | Sprint Planning |
| Implementação conforme critérios de aceite (DoD) | QA | Durante a sprint |
| Aprovação de PR por QA (DoD) | QA | Antes do merge |
| Validação funcional pelo PO (DoD) | PO | Sprint Review |

### Definition of Ready (DoR)

Uma user story está **pronta para entrar no sprint** quando:

- [ ] Está escrita no formato "Como [perfil], quero [ação], para [benefício]"
- [ ] Possui critérios de aceite claros e testáveis
- [ ] Foi priorizada pelo PO no backlog
- [ ] Não possui dependências bloqueantes não resolvidas
- [ ] Foi estimada pela equipe (pontos de esforço)
- [ ] O mockup ou fluxo de tela está disponível (quando aplicável)

### Definition of Done (DoD)

Uma user story está **concluída** quando:

- [ ] O código foi implementado conforme os critérios de aceite
- [ ] Testes unitários e/ou de integração foram escritos e passam
- [ ] O Pull Request foi revisado e aprovado pelo QA
- [ ] O código foi mergeado na branch principal (via PR aprovado)
- [ ] A funcionalidade foi validada pelo PO na Sprint Review
- [ ] A documentação relevante foi atualizada (quando aplicável)
- [ ] Não há regressões identificadas em funcionalidades existentes

### Fluxo de Validação

```
Cliente → PO → Backlog refinado → Sprint → Entrega → Sprint Review → Validação do Cliente
                                                                          ↓
                                                               Feedback incorporado
                                                               no próximo backlog
```

---

## 6.5 Gestão de Mudanças de Requisitos

Mudanças de requisitos são gerenciadas pelo PO em conjunto com o Tech Lead:

| Tipo de Mudança | Processo |
|-----------------|---------|
| Pequeno ajuste em story existente | PO atualiza a issue no GitHub, comunica no Discord |
| Nova feature de média prioridade | PO cria nova issue, prioriza no backlog, entra no próximo sprint planning |
| Mudança de escopo significativa | Reunião de alinhamento com toda a equipe e aprovação do Tech Lead |
| Remoção de feature do escopo | PO fecha a issue com justificativa documentada |

---

## 6.6 Riscos de Comunicação

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| PO indisponível para validação | Média | Alto | Decisões urgentes podem ser tomadas pelo Tech Lead com registro documentado; PO valida retroativamente na próxima cerimônia |
| Requisito mal interpretado pela equipe | Média | Médio | DoR rigorosa exige critérios de aceite antes de iniciar a implementação; refinamento semanal de backlog |
| Sobrecarga de membros com outras disciplinas | Alta | Médio | Distribuição equilibrada de tarefas e comunicação proativa de impedimentos no daily stand-up |
| Falta de feedback do cliente em tempo hábil | Baixa | Alto | PO estabelece SLA de resposta com o cliente no início do projeto; decisões não bloqueantes são tomadas pelo PO |
| Divergência entre expectativa do cliente e entrega | Baixa | Alto | Sprint Reviews regulares com demonstração ao vivo garantem alinhamento contínuo |
