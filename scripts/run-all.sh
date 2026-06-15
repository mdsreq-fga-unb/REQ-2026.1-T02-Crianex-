#!/usr/bin/env bash
# Runner completo de RNFs — executa todos os scripts de validação
#
# Uso: ./run-all.sh [BACKEND_URL] [FRONTEND_URL]
# Para RNF03 (admin): ADMIN_EMAIL=... ADMIN_PASSWORD=... ./run-all.sh
#
# Exemplo:
#   ./run-all.sh http://localhost:3000 http://localhost:5173
#   ADMIN_EMAIL=admin@crianex.com ADMIN_PASSWORD=senha123 ./run-all.sh

BACKEND="${1:-http://localhost:3000}"
FRONTEND="${2:-http://localhost:5173}"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'

TOTAL_PASSED=0; TOTAL_FAILED=0
declare -a RESULTS

run_script() {
  local rnf="$1" script="$2"
  shift 2
  local args=("$@")

  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD} $rnf${NC}"
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  if [ ! -f "$DIR/$script" ]; then
    echo -e "${RED}Script não encontrado: $script${NC}"
    RESULTS+=("${RED}❌ $rnf — script ausente${NC}")
    TOTAL_FAILED=$((TOTAL_FAILED + 1))
    return
  fi

  bash "$DIR/$script" "${args[@]}"
  local exit_code=$?

  if [ $exit_code -eq 0 ]; then
    RESULTS+=("${GREEN}✅ $rnf${NC}")
    TOTAL_PASSED=$((TOTAL_PASSED + 1))
  else
    RESULTS+=("${RED}❌ $rnf${NC}")
    TOTAL_FAILED=$((TOTAL_FAILED + 1))
  fi
}

echo -e "${BOLD}"
echo "╔══════════════════════════════════════════╗"
echo "║   Crianex Hub — Validação de RNFs        ║"
echo "║   Backend : $BACKEND"
echo "║   Frontend: $FRONTEND"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

run_script "RNF01 — Isolamento de acesso admin"     "test-rnf01-admin-isolation.sh"  "$BACKEND"
run_script "RNF02 — Tempo de resposta público"      "test-rnf02-response-time.sh"    "$BACKEND"
run_script "RNF04 — SSR da vitrine pública"         "test-rnf04-ssr.sh"              "$FRONTEND"
run_script "RNF05 — SEO (meta tags, sitemap)"       "test-rnf05-seo.sh"              "$FRONTEND"
run_script "RNF07 — OWASP / Headers de segurança"   "test-rnf07-security-headers.sh" "$BACKEND"
run_script "RNF10 — Rate limit formulário de lead"  "test-rnf10-ratelimit.sh"        "$BACKEND"
run_script "RNF15 — Carga concorrente 50 req"       "test-rnf15-concurrent-load.sh"  "$BACKEND"

# RNF03 só roda se credenciais admin estiverem disponíveis
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  run_script "RNF03 — Tempo de resposta admin" "test-rnf03-admin-response.sh" \
    "$BACKEND" "$ADMIN_EMAIL" "$ADMIN_PASSWORD"
else
  echo ""
  echo -e "${YELLOW}⚠️  RNF03 pulado — defina ADMIN_EMAIL e ADMIN_PASSWORD para incluí-lo${NC}"
  RESULTS+=("${YELLOW}⚠️  RNF03 — Tempo resposta admin (pulado — sem credenciais)${NC}")
fi

echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD} SUMÁRIO FINAL${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
for result in "${RESULTS[@]}"; do
  echo -e " $result"
done
echo ""
echo -e " Total: ${GREEN}$TOTAL_PASSED validado(s)${NC} / ${RED}$TOTAL_FAILED falhou(ram)${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$TOTAL_FAILED" -eq 0 ]; then
  echo -e " ${GREEN}${BOLD}TODOS OS RNFs VALIDADOS ✅${NC}"
  exit 0
else
  echo -e " ${RED}${BOLD}$TOTAL_FAILED RNF(s) COM FALHA ❌${NC}"
  exit 1
fi
