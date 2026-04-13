# 6 — Interação Equipe-Cliente

---

## Histórico de Revisão

| Versão | Data | Descrição | Autor(es) |
|--------|------|-----------|-----------|
| 1.0 | 13/04/2026 | Criação da seção de interação equipe-cliente | Lucas A. Zanetti |

---

!!! warning "Em andamento"
    Esta seção está sendo desenvolvida pelo **Tech Lead (Lucas A. Zanetti)**. Prazo: **13/04/2026**.

---

## 6.1 Estrutura de Comunicação

A comunicação entre a equipe de desenvolvimento e o cliente (representado pelo Product Owner) segue uma estrutura organizada para garantir rastreabilidade e eficiência.

### Canais de Comunicação

| Canal | Frequência | Finalidade |
|-------|-----------|-----------|
| **Discord** | Diário | Comunicação assíncrona e síncrona, organizada por categorias |
| **Reuniões de Sprint Planning** | Quinzenal | Alinhamento do backlog e planejamento da próxima sprint |
| **Sprint Review** | Quinzenal | Demonstração das entregas ao PO e validação |
| **Sprint Retrospectiva** | Quinzenal | Melhoria de processos internos da equipe |
| **GitHub Issues / PR** | Contínuo | Rastreamento de tarefas, revisão de código |

### Categorias do Discord

| Categoria | Canais | Finalidade |
|-----------|--------|-----------|
| Backlogs | #backlog-discussão, #sprint-atual | Discussão sobre user stories e prioridades |
| Knowledge | #documentação, #referências | Compartilhamento de material técnico |
| Gravações | #reuniões-gravadas | Registro de reuniões para consulta posterior |
| Arquitetura | #decisões-técnicas, #adr | Discussão e registro de decisões de arquitetura |

---

## 6.2 Processo de Validação com o Cliente

O Product Owner atua como interface direta com os representantes da Crianex (Otávio / Vitor), sendo responsável por:

1. **Coletar requisitos** e transformá-los em user stories no backlog
2. **Priorizar** o backlog conforme o valor de negócio
3. **Validar entregas** ao final de cada sprint na Sprint Review
4. **Comunicar feedback** do cliente para a equipe técnica

### Fluxo de Validação

```
Cliente → PO → Backlog refinado → Sprint → Entrega → Sprint Review → Validação do Cliente
                                                                          ↓
                                                               Feedback incorporado
                                                               no próximo backlog
```

---

## 6.3 Gestão de Mudanças de Requisitos

Mudanças de requisitos são gerenciadas pelo PO em conjunto com o Tech Lead:

| Tipo de Mudança | Processo |
|-----------------|---------|
| Pequena ajuste em story existente | PO atualiza a issue no GitHub, comunica no Discord |
| Nova feature de média prioridade | PO cria nova issue, prioriza no backlog, entra no próximo sprint planning |
| Mudança de escopo significativa | Reunião de alinhamento com toda a equipe e aprovação do Tech Lead |
| Remoção de feature do escopo | PO fecha a issue com justificativa documentada |

---

## 6.4 Riscos de Comunicação

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| PO indisponível para validação | Média | Decisões urgentes podem ser tomadas pelo Tech Lead com registro documentado |
| Requisito mal interpretado pela equipe | Média | DoR rigorosa exige critérios de aceite antes de iniciar a implementação |
| Sobrecarga de membros com outras disciplinas | Alta | Distribuição equilibrada de tarefas e comunicação proativa de impedimentos |
| Falta de feedback do cliente em tempo hábil | Baixa | PO estabelece SLA de resposta com o cliente no início do projeto |
