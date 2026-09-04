#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolsRoot, '..');
const config = JSON.parse(readFileSync(path.join(repositoryRoot, 'release.config.json'), 'utf8'));
const deploymentRoot = path.resolve(process.env.LOCAL_DEPLOYMENT_DIR || path.join(repositoryRoot, config.deployment.root));
const manifestPath = resolveDeploymentPath(config.deployment.manifest);
const checksumsPath = resolveDeploymentPath(config.deployment.checksums);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const entryRelativePath = safeRelativePath(config.deployment.entry);
const attempts = positiveInteger(process.env.VERIFY_ATTEMPTS || config.live.attempts, 'VERIFY_ATTEMPTS');
const delayMs = nonNegativeInteger(process.env.VERIFY_DELAY_MS || config.live.delayMs, 'VERIFY_DELAY_MS');
const releaseKey = [config.artifact.buildId, process.env.GITHUB_SHA || 'local'].join('.');

function positiveInteger(value, name) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number <= 0) throw new Error(`${name} must be a positive integer.`);
  return number;
}

function nonNegativeInteger(value, name) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0) throw new Error(`${name} must be a non-negative integer.`);
  return number;
}

function safeRelativePath(value) {
  if (
    typeof value !== 'string'
    || value.length === 0
    || path.isAbsolute(value)
    || value.includes('\\')
    || value.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new Error(`Unsafe deployment-relative path: ${String(value)}`);
  }
  return value;
}

function resolveDeploymentPath(relativePath) {
  const safePath = safeRelativePath(relativePath);
  const absolutePath = path.resolve(deploymentRoot, safePath);
  const relation = path.relative(deploymentRoot, absolutePath);
  if (relation.startsWith('..') || path.isAbsolute(relation)) throw new Error(`Path leaves deployment root: ${relativePath}`);
  return absolutePath;
}

const localePages = (Array.isArray(config.locales) && config.locales.length > 0
  ? config.locales
  : [{
      id: config.artifact.language,
      language: config.artifact.language,
      entry: config.deployment.entry,
      publicPath: './',
      canonicalUrl: config.artifact.canonicalUrl,
      assetPrefix: './',
      requiredText: config.markup.requiredText,
      forbiddenText: config.markup.forbiddenText,
    }]
).map((locale) => {
  const entry = safeRelativePath(locale.entry);
  const publicPath = locale.publicPath;
  if (typeof publicPath !== 'string' || !/^(?:\.\/|[a-z0-9][a-z0-9/-]*\/)$/.test(publicPath)) {
    throw new Error(`Unsafe public locale path for ${locale.id}: ${String(publicPath)}`);
  }
  const bytes = readFileSync(resolveDeploymentPath(entry));
  return {
    ...locale,
    entry,
    bytes,
    text: bytes.toString('utf8'),
    assetPrefix: locale.assetPrefix || (entry === entryRelativePath ? './' : '../'),
    requiredText: locale.requiredText || (entry === entryRelativePath ? config.markup.requiredText : []),
    forbiddenText: locale.forbiddenText || config.markup.forbiddenText,
  };
});

const primaryLocale = localePages.find((locale) => locale.entry === entryRelativePath);
if (!primaryLocale) throw new Error(`No locale is configured for the primary entry: ${entryRelativePath}`);
if (new Set(localePages.map((locale) => locale.id)).size !== localePages.length) throw new Error('Locale IDs must be unique.');
if (new Set(localePages.map((locale) => locale.entry)).size !== localePages.length) throw new Error('Locale entries must be unique.');
const localeByEntry = new Map(localePages.map((locale) => [locale.entry, locale]));

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function occurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let offset = 0;
  while ((offset = haystack.indexOf(needle, offset)) !== -1) {
    count += 1;
    offset += needle.length;
  }
  return count;
}

function attributes(source) {
  const result = new Map();
  const matcher = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of source.matchAll(matcher)) {
    result.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}

function tags(tagName, source) {
  const matcher = new RegExp(`<${tagName}\\b([^>]*)>`, 'gi');
  return [...source.matchAll(matcher)].map((match) => attributes(match[1]));
}

function normalizeResource(rawValue, fromRelativePath, context) {
  const value = rawValue.trim().replace(/^['"]|['"]$/g, '');
  if (!value || value.startsWith('#') || /^(?:data|blob):/i.test(value)) return null;
  if (/^(?:https?:)?\/\//i.test(value)) throw new Error(`External runtime resource in ${context}: ${value}`);
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('/')) throw new Error(`Unsafe runtime resource in ${context}: ${value}`);

  let decoded;
  try {
    decoded = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  } catch {
    throw new Error(`Undecodable runtime resource in ${context}: ${value}`);
  }
  if (!decoded || decoded.includes('\\')) throw new Error(`Unsafe runtime resource separator in ${context}: ${value}`);

  const relativePath = path.posix.normalize(path.posix.join(path.posix.dirname(fromRelativePath), decoded));
  if (relativePath === '..' || relativePath.startsWith('../') || path.posix.isAbsolute(relativePath)) {
    throw new Error(`Runtime resource leaves deployment root in ${context}: ${value}`);
  }
  return relativePath.replace(/^\.\//, '');
}

function assertLocalReleaseMetadata() {
  if (manifest.schemaVersion !== '1.0') throw new Error(`Unexpected manifest schema: ${manifest.schemaVersion}`);
  if (manifest.artifact?.buildId !== config.artifact.buildId) throw new Error('Manifest build identity does not match release config.');
  if (manifest.publication?.indexable !== false || manifest.publication?.robotsMeta !== config.publication.robotsMeta) {
    throw new Error('Manifest does not preserve the configured non-indexable publication boundary.');
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) throw new Error('Manifest has no deployable file records.');

  const paths = manifest.files.map((record) => safeRelativePath(record.path));
  const sorted = [...paths].sort();
  if (new Set(paths).size !== paths.length || paths.some((value, index) => value !== sorted[index])) {
    throw new Error('Manifest paths must be unique and deterministically sorted.');
  }
  if (paths.includes(config.deployment.manifest) || paths.includes(config.deployment.checksums)) {
    throw new Error('Manifest must not contain self-referential generated metadata records.');
  }

  let totalBytes = 0;
  for (const record of manifest.files) {
    const absolutePath = resolveDeploymentPath(record.path);
    if (!existsSync(absolutePath)) throw new Error(`Manifest file is missing locally: ${record.path}`);
    const bytes = readFileSync(absolutePath);
    totalBytes += bytes.byteLength;
    if (record.bytes !== bytes.byteLength || record.sha256 !== sha256(bytes)) {
      throw new Error(`Manifest record mismatch: ${record.path}`);
    }
  }
  if (manifest.totals?.files !== manifest.files.length || manifest.totals?.bytes !== totalBytes) {
    throw new Error('Manifest totals do not match its file records.');
  }

  const expectedChecksumRecords = [
    ...manifest.files.map((record) => ({ path: record.path, sha256: record.sha256 })),
    { path: config.deployment.manifest, sha256: sha256(readFileSync(manifestPath)) },
  ].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  const expectedChecksums = `${expectedChecksumRecords.map((record) => `${record.sha256}  ${record.path}`).join('\n')}\n`;
  if (readFileSync(checksumsPath, 'utf8') !== expectedChecksums) throw new Error('Local checksum ledger is stale or incomplete.');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function localeAssetHref(locale, relativePath) {
  return `${locale.assetPrefix}${relativePath}`;
}

function footerForLocale(locale) {
  const localized = config.footer.locales?.[locale.id] || {};
  return {
    contact: {
      ...config.footer.contact,
      ...(localized.contact || {}),
      map: { ...config.footer.contact.map, ...(localized.contact?.map || {}) },
      email: { ...config.footer.contact.email, ...(localized.contact?.email || {}) },
    },
    links: localized.links || config.footer.links,
    labels: localized.labels || {},
  };
}

function assertLandingText(source, locale, label) {
  if (!source.includes(`<meta name="robots" content="${config.publication.robotsMeta}">`)) {
    throw new Error(`${label} does not preserve the exact noindex meta request.`);
  }
  if (!new RegExp(`<html\\b[^>]*\\blang=["']${escapeRegExp(locale.language)}["']`, 'i').test(source)) {
    throw new Error(`${label} does not declare the configured document language: ${locale.language}`);
  }
  if (!source.includes(`<link rel="canonical" href="${locale.canonicalUrl}">`)) {
    throw new Error(`${label} canonical URL does not match the release config.`);
  }
  for (const alternate of localePages) {
    if (!source.includes(`<link rel="alternate" hreflang="${alternate.language}" href="${alternate.canonicalUrl}">`)) {
      throw new Error(`${label} is missing the reciprocal ${alternate.language} alternate URL.`);
    }
  }
  if (!source.includes(`<link rel="alternate" hreflang="x-default" href="${primaryLocale.canonicalUrl}">`)) {
    throw new Error(`${label} is missing the primary x-default alternate URL.`);
  }
  const expectedFaviconHref = localeAssetHref(locale, config.identity.favicon.path);
  if (!source.includes(`<link rel="icon" type="${config.identity.favicon.mimeType}" href="${expectedFaviconHref}">`)) {
    throw new Error(`${label} does not declare the approved CityChat favicon.`);
  }
  for (const { text, count } of locale.requiredText) {
    const actual = occurrences(source, text);
    if (actual !== count) throw new Error(`${label} required text count mismatch for “${text}”: expected ${count}, received ${actual}.`);
  }
  for (const text of locale.forbiddenText) {
    if (source.includes(text)) throw new Error(`${label} contains forbidden locale copy: ${text}`);
  }
  if (locale.languageSwitch) {
    const switchPattern = new RegExp(`<a\\b(?=[^>]*\\bhref=["']${escapeRegExp(locale.languageSwitch.href)}["'])(?=[^>]*\\bhreflang=["']${escapeRegExp(locale.languageSwitch.hreflang)}["'])[^>]*>\\s*${escapeRegExp(locale.languageSwitch.text)}\\s*<\\/a>`, 'gi');
    const switchCount = [...source.matchAll(switchPattern)].length;
    if (switchCount !== locale.languageSwitch.count) {
      throw new Error(`${label} locale switch count mismatch: expected ${locale.languageSwitch.count}, received ${switchCount}.`);
    }
  }
  if (!/<footer\b(?=[^>]*\bid=["']contact["'])(?=[^>]*\bclass=["'][^"']*\bsite-footer\b)(?=[^>]*\btabindex=["']-1["'])(?=[^>]*\baria-labelledby=["']contact-title["'])[^>]*>/i.test(source)) {
    throw new Error(`${label} footer root does not match the approved contract.`);
  }
  if (!/<div\b[^>]*class=["'][^"']*\bmeasure-line\b[^"']*["'][^>]*>\s*<span><\/span>\s*<span><\/span>\s*<span><\/span>\s*<span><\/span>\s*<\/div>/i.test(source)) {
    throw new Error(`${label} footer measure stripe does not have four parts.`);
  }
  const localizedFooter = footerForLocale(locale);
  for (const required of [
    localizedFooter.contact.company,
    localizedFooter.contact.address,
    localizedFooter.contact.email.text,
    localizedFooter.contact.email.href,
    localizedFooter.contact.map.text,
    localizedFooter.contact.map.href,
    ...config.footer.socialLinks.flatMap((link) => [link.text, link.href, `id="${link.iconId}"`, `href="#${link.iconId}"`]),
    ...localizedFooter.links.flatMap((link) => [link.text === 'Privacy & Terms' ? 'Privacy &amp; Terms' : link.text, link.href]),
    localizedFooter.labels.socialNav ? `aria-label="${localizedFooter.labels.socialNav}"` : null,
    localizedFooter.labels.footerNav ? `aria-label="${localizedFooter.labels.footerNav}"` : null,
    localizedFooter.labels.brand ? `aria-label="${localizedFooter.labels.brand}"` : null,
    `class="${config.footer.brandClass}" href="${config.footer.brandHref}"`,
    config.footer.copyright,
  ].filter(Boolean)) {
    if (!source.includes(required)) throw new Error(`${label} footer contract is missing: ${required}`);
  }
  const expectedVideoSrc = localeAssetHref(locale, config.media.cityscan.path);
  const video = tags('video', source).find((attrs) => attrs.has('data-cc-video'));
  if (!video
      || video.get('src') !== expectedVideoSrc
      || !['controls', 'autoplay', 'loop', 'muted', 'playsinline'].every((attribute) => video.has(attribute))) {
    throw new Error(`${label} CityScan video is not configured for muted inline autoplay and looping.`);
  }
  if (!video || Number(video.get('width')) !== config.media.cityscan.intrinsicWidth || Number(video.get('height')) !== config.media.cityscan.intrinsicHeight) {
    throw new Error(`${label} CityScan video does not preserve its exact portrait dimensions.`);
  }
  const highlightText = locale.highlightText || (locale.language === 'en'
    ? 'City data should keep moving after it is collected.'
    : 'ข้อมูลไม่ควรหยุดอยู่แค่วันที่เก็บ');
  if (!source.includes('class="city-loop-banner"') || !source.includes(highlightText)) {
    throw new Error(`${label} is missing the approved mid-page CityChat highlight.`);
  }
  if (!/<nav\b[^>]*class=["'][^"']*\bsocial-links\b[^"']*["'][^>]*>[\s\S]*?<svg\b[^>]*class=["'][^"']*\bsocial-icon\b[^"']*["'][^>]*aria-hidden=["']true["'][^>]*>[\s\S]*?<span\b[^>]*class=["'][^"']*\bsocial-link__label\b[^"']*\bvisually-hidden\b[^"']*["'][^>]*>/i.test(source)) {
    throw new Error(`${label} social profile links are not icon-only with accessible labels.`);
  }
  if (!/<\/main>\s*<footer\b[\s\S]*?<\/footer>\s*<\/div>\s*<\/body>\s*<\/html>\s*$/i.test(source)) {
    throw new Error(`${label} footer is not the final layout child.`);
  }
  if (/<\/?(?:x-dc|x-import|sc-if|sc-for)\b|\{\{[^}]+\}\}|type=["']text\/x-dc|data-dc-script|(?:support|ds-base)\.js|style-(?:hover|focus|active)=/i.test(source)) {
    throw new Error(`${label} contains DreamCanvas/template residue.`);
  }
}

assertLocalReleaseMetadata();
for (const locale of localePages) assertLandingText(locale.text, locale, `Local ${locale.entry}`);
const robotsRelativePath = 'robots.txt';
const localRobotsText = readFileSync(resolveDeploymentPath(robotsRelativePath), 'utf8');
if (!/^\s*Disallow:\s*\/\s*$/im.test(localRobotsText)) throw new Error('Local robots.txt does not disallow this project artifact.');

const manifestByPath = new Map(manifest.files.map((record) => [record.path, record]));
const localeEntryPaths = new Set(localePages.map((locale) => locale.entry));
const closure = new Set(localeEntryPaths);
const pending = [...localeEntryPaths];

function addResource(rawValue, fromRelativePath, context) {
  const relativePath = normalizeResource(rawValue, fromRelativePath, context);
  if (!relativePath || closure.has(relativePath)) return;
  closure.add(relativePath);
  pending.push(relativePath);
}

function localeNavigationTarget(rawValue, fromRelativePath) {
  const value = rawValue.trim();
  if (!value || value.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|blob:)/i.test(value)) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  } catch {
    return null;
  }
  if (!decoded || decoded.includes('\\') || decoded.startsWith('/')) return null;
  let target = path.posix.normalize(path.posix.join(path.posix.dirname(fromRelativePath), decoded));
  if (decoded.endsWith('/')) target = path.posix.join(target, 'index.html');
  return target.replace(/^\.\//, '');
}

while (pending.length > 0) {
  const relativePath = pending.shift();
  const absolutePath = resolveDeploymentPath(relativePath);
  if (!existsSync(absolutePath)) throw new Error(`Runtime closure file is missing locally: ${relativePath}`);
  if (!/\.(?:html?|css|svg)$/i.test(relativePath)) continue;
  const source = readFileSync(absolutePath, 'utf8');

  if (/\.html?$/i.test(relativePath)) {
    for (const attrs of tags('script', source)) {
      if (attrs.has('src')) addResource(attrs.get('src'), relativePath, `${relativePath} script src`);
    }
    for (const attrs of tags('link', source)) {
      const rel = (attrs.get('rel') || '').toLowerCase().split(/\s+/);
      if (rel.some((value) => ['stylesheet', 'preload', 'modulepreload', 'icon', 'manifest'].includes(value)) && attrs.has('href')) {
        addResource(attrs.get('href'), relativePath, `${relativePath} link href`);
      }
    }
    for (const tagName of ['img', 'video', 'audio', 'source', 'track', 'iframe', 'embed']) {
      for (const attrs of tags(tagName, source)) {
        if (attrs.has('src')) addResource(attrs.get('src'), relativePath, `${relativePath} ${tagName} src`);
        if (attrs.has('poster')) addResource(attrs.get('poster'), relativePath, `${relativePath} ${tagName} poster`);
        if (attrs.has('srcset')) {
          for (const candidate of attrs.get('srcset').split(',').map((part) => part.trim().split(/\s+/, 1)[0])) {
            addResource(candidate, relativePath, `${relativePath} ${tagName} srcset`);
          }
        }
      }
    }
    for (const attrs of tags('a', source)) {
      const href = attrs.get('href') || '';
      if (href && !href.startsWith('#') && !/^(?:https?:|mailto:|tel:)/i.test(href)) {
        const navigationTarget = localeNavigationTarget(href, relativePath);
        if (navigationTarget && localeEntryPaths.has(navigationTarget)) continue;
        addResource(href, relativePath, `${relativePath} local anchor`);
      }
    }
  }

  if (/\.css$/i.test(relativePath)) {
    for (const match of source.matchAll(/url\(\s*([^)]+?)\s*\)/gi)) addResource(match[1], relativePath, `${relativePath} CSS url()`);
    for (const match of source.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi)) addResource(match[1], relativePath, `${relativePath} CSS @import`);
  }

  if (/\.svg$/i.test(relativePath)) {
    for (const attrs of [...tags('image', source), ...tags('use', source)]) {
      const href = attrs.get('href') || attrs.get('xlink:href');
      if (href && !href.startsWith('#')) addResource(href, relativePath, `${relativePath} embedded SVG resource`);
    }
  }
}

for (const relativePath of closure) {
  const record = manifestByPath.get(relativePath);
  if (!record) throw new Error(`Runtime closure is not attested by the manifest: ${relativePath}`);
  const bytes = readFileSync(resolveDeploymentPath(relativePath));
  if (record.sha256 !== sha256(bytes) || record.bytes !== bytes.byteLength) throw new Error(`Runtime closure manifest mismatch: ${relativePath}`);
}

const siteUrlValue = process.env.SITE_URL || config.artifact.canonicalUrl;
const siteRoot = new URL(siteUrlValue);
siteRoot.search = '';
siteRoot.hash = '';
if (!siteRoot.pathname.endsWith('/')) siteRoot.pathname = `${siteRoot.pathname}/`;
const canonical = new URL(config.artifact.canonicalUrl);
if (siteRoot.origin !== canonical.origin || siteRoot.pathname !== canonical.pathname) {
  throw new Error(`SITE_URL must resolve to the configured GitHub Pages route: ${config.artifact.canonicalUrl}`);
}

const mimeByExtension = new Map([
  ['.html', ['text/html']],
  ['.css', ['text/css']],
  ['.js', ['text/javascript', 'application/javascript']],
  ['.json', ['application/json']],
  ['.txt', ['text/plain']],
  ['.svg', ['image/svg+xml']],
  ['.png', ['image/png']],
  ['.jpg', ['image/jpeg']],
  ['.jpeg', ['image/jpeg']],
  ['.webp', ['image/webp']],
  ['.mp4', ['video/mp4']],
  ['.woff2', ['font/woff2', 'application/font-woff', 'application/octet-stream']],
  ['.ttf', ['font/ttf', 'font/sfnt', 'application/x-font-ttf', 'application/octet-stream']],
]);

function expectedMimes(relativePath) {
  const values = mimeByExtension.get(path.extname(relativePath).toLowerCase());
  if (!values) throw new Error(`No live MIME assertion is configured for ${relativePath}`);
  return values;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchExact(relativePath) {
  const expectedBytes = readFileSync(resolveDeploymentPath(relativePath));
  const expectedHash = sha256(expectedBytes);
  const expectedTypes = expectedMimes(relativePath);
  const locale = localeByEntry.get(relativePath);
  const expectedUrl = locale ? new URL(locale.publicPath, siteRoot) : new URL(relativePath, siteRoot);
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const requested = new URL(expectedUrl);
    requested.searchParams.set('release', releaseKey);
    requested.searchParams.set('attempt', String(attempt));
    try {
      const response = await fetch(requested, {
        headers: { 'cache-control': 'no-cache' },
        redirect: 'follow',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const finalUrl = new URL(response.url);
      if (finalUrl.origin !== expectedUrl.origin || finalUrl.pathname !== expectedUrl.pathname) {
        throw new Error(`unexpected final URL ${response.url}`);
      }
      const mime = (response.headers.get('content-type') || '').toLowerCase();
      if (!expectedTypes.some((expected) => mime.includes(expected))) {
        throw new Error(`MIME ${mime || '(missing)'}, expected ${expectedTypes.join(' or ')}`);
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      const actualHash = sha256(bytes);
      if (bytes.byteLength !== expectedBytes.byteLength || actualHash !== expectedHash || !bytes.equals(expectedBytes)) {
        throw new Error(`byte/hash mismatch (${bytes.byteLength} bytes, ${actualHash})`);
      }
      return {
        path: relativePath,
        requestedUrl: requested.href,
        finalUrl: response.url,
        status: response.status,
        mime: response.headers.get('content-type'),
        bytes: bytes.byteLength,
        sha256: actualHash,
        expectedBytes: expectedBytes.byteLength,
        expectedSha256: expectedHash,
        exactSourceParity: true,
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(delayMs);
    }
  }
  throw new Error(`Live verification failed for ${relativePath} after ${attempts} attempt(s): ${lastError?.message || lastError}`);
}

const verifiedPaths = [
  ...closure,
  robotsRelativePath,
  config.deployment.manifest,
  config.deployment.checksums,
].filter((value, index, values) => values.indexOf(value) === index).sort();
const results = [];
for (const relativePath of verifiedPaths) results.push(await fetchExact(relativePath));

for (const locale of localePages) {
  const livePageResult = results.find((result) => result.path === locale.entry);
  if (!livePageResult) throw new Error(`No live byte result was recorded for locale entry: ${locale.entry}`);
  const livePageUrl = new URL(livePageResult.requestedUrl);
  const livePageResponse = await fetch(livePageUrl, { headers: { 'cache-control': 'no-cache' } });
  if (!livePageResponse.ok) throw new Error(`Unable to repeat live ${locale.id} HTML text assertion: HTTP ${livePageResponse.status}`);
  const livePageText = await livePageResponse.text();
  if (sha256(Buffer.from(livePageText)) !== sha256(locale.bytes)) {
    throw new Error(`Repeated live ${locale.entry} text fetch differs from the attested entry bytes.`);
  }
  assertLandingText(livePageText, locale, `Live ${locale.entry}`);
}

console.log(JSON.stringify({
  schemaVersion: '2.0',
  receiptId: `citychat-live-${config.artifact.buildId}`,
  artifact: config.artifact,
  siteUrl: siteRoot.href,
  deployedSourceSha: process.env.GITHUB_SHA || 'unresolved_local',
  publication: {
    visibility: config.publication.visibility,
    indexable: false,
    robotsMeta: config.publication.robotsMeta,
    canonicalVerified: true,
    liveTextVerified: true,
    robotsFileVerified: true,
    localesVerified: localePages.map((locale) => ({
      id: locale.id,
      language: locale.language,
      route: locale.publicPath,
      canonicalUrl: locale.canonicalUrl,
    })),
  },
  closure: {
    policy: config.live.verify,
    runtimeFiles: closure.size,
    policyFiles: 1,
    releaseMetadataFiles: 2,
  },
  result: 'passed',
  totals: {
    assets: results.length,
    bytes: results.reduce((sum, result) => sum + result.bytes, 0),
    failures: 0,
  },
  assets: results,
}, null, 2));
