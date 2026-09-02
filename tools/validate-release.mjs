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
  const emailAnchor = footerAnchors.filter(({ attrs, text }) => hasClass(attrs, 'contact-email') && attrs.get('href') === config.footer.contact.email.href && text.endsWith(config.footer.contact.email.text));
  check('footer contact email is exact', emailAnchor.length === 1);

  const socialNav = footerHtml.match(/<nav\b[^>]*class=["'][^"']*\bsocial-links\b[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1] || '';
  const socialAnchors = pairedTags('a', socialNav);
  check('footer has exactly five social links', socialAnchors.length === config.footer.socialLinks.length);
  for (const link of config.footer.socialLinks) {
    check(`footer social link is exact: ${link.text}`, socialAnchors.filter(({ attrs, text }) => attrs.get('href') === link.href && text === link.text).length === 1);
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
check('footer is the final layout child inside #top', /<\/main>\s*<footer\b[\s\S]*?<\/footer>\s*<\/div>\s*<\/body>\s*<\/html>\s*$/i.test(html));
check('footer source declares an 8px four-color stripe', /\.measure-line\s*\{[^}]*height\s*:\s*8px[^}]*grid-template-columns\s*:\s*repeat\(4\s*,\s*1fr\)/i.test(css)
  && [1, 2, 3, 4].every((number) => new RegExp(`\\.measure-line\\s+span:nth-child\\(${number}\\)\\{[^}]*background\\s*:\\s*var\\(--energy-`, 'i').test(css)));
check('footer preserves the reference atmosphere/canvas split', /\.site-footer\s*\{[^}]*background\s*:\s*var\(--surface-atmosphere-measure\)/i.test(css)
  && /\.footer-bottom\s*\{[^}]*background\s*:\s*var\(--surface-canvas\)/i.test(css));
check('footer lockup source matches the reference dimensions and type', /\.footer-brand\s+img\s*\{[^}]*width\s*:\s*54px[^}]*height\s*:\s*54px/i.test(css)
  && /\.footer-brand\s+span\s*\{[^}]*font-family\s*:\s*var\(--font-display-en\)[^}]*font-size\s*:\s*23px[^}]*font-weight\s*:\s*700/i.test(css));

if (failures.length > 0) {
  console.error(`CityChat release validation failed (${failures.length}/${checks.length} checks):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`CityChat release validation passed (${checks.length} checks, ${runtimeResources.size} runtime resources).`);
}
