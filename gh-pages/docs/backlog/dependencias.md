# Mapa de Dependências

## Histórico de Revisão

| Versão | Data       | Descrição                                                                                        | Autor(es)        |
| ------ | ---------- | ------------------------------------------------------------------------------------------------ | ---------------- |
| 1.0    | 06/06/2026 | Segmentação por iteração; remoção do mapa completo de sub-issues; adição de placeholders IT2/IT3 | Lucas A. Zanetti |

---

Rastreabilidade visual entre as features de cada iteração. Use este mapa para:

- Identificar o caminho crítico antes de iniciar uma issue
- Verificar se todos os bloqueantes de uma issue estão fechados (DoR)
- Planejar o que pode ser paralelizado

---

## IT1 — Vitrine Pública (28/04 – 25/05)

Dependências entre as features comprometidas na IT1. Cada nó é a issue pai de especificação da feature. Vale ressaltar que essa depedência é lógica e não técnica, ou seja, não é necessário uma feature inteira completa para iniciar outras, mas algumas implementações dentro da issue devem ser implementados para liberar a proxima Feature. Esse bloqueio e dependências é especificado em cada sub-issue das features.

```mermaid
graph LR
    classDef feat fill:#7f3fe5,color:#fff,stroke:#5a2ba8,font-weight:bold
    classDef ext  fill:#e71f84,color:#fff,stroke:#c01870

    EXT(["⚙ i18n SvelteKit"]):::ext

    F09["#54 · F09\nAutenticar admins"]:::feat
    F10["#57 · F10\nPainel admin"]:::feat
    F11["#58 · F11\nMembros"]:::feat
    F12["#55 · F12\nProdutos SaaS"]:::feat
    F13["#56 · F13\nPublicar produto"]:::feat
    F14["#61 · F14\nFormulário contato"]:::feat
    F15["#63 · F15\nInfo institucional"]:::feat
    F16["#59 · F16\nCRUD FAQ"]:::feat
    F17["#60 · F17\nPublicar FAQ"]:::feat
    F18["#62 · F18\nAvaliação FAQ"]:::feat

    F09 --> F10
    F09 --> F11
    F09 --> F12
    F09 --> F16
    F10 --> F11
    F10 --> F16
    F11 --> F16
    F12 --> F13
    F12 --> F14
    F15 --> F14
    F16 --> F17
    F16 --> F18
    F17 --> F18
    EXT --> F15
```

---

## IT2 — Lead Capture (26/05 – 18/06)

> Mapa de dependências a ser preenchido ao início da iteração.

---

## IT3 — Núcleo Operacional (19/06 – 07/07)

> Mapa de dependências a ser preenchido ao início da iteração.

---

## Legenda

| Elemento        | Significado                                                 |
| --------------- | ----------------------------------------------------------- |
| Bloco roxo      | Feature pai — issue de especificação da CP                  |
| Bloco rosa      | Dependência externa ao backlog de issues                    |
| `→` seta sólida | Bloqueio parcial ou total — destino não inicia antes que uma implementação específica da issue seja implementada |
