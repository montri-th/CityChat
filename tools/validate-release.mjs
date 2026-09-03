import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
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
const failures = [];
const checks = [];

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
    if (/\.css$/i.test(relativePath)) stylesheetQueue.push(relativePath);
  }
}

check('release config schema is CityChat landing v2', config.schemaVersion === '2.0' && config.artifact?.product === 'citychat' && config.artifact?.pageKind === 'product-landing');
check('publication remains public but non-indexable', config.publication?.visibility === 'public' && config.publication?.indexable === false);
check('configured robots policy is exact', config.publication?.robotsMeta === 'noindex,nofollow,noarchive');
check('canonical URL is the GitHub Pages project route', config.artifact?.canonicalUrl === 'https://montri-th.github.io/CityChat/');

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

const forbiddenResidue = /<\/?(?:x-dc|x-import|sc-if|sc-for)\b|\{\{[^}]+\}\}|type=["']text\/x-dc|data-dc-script|(?:support|ds-base)\.js|style-(?:hover|focus|active)=/i;
check('DreamCanvas/template residue is absent', !forbiddenResidue.test(html));
check('application JavaScript has no obsolete framework residue', !/(?:\bDCLogic\b|React\.createElement|componentDidMount|this\.setState)/.test(app));
check('application JavaScript has no analytics or background network calls', !/(?:\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\s*\(|sendBeacon\s*\(|\bgtag\s*\(|\banalytics\b)/i.test(app));
check('source files do not leak a personal filesystem path', !/(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\)/.test(`${html}\n${css}\n${app}`));

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
  } else if (href && !/^(?:https?:|mailto:|tel:)/i.test(href)) {
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
  for (const match of stylesheetSource.matchAll(/url\(\s*([^)]+?)\s*\)/gi)) {
    addRuntimeResource(match[1], stylesheet, `CSS url() in ${stylesheet}`);
  }
  for (const match of stylesheetSource.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi)) {
    addRuntimeResource(match[1], stylesheet, `CSS @import in ${stylesheet}`);
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
