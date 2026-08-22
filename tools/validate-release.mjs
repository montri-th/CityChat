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
const readJson = relative => JSON.parse(readFileSync(path.join(deployment, relative), "utf8"));
const testedSourcePaths = [
  ["release.config.json", path.join(root, "release.config.json")],
  ["deployment/index.html", path.join(deployment, "index.html")],
  ["deployment/citychat.css", path.join(deployment, "citychat.css")],
  ["deployment/app.js", path.join(deployment, "app.js")],
  ["deployment/build-card.v0.5.yml", path.join(deployment, "build-card.v0.5.yml")],
  ["deployment/control-inventory.v0.5.json", path.join(deployment, "control-inventory.v0.5.json")],
  ["deployment/implementation-notes.v0.5.md", path.join(deployment, "implementation-notes.v0.5.md")],
  ["deployment/assets/identity/identity-assets.v0.5.json", path.join(deployment, "assets/identity/identity-assets.v0.5.json")],
  ["deployment/assets/downloads/citychat-visual-experience-specification-v0.5.md", path.join(deployment, config.sourceVisualExperience.path)]
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
check(html.includes('rel="canonical" href="https://montri-th.github.io/CityChat/"'), "publication:canonical");
check(!/(property="og:|name="twitter:|application\/ld\+json|rel="manifest"|rel="icon")/.test(html), "identity:no-unapproved-public-discovery-assets");
check(html.includes("source_limited") && html.includes("not a product runtime"), "truth:visible-source-limited-boundary");
check(html.includes("CityChat VES v0.5") && html.includes("ตัวอย่างสำหรับทีม"), "ves:visible-version-and-fixture-boundary");
check(html.includes("ยังบอกไม่ได้") && html.includes("ดูที่มา"), "copy:plain-thai-truth-and-disclosure");
check(html.includes('data-copy-layer="team"'), "copy:team-layer-explicit");
check(!/\bAI\b|inspector|claim ceiling|truth envelope|source_limited|DEMO-LOCK|SIGNAL_READY|NO_SCORE/i.test(frontstageHtml), "copy:no-internal-jargon-in-frontstage");
check(html.includes("PLACE-DEMO-01") && html.includes("SYNTHETIC"), "fixture:synthetic-object-labelled");
const rejectedStart = html.indexOf('class="case-card card rejected-case"');
check(rejectedStart >= 0 && /ยอดนิยม|popularity/i.test(html.slice(rejectedStart)), "rejected:popularity-is-labelled-teaching-only");
check(rejectedStart >= 0 && /ไม่บอกว่าเทศบาลรับเรื่อง|Do not claim municipal receipt/i.test(html.slice(rejectedStart)), "rejected:optimistic-receipt-is-labelled-teaching-only");
check(!/LivePulse|เทศบาลรับเรื่องแล้ว|municipality received/i.test(app + css), "truth:no-rejected-pattern-in-runtime-layer");
check((html.match(/data-th/g) || []).length > 80 && (html.match(/data-en/g) || []).length > 80, "locale:thai-english-content-present");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
check(duplicateIds.length === 0, "html:no-duplicate-ids", duplicateIds.join(", "));

check(!/#[0-9a-fA-F]{3,8}\b/.test(css), "css:no-build-local-raw-hex");
check(!css.includes("!important"), "css:no-build-local-important");
check(css.includes("var(--product-citychat-gradient)") === false, "css:product-gradient-not-used-as-data-signal");
check(css.includes("var(--surface-atmosphere-ground)") && css.includes("var(--interaction-accent)"), "css:semantic-token-composition");
check(css.includes("@media (prefers-reduced-motion: reduce)"), "motion:reduced-motion");
check(css.includes("@media (max-width: 599px)") && css.includes("@media (max-width: 899px)"), "responsive:inherited-lds-layout-thresholds");
check(!/overflow-x\s*:\s*hidden|backdrop-filter/.test(css), "responsive:no-overflow-masking-or-backdrop-blur");
check(css.includes(".scan-composition") && css.includes(".scan-frame-geometry"), "scan:composition-and-visible-frame-separated");

check(!/fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|gtag\s*\(|analytics/i.test(app), "runtime:no-background-network-or-analytics");
check(app.includes("if (state.scan !== \"locked\") return") && app.includes("not saved to a system"), "runtime:locked-fixture-boundary");
check(html.includes('id="open-story-from-lock" hidden'), "runtime:story-handoff-hidden-until-lock");
check(app.includes("ArrowRight") && app.includes("Home") && app.includes("End"), "a11y:tab-keyboard-contract");
check(app.includes("navigator.clipboard") && app.includes("document.execCommand"), "effect:clipboard-fallback");

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

const sourceVisualExperience = readFileSync(path.join(deployment, config.sourceVisualExperience.path), "utf8");
check(sha256(Buffer.from(sourceVisualExperience)) === config.sourceVisualExperience.sha256, "source:citychat-ves-hash");
check(sourceVisualExperience.includes("LDS + CityChat VES") && sourceVisualExperience.includes("not a second independent visual system"), "source:ves-no-fork-decision");
check(sourceVisualExperience.includes("public copy is short natural Thai") && sourceVisualExperience.includes("no AI/inspector/internal terms"), "source:plain-language-contract");
const experienceContract = readFileSync(path.join(deployment, config.productDependencies[0].path), "utf8");
check(sha256(Buffer.from(experienceContract)) === config.productDependencies[0].sha256, "source:experience-contract-hash");
check(experienceContract.includes("Canonical CityScan events MUST retain their owning names"), "source:canonical-cityscan-event-map");
const componentContracts = readFileSync(path.join(deployment, config.productDependencies[1].path));
check(sha256(componentContracts) === config.productDependencies[1].sha256, "source:component-contracts-hash");

const identity = readJson("assets/identity/identity-assets.v0.5.json");
check(identity.artifactBuildId === config.artifactBuildId, "identity:artifact-build-bound");
check(sha256(readFileSync(path.join(deployment, config.identityManifest.path))) === config.identityManifest.sha256, "identity:manifest-hash-bound");
for (const asset of identity.assets) {
  const bytes = readFileSync(path.join(deployment, asset.path));
  check(bytes.length === asset.bytes && sha256(bytes) === asset.sha256, `identity:${asset.variant}:bytes-and-hash`);
}
const runtimeLockup = identity.assets.find(asset => asset.role === "header_and_footer_lockup");
const lockupUses = runtimeLockup ? (html.match(new RegExp(`(?:src|href)="${runtimeLockup.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g")) || []).length : 0;
check(Boolean(runtimeLockup) && lockupUses === 2, "identity:lockup-used-exactly-header-and-footer", String(lockupUses));
check(identity.assets.filter(asset => asset.role === "source_asset_public_download_only").every(asset => !html.includes(`src="${asset.path}"`)), "identity:source-assets-not-rendered");
check(!/\.brand-lockup\s+img\s*\{[^}]*filter\s*:/s.test(css), "identity:lockup-not-filtered");
check(identity.omittedRoles.some(role => role.role === "favicon"), "identity:favicon-omission-recorded");

const vendor = path.join(deployment, config.upstream.vendorPath);
const vendorPackage = JSON.parse(readFileSync(path.join(vendor, "package.json"), "utf8"));
check(vendorPackage.packageRevision === "v0.9.0-mp1", "vendor:package-revision");
check(vendorPackage.colorSetId === "color-srgb-05", "vendor:color-set");
check(vendorPackage.artifactBuildId === "ui-20260821-05", "vendor:upstream-artifact-build");
const vendorHashFailures = [];
for (const file of vendorPackage.files) {
  const absolute = path.join(vendor, file.path);
  if (!existsSync(absolute)) {
    vendorHashFailures.push(`${file.path}: missing`);
    continue;
  }
  const bytes = readFileSync(absolute);
  if (bytes.length !== file.bytes || sha256(bytes) !== file.sha256) vendorHashFailures.push(file.path);
}
check(vendorHashFailures.length === 0, "vendor:package-file-hashes", vendorHashFailures.slice(0, 5).join(", "));
const vendorReport = JSON.parse(readFileSync(path.join(vendor, "validation-report.json"), "utf8"));
check(vendorReport.totals.checks === 143 && vendorReport.totals.failures === 0, "vendor:recorded-package-validation");
check(vendorReport.boundary.includes("never certifies a downstream artifact"), "vendor:validation-boundary");

const buildCard = readFileSync(path.join(deployment, "build-card.v0.5.yml"), "utf8");
check(buildCard.includes("profile: designsystem.adoption"), "build-card:one-profile");
check(buildCard.includes("indexable: false") && buildCard.includes("evidenceStatus: source_limited"), "build-card:publication-truth");
check(buildCard.includes("remoteMutation: false") && buildCard.includes("remotePersistence: false"), "build-card:no-remote-effect");
check(buildCard.includes("PUB-01") && buildCard.includes("DELIVERY-01:web") && !buildCard.includes("WEB-DISCOVERY-01"), "build-card:triggered-packs-match-noindex-artifact");
check(buildCard.includes(config.identityManifest.sha256), "build-card:identity-manifest-bound");

const controlInventory = readJson("control-inventory.v0.5.json");
const missingControls = controlInventory.controls
  .filter(control => !html.includes(`id="${control.id}"`) && !html.includes(`class="${control.id}`))
  .map(control => control.id);
check(missingControls.length === 0, "controls:inventory-resolves", missingControls.join(", "));
check(controlInventory.remoteEffects.length === 0, "controls:no-remote-effects");

const manifest = readJson("site-manifest.v0.5.json");
check(manifest.artifact.artifactBuildId === config.artifactBuildId, "manifest:artifact-build");
check(manifest.artifact.profile === "designsystem.adoption", "manifest:profile");
check(manifest.publication.indexable === false && manifest.publication.evidenceStatus === "source_limited", "manifest:publication-truth");
check(manifest.publication.machineValidation === "pending", "manifest:honest-machine-validation");
check(manifest.identityManifest.sha256 === config.identityManifest.sha256, "manifest:identity-bound");
check(JSON.stringify(manifest.triggeredPacks) === JSON.stringify(["PUB-01", "DELIVERY-01:web"]), "manifest:triggered-packs");

const personalPathLeaks = [];
for (const relative of ["index.html", "citychat.css", "app.js", "build-card.v0.5.yml", "implementation-notes.v0.5.md", "llms.txt"]) {
  const text = readFileSync(path.join(deployment, relative), "utf8");
  if (/\/Users\/|\/home\/|file:\/\//.test(text)) personalPathLeaks.push(relative);
}
check(personalPathLeaks.length === 0, "privacy:no-personal-absolute-paths", personalPathLeaks.join(", "));

const priorAutomatedReportPath = path.join(deployment, "qa/automated.v0.5.json");
let priorAutomatedDigest = "";
if (existsSync(priorAutomatedReportPath)) {
  try { priorAutomatedDigest = JSON.parse(readFileSync(priorAutomatedReportPath, "utf8")).testedSourceDigest || ""; }
  catch { priorAutomatedDigest = ""; }
}
check(writeReport || priorAutomatedDigest === testedSourceDigest, "qa:automated-report-bound-to-tested-sources", `${priorAutomatedDigest || "missing"}/${testedSourceDigest}`);

const report = {
  schemaVersion: "1.0",
  artifactBuildId: config.artifactBuildId,
  testedSourceDigest,
  testedSourceDigestAlgorithm: "sha256(path-NUL-bytes-NUL in declared order)",
  testedSourcePaths: testedSourcePaths.map(([label]) => label),
  scope: "source and contract validation; not native-device or product-runtime certification",
  totals: { checks: checks.length, failures },
  result: failures === 0 ? "passed" : "failed",
  checks,
  openManualGateRef: "manual-gates.v0.5.md"
};

if (writeReport) {
  writeFileSync(path.join(deployment, "qa/automated.v0.5.json"), `${JSON.stringify(report, null, 2)}\n`);
}

if (failures > 0) process.exit(1);
console.log(`Validated ${checks.length} release contracts with 0 failures.`);
