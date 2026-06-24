/* =====================================================================
   common.js · UX×AX 자동화 도구 공통 평문 로직 (file:// 안전, 무빌드)
   - babel(JSX) 스크립트보다 먼저 로드되어 window.UXAX 네임스페이스로 노출됨.
   - ★ 이름 충돌 방지: 각 HTML의 babel 스크립트가 이미 선언한 전역
     (WS_KEY·wsAdd·load·save·MODELS·WHISPER_MODELS 등)은 여기서 재선언하지 않음.
     전부 window.UXAX.* 로만 노출 → const 중복선언 SyntaxError 회피.
   - 제작일 2026-06-18 · v1.5 라운드(P1 기준 모델 재설계)에서 도입.
   ===================================================================== */
(function () {
  "use strict";
  var NS = (window.UXAX = window.UXAX || {});

  /* ---------- 저장 유틸 ---------- */
  var PROJECT_KEY = "uxax_project_v1";       // 프로젝트 한 권(dossier)
  var LEGACY_BRIEF = "uxax_project_brief_v1"; // 기존 P0 위저드가 쓰던 키
  function _load(k, fb) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } }
  function _save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function _uid(p) { return (p || "x") + "_" + Math.random().toString(36).slice(2, 9); }
  function _now() { try { return new Date().toLocaleString("ko-KR"); } catch (e) { return ""; } }

  /* ---------- 슬롯 레지스트리: 슬롯id → 어디서 만듦/어디 쓰임 ---------- */
  NS.SLOT_REGISTRY = {
    "P0.brief":      { phase: "P0", phaseName: "프로젝트 정의", task: "프로젝트 브리프", next: "P1.interview", nextLabel: "P1 리서치" },
    "P1.interview":  { phase: "P1", phaseName: "리서치", task: "인터뷰 텍스트화·요약", next: "P2.affinity", nextLabel: "P2 정의 · 어피니티" },
    "P1.survey":     { phase: "P1", phaseName: "리서치", task: "설문 자유응답 분류", next: "P2.affinity", nextLabel: "P2 정의 · 어피니티" },
    "P1.voc":        { phase: "P1", phaseName: "리서치", task: "리뷰·VOC 묶기", next: "P2.hmw", nextLabel: "P2 정의 · HMW" },
    "P1.desk":       { phase: "P1", phaseName: "리서치", task: "데스크 리서치 브리프", next: "P2.hmw", nextLabel: "P2 정의 · HMW" },
    "P1.guide":      { phase: "P1", phaseName: "리서치", task: "인터뷰 가이드", next: "P1.interview", nextLabel: "P1 인터뷰(이 가이드로 진행 후)" },
    "P2.affinity":   { phase: "P2", phaseName: "정의", task: "어피니티 클러스터링(관찰 묶기)", next: "P2.hmw", nextLabel: "P2 정의 · HMW" },
    "P2.journey":    { phase: "P2", phaseName: "정의", task: "사용자 여정맵", next: "P3.idea", nextLabel: "P3 아이디에이션" },
    "P2.hmw":        { phase: "P2", phaseName: "정의", task: "인사이트 → HMW·POV", next: "P3.idea", nextLabel: "P3 아이디에이션" },
    "P2.prd":        { phase: "P2", phaseName: "정의", task: "요구사항(PRD) 초안", next: "P3.priority", nextLabel: "P3 우선순위" }
  };

  /* ---------- 프로젝트 dossier ---------- */
  function _blankProject() {
    return { id: _uid("prj"), name: "", type: "", brief: {}, slots: {}, gates: {}, mentorLog: [], createdAt: _now(), updatedAt: _now() };
  }
  // 기존 P0 브리프(uxax_project_brief_v1)가 있으면 dossier로 1회 마이그레이션
  function _migrate(p) {
    try {
      var old = _load(LEGACY_BRIEF, null);
      if (old && old.data && Object.keys(old.data).length) {
        if (!p.brief || !Object.keys(p.brief).length) p.brief = old.data;
        if (!p.name && old.data.name) p.name = old.data.name;
        if (!p.type && old.type) p.type = old.type;
      }
    } catch (e) {}
    return p;
  }
  function loadProject() {
    var p = _load(PROJECT_KEY, null);
    if (!p) { p = _migrate(_blankProject()); _save(PROJECT_KEY, p); }
    if (!p.slots) p.slots = {};
    if (!p.gates) p.gates = {};
    if (!p.mentorLog) p.mentorLog = [];
    return p;
  }
  function saveProject(p) { p.updatedAt = _now(); return _save(PROJECT_KEY, p); }
  function ensureProject() { return loadProject(); }

  function setBrief(brief, opts) {
    var p = loadProject();
    p.brief = brief || {};
    if (opts && opts.name != null) p.name = opts.name;
    if (opts && opts.type != null) p.type = opts.type;
    saveProject(p);
    return p;
  }
  function getBrief() { var p = loadProject(); return p.brief || {}; }

  // payload: {data, md, meta, status}
  // 근거 추적 메타 기본값(심층리뷰 반영): source_id / source_type / confidence / human_confirmed / used_in_phase
  function _defMeta() { return { source_id: null, source_type: null, confidence: null, human_confirmed: false, used_in_phase: [] }; }
  function setSlot(id, payload) {
    var p = loadProject();
    var prev = p.slots[id] || {};
    var typeFromId = (String(id).split(".")[1]) || null; // 예: "P1.survey" → "survey"
    var slot = {
      status: (payload && payload.status) || "done",
      data: payload && "data" in payload ? payload.data : prev.data,
      md: payload && "md" in payload ? payload.md : prev.md,
      meta: Object.assign(_defMeta(), { source_type: typeFromId }, prev.meta, payload && payload.meta, { at: _now() })
    };
    p.slots[id] = slot;
    saveProject(p);
    return slot;
  }
  // 사람이 결과를 검수·확정했음을 표시(AI가 제안, 사람이 결정 — 근거 추적)
  function confirmSlot(id, on) {
    var p = loadProject(); var s = p.slots[id]; if (!s) return null;
    s.meta = Object.assign(_defMeta(), s.meta, { human_confirmed: on !== false, at: _now() });
    p.slots[id] = s; saveProject(p); return s;
  }
  function getSlot(id) { var p = loadProject(); return p.slots[id] || null; }
  function listSlots() { var p = loadProject(); return p.slots || {}; }

  /* ---------- 판단 게이트(단계 점검) ----------
     심층리뷰 반영: "이 단계 시작/마무리해도 되나"를 6칸으로 스스로 점검 → 초급자가 판단을 배움.
     - text 칸(목표/합격선/멈춤): 사람이 적음(게이트 상태에 저장).
     - auto 칸(입력충족/사람검수/비용·환경): dossier에서 자동 판정 → ✓/⚠ + 이유.
     gate 상태: dossier.gates[phase] = { goal, passLine, stopWhen, confirmed, at } */
  NS.GATE_FIELDS = [
    { key: "goal",     icon: "🎯", label: "이 단계 목표",   kind: "text", help: "여기서 무엇을 만들어 무엇을 얻나? 한 줄. 흐릿하면 결과도 흐릿해져요.", ph: "예: 인터뷰·설문에서 '첫 거래 불안'의 구체 맥락과 빈도를 뽑는다" },
    { key: "inputs",   icon: "📥", label: "입력 충족",       kind: "auto", help: "이 단계를 시작할 재료(앞 단계 산출물)가 준비됐는지." },
    { key: "passLine", icon: "✅", label: "합격선(정량)",    kind: "text", help: "무엇이 되면 '제대로 했다'인지 숫자로. 끝을 정해두면 과·미달을 안 함.", ph: "예: 인터뷰 5건 텍스트화 + 주제 6개 이상, 설문 100건 분류 완료" },
    { key: "stopWhen", icon: "⛔", label: "멈춤 조건",       kind: "text", help: "여기까지 하면 멈추고 다음으로. 끝없이 파지 않게.", ph: "예: 새 인터뷰에서 더 새로운 주제가 안 나오면(포화) 멈춘다" },
    { key: "humanOk",  icon: "🧑‍⚖️", label: "사람 검수",      kind: "auto", help: "AI 결과를 사람이 한 번 확인했는지. AI는 제안, 결정은 사람." },
    { key: "costEnv",  icon: "⚙️", label: "비용·환경",       kind: "auto", help: "이 단계 도구가 무료/내 환경에서 도는지." }
  ];
  function _filled(obj, keys) { return keys.filter(function (k) { return obj && obj[k] && String(obj[k]).trim(); }); }
  // 자동 판정 3칸: { inputs:{ok,why}, humanOk:{ok,why}, costEnv:{ok,why} }
  function deriveGate(phase) {
    var p = loadProject(), brief = p.brief || {}, slots = p.slots || {}, res = {};
    if (phase === "P1") {
      var need = ["name", "oneline", "users", "success"], have = _filled(brief, need);
      res.inputs = { ok: have.length >= 2 && !!(brief.name && String(brief.name).trim()),
        why: have.length ? ("프로젝트 정의 " + have.length + "/" + need.length + "칸 채움" + (brief.name ? "" : " · 이름 비어 있음")) : "P0 프로젝트 정의가 비어 있어요 — 홈에서 먼저 정의하세요" };
    } else {
      var curN = parseInt(String(phase).replace(/\D/g, ""), 10) || 0;
      var priorIds = Object.keys(slots).filter(function (id) { var m = String(id).match(/^P(\d+)\./); return m && parseInt(m[1], 10) < curN; });
      res.inputs = { ok: priorIds.length > 0, why: priorIds.length ? ("앞 단계 산출물 " + priorIds.length + "개 있음") : "앞 단계(예: P1 리서치) 산출물이 없어요 — 먼저 만들고 오세요" };
    }
    var ps = Object.keys(slots).filter(function (id) { return id.indexOf(phase + ".") === 0; });
    var conf = ps.filter(function (id) { return slots[id].meta && slots[id].meta.human_confirmed; });
    res.humanOk = { ok: ps.length > 0 && conf.length === ps.length,
      why: ps.length ? (conf.length + "/" + ps.length + "개 산출물 검수됨" + (conf.length === ps.length ? "" : " · 남은 건 '내가 검수함' 표시")) : "아직 만든 산출물이 없어요" };
    res.costEnv = { ok: true, why: "전부 무료 · 브라우저 안에서 처리(유료 API는 선택 시에만)" };
    return res;
  }
  function getGate(phase) { var p = loadProject(); return (p.gates && p.gates[phase]) || {}; }
  function setGate(phase, patch) { var p = loadProject(); p.gates = p.gates || {}; p.gates[phase] = Object.assign({}, p.gates[phase], patch, { at: _now() }); saveProject(p); return p.gates[phase]; }

  /* ---------- 멘토 학습 로그 ---------- */
  function mentorAdd(page, q, a) {
    var p = loadProject();
    p.mentorLog.unshift({ id: _uid("m"), page: page || "", q: String(q || ""), a: String(a || ""), at: _now() });
    p.mentorLog = p.mentorLog.slice(0, 200);
    saveProject(p);
  }
  function mentorLoad() { return loadProject().mentorLog || []; }
  function mentorClear() { var p = loadProject(); p.mentorLog = []; saveProject(p); }

  /* ---------- 작업별 AI 모델 라우팅 ----------
     task: "transcribe" | "ko_generate" | "embed"
     반환: { whisper, ollama, api, note } 중 task에 맞는 권장값
     - 전사: 최고 정확도 whisper(large-v3-turbo)
     - 한국어 생성(요약·코딩·HMW·가이드): 로컬이면 EXAONE 우선, API면 균형 모델
  */
  NS.WHISPER_BEST = "onnx-community/whisper-large-v3-turbo";
  NS.KO_OLLAMA_MODEL = "exaone3.5:7.8b";   // 한국어 맥락 강함(LG EXAONE)
  NS.KO_API_MODEL = "claude-sonnet-4-6";   // API 백엔드 한국어 생성 기본(균형)
  function pickModel(task, settings) {
    settings = settings || {};
    if (task === "transcribe") return { whisper: NS.WHISPER_BEST, note: "한국어 정확도 최우선" };
    if (task === "ko_generate") {
      if (settings.backend === "ollama") return { ollama: NS.KO_OLLAMA_MODEL, note: "한국어 맥락엔 EXAONE 권장" };
      if (settings.backend === "api") return { api: NS.KO_API_MODEL, note: "균형 모델" };
      return { note: "현재 엔진 사용" };
    }
    return { note: "브라우저 내 처리" };
  }

  /* ---------- 프롬프트 중앙 저장소(드리프트 방지) ----------
     7파일에 복제되던 LLM 프롬프트 '본문'을 한곳에 모음. 각 앱은 데이터 정형만 하고
     UXAX.PROMPTS.* 를 호출. (현재는 P1 프롬프트. P2~P7은 확산 라운드에서 추가.)
     ※ 함수는 정형된 문자열을 받음 → 도메인 의존(fmtTime 등)은 호출부(앱)에 남김. */
  NS.PROMPTS = {
    SYS_RESEARCH: "당신은 20년 경력의 시니어 UX 리서처/정성데이터 분석가입니다. 근거에 기반해 한국어로 구체적이고 실무적으로 응답합니다. 인용은 원문을 유지하고, 통계를 지어내지 않습니다.",
    interviewSummary: function (trans, ctx) {
      return `아래 타임스탬프 인터뷰 전사록을 분석해 JSON으로만 응답하세요(설명·코드펜스 없이).${ctx ? "\n[리서치 맥락] " + ctx : ""}
{ "themes":[{"tag":"주제","points":["핵심 발언 요약"]}], "summary":"3~4문장 요약", "quotes":[{"text":"원문 인용","timestamp":"mm:ss","speaker":"화자"}], "followups":["후속 질문"] }
규칙: themes 3~6개, quotes 3~6개(전사록에 실제 있는 표현만), 모두 한국어.

[전사록]
${trans}`;
    },
    surveyCodebook: function (samplesText, hint) {
      return `아래 설문 개방형 응답에서 반복 주제를 6~12개 코드로 정의(코드북)하세요.${hint ? "\n참고 기준: " + hint : ""}
JSON만: { "codebook":[{"code":"코드명","desc":"정의 한 줄"}] }

[응답 샘플]
${samplesText}`;
    },
    surveyCoding: function (codebookText, respText) {
      return `아래 코드북으로 각 응답을 코딩(코드 1개+ , 감성 pos/neu/neg)하세요. 코드는 코드북 code만 사용.
[코드북]
${codebookText}
JSON만(입력 id 유지): { "coded":[{"id":"id","codes":["코드"],"sentiment":"pos|neu|neg"}] }

[응답]
${respText}`;
    },
    vocLabel: function (membersText) {
      return `아래 의미적으로 묶인 리뷰 묶음을 분석하세요.
JSON만: { "topic":"핵심 주제(짧게)", "sentiment":"긍정|중립|부정", "summary":"한 줄 요약", "quotes":["대표 인용1","대표 인용2"] }

[리뷰 묶음]
${membersText}`;
    },
    vocPriority: function (clusterText) {
      return `아래 VOC 군집 요약으로 개선 우선순위 Top 5를 근거와 함께.
JSON만: { "priorities":[{"title":"개선 항목","why":"근거(군집/빈도)","impact":"상|중|하"}] }

[군집 요약]
${clusterText}`;
    },
    deskBrief: function (question, contexts) {
      return `아래 [자료]만 근거로 "${question}"에 답하는 리서치 브리프를 작성하세요. 각 주장에는 반드시 출처 [S번호]를 답니다. 자료에 없는 내용은 지어내지 말고 gaps에 적으세요.
JSON만: { "findings":[{"claim":"발견(주장)","source":"[S1] 문서명"}], "comparison":"자료 간 일치/상충 비교", "gaps":["추가 조사 필요 항목"] }

[자료]
${contexts}`;
    },
    guide: function (goal, participant, hyp, dur) {
      return `"${goal}"을 위한 1:1 사용자 인터뷰 가이드를 작성하세요. 대상: ${participant || "(미정)"}.${hyp ? " 가설: " + hyp : ""}
유도/이중 질문을 피하고 개방형으로. JSON만:
{ "sections":[{"name":"섹션명","questions":[{"q":"질문","probes":["후속 질문"]}]}], "time_plan":"${dur}분 기준 섹션별 시간 배분", "bias_notes":["주의할 유도질문/편향 코멘트"] }
섹션은 도입(라포)→핵심→마무리 구조, 핵심 질문 8~10개. 모두 한국어.`;
    }
  };

  /* ---------- 노출 ---------- */
  NS.PROJECT_KEY = PROJECT_KEY;
  NS.loadProject = loadProject;
  NS.saveProject = saveProject;
  NS.ensureProject = ensureProject;
  NS.setBrief = setBrief;
  NS.getBrief = getBrief;
  NS.setSlot = setSlot;
  NS.confirmSlot = confirmSlot;
  NS.getSlot = getSlot;
  NS.listSlots = listSlots;
  NS.getGate = getGate;
  NS.setGate = setGate;
  NS.deriveGate = deriveGate;
  NS.mentorAdd = mentorAdd;
  NS.mentorLoad = mentorLoad;
  NS.mentorClear = mentorClear;
  NS.pickModel = pickModel;
  NS._uid = _uid;
  NS._now = _now;
})();
