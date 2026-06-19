// ====================================================================
//  UX×AX Studio — 스모크 테스트 (Playwright)
//  index.html + 7개 스튜디오의 모든 탭을 헤드리스 브라우저로 열어
//  ① 콘솔/페이지 오류 ② 빈 화면(초기화 오류·로딩 잔존) 을 검사합니다.
//
//  최초 1회:  npm install   &&   npx playwright install chromium
//  실행:      node smoke-test.mjs        (종료코드 0=통과, 1=실패)
//  ※ 설치 없이 빠르게 보려면 bash smoke-test.sh 를 쓰세요.
// ====================================================================
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const TARGETS = [
  ["index.html", []],
  ["P1_리서치스튜디오.html", ["interview","survey","voc","desk","guide"]],
  ["P2_정의스튜디오.html", ["affinity","journey","hmw","prd"]],
  ["P3_아이디에이션스튜디오.html", ["idea","ia","flow","priority"]],
  ["P4_콘텐츠스튜디오.html", ["writing","localize","dummy"]],
  ["P5_디자인핸드오프스튜디오.html", ["wire","token","codespec","changelog"]],
  ["P6_품질검증스튜디오.html", ["usability","heuristic","qa"]],
  ["P7_피드백운영스튜디오.html", ["feedback","ab","anomaly","ops"]],
];

const browser = await chromium.launch();
let fail = 0, total = 0;
for (const [file, hashes] of TARGETS) {
  const tabs = hashes.length ? hashes : [""];
  for (const h of tabs) {
    total++;
    const label = file + (h ? "#" + h : "");
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(String(e)));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    let url = pathToFileURL(join(DIR, file)).href;
    if (h) url += "#" + h;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(900);
      const txt = (await page.evaluate(() => document.body.innerText || "")).trim();
      const hasError = txt.includes("초기화 오류");
      const stillLoading = txt.includes("불러오는 중");
      const tooEmpty = txt.length < 400;
      const ok = !hasError && !stillLoading && !tooEmpty && errors.length === 0;
      if (ok) console.log("  ✓ " + label);
      else { console.log("  ✗ " + label + (errors.length ? "  콘솔오류: " + errors[0].slice(0,120) : "  빈 화면/로딩 잔존")); fail++; }
    } catch (e) {
      console.log("  ✗ " + label + "  로드 실패: " + (e.message || e)); fail++;
    } finally { await page.close(); }
  }
}
await browser.close();
console.log("────────────────────────────────");
console.log(`총 ${total}개 · 실패 ${fail}개`);
if (fail === 0) { console.log("PASS ✅"); process.exit(0); }
else { console.log("FAIL ❌"); process.exit(1); }
