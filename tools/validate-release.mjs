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
const implementationRecordRoot = `resources/citychat-ves/v${config.artifactVersion}`;
const implementationPath = name => `${implementationRecordRoot}/${name}`;
const schemaPath = name => `schemas/${name}.v${config.artifactVersion}.json`;
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

const versionedMachineSources = [
  implementationPath("citychat-color-atlas.fragment.html"),
  implementationPath("citychat-color-role-map.json"),
  implementationPath("citychat-icon-map.json"),
  implementationPath("citychat-icon-resolution.json"),
  implementationPath("font-assets.manifest.json"),
  implementationPath("semantic-motion.citychat.yml"),
  schemaPath("citychat-color-role-map.schema"),
  schemaPath("citychat-font-assets.schema"),
  schemaPath("citychat-icon-map.schema"),
  schemaPath("citychat-icon-resolution.schema"),
  schemaPath("semantic-motion-citychat.schema"),
  `qa/color-atlas-generation.v${config.artifactVersion}.json`,
  "assets/icons/material-symbols-rounded-citychat-v368.ttf",
  "assets/icons/LICENSE.material-symbols.txt"
];
const testedSourcePaths = [
  ["release.config.json", path.join(root, "release.config.json")],
  ["deployment/index.html", path.join(deployment, "index.html")],
  ["deployment/citychat.css", path.join(deployment, "citychat.css")],
  ["deployment/app.js", path.join(deployment, "app.js")],
  [`deployment/${config.releaseArtifacts.buildCard}`, path.join(deployment, config.releaseArtifacts.buildCard)],
  [`deployment/${config.releaseArtifacts.controlInventory}`, path.join(deployment, config.releaseArtifacts.controlInventory)],
  [`deployment/${config.releaseArtifacts.implementationNotes}`, path.join(deployment, config.releaseArtifacts.implementationNotes)],
  [`deployment/${config.identityManifest.path}`, path.join(deployment, config.identityManifest.path)],
  [`deployment/${config.sourceVisualExperience.path}`, path.join(deployment, config.sourceVisualExperience.path)],
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
check(html.includes("source_limited") && html.includes("not a product runtime"), "truth:visible-source-limited-boundary");
check(html.includes("CityChat VES v0.6") && html.includes("ตัวอย่างสำหรับทีม"), "ves:visible-version-and-fixture-boundary");
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

for (const record of [config.sourceVisualExperience, ...config.approvalRecords, ...config.productDependencies, config.identityManifest]) {
  check(sha256(readFileSync(path.join(deployment, record.path))) === record.sha256, `source:${path.basename(record.path)}:hash`);
}
const sourceVisualExperience = readFileSync(path.join(deployment, config.sourceVisualExperience.path), "utf8");
check(sourceVisualExperience.includes("not a second DS") && sourceVisualExperience.includes("Thai remains plain, short and human"), "source:ves-authority-and-language-boundary");
const experienceContract = readFileSync(path.join(deployment, config.productDependencies[0].path), "utf8");
check(experienceContract.includes("Canonical CityScan events MUST retain their owning names"), "source:canonical-cityscan-event-map");

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
const renderedColorRoles = [...html.matchAll(/data-color-role-id="([^"]+)"/g)].map(match => match[1]);
const governedColorBindings = new Set(colorMap.roles.flatMap(role => role.bindings || []).map(binding => binding.implementation));
const renderedColorTokens = [...html.matchAll(/data-color-token="([^"]+)"/g)].map(match => match[1]);
check(renderedColorRoles.length === renderedColorTokens.length && renderedColorTokens.every(token => governedColorBindings.has(token)), "color:visible-swatches-resolve-to-governed-bindings", renderedColorTokens.filter(token => !governedColorBindings.has(token)).join(", "));
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

const controlInventory = readJson(config.releaseArtifacts.controlInventory);
const missingControls = controlInventory.controls
  .filter(control => !html.includes(`id="${control.id}"`))
  .map(control => control.id);
check(missingControls.length === 0, "controls:inventory-resolves", missingControls.join(", "));
check(controlInventory.artifactBuildId === config.artifactBuildId && controlInventory.iconMapRef === iconMapPath, "controls:artifact-and-icon-map-bound");
check(new Set(controlInventory.controls.map(control => control.id)).size === controlInventory.controls.length, "controls:inventory-ids-unique");
const geometryFailures = controlInventory.controls.flatMap(control => {
  const tag = openingTagById(control.id);
  if (!tag) return [];
  if (control.geometryRole === "lds_labelled_capsule" && !/class="[^"]*\bbtn\b/.test(tag)) return [`${control.id}:missing-btn`];
  if (control.geometryRole === "lds_icon_circle" && !/class="[^"]*\bbtn-icon\b/.test(tag)) return [`${control.id}:missing-btn-icon`];
  return [];
});
check(geometryFailures.length === 0, "controls:geometry-role-resolves", geometryFailures.join(" | "));
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
    contractVersion: "1.1"
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
