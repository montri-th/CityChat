const root = document.documentElement;
const allowedThemes = ["system", "light", "dark"];
const allowedLocales = ["th", "en"];
const allowedModes = ["story", "scan", "officer"];
const allowedViews = ["baseline", "assisted"];
const allowedScanStates = ["signal", "no-score", "locked"];

const query = new URLSearchParams(window.location.search);
const state = {
  theme: allowedThemes.includes(query.get("theme")) ? query.get("theme") : (root.dataset.themePreference || "system"),
  locale: allowedLocales.includes(query.get("lang")) ? query.get("lang") : (root.dataset.locale || "th"),
  mode: allowedModes.includes(query.get("mode")) ? query.get("mode") : "story",
  view: allowedViews.includes(query.get("view")) ? query.get("view") : "assisted",
  scan: allowedScanStates.includes(query.get("scan")) ? query.get("scan") : "signal",
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
      story: "เปิด Direct Story แล้ว",
      scan: "เปิด CityScan conceptual fixture แล้ว",
      officer: "เปิด Officer target fixture แล้ว"
    },
    view: {
      baseline: "แสดงมุมมองที่ยังไม่ align โดยคงข้อเท็จจริงเดิม",
      assisted: "แสดงมุมมอง Intent-led โดยคงข้อเท็จจริงเดิม"
    },
    scan: {
      signal: "SIGNAL_READY แบบตัวอย่าง ไม่มีข้อมูลจริง",
      "no-score": "NO_SCORE แบบตัวอย่าง หมายถึงข้อมูลไม่พอ ไม่ใช่ศูนย์",
      locked: "LOCKED ใน local fixture เท่านั้น ไม่ใช่ product persistence"
    },
    genericAck: "Demonstration only — ปุ่มนี้ไม่ทำให้เกิดผลและไม่สร้าง receipt",
    lockStory: "เปิด Story จาก DEMO-LOCK-001 แล้ว — local fixture เท่านั้น",
    copied: "คัดลอกแล้ว",
    copyFailed: "คัดลอกอัตโนมัติไม่ได้ กรุณาเปิดไฟล์ดาวน์โหลดแล้วคัดลอกข้อความ",
    preflightReady: "ตอบ preflight ครบ 6 ข้อแล้ว — ยังต้องผ่าน release gates ที่เกี่ยวข้อง",
    preflightProgress: count => `ตอบ preflight แล้ว ${count} จาก 6 ข้อ`
  },
  en: {
    themes: { system: "Theme: system", light: "Theme: light", dark: "Theme: dark" },
    localeButton: "TH",
    mode: {
      story: "Direct Story fixture opened",
      scan: "CityScan conceptual fixture opened",
      officer: "Officer target fixture opened"
    },
    view: {
      baseline: "Needs-alignment view shown with the facts unchanged",
      assisted: "Intent-led view shown with the facts unchanged"
    },
    scan: {
      signal: "Sample SIGNAL_READY; no real data is present",
      "no-score": "Sample NO_SCORE means insufficient data, not zero",
      locked: "LOCKED in local fixture state only; not product persistence"
    },
    genericAck: "Demonstration only — this control creates no effect or receipt",
    lockStory: "Story opened from DEMO-LOCK-001 — local fixture only",
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
  syncUrl();
}

function applyLocale({ persist = false, announceChange = false } = {}) {
  root.dataset.locale = state.locale;
  root.lang = state.locale;
  document.title = state.locale === "th"
    ? "CityChat Design Identity Playground v0.4"
    : "CityChat Design Identity Playground v0.4";
  if (persist) localStorage.setItem("citychat-playground-locale", state.locale);
  if (localeButton) {
    localeButton.textContent = t().localeButton;
    localeButton.setAttribute("aria-label", state.locale === "th" ? "เปลี่ยนเป็น English" : "Switch to Thai");
  }
  applyTheme();
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
  const storyMeta = document.querySelector("[data-story-view='story'] .technical.meta");
  if (storyMeta) {
    storyMeta.textContent = state.storyOrigin === "lock"
      ? "LOCKED SCAN ORIGIN · DEMO-LOCK-001 · local fixture"
      : "DIRECT CITYSTORY · PLACE-DEMO-01 · v1";
  }
  if (announceChange) announce(t().mode[state.mode]);
  syncUrl();
}

function applyScan({ announceChange = false } = {}) {
  document.querySelectorAll("[data-scan-state]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.scanState === state.scan));
  });
  const frame = document.querySelector(".scan-frame");
  if (frame) frame.dataset.activeScanState = state.scan;
  const label = document.querySelector(".scan-state-label");
  if (label) {
    const base = {
      signal: "SIGNAL_READY · demonstration only",
      "no-score": "NO_SCORE · demonstration only",
      locked: "LOCKED · DEMO-LOCK-001 · local fixture only"
    };
    label.textContent = base[state.scan];
  }
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

document.querySelector("#open-story-from-lock")?.addEventListener("click", () => {
  state.scan = "locked";
  state.storyOrigin = "lock";
  state.mode = "story";
  applyScan();
  applyMode();
  const note = document.querySelector("#lock-note");
  if (note) note.textContent = t().lockStory;
  announce(t().lockStory);
  document.querySelector("[data-story-view='story']")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
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
  const checked = preflightInputs.map((input, index) => `${input.checked ? "[x]" : "[ ]"} ${index + 1}`);
  const text = [
    "CityChat 60-second preflight",
    ...checked,
    "Resolve: person/object/intent · one LDS profile · evidence/claim ceiling · authority/evidence/delivery/authorization · action/effect/recovery · tested matrix",
    "Boundary: completing this list is not release or compliance certification."
  ].join("\n");
  copyText(text, document.querySelector("#copy-status"));
});

document.querySelector("#copy-prompt")?.addEventListener("click", () => {
  const text = "Build one CityChat [page/flow] for [person] doing [one job] with governed object [ID/version]. Use the exact vendored Landometer v0.9.0 package and one LDS profile. Keep productAuthority, capabilityEvidenceStatus, deliveryAvailability, authorizationDecision, claim/value and workflow truth separate. StoryCell = 1 signal + up to 3 facts + 1 question + 0–1 safe action. Omit unavailable controls; never simulate persistence, official status, liveness or counts. Return Build Card, state inventory, disabled capabilities, tests and manual gates.";
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
