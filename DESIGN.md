# CityChat visual experience

CityChat keeps its own face and way of speaking. Landometer DS supplies the shared visual foundation; CityChat VES v0.5 composes it for citizens and officers without creating a second token system.

## North-star interaction

```text
exact governed place or object
→ one evidence-backed meaning
→ what remains unknown
→ zero or one safe useful action
→ persisted receipt, honest recovery, or clean completion
```

CityChat should feel warm, local, calm and useful. A city feels alive because real places, people, changes and actions remain visible—not because the interface fabricates liveness, urgency or participation counts.

## Entry modes

- **Direct CityStory** — a governed story can stand on its own. H3 is not required.
- **CityScan discovery** — `SCAN → LOCK → STORY` is optional and must preserve geometry, snapshot, baseline and reproducibility.
- **Officer target mode** — object-native work records keep owner, status, deadline, evidence, permission and audit. This is capability-gated.

## StoryCell contract

- one main signal;
- zero to three traceable facts;
- exactly one useful question;
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

Build-local CSS may compose layout from semantic `var()` tokens. It must not copy retired CityChat v0.3 colours, font values, radii or motion tokens.

## CityChat visual signatures

- `CityBand` keeps product, place and useful role context together.
- `PlaceStage` gives the story a real place without turning atmosphere into evidence.
- `PlaceThread` separates community conversation from governed `StoryCell` evidence.
- `CommunityPresence` shows permissioned people and local participation cues without turning popularity into civic priority.
- `CivicAction` shows zero or one clear next step.
- `OutcomeReturn` shows a real saved state, honest recovery, or clean completion instead of rank or points.

Frontstage Thai uses ordinary verbs—ดู, เลือก, ตอบ, แจ้ง, ติดตาม, แก้ไข, กลับไป. Internal vocabulary belongs in a team/developer disclosure, not in citizen or officer copy.

## Truth boundary

The profile and playground are draft/source-limited guidance. Component presence does not prove backend capability. Unknown availability resolves false; unavailable controls are omitted or paired with an honest explanation and safe route.

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
