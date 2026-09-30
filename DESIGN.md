# CityChat DS Add-on

CityChat keeps its own face and way of speaking. Use the [complete LDS 0.9.5 base](https://montri-th.github.io/Landometer/v0.9.5/normative/Landometer-Design-System-v0.9.5.md) together with the [separate CityChat Add-on 0.9.2](https://montri-th.github.io/Landometer/v0.9.5/normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.5.md), delivery revision `standalone-0.9.5-r2`. The Add-on composes the shared foundation into first value, a warm living-city identity, and honest civic continuity without creating a second token system. The current [source policy](deployment/assets/downloads/design-system-source-policy.json) defines these two active sources and cancels earlier source-limited or combined-file instructions. Original Add-on documents and [binding record](deployment/assets/downloads/citychat-ds-addon-v0.9.2-binding.json) remain immutable audit evidence.

Playground artifact v0.8.0 remains a historical implementation example. Its control, icon, motion, and colour records are bounded artifact bindings, not current normative authority or evidence that a CityChat product capability is live.

> Show a living city quickly, ask one meaningful question, let people act in one tap, remember their contribution, and make the next useful action obvious.

## North-star interaction

```text
exact governed place or object
→ one evidence-backed meaning
→ what remains unknown
→ one supported question when useful
→ zero or one safe useful action with its expected consequence
→ persisted memory, honest recovery, clean completion, or a material return
```

CityChat should feel warm, local, calm and useful. A city feels alive because real places, people, evidence, time, changes and actions remain visible—not because the interface fabricates liveness, urgency or participation counts. Deliver this first value before unrelated sign-in, follow, or share requests.

## One place, three connected views

- **CityScan — ดูพื้นที่:** begin with the current viewport and exactly three prompts: **แถวนี้น่าอยู่ยังไง**, **น่าเที่ยวตรงไหน**, and **น่าค้าขายอะไรดี**. Each prompt opens separate CityCells for meaning, source, and limits. The prompts are questions, not verdicts, and must never become one overall CityScore.
- **CityChat — ฟังเสียงคน:** turn one selected CityCell into one local meaning, at most one useful question, and at most one supported action. Say what happens before the person acts.
- **Officer CityMETER — ใช้ทำงาน:** preserve the same `caseId`, `contextRef`, place/snapshot, topic, and evidence boundary. Show source, freshness, gaps, owner, and one allowed next step only when the owning runtime supports it.

A governed CityStory may also stand on its own. CityScan discovery is optional and must preserve geometry, snapshot, baseline, and reproducibility. Officer work remains capability-gated.

## StoryCell contract

- one main signal;
- zero to three traceable facts;
- zero or one useful question when the evidence supports it;
- zero or one authorized primary action;
- evidence summary one interaction deep;
- receipt only after real persistence;
- otherwise honest recovery or clean completion.

## Visual inheritance

Use the exact LDS 0.9.5 package in `deployment/vendor/landometer/v0.9.5/`. The landing loads its current color/font CSS and uses small artifact-owned bridges for retained geometry:

```html
<link rel="stylesheet" href="citychat-lds095-foundation.css">
<link rel="stylesheet" href="vendor/landometer/v0.9.5/build-kit/lds-0.9.5.css">
<link rel="stylesheet" href="citychat-lds095-primitives.css">
```

Build-local CSS composes layout from semantic `var()` tokens. It does not load the historical v0.9.0 color stylesheet or copy retired CityChat v0.3 colours. The exact CityChat lockup remains protected artwork and may appear only in a role/build/surface approved by the active identity manifest.

CityChat-owned identity areas use CityChat artwork and product roles only: do not substitute another product's mark, motif, gradient, or token for CityChat identity. The explicitly labelled ecosystem navigation and CityMETER relationship in the landing may name and link to those products, with each mark used under its own approval. An immutable vendor package may contain other upstream profiles, but those files are not CityChat identity assets and must not resolve into CityChat product roles.

## Historical implementation bindings in artifact v0.8.0

- **Buttons** inherit the LDS `.btn` capsule or `.btn-icon` circle. Keep the inherited padding, gap, height, focus, disabled, busy, and press behaviour. A visual specimen is not a live product action.
- **Functional icons** use the exact self-hosted Material Symbols Rounded subset recorded in `deployment/resources/citychat-ds-addon/v0.8.0/font-assets.manifest.json`. Bind only a closed role from `citychat-icon-map.json`, keep a visible or accessible label, and check `citychat-icon-resolution.json` before putting an icon on an actual control. The CityChat logo and motif are identity assets, never functional icons.
- **Motion** uses only an inherited LDS primitive named in `semantic-motion.citychat.yml`, or `none`. The main meaning and action are visible before enhancement; reduced-motion and no-JavaScript routes land directly in the final readable state. Animation never emits a receipt, product event, telemetry, or proof of persistence.
- **Colour in the historical playground** follows `citychat-color-role-map.json` on its then-pinned `color-srgb-05` source. Current work uses LDS 0.9.5 / `color-srgb-08`; missing authority resolves to no-data or unavailable copy, not a guessed colour.
- **Identity** uses the exact lockup bytes and the separately approved build, URL, role, theme, backdrop, and surface in `identity-assets.v0.8.0.json`. Do not add a white logo card or recolour, crop, filter, mask, animate, or rebuild the mark.

Use v0.8.0 resources only to understand that historical artifact. Use the complete LDS 0.9.5 base and the separate consolidated Add-on v0.9.2 for current CityChat decisions; no predecessor hierarchy is required.

## CityCells and example cases

A CityCell is a small presentation unit under one CityScan prompt. It keeps a stable ID, a plain public label, a value state, a claim level, evidence when a claim exists, the public meaning, and claims that must not be made. `unknown`, `out_of_coverage`, `stale`, and `suppressed_privacy` never become zero.

The playground contains three constructive local fixtures:

- `LIVE-01` — แถวนี้น่าอยู่ยังไง
- `VISIT-01` — น่าเที่ยวตรงไหน
- `TRADE-01` — น่าค้าขายอะไรดี

Each constructive fixture has scan, citizen, and officer lenses. `REJECT-01` shows why one aggregate score that claims an area is good at everything is unacceptable. These examples teach composition and handoff; they are not live place observations, official status, investment advice, or proof of runtime integration.

## CityChat visual signatures

- `CityBand` keeps product, place and useful role context together.
- `PlaceStage` gives the story a real place without turning atmosphere into evidence.
- `PlaceThread` separates community conversation from governed `StoryCell` evidence.
- `CommunityPresence` shows permissioned people and local participation cues without turning popularity into civic priority.
- `CivicAction` shows zero or one clear next step.
- `OutcomeReturn` shows a real saved state, honest recovery, or clean completion instead of rank or points.

Frontstage Thai uses ordinary verbs—ดู, เลือก, ตอบ, แจ้ง, ติดตาม, แก้ไข, กลับไป. Say what people can understand and use; keep internal vocabulary, field names, and system caveats in a team/developer disclosure instead of citizen or officer copy.

## Truth boundary

The DS Add-on is approved authoring guidance; this playground remains source-limited. The Product Experience Profile v0.4 and Product Brief v8 remain drafts. Component presence does not prove backend capability. Unknown availability resolves false; unavailable controls are omitted or paired with an honest explanation and safe route.

## Handoff

Every handoff preserves:

```text
object ID + version + place/boundary version
+ source snapshot + evidence status
+ claim/value state + limitation
+ current authorization decision
+ destination availability
```

See the downloadable profile and component registry for the full typed contract.
