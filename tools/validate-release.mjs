import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { Script } from 'node:vm';
import { fileURLToPath } from 'node:url';

const toolsRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolsRoot, '..');
const config = JSON.parse(readFileSync(path.join(repositoryRoot, 'release.config.json'), 'utf8'));
const deploymentRoot = path.resolve(repositoryRoot, config.deployment.root);
const entryRelativePath = safeRelativePath(config.deployment.entry, 'deployment entry');
const html = readFileSync(resolveDeploymentPath(entryRelativePath), 'utf8');
const css = readFileSync(resolveDeploymentPath('citychat.css'), 'utf8');
const app = readFileSync(resolveDeploymentPath('app.js'), 'utf8');
const liveVerifier = readFileSync(path.join(repositoryRoot, 'tools/verify-live.mjs'), 'utf8');
const failures = [];
const checks = [];

const motifPackageRoot = 'assets/citychat-motif-set';
const motifAmendmentPath = 'handoff/citychat-motif-set/AMENDMENT.md';
const motifRegisterPath = 'handoff/citychat-motif-set/asset-register.json';
const motifBuildCardPath = 'citychat-build-card.json';
const motifRuntimeHostPath = 'motif-runtime.js';
const motifGovernanceFiles = new Map([
  [motifAmendmentPath, { bytes: 10670, sha256: '5b95e07973b7441d5c42b7a2a769eb5bec309e86f733a43c1b46ce16756bc005' }],
  [motifRegisterPath, { bytes: 4353, sha256: '35bd51aaa001ed7874a5bb4428cc61a374f7f073bdeda6a8016741561acdca44' }],
]);
const motifRegisteredFiles = [
  { file: 'assets/3a-voice-home-light.svg', bytes: 11143, sha256: 'c175caf8dd9fb0b045af720693aa45aef588b026e4eeaa5b88754cfffa8a06eb' },
  { file: 'assets/3a-voice-home-dark.svg', bytes: 11143, sha256: '9717b6f70a9442e437e2ee069c335db44c8820aba6653d0aac385d1338f315d8' },
  { file: 'assets/3b-live-visit-trade-light.svg', bytes: 10504, sha256: '3727a85d22e666c26ee6b0e150c6faa9200de2eca049947ee95a94f400c9d157' },
  { file: 'assets/3b-live-visit-trade-dark.svg', bytes: 10504, sha256: '6f3a43b046b8c4a24b6f1c52b7d6a0e091ec08eb959f3cfecbe4e4140fc271a5' },
  { file: 'assets/3c-our-voice-here-light.svg', bytes: 12662, sha256: '4d13de02f25e82f0d919f5a51f18b72e5424798cfd83cdb2ff67e65e5458f1cd' },
  { file: 'assets/3c-our-voice-here-dark.svg', bytes: 12662, sha256: '350fadd34a5472ebac6effe2118e9fc4f3922b7dfd6e0d0faa9c6793bdaeba3d' },
  { file: 'assets/logo-bubbles-proposal-light.svg', bytes: 9249, sha256: '388f82731025fe82c446f4f40d611fc2a242997a47b0e82faeb1090f55b00760' },
  { file: 'assets/logo-bubbles-proposal-dark.svg', bytes: 9249, sha256: '2bb77c85b0885526b299899b6705d79b17383144f77fd563009f56f5143b76c6' },
  { file: 'assets/lockup-without-bubbles-light.png', bytes: 17608, sha256: 'df00f1c02f2c2c453dbd6a21746d015fff8079880de863b2643c9fc7c2449583' },
  { file: 'assets/lockup-without-bubbles-dark.png', bytes: 17483, sha256: '37af6d9675ee4c1eac934e60c6e481727c0ddb0aff0ad0db87000a6b1923990a' },
  { file: 'assets/conversation-motif-original.svg', bytes: 11610, sha256: 'fa67237428dc510cb4e7bc15e86e3764e9911db8a5e26787cb7d40291a284ca4' },
  { file: 'motion/citychat-motif-motion.css', bytes: 6779, sha256: '67c4f2638ef76b7ecf355edd53a7c4f2c55cc51cafe7291f28dbf9cd4e00e91d' },
  { file: 'motion/citychat-motif-motion.js', bytes: 43005, sha256: 'fc60ace74fa51fb4eb0f18e0398f4efe4032fcc18d38c4db7a350151c6e8064d' },
].map((record) => ({ ...record, deploymentPath: `${motifPackageRoot}/${record.file}` }));
const motifByFile = new Map(motifRegisteredFiles.map((record) => [record.file, record]));
const motifStaticIds = ['motif', 'a', 'b', 'c'];
let registeredMotionSvg = null;

function check(label, condition, details = '') {
  checks.push(label);
  if (!condition) failures.push(`${label}${details ? ` — ${details}` : ''}`);
}

function safeRelativePath(value, label = 'path') {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  if (
    path.isAbsolute(value)
    || value.includes('\\')
    || value.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')
  ) {
    throw new Error(`${label} is unsafe: ${value}`);
  }
  return value;
}

function resolveDeploymentPath(relativePath) {
  const absolutePath = path.resolve(deploymentRoot, relativePath);
  const relation = path.relative(deploymentRoot, absolutePath);
  if (relation.startsWith('..') || path.isAbsolute(relation)) {
    throw new Error(`Path leaves deployment root: ${relativePath}`);
  }
  return absolutePath;
}

function parseRegisteredMotionSvg(source) {
  const marker = 'export const svg = ';
  const start = source.indexOf(marker);
  if (start === -1) return null;
  const valueStart = start + marker.length;
  const end = source.indexOf(';\nexport const ids', valueStart);
  if (end === -1) return null;
  try {
    return JSON.parse(source.slice(valueStart, end));
  } catch {
    return null;
  }
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function inspectPng(buffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(signature) || buffer.toString('ascii', 12, 16) !== 'IHDR') {
    return { valid: false, width: 0, height: 0 };
  }
  return { valid: true, width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function inspectTopLevelMp4(buffer) {
  const boxes = [];
  let offset = 0;
  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) return { valid: false, boxes, detail: `truncated header at byte ${offset}` };
    let size = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    let headerSize = 8;
    if (size === 1) {
      if (offset + 16 > buffer.length) return { valid: false, boxes, detail: `truncated extended header for ${type}` };
      const extendedSize = buffer.readBigUInt64BE(offset + 8);
      if (extendedSize > BigInt(Number.MAX_SAFE_INTEGER)) return { valid: false, boxes, detail: `${type} is too large to validate safely` };
      size = Number(extendedSize);
      headerSize = 16;
    } else if (size === 0) {
      size = buffer.length - offset;
    }
    if (size < headerSize || offset + size > buffer.length) {
      return { valid: false, boxes, detail: `${type} declares ${size} bytes at ${offset}, beyond ${buffer.length}` };
    }
    boxes.push({ type, size, offset });
    offset += size;
  }
  return { valid: offset === buffer.length, boxes, detail: '' };
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

function tags(tagName, source = html) {
  const matcher = new RegExp(`<${tagName}\\b([^>]*)>`, 'gi');
  return [...source.matchAll(matcher)].map((match) => ({ raw: match[0], attrs: attributes(match[1]) }));
}

function decodeText(source) {
  return source
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([\da-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}

function pairedTags(tagName, source = html) {
  const matcher = new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  return [...source.matchAll(matcher)].map((match) => ({
    raw: match[0],
    attrs: attributes(match[1]),
    content: match[2],
    text: decodeText(match[2]),
  }));
}

function hasClass(attrs, className) {
  return (attrs.get('class') || '').split(/\s+/).includes(className);
}

function normalizeResource(rawValue, fromRelativePath, context) {
  const value = rawValue.trim().replace(/^['"]|['"]$/g, '');
  if (!value || value.startsWith('#') || /^(?:data|blob):/i.test(value)) return null;
  if (/^(?:https?:)?\/\//i.test(value)) {
    failures.push(`runtime resources are local — external ${context}: ${value}`);
    return null;
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('/')) {
    failures.push(`runtime resources use safe project-relative URLs — ${context}: ${value}`);
    return null;
  }

  let decoded;
  try {
    decoded = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  } catch {
    failures.push(`runtime resource URL is decodable — ${context}: ${value}`);
    return null;
  }
  if (!decoded || decoded.includes('\\')) {
    failures.push(`runtime resources use safe separators — ${context}: ${value}`);
    return null;
  }

  const relativePath = path.posix.normalize(path.posix.join(path.posix.dirname(fromRelativePath), decoded));
  if (relativePath === '..' || relativePath.startsWith('../') || path.posix.isAbsolute(relativePath)) {
    failures.push(`runtime resources remain inside deployment — ${context}: ${value}`);
    return null;
  }
  return relativePath.replace(/^\.\//, '');
}

const runtimeResources = new Set();
const stylesheetQueue = [];
function addRuntimeResource(rawValue, fromRelativePath, context) {
  const relativePath = normalizeResource(rawValue, fromRelativePath, context);
  if (!relativePath) return;
  if (!runtimeResources.has(relativePath)) {
    runtimeResources.add(relativePath);
    if (/\.(?:css|js|svg)$/i.test(relativePath)) stylesheetQueue.push(relativePath);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function localeRouteEntry(publicPath) {
  if (publicPath === './') return 'index.html';
  return `${publicPath}index.html`;
}

function navigationTarget(rawValue, fromRelativePath) {
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
  if (target === '..' || target.startsWith('../') || path.posix.isAbsolute(target)) return null;
  return target.replace(/^\.\//, '');
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

function idSequence(source) {
  return [...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
}

function idElementSignatures(source) {
  const signatures = [];
  for (const match of source.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)) {
    const attrs = attributes(match[2]);
    if (!attrs.has('id')) continue;
    signatures.push({
      id: attrs.get('id'),
      tag: match[1].toLowerCase(),
      role: attrs.get('role') || '',
      ariaControls: attrs.get('aria-controls') || '',
      ariaLabelledBy: attrs.get('aria-labelledby') || '',
    });
  }
  return signatures;
}

const localePages = (Array.isArray(config.locales) ? config.locales : []).map((locale) => {
  const entry = safeRelativePath(locale.entry, `locale ${locale.id} entry`);
  return { ...locale, entry, html: readFileSync(resolveDeploymentPath(entry), 'utf8') };
});
const localeById = new Map(localePages.map((locale) => [locale.id, locale]));
const localeEntryPaths = new Set(localePages.map((locale) => locale.entry));
const primaryLocale = localePages.find((locale) => locale.entry === entryRelativePath);
const englishLocale = localeById.get('en');
const englishHtml = englishLocale?.html || '';

function isLocaleNavigation(locale, href) {
  if (!locale?.languageSwitch || href !== locale.languageSwitch.href) return false;
  const targetLocale = localeById.get(locale.languageSwitch.target);
  return Boolean(targetLocale && navigationTarget(href, locale.entry) === targetLocale.entry);
}

function citychatStageMarkers(source) {
  return [...source.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)]
    .map((match) => ({ index: match.index, tag: match[1].toLowerCase(), attrs: attributes(match[2]) }))
    .filter(({ attrs }) => attrs.has('data-citychat-motif') || attrs.has('data-citychat-logo'));
}

function balancedElementSlice(source, openingIndex) {
  const opening = source.slice(openingIndex).match(/^<([a-z][\w:-]*)\b[^>]*>/i);
  if (!opening) return '';
  const tagName = opening[1];
  const matcher = new RegExp(`<\\/?${escapeRegExp(tagName)}\\b[^>]*>`, 'gi');
  matcher.lastIndex = openingIndex;
  let depth = 0;
  for (let match = matcher.exec(source); match; match = matcher.exec(source)) {
    const closing = /^<\//.test(match[0]);
    const selfClosing = /\/\s*>$/.test(match[0]);
    if (closing) depth -= 1;
    else if (!selfClosing) depth += 1;
    if (depth === 0) return source.slice(openingIndex, matcher.lastIndex);
  }
  return '';
}

function elementSlicesWithAttribute(source, attributeName) {
  return [...source.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)]
    .filter((match) => attributes(match[2]).has(attributeName))
    .map((match) => balancedElementSlice(source, match.index))
    .filter(Boolean);
}

function citychatStageSlices(source) {
  const markers = citychatStageMarkers(source);
  return markers.map((marker) => ({
    ...marker,
    source: balancedElementSlice(source, marker.index),
  }));
}

function assetHref(locale, deploymentPath) {
  return `${locale.assetPrefix}${deploymentPath}`;
}

function validateMotifMarkup(locale) {
  const label = `${locale.id} motif markup`;
  const stages = citychatStageSlices(locale.html);
  const motifStages = stages.filter(({ attrs }) => attrs.has('data-citychat-motif'));
  const logoStages = stages.filter(({ attrs }) => attrs.has('data-citychat-logo'));
  const motifIds = motifStages.map(({ attrs }) => attrs.get('data-citychat-motif'));
  check(`${label} contains exactly one of each semantic motif`, motifStages.length === motifStaticIds.length
    && [...motifIds].sort().join(',') === [...motifStaticIds].sort().join(',')
    && new Set(motifIds).size === motifStaticIds.length,
  motifIds.join(', '));
  check(`${label} contains exactly one hero logo assembly`, logoStages.length === 1);

  const expectedSurface = new Map([['motif', 'gradient'], ['a', 'regular'], ['b', 'regular'], ['c', 'regular']]);
  const expectedFallbacks = new Map([
    ['motif', []],
    ['a', ['assets/3a-voice-home-light.svg', 'assets/3a-voice-home-dark.svg']],
    ['b', ['assets/3b-live-visit-trade-light.svg', 'assets/3b-live-visit-trade-dark.svg']],
    ['c', ['assets/3c-our-voice-here-light.svg', 'assets/3c-our-voice-here-dark.svg']],
  ]);

  for (const id of motifStaticIds) {
    const matches = motifStages.filter(({ attrs }) => attrs.get('data-citychat-motif') === id);
    if (matches.length !== 1) continue;
    const stage = matches[0];
    const fallbackSources = elementSlicesWithAttribute(stage.source, 'data-citychat-motif-fallback');
    const fallbackSource = fallbackSources[0] || '';
    check(`${label} ${id} declares the correct surface`, stage.attrs.get('data-motif-surface') === expectedSurface.get(id), stage.attrs.get('data-motif-surface'));
    check(`${label} ${id} has one static fallback wrapper`, fallbackSources.length === 1);

    const expectedFiles = expectedFallbacks.get(id) || [];
    const allMotifHrefs = motifRegisteredFiles
      .filter(({ file }) => /^(?:assets\/(?:3[abc]-|conversation-motif))/i.test(file))
      .map(({ deploymentPath }) => assetHref(locale, deploymentPath));
    const presentHrefs = allMotifHrefs.filter((href) => fallbackSource.includes(href));
    const expectedHrefs = expectedFiles.map((file) => assetHref(locale, motifByFile.get(file).deploymentPath));
    check(`${label} ${id} fallback uses only its exact registered asset paths`, presentHrefs.length === expectedHrefs.length
      && expectedHrefs.every((href) => occurrences(fallbackSource, href) === 1),
    presentHrefs.join(', '));
    const fallbackImages = tags('img', fallbackSource).filter(({ attrs }) => attrs.has('alt'));
    check(`${label} ${id} fallback is decorative`, fallbackImages.length === expectedHrefs.length
      && fallbackImages.every(({ attrs }) => attrs.get('alt') === ''));

    if (id === 'motif') {
      const renditionLayers = elementSlicesWithAttribute(fallbackSource, 'data-motif-rendition');
      const layerByRendition = new Map(renditionLayers.map((source) => {
        const opening = source.match(/^<[a-z][\w:-]*\b([^>]*)>/i);
        const attrs = opening ? attributes(opening[1]) : new Map();
        return [attrs.get('data-motif-rendition'), { attrs, source }];
      }));
      const svgSource = (source) => source.match(/<svg\b[\s\S]*<\/svg>/i)?.[0] || '';
      check(`${label} ConversationMotif fallback carries both registered module renditions`, renditionLayers.length === 2
        && layerByRendition.has('light')
        && layerByRendition.has('dark'));
      check(`${label} ConversationMotif fallback embeds the registered SVG strings verbatim`, Boolean(registeredMotionSvg?.motif)
        && svgSource(layerByRendition.get('light')?.source || '') === registeredMotionSvg.motif.light
        && svgSource(layerByRendition.get('dark')?.source || '') === registeredMotionSvg.motif.dark);
      check(`${label} ConversationMotif maps the gradient surface to inverse page-theme renditions`, hasClass(layerByRendition.get('dark')?.attrs || new Map(), 'motif-stage__theme--light')
        && hasClass(layerByRendition.get('light')?.attrs || new Map(), 'motif-stage__theme--dark'));
    } else {
      const themeLightFile = expectedSurface.get(id) === 'gradient' ? expectedFiles[1] : expectedFiles[0];
      const themeDarkFile = expectedSurface.get(id) === 'gradient' ? expectedFiles[0] : expectedFiles[1];
      const themeLightHref = assetHref(locale, motifByFile.get(themeLightFile).deploymentPath);
      const themeDarkHref = assetHref(locale, motifByFile.get(themeDarkFile).deploymentPath);
      check(`${label} ${id} chooses rendition from actual surface luminance`, new RegExp(`motif-stage__theme--light[\\s\\S]{0,1600}${escapeRegExp(themeLightHref)}`, 'i').test(fallbackSource)
        && new RegExp(`motif-stage__theme--dark[\\s\\S]{0,1600}${escapeRegExp(themeDarkHref)}`, 'i').test(fallbackSource));
      check(`${label} ${id} labels fallback rendition independently from page theme`, new RegExp(`motif-stage__theme--light[^>]*data-motif-rendition=["']light["']`, 'i').test(fallbackSource)
        && new RegExp(`motif-stage__theme--dark[^>]*data-motif-rendition=["']dark["']`, 'i').test(fallbackSource));
    }
  }

  if (logoStages.length === 1) {
    const stage = logoStages[0];
    const fallbackSources = elementSlicesWithAttribute(stage.source, 'data-citychat-logo-fallback');
    const fallbackSource = fallbackSources[0] || '';
    const proposalFiles = [
      'assets/logo-bubbles-proposal-light.svg',
      'assets/logo-bubbles-proposal-dark.svg',
      'assets/lockup-without-bubbles-light.png',
      'assets/lockup-without-bubbles-dark.png',
    ];
    const proposalHrefs = proposalFiles.map((file) => assetHref(locale, motifByFile.get(file).deploymentPath));
    check(`${label} logo is restricted to the gradient opening scene`, stage.attrs.get('data-motif-surface') === 'gradient');
    check(`${label} logo has one static fallback wrapper`, fallbackSources.length === 1);
    check(`${label} logo fallback uses each exact registered component once`, proposalHrefs.every((href) => occurrences(fallbackSource, href) === 1));
    const logoImages = tags('img', fallbackSource);
    check(`${label} logo fallback components are decorative`, logoImages.length === proposalHrefs.length
      && logoImages.every(({ attrs }) => attrs.has('alt') && attrs.get('alt') === ''));
    check(`${label} logo uses inverted renditions on the CityChat gradient`, [
      'assets/logo-bubbles-proposal-dark.svg',
      'assets/lockup-without-bubbles-dark.png',
    ].every((file) => new RegExp(`motif-stage__theme--light[\\s\\S]{0,2400}${escapeRegExp(assetHref(locale, motifByFile.get(file).deploymentPath))}`, 'i').test(fallbackSource))
      && [
        'assets/logo-bubbles-proposal-light.svg',
        'assets/lockup-without-bubbles-light.png',
      ].every((file) => new RegExp(`motif-stage__theme--dark[\\s\\S]{0,2400}${escapeRegExp(assetHref(locale, motifByFile.get(file).deploymentPath))}`, 'i').test(fallbackSource)));
    check(`${label} logo labels its inverse gradient renditions explicitly`, /motif-stage__theme--light[^>]*data-motif-rendition=["']dark["']/i.test(fallbackSource)
      && /motif-stage__theme--dark[^>]*data-motif-rendition=["']light["']/i.test(fallbackSource));
    check(`${label} proposal logo components occur only inside the opening assembly`, proposalHrefs.every((href) => occurrences(locale.html, href) === occurrences(fallbackSource, href)));
  }

  const motifCssHref = assetHref(locale, motifByFile.get('motion/citychat-motif-motion.css').deploymentPath);
  const runtimeHostHref = assetHref(locale, motifRuntimeHostPath);
  const motifStylesheets = tags('link', locale.html).filter(({ attrs }) => (attrs.get('rel') || '').split(/\s+/).includes('stylesheet') && attrs.get('href') === motifCssHref);
  const runtimeScripts = tags('script', locale.html).filter(({ attrs }) => attrs.get('src') === runtimeHostHref && attrs.get('type') === 'module');
  check(`${label} wires the exact registered motion stylesheet once`, motifStylesheets.length === 1);
  check(`${label} wires the local module runtime host once`, runtimeScripts.length === 1);
}

check('release config schema is CityChat landing v2', config.schemaVersion === '2.0' && config.artifact?.product === 'citychat' && config.artifact?.pageKind === 'product-landing');
check('publication remains public but non-indexable', config.publication?.visibility === 'public' && config.publication?.indexable === false);
check('configured robots policy is exact', config.publication?.robotsMeta === 'noindex,nofollow,noarchive');
check('canonical URL is the GitHub Pages project route', config.artifact?.canonicalUrl === 'https://montri-th.github.io/CityChat/');
check('approved release build identity remains unchanged', config.artifact?.buildId === 'citychat-landing-20260903-03');
check('release declares exactly the Thai and English locales', localePages.length === 2
  && localePages.map(({ id }) => id).sort().join(',') === 'en,th');
check('locale IDs are unique', localeById.size === localePages.length);
check('locale entries are unique', localeEntryPaths.size === localePages.length);
check('primary locale matches the existing artifact contract', primaryLocale?.id === 'th'
  && primaryLocale.language === config.artifact.language
  && primaryLocale.canonicalUrl === config.artifact.canonicalUrl);
check('Thai locale preserves every existing copy gate', JSON.stringify(primaryLocale?.requiredText) === JSON.stringify(config.markup.requiredText)
  && JSON.stringify(primaryLocale?.forbiddenText) === JSON.stringify(config.markup.forbiddenText));
for (const locale of localePages) {
  check(`${locale.id} locale has a safe clean public route`, typeof locale.publicPath === 'string'
    && /^(?:\.\/|[a-z0-9][a-z0-9/-]*\/)$/.test(locale.publicPath)
    && localeRouteEntry(locale.publicPath) === locale.entry,
  `${locale.publicPath} -> ${locale.entry}`);
  check(`${locale.id} locale entry is required for deployment`, config.deployment.requiredFiles.includes(locale.entry));
  check(`${locale.id} locale declares a project-relative asset prefix`, typeof locale.assetPrefix === 'string'
    && /^(?:\.\/|(?:\.\.\/)+)$/.test(locale.assetPrefix));
  check(`${locale.id} locale has required and forbidden copy contracts`, Array.isArray(locale.requiredText)
    && locale.requiredText.length > 0
    && locale.requiredText.every(({ text, count }) => typeof text === 'string' && text.length > 0 && Number.isSafeInteger(count) && count > 0)
    && Array.isArray(locale.forbiddenText)
    && locale.forbiddenText.length > 0
    && locale.forbiddenText.every((text) => typeof text === 'string' && text.length > 0)
    && typeof locale.highlightText === 'string'
    && locale.highlightText.length > 0
    && locale.runtimeLabels
    && ['themeSystem', 'themeLight', 'themeDark', 'menuOpen', 'menuClose'].every((key) => typeof locale.runtimeLabels[key] === 'string' && locale.runtimeLabels[key].length > 0));
  const targetLocale = localeById.get(locale.languageSwitch?.target);
  check(`${locale.id} locale switch targets the reciprocal locale`, Boolean(targetLocale)
    && locale.languageSwitch.hreflang === targetLocale.language
    && locale.languageSwitch.lang === targetLocale.language
    && navigationTarget(locale.languageSwitch.href, locale.entry) === targetLocale.entry
    && locale.languageSwitch.count === 2);
  const localizedFooter = config.footer.locales?.[locale.id];
  check(`${locale.id} locale has a complete footer value contract`, Boolean(localizedFooter?.contact?.company
    && localizedFooter.contact.address
    && localizedFooter.contact.map?.text
    && localizedFooter.contact.map?.href
    && localizedFooter.contact.email?.text
    && localizedFooter.contact.email?.href
    && localizedFooter.labels?.socialNav
    && localizedFooter.labels?.footerNav
    && localizedFooter.labels?.brand
    && localizedFooter.links?.length === config.footer.links.length));
}
if (primaryLocale) {
  for (const locale of localePages) {
    let expectedCanonical = '';
    try {
      expectedCanonical = new URL(locale.publicPath, primaryLocale.canonicalUrl).href;
    } catch {
      // The route check above records malformed values without obscuring the rest of the report.
    }
    check(`${locale.id} canonical URL matches its clean public route`, locale.canonicalUrl === expectedCanonical,
      `expected ${expectedCanonical || '(invalid route)'}, received ${locale.canonicalUrl}`);
  }
}
for (const requiredFile of config.deployment.requiredFiles) {
  let requiredPath;
  try {
    requiredPath = safeRelativePath(requiredFile, 'required deployment file');
  } catch (error) {
    check(`required deployment path is safe: ${requiredFile}`, false, error.message);
    continue;
  }
  const absolutePath = resolveDeploymentPath(requiredPath);
  const exists = existsSync(absolutePath);
  check(`required deployment file exists: ${requiredPath}`, exists);
  if (exists) {
    const stat = lstatSync(absolutePath);
    check(`required deployment file is a regular non-symlink: ${requiredPath}`, stat.isFile() && !stat.isSymbolicLink());
  }
}

const motifAmendmentAbsolutePath = path.join(repositoryRoot, motifAmendmentPath);
const motifRegisterAbsolutePath = path.join(repositoryRoot, motifRegisterPath);
const motifBuildCardAbsolutePath = path.join(repositoryRoot, motifBuildCardPath);
check('CityChat motif amendment is retained outside the deployment tree', existsSync(motifAmendmentAbsolutePath)
  && !path.relative(deploymentRoot, motifAmendmentAbsolutePath).split(path.sep).every((part) => part !== '..'));
check('CityChat motif asset register is retained outside the deployment tree', existsSync(motifRegisterAbsolutePath)
  && !path.relative(deploymentRoot, motifRegisterAbsolutePath).split(path.sep).every((part) => part !== '..'));
check('CityChat Build Card exists at repository root', existsSync(motifBuildCardAbsolutePath));
for (const [relativePath, expected] of motifGovernanceFiles) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  if (!existsSync(absolutePath)) continue;
  const bytes = readFileSync(absolutePath);
  check(`CityChat motif governance bytes are exact: ${relativePath}`, bytes.byteLength === expected.bytes && sha256(bytes) === expected.sha256);
}

let motifRegister = null;
let motifBuildCard = null;
try {
  motifRegister = JSON.parse(readFileSync(motifRegisterAbsolutePath, 'utf8'));
  check('CityChat motif asset register parses', true);
} catch (error) {
  check('CityChat motif asset register parses', false, error.message);
}
try {
  motifBuildCard = JSON.parse(readFileSync(motifBuildCardAbsolutePath, 'utf8'));
  check('CityChat Build Card parses', true);
} catch (error) {
  check('CityChat Build Card parses', false, error.message);
}

if (motifRegister) {
  check('motif register is bound to LDS and CityChat Add-on v0.9.1', motifRegister.package === 'citychat-motif-set'
    && motifRegister.version === '1.0.0-proposal'
    && motifRegister.lds?.release === '0.9.1'
    && motifRegister.lds?.authoring === '0.9.1-r8'
    && motifRegister.lds?.machine === 'v0.9.1-mp7'
    && motifRegister.lds?.colorSet === 'color-srgb-05');
  const registerRecords = Array.isArray(motifRegister.files) ? motifRegister.files : [];
  check('motif register contains exactly the 13 pinned records', registerRecords.length === motifRegisteredFiles.length
    && new Set(registerRecords.map(({ file }) => file)).size === motifRegisteredFiles.length
    && motifRegisteredFiles.every((expected) => registerRecords.some((actual) => actual.file === expected.file
      && actual.bytes === expected.bytes
      && actual.sha256 === expected.sha256)));
}

if (motifBuildCard) {
  const records = Array.isArray(motifBuildCard.assets) ? motifBuildCard.assets : [];
  check('Build Card motif revision matches the deployed release identity', motifBuildCard.artifact?.buildId === config.artifact.buildId
    && motifBuildCard.artifact?.releaseRevision === config.artifact.releaseRevision);
  check('Build Card records the exact governing amendment path', motifBuildCard.addon?.amendment === motifAmendmentPath);
  check('Build Card records exactly the 13 registered source files', records.length === motifRegisteredFiles.length
    && new Set(records.map(({ file }) => file)).size === motifRegisteredFiles.length
    && motifRegisteredFiles.every((expected) => records.some((actual) => actual.file === expected.file
      && actual.deploymentPath === expected.deploymentPath
      && actual.bytes === expected.bytes
      && actual.sha256 === expected.sha256)));
  check('Build Card scopes the animated proposal logo to CC-EX-02 only', JSON.stringify(motifBuildCard.qa?.exceptionIds) === JSON.stringify(['CC-EX-02'])
    && !JSON.stringify(motifBuildCard).includes('CC-EX-01'));
  check('Build Card preserves the owner\'s direct artifact approval and public release intent', motifBuildCard.authorization?.directApprovalText === 'อนุมัติ animated motif + logo ทุกชิ้น'
    && motifBuildCard.authorization?.scope === 'this CityChat landing release'
    && /public CityChat GitHub Pages routes/i.test(motifBuildCard.authorization?.publicationIntent || '')
    && motifBuildCard.authorization?.canonicalDesignSystemPromotion === false);
  check('Build Card resolves the standard navigational CTA discovery cue without an exception', motifBuildCard.implementation?.ctaDiscoveryCue?.recipeId === 'motion.cta.discovery-cue.01'
    && motifBuildCard.implementation.ctaDiscoveryCue.userBenefit === 'discoverability'
    && motifBuildCard.implementation.ctaDiscoveryCue.durationMs === 540
    && motifBuildCard.implementation.ctaDiscoveryCue.repeatCountPerPageLoad === 1
    && motifBuildCard.implementation.ctaDiscoveryCue.reentryBehavior === 'do not repeat');
  check('Build Card identifies the local animation host separately', motifBuildCard.implementation?.runtimeHost === motifRuntimeHostPath);
  check('Build Card records the verbatim module-backed ConversationMotif fallback', motifBuildCard.implementation?.conversationStaticFallback?.source === 'registeredModule.svg.motif'
    && motifBuildCard.implementation.conversationStaticFallback.embeddedVerbatim === true
    && motifBuildCard.implementation.conversationStaticFallback.originalAssetRetainedForProvenance === `${motifPackageRoot}/assets/conversation-motif-original.svg`);
}

for (const expected of motifRegisteredFiles) {
  const deployedPath = resolveDeploymentPath(expected.deploymentPath);
  const handoffPath = path.join(repositoryRoot, 'handoff/citychat-motif-set', expected.file);
  const deployedExists = existsSync(deployedPath);
  const handoffExists = existsSync(handoffPath);
  check(`registered motif asset is deployed: ${expected.file}`, deployedExists);
  check(`registered motif source is retained: ${expected.file}`, handoffExists);
  if (!deployedExists || !handoffExists) continue;
  const deployedBytes = readFileSync(deployedPath);
  const handoffBytes = readFileSync(handoffPath);
  check(`registered motif bytes are exact: ${expected.file}`, deployedBytes.byteLength === expected.bytes
    && handoffBytes.byteLength === expected.bytes
    && sha256(deployedBytes) === expected.sha256
    && sha256(handoffBytes) === expected.sha256
    && deployedBytes.equals(handoffBytes));
  if (!expected.file.endsWith('.svg')) continue;
  const source = deployedBytes.toString('utf8');
  check(`registered motif SVG is inert and text-free: ${expected.file}`, !/<(?:script|text|foreignObject)\b|\bon[a-z]+\s*=|javascript:/i.test(source));
  check(`registered motif SVG has no gradient paint: ${expected.file}`, !/<(?:linearGradient|radialGradient)\b/i.test(source));
  check(`registered motif SVG never pairs #007A58 with #007E79: ${expected.file}`, !(source.includes('#007A58') && source.includes('#007E79')));
  if (/-light\.svg$/i.test(expected.file) && expected.file !== 'assets/conversation-motif-original.svg') {
    check(`light motif SVG stays in the light palette: ${expected.file}`, source.includes('#007A58')
      && source.includes('#0AD69C')
      && !source.includes('#3BD19B')
      && !source.includes('#007E79'));
  }
  if (/-dark\.svg$/i.test(expected.file)) {
    check(`dark motif SVG stays in the dark palette: ${expected.file}`, source.includes('#3BD19B')
      && source.includes('#007E79')
      && !source.includes('#007A58')
      && !source.includes('#0AD69C'));
  }
}

const motifAssetsDirectory = resolveDeploymentPath(`${motifPackageRoot}/assets`);
const motifMotionDirectory = resolveDeploymentPath(`${motifPackageRoot}/motion`);
if (existsSync(motifAssetsDirectory)) {
  const actualFiles = readdirSync(motifAssetsDirectory).sort();
  const expectedFiles = motifRegisteredFiles.filter(({ file }) => file.startsWith('assets/')).map(({ file }) => path.posix.basename(file)).sort();
  check('deployment contains no unregistered or stray proposal assets', JSON.stringify(actualFiles) === JSON.stringify(expectedFiles), actualFiles.join(', '));
}
if (existsSync(motifMotionDirectory)) {
  const actualFiles = readdirSync(motifMotionDirectory).sort();
  const expectedFiles = motifRegisteredFiles.filter(({ file }) => file.startsWith('motion/')).map(({ file }) => path.posix.basename(file)).sort();
  check('deployment contains only the two registered motion files', JSON.stringify(actualFiles) === JSON.stringify(expectedFiles), actualFiles.join(', '));
}

check('HTML has a doctype', /^<!doctype html>/i.test(html.trimStart()));
check('document language is Thai', /<html\b[^>]*\blang=["']th["']/i.test(html));
check('document declares UTF-8', /<meta\b[^>]*charset=["']?utf-8["']?/i.test(html));
check('document has a responsive viewport', /<meta\b[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width[^"']*initial-scale=1/i.test(html));
check('title identifies CityChat', /<title>[^<]*CityChat[^<]*<\/title>/i.test(html));
const escapedCanonical = config.artifact.canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
check('canonical tag is exact', new RegExp(`<link\\b(?=[^>]*\\brel=["']canonical["'])(?=[^>]*\\bhref=["']${escapedCanonical}["'])[^>]*>`, 'i').test(html));

const faviconLinks = tags('link').filter(({ attrs }) => (attrs.get('rel') || '').toLowerCase().split(/\s+/).includes('icon'));
check('page declares exactly one favicon', faviconLinks.length === 1, `found ${faviconLinks.length}`);
if (faviconLinks.length === 1) {
  check('favicon URL is exact', faviconLinks[0].attrs.get('href') === config.identity.favicon.href);
  check('favicon MIME type is exact', faviconLinks[0].attrs.get('type') === config.identity.favicon.mimeType);
}

for (const locale of localePages) {
  const label = `${locale.id} page`;
  const pageLinks = tags('link', locale.html);
  const canonicalLinks = pageLinks.filter(({ attrs }) => (attrs.get('rel') || '').toLowerCase().split(/\s+/).includes('canonical'));
  check(`${label} declares exactly one canonical URL`, canonicalLinks.length === 1
    && canonicalLinks[0].attrs.get('href') === locale.canonicalUrl,
  `found ${canonicalLinks.length}`);

  const alternateLinks = pageLinks.filter(({ attrs }) => (attrs.get('rel') || '').toLowerCase().split(/\s+/).includes('alternate'));
  const expectedAlternates = [
    ...localePages.map((alternate) => ({ language: alternate.language, href: alternate.canonicalUrl })),
    { language: 'x-default', href: primaryLocale?.canonicalUrl },
  ];
  check(`${label} declares only the reciprocal hreflang set`, alternateLinks.length === expectedAlternates.length
    && expectedAlternates.every(({ language, href }) => alternateLinks.filter(({ attrs }) => attrs.get('hreflang') === language && attrs.get('href') === href).length === 1),
  alternateLinks.map(({ attrs }) => `${attrs.get('hreflang')}:${attrs.get('href')}`).join(', '));
  check(`${label} has no base URL that can break nested assets`, tags('base', locale.html).length === 0);

  const expectedFaviconHref = `${locale.assetPrefix}${config.identity.favicon.path}`;
  const localeFavicons = pageLinks.filter(({ attrs }) => (attrs.get('rel') || '').toLowerCase().split(/\s+/).includes('icon'));
  check(`${label} uses the approved favicon through its locale asset prefix`, localeFavicons.length === 1
    && localeFavicons[0].attrs.get('href') === expectedFaviconHref
    && localeFavicons[0].attrs.get('type') === config.identity.favicon.mimeType);

  const languageSwitch = locale.languageSwitch;
  const switchAnchors = pairedTags('a', locale.html).filter(({ attrs, text }) => attrs.get('href') === languageSwitch.href
    && attrs.get('hreflang') === languageSwitch.hreflang
    && attrs.get('lang') === languageSwitch.lang
    && attrs.get('aria-label') === languageSwitch.ariaLabel
    && attrs.get('title') === languageSwitch.title
    && text === languageSwitch.text);
  check(`${label} exposes an exact language switch in JS and no-JS navigation`, switchAnchors.length === languageSwitch.count,
    `found ${switchAnchors.length}`);
  check(`${label} language switch resolves to the configured locale entry`, isLocaleNavigation(locale, languageSwitch.href));
}

const faviconPath = resolveDeploymentPath(safeRelativePath(config.identity.favicon.path, 'favicon path'));
check('favicon file exists', existsSync(faviconPath));
if (existsSync(faviconPath)) {
  const faviconBytes = readFileSync(faviconPath);
  const png = inspectPng(faviconBytes);
  check('favicon is a valid PNG with exact intrinsic dimensions', png.valid
    && png.width === config.identity.favicon.intrinsicWidth
    && png.height === config.identity.favicon.intrinsicHeight,
  JSON.stringify(png));
  check('favicon byte count is exact', faviconBytes.byteLength === config.identity.favicon.bytes, `received ${faviconBytes.byteLength}`);
  check('favicon content hash is exact', sha256(faviconBytes) === config.identity.favicon.sha256);
}

const identityManifestPath = resolveDeploymentPath(safeRelativePath(config.identity.manifest, 'identity manifest path'));
check('current identity manifest exists', existsSync(identityManifestPath));
if (existsSync(identityManifestPath)) {
  const identityManifest = JSON.parse(readFileSync(identityManifestPath, 'utf8'));
  const asset = identityManifest.assets?.find(({ path: assetPath }) => assetPath === config.identity.favicon.path);
  const approval = identityManifest.roleApprovals?.find(({ assetId, role }) => assetId === asset?.assetId && role === config.identity.favicon.approvedRole);
  check('identity manifest is bound to this exact release', identityManifest.artifactBuildId === config.artifact.buildId
    && identityManifest.canonicalUrl === config.artifact.canonicalUrl);
  check('identity manifest attests the exact favicon bytes', Boolean(asset)
    && asset.mimeType === config.identity.favicon.mimeType
    && asset.intrinsicWidth === config.identity.favicon.intrinsicWidth
    && asset.intrinsicHeight === config.identity.favicon.intrinsicHeight
    && asset.bytes === config.identity.favicon.bytes
    && asset.sha256 === config.identity.favicon.sha256
    && asset.transparentCanvas === true);
  check('favicon approval is browser-tab only and build-bound', Boolean(approval)
    && approval.approvalState === 'approved'
    && approval.approvedContentHash === config.identity.favicon.sha256
    && approval.artifactBinding?.mode === 'exact_build'
    && approval.artifactBinding.refs.includes(config.artifact.buildId)
    && approval.artifactBinding.refs.includes(config.artifact.canonicalUrl)
    && approval.transformPolicy === 'exact_embedded_bytes'
    && approval.cropPolicy === 'none'
    && approval.recolorPolicy === 'none');
  const approvedRoles = (identityManifest.roleApprovals || []).filter(({ approvalState }) => approvalState === 'approved').map(({ role }) => role);
  check('current identity manifest grants no broader role', approvedRoles.length === 1 && approvedRoles[0] === 'browser_tab_favicon', approvedRoles.join(', '));
}

const robotsMeta = tags('meta').find(({ attrs }) => attrs.get('name')?.toLowerCase() === 'robots');
check('page-level robots meta preserves noindex', robotsMeta?.attrs.get('content') === config.publication.robotsMeta);
const robotsPath = resolveDeploymentPath('robots.txt');
check('robots.txt exists', existsSync(robotsPath));
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8');
  check('robots.txt disallows crawling this artifact', /^\s*Disallow:\s*\/\s*$/im.test(robots));
}

check('document has exactly one main element', tags('main').length === 1, `found ${tags('main').length}`);
check('document has exactly one H1', tags('h1').length === 1, `found ${tags('h1').length}`);
check('document has exactly one footer', tags('footer').length === 1, `found ${tags('footer').length}`);
check('skip link targets main content', /<a\b[^>]*class=["'][^"']*\bskip-link\b[^"']*["'][^>]*href=["']#main-content["']/i.test(html));

const idMatches = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
const duplicateIds = [...new Set(idMatches.filter((id, index) => idMatches.indexOf(id) !== index))];
check('HTML IDs are unique', duplicateIds.length === 0, duplicateIds.join(', '));
for (const id of [...config.markup.requiredIds, ...config.markup.requiredUiIds]) {
  check(`required ID #${id} exists exactly once`, idMatches.filter((candidate) => candidate === id).length === 1);
}
const requiredPositions = config.markup.requiredIds.map((id) => html.search(new RegExp(`\\bid=["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i')));
check('landing sections appear in configured order', requiredPositions.every((position, index) => position >= 0 && (index === 0 || position > requiredPositions[index - 1])));

for (const { text, count } of config.markup.requiredText) {
  const actual = occurrences(html, text);
  check(`required copy appears ${count}×: ${text}`, actual === count, `found ${actual}`);
}
for (const text of config.markup.forbiddenText) {
  check(`removed honorific remains absent: ${text}`, !html.includes(text));
}

function validateAriaReferences(locale, source, ids) {
  for (const match of source.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)) {
    const attrs = attributes(match[2]);
    for (const attribute of ['aria-controls', 'aria-labelledby']) {
      if (!attrs.has(attribute)) continue;
      for (const target of attrs.get(attribute).trim().split(/\s+/).filter(Boolean)) {
        check(`${locale.id} ${attribute} resolves: #${target}`, ids.includes(target), `<${match[1].toLowerCase()}>`);
      }
    }
  }
}

function validateAndCollectSecondaryLocale(locale) {
  const source = locale.html;
  const label = `${locale.id} page`;
  const ids = idSequence(source);
  const duplicateLocaleIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];

  check(`${label} has a doctype`, /^<!doctype html>/i.test(source.trimStart()));
  check(`${label} declares its document language`, new RegExp(`<html\\b[^>]*\\blang=["']${escapeRegExp(locale.language)}["']`, 'i').test(source));
  check(`${label} declares UTF-8`, /<meta\b[^>]*charset=["']?utf-8["']?/i.test(source));
  check(`${label} has a responsive viewport`, /<meta\b[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width[^"']*initial-scale=1/i.test(source));
  check(`${label} title identifies CityChat`, /<title>[^<]*CityChat[^<]*<\/title>/i.test(source));
  const robots = tags('meta', source).find(({ attrs }) => attrs.get('name')?.toLowerCase() === 'robots');
  check(`${label} preserves the page-level robots policy`, robots?.attrs.get('content') === config.publication.robotsMeta);
  check(`${label} has exactly one main element`, tags('main', source).length === 1, `found ${tags('main', source).length}`);
  check(`${label} has exactly one H1`, tags('h1', source).length === 1, `found ${tags('h1', source).length}`);
  check(`${label} has exactly one footer`, tags('footer', source).length === 1, `found ${tags('footer', source).length}`);
  check(`${label} skip link targets main content`, /<a\b[^>]*class=["'][^"']*\bskip-link\b[^"']*["'][^>]*href=["']#main-content["']/i.test(source));
  check(`${label} IDs are unique`, duplicateLocaleIds.length === 0, duplicateLocaleIds.join(', '));
  for (const id of [...config.markup.requiredIds, ...config.markup.requiredUiIds]) {
    check(`${label} required ID #${id} exists exactly once`, ids.filter((candidate) => candidate === id).length === 1);
  }
  const requiredLocalePositions = config.markup.requiredIds.map((id) => source.search(new RegExp(`\\bid=["']${escapeRegExp(id)}["']`, 'i')));
  check(`${label} landing sections appear in configured order`, requiredLocalePositions.every((position, index) => position >= 0 && (index === 0 || position > requiredLocalePositions[index - 1])));
  for (const { text, count } of locale.requiredText) {
    const actual = occurrences(source, text);
    check(`${label} required copy appears ${count}×: ${text}`, actual === count, `found ${actual}`);
  }
  for (const text of locale.forbiddenText) {
    check(`${label} forbidden copy remains absent: ${text}`, !source.includes(text));
  }
  check(`${label} contains its localized CityChat highlight exactly once`, occurrences(source, 'class="city-loop-banner"') === 1
    && occurrences(source, locale.highlightText) === 1);
  validateAriaReferences(locale, source, ids);

  const inlineLocaleScripts = [...source.matchAll(/<script\b(?![^>]*\bsrc\s*=)([^>]*)>([\s\S]*?)<\/script>/gi)];
  inlineLocaleScripts.forEach((match, index) => {
    const type = attributes(match[1]).get('type') || 'text/javascript';
    if (!/^(?:text\/javascript|application\/javascript|module)$/i.test(type)) return;
    try {
      new Script(match[2], { filename: `deployment/${locale.entry}:inline-script-${index + 1}` });
      check(`${label} inline script ${index + 1} parses`, true);
    } catch (error) {
      check(`${label} inline script ${index + 1} parses`, false, error.message);
    }
  });

  for (const { attrs, raw } of tags('img', source)) {
    check(`${label} image has an alt attribute: ${attrs.get('src') || raw.slice(0, 60)}`, attrs.has('alt'));
  }
  const expectedVideoSrc = `${locale.assetPrefix}${config.media.cityscan.path}`;
  const videos = tags('video', source).filter(({ attrs }) => attrs.has('data-cc-video'));
  check(`${label} has exactly one CityScan video`, videos.length === 1, `found ${videos.length}`);
  if (videos.length === 1) {
    const attrs = videos[0].attrs;
    check(`${label} CityScan video source is exact`, attrs.get('src') === expectedVideoSrc);
    check(`${label} CityScan video declares its portrait dimensions`, Number(attrs.get('width')) === config.media.cityscan.intrinsicWidth
      && Number(attrs.get('height')) === config.media.cityscan.intrinsicHeight,
    `${attrs.get('width')}×${attrs.get('height')}`);
    for (const attribute of ['autoplay', 'loop', 'muted', 'playsinline', 'controls']) {
      check(`${label} CityScan video declares ${attribute}`, attrs.has(attribute));
    }
  }
  const downloads = tags('a', source).filter(({ attrs }) => attrs.get('href') === expectedVideoSrc && attrs.has('download'));
  check(`${label} CityScan fallback retains one direct download`, downloads.length === 1, `found ${downloads.length}`);

  for (const { attrs } of tags('a', source)) {
    const href = attrs.get('href') || '';
    if (attrs.get('target')?.toLowerCase() === '_blank') {
      check(`${label} new-tab link protects opener: ${href}`, (attrs.get('rel') || '').split(/\s+/).map((value) => value.toLowerCase()).includes('noopener'));
    }
    if (/^javascript:/i.test(href)) {
      check(`${label} link does not use a javascript URL: ${href}`, false);
    } else if (href.startsWith('#')) {
      check(`${label} same-page link resolves: ${href}`, href.length > 1 && ids.includes(href.slice(1)));
    } else if (href && !/^(?:https?:|mailto:|tel:)/i.test(href) && !isLocaleNavigation(locale, href)) {
      addRuntimeResource(href, locale.entry, `anchor href in ${locale.entry}`);
    }
  }
  for (const { attrs } of tags('button', source)) {
    check(`${label} button declares type: #${attrs.get('id') || '(unnamed)'}`, attrs.has('type'));
  }
  for (const { attrs } of tags('script', source)) {
    if (attrs.has('src')) addRuntimeResource(attrs.get('src'), locale.entry, `script src in ${locale.entry}`);
  }
  for (const { attrs } of tags('link', source)) {
    const rel = (attrs.get('rel') || '').toLowerCase().split(/\s+/);
    if (rel.some((value) => ['stylesheet', 'preload', 'modulepreload', 'icon', 'manifest'].includes(value)) && attrs.has('href')) {
      addRuntimeResource(attrs.get('href'), locale.entry, `link href in ${locale.entry}`);
    }
  }
  for (const tagName of ['img', 'video', 'audio', 'source', 'track', 'iframe', 'embed']) {
    for (const { attrs } of tags(tagName, source)) {
      if (attrs.has('src')) addRuntimeResource(attrs.get('src'), locale.entry, `${tagName} src in ${locale.entry}`);
      if (attrs.has('poster')) addRuntimeResource(attrs.get('poster'), locale.entry, `${tagName} poster in ${locale.entry}`);
      if (attrs.has('srcset')) {
        for (const candidate of attrs.get('srcset').split(',').map((part) => part.trim().split(/\s+/, 1)[0])) {
          addRuntimeResource(candidate, locale.entry, `${tagName} srcset in ${locale.entry}`);
        }
      }
    }
  }
  for (const match of source.matchAll(/style\s*=\s*["'][^"']*url\(\s*([^)]+?)\s*\)[^"']*["']/gi)) {
    addRuntimeResource(match[1], locale.entry, `inline style URL in ${locale.entry}`);
  }
}

if (englishLocale) validateAndCollectSecondaryLocale(englishLocale);
validateAriaReferences(primaryLocale || { id: 'th' }, html, idSequence(html));

if (englishLocale) {
  const thaiIds = idSequence(html);
  const englishIds = idSequence(englishHtml);
  check('Thai and English pages preserve the exact ID topology', JSON.stringify(englishIds) === JSON.stringify(thaiIds));
  check('Thai and English pages preserve ID element roles and relationships', JSON.stringify(idElementSignatures(englishHtml)) === JSON.stringify(idElementSignatures(html)));
  const structuralTags = ['main', 'footer', 'nav', 'section', 'article', 'aside', 'h1', 'h2', 'h3', 'figure', 'figcaption', 'dl', 'dt', 'dd', 'ul', 'ol', 'li', 'a', 'button', 'img', 'video'];
  const structuralMismatches = structuralTags.filter((tagName) => tags(tagName, englishHtml).length !== tags(tagName, html).length);
  check('Thai and English pages preserve semantic element counts', structuralMismatches.length === 0,
    structuralMismatches.map((tagName) => `${tagName}:${tags(tagName, html).length}/${tags(tagName, englishHtml).length}`).join(', '));
  const thaiApproaches = [...html.matchAll(/\bdata-approach\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  const englishApproaches = [...englishHtml.matchAll(/\bdata-approach\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  check('Thai and English pages preserve the design-approach sequence', JSON.stringify(englishApproaches) === JSON.stringify(thaiApproaches));
}

const forbiddenResidue = /<\/?(?:x-dc|x-import|sc-if|sc-for)\b|\{\{[^}]+\}\}|type=["']text\/x-dc|data-dc-script|(?:support|ds-base)\.js|style-(?:hover|focus|active)=/i;
check('DreamCanvas/template residue is absent', !forbiddenResidue.test(html));
check('English page has no DreamCanvas/template residue', !forbiddenResidue.test(englishHtml));
check('application JavaScript has no obsolete framework residue', !/(?:\bDCLogic\b|React\.createElement|componentDidMount|this\.setState)/.test(app));
check('application JavaScript has no analytics or background network calls', !/(?:\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\s*\(|sendBeacon\s*\(|\bgtag\s*\(|\banalytics\b)/i.test(app));
check('application localizes runtime menu and theme accessibility labels from document language', /root\.lang[^\n;]*startsWith\(["']en["']\)/.test(app)
  && localePages.every((locale) => Object.values(locale.runtimeLabels).every((label) => app.includes(label)))
  && /setAttribute\(["']aria-label["']\s*,\s*label\)/.test(app)
  && /setAttribute\(["']aria-label["']\s*,\s*open\s*\?\s*interfaceLabels\.menu\.close\s*:\s*interfaceLabels\.menu\.open\)/.test(app));
check('source files do not leak a personal filesystem path', !/(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\)/.test(`${html}\n${englishHtml}\n${css}\n${app}`));

const motifRuntimeAbsolutePath = resolveDeploymentPath(motifRuntimeHostPath);
const motifMotionCssPath = resolveDeploymentPath(motifByFile.get('motion/citychat-motif-motion.css').deploymentPath);
const motifMotionModulePath = resolveDeploymentPath(motifByFile.get('motion/citychat-motif-motion.js').deploymentPath);
const motifRuntime = existsSync(motifRuntimeAbsolutePath) ? readFileSync(motifRuntimeAbsolutePath, 'utf8') : '';
const motifMotionCss = existsSync(motifMotionCssPath) ? readFileSync(motifMotionCssPath, 'utf8') : '';
const motifMotionModule = existsSync(motifMotionModulePath) ? readFileSync(motifMotionModulePath, 'utf8') : '';
registeredMotionSvg = parseRegisteredMotionSvg(motifMotionModule);
check('registered motion module SVG payload parses as pinned JSON', Boolean(registeredMotionSvg));
for (const locale of localePages) validateMotifMarkup(locale);
check('motif runtime host exists as a local module', Boolean(motifRuntime));
check('motif runtime imports the exact registered inline SVG module', new RegExp(`from\\s*["']\\./${escapeRegExp(motifByFile.get('motion/citychat-motif-motion.js').deploymentPath)}["']`).test(motifRuntime)
  && /import\s*\{[^}]*\bsvg\b[^}]*\}/.test(motifRuntime));
check('motif runtime mounts only declared motif and logo stages', motifRuntime.includes('[data-citychat-motif]')
  && motifRuntime.includes('[data-citychat-logo]')
  && /svg\s*\[\s*(?:motifId|id|key)\s*\]/.test(motifRuntime)
  && /svg\.logo|svg\[['"]logo['"]\]/.test(motifRuntime));
check('motif runtime uses the mandated one-shot viewport threshold', /new\s+IntersectionObserver\b/.test(motifRuntime)
  && /threshold\s*:\s*(?:0?\.14|14\s*\/\s*100)\b/.test(motifRuntime)
  && /\.unobserve\s*\(/.test(motifRuntime));
check('motif runtime fails open for reduced motion', /prefers-reduced-motion\s*:\s*reduce/.test(motifRuntime)
  && /is-motif-ready/.test(motifRuntime));
check('motif runtime applies the amendment duration ceilings without editing registered bytes', /motifId\s*===\s*["']motif["'][\s\S]{0,240}520ms, 750ms/.test(motifRuntime)
  && /motifId\s*===\s*["']a["'][\s\S]{0,420}1580ms/.test(motifRuntime)
  && /motifId\s*===\s*["']b["'][\s\S]{0,520}1980ms[\s\S]{0,220}420ms/.test(motifRuntime)
  && /motifId\s*===\s*["']c["'][\s\S]{0,420}920ms, 450ms[\s\S]{0,240}1580ms/.test(motifRuntime));
check('motif runtime fixes the proposal-logo dot starts to the approved choreography', motifRuntime.includes('[380, 500, 620]')
  && motifRuntime.includes('[530, 650, 770]')
  && /dataset\.motifStartMs/.test(motifRuntime));
check('motif runtime waits for both replacement logo bases before hiding the complete fallback', /const\s+decodeImage\s*=\s*async/.test(motifRuntime)
  && motifRuntime.indexOf('await Promise.all(layers.map') !== -1
  && motifRuntime.indexOf('await Promise.all(layers.map') < motifRuntime.indexOf("stage.classList.add('is-motif-ready')")
  && /naturalWidth\s*<=\s*0/.test(motifRuntime));
check('ConversationMotif returns to its registered static source state by the 1.8 second ceiling', /const\s+settleConversationMotif\b/.test(motifRuntime)
  && /layers\.forEach\(\(layer\)\s*=>\s*layer\.remove\(\)\)/.test(motifRuntime)
  && /setTimeout\(settle,\s*1800\)/.test(motifRuntime));
check('motif runtime keeps injected artwork decorative', /aria-hidden/.test(motifRuntime)
  && /removeAttribute\s*\(\s*["']aria-label["']\s*\)/.test(motifRuntime)
  && /removeAttribute\s*\(\s*["']role["']\s*\)/.test(motifRuntime));
check('motif runtime contains no timer loop or proposal-logo nav targeting', !/\bsetInterval\s*\(|\brequestAnimationFrame\s*\(/.test(motifRuntime)
  && !/(?:site-nav|footer|footer-brand|data-cc-nav)[\s\S]{0,120}svg\.logo/i.test(motifRuntime));
check('registered motion module exposes the intended siblings', /export\s+const\s+ids\s*=\s*\[[^\]]*["']motif["'][^\]]*["']a["'][^\]]*["']b["'][^\]]*["']c["'][^\]]*["']logo["']/.test(motifMotionModule)
  && /export\s+const\s+svg\s*=/.test(motifMotionModule));
check('registered motion stylesheet is finite and reduced-motion safe', motifMotionCss.length > 0
  && !/\binfinite\b/i.test(motifMotionCss)
  && /prefers-reduced-motion\s*:\s*reduce/.test(motifMotionCss)
  && /animation\s*:\s*none\s*!important/i.test(motifMotionCss));
check('live verifier pins every registered motif byte record exactly', motifRegisteredFiles.every((expected) => new RegExp(
  `file:\\s*["']${escapeRegExp(expected.file)}["'][^}\\n]*bytes:\\s*${expected.bytes}\\b[^}\\n]*sha256:\\s*["']${expected.sha256}["']`
).test(liveVerifier)));
check('live verifier separates active runtime closure from all-file provenance verification', /activeMotifFiles\s*=\s*motifRegisteredFiles\.filter/.test(liveVerifier)
  && /\.\.\.motifRegisteredFiles\.map\(\(\{\s*deploymentPath\s*\}\)\s*=>\s*deploymentPath\)/.test(liveVerifier));

try {
  new Script(app, { filename: 'deployment/app.js' });
  check('application JavaScript parses', true);
} catch (error) {
  check('application JavaScript parses', false, error.message);
}
const inlineScripts = [...html.matchAll(/<script\b(?![^>]*\bsrc\s*=)([^>]*)>([\s\S]*?)<\/script>/gi)];
inlineScripts.forEach((match, index) => {
  const type = attributes(match[1]).get('type') || 'text/javascript';
  if (!/^(?:text\/javascript|application\/javascript|module)$/i.test(type)) return;
  try {
    new Script(match[2], { filename: `deployment/index.html:inline-script-${index + 1}` });
    check(`inline script ${index + 1} parses`, true);
  } catch (error) {
    check(`inline script ${index + 1} parses`, false, error.message);
  }
});

for (const { attrs, raw } of tags('img')) {
  check(`image has an alt attribute: ${attrs.get('src') || raw.slice(0, 60)}`, attrs.has('alt'));
}
const cityscanVideos = tags('video').filter(({ attrs }) => attrs.has('data-cc-video'));
check('CityScan has exactly one video element', cityscanVideos.length === 1, `found ${cityscanVideos.length}`);
if (cityscanVideos.length === 1) {
  const attrs = cityscanVideos[0].attrs;
  check('CityScan video source is exact', attrs.get('src') === config.media.cityscan.src);
  check('CityScan video declares its portrait dimensions', Number(attrs.get('width')) === config.media.cityscan.intrinsicWidth
    && Number(attrs.get('height')) === config.media.cityscan.intrinsicHeight,
  `${attrs.get('width')}×${attrs.get('height')}`);
  for (const attribute of ['autoplay', 'loop', 'muted', 'playsinline', 'controls']) {
    check(`CityScan video declares ${attribute}`, attrs.has(attribute));
  }
}
const cityscanDownload = tags('a').filter(({ attrs }) => attrs.get('href') === config.media.cityscan.src && attrs.has('download'));
check('CityScan fallback retains one direct download', cityscanDownload.length === 1, `found ${cityscanDownload.length}`);
for (const { attrs } of tags('a')) {
  const href = attrs.get('href') || '';
  if (attrs.get('target')?.toLowerCase() === '_blank') {
    check(`new-tab link protects opener: ${href}`, (attrs.get('rel') || '').split(/\s+/).map((value) => value.toLowerCase()).includes('noopener'));
  }
  if (/^javascript:/i.test(href)) {
    check(`link does not use a javascript URL: ${href}`, false);
  } else if (href.startsWith('#')) {
    check(`same-page link resolves: ${href}`, href.length > 1 && idMatches.includes(href.slice(1)));
  } else if (href && !/^(?:https?:|mailto:|tel:)/i.test(href) && !isLocaleNavigation(primaryLocale, href)) {
    addRuntimeResource(href, entryRelativePath, `anchor href in ${entryRelativePath}`);
  }
}
for (const { attrs } of tags('button')) {
  check(`button declares type: #${attrs.get('id') || '(unnamed)'}`, attrs.has('type'));
}

for (const { attrs } of tags('script')) {
  if (attrs.has('src')) addRuntimeResource(attrs.get('src'), entryRelativePath, `script src in ${entryRelativePath}`);
}
for (const { attrs } of tags('link')) {
  const rel = (attrs.get('rel') || '').toLowerCase().split(/\s+/);
  if (rel.some((value) => ['stylesheet', 'preload', 'modulepreload', 'icon', 'manifest'].includes(value)) && attrs.has('href')) {
    addRuntimeResource(attrs.get('href'), entryRelativePath, `link href in ${entryRelativePath}`);
  }
}
for (const tagName of ['img', 'video', 'audio', 'source', 'track', 'iframe', 'embed']) {
  for (const { attrs } of tags(tagName)) {
    if (attrs.has('src')) addRuntimeResource(attrs.get('src'), entryRelativePath, `${tagName} src in ${entryRelativePath}`);
    if (attrs.has('poster')) addRuntimeResource(attrs.get('poster'), entryRelativePath, `${tagName} poster in ${entryRelativePath}`);
    if (attrs.has('srcset')) {
      for (const candidate of attrs.get('srcset').split(',').map((part) => part.trim().split(/\s+/, 1)[0])) {
        addRuntimeResource(candidate, entryRelativePath, `${tagName} srcset in ${entryRelativePath}`);
      }
    }
  }
}
for (const match of html.matchAll(/style\s*=\s*["'][^"']*url\(\s*([^)]+?)\s*\)[^"']*["']/gi)) {
  addRuntimeResource(match[1], entryRelativePath, `inline style URL in ${entryRelativePath}`);
}

while (stylesheetQueue.length > 0) {
  const stylesheet = stylesheetQueue.shift();
  const stylesheetPath = resolveDeploymentPath(stylesheet);
  if (!existsSync(stylesheetPath)) continue;
  const stylesheetSource = readFileSync(stylesheetPath, 'utf8');
  if (/\.css$/i.test(stylesheet)) {
    for (const match of stylesheetSource.matchAll(/url\(\s*([^)]+?)\s*\)/gi)) {
      addRuntimeResource(match[1], stylesheet, `CSS url() in ${stylesheet}`);
    }
    for (const match of stylesheetSource.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi)) {
      addRuntimeResource(match[1], stylesheet, `CSS @import in ${stylesheet}`);
    }
  } else if (/\.js$/i.test(stylesheet)) {
    for (const match of stylesheetSource.matchAll(/(?:import|export)\s+(?:[^;"']*?\s+from\s*)?["']([^"']+)["']/g)) {
      addRuntimeResource(match[1], stylesheet, `module import in ${stylesheet}`);
    }
    for (const match of stylesheetSource.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)) {
      addRuntimeResource(match[1], stylesheet, `dynamic module import in ${stylesheet}`);
    }
  } else if (/\.svg$/i.test(stylesheet)) {
    for (const { attrs } of [...tags('image', stylesheetSource), ...tags('use', stylesheetSource)]) {
      const href = attrs.get('href') || attrs.get('xlink:href');
      if (href && !href.startsWith('#')) addRuntimeResource(href, stylesheet, `embedded SVG resource in ${stylesheet}`);
    }
  }
}

for (const relativePath of [...runtimeResources].sort()) {
  const absolutePath = resolveDeploymentPath(relativePath);
  const exists = existsSync(absolutePath);
  check(`runtime resource exists: ${relativePath}`, exists);
  if (exists) {
    const stat = lstatSync(absolutePath);
    check(`runtime resource is a regular non-symlink file: ${relativePath}`, stat.isFile() && !stat.isSymbolicLink());
  }
}
check('locale directory links are navigation rather than runtime files', localePages.every((locale) => isLocaleNavigation(locale, locale.languageSwitch.href))
  && [...localeEntryPaths].every((entry) => !runtimeResources.has(entry))
  && !runtimeResources.has('en'));
check('nested English references close over the shared deployment assets', ['app.js', 'citychat.css', config.identity.favicon.path, config.media.cityscan.path].every((assetPath) => runtimeResources.has(assetPath))
  && ![...runtimeResources].some((assetPath) => /^(?:en\/(?:assets|vendor)\/|en\/(?:app\.js|citychat\.css)$)/i.test(assetPath)),
[...runtimeResources].filter((assetPath) => assetPath.startsWith('en/')).join(', '));
const runtimeMotifFiles = motifRegisteredFiles.filter(({ file }) => file !== 'assets/conversation-motif-original.svg');
check('runtime closure includes the host and every active registered motif file', runtimeResources.has(motifRuntimeHostPath)
  && runtimeMotifFiles.every(({ deploymentPath }) => runtimeResources.has(deploymentPath)),
runtimeMotifFiles.filter(({ deploymentPath }) => !runtimeResources.has(deploymentPath)).map(({ deploymentPath }) => deploymentPath).join(', '));
check('original ConversationMotif remains attested provenance rather than an unused runtime request', !runtimeResources.has(motifByFile.get('assets/conversation-motif-original.svg').deploymentPath));
check('nested English motif references close over shared root assets', ![...runtimeResources].some((assetPath) => /^en\/(?:motif-runtime\.js|assets\/citychat-motif-set\/)/i.test(assetPath)));

for (const [relativePath, expectedHash] of Object.entries(config.pinnedInputs)) {
  let safePath;
  try {
    safePath = safeRelativePath(relativePath, 'pinned input path');
  } catch (error) {
    check(`pinned input path is safe: ${relativePath}`, false, error.message);
    continue;
  }
  const absolutePath = resolveDeploymentPath(safePath);
  const exists = existsSync(absolutePath);
  check(`pinned input exists: ${safePath}`, exists);
  if (exists) {
    const actualHash = sha256(readFileSync(absolutePath));
    check(`pinned input hash is exact: ${safePath}`, actualHash === expectedHash, `expected ${expectedHash}, received ${actualHash}`);
  }
}

const cityscanPath = resolveDeploymentPath(safeRelativePath(config.media.cityscan.path, 'CityScan video path'));
if (existsSync(cityscanPath)) {
  const cityscanBuffer = readFileSync(cityscanPath);
  const mediaInspection = inspectTopLevelMp4(cityscanBuffer);
  const boxTypes = mediaInspection.boxes.map(({ type }) => type);
  check('CityScan MP4 is structurally complete', mediaInspection.valid, mediaInspection.detail);
  check('CityScan MP4 includes playable media and metadata boxes', boxTypes.includes('mdat') && boxTypes.includes('moov'), boxTypes.join(', '));
}

check('all declared fonts are local', !/(?:fonts\.googleapis\.com|fonts\.gstatic\.com|@import\s+url\(\s*["']?https?:)/i.test(css));
check('site and motif CSS contain no infinite animation', !/\binfinite\b/i.test(`${css}\n${motifMotionCss}`));
check('primary navigational CTA uses the standard finite 540 ms discovery cue', /@keyframes\s+ccSweep\s*\{[^}]*-120%[\s\S]*120%/i.test(css)
  && /\[data-cc-nav\]\s+\[data-part=["']sweep["']\]\s*\{[^}]*animation\s*:\s*ccSweep\s+540ms\s+cubic-bezier\(\.16\s*,\s*1\s*,\s*\.3\s*,\s*1\)\s+1\s+both/i.test(css));
check('motif fallbacks are the default source state', css.includes('[data-citychat-motif-fallback]')
  && css.includes('[data-citychat-logo-fallback]')
  && /is-motif-ready[^,{]*[\s\S]{0,180}\[data-citychat-(?:motif|logo)-fallback\]/i.test(css));
check('print mode forces static motif and logo fallbacks', /@media\s+print[\s\S]*\[data-citychat-(?:motif|logo)-fallback\][^{]*\{[^}]*(?:display|visibility|opacity)\s*:/i.test(css)
  && /@media\s+print[\s\S]*\.motif-stage__motion[^{]*\{[^}]*display\s*:\s*none\s*!important/i.test(css));
check('print mode deterministically selects the light rendition on a light print surface', /@media\s+print[\s\S]*\[data-motif-rendition\][^{]*\{[^}]*display\s*:\s*none\s*!important/i.test(css)
  && /@media\s+print[\s\S]*\[data-motif-rendition=["']light["']\][^{]*\{[^}]*display\s*:\s*grid\s*!important/i.test(css));
check('inline ConversationMotif fallback is frozen without changing its registered SVG markup', /\[data-citychat-motif-fallback\][^{]*\[class\^=["']mm-["']\][\s\S]{0,260}animation\s*:\s*none\s*!important/i.test(css)
  && /\[data-citychat-motif-fallback\][\s\S]{0,260}\.mm-ripple[^{]*\{[^}]*opacity\s*:\s*0\s*!important/i.test(css));
check('reduced-motion mode forces static motif and logo fallbacks', /prefers-reduced-motion\s*:\s*reduce[\s\S]*\.motif-stage__motion[^{]*\{[^}]*display\s*:\s*none\s*!important/i.test(css));
check('motif stages do not add glow, shadow, or non-proportional distortion', !/(?:motif-stage|citychat-motif)[^{]*\{[^}]*(?:box-shadow|drop-shadow|filter\s*:|scaleX\s*\(|scaleY\s*\()/i.test(css));
check('CSS disables synthetic font faces', /font-synthesis\s*:\s*none/i.test(css));
check('CSS includes Thai display, body, technical, Latin display, and icon fonts', [
  'IBM Plex Sans Thai Looped',
  'Bai Jamjuree',
  'IBM Plex Sans Thai',
  'Arvo',
  'JetBrains Mono',
  'Material Symbols Rounded',
].every((family) => css.includes(family)));
check('Material Symbols font is served locally', /url\(["']?assets\/fonts\/material-symbols-rounded-citychat-landing-v369\.ttf["']?\)/i.test(css));
check('approach elements are final-state by default', /\[data-approach\][^{]*\{[^}]*opacity\s*:\s*1[^}]*transform\s*:\s*none[^}]*transition\s*:\s*none/i.test(css));
check('reduced-motion rules remove approach motion', /prefers-reduced-motion\s*:\s*reduce[\s\S]{0,1200}\[data-approach\][^{]*\{[^}]*transform\s*:\s*none\s*!important[^}]*transition\s*:\s*none\s*!important/i.test(css));
check('reduced-motion rules disable smooth scrolling', /prefers-reduced-motion\s*:\s*reduce[\s\S]{0,1200}scroll-behavior\s*:\s*auto/i.test(css));
check('no-JS mode hides the menu control', /html:not\(\.has-js\)\s+#menu-toggle\s*\{[^}]*display\s*:\s*none/i.test(css));
check('no-JS mode provides a visible video outcome', /html:not\(\.has-js\)[^{]*(?:\[data-video-fallback\]|video)[^{]*\{[^}]*(?:display\s*:\s*(?:grid|block)\s*!important|display\s*:\s*none)/i.test(css));
check('CityScan layout uses the source portrait ratio', new RegExp(`aspect-ratio\\s*:\\s*${config.media.cityscan.intrinsicWidth}\\s*\\/\\s*${config.media.cityscan.intrinsicHeight}`, 'i').test(css)
  && !/cityscan-demo[^}]*aspect-ratio\s*:\s*16\s*\/\s*9/i.test(css));
check('CityScan layout reflows at the compact breakpoint', /@media\s*\(max-width\s*:\s*900px\)[\s\S]{0,2400}\.cityscan-demo\s*\{[^}]*grid-template-areas\s*:\s*["']copy["']\s+["']media["']/i.test(css));
check('short landscape viewports cap the portrait video', /@media\s*\(max-height\s*:\s*640px\)\s*and\s*\(orientation\s*:\s*landscape\)[\s\S]{0,800}\.cityscan-demo__frame\s*\{[^}]*44svh/i.test(css));
check('mid-page highlight uses the CityChat product gradient token', occurrences(html, 'class="city-loop-banner"') === 1
  && html.includes('ข้อมูลไม่ควรหยุดอยู่แค่วันที่เก็บ')
  && /\.city-loop-banner\s*\{[^}]*background\s*:\s*var\(--product-citychat-gradient\)/i.test(css)
  && /\.city-loop-banner__eyebrow\s*\{[^}]*color\s*:\s*var\(--on-product-citychat\)/i.test(css)
  && /\.city-loop-banner__story\s*\{[^}]*color\s*:\s*var\(--on-product-citychat\)/i.test(css));

const footerMatch = html.match(/<footer\b([^>]*)>([\s\S]*?)<\/footer>/i);
const footerAttributes = footerMatch ? attributes(footerMatch[1]) : new Map();
check('footer root uses the configured class and ID', Boolean(footerMatch
  && hasClass(footerAttributes, config.footer.rootClass)
  && footerAttributes.get('id') === config.footer.rootId));
check('footer is a labelled programmatic hash target', footerAttributes.get('tabindex') === config.footer.tabindex
  && footerAttributes.get('aria-labelledby') === config.footer.labelledBy
  && idMatches.includes(config.footer.labelledBy));
if (footerMatch) {
  const footerHtml = footerMatch[0];
  const stripeMatch = footerHtml.match(new RegExp(`<div\\b[^>]*class=["'][^"']*\\b${config.footer.stripeClass}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/div>`, 'i'));
  check('footer has the four-color measure stripe', Boolean(stripeMatch) && tags('span', stripeMatch?.[1] || '').length === 4);

  check('footer contains the reference contact-details region', /<div\b[^>]*class=["'][^"']*\bcontact-details\b[^"']*["']/i.test(footerHtml));
  const companyParagraph = pairedTags('p', footerHtml).filter(({ attrs, text }) => hasClass(attrs, 'contact-company') && text === config.footer.contact.company);
  check('footer company is exact', companyParagraph.length === 1);
  check('footer address is exact', occurrences(footerHtml, config.footer.contact.address) === 1);

  const footerAnchors = pairedTags('a', footerHtml);
  const mapAnchor = footerAnchors.filter(({ attrs, text }) => attrs.get('href') === config.footer.contact.map.href && text.includes(config.footer.contact.map.text));
  check('footer map link is exact', mapAnchor.length === 1);
  check('footer map cue is hidden from assistive technology', mapAnchor.length === 1 && /<span\b(?=[^>]*\bclass=["'][^"']*\btext-link__cue\b)(?=[^>]*\baria-hidden=["']true["'])[^>]*>\s*↗\s*<\/span>/i.test(mapAnchor[0].content));
  const emailAnchor = footerAnchors.filter(({ attrs, text }) => hasClass(attrs, 'contact-email') && attrs.get('href') === config.footer.contact.email.href && text.endsWith(config.footer.contact.email.text));
  check('footer contact email is exact', emailAnchor.length === 1);
  check('footer email underlines only its visible label', emailAnchor.length === 1 && pairedTags('span', emailAnchor[0].content).some(({ attrs, text }) => hasClass(attrs, 'contact-email__label') && text === config.footer.contact.email.text));

  const socialNav = footerHtml.match(/<nav\b[^>]*class=["'][^"']*\bsocial-links\b[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1] || '';
  const socialAnchors = pairedTags('a', socialNav);
  check('footer has exactly five social links', socialAnchors.length === config.footer.socialLinks.length);
  for (const link of config.footer.socialLinks) {
    const matches = socialAnchors.filter(({ attrs, text }) => attrs.get('href') === link.href && text === link.text);
    check(`footer social link is exact: ${link.text}`, matches.length === 1);
    if (matches.length === 1) {
      const anchor = matches[0];
      const rel = (anchor.attrs.get('rel') || '').split(/\s+/);
      check(`footer social link opens safely: ${link.text}`, anchor.attrs.get('target') === '_blank' && ['me', 'noopener', 'noreferrer'].every((value) => rel.includes(value)));
      const icon = anchor.content.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
      const iconAttrs = icon ? attributes(icon[1]) : new Map();
      const use = icon ? tags('use', icon[2])[0] : null;
      check(`footer social link uses the rebuild02 icon: ${link.text}`, Boolean(icon && hasClass(iconAttrs, 'social-icon') && iconAttrs.get('aria-hidden') === 'true' && use?.attrs.get('href') === `#${link.iconId}`));
      const labels = pairedTags('span', anchor.content).filter(({ attrs, text }) => hasClass(attrs, 'social-link__label') && hasClass(attrs, 'visually-hidden') && text === link.text);
      check(`footer social link keeps an accessible label: ${link.text}`, labels.length === 1);
    }
  }

  const brandAnchor = footerAnchors.find(({ attrs }) => hasClass(attrs, config.footer.brandClass));
  check('footer brand lockup returns to the page top', brandAnchor?.attrs.get('href') === config.footer.brandHref);
  if (brandAnchor) {
    const brandImage = tags('img', brandAnchor.content)[0]?.attrs.get('src')?.replace(/^\.\//, '');
    check('footer uses the configured local Landometer symbol', brandImage === config.footer.brandImage);
    check('footer wordmark is exact', brandAnchor.text === config.footer.brandText);
  }
  check('footer copyright is exact', occurrences(footerHtml, config.footer.copyright) === 1);

  const linksNav = footerHtml.match(/<nav\b[^>]*class=["'][^"']*\bfooter-links\b[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1] || '';
  const ecosystemAnchors = pairedTags('a', linksNav);
  check('footer has exactly the configured policy and rebuild02 links', ecosystemAnchors.length === config.footer.links.length);
  for (const link of config.footer.links) {
    const matchingLinks = ecosystemAnchors.filter(({ attrs, text }) => attrs.get('href') === link.href && text === link.text);
    check(`footer ecosystem link is exact: ${link.text}`, matchingLinks.length === 1);
  }

  const bottomPattern = new RegExp(`<div\\b[^>]*class=["'][^"']*\\b${config.footer.bottomClass}\\b[^"']*["'][^>]*>[\\s\\S]*?<div\\b[^>]*class=["'][^"']*\\b${config.footer.bottomInnerClass}\\b[^"']*["'][^>]*>[\\s\\S]*?<div\\b[^>]*class=["'][^"']*\\b${config.footer.identityClass}\\b[^"']*["']`, 'i');
  check('footer bottom contains its inner identity region', bottomPattern.test(footerHtml));
}

function validateLocalizedFooter(locale) {
  const source = locale.html;
  const label = `${locale.id} footer`;
  const localized = footerForLocale(locale);
  const localeIds = idSequence(source);
  const match = source.match(/<footer\b([^>]*)>([\s\S]*?)<\/footer>/i);
  const attrs = match ? attributes(match[1]) : new Map();
  check(`${label} root uses the configured class and ID`, Boolean(match
    && hasClass(attrs, config.footer.rootClass)
    && attrs.get('id') === config.footer.rootId));
  check(`${label} is a labelled programmatic hash target`, attrs.get('tabindex') === config.footer.tabindex
    && attrs.get('aria-labelledby') === config.footer.labelledBy
    && localeIds.includes(config.footer.labelledBy));
  if (!match) return;

  const footerSource = match[0];
  const stripeMatch = footerSource.match(new RegExp(`<div\\b[^>]*class=["'][^"']*\\b${config.footer.stripeClass}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/div>`, 'i'));
  check(`${label} has the four-color measure stripe`, Boolean(stripeMatch) && tags('span', stripeMatch?.[1] || '').length === 4);
  check(`${label} contains the contact-details region`, /<div\b[^>]*class=["'][^"']*\bcontact-details\b[^"']*["']/i.test(footerSource));
  const companyParagraphs = pairedTags('p', footerSource).filter(({ attrs: paragraphAttrs, text }) => hasClass(paragraphAttrs, 'contact-company') && text === localized.contact.company);
  check(`${label} company is exact`, companyParagraphs.length === 1);
  check(`${label} address is exact`, occurrences(footerSource, localized.contact.address) === 1);

  const anchors = pairedTags('a', footerSource);
  const mapAnchors = anchors.filter(({ attrs: anchorAttrs, text }) => anchorAttrs.get('href') === localized.contact.map.href && text.includes(localized.contact.map.text));
  check(`${label} map link is exact`, mapAnchors.length === 1);
  check(`${label} map cue is hidden from assistive technology`, mapAnchors.length === 1
    && /<span\b(?=[^>]*\bclass=["'][^"']*\btext-link__cue\b)(?=[^>]*\baria-hidden=["']true["'])[^>]*>\s*↗\s*<\/span>/i.test(mapAnchors[0].content));
  const emailAnchors = anchors.filter(({ attrs: anchorAttrs, text }) => hasClass(anchorAttrs, 'contact-email')
    && anchorAttrs.get('href') === localized.contact.email.href
    && text.endsWith(localized.contact.email.text));
  check(`${label} contact email is exact`, emailAnchors.length === 1);
  check(`${label} email underlines only its visible label`, emailAnchors.length === 1
    && pairedTags('span', emailAnchors[0].content).some(({ attrs: spanAttrs, text }) => hasClass(spanAttrs, 'contact-email__label') && text === localized.contact.email.text));

  const socialNavMatch = footerSource.match(/<nav\b([^>]*)class=["']([^"']*\bsocial-links\b[^"']*)["']([^>]*)>([\s\S]*?)<\/nav>/i);
  const socialNavAttrs = socialNavMatch ? attributes(`${socialNavMatch[1]} class="${socialNavMatch[2]}" ${socialNavMatch[3]}`) : new Map();
  const socialAnchors = pairedTags('a', socialNavMatch?.[4] || '');
  check(`${label} social navigation label is localized`, socialNavAttrs.get('aria-label') === localized.labels.socialNav);
  check(`${label} has exactly five social profile links`, socialAnchors.length === config.footer.socialLinks.length);
  for (const link of config.footer.socialLinks) {
    const matches = socialAnchors.filter(({ attrs: anchorAttrs, text }) => anchorAttrs.get('href') === link.href && text === link.text);
    check(`${label} social profile is exact: ${link.text}`, matches.length === 1);
    if (matches.length !== 1) continue;
    const anchor = matches[0];
    const rel = (anchor.attrs.get('rel') || '').split(/\s+/);
    check(`${label} social profile opens safely: ${link.text}`, anchor.attrs.get('target') === '_blank'
      && ['me', 'noopener', 'noreferrer'].every((value) => rel.includes(value)));
    const icon = anchor.content.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
    const iconAttrs = icon ? attributes(icon[1]) : new Map();
    const use = icon ? tags('use', icon[2])[0] : null;
    check(`${label} social profile uses its icon: ${link.text}`, Boolean(icon
      && hasClass(iconAttrs, 'social-icon')
      && iconAttrs.get('aria-hidden') === 'true'
      && use?.attrs.get('href') === `#${link.iconId}`));
    check(`${label} social profile keeps an accessible label: ${link.text}`, pairedTags('span', anchor.content).filter(({ attrs: spanAttrs, text }) => hasClass(spanAttrs, 'social-link__label')
      && hasClass(spanAttrs, 'visually-hidden')
      && text === link.text).length === 1);
  }

  const linksNavMatch = footerSource.match(/<nav\b([^>]*)class=["']([^"']*\bfooter-links\b[^"']*)["']([^>]*)>([\s\S]*?)<\/nav>/i);
  const linksNavAttrs = linksNavMatch ? attributes(`${linksNavMatch[1]} class="${linksNavMatch[2]}" ${linksNavMatch[3]}`) : new Map();
  const ecosystemAnchors = pairedTags('a', linksNavMatch?.[4] || '');
  check(`${label} link navigation label is localized`, linksNavAttrs.get('aria-label') === localized.labels.footerNav);
  check(`${label} has exactly the configured policy and rebuild02 links`, ecosystemAnchors.length === localized.links.length);
  for (const link of localized.links) {
    check(`${label} ecosystem link is exact: ${link.text}`, ecosystemAnchors.filter(({ attrs: anchorAttrs, text }) => anchorAttrs.get('href') === link.href && text === link.text).length === 1);
  }

  const brandAnchor = anchors.find(({ attrs: anchorAttrs }) => hasClass(anchorAttrs, config.footer.brandClass));
  check(`${label} brand lockup returns to the page top`, brandAnchor?.attrs.get('href') === config.footer.brandHref);
  check(`${label} brand lockup label is localized`, brandAnchor?.attrs.get('aria-label') === localized.labels.brand);
  if (brandAnchor) {
    check(`${label} uses the configured local Landometer symbol`, tags('img', brandAnchor.content)[0]?.attrs.get('src') === `${locale.assetPrefix}${config.footer.brandImage}`);
    check(`${label} wordmark is exact`, brandAnchor.text === config.footer.brandText);
  }
  check(`${label} copyright is exact`, occurrences(footerSource, config.footer.copyright) === 1);

  const symbolIds = pairedTags('symbol', source).map(({ attrs: symbolAttrs }) => symbolAttrs.get('id')).filter(Boolean);
  const expectedSymbolIds = config.footer.socialLinks.map(({ iconId }) => iconId);
  check(`${label} page contains each social icon symbol once`, expectedSymbolIds.every((id) => symbolIds.filter((candidate) => candidate === id).length === 1)
    && symbolIds.length === expectedSymbolIds.length,
  symbolIds.join(', '));
  const cues = [...source.matchAll(/<span\b([^>]*)>\s*↗\s*<\/span>/gi)].map((cue) => attributes(cue[1]));
  check(`${label} page keeps every external cue undecorated and hidden`, cues.length === 6
    && cues.every((cueAttrs) => hasClass(cueAttrs, 'text-link__cue') && cueAttrs.get('aria-hidden') === 'true'),
  `found ${cues.length}`);
  check(`${label} is the final layout child`, /<\/main>\s*<footer\b[\s\S]*?<\/footer>\s*<\/div>\s*<\/body>\s*<\/html>\s*$/i.test(source));
}

for (const locale of localePages) validateLocalizedFooter(locale);

const socialSymbolIds = pairedTags('symbol').map(({ attrs }) => attrs.get('id')).filter(Boolean);
const expectedSocialSymbolIds = config.footer.socialLinks.map(({ iconId }) => iconId);
check('inline sprite contains each rebuild02 social symbol once', expectedSocialSymbolIds.every((id) => socialSymbolIds.filter((candidate) => candidate === id).length === 1) && socialSymbolIds.length === expectedSocialSymbolIds.length, socialSymbolIds.join(', '));
const externalCues = [...html.matchAll(/<span\b([^>]*)>\s*↗\s*<\/span>/gi)].map((match) => attributes(match[1]));
check('every external-link cue is undecorated and hidden from assistive technology', externalCues.length === 6 && externalCues.every((attrs) => hasClass(attrs, 'text-link__cue') && attrs.get('aria-hidden') === 'true'), `found ${externalCues.length}`);
check('footer is the final layout child inside #top', /<\/main>\s*<footer\b[\s\S]*?<\/footer>\s*<\/div>\s*<\/body>\s*<\/html>\s*$/i.test(html));
check('footer source declares an 8px four-color stripe', /\.measure-line\s*\{[^}]*height\s*:\s*8px[^}]*grid-template-columns\s*:\s*repeat\(4\s*,\s*1fr\)/i.test(css)
  && [1, 2, 3, 4].every((number) => new RegExp(`\\.measure-line\\s+span:nth-child\\(${number}\\)\\{[^}]*background\\s*:\\s*var\\(--energy-`, 'i').test(css)));
check('footer preserves the reference atmosphere/canvas split', /\.site-footer\s*\{[^}]*background\s*:\s*var\(--surface-atmosphere-measure\)/i.test(css)
  && /\.footer-bottom\s*\{[^}]*background\s*:\s*var\(--surface-canvas\)/i.test(css));
check('footer lockup source matches the reference dimensions and type', /\.footer-brand\s+img\s*\{[^}]*width\s*:\s*54px[^}]*height\s*:\s*54px/i.test(css)
  && /\.footer-brand\s+span\s*\{[^}]*font-family\s*:\s*var\(--font-display-en\)[^}]*font-size\s*:\s*23px[^}]*font-weight\s*:\s*700/i.test(css));
check('footer social icons match rebuild02 geometry and stroke', /\.social-icon\s*\{[^}]*width\s*:\s*22px[^}]*height\s*:\s*22px[^}]*fill\s*:\s*none[^}]*stroke\s*:\s*currentcolor[^}]*stroke-width\s*:\s*1\.65[^}]*stroke-linecap\s*:\s*round[^}]*stroke-linejoin\s*:\s*round/i.test(css));
check('footer social links are 44px icon-only pills without underlines', /\.social-links\s+a\s*\{[^}]*width\s*:\s*44px[^}]*min-width\s*:\s*44px[^}]*height\s*:\s*44px[^}]*border-radius\s*:\s*var\(--radius-pill\)[^}]*text-decoration\s*:\s*none/i.test(css));
check('footer icon-bearing contact links do not paint underlines', /\.contact-link\s*,\s*\.contact-email\s*\{[^}]*text-decoration\s*:\s*none/i.test(css)
  && /\.contact-email__label\s*\{[^}]*text-decoration\s*:\s*underline\s+1px/i.test(css));
check('compact footer keeps social icons in a flex row', !/@media\s*\(max-width\s*:\s*700px\)[\s\S]*?\.social-links\s*,\s*\.footer-links\s*\{[^}]*display\s*:\s*grid/i.test(css));
check('video behavior loops normally and pauses for reduced motion', /video\.loop\s*=\s*true/.test(app)
  && /video\.play\(\)\.catch/.test(app)
  && /motionPreference\?\.matches[\s\S]{0,240}video\.autoplay\s*=\s*false[\s\S]{0,240}video\.pause\(\)/.test(app));

if (failures.length > 0) {
  console.error(`CityChat release validation failed (${failures.length}/${checks.length} checks):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`CityChat release validation passed (${checks.length} checks, ${runtimeResources.size} runtime resources).`);
}
