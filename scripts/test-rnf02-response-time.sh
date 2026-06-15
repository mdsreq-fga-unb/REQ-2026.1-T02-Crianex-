#!/usr/bin/env bash
# Teste RNF02 — Tempo de resposta da vitrine pública ≤ 2s em p95
# Realiza 20 requisições por endpoint e calcula o percentil 95.

BASE_URL="${1:-http://localhost:3000}"
SAMPLES=20
THRESHOLD_MS=2000

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

PASSED=0; FAILED=0

p95() {
  # Recebe lista de tempos em ms (um por linha), retorna p95
  local sorted
  sorted=$(echo "$1" | sort -n)
  local count
  count=$(echo "$sorted" | wc -l)
  local idx=$(( (count * 95 + 99) / 100 ))
  echo "$sorted" | sed -n "${idx}p"
}

measure_endpoint() {
  local label="$1" url="$2"
  local times=""
  local errors=0

  printf "  Testando %-45s" "$label"

  for _ in $(seq 1 $SAMPLES); do
    local result
    result=$(curl -s -o /dev/null -w "%{http_code} %{time_total}" "$url")
    local status time_s
    status=$(echo "$result" | awk '{print $1}')
    time_s=$(echo "$result" | awk '{print $2}')
    local time_ms
    time_ms=$(echo "$time_s * 1000" | bc | cut -d. -f1)

    if [ "$status" -ne 200 ]; then
      errors=$((errors + 1))
    fi
    times="${times}${time_ms}
"
  done

  local p95_val
  p95_val=$(p95 "$times")
  local min max
  min=$(echo "$times" | sort -n | head -1)
  max=$(echo "$times" | sort -n | tail -1)

  if [ "$errors" -gt 0 ]; then
    echo -e "${RED}❌ $errors erros HTTP${NC}"
    FAILED=$((FAILED + 1))
  elif [ "$p95_val" -le "$THRESHOLD_MS" ]; then
    echo -e "${GREEN}✅ p95=${p95_val}ms  min=${min}ms  max=${max}ms${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ p95=${p95_val}ms > ${THRESHOLD_MS}ms  min=${min}ms  max=${max}ms${NC}"
    FAILED=$((FAILED + 1))
  fi
}

echo "========================================"
echo " RNF02 — Tempo de Resposta: Rotas Públicas"
echo " Alvo    : $BASE_URL"
echo " Amostras: $SAMPLES por endpoint"
echo " Limite  : p95 ≤ ${THRESHOLD_MS}ms"
echo "========================================"
echo ""

measure_endpoint "GET /health"                    "$BASE_URL/health"
measure_endpoint "GET /api/products"              "$BASE_URL/api/products"
measure_endpoint "GET /api/public/faq/articles"   "$BASE_URL/api/public/faq/articles"

echo ""
echo "========================================"
echo -e " Resultado: ${GREEN}$PASSED passou(ram)${NC} / ${RED}$FAILED falhou(ram)${NC}"
echo "========================================"

if [ "$FAILED" -eq 0 ]; then
  echo -e " ${GREEN}RNF02 VALIDADO ✅${NC}"; exit 0
else
  echo -e " ${RED}RNF02 FALHOU ❌${NC}"; exit 1
fi
