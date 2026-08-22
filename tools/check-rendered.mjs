#!/usr/bin/env node
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright is required for rendered checks. Install playwright@1.54.1 and Chromium.");
  process.exit(2);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deployment = path.join(root, "deployment");
const writeReport = process.argv.includes("--write");
const screenshotPath = process.argv.find(arg => arg.startsWith("--screenshot="))?.split("=").slice(1).join("=");
const checks = [];
let failures = 0;

function check(ok, name, detail = "") {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  if (!ok) {
    failures += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".yml": "text/yaml; charset=utf-8",
  ".yaml": "text/yaml; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2"
};

const server = createServer((request, response) => {
  const rawPath = decodeURIComponent(new URL(request.url, "http://local.test").pathname);
  let relative = rawPath.replace(/^\/+/, "") || "index.html";
  let absolute = path.resolve(deployment, relative);
  if (!absolute.startsWith(deployment)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  if (existsSync(absolute) && statSync(absolute).isDirectory()) {
    absolute = path.join(absolute, "index.html");
    relative = path.posix.join(relative, "index.html");
  }
  if (!existsSync(absolute)) {
    response.writeHead(404, { "content-type": "text/plain" }).end("Not found");
    return;
  }
  response.writeHead(200, {
    "content-type": mime[path.extname(relative)] || "application/octet-stream",
    "cache-control": "no-store"
  });
  response.end(readFileSync(absolute));
});

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}/`;
const bundledExecutable = chromium.executablePath();
const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || (!existsSync(bundledExecutable) && existsSync(systemChrome) ? systemChrome : undefined);
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });

try {
  const matrix = [
    { width: 320, height: 760, locale: "th", theme: "light" },
    { width: 360, height: 800, locale: "en", theme: "dark" },
    { width: 390, height: 844, locale: "th", theme: "dark" },
    { width: 768, height: 900, locale: "en", theme: "light" },
    { width: 1024, height: 900, locale: "th", theme: "light" },
    { width: 1440, height: 1000, locale: "en", theme: "dark" }
  ];

  for (const item of matrix) {
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height } });
    const responseFailures = [];
    page.on("response", response => {
      if (response.url().startsWith(baseUrl) && response.status() >= 400) responseFailures.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`${baseUrl}?lang=${item.locale}&theme=${item.theme}`, { waitUntil: "networkidle" });
    const metrics = await page.evaluate(() => ({
      htmlWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      h1Visible: Boolean(document.querySelector("h1")?.getClientRects().length),
      heroActionVisible: Boolean(document.querySelector(".hero-action")?.getClientRects().length),
      locale: document.documentElement.lang,
      theme: document.documentElement.dataset.theme,
      bodyFont: getComputedStyle(document.body).fontFamily,
      h2Font: getComputedStyle(document.querySelector("h2")).fontFamily,
      targetHeights: [...document.querySelectorAll("button, summary, .btn")]
        .filter(node => node.getClientRects().length)
        .map(node => ({ label: node.textContent.trim().slice(0, 40), height: node.getBoundingClientRect().height }))
    }));
    const key = `${item.width}-${item.locale}-${item.theme}`;
    check(responseFailures.length === 0, `render:${key}:assets-2xx`, responseFailures.join(" | "));
    check(metrics.htmlWidth <= metrics.clientWidth + 1, `render:${key}:no-horizontal-overflow`, `${metrics.htmlWidth}/${metrics.clientWidth}`);
    check(metrics.h1Visible && metrics.heroActionVisible, `render:${key}:first-viewport-content`);
    check(metrics.locale === item.locale && metrics.theme === item.theme, `render:${key}:locale-theme`);
    check(metrics.bodyFont.includes("Bai Jamjuree"), `render:${key}:body-font`, metrics.bodyFont);
    check(item.locale === "th" ? metrics.h2Font.includes("IBM Plex Sans Thai Looped") : metrics.h2Font.includes("Arvo"), `render:${key}:heading-font`, metrics.h2Font);
    const shortTargets = metrics.targetHeights.filter(target => target.height < 43.5);
    check(shortTargets.length === 0, `render:${key}:44px-controls`, shortTargets.slice(0, 3).map(target => `${target.label}:${target.height}`).join(" | "));
    await page.close();
  }

  const interactionPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await interactionPage.goto(`${baseUrl}?lang=th&theme=light`, { waitUntil: "networkidle" });
  await interactionPage.focus("#mode-story");
  await interactionPage.keyboard.press("ArrowRight");
  check(await interactionPage.getAttribute("#mode-scan", "aria-selected") === "true", "interaction:tab-arrow-navigation");
  await interactionPage.click('[data-scan-state="no-score"]');
  check(await interactionPage.getAttribute(".scan-frame", "data-active-scan-state") === "no-score", "interaction:no-score-state");
  await interactionPage.click("#open-story-from-lock");
  const lockHandoff = await interactionPage.textContent("[data-story-view='story'] .technical.meta");
  check(lockHandoff.includes("DEMO-LOCK-001") && lockHandoff.includes("local fixture"), "interaction:locked-fixture-handoff");
  for (const input of await interactionPage.$$("#preflight-form input[type='checkbox']")) await input.check();
  check(await interactionPage.textContent("#preflight-count") === "6/6", "interaction:preflight-progress");
  await interactionPage.click("#component-storycell").catch(() => {});
  if (screenshotPath) {
    await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story&view=assisted`, { waitUntil: "networkidle" });
    await interactionPage.screenshot({ path: screenshotPath, fullPage: true });
  }
  await interactionPage.close();

  const reduced = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(`${baseUrl}?lang=th&theme=dark`, { waitUntil: "networkidle" });
  const reducedMetrics = await reducedPage.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    resourceTransition: getComputedStyle(document.querySelector(".resource-card")).transitionDuration
  }));
  check(reducedMetrics.scrollBehavior === "auto", "motion:reduced-scroll-final-state", reducedMetrics.scrollBehavior);
  check(reducedMetrics.resourceTransition.split(",").every(value => parseFloat(value) === 0), "motion:reduced-transition", reducedMetrics.resourceTransition);
  await reduced.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(baseUrl, { waitUntil: "load" });
  const noJsMetrics = await noJsPage.evaluate(() => ({
    h1Visible: Boolean(document.querySelector("h1")?.getClientRects().length),
    storyVisible: Boolean(document.querySelector("[data-story-view='story']")?.getClientRects().length),
    jsControlsVisible: [...document.querySelectorAll(".js-only")].some(node => node.getClientRects().length),
    noscriptVisible: Boolean(document.querySelector(".noscript-note")?.getClientRects().length),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  }));
  check(noJsMetrics.h1Visible && noJsMetrics.storyVisible, "no-js:read-only-guidance-visible");
  check(!noJsMetrics.jsControlsVisible && noJsMetrics.noscriptVisible, "no-js:honest-non-operable-fallback");
  check(!noJsMetrics.overflow, "no-js:no-horizontal-overflow");
  await noJs.close();

  const stressPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await stressPage.goto(`${baseUrl}?lang=th&theme=light`, { waitUntil: "networkidle" });
  await stressPage.evaluate(() => { document.documentElement.style.fontSize = "130%"; });
  const thaiStress = await stressPage.evaluate(() => ({
    page: `${document.documentElement.scrollWidth}/${document.documentElement.clientWidth}`,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    wideNodes: [...document.querySelectorAll("body *")]
      .filter(node => node.getClientRects().length)
      .filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1 || node.scrollWidth > node.clientWidth + 2;
      })
      .slice(0, 10)
      .map(node => {
        const rect = node.getBoundingClientRect();
        return {
          node: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}${node.className ? `.${String(node.className).replace(/\s+/g, ".")}` : ""}`,
          rect: `${Math.round(rect.left)}..${Math.round(rect.right)}`,
          size: `${node.scrollWidth}/${node.clientWidth}`,
          text: node.textContent.trim().slice(0, 48)
        };
      }),
    clippedNodes: [...document.querySelectorAll("h1, h2, h3, button, summary")]
      .filter(node => node.getClientRects().length)
      .filter(node => node.scrollHeight > node.clientHeight + 2 || node.scrollWidth > node.clientWidth + 2)
      .slice(0, 8)
      .map(node => ({
        node: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}${node.className ? `.${String(node.className).replace(/\s+/g, ".")}` : ""}`,
        size: `${node.scrollWidth}x${node.scrollHeight}/${node.clientWidth}x${node.clientHeight}`,
        text: node.textContent.trim().slice(0, 48)
      }))
  }));
  check(!thaiStress.overflow, "type:thai-130-no-page-overflow", `${thaiStress.page} ${JSON.stringify(thaiStress.wideNodes)}`);
  check(thaiStress.clippedNodes.length === 0, "type:thai-130-no-control-or-heading-clipping", JSON.stringify(thaiStress.clippedNodes));
  await stressPage.close();

  const zoomPage = await browser.newPage({ viewport: { width: 720, height: 900 } });
  await zoomPage.goto(`${baseUrl}?lang=en&theme=dark`, { waitUntil: "networkidle" });
  await zoomPage.evaluate(() => { document.body.style.zoom = "2"; });
  const zoomMetrics = await zoomPage.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    h1Visible: Boolean(document.querySelector("h1")?.getClientRects().length),
    firstActionVisible: Boolean(document.querySelector(".hero-action")?.getClientRects().length)
  }));
  check(!zoomMetrics.overflow && zoomMetrics.h1Visible && zoomMetrics.firstActionVisible, "type:200-percent-zoom-essential-content");
  await zoomPage.close();
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

const report = {
  schemaVersion: "1.0",
  artifactBuildId: "citychat-ui-20260822-01",
  checkedAt: new Date().toISOString(),
  browser: "Chromium via Playwright 1.54.1 contract",
  scope: "rendered local HTTP; native-device and product-runtime gates remain open",
  totals: { checks: checks.length, failures },
  result: failures === 0 ? "passed" : "failed",
  checks
};

if (writeReport) writeFileSync(path.join(deployment, "qa/rendered-local.v0.4.json"), `${JSON.stringify(report, null, 2)}\n`);
if (failures > 0) process.exit(1);
console.log(`Rendered ${checks.length} checks with 0 failures.`);
