# CityChat public landing

Static Thai-language landing page prepared for the GitHub Pages route:

**https://montri-th.github.io/CityChat/**

Current design authoring uses two human- and machine-readable files: **[the complete LDS 0.9.7 base](https://montri-th.github.io/Landometer/v0.9.7/normative/Landometer-Design-System-v0.9.7.md)** plus **[the separate CityChat Add-on 0.9.2](https://montri-th.github.io/Landometer/v0.9.7/normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.7.md)**. The base owns shared rules and exact shared machine values; the Add-on contains CityChat-specific rules and product values without duplicating the base. JSON alternatives use the same URLs with `.json` instead of `.md`.

Upload the two Markdown files to a ChatGPT/Claude Project Source. Remove or deactivate conflicting old LDS/Add-on sources and combined product/base files; retain actual product/evidence/rights sources. Set Project Instructions to the complete base plus CityChat Add-on, then verify both sources in a new session. Source upload does not activate other clients/accounts or the whole team. The [source policy](deployment/assets/downloads/design-system-source-policy.json) cancels the former 8+1 setup and combined-product proposal for new work; old normative files, bindings and release receipts remain byte-identical historical records. Both page footers link separately to the base and Add-on.

Current authoring and the landing runtime use LDS 0.9.7 / color-srgb-10. Existing artwork, motion, product claims and page outline remain unchanged.

The earlier LDS 0.9.5 migration has its own `citychat-landing-20260930-01` build and `citychat-lds095-20260930-01` release revision. The [successor content-release record](deployment/assets/downloads/citychat-lds095-content-release-20260930-01.json) identifies the unchanged artwork carried into the same roles and placements, points to the original exact-build approvals, and limits the carry-forward to this migration. The original approval records remain unchanged.

The page introduces CityChat for local-government teams, includes product and municipal evidence, and ends with the rebuild02-aligned Landometer contact/footer system. Social profiles use the same accessible icon-only controls as rebuild02, while link decoration stays off icons and external-link cues. Team names are published without the honorifics previously attached to Sek and Film.

This release also adopts the hash-bound CityChat motif amendment at artifact scope. All four semantic motifs use their registered one-shot gestures when first entering the viewport, while the opening hero uses the owner-approved animated bubble treatment under `CC-EX-02`. The wordmark and Landometer pin remain still. Reduced-motion, no-JavaScript, and print routes retain the exact registered static artwork, and changing theme or revisiting a section does not replay a motif.

The CityScan demonstration keeps its original portrait framing: it sits beside the explanation on wider screens, moves below the explanation on compact screens, and shrinks further in short landscape viewports. It autoplays muted, inline, and in a continuous loop while keeping native controls available, pauses and removes autoplay when the visitor requests reduced motion, and retains a download fallback if the browser cannot play the local MP4. A build-bound CityChat pin favicon and a mid-page CityChat gradient highlight are included as local, attested assets.

## Publication boundary

The site is publicly reachable but intentionally non-indexable. `index.html` carries `noindex,nofollow,noarchive`, and `robots.txt` disallows crawling under this project artifact. The repository and directly addressed public files can still be discovered independently; `noindex` is a request to compliant search engines, not access control.

The page has no analytics or background network calls. Runtime images, video, fonts, Material Symbols, JavaScript, CSS, and the vendored LDS 0.9.7 assets are served locally from `deployment/`. The old v0.9.0 vendor snapshot remains for historical records but is not loaded as a current color stylesheet.

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
- `npm test` checks JavaScript syntax, requires release records to be current, validates the existing site contracts, and checks all historical and current LDS package assets against their upstream hashes, the CityChat Add-on documents and successor release record, and Thai/English CSS and download links.
- `npm run render` exercises 320–1440px layouts, short landscape, light, dark, system-dark, reduced-motion, no-JavaScript, print, storage-denied, menu, theme, tab, calm-navigation, icon-only footer, the approved favicon, the CityChat gradient highlight, portrait CityScan behavior, and finite motif/logo motion without replay.
- `tools/verify-live.mjs` re-fetches the live runtime closure and release records with retry-aware cache busting, then requires exact bytes, SHA-256 hashes, expected MIME types, canonical/noindex copy, requested names, footer contract, and all registered motif resources.

Both GitHub Actions workflows validate without rewriting tracked files. The Pages workflow uploads `deployment/` exactly and performs the live verification only after GitHub Pages reports a successful deployment.

## Key files

- `deployment/index.html` — static landing markup and publication metadata
- `deployment/citychat-lds097-foundation.css` and `deployment/citychat-lds097-primitives.css` — retained site geometry bound to the current LDS roles
- `deployment/vendor/landometer/v0.9.7/` — exact current machine, font, color, and web assets
- `deployment/citychat.css` — CityChat-specific responsive layout, footer, theme, motion, and no-JS rules
- `deployment/app.js` — progressive menu, theme, tabs, rail, video fallback, and reveal behavior
- `deployment/motif-runtime.js` — first-intersection mounting for registered motif and logo SVG motion
- `citychat-build-card.json` — historical exact-build motif approval, placements, hashes, and exception record
- `deployment/assets/downloads/citychat-lds097-content-release-20261001-01.json` — current release identity and constrained artwork carry-forward
- `deployment/assets/identity/identity-assets.citychat-landing-20261001-01.json` — unchanged favicon and locale-specific share previews bound to the current build
- `handoff/citychat-motif-set/` — exact owner-supplied amendment, register, source assets, and motion reference
- `release.config.json` — machine-readable release and content contract
- `deployment/site-manifest.json` — deterministic whole-tree file inventory
- `deployment/SHA256SUMS.txt` — deterministic SHA-256 ledger

For current LDS 0.9.7 authoring, Story supporting colours and analytical scales, including Location Intelligence, use the released original HEX, role colours and LUT values unchanged in light and dark modes. Do not auto-darken, invert, blend or derive substitute palettes for these sets. Foundation UI and categorical colours follow the released theme rules. The current landing consumes these exact 0.9.7 runtime values; immutable historical snapshots remain unchanged.

## Current public surface — 1 October 2026

The 0.9.7 runtime replaces the 0.9.5 runtime stylesheet without rewriting historical snapshots. A separate team disclosure presents the 17 Story colours, 14 sequential / 6 diverging families, exact seven-class examples and unchanged light/dark data HEX. The public product outline and existing evidence stay intact. Localized 1200×630 sharing images use the exact static lockup; favicon bytes stay unchanged. Sharing metadata does not change the existing noindex policy.
