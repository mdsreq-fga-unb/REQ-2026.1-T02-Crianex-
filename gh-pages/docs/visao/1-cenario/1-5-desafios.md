# 1.5 Desafios

Os principais desafios técnicos e organizacionais identificados para o desenvolvimento do produto são:

| # | Desafio | Descrição |
|---|---------|-----------|
| 1 | **Interface** | Desenvolver uma interface que atenda simultaneamente dois perfis muito distintos — usuários internos técnicos (área administrativa) e visitantes externos B2B (vitrine) — mantendo usabilidade e clareza em ambos os contextos |
| 2 | **Integração de Gestão** | Integrar em tempo real os dados de gestão de projetos (status, alocação, logs) com a apresentação pública do portfólio, garantindo que as publicações na vitrine reflitam sempre o estado atual sem expor dados internos sensíveis |
| 3 | **Segurança** | Implementar controle de acesso granular (perfis: admin, gestor, colaborador) com Row Level Security no banco de dados, garantindo que cada usuário acesse apenas os dados pertinentes ao seu perfil, inclusive em acessos diretos ao Supabase pelo frontend |
