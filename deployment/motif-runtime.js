import { svg } from './assets/citychat-motif-set/motion/citychat-motif-motion.js';

const root = document.documentElement;
const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
const motifIds = new Set(['motif', 'a', 'b', 'c']);
const stages = [...document.querySelectorAll('[data-citychat-motif], [data-citychat-logo]')];

const setAnimationTiming = (element, { delay, duration }) => {
  if (delay) element.style.animationDelay = delay;
  if (duration) element.style.animationDuration = duration;
};

const directMatches = (element, selector) => (
  [...element.children].filter((child) => child.matches(selector))
);

const applyMotionTiming = (inlineSvg, motifId) => {
  if (motifId === 'logo') {
    const dotStarts = [
      [380, 500, 620],
      [530, 650, 770]
    ];

    inlineSvg.querySelectorAll('.mm-logo').forEach((bubble, bubbleIndex) => {
      bubble.querySelectorAll('.mm-dot').forEach((dot, dotIndex) => {
        const start = dotStarts[bubbleIndex]?.[dotIndex];
        if (start === undefined) return;
        dot.style.animationDelay = `${start}ms`;
        dot.dataset.motifStartMs = String(start);
      });
    });
    return;
  }

  if (motifId === 'motif') {
    inlineSvg.querySelectorAll('.mm-talk-l').forEach((element) => {
      setAnimationTiming(element, { duration: '520ms, 750ms' });
    });
    return;
  }

  if (motifId === 'a') {
    inlineSvg.querySelectorAll('.mm-peek').forEach((element) => {
      setAnimationTiming(element, { duration: '760ms, 400ms' });
      element.querySelectorAll('.mm-eye').forEach((eye) => {
        setAnimationTiming(eye, { delay: '1580ms' });
      });
    });
    return;
  }

  if (motifId === 'b') {
    inlineSvg.querySelectorAll('.mm-spin-2 .mm-pop').forEach((element) => {
      setAnimationTiming(element, { delay: '1980ms' });
    });
    directMatches(inlineSvg, '.mm-ripple, .mm-pop').forEach((element) => {
      setAnimationTiming(element, { delay: '1980ms', duration: '420ms' });
    });
    return;
  }

  if (motifId === 'c') {
    inlineSvg.querySelectorAll('.mm-grow').forEach((element) => {
      setAnimationTiming(element, { duration: '920ms, 450ms' });
      element.querySelectorAll('.mm-eye').forEach((eye) => {
        setAnimationTiming(eye, { delay: '1580ms' });
      });
    });
    directMatches(inlineSvg, '.mm-ripple').forEach((element) => {
      setAnimationTiming(element, { duration: '600ms' });
    });
  }
};

const renditionFor = (stage, pageTheme) => {
  const surface = stage.dataset.motifSurface;
  if (surface === 'foundation') return pageTheme;
  if (surface === 'citychat-product') return pageTheme === 'light' ? 'dark' : 'light';
  throw new Error(`Unknown CityChat motif surface: ${surface || 'missing'}`);
};

const prepareSvg = (markup, motifId) => {
  const holder = document.createElement('span');
  holder.className = 'motif-stage__svg';
  holder.innerHTML = markup;
  const inlineSvg = holder.querySelector(':scope > svg');
  if (!inlineSvg) throw new Error('CityChat motif SVG could not be prepared.');
  inlineSvg.removeAttribute('role');
  inlineSvg.removeAttribute('aria-label');
  inlineSvg.setAttribute('aria-hidden', 'true');
  inlineSvg.setAttribute('focusable', 'false');
  applyMotionTiming(inlineSvg, motifId);
  return holder;
};

const buildThemeLayer = (stage, pageTheme, motifId) => {
  const rendition = renditionFor(stage, pageTheme);
  const layer = document.createElement('span');
  layer.className = `motif-stage__motion motif-stage__motion--theme-${pageTheme}`;
  layer.dataset.motifRendition = rendition;

  if (stage.hasAttribute('data-citychat-logo')) {
    const base = document.createElement('img');
    base.className = 'citychat-logo-stage__base';
    base.src = new URL(`./assets/citychat-motif-set/assets/lockup-without-bubbles-${rendition}.png`, import.meta.url).href;
    base.alt = '';
    base.width = 494;
    base.height = 106;
    base.decoding = 'async';
    base.dataset.motifBaseRendition = rendition;
    layer.append(base, prepareSvg(svg.logo[rendition], 'logo'));
  } else {
    layer.append(prepareSvg(svg[motifId][rendition], motifId));
  }

  return layer;
};

const decodeImage = async (image) => {
  if (typeof image.decode === 'function') {
    await image.decode();
  } else if (!image.complete) {
    await new Promise((resolve, reject) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', reject, { once: true });
    });
  }

  if (!image.complete || image.naturalWidth <= 0) {
    throw new Error(`CityChat logo base could not be decoded: ${image.src}`);
  }
};

const settleConversationMotif = (stage, layers) => {
  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    layers.forEach((layer) => layer.remove());
    stage.classList.remove('is-motif-ready');
    stage.dataset.motifState = 'complete';
  };

  const animations = layers.flatMap((layer) => layer.getAnimations({ subtree: true }));
  if (animations.length) {
    Promise.allSettled(animations.map((animation) => animation.finished)).then(settle);
  }

  window.setTimeout(settle, 1800);
};

const mount = async (stage) => {
  const motifId = stage.dataset.citychatMotif;
  if (!stage.hasAttribute('data-citychat-logo') && !motifIds.has(motifId)) return;

  try {
    const layers = [
      buildThemeLayer(stage, 'light', motifId),
      buildThemeLayer(stage, 'dark', motifId)
    ];

    if (stage.hasAttribute('data-citychat-logo')) {
      await Promise.all(layers.map((layer) => decodeImage(layer.querySelector('img'))));
    }

    if (motionPreference?.matches || stage.classList.contains('is-motif-suppressed')) return;

    const fragment = document.createDocumentFragment();
    fragment.append(...layers);
    stage.append(fragment);
    stage.classList.add('is-motif-ready');
    stage.dataset.motifState = 'animating';

    if (motifId === 'motif') settleConversationMotif(stage, layers);
  } catch (_) {
    stage.querySelectorAll('.motif-stage__motion').forEach((layer) => layer.remove());
    stage.classList.remove('is-motif-ready');
    stage.dataset.motifState = 'fallback';
  }
};

let observer = null;

if (stages.length && !motionPreference?.matches && 'IntersectionObserver' in window) {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.14) return;
      observer.unobserve(entry.target);
      mount(entry.target);
    });
  }, { threshold: 0.14 });

  stages.forEach((stage) => observer.observe(stage));
}

motionPreference?.addEventListener?.('change', (event) => {
  if (!event.matches) return;
  observer?.disconnect();
  stages.forEach((stage) => stage.classList.add('is-motif-suppressed'));
});

root.classList.add('citychat-motif-runtime-checked');
