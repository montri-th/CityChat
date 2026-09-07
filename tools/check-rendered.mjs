import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolsRoot, '..');
const deploymentRoot = path.join(repositoryRoot, 'deployment');
const config = JSON.parse(readFileSync(path.join(repositoryRoot, 'release.config.json'), 'utf8'));
const requiredSections = ['main-content', 'offer', 'partners', 'product', 'loop', 'record', 'contact'];
const motifStageSelector = '[data-citychat-logo],[data-citychat-motif]';
const motifIds = ['motif', 'a', 'b', 'c'];
const motifEndCapsMs = { motif: 1800, a: 1800, b: 2400, c: 1800 };
const logoDotStartsMs = [[380, 500, 620], [530, 650, 770]];
const routes = {
  th: {
    id: 'th',
    label: 'Thai',
    pathname: '/',
    lang: 'th',
    faviconHref: config.identity.favicon.href,
    videoHref: config.media.cityscan.src,
    bodyFont: { family: 'Bai Jamjuree', declaration: '16px "Bai Jamjuree"', sample: 'ทดสอบ' },
    displayFont: { family: 'IBM Plex Sans Thai Looped', declaration: '700 32px "IBM Plex Sans Thai Looped"', sample: 'เมือง' },
    aria: {
      menuClosed: 'เปิดเมนู',
      menuOpen: 'ปิดเมนู',
      themeSystem: 'ธีม: ตามระบบ — สลับเป็นสว่าง',
      themeLight: 'ธีม: สว่าง — สลับเป็นมืด',
    },
  },
  en: {
    id: 'en',
    label: 'English',
    pathname: '/en/',
    lang: 'en',
    faviconHref: `../${config.identity.favicon.path}`,
    videoHref: `../${config.media.cityscan.path}`,
    bodyFont: { family: 'Bai Jamjuree', declaration: '16px "Bai Jamjuree"', sample: 'CityChat' },
    displayFont: { family: 'Arvo', declaration: '700 32px Arvo', sample: 'CityChat' },
    aria: {
      menuClosed: 'Open menu',
      menuOpen: 'Close menu',
      themeSystem: 'Theme: System — switch to light',
      themeLight: 'Theme: Light — switch to dark',
    },
  },
};
const failures = [];
let checks = 0;
let browserScenarios = 0;

function check(label, condition, details = '') {
  checks += 1;
  if (!condition) failures.push(`${label}${details ? ` — ${details}` : ''}`);
}

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.mp4', 'video/mp4'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
]);

function requestPathToFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  let relativePath = decoded.replace(/^\/+/, '');
  if (!relativePath || relativePath.endsWith('/')) relativePath += 'index.html';
  const absolutePath = path.resolve(deploymentRoot, relativePath);
  const relation = path.relative(deploymentRoot, absolutePath);
  if (relation.startsWith('..') || path.isAbsolute(relation)) return null;
  return absolutePath;
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url || '/', 'http://127.0.0.1').pathname;
  const absolutePath = requestPathToFile(pathname);
  if (!absolutePath || !existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, {
    'Content-Type': mimeTypes.get(path.extname(absolutePath).toLowerCase()) || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(absolutePath).pipe(response);
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});

const address = server.address();
const origin = `http://127.0.0.1:${address.port}`;
let browser;

function attachDiagnostics(page, scenario) {
  const diagnostics = [];
  page.on('pageerror', (error) => diagnostics.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const location = message.location();
      if (location.url && new URL(location.url).pathname === '/favicon.ico') return;
      const source = location.url ? ` @ ${location.url}:${location.lineNumber ?? 0}` : '';
      diagnostics.push(`console.error: ${message.text()}${source}`);
    }
  });
  page.on('requestfailed', (request) => {
    const errorText = request.failure()?.errorText || 'unknown';
    const pathname = new URL(request.url()).pathname;
    if (request.method() === 'HEAD' && errorText === 'net::ERR_ABORTED') return;
    if (pathname === '/assets/cityscan-demo.mp4' && errorText === 'net::ERR_ABORTED') return;
    if (scenario.includes('no JavaScript') && pathname === '/assets/citychat-motif-set/motion/citychat-motif-motion.js' && errorText === 'csp') return;
    diagnostics.push(`requestfailed: ${request.url()} (${errorText})`);
  });
  page.on('request', (request) => {
    const url = request.url();
    if (/^(?:data|blob|about):/i.test(url)) return;
    try {
      if (new URL(url).origin !== origin) diagnostics.push(`external runtime request: ${url}`);
    } catch {
      diagnostics.push(`invalid runtime request: ${url}`);
    }
  });
  page.on('response', (response) => {
    if (response.url().startsWith(origin) && new URL(response.url()).pathname !== '/favicon.ico' && response.status() >= 400) {
      diagnostics.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  return () => check(`${scenario}: no browser/runtime errors`, diagnostics.length === 0, diagnostics.join(' | '));
}

async function seedTheme(context, preference) {
  if (!preference) return;
  await context.addInitScript((value) => {
    try { localStorage.setItem('lds-theme', value); } catch { /* covered by the storage-denied scenario */ }
  }, preference);
}

async function openPage(context, scenario, route = routes.th) {
  browserScenarios += 1;
  const page = await context.newPage();
  const finishDiagnostics = attachDiagnostics(page, scenario);
  const response = await page.goto(new URL(route.pathname, origin).href, { waitUntil: 'load' });
  check(`${scenario}: entry returns HTTP 200`, response?.status() === 200, `status ${response?.status()}`);
  check(`${scenario}: clean route stays canonical locally`, new URL(page.url()).pathname === route.pathname, page.url());
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(120);
  return { page, finishDiagnostics };
}

async function assertCommonLayout(page, scenario, expectedTheme, desktop, route = routes.th) {
  const state = await page.evaluate(async ({ ids, expectedTheme: theme, faviconConfig, mediaConfig, routeConfig }) => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const color = (token) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${token})`;
      document.body.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    const backgroundImage = (token) => {
      const probe = document.createElement('span');
      probe.style.backgroundImage = `var(${token})`;
      document.body.append(probe);
      const value = getComputedStyle(probe).backgroundImage;
      probe.remove();
      return value;
    };
    const root = document.documentElement;
    const footer = document.querySelector('footer.site-footer#contact');
    const stripe = footer?.querySelector('.measure-line');
    const stripeRects = stripe ? [...stripe.children].map((element) => element.getBoundingClientRect()) : [];
    const stripeColors = stripe ? [...stripe.children].map((element) => getComputedStyle(element).backgroundColor) : [];
    const brandImage = footer?.querySelector('.footer-brand img');
    const brandWord = footer?.querySelector('.footer-brand span');
    const socialLinks = [...(footer?.querySelectorAll('.social-links a') || [])].map((anchor) => {
      const rect = anchor.getBoundingClientRect();
      const icon = anchor.querySelector('.social-icon');
      const iconRect = icon?.getBoundingClientRect();
      const iconStyle = icon ? getComputedStyle(icon) : null;
      const label = anchor.querySelector('.social-link__label.visually-hidden');
      const labelStyle = label ? getComputedStyle(label) : null;
      return {
        name: anchor.textContent.trim(),
        width: rect.width,
        height: rect.height,
        decoration: getComputedStyle(anchor).textDecorationLine,
        icon: iconRect && iconStyle ? {
          width: iconRect.width,
          height: iconRect.height,
          fill: iconStyle.fill,
          stroke: iconStyle.stroke,
          strokeWidth: iconStyle.strokeWidth,
          lineCap: iconStyle.strokeLinecap,
          lineJoin: iconStyle.strokeLinejoin,
        } : null,
        labelHiddenVisually: Boolean(labelStyle && labelStyle.position === 'absolute' && label.getBoundingClientRect().width <= 1 && label.getBoundingClientRect().height <= 1),
      };
    });
    const iconBearingLinks = [...document.querySelectorAll('a')]
      .filter((anchor) => anchor.querySelector('.ls-icon,.social-icon,.text-link__cue'))
      .map((anchor) => ({ label: anchor.textContent.trim().slice(0, 48), decoration: getComputedStyle(anchor).textDecorationLine }));
    const emailLabel = footer?.querySelector('.contact-email__label');
    const policyDecorations = [...(footer?.querySelectorAll('.footer-links a') || [])].map((anchor) => getComputedStyle(anchor).textDecorationLine);
    const video = document.querySelector('[data-cc-video]');
    const videoFallback = document.querySelector('[data-video-fallback]');
    const videoFrame = document.querySelector('.cityscan-demo__frame');
    const videoCopy = document.querySelector('.cityscan-demo__copy');
    const videoMedia = document.querySelector('.cityscan-demo__media');
    const videoSurface = visible(video) ? video : videoFallback;
    const videoFrameRect = videoFrame?.getBoundingClientRect();
    const videoSurfaceRect = videoSurface?.getBoundingClientRect();
    const videoCopyRect = videoCopy?.getBoundingClientRect();
    const videoMediaRect = videoMedia?.getBoundingClientRect();
    const banner = document.querySelector('.city-loop-banner');
    const bannerRect = banner?.getBoundingClientRect();
    const productRect = document.querySelector('#product')?.getBoundingClientRect();
    const loopRect = document.querySelector('#loop')?.getBoundingClientRect();
    const favicon = document.querySelector('link[rel~="icon"]');
    let faviconImage = null;
    if (favicon) {
      const probe = new Image();
      probe.src = favicon.href;
      try {
        await probe.decode();
        faviconImage = { naturalWidth: probe.naturalWidth, naturalHeight: probe.naturalHeight };
      } catch {
        faviconImage = { naturalWidth: 0, naturalHeight: 0 };
      }
    }
    const controls = [...document.querySelectorAll('#menu-toggle,[role="tab"],[data-cc-rail] [data-part="raillink"],.contact-link,.contact-email,.social-links a,.footer-links a,.footer-brand')]
      .filter(visible)
      .map((element) => ({ label: element.id || element.textContent.trim().slice(0, 32), height: element.getBoundingClientRect().height }));
    const icons = [...document.querySelectorAll('.ls-icon')].filter(visible).map((element) => ({
      family: getComputedStyle(element).fontFamily,
      width: element.getBoundingClientRect().width,
      text: element.textContent.trim(),
    }));
    const rail = document.querySelector('[data-cc-rail]');
    const railRect = rail?.getBoundingClientRect();
    const top = document.querySelector('#top');
    const motifStages = [...document.querySelectorAll('[data-citychat-logo],[data-citychat-motif]')].map((element) => {
      const rect = element.getBoundingClientRect();
      const scene = element.closest('section,footer,header,main');
      const fallback = element.querySelector('[data-citychat-logo-fallback],[data-citychat-motif-fallback]');
      const motionLayers = [...element.querySelectorAll('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark')].map((layer) => ({
        className: layer.className,
        visible: visible(layer),
        svgCount: layer.querySelectorAll('svg').length,
      }));
      const style = getComputedStyle(element);
      return {
        id: element.getAttribute('data-citychat-motif') || 'logo',
        surface: element.getAttribute('data-motif-surface'),
        ready: element.classList.contains('is-motif-ready'),
        visible: visible(element),
        width: rect.width,
        height: rect.height,
        fallbackVisible: visible(fallback),
        motionLayers,
        expectedLayerVisible: motionLayers.filter((layer) => layer.className.includes(`motif-stage__motion--theme-${theme}`) && layer.visible).length,
        wrongLayerVisible: motionLayers.filter((layer) => !layer.className.includes(`motif-stage__motion--theme-${theme}`) && layer.visible).length,
        scene: scene?.id || scene?.localName || '',
        sceneStageCount: scene?.querySelectorAll('[data-citychat-logo],[data-citychat-motif]').length || 0,
        boxShadow: style.boxShadow,
        filter: style.filter,
      };
    });
    const localResources = [...document.querySelectorAll('script[src],link[rel~="stylesheet"][href],link[rel~="preload"][href],link[rel~="icon"][href],img[src],video[src],source[src]')]
      .map((element) => {
        const attribute = element.hasAttribute('src') ? 'src' : 'href';
        const raw = element.getAttribute(attribute);
        try {
          const resolved = new URL(raw, location.href);
          return { tag: element.localName, raw, href: resolved.href, pathname: resolved.pathname, local: resolved.origin === location.origin };
        } catch {
          return { tag: element.localName, raw, href: '', pathname: '', local: false };
        }
      });
    const ariaLabels = [...document.querySelectorAll('[aria-label]')]
      .filter((element) => !element.matches('a[hreflang="th"]'))
      .map((element) => ({
        element: element.id ? `#${element.id}` : element.className ? `${element.localName}.${String(element.className).trim().replace(/\s+/g, '.')}` : element.localName,
        label: element.getAttribute('aria-label'),
      }));
    const nonLazyImages = [...document.images].filter((image) => image.loading !== 'lazy').map((image) => ({
      src: image.getAttribute('src'),
      complete: image.complete,
      naturalWidth: image.naturalWidth,
    }));
    return {
      lang: root.lang,
      theme: root.dataset.theme,
      h1Count: document.querySelectorAll('h1').length,
      sections: ids.map((id) => ({ id, visible: visible(document.getElementById(id)) })),
      overflow: Math.max(root.scrollWidth, document.body.scrollWidth) - innerWidth,
      fonts: {
        body: getComputedStyle(document.body).fontFamily,
        h1: getComputedStyle(document.querySelector('h1')).fontFamily,
        localeBody: document.fonts.check(routeConfig.bodyFont.declaration, routeConfig.bodyFont.sample),
        localeDisplay: document.fonts.check(routeConfig.displayFont.declaration, routeConfig.displayFont.sample),
        latinDisplay: document.fonts.check('23px Arvo', 'Landometer'),
        icons: document.fonts.check('22px "Material Symbols Rounded"', 'menu'),
      },
      themeOnlyWrong: [...document.querySelectorAll(theme === 'light' ? '.theme-only-dark' : '.theme-only-light')].filter(visible).length,
      themeOnlyRight: [...document.querySelectorAll(theme === 'light' ? '.theme-only-light' : '.theme-only-dark')].filter(visible).length,
      favicon: favicon ? {
        href: favicon.getAttribute('href'),
        pathname: new URL(favicon.href).pathname,
        type: favicon.getAttribute('type'),
        naturalWidth: faviconImage?.naturalWidth || 0,
        naturalHeight: faviconImage?.naturalHeight || 0,
        expected: faviconConfig,
      } : null,
      highlight: banner && bannerRect && productRect && loopRect ? {
        visible: visible(banner),
        afterProduct: bannerRect.top >= productRect.bottom - 1,
        beforeLoop: bannerRect.bottom <= loopRect.top + 1,
        background: getComputedStyle(banner).backgroundImage,
        expectedBackground: backgroundImage('--product-citychat-gradient'),
        eyebrowColor: getComputedStyle(banner.querySelector('.city-loop-banner__eyebrow')).color,
        headingColor: getComputedStyle(banner.querySelector('h2')).color,
        storyColor: getComputedStyle(banner.querySelector('.city-loop-banner__story')).color,
        expectedForeground: color('--on-product-citychat'),
      } : null,
      footer: {
        finalChild: Boolean(footer && top?.lastElementChild === footer && footer.parentElement === top),
        tabindex: footer?.getAttribute('tabindex'),
        labelledBy: footer?.getAttribute('aria-labelledby'),
        stripeHeight: stripe?.getBoundingClientRect().height,
        stripeWidths: stripeRects.map((rect) => rect.width),
        stripeColors,
        expectedStripeColors: ['--energy-coral', '--energy-yellow', '--energy-mint', '--energy-sky'].map(color),
        contactDetails: visible(footer?.querySelector('.contact-details')),
        socialCount: footer?.querySelectorAll('.social-links a').length,
        socialDisplay: footer?.querySelector('.social-links') ? getComputedStyle(footer.querySelector('.social-links')).display : '',
        socialLinks,
        iconBearingLinks,
        emailLabelDecoration: emailLabel ? getComputedStyle(emailLabel).textDecorationLine : '',
        policyDecorations,
        policyCount: footer?.querySelectorAll('.footer-links a').length,
        brandImage: brandImage ? { width: brandImage.getBoundingClientRect().width, height: brandImage.getBoundingClientRect().height } : null,
        brandWord: brandWord ? { family: getComputedStyle(brandWord).fontFamily, size: getComputedStyle(brandWord).fontSize, weight: getComputedStyle(brandWord).fontWeight } : null,
        atmosphere: footer ? getComputedStyle(footer).backgroundImage : '',
        expectedAtmosphere: backgroundImage('--surface-atmosphere-measure'),
        bottom: footer?.querySelector('.footer-bottom') ? getComputedStyle(footer.querySelector('.footer-bottom')).backgroundColor : '',
        expectedCanvas: color('--surface-canvas'),
      },
      controls,
      icons,
      motifStages,
      localResources,
      ariaLabels,
      video: video ? {
        src: video.getAttribute('src'),
        pathname: new URL(video.src).pathname,
        fallbackHref: videoFallback?.querySelector('a[download]')?.getAttribute('href') || '',
        fallbackPathname: videoFallback?.querySelector('a[download]') ? new URL(videoFallback.querySelector('a[download]').href).pathname : '',
        autoplay: video.autoplay,
        autoplayAttribute: video.hasAttribute('autoplay'),
        loop: video.loop,
        muted: video.muted,
        defaultMuted: video.defaultMuted,
        playsInline: video.playsInline,
        controls: video.controls,
        widthAttribute: Number(video.getAttribute('width')),
        heightAttribute: Number(video.getAttribute('height')),
        intrinsicWidth: video.videoWidth,
        intrinsicHeight: video.videoHeight,
        expectedIntrinsicWidth: mediaConfig.intrinsicWidth,
        expectedIntrinsicHeight: mediaConfig.intrinsicHeight,
        frameWidth: videoFrameRect?.width || 0,
        frameHeight: videoFrameRect?.height || 0,
        surfaceWidth: videoSurfaceRect?.width || 0,
        surfaceHeight: videoSurfaceRect?.height || 0,
        copyTop: videoCopyRect?.top || 0,
        copyBottom: videoCopyRect?.bottom || 0,
        copyLeft: videoCopyRect?.left || 0,
        copyRight: videoCopyRect?.right || 0,
        mediaTop: videoMediaRect?.top || 0,
        mediaLeft: videoMediaRect?.left || 0,
      } : null,
      rail: railRect ? { visible: visible(rail), center: railRect.top + railRect.height / 2, viewportCenter: innerHeight / 2 } : null,
      nonLazyImages,
    };
  }, {
    ids: requiredSections,
    expectedTheme,
    faviconConfig: config.identity.favicon,
    mediaConfig: config.media.cityscan,
    routeConfig: route,
  });

  check(`${scenario}: ${route.label} document and one H1 render`, state.lang === route.lang && state.h1Count === 1, `lang=${state.lang}, h1=${state.h1Count}`);
  check(`${scenario}: expected theme resolves`, state.theme === expectedTheme, `received ${state.theme}`);
  check(`${scenario}: required landing regions have layout boxes`, state.sections.every((item) => item.visible), state.sections.filter((item) => !item.visible).map((item) => item.id).join(', '));
  check(`${scenario}: no horizontal page overflow`, state.overflow <= 1, `${state.overflow}px`);
  check(`${scenario}: locale body/display and shared icon fonts load`, state.fonts.localeBody && state.fonts.localeDisplay && state.fonts.latinDisplay && state.fonts.icons, JSON.stringify(state.fonts));
  check(`${scenario}: computed body and H1 use intended ${route.label} families`, state.fonts.body.includes(route.bodyFont.family) && state.fonts.h1.includes(route.displayFont.family), `${state.fonts.body} / ${state.fonts.h1}`);
  check(`${scenario}: theme-specific artwork is correct`, state.themeOnlyWrong === 0 && state.themeOnlyRight > 0, `wrong ${state.themeOnlyWrong}, right ${state.themeOnlyRight}`);
  const renderedMotifIds = state.motifStages.filter(({ id }) => id !== 'logo').map(({ id }) => id).sort();
  check(`${scenario}: four semantic motifs and one opening logo stage render`, state.motifStages.length === 5
    && state.motifStages.filter(({ id }) => id === 'logo').length === 1
    && JSON.stringify(renderedMotifIds) === JSON.stringify([...motifIds].sort()),
  JSON.stringify(state.motifStages));
  check(`${scenario}: every CityChat scene carries at most one identity or story motif`, state.motifStages.every(({ sceneStageCount }) => sceneStageCount === 1), JSON.stringify(state.motifStages));
  check(`${scenario}: motif surface semantics remain exact`, state.motifStages.every(({ id, surface }) => surface === (['logo', 'motif'].includes(id) ? 'gradient' : 'regular')), JSON.stringify(state.motifStages));
  check(`${scenario}: moving motifs keep the 120px minimum without shadows or glow`, state.motifStages.every(({ id, visible: stageVisible, width, height, boxShadow, filter }) => stageVisible
    && width >= 119.5
    && (id === 'logo' || height >= 119.5)
    && boxShadow === 'none'
    && filter === 'none'), JSON.stringify(state.motifStages));
  check(`${scenario}: mounted motifs show only the page-theme motion layer and otherwise fail open to stills`, state.motifStages.every(({ ready, fallbackVisible, motionLayers, expectedLayerVisible, wrongLayerVisible }) => ready
    ? !fallbackVisible && motionLayers.length === 2 && motionLayers.every(({ svgCount }) => svgCount === 1) && expectedLayerVisible === 1 && wrongLayerVisible === 0
    : fallbackVisible && motionLayers.length === 0), JSON.stringify(state.motifStages));
  check(`${scenario}: non-lazy images decode`, state.nonLazyImages.every((image) => image.complete && image.naturalWidth > 0), JSON.stringify(state.nonLazyImages.filter((image) => !image.complete || image.naturalWidth <= 0)));
  check(`${scenario}: approved CityChat favicon loads at its exact dimensions`, state.favicon
    && state.favicon.href === route.faviconHref
    && state.favicon.pathname === `/${state.favicon.expected.path}`
    && state.favicon.type === state.favicon.expected.mimeType
    && state.favicon.naturalWidth === state.favicon.expected.intrinsicWidth
    && state.favicon.naturalHeight === state.favicon.expected.intrinsicHeight,
  JSON.stringify(state.favicon));
  check(`${scenario}: route-relative CityScan references resolve to the shared root asset`, state.video
    && state.video.src === route.videoHref
    && state.video.fallbackHref === route.videoHref
    && state.video.pathname === `/${config.media.cityscan.path}`
    && state.video.fallbackPathname === `/${config.media.cityscan.path}`,
  JSON.stringify(state.video));
  if (route.id === 'en') {
    const thaiAriaLabels = state.ariaLabels.filter(({ label }) => /[฀-๿]/u.test(label));
    check(`${scenario}: English runtime ARIA labels are localized`, state.ariaLabels.length > 0 && thaiAriaLabels.length === 0, JSON.stringify(thaiAriaLabels));
    const misplacedNestedAssets = state.localResources.filter(({ local, pathname }) => local && pathname.startsWith('/en/'));
    check(`${scenario}: nested English asset URLs resolve outside /en/`, state.localResources.length > 0 && misplacedNestedAssets.length === 0, JSON.stringify(misplacedNestedAssets));
  }
  check(`${scenario}: gradient highlight renders between CityScan and the civic loop`, state.highlight?.visible
    && state.highlight.afterProduct
    && state.highlight.beforeLoop
    && state.highlight.background === state.highlight.expectedBackground
    && state.highlight.eyebrowColor === state.highlight.expectedForeground
    && state.highlight.headingColor === state.highlight.expectedForeground
    && state.highlight.storyColor === state.highlight.expectedForeground,
  JSON.stringify(state.highlight));

  const stripeWidthsAligned = state.footer.stripeWidths.length === 4
    && Math.max(...state.footer.stripeWidths) - Math.min(...state.footer.stripeWidths) <= 1;
  check(`${scenario}: footer is the final child and an accessible hash target`, state.footer.finalChild && state.footer.tabindex === '-1' && state.footer.labelledBy === 'contact-title');
  check(`${scenario}: footer has the exact 8px four-part measure stripe`, state.footer.stripeHeight === 8 && stripeWidthsAligned && state.footer.stripeColors.every((colorValue, index) => colorValue === state.footer.expectedStripeColors[index]), JSON.stringify(state.footer));
  check(`${scenario}: footer preserves atmosphere and canvas regions`, state.footer.atmosphere === state.footer.expectedAtmosphere && state.footer.bottom === state.footer.expectedCanvas);
  check(`${scenario}: footer contact, five social, and three policy links render`, state.footer.contactDetails && state.footer.socialCount === 5 && state.footer.policyCount === 3);
  check(`${scenario}: social profiles are accessible 44px icon-only pills`, state.footer.socialDisplay === 'flex' && state.footer.socialLinks.length === 5 && state.footer.socialLinks.every((link) => Math.abs(link.width - 44) <= 1 && Math.abs(link.height - 44) <= 1 && link.decoration === 'none' && link.icon && Math.abs(link.icon.width - 22) <= 1 && Math.abs(link.icon.height - 22) <= 1 && link.icon.fill === 'none' && link.icon.stroke !== 'none' && link.icon.strokeWidth === '1.65px' && link.icon.lineCap === 'round' && link.icon.lineJoin === 'round' && link.labelHiddenVisually), JSON.stringify(state.footer.socialLinks));
  check(`${scenario}: icon-bearing links never paint an underline`, state.footer.iconBearingLinks.length > 0 && state.footer.iconBearingLinks.every((link) => link.decoration === 'none'), JSON.stringify(state.footer.iconBearingLinks.filter((link) => link.decoration !== 'none')));
  check(`${scenario}: only intended footer text remains underlined`, state.footer.emailLabelDecoration.includes('underline') && state.footer.policyDecorations.every((value) => value.includes('underline')), JSON.stringify({ email: state.footer.emailLabelDecoration, policy: state.footer.policyDecorations }));
  check(`${scenario}: footer lockup matches reference size and typography`, state.footer.brandImage && Math.abs(state.footer.brandImage.width - 54) <= 1 && Math.abs(state.footer.brandImage.height - 54) <= 1 && state.footer.brandWord?.family.includes('Arvo') && state.footer.brandWord.size === '23px' && state.footer.brandWord.weight === '700', JSON.stringify(state.footer));
  check(`${scenario}: CityScan video is configured to autoplay muted and loop inline`, state.video?.autoplay && state.video.autoplayAttribute && state.video.loop && state.video.muted && state.video.defaultMuted && state.video.playsInline && state.video.controls, JSON.stringify(state.video));
  const portraitRatio = state.video ? state.video.expectedIntrinsicWidth / state.video.expectedIntrinsicHeight : 0;
  const renderedRatio = state.video?.surfaceHeight ? state.video.surfaceWidth / state.video.surfaceHeight : 0;
  check(`${scenario}: CityScan uses its declared portrait dimensions`, state.video
    && state.video.widthAttribute === state.video.expectedIntrinsicWidth
    && state.video.heightAttribute === state.video.expectedIntrinsicHeight
    && (!state.video.intrinsicWidth || (state.video.intrinsicWidth === state.video.expectedIntrinsicWidth && state.video.intrinsicHeight === state.video.expectedIntrinsicHeight)),
  JSON.stringify(state.video));
  check(`${scenario}: portrait media stays practical without cropping`, state.video
    && state.video.frameWidth > 0
    && state.video.frameWidth <= 405
    && state.video.surfaceWidth > 0
    && state.video.surfaceHeight > state.video.surfaceWidth
    && Math.abs(renderedRatio - portraitRatio) <= 0.012,
  JSON.stringify({ portraitRatio, renderedRatio, video: state.video }));
  check(`${scenario}: CityScan copy and media follow the responsive reading order`, desktop
    ? state.video.mediaLeft < state.video.copyLeft && state.video.copyLeft >= state.video.mediaLeft + state.video.surfaceWidth - 1
    : state.video.mediaTop >= state.video.copyBottom - 1,
  JSON.stringify(state.video));
  check(`${scenario}: tested interactive targets are at least 44px tall`, state.controls.every((control) => control.height >= 43.5), JSON.stringify(state.controls.filter((control) => control.height < 43.5)));
  check(`${scenario}: visible icon ligatures use the local icon face without text-width leakage`, state.icons.length > 0 && state.icons.every((icon) => icon.family.includes('Material Symbols Rounded') && icon.width <= 48), JSON.stringify(state.icons.filter((icon) => !icon.family.includes('Material Symbols Rounded') || icon.width > 48)));

  if (desktop) {
    check(`${scenario}: desktop bookmark rail is visible and vertically centred`, state.rail?.visible && Math.abs(state.rail.center - state.rail.viewportCenter) <= 2, JSON.stringify(state.rail));
  } else {
    check(`${scenario}: compact layouts hide the desktop bookmark rail`, !state.rail?.visible, JSON.stringify(state.rail));
  }
}

async function assertRouteAssets(page, scenario, route) {
  const results = await page.evaluate(async () => {
    const urls = [
      ...[...document.querySelectorAll('script[src],link[rel~="stylesheet"][href],link[rel~="preload"][href],link[rel~="icon"][href],img[src],video[src],source[src]')]
        .map((element) => element.src || element.href),
      ...performance.getEntriesByType('resource').map((entry) => entry.name),
    ]
      .filter((value) => value && new URL(value, location.href).origin === location.origin);
    return Promise.all([...new Set(urls)].map(async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        return { pathname: new URL(url).pathname, status: response.status, ok: response.ok };
      } catch (error) {
        return { pathname: new URL(url).pathname, status: 0, ok: false, error: error.message };
      }
    }));
  });
  const expectedPaths = [
    '/citychat.css',
    '/app.js',
    '/motif-runtime.js',
    '/assets/citychat-motif-set/motion/citychat-motif-motion.css',
    '/assets/citychat-motif-set/motion/citychat-motif-motion.js',
    `/${config.identity.favicon.path}`,
    `/${config.media.cityscan.path}`,
    '/assets/citychat-motif-set/assets/3a-voice-home-light.svg',
    '/assets/citychat-motif-set/assets/3a-voice-home-dark.svg',
    '/assets/citychat-motif-set/assets/3b-live-visit-trade-light.svg',
    '/assets/citychat-motif-set/assets/3b-live-visit-trade-dark.svg',
    '/assets/citychat-motif-set/assets/3c-our-voice-here-light.svg',
    '/assets/citychat-motif-set/assets/3c-our-voice-here-dark.svg',
    '/assets/citychat-motif-set/assets/logo-bubbles-proposal-light.svg',
    '/assets/citychat-motif-set/assets/logo-bubbles-proposal-dark.svg',
    '/assets/citychat-motif-set/assets/lockup-without-bubbles-light.png',
    '/assets/citychat-motif-set/assets/lockup-without-bubbles-dark.png',
  ];
  check(`${scenario}: every declared local asset answers successfully`, results.length > 0 && results.every(({ ok }) => ok), JSON.stringify(results.filter(({ ok }) => !ok)));
  check(`${scenario}: shared shell and registered motif bytes load from root`, expectedPaths.every((expected) => results.some(({ pathname }) => pathname === expected)), JSON.stringify(results));
  if (route.id === 'en') {
    check(`${scenario}: English asset probe makes no /en/ resource requests`, results.every(({ pathname }) => !pathname.startsWith('/en/')), JSON.stringify(results.filter(({ pathname }) => pathname.startsWith('/en/'))));
  }
}

async function runMatrixScenario({ name, viewport, preference, expectedTheme, colorScheme, desktop, route = routes.th, probeAssets = false }) {
  const context = await browser.newContext({ viewport, colorScheme });
  await seedTheme(context, preference);
  const { page, finishDiagnostics } = await openPage(context, name, route);
  try {
    await assertCommonLayout(page, name, expectedTheme, desktop, route);
    if (probeAssets) await assertRouteAssets(page, name, route);
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runInteractions(route = routes.th) {
  const scenario = route.id === 'th' ? 'desktop interactions' : `${route.label} desktop interactions`;
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const { page, finishDiagnostics } = await openPage(context, scenario, route);
  try {
    const menuButton = page.locator('#menu-toggle');
    const initialUi = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      menu: document.querySelector('#menu-toggle')?.getAttribute('aria-label'),
      theme: document.querySelector('#theme-cycle')?.getAttribute('aria-label'),
      ariaLabels: [...document.querySelectorAll('[aria-label]')]
        .filter((element) => !element.matches('a[hreflang="th"]'))
        .map((element) => element.getAttribute('aria-label')),
    }));
    check(`${scenario}: interaction document language is exact`, initialUi.lang === route.lang, initialUi.lang);
    check(`${scenario}: initial menu and theme ARIA match the locale`, initialUi.menu === route.aria.menuClosed && initialUi.theme === route.aria.themeSystem, JSON.stringify(initialUi));
    if (route.id === 'en') {
      check(`${scenario}: initial English controls expose no Thai ARIA`, initialUi.ariaLabels.every((label) => !/[฀-๿]/u.test(label)), JSON.stringify(initialUi.ariaLabels.filter((label) => /[฀-๿]/u.test(label))));
    }
    await menuButton.click();
    check(`${scenario}: menu opens with localized ARIA, overlay, and focus`, await page.locator('#site-menu').isVisible()
      && await page.locator('#menu-overlay').isVisible()
      && await menuButton.getAttribute('aria-expanded') === 'true'
      && await menuButton.getAttribute('aria-label') === route.aria.menuOpen
      && await page.locator('#theme-cycle').evaluate((element) => document.activeElement === element));
    await page.keyboard.press('Escape');
    check(`${scenario}: Escape closes menu, restores localized ARIA, and returns focus`, !(await page.locator('#site-menu').isVisible())
      && await menuButton.getAttribute('aria-expanded') === 'false'
      && await menuButton.getAttribute('aria-label') === route.aria.menuClosed
      && await menuButton.evaluate((element) => document.activeElement === element));
    await menuButton.click();
    await page.locator('#menu-overlay').click({ position: { x: 2, y: 2 } });
    check(`${scenario}: overlay closes menu`, !(await page.locator('#site-menu').isVisible()));

    await menuButton.click();
    await page.locator('#theme-cycle').click();
    check(`${scenario}: theme cycle selects, labels, and persists light`, await page.locator('html').getAttribute('data-theme-preference') === 'light'
      && await page.locator('#theme-cycle').getAttribute('aria-label') === route.aria.themeLight
      && await page.evaluate(() => localStorage.getItem('lds-theme')) === 'light');
    await page.reload({ waitUntil: 'load' });
    await page.evaluate(() => document.fonts?.ready);
    check(`${scenario}: persisted theme survives reload`, await page.locator('html').getAttribute('data-theme') === 'light' && await page.locator('html').getAttribute('data-theme-preference') === 'light');

    const socialNames = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'X'];
    const socialNameCounts = await Promise.all(socialNames.map((name) => page.getByRole('link', { name, exact: true }).count()));
    check(`${scenario}: icon-only social links expose exact accessible names`, socialNameCounts.every((count) => count === 1), JSON.stringify(socialNameCounts));

    let videoOutcome = { kind: 'timeout' };
    try {
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-cc-video]');
        const fallback = document.querySelector('[data-video-fallback]');
        const fallbackVisible = Boolean(fallback && !fallback.hidden && getComputedStyle(fallback).display !== 'none');
        const playing = Boolean(element && !element.hidden && element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !element.paused && element.currentTime > 0);
        return playing || fallbackVisible;
      }, null, { timeout: 10000 });
      videoOutcome = await page.evaluate((expectedVideoHref) => {
        const element = document.querySelector('[data-cc-video]');
        const fallback = document.querySelector('[data-video-fallback]');
        const fallbackVisible = Boolean(fallback && !fallback.hidden && getComputedStyle(fallback).display !== 'none');
        if (element && !element.hidden && !element.paused && element.currentTime > 0) return { kind: 'playing', firstTime: element.currentTime };
        return {
          kind: 'fallback',
          valid: Boolean(element?.hidden && fallbackVisible && (element.error || element.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) && fallback?.querySelector('a[download]')?.getAttribute('href') === expectedVideoHref),
          errorCode: element?.error?.code || 0,
          networkState: element?.networkState,
        };
      }, route.videoHref);
      if (videoOutcome.kind === 'playing') {
        await page.waitForTimeout(350);
        const secondTime = await page.locator('[data-cc-video]').evaluate((element) => element.currentTime);
        videoOutcome.advances = secondTime > videoOutcome.firstTime;
      }
    } catch { /* Report through the assertion below. */ }
    check(`${scenario}: CityScan autoplays when supported or exposes its deterministic fallback`, (videoOutcome.kind === 'playing' && videoOutcome.advances) || (videoOutcome.kind === 'fallback' && videoOutcome.valid), JSON.stringify(videoOutcome));
    await page.evaluate(() => document.querySelector('[data-cc-video]')?.pause());

    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    await page.locator('#tab-chat').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.locator('#tab-chat').click();
    await page.waitForTimeout(50);
    const chatState = await page.evaluate(() => ({
      selected: document.querySelector('#tab-chat')?.getAttribute('aria-selected'),
      chatHidden: document.querySelector('#panel-chat')?.hidden,
      dataHidden: document.querySelector('#panel-data')?.hidden,
    }));
    check(`${scenario}: clicking chat tab switches both ARIA and panels`, chatState.selected === 'true' && chatState.chatHidden === false && chatState.dataHidden === true, JSON.stringify(chatState));
    await page.locator('#tab-chat').press('ArrowLeft');
    check(`${scenario}: tab keyboard navigation wraps focus and state`, await page.locator('#tab-data').evaluate((element) => document.activeElement === element) && await page.locator('#tab-data').getAttribute('aria-selected') === 'true' && await page.locator('#panel-data').isVisible());

    await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
    const viewport = page.viewportSize();
    await page.mouse.move(8, Math.max(8, (viewport?.height || 800) - 8));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => document.querySelector('[data-cc-nav]')?.dataset.calm === 'off');
    await page.waitForFunction(() => document.querySelector('[data-cc-nav] [data-part="bar"]')?.getBoundingClientRect().height >= 75, null, { timeout: 3000 });
    const expandedHeight = await page.locator('[data-cc-nav] [data-part="bar"]').evaluate((element) => element.getBoundingClientRect().height);
    const readNavState = () => page.evaluate(() => {
        const nav = document.querySelector('[data-cc-nav]');
        const bar = nav?.querySelector('[data-part="bar"]');
        return {
          calm: nav?.dataset.calm,
          hovered: nav?.matches(':hover'),
          height: bar?.getBoundingClientRect().height,
          computedHeight: bar ? getComputedStyle(bar).height : '',
          transitionDuration: bar ? getComputedStyle(bar).transitionDuration : '',
          scrollY,
        };
      });

    let calmState = await readNavState();
    const calmDeadline = Date.now() + 3000;
    while ((calmState.calm !== 'on' || calmState.height > 30) && Date.now() < calmDeadline) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(80);
      calmState = await readNavState();
    }
    const calmHeight = calmState.height;
    check(`${scenario}: sustained downward scrolling reaches the compact nav state`, calmState.calm === 'on' && calmHeight <= 30, JSON.stringify(calmState));
    await page.waitForTimeout(240);
    const settledCalmState = await readNavState();
    check(`${scenario}: compact nav remains stable after scrolling stops`, settledCalmState.calm === 'on' && settledCalmState.height <= 30, JSON.stringify(settledCalmState));
    await page.locator('[data-cc-nav]').hover();
    await page.waitForFunction(() => document.querySelector('[data-cc-nav]')?.dataset.calm === 'off');
    await page.waitForFunction(() => document.querySelector('[data-cc-nav] [data-part="bar"]')?.getBoundingClientRect().height >= 75, null, { timeout: 3000 });
    const restoredHeight = await page.locator('[data-cc-nav] [data-part="bar"]').evaluate((element) => element.getBoundingClientRect().height);
    check(`${scenario}: calm nav compresses and hover restores it`, expandedHeight >= 75 && calmHeight <= 30 && restoredHeight >= 75, `${expandedHeight}/${calmHeight}/${restoredHeight}`);
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runSystemDark(route = routes.th) {
  const scenario = route.id === 'th' ? 'system dark' : `${route.label} system dark`;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const { page, finishDiagnostics } = await openPage(context, scenario, route);
  try {
    check(`${scenario}: system preference resolves dark without saved state`, await page.locator('html').getAttribute('data-theme-preference') === 'system' && await page.locator('html').getAttribute('data-theme') === 'dark');
    await assertCommonLayout(page, scenario, 'dark', false, route);
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runDelayedLogoBases(route = routes.th) {
  const scenario = `${route.label} delayed logo base responses`;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
  await seedTheme(context, 'light');
  await context.addInitScript(() => {
    const nativeDecode = HTMLImageElement.prototype.decode;
    const releases = new Map();
    const state = { pending: [], released: [], urls: {} };
    window.__qaLogoBaseDecode = {
      state,
      release(rendition) {
        releases.get(rendition)?.();
      },
    };
    HTMLImageElement.prototype.decode = function gatedDecode() {
      const rendition = this.dataset.motifBaseRendition;
      const decoded = nativeDecode.call(this);
      if (!this.classList.contains('citychat-logo-stage__base') || !['dark', 'light'].includes(rendition)) return decoded;
      return decoded.then(() => new Promise((resolve) => {
        state.urls[rendition] = this.currentSrc || this.src;
        releases.set(rendition, () => {
          if (!state.released.includes(rendition)) state.released.push(rendition);
          resolve();
        });
        if (!state.pending.includes(rendition)) state.pending.push(rendition);
      }));
    };
  });

  const page = await context.newPage();
  browserScenarios += 1;
  const finishDiagnostics = attachDiagnostics(page, scenario);

  const readLogoState = () => page.evaluate(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
    };
    const stage = document.querySelector('[data-citychat-logo]');
    const fallback = stage?.querySelector('[data-citychat-logo-fallback]');
    const fallbackRenditions = fallback ? [...fallback.querySelectorAll('[data-motif-rendition]')].map((element) => ({
      rendition: element.dataset.motifRendition,
      visible: visible(element),
      images: [...element.querySelectorAll('img')].map((image) => ({
        kind: image.classList.contains('citychat-logo-stage__base') ? 'base' : 'bubbles',
        pathname: new URL(image.currentSrc || image.src).pathname,
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      })),
    })) : [];
    const motionLayers = stage ? [...stage.querySelectorAll('.motif-stage__motion')] : [];
    return {
      theme: document.documentElement.dataset.theme,
      preference: document.documentElement.dataset.themePreference,
      ready: stage?.classList.contains('is-motif-ready'),
      motifState: stage?.dataset.motifState || '',
      fallbackVisible: visible(fallback),
      fallbackRenditions,
      motionLayers: motionLayers.map((layer) => ({
        theme: layer.classList.contains('motif-stage__motion--theme-light') ? 'light' : 'dark',
        rendition: layer.dataset.motifRendition,
        visible: visible(layer),
        bases: [...layer.querySelectorAll('img.citychat-logo-stage__base')].map((image) => ({
          pathname: new URL(image.currentSrc || image.src).pathname,
          rendition: image.dataset.motifBaseRendition,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        })),
      })),
    };
  });

  try {
    const response = await page.goto(new URL(route.pathname, origin).href, { waitUntil: 'domcontentloaded' });
    check(`${scenario}: entry returns HTTP 200`, response?.status() === 200, `status ${response?.status()}`);
    check(`${scenario}: delayed-response route stays canonical locally`, new URL(page.url()).pathname === route.pathname, page.url());
    await page.evaluate(async () => {
      const images = [...document.querySelectorAll('[data-citychat-logo-fallback] img')];
      await Promise.all(images.map((image) => image.decode()));
    });
    await page.locator('[data-citychat-logo]').scrollIntoViewIfNeeded();

    await page.waitForFunction(() => {
      const pending = window.__qaLogoBaseDecode?.state.pending || [];
      return pending.length === 2 && ['dark', 'light'].every((rendition) => pending.includes(rendition));
    }, null, { timeout: 4000 });
    const decodeGateState = await page.evaluate(() => ({ ...window.__qaLogoBaseDecode.state }));
    const heldState = await readLogoState();
    const heldVisible = heldState.fallbackRenditions.filter(({ visible }) => visible);
    check(`${scenario}: both replacement PNG decode completions are independently held`, decodeGateState.pending.length === 2
      && decodeGateState.released.length === 0
      && ['dark', 'light'].every((rendition) => decodeGateState.pending.includes(rendition)
        && new URL(decodeGateState.urls[rendition]).pathname.endsWith(`/lockup-without-bubbles-${rendition}.png`)), JSON.stringify(decodeGateState));
    check(`${scenario}: complete static logo stays visible while both replacement bases are decode-gated`, heldState.theme === 'light'
      && heldState.preference === 'light'
      && !heldState.ready
      && heldState.motionLayers.length === 0
      && heldState.fallbackVisible
      && heldState.fallbackRenditions.length === 2
      && heldState.fallbackRenditions.every(({ images }) => images.length === 2
        && images.every(({ complete, naturalWidth, naturalHeight }) => complete && naturalWidth > 0 && naturalHeight > 0))
      && heldVisible.length === 1
      && heldVisible[0].rendition === 'dark'
      && heldVisible[0].images.length === 2
      && heldVisible[0].images.some(({ kind, pathname }) => kind === 'base' && pathname.endsWith('/lockup-without-bubbles-dark.png'))
      && heldVisible[0].images.some(({ kind, pathname }) => kind === 'bubbles' && pathname.endsWith('/logo-bubbles-proposal-dark.svg'))
      && heldVisible[0].images.every(({ complete, naturalWidth, naturalHeight }) => complete && naturalWidth > 0 && naturalHeight > 0),
    JSON.stringify(heldState));

    await page.evaluate(() => window.__qaLogoBaseDecode.release('dark'));
    await page.waitForFunction(() => window.__qaLogoBaseDecode.state.released.includes('dark'));
    const oneReleasedState = await readLogoState();
    check(`${scenario}: one decoded replacement base cannot hide the complete static logo`, !oneReleasedState.ready
      && oneReleasedState.motionLayers.length === 0
      && oneReleasedState.fallbackVisible
      && oneReleasedState.fallbackRenditions.filter(({ visible }) => visible).length === 1,
    JSON.stringify(oneReleasedState));

    await page.evaluate(() => window.__qaLogoBaseDecode.release('light'));
    await page.waitForFunction(() => document.querySelector('[data-citychat-logo]')?.classList.contains('is-motif-ready'), null, { timeout: 4000 });
    await page.waitForLoadState('load');
    const mountedState = await readLogoState();
    check(`${scenario}: logo mounts safely only after both replacement bases decode`, mountedState.ready
      && mountedState.motifState === 'animating'
      && !mountedState.fallbackVisible
      && mountedState.motionLayers.length === 2
      && mountedState.motionLayers.every(({ rendition, bases }) => bases.length === 1
        && bases.every(({ pathname, rendition: baseRendition, complete, naturalWidth, naturalHeight }) => baseRendition === rendition
          && pathname.endsWith(`/lockup-without-bubbles-${rendition}.png`)
          && complete
          && naturalWidth > 0
          && naturalHeight > 0))
      && mountedState.motionLayers.filter(({ visible }) => visible).length === 1
      && mountedState.motionLayers.some(({ theme, rendition, visible }) => theme === 'light' && rendition === 'dark' && visible),
    JSON.stringify(mountedState));
  } finally {
    if (!page.isClosed()) {
      await page.evaluate(() => {
        window.__qaLogoBaseDecode?.release('dark');
        window.__qaLogoBaseDecode?.release('light');
      }).catch(() => {});
    }
    finishDiagnostics();
    await context.close();
  }
}

async function runMotifMotion(route = routes.th, theme = 'light') {
  const scenario = `${route.label} motif motion ${theme}`;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: theme });
  await seedTheme(context, theme);
  const { page, finishDiagnostics } = await openPage(context, scenario, route);
  try {
    const selectors = [
      '[data-citychat-logo]',
      '[data-citychat-motif="a"]',
      '[data-citychat-motif="b"]',
      '[data-citychat-motif="c"]',
      '[data-citychat-motif="motif"]',
    ];
    await page.evaluate(() => {
      const stage = document.querySelector('[data-citychat-motif="motif"]');
      const fallback = stage?.querySelector('[data-citychat-motif-fallback]');
      window.__citychatConversationFallback = fallback;
      window.__citychatConversationFallbackMarkup = fallback?.innerHTML || '';
    });
    for (const selector of selectors) {
      const stage = page.locator(selector);
      await stage.scrollIntoViewIfNeeded();
      await page.waitForFunction((target) => document.querySelector(target)?.classList.contains('is-motif-ready'), selector, { timeout: 4000 });
      await page.waitForTimeout(80);
    }

    const state = await page.evaluate(({ pageTheme, stageSelectors }) => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
      };
      const records = stageSelectors.map((selector) => {
        const stage = document.querySelector(selector);
        const id = stage?.getAttribute('data-citychat-motif') || 'logo';
        const surface = stage?.getAttribute('data-motif-surface');
        const expectedRendition = surface === 'gradient' ? (pageTheme === 'light' ? 'dark' : 'light') : pageTheme;
        const selected = stage?.querySelector(`.motif-stage__motion--theme-${pageTheme}`);
        const otherTheme = pageTheme === 'light' ? 'dark' : 'light';
        const other = stage?.querySelector(`.motif-stage__motion--theme-${otherTheme}`);
        const svg = selected?.querySelector('svg');
        const markup = svg?.outerHTML.toUpperCase() || '';
        const animations = selected?.getAnimations({ subtree: true }) || [];
        const allAnimations = stage?.getAnimations({ subtree: true }) || [];
        const rect = selected?.getBoundingClientRect();
        const themeLayers = stage ? [...stage.querySelectorAll('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark')] : [];
        const timingLayers = themeLayers.map((layer) => {
          const layerAnimations = layer.getAnimations({ subtree: true });
          return {
            theme: layer.classList.contains('motif-stage__motion--theme-light') ? 'light' : 'dark',
            endTimes: layerAnimations.map((animation) => Number(animation.effect?.getComputedTiming().endTime)),
            iterations: layerAnimations.map((animation) => animation.effect?.getTiming().iterations),
          };
        });
        const logoDotSchedules = id === 'logo' ? themeLayers.map((layer) => ({
          theme: layer.classList.contains('motif-stage__motion--theme-light') ? 'light' : 'dark',
          groups: [...layer.querySelectorAll('.mm-logo')].map((bubble) => (
            [...bubble.querySelectorAll('.mm-dot')].map((dot) => {
              const dotAnimations = dot.getAnimations();
              return {
                declaredStart: Number(dot.dataset.motifStartMs),
                delays: dotAnimations.map((animation) => Number(animation.effect?.getTiming().delay)),
                iterations: dotAnimations.map((animation) => animation.effect?.getTiming().iterations),
              };
            })
          )),
        })) : [];
        return {
          selector,
          id,
          surface,
          expectedRendition,
          ready: stage?.classList.contains('is-motif-ready'),
          selectedVisible: visible(selected),
          otherVisible: visible(other),
          fallbackVisible: visible(stage?.querySelector('[data-citychat-logo-fallback],[data-citychat-motif-fallback]')),
          layerCount: stage?.querySelectorAll('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark').length || 0,
          svgCount: selected?.querySelectorAll('svg').length || 0,
          viewBox: svg?.getAttribute('viewBox') || '',
          ariaHidden: svg?.getAttribute('aria-hidden'),
          ariaLabel: svg?.getAttribute('aria-label'),
          role: svg?.getAttribute('role'),
          textCount: svg?.querySelectorAll('text').length || 0,
          gradientCount: svg?.querySelectorAll('linearGradient,radialGradient').length || 0,
          palette: {
            lightMain: markup.includes('#007A58'),
            lightSecond: markup.includes('#0AD69C'),
            darkMain: markup.includes('#3BD19B'),
            darkSecond: markup.includes('#007E79'),
          },
          animationCount: animations.length,
          totalAnimationCount: allAnimations.length,
          iterations: allAnimations.map((animation) => animation.effect?.getTiming().iterations),
          timingLayers,
          logoDotSchedules,
          width: rect?.width || 0,
          height: rect?.height || 0,
        };
      });
      window.__citychatMotifNodes = stageSelectors.map((selector) => document.querySelector(selector)?.querySelector('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark'));
      return records;
    }, { pageTheme: theme, stageSelectors: selectors });

    check(`${scenario}: all five stages mount inline and replace their static fallback`, state.every((record) => record.ready
      && record.layerCount === 2
      && record.svgCount === 1
      && record.selectedVisible
      && !record.otherVisible
      && !record.fallbackVisible), JSON.stringify(state));
    check(`${scenario}: inline SVGs stay decorative, text-free, and gradient-free`, state.every((record) => record.ariaHidden === 'true'
      && record.ariaLabel === null
      && record.role === null
      && record.textCount === 0
      && record.gradientCount === 0), JSON.stringify(state));
    check(`${scenario}: inline SVGs choose the rendition from actual surface luminance`, state.every((record) => record.expectedRendition === 'light'
      ? record.palette.lightMain && record.palette.lightSecond && !record.palette.darkMain && !record.palette.darkSecond
      : record.palette.darkMain && record.palette.darkSecond && !record.palette.lightMain && !record.palette.lightSecond), JSON.stringify(state));
    check(`${scenario}: animated SVG geometry is proportional and large enough`, state.every((record) => record.viewBox === (record.id === 'logo' ? '0 0 494 106' : '0 0 240 240')
      && record.width >= 119.5
      && (record.id === 'logo' || record.height >= 119.5)), JSON.stringify(state));
    check(`${scenario}: both theme layers advance together with finite one-shot CSS`, state.every((record) => record.animationCount > 0
      && record.totalAnimationCount > record.animationCount
      && record.iterations.every((iterations) => iterations === 1)), JSON.stringify(state));
    const cappedMotifs = state.filter(({ id }) => Object.hasOwn(motifEndCapsMs, id));
    check(`${scenario}: effective motif wall-clock ends stay within the release caps`, cappedMotifs.length === Object.keys(motifEndCapsMs).length
      && cappedMotifs.every(({ id, timingLayers }) => timingLayers.length === 2
        && timingLayers.every(({ endTimes, iterations }) => endTimes.length > 0
          && endTimes.every((endTime) => Number.isFinite(endTime) && endTime > 0 && endTime <= motifEndCapsMs[id])
          && iterations.every((iterations) => iterations === 1))),
    JSON.stringify(cappedMotifs.map(({ id, timingLayers }) => ({ id, cap: motifEndCapsMs[id], timingLayers }))));
    const logoRecord = state.find(({ id }) => id === 'logo');
    check(`${scenario}: logo dots start at the exact two-row schedule and play once`, logoRecord?.logoDotSchedules.length === 2
      && logoRecord.logoDotSchedules.every(({ groups }) => groups.length === logoDotStartsMs.length
        && groups.every((dots, groupIndex) => dots.length === logoDotStartsMs[groupIndex].length
          && dots.every(({ declaredStart, delays, iterations }, dotIndex) => declaredStart === logoDotStartsMs[groupIndex][dotIndex]
            && delays.length === 1
            && delays[0] === logoDotStartsMs[groupIndex][dotIndex]
            && iterations.length === 1
            && iterations[0] === 1))),
    JSON.stringify(logoRecord?.logoDotSchedules));

    const alternateTheme = theme === 'light' ? 'dark' : 'light';
    const switchedWithoutReplay = await page.evaluate(({ nextTheme, stageSelectors }) => {
      document.documentElement.dataset.theme = nextTheme;
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
      };
      return stageSelectors.every((selector, index) => {
        const stage = document.querySelector(selector);
        const firstLayer = stage?.querySelector('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark');
        const selected = stage?.querySelector(`.motif-stage__motion--theme-${nextTheme}`);
        const previous = stage?.querySelector(`.motif-stage__motion--theme-${nextTheme === 'light' ? 'dark' : 'light'}`);
        return firstLayer === window.__citychatMotifNodes[index]
          && visible(selected)
          && !visible(previous)
          && stage?.querySelectorAll('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark').length === 2;
      });
    }, { nextTheme: alternateTheme, stageSelectors: selectors });
    check(`${scenario}: switching theme reveals the pre-advanced rendition without remounting`, switchedWithoutReplay);

    await page.evaluate(() => window.scrollTo(0, 0));
    for (const selector of [...selectors].reverse()) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(30);
    }
    const stableNodes = await page.evaluate((stageSelectors) => stageSelectors.every((selector, index) => {
      if (selector === '[data-citychat-motif="motif"]') return true;
      const current = document.querySelector(selector)?.querySelector('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark');
      return current === window.__citychatMotifNodes[index];
    }), selectors);
    check(`${scenario}: revisiting persistent scenes does not remount or replay motif nodes`, stableNodes);

    await page.waitForFunction(() => {
      const stage = document.querySelector('[data-citychat-motif="motif"]');
      return stage?.dataset.motifState === 'complete'
        && !stage.classList.contains('is-motif-ready')
        && stage.querySelectorAll('.motif-stage__motion').length === 0;
    }, null, { timeout: 3000 });
    const conversationSettlement = await page.evaluate(async () => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
      };
      const signature = (element) => ({
        name: element.localName,
        attributes: [...element.attributes]
          .map((attribute) => [attribute.name, attribute.value])
          .sort(([left], [right]) => left.localeCompare(right)),
        children: [...element.children].map(signature),
      });
      const stage = document.querySelector('[data-citychat-motif="motif"]');
      const fallback = stage?.querySelector('[data-citychat-motif-fallback]');
      const { svg: registeredSvg } = await import(new URL('/assets/citychat-motif-set/motion/citychat-motif-motion.js', location.origin).href);
      const renditions = fallback ? [...fallback.querySelectorAll('[data-motif-rendition]')].map((element) => {
        const rendition = element.dataset.motifRendition;
        const expected = new DOMParser().parseFromString(registeredSvg.motif[rendition] || '', 'image/svg+xml').documentElement;
        const actual = element.querySelector('svg');
        return {
          rendition,
          visible: visible(element),
          registered: Boolean(actual && expected.localName === 'svg'
            && JSON.stringify(signature(actual)) === JSON.stringify(signature(expected))),
        };
      }) : [];
      const theme = document.documentElement.dataset.theme;
      const expectedRendition = theme === 'light' ? 'dark' : 'light';
      return {
        state: stage?.dataset.motifState,
        ready: stage?.classList.contains('is-motif-ready'),
        fallbackVisible: visible(fallback),
        sameNode: fallback === window.__citychatConversationFallback,
        sameMarkup: fallback?.innerHTML === window.__citychatConversationFallbackMarkup,
        motionLayers: stage?.querySelectorAll('.motif-stage__motion').length || 0,
        runningAnimations: stage?.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length || 0,
        expectedRendition,
        renditions,
      };
    });
    check(`${scenario}: ConversationMotif static fallbacks exactly match both registered renditions`, conversationSettlement.renditions.length === 2
      && ['dark', 'light'].every((rendition) => conversationSettlement.renditions.some((record) => record.rendition === rendition && record.registered)),
    JSON.stringify(conversationSettlement));
    check(`${scenario}: ConversationMotif settles to its unchanged exact fallback after playing`, state.some(({ id, ready, animationCount }) => id === 'motif' && ready && animationCount > 0)
      && conversationSettlement.state === 'complete'
      && !conversationSettlement.ready
      && conversationSettlement.fallbackVisible
      && conversationSettlement.sameNode
      && conversationSettlement.sameMarkup
      && conversationSettlement.motionLayers === 0
      && conversationSettlement.runningAnimations === 0
      && conversationSettlement.renditions.filter(({ visible }) => visible).length === 1
      && conversationSettlement.renditions.some(({ rendition, visible }) => rendition === conversationSettlement.expectedRendition && visible),
    JSON.stringify(conversationSettlement));
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runReducedMotion(route = routes.th) {
  const scenario = route.id === 'th' ? 'reduced motion' : `${route.label} reduced motion`;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const { page, finishDiagnostics } = await openPage(context, scenario, route);
  try {
    const state = await page.evaluate(() => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
      };
      const approaches = [...document.querySelectorAll('[data-approach]')].map((element) => {
        const style = getComputedStyle(element);
        return { opacity: style.opacity, transform: style.transform, transition: style.transitionDuration };
      });
      const sweep = document.querySelector('[data-cc-nav] [data-part="sweep"]');
      return {
        lang: document.documentElement.lang,
        ariaLabels: [...document.querySelectorAll('[aria-label]')]
          .filter((element) => !element.matches('a[hreflang="th"]'))
          .map((element) => element.getAttribute('aria-label')),
        approaches,
        motifs: [...document.querySelectorAll('[data-citychat-logo],[data-citychat-motif]')].map((element) => ({
          id: element.getAttribute('data-citychat-motif') || 'logo',
          fallbackVisible: visible(element.querySelector('[data-citychat-logo-fallback],[data-citychat-motif-fallback]')),
          visibleMotion: [...element.querySelectorAll('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark')].filter(visible).length,
          runningAnimations: element.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length,
        })),
        sweepAnimation: sweep ? getComputedStyle(sweep).animationName : '',
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
        video: (() => {
          const element = document.querySelector('[data-cc-video]');
          return element ? { autoplay: element.autoplay, autoplayAttribute: element.hasAttribute('autoplay'), loop: element.loop, paused: element.paused } : null;
        })(),
      };
    });
    check(`${scenario}: document language remains exact`, state.lang === route.lang, state.lang);
    if (route.id === 'en') {
      check(`${scenario}: reduced-motion English UI keeps localized ARIA`, state.ariaLabels.every((label) => !/[฀-๿]/u.test(label)), JSON.stringify(state.ariaLabels.filter((label) => /[฀-๿]/u.test(label))));
    }
    check(`${scenario}: approach targets remain fully landed`, state.approaches.every((item) => item.opacity === '1' && item.transform === 'none' && item.transition.split(',').every((value) => value.trim() === '0s')), JSON.stringify(state.approaches.filter((item) => item.opacity !== '1' || item.transform !== 'none' || !item.transition.split(',').every((value) => value.trim() === '0s')).slice(0, 4)));
    check(`${scenario}: all motifs and the approved opening logo remain static fallbacks`, state.motifs.length === 5
      && state.motifs.every(({ fallbackVisible, visibleMotion, runningAnimations }) => fallbackVisible && visibleMotion === 0 && runningAnimations === 0), JSON.stringify(state.motifs));
    check(`${scenario}: decorative sweep animation is disabled`, state.sweepAnimation === 'none', state.sweepAnimation);
    check(`${scenario}: smooth scrolling is disabled`, state.scrollBehavior === 'auto', state.scrollBehavior);
    check(`${scenario}: CityScan loop is paused and autoplay is removed`, state.video && !state.video.autoplay && !state.video.autoplayAttribute && state.video.loop && state.video.paused, JSON.stringify(state.video));
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runNoJavaScript(route = routes.th) {
  const scenario = route.id === 'th' ? 'no JavaScript' : `${route.label} no JavaScript`;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', javaScriptEnabled: false });
  const { page, finishDiagnostics } = await openPage(context, scenario, route);
  try {
    const state = await page.evaluate(() => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const approaches = [...document.querySelectorAll('[data-approach]')].map((element) => {
        const style = getComputedStyle(element);
        return { opacity: style.opacity, transform: style.transform };
      });
      const fallbackDownload = document.querySelector('[data-video-fallback] a[download]');
      return {
        lang: document.documentElement.lang,
        ariaLabels: [...document.querySelectorAll('[aria-label]')]
          .filter((element) => !element.matches('a[hreflang="th"]'))
          .map((element) => element.getAttribute('aria-label')),
        hasJs: document.documentElement.classList.contains('has-js'),
        regions: ['main-content', 'offer', 'partners', 'product', 'loop', 'record', 'contact'].every((id) => visible(document.getElementById(id))),
        approaches,
        motifs: [...document.querySelectorAll('[data-citychat-logo],[data-citychat-motif]')].map((element) => ({
          id: element.getAttribute('data-citychat-motif') || 'logo',
          fallbackVisible: visible(element.querySelector('[data-citychat-logo-fallback],[data-citychat-motif-fallback]')),
          motionLayers: element.querySelectorAll('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark').length,
        })),
        menuVisible: visible(document.querySelector('#menu-toggle')),
        tablistVisible: visible(document.querySelector('[role="tablist"]')),
        defaultPanelVisible: visible(document.querySelector('#panel-data')),
        fallbackVisible: visible(document.querySelector('[data-video-fallback]')),
        fallbackHref: fallbackDownload?.getAttribute('href') || '',
        fallbackPathname: fallbackDownload ? new URL(fallbackDownload.href).pathname : '',
        videoVisible: visible(document.querySelector('[data-cc-video]')),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      };
    });
    check(`${scenario}: static document language is exact`, state.lang === route.lang, state.lang);
    check(`${scenario}: initial markup stays readable`, !state.hasJs && state.regions && state.approaches.every((item) => item.opacity === '1' && item.transform === 'none'));
    check(`${scenario}: no-JS preserves all five registered static motif/logo outcomes`, state.motifs.length === 5
      && state.motifs.every(({ fallbackVisible, motionLayers }) => fallbackVisible && motionLayers === 0), JSON.stringify(state.motifs));
    check(`${scenario}: inert menu and tab controls are hidden while default content remains available`, !state.menuVisible && !state.tablistVisible && state.defaultPanelVisible, JSON.stringify(state));
    check(`${scenario}: video area has a deterministic route-correct fallback`, state.fallbackVisible
      && !state.videoVisible
      && state.fallbackHref === route.videoHref
      && state.fallbackPathname === `/${config.media.cityscan.path}`,
    JSON.stringify(state));
    if (route.id === 'en') {
      check(`${scenario}: static English UI exposes localized ARIA`, state.ariaLabels.every((label) => !/[฀-๿]/u.test(label)), JSON.stringify(state.ariaLabels.filter((label) => /[฀-๿]/u.test(label))));
    }
    check(`${scenario}: page has no horizontal overflow`, state.overflow <= 1, `${state.overflow}px`);
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runPrintFallback(route = routes.th, preference = 'light') {
  const scenario = `${route.label} saved-${preference} print fallback`;
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: preference });
  await seedTheme(context, preference);
  const { page, finishDiagnostics } = await openPage(context, scenario, route);
  try {
    const selectors = [
      '[data-citychat-logo]',
      '[data-citychat-motif="a"]',
      '[data-citychat-motif="b"]',
      '[data-citychat-motif="c"]',
      '[data-citychat-motif="motif"]',
    ];
    for (const selector of selectors) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForFunction((target) => document.querySelector(target)?.classList.contains('is-motif-ready'), selector, { timeout: 4000 });
    }
    await page.emulateMedia({ media: 'print', colorScheme: preference, reducedMotion: 'no-preference' });
    const state = await page.evaluate(() => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
      };
      return {
        lang: document.documentElement.lang,
        theme: document.documentElement.dataset.theme,
        preference: document.documentElement.dataset.themePreference,
        stages: [...document.querySelectorAll('[data-citychat-logo],[data-citychat-motif]')].map((element) => {
          const fallback = element.querySelector('[data-citychat-logo-fallback],[data-citychat-motif-fallback]');
          const fallbackRenditions = fallback ? [...fallback.querySelectorAll('[data-motif-rendition]')].map((rendition) => ({
            rendition: rendition.dataset.motifRendition,
            visible: visible(rendition),
          })) : [];
          const motionLayers = [...element.querySelectorAll('.motif-stage__motion--theme-light,.motif-stage__motion--theme-dark')].map((layer) => ({
            rendition: layer.dataset.motifRendition,
            display: getComputedStyle(layer).display,
            visible: visible(layer),
          }));
          return {
            id: element.getAttribute('data-citychat-motif') || 'logo',
            fallbackVisible: visible(fallback),
            fallbackRenditions,
            motionLayers,
            runningAnimations: element.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length,
          };
        }),
      };
    });
    check(`${scenario}: saved theme remains route-correct while print is active`, state.lang === route.lang
      && state.theme === preference
      && state.preference === preference, JSON.stringify(state));
    check(`${scenario}: every fallback forces exactly the light registered rendition`, state.stages.length === 5
      && state.stages.every(({ fallbackVisible, fallbackRenditions }) => fallbackVisible
        && fallbackRenditions.length === 2
        && ['dark', 'light'].every((rendition) => fallbackRenditions.some((record) => record.rendition === rendition))
        && fallbackRenditions.filter(({ visible }) => visible).length === 1
        && fallbackRenditions.some(({ rendition, visible }) => rendition === 'light' && visible)),
    JSON.stringify(state.stages));
    const mountedMotionLayers = state.stages.flatMap(({ motionLayers }) => motionLayers);
    check(`${scenario}: print suppresses mounted runtime layers even when they carry rendition data`, mountedMotionLayers.length >= 8
      && mountedMotionLayers.every(({ display, visible }) => display === 'none' && !visible)
      && state.stages.every(({ runningAnimations }) => runningAnimations === 0),
    JSON.stringify(state.stages));
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runStorageDenied(route = routes.th) {
  const scenario = 'storage denied';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  await context.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'getItem', { configurable: true, value() { throw new DOMException('Denied', 'SecurityError'); } });
    Object.defineProperty(Storage.prototype, 'setItem', { configurable: true, value() { throw new DOMException('Denied', 'SecurityError'); } });
  });
  const { page, finishDiagnostics } = await openPage(context, scenario, route);
  try {
    check(`${scenario}: initial theme still follows the dark system`, await page.locator('html').getAttribute('data-theme') === 'dark' && await page.locator('html').getAttribute('data-theme-preference') === 'system');
    await page.locator('#menu-toggle').click();
    await page.locator('#theme-cycle').click();
    check(`${scenario}: theme control still works without persistence`, await page.locator('html').getAttribute('data-theme-preference') === 'light' && await page.locator('html').getAttribute('data-theme') === 'light');
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

try {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    throw new Error(`Playwright is required for rendered checks. Install the pinned CI version first. ${error.message}`);
  }
  const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    || (existsSync(macChrome) ? macChrome : undefined);
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });

  await runInteractions();
  await runInteractions(routes.en);

  const matrix = [
    { name: 'desktop light', viewport: { width: 1440, height: 1000 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: true },
    { name: 'desktop dark', viewport: { width: 1440, height: 1000 }, preference: 'dark', expectedTheme: 'dark', colorScheme: 'light', desktop: true },
    { name: 'desktop 1280', viewport: { width: 1280, height: 800 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: true },
    { name: 'desktop 1080', viewport: { width: 1080, height: 800 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: true },
    { name: 'breakpoint 900', viewport: { width: 900, height: 900 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: false },
    { name: 'tablet light', viewport: { width: 768, height: 1024 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: false },
    { name: 'compact 600', viewport: { width: 600, height: 900 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: false },
    { name: 'mobile light', viewport: { width: 390, height: 844 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: false },
    { name: 'mobile 320', viewport: { width: 320, height: 700 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: false },
    { name: 'short landscape', viewport: { width: 900, height: 600 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: false },
  ];
  for (const scenario of matrix) await runMatrixScenario(scenario);
  await runSystemDark();
  await runMotifMotion(routes.th, 'light');
  await runMotifMotion(routes.th, 'dark');
  await runDelayedLogoBases();
  await runReducedMotion();
  await runNoJavaScript();
  await runPrintFallback(routes.th, 'light');
  await runPrintFallback(routes.th, 'dark');

  await runMatrixScenario({
    name: 'English desktop light',
    viewport: { width: 1440, height: 1000 },
    preference: 'light',
    expectedTheme: 'light',
    colorScheme: 'light',
    desktop: true,
    route: routes.en,
    probeAssets: true,
  });
  await runSystemDark(routes.en);
  await runMotifMotion(routes.en, 'light');
  await runDelayedLogoBases(routes.en);
  await runReducedMotion(routes.en);
  await runNoJavaScript(routes.en);
  await runPrintFallback(routes.en, 'light');
  await runPrintFallback(routes.en, 'dark');
  await runStorageDenied();
} catch (error) {
  failures.push(`rendered test harness — ${error.stack || error.message}`);
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length > 0) {
  console.error(`CityChat rendered validation failed (${failures.length}/${checks} assertions):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`CityChat rendered validation passed (${checks} assertions across ${browserScenarios} browser scenarios).`);
}
