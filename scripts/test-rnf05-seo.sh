#!/usr/bin/env bash
# Teste RNF05 — SEO da vitrine pública
# Verifica: <title>, <meta description>, Open Graph, robots.txt, sitemap.xml

FRONTEND_URL="${1:-http://localhost:5173}"

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

PASSED=0; FAILED=0

fetch_page() {
  curl -s -L --max-time 5 "$1"
}

check_meta() {
  local label="$1" url="$2" pattern="$3"
  local body
  body=$(fetch_page "$url")
  if echo "$body" | grep -qi "$pattern"; then
    echo -e "${GREEN}✅ $label${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ $label — padrão não encontrado: $pattern${NC}"
    FAILED=$((FAILED + 1))
  fi
}

check_status() {
  local label="$1" url="$2" expected="${3:-200}"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url")
  if [ "$status" -eq "$expected" ]; then
    echo -e "${GREEN}✅ $label → $status${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ $label → $status (esperado $expected)${NC}"
    FAILED=$((FAILED + 1))
  fi
}

check_content() {
  local label="$1" url="$2" pattern="$3"
  local body
  body=$(fetch_page "$url")
  if echo "$body" | grep -qi "$pattern"; then
    echo -e "${GREEN}✅ $label${NC}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ $label — conteúdo esperado ausente: $pattern${NC}"
    FAILED=$((FAILED + 1))
  fi
}

echo "========================================"
echo " RNF05 — SEO: Vitrine Pública"
echo " Alvo  : $FRONTEND_URL"
echo "========================================"
echo ""

echo "── Tags essenciais na homepage (/)"
check_meta "/ tem <title> não vazio"              "$FRONTEND_URL/"         "<title>[^<]\+</title>"
check_meta "/ tem <meta name=description>"        "$FRONTEND_URL/"         'meta name="description"\|meta name=.description'
check_meta "/ tem og:title (Open Graph)"          "$FRONTEND_URL/"         'property="og:title"\|property=.og:title'
check_meta "/ tem og:description (Open Graph)"    "$FRONTEND_URL/"         'property="og:description"'
check_meta "/ tem lang no <html>"                 "$FRONTEND_URL/"         '<html[^>]*lang='

echo ""
echo "── Tags em páginas internas"
check_meta "/produtos tem <title>"                "$FRONTEND_URL/produtos" "<title>[^<]\+</title>"
check_meta "/faq tem <title>"                     "$FRONTEND_URL/faq"      "<title>[^<]\+</title>"
check_meta "/sobre tem <title>"                   "$FRONTEND_URL/sobre"    "<title>[^<]\+</title>"
check_meta "/contato tem <title>"                 "$FRONTEND_URL/contato"  "<title>[^<]\+</title>"

echo ""
echo "── Arquivos de indexação"
check_status "robots.txt acessível"               "$FRONTEND_URL/robots.txt"
check_content "robots.txt contém Sitemap"         "$FRONTEND_URL/robots.txt"  "Sitemap\|sitemap"
check_content "robots.txt contém User-agent"      "$FRONTEND_URL/robots.txt"  "User-agent"
check_status  "sitemap.xml acessível"             "$FRONTEND_URL/sitemap.xml"
check_content "sitemap.xml contém <urlset>"       "$FRONTEND_URL/sitemap.xml" "<urlset\|<loc>"

echo ""
echo "── URLs amigáveis (sem extensão, sem query obrigatória)"
check_status "/produtos retorna 200 (URL limpa)"  "$FRONTEND_URL/produtos"
check_status "/faq retorna 200 (URL limpa)"       "$FRONTEND_URL/faq"
check_status "/sobre retorna 200 (URL limpa)"     "$FRONTEND_URL/sobre"
check_status "/contato retorna 200 (URL limpa)"   "$FRONTEND_URL/contato"

echo ""
echo "========================================"
echo -e " Resultado: ${GREEN}$PASSED passou(ram)${NC} / ${RED}$FAILED falhou(ram)${NC}"
echo "========================================"

if [ "$FAILED" -eq 0 ]; then
  echo -e " ${GREEN}RNF05 VALIDADO ✅${NC}"; exit 0
else
  echo -e " ${RED}RNF05 FALHOU ❌${NC}"; exit 1
fi
