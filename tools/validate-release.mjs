#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deployment = path.join(root, "deployment");
const config = JSON.parse(readFileSync(path.join(root, "release.config.json"), "utf8"));
const html = readFileSync(path.join(deployment, "index.html"), "utf8");
const css = readFileSync(path.join(deployment, "citychat.css"), "utf8");
const app = readFileSync(path.join(deployment, "app.js"), "utf8");
const writeReport = process.argv.includes("--write");
const checks = [];
let failures = 0;

function check(ok, name, detail = "") {
  const record = { name, ok: Boolean(ok), ...(detail ? { detail } : {}) };
  checks.push(record);
  if (!ok) {
    failures += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const validatorSha256 = sha256(readFileSync(fileURLToPath(import.meta.url)));
const readJson = relative => JSON.parse(readFileSync(path.join(deployment, relative), "utf8"));
const implementationRecordRoot = config.implementationRecordRoot;
const implementationPath = name => `${implementationRecordRoot}/${name}`;
const schemaPath = name => `schemas/${name}.v${config.artifactVersion}.json`;
const cityScanTaxonomyPath = config.implementationRecords.cityScanTaxonomy || implementationPath("cityscan-citycell-taxonomy.json");
const caseLibraryPath = config.implementationRecords.caseLibrary || implementationPath("citychat-case-library.json");
const configuredImplementationRecords = Object.values(config.implementationRecords || {})
  .filter(relative => typeof relative === "string" && relative.length > 0);
const generatorPath = path.join(root, "tools/generate-citychat-color-atlas.mjs");
const importerPath = path.join(root, "tools/import-material-symbols.mjs");
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function schemaRequiredFields(record, schema) {
  return (schema.required || []).filter(field => !(field in record));
}

function resolveRecordPath(recordRelative, referencedPath) {
  return path.resolve(path.dirname(path.join(deployment, recordRelative)), referencedPath);
}

function openingTagById(id) {
  return html.match(new RegExp(`<[^>]*\\bid="${escapeRegex(id)}"[^>]*>`, "i"))?.[0] || "";
}

function elementFragmentById(id) {
  const marker = html.indexOf(`id="${id}"`);
  if (marker < 0) return "";
  const opening = html.lastIndexOf("<", marker);
  const tag = html.slice(opening + 1).match(/^([a-z0-9-]+)/i)?.[1];
  if (!tag) return "";
  const closing = html.indexOf(`</${tag}>`, marker);
  return closing < 0 ? html.slice(opening, html.indexOf(">", marker) + 1) : html.slice(opening, closing + tag.length + 3);
}

const versionedMachineSources = [...new Set([
  implementationPath("citychat-color-atlas.fragment.html"),
  implementationPath("citychat-color-role-map.json"),
  implementationPath("citychat-button-contract.json"),
  implementationPath("cityscan-hero-specimen.html"),
  cityScanTaxonomyPath,
  caseLibraryPath,
  implementationPath("citychat-icon-map.json"),
  implementationPath("citychat-icon-resolution.json"),
  implementationPath("font-assets.manifest.json"),
  implementationPath("semantic-motion.citychat.yml"),
  schemaPath("citychat-button-contract.schema"),
  schemaPath("citychat-color-role-map.schema"),
  schemaPath("citychat-font-assets.schema"),
  schemaPath("citychat-icon-map.schema"),
  schemaPath("citychat-icon-resolution.schema"),
  schemaPath("semantic-motion-citychat.schema"),
  schemaPath("citychat-asset-library.schema"),
  schemaPath("cityscan-citycell-taxonomy.schema"),
  schemaPath("citychat-case-library.schema"),
  ...configuredImplementationRecords,
  `qa/color-atlas-generation.v${config.artifactVersion}.json`,
  "assets/icons/material-symbols-rounded-citychat-v368.ttf",
  "assets/icons/LICENSE.material-symbols.txt"
])];
const testedSourcePaths = [
  ["release.config.json", path.join(root, "release.config.json")],
  ["deployment/index.html", path.join(deployment, "index.html")],
  ["deployment/citychat.css", path.join(deployment, "citychat.css")],
  ["deployment/app.js", path.join(deployment, "app.js")],
  [`deployment/${config.releaseArtifacts.buildCard}`, path.join(deployment, config.releaseArtifacts.buildCard)],
  [`deployment/${config.releaseArtifacts.controlInventory}`, path.join(deployment, config.releaseArtifacts.controlInventory)],
  [`deployment/${config.releaseArtifacts.implementationNotes}`, path.join(deployment, config.releaseArtifacts.implementationNotes)],
  [`deployment/${config.identityManifest.path}`, path.join(deployment, config.identityManifest.path)],
  [`deployment/${config.sourceDesignAddOn.path}`, path.join(deployment, config.sourceDesignAddOn.path)],
  ...config.approvalRecords.map(record => [`deployment/${record.path}`, path.join(deployment, record.path)]),
  ...versionedMachineSources.map(relative => [`deployment/${relative}`, path.join(deployment, relative)]),
  ["tools/generate-citychat-color-atlas.mjs", generatorPath],
  ["tools/import-material-symbols.mjs", importerPath]
];
const testedSourceHasher = createHash("sha256");
for (const [label, absolute] of testedSourcePaths) {
  testedSourceHasher.update(label).update("\0").update(readFileSync(absolute)).update("\0");
}
const testedSourceDigest = testedSourceHasher.digest("hex");

const frontstageHtml = html
  .replace(/<details\b[^>]*data-copy-layer="team"[^>]*>[\s\S]*?<\/details>/gi, "")
  .replace(/<section\b[^>]*data-copy-layer="team"[^>]*>[\s\S]*?<\/section>/gi, "")
  .replace(/<footer\b[^>]*data-copy-layer="team"[^>]*>[\s\S]*?<\/footer>/gi, "");

check((html.match(/<h1\b/g) || []).length === 1, "html:one-h1");
check(html.includes('id="main"') && html.includes('href="#main"'), "html:skip-link");
check(html.includes('name="robots" content="noindex,nofollow,noarchive"'), "publication:noindex-in-initial-html");
check(html.includes(`rel="canonical" href="${config.canonicalUrl}"`), "publication:canonical");
check(!/(property="og:|name="twitter:|application\/ld\+json|rel="manifest"|rel="icon")/.test(html), "identity:no-unapproved-public-discovery-assets");
check(html.includes("source_limited") && html.includes("ไม่ใช่ระบบ CityChat ที่เปิดใช้งานจริง") && html.includes("not a live CityChat product"), "truth:visible-source-limited-boundary");
check(html.includes("CityChat DS Add-on v0.8") && html.includes("ตัวอย่างสำหรับทีม"), "ds-addon:visible-version-and-fixture-boundary");
check(html.includes("ยังบอกไม่ได้") && html.includes("ดูที่มา"), "copy:plain-thai-truth-and-disclosure");
check(html.includes('data-copy-layer="team"'), "copy:team-layer-explicit");
check(!/\bAI\b|inspector|claim ceiling|truth envelope|source_limited|SIGNAL_READY|NO_SCORE/i.test(frontstageHtml), "copy:no-internal-jargon-in-frontstage");
check(html.includes("PLACE-DEMO-01") && html.includes("SYNTHETIC"), "fixture:synthetic-object-labelled");
check(html.includes("FIXTURE-RECEIPT-01") && html.includes("Version v2"), "continuity:receipt-and-material-return-taught");
check(html.includes('data-story-view="return" hidden') && html.includes('data-story-view="scan" hidden') && html.includes('data-story-view="officer" hidden'), "journey:nondefault-views-hidden-in-initial-html");

const rejectedStart = html.indexOf('class="case-card card rejected-case"');
check(rejectedStart >= 0 && /อันดับ|ranks?|popularity/i.test(html.slice(rejectedStart)), "rejected:popularity-is-labelled-teaching-only");
check(rejectedStart >= 0 && /ไม่บอกว่าส่งแล้วหรือเทศบาลรับเรื่อง|Never claim saved or received/i.test(html.slice(rejectedStart)), "rejected:optimistic-receipt-is-labelled-teaching-only");
check(!/LivePulse|เทศบาลรับเรื่องแล้ว|municipality received/i.test(app + css), "truth:no-rejected-pattern-in-runtime-layer");
check((html.match(/data-th/g) || []).length > 100 && (html.match(/data-en/g) || []).length > 100, "locale:thai-english-content-present");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
check(duplicateIds.length === 0, "html:no-duplicate-ids", duplicateIds.join(", "));

check(!/#[0-9a-fA-F]{3,8}\b/.test(css), "css:no-build-local-raw-hex");
check(!css.includes("!important"), "css:no-build-local-important");
check(!css.includes("color-mix("), "css:no-authored-color-synthesis");
const productGradientSelectors = [...css.matchAll(/([^{}]+)\{[^{}]*var\(--product-citychat-gradient\)[^{}]*\}/g)]
  .map(match => match[1].trim());
const productGradientDataSelectors = productGradientSelectors.filter(selector => /scan|map|data|chart|status|readout|score|risk/i.test(selector));
check(productGradientSelectors.length > 0, "css:product-gradient-used-for-approved-identity-or-atlas-role");
check(productGradientDataSelectors.length === 0, "css:product-gradient-not-used-as-data-signal", productGradientDataSelectors.join(" | "));
check(css.includes("var(--surface-atmosphere-ground)") && css.includes("var(--interaction-accent)"), "css:semantic-token-composition");
check(css.includes("@media (prefers-reduced-motion: reduce)"), "motion:reduced-motion");
check(css.includes("@media (max-width: 599px)") && css.includes("@media (max-width: 899px)"), "responsive:inherited-lds-layout-thresholds");
check(!/overflow-x\s*:\s*hidden|backdrop-filter/.test(css), "responsive:no-overflow-masking-or-backdrop-blur");
check(css.includes("[data-story-view][hidden]") && css.includes("display: none"), "journey:hidden-attribute-not-overridden");
check(css.includes(".scan-composition") && css.includes(".scan-frame-geometry"), "scan:composition-and-visible-frame-separated");
check(css.includes("font-synthesis: none"), "type:no-synthetic-fonts");
check(html.includes('id="implementation-library"') && html.includes('id="control-examples"') && html.includes('id="icon-reference"') && html.includes('id="motion-examples"') && html.includes('id="color-atlas"'), "library:visible-control-icon-motion-color-sections");
check(!/id="(?:replay-motion|show-final-state)"|>\s*(?:Replay|เล่นซ้ำ|Show final state|ดูสถานะสุดท้าย)\s*</i.test(html), "motion:no-replay-or-show-final-control");
check(!/\.settle\b/.test(css) && !/classList\.(?:add|toggle)\(["']settle["']\)/.test(app), "motion:no-build-local-settle-activation");
for (const family of ["Arvo", "IBM Plex Sans Thai Looped", "Bai Jamjuree", "IBM Plex Sans Thai", "JetBrains Mono"]) {
  check(css.includes(`font-family: "${family}"`), `type:${family.toLowerCase().replaceAll(" ", "-")}:declared`);
}

check(!/fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|gtag\s*\(|analytics/i.test(app), "runtime:no-background-network-or-analytics");
check(/@font-face\s*\{[^}]*font-family:\s*"Material Symbols Rounded"[^}]*material-symbols-rounded-citychat-v368\.ttf[^}]*font-display:\s*block/s.test(css), "icons:self-hosted-material-symbols-font-face");
const inheritedLdsBase = readFileSync(path.join(deployment, config.upstream.vendorPath, "build-kit/lds-base.css"), "utf8");
check(/\.icon-symbol\s*\{[^}]*font-family:\s*"Material Symbols Rounded"[^}]*font-variation-settings:\s*['"]FILL['"]\s+0[^}]*['"]wght['"]\s+300[^}]*['"]GRAD['"]\s+0[^}]*['"]opsz['"]\s+24/s.test(inheritedLdsBase), "icons:inherited-lds-class-and-locked-axes");
check(!css.includes(".material-symbols-rounded") && !/class="[^"]*material-symbols-rounded/.test(html), "icons:no-parallel-local-icon-class");
check(!/@import[^;]*(?:fonts\.googleapis|fonts\.gstatic)|url\(["']?https?:\/\/[^)]*(?:fonts\.googleapis|fonts\.gstatic)/i.test(css + html), "icons:no-runtime-google-fonts");
check(html.includes('href="assets/icons/material-symbols-rounded-citychat-v368.ttf"') && html.includes('type="font/ttf"'), "icons:font-preloaded-locally");
check(app.includes('if (state.scan !== "locked") return') && app.includes("not saved to a system"), "runtime:locked-fixture-boundary");
check(html.includes('id="open-story-from-lock" hidden'), "runtime:story-handoff-hidden-until-lock");
check(app.includes("ArrowRight") && app.includes("Home") && app.includes("End"), "a11y:tab-keyboard-contract");
check(app.includes("navigator.clipboard") && app.includes("document.execCommand"), "effect:clipboard-fallback");
check(app.includes("คนเห็นคุณค่าอะไรในช่วงแรก?") && app.includes("What first value does the person receive?"), "handoff:copied-preflight-matches-visible-questions");
check(app.includes("IntersectionObserver") && app.includes(":scope > [data-reveal-item]") && app.includes("animationend"), "motion:once-only-direct-child-reveal-implementation");
check(app.includes("prefers-reduced-motion: reduce") && app.includes("unobserve"), "motion:reduced-motion-and-unobserve-contract");
check(!/setInterval\s*\(|requestAnimationFrame\s*\([^)]*requestAnimationFrame|animationiteration/i.test(app), "motion:no-looping-runtime-mechanism");

// Inspect only the active CityChat release surface. The pinned LDS vendor package
// and superseded release records are immutable evidence and intentionally stay
// outside this product-identity leak gate.
const currentScopeLeakCandidates = [
  ["README.md", path.join(root, "README.md")],
  ["DESIGN.md", path.join(root, "DESIGN.md")],
  ["deployment/index.html", path.join(deployment, "index.html")],
  ["deployment/citychat.css", path.join(deployment, "citychat.css")],
  ["deployment/app.js", path.join(deployment, "app.js")],
  ["deployment/llms.txt", path.join(deployment, "llms.txt")],
  ["deployment/resources/index.json", path.join(deployment, "resources/index.json")],
  [`deployment/${config.releaseArtifacts.buildCard}`, path.join(deployment, config.releaseArtifacts.buildCard)],
  [`deployment/${config.releaseArtifacts.controlInventory}`, path.join(deployment, config.releaseArtifacts.controlInventory)],
  [`deployment/${config.releaseArtifacts.implementationNotes}`, path.join(deployment, config.releaseArtifacts.implementationNotes)],
  [`deployment/${config.identityManifest.path}`, path.join(deployment, config.identityManifest.path)],
  [`deployment/${config.sourceDesignAddOn.path}`, path.join(deployment, config.sourceDesignAddOn.path)],
  ...config.approvalRecords.map(record => [`deployment/${record.path}`, path.join(deployment, record.path)]),
  ...versionedMachineSources.map(relative => [`deployment/${relative}`, path.join(deployment, relative)])
];
const textLikeExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".txt", ".yml", ".yaml"]);
const seenLeakPaths = new Set();
const crossProductIdentityLeaks = currentScopeLeakCandidates.flatMap(([label, absolute]) => {
  if (seenLeakPaths.has(absolute) || !existsSync(absolute) || !textLikeExtensions.has(path.extname(absolute).toLowerCase())) return [];
  seenLeakPaths.add(absolute);
  const match = readFileSync(absolute, "utf8").match(/\bijji\b|--(?:ldm-)?product-ijji(?:-[a-z0-9-]+)?/i);
  return match ? [`${label}:${match[0]}`] : [];
});
check(crossProductIdentityLeaks.length === 0, "identity:no-cross-product-identity-in-current-release-scope", crossProductIdentityLeaks.join(" | "));

const localRefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
  .map(match => match[1])
  .filter(ref => !ref.startsWith("#") && !ref.startsWith("http") && !ref.startsWith("mailto:") && !ref.startsWith("data:"));
const missingRefs = localRefs.filter(ref => !existsSync(path.join(deployment, ref.split(/[?#]/)[0])));
check(missingRefs.length === 0, "html:local-references-exist", missingRefs.join(", "));
check(localRefs.every(ref => !ref.startsWith("/")), "delivery:project-relative-paths");

const jsonFiles = [];
function walkJson(dir, prefix = "") {
  for (const name of readdirSync(dir).sort()) {
    const absolute = path.join(dir, name);
    const relative = path.posix.join(prefix, name);
    if (statSync(absolute).isDirectory()) walkJson(absolute, relative);
    else if (name.endsWith(".json")) jsonFiles.push(relative);
  }
}
walkJson(deployment);
const jsonErrors = [];
for (const file of jsonFiles) {
  try { JSON.parse(readFileSync(path.join(deployment, file), "utf8")); }
  catch (error) { jsonErrors.push(`${file}: ${error.message}`); }
}
check(jsonErrors.length === 0, "json:all-parse", jsonErrors.slice(0, 3).join(" | "));

for (const record of [config.sourceDesignAddOn, ...config.approvalRecords, ...config.productDependencies, config.identityManifest]) {
  check(sha256(readFileSync(path.join(deployment, record.path))) === record.sha256, `source:${path.basename(record.path)}:hash`);
}
const sourceDesignAddOn = readFileSync(path.join(deployment, config.sourceDesignAddOn.path), "utf8");
check(sourceDesignAddOn.includes("ไม่สร้าง Design System ซ้ำอีกชุด") && sourceDesignAddOn.includes("พูดเหมือนคนคุยกับคน") && sourceDesignAddOn.includes("หน้าที่ชาวบ้านหรือเจ้าหน้าที่เห็นต้องสั้น ง่าย และบอกประโยชน์ตรง ๆ"), "source:ds-addon-boundary-and-plain-language");
const experienceContract = readFileSync(path.join(deployment, config.productDependencies[0].path), "utf8");
check(experienceContract.includes("Canonical CityScan events MUST retain their owning names"), "source:canonical-cityscan-event-map");

const bilingualTextPresent = value => Boolean(value && typeof value.th === "string" && value.th.trim() && typeof value.en === "string" && value.en.trim());
const exactSet = (actual, expected) => actual.length === expected.length
  && [...actual].sort().every((value, index) => value === [...expected].sort()[index]);

const cityScanTaxonomy = readJson(cityScanTaxonomyPath);
const cityScanTaxonomySchema = readJson(schemaPath("cityscan-citycell-taxonomy.schema"));
const taxonomySchemaAbsolute = resolveRecordPath(cityScanTaxonomyPath, cityScanTaxonomy.$schema);
check(schemaRequiredFields(cityScanTaxonomy, cityScanTaxonomySchema).length === 0, "cityscan:taxonomy-schema-required-fields", schemaRequiredFields(cityScanTaxonomy, cityScanTaxonomySchema).join(", "));
check(taxonomySchemaAbsolute === path.join(deployment, schemaPath("cityscan-citycell-taxonomy.schema")) && existsSync(taxonomySchemaAbsolute), "cityscan:taxonomy-schema-ref-resolves", taxonomySchemaAbsolute);
check(cityScanTaxonomy.schemaVersion === config.artifactVersion && cityScanTaxonomy.ruleAuthority === "citychat-ds-addon-v0.8" && cityScanTaxonomy.runtimeBoundary === "conceptual_fixture_only", "cityscan:taxonomy-version-authority-and-runtime-boundary");
const expectedCityScanTopics = [
  ["daily_life", "แถวนี้น่าอยู่ยังไง"],
  ["visitor_identity", "น่าเที่ยวตรงไหน"],
  ["local_activity", "น่าค้าขายอะไรดี"]
];
const actualCityScanTopics = (cityScanTaxonomy.topics || []).map(topic => [topic.topicId, topic.publicPrompt?.th]);
check(JSON.stringify(actualCityScanTopics) === JSON.stringify(expectedCityScanTopics), "cityscan:exact-three-topics-and-thai-prompts", JSON.stringify(actualCityScanTopics));
check(cityScanTaxonomy.overallScoreEligible === false && cityScanTaxonomy.topics.every(topic => topic.promptOnly === true && topic.overallScoreEligible === false), "cityscan:no-overall-score-at-taxonomy-or-topic-level");
const taxonomyMetadataFailures = cityScanTaxonomy.topics.flatMap(topic => {
  const failures = [];
  if (!bilingualTextPresent(topic.publicPrompt)) failures.push(`${topic.topicId}:prompt`);
  if (!Array.isArray(topic.cityCellGroups) || topic.cityCellGroups.length === 0) failures.push(`${topic.topicId}:groups`);
  for (const group of topic.cityCellGroups || []) {
    const groupRef = `${topic.topicId}.${group.groupId || "missing-group"}`;
    if (!group.groupId || !group.boardLabel || !bilingualTextPresent(group.publicLabel) || !group.mappingStatus || !bilingualTextPresent(group.groupBoundary)) failures.push(`${groupRef}:metadata`);
    if (!Array.isArray(group.cells) || group.cells.length === 0) failures.push(`${groupRef}:cells`);
    for (const cell of group.cells || []) {
      const cellRef = cell.cityCellId || `${groupRef}.missing-cell`;
      if (!cell.cityCellId || !bilingualTextPresent(cell.publicLabel) || !cell.presentationKind || !cell.valueState || !cell.claimLevel || !Object.hasOwn(cell, "evidenceRef") || !bilingualTextPresent(cell.publicMeaning) || !Array.isArray(cell.forbiddenClaims) || cell.forbiddenClaims.length === 0) failures.push(`${cellRef}:metadata`);
    }
  }
  return failures;
});
check(taxonomyMetadataFailures.length === 0, "cityscan:topic-group-citycell-required-metadata", taxonomyMetadataFailures.join(" | "));
const allCityCells = cityScanTaxonomy.topics.flatMap(topic => topic.cityCellGroups.flatMap(group => group.cells));
const cityCellIds = allCityCells.map(cell => cell.cityCellId);
check(new Set(cityCellIds).size === cityCellIds.length, "cityscan:citycell-ids-unique", cityCellIds.filter((id, index) => cityCellIds.indexOf(id) !== index).join(", "));
const localActivityTopic = cityScanTaxonomy.topics.find(topic => topic.topicId === "local_activity");
const visitorsGroup = localActivityTopic?.cityCellGroups.find(group => group.groupId === "visitors");
const visitorCell = visitorsGroup?.cells.find(cell => cell.cityCellId === "local_activity.visitors_unresolved");
const visitorNumericZeros = visitorCell
  ? Object.entries(visitorCell).filter(([key, value]) => /(?:value|count|total|score)/i.test(key) && value === 0).map(([key]) => key)
  : ["missing-cell"];
check(visitorsGroup?.mappingStatus === "unresolved" && visitorsGroup.cells.length === 1 && visitorCell?.valueState === "unknown" && visitorCell?.presentationKind === "unavailable" && visitorCell?.claimLevel === "no_claim" && visitorCell?.evidenceRef === null && visitorCell?.forbiddenClaims?.includes("zero_visitors") && visitorNumericZeros.length === 0, "cityscan:visitors-remain-unknown-unresolved-not-zero", visitorNumericZeros.join(", "));
const hotelMappingCell = localActivityTopic?.cityCellGroups.flatMap(group => group.cells).find(cell => cell.cityCellId === "local_activity.hotel_mapping");
check(hotelMappingCell?.mappingStatus === "unresolved" && hotelMappingCell?.valueState === "unknown" && hotelMappingCell?.presentationKind === "unavailable" && hotelMappingCell?.claimLevel === "no_claim" && hotelMappingCell?.evidenceRef === null && ["residents", "visitors", "occupancy"].every(claim => hotelMappingCell?.forbiddenClaims?.includes(claim)), "cityscan:hotel-mapping-remains-explicitly-unresolved");
check(exactSet(cityScanTaxonomy.handoffIdentity?.required || [], ["caseId", "contextRef", "snapshotRef", "topicId", "responseVersion"]) && exactSet(cityScanTaxonomy.handoffIdentity?.surfaces || [], ["cityscan", "citychat_public", "officer_citymeter"]), "cityscan:handoff-identity-required-metadata");

const caseLibrary = readJson(caseLibraryPath);
const caseLibrarySchema = readJson(schemaPath("citychat-case-library.schema"));
const caseSchemaAbsolute = resolveRecordPath(caseLibraryPath, caseLibrary.$schema);
check(schemaRequiredFields(caseLibrary, caseLibrarySchema).length === 0, "cases:library-schema-required-fields", schemaRequiredFields(caseLibrary, caseLibrarySchema).join(", "));
check(caseSchemaAbsolute === path.join(deployment, schemaPath("citychat-case-library.schema")) && existsSync(caseSchemaAbsolute), "cases:library-schema-ref-resolves", caseSchemaAbsolute);
check(caseLibrary.schemaVersion === config.artifactVersion && caseLibrary.ruleAuthority === "citychat-ds-addon-v0.8" && caseLibrary.runtimeBoundary === "local_fixture_only", "cases:library-version-authority-and-runtime-boundary");
const expectedLensIds = ["scan", "citizen", "officer"];
check(JSON.stringify(caseLibrary.lenses.map(lens => lens.lensId)) === JSON.stringify(expectedLensIds) && exactSet(caseLibrary.lenses.map(lens => lens.surface), ["cityscan", "citychat_public", "officer_citymeter"]) && caseLibrary.lenses.every(lens => bilingualTextPresent(lens.label)), "cases:exact-three-product-lenses");
check(exactSet(caseLibrary.productScope || [], ["cityscan", "citychat_public", "officer_citymeter"]) && exactSet(Object.keys(caseLibrary.teamLenses || {}), ["product", "design", "development", "sales"]) && Object.values(caseLibrary.teamLenses || {}).every(bilingualTextPresent), "cases:product-scope-and-four-team-lenses");
const constructiveCases = caseLibrary.cases.filter(caseRecord => caseRecord.caseType === "constructive");
const rejectedCases = caseLibrary.cases.filter(caseRecord => caseRecord.caseType === "rejected");
const constructiveTopicMap = new Map(constructiveCases.map(caseRecord => [caseRecord.caseId, caseRecord.topicId]));
check(caseLibrary.cases.length === 4 && constructiveCases.length === 3 && rejectedCases.length === 1 && constructiveTopicMap.get("LIVE-01") === "daily_life" && constructiveTopicMap.get("VISIT-01") === "visitor_identity" && constructiveTopicMap.get("TRADE-01") === "local_activity", "cases:three-constructive-and-one-rejected-with-topic-map", JSON.stringify([...constructiveTopicMap]));
const constructiveMetadataFailures = constructiveCases.flatMap(caseRecord => {
  const failures = [];
  if (!caseRecord.caseId || !caseRecord.contextRef || !caseRecord.snapshotRef || !caseRecord.topicId || !bilingualTextPresent(caseRecord.title) || !bilingualTextPresent(caseRecord.firstValue)) failures.push(`${caseRecord.caseId || "missing-case"}:metadata`);
  if (!exactSet(Object.keys(caseRecord.lenses || {}), expectedLensIds)) failures.push(`${caseRecord.caseId}:lenses`);
  for (const lensId of expectedLensIds) {
    const lens = caseRecord.lenses?.[lensId];
    if (!lens || !bilingualTextPresent(lens.firstMeaning) || !Object.hasOwn(lens, "question") || (lens.question !== null && !bilingualTextPresent(lens.question)) || !bilingualTextPresent(lens.primaryAction) || !bilingualTextPresent(lens.immediateConsequence) || !bilingualTextPresent(lens.boundary)) failures.push(`${caseRecord.caseId}.${lensId}:metadata`);
  }
  return failures;
});
check(constructiveMetadataFailures.length === 0, "cases:constructive-lenses-required-metadata", constructiveMetadataFailures.join(" | "));
const rejectedCase = rejectedCases[0];
check(rejectedCase?.caseId === "REJECT-01" && rejectedCase?.topicId === null && !Object.hasOwn(rejectedCase || {}, "lenses") && bilingualTextPresent(rejectedCase?.title) && bilingualTextPresent(rejectedCase?.badExample) && /CityScore\s*87/i.test(rejectedCase?.badExample?.en || "") && Array.isArray(rejectedCase?.reasons) && rejectedCase.reasons.length >= 3 && rejectedCase.reasons.every(bilingualTextPresent) && bilingualTextPresent(rejectedCase?.recovery), "cases:one-aggregate-score-rejection-with-recovery");
const aggregateScoreCases = caseLibrary.cases.filter(caseRecord => /CityScore\s*\d+|คะแนน(?:รวม)?\s*\d+/i.test(JSON.stringify(caseRecord)));
check(aggregateScoreCases.length === 1 && aggregateScoreCases[0]?.caseId === "REJECT-01", "cases:aggregate-score-appears-only-in-rejected-case", aggregateScoreCases.map(caseRecord => caseRecord.caseId).join(", "));
check(expectedCityScanTopics.every(([, prompt]) => html.includes(prompt)) && ["live", "visit", "trade", "reject"].every(caseId => html.includes(`data-ecosystem-case-view="${caseId}"`)) && expectedLensIds.every(lensId => html.includes(`data-ecosystem-lens-view="${lensId}"`)), "cases:playground-covers-three-prompts-four-cases-and-three-lenses");
check(app.includes('query.get("case")') && app.includes('query.get("lens")') && app.includes('url.searchParams.set("case"') && app.includes('url.searchParams.set("lens"'), "cases:url-restoration-and-sharing-contract");

const colorMapPath = implementationPath("citychat-color-role-map.json");
const colorSchemaPath = schemaPath("citychat-color-role-map.schema");
const colorFragmentPath = implementationPath("citychat-color-atlas.fragment.html");
const colorQaPath = `qa/color-atlas-generation.v${config.artifactVersion}.json`;
const colorMap = readJson(colorMapPath);
const colorSchema = readJson(colorSchemaPath);
const colorQa = readJson(colorQaPath);
const colorFragment = readFileSync(path.join(deployment, colorFragmentPath), "utf8");
check(schemaRequiredFields(colorMap, colorSchema).length === 0, "color:schema-required-fields", schemaRequiredFields(colorMap, colorSchema).join(", "));
check(colorMap.artifactBuildId === config.artifactBuildId && colorMap.mode === "product_usage_overlay" && colorMap.fullLivingReference === false, "color:artifact-scoped-usage-overlay");
const colorRoleIds = colorMap.roles.map(role => role.roleId);
const colorStatusCounts = colorMap.roles.reduce((counts, role) => ({ ...counts, [role.status]: (counts[role.status] || 0) + 1 }), {});
check(colorMap.roles.length === 45 && new Set(colorRoleIds).size === 45, "color:complete-45-role-atlas");
check(colorMap.router.length === 7 && new Set(colorMap.router.map(route => route.routerId)).size === 7, "color:seven-job-first-router-destinations");
check(colorStatusCounts.governed === 43 && colorStatusCounts.reference_fixture === 1 && colorStatusCounts.omitted === 1 && !colorStatusCounts.candidate, "color:governance-status-coverage", JSON.stringify(colorStatusCounts));
check(!/#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b|\brgba?\(|color-mix\(/i.test(JSON.stringify(colorMap.roles)), "color:no-local-literal-or-runtime-mixing");
check(colorMap.roles.every(role => role.status === "omitted" || (role.redundantCue?.length > 0 && role.acceptanceIds?.length > 0)), "color:roles-have-redundant-cues-and-acceptance-ids");
const analyticalScaleRole = colorMap.roles.find(role => role.roleId === "cc.data.scale");
const linkedScaleSource = colorMap.sourceFiles.find(source => source.sourceId === "ldsScales");
check(analyticalScaleRole?.status === "reference_fixture" && /linked-exact-lut/.test(JSON.stringify(analyticalScaleRole)) && /"sourceId":"ldsScales"/.test(JSON.stringify(analyticalScaleRole)) && linkedScaleSource?.availability === "linked_not_vendored" && /raw\.githubusercontent\.com\/montri-th\/Landometer\/d82ac775/.test(linkedScaleSource.immutableUrl || ""), "color:analytical-scale-linked-not-reminted");
const supportingAssetRole = colorMap.roles.find(role => role.roleId === "cc.asset.supporting-color");
check(supportingAssetRole?.status === "omitted" && supportingAssetRole?.bindings?.length === 0, "color:unapproved-supporting-asset-role-omitted");
const colorSourceFailures = colorMap.sourceFiles
  .filter(source => source.availability !== "linked_not_vendored")
  .flatMap(source => {
    const absolute = resolveRecordPath(colorMapPath, source.path);
    if (!existsSync(absolute)) return [`${source.sourceId}:missing`];
    const actual = sha256(readFileSync(absolute));
    return actual === source.sha256 ? [] : [`${source.sourceId}:${actual}/${source.sha256}`];
  });
check(colorSourceFailures.length === 0, "color:pinned-local-source-hashes", colorSourceFailures.join(" | "));
check(colorQa.result === "pass" && colorQa.artifactBuildId === config.artifactBuildId && colorQa.counts.roles === 45 && colorQa.counts.routers === 7, "color:generation-qa-pass-and-counts");
const expectedColorHashes = {
  roleMapSha256: sha256(readFileSync(path.join(deployment, colorMapPath))),
  schemaSha256: sha256(readFileSync(path.join(deployment, colorSchemaPath))),
  generatorSha256: sha256(readFileSync(generatorPath)),
  generatedFragmentSha256: sha256(Buffer.from(colorFragment))
};
check(Object.entries(expectedColorHashes).every(([key, value]) => colorQa.hashes?.[key] === value), "color:generation-qa-byte-bound", JSON.stringify({ expected: expectedColorHashes, recorded: colorQa.hashes }));
check(html.includes('id="color-atlas"') && html.includes(`href="${colorMapPath}"`) && /data-color-role-id=/.test(html), "color:visible-atlas-and-machine-map-linked");
const governedColorBindingsByRole = new Map(colorMap.roles.map(role => [
  role.roleId,
  new Set((role.bindings || []).map(binding => binding.implementation))
]));
const renderedColorSwatches = [...html.matchAll(/<[^>]+\bdata-color-role-id="[^"]+"[^>]*>/g)].map(match => {
  const tag = match[0];
  return {
    roleId: tag.match(/\bdata-color-role-id="([^"]+)"/)?.[1] || "",
    token: tag.match(/\bdata-color-token="([^"]+)"/)?.[1] || ""
  };
});
const renderedPairFailures = renderedColorSwatches.flatMap(({ roleId, token }) => {
  const governedTokens = governedColorBindingsByRole.get(roleId);
  if (!governedTokens) return [`${roleId || "missing-role"}:${token || "missing-token"}:unknown-role`];
  if (!token) return [`${roleId}:missing-token`];
  return governedTokens.has(token) ? [] : [`${roleId}:${token}:not-bound-to-role`];
});
const renderedColorTokenCount = (html.match(/\bdata-color-token="[^"]+"/g) || []).length;
check(renderedColorSwatches.length > 0 && renderedColorSwatches.length === renderedColorTokenCount && renderedPairFailures.length === 0, "color:visible-role-token-pairs-resolve-exactly", renderedPairFailures.join(" | "));
check((colorFragment.match(/data-role-id=/g) || []).length === 45 && colorRoleIds.every(roleId => colorFragment.includes(`data-role-id="${roleId}"`)), "color:generated-fragment-covers-every-role");

const iconMapPath = implementationPath("citychat-icon-map.json");
const iconResolutionPath = implementationPath("citychat-icon-resolution.json");
const fontManifestPath = implementationPath("font-assets.manifest.json");
const iconMap = readJson(iconMapPath);
const iconResolution = readJson(iconResolutionPath);
const fontManifest = readJson(fontManifestPath);
const iconSchemas = [
  [iconMap, readJson(schemaPath("citychat-icon-map.schema")), "icon-map"],
  [iconResolution, readJson(schemaPath("citychat-icon-resolution.schema")), "icon-resolution"],
  [fontManifest, readJson(schemaPath("citychat-font-assets.schema")), "font-assets"]
];
for (const [record, schema, label] of iconSchemas) {
  const missing = schemaRequiredFields(record, schema);
  check(missing.length === 0, `icons:${label}:schema-required-fields`, missing.join(", "));
  const schemaAbsolute = resolveRecordPath(label === "font-assets" ? fontManifestPath : label === "icon-map" ? iconMapPath : iconResolutionPath, record.$schema);
  check(existsSync(schemaAbsolute), `icons:${label}:schema-ref-resolves`, schemaAbsolute);
}
check(iconMap.artifactVersion === config.artifactVersion && iconResolution.artifactVersion === config.artifactVersion && fontManifest.artifactVersion === config.artifactVersion, "icons:records-version-bound");
const fontRecord = fontManifest.fonts.find(font => font.fontAssetId === iconMap.fontAssetId);
check(Boolean(fontRecord) && iconResolution.fontAssetId === iconMap.fontAssetId, "icons:one-shared-font-asset-id");
if (fontRecord) {
  const fontAbsolute = resolveRecordPath(fontManifestPath, fontRecord.assetPath);
  const noticeAbsolute = resolveRecordPath(fontManifestPath, fontRecord.license.noticePath);
  const fontBytes = existsSync(fontAbsolute) ? readFileSync(fontAbsolute) : Buffer.alloc(0);
  const noticeBytes = existsSync(noticeAbsolute) ? readFileSync(noticeAbsolute) : Buffer.alloc(0);
  check(fontBytes.length === fontRecord.bytes && sha256(fontBytes) === fontRecord.sha256, "icons:font-binary-bytes-and-hash");
  check(noticeBytes.length === fontRecord.license.noticeBytes && sha256(noticeBytes) === fontRecord.license.noticeSha256 && fontRecord.license.spdxId === "Apache-2.0", "icons:license-bytes-hash-and-spdx");
  check(fontRecord.delivery.selfHosted === true && fontRecord.delivery.remoteRuntimeAllowed === false, "icons:self-hosted-delivery-boundary");
  const importerAbsolute = resolveRecordPath(fontManifestPath, fontRecord.source.importerEvidencePath);
  check(importerAbsolute === importerPath && sha256(readFileSync(importerAbsolute)) === fontRecord.source.importerEvidenceSha256, "icons:importer-evidence-byte-bound");
  const fontGlyphs = new Map(fontRecord.glyphs.map(glyph => [glyph.glyphName, glyph.codepoint]));
  check(iconMap.roles.length === 9 && iconMap.roles.every(role => fontGlyphs.get(role.glyph) === role.codepoint), "icons:closed-nine-role-glyph-map");
}
check(iconMap.axes.FILL === 0 && iconMap.axes.wght === 300 && iconMap.axes.GRAD === 0 && iconMap.axes.opsz === 24 && iconMap.axes.selectedFill1Supported === false, "icons:static-axes-contract");
check(iconMap.galleryPolicy.allowedContainer === "#icon-reference [role=list]" && iconResolution.librarySpecimens.containerSelector === "#icon-reference [role=list]", "icons:gallery-selector-current");
check(iconResolution.blockedBindings.length === 0, "icons:no-unresolved-blocked-bindings", iconResolution.blockedBindings.map(binding => binding.selector).join(" | "));
check(iconResolution.bindings.every(binding => !/#(?:implementation|control|icon|motion)-lab\b/.test(binding.selector)), "icons:no-stale-lab-selectors");
const gatedGlyphs = iconMap.roles.filter(role => role.artifactUseClass === "library_only_capability_gated").map(role => role.glyph);
const iconGalleryStart = html.indexOf('id="icon-reference"');
const iconGalleryEnd = iconGalleryStart < 0 ? -1 : html.indexOf('</article>', iconGalleryStart);
const outsideIconGallery = iconGalleryStart < 0 ? html : `${html.slice(0, iconGalleryStart)}${html.slice(iconGalleryEnd + 10)}`;
check(gatedGlyphs.every(glyph => !new RegExp(`>\\s*${escapeRegex(glyph)}\\s*<`).test(outsideIconGallery)), "icons:capability-gated-glyphs-remain-gallery-only");

const motionPath = implementationPath("semantic-motion.citychat.yml");
const motion = JSON.parse(readFileSync(path.join(deployment, motionPath), "utf8"));
const motionSchema = readJson(schemaPath("semantic-motion-citychat.schema"));
const motionMissing = schemaRequiredFields(motion, motionSchema);
check(motionMissing.length === 0, "motion:schema-required-fields", motionMissing.join(", "));
check(motion.artifactBuildId === config.artifactBuildId && motion.recordVersion === config.artifactVersion, "motion:artifact-and-version-bound");
check(motion.scope.fullLivingReference === false && motion.scope.localFixtureStateOnly === true && motion.scope.remoteEffect === false && motion.scope.telemetry === false, "motion:scoped-local-boundary");
check(motion.executablePrimitives.length === 2 && motion.executablePrimitives.some(primitive => primitive.selector === ".btn") && motion.executablePrimitives.some(primitive => primitive.selector === ".reveal"), "motion:only-inherited-button-and-reveal-primitives");
check(motion.semanticEventsEmitted.length === 0 && motion.semanticBindings.every(binding => binding.semanticEventEmission === "none" && binding.telemetryFromAnimation === false), "motion:no-semantic-event-or-telemetry-from-animation");
const revealEnhancement = motion.presentationEnhancements.find(enhancement => enhancement.selectorContract === "[data-reveal-group] > [data-reveal-item]");
check(Boolean(revealEnhancement) && revealEnhancement.peerCount.maximum <= 5 && revealEnhancement.executionPolicy === "once_per_page_approach" && /class_not_applied/.test(revealEnhancement.reducedMotion), "motion:once-only-max-five-reduced-final-state");
check((html.match(/<li\b[^>]*data-reveal-item/g) || []).length === 3 && (html.match(/data-reveal-group/g) || []).length === 1, "motion:one-three-item-reading-order-example");
const motionExample = elementFragmentById("motion-examples");
check(/nothing is sent or persisted|ไม่มีการส่งหรือบันทึก/i.test(motionExample) && !/class="[^"]*(?:receipt|success|celebrat)/i.test(motionExample), "motion:example-states-local-non-persistent-boundary");

const identity = readJson(config.identityManifest.path);
check(identity.artifactBuildId === config.artifactBuildId && identity.canonicalUrl === config.canonicalUrl, "identity:artifact-and-url-bound");
const lockup = identity.assets.find(asset => asset.assetId === "citychat-horizontal-lockup-png-94055c9b");
check(Boolean(lockup), "identity:official-lockup-recorded");
if (lockup) {
  const bytes = readFileSync(path.join(deployment, lockup.path));
  check(bytes.length === lockup.bytes && sha256(bytes) === lockup.sha256, "identity:lockup-bytes-and-hash");
  const escaped = lockup.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const uses = (html.match(new RegExp(`src="${escaped}"`, "g")) || []).length;
  check(uses === 2, "identity:lockup-used-exactly-header-and-footer", String(uses));
}
for (const [role, context] of [["header_lockup", "site_header"], ["footer_lockup", "site_footer"]]) {
  const approval = identity.roleApprovals.find(record => record.role === role);
  const valid = approval
    && approval.approvalState === "approved"
    && approval.approvedContentHash === lockup?.sha256
    && approval.artifactBinding?.refs?.includes(config.artifactBuildId)
    && approval.artifactBinding?.refs?.includes(config.canonicalUrl)
    && approval.contexts?.includes(context)
    && approval.surfaceDecision === "direct_surface"
    && approval.surfaceRef === "lds:--brand-beige";
  check(valid, `identity:${role}:exact-role-approval`);
  check(html.includes(`data-identity-role="${role}"`), `identity:${role}:markup-bound`);
}
check(identity.sourceOnlyAssets.every(record => !html.includes(`src="${identity.assets.find(asset => asset.assetId === record.assetId)?.path}"`)), "identity:source-assets-not-rendered");
const requiredOmissions = ["browser_tab_favicon", "apple_touch_icon", "maskable_app_icon", "social_preview_identity", "identity_motif"];
check(requiredOmissions.every(role => identity.omittedRoles.some(record => record.role === role)), "identity:unapproved-roles-omitted");
check(/\.site-header\s*\{[^}]*background:\s*var\(--brand-beige\)/s.test(css) && /\.site-footer\s*\{[^}]*background:\s*var\(--brand-beige\)/s.test(css), "identity:full-lds-beige-bands");
check(!/\.(?:brand|footer)-lockup\s*\{[^}]*(?:background|filter|mask|opacity|transform)\s*:/s.test(css), "identity:no-local-logo-carrier-or-transform");

const vendor = path.join(deployment, config.upstream.vendorPath);
const vendorPackage = JSON.parse(readFileSync(path.join(vendor, "package.json"), "utf8"));
check(vendorPackage.packageRevision === "v0.9.0-mp1", "vendor:package-revision");
check(vendorPackage.colorSetId === "color-srgb-05", "vendor:color-set");
check(vendorPackage.artifactBuildId === "ui-20260821-05", "vendor:upstream-artifact-build");
const vendorHashFailures = [];
for (const file of vendorPackage.files) {
  const absolute = path.join(vendor, file.path);
  if (!existsSync(absolute)) vendorHashFailures.push(`${file.path}: missing`);
  else {
    const bytes = readFileSync(absolute);
    if (bytes.length !== file.bytes || sha256(bytes) !== file.sha256) vendorHashFailures.push(file.path);
  }
}
check(vendorHashFailures.length === 0, "vendor:package-file-hashes", vendorHashFailures.slice(0, 5).join(", "));
const vendorReport = JSON.parse(readFileSync(path.join(vendor, "validation-report.json"), "utf8"));
check(vendorReport.totals.checks === 143 && vendorReport.totals.failures === 0, "vendor:recorded-package-validation");
check(vendorReport.boundary.includes("never certifies a downstream artifact"), "vendor:validation-boundary");

const buildCard = readFileSync(path.join(deployment, config.releaseArtifacts.buildCard), "utf8");
check(buildCard.includes("profile: designsystem.adoption"), "build-card:one-profile");
check(buildCard.includes("indexable: false") && buildCard.includes("evidenceStatus: source_limited"), "build-card:publication-truth");
check(buildCard.includes("remoteMutation: false") && buildCard.includes("remotePersistence: false"), "build-card:no-remote-effect");
check(buildCard.includes("PUB-01") && buildCard.includes("DELIVERY-01:web") && !buildCard.includes("WEB-DISCOVERY-01"), "build-card:triggered-packs-match-noindex-artifact");
check(buildCard.includes(config.identityManifest.sha256), "build-card:identity-manifest-bound");

const buttonContractPath = config.implementationRecords.buttonContract;
const buttonContract = readJson(buttonContractPath);
const buttonContractSchema = readJson(schemaPath("citychat-button-contract.schema"));
const buttonSchemaAbsolute = resolveRecordPath(buttonContractPath, buttonContract.$schema);
const canonicalButtonCss = path.join(deployment, config.upstream.vendorPath, "build-kit/lds-base.css");
const buttonContractMissing = schemaRequiredFields(buttonContract, buttonContractSchema);
check(buttonContractMissing.length === 0, "buttons:contract-schema-required-fields", buttonContractMissing.join(", "));
check(buttonSchemaAbsolute === path.join(deployment, schemaPath("citychat-button-contract.schema")) && existsSync(buttonSchemaAbsolute), "buttons:contract-schema-ref-resolves", buttonSchemaAbsolute);
check(buttonContract.contractId === "citychat-button-contract-v0.8" && buttonContract.artifactVersion === config.artifactVersion && buttonContract.artifactBuildId === config.artifactBuildId, "buttons:contract-version-and-build-bound");
check(buttonContract.upstream.ruleId === "BTN-GEOM-01" && buttonContract.upstream.canonicalCssSha256 === sha256(readFileSync(canonicalButtonCss)), "buttons:canonical-lds-css-byte-bound");
const buttonOutcomePairs = buttonContract.decisionModel.outcomes.flatMap(outcome => outcome.labelModes.map(labelMode => [labelMode, outcome.geometryRole]));
const buttonOutcomeByLabelMode = new Map(buttonOutcomePairs);
check(buttonContract.variants.length === 2 && buttonOutcomeByLabelMode.size === 3 && new Set(buttonContract.variants.map(variant => variant.geometryRole)).size === 2, "buttons:exact-two-shape-decision-model");
check(buttonOutcomeByLabelMode.get("visible_text") === "lds_labelled_capsule" && buttonOutcomeByLabelMode.get("icon_and_visible_text") === "lds_labelled_capsule" && buttonOutcomeByLabelMode.get("icon_only_accessible_name") === "lds_icon_circle", "buttons:label-mode-deterministically-selects-shape");

const assetLibraryPath = config.implementationRecords.assetLibrary;
const assetLibrary = readJson(assetLibraryPath);
const assetLibrarySchema = readJson(schemaPath("citychat-asset-library.schema"));
const assetSchemaAbsolute = resolveRecordPath(assetLibraryPath, assetLibrary.$schema);
const assetLibraryMissing = schemaRequiredFields(assetLibrary, assetLibrarySchema);
check(assetLibraryMissing.length === 0, "assets:library-schema-required-fields", assetLibraryMissing.join(", "));
check(assetSchemaAbsolute === path.join(deployment, schemaPath("citychat-asset-library.schema")) && existsSync(assetSchemaAbsolute), "assets:library-schema-ref-resolves", assetSchemaAbsolute);
check(assetLibrary.artifactVersion === config.artifactVersion && assetLibrary.artifactBuildId === config.artifactBuildId && assetLibrary.status === "safe_public_download_catalog", "assets:library-version-build-and-boundary");
const assetIds = assetLibrary.assets.map(asset => asset.assetId);
const assetPaths = assetLibrary.assets.map(asset => asset.path);
check(assetLibrary.assets.length > 0 && new Set(assetIds).size === assetLibrary.assets.length && new Set(assetPaths).size === assetLibrary.assets.length, "assets:complete-unique-file-catalog", `${assetLibrary.assets.length}/${new Set(assetPaths).size}`);
const requiredDownloadPaths = [
  "assets/identity/citychat-horizontal-lockup.png",
  "assets/identity/citychat-lockup.source.svg",
  "assets/identity/citychat-symbol.source.svg",
  "assets/icons/material-symbols-rounded-citychat-v368.ttf",
  implementationPath("citychat-button-contract.json"),
  implementationPath("cityscan-hero-specimen.html"),
  implementationPath("citychat-color-atlas.fragment.html"),
  cityScanTaxonomyPath,
  caseLibraryPath,
  schemaPath("cityscan-citycell-taxonomy.schema"),
  schemaPath("citychat-case-library.schema")
];
check(requiredDownloadPaths.every(relative => assetPaths.includes(relative)), "assets:identity-icon-button-hero-atlas-taxonomy-and-case-downloads-listed", requiredDownloadPaths.filter(relative => !assetPaths.includes(relative)).join(", "));
const assetFailures = assetLibrary.assets.flatMap(asset => {
  const failures = [];
  const normalized = path.posix.normalize(asset.path);
  if (path.posix.isAbsolute(asset.path) || normalized !== asset.path || normalized.startsWith("../")) failures.push(`${asset.assetId}:unsafe-path`);
  const absolute = path.join(deployment, asset.path);
  if (!existsSync(absolute) || !statSync(absolute).isFile()) failures.push(`${asset.assetId}:missing`);
  else {
    const bytes = readFileSync(absolute);
    if (bytes.length !== asset.bytes || sha256(bytes) !== asset.sha256) failures.push(`${asset.assetId}:byte-hash-mismatch`);
  }
  if (asset.publicDownload !== true) failures.push(`${asset.assetId}:not-public-download`);
  if (!asset.usePolicy?.allowedUses?.length || !asset.usePolicy?.blockedUses?.length) failures.push(`${asset.assetId}:empty-use-policy`);
  if (asset.licence?.noticePath && !existsSync(path.join(deployment, asset.licence.noticePath))) failures.push(`${asset.assetId}:missing-licence-notice`);
  return failures;
});
check(assetFailures.length === 0, "assets:paths-bytes-hashes-rights-and-use-policy", assetFailures.join(" | "));
check(["personal_photos", "avatars", "screenshots", "user_generated_content", "real_location_media", "uncleared_working_documents", "unclear_rights_assets"].every(item => assetLibrary.privacyBoundary.excluded.includes(item)), "assets:personal-and-uncleared-evidence-excluded");

const controlInventory = readJson(config.releaseArtifacts.controlInventory);
const missingControls = controlInventory.controls
  .filter(control => !html.includes(`id="${control.id}"`))
  .map(control => control.id);
check(missingControls.length === 0, "controls:inventory-resolves", missingControls.join(", "));
check(controlInventory.artifactBuildId === config.artifactBuildId && controlInventory.iconMapRef === iconMapPath, "controls:artifact-and-icon-map-bound");
check(controlInventory.buttonContractRef?.contractId === buttonContract.contractId && controlInventory.buttonContractRef?.path === buttonContractPath, "buttons:inventory-bound-to-contract");
check(new Set(controlInventory.controls.map(control => control.id)).size === controlInventory.controls.length, "controls:inventory-ids-unique");
const staticButtonTags = [...html.matchAll(/<(?:button|a)\b[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>/gi)].map(match => match[0]);
const staticButtonIds = staticButtonTags.map(tag => tag.match(/\bid="([^"]+)"/i)?.[1]).filter(Boolean);
const inventoriedButtonIds = controlInventory.controls.filter(control => control.geometryOwner === "LDS_BTN_GEOM_01").map(control => control.id);
const declaredActionControlCount = controlInventory.coverage?.actionControlCount;
check(Number.isInteger(declaredActionControlCount) && staticButtonTags.length === declaredActionControlCount && staticButtonIds.length === declaredActionControlCount && new Set(staticButtonIds).size === declaredActionControlCount, "buttons:all-static-actions-have-stable-unique-ids", `${staticButtonTags.length}/${staticButtonIds.length}/${declaredActionControlCount}`);
check(inventoriedButtonIds.length === declaredActionControlCount && JSON.stringify([...staticButtonIds].sort()) === JSON.stringify([...inventoriedButtonIds].sort()), "buttons:static-dom-and-inventory-reverse-coverage", JSON.stringify({ dom: staticButtonIds, inventory: inventoriedButtonIds }));
const buttonDecisionFailures = controlInventory.controls.filter(control => control.geometryOwner === "LDS_BTN_GEOM_01").flatMap(control => {
  const expected = buttonOutcomeByLabelMode.get(control.labelMode);
  const failures = [];
  if (expected !== control.geometryRole) failures.push(`${control.id}:${control.labelMode}->${expected || "unresolved"}/${control.geometryRole}`);
  for (const state of control.contractStates || []) {
    if (buttonOutcomeByLabelMode.get(state.labelMode) !== state.geometryRole) failures.push(`${control.id}:${state.triggerId}:${state.labelMode}->${state.geometryRole}`);
  }
  return failures;
});
check(buttonDecisionFailures.length === 0, "buttons:inventory-label-mode-to-shape-parity", buttonDecisionFailures.join(" | "));
const geometryFailures = controlInventory.controls.flatMap(control => {
  const tag = openingTagById(control.id);
  if (!tag) return [];
  if (control.geometryRole === "lds_labelled_capsule" && !/class="[^"]*\bbtn\b/.test(tag)) return [`${control.id}:missing-btn`];
  if (control.geometryRole === "lds_icon_circle" && !/class="[^"]*\bbtn-icon\b/.test(tag)) return [`${control.id}:missing-btn-icon`];
  return [];
});
check(geometryFailures.length === 0, "controls:geometry-role-resolves", geometryFailures.join(" | "));
const componentButtonClassFailures = controlInventory.controls
  .filter(control => control.geometryOwner === "component")
  .filter(control => /class="[^"]*\bbtn(?:\s|\b)[^"]*"/.test(openingTagById(control.id)))
  .map(control => control.id);
check(componentButtonClassFailures.length === 0, "buttons:tabs-segments-and-fields-do-not-borrow-action-shape", componentButtonClassFailures.join(", "));
const protectedGeometry = new Set([...buttonContract.protectedGeometryProperties, "width"]);
const productButtonGeometryFailures = [];
for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const declarations = [...match[2].matchAll(/([a-z-]+)\s*:\s*([^;]+);?/g)].map(item => [item[1].trim(), item[2].trim()]);
  for (const selector of match[1].split(",").map(value => value.trim())) {
    const buttonMatch = selector.match(/\.btn(?=[:.\[\s#>+~]|$)/);
    if (!buttonMatch) continue;
    const trailing = selector.slice(buttonMatch.index + buttonMatch[0].length);
    if (/[>+~]/.test(trailing)) continue;
    for (const [property, value] of declarations) {
      if (!protectedGeometry.has(property)) continue;
      const allowedLayoutWidth = property === "width" && value === "100%" && !selector.includes(".btn-icon");
      const allowedPrintHide = property === "display" && value === "none" && selector.includes(".closing .btn");
      if (!allowedLayoutWidth && !allowedPrintHide) productButtonGeometryFailures.push(`${selector}:${property}:${value}`);
    }
  }
}
check(productButtonGeometryFailures.length === 0, "buttons:product-css-does-not-redesign-lds-geometry", productButtonGeometryFailures.join(" | "));
const resolutionBySelector = iconResolution.bindings;
const iconControlFailures = controlInventory.controls.filter(control => control.iconRole).flatMap(control => {
  const fragment = elementFragmentById(control.id);
  const role = iconMap.roles.find(candidate => candidate.roleId === control.iconRole);
  const hasMappedGlyph = role && new RegExp(`<span[^>]*\\bicon-symbol\\b[^>]*>\\s*${escapeRegex(role.glyph)}\\s*</span>`).test(fragment);
  const hasResolution = resolutionBySelector.some(binding => binding.roleId === control.iconRole && binding.glyph === role?.glyph && binding.selector.includes(`#${control.id}`));
  return hasMappedGlyph && hasResolution ? [] : [`${control.id}:${control.iconRole}:${hasMappedGlyph ? "glyph-ok" : "glyph-missing"}:${hasResolution ? "binding-ok" : "binding-missing"}`];
});
check(iconControlFailures.length === 0, "controls:icon-roles-resolve-through-versioned-map", iconControlFailures.join(" | "));
const disabledSpecimenFailures = controlInventory.controls
  .filter(control => /disabled/.test(control.kind))
  .filter(control => !/\bdisabled\b|aria-disabled="true"/.test(openingTagById(control.id)))
  .map(control => control.id);
check(disabledSpecimenFailures.length === 0, "controls:disabled-specimens-are-inert", disabledSpecimenFailures.join(", "));
check(controlInventory.remoteEffects.length === 0, "controls:no-remote-effects");
check(controlInventory.presentationEnhancements?.length === 1 && controlInventory.presentationEnhancements[0].replay === false && controlInventory.presentationEnhancements[0].telemetry === false, "controls:one-nonsemantic-once-only-enhancement");

const manifestPath = path.join(deployment, config.releaseArtifacts.manifest);
if (!writeReport) {
  check(existsSync(manifestPath), "manifest:exists");
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    check(manifest.artifact.artifactBuildId === config.artifactBuildId, "manifest:artifact-build");
    check(manifest.artifact.profile === config.profile, "manifest:profile");
    check(manifest.publication.indexable === false && manifest.publication.evidenceStatus === "source_limited", "manifest:publication-truth");
    check(manifest.publication.machineValidation === "pending", "manifest:honest-machine-validation");
    check(manifest.identityManifest.sha256 === config.identityManifest.sha256, "manifest:identity-bound");
    check(JSON.stringify(manifest.implementationRecords) === JSON.stringify(config.implementationRecords), "manifest:implementation-record-index-bound");
    check(JSON.stringify(manifest.triggeredPacks) === JSON.stringify(config.triggeredPacks), "manifest:triggered-packs");
    const criticalPaths = new Set(manifest.criticalAssets.map(record => record.path));
    check(versionedMachineSources.every(relative => criticalPaths.has(relative)), "manifest:implementation-library-machine-records-critical");
    const priorV061 = manifest.historicalRecords.find(record => record.path === "site-manifest.v0.6.1.json");
    check(priorV061?.artifactBuildId === "citychat-ui-20260823-01" && priorV061?.rollbackCommit === "b0ca776179ede86b6ec726e0ea5cfa2946c36593" && priorV061?.manifestSha256 === "ba4f3cf0ec47dbf24da34aaccca1afffbe2429e2f7c8d1dfd783a5d86be81436", "manifest:v0.6.1-rollback-record-byte-bound");
    const priorV06 = manifest.historicalRecords.find(record => record.path === "site-manifest.v0.6.json");
    check(priorV06?.artifactBuildId === "citychat-ui-20260822-03" && priorV06?.rollbackCommit === "d610ba86ab2e7d4322b38ae5868cb828220d772d" && priorV06?.manifestSha256 === "0ac4ef511bd24f6d696534d3b8443720cbed612cdc5b6ce4f872553c4b2fc46a", "manifest:v0.6-rollback-record-byte-bound");
  }
}

const personalPathLeaks = [];
for (const relative of ["index.html", "citychat.css", "app.js", config.releaseArtifacts.buildCard, config.releaseArtifacts.implementationNotes, "llms.txt"]) {
  const text = readFileSync(path.join(deployment, relative), "utf8");
  if (/\/Users\/|\/home\/|file:\/\//.test(text)) personalPathLeaks.push(relative);
}
check(personalPathLeaks.length === 0, "privacy:no-personal-absolute-paths", personalPathLeaks.join(", "));

const automatedReportPath = path.join(deployment, config.releaseArtifacts.automatedQa);
let priorReport = null;
if (existsSync(automatedReportPath)) {
  try { priorReport = JSON.parse(readFileSync(automatedReportPath, "utf8")); }
  catch { priorReport = null; }
}
const priorDigest = priorReport?.testedSourceDigest || "";
check(writeReport || priorDigest === testedSourceDigest, "qa:automated-report-bound-to-tested-sources", `${priorDigest || "missing"}/${testedSourceDigest}`);

const parityCheckName = "qa:automated-report-contract-parity";
// Manifest checks run only in read-only release validation because the report is
// generated before the finalizer writes the new manifest. Keep the persisted
// source-report contract stable by comparing only checks that run in both modes.
const expectedCheckNames = [
  ...checks.filter(record => !record.name.startsWith("manifest:")).map(record => record.name),
  parityCheckName
];
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
    path: "tools/validate-release.mjs",
    sha256: validatorSha256,
    contractVersion: "1.2"
  },
  scope: "source and contract validation; not native-device or product-runtime certification",
  totals: { checks: checks.length, failures },
  result: failures === 0 ? "passed" : "failed",
  checks,
  openManualGateRef: config.releaseArtifacts.manualQa
};

if (writeReport) writeFileSync(automatedReportPath, `${JSON.stringify(report, null, 2)}\n`);
if (failures > 0) process.exit(1);
console.log(`Validated ${checks.length} release contracts with 0 failures.`);
