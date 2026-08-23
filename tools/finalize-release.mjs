#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deployment = path.join(root, "deployment");
const config = JSON.parse(readFileSync(path.join(root, "release.config.json"), "utf8"));
const checkOnly = process.argv.includes("--check");
const manifestRel = config.releaseArtifacts.manifest;
const sumsRel = config.releaseArtifacts.checksums;
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const implementationRecordRoot = config.implementationRecordRoot;
const versionedSchema = name => `schemas/${name}.v${config.artifactVersion}.json`;

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
  return { path: relative, bytes: bytes.length, sha256: sha256(bytes) };
});
const byPath = Object.fromEntries(files.map(file => [file.path, file]));

const requiredCritical = [...new Set([
  "index.html",
  "citychat.css",
  "app.js",
  config.releaseArtifacts.buildCard,
  config.releaseArtifacts.controlInventory,
  config.releaseArtifacts.implementationNotes,
  config.releaseArtifacts.automatedQa,
  config.releaseArtifacts.renderedQa,
  config.releaseArtifacts.manualQa,
  config.sourceDesignAddOn.path,
  ...config.approvalRecords.map(record => record.path),
  ...config.productDependencies.map(record => record.path),
  "assets/downloads/citychat-build-card-template.yml",
  "assets/downloads/vibe-coding-prompt.md",
  "assets/identity/citychat-horizontal-lockup.png",
  "assets/identity/citychat-symbol.source.svg",
  "assets/identity/citychat-lockup.source.svg",
  config.identityManifest.path,
  ...Object.values(config.implementationRecords || {}),
  "assets/icons/material-symbols-rounded-citychat-v368.ttf",
  "assets/icons/LICENSE.material-symbols.txt",
  `${implementationRecordRoot}/README.md`,
  `${implementationRecordRoot}/citychat-button-contract.json`,
  `${implementationRecordRoot}/cityscan-hero-specimen.html`,
  `${implementationRecordRoot}/citychat-color-atlas.fragment.html`,
  `${implementationRecordRoot}/citychat-color-role-map.json`,
  `${implementationRecordRoot}/citychat-icon-map.json`,
  `${implementationRecordRoot}/citychat-icon-resolution.json`,
  `${implementationRecordRoot}/font-assets.manifest.json`,
  `${implementationRecordRoot}/semantic-motion.citychat.yml`,
  versionedSchema("citychat-color-role-map.schema"),
  versionedSchema("citychat-font-assets.schema"),
  versionedSchema("citychat-icon-map.schema"),
  versionedSchema("citychat-icon-resolution.schema"),
  versionedSchema("semantic-motion-citychat.schema"),
  versionedSchema("citychat-button-contract.schema"),
  "schemas/citychat-asset-library.schema.v0.7.0.json",
  "assets/asset-library.v0.7.0.json",
  `qa/color-atlas-generation.v${config.artifactVersion}.json`,
  "resources/starter/index.html",
  "resources/starter/citychat.css",
  "resources/index.json",
  "vendor/landometer/v0.9.0/package.json",
  "vendor/landometer/v0.9.0/SHA256SUMS.txt",
  "vendor/landometer/v0.9.0/build-kit/lds-tokens.css",
  "vendor/landometer/v0.9.0/build-kit/lds-base.css",
  "llms.txt",
  "robots.txt"
])];

for (const required of requiredCritical) {
  if (!byPath[required]) throw new Error(`Missing critical release file: ${required}`);
}

for (const record of [config.sourceDesignAddOn, ...config.approvalRecords, ...config.productDependencies, config.identityManifest]) {
  const actual = byPath[record.path]?.sha256;
  if (actual !== record.sha256) throw new Error(`Pinned hash mismatch: ${record.path} (${actual || "missing"}/${record.sha256})`);
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
  releaseArtifacts: config.releaseArtifacts,
  sourceDesignAddOn: config.sourceDesignAddOn,
  approvalRecords: config.approvalRecords,
  productDependencies: config.productDependencies,
  governanceReferences: config.governanceReferences,
  identityManifest: config.identityManifest,
  implementationRecords: config.implementationRecords,
  triggeredPacks: config.triggeredPacks,
  supportedChannels: config.supportedChannels,
  upstream: config.upstream,
  capabilities: config.capabilities,
  historicalRecords: [
    {
      path: "site-manifest.v0.6.1.json",
      artifactBuildId: "citychat-ui-20260823-01",
      rollbackCommit: "b0ca776179ede86b6ec726e0ea5cfa2946c36593",
      manifestSha256: "ba4f3cf0ec47dbf24da34aaccca1afffbe2429e2f7c8d1dfd783a5d86be81436",
      currentBaseParity: false,
      boundary: "Historical record only; repository history is required to verify its original relative paths."
    },
    {
      path: "site-manifest.v0.6.json",
      artifactBuildId: "citychat-ui-20260822-03",
      rollbackCommit: "d610ba86ab2e7d4322b38ae5868cb828220d772d",
      manifestSha256: "0ac4ef511bd24f6d696534d3b8443720cbed612cdc5b6ce4f872553c4b2fc46a",
      currentBaseParity: false,
      boundary: "Historical record only; repository history is required to verify its original relative paths."
    },
    {
      path: "site-manifest.v0.5.json",
      artifactBuildId: "citychat-ui-20260822-02",
      rollbackCommit: "77da60b4bc04abe62e5a63dbf0742eabb104769c",
      manifestSha256: "d5e6141231296e368f0efa64b690dd612869700fbcfb523df5596a5647dae68d",
      currentBaseParity: false,
      boundary: "Historical record only; repository history is required to verify its original relative paths."
    },
    {
      path: "site-manifest.v0.4.json",
      artifactBuildId: "citychat-ui-20260822-01",
      currentBaseParity: false,
      boundary: "Historical record only; repository history is required to verify its original relative paths."
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
  boundary: "This manifest records source bytes for a source-limited design-guidance artifact. It does not authorize CityChat capabilities or certify a downstream product."
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
