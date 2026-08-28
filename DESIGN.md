# CityChat DS Add-on

CityChat keeps its own face and way of speaking. Landometer DS supplies the shared visual foundation; approved CityChat DS Add-on v0.8 composes it into first value, a warm living-city identity, and honest civic continuity without creating a second token system.

Playground artifact v0.8.0 is the implementation example layer for that approved DS Add-on. Its control, icon, motion, and colour records are bounded artifact bindings—not a new normative DS Add-on version and not evidence that a CityChat product capability is live.

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

Use the exact Landometer v0.9.0 machine package in `deployment/vendor/landometer/v0.9.0/`:

```html
<link rel="stylesheet" href="vendor/landometer/v0.9.0/build-kit/lds-tokens.css">
<link rel="stylesheet" href="vendor/landometer/v0.9.0/build-kit/lds-base.css">
```

Build-local CSS may compose layout from semantic `var()` tokens. It must not copy retired CityChat v0.3 colours, font values, radii or motion tokens. The exact CityChat lockup remains protected artwork and may appear only in a role/build/surface approved by the active identity manifest.

Current frontstage identity is CityChat only. Do not render another product's name, mark, motif, gradient, profile, or product token. An immutable vendor package may contain other upstream profiles, but those files are not CityChat assets and must not resolve into current CityChat resources.

## Implementation bindings in artifact v0.8.0

- **Buttons** inherit the LDS `.btn` capsule or `.btn-icon` circle. Keep the inherited padding, gap, height, focus, disabled, busy, and press behaviour. A visual specimen is not a live product action.
- **Functional icons** use the exact self-hosted Material Symbols Rounded subset recorded in `deployment/resources/citychat-ds-addon/v0.8.0/font-assets.manifest.json`. Bind only a closed role from `citychat-icon-map.json`, keep a visible or accessible label, and check `citychat-icon-resolution.json` before putting an icon on an actual control. The CityChat logo and motif are identity assets, never functional icons.
- **Motion** uses only an inherited LDS primitive named in `semantic-motion.citychat.yml`, or `none`. The main meaning and action are visible before enhancement; reduced-motion and no-JavaScript routes land directly in the final readable state. Animation never emits a receipt, product event, telemetry, or proof of persistence.
- **Colour** follows `citychat-color-role-map.json`, a product-usage overlay on the pinned LDS `color-srgb-05` source. It does not create a second palette, duplicate the complete LDS atlas, or authorize an analytical scale. Missing authority resolves to no-data or unavailable copy, not a guessed colour.
- **Identity** uses the exact lockup bytes and the separately approved build, URL, role, theme, backdrop, and surface in `identity-assets.v0.8.0.json`. Do not add a white logo card or recolour, crop, filter, mask, animate, or rebuild the mark.

Use the v0.8.0 resource directory as the human/AI handoff entry point; use the approved DS Add-on v0.8 when deciding normative CityChat composition and experience behaviour.

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
