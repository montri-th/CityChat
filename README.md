# CityChat public landing

Static Thai-language landing page prepared for the GitHub Pages route:

**https://montri-th.github.io/CityChat/**

The page introduces CityChat for local-government teams, includes product and municipal evidence, and ends with the rebuild02-aligned Landometer contact/footer system. Social profiles use the same accessible icon-only controls as rebuild02, while link decoration stays off icons and external-link cues. Team names are published without the honorifics previously attached to Sek and Film.

The CityScan demonstration autoplays muted, inline, and in a continuous loop while keeping native controls available. It pauses and removes autoplay when the visitor requests reduced motion, and retains a download fallback if the browser cannot play the local MP4.

## Publication boundary

The site is publicly reachable but intentionally non-indexable. `index.html` carries `noindex,nofollow,noarchive`, and `robots.txt` disallows crawling under this project artifact. The repository and directly addressed public files can still be discovered independently; `noindex` is a request to compliant search engines, not access control.

The page has no analytics or background network calls. Runtime images, video, fonts, Material Symbols, JavaScript, CSS, and the vendored Landometer Design System v0.9.0 files are served locally from `deployment/`.

## Work locally

```bash
npm run serve
```

Open `http://localhost:8000/`.

After changing any deployable file, regenerate the deterministic manifest and checksum ledger, then validate the source:

```bash
npm run finalize
npm test
```

Rendered validation requires the same pinned browser package used by CI:

```bash
npm install --no-save --no-package-lock playwright@1.54.1
npx playwright install chromium
npm run render
```

## Release checks

- `npm run finalize` records every regular file in `deployment/` except the two generated release records themselves. It rejects symlinks, unexpected system metadata, missing required files, and changed pinned media/font inputs.
- `npm test` checks JavaScript syntax, requires release records to be current, and validates static markup, complete MP4 structure, exact names and footer content, social icon semantics, underline boundaries, noindex/canonical metadata, accessibility basics, local runtime closure, font locality, pinned hashes, no-JS resilience, and reduced-motion rules.
- `npm run render` exercises desktop, tablet, and mobile layouts plus light, dark, system-dark, reduced-motion, no-JavaScript, storage-denied, menu, theme, tab, calm-navigation, icon-only footer, and CityScan autoplay behavior.
- `tools/verify-live.mjs` re-fetches the live runtime closure and release records with retry-aware cache busting, then requires exact bytes, SHA-256 hashes, expected MIME types, canonical/noindex copy, requested names, and footer contract.

Both GitHub Actions workflows validate without rewriting tracked files. The Pages workflow uploads `deployment/` exactly and performs the live verification only after GitHub Pages reports a successful deployment.

## Key files

- `deployment/index.html` — static landing markup and publication metadata
- `deployment/citychat.css` — local fonts, responsive layout, footer, theme, motion, and no-JS rules
- `deployment/app.js` — progressive menu, theme, tabs, rail, video fallback, and reveal behavior
- `release.config.json` — machine-readable release and content contract
- `deployment/site-manifest.json` — deterministic whole-tree file inventory
- `deployment/SHA256SUMS.txt` — deterministic SHA-256 ledger
