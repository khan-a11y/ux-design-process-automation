# 260617_UX디자인프로세스_자동화 — 프로젝트 지침

> 전역·작업군 AGENTS.md(`~/.Codex`, `D:\AI_Project`) 규칙 상속됨 — 여기엔 이 프로젝트 고유만. `v0.1 · 제작일 2026-06-18`
> (음슴체·라이트모드·버전 B·P·시작게이트·HTML 빈화면 검수·자동화 권한은 상위 SSOT. 충돌 시: 사용자 최근 지시 > 전역 > 상위 > 이 파일.)

## 정체·목적
UX 표준 6단계(P1 리서치 → P6 핸드오프) + P7 운영의 **자동화 과제 29개**를, 흩어진 프롬프트 카드가 아니라 **연계성으로 묶은 7개 스튜디오 앱**으로 실제 자동화한 **무빌드 단일 HTML 도구 모음**. 전부 **무료**(유료 API 없이 동작). 진짜 목적 = **UX 프로세스 안 해본 초급 디자이너가 리더 없이 따라가며 배우는 자기설명형 흐름 도구**(+ 실무 MVP). LLM은 파이프라인의 한 단계(요약·분류·라벨)만 담당하고, 전사·임베딩 군집·통계·픽셀 diff·색대비는 **브라우저 안 코드**로 처리함.

## 기술스택·구조 (핵심 파일·진입점)
- **진입점:** `index.html`(허브 — 7개 스튜디오 카드 + P0 프로젝트 정의 폼. **바닐라 JS**, 허브 즉시 렌더).
- **스튜디오 7개:** `P1~P7_*.html`(각 React 18 + Tailwind + @babel/standalone, 전부 **CDN·단일 HTML·무빌드**). 본문 JSX는 `<script type="text/babel" data-presets="uxax-react">`에 인라인.
  - 파일↔탭: P1(interview·survey·voc·desk·guide) / P2(affinity·journey·hmw·prd) / P3(idea·ia·flow·priority) / P4(writing·localize·dummy) / P5(wire·token·codespec·changelog) / P6(usability·heuristic·qa) / P7(feedback·ab·anomaly·ops).
- **★ 7파일 컴포넌트 복제 구조** — Btn/Tabs/Guide/HelpCue/AudioCard 등이 각 HTML에 복제됨. "전역 일괄 변경"은 사실상 7곳 수정 = drift 위험. babel(JSX)이라 외부 파일로 못 뺌.
  - **완화책 `common.js`** — 평문 공통 로직만 `window.UXAX` 네임스페이스로 추출. babel 스크립트보다 먼저 로드. **기존 전역명(WS_KEY·load·save 등) 재선언 금지** — 전부 `UXAX.*`로만 노출(const 중복선언 SyntaxError 회피). JSX 컴포넌트는 외부화 불가 → 파일별 유지·표준화.
- **데이터모델 = 프로젝트 한 권(dossier):** `localStorage["uxax_project_v1"]` = `{brief, slots:{"P1.interview":{data,md,meta}…}, mentorLog}`. 슬롯 = 구조화 data + 렌더 md 둘 다. API: `UXAX.loadProject/saveProject/setBrief/getBrief/setSlot/getSlot/listSlots/mentorAdd/pickModel`.
- **레거시 공존(마이그레이션 유지):** `uxax_workspace_v1`(평문 MD 공유 보관함, 7앱 공유·300건 상한), `uxax_project_brief_v1`(구 P0 위저드 — common.js가 dossier로 1회 마이그레이션).
- **AI 엔진 4백엔드:** `localStorage["uxax_studio_settings_v1"]` 전역 공유. 브라우저AI(webllm·WebGPU) / 로컬 Ollama / 수동복붙(기본·무료) / Anthropic API(유료). 추상화 함수 `runLLM(settings,opts)`. 작업별 모델 라우팅 `UXAX.pickModel`(전사=whisper large-v3-turbo, 한국어 생성=상업자유 Qwen(qwen2.5:3b) 우선·EXAONE는 비상업/NC→내부전용/API는 sonnet).
- **비밀키:** `config.js`(gitignore 대상, `window.UXAX_CONFIG.anthropicApiKey`)에만. `config.example.js`만 공유. 자동 갱신 문서에 평문 키 금지.

## 빌드·실행·검증 (실제 명령)
- **빌드 없음.** 실행 = `index.html` 더블클릭(`file://`). 무거운 기능(전사 등) 막히면 `serve.bat`(로컬 HTTP 서버)로. 로컬 Ollama는 `start-ollama.bat`.
- **검증(완료 전 필수, 코드만 보고 판단 금지):**
  - 무설치: `bash smoke-test.sh` — 헤드리스 Chrome으로 index+7앱 **28탭** `#root` 실렌더 검사(빈 화면/초기화 오류/콘솔에러). 종료코드 0=통과. Chrome 자동탐지, 안 되면 `CHROME=… bash smoke-test.sh`.
  - Playwright: `npm run test:install`(1회) 후 `npm test`(=`node smoke-test.mjs`). 클릭·콘솔·스크린샷 실검증은 webapp-testing(Playwright) 사용 — **헤드리스 dump-dom 추측 금지.**
  - 판정선: 스크립트 제거 후 실제 렌더 텍스트<400자 또는 "초기화 오류"/"불러오는 중" 잔존 → FAIL.
- 탭/스튜디오 추가 시 **smoke-test.sh·smoke-test.mjs의 TARGETS 양쪽에** 해시/파일 반영(안 하면 검사 누락).

## 고유 제약 (이 프로젝트만 — 반드시)
- **`file://` 자체완결.** 외부 로컬 파일 동적 fetch 금지(JSX를 babel이 fetch하면 CORS로 빈 화면). CDN(http/https)만 OK. 데이터·JSX는 인라인.
- **babel classic runtime 강제 유지** — 각 HTML 상단 `Babel.registerPreset("uxax-react",{presets:[[react,{runtime:"classic"}]]})`, 본문은 `data-presets="uxax-react"`. (CDN latest의 automatic runtime이 넣는 `import` 문이 `file://`에서 `Cannot use import statement outside a module`로 깨져 7개 전체 스피너 무한 = v1.11 사고. 이 preset 빼면 재발.)
- **실행형 산출물 = 에러 로거 내장됨**(이미 있으니 중복 추가 금지) — 각 앱 `window.onerror`/`unhandledrejection` → 화면 패널. + 빈화면 방지 3중장치(스피너 선렌더 → 관대한 JSON 파서 `parseJsonLoose` → 저장실패 경고배너).
- **디자인 토큰(고정값):** 브랜드 `#5e6ad2`, 본문 잉크 `#16161a`, 캔버스 `#fbfbfd`, 헤어라인 `#e9e9ef`. 폰트 **Pretendard**. 라이트 모드·라운드 카드.

## 함정·주의 (자주 깨지는 것)
- **파일의 P번호 ≠ UX 단계 P번호.** index는 "단계 기준", 파일은 "함께 쓰는 일 기준"이라 갈림. 예) 와이어프레임·디자인 토큰은 **P5 파일**에, 피드백분류·A/B·이상탐지는 **P7 파일**에 있음. 매핑 표는 HANDOFF_상세 §5.
- **퍼소나 스튜디오는 이 폴더에 없음** — 별도 앱 `D:\AI_Project\260618_퍼소나_스튜디오\v0.2\persona-studio.html`. P2-A2(페르소나)·P5-A5(가상 사용자 인터뷰) 전담. **링크가 경로 의존적** — 폴더 옮기면 또 깨짐(과거 2회 깨짐). 항구책 = `config.js`의 `personaStudioUrl` 절대경로.
- **현재 라운드 UX 개편은 P1에만 적용** — zoom·Guide 접힘·'텍스트화' 용어·인터뷰 대개편·P0 자동 프리필이 P1 위주. **P2~P7 미확산**(작업 시 확산 여부 확인).
- **브라우저 무료 한국어 전사는 구조적 한계.** 모델 향상(small/large-v3-turbo)은 했으나 정확도 필요 시 clova·Purfview(로컬) 전사 후 '붙여넣기' 권장. large-v3-turbo 한국어 품질은 **실오디오 미검증**(transformers.js 3.3.3 이슈 가능).
- **방향 4축(P1~P7 작업 판단 기준):** ①자기설명성(여기서 뭘 해서 뭘 얻나 1줄+쉬운 용어) ②흐름·적응성("스튜디오 메뉴" 지양, 필요한 단계만) ③따라다니는 학습 동반자(플로팅 멘토+추천질문+Q&A 저장) ④통합 템플릿 데이터(dossier 슬롯, MD 덤프 X).

## 관련 문서 포인터
- 로드맵·현재위치·Phase: [PLAN.md](PLAN.md)
- 버전(B·P 카운터)·변경로그(SSOT): [VERSION.md](VERSION.md)
- 구조·내부동작·확장 레시피·도구 매핑·한계: [HANDOFF_상세.md](HANDOFF_상세.md) (손 관리 영구 인계 — 인계는 여기부터)
- 사용자용 빠른 시작: [README.md](README.md)
- 세션 자동 타임라인: [HANDOFF.md](HANDOFF.md) (Stop 훅이 매 턴 덮어씀 — 손으로 길게 쓰지 말 것)
- 진행 중 대형 플랜: `~/.Codex/plans/transient-skipping-emerson.md` (P1 기준 모델 재설계 라운드, Step 2~6 남음)
