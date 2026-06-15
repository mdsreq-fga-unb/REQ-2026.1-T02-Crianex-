#!/usr/bin/env bash
# Teste RNF04 — Renderização server-side (SSR) da vitrine pública
# SvelteKit SSR deve retornar HTML completo com conteúdo real —
# não uma casca SPA com apenas bundle JS.

FRONTEND_URL="${1:-http://localhost:5173}"

GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'

PASSED=0; FAILED=0

check_ssr() {
  local label="$1" path="$2" pattern="$3"
  local url="$FRONTEND_URL$path"
  local body
  body=$(curl -s -L --max-time 5 "$url")
  local status=$?

  if [ $status -ne 0 ]; then
    echo -e "${RED}❌ $label — curl falhou (timeout ou conexão recusada)${NC}"
    FAILED=$((FAILED + 1))
    return
  fi

  # Verifica que é HTML real (não JSON de erro ou página em branco)
  if ! echo "$body" | grep -qi "<!DOCTYPE html"; then
    echo -e "${RED}❌ $label — resposta não é HTML${NC}"
    FAILED=$((FAILED + 1))
    return
  fi

  # Verifica que o padrão de conteúdo esperado está no HTML
  if echo "$body" | grep -qi "$pattern"; then
    local size
    size=$(echo "$body" | wc -c)
    echo -e "${GREEN}✅ $label — SSR confirmado (${size} bytes, padrão encontrado: '$pattern')${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ $label — padrão '$pattern' ausente no HTML (possível SPA client-only)${NC}"
    FAILED=$((FAILED + 1))
  fi
}

check_no_redirect_to_login() {
  local label="$1" path="$2"
  local url="$FRONTEND_URL$path"
  local final_url
  final_url=$(curl -s -L -o /dev/null -w "%{url_effective}" --max-time 5 "$url")

  if echo "$final_url" | grep -qi "login"; then
    echo -e "${RED}❌ $label — redirecionou para login (rota pública exige auth)${NC}"
    FAILED=$((FAILED + 1))
  else
    echo -e "${GREEN}✅ $label — acessível sem autenticação (URL final: $final_url)${NC}"
    PASSED=$((PASSED + 1))
  fi
}

echo "========================================"
echo " RNF04 — SSR: Vitrine Pública"
echo " Alvo  : $FRONTEND_URL"
echo "========================================"
echo ""

echo "── Conteúdo renderizado no servidor ────"
check_ssr "/ (homepage)"           "/"          "crianex\|soluç\|software\|saas"
check_ssr "/produtos (listagem)"   "/produtos"  "produto\|saas\|software\|portfólio"
check_ssr "/faq (base de conhec.)" "/faq"       "faq\|pergunta\|artigo\|FAQ"
check_ssr "/sobre (institucional)" "/sobre"     "crianex\|empresa\|sobre\|about"
check_ssr "/contato (formulário)"  "/contato"   "contato\|contact\|nome\|email"
check_ssr "/privacidade (LGPD)"    "/privacidade" "privacidade\|LGPD\|dados\|política"
check_ssr "/cookies"               "/cookies"   "cookie\|consent\|preferência"

echo ""
echo "── Sem redirecionamento para /login ────"
check_no_redirect_to_login "/ pública"         "/"
check_no_redirect_to_login "/produtos pública" "/produtos"
check_no_redirect_to_login "/faq pública"      "/faq"
check_no_redirect_to_login "/sobre pública"    "/sobre"
check_no_redirect_to_login "/contato pública"  "/contato"

echo ""
echo "========================================"
echo -e " Resultado: ${GREEN}$PASSED passou(ram)${NC} / ${RED}$FAILED falhou(ram)${NC}"
echo "========================================"

if [ "$FAILED" -eq 0 ]; then
  echo -e " ${GREEN}RNF04 VALIDADO ✅${NC}"; exit 0
else
  echo -e " ${RED}RNF04 FALHOU ❌${NC}"; exit 1
fi
