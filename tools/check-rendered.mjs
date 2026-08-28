#!/usr/bin/env node
import { createHash } from "node:crypto";
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

const validatorPath = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(validatorPath), "..");
const deployment = path.join(root, "deployment");
const config = JSON.parse(readFileSync(path.join(root, "release.config.json"), "utf8"));
const writeReport = process.argv.includes("--write");
const screenshotPath = process.argv.find(arg => arg.startsWith("--screenshot="))?.split("=").slice(1).join("=");
const heroScreenshotPath = process.argv.find(arg => arg.startsWith("--hero-screenshot="))?.split("=").slice(1).join("=");
const buttonScreenshotPath = process.argv.find(arg => arg.startsWith("--button-screenshot="))?.split("=").slice(1).join("=");
const assetScreenshotPath = process.argv.find(arg => arg.startsWith("--asset-screenshot="))?.split("=").slice(1).join("=");
const checks = [];
let failures = 0;
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const validatorSha256 = sha256(readFileSync(validatorPath));
const implementationRecordRoot = config.implementationRecordRoot;
const implementationPath = name => `${implementationRecordRoot}/${name}`;
const schemaPath = name => `schemas/${name}.v${config.artifactVersion}.json`;
const cityScanTaxonomyPath = config.implementationRecords.cityScanTaxonomy || implementationPath("cityscan-citycell-taxonomy.json");
const caseLibraryPath = config.implementationRecords.caseLibrary || implementationPath("citychat-case-library.json");
const configuredImplementationRecords = Object.values(config.implementationRecords || {})
  .filter(relative => typeof relative === "string" && relative.length > 0);

function check(ok, name, detail = "") {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  if (!ok) {
    failures += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const testedSourcePaths = [
  ["release.config.json", path.join(root, "release.config.json")],
  ["deployment/index.html", path.join(deployment, "index.html")],
  ["deployment/citychat.css", path.join(deployment, "citychat.css")],
  ["deployment/app.js", path.join(deployment, "app.js")],
  [`deployment/${config.releaseArtifacts.buildCard}`, path.join(deployment, config.releaseArtifacts.buildCard)],
  [`deployment/${config.releaseArtifacts.controlInventory}`, path.join(deployment, config.releaseArtifacts.controlInventory)],
  [`deployment/${config.identityManifest.path}`, path.join(deployment, config.identityManifest.path)],
  [`deployment/${implementationPath("citychat-color-role-map.json")}`, path.join(deployment, implementationPath("citychat-color-role-map.json"))],
  [`deployment/${implementationPath("citychat-button-contract.json")}`, path.join(deployment, implementationPath("citychat-button-contract.json"))],
  [`deployment/${implementationPath("cityscan-hero-specimen.html")}`, path.join(deployment, implementationPath("cityscan-hero-specimen.html"))],
  [`deployment/${implementationPath("citychat-icon-map.json")}`, path.join(deployment, implementationPath("citychat-icon-map.json"))],
  [`deployment/${implementationPath("citychat-icon-resolution.json")}`, path.join(deployment, implementationPath("citychat-icon-resolution.json"))],
  [`deployment/${implementationPath("font-assets.manifest.json")}`, path.join(deployment, implementationPath("font-assets.manifest.json"))],
  [`deployment/${implementationPath("semantic-motion.citychat.yml")}`, path.join(deployment, implementationPath("semantic-motion.citychat.yml"))],
  [`deployment/${cityScanTaxonomyPath}`, path.join(deployment, cityScanTaxonomyPath)],
  [`deployment/${caseLibraryPath}`, path.join(deployment, caseLibraryPath)],
  [`deployment/${schemaPath("citychat-color-role-map.schema")}`, path.join(deployment, schemaPath("citychat-color-role-map.schema"))],
  [`deployment/${schemaPath("citychat-button-contract.schema")}`, path.join(deployment, schemaPath("citychat-button-contract.schema"))],
  [`deployment/${schemaPath("citychat-icon-map.schema")}`, path.join(deployment, schemaPath("citychat-icon-map.schema"))],
  [`deployment/${schemaPath("semantic-motion-citychat.schema")}`, path.join(deployment, schemaPath("semantic-motion-citychat.schema"))],
  [`deployment/${schemaPath("citychat-asset-library.schema")}`, path.join(deployment, schemaPath("citychat-asset-library.schema"))],
  [`deployment/${schemaPath("cityscan-citycell-taxonomy.schema")}`, path.join(deployment, schemaPath("cityscan-citycell-taxonomy.schema"))],
  [`deployment/${schemaPath("citychat-case-library.schema")}`, path.join(deployment, schemaPath("citychat-case-library.schema"))],
  ...configuredImplementationRecords.map(relative => [`deployment/${relative}`, path.join(deployment, relative)]),
  ["tools/check-rendered.mjs", validatorPath]
].filter(([label], index, entries) => entries.findIndex(([candidate]) => candidate === label) === index);
const sourceHasher = createHash("sha256");
for (const [label, absolute] of testedSourcePaths) sourceHasher.update(label).update("\0").update(readFileSync(absolute)).update("\0");
const testedSourceDigest = sourceHasher.digest("hex");
const iconMap = JSON.parse(readFileSync(path.join(deployment, implementationPath("citychat-icon-map.json")), "utf8"));
const iconResolution = JSON.parse(readFileSync(path.join(deployment, implementationPath("citychat-icon-resolution.json")), "utf8"));

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
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
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

async function loadFonts(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([
      document.fonts.load('400 16px "Bai Jamjuree"', "ภาษาไทย English"),
      document.fonts.load('600 16px "Bai Jamjuree"', "ภาษาไทย English"),
      document.fonts.load('700 24px "IBM Plex Sans Thai Looped"', "หัวข้อภาษาไทย"),
      document.fonts.load('700 24px "Arvo"', "English heading"),
      document.fonts.load('400 14px "IBM Plex Sans Thai"', "ข้อมูล 2569"),
      document.fonts.load('400 14px "JetBrains Mono"', "FIXTURE-01"),
      document.fonts.load('300 24px "Material Symbols Rounded"', "location_on forum description reply share history receipt_long assignment map")
    ]);
  });
}

try {
  const matrix = [
    { width: 320, height: 760, locale: "th", theme: "light", mode: "story" },
    { width: 360, height: 800, locale: "th", theme: "dark", mode: "return" },
    { width: 360, height: 800, locale: "en", theme: "system", mode: "officer" },
    { width: 390, height: 844, locale: "th", theme: "dark", mode: "scan" },
    { width: 844, height: 390, locale: "th", theme: "light", mode: "scan", label: "mobile-landscape" },
    { width: 390, height: 480, locale: "th", theme: "light", mode: "scan", label: "short-viewport" },
    { width: 768, height: 900, locale: "en", theme: "light", mode: "story" },
    { width: 834, height: 900, locale: "th", theme: "dark", mode: "return" },
    { width: 1024, height: 900, locale: "th", theme: "light", mode: "scan" },
    { width: 1180, height: 900, locale: "en", theme: "dark", mode: "officer" },
    { width: 1366, height: 768, locale: "th", theme: "light", mode: "story" },
    { width: 1440, height: 1000, locale: "en", theme: "dark", mode: "return" }
  ];

  for (const item of matrix) {
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height } });
    const responseFailures = [];
    const thirdPartyFontRequests = [];
    page.on("response", response => {
      if (response.url().startsWith(baseUrl) && response.status() >= 400) responseFailures.push(`${response.status()} ${response.url()}`);
    });
    page.on("request", request => {
      const url = request.url();
      if (request.resourceType() === "font" && !url.startsWith(baseUrl)) thirdPartyFontRequests.push(url);
    });
    await page.goto(`${baseUrl}?lang=${item.locale}&theme=${item.theme}&mode=${item.mode}`, { waitUntil: "networkidle" });
    await loadFonts(page);
    if (item.mode === "scan") await page.$eval(".scan-state-preview", node => { node.open = true; });
    const metrics = await page.evaluate(() => {
      const visibleViews = [...document.querySelectorAll("[data-story-view]")].filter(node => node.getClientRects().length);
      const heroMeaning = document.querySelector(".hero-story strong")?.getBoundingClientRect();
      const heroMap = document.querySelector(".hero-map");
      const heroStageNodes = [...document.querySelectorAll(".hero-map, .map-line, .map-place, .hero-cityscan .hero-story")];
      const fontChecks = {
        body400: document.fonts.check('400 16px "Bai Jamjuree"', "ภาษาไทย English"),
        body600: document.fonts.check('600 16px "Bai Jamjuree"', "ภาษาไทย English"),
        thaiHeading: document.fonts.check('700 24px "IBM Plex Sans Thai Looped"', "หัวข้อภาษาไทย"),
        englishHeading: document.fonts.check('700 24px "Arvo"', "English heading"),
        thaiTechnical: document.fonts.check('400 14px "IBM Plex Sans Thai"', "ข้อมูล 2569"),
        latinTechnical: document.fonts.check('400 14px "JetBrains Mono"', "FIXTURE-01"),
        materialSymbols: document.fonts.check('300 24px "Material Symbols Rounded"', "location_on forum description reply share history receipt_long assignment map")
      };
      const identity = [...document.querySelectorAll("[data-identity-role]")].map(node => {
        const image = node.querySelector("img");
        const style = getComputedStyle(node);
        const imageStyle = image ? getComputedStyle(image) : null;
        const rect = image?.getBoundingClientRect();
        return {
          role: node.dataset.identityRole,
          natural: image ? `${image.naturalWidth}x${image.naturalHeight}` : "missing",
          ratio: rect ? rect.width / rect.height : 0,
          background: style.backgroundColor,
          filter: imageStyle?.filter,
          opacity: imageStyle?.opacity,
          transform: imageStyle?.transform,
          animation: imageStyle?.animationName,
          mask: imageStyle?.maskImage || imageStyle?.webkitMaskImage || "none"
        };
      });
      const brandBeigeProbe = document.createElement("span");
      brandBeigeProbe.style.backgroundColor = "var(--brand-beige)";
      brandBeigeProbe.hidden = true;
      document.body.append(brandBeigeProbe);
      const resolvedBrandBeige = getComputedStyle(brandBeigeProbe).backgroundColor;
      brandBeigeProbe.remove();
      return {
        htmlWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        viewportHeight: window.innerHeight,
        h1Visible: Boolean(document.querySelector("h1")?.getClientRects().length),
        heroActionVisible: Boolean(document.querySelector(".hero-action")?.getClientRects().length),
        implementationLibraryVisible: Boolean(document.querySelector("#implementation-library")?.getClientRects().length),
        firstMeaningInViewport: Boolean(heroMeaning && heroMeaning.top < window.innerHeight && heroMeaning.bottom > 0),
        heroCityScan: {
          visible: Boolean(heroMap?.getClientRects().length),
          routes: document.querySelectorAll(".hero-map .map-line").length,
          markers: document.querySelectorAll(".hero-map .map-place").length,
          syntheticLabel: document.querySelector("#hero-object-caption")?.textContent || "",
          static: heroStageNodes.every(node => {
            const style = getComputedStyle(node);
            return style.animationName === "none" && style.transitionDuration.split(",").every(value => parseFloat(value) === 0);
          })
        },
        locale: document.documentElement.lang,
        themePreference: document.documentElement.dataset.themePreference,
        bodyFont: getComputedStyle(document.body).fontFamily,
        h2Font: getComputedStyle(document.querySelector("h2")).fontFamily,
        typeDemoFont: getComputedStyle(document.querySelector(".type-role-demo__heading")).fontFamily,
        fontSynthesis: getComputedStyle(document.body).fontSynthesis,
        fontChecks,
        visibleViews: visibleViews.map(node => node.dataset.storyView),
        crossProductIdentityLeak: document.body.innerText.match(/\bijji\b|--(?:ldm-)?product-ijji(?:-[a-z0-9-]+)?/i)?.[0] || "",
        ecosystem: {
          visible: Boolean(document.querySelector("#ecosystem-cases")?.getClientRects().length),
          activeCase: document.querySelector("#ecosystem-stage")?.dataset.case || "",
          activeLens: document.querySelector("#ecosystem-stage")?.dataset.lens || "",
          visibleCases: [...document.querySelectorAll("[data-ecosystem-case-view]")].filter(node => node.getClientRects().length).map(node => node.dataset.ecosystemCaseView),
          visibleLenses: [...document.querySelectorAll("[data-ecosystem-lens-view]")].filter(node => node.getClientRects().length).map(node => node.dataset.ecosystemLensView)
        },
        boundaryVisible: Boolean(document.querySelector(".header-actions .source-status")?.getClientRects().length || document.querySelector(".hero-boundary")?.getClientRects().length),
        identity,
        brandBeige: resolvedBrandBeige,
        headerBackground: getComputedStyle(document.querySelector(".site-header")).backgroundColor,
        footerBackground: getComputedStyle(document.querySelector(".site-footer")).backgroundColor,
        targetHeights: [...document.querySelectorAll("button, summary, .btn")]
          .filter(node => node.getClientRects().length)
          .map(node => ({ label: node.textContent.trim().slice(0, 40), height: node.getBoundingClientRect().height })),
        controlGeometry: [...document.querySelectorAll(".btn")]
          .filter(node => node.getClientRects().length)
          .map(node => {
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            const icon = node.querySelector(".icon-symbol");
            return {
              id: node.id || node.textContent.trim().slice(0, 32),
              iconOnly: node.classList.contains("btn-icon"),
              width: rect.width,
              height: rect.height,
              paddingLeft: parseFloat(style.paddingLeft),
              paddingRight: parseFloat(style.paddingRight),
              gap: parseFloat(style.gap),
              alignItems: style.alignItems,
              borderRadius: parseFloat(style.borderTopLeftRadius),
              hasIcon: Boolean(icon),
              accessibleName: node.getAttribute("aria-label") || node.textContent.trim()
            };
          }),
        iconMetrics: [...document.querySelectorAll(".icon-symbol")]
          .filter(node => node.getClientRects().length)
          .map(node => {
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            return {
              glyph: node.textContent.trim(),
              family: style.fontFamily,
              axes: style.fontVariationSettings,
              color: style.color,
              width: rect.width,
              height: rect.height,
              hidden: node.getAttribute("aria-hidden")
            };
          }),
        colorTokenValues: [...document.querySelectorAll("[data-color-token] [data-token-value]")]
          .filter(node => node.getClientRects().length)
          .map(node => node.textContent.trim()),
        criticalOverflow: [...document.querySelectorAll(".site-header, .hero-grid, .route-list, .play-controls, .journey-layout, .scan-state-preview, .scan-composition, .scan-frame-geometry, .ecosystem-cases, .ecosystem-flow, .ecosystem-controls, .ecosystem-stage, .citycell-groups, .role-use-grid, .component-index, .implementation-library, .implementation-router, .lab-panel, .control-showcase, .icon-grid, .motion-layout, .color-groups, .case-grid, .preflight-layout, .resource-grid, .footer-grid")]
          .filter(node => node.getClientRects().length)
          .map(node => ({ node, rect: node.getBoundingClientRect() }))
          .filter(({ rect }) => rect.left < -1 || rect.right > document.documentElement.clientWidth + 1)
          .map(({ node, rect }) => ({
            node: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}${node.className ? `.${String(node.className).replace(/\s+/g, ".")}` : ""}`,
            rect: `${Math.round(rect.left)}..${Math.round(rect.right)}`
          })),
        frameIntersections: (() => {
          const frame = document.querySelector(".scan-frame-geometry");
          if (!frame?.getClientRects().length) return [];
          const frameRect = frame.getBoundingClientRect();
          const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          return [...document.querySelectorAll(".site-header, .scan-state-preview[open], .scan-readout, .story-footer, details[open]")]
            .filter(node => node !== frame && !frame.contains(node) && node.getClientRects().length)
            .map(node => ({ node, rect: node.getBoundingClientRect() }))
            .filter(({ rect }) => overlaps(frameRect, rect))
            .map(({ node }) => `${node.tagName.toLowerCase()}${node.className ? `.${String(node.className).replace(/\s+/g, ".")}` : ""}`);
        })()
      };
    });
    const key = `${item.label || `${item.width}x${item.height}`}-${item.locale}-${item.theme}-${item.mode}`;
    check(responseFailures.length === 0, `render:${key}:assets-2xx`, responseFailures.join(" | "));
    check(thirdPartyFontRequests.length === 0, `render:${key}:no-third-party-fonts`, thirdPartyFontRequests.join(" | "));
    check(metrics.htmlWidth <= metrics.clientWidth + 1, `render:${key}:no-horizontal-overflow`, `${metrics.htmlWidth}/${metrics.clientWidth}`);
    check(metrics.h1Visible && metrics.heroActionVisible && metrics.implementationLibraryVisible, `render:${key}:essential-content-and-library-rendered`);
    check(metrics.heroCityScan.visible && metrics.heroCityScan.routes >= 2 && metrics.heroCityScan.markers >= 3 && /ข้อมูลจำลอง|synthetic/i.test(metrics.heroCityScan.syntheticLabel), `render:${key}:cityscan-hero-composition-and-truth-label`, JSON.stringify(metrics.heroCityScan));
    check(metrics.heroCityScan.static, `render:${key}:cityscan-hero-has-no-fake-motion`, JSON.stringify(metrics.heroCityScan));
    if (item.width <= 390 && item.height >= 760) check(metrics.firstMeaningInViewport, `render:${key}:first-value-in-initial-viewport`);
    check(!metrics.crossProductIdentityLeak, `render:${key}:no-cross-product-identity-in-visible-body`, metrics.crossProductIdentityLeak);
    check(metrics.ecosystem.visible && metrics.ecosystem.activeCase === "live" && metrics.ecosystem.activeLens === "scan" && JSON.stringify(metrics.ecosystem.visibleCases) === JSON.stringify(["live"]) && JSON.stringify(metrics.ecosystem.visibleLenses) === JSON.stringify(["scan"]), `render:${key}:one-default-ecosystem-case-and-lens-visible`, JSON.stringify(metrics.ecosystem));
    check(metrics.boundaryVisible, `render:${key}:fixture-boundary-visible`);
    check(metrics.visibleViews.length === 1 && metrics.visibleViews[0] === item.mode, `render:${key}:exactly-one-journey-view`, JSON.stringify(metrics.visibleViews));
    check(metrics.criticalOverflow.length === 0, `render:${key}:critical-containers-contained`, JSON.stringify(metrics.criticalOverflow));
    check(metrics.frameIntersections.length === 0, `render:${key}:scan-frame-zero-intersection`, JSON.stringify(metrics.frameIntersections));
    check(metrics.locale === item.locale && metrics.themePreference === item.theme, `render:${key}:locale-theme-preference`);
    check(metrics.bodyFont.includes("Bai Jamjuree"), `render:${key}:body-font`, metrics.bodyFont);
    check(item.locale === "th" ? metrics.h2Font.includes("IBM Plex Sans Thai Looped") : metrics.h2Font.includes("Arvo"), `render:${key}:heading-font`, metrics.h2Font);
    check(item.locale === "th" ? metrics.typeDemoFont.includes("IBM Plex Sans Thai Looped") : metrics.typeDemoFont.includes("Arvo"), `render:${key}:type-demo-font`, metrics.typeDemoFont);
    check(metrics.fontSynthesis === "none", `render:${key}:font-synthesis-none`, metrics.fontSynthesis);
    check(Object.values(metrics.fontChecks).every(Boolean), `render:${key}:all-self-hosted-font-faces-loaded`, JSON.stringify(metrics.fontChecks));
    check(metrics.iconMetrics.length >= 9 && metrics.iconMetrics.every(icon => icon.family.includes("Material Symbols Rounded") && /FILL.+0/.test(icon.axes) && /wght.+300/.test(icon.axes) && /GRAD.+0/.test(icon.axes) && /opsz.+24/.test(icon.axes) && icon.width > 0 && icon.height > 0 && icon.hidden === "true"), `render:${key}:icon-subset-inherited-axes-and-accessibility`, JSON.stringify(metrics.iconMetrics.slice(0, 3)));
    check(metrics.identity.length === 2 && metrics.identity.every(record => record.natural === "380x82" && Math.abs(record.ratio - 380 / 82) < 0.02), `render:${key}:identity-intrinsic-ratio`, JSON.stringify(metrics.identity));
    check(metrics.identity.every(record => /rgba?\(0, 0, 0, 0\)/.test(record.background) && record.filter === "none" && record.opacity === "1" && record.transform === "none" && record.animation === "none" && record.mask === "none"), `render:${key}:identity-no-local-carrier-or-transform`, JSON.stringify(metrics.identity));
    check(metrics.headerBackground === metrics.brandBeige && metrics.footerBackground === metrics.brandBeige, `render:${key}:identity-full-beige-bands`, `${metrics.headerBackground}/${metrics.footerBackground}/${metrics.brandBeige}`);
    const shortTargets = metrics.targetHeights.filter(target => target.height < 43.5);
    check(shortTargets.length === 0, `render:${key}:44px-controls`, shortTargets.slice(0, 3).map(target => `${target.label}:${target.height}`).join(" | "));
    const labelledGeometryFailures = metrics.controlGeometry
      .filter(control => !control.iconOnly)
      .filter(control => control.height < 43.5 || control.paddingLeft < 23.5 || control.paddingRight < 23.5 || control.alignItems !== "center" || control.borderRadius < control.height / 2 - 2 || (control.hasIcon && control.gap < 7.5));
    check(labelledGeometryFailures.length === 0, `render:${key}:lds-labelled-capsule-geometry`, JSON.stringify(labelledGeometryFailures.slice(0, 4)));
    const circleGeometryFailures = metrics.controlGeometry
      .filter(control => control.iconOnly)
      .filter(control => Math.abs(control.width - 44) > 0.75 || Math.abs(control.height - 44) > 0.75 || control.paddingLeft > 0.5 || control.paddingRight > 0.5 || control.borderRadius < 21 || !control.hasIcon || !control.accessibleName);
    check(circleGeometryFailures.length === 0, `render:${key}:lds-icon-circle-44px-and-named`, JSON.stringify(circleGeometryFailures));
    check(metrics.colorTokenValues.length >= 7 && metrics.colorTokenValues.every(value => value && value !== "unresolved"), `render:${key}:visible-color-atlas-values-resolve`, JSON.stringify(metrics.colorTokenValues));
    await page.close();
  }

  for (const theme of ["light", "dark"]) {
    const contrastPage = await browser.newPage({ viewport: { width: 834, height: 900 } });
    await contrastPage.goto(`${baseUrl}?lang=th&theme=${theme}`, { waitUntil: "networkidle" });
    const pairs = await contrastPage.evaluate(() => {
      const parseRgb = value => {
        const match = value.match(/rgba?\(([^)]+)\)/);
        if (!match) return null;
        const parts = match[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
        return parts.length >= 3 ? parts.slice(0, 3) : null;
      };
      const luminance = rgb => {
        const linear = rgb.map(channel => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      const ratio = (foreground, background) => {
        const fg = parseRgb(foreground);
        const bg = parseRgb(background);
        if (!fg || !bg) return null;
        const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
        return (light + 0.05) / (dark + 0.05);
      };
      return [
        ["header-status", ".header-actions .source-status", ".site-header"],
        ["story-title", ".story-specimen h3", ".story-specimen"],
        ["scan-label", ".scan-state-label", ".scan-readout"],
        ["primary-action", ".hero-action", ".hero-action"]
      ].map(([name, foregroundSelector, backgroundSelector]) => {
        const foregroundNode = document.querySelector(foregroundSelector);
        const backgroundNode = document.querySelector(backgroundSelector);
        if (!foregroundNode || !backgroundNode) return { name, ratio: null };
        const foreground = getComputedStyle(foregroundNode).color;
        const background = getComputedStyle(backgroundNode).backgroundColor;
        return { name, foreground, background, ratio: ratio(foreground, background) };
      });
    });
    const invalidPairs = pairs.filter(pair => pair.ratio === null || pair.ratio < 4.5);
    check(invalidPairs.length === 0, `contrast:${theme}:representative-text-pairs`, JSON.stringify(invalidPairs));
    await contrastPage.close();
  }

  const interactionPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story`, { waitUntil: "networkidle" });
  await loadFonts(interactionPage);
  for (const binding of iconResolution.bindings) {
    const nodes = interactionPage.locator(binding.selector);
    const count = await nodes.count();
    const resolved = count === 1 ? await nodes.first().evaluate((node, expected) => {
      const icon = node.matches(".icon-symbol") ? node : node.querySelector(".icon-symbol");
      return {
        glyph: icon?.textContent.trim() || "",
        hidden: icon?.getAttribute("aria-hidden") || "",
        family: icon ? getComputedStyle(icon).fontFamily : "",
        name: node.getAttribute("aria-label") || node.textContent.trim()
      };
    }, binding.glyph) : null;
    check(count === 1 && resolved?.glyph === binding.glyph && resolved?.hidden === "true" && resolved?.family.includes("Material Symbols Rounded") && Boolean(resolved?.name), `icons:binding:${binding.bindingId}:resolves`, JSON.stringify({ count, resolved }));
  }
  const galleryGlyphs = await interactionPage.locator("#icon-reference [role='list'] .icon-symbol").allTextContents();
  check(galleryGlyphs.length === iconMap.roles.length && iconMap.roles.every(role => galleryGlyphs.map(value => value.trim()).includes(role.glyph)), "icons:gallery-covers-closed-role-map", JSON.stringify(galleryGlyphs));
  const atlasBefore = await interactionPage.locator("[data-color-token] [data-token-value]").allTextContents();
  await interactionPage.click("#theme-cycle");
  const atlasAfter = await interactionPage.locator("[data-color-token] [data-token-value]").allTextContents();
  check(atlasBefore.length >= 7 && atlasBefore.some((value, index) => value !== atlasAfter[index]) && atlasAfter.every(value => value && value !== "unresolved"), "interaction:color-atlas-updates-with-theme", JSON.stringify({ before: atlasBefore, after: atlasAfter }));
  const initialButton = await interactionPage.locator("#button-preview").evaluate(node => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return { classes: node.className, width: rect.width, height: rect.height, radius: parseFloat(style.borderTopLeftRadius), paddingLeft: parseFloat(style.paddingLeft), paddingRight: parseFloat(style.paddingRight), labelHidden: node.querySelector(".button-preview-label")?.hidden };
  });
  check(!initialButton.classes.includes("btn-icon") && initialButton.height >= 43.5 && initialButton.paddingLeft >= 23.5 && initialButton.paddingRight >= 23.5 && initialButton.radius >= initialButton.height / 2 - 2 && initialButton.labelHidden === false, "buttons:builder-initial-labelled-capsule", JSON.stringify(initialButton));
  const specialButtonLabel = 'ดู "ฝน" <วันนี้> & พรุ่งนี้';
  await interactionPage.fill("#button-label-input", specialButtonLabel);
  await interactionPage.selectOption("#button-icon-select", "reply");
  await interactionPage.check("#button-mode-icon");
  const iconButton = await interactionPage.locator("#button-preview").evaluate(node => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    const code = document.querySelector("#button-code-output")?.textContent || "";
    return {
      classes: node.className,
      width: rect.width,
      height: rect.height,
      radius: parseFloat(style.borderTopLeftRadius),
      paddingLeft: parseFloat(style.paddingLeft),
      paddingRight: parseFloat(style.paddingRight),
      name: node.getAttribute("aria-label"),
      labelHidden: node.querySelector(".button-preview-label")?.hidden,
      glyph: node.querySelector(".icon-symbol")?.textContent.trim(),
      code
    };
  });
  check(iconButton.classes.includes("btn-icon") && Math.abs(iconButton.width - 44) < 0.75 && Math.abs(iconButton.height - 44) < 0.75 && iconButton.radius >= 21 && iconButton.paddingLeft < 0.5 && iconButton.paddingRight < 0.5 && iconButton.name === specialButtonLabel && iconButton.labelHidden === true && iconButton.glyph === "reply", "buttons:builder-icon-only-circle-is-44px-and-named", JSON.stringify(iconButton));
  check(iconButton.code.includes("&quot;") && iconButton.code.includes("&lt;") && iconButton.code.includes("&gt;") && iconButton.code.includes("&amp;"), "buttons:builder-downloadable-markup-escapes-special-characters", iconButton.code);
  await interactionPage.click("#button-preview");
  await interactionPage.waitForFunction(() => Boolean(document.querySelector('body > .visually-hidden[role="status"]')?.textContent.trim()));
  const buttonAction = await interactionPage.evaluate(() => ({
    result: document.querySelector("#button-preview-result")?.textContent.trim() || "",
    announcement: document.querySelector('body > .visually-hidden[role="status"]')?.textContent.trim() || ""
  }));
  check(/ทำงานในหน้านี้แล้ว|worked locally/i.test(buttonAction.result) && Boolean(buttonAction.announcement), "interaction:button-example-updates-local-result-and-announces", JSON.stringify(buttonAction));
  await interactionPage.check("#button-mode-labelled");
  const labelledAgain = await interactionPage.locator("#button-preview").evaluate(node => ({
    classes: node.className,
    label: node.querySelector(".button-preview-label")?.textContent || "",
    hidden: node.querySelector(".button-preview-label")?.hidden,
    name: node.getAttribute("aria-label")
  }));
  check(!labelledAgain.classes.includes("btn-icon") && labelledAgain.label === specialButtonLabel && labelledAgain.hidden === false && labelledAgain.name === null, "buttons:builder-returns-to-labelled-capsule", JSON.stringify(labelledAgain));
  await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=scan&case=visit&lens=citizen#ecosystem-cases`, { waitUntil: "networkidle" });
  const restoredEcosystemCase = await interactionPage.evaluate(() => {
    const url = new URL(window.location.href);
    const visibleCases = [...document.querySelectorAll("[data-ecosystem-case-view]")].filter(node => node.getClientRects().length);
    const visibleLenses = [...document.querySelectorAll("[data-ecosystem-lens-view]")].filter(node => node.getClientRects().length);
    return {
      caseParam: url.searchParams.get("case"),
      lensParam: url.searchParams.get("lens"),
      stageCase: document.querySelector("#ecosystem-stage")?.dataset.case || "",
      stageLens: document.querySelector("#ecosystem-stage")?.dataset.lens || "",
      caseTabSelected: document.querySelector("#case-visit")?.getAttribute("aria-selected") || "",
      lensTabSelected: document.querySelector("#lens-citizen")?.getAttribute("aria-selected") || "",
      visibleCases: visibleCases.map(node => node.dataset.ecosystemCaseView),
      visibleLenses: visibleLenses.map(node => node.dataset.ecosystemLensView),
      visibleText: visibleCases[0]?.innerText || ""
    };
  });
  check(restoredEcosystemCase.caseParam === "visit" && restoredEcosystemCase.lensParam === "citizen" && restoredEcosystemCase.stageCase === "visit" && restoredEcosystemCase.stageLens === "citizen" && restoredEcosystemCase.caseTabSelected === "true" && restoredEcosystemCase.lensTabSelected === "true", "interaction:case-and-lens-url-restoration", JSON.stringify(restoredEcosystemCase));
  check(JSON.stringify(restoredEcosystemCase.visibleCases) === JSON.stringify(["visit"]) && JSON.stringify(restoredEcosystemCase.visibleLenses) === JSON.stringify(["citizen"]) && restoredEcosystemCase.visibleText.includes("น่าเที่ยวตรงไหน") && restoredEcosystemCase.visibleText.includes("ถ้าไปช่วงเย็น"), "interaction:one-requested-ecosystem-specimen-visible", JSON.stringify(restoredEcosystemCase));
  await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story`, { waitUntil: "networkidle" });
  await Promise.all([
    interactionPage.waitForURL(url => url.searchParams.get("case") === "live" && url.searchParams.get("lens") === "scan" && url.hash === "#ecosystem-cases"),
    interactionPage.click("#hero-cityscan-action")
  ]);
  check(await interactionPage.getAttribute("#case-live", "aria-selected") === "true" && await interactionPage.getAttribute("#lens-scan", "aria-selected") === "true" && (await interactionPage.locator("[data-ecosystem-case-view]:visible").count()) === 1 && await interactionPage.isVisible('[data-ecosystem-case-view="live"]') && (await interactionPage.locator("[data-ecosystem-lens-view]:visible").count()) === 1 && await interactionPage.isVisible('[data-ecosystem-case-view="live"] [data-ecosystem-lens-view="scan"]'), "interaction:hero-cityscan-action-opens-live-scan-ecosystem-case");
  await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story`, { waitUntil: "networkidle" });
  await interactionPage.focus("#mode-story");
  await interactionPage.keyboard.press("ArrowRight");
  check(await interactionPage.getAttribute("#mode-return", "aria-selected") === "true", "interaction:tab-story-to-return");
  check((await interactionPage.locator("[data-story-view]:visible").count()) === 1 && await interactionPage.isVisible("[data-story-view='return']"), "interaction:return-is-single-visible-view");
  await interactionPage.keyboard.press("ArrowRight");
  check(await interactionPage.getAttribute("#mode-scan", "aria-selected") === "true", "interaction:tab-return-to-scan");
  check(await interactionPage.getAttribute(".scan-composition", "data-active-scan-state") === "no-score", "interaction:no-score-state");
  check(await interactionPage.isHidden("#open-story-from-lock"), "interaction:no-score-cannot-open-story");
  await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=return`, { waitUntil: "networkidle" });
  check(await interactionPage.getAttribute("#mode-return", "aria-selected") === "true" && await interactionPage.isVisible("[data-story-view='return']"), "interaction:return-url-restoration");
  await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story`, { waitUntil: "networkidle" });
  check(await interactionPage.isHidden("#answer-options") && await interactionPage.getAttribute("#preview-answer-options", "aria-expanded") === "false", "interaction:answer-preview-initially-closed");
  await interactionPage.click("#preview-answer-options");
  check(await interactionPage.isVisible("#answer-options") && await interactionPage.getAttribute("#preview-answer-options", "aria-expanded") === "true", "interaction:answer-preview-opens-locally");
  await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=scan&scan=locked`, { waitUntil: "networkidle" });
  check(await interactionPage.getAttribute(".scan-composition", "data-active-scan-state") === "locked", "interaction:locked-state");
  check(await interactionPage.isVisible("#open-story-from-lock"), "interaction:locked-can-open-story");
  await interactionPage.click("#open-story-from-lock");
  const lockHandoff = await interactionPage.evaluate(() => {
    const origin = document.querySelector("[data-lock-origin]");
    const heading = document.querySelector("#story-result-heading");
    const headingRect = heading?.getBoundingClientRect();
    return {
      visible: Boolean(origin?.getClientRects().length),
      text: origin?.textContent || "",
      placeRef: origin?.dataset.placeRef || "",
      snapshotRef: origin?.dataset.snapshotRef || "",
      mode: document.querySelector("[data-story-view]:not([hidden])")?.dataset.storyView || "",
      activeElement: document.activeElement?.id || "",
      headingInViewport: Boolean(headingRect && headingRect.top >= 0 && headingRect.bottom <= window.innerHeight)
    };
  });
  check(lockHandoff.visible && /เฉพาะหน้านี้|on this page/i.test(lockHandoff.text), "interaction:locked-fixture-handoff-visible", JSON.stringify(lockHandoff));
  check(lockHandoff.placeRef === "PLACE-DEMO-01" && lockHandoff.snapshotRef === "FIXTURE-SCAN-LOCK-01", "interaction:locked-fixture-context-preserved", JSON.stringify(lockHandoff));
  check(lockHandoff.mode === "story" && lockHandoff.activeElement === "story-result-heading" && lockHandoff.headingInViewport, "interaction:locked-handoff-focus-and-scroll", JSON.stringify(lockHandoff));
  for (const input of await interactionPage.$$("#preflight-form input[type='checkbox']")) await input.check();
  check(await interactionPage.textContent("#preflight-count") === "6/6", "interaction:preflight-progress");
  if (screenshotPath) {
    await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story&view=assisted`, { waitUntil: "networkidle" });
    await interactionPage.screenshot({ path: screenshotPath, fullPage: true });
  }
  if (heroScreenshotPath) {
    await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story&view=assisted`, { waitUntil: "networkidle" });
    await interactionPage.locator("#top").screenshot({ path: heroScreenshotPath });
  }
  if (buttonScreenshotPath) {
    await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story&view=assisted#control-examples`, { waitUntil: "networkidle" });
    await interactionPage.locator("#control-examples").screenshot({ path: buttonScreenshotPath });
  }
  if (assetScreenshotPath) {
    await interactionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story&view=assisted#asset-library`, { waitUntil: "networkidle" });
    await interactionPage.locator("#asset-library").screenshot({ path: assetScreenshotPath });
  }
  await interactionPage.close();

  const motionPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await motionPage.goto(`${baseUrl}?lang=th&theme=light&mode=story`, { waitUntil: "networkidle" });
  const motionInitial = await motionPage.evaluate(() => ({
    groups: document.querySelectorAll("[data-reveal-group]").length,
    items: document.querySelectorAll("[data-reveal-group] > [data-reveal-item]").length,
    active: document.querySelectorAll("[data-reveal-item].reveal").length
  }));
  check(motionInitial.groups === 1 && motionInitial.items === 3 && motionInitial.active === 0, "motion:reading-order-initially-stable", JSON.stringify(motionInitial));
  await motionPage.locator("[data-reveal-group]").scrollIntoViewIfNeeded();
  await motionPage.waitForFunction(() => document.querySelector("[data-reveal-group]")?.dataset.revealComplete === "true");
  await motionPage.waitForFunction(() => document.querySelectorAll("[data-reveal-item].reveal").length === 3);
  const activeReveal = await motionPage.evaluate(() => [...document.querySelectorAll("[data-reveal-group] > [data-reveal-item]")].map(node => ({
    animation: getComputedStyle(node).animationName,
    delay: getComputedStyle(node).animationDelay
  })));
  check(activeReveal.every(item => item.animation === "lds-reveal") && new Set(activeReveal.map(item => item.delay)).size === 3, "motion:inherited-once-only-stagger-runs", JSON.stringify(activeReveal));
  await motionPage.waitForFunction(() => document.querySelectorAll("[data-reveal-item].reveal").length === 0);
  await motionPage.evaluate(() => window.scrollTo(0, 0));
  await motionPage.locator("[data-reveal-group]").scrollIntoViewIfNeeded();
  await motionPage.waitForTimeout(180);
  const replayState = await motionPage.evaluate(() => ({
    complete: document.querySelector("[data-reveal-group]")?.dataset.revealComplete,
    active: document.querySelectorAll("[data-reveal-item].reveal").length
  }));
  check(replayState.complete === "true" && replayState.active === 0, "motion:reading-order-does-not-replay", JSON.stringify(replayState));
  await motionPage.close();

  const reduced = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(`${baseUrl}?lang=th&theme=dark`, { waitUntil: "networkidle" });
  await reducedPage.locator("[data-reveal-group]").scrollIntoViewIfNeeded();
  const reducedMetrics = await reducedPage.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    complete: document.querySelector("[data-reveal-group]")?.dataset.revealComplete || "",
    items: [...document.querySelectorAll("[data-reveal-group] > [data-reveal-item]")].map(node => ({
      active: node.classList.contains("reveal"),
      animation: getComputedStyle(node).animationName,
      opacity: getComputedStyle(node).opacity,
      transform: getComputedStyle(node).transform
    }))
  }));
  check(reducedMetrics.scrollBehavior === "auto", "motion:reduced-scroll-final-state", reducedMetrics.scrollBehavior);
  check(reducedMetrics.complete === "" && reducedMetrics.items.every(item => !item.active && item.animation === "none" && item.opacity === "1" && item.transform === "none"), "motion:reduced-reveal-final-state-without-activation", JSON.stringify(reducedMetrics));
  await reduced.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(baseUrl, { waitUntil: "load" });
  const noJsMetrics = await noJsPage.evaluate(() => ({
    h1Visible: Boolean(document.querySelector("h1")?.getClientRects().length),
    storyVisible: Boolean(document.querySelector("[data-story-view='story']")?.getClientRects().length),
    visibleViews: [...document.querySelectorAll("[data-story-view]")].filter(node => node.getClientRects().length).length,
    jsControlsVisible: [...document.querySelectorAll(".js-only")].some(node => node.getClientRects().length),
    noscriptVisible: Boolean(document.querySelector(".noscript-note")?.getClientRects().length),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    implementationLibraryVisible: Boolean(document.querySelector("#implementation-library")?.getClientRects().length),
    revealItems: [...document.querySelectorAll("[data-reveal-group] > [data-reveal-item]")].map(node => ({
      active: node.classList.contains("reveal"),
      opacity: getComputedStyle(node).opacity,
      transform: getComputedStyle(node).transform
    }))
  }));
  check(noJsMetrics.h1Visible && noJsMetrics.storyVisible && noJsMetrics.visibleViews === 1, "no-js:single-read-only-guidance-visible");
  check(!noJsMetrics.jsControlsVisible && noJsMetrics.noscriptVisible, "no-js:honest-non-operable-fallback");
  check(!noJsMetrics.overflow, "no-js:no-horizontal-overflow");
  check(noJsMetrics.implementationLibraryVisible && noJsMetrics.revealItems.length === 3 && noJsMetrics.revealItems.every(item => !item.active && item.opacity === "1" && item.transform === "none"), "no-js:library-and-motion-final-state-visible", JSON.stringify(noJsMetrics.revealItems));
  await noJs.close();

  const stressPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await stressPage.goto(`${baseUrl}?lang=th&theme=light`, { waitUntil: "networkidle" });
  await stressPage.evaluate(() => {
    document.documentElement.style.fontSize = "130%";
    const target = document.querySelector(".context-place [data-th]");
    if (target) target.textContent = "เทศบาลเมืองตัวอย่างริมคลองฝั่งตะวันออกและชุมชนต่อเนื่องที่มีชื่อยาวมากเพื่อทดสอบการตัดบรรทัดภาษาไทยบนหน้าจอมือถือโดยไม่ตัดความหมายหรือดันองค์ประกอบออกนอกจอ";
  });
  const thaiStress = await stressPage.evaluate(() => ({
    page: `${document.documentElement.scrollWidth}/${document.documentElement.clientWidth}`,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    wideNodes: [...document.querySelectorAll("h1, h2, h3, h4, p, li, button, summary, .card, .context-place, .site-header, .route-list, .play-controls, .journey-layout, .scan-composition, .ecosystem-flow, .ecosystem-controls, .ecosystem-stage, .citycell-groups, .role-use-grid, .implementation-library, .implementation-router, .control-showcase, .icon-grid, .motion-layout, .color-groups, .resource-grid")]
      .filter(node => node.getClientRects().length)
      .filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1 || node.scrollWidth > node.clientWidth + 2;
      })
      .slice(0, 10)
      .map(node => {
        const rect = node.getBoundingClientRect();
        return { node: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}`, rect: `${Math.round(rect.left)}..${Math.round(rect.right)}`, size: `${node.scrollWidth}/${node.clientWidth}`, text: node.textContent.trim().slice(0, 48) };
      }),
    clippedNodes: [...document.querySelectorAll("h1, h2, h3, button, summary")]
      .filter(node => node.getClientRects().length)
      .filter(node => node.scrollHeight > node.clientHeight + 2 || node.scrollWidth > node.clientWidth + 2)
      .slice(0, 8)
      .map(node => ({ node: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}`, size: `${node.scrollWidth}x${node.scrollHeight}/${node.clientWidth}x${node.clientHeight}`, text: node.textContent.trim().slice(0, 48) }))
  }));
  check(!thaiStress.overflow, "type:thai-130-no-page-overflow", `${thaiStress.page} ${JSON.stringify(thaiStress.wideNodes)}`);
  check(thaiStress.wideNodes.length === 0, "type:thai-long-copy-critical-containment", JSON.stringify(thaiStress.wideNodes));
  check(thaiStress.clippedNodes.length === 0, "type:thai-130-no-control-or-heading-clipping", JSON.stringify(thaiStress.clippedNodes));
  await stressPage.close();

  const zoomPage = await browser.newPage({ viewport: { width: 720, height: 900 } });
  await zoomPage.goto(`${baseUrl}?lang=en&theme=dark`, { waitUntil: "networkidle" });
  await zoomPage.fill("#button-label-input", "ดูข้อมูลพื้นที่ตัวอย่างริมคลองฝั่งตะวันออกและชุมชนต่อเนื่องที่มีชื่อยาวมากโดยไม่ตัดความหมาย");
  await zoomPage.evaluate(() => { document.body.style.zoom = "2"; });
  const zoomMetrics = await zoomPage.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    page: `${document.documentElement.scrollWidth}/${document.documentElement.clientWidth}`,
    h1Visible: Boolean(document.querySelector("h1")?.getClientRects().length),
    firstActionVisible: Boolean(document.querySelector(".hero-action")?.getClientRects().length),
    buttonReadable: (() => {
      const node = document.querySelector("#button-preview");
      if (!node) return false;
      return node.scrollHeight <= node.clientHeight + 2 && node.getBoundingClientRect().right <= document.documentElement.clientWidth + 1;
    })(),
    wideNodes: [...document.querySelectorAll(".site-header, .hero-grid, .route-list, .play-controls, .journey-layout, .ecosystem-flow, .ecosystem-controls, .ecosystem-stage, .citycell-groups, .role-use-grid, .implementation-library, .implementation-router, .lab-panel, .button-builder-layout, #button-preview, .control-showcase, .icon-grid, .motion-layout, .color-groups, .preflight-layout, .resource-grid, .asset-library-grid, .footer-grid")]
      .filter(node => node.getClientRects().length)
      .filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.left < -1 || rect.right > document.documentElement.clientWidth + 1 || node.scrollWidth > node.clientWidth + 2;
      })
      .slice(0, 12)
      .map(node => {
        const rect = node.getBoundingClientRect();
        return { node: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}.${String(node.className).replace(/\s+/g, ".")}`, rect: `${Math.round(rect.left)}..${Math.round(rect.right)}`, size: `${node.scrollWidth}/${node.clientWidth}` };
      })
  }));
  check(!zoomMetrics.overflow && zoomMetrics.h1Visible && zoomMetrics.firstActionVisible && zoomMetrics.buttonReadable, "type:200-percent-zoom-essential-content-and-long-button", JSON.stringify(zoomMetrics));
  await zoomPage.close();
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

const renderedReportPath = path.join(deployment, config.releaseArtifacts.renderedQa);
let priorReport = null;
if (existsSync(renderedReportPath)) {
  try { priorReport = JSON.parse(readFileSync(renderedReportPath, "utf8")); }
  catch { priorReport = null; }
}
const priorDigest = priorReport?.testedSourceDigest || "";
check(writeReport || priorDigest === testedSourceDigest, "qa:rendered-report-bound-to-tested-sources", `${priorDigest || "missing"}/${testedSourceDigest}`);

const parityCheckName = "qa:rendered-report-contract-parity";
const expectedCheckNames = [...checks.map(record => record.name), parityCheckName];
const recordedCheckNames = priorReport?.checks?.map(record => record.name) || [];
const reportContractMatches = priorReport
  && priorReport.validator?.sha256 === validatorSha256
  && priorReport.totals?.checks === expectedCheckNames.length
  && JSON.stringify(recordedCheckNames) === JSON.stringify(expectedCheckNames);
check(writeReport || reportContractMatches, parityCheckName, JSON.stringify({
  recordedValidator: priorReport?.validator?.sha256 || "missing",
  currentValidator: validatorSha256,
  recordedChecks: priorReport?.totals?.checks ?? "missing",
  currentChecks: expectedCheckNames.length
}));

const report = {
  schemaVersion: "1.0",
  artifactBuildId: config.artifactBuildId,
  testedSourceDigest,
  testedSourceDigestAlgorithm: "sha256(path-NUL-bytes-NUL in declared order)",
  testedSourcePaths: testedSourcePaths.map(([label]) => label),
  validator: {
    path: "tools/check-rendered.mjs",
    sha256: validatorSha256,
    contractVersion: "1.2"
  },
  browser: "Chromium via Playwright 1.54.1 contract",
  scope: "rendered local HTTP; native-device, screen-reader, and product-runtime gates remain open",
  totals: { checks: checks.length, failures },
  result: failures === 0 ? "passed" : "failed",
  checks
};

if (writeReport) writeFileSync(renderedReportPath, `${JSON.stringify(report, null, 2)}\n`);
if (failures > 0) process.exit(1);
console.log(`Rendered ${checks.length} checks with 0 failures.`);
