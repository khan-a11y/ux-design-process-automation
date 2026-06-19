#!/usr/bin/env bash
# ====================================================================
#  UX×AX Studio — 스모크 테스트 (zero-install, 헤드리스 Chrome)
#  index.html + 7개 스튜디오의 모든 탭을 열어 #root가 실제로 렌더되는지
#  (빈 화면/초기화 오류가 없는지) 자동 확인합니다.
#
#  사용법:  bash smoke-test.sh
#  (Chrome 경로 자동 탐지. 안 되면:  CHROME="/path/to/chrome" bash smoke-test.sh)
#  종료코드 0 = 전부 통과, 1 = 실패 있음.
# ====================================================================
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"

# --- Chrome 탐지 ---
CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for p in \
    "/c/Program Files/Google/Chrome/Application/chrome.exe" \
    "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
    "${LOCALAPPDATA:-}/Google/Chrome/Application/chrome.exe" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "$(command -v google-chrome 2>/dev/null)" \
    "$(command -v google-chrome-stable 2>/dev/null)" \
    "$(command -v chromium 2>/dev/null)" \
    "$(command -v msedge 2>/dev/null)"; do
    if [ -n "$p" ] && [ -x "$p" ]; then CHROME="$p"; break; fi
  done
fi
[ -z "$CHROME" ] && { echo "❌ Chrome/Edge를 찾지 못했습니다. CHROME 환경변수로 실행 경로를 지정하세요."; exit 2; }

# --- 경로 → file URL (Windows는 cygpath -m 사용) ---
if command -v cygpath >/dev/null 2>&1; then BASEURL="file:///$(cygpath -m "$DIR")"; else BASEURL="file://$DIR"; fi

# 파일|탭해시(공백구분)
TARGETS=(
"index.html|"
"P1_리서치스튜디오.html|interview survey voc desk guide"
"P2_정의스튜디오.html|affinity journey hmw prd"
"P3_아이디에이션스튜디오.html|idea ia flow priority"
"P4_콘텐츠스튜디오.html|writing localize dummy"
"P5_디자인핸드오프스튜디오.html|wire token codespec changelog"
"P6_품질검증스튜디오.html|usability heuristic qa"
"P7_피드백운영스튜디오.html|feedback ab anomaly ops"
)

fail=0; total=0
check() {
  local file="$1" hash="$2" url label dom res
  url="$BASEURL/$file"; [ -n "$hash" ] && url="$url#$hash"
  label="$file${hash:+#$hash}"
  total=$((total+1))
  dom="$("$CHROME" --headless --disable-gpu --no-sandbox --no-first-run --virtual-time-budget=8000 --dump-dom "$url" 2>/dev/null)"
  res="$(printf '%s' "$dom" | python -c '
import sys,re
h=sys.stdin.read()
# 스크립트 소스를 제거한 "실제 렌더 DOM"만 평가 (스크립트 안 문자열 오탐 방지)
body=re.sub(r"<script[\s\S]*?</script>","",h,flags=re.I)
text=re.sub(r"<[^>]+>"," ",body)
bad=("초기화 오류" in body) or ("불러오는 중" in body) or (len(text.strip())<400)
print("FAIL" if bad else "OK")
' 2>/dev/null)"
  if [ "$res" = "OK" ]; then echo "  ✓ $label"; else echo "  ✗ $label  — 빈 화면/초기화 오류"; fail=$((fail+1)); fi
}

echo "▶ UX×AX Studio 스모크 테스트  (Chrome: $CHROME)"
for t in "${TARGETS[@]}"; do
  file="${t%%|*}"; hashes="${t#*|}"
  if [ -z "$hashes" ]; then check "$file" ""; else for h in $hashes; do check "$file" "$h"; done; fi
done
echo "────────────────────────────────"
echo "총 $total개 · 실패 $fail개"
if [ "$fail" -eq 0 ]; then echo "PASS ✅ — 모든 탭 정상 렌더"; exit 0; else echo "FAIL ❌ — 위 ✗ 항목을 수정하세요"; exit 1; fi
