# HANDOFF (상세·영구) — UX×AX 자동화 도구 모음

`v1.9 · 제작일 2026-07-01 · 작성: DIR4 AI Lab · 문서 ID UXAX-STUDIO-2026`

> **★ v1.9 (2026-07-01) — 로컬 AI 연계(무료 전문도구 병행) 추가 · 최신.** 경쟁 벤치마킹(20+ 도구, `benchmark/` + Artifact) 결과 = "전 과정 통합 + 무료 + 로컬 + 교육형"이 빈 칸이고 각 단계는 전문도구가 더 깊음 → **약한 단계를 무료·오픈소스 전문도구와 병행.** 새 로컬 AI 백엔드 **`D:\AI_Models\asr`**(프로젝트 밖·GPU): **SenseVoice 음성전사 + Donut 문서OCR + kiwi 한국어 띄어쓰기 + pyannote 화자분리**, flask 서버(`localhost:11435`, Ollama식 로컬 fetch)·로그인 자동시작. **P1 인터뷰**(로컬 전사·화자분리)·**P1 데스크**(이미지 OCR)·**P6 사용성**(세션 전사·화자분리)에 연동. 공통 로직 = `common.js`의 `UXAX.asr*`(§4.7). 상세·의존성·검증 = `D:\AI_Models\asr\DIARIZATION_STATUS.md`·`README.md`. **교보재 포지션(v1.8)은 유지 — 이건 실무 기능 강화 레이어.**

> **★ 포지션 전환 (v1.8, 2026-06-25) — 먼저 읽을 것.** UX 전문가 시각 냉정 비판 결과("넓이만·깊이/흐름/데이터연결 없음·누구를 위한 건지 분열") 반영. **이 프로젝트 = "AI로 UX 자동화가 어디까지 되나" 보여주는 교보재/데모로 포지션 확정**(완성 단일 제품 아님). index 허브에 신뢰 범례 3칸 + 29개 도구별 신뢰칩(🔢코드 실집계/⚗️혼합/✨AI 생성) 추가. **실무용 "리더 없이 따라가는 흐름 도구"는 별도 프로젝트로 분기 = `D:\AI_Project\260617_UX디자인프로세스_도구`**(P1~P3 깊게, 현재 v0.41). 아래 "흐름 도구" 방향(4축)은 이제 *그 분기 프로젝트*의 미션 — 이 교보재는 데모로 유지. 보안·검수 통과(`보안검수_2026-06-25.md`).
> **★ Figma 교보재 장표 (2026-06-25):** `02_DIR4_Team_AI-Lab` 파일 **W25_UX디자인프로세스_자동화_교보재** 페이지에 사용법 46슬라이드(W24 스토리보드 포맷·DT Sans). + W23~W25 전 장표 **본문 배경 #F7E8EF→#E8F7F1(민트)** 재색 + (제목+설명) 그룹→중앙→해제 정렬. 이 장표 규약은 전역 `~/.claude/CLAUDE.md` 장표 섹션에 고정. (W23 아이콘메이커는 다른 포맷이라 제외.)
>
> **■ (이하 구 로드맵 — 교보재로서는 1·2·3단계 완료 상태로 보존, 흐름 도구 야망은 분기됨) [통합 로드맵 6단계 / 심층리뷰 반영].** 로드맵 SSOT = [PLAN.md](PLAN.md). (구 플랜 `~/.claude/plans/transient-skipping-emerson.md`는 1단계로 흡수됨 — 참고만.)
> 방향: "기능 패널 7묶음" → **초급자가 리더 없이 따라가며 배우는 자기설명형 흐름 도구.** 판단 4축: ①자기설명성(뭘 해서 뭘 얻나 1줄+쉬운 용어) ②흐름·적응성 ③따라다니는 학습 멘토 ④통합 템플릿 데이터(dossier 슬롯).
> - **✅ 1단계 (v1.5~v1.57) — P1 신뢰 기반:** `common.js`(`window.UXAX`: dossier/slot/mentor/모델라우팅/**프롬프트 중앙화**) + **슬롯 근거메타**(`source_type·human_confirmed·used_in_phase`) + P0 한 페이지 폼 + **P1 5탭 자기설명형 재설계** + 결과 슬롯 저장·검수 토글 + **보관함 = 단계별 템플릿 뷰** + 하단 `StageNav`.
> - **✅ 2단계 (v1.6~v1.61) — 판단 게이트:** 각 단계 상단 **6칸 자가점검** `GatePanel`(목표·입력충족·합격선·멈춤·사람검수·비용환경 / auto 3 + 사람입력 3 / 마무리 토글) + common.js `gates`·`deriveGate`·`GATE_FIELDS`. **P0 합격선·재방문 루프** = 게이트 상단 **P0 북극성 띠**(한 줄 정의·성공 기준 표시 + 홈에서 고치기) + 목표/합격선 **↧ P0 프리필** + index P0 폼 **"🌱 정의는 살아있어요" 띠**.
> - **✅ 3단계 (v1.7~v1.72) — P1~P7 전면 확산:** 위 1·2단계 패턴 전체가 **7개 스튜디오 전부에 적용됨**. `SLOT_REGISTRY` **28슬롯**(P0~P7), `deriveGate` 앞단계 카운트 일반화. P2 파일럿 → P3~P7 확산(구조 layer node 일괄 + 18개 패널 슬롯/검수 병렬 5에이전트). 각 smoke 28/28 + Playwright.
> - **다음 = 4단계 검증 루프** (P5→P6→P7→P3 되먹임) — 새 설계 필요(미착수).
> - **🌐 외부 리뷰 라이브:** https://khan-a11y.github.io/ux-design-process-automation/ (GitHub `khan-a11y/ux-design-process-automation`, main 푸시마다 자동 재빌드 · `config.js` 시크릿 제외).
> **참고:** 로컬 LLM 기본 모델 = **Qwen(상업자유)**, EXAONE는 비상업(NC)이라 카탈로그·주석에 경고만(v1.71 정리). 브라우저 무료 한국어 전사는 구조적 한계(정확도 필요 시 clova·Purfview 로컬 후 ‘붙여넣기’), large-v3-turbo 한국어 실품질 **실오디오 미검증**.

> **이 문서가 무엇인가 / [HANDOFF.md](HANDOFF.md)와의 차이 (꼭 읽을 것)**
> - **이 파일(`HANDOFF_상세.md`) = 손으로 관리하는 영구 인계 문서.** 자동 훅이 안 건드림. 인수자/AI가 맥락을 잃지 않도록 구조·내부동작·확장법·한계를 정리. → **인계는 여기부터 읽기.**
> - **[HANDOFF.md](HANDOFF.md) = Stop 훅(`~/.claude/hooks/update-handoff.js`)이 매 턴 자동 생성하는 세션 타임라인.** 손으로 쓰면 다음 턴에 통째로 덮어써짐(과거에 상세본이 이렇게 한 번 소실됨). 거기엔 손으로 쓰지 말 것.
> - 사용자용 빠른 시작은 [README.md](README.md), 버전·변경이력은 [VERSION.md](VERSION.md)가 SSOT.

---

## 1. 한눈에 (TL;DR)

- **무엇:** UX 표준 6단계(P1 리서치 → P6 핸드오프) + P7 운영의 **자동화 과제 29개**를, 흩어진 프롬프트 카드가 아니라 **연계성으로 묶은 7개 스튜디오 앱**으로 실제 자동화한 도구 모음. 전부 **무료·무빌드·단일 HTML**.
- **차별점:** "프롬프트 칸"이 아님. LLM 호출 주변의 실제 작업(전사·임베딩 군집·PDF 추출·A/B 통계·색대비·픽셀 diff·z-score)을 **브라우저 안에서 코드로** 처리하고, LLM은 파이프라인의 **한 단계**(요약·분류·라벨·해석)만 담당.
- **시작점:** [index.html](index.html) 더블클릭(허브) → **P0 프로젝트 정의(한 페이지)** → 스튜디오 선택.
- **상태:** **v1.8** — **교보재/데모로 포지션 확정**(신뢰 범례·29개 신뢰칩). 그 위 기능은 1·2·3단계 완료(판단 게이트·dossier 슬롯·검수·보관함 템플릿 뷰·StageNav가 P1~P7 전 스튜디오 적용, SLOT_REGISTRY 28슬롯). 스모크 **28/28**·콘솔0(2026-06-25 재확인). 라이브: khan-a11y.github.io/ux-design-process-automation. 정본 폴더 = **`260617_UX디자인프로세스_자동화`**. **실무 흐름 도구는 분기 → `260617_UX디자인프로세스_도구`(v0.41).**
- **인수자가 먼저 할 일:** ① [PLAN.md](PLAN.md) ‘현재 위치’ 읽기(다음 = **4단계 검증 루프 P5→P6→P7→P3**, 미착수·새 설계 필요) → ② **`common.js`의 `window.UXAX`(dossier/slot/mentor/gates/SLOT_REGISTRY 28슬롯)** 가 공통 기반(§4.4) → ③ 아무 스튜디오나 열어 상단 🚦게이트(P0 북극성 띠)·하단 StageNav·우하단 📋보관함(28슬롯 템플릿 뷰) 확인 → ④ 엔진 설정(⚙️) 무료 1개(§3) → ⑤ 수정 후 `bash smoke-test.sh`(28/28). **이제 7파일 모두 동일 패턴** — 한 곳 고치면 7곳(복제 구조)임을 유의(§5 함정).

---

## 2. 폴더 / 파일 맵

```
260617_UX디자인프로세스_자동화/
├─ index.html                     ← 허브(시작점). P0 프로젝트 정의 폼 + 7 스튜디오 카드 + 29 도구 그리드
├─ common.js                       ← ★공통 평문 로직(window.UXAX): dossier/slot/mentor/모델라우팅. babel보다 먼저 로드
├─ CLAUDE.md                       ← 이 프로젝트 지침(전역·상위 상속 + 고유 맥락·제약)
├─ P1_리서치스튜디오.html          ← 전사·요약 / 설문 자유응답 분류 / VOC / 데스크 / 인터뷰가이드  ★1·2·3단계 패턴 전부 적용(자기설명·슬롯·검수·StageNav·게이트). P1~P7 모두 동일 패턴 적용됨
├─ P2_정의스튜디오.html            ← 어피니티 / 여정맵 / HMW / PRD   (+퍼소나 앱으로 링크) · 게이트·슬롯·검수·보관함뷰·StageNav 적용
├─ P3_아이디에이션스튜디오.html     ← 발산 / IA / 플로우 / 우선순위 · 동일 적용
├─ P4_콘텐츠스튜디오.html          ← UX라이팅 / 현지화 / 더미콘텐츠 · 동일 적용
├─ P5_디자인핸드오프스튜디오.html   ← 와이어 / 토큰 / 코드스펙 / 체인지로그 · 동일 적용
├─ P6_품질검증스튜디오.html        ← 사용성 / 휴리스틱·접근성 / 디자인QA · 동일 적용
├─ P7_피드백운영스튜디오.html       ← 피드백분류 / A/B / 이상탐지 / 운영피드백 · 동일 적용
├─ config.example.js               ← 설정 템플릿(API키·퍼소나URL). 복사 → config.js (gitignore)
├─ start-ollama.bat · serve.bat     ← 로컬 Ollama 기동 / 로컬 HTTP 서버
├─ smoke-test.sh · smoke-test.mjs · package.json  ← 검증(전 탭 헤드리스 렌더)
├─ README.md · VERSION.md           ← 사용자 안내 / 버전·변경이력(SSOT)
├─ HANDOFF.md (자동) · HANDOFF_상세.md (이 문서)
├─ benchmark/                      ← ★경쟁 벤치마킹 리포트(Artifact HTML) · 무료 연계 플랜(UPGRADE_PLAN_무료연계.md)
└─ .claude/handoff-state.json       ← 자동 훅의 세션 누적 사이드카
```

- **★로컬 AI 백엔드는 프로젝트 밖:** `D:\AI_Models\asr`(전역 모델 허브) — SenseVoice 전사·Donut OCR·kiwi 띄어쓰기·pyannote 화자분리 + flask 서버(11435)·자동시작(§4.7). git 별개, `hf_token.txt`=HF토큰(시크릿).

- **퍼소나 스튜디오는 이 폴더에 없음.** 별도 앱: `D:\AI_Project\260618_퍼소나_스튜디오\v0.2\persona-studio.html`. P2-A2(페르소나)·P5-A5(가상 사용자 인터뷰)는 그 앱이 전담.
- **⚠ 경로 함정(v1.42에서 재정정):** index.html·P2의 퍼소나 링크 fallback은 현재 `../260618_퍼소나_스튜디오/v0.2/persona-studio.html`. 이 폴더가 **또 옮겨지면 다시 깨짐** — 항구적 안전책은 `config.js`의 `personaStudioUrl`을 절대경로로 박는 것. (야간 검수가 매일 이 링크 실재 여부를 점검함.)

---

## 3. 사용자 실행법 — 무료 4엔진 (모든 앱 공유)

설정(⚙️)에서 한 번 고르면 7개 앱이 같은 설정(localStorage `uxax_studio_settings_v1`)을 공유.

| 엔진 (`backend`) | 비용 | 설치 | 비전 | 켜는 법 |
|---|---|---|---|---|
| 브라우저 내장 AI (`webllm`) | 무료 | 없음 | ✕ | WebGPU 지원 브라우저면 자동. 최초 1회 모델 다운로드. |
| 로컬 Ollama (`ollama`) | 무료 | 1회 | ✕ | `start-ollama.bat` → 자동 감지. 한국어: `ollama pull qwen2.5:3b` |
| 수동/챗GPT 복붙 (`manual`) | 무료 | 없음 | ○(직접) | 기본값. 프롬프트 창을 챗봇에 복붙 → 답을 다시 붙여넣기. |
| Anthropic API (`api`) | 유료 | 없음 | ○ | `config.example.js`→`config.js` 복사 후 키 입력. |

- 전사·임베딩·통계·픽셀 diff·색대비는 **엔진과 무관하게** 브라우저에서 자동 계산. LLM 단계(요약·분류 등)만 위 엔진 사용.
- `file://`에서 막히면 `serve.bat`(로컬 서버)로 열 것.

---

## 4. 아키텍처 (내부 동작)

### 4.1 패턴: 단일 HTML · CDN · 무빌드
- 각 스튜디오 = HTML 1개. `<head>`에서 CDN 로드: **Pretendard(jsdelivr) · TailwindCSS(cdn.tailwindcss.com) · React 18 + ReactDOM(unpkg) · @babel/standalone(unpkg)**.
- 본문은 `<script type="text/babel" data-presets="react">`에 **JSX 인라인** → Babel standalone이 브라우저에서 트랜스파일. **빌드 도구 없음.**
- 무거운 라이브러리는 **동적 import**(`esm.run`/`jsdelivr`)로 필요 시 로드(아래 표).
- **빈 화면 방지 3중장치:** ① `#root`에 로딩 스피너 HTML 선렌더 → ② 관대한 JSON 파서 `parseJsonLoose`(코드펜스·후행쉼표·부분 JSON 복구) → ③ localStorage 저장 실패 시 하단 경고 배너(`__uxaxSaveWarn`).

### 4.2 LLM 엔진 추상화 — `runLLM(settings, opts)`
한 함수가 4백엔드로 분기(P1 기준 [P1_리서치스튜디오.html:83](P1_리서치스튜디오.html#L83)):
- `callManual` — `manualBridge` 큐에 프롬프트 쌓고 사용자가 답 붙여넣기.
- `callOllama` — `http://127.0.0.1:11434/api/chat`, num_ctx 8192, 스트리밍.
- `callWebLLM` — `esm.run/@mlc-ai/web-llm`, WebGPU. 선호 모델 `Qwen2.5-3B/7B`, `Llama-3.2-3B`. 다운로드 4회 재시도.
- `callClaude` — `api.anthropic.com/v1/messages`, 헤더 `anthropic-dangerous-direct-browser-access:true`. 모델 `claude-opus-4-8`/`sonnet-4-6`/`haiku-4-5`.
- `backendReady(s)`·`backendLabel(s)`로 준비상태·표시명 판별.

### 4.3 브라우저 내 자동화 라이브러리 (LLM 외 실제 처리)
| 기능 | 라이브러리 / 구현 | 위치(대표) |
|---|---|---|
| 오디오→텍스트 전사(STT) | `@huggingface/transformers@3.3.3` Whisper(base/tiny/small), WebGPU→WASM fallback, 16kHz PCM 변환 | P1 #interview |
| 임베딩 + k-means 군집 | transformers `feature-extraction`, `paraphrase-multilingual-MiniLM-L12-v2`(fallback all-MiniLM-L6-v2), **자체 kmeans 구현** | P1 #voc, P2 #affinity |
| PDF 텍스트 추출 + 간이 RAG | `pdfjs-dist@4.10.38`(jsdelivr) + chunk(600/overlap100) + 코사인(dot) | P1 #desk |
| 플로우 다이어그램 | Mermaid 자동 렌더 → SVG | P3 #flow |
| A/B 통계 | z검정·p값·신뢰구간 직접 계산 | P7 #ab |
| 이상탐지 | z-score | P7 #anomaly |
| 색 대비(WCAG) | 명암비 직접 계산 | P6 #heuristic |
| 디자인 QA | canvas 픽셀 diff | P6 #qa |
| 공통 | CSV 파서/직렬화, MD/CSV/JSON 내보내기, 차트 | 전 앱 |

### 4.4 localStorage 키 맵
- `uxax_studio_settings_v1` — **엔진 설정**(backend·apiKey·model·ollama·webllm). 7앱 공유. `SETTINGS_KEY`.
- `uxax_project_v1` — **★프로젝트 한 권(dossier)**. `{id,name,type,brief,slots:{"P1.interview":{status,data,md,meta}…},gates:{"P1":{goal,passLine,stopWhen,confirmed,at}},mentorLog}`. `window.UXAX` API로만 접근(`loadProject/setBrief/getBrief/setSlot/confirmSlot/getSlot/listSlots/getGate/setGate/deriveGate/mentorAdd/mentorLoad/pickModel`). 슬롯 레지스트리 `UXAX.SLOT_REGISTRY`(P0·P1만 등록), 게이트 스펙 `UXAX.GATE_FIELDS`(6칸).
  - **슬롯 meta = 근거추적(1-0):** `source_id·source_type·confidence·human_confirmed·used_in_phase`(+model·items·at). `confirmSlot(id,on)`이 `human_confirmed` 토글(AI 제안→사람 결정).
  - **게이트(2단계):** `deriveGate(phase)`가 자동 3칸 판정(입력충족=P0 브리프 채움 / 사람검수=해당 단계 슬롯 `human_confirmed` 비율 / 비용·환경). 사람입력 3칸(목표·합격선·멈춤)은 `gates[phase]`에 저장.
- `uxax_project_brief_v1` — 구 P0 위저드 데이터(레거시). `common.js`가 dossier로 1회 마이그레이션. P1 인터뷰 자동 프리필이 아직 이 키도 읽음(공존).
- `uxax_workspace_v1` — **공유 보관함(평문 MD 배열, 레거시)**. `WS_KEY`. 최대 300건. **(1-3)** 보관함 UI는 dossier 슬롯 기반 ‘단계별 템플릿 뷰’가 메인이 됨 — 이 평문 배열은 ‘기타 메모’ 탭으로 공존.
- 각 도구 입력/결과도 `load/save` 헬퍼로 도구별 키(JSON). 모두 **브라우저 localStorage에만**, 서버 없음.

### 4.5 공유 보관함(Workspace) API — 앱 간 산출물 전달
- `wsAdd(title,text)` 저장 / `wsLoad()` 조회 / `wsDel(id)` / `wsUpdate(id,text)` 편집 / `wsClear()`. `wsBus.notify`로 UI 갱신.
- UI 컴포넌트: 결과 카드의 **`<WsSave>`**(📤 보관함) → 다른 도구 입력칸 위 **`<WsPull>`**(📥 가져오기) 셀렉트.
- 흐름 예: P1 인터뷰 요약 → P2 HMW 입력 / P1 VOC → P7 피드백 입력. 사람이 보관함에서 **편집·확정** 후 다음 단계로 넘김(AI 제안을 사람이 다듬기).

### 4.6 공통 UI/컴포넌트
- 디자인 토큰(Tailwind config): brand `#5e6ad2`, ink `#16161a`, canvas `#fbfbfd`, hair `#e9e9ef`. **라이트 모드 기본.**
- 공통 컴포넌트(JSX라 7파일 복제·표준화): `Btn`, `Tabs`(URL 해시 연동), `WsSave`/`WsPull`, 설정 모달. **(P1~P7 전체 적용·1·2·3단계 산출)** **`GatePanel`**=판단 게이트 6칸(상단 접이식, P0 북극성 띠+프리필, `GATE_FIELDS`·`deriveGate`), **`StageNav`**=하단 단계 네비(이전/다음 탭·이전 단계·다음 단계, 단계명 동적), **`WorkspaceModal`/`WorkspaceFab`=보관함 단계별 슬롯 템플릿 뷰**(`SlotStatusBadge` 검수 뱃지·편집/복사/검수토글·빈슬롯 플레이스홀더·‘기타 메모’ 탭, 28슬롯), 각 패널 `saveSlot`+`☐ 내가 검수함` 토글. **(P1 전용·미확산)** `MentorFab`=플로팅 학습 멘토(`FAQ_BY_TAB`·`mentorLog`), `Guide` 1줄화, `AudioCard`(controlsList·🗑) — P2~P7은 구형 Guide(필요 시 P급 보강).
- **`common.js`(평문, `window.UXAX`)** = dossier/slot/mentor/모델라우팅. babel 스크립트보다 먼저 `<script src>`. ★주의: babel 파일의 기존 전역명(`WS_KEY`·`load`·`MODELS` 등)과 충돌 금지 → 전부 `UXAX.*`로만 노출(const 중복선언 시 SyntaxError로 전체 깨짐).
- 유틸: `cx` `S` `arr` `uid` `load/save` `copyText` `download` `parseJsonLoose` `parseCSV/toCSV` `fmtTime/parseTime` `audioDuration`(전사 진행 추정용).

### 4.7 로컬 AI 서버 연계 (무료 전문도구 병행 · v1.9, 2026-07-01)
- **위치:** `D:\AI_Models\asr`(프로젝트 밖·전역 모델 허브). flask `server.py` → `http://127.0.0.1:11435`(Ollama식 로컬 fetch·CORS·GPU). 기동 = `start-asr.bat` 또는 로그인 자동시작(`asr-autostart.vbs`, 시작프로그램 등록).
- **모델(전부 무료·로컬):** ①**SenseVoice**(FunAudioLLM · 음성전사 한/영/중/일… · `lang=ko`면 kiwipiepy로 한국어 띄어쓰기 교정) ②**Donut**(naver-clova-ix · 문서 이미지→텍스트 · 영수증·양식 특화) ③**pyannote**(화자 자동분리 · 별도 격리 `venv-diar311`=Python3.11+torch2.1.2+pyannote3.1.1 · HF 토큰 `hf_token.txt` 필요).
- **엔드포인트:** `POST /transcribe`(audio,lang,spacing) · `/ocr`(image) · `/diarize`(audio→화자별 세그먼트+전사) · `GET /health`.
- **도구 연동 API:** `common.js`의 `UXAX.asrTranscribe / asrOcr / asrDiarize / diarToSegments`(7파일 복제 방지). **P1 인터뷰**(전사모델 "🖥️ 로컬 SenseVoice 서버" + "👥 화자 자동 분리")·**P1 데스크**("🖼️ 이미지→텍스트")·**P6 사용성**(녹음 전사 + 화자분리)에서 호출.
- **주의:** 서버 꺼져 있으면 화면에 `start-asr.bat` 안내. 화자분리는 HF 토큰 1회(발급 + pyannote 2모델 Agree). 첫 실행은 모델 로딩 느림(이후 캐시). pyannote는 메인 GPU 스택(SenseVoice/Donut)과 **별도 venv로 격리** — 과거 pyannote 설치가 메인 torch를 CPU로 오염시킨 사고를 격리로 해결. 상세·의존성·검증·한계 = `D:\AI_Models\asr\DIARIZATION_STATUS.md`.

---

## 5. 도구 ↔ 스튜디오 매핑 (29개 전체)

> **⚠ 함정: 파일 이름의 P번호 ≠ UX 단계 P번호.** 예) P4-A1 와이어프레임은 **단계상 디자인(P4)**이지만 **파일은 P5_디자인핸드오프스튜디오**에 있음. index.html은 "단계 기준"으로, 파일은 "함께 쓰는 일 기준"으로 묶여 있어서 갈림. 아래는 **실제 파일#탭** 기준.

| 단계ID | 도구 | 파일#탭 |
|---|---|---|
| P1-A1 | 인터뷰 자동 전사·요약 | P1#interview |
| P1-A2 | 설문 개방형 코딩 | P1#survey |
| P1-A3 | 리뷰·VOC 분석 | P1#voc |
| P1-A4 | 데스크 리서치 합성 | P1#desk |
| P1-A5 | 인터뷰 가이드 초안 | P1#guide |
| P2-A1 | 어피니티 클러스터링 | P2#affinity |
| P2-A2 | 페르소나 초안 | **퍼소나 스튜디오 전담** |
| P2-A3 | 사용자 여정맵 | P2#journey |
| P2-A4 | 인사이트→HMW | P2#hmw |
| P2-A5 | 요구사항(PRD) | P2#prd |
| P3-A1 | 아이디어 발산 | P3#idea |
| P3-A2 | IA·사이트맵 | P3#ia |
| P3-A3 | 사용자 플로우 | P3#flow |
| P3-A4 | 우선순위 스코어링 | P3#priority |
| P4-A1 | 와이어프레임 명세 | **P5#wire** |
| P4-A2 | 디자인 토큰 | **P5#token** |
| P4-A3 | UX 라이팅 | P4#writing |
| P4-A4 | 더미 콘텐츠 | P4#dummy |
| P4-A5 | 다국어 현지화 | P4#localize |
| P5-A1 | 사용성 세션 분석 | **P6#usability** |
| P5-A2 | 휴리스틱·접근성 | **P6#heuristic** |
| P5-A3 | 피드백 분류 | **P7#feedback** |
| P5-A4 | A/B 해석 | **P7#ab** |
| P5-A5 | 가상 사용자 인터뷰 | **퍼소나 스튜디오 전담** |
| P6-A1 | 디자인→코드 스펙 | P5#codespec |
| P6-A2 | 체인지로그 | P5#changelog |
| P6-A3 | 디자인 QA | **P6#qa** |
| P6-A4 | 이상탐지 | **P7#anomaly** |
| P6-A5 | 운영 피드백 분류 | **P7#ops** |

→ 자동화 완료 27개 + 퍼소나 앱 전담 2개(P2-A2, P5-A5) = 29.

---

## 6. 확장 레시피

### 새 탭(도구) 추가
1. 해당 스튜디오 HTML에서 `Tabs` 정의에 `{key:"새해시", label:"…"}` 추가(해시는 smoke-test의 TARGETS에도 추가).
2. 패널 컴포넌트를 Root 위에 작성. 입력칸 위 `<WsPull onPick=…>`, 결과 카드에 `<WsSave getText=…>`를 끼워 보관함과 연결.
3. LLM이 필요하면 `runLLM(settings,{system,messages})` 호출 + 결과는 `parseJsonLoose`로 파싱(JSON 강제 프롬프트 권장).
4. 브라우저 처리(통계·임베딩 등)는 §4.3 헬퍼 재사용. 무거운 lib는 동적 import.
5. **검증:** smoke-test.sh의 TARGETS에 `파일|…새해시` 반영 후 `bash smoke-test.sh` → 28→N개로 늘고 전부 ✓ 확인.

### 새 엔진 추가
- `call○○()` 함수 작성 → `runLLM`의 분기와 `backendReady`/`backendLabel`에 백엔드 키 추가 → 설정 모달에 옵션 추가.

### 새 스튜디오(앱) 추가
- 기존 HTML 1개 복제 → §4 공통 블록(유틸·`runLLM`·보관함·컴포넌트)은 그대로 두고 패널만 교체 → index.html의 `STUDIOS`/`PHASES` 배열에 카드 등록 → smoke-test TARGETS에 파일 추가.

---

## 7. 검증 (스모크 테스트)

- **무설치:** `bash smoke-test.sh` — 헤드리스 Chrome으로 index + 7앱의 **28개 탭**을 열어 `#root` 실제 렌더(빈 화면/초기화 오류) 자동 검사. 종료코드 0=통과. Chrome 경로 자동탐지(안 되면 `CHROME=… bash smoke-test.sh`).
- **Playwright:** `npm run test:install` 후 `npm test`.
- **판정 로직:** 스크립트 소스 제거 후 실제 렌더 텍스트 길이<400자 또는 "초기화 오류"/"불러오는 중" 잔존 → FAIL.
- **현재:** 28/28 PASS (2026-06-24 재실행 확인). + 변경 탭은 Playwright로 실클릭·콘솔·스크린샷 실검증(헤드리스 dump-dom 추측 금지). ⚠ Playwright에서 `goto(#해시)`는 해시만 바뀌면 리로드 안 함 → 탭 전환은 **탭 버튼 클릭**으로(과거 프로브 오진 원인).

---

## 8. 알려진 한계 / 주의

- **퍼소나 링크는 경로 의존적.** 폴더를 또 옮기면 다시 깨짐 → `config.js`의 `personaStudioUrl` 절대경로 권장. (v1.01에서 1차 수정)
- **헤드리스 단순 렌더 시 스튜디오 로딩이 길 수 있음**(transformers/pdf.js 등). 허브 index.html은 즉시 렌더. 무거운 기능은 `serve.bat`로.
- **WebLLM은 WebGPU 필요**(미지원 브라우저는 Ollama/수동/ API로). 최초 모델 다운로드 큼.
- **localStorage 용량 한계** — 가득 차면 자동저장 실패 + 경고 배너. 큰 결과는 MD/CSV/JSON로 내보내기 권장. 보관함 300건 상한.
- **수동 모드**는 사람이 복붙해야 하므로 배치 자동화엔 부적합(엔진을 Ollama/API로).
- 마크다운 문서의 lint 경고(표 정렬·빈 줄)는 표시 스타일로 렌더·내용 영향 없음.

---

## 9. 다음 선택지 (백로그 / 로드맵 SSOT=[PLAN.md](PLAN.md))

- **다음 = 4단계:** 검증 루프(P5→P6→P7→P3 순환) — 합격선/이슈/피드백이 앞 단계로 되먹임되는 구조(dossier 슬롯·게이트 기반). **새 설계 필요·미착수.**
- **5단계:** 평가 체계(골든셋 eval)·접근성 점검·세션 스냅샷. **6단계:** index 적응형 흐름 + 자동화(마지막).
- **3단계에서 미룬 폴리시(P급, 선택):** P3~P7 패널은 슬롯/검수는 들어갔으나 **자기설명 Guide 1줄화·플로팅 멘토(MentorFab)**는 아직 P1식 신형이 아닐 수 있음 + **의사결정 구조화·방법론 인터랙션 레이어**(어피니티 보드 등)는 미적용. 필요 시 P급으로 보강.
- (완료됨) ~~1단계 P1 신뢰 기반~~·~~2단계 판단 게이트+P0 루프~~·~~3단계 P1~P7 확산(SLOT_REGISTRY 28슬롯)~~. 슬롯 근거메타·템플릿 뷰·GitHub 공개 레포 + Pages 라이브 연결됨.
- (상시) 통합 프로젝트 리포트(MD/PDF) export, 퍼소나 스튜디오 양방향 연동, 입문 덱 학습 동선 연결.

---

## 10. 데이터 · 개인정보

- 모든 입력·결과는 **브라우저 localStorage**에만 저장(서버 없음).
- 로컬 Ollama / 브라우저 AI는 입력이 **PC 밖으로 안 나감**. Anthropic API 모드만 외부 전송(키 필요).
- **비밀키는 `config.js`(gitignore 대상)에만.** `config.example.js`만 공유. 자동 갱신 문서(HANDOFF.md 등)에 평문 키를 쓰지 말 것.

---

## 11. 변경 이력 / 세션 히스토리 요약

- **2026-07-01 (v1.9) [로컬 AI 연계 — 무료 전문도구 병행]:** ① **경쟁 벤치마킹** — 20+ UX 도구(Dovetail·UX Pilot·Maze·Penpot·PostHog·Clarity…) 조사, 29과제×무료 대체도구 매트릭스·포지셔닝맵, 결론="올인원 대체 아닌 학습·프라이버시·초안 허브 + 무료 전문도구 내보내기". 산출물 `benchmark/`(Artifact 리포트 + `UPGRADE_PLAN_무료연계.md`). ② **로컬 AI 백엔드 신설** `D:\AI_Models\asr`(프로젝트 밖·GPU RTX4070Ti·전부 무료): **SenseVoice**(음성전사)·**Donut/naver-clova-ix**(문서 OCR)·**kiwipiepy**(한국어 띄어쓰기 교정)·**pyannote**(화자 자동분리, 별도 venv-diar311·HF토큰). flask `server.py`(localhost:11435, `/transcribe`·`/ocr`·`/diarize`·`/health`, Ollama식 로컬 fetch·CORS)·`start-asr.bat`·로그인 자동시작(`asr-autostart.vbs`). ③ **도구 연동** — `common.js`에 `UXAX.asrTranscribe/asrOcr/asrDiarize/diarToSegments`(7파일 복제 방지). **P1 인터뷰**(전사모델 "🖥️ 로컬 SenseVoice 서버" + "👥 화자 자동 분리")·**P1 데스크**("🖼️ 이미지→텍스트" OCR)·**P6 사용성**(녹음 전사 + 화자분리)에 UI 추가. ④ **검증** — 2화자 오디오 화자 정확 분리(8초 경계)+화자별 전사(`/diarize` 200), P1/P6 Playwright 콘솔0, smoke 계열 유지. 커밋 `f63141f`~`8b5d2fe`. **의존성 삽질**(pyannote가 메인 GPU torch를 CPU로 오염→복구, Windows+py3.12 비호환→Python 3.11 격리 venv, use_auth_token/matplotlib/numpy)은 `D:\AI_Models\asr\DIARIZATION_STATUS.md`에 기록. **교보재 포지션(v1.8) 유지 — 실무 기능 강화 레이어.**
- **2026-06-24 (v1.72) [3단계 완료]:** P1의 1·2단계 패턴을 **P1~P7 전 스튜디오에 확산.** P2 파일럿(v1.7) 검증 후 P3~P7로 복제(v1.72): 구조 layer(common.js 로드+GatePanel+StageNav+보관함 템플릿뷰)는 node 일괄 변환, 18개 패널 슬롯저장·검수 토글은 병렬 5에이전트. `SLOT_REGISTRY` 28슬롯(P0~P7)·`deriveGate` 앞단계 카운트 일반화. 특이 패널(P5 wire·P6 qa·P7 anomaly) 적응 배선. 각 smoke 28/28 + 소스검증 + Playwright(P5·P7). **중간에 v1.71 로컬 LLM 라이선스 정리**(EXAONE NC→상업자유 Qwen, common.js·7 HTML·bat·문서)를 별도 커밋으로 먼저 확정 후 그 위에 확산.
- **2026-06-24 (v1.6~v1.61) [2단계 완료]:** **판단 게이트** 도입(v1.6) — common.js `gates`/`getGate`/`setGate`/`deriveGate`/`GATE_FIELDS` + `GatePanel` 6칸(목표·입력충족·합격선·멈춤·사람검수·비용환경 / auto 3 + 사람입력 3 / 마무리 토글), 강제 아님. **P0 합격선·재방문 루프**(v1.61) — 게이트 상단 P0 북극성 띠(한 줄 정의·성공 기준)+목표/합격선 ↧ P0 프리필+index P0 "🌱 정의는 살아있어요" 띠. P1 파일럿 후 3단계에서 전 파일 확산. smoke 28/28 + Playwright + 스크린샷.
- **2026-06-21~24 (v1.54~v1.57) [1단계 완료]:** 심층리뷰 반영 통합 로드맵으로 정리. **1-0** 슬롯 근거메타(`human_confirmed` 등)+프롬프트 중앙화(`UXAX.PROMPTS`, 7파일 드리프트 방지) / **1-1** 설문 탭 자기설명형(용어 순화·전건 미리보기·CSV·슬롯·검수) / **1-2** VOC·데스크·가이드(슬롯·검수·데스크 예제 누적·top-K/[S1] 설명·모델 추천·가이드 예제 풀) / **1-3** 보관함=단계별 슬롯 템플릿 뷰(근거메타·검수뱃지·편집/복사·빈슬롯 플레이스홀더·메모 분리) + 하단 `StageNav`(이전/다음 탭·이전 단계 홈·다음 단계 P2). 외부 리뷰용 GitHub 공개 레포 + Pages 라이브. 각 smoke 28/28 + Playwright + 스크린샷.
- **2026-06-18~19 (v1.5~v1.53) [P1 재설계 Step 0~3]:** 사용자 P1 전수 피드백으로 방향 전환(자기설명·흐름·멘토·통합 템플릿 4축). **Step 0** common.js(`window.UXAX`)+dossier+모델라우팅 / **Step 1** index P0 7스텝→한 페이지 폼(v1.5·레이아웃 v1.51) / **Step 2** Guide→사용방법 모달+플로팅 학습 멘토(v1.52) / **Step 3** 인터뷰 탭 turbo기본·오디오 중복제거·추정 진행바·클로바식 결과(v1.53). 각 Playwright e2e·콘솔0.
- **2026-06-18 (v1.4~v1.42):** index에 **P0 ‘프로젝트 정의’ 단계 신규**(v1.4, 유형별 브리프) → **P0 고도화·P1 ‘리서치 맥락’ 자동 프리필 연동**(v1.41) → 퍼소나 앱 `88_네이버_퍼소나`→`260618_퍼소나_스튜디오` 리네임에 따른 **링크 경로 정정**(v1.42, 야간 검수 발견).
- **2026-06-18 (v1.3):** 사용자 피드백 반영 — 전사 품질 수정(q8·반복방지·모델 small/large-v3-turbo) + **P1 인터뷰 탭 대개편**(멀티 업로드·파일별 플레이어·모델 선택 전사 비교·2단·‘텍스트화’ 용어·zoom 1.2·Guide 접힘). Qwen3-TTS/Voicebox(둘 다 TTS라 전사 아님)·Qwen3-ASR(서버/API 필요)·Purfview standalone(로컬 exe) 조사 후 “브라우저 무료 한국어 전사는 한계 → 붙여넣기 권장” 결론. Playwright 9/9. **P1만 적용 — 확산 미완.**
- **2026-06-17 (v1.2):** 초급자 **학습 레이어 7개 앱 전체 확산** + 단계 간 연동 동선(P5→P6·P6↔P7·P7→P3 순환) 완성. 진행 중 **Babel automatic-runtime 렌더 깨짐**(7개 전체 스피너 무한)을 발견해 `Babel.registerPreset`으로 classic runtime 강제해 수정(v1.11). Playwright 기능검증을 앱별 통과·보관함 7앱 공유 end-to-end·smoke 28/28 확인. 버전 흐름: v1.1 학습레이어 도입 → v1.11 babel 수정 → v1.12 P1 완성 → v1.2 7앱 확산. 다음: 실무 MVP 고도화(Phase 5).
- **2026-06-17 (v1.01):** `05_` 귀속 후 발견된 **퍼소나 링크 경로 깨짐** 수정(`../../../`→`../`, index·P2 2곳). 스모크 28/28 재확인. 이 영구 상세 핸드오프 신규 작성. (앞서 자동 훅이 상세본을 덮어쓴 사고를 영구 파일 분리로 해소.)
- **2026-06-17 (v1.0):** 원본(`_desktop_…/260615_UX디자인프로세스/`)에서 이 폴더로 귀속(복사), 원본 삭제(사용자 승인). 정본 확정.
- **이전 세션들(원본 위치, 요약):** Figma 참조로 시작 → 29개 자동화 포인트 분석 → "프롬프트 래퍼"가 아닌 실제 자동화로 방향 전환 → P1~P7 7개 스튜디오 단계 제작(전사·임베딩·PDF·통계·diff 등 브라우저 처리 내장) → 각 도구 학습자료급 Guide 확장 → 보관함으로 산출물 연결 → 스모크 테스트(28/28) 구축. 상세 원문 로그는 자동 훅 타임라인과 `logs/`.

---
*SSOT: 버전·이력=[VERSION.md](VERSION.md) · 사용자 안내=[README.md](README.md) · 세션 자동 타임라인=[HANDOFF.md](HANDOFF.md)(자동 생성, 손대지 말 것).*
