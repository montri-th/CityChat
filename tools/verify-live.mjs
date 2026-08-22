#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deployment = path.resolve(process.env.LOCAL_DEPLOYMENT_DIR || path.join(root, "deployment"));
const config = JSON.parse(readFileSync(path.join(root, "release.config.json"), "utf8"));
const siteUrl = process.env.SITE_URL || config.canonicalUrl;
const manifest = JSON.parse(readFileSync(path.join(deployment, config.releaseArtifacts.manifest), "utf8"));
const localIndexText = readFileSync(path.join(deployment, "index.html"), "utf8");
const attempts = Number(process.env.VERIFY_ATTEMPTS || 30);
const delayMs = Number(process.env.VERIFY_DELAY_MS || 10000);
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

if (manifest.artifact.artifactBuildId !== config.artifactBuildId) throw new Error("Unexpected artifact build identity");
if (manifest.publication.indexable !== false || manifest.publication.evidenceStatus !== "source_limited") throw new Error("Unexpected publication boundary");
if (!localIndexText.includes('name="robots" content="noindex,nofollow,noarchive"')) throw new Error("Initial HTML noindex request missing");
if (!localIndexText.includes(`rel="canonical" href="${config.canonicalUrl}"`)) throw new Error("Canonical URL mismatch");

const mimeByExtension = {
  ".html": ["text/html"],
  ".css": ["text/css"],
  ".js": ["text/javascript", "application/javascript"],
  ".json": ["application/json"],
  ".md": ["text/markdown", "text/plain", "application/octet-stream"],
  ".txt": ["text/plain"],
  ".yml": ["text/yaml", "application/yaml", "text/plain", "application/octet-stream"],
  ".png": ["image/png"],
  ".svg": ["image/svg+xml"],
  ".woff2": ["font/woff2", "application/font-woff", "application/octet-stream"]
};

const critical = [...new Set([
  "index.html",
  config.releaseArtifacts.manifest,
  config.releaseArtifacts.checksums,
  "site-manifest.v0.5.json",
  "site-manifest.v0.4.json",
  ...manifest.criticalAssets.map(record => record.path)
])];

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, expectedMimes) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "cache-control": "no-cache" }, redirect: "follow" });
      const type = response.headers.get("content-type") || "";
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!expectedMimes.some(expected => type.toLowerCase().includes(expected))) {
        throw new Error(`MIME ${type}, expected one of ${expectedMimes.join(", ")}`);
      }
      return { response, bytes: Buffer.from(await response.arrayBuffer()) };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(delayMs);
    }
  }
  throw lastError;
}

const results = [];
for (const relative of critical) {
  const expected = readFileSync(path.join(deployment, relative));
  const requested = relative === "index.html"
    ? new URL(`?release=${config.artifactBuildId}`, siteUrl)
    : new URL(`${relative}?release=${config.artifactBuildId}`, siteUrl);
  const expectedMimes = mimeByExtension[path.extname(relative)] || ["application/octet-stream"];
  const { response, bytes } = await fetchWithRetry(requested, expectedMimes);
  const equal = bytes.equals(expected);
  results.push({
    path: relative,
    requestedUrl: requested.href,
    finalUrl: response.url,
    status: response.status,
    mime: response.headers.get("content-type"),
    bytes: bytes.length,
    sha256: sha256(bytes),
    expectedBytes: expected.length,
    expectedSha256: sha256(expected),
    exactSourceParity: equal
  });
  if (!equal) throw new Error(`Live byte mismatch: ${relative}`);
}

const rootResult = results.find(result => result.path === "index.html");
if (!rootResult.finalUrl.startsWith(siteUrl)) throw new Error(`Unexpected live root: ${rootResult.finalUrl}`);
console.log(JSON.stringify({
  schemaVersion: "1.0",
  receiptId: `citychat-live-${config.artifactBuildId}`,
  artifactBuildId: config.artifactBuildId,
  siteUrl,
  deployedSourceSha: process.env.GITHUB_SHA || "unresolved_local",
  publication: {
    indexable: false,
    evidenceStatus: "source_limited",
    htmlNoindexRequest: true,
    publicDownloadsMayStillBeIndexed: true
  },
  result: "passed",
  totals: { assets: results.length, failures: 0 },
  assets: results
}, null, 2));
