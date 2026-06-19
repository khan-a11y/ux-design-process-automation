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
    "P1.guide":      { phase: "P1", phaseName: "리서치", task: "인터뷰 가이드", next: "P1.interview", nextLabel: "P1 인터뷰(이 가이드로 진행 후)" }
  };

  /* ---------- 프로젝트 dossier ---------- */
  function _blankProject() {
    return { id: _uid("prj"), name: "", type: "", brief: {}, slots: {}, mentorLog: [], createdAt: _now(), updatedAt: _now() };
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
  function setSlot(id, payload) {
    var p = loadProject();
    var prev = p.slots[id] || {};
    var slot = {
      status: (payload && payload.status) || "done",
      data: payload && "data" in payload ? payload.data : prev.data,
      md: payload && "md" in payload ? payload.md : prev.md,
      meta: Object.assign({}, prev.meta, payload && payload.meta, { at: _now() })
    };
    p.slots[id] = slot;
    saveProject(p);
    return slot;
  }
  function getSlot(id) { var p = loadProject(); return p.slots[id] || null; }
  function listSlots() { var p = loadProject(); return p.slots || {}; }

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

  /* ---------- 노출 ---------- */
  NS.PROJECT_KEY = PROJECT_KEY;
  NS.loadProject = loadProject;
  NS.saveProject = saveProject;
  NS.ensureProject = ensureProject;
  NS.setBrief = setBrief;
  NS.getBrief = getBrief;
  NS.setSlot = setSlot;
  NS.getSlot = getSlot;
  NS.listSlots = listSlots;
  NS.mentorAdd = mentorAdd;
  NS.mentorLoad = mentorLoad;
  NS.mentorClear = mentorClear;
  NS.pickModel = pickModel;
  NS._uid = _uid;
  NS._now = _now;
})();
