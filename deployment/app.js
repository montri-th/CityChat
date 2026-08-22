const root = document.documentElement;
const allowedThemes = ["system", "light", "dark"];
const allowedLocales = ["th", "en"];
const allowedModes = ["story", "return", "scan", "officer"];
const allowedViews = ["baseline", "assisted"];
const allowedScanStates = ["no-score", "signal", "locked"];

const query = new URLSearchParams(window.location.search);
const state = {
  theme: allowedThemes.includes(query.get("theme")) ? query.get("theme") : (root.dataset.themePreference || "system"),
  locale: allowedLocales.includes(query.get("lang")) ? query.get("lang") : (root.dataset.locale || "th"),
  mode: allowedModes.includes(query.get("mode")) ? query.get("mode") : "story",
  view: allowedViews.includes(query.get("view")) ? query.get("view") : "assisted",
  scan: allowedScanStates.includes(query.get("scan")) ? query.get("scan") : "no-score",
  storyOrigin: "direct"
};

const themeButton = document.querySelector("#theme-cycle");
const localeButton = document.querySelector("#locale-cycle");
const journeyStage = document.querySelector("#journey-stage");
const liveRegion = document.createElement("div");
liveRegion.className = "visually-hidden";
liveRegion.setAttribute("role", "status");
liveRegion.setAttribute("aria-live", "polite");
liveRegion.setAttribute("aria-atomic", "true");
document.body.append(liveRegion);

const words = {
  th: {
    themes: { system: "ธีม: ระบบ", light: "ธีม: สว่าง", dark: "ธีม: มืด" },
    localeButton: "EN",
    mode: {
      story: "เปิดตัวอย่างเห็นคุณค่าก่อนแล้ว",
      return: "เปิดตัวอย่างส่งแล้วและกลับมาแล้ว",
      scan: "เปิดตัวอย่างดูพื้นที่แล้ว",
      officer: "เปิดตัวอย่างสำหรับเจ้าหน้าที่แล้ว"
    },
    view: {
      baseline: "แสดงแบบที่ยังต้องปรับ โดยใช้ข้อมูลเดิม",
      assisted: "แสดงแนวทาง v0.6 โดยใช้ข้อมูลเดิม"
    },
    scan: {
      signal: "กำลังดูหน้าตาสมมติเมื่อข้อมูลพร้อม ยังไม่เชื่อมข้อมูลจริง",
      "no-score": "ข้อมูลไม่พอ จึงยังคำนวณไม่ได้ และไม่ใช่ศูนย์",
      locked: "กำลังดูหน้าตาสมมติเมื่อเก็บกรอบแล้ว ยังไม่ได้บันทึกเข้าสู่ระบบ"
    },
    genericAck: "ปุ่มตัวอย่างนี้ยังไม่พาไปหน้าอื่น",
    answerOptionsOpen: "เปิดตัวเลือกคำตอบสำหรับดูรูปแบบแล้ว ยังไม่มีการส่งหรือบันทึกข้อมูล",
    answerOptionsClosed: "ปิดตัวเลือกคำตอบแล้ว",
    lockStory: "เปิดเรื่องจากกรอบตัวอย่างแล้ว ข้อมูลยังอยู่เฉพาะหน้านี้",
    demoAction: "ปุ่มทำงานแล้วในหน้านี้ · ไม่มีการส่งหรือบันทึกข้อมูล",
    copied: "คัดลอกแล้ว",
    copyFailed: "คัดลอกอัตโนมัติไม่ได้ กรุณาเปิดไฟล์ดาวน์โหลดแล้วคัดลอกข้อความ",
    preflightReady: "ตอบ preflight ครบ 6 ข้อแล้ว — ยังต้องผ่าน release gates ที่เกี่ยวข้อง",
    preflightProgress: count => `ตอบ preflight แล้ว ${count} จาก 6 ข้อ`
  },
  en: {
    themes: { system: "Theme: system", light: "Theme: light", dark: "Theme: dark" },
    localeButton: "TH",
    mode: {
      story: "First-value example opened",
      return: "Saved-and-return example opened",
      scan: "Place exploration example opened",
      officer: "Officer example opened"
    },
    view: {
      baseline: "Needs-refinement view shown with the same facts",
      assisted: "v0.6 direction shown with the same facts"
    },
    scan: {
      signal: "Previewing a hypothetical ready state; it is not connected to real data",
      "no-score": "There is not enough data to calculate a result; this is not zero",
      locked: "Previewing a hypothetical kept frame; it has not been saved to a system"
    },
    genericAck: "This example button does not open another page yet",
    answerOptionsOpen: "Answer choices opened for preview; nothing is sent or saved",
    answerOptionsClosed: "Answer choices closed",
    lockStory: "Story opened from the sample frame; the state remains on this page",
    demoAction: "The control worked locally · nothing was sent or persisted",
    copied: "Copied",
    copyFailed: "Automatic copy was unavailable. Open the downloadable file and copy the text.",
    preflightReady: "All six preflight questions are answered; applicable release gates still remain",
    preflightProgress: count => `${count} of 6 preflight questions answered`
  }
};

function t() {
  return words[state.locale];
}

function announce(message) {
  liveRegion.textContent = "";
  window.requestAnimationFrame(() => {
    liveRegion.textContent = message;
  });
}

function setBilingualText(node, th, en) {
  if (!node) return;
  const thNode = node.querySelector("[data-th]");
  const enNode = node.querySelector("[data-en]");
  if (thNode) thNode.textContent = th;
  if (enNode) enNode.textContent = en;
}

function resolvedTheme(preference = state.theme) {
  if (preference !== "system") return preference;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function syncUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", state.locale);
  url.searchParams.set("theme", state.theme);
  url.searchParams.set("mode", state.mode);
  url.searchParams.set("view", state.view);
  if (state.mode === "scan") url.searchParams.set("scan", state.scan);
  else url.searchParams.delete("scan");
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function applyTheme({ persist = false, announceChange = false } = {}) {
  const resolved = resolvedTheme();
  root.dataset.themePreference = state.theme;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  if (persist) localStorage.setItem("citychat-playground-theme", state.theme);
  if (themeButton) {
    const label = t().themes[state.theme];
    themeButton.querySelectorAll("[data-th], [data-en]").forEach(node => {
      node.textContent = label;
    });
    themeButton.setAttribute("aria-label", label);
  }
  if (announceChange) announce(t().themes[state.theme]);
  updateColorTokenValues();
  syncUrl();
}

function applyLocale({ persist = false, announceChange = false } = {}) {
  root.dataset.locale = state.locale;
  root.lang = state.locale;
  document.title = "CityChat VES Interactive Playground v0.6.1";
  if (persist) localStorage.setItem("citychat-playground-locale", state.locale);
  if (localeButton) {
    localeButton.textContent = t().localeButton;
    localeButton.setAttribute("aria-label", state.locale === "th" ? "เปลี่ยนเป็น English" : "Switch to Thai");
  }
  applyTheme();
  applyScan();
  updatePreflight();
  if (announceChange) announce(state.locale === "th" ? "เปลี่ยนเป็นภาษาไทยแล้ว" : "Language changed to English");
  syncUrl();
}

function applyView({ announceChange = false } = {}) {
  journeyStage.dataset.clarity = state.view;
  document.querySelectorAll("[data-clarity-choice]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.clarityChoice === state.view));
  });
  document.querySelectorAll("[data-specimen]").forEach(specimen => {
    specimen.hidden = specimen.dataset.specimen !== state.view;
  });
  if (announceChange) announce(t().view[state.view]);
  syncUrl();
}

function applyMode({ announceChange = false, focusTab = false } = {}) {
  journeyStage.dataset.mode = state.mode;
  document.querySelectorAll("[data-mode-choice]").forEach(button => {
    const selected = button.dataset.modeChoice === state.mode;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && focusTab) button.focus();
  });
  document.querySelectorAll("[data-story-view]").forEach(view => {
    view.hidden = view.dataset.storyView !== state.mode;
  });
  const lockOrigin = document.querySelector("[data-lock-origin]");
  if (lockOrigin) lockOrigin.hidden = !(state.mode === "story" && state.storyOrigin === "lock");
  if (announceChange) announce(t().mode[state.mode]);
  syncUrl();
}

function applyScan({ announceChange = false } = {}) {
  document.querySelectorAll("[data-scan-state]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.scanState === state.scan));
  });
  const frame = document.querySelector(".scan-composition");
  if (frame) frame.dataset.activeScanState = state.scan;
  const label = document.querySelector(".scan-state-label");
  const labels = {
    signal: {
      th: "หน้าตาสมมติเมื่อข้อมูลพร้อม · ยังไม่เชื่อมข้อมูลจริง",
      en: "Hypothetical ready layout · not connected to real data"
    },
    "no-score": {
      th: "ข้อมูลไม่พอ · ยังไม่แสดงผลและไม่ถือว่าเป็นศูนย์",
      en: "Not enough data · no result is shown and this is not zero"
    },
    locked: {
      th: "หน้าตาสมมติเมื่อเก็บกรอบแล้ว · ยังไม่ได้บันทึกเข้าสู่ระบบ",
      en: "Hypothetical kept-frame layout · not saved to a system"
    }
  };
  setBilingualText(label, labels[state.scan].th, labels[state.scan].en);
  const storyButton = document.querySelector("#open-story-from-lock");
  if (storyButton) storyButton.hidden = state.scan !== "locked";
  if (announceChange) announce(t().scan[state.scan]);
  syncUrl();
}

themeButton?.addEventListener("click", () => {
  const next = (allowedThemes.indexOf(state.theme) + 1) % allowedThemes.length;
  state.theme = allowedThemes[next];
  applyTheme({ persist: true, announceChange: true });
});

localeButton?.addEventListener("click", () => {
  state.locale = state.locale === "th" ? "en" : "th";
  applyLocale({ persist: true, announceChange: true });
});

window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
  if (state.theme === "system") applyTheme();
});

document.querySelectorAll("[data-clarity-choice]").forEach(button => {
  button.addEventListener("click", () => {
    state.view = button.dataset.clarityChoice;
    applyView({ announceChange: true });
  });
});

const modeButtons = [...document.querySelectorAll("[data-mode-choice]")];
modeButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.modeChoice;
    state.storyOrigin = state.mode === "story" ? "direct" : state.storyOrigin;
    applyMode({ announceChange: true });
  });
  button.addEventListener("keydown", event => {
    let nextIndex = null;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % modeButtons.length;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + modeButtons.length) % modeButtons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = modeButtons.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    state.mode = modeButtons[nextIndex].dataset.modeChoice;
    applyMode({ announceChange: true, focusTab: true });
  });
});

document.querySelectorAll("[data-scan-state]").forEach(button => {
  button.addEventListener("click", () => {
    state.scan = button.dataset.scanState;
    applyScan({ announceChange: true });
  });
});

document.querySelector("[data-local-ack='generic']")?.addEventListener("click", () => {
  const output = document.querySelector("[data-local-ack-output='generic']");
  if (output) output.textContent = t().genericAck;
  announce(t().genericAck);
});

document.querySelector("#preview-answer-options")?.addEventListener("click", event => {
  const panel = document.querySelector("#answer-options");
  if (!panel) return;
  const open = panel.hidden;
  panel.hidden = !open;
  event.currentTarget.setAttribute("aria-expanded", String(open));
  announce(open ? t().answerOptionsOpen : t().answerOptionsClosed);
});

document.querySelector("#open-story-from-lock")?.addEventListener("click", () => {
  if (state.scan !== "locked") return;
  state.storyOrigin = "lock";
  state.mode = "story";
  applyMode();
  const heading = document.querySelector("#story-result-heading");
  heading?.focus({ preventScroll: true });
  heading?.scrollIntoView({ block: "nearest", behavior: "auto" });
  announce(t().lockStory);
});

document.querySelector("#demo-action")?.addEventListener("click", () => {
  setBilingualText(document.querySelector("#demo-action-result"), words.th.demoAction, words.en.demoAction);
  announce(t().demoAction);
});

function updateColorTokenValues() {
  const styles = getComputedStyle(root);
  document.querySelectorAll("[data-color-token]").forEach(card => {
    const token = card.dataset.colorToken;
    const output = card.querySelector("[data-token-value]");
    if (!token || !output) return;
    output.textContent = styles.getPropertyValue(token).trim() || "unresolved";
  });
}

function settleRevealExamples() {
  document.querySelectorAll("[data-reveal-item].reveal").forEach(item => item.classList.remove("reveal"));
}

const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
function prepareRevealExamples() {
  const groups = [...document.querySelectorAll("[data-reveal-group]")];
  if (!groups.length || reducedMotionQuery?.matches || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const group = entry.target;
      observer.unobserve(group);
      if (group.dataset.revealComplete === "true" || reducedMotionQuery?.matches) return;
      group.dataset.revealComplete = "true";
      group.querySelectorAll(":scope > [data-reveal-item]").forEach(item => {
        item.classList.add("reveal");
        item.addEventListener("animationend", () => item.classList.remove("reveal"), { once: true });
      });
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  groups.forEach(group => observer.observe(group));
}

reducedMotionQuery?.addEventListener?.("change", event => {
  if (event.matches) settleRevealExamples();
});

const preflightInputs = [...document.querySelectorAll("#preflight-form input[type='checkbox']")];
function updatePreflight() {
  const count = preflightInputs.filter(input => input.checked).length;
  const countNode = document.querySelector("#preflight-count");
  if (countNode) countNode.textContent = `${count}/6`;
  const progress = count === 6 ? t().preflightReady : t().preflightProgress(count);
  document.querySelector(".preflight-progress")?.setAttribute("aria-label", progress);
  return { count, progress };
}

preflightInputs.forEach(input => {
  input.addEventListener("change", () => {
    const { progress } = updatePreflight();
    announce(progress);
  });
});

async function copyText(text, output) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      if (!ok) throw new Error("copy unavailable");
    }
    output.textContent = t().copied;
    announce(t().copied);
  } catch {
    output.textContent = t().copyFailed;
    announce(t().copyFailed);
  }
}

document.querySelector("#copy-preflight")?.addEventListener("click", () => {
  const questions = state.locale === "th"
    ? [
        "คนเห็นคุณค่าอะไรในช่วงแรก?",
        "ใช้โลโก้ พื้นผิว และฟอนต์ตามบทบาทหรือยัง?",
        "ข้อมูลมาจากไหน และยังบอกอะไรไม่ได้?",
        "สิ่งที่เห็นเปิดใช้จริงหรือยัง?",
        "กดแล้วเกิดอะไร บันทึกจริงไหม และพลาดแล้วกลับอย่างไร?",
        "คนกลับมาเพราะมีอะไรเปลี่ยนจริงหรือไม่?"
      ]
    : [
        "What first value does the person receive?",
        "Are identity, surface, and type roles correct?",
        "Where does the data come from, and what cannot it establish?",
        "Is the visible capability actually available?",
        "What happens, is it really saved, and how does it recover?",
        "Is a return caused by a material change?"
      ];
  const checked = preflightInputs.map((input, index) => `${input.checked ? "[x]" : "[ ]"} ${questions[index]}`);
  const text = [
    state.locale === "th" ? "CityChat: เช็ก 60 วินาที" : "CityChat 60-second preflight",
    ...checked,
    state.locale === "th"
      ? "ขอบเขต: การตอบครบช่วยเตรียมงาน แต่ยังไม่ใช่หลักฐานว่า release ผ่านทุก gate"
      : "Boundary: completing this list is preparation, not release certification."
  ].join("\n");
  copyText(text, document.querySelector("#copy-status"));
});

document.querySelector("#copy-prompt")?.addEventListener("click", () => {
  const text = "Build one CityChat [page or flow] for [citizen or officer] doing [one job]. Use approved CityChat VES v0.6 for composition, first value, living-city identity, civic continuity, motion application, and plain frontstage language. Use the approved owning product/state/effect source when one exists; CityChat Product Experience Profile v0.4 remains a draft dependency. Inherit exact visual foundations from the pinned Landometer v0.9.0 package. Show one place or matter, one honest meaning, one supported question when useful, and zero or one action with its expected consequence. Remember a contribution only after real persistence; invite a return only for a material change; otherwise show recovery or clean completion. Hide unavailable controls and never invent saved state, official status, liveness, counts, or outcomes. Return the Build Card, authority refs, visible states, blocked reasons, tests, and manual checks.";
  copyText(text, document.querySelector("#prompt-copy-status"));
});

document.querySelectorAll("a[href^='#']").forEach(link => {
  link.addEventListener("click", () => {
    const target = document.querySelector(link.getAttribute("href"));
    let ancestor = target?.parentElement;
    while (ancestor) {
      if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
      ancestor = ancestor.parentElement;
    }
  });
});

applyLocale();
applyView();
applyMode();
applyScan();
updatePreflight();
updateColorTokenValues();
prepareRevealExamples();
