#!/usr/bin/env bash
# Teste RNF10 — Rate limiting do formulário de captação de leads
# Limite: 5 req / IP / 10 min → 6ª deve retornar 429
#
# Usa X-Forwarded-For com IP aleatório a cada execução para garantir
# janela limpa (o backend tem trust proxy: 1 e usa esse header como chave).

BASE_URL="${1:-http://localhost:3000}"
ENDPOINT="$BASE_URL/api/public/contact"
TOTAL=7

# IP aleatório no range 10.x.x.x para evitar colisão com runs anteriores
FAKE_IP="10.$((RANDOM % 256)).$((RANDOM % 256)).$((RANDOM % 256))"

PAYLOAD='{"nome":"Teste RNF10","email":"teste@rnf10.com","mensagem":"Validação de rate limit — mensagem automática de teste."}'

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================"
echo " RNF10 — Rate Limit: POST /api/public/contact"
echo " Alvo  : $ENDPOINT"
echo " IP    : $FAKE_IP (via X-Forwarded-For)"
echo " Limite: 5 req / IP / 10 min"
echo "========================================"
echo ""

PASSED=0
FAILED=0

for i in $(seq 1 $TOTAL); do
  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: $FAKE_IP" \
    -d "$PAYLOAD")

  BODY=$(echo "$RESPONSE" | head -n -1)
  STATUS=$(echo "$RESPONSE" | tail -n 1)

  if [ "$i" -le 5 ]; then
    EXPECTED=201
    LABEL="req $i/$TOTAL (deve passar — esperado $EXPECTED)"
    if [ "$STATUS" -eq "$EXPECTED" ]; then
      echo -e "${GREEN}✅ $LABEL → $STATUS${NC}"
      PASSED=$((PASSED + 1))
    else
      echo -e "${RED}❌ $LABEL → $STATUS | body: $BODY${NC}"
      FAILED=$((FAILED + 1))
    fi
  else
    EXPECTED=429
    LABEL="req $i/$TOTAL (deve ser bloqueada — esperado $EXPECTED)"
    if [ "$STATUS" -eq "$EXPECTED" ]; then
      echo -e "${GREEN}✅ $LABEL → $STATUS${NC}"
      echo -e "   ${YELLOW}Mensagem: $BODY${NC}"
      PASSED=$((PASSED + 1))
    else
      echo -e "${RED}❌ $LABEL → $STATUS | body: $BODY${NC}"
      FAILED=$((FAILED + 1))
    fi
  fi
done

echo ""
echo "========================================"
echo -e " Resultado: ${GREEN}$PASSED passou(ram)${NC} / ${RED}$FAILED falhou(ram)${NC}"
echo "========================================"

if [ "$FAILED" -eq 0 ]; then
  echo -e " ${GREEN}RNF10 VALIDADO ✅${NC}"
  exit 0
else
  echo -e " ${RED}RNF10 FALHOU ❌${NC}"
  exit 1
fi
