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
  ...config.approvalRecords.map(record => [`deployment/${record.path}`, path.join(deployment, record.path)])
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
check(!css.includes("var(--product-citychat-gradient)"), "css:product-gradient-not-used-as-data-signal");
check(css.includes("var(--surface-atmosphere-ground)") && css.includes("var(--interaction-accent)"), "css:semantic-token-composition");
check(css.includes("@media (prefers-reduced-motion: reduce)"), "motion:reduced-motion");
check(css.includes("@media (max-width: 599px)") && css.includes("@media (max-width: 899px)"), "responsive:inherited-lds-layout-thresholds");
check(!/overflow-x\s*:\s*hidden|backdrop-filter/.test(css), "responsive:no-overflow-masking-or-backdrop-blur");
check(css.includes("[data-story-view][hidden]") && css.includes("display: none"), "journey:hidden-attribute-not-overridden");
check(css.includes(".scan-composition") && css.includes(".scan-frame-geometry"), "scan:composition-and-visible-frame-separated");
check(css.includes("font-synthesis: none"), "type:no-synthetic-fonts");
for (const family of ["Arvo", "IBM Plex Sans Thai Looped", "Bai Jamjuree", "IBM Plex Sans Thai", "JetBrains Mono"]) {
  check(css.includes(`font-family: "${family}"`), `type:${family.toLowerCase().replaceAll(" ", "-")}:declared`);
}

check(!/fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|gtag\s*\(|analytics/i.test(app), "runtime:no-background-network-or-analytics");
check(app.includes('if (state.scan !== "locked") return') && app.includes("not saved to a system"), "runtime:locked-fixture-boundary");
check(html.includes('id="open-story-from-lock" hidden'), "runtime:story-handoff-hidden-until-lock");
check(app.includes("ArrowRight") && app.includes("Home") && app.includes("End"), "a11y:tab-keyboard-contract");
check(app.includes("navigator.clipboard") && app.includes("document.execCommand"), "effect:clipboard-fallback");
check(app.includes("คนเห็นคุณค่าอะไรในช่วงแรก?") && app.includes("What first value does the person receive?"), "handoff:copied-preflight-matches-visible-questions");

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
  .filter(control => !html.includes(`id="${control.id}"`) && !html.includes(`class="${control.id}`))
  .map(control => control.id);
check(missingControls.length === 0, "controls:inventory-resolves", missingControls.join(", "));
check(controlInventory.remoteEffects.length === 0, "controls:no-remote-effects");

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
    check(JSON.stringify(manifest.triggeredPacks) === JSON.stringify(config.triggeredPacks), "manifest:triggered-packs");
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
    contractVersion: "1.0"
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
