#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deployment = path.join(root, "deployment");
const config = JSON.parse(readFileSync(path.join(root, "release.config.json"), "utf8"));
const checkOnly = process.argv.includes("--check");
const manifestRel = "site-manifest.v0.5.json";
const sumsRel = "assets/downloads/SHA256SUMS.txt";

const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

function listFiles(dir, prefix = "") {
  return readdirSync(dir).sort().flatMap(name => {
    const absolute = path.join(dir, name);
    const relative = path.posix.join(prefix, name);
    if (relative === manifestRel || relative === sumsRel || name === ".DS_Store") return [];
    return statSync(absolute).isDirectory() ? listFiles(absolute, relative) : [relative];
  });
}

const files = listFiles(deployment).map(relative => {
  const bytes = readFileSync(path.join(deployment, relative));
  return {
    path: relative,
    bytes: bytes.length,
    sha256: sha256(bytes)
  };
});

const byPath = Object.fromEntries(files.map(file => [file.path, file]));
const requiredCritical = [
  "index.html",
  "citychat.css",
  "app.js",
  "build-card.v0.5.yml",
  "control-inventory.v0.5.json",
  "implementation-notes.v0.5.md",
  "qa/automated.v0.5.json",
  "qa/manual-gates.v0.5.md",
  "assets/downloads/citychat-visual-experience-specification-v0.5.md",
  "assets/downloads/citychat-product-experience-profile-v0.4.md",
  "assets/downloads/citychat-component-contracts.v0.4.json",
  "assets/downloads/citychat-build-card-template.yml",
  "assets/downloads/vibe-coding-prompt.md",
  "assets/identity/citychat-horizontal-lockup.png",
  "assets/identity/identity-assets.v0.5.json",
  "resources/starter/index.html",
  "resources/index.json",
  "vendor/landometer/v0.9.0/package.json",
  "vendor/landometer/v0.9.0/SHA256SUMS.txt",
  "vendor/landometer/v0.9.0/build-kit/lds-tokens.css",
  "vendor/landometer/v0.9.0/build-kit/lds-base.css",
  "llms.txt",
  "robots.txt"
];

for (const required of requiredCritical) {
  if (!byPath[required]) throw new Error(`Missing critical release file: ${required}`);
}

const manifest = {
  schemaVersion: "1.0",
  artifact: {
    name: config.artifactName,
    product: config.product,
    version: config.artifactVersion,
    artifactBuildId: config.artifactBuildId,
    pageKind: config.pageKind,
    profile: config.profile,
    delivery: config.delivery,
    language: config.language,
    additionalLanguages: config.additionalLanguages
  },
  publication: {
    visibility: config.visibility,
    indexable: config.indexable,
    evidenceStatus: config.evidenceStatus,
    machineValidation: config.machineValidation,
    canonicalUrl: config.canonicalUrl,
    deliveryConformance: "not_claimed"
  },
  sourceVisualExperience: config.sourceVisualExperience,
  productDependencies: config.productDependencies,
  governanceReferences: config.governanceReferences,
  identityManifest: config.identityManifest,
  triggeredPacks: config.triggeredPacks,
  supportedChannels: config.supportedChannels,
  upstream: config.upstream,
  capabilities: config.capabilities,
  historicalRecords: [
    {
      path: "site-manifest.v0.4.json",
      artifactBuildId: "citychat-ui-20260822-01",
      currentBaseParity: false,
      boundary: "Historical record only; repository history is required to verify its original relative paths."
    },
    {
      paths: ["build-card.v0.4.yml", "control-inventory.v0.4.json", "implementation-notes.v0.4.md", "qa/automated.v0.4.json", "qa/manual-gates.v0.4.md", "qa/rendered-local.v0.4.json"],
      artifactBuildId: "citychat-ui-20260822-01",
      currentAuthority: false
    }
  ],
  releaseBoundary: {
    publicProjectionOfInternalTeamLearning: true,
    conceptualFixtures: true,
    productRuntimeEvidence: false,
    faviconApproval: "unresolved_and_omitted",
    socialPreviewApproval: "unresolved_and_omitted",
    manualGates: "open"
  },
  totals: {
    files: files.length,
    bytes: files.reduce((sum, file) => sum + file.bytes, 0)
  },
  criticalAssets: requiredCritical.map(relative => byPath[relative]),
  files,
  boundary: "This manifest records source bytes for a source-limited design guidance artifact. It does not authorize CityChat capabilities or certify a downstream product."
};

const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
const manifestRecord = {
  path: manifestRel,
  bytes: Buffer.byteLength(manifestText),
  sha256: sha256(Buffer.from(manifestText))
};
const sumsText = [...files, manifestRecord]
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(file => `${file.sha256}  ${file.path}`)
  .join("\n") + "\n";

if (checkOnly) {
  const currentManifest = existsSync(path.join(deployment, manifestRel))
    ? readFileSync(path.join(deployment, manifestRel), "utf8")
    : "";
  const currentSums = existsSync(path.join(deployment, sumsRel))
    ? readFileSync(path.join(deployment, sumsRel), "utf8")
    : "";
  const problems = [];
  if (currentManifest !== manifestText) problems.push(manifestRel);
  if (currentSums !== sumsText) problems.push(sumsRel);
  if (problems.length) {
    console.error(`Release metadata is stale: ${problems.join(", ")}`);
    process.exit(1);
  }
  console.log(`Release metadata matches ${files.length} source files.`);
} else {
  writeFileSync(path.join(deployment, manifestRel), manifestText);
  writeFileSync(path.join(deployment, sumsRel), sumsText);
  console.log(`Finalized ${files.length} source files for ${config.artifactBuildId}.`);
}
