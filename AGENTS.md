# CityChat implementation contract

Before changing an interface in this repository:

1. Read `DESIGN.md`, current `deployment/assets/downloads/citychat-ds-addon-v0.9.2-project-source.md` and its binding JSON. The v0.9.2 migration record and exact historical v0.9/v0.9.1 documents are for audit, not new design pins.
2. Treat both `deployment/vendor/landometer/v0.9.0/` and `deployment/vendor/landometer/v0.9.5/` as immutable upstream snapshots. Current work uses LDS 0.9.5, release `v0.9.5-owner.1`, Color Set `color-srgb-08`; run `npm test` to check vendored file hashes.
3. Use the current LDS 0.9.5 CityChat product roles. Historical v0.9.0 profiles and playground implementation files are not current authority.
4. Use shared tokens, fonts, colors and primitives from the vendored 0.9.5 build kit. The two `citychat-lds095-*.css` files bridge retained site geometry to that package; do not introduce another palette or reload old color CSS.
5. Keep product authority, evidence, delivery availability, authorization, claim level, signal class, value state and workflow status as separate fields.
6. Deliver first value before unrelated engagement: one place, one honest meaning, one supported question when useful, and zero or one safe primary action whose consequence is stated.
7. Never render a receipt before authoritative persistence. Remember a contribution only after real persistence and invite a return only for a material versioned change. A local demo acknowledgement must remain labelled as a fixture.
8. Never present a conceptual scan, synthetic count or illustrative municipality status as live or official.
9. Preserve source, date, coverage, boundary, limitation and object/version through every handoff.
10. Run `npm test` and inspect the declared viewport/theme/locale matrix before committing.
11. Keep public copy short and human. Put internal field names, schema terms and release codes behind team/developer disclosures.
12. Preserve the exact CityChat lockup only within the role, build, URL, theme, backdrop, and surface recorded in the active identity manifest. Never add a local white logo card, recolour, crop, filter, mask, animate, or rebuild it.
13. Use exact self-hosted LDS type roles and set `font-synthesis: none`; never approximate the wordmark with page typography.
14. Keep `.btn` capsule and `.btn-icon` circle aligned to current LDS control geometry and feedback. Do not replace padding, radius, height, focus, disabled, busy, or press behavior with a new button recipe.
15. Use the pinned local functional icon subset only for recorded control roles. Historical v0.7/v0.8 icon maps are artifact evidence, not an approval for new capabilities. Never use the CityChat lockup or motif as an action icon.
16. Resolve product colour jobs through CityChat roles on the current LDS `color-srgb-08` source. Historical `color-srgb-05` maps are not the current palette. Missing authority fails closed to no-data or unavailable copy.
17. Resolve motion through current LDS 0.9.5 primitives or `none`. `CC-EX-01` looping CTA motion is retired for new work. Keep first meaning and action visible; no-JavaScript and reduced-motion states stay readable. Animation never creates a receipt, event, telemetry, or capability claim.
18. Do not use bracket-shaped highlights or colored left rails on selected navigation, tabs, cards, or callouts. Use restrained fill and weight while retaining keyboard focus and meaningful chart/table borders. Inspect Thai and English at narrow and desktop widths.
19. The old v0.8 playground stays historical. Current normative CityChat guidance is v0.9.2 on LDS 0.9.5; implementation records do not themselves certify full conformance.

Files under `deployment/assets/downloads/` and `deployment/vendor/` are release inputs. Keep their hashes and manifest records synchronized.
