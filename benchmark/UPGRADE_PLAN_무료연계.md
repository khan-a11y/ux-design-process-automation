# 무료 전문도구 연계 — 업그레이드 실행 플랜

> `v0.1 · 제작일 2026-07-01` · 상위 규칙: 프로젝트 [AGENTS.md](../AGENTS.md) 상속
> 근거 자료: [벤치마킹 리포트](ux-automation-benchmark-v0.1.html) (Artifact: https://claude.ai/code/artifact/9d86d063-e99e-4863-8c86-38a405edefd7)
> **핵심 원리 = "내보내기 다리(export bridge)".** 우리 도구는 초안·구조·학습을 담당하고, **표준 포맷으로 내보내** 무료 전문도구가 이어받게 함. 전부 무료·무빌드·`file://` 자체완결 유지.

---

## 왜 (WHY)
벤치마킹 결과: 우리는 "전 과정 통합 + 무료 + 로컬 + 교육형"이라는 빈 칸에 있으나, **각 단계는 전문도구가 더 깊음**. 올인원 대체품으로 밀면 품질에서 짐. 대신 **약한 단계를 무료 전문도구로 넘기는 다리**를 놓으면 "학습·프라이버시·초안 허브"로서 경쟁자 거의 없음. 이 플랜 = 그 다리 8건을 임팩트순으로.

## 공통 설계 원칙 (모든 다리 공통)
1. **표준 포맷 우선** — W3C Design Tokens·Mermaid·CSV·i18next·JSON 등 널리 읽히는 포맷.
2. **`file://` 자체완결** — 외부 fetch 금지. 내보내기는 Blob 다운로드 또는 클립보드 복사.
3. **교육형 유지** — "이 산출물을 어디로 가져가세요(도구·경로)" 안내를 내보내기 UI에 내장.
4. **환각 방지** — 숫자·통계는 코드가 실집계. 내보내는 값도 dossier 실데이터에서.
5. **dossier 단일소스** — 내보내기는 `UXAX.getSlot`/`listSlots`에서 읽어 변환만. SSOT 안 흔듦.

---

## WAVE 0 — 즉시·고임팩트 (약한 단계부터)

### 0-1. 범용 내보내기 허브  · 대상: 전 과제
- **무엇을:** dossier 한 권을 `.md` / `.json` / `.csv`로 통째 또는 슬롯별 내보내기.
- **어떻게:** `common.js`에 `UXAX.exportDossier(fmt, scope)` 추가 → Blob + `URL.createObjectURL` 다운로드. 허브(index.html)에 "내보내기" 버튼.
- **수용기준:** 3개 포맷 각각 다운로드되고, 재반입 시 슬롯 구조 복원 가능(json). 콘솔 에러 0.
- **난이도:** 낮음(가장 적은 코드로 가장 넓은 연계). **먼저 착수 권장.**

### 0-2. W3C 디자인 토큰 내보내기  · 대상: P5 token
- **무엇을:** 디자인 토큰을 `*.tokens.json`(W3C Design Tokens Community Group 표준)으로.
- **어떻게:** token 슬롯 → `{ "$type":"color","$value":"#.." }` 트리 변환. `UXAX.exportTokensW3C()`.
- **받는 곳(무료):** **Penpot**(네이티브 W3C 토큰 import)·**Style Dictionary**(오픈소스, CSS/Tailwind/Swift/Kotlin 빌드)·**Tokens Studio**(Figma 무료 플러그인).
- **수용기준:** 내보낸 파일을 Style Dictionary가 파싱해 CSS 변수 생성 성공(1회 실증).
- **난이도:** 중. 임팩트 최상(핸드오프 즉시 코드까지 무료로 이어짐).

### 0-3. 분석 이벤트 스펙 내보내기  · 대상: P7 ab·anomaly·ops (우리 최약점)
- **무엇을:** 실트래픽 지표·A/B·이벤트 정의를 **PostHog/Clarity 설정 가이드 + 이벤트 스펙 JSON**으로.
- **어떻게:** ab/ops 슬롯 → 이벤트명·속성·타깃·가설 구조화 JSON + "PostHog에 이렇게 붙이세요" 안내 텍스트.
- **받는 곳(무료):** **PostHog**(MIT, 무료 1M 플래그/월)·**GrowthBook**(자체호스팅 무제한)·**Microsoft Clarity**(완전무료 히트맵/세션).
- **수용기준:** 내보낸 이벤트 스펙이 PostHog "custom events" 정의에 그대로 대응됨(문서 매핑 확인).
- **난이도:** 중. "초안은 우리, 실측은 무료 전문도구" 원칙의 핵심.

---

## WAVE 1 — 다음 (v0 검증 후) · 다이어그램·수집·전사

### 1-1. Mermaid 다이어그램 내보내기  · 대상: P3 flow·ia / P2 journey
- **무엇을:** 플로우·IA·여정을 `mermaid` 코드 블록으로.
- **어떻게:** flow/ia/journey 슬롯 → `graph TD` / `flowchart` / journey 문법 생성. 복사 버튼.
- **받는 곳(무료):** GitHub·Notion·**draw.io**·**Whimsical**·mermaid.live 어디서나 즉시 렌더·편집.
- **수용기준:** 생성 코드가 mermaid.live에서 오류 없이 렌더(1회 실증).

### 1-2. 설문 내보내기  · 대상: P1 survey
- **무엇을:** 설문 문항을 배포 도구로 넘길 형식으로.
- **어떻게:** survey 슬롯 → **Google Forms** 일괄 생성용 구조(문항/타입/선택지) + **Tally** 붙여넣기용 텍스트.
- **받는 곳(무료):** **Google Forms**(완전무료)·**Tally**(무제한 폼·응답 무료).
- **수용기준:** 문항·선택지·타입이 손실 없이 옮겨짐.

### 1-3. 로컬 전사 옵션 확장  · 대상: P1 interview (한국어 정확도)
- **무엇을:** 브라우저 무료 전사의 한국어 한계 보완.
- **어떻게:** 전사 백엔드에 **SenseVoice**(한중일 특화, 띄어쓰기 우수) 옵션 추가 + Clova Note/Purfview(로컬) 결과 "붙여넣기" 동선 안내 강화.
- **받는 곳(무료):** SenseVoice(오픈)·Clova Note(무료 티어)·Buzz(오픈).
- **수용기준:** 실오디오로 Whisper 대비 한국어 띄어쓰기·정확도 개선 확인(실측 — 현재 미검증 항목).

### 1-4. 와이어·코드스펙 핸드오프  · 대상: P5 wire·codespec
- **무엇을:** 와이어 구조·스펙을 편집 도구로.
- **어떻게:** wire 슬롯 → Penpot 반입 가능한 구조(또는 SVG), codespec → Figma Dev Mode 참고 포맷.
- **받는 곳(무료):** **Penpot**(오픈, SVG/CSS/HTML 실코드)·Figma·Uizard/UX Pilot 무료티어.
- **수용기준:** 내보낸 와이어가 Penpot에서 열려 편집 가능.

---

## WAVE 2 — 이후 (고도화) · 검증·콘텐츠·리서치

### 2-1. 접근성 QA 핸드오프  · 대상: P6 qa
- **무엇을:** 색대비(우리 코드) + 나머지 WCAG를 무료 감사도구로.
- **어떻게:** qa 슬롯 → 체크리스트 + axe/WAVE/Lighthouse 실행 가이드·딥링크.
- **받는 곳(무료):** **axe DevTools·WAVE·Lighthouse·Pa11y**(전부 무료). ※ 자동 도구는 WCAG 30~40%만 잡음 — 나머지 수동 안내 포함.

### 2-2. 사용성 테스트 브리지  · 대상: P6 usability
- **무엇을:** 태스크·시나리오를 실참여자 테스트로.
- **어떻게:** usability 슬롯 → Maze/Lyssna 스터디 설정 가이드.
- **받는 곳(무료):** **Maze**(free-forever, 참여자 직접)·**Lyssna**(무료 티어).

### 2-3. i18n 키 내보내기  · 대상: P4 writing·localize
- **무엇을:** 카피·번역을 개발 반영 포맷으로.
- **어떻게:** writing/localize 슬롯 → **i18next** JSON / Frontitude 키 포맷.
- **받는 곳(무료):** i18next(오픈)·Frontitude(무료체험/Figma 플러그인).

### 2-4. 데스크리서치 연동  · 대상: P1 desk
- **무엇을:** 리서치 질의를 외부 AI 리서치 도구로.
- **어떻게:** desk 슬롯 → Perplexity/Consensus/NotebookLM용 프롬프트·딥링크 프리셋.
- **받는 곳(무료):** Perplexity(5/일)·Consensus(15/월)·Semantic Scholar·NotebookLM.

---

## 착수 순서 제안 (사용자 판단 대기)
1. **0-1 범용 내보내기 허브** (기반·최저난이도) → 2. **0-2 W3C 토큰** (임팩트 최상) → 3. **0-3 분석 스펙**(최약점 보강).
- 이 셋이 "v0 다리"임. 동작 확인 후 WAVE 1·2로.
- **사용자가 어느 파도/항목부터 원하는지 정하면 그 순서로 착수함.** (개발 세부는 추천안으로 진행하되 착수 우선순위만 확인.)

## 알려진 리스크
- 1-3 한국어 전사 정확도는 **실오디오 미검증** — SenseVoice 실측 필요(HANDOFF §함정과 동일).
- 무료 티어·가격은 수시 변동 — 각 다리 착수 전 해당 서비스 재확인.
- 내보내기 UI를 7개 파일에 복제하면 drift — 가능한 로직은 `common.js`(`UXAX.*`)로 추출.
