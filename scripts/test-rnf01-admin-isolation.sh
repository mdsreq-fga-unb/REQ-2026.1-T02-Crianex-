#!/usr/bin/env bash
# Teste RNF01 — Isolamento de acesso administrativo
# Todas as rotas /admin/* devem retornar 401 sem JWT válido.
# Com token inválido/expirado, deve retornar 401.

BASE_URL="${1:-http://localhost:3000}"

GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'

PASSED=0; FAILED=0

check() {
  local label="$1" expected="$2" url="$3" method="${4:-GET}" token="${5:-}"
  local args=(-s -o /dev/null -w "%{http_code}" -X "$method")
  [ -n "$token" ] && args+=(-H "Authorization: Bearer $token")
  local status
  status=$(curl "${args[@]}" "$url")
  if [ "$status" -eq "$expected" ]; then
    echo -e "${GREEN}✅ $label → $status${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ $label → $status (esperado $expected)${NC}"
    FAILED=$((FAILED + 1))
  fi
}

echo "========================================"
echo " RNF01 — Isolamento de Acesso Admin"
echo " Alvo  : $BASE_URL"
echo "========================================"
echo ""

echo "── Sem token ──────────────────────────"
check "GET /api/admin/products sem token"         401 "$BASE_URL/api/admin/products"
check "GET /api/admin/members sem token"          401 "$BASE_URL/api/admin/members"
check "GET /api/admin/faq/categories sem token"   401 "$BASE_URL/api/admin/faq/categories"
check "GET /api/admin/faq/articles sem token"     401 "$BASE_URL/api/admin/faq/articles"
check "GET /api/profile/me sem token"             401 "$BASE_URL/api/profile/me"
check "POST /api/admin/products sem token"        401 "$BASE_URL/api/admin/products" POST
check "DELETE /api/admin/products/fake sem token" 401 "$BASE_URL/api/admin/products/fake-id" DELETE

echo ""
echo "── Com token inválido ─────────────────"
FAKE_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoYWNrZXIiLCJyb2xlIjoib3duZXIifQ.invalidsig"
check "GET /api/admin/products token falso"       401 "$BASE_URL/api/admin/products" GET "$FAKE_TOKEN"
check "GET /api/admin/members token falso"        401 "$BASE_URL/api/admin/members"  GET "$FAKE_TOKEN"
check "GET /api/profile/me token falso"           401 "$BASE_URL/api/profile/me"     GET "$FAKE_TOKEN"

echo ""
echo "── Rotas públicas devem permanecer acessíveis ─"
check "GET /api/products (público — deve ser 200)" 200 "$BASE_URL/api/products"
check "GET /api/public/faq/articles (público)"     200 "$BASE_URL/api/public/faq/articles"
check "GET /health"                                200 "$BASE_URL/health"

echo ""
echo "========================================"
echo -e " Resultado: ${GREEN}$PASSED passou(ram)${NC} / ${RED}$FAILED falhou(ram)${NC}"
echo "========================================"

if [ "$FAILED" -eq 0 ]; then
  echo -e " ${GREEN}RNF01 VALIDADO ✅${NC}"; exit 0
else
  echo -e " ${RED}RNF01 FALHOU ❌${NC}"; exit 1
fi
