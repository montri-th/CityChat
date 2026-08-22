#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deployment = path.resolve(process.env.LOCAL_DEPLOYMENT_DIR || path.join(root, "deployment"));
const siteUrl = process.env.SITE_URL || "https://montri-th.github.io/CityChat/";
const manifest = JSON.parse(readFileSync(path.join(deployment, "site-manifest.v0.5.json"), "utf8"));
const localIndexText = readFileSync(path.join(deployment, "index.html"), "utf8");
const attempts = Number(process.env.VERIFY_ATTEMPTS || 30);
const delayMs = Number(process.env.VERIFY_DELAY_MS || 10000);
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

if (manifest.artifact.artifactBuildId !== "citychat-ui-20260822-02") throw new Error("Unexpected artifact build identity");
if (manifest.publication.indexable !== false || manifest.publication.evidenceStatus !== "source_limited") throw new Error("Unexpected publication boundary");
if (!localIndexText.includes('name="robots" content="noindex,nofollow,noarchive"')) throw new Error("Initial HTML noindex request missing");
if (!localIndexText.includes('rel="canonical" href="https://montri-th.github.io/CityChat/"')) throw new Error("Canonical URL mismatch");

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

const critical = [
  "index.html",
  "citychat.css",
  "app.js",
  "site-manifest.v0.5.json",
  "site-manifest.v0.4.json",
  "build-card.v0.5.yml",
  "control-inventory.v0.5.json",
  "implementation-notes.v0.5.md",
  "qa/manual-gates.v0.5.md",
  "qa/automated.v0.5.json",
  "assets/downloads/citychat-visual-experience-specification-v0.5.md",
  "assets/downloads/citychat-product-experience-profile-v0.4.md",
  "assets/downloads/citychat-component-contracts.v0.4.json",
  "assets/downloads/citychat-build-card-template.yml",
  "assets/downloads/vibe-coding-prompt.md",
  "assets/downloads/SHA256SUMS.txt",
  "assets/identity/citychat-horizontal-lockup.png",
  "assets/identity/citychat-symbol.source.svg",
  "assets/identity/citychat-lockup.source.svg",
  "assets/identity/identity-assets.v0.5.json",
  "resources/starter/index.html",
  "resources/starter/citychat.css",
  "resources/index.json",
  "vendor/landometer/v0.9.0/package.json",
  "vendor/landometer/v0.9.0/SHA256SUMS.txt",
  "vendor/landometer/v0.9.0/build-kit/lds-tokens.css",
  "vendor/landometer/v0.9.0/build-kit/lds-base.css",
  "llms.txt",
  "robots.txt"
];

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, expectedMimes) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "cache-control": "no-cache" }, redirect: "follow" });
      const type = response.headers.get("content-type") || "";
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const accepted = expectedMimes.some(expected => type.toLowerCase().includes(expected));
      if (!accepted) throw new Error(`MIME ${type}, expected one of ${expectedMimes.join(", ")}`);
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
  const local = relative === "index.html" ? path.join(deployment, "index.html") : path.join(deployment, relative);
  const expected = readFileSync(local);
  const requested = relative === "index.html"
    ? new URL(`?release=${manifest.artifact.artifactBuildId}`, siteUrl)
    : new URL(`${relative}?release=${manifest.artifact.artifactBuildId}`, siteUrl);
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
  artifactBuildId: manifest.artifact.artifactBuildId,
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
