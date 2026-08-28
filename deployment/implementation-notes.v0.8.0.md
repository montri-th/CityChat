# CityChat DS Add-on Playground v0.8.0 — implementation notes

Artifact build: `citychat-ui-20260828-01`

Current CityChat add-on authority: CityChat DS Add-on v0.8

Shared visual authority: Landometer Design System v0.9.0-r7 / machine package v0.9.0-mp1
Delivery: source-limited, page-level noindex team-learning projection; not a product runtime.

## What v0.8.0 adds

- Restored the place-first CityScan hero from the early v0.4 visual lineage while keeping it clearly synthetic, local-only and non-analytical.
- Aligned CityScan with exactly three viewport prompts: **แถวนี้น่าอยู่ยังไง**, **น่าเที่ยวตรงไหน**, and **น่าค้าขายอะไรดี**. The CityCell taxonomy keeps each prompt's groups, meaning, evidence status, and forbidden claims separate; it never creates one overall score.
- Added three constructive cases—`LIVE-01`, `VISIT-01`, and `TRADE-01`—with scan, citizen, and officer lenses. Added `REJECT-01` to show why one aggregate CityScore is not acceptable.
- Added a working two-shape button builder: labelled actions are LDS capsules; icon-only actions are LDS 44×44 circles. No third button shape is allowed.
- Added a safe direct-download asset library with file hashes, rights, allowed uses and blocked uses.
- Added an exact self-hosted Material Symbols Rounded subset, font/license manifest, closed icon map and artifact resolution record. The gallery is a team reference; product usage remains capability-gated.
- Added scoped motion examples. The main meaning is always visible; inherited `.btn` feedback and one once-only three-item `.reveal` reading-order group are the only executable enhancement. There is no replay, fake receipt, fake liveness or animation-driven state.
- Added a generated CityChat Color Usage Atlas. It maps CityChat jobs to the pinned LDS `color-srgb-05` roles and links back to the full LDS atlas. It does not duplicate the full shared registry or invent analytical scales.

## Identity and type

The exact transparent CityChat horizontal PNG is used unchanged in separately authorized header and footer roles for this build and URL. Both sit directly on the theme-resolved LDS `--brand-beige` band. No local logo card, crop, recolor, filter, mask, opacity change, animation, redraw or screenshot-derived asset is used.

Current frontstage identity and the public asset library are CityChat-only. Another product's name, mark, motif, gradient, profile or product token must not be rendered or resolved into current CityChat resources. The immutable LDS vendor snapshot may contain other upstream product profiles; those files remain dependency history, not CityChat assets.

The LDS font files and role mapping remain exact and self-hosted. Material Symbols Rounded is an additional scoped functional-icon asset with a pinned file hash and Apache-2.0 notice; it never replaces the CityChat logo or becomes a second icon family.

## Capability and evidence boundary

CityChat DS Add-on v0.8 governs the CityChat-specific composition shown here. CityChat Product Experience Profile v0.4 and Product Brief v8 remain draft dependencies. Production CityScan scoring, LINE, remote persistence, receipts, sharing, telemetry, cross-surface handoff and officer operations are disabled. Every case, place, value, response, checklist and status shown in the playground is a local conceptual fixture.

The three lenses teach how context should be preserved; they do not claim the inspected routes are integrated. Runtime observations may guide future product work, but they are not normative evidence and are not copied into a fixture as a live result.

The page is not a full LDS living reference: `fullLivingReference`, search, Reference packs, data visualization and map runtime stay false. The CityChat color atlas is a CityChat usage overlay; complete shared color values remain governed by the immutable LDS release. Frontstage Thai stays short, ordinary and useful; internal contracts and caveats stay in the implementation layer.

## Build and release

1. Run the color-atlas generator/check.
2. Run `npm test` and the complete rendered matrix.
3. Freeze bytes, generate the site manifest and SHA256SUMS, and rerun source checks without rewrite.
4. Publish only through a protected pull request whose `Source and rendered validation` check passes on the exact commit.
5. After merge, require the GitHub Pages deployment and exact live-byte verifier before calling v0.8.0 live.

Package validation does not certify CityChat runtime capability. Native iOS Safari, Android Chrome, VoiceOver/TalkBack and owner comprehension checks remain manual gates unless a signed record closes them.
