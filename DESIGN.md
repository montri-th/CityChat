# CityChat visual experience

CityChat keeps its own face and way of speaking. Landometer DS supplies the shared visual foundation; approved CityChat VES v0.6 composes it into first value, a warm living-city identity, and honest civic continuity without creating a second token system.

Playground artifact v0.6.1 is the implementation example layer for that approved VES. Its control, icon, motion, and colour records are bounded artifact bindings—not a new normative VES version and not evidence that a CityChat product capability is live.

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

## Entry modes

- **Direct CityStory** — a governed story can stand on its own. H3 is not required.
- **CityScan discovery** — `SCAN → LOCK → STORY` is optional and must preserve geometry, snapshot, baseline and reproducibility.
- **Officer target mode** — object-native work records keep owner, status, deadline, evidence, permission and audit. This is capability-gated.

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

## Implementation bindings in artifact v0.6.1

- **Buttons** inherit the LDS `.btn` capsule or `.btn-icon` circle. Keep the inherited padding, gap, height, focus, disabled, busy, and press behaviour. A visual specimen is not a live product action.
- **Functional icons** use the exact self-hosted Material Symbols Rounded subset recorded in `deployment/resources/citychat-ves/v0.6.1/font-assets.manifest.json`. Bind only a closed role from `citychat-icon-map.json`, keep a visible or accessible label, and check `citychat-icon-resolution.json` before putting an icon on an actual control. The CityChat logo and motif are identity assets, never functional icons.
- **Motion** uses only an inherited LDS primitive named in `semantic-motion.citychat.yml`, or `none`. The main meaning and action are visible before enhancement; reduced-motion and no-JavaScript routes land directly in the final readable state. Animation never emits a receipt, product event, telemetry, or proof of persistence.
- **Colour** follows `citychat-color-role-map.json`, a product-usage overlay on the pinned LDS `color-srgb-05` source. It does not create a second palette, duplicate the complete LDS atlas, or authorize an analytical scale. Missing authority resolves to no-data or unavailable copy, not a guessed colour.
- **Identity** uses the exact lockup bytes and the separately approved build, URL, role, theme, backdrop, and surface in `identity-assets.v0.6.1.json`. Do not add a white logo card or recolour, crop, filter, mask, animate, or rebuild the mark.

Use the v0.6.1 resource directory as the human/AI handoff entry point; use the approved VES v0.6 when deciding normative CityChat composition and experience behaviour.

## CityChat visual signatures

- `CityBand` keeps product, place and useful role context together.
- `PlaceStage` gives the story a real place without turning atmosphere into evidence.
- `PlaceThread` separates community conversation from governed `StoryCell` evidence.
- `CommunityPresence` shows permissioned people and local participation cues without turning popularity into civic priority.
- `CivicAction` shows zero or one clear next step.
- `OutcomeReturn` shows a real saved state, honest recovery, or clean completion instead of rank or points.

Frontstage Thai uses ordinary verbs—ดู, เลือก, ตอบ, แจ้ง, ติดตาม, แก้ไข, กลับไป. Internal vocabulary belongs in a team/developer disclosure, not in citizen or officer copy.

## Truth boundary

The VES is approved authoring guidance; this playground remains source-limited. The Product Experience Profile v0.4 and Product Brief v8 remain drafts. Component presence does not prove backend capability. Unknown availability resolves false; unavailable controls are omitted or paired with an honest explanation and safe route.

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
