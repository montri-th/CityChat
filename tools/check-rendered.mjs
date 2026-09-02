import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsRoot = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolsRoot, '..');
const deploymentRoot = path.join(repositoryRoot, 'deployment');
const requiredSections = ['main-content', 'offer', 'partners', 'product', 'loop', 'record', 'contact'];
const failures = [];
let checks = 0;

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
  const relativePath = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
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
    if (pathname === '/assets/cityscan-demo.mp4' && errorText === 'net::ERR_ABORTED') return;
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

async function openPage(context, scenario) {
  const page = await context.newPage();
  const finishDiagnostics = attachDiagnostics(page, scenario);
  const response = await page.goto(`${origin}/`, { waitUntil: 'load' });
  check(`${scenario}: entry returns HTTP 200`, response?.status() === 200, `status ${response?.status()}`);
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(120);
  return { page, finishDiagnostics };
}

async function assertCommonLayout(page, scenario, expectedTheme, desktop) {
  const state = await page.evaluate(({ ids, expectedTheme: theme }) => {
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
        thaiBody: document.fonts.check('16px "Bai Jamjuree"', 'ทดสอบ'),
        thaiDisplay: document.fonts.check('32px "IBM Plex Sans Thai Looped"', 'เมือง'),
        latinDisplay: document.fonts.check('23px Arvo', 'Landometer'),
        icons: document.fonts.check('22px "Material Symbols Rounded"', 'menu'),
      },
      themeOnlyWrong: [...document.querySelectorAll(theme === 'light' ? '.theme-only-dark' : '.theme-only-light')].filter(visible).length,
      themeOnlyRight: [...document.querySelectorAll(theme === 'light' ? '.theme-only-light' : '.theme-only-dark')].filter(visible).length,
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
      video: video ? {
        autoplay: video.autoplay,
        autoplayAttribute: video.hasAttribute('autoplay'),
        loop: video.loop,
        muted: video.muted,
        defaultMuted: video.defaultMuted,
        playsInline: video.playsInline,
        controls: video.controls,
      } : null,
      rail: railRect ? { visible: visible(rail), center: railRect.top + railRect.height / 2, viewportCenter: innerHeight / 2 } : null,
      nonLazyImages,
    };
  }, { ids: requiredSections, expectedTheme });

  check(`${scenario}: Thai document and one H1 render`, state.lang === 'th' && state.h1Count === 1);
  check(`${scenario}: expected theme resolves`, state.theme === expectedTheme, `received ${state.theme}`);
  check(`${scenario}: required landing regions have layout boxes`, state.sections.every((item) => item.visible), state.sections.filter((item) => !item.visible).map((item) => item.id).join(', '));
  check(`${scenario}: no horizontal page overflow`, state.overflow <= 1, `${state.overflow}px`);
  check(`${scenario}: local body/display/icon fonts load`, state.fonts.thaiBody && state.fonts.thaiDisplay && state.fonts.latinDisplay && state.fonts.icons, JSON.stringify(state.fonts));
  check(`${scenario}: computed body and H1 use intended local families`, state.fonts.body.includes('Bai Jamjuree') && state.fonts.h1.includes('IBM Plex Sans Thai Looped'), `${state.fonts.body} / ${state.fonts.h1}`);
  check(`${scenario}: theme-specific artwork is correct`, state.themeOnlyWrong === 0 && state.themeOnlyRight > 0, `wrong ${state.themeOnlyWrong}, right ${state.themeOnlyRight}`);
  check(`${scenario}: non-lazy images decode`, state.nonLazyImages.every((image) => image.complete && image.naturalWidth > 0), JSON.stringify(state.nonLazyImages.filter((image) => !image.complete || image.naturalWidth <= 0)));

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
  check(`${scenario}: tested interactive targets are at least 44px tall`, state.controls.every((control) => control.height >= 43.5), JSON.stringify(state.controls.filter((control) => control.height < 43.5)));
  check(`${scenario}: visible icon ligatures use the local icon face without text-width leakage`, state.icons.length > 0 && state.icons.every((icon) => icon.family.includes('Material Symbols Rounded') && icon.width <= 48), JSON.stringify(state.icons.filter((icon) => !icon.family.includes('Material Symbols Rounded') || icon.width > 48)));

  if (desktop) {
    check(`${scenario}: desktop bookmark rail is visible and vertically centred`, state.rail?.visible && Math.abs(state.rail.center - state.rail.viewportCenter) <= 2, JSON.stringify(state.rail));
  } else {
    check(`${scenario}: compact layouts hide the desktop bookmark rail`, !state.rail?.visible, JSON.stringify(state.rail));
  }
}

async function runMatrixScenario({ name, viewport, preference, expectedTheme, colorScheme, desktop }) {
  const context = await browser.newContext({ viewport, colorScheme });
  await seedTheme(context, preference);
  const { page, finishDiagnostics } = await openPage(context, name);
  try {
    await assertCommonLayout(page, name, expectedTheme, desktop);
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runInteractions() {
  const scenario = 'desktop interactions';
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const { page, finishDiagnostics } = await openPage(context, scenario);
  try {
    const menuButton = page.locator('#menu-toggle');
    await menuButton.click();
    check(`${scenario}: menu opens with overlay and moves focus inside`, await page.locator('#site-menu').isVisible() && await page.locator('#menu-overlay').isVisible() && await menuButton.getAttribute('aria-expanded') === 'true' && await page.locator('#theme-cycle').evaluate((element) => document.activeElement === element));
    await page.keyboard.press('Escape');
    check(`${scenario}: Escape closes menu and returns focus`, !(await page.locator('#site-menu').isVisible()) && await menuButton.getAttribute('aria-expanded') === 'false' && await menuButton.evaluate((element) => document.activeElement === element));
    await menuButton.click();
    await page.locator('#menu-overlay').click({ position: { x: 2, y: 2 } });
    check(`${scenario}: overlay closes menu`, !(await page.locator('#site-menu').isVisible()));

    await menuButton.click();
    await page.locator('#theme-cycle').click();
    check(`${scenario}: theme cycle selects and persists light`, await page.locator('html').getAttribute('data-theme-preference') === 'light' && await page.evaluate(() => localStorage.getItem('lds-theme')) === 'light');
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
      videoOutcome = await page.evaluate(() => {
        const element = document.querySelector('[data-cc-video]');
        const fallback = document.querySelector('[data-video-fallback]');
        const fallbackVisible = Boolean(fallback && !fallback.hidden && getComputedStyle(fallback).display !== 'none');
        if (element && !element.hidden && !element.paused && element.currentTime > 0) return { kind: 'playing', firstTime: element.currentTime };
        return {
          kind: 'fallback',
          valid: Boolean(element?.hidden && fallbackVisible && (element.error || element.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) && fallback?.querySelector('a[download]')?.getAttribute('href') === './assets/cityscan-demo.mp4'),
          errorCode: element?.error?.code || 0,
          networkState: element?.networkState,
        };
      });
      if (videoOutcome.kind === 'playing') {
        await page.waitForTimeout(350);
        const secondTime = await page.locator('[data-cc-video]').evaluate((element) => element.currentTime);
        videoOutcome.advances = secondTime > videoOutcome.firstTime;
      }
    } catch { /* Report through the assertion below. */ }
    check(`${scenario}: CityScan autoplays when supported or exposes its deterministic fallback`, (videoOutcome.kind === 'playing' && videoOutcome.advances) || (videoOutcome.kind === 'fallback' && videoOutcome.valid), JSON.stringify(videoOutcome));

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

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => document.querySelector('[data-cc-nav]')?.dataset.calm === 'off');
    await page.waitForTimeout(650);
    const expandedHeight = await page.locator('[data-cc-nav] [data-part="bar"]').evaluate((element) => element.getBoundingClientRect().height);
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForFunction(() => document.querySelector('[data-cc-nav]')?.dataset.calm === 'on');
    await page.waitForTimeout(650);
    const calmHeight = await page.locator('[data-cc-nav] [data-part="bar"]').evaluate((element) => element.getBoundingClientRect().height);
    await page.locator('[data-cc-nav]').hover();
    await page.waitForFunction(() => document.querySelector('[data-cc-nav]')?.dataset.calm === 'off');
    await page.waitForTimeout(650);
    const restoredHeight = await page.locator('[data-cc-nav] [data-part="bar"]').evaluate((element) => element.getBoundingClientRect().height);
    check(`${scenario}: calm nav compresses and hover restores it`, expandedHeight >= 75 && calmHeight <= 30 && restoredHeight >= 75, `${expandedHeight}/${calmHeight}/${restoredHeight}`);
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runSystemDark() {
  const scenario = 'system dark';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const { page, finishDiagnostics } = await openPage(context, scenario);
  try {
    check(`${scenario}: system preference resolves dark without saved state`, await page.locator('html').getAttribute('data-theme-preference') === 'system' && await page.locator('html').getAttribute('data-theme') === 'dark');
    await assertCommonLayout(page, scenario, 'dark', false);
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runReducedMotion() {
  const scenario = 'reduced motion';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const { page, finishDiagnostics } = await openPage(context, scenario);
  try {
    const state = await page.evaluate(() => {
      const approaches = [...document.querySelectorAll('[data-approach]')].map((element) => {
        const style = getComputedStyle(element);
        return { opacity: style.opacity, transform: style.transform, transition: style.transitionDuration };
      });
      const sweep = document.querySelector('[data-cc-nav] [data-part="sweep"]');
      return {
        approaches,
        sweepAnimation: sweep ? getComputedStyle(sweep).animationName : '',
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
        video: (() => {
          const element = document.querySelector('[data-cc-video]');
          return element ? { autoplay: element.autoplay, autoplayAttribute: element.hasAttribute('autoplay'), loop: element.loop, paused: element.paused } : null;
        })(),
      };
    });
    check(`${scenario}: approach targets remain fully landed`, state.approaches.every((item) => item.opacity === '1' && item.transform === 'none' && item.transition.split(',').every((value) => value.trim() === '0s')), JSON.stringify(state.approaches.filter((item) => item.opacity !== '1' || item.transform !== 'none' || !item.transition.split(',').every((value) => value.trim() === '0s')).slice(0, 4)));
    check(`${scenario}: decorative sweep animation is disabled`, state.sweepAnimation === 'none', state.sweepAnimation);
    check(`${scenario}: smooth scrolling is disabled`, state.scrollBehavior === 'auto', state.scrollBehavior);
    check(`${scenario}: CityScan loop is paused and autoplay is removed`, state.video && !state.video.autoplay && !state.video.autoplayAttribute && state.video.loop && state.video.paused, JSON.stringify(state.video));
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runNoJavaScript() {
  const scenario = 'no JavaScript';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', javaScriptEnabled: false });
  const { page, finishDiagnostics } = await openPage(context, scenario);
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
      return {
        hasJs: document.documentElement.classList.contains('has-js'),
        regions: ['main-content', 'offer', 'partners', 'product', 'loop', 'record', 'contact'].every((id) => visible(document.getElementById(id))),
        approaches,
        menuVisible: visible(document.querySelector('#menu-toggle')),
        tablistVisible: visible(document.querySelector('[role="tablist"]')),
        defaultPanelVisible: visible(document.querySelector('#panel-data')),
        fallbackVisible: visible(document.querySelector('[data-video-fallback]')),
        videoVisible: visible(document.querySelector('[data-cc-video]')),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      };
    });
    check(`${scenario}: initial markup stays readable`, !state.hasJs && state.regions && state.approaches.every((item) => item.opacity === '1' && item.transform === 'none'));
    check(`${scenario}: inert menu and tab controls are hidden while default content remains available`, !state.menuVisible && !state.tablistVisible && state.defaultPanelVisible, JSON.stringify(state));
    check(`${scenario}: video area has a deterministic fallback`, state.fallbackVisible && !state.videoVisible, JSON.stringify(state));
    check(`${scenario}: page has no horizontal overflow`, state.overflow <= 1, `${state.overflow}px`);
  } finally {
    finishDiagnostics();
    await context.close();
  }
}

async function runStorageDenied() {
  const scenario = 'storage denied';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  await context.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'getItem', { configurable: true, value() { throw new DOMException('Denied', 'SecurityError'); } });
    Object.defineProperty(Storage.prototype, 'setItem', { configurable: true, value() { throw new DOMException('Denied', 'SecurityError'); } });
  });
  const { page, finishDiagnostics } = await openPage(context, scenario);
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

  const matrix = [
    { name: 'desktop light', viewport: { width: 1440, height: 1000 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: true },
    { name: 'desktop dark', viewport: { width: 1440, height: 1000 }, preference: 'dark', expectedTheme: 'dark', colorScheme: 'light', desktop: true },
    { name: 'tablet light', viewport: { width: 768, height: 1024 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: false },
    { name: 'mobile light', viewport: { width: 390, height: 844 }, preference: 'light', expectedTheme: 'light', colorScheme: 'light', desktop: false },
  ];
  for (const scenario of matrix) await runMatrixScenario(scenario);
  await runInteractions();
  await runSystemDark();
  await runReducedMotion();
  await runNoJavaScript();
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
  console.log(`CityChat rendered validation passed (${checks} assertions across 9 browser scenarios).`);
}
