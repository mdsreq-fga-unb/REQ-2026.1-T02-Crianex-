#!/usr/bin/env bash
# Teste RNF03 — Tempo de resposta da área administrativa ≤ 2s em p95
# Uso: ./test-rnf03-admin-response.sh [BASE_URL] [EMAIL] [PASSWORD]
# Ou via variáveis de ambiente: ADMIN_EMAIL / ADMIN_PASSWORD

BASE_URL="${1:-http://localhost:3000}"
EMAIL="${2:-${ADMIN_EMAIL:-}}"
PASSWORD="${3:-${ADMIN_PASSWORD:-}}"
SAMPLES=20
THRESHOLD_MS=2000

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

PASSED=0; FAILED=0

if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  echo -e "${RED}Erro: email e senha obrigatórios.${NC}"
  echo "  ./test-rnf03-admin-response.sh http://localhost:3000 admin@email.com senha"
  echo "  ou: ADMIN_EMAIL=... ADMIN_PASSWORD=... ./test-rnf03-admin-response.sh"
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo -e "${RED}Erro: jq é necessário (apt install jq / brew install jq).${NC}"
  exit 1
fi

echo "========================================"
echo " RNF03 — Tempo de Resposta: Área Admin"
echo " Alvo    : $BASE_URL"
echo " Amostras: $SAMPLES por endpoint"
echo " Limite  : p95 ≤ ${THRESHOLD_MS}ms"
echo "========================================"
echo ""

echo -n " Autenticando como $EMAIL... "
LOGIN_RESP=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESP" | jq -r '.accessToken // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login falhou.${NC}"
  echo "   Resposta: $LOGIN_RESP"
  exit 1
fi
echo -e "${GREEN}OK${NC}"
echo ""

p95() {
  local sorted
  sorted=$(echo "$1" | sort -n)
  local count
  count=$(echo "$sorted" | wc -l)
  local idx=$(( (count * 95 + 99) / 100 ))
  echo "$sorted" | sed -n "${idx}p"
}

measure_admin() {
  local label="$1" url="$2"
  local times=""
  local errors=0

  printf "  Testando %-50s" "$label"

  for _ in $(seq 1 $SAMPLES); do
    local result
    result=$(curl -s -o /dev/null -w "%{http_code} %{time_total}" \
      -H "Authorization: Bearer $TOKEN" "$url")
    local status time_s
    status=$(echo "$result" | awk '{print $1}')
    time_s=$(echo "$result" | awk '{print $2}')
    local time_ms
    time_ms=$(awk "BEGIN {printf \"%d\", $time_s * 1000}")

    if [ "$status" -ne 200 ]; then errors=$((errors + 1)); fi
    times="${times}${time_ms}
"
  done

  local p95_val min max
  p95_val=$(p95 "$times")
  min=$(echo "$times" | sort -n | head -1)
  max=$(echo "$times" | sort -n | tail -1)

  if [ "$errors" -gt 0 ]; then
    echo -e "${RED}❌ $errors erros HTTP${NC}"
    FAILED=$((FAILED + 1))
  elif [ "$p95_val" -le "$THRESHOLD_MS" ]; then
    echo -e "${GREEN}✅ p95=${p95_val}ms  min=${min}ms  max=${max}ms${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ p95=${p95_val}ms > ${THRESHOLD_MS}ms${NC}"
    FAILED=$((FAILED + 1))
  fi
}

measure_admin "GET /api/admin/products"           "$BASE_URL/api/admin/products"
measure_admin "GET /api/admin/members"            "$BASE_URL/api/admin/members"
measure_admin "GET /api/admin/faq/categories"     "$BASE_URL/api/admin/faq/categories"
measure_admin "GET /api/admin/faq/articles"       "$BASE_URL/api/admin/faq/articles"
measure_admin "GET /api/profile/me"               "$BASE_URL/api/profile/me"

echo ""
echo "========================================"
echo -e " Resultado: ${GREEN}$PASSED passou(ram)${NC} / ${RED}$FAILED falhou(ram)${NC}"
echo "========================================"

if [ "$FAILED" -eq 0 ]; then
  echo -e " ${GREEN}RNF03 VALIDADO ✅${NC}"; exit 0
else
  echo -e " ${RED}RNF03 FALHOU ❌${NC}"; exit 1
fi
