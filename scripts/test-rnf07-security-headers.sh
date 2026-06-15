#!/usr/bin/env bash
# Teste RNF07 — Conformidade parcial com OWASP Top 10
# Verifica: headers de segurança (Helmet), rejeição de CORS, payload oversized,
# rate limit no endpoint de auth e ausência de informações sensíveis em erros.

BASE_URL="${1:-http://localhost:3000}"

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

PASSED=0; FAILED=0

check_header() {
  local label="$1" url="$2" header="$3" expected_pattern="$4"
  local value
  value=$(curl -sI "$url" | grep -i "^${header}:" | head -1 | sed 's/^[^:]*: //' | tr -d '\r')
  if echo "$value" | grep -qi "$expected_pattern"; then
    echo -e "${GREEN}✅ $label${NC}"
    echo -e "   ${YELLOW}→ $header: $value${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ $label${NC}"
    echo -e "   ${YELLOW}→ $header: '${value}' (esperado padrão: '$expected_pattern')${NC}"
    FAILED=$((FAILED + 1))
  fi
}

check_header_absent() {
  local label="$1" url="$2" header="$3"
  local value
  value=$(curl -sI "$url" | grep -i "^${header}:" | head -1)
  if [ -z "$value" ]; then
    echo -e "${GREEN}✅ $label (ausente — correto)${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ $label — header presente: $value${NC}"
    FAILED=$((FAILED + 1))
  fi
}

check_status() {
  local label="$1" expected="$2"
  shift 2
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$@")
  if [ "$status" -eq "$expected" ]; then
    echo -e "${GREEN}✅ $label → $status${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ $label → $status (esperado $expected)${NC}"
    FAILED=$((FAILED + 1))
  fi
}

echo "========================================"
echo " RNF07 — OWASP / Headers de Segurança"
echo " Alvo  : $BASE_URL"
echo "========================================"
echo ""

PROBE="$BASE_URL/health"

echo "── Headers de segurança (Helmet) ───────"
check_header "Content-Security-Policy presente"         "$PROBE" "Content-Security-Policy"    "default-src\|frame-ancestors"
check_header "X-Content-Type-Options: nosniff"          "$PROBE" "X-Content-Type-Options"      "nosniff"
check_header "Cross-Origin-Resource-Policy: same-site"  "$PROBE" "Cross-Origin-Resource-Policy" "same-site"
check_header "Referrer-Policy configurada"              "$PROBE" "Referrer-Policy"              "."
check_header_absent "X-Powered-By ausente (fingerprint)" "$PROBE" "X-Powered-By"

echo ""
echo "── CORS: rejeição de origem não autorizada ─"
CORS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Origin: https://attacker.evil.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS "$BASE_URL/api/public/contact")
# Sem Origin permitida, Express/CORS pode retornar 204 sem o header Allow-Origin
ALLOW_ORIGIN=$(curl -sI \
  -H "Origin: https://attacker.evil.com" \
  "$BASE_URL/api/products" | grep -i "Access-Control-Allow-Origin:" | tr -d '\r')
if echo "$ALLOW_ORIGIN" | grep -q "attacker.evil.com"; then
  echo -e "${RED}❌ CORS permite origem maliciosa: $ALLOW_ORIGIN${NC}"
  FAILED=$((FAILED + 1))
else
  echo -e "${GREEN}✅ CORS rejeita origem não autorizada${NC}"
  echo -e "   ${YELLOW}→ Access-Control-Allow-Origin: '${ALLOW_ORIGIN:-ausente}'${NC}"
  PASSED=$((PASSED + 1))
fi

echo ""
echo "── Payload oversized bloqueado (>100kb) ──"
BIG_PAYLOAD=$(head -c 110000 /dev/urandom | base64 | tr -d '\n')
check_status "POST com payload >100kb retorna 413" 413 \
  -X POST "$BASE_URL/api/public/contact" \
  -H "Content-Type: application/json" \
  -d "{\"mensagem\":\"$BIG_PAYLOAD\"}"

echo ""
echo "── Rate limit no endpoint de login ────"
FAKE_IP_AUTH="192.168.$((RANDOM % 256)).$((RANDOM % 256))"
AUTH_BLOCKED=false
for i in $(seq 1 12); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: $FAKE_IP_AUTH" \
    -d '{"email":"hacker@evil.com","password":"wrongpass"}')
  if [ "$STATUS" -eq 429 ]; then
    AUTH_BLOCKED=true
    echo -e "${GREEN}✅ Auth rate limit ativado na req $i/12 → 429${NC}"
    PASSED=$((PASSED + 1))
    break
  fi
done
if [ "$AUTH_BLOCKED" = false ]; then
  echo -e "${RED}❌ Auth rate limit não ativou em 12 requisições${NC}"
  FAILED=$((FAILED + 1))
fi

echo ""
echo "── Erro não expõe stack trace ──────────"
ERROR_BODY=$(curl -s -X POST "$BASE_URL/api/public/contact" \
  -H "Content-Type: application/json" \
  -d '{}')
if echo "$ERROR_BODY" | grep -qi "Error\|stack\|at .*\.ts\|node_modules"; then
  echo -e "${RED}❌ Resposta de erro expõe stack trace interno${NC}"
  echo "   $ERROR_BODY"
  FAILED=$((FAILED + 1))
else
  echo -e "${GREEN}✅ Erro retorna mensagem segura sem stack trace${NC}"
  echo -e "   ${YELLOW}→ $ERROR_BODY${NC}"
  PASSED=$((PASSED + 1))
fi

echo ""
echo "========================================"
echo -e " Resultado: ${GREEN}$PASSED passou(ram)${NC} / ${RED}$FAILED falhou(ram)${NC}"
echo "========================================"

if [ "$FAILED" -eq 0 ]; then
  echo -e " ${GREEN}RNF07 VALIDADO ✅${NC}"; exit 0
else
  echo -e " ${RED}RNF07 FALHOU ❌${NC}"; exit 1
fi
