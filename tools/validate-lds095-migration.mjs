import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deployment = path.join(root, 'deployment');
const vendor = path.join(deployment, 'vendor/landometer/v0.9.5');
const fail = (message) => { throw new Error(`CityChat LDS 0.9.5 migration: ${message}`); };
const read = (relative) => readFileSync(path.join(deployment, relative));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const exact = (relative, expected) => {
  const actual = hash(read(relative));
  if (actual !== expected) fail(`${relative} SHA-256 ${actual} != ${expected}`);
};

const binding = JSON.parse(read('assets/downloads/citychat-ds-addon-v0.9.2-binding.json'));
if (binding.addonVersion !== '0.9.2'
  || binding.parentDesignSystem.version !== '0.9.5'
  || binding.parentDesignSystem.releaseRef !== 'v0.9.5-owner.1'
  || binding.parentDesignSystem.colorSetId !== 'color-srgb-08') fail('release tuple mismatch');

exact(`assets/downloads/${binding.normativeDocument.path}`, binding.normativeDocument.sha256);
exact(`assets/downloads/${binding.migrationRecord.path}`, binding.migrationRecord.sha256);
for (const item of binding.historicalExactDocuments) exact(`assets/downloads/${item.path}`, item.sha256);
exact('vendor/landometer/v0.9.5/machine/release.json', binding.parentDesignSystem.releaseJsonSha256);
exact('vendor/landometer/v0.9.5/SHA256SUMS.txt', binding.parentDesignSystem.sha256SumsSha256);

const sumLines = read('vendor/landometer/v0.9.5/SHA256SUMS.txt').toString('utf8').trim().split('\n');
const prefix = 'assets/lds-0.9.5/';
const packageEntries = sumLines.map((line) => {
  const match = line.match(/^([0-9a-f]{64})  (.+)$/);
  if (!match) fail('malformed upstream checksum ledger');
  return { expected: match[1], name: match[2] };
}).filter((entry) => entry.name.startsWith(prefix));
if (packageEntries.length !== 61) fail(`expected 61 vendored package assets, found ${packageEntries.length}`);
for (const entry of packageEntries) {
  const local = path.join(vendor, entry.name.slice(prefix.length));
  if (hash(readFileSync(local)) !== entry.expected) fail(`upstream byte mismatch: ${entry.name}`);
}
const listFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const absolute = path.join(directory, entry.name);
  return entry.isDirectory() ? listFiles(absolute) : [absolute];
});
const vendored = listFiles(vendor).filter((file) => statSync(file).isFile());
if (vendored.length !== packageEntries.length + 1) fail(`vendored package has unexpected files: ${vendored.length}`);

const release = JSON.parse(read('vendor/landometer/v0.9.5/machine/release.json'));
if (release.release.dsVersion !== '0.9.5'
  || release.release.colorSetId !== 'color-srgb-08'
  || release.release.signatureStatus !== 'unsigned') fail('upstream release metadata mismatch');

const cssPath = 'vendor/landometer/v0.9.5/build-kit/lds-0.9.5.css';
const css = read(cssPath).toString('utf8');
for (const match of css.matchAll(/@import\s+"([^"]+)"/g)) {
  const imported = path.resolve(deployment, path.dirname(cssPath), match[1]);
  if (!imported.startsWith(vendor + path.sep) || !statSync(imported).isFile()) fail(`missing CSS import: ${match[1]}`);
}
const fonts = read('vendor/landometer/v0.9.5/build-kit/fonts.css').toString('utf8');
for (const match of fonts.matchAll(/url\("([^"]+)"\)/g)) {
  const font = path.resolve(vendor, 'build-kit', match[1]);
  if (!font.startsWith(vendor + path.sep) || !statSync(font).isFile()) fail(`missing LDS font: ${match[1]}`);
}

for (const [locale, relative, prefixUrl] of [
  ['th', 'index.html', ''],
  ['en', 'en/index.html', '../'],
]) {
  const html = read(relative).toString('utf8');
  const links = [
    `${prefixUrl}citychat-lds095-foundation.css`,
    `${prefixUrl}${cssPath}`,
    `${prefixUrl}citychat-lds095-primitives.css`,
    `${prefixUrl}citychat.css`,
  ];
  let previous = -1;
  for (const href of links) {
    const next = html.indexOf(`href="${href}"`);
    if (next <= previous) fail(`${locale} runtime CSS order or asset missing: ${href}`);
    previous = next;
  }
  if (html.includes('href="vendor/landometer/v0.9.0/build-kit/lds-tokens.css"')
    || html.includes('href="../vendor/landometer/v0.9.0/build-kit/lds-tokens.css"')) fail(`${locale} loads old color tokens`);
  const baseUrl = 'https://montri-th.github.io/Landometer/v0.9.5/normative/Landometer-Design-System-v0.9.5.md';
  const addonUrl = 'https://montri-th.github.io/Landometer/v0.9.5/normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.5.md';
  if (!html.includes(`href="${baseUrl}"`) || !html.includes(`href="${addonUrl}"`)) fail(`${locale} base or separate Add-on download missing`);
  if (html.includes('CityChat-LDS-v0.9.5-standalone')) fail(`${locale} withdrawn combined product route present`);
  if (html.includes('href="./assets/downloads/citychat-ds-addon-v0.9.2-project-source.md"')
    || html.includes('href="../assets/downloads/citychat-ds-addon-v0.9.2-project-source.md"')) fail(`${locale} still routes to the superseded separate Add-on`);
}

const foundation = read('citychat-lds095-foundation.css').toString('utf8');
for (const value of ['--ldm-product-citychat-light-primary', '--ldm-product-citychat-dark-primary', '--ldm-atmosphere-gradient-measure-deep', '--ldm-atmosphere-gradient-measure-luminous']) {
  if (!foundation.includes(value)) fail(`CityChat bridge does not resolve ${value}`);
}
const config = JSON.parse(readFileSync(path.join(root, 'release.config.json')));
if (config.artifact.designSystemMigration?.citychatAddonVersion !== '0.9.2') fail('release config not migrated');
const sourcePolicy = JSON.parse(read(config.artifact.designSystemMigration.projectSourcePolicyPath));
if (sourcePolicy.normative.base.markdownUrl !== config.artifact.designSystemMigration.baseNormativeUrl
  || sourcePolicy.normative.addon.markdownUrl !== config.artifact.designSystemMigration.addonNormativeUrl
  || sourcePolicy.normative.requiredDesignSourceFileCount !== 2
  || sourcePolicy.normative.olderMasterRequired !== false
  || sourcePolicy.normative.addon.embedsSharedFoundation !== false
  || sourcePolicy.supersession.status !== 'cancelled_for_new_authoring') fail('base plus separate Add-on source policy mismatch');
for (const item of sourcePolicy.supersession.files) exact(item.path, item.sha256);
for (const part of ['base', 'addon']) {
  if (sourcePolicy.normative[part].jsonUrl !== sourcePolicy.normative[part].markdownUrl.replace(/\.md$/, '.json')) fail(`${part} JSON route mismatch`);
}

if (config.artifact.buildId !== 'citychat-landing-20260930-01'
  || config.artifact.releaseRevision !== 'citychat-lds095-20260930-01') fail('successor build identity mismatch');
const recordPath = config.artifact.designSystemMigration.contentReleaseRecordPath;
exact(recordPath, config.pinnedInputs[recordPath]);
const contentRelease = JSON.parse(read(recordPath));
if (contentRelease.artifact.buildId !== config.artifact.buildId
  || contentRelease.artifact.releaseRevision !== config.artifact.releaseRevision
  || contentRelease.artifact.parentDesignSystem.releaseRef !== binding.parentDesignSystem.releaseRef
  || contentRelease.currentNormative.sha256 !== binding.normativeDocument.sha256) fail('successor release record mismatch');
for (const item of Object.values(contentRelease.historicalApprovalSources)) {
  const original = item.path.startsWith('assets/')
    ? read(item.path)
    : readFileSync(path.join(root, item.path));
  if (hash(original) !== item.sha256) fail(`historical approval changed: ${item.path}`);
}
exact(contentRelease.successorIdentityManifest.path, contentRelease.successorIdentityManifest.sha256);
if (config.identity.manifest !== contentRelease.successorIdentityManifest.path) fail('current identity manifest route mismatch');
const currentIdentity = JSON.parse(read(config.identity.manifest));
if (currentIdentity.artifactBuildId !== config.artifact.buildId
  || currentIdentity.roleApprovals?.length !== 1
  || currentIdentity.roleApprovals[0].artifactBinding?.refs[0] !== config.artifact.buildId
  || currentIdentity.roleApprovals[0].role !== 'browser_tab_favicon') fail('successor favicon role scope mismatch');
if (contentRelease.unchangedMotifFiles.length !== 13) fail('motif carry-forward inventory incomplete');
for (const item of contentRelease.unchangedMotifFiles) {
  exact(item.path, item.sha256);
  if (read(item.path).length !== item.bytes) fail(`motif byte length changed: ${item.path}`);
}
exact(contentRelease.unchangedFavicon.path, contentRelease.unchangedFavicon.sha256);
if (contentRelease.rules.logoBubblesException?.indexOf('CC-EX-02') < 0
  || contentRelease.rules.ctaException?.indexOf('CC-EX-01 is retired') < 0) fail('artwork exception scope changed');

console.log(`CityChat LDS 0.9.5 migration validation passed (${packageEntries.length} exact upstream assets, two locales, four Add-on documents, successor content release).`);
