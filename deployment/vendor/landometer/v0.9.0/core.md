# Landometer DS v0.9.0 — always-on shared Core (machine projection)

Package v0.9.0-mp1 · authoring v0.9.0-r7 · Color Set color-srgb-05 ·
kit lds-kit-0.9.0-r4 · Token Schema 6 · Manifest 2.1. This Core is a generated projection for
loaders (target <=6,900 words; this one is far under). Rule text lives in the authoring master —
every ID below maps back to it; nothing here overrides it.

## Identity and truth (P0 — never waived)
- Cultural activation, verbatim: **Let us cultivate our city with data.** (MBB v0.5.3 §1.1).
- Root markers required: data-ds-version / data-color-registry / data-artifact-build / data-build-channel (SC-01).
- Evidence labels on every claim path: Observed fact · Benchmark interpretation (universe + peer size) ·
  Owner-stated · Inference · Hypothesis · Project evidence (MBB §3.7).
- Never upgrade: partial→complete, modelled→observed, planned→available, sent→received,
  handoff→network effect, discovery→evidence, LOI→contract, prototype→final result.
- locale_id / venue_id are the only join keys; names are for search. No cross-locale aggregation
  without approved geometry + method. SRI is not revenue; 7x24 heatmap is qualitative daypart,
  not footfall; ratings are popularity proxy, not sales.

## Determinism
- Copy the Build Kit verbatim (E0 rule 1): build-kit/lds-tokens.css, lds-base.css, skeleton.html.
  Editing kit bytes in a build is token drift (CORE-06, [TOKEN-01]).
- One Build Card per artifact; empty identity/experience fields stop the build (§2).
- Run [SELFCHECK-01] (23 binary items; self-check.map.json) before delivery; record exceptions
  per item, never silently.
- Identity rule: any governed colour/gradient/token-source/scale-source change mints a new
  Color Set ID; a UI-only change mints a new append-only artifact-build ID; baselines are never
  rewritten (registry `mintedWithArtifactBuild`).

## Visual and interaction spine
- Two-shape actions [BTN-GEOM-01]: capsule (pill, >= --space-5 inline padding, kit anatomy
  inline-flex/center/gap --space-2) or 44px circle; icon centres with label (SC-21/SC-23).
- Governed atmosphere gradients only — exact recipes via surface-recipes.json; purple/brown
  banned windows in preflight.yml [VIS-04]; retired values never render (SC-17).
- Quiet is a perceptual attention condition [SPACE-01]; connectors only encode real
  relationships (connector.schema.json); no edge rails/bracket spines.
- Icons: Material Symbols Rounded, locked axes, self-hosted subset [ICON-01] (SC-19).
- Motion: one Riddim signature [MOTION-01]; entrance on approach per [REVEAL-01] —
  reveal 640ms / stagger 120ms capped 600ms / rise 20px; lands once; never withholds reached
  content; reduced-motion and no-JS get final state (SC-22).
- Enumerations in bounded containers fold past six rows per [CONTAINER-FIT-01] (SC-20).
- Disclosure: answer first, evidence one interaction deep [DISCLOSURE-01]; no caution prose in
  first views; media-first.

## Language
- Thai written from meaning and evidence, never translated sentence structure; Appendix D recipe
  (voice-recipes.md). Script-aware technical type: JetBrains Mono 400 + IBM Plex Sans Thai 400
  (102% size-adjust); Bai Jamjuree body.

## Loading
- Exactly one profile (profiles/*.json) + only triggered packs (packs/*.json) + referenced token
  rows; unloaded material never becomes visible UI.
- Outputs begin machineValidation: pending; passed only after generated schemas, recipes, rule
  mappings, preflight, exact package revision, and every applicable manual gate validate the
  artifact (§9.7). Package availability alone is never a pass.
