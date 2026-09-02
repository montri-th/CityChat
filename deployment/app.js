(() => {
  'use strict';

  const root = document.documentElement;
  const nav = document.querySelector('[data-cc-nav]');
  const menuButton = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#site-menu');
  const menuOverlay = document.querySelector('#menu-overlay');
  const themeButton = document.querySelector('#theme-cycle');
  const themeMetas = [...document.querySelectorAll('meta[name="theme-color"]')];
  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)');
  const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const themeOrder = ['system', 'light', 'dark'];
  const railIds = ['offer', 'partners', 'product', 'loop', 'record', 'contact'];
  let themePreference = themeOrder.includes(root.dataset.themePreference) ? root.dataset.themePreference : 'system';
  let menuOpen = false;

  const resolvedTheme = (preference) => {
    if (preference === 'system') return systemTheme?.matches ? 'dark' : 'light';
    return preference;
  };

  const updateThemeButton = () => {
    if (!themeButton) return;
    const resolved = resolvedTheme(themePreference);
    const labels = {
      system: 'ธีม: ตามระบบ — สลับเป็นสว่าง',
      light: 'ธีม: สว่าง — สลับเป็นมืด',
      dark: 'ธีม: มืด — สลับเป็นตามระบบ'
    };
    const label = labels[themePreference];
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
    const icon = themeButton.querySelector('.ls-icon');
    if (icon) icon.textContent = resolved === 'dark' ? 'light_mode' : 'dark_mode';
  };

  const syncThemeColor = () => {
    if (!themeMetas.length) return;
    const canvas = getComputedStyle(root).getPropertyValue('--surface-canvas').trim();
    if (canvas) themeMetas.forEach((meta) => { meta.content = canvas; });
  };

  const applyTheme = (preference, persist = false) => {
    themePreference = themeOrder.includes(preference) ? preference : 'system';
    const resolved = resolvedTheme(themePreference);
    root.dataset.themePreference = themePreference;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
    if (persist) {
      try { localStorage.setItem('lds-theme', themePreference); } catch (_) { /* Storage may be unavailable. */ }
    }
    updateThemeButton();
    syncThemeColor();
  };

  const setMenu = (open, returnFocus = false) => {
    if (!menuButton || !menu || !menuOverlay) return;
    menuOpen = open;
    menu.hidden = !open;
    menuOverlay.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
    const icon = menuButton.querySelector('.ls-icon');
    if (icon) icon.textContent = open ? 'close' : 'menu';
    if (open) {
      nav.dataset.calm = 'off';
      themeButton?.focus();
    } else if (returnFocus) {
      menuButton.focus();
    }
  };

  menuButton?.addEventListener('click', () => setMenu(!menuOpen));
  menuOverlay?.addEventListener('click', () => setMenu(false, true));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) setMenu(false, true);
  });

  themeButton?.addEventListener('click', () => {
    const next = themeOrder[(themeOrder.indexOf(themePreference) + 1) % themeOrder.length];
    applyTheme(next, true);
  });
  systemTheme?.addEventListener?.('change', () => {
    if (themePreference === 'system') applyTheme('system');
  });
  applyTheme(themePreference);

  let lastY = window.scrollY;
  const updateCalmNav = () => {
    if (!nav) return;
    const y = window.scrollY;
    const delta = y - lastY;
    lastY = y;
    if (y < 24 || menuOpen) nav.dataset.calm = 'off';
    else if (delta > 4) nav.dataset.calm = 'on';
    else if (delta < -4) nav.dataset.calm = 'off';
  };
  window.addEventListener('scroll', updateCalmNav, { passive: true });
  nav?.addEventListener('mouseenter', () => { nav.dataset.calm = 'off'; });
  nav?.addEventListener('focusin', () => { nav.dataset.calm = 'off'; });

  const railLinks = [...document.querySelectorAll('[data-cc-rail] [data-part="raillink"]')];
  const setCurrentRailLink = (id) => {
    railLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  if ('IntersectionObserver' in window) {
    const seen = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      let current = '';
      let bestRatio = 0;
      seen.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          current = id;
          bestRatio = ratio;
        }
      });
      if (current) setCurrentRailLink(current);
    }, { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.1, 0.25, 0.5] });
    railIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  const tabs = [...document.querySelectorAll('[role="tab"][aria-controls]')];
  const selectTab = (tab, moveFocus = false) => {
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute('aria-selected', String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(candidate.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (moveFocus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    });
  });

  const video = document.querySelector('[data-cc-video]');
  const videoFallback = document.querySelector('[data-video-fallback]');
  if (video && videoFallback) {
    let mediaUnavailable = false;
    const showVideoFallback = () => {
      mediaUnavailable = true;
      video.pause();
      video.hidden = true;
      videoFallback.hidden = false;
    };
    const syncVideoMotion = () => {
      if (mediaUnavailable) return;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      if (motionPreference?.matches) {
        video.autoplay = false;
        video.removeAttribute('autoplay');
        video.pause();
        return;
      }
      video.autoplay = true;
      video.setAttribute('autoplay', '');
      video.play().catch(() => { /* Controls remain available if autoplay is blocked. */ });
    };
    video.addEventListener('error', showVideoFallback);
    motionPreference?.addEventListener?.('change', syncVideoMotion);
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) showVideoFallback();
    else syncVideoMotion();
  }

  const revealTargets = [...document.querySelectorAll('[data-approach]')];
  const reducedMotion = motionPreference?.matches;
  let revealObserver = null;
  const land = (element) => {
    if (!element) return;
    element.classList.add('is-lds-revealed');
    element.classList.remove('is-lds-reveal-armed');
    revealObserver?.unobserve(element);
  };
  const landWrappers = (node) => {
    let current = node;
    while (current?.nodeType === Node.ELEMENT_NODE) {
      if (current.hasAttribute('data-approach')) land(current);
      current = current.parentElement;
    }
  };

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(land);
  } else {
    const viewportHeight = window.innerHeight;
    const effectiveBottom = viewportHeight - window.innerWidth * 0.12;
    const hashTarget = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
    const eligible = revealTargets.filter((element) => {
      const rect = element.getBoundingClientRect();
      if (element.closest('[data-hero], nav, header')) return false;
      if (hashTarget && (hashTarget === element || hashTarget.contains(element) || element.contains(hashTarget))) return false;
      return rect.top >= viewportHeight && rect.top > effectiveBottom;
    });
    revealTargets.forEach((element) => { if (!eligible.includes(element)) land(element); });
    if (eligible.length) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          revealObserver.unobserve(element);
          element.classList.add('is-lds-revealed');
          const delay = Number.parseInt(element.style.getPropertyValue('--lds-reveal-delay'), 10) || 0;
          window.setTimeout(() => element.classList.remove('is-lds-reveal-armed'), delay + 1000);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -12% 0px' });
      eligible.forEach((element) => {
        const sequence = element.parentElement?.hasAttribute('data-approach-sequence') ? element.parentElement : null;
        let delay = 0;
        if (sequence) {
          const peers = [...sequence.children].filter((child) => child.hasAttribute('data-approach'));
          delay = Math.min(peers.indexOf(element) * 150, 450);
        }
        element.style.setProperty('--lds-reveal-delay', `${delay}ms`);
        element.classList.add('is-lds-reveal-armed');
        revealObserver.observe(element);
      });
      root.classList.add('lds-motion-ready');
      document.addEventListener('focusin', (event) => landWrappers(event.target), true);
      window.addEventListener('hashchange', () => {
        const element = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
        if (!element) return;
        landWrappers(element);
        element.querySelectorAll('[data-approach]').forEach(land);
      });
      window.setTimeout(() => {
        eligible.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.top <= effectiveBottom && !element.classList.contains('is-lds-revealed')) land(element);
        });
      }, 2400);
    }
  }
})();
