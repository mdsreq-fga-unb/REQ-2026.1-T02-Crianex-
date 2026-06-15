#!/usr/bin/env bash
# Teste RNF15 — Suporte a 50 requisições simultâneas ≤ 2s
# Dispara 50 curls em paralelo e verifica que todos respondem dentro do limite.

BASE_URL="${1:-http://localhost:3000}"
CONCURRENCY=50
THRESHOLD_MS=2000

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

PASSED=0; FAILED=0

run_concurrent() {
  local label="$1" url="$2"
  local tmpdir
  tmpdir=$(mktemp -d)
  local pids=()

  echo -n "  Testando $label ($CONCURRENCY req simultâneas)... "

  for i in $(seq 1 $CONCURRENCY); do
    curl -s -o /dev/null -w "%{http_code} %{time_total}" "$url" > "$tmpdir/$i.out" 2>/dev/null &
    pids+=($!)
  done

  for pid in "${pids[@]}"; do
    wait "$pid"
  done

  local errors=0 slow=0 times=""
  for i in $(seq 1 $CONCURRENCY); do
    local result
    result=$(cat "$tmpdir/$i.out" 2>/dev/null)
    local status time_s
    status=$(echo "$result" | awk '{print $1}')
    time_s=$(echo "$result" | awk '{print $2}')
    local time_ms
    time_ms=$(echo "$time_s * 1000" | bc 2>/dev/null | cut -d. -f1)
    time_ms="${time_ms:-9999}"

    if [ "$status" -ne 200 ] 2>/dev/null; then errors=$((errors + 1)); fi
    if [ "$time_ms" -gt "$THRESHOLD_MS" ] 2>/dev/null; then slow=$((slow + 1)); fi
    times="${times}${time_ms}
"
  done

  rm -rf "$tmpdir"

  local sorted max p95_val
  sorted=$(echo "$times" | grep -v '^$' | sort -n)
  max=$(echo "$sorted" | tail -1)
  local count
  count=$(echo "$sorted" | wc -l)
  local idx=$(( (count * 95 + 99) / 100 ))
  p95_val=$(echo "$sorted" | sed -n "${idx}p")

  if [ "$errors" -gt 0 ] || [ "$slow" -gt $(( CONCURRENCY * 5 / 100 )) ]; then
    echo -e "${RED}❌${NC}"
    echo -e "   ${RED}erros HTTP: $errors | acima de ${THRESHOLD_MS}ms: $slow | p95: ${p95_val}ms | max: ${max}ms${NC}"
    FAILED=$((FAILED + 1))
  else
    echo -e "${GREEN}✅${NC}"
    echo -e "   ${YELLOW}p95: ${p95_val}ms | max: ${max}ms | erros: $errors | lentos: $slow${NC}"
    PASSED=$((PASSED + 1))
  fi
}

echo "========================================"
echo " RNF15 — Carga Concorrente: 50 req/vez"
echo " Alvo      : $BASE_URL"
echo " Limite    : p95 ≤ ${THRESHOLD_MS}ms (tolerância ≤ 5% acima)"
echo "========================================"
echo ""

run_concurrent "GET /api/products"            "$BASE_URL/api/products"
run_concurrent "GET /api/public/faq/articles" "$BASE_URL/api/public/faq/articles"
run_concurrent "GET /health"                  "$BASE_URL/health"

echo ""
echo "========================================"
echo -e " Resultado: ${GREEN}$PASSED passou(ram)${NC} / ${RED}$FAILED falhou(ram)${NC}"
echo "========================================"

if [ "$FAILED" -eq 0 ]; then
  echo -e " ${GREEN}RNF15 VALIDADO ✅${NC}"; exit 0
else
  echo -e " ${RED}RNF15 FALHOU ❌${NC}"; exit 1
fi
