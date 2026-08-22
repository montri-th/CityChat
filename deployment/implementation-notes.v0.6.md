# CityChat VES Interactive Playground v0.6 — implementation notes

## Application decision

This artifact uses the `design-identity-playground` page kind and exactly one `designsystem.adoption` profile. It teaches approved CityChat VES v0.6 composition; it is not an operational `citychat.app` route and does not inherit that profile's runtime AHA claim.

## Visual foundation

The Landometer package under `vendor/landometer/v0.9.0/` is copied byte-for-byte from commit `d82ac775ab9d35a84cfb0dc77bc0ae804a7a0665`. The page loads its exact `lds-tokens.css` and `lds-base.css`, then composes only semantic LDS variables in `citychat.css`. Local `@font-face` declarations bind the exact LDS font-manifest files, and responsive thresholds mirror the LDS 600/900 container boundaries. No ungoverned raw colour, font value, gradient, motion duration, radius, breakpoint, or shadow is introduced.

## CityChat identity

The exact transparent CityChat horizontal PNG is used unchanged. Header and footer are two separate, exact-build roles under `identity-assets.v0.6.json`; both sit directly on the theme-resolved LDS `--brand-beige` identity band. No local white card, crop, recolour, filter, mask, animation, redraw, or screenshot-derived logo is used. Source SVG files remain public source evidence only. Compact, favicon, touch, maskable, social, motif, and supporting-illustration roles remain omitted.

The wordmark lettering inside the PNG is protected artwork, not page typography. Thai display and UI headings use IBM Plex Sans Thai Looped 700; English display and headings use Arvo 700; body, navigation, controls, and forms use Bai Jamjuree 400/600; technical Latin uses JetBrains Mono 400 with IBM Plex Sans Thai 400 for Thai technical text. All bytes are self-hosted from the pinned LDS font manifest and `font-synthesis` is disabled.

## Product and evidence boundary

CityChat VES v0.6 is approved for normative authoring. CityChat Product Experience Profile v0.4 and Product Brief v8 remain draft dependencies; Product Brief v7 remains the current narrative baseline until a later approval is recorded. CityScan, LINE, product persistence, receipts, sharing, telemetry, and officer operations are unavailable in this artifact.

Every visible product scene is a synthetic, conceptual fixture. `PLACE-DEMO-01` names no real place, person, municipality, service coverage, or outcome. The answer-choice control reveals layout only. The saved-and-return view teaches what a real persistent flow must communicate but never asserts that anything was saved. The CityScan state selector is team-only and does not model a legal product transition.

## First value and continuity

The learning route applies the internal CityChat directive safely: show one real local meaning before unrelated engagement; ask one question only when evidence supports it; offer zero or one bounded action and explain its consequence; remember a contribution only after real persistence; invite a return only for a material, versioned change; otherwise provide recovery or clean completion. Living-city character comes from place, people, evidence, time, and actual change—not fake pulse, ranking, streak, or liveness.

## Delivery

The target is a public GitHub Pages projection whose HTML entry point requests `noindex,nofollow,noarchive`, with `source_limited` evidence and no analytics. Public source and direct downloads may still be indexed independently. This page may claim approved VES authoring guidance and exact artifact QA only; it may not claim CityChat runtime or full downstream-product conformance.

## Release evidence

Release requires deterministic source validation, the full local rendered matrix, the protected pull-request check named `Source and rendered validation`, successful Pages deployment from the merged `main` commit, and exact live-byte parity for every critical asset. Upstream package consistency alone does not certify this artifact.

## Remaining manual gates

- Thai and English independent read-aloud review with citizen/officer reviewers;
- native iOS Safari and Android Chrome behavior;
- VoiceOver or TalkBack critical-path review;
- team comprehension across First Value, Saved & Return, CityScan, and Officer fixtures;
- Product Experience Profile v0.4 or approved successor and Product Brief v8 or approved successor;
- CityScan name, metric, geometry, scale, and claim-ceiling decisions;
- any CityChat identity role beyond the exact header/footer roles in this build.
