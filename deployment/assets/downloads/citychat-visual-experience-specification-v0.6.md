# CityChat Visual Experience Specification (VES) v0.6 — Living City, First Value & Civic Continuity

> **Show a living city quickly, ask one meaningful question, let people act in one tap, remember their contribution, and make the next useful action obvious.**

> **เห็นเมืองมีชีวิตจากเรื่องจริง → เข้าใจง่าย → ช่วยตอบหรือทำหนึ่งอย่าง → รู้ว่าส่งแล้วหรือกำลังรออะไร → กลับมาดูสิ่งสำคัญที่เปลี่ยนไป**

---

## 0. Document Control

| Field | Value |
|---|---|
| Document class | CityChat Visual Experience Specification (VES), product-specific overlay under Landometer Design System |
| Compatibility filename | Uses `CityChat_design_system_*` for migration compatibility; the document class is VES, not a second Design System |
| Version | v0.6 |
| Status | **Approved normative authoring authority** — effective 2026-08-22 for CityChat VES composition, narrative presentation, product-specific motion application and implementation guidance; approval does not by itself prove migration parity, machine-package conformance, runtime availability, release or shipped state |
| Approval ID | `CC-VES-APP-20260822-01` |
| Approver reference | `user:03-citychat-project-owner` — project owner/requester in the current task |
| Approval source | Explicit user reply `อนุมัติ`, recorded 2026-08-22; durable approval record: `CityChat_v0_6_normative_approval_2026-08-22.json` |
| Effective date | 2026-08-22 |
| Date | 2026-08-22 |
| Evidence cutoff | 2026-08-22 |
| Primary users | ชาวบ้าน / คนในพื้นที่, เจ้าหน้าที่ อปท. |
| Implementation users | Product, Design, Content, Developer, QA, Data/Evidence, Security, AI implementation agents |
| Visual foundation | Landometer Design System v0.9.0-r7; exact machine-package identity must be pinned by each artifact |
| Product interaction dependency | CityChat Product Experience Profile v0.4 — draft candidate; authoritative only after explicit approval or an approved successor ADR |
| Product direction | CityChat Product Brief v8 — draft candidate; v7 remains the current narrative baseline until superseding approval is recorded |
| Prior VES | CityChat VES v0.5 — draft candidate and visual/experience baseline for this revision |
| Source of revived intent | CityChat v0.3 — historical interaction and narrative intent only; not current visual authority |
| Identity amendment | `CC-ID-DIR-20260822-01` — approved as part of `CC-VES-APP-20260822-01`: CityChat retains its own existing logo and coherent product identity; LDS supplies governed visual ingredients and color roles. This approves the direction and role policy, not unbound asset files or delivery roles |
| Supersession | Owner approval is recorded. v0.6 supersedes v0.5 for new authoring in CityChat VES composition, narrative presentation, product-specific motion application and implementation recipes. Existing v0.5 artifacts remain governed by their own release records until migration parity and a v0.6 artifact receipt are recorded |

### 0.1 Why v0.6 exists

v0.5 repaired the most important structural problems:

- it stopped CityChat from becoming a visual Design System parallel to LDS;
- it separated StoryCell from H3 and community posts;
- it made receipt, status and capability fail closed;
- it improved plain Thai, contrast, responsive behavior, map safety and accessibility;
- it separated citizen, officer, CityStory and CityScan scenes;
- it introduced stronger release and evidence boundaries.

What v0.5 still did not make operational enough:

- first value before login, setup, dashboard or share;
- the memorable CityStory narrative rhythm;
- CityChat identity beyond logo, color and component silhouette;
- a civic loop that continues from action to memory, return and useful sharing;
- semantic motion recipes that preserve warmth without fake activity;
- explicit officer-relief outcomes;
- a deterministic handoff that humans and AI can implement consistently.

v0.6 closes those gaps without restoring obsolete v0.3 tokens, H3 identity, LivePulse, variable reward, stage-derived receipt, multi-CTA scenes or unsupported capability claims.

It also makes one identity boundary explicit: CityChat is not a generic LDS skin. CityChat keeps its own existing logo, mark, semiotics and recognizable product character. LDS supplies the governed palette, typography, primitives, icon system, motion and accessibility contracts used to deliver that identity consistently.

### 0.2 Authority by domain

There is no single global precedence list. Resolve each decision by its owning domain.

| Domain | Owning authority | v0.6 responsibility |
|---|---|---|
| User, job, workflow, outcome, product limit | Approved Product Brief / ADR | Present the approved intent; never invent it |
| Shared visual foundation | Landometer DS v0.9.0-r7 and exact validated machine bytes | Select and compose inherited roles; never fork raw values or primitives |
| CityChat object, state, effect, receipt and interaction behavior | Approved CityChat Product Experience Profile or successor ADR | Map views and recipes one-to-one; before approval, mappings remain candidate |
| Metric, scale, coverage, geometry and LOCK | Approved dataset / metric / CityScan registry | Show exact governed meaning and state; never promote a candidate score |
| Official workflow status and closure | Owning municipal/workflow system | Render only authoritative values and public-safe projections |
| CityChat identity lineage | `CC-ID-DIR-20260822-01` + `CC-VES-APP-20260822-01` | Preserve CityChat as the primary product identity; normative direction is approved, but each delivery asset and role still needs its own exact approval record |
| CityChat brand asset delivery | Approved CityChat identity registry | Preserve the CityChat logo, mark, semiotics and product recognition in each separately approved role; never substitute a generic Landometer identity |
| Identity/media asset bytes and roles | Role-specific approval record with path, role and hash | Place only approved bytes in approved roles; VES does not approve a file by naming it |
| Shared color, icon and motif execution | Landometer DS registry and exact validated machine bytes | Map CityChat meanings to governed LDS roles; never copy raw values or another product's identity |
| CityChat composition and frontstage presentation | Approved CityChat VES v0.6 | Define first value, visual signatures, narrative composition, warmth and product-specific motion intent |
| Runtime availability | Release evidence, deployment authorization and current permission | Omit or fail closed when unresolved |

Landometer DS remains the authority for tokens, typography, shared controls, icon delivery, focus, spacing, radius, breakpoints, motion primitives, accessibility and common QA. This VES does not replace or weaken it.

### 0.3 Normative language

- **MUST / ต้อง** = required for v0.6 normative authoring and for conformance when the applicable dependency and release gates are satisfied.
- **SHOULD / ควร** = recommended; a deviation needs a recorded reason.
- **MAY / อาจ** = optional.
- Approval `CC-VES-APP-20260822-01` makes MUST/SHOULD normative within the VES-owned domains defined in §0.2. It does not promote a draft Product Brief, Product Experience Profile, dataset, CityScan contract, workflow, capability or asset-role approval.
- A component, recipe or sample is not evidence that a capability is live.
- A fixture is not a pilot, official record or runtime proof.
- Unknown authority, capability, destination, permission, effect or persistence MUST fail closed.

### 0.4 Safe interpretation of the operating directive

The English directive is an internal CityChat experience directive. It is not a public slogan and does not replace protected Landometer brand lines.

| Phrase | Operational meaning | Must not mean |
|---|---|---|
| **Show a living city** | Use a real place, person, period, evidence record, contribution or versioned change | Synthetic pulse, fake counter, random variation or animation presented as activity |
| **Quickly** | Reveal local meaning before non-intrinsic login, setup, follow, share or dashboard | Hide evidence or skip necessary context |
| **One meaningful question** | Ask one local, answerable and evidence-supported question | Force a question when no honest story exists |
| **Act in one tap** | Offer one clear primary control from an eligible state | Bypass authentication, consent, visibility review or consequential confirmation |
| **Remember contribution** | Show a versioned persisted event/object and recovery/correction path | Treat a local toast, click or client acknowledgement as memory |
| **Next useful action** | One available action, return path, recovery, safe alternative or clean completion | Require an endless engagement loop |

### 0.5 v0.5 invariants carried forward

v0.6 preserves these without weakening them:

1. CityChat is a VES overlay under LDS, not a second DS.
2. No local raw color, font, radius, breakpoint, shadow, z-index or motion value.
3. One page state has one dominant place/object, one primary thought and zero/one primary action.
4. StoryCell is not H3, not a community post and not a free-form AI summary.
5. Direct CityStory works without CityScan or LOCK.
6. Unknown, no-score, stale, privacy-suppressed and zero remain distinct.
7. Receipt appears only after real persistence; official status comes only from its owner.
8. Thai remains plain, short and human; technical detail is available on demand.
9. Contrast, responsive, map-safe, privacy, accessibility and release gates remain additive.
10. Clean completion and deliberate no-action are valid outcomes.

---

## 1. Experience North Star

### 1.1 Living City Operating Directive

> **Show a living city quickly, ask one meaningful question, let people act in one tap, remember their contribution, and make the next useful action obvious.**

This directive governs sequence, composition, tone and continuity. It never overrides product truth, privacy, authorization, accessibility or fail-closed behavior.

### 1.2 Thai operating line

> **เห็นเมืองมีชีวิตจากเรื่องจริง → เข้าใจง่าย → ช่วยตอบหรือทำหนึ่งอย่าง → รู้ว่าส่งแล้วหรือกำลังรออะไร → กลับมาดูสิ่งสำคัญที่เปลี่ยนไป**

This Thai line is authored for the same intent; it is not a literal translation.

### 1.3 First-value contract

Every first citizen scene MUST reveal one useful local meaning before asking the user to:

- register or sign in;
- complete a profile;
- choose a followed area;
- allow notifications;
- share;
- enter a dashboard or dense feed.

The first stable viewport MUST contain:

1. place or governed context;
2. one honest local meaning, including what changed when change is the meaning, or an honest no-story/no-score reason;
3. source class and any limitation that changes interpretation;
4. zero or one evidence-supported question;
5. zero or one primary action;
6. the expected immediate consequence of that action, or clear completion.

Valid first-value sources:

- Direct CityStory supported by governed evidence;
- settled CityScan readout or a StoryCell from a valid Locked Scan;
- real followed-place update;
- honest no-story/no-score state with a useful alternative.

The following do not count as first value by themselves:

- logo, gradient or atmosphere;
- animation or a map without meaning;
- onboarding, login or area setup;
- feed, ranking or popularity;
- unlabelled metric;
- generic welcome copy.

For operational `citychat.app` artifacts, the first-value presentation SHOULD fit the selected LDS profile AHA budget. The current profile target is within 10 seconds and no more than three essential inputs under the declared fixture. A separate 15-second comprehension test verifies understanding; a render event is not proof of AHA.

### 1.4 One-job rule

Each page state MUST have:

- one dominant place or governed object;
- one primary thought;
- zero or one primary action;
- one clear receipt, waiting state, recovery path or clean completion.

Audit, waiting, permission-denied, read-only and no-story states MAY have no action.

### 1.5 First-value derived state

This state machine is a view-state projection. It is not product truth and MUST NOT be persisted as workflow status.

```text
resolving_context
├─ value_ready
│  ├─ awaiting_action
│  │  ├─ canonical_pending
│  │  ├─ canonical_persisted → memory_available
│  │  │                          ├─ return_available
│  │  │                          └─ clean_completion
│  │  └─ canonical_failed_or_conflict → recovery_visible
│  └─ clean_completion
├─ no_story
├─ restricted
└─ recoverable_error
```

`value_ready` requires place, meaning, truth/source cue, question when supported, material limitation when required and either an available action or deliberate no-action.

All required content MUST be present to assistive technology at `value_ready`. Do not stage essential meaning behind decorative animation.

---

## 2. CityChat Identity, Character and Warmth

### 2.1 Character

CityChat is:

- **local** — starts from a real place, not a system menu;
- **human** — lets places, people and useful questions lead;
- **clear** — one matter and one next step at a time;
- **warm but calm** — friendly without pressure, hype or forced playfulness;
- **grounded** — evidence, source, time and material limitation stay close to meaning;
- **useful** — every control names its expected immediate consequence;
- **alive through real change** — variation comes from real context, evidence, time and memory.

CityChat is not:

- a generic chatbot;
- an expert-only GIS dashboard;
- a complaint inbox with no return path;
- a popularity feed;
- an AI/inspector interface exposed to citizens;
- a game of points, levels or streaks;
- a wall of warnings before value.

### 2.2 Identity grammar

CityChat identity is the repeated relationship between four ideas. It is not only a palette, but it may use a governed CityChat color recipe from LDS to make those ideas recognizable.

| Identity role | Human meaning | Visible expression |
|---|---|---|
| **Voice / Callout** | A person can ask or answer something meaningful about this place | One natural local question or invitation |
| **Evidence / Weight** | The conversation has a reason and a trace | One short truth line with details on demand |
| **Place / Depth** | The matter belongs to a real context | CityBand, PlaceStage, map, local photo or place label |
| **Care / Continuity** | The action is remembered and can continue honestly | One safe action, receipt/recovery and return path |

### 2.3 Six visual signatures

These v0.5 signatures remain CityChat-owned compositions over LDS primitives:

1. **CityBand** — product, place and relevant role remain close.
2. **PlaceStage** — map, local photo or approved city illustration grounds the scene.
3. **PlaceThread** — human conversation remains visibly attached to a place.
4. **CommunityPresence** — permissioned people and voices make the city feel inhabited.
5. **CivicAction** — one clear capsule action moves the matter safely.
6. **OutcomeReturn** — receipt, update, recovery or completion makes continuity visible.

### 2.4 CityChat owns its product identity

CityChat MUST remain visibly CityChat. On a primary CityChat entry, application shell or owned product surface:

- use the approved CityChat logo/lockup for that exact role;
- do not replace it with a generic Landometer lockup, a text recreation or an LDS product-neutral mark;
- keep the approved logo colors, proportions, clear space, transparency and artwork unchanged;
- show Landometer only as a secondary ecosystem endorsement such as `Powered by Landometer`, never as the primary product identity;
- use an approved CityChat compact mark when the role cannot fit the horizontal lockup;
- omit the role when no approved variant exists rather than cropping or manufacturing one.

Logo ownership does not remove delivery governance. Header lockup, compact mark, favicon, touch icon, maskable icon, social preview, watermark and export mark remain separate asset roles. Every used role requires an exact file, hash, dimensions, surface strategy, theme behavior, approval scope and artifact binding in the CityChat identity registry.

One v0.6 approval record authorizes exactly one role. A historical combined role such as `header_and_footer_lockup` does not transfer into v0.6: header and footer require separate approval records, even when they point to the same exact bytes.

The currently supplied lockup and source files are product lineage evidence. Any artifact-local authorization remains limited to its recorded build and role until an identity owner records reusable approval.

### 2.5 Logo semiotics

The existing CityChat logo contributes four product meanings. VES preserves these meanings without tracing the logo into UI decoration.

| Logo meaning | CityChat experience translation | Boundary |
|---|---|---|
| **Callout / Voice** | A resident can ask, answer or invite one relevant person | Use conversational composition around a real prompt; do not add speech tails to every card |
| **Weight / Evidence** | A city conversation carries source, time and reason | Ground claim-bearing views with a short truth/evidence line; visual heaviness alone is not evidence |
| **Place / City** | Every conversation belongs to a real governed context | Keep place label, map/photo or context close to the story and action |
| **Approachable city data** | City information becomes one understandable local meaning | Lead with plain language and reveal technical detail on demand |

These are normative semantic cues for composition. They do not authorize a new glyph, motif asset, card geometry, animation or product capability.

### 2.6 CityChat icon and motif family

CityChat uses two distinct systems:

1. **Functional UI icons** inherit LDS `[ICON-01]`: self-hosted Material Symbols Rounded, outlined `FILL 0`, `wght 300`, `GRAD 0`, size-matched `opsz`; `FILL 1` is allowed only for an active/selected state. Every icon keeps a visible or accessible label.
2. **CityChat identity motifs** are product-owned assets that express Voice, Place, Evidence or Continuity. They require a separately approved vector/raster file, semantic role, allowed placement and hash in the CityChat motif registry.

A CityChat motif MAY support:

- a bounded entry/orientation moment;
- a question or invitation scene;
- an honest empty/no-story state;
- a persisted receipt or material return;
- a product-owned illustration or communication asset.

A motif MUST NOT:

- reconstruct, crop, trace or animate the logo;
- become a replacement UI icon;
- encode status, data magnitude, priority, risk or official authority;
- appear repeatedly as decorative wallpaper;
- use emoji, mixed icon libraries or unregistered one-off vectors;
- make a scene look active when no real change exists.

The rounded, approachable character should come from the governed icon family, composition and approved motif assets—not from approximating logo shapes in CSS or generated SVG. The logo may remain multicolor while functional icons stay simple and semantic.

### 2.7 Identity recognition test

A conforming public scene SHOULD remain recognizable as CityChat when logo and brand color are hidden. A reviewer should still find:

- a real place;
- human local meaning or a useful question;
- evidence close to the meaning;
- one civic action or clean completion;
- continuity after action when the system supports it.

Logo/color alone never passes this test. This resilience test does not permit omitting the CityChat logo from a primary owned product surface.

### 2.8 Atmosphere deletion test

Atmosphere MAY create warmth and orientation, but every atmosphere layer must have a recorded purpose.

Compare the scene with the atmosphere removed while holding facts, hierarchy and action constant. If comprehension, focal path and next action remain equal or improve, omit the layer.

Atmosphere MUST NOT:

- encode analytical value or official status;
- lower reading contrast;
- obscure a map frame or selected place;
- delay first value;
- create fake activity.

### 2.9 Warmth and natural civic voice

Warmth comes from recognition, care and clear help—not exclamation marks, hype or pretending to be a person.

CityChat copy MUST:

- sound like one person helping another person understand the same place;
- use one main thought per sentence;
- name place, matter and next action directly;
- preserve a resident’s natural wording when safe;
- acknowledge a contribution only after it is saved;
- show decision-changing limitations without opening with a warning wall;
- avoid blame, panic, guilt, bureaucratic stacks and generic AI language.

Preferred patterns:

```text
ชวนตอบ
ตอนนี้บริเวณนี้ผ่านได้ตามปกติไหม

หลังบันทึกจริง
ส่งคำตอบแล้ว
เราบันทึกไว้กับเรื่องนี้

เมื่อมีข้อมูลใหม่จริง
เรื่องที่คุณช่วยตอบมีข้อมูลใหม่
[ดูสิ่งที่เปลี่ยน]
```

Do not say a contribution “มีผล”, that an officer has seen it or that work progressed unless the owning system proves that effect.

---

## 3. CityStory Narrative System

### 3.1 Story intent

Before writing a StoryCell, the team SHOULD name the human need the presentation is trying to serve. This is a content-design hypothesis, not a truth field or public label.

Candidate citizen intents:

- curiosity;
- recognition;
- belonging;
- care;
- fairness;
- agency;
- progress;
- pride.

Candidate officer intents:

- mastery;
- relief;
- confidence about the next safe step.

An intent cannot raise a claim, create urgency, change civic priority or authorize an action.

### 3.2 Story Grammar

A StoryCell is a cognitive and civic presentation over governed evidence. Evidence MUST be resolved before copy is selected.

```text
Context / Place
→ Intent (internal only)
→ Hook: one honest thing worth noticing
→ Discovery: one step of added understanding
→ Evidence + Claim Boundary
→ Question: one answerable local question
→ Primary Action: zero or one
→ Memory: saved, pending, failed or complete
→ Refresh: when the story changes or stops appearing
```

This grammar is a candidate presentation recipe. It does not create a governed Story object, workflow state, notification trigger or personalization authority.

### 3.3 StoryCell public rendering

Public rendering SHOULD remain compact:

```text
Place and period
Hook
Discovery
Question
[Zero or one action]
Short truth line
[ดูที่มา]
```

Rules:

- one primary thought;
- one honest hook;
- one question when evidence supports one;
- zero or one primary action;
- zero to three traceable facts;
- limitation before action when it changes the decision;
- source/time near the meaning;
- method and extended detail one interaction away;
- no H3 requirement for direct or object-native StoryCell;
- community content remains visibly different from analytical or official content.

### 3.4 Hook versus headline

A headline labels content. A Hook gives one evidence-supported reason to notice it now.

Good:

```text
หลังฝนตก ช่วงหน้าตลาดมีคนบอกว่าน้ำขังนานขึ้น
```

Bad:

```text
เรื่องที่กำลังฮิตในเมือง
```

A Hook MUST NOT manufacture popularity, urgency, diagnosis, certainty or an official outcome.

### 3.5 Discovery

Discovery adds one useful step of understanding. It should answer one of:

- what changed;
- what pattern is visible;
- what remains unknown;
- why this matters to daily life;
- what a person in this place can help verify.

Discovery is not a list of metrics and not an AI-generated interpretation without traceable evidence.

### 3.6 No-story fallback

No story is a valid result.

When evidence cannot support an honest and useful Hook, show:

```text
ตอนนี้ยังไม่มีข้อมูลพอที่จะเล่าเรื่องนี้
ลองดูข้อมูลที่มี หรือเลือกพื้นที่อื่น
```

The fallback MUST:

- preserve the selected place/context;
- state the reason in plain language;
- offer a safe alternative or clean completion;
- never turn no-score into zero;
- never invent filler to keep a feed alive.

### 3.7 Candidate narrative families

The following remain candidate examples until approved by the owning Product Brief/ADR and backed by data contracts:

1. People Mix & Time Rhythm;
2. Service Question Signal;
3. Participation Momentum / Progress Memory.

Narrative family selection, scoring, weighting, half-life and personalization are outside VES authority.

---

## 4. Civic Continuity, Memory and Return

### 4.1 Human continuity loop

```text
เห็นเรื่องในพื้นที่
→ เข้าใจว่าเกิดอะไรหรือกำลังถามอะไร
→ ช่วยตอบหรือทำหนึ่งอย่าง
→ รู้ว่าส่งแล้ว กำลังรออะไร หรือทำไม่สำเร็จ
→ กลับมาดูเมื่อมีสิ่งสำคัญเปลี่ยน
→ ชวนคนที่เกี่ยวข้องเมื่อช่วยให้เรื่องชัดขึ้นจริง
```

This is a frontstage experience map, not a workflow-status registry. It maps to the approved owning civic loop when one exists. The current PB8 loop remains directional until approval.

### 4.2 Action ending contract

Every primary action MUST end in exactly one of:

- persisted receipt;
- honest pending state;
- failure with preserved input and recovery;
- clean completion.

No dead-end toast, optimistic official state or forced next action.

### 4.3 Contribution Memory

Contribution Memory is a view over a persisted receipt or versioned event. It MUST show:

- what was saved;
- object/context and version;
- saved time;
- visibility or who can see it;
- authoritative current state when one exists;
- correction, withdrawal or dispute route when applicable;
- return trigger or clean completion.

It MUST NOT render from a local click, animation completion or client-only acknowledgement.

### 4.4 Valid return triggers

A return invitation MUST be caused by a material versioned event, such as:

- a new question relevant to a followed place;
- new evidence that changes interpretation;
- an authoritative workflow update;
- information required from the user;
- a real outcome, correction or data-maturity update.

Invalid return triggers:

- likes, rank or generic activity;
- synthetic “someone is viewing” events;
- arbitrary reminders;
- changes that do not affect meaning or action.

One scene/state MUST surface at most one return invitation. One artifact MUST promote at most one enabled return loop, while it MAY contain multiple governed recipes that do not compete in the same artifact state. Exit has no penalty.

### 4.5 Progress-return view

A progress-return view MUST answer:

1. what changed;
2. why the user is seeing it;
3. who or which system confirmed it;
4. when it changed;
5. what the user can do next, if anything.

Only the changed information receives emphasis. Do not replay the whole entry experience.

### 4.6 Relevant-circle sharing

Share appears only after value and only when object, destination, visibility, authorization and public-safe projection are release-proven.

A share preview MUST show:

1. why another person is relevant;
2. the exact safe object/version being shared;
3. place and current source/status;
4. who can see it;
5. one share action.

Preferred copy:

```text
ยังขาดคำตอบจากคนที่ใช้พื้นที่ช่วงเย็น
ชวนคนที่ใช้พื้นที่ช่วงนี้มาช่วยตอบ เพื่อให้เห็นภาพครบขึ้น
[ดูตัวอย่างก่อนแชร์]
```

`คัดลอกแล้ว` or `ส่งแล้ว` is a handoff acknowledgement, not delivery, understanding, useful action or outcome.

### 4.7 LINE and channel continuity

LINE is a conditional adapter, not a required CityChat capability.

When release-proven, a LINE recipe SHOULD use:

- zero/one evidence-supported question;
- quick reply before long form;
- progressive detail;
- real persistence or honest failure;
- resumable context;
- no simulated human officer.

Channel simplification may change layout, never truth, permission, object/version or action effect.

### 4.8 Officer relief

Every officer recipe MUST name one workload hypothesis before implementation:

- less searching;
- less interpretation;
- fewer context switches;
- less chasing for ownership or missing information;
- less duplicate entry;
- easier preparation of a public-safe update.

The view keeps work item, place, source, version, owner/current step, evidence gap and zero/one allowed action or explicit clean completion together.

If a new surface adds work without a testable decision benefit, it SHOULD NOT be added.

Claims such as “ลดภาระ” or “ลดเวลาทำงาน” remain research hypotheses until measured against the same task and fixture.

---

## 5. Visual Foundation and Product Composition

### 5.1 No-fork rule

CityChat MUST inherit the exact selected LDS version for:

- color and semantic roles;
- typography and Thai font delivery;
- spacing, container, breakpoint, radius, depth and z-index;
- controls, icon buttons, forms, focus and state behavior;
- light/dark/system theme;
- Material Symbols and approved assets;
- motion primitives and reduced-motion behavior;
- accessibility and shared QA.

No implementation may introduce a local raw hex, font, radius, breakpoint, shadow, z-index, duration, easing or keyframe as a temporary CityChat token.

### 5.2 Semantic aliases

CityChat aliases MAY improve implementation readability only when each resolves directly to a canonical LDS variable and is recorded in the Build Card.

Allowed alias families:

- page/card/raised surfaces;
- primary/secondary/metadata text;
- border/focus roles;
- approved identity atmosphere + paired ink;
- map overlay + paired ink;
- semantic status pair from LDS.

An alias is not a new token registry. Normal actions inherit the LDS Button recipe. Product identity color never encodes analytical value, workflow status or completion.

### 5.3 Normative CityChat color recipe

CityChat keeps the visual memory of its original blue + mint/green + warm civic surfaces, but every delivered color MUST come from the exact pinned LDS registry. “Closest to the original brand” means preserving the same visual and semantic relationship—not computing or inventing a new nearest raw color at runtime.

The default CityChat identity recipe is:

| CityChat job | Required LDS role | Rule |
|---|---|---|
| Primary product identity field | `--product-citychat-gradient` | CityChat-owned identity only; never data, status, risk or button fill |
| Light-theme identity foreground | `--fg-on-deep-primary`, `--fg-on-deep-secondary` | Use as one tested field/ink contract |
| Dark-theme identity foreground | `--fg-on-light-primary`, `--fg-on-light-secondary` | Use as one tested field/ink contract |
| Existing blue trust/wordmark relationship | Exact approved logo bytes; `--brand-blue` only in its governed LDS roles | Never recolor the logo; normal UI text/actions do not inherit Brand Blue automatically |
| Participation energy | `--energy-mint` for bounded non-semantic emphasis | Never means solved, verified, saved or official by itself |
| Normal interactive action | `--interaction-accent` + LDS Button foreground/focus contract | Identity gradient and energy mint are not general button tokens |
| Public reading surfaces | `--surface-canvas`, `--surface-card`, `--surface-raised`, `--surface-beige-tint` as the scene requires | Prefer stable reading surfaces over full-screen neon fields |
| Text and metadata | `--text-primary`, `--text-secondary`, `--text-metadata` | Never reduce contrast to preserve a brand hue |
| Information, warning, danger, success, pending, assisted | Exact `--semantic-*-fill` + `--semantic-*-ink` pair | State meaning also needs text/icon/pattern; identity color cannot substitute |
| Map/data/category | Exact owning LDS map, dataviz or series registry | Keep legend, label, no-data, zero and CVD parity; never borrow product identity color |

Theme-resolved aliases MAY be emitted exactly as mappings, not as new values:

```css
:root {
  --cc-identity-field: var(--product-citychat-gradient);
  --cc-identity-ink: var(--fg-on-deep-primary);
  --cc-identity-ink-2: var(--fg-on-deep-secondary);
}

[data-theme="dark"] {
  --cc-identity-ink: var(--fg-on-light-primary);
  --cc-identity-ink-2: var(--fg-on-light-secondary);
}
```

These aliases MUST be declared in the composition manifest, resolve to the exact pinned LDS package and pass rendered sampling under the actual glyph/icon bounds. If the pinned LDS recipe changes, the artifact updates the dependency and QA evidence; it does not freeze copied raw values.

### 5.4 Translating ijji-derived color expression

CityChat may retain useful ijji-derived experience ideas—Visual Aha, small action, progress memory and relevant-circle sharing—but it MUST express them through CityChat and shared LDS roles.

- `--product-ijji-gradient` remains ijji-owned and MUST NOT appear as CityChat identity.
- Aha uses hierarchy, local meaning and the CityChat identity recipe; it does not require an ijji color.
- Small action uses the inherited LDS Button recipe.
- Progress memory uses persisted receipt/return state plus the correct semantic pair, not a completion ring color by itself.
- Relevant-circle share uses label + approved share icon + normal action treatment; it does not receive a fuchsia/viral identity.
- Assisted or generated support uses the LDS assisted semantic pair and plain source wording; it does not use violet “AI magic.”
- Household/local-foundation context uses governed neutral or beige surfaces plus an explicit label; it does not restore muddy brown.

Legacy CityChat/ijji color migration follows meaning, not hue substitution:

| Legacy intention | v0.6 governed replacement |
|---|---|
| Blue trust/evidence | Approved logo/Brand Blue role, or semantic info/source role as appropriate |
| Mint/green participation | CityChat identity field, bounded energy mint, or normal interaction role according to the job |
| Warm beige civic context | LDS canvas/card/beige-tint surfaces |
| Sky information | Semantic info pair for state; energy sky only for a named non-semantic visual role |
| Coral/yellow alert or gap | Exact semantic danger/warning pair with a useful next step |
| Violet assisted/AI cue | Semantic assisted pair + plain source label |
| Fuchsia share cue | Normal share action + share icon + recipient-benefit copy |
| Brown/land cue | Neutral/beige surface + explicit local-foundation label |

Purple, violet, fuchsia, muddy brown and other LDS-retired controlled accents MUST NOT return through a CityChat alias. If LDS has no governed role that satisfies the intended job and contrast, raise an LDS extension ADR; do not add a local color.

#### Supporting ijji-derived visual assets

CityChat MAY retain the warmth, friendliness and small-action character of an existing ijji-derived illustration or motif, but it MUST do so as a separately governed CityChat supporting asset—not by importing ijji product identity.

Before an ijji-derived supporting asset can be delivered, all of the following are required:

- an exact source asset reference and source hash;
- a derivative-rights or owner-authorization reference;
- approved CityChat-scoped derivative bytes, asset hash and allowed role;
- confirmation that no ijji logo, wordmark, protected product gradient or product-identifying trade dress remains;
- a slot-by-slot LDS color mapping for every editable color;
- rendered theme, contrast, CVD and surface evidence;
- a named CityChat identity reviewer.

The asset is omitted when any required record is unresolved. Similar appearance in a screenshot is not permission to trace, redraw or derive it.

`supporting-asset-derivative-map.json` records the approved relationship between source evidence, derivative bytes and editable color slots:

```yaml
mappingVersion: 0.6.0
mappingId: required
assetRef: required
sourceAssetRef: required
sourceAssetHash: required
derivativeRightsRef: required
roleApprovalRef: required
approvedDerivativeHash: required
familyId: required
familyVersion: required
assetClass: approved_motif | approved_supporting_derivative | photo_media
colorMode: mapped_lds_derivative_exact_bytes | currentColor_from_citychat_role | natural_media
colorRoleRef: required_when_currentColor_from_citychat_role
surfaceContractRef: required
themeStrategy: required
prohibitedMeanings: required_nonempty
acceptanceIds: required_nonempty
slots:
  - slotId: required
    sourceColorEvidenceRef: required
    semanticJob: identity_support | atmosphere | illustration_subject | illustration_background | nonsemantic_emphasis
    allowedLdsCandidateRefs: required_nonempty
    targetLdsTokenRef: required
    perceptualFitEvidenceRef: required
    renderedSurfaceRef: required
    themeContrastEvidenceRef: required
    reviewerApprovalRef: required
```

“ใกล้เคียงสีเดิม” is resolved in this order: preserve the semantic job, keep within the allowed LDS candidate set, pass the complete surface/contrast contract, then choose the closest acceptable governed token. Perceptual closeness never outranks meaning, readability, theme parity or product ownership. Runtime code consumes only `targetLdsTokenRef`; it never consumes `sourceColorEvidenceRef` as a UI value.

#### Shared LDS atmosphere by job

CityChat MAY use a shared LDS atmosphere when it supports the scene better than the CityChat identity field:

| Scene job | LDS surface + foreground contract | Boundary |
|---|---|---|
| Calm place grounding, community context, orientation | `--surface-atmosphere-ground` + `--on-atmosphere-ground` / `--on-atmosphere-ground-2` | Supporting atmosphere only; never CityChat identity, map value or official status |
| Human action, invitation, handoff or a warm completion moment | `--surface-atmosphere-cultivate` + `--on-atmosphere-cultivate` / `--on-atmosphere-cultivate-2` | Use only when it improves the named human job and passes the deletion test |
| CityChat-owned entry or identity moment | `--product-citychat-gradient` + the theme-resolved CityChat foreground contract | One bounded identity group; never a data layer or general button fill |

A compact scene MUST use at most one gradient-bearing atmosphere group. Do not combine CityChat, Ground and Cultivate gradients in the same small scene. Atmosphere is omitted when a quiet LDS surface communicates more clearly.

### 5.5 Color selection algorithm for humans and AI

For every colored element:

1. identify the job: CityChat identity, foundation surface, interaction, semantic state, map/data, category, shared atmosphere or approved motif/supporting asset;
2. select the exact role from §5.3 or its owning LDS registry;
3. select foreground, border, focus, hover and disabled behavior as one surface contract;
4. add a visible label/icon/pattern when color communicates state or category;
5. record token path, registry version/hash, theme pair and reason in `citychat-color-role-map.json`;
6. run rendered contrast, grayscale, supported CVD and theme checks;
7. fail closed when the role, pair or authority is unresolved.

An AI implementation agent MUST NOT choose a color by visual taste, parse a screenshot for a raw value, use an ijji product token inside CityChat, or promote an energy color into a semantic state. For an approved supporting derivative it MUST use the recorded target token for each slot; it cannot calculate a new “closest” color during implementation.

### 5.6 Contrast and surface contract

Every foreground, icon, border and focus ring MUST name its rendered surface.

Release checks MUST cover:

- normal text at WCAG AA on actual rendered surfaces;
- meaningful non-text and focus boundaries;
- logo/surface pair without modifying logo bytes;
- light, dark, system and supported high-contrast states;
- representative satellite/map tiles;
- disabled controls with separate readable instruction;
- Thai at 130% fixture expansion and 200% zoom;
- ramp grayscale, CVD and text/table parity when data visualization is present.

### 5.7 Identity and media

Use only exact role-authorized assets with path, role, MIME, dimensions, bytes, SHA-256, surface strategy and theme behavior recorded.

- A primary owned CityChat surface MUST use the approved CityChat identity for that role; a Landometer mark may appear only as secondary ecosystem endorsement.
- Preserve the exact CityChat logo artwork and colors. When contrast fails, change the surrounding LDS surface, use a separately approved inverse variant or block that placement; never recolor the file locally.
- The CityChat product gradient does not by itself prove that a transparent logo is readable over it. Logo/surface pairing requires rendered sampling across the real glyph/image bounds.
- Header lockup, favicon, touch icon, maskable icon and social preview are separate approval roles.
- Asset bytes and role approval are separate records. `source_only`, `candidate`, `approval_missing`, `expired` and `revoked` are never renderable states.
- Never crop, redraw, recolor, filter or reconstruct the lockup.
- Preserve component patterns, not personal screenshot pixels.
- Photos, avatars and local media require permission and visibility records.

### 5.8 Functional icon map and motif registry

Every functional icon MUST resolve through `citychat-icon-map.json` to an LDS Material Symbols Rounded glyph or a separately approved custom product glyph. The initial role map is:

| Role | Default glyph | Use boundary |
|---|---|---|
| Place/context | `location_on` | Place cue only; not proof of precise location |
| Conversation | `forum` | Story/thread entry; label states the destination |
| Source/evidence | `description` | Opens governed source detail; not verified status by itself |
| Reply | `reply` | Replies to the named object/thread |
| Share | `share` | Shown only after value and public-safe preview readiness |
| Return/history | `history` | Opens a real versioned change or history |
| Receipt | `receipt_long` | Shown only after authoritative persistence |
| Officer work | `assignment` | Opens an authorized native work item |
| Map | `map` | Opens the declared map/context view |

Exact glyph availability and localized labels are validated against the pinned LDS icon subset. A different glyph requires a versioned map change and review; a component cannot select its own synonym.

`citychat-motif-registry.json` records motif ID, meaning, asset path/hash, allowed scene/role, theme/surface contract, motion allowance, accessibility treatment and approval reference. Until a motif asset is registered, use the functional icon, real place media, product gradient or quiet surface—never a reconstructed logo motif.

### 5.9 Responsive density

Citizen first view:

- one place/context;
- one meaning or question;
- zero/one action;
- one short truth line;
- details on demand.

Active mobile map:

- one composed HUD/tray;
- at most one disclosure sheet;
- protected map-safe area;
- no overlay obscures Scan Frame/reticle/selected geometry;
- sticky controls clear safe area and keyboard.

Officer view MAY be denser, but must preserve owner/current step, evidence gap, zero/one authorized action or explicit clean completion, and public-safe projection without horizontal overflow.

### 5.10 Triggered LDS packages

Load exactly what the artifact declares and can evidence:

- every artifact: exactly one applicable LDS profile + `[PUB-01]`;
- every delivery: its matching `[DELIVERY-01]` branch;
- operational CityChat web: `citychat.app`;
- public deployable/discoverable route: `[WEB-DISCOVERY-01]` only when discovery is authorized;
- analytical evidence: `[DATA-01]`;
- map: `[MAP-01]`;
- analytical ramp/choropleth: `[DATAVIZ-01]`;
- authentication or permission control: `[AUTH-01]`;
- persistence or external effect: `[EFFECT-01]`;
- copy/link/share preview: `[SHARE-01]` as applicable;
- direct send, post or invite: `[SHARE-01] + [EFFECT-01] + [AUTH-01] + [ABUSE-INTEGRITY-01]`;
- follow/watch or persisted preference: `[HOOK-01] + [LEARN-01] + [EFFECT-01] + [AUTH-01] + [ABUSE-INTEGRITY-01]`, with delete/withdraw, pacing and no-penalty exit;
- contribution/co-creation: `[COCREATE-01] + [AUTH-01] + [ABUSE-INTEGRITY-01] + [EFFECT-01]`;
- telemetry: `[TELEMETRY-01]` with an approved semantic allowlist;
- agent-readable or bounded agent action: `[AGENT-OUT-01]` only when that artifact explicitly declares it.

Package presence does not prove product capability, effect, authorization or runtime availability.

---

## 6. Component and View Contracts

### 6.1 Base View Contract

Every CityChat view uses the same presentation envelope. This envelope references owning truth; it does not duplicate it.

```yaml
viewContractVersion: 0.6.0
viewId: required
job: required
audience: citizen | officer | public_shared
routeVariant: required
viewVariant: story | settled_scan | progress_return | no_story | restricted | recoverable_error | community | officer_work

canonicalBinding:
  schemaRef: required_when_approved_machine_schema_exists
  canonicalObjectRef: required_when_variant_has_governed_object
  objectVersion: required_when_variant_has_governed_object
  contextRef: required
  publicSafeProjectionRef: required_when_public_or_shared

authorityBinding:
  ruleAuthority: required
  sourceVersion: required
  capabilityTruthRef: required
  authorizationTruthRef: required_when_action_or_restricted
  analyticalTruthRef: required_when_analytical
  publicationTruthRef: required
  workflowTruthRef: required_when_workflow_exists

presentation:
  recipeRef: required
  identityTreatment:
    treatmentId: required
    sceneMapRef: required_at_scene_root
    ownerProduct: citychat
    mode: local | inherit | none
    productHierarchy: primary | secondary_endorsement
    requiredSignatureRefs: []
    inheritedFromRef: required_when_mode_is_inherit
    semioticFocus: callout_voice | evidence_weight | city_data_made_easy | none
    logo:
      required: boolean
      rolePreferenceRefs: []
      placementRecipeRef: required_when_required
      unresolvedPolicy: block_release | omit_role | internal_placeholder
    colorRoleRefs: []
    supportingAssetColorRefs: []
    functionalIconRoleRefs: []
    motifMeaningRefs: []
    motifGeometryRef: required_when_registered_motif_renders
    truthPreconditionRefs: []
    prohibitedRoleRefs: []
    paletteJobRef: required_when_mode_is_local
    surfaceRecipeRef: required_when_mode_is_local
    foregroundContractRef: required_when_mode_is_local
    iconGlyphMapRef: required_when_functional_icon_renders
    supportingAssetDerivativeMapRef: required_when_derived_supporting_asset_renders
    deletionTestRef: required_when_atmosphere_or_motif_renders
    acceptanceTestIds: required_nonempty
  allowedViewStates: required
  primaryActionRef: zero_or_one
  motionBindingRefs: zero_or_more

observableBindings:
  events: allowlisted_only
  effects: canonical_effect_refs_only

accessibility:
  accessibleNameSource: required
  readingOrder: required
  focusOrder: required
  announcementPolicy: required

acceptanceTestIds: required_nonempty
```

Hard rules:

- no bare `status`, `stage`, `phase`, `claim` or `evidenceStatus` field;
- no generic `onClick`; use a semantic event/effect reference;
- no local copy of canonical truth under a visual alias;
- at most one primary `semioticFocus` and one motif geometry per scene; leaf views inherit rather than mint a competing identity treatment;
- unresolved authority returns `blockedReasons` and fails closed;
- if no approved machine schema exists, record a reviewed one-to-one mapping to the exact authoring contract.

### 6.2 `FirstValueScene`

Job: reveal one real local meaning or honest no-story reason before non-intrinsic setup or engagement asks.

Every variant starts with `CityBand` or approved compact identity, `PlaceStage`/context and a short truth line. It then uses exactly one variant:

| Variant | Required composition |
|---|---|
| `story` | One `LivingCityCue` + `StoryCellNarrativeView` + zero/one `PrimaryAction` |
| `settled_scan` | Settled governed readout + coverage/freshness/no-score truth + zero/one supported question/action |
| `progress_return` | `ReturnCueView` tied to a material versioned change + zero/one action |
| `no_story` | Plain reason + safe alternative or clean completion; no invented Story object |
| `restricted` | Preserved place/context + plain denial reason + safest authorized alternative or clean completion; no leaked restricted detail |
| `recoverable_error` | Preserved place/context and safe input + what failed + one recovery action or clean completion; no receipt or optimistic state |

`ContributionMemoryView` appears only after authoritative persistence. A question is required only when the selected variant has one evidence-supported question.

### 6.3 `LivingCityCue`

This is a slot, not a truth object. Select one:

- permissioned local image;
- resident story with source/time/visibility;
- dated governed change;
- updated analytical evidence;
- authoritative public update.

Fallback to quiet place context. Never substitute a moving counter, pulse, “กำลังคึกคัก” or unsourced activity.

### 6.4 `CityBand`

Contains:

- role-authorized CityChat lockup;
- current place with accessible full label;
- role only when it changes meaning/permission/action;
- avatar/account only when permissioned;
- at most one utility action.

CityBand MUST NOT hide a map reticle or selected geometry.

### 6.5 `PlaceStage` and `PlaceThread`

`PlaceStage` grounds the scene with a map, local photo, approved illustration or governed comparison. It never independently encodes official status or proof.

`PlaceThread` anchors human conversation to the place. `MapPostCard`, `ConversationCard` and `StoryCell` remain distinct types.

### 6.6 `StoryCellNarrativeView`

Required:

- canonical context/object reference;
- one main meaning;
- zero to three facts, each with evidence reference;
- one truth/source cue;
- material limitation when needed;
- exactly one question when an honest question is supported;
- zero/one primary action;
- memory/completion and refresh references when applicable.

Direct StoryCell MUST work without H3. Scan-origin StoryCell preserves exact Locked Scan provenance.

### 6.7 `EvidenceSummary` and `EvidenceDrawer`

Layer 1:

- plain source class;
- period/update time;
- material limitation;
- `ดูที่มา`.

Layer 2:

- source/owner;
- method;
- coverage/freshness;
- grain;
- claim/value state;
- limitation and allowed use.

Layer 3 MAY expose method, QA, version history and ledger to authorized users.

### 6.8 `PrimaryAction`

The action contract includes:

- action intent;
- exact target context;
- destination or effect target;
- capability and authorization references;
- immediate consequence;
- confirmation policy;
- pending/success/failure behavior;
- idempotency/correlation reference when applicable.

Unavailable or unknown = omit. Disabled is allowed only when the user can understand and resolve the requirement.

### 6.9 `ActionReceipt` and `ContributionMemoryView`

Render only after authoritative persistence.

Required:

- receipt ID;
- action and object/version;
- persisted time;
- visibility;
- authoritative state where applicable;
- correction/withdraw/recovery;
- next trigger or clean completion.

### 6.10 `ReturnCueView`

Required:

- exact object/version;
- material change reference;
- why it is relevant;
- destination that restores context;
- current authorization/channel;
- no-penalty exit.

### 6.11 `RelevantCircleShareView`

Required:

- recipient benefit;
- exact public-safe object/version;
- visibility preview;
- verified destination/fallback;
- handoff acknowledgement distinct from recipient outcome.

### 6.12 `OfficerWorkItemView`

Required:

- native work item and schema version;
- place/context;
- authoritative owner/current step;
- evidence and missing information;
- zero/one allowed action or explicit clean completion;
- public-safe preview;
- audit/correction/closure authority.

It does not force an object-native record into H3.

### 6.13 `CityScan` compositions

CityScan remains conditional and registry-governed.

- visible Scan Frame equals the calculation geometry after safe-area insets;
- transient, settled, insufficient, error, locking and locked states remain distinct;
- no-score never becomes zero;
- coverage remains separate from score;
- LOCK uses the latest eligible atomic result;
- share/reopen rechecks current authorization;
- Direct CityStory remains independent.

VES does not authorize topic names, cardinality, scale, thresholds or runtime availability.

### 6.14 Canonical component crosswalk

| v0.5 / owning component | v0.6 presentation | Rule |
|---|---|---|
| `GovernedContextHeader` | `CityBand` | Visual variant; canonical context and authorization remain unchanged |
| `StoryCell` | `StoryCellNarrativeView` | Adds presentation recipe only; no H3 identity or parallel truth |
| `PrimaryAction` | `PrimaryAction` view | Adds consequence-oriented copy; effect/permission stay canonical |
| `ActionReceipt` | `ActionReceipt` + `ContributionMemoryView` | Memory is allowed only after authoritative persistence |
| `OutcomeReturn` | `ReturnCueView` | Requires a material versioned change and resumable destination |
| `RelevantCircleShare` | `RelevantCircleShareView` | Requires exact public-safe object, recipient benefit and authorization |
| `OfficerModerationItem` / `OperationsObject` | `OfficerWorkItemView` | Preserves native object, audit and closure authority |
| `AreaSignalStatus` / CityScan readout | CityScan composition | Preserves owning topic/state/event names at the adapter boundary |

### 6.15 Identity and semiotic binding by composition

Semiotics guide information order and emphasis; they do not create new shapes, statuses or claims.

| Composition | Default semiotic focus | Identity treatment |
|---|---|---|
| `CityBand` | `none` | Exact role-authorized CityChat identity; no decorative motif competes with the mark |
| `PlaceStage` | `none` | Real place/map/media or one bounded approved atmosphere; never proof by itself |
| `StoryCellNarrativeView` | `city_data_made_easy` | Plain local meaning first, evidence close by, technical detail on demand |
| Question region | `callout_voice` | One supported question/invitation; callout meaning comes from copy and hierarchy, not a speech-tail on every card |
| `EvidenceSummary` / `EvidenceDrawer` | `evidence_weight` | Source, period and decision-changing limitation remain visible; visual weight alone is not evidence |
| `PrimaryAction` | `none` | Inherited LDS action control and consequence copy; no product motif inside a functional button |
| `ContributionMemoryView` / `ActionReceipt` | `evidence_weight` | Exact persisted object/version/time and next trigger or clean completion |
| `ReturnCueView` | `city_data_made_easy` | One material change, why it matters here and one resumable destination |
| `RelevantCircleShareView` | `callout_voice` | Recipient relevance and safe-object preview; share icon remains functional |
| `OfficerWorkItemView` | `evidence_weight` | Owner/current step/gap/authorized action; no extra identity decoration |

`callout_voice`, `evidence_weight` and `city_data_made_easy` are presentation intents, not icons or canonical data fields. A scene MUST NOT stack several motif geometries to visualize these ideas simultaneously.

### 6.16 Required state distinctions

Visual composition MUST preserve these distinctions in words and state, not color alone:

- selected ≠ locked;
- locked ≠ published;
- replied ≠ saved;
- saved ≠ reviewed;
- reviewed ≠ accepted;
- closed ≠ outcome;
- unknown ≠ zero;
- out of coverage ≠ no event;
- stale ≠ current;
- user report ≠ official status;
- link copied/sent ≠ recipient received/understood/acted.

---

## 7. Scene Contracts

### 7.1 Citizen entry

Order:

1. CityChat identity and place;
2. one real local invitation or update;
3. one StoryCell preview or no-story state;
4. zero/one action;
5. quiet source/time line.

Do not lead with ranking, dense feed, onboarding or dashboard.

### 7.2 Direct CityStory

Order:

1. place and period;
2. Hook;
3. Discovery/main meaning;
4. evidence/limitation;
5. zero/one question, only when the evidence supports an honest, useful question;
6. zero/one action;
7. receipt/recovery/completion.

### 7.3 CityScan discovery

Order:

1. map and visible Scan Frame;
2. place/geometry;
3. registry-approved topic readouts;
4. coverage/freshness/no-score;
5. LOCK only after latest eligible result;
6. exact locked context;
7. StoryCell.

### 7.4 Community conversation

Order:

1. local media/post;
2. author/place/visibility;
3. reply/share/report as secondary tools;
4. task-specific auth only after protected action is chosen.

Community voice stays distinct from calculated evidence and municipal status.

### 7.5 Contribution and return

Order:

1. action consequence;
2. persisted/pending/failure/completion;
3. what is remembered;
4. one real return trigger or clean completion;
5. relevant-circle share only after value.

### 7.6 Officer review and close loop

Order:

1. work item and place;
2. owner/current step;
3. evidence and missing information;
4. zero/one authorized action or explicit clean completion;
5. saved authoritative state when an effect occurs;
6. public-safe update when the owning workflow authorizes one.

Citizen, receipt, return, work item and outcome may be distinct versioned objects. They connect through governed context and explicit links, not visual similarity.

---

## 8. Semantic Motion and Feedback

### 8.1 Principle

Motion makes cause, place, state and continuity easier to understand. It never supplies evidence, excitement, urgency or completion.

VES defines semantic intent only. Every implemented motion MUST bind to an allowlisted primitive from the exact active LDS package and profile. If no approved primitive fits, use no motion.

### 8.2 Motion recipes

| Recipe | Candidate LDS binding | Trigger and purpose | Stable end state | Reduced-motion equivalent |
|---|---|---|---|---|
| `place-to-story` | `motion.depth.focusIn` or `motion.hook.loopContinue` | Selected/Locked place opens its StoryCell and preserves spatial orientation | StoryCell tied to exact context/snapshot | Final StoryCell immediately; focus restored correctly |
| `question-callout` | `motion.hook.nextActionCue` or none | Supported meaning is ready and one question needs focus | Question is still and readable | Question immediately visible |
| `evidence-settle` | `motion.depth.layerCrossfade` or none | Evidence opens or a real evidence version changes | Stable source/status | Immediate expanded/final state |
| `contribution-saved` | `motion.depth.receiptStack` | Persisted action connects to receipt | Receipt with object/version/time | Immediate receipt + polite announcement |
| `outcome-return` | `motion.hook.loopContinue` | Material versioned change exists | Changed information remains labelled | Immediate changed state with text label |
| `share-preview-ready` | `motion.share.previewReveal` | Public-safe preview and destination are ready | Stable preview | Immediate preview |
| `action-press` | `motion.cta.depthPress` | Acknowledge a real control press | Control returns to stable state | Immediate state acknowledgement |

### 8.3 Motion rules

Every recipe MUST:

- run only from a user action or real state change;
- end and remain stable;
- be interruptible;
- preserve focus and reading order;
- remain complete with animation disabled;
- never delay first meaning, action readiness or receipt;
- never loop, flash, shimmer, bounce, orbit, parallax or simulate live activity;
- never animate sensitive points or personal location;
- never emit product-success telemetry from animation completion.

No local duration, curve or keyframe is allowed. `state_led` artifacts use only primitives permitted by the selected LDS profile. Decorative Riddim is not an operational-state substitute.

The bindings above are candidate selections. Each artifact MUST confirm that the named alias exists in its pinned LDS package and is permitted by the selected profile/motion intensity; otherwise the binding resolves to `none`. A motion alias never authorizes the underlying state change.

### 8.4 Motion binding contract

```yaml
semanticTransition: required
trigger:
  kind: canonical_state_transition | derived_view_transition | user_feedback
  canonicalStateTransitionRef: required_when_kind_is_canonical_state_transition
  fromDerivedViewStateRef: required_when_kind_is_derived_view_transition
  toDerivedViewStateRef: required_when_kind_is_derived_view_transition
  userFeedbackEventRef: required_when_kind_is_user_feedback
ldsMotionAlias: allowlisted_or_none
profileMotionIntensity: required
replayPolicy: once_per_trigger
reducedMotion: final_state_immediate
noJavaScript: final_state_or_honest_nonoperable_fallback
announcementSource: canonical_state_only
telemetryFromAnimation: false
```

---

## 9. Plain Language, Copy and Localization

### 9.1 Frontstage principle

Public copy follows:

```text
place or matter
→ what happened / what is being asked
→ short truth and material limitation
→ one action or completion
→ what happens next
```

Use simple verbs: `ดู`, `เลือก`, `ตอบ`, `แจ้ง`, `ติดตาม`, `แก้ไข`, `กลับไป`.

### 9.2 Frontstage versus backstage

Frontstage MUST NOT expose unexplained:

- AI/agent/inspector language;
- H3, R3, claim ceiling, schema or trigger-pack names;
- internal capability/evidence/delivery status;
- legalistic disclaimer blocks;
- system-shaped translations.

Use `ที่มา`, `อัปเดตเมื่อ`, `ยังบอกไม่ได้`, `ใครจะเห็น`, `ส่งแล้วหรือยัง`.

### 9.3 Thai and English

Thai and English are authored independently from the same evidence record.

Thai:

- one thought per sentence;
- phrase-safe line breaks;
- natural spoken work language;
- no filler politeness or bureaucratic noun stacks;
- read aloud by a citizen/officer representative.

English:

- concrete nouns and direct verbs;
- no generic AI phrasing;
- exact factual parity with Thai;
- no forced mirror of Thai word order.

### 9.4 Copy lint boundary

Automation may detect forbidden terminology, missing source mapping, multiple questions or multiple primary actions. It MUST NOT declare copy “warm” from word counts or adjectives alone. Warmth remains a named human review gate.

---

## 10. Data, Map, Accessibility, Privacy and Resilience

### 10.1 Analytical truth

- unknown ≠ zero;
- no-score ≠ no event;
- stale ≠ current;
- user report ≠ official status;
- coverage cannot raise a score;
- product identity color cannot encode an analytical scale;
- renderer, legend, readout, table and export use the same governed scale/version/breaks.

### 10.2 Map safety

- map has a text/table equivalent;
- selected geometry and boundary remain visible against representative tiles;
- panel/safe-area/keyboard changes cannot silently change calculation geometry;
- no overlay obscures Scan Frame/reticle/current place;
- latest request wins;
- previous values never ride on a new frame as current data.

### 10.3 Accessibility

Critical paths MUST support:

- keyboard, touch and switch-like navigation;
- visible focus;
- at least 44×44 CSS px controls;
- 320/360/390 px, mobile landscape, tablet and desktop;
- 130% Thai fixture expansion;
- 200% zoom without critical horizontal page scroll;
- screen-reader names and state announcements;
- reduced motion;
- Thai combining marks and long names;
- safe areas and on-screen keyboard.

### 10.4 Privacy and security

- no restricted person/household/location field in public DOM, deep link, screenshot or analytics;
- purpose and visibility are clear before submission;
- authorization is rechecked on reopen/share;
- role/tenant isolation comes from owning systems, not hidden UI;
- media rights, correction, withdrawal and retention are recorded;
- public-safe projection is explicit.

### 10.5 Failure and recovery

Failure preserves the user’s object/context and input when safe. It states what failed and what can be tried next. A failed action never produces a receipt, official state or Locked Scan ID.

---

## 11. Human and AI Implementation Contract

### 11.1 Minimal package

```text
citychat-ves/
  README.md
  citychat-ves.v0.6.md
  authorities.lock.json
  composition-manifest.citychat-ves.v0.6.json
  build-card.citychat-ves.v0.6.yml
  control-inventory.citychat-ves.v0.6.json
  capability-matrix.citychat-ves.v0.6.json

  schemas/
    view-contract.schema.json
    narrative-recipe.schema.json
    motion-binding.schema.json
    event-binding.schema.json
    authoring-task.schema.json
    authoring-result.schema.json
    acceptance-map.schema.json
    event-catalog.schema.json
    event-adapter-map.schema.json
    identity-manifest.schema.json
    identity-scene-map.schema.json
    identity-treatment.schema.json
    identity-resolution.schema.json
    logo-placement-recipe.schema.json
    icon-map.schema.json
    motif-registry.schema.json
    supporting-asset-registry.schema.json
    color-role-map.schema.json
    supporting-asset-derivative-map.schema.json
    supporting-asset-color-resolution.schema.json
    migration-map.schema.json

  identity/
    citychat-identity.manifest.json
    citychat-identity-scene-map.json
    citychat-logo-placement-recipes.json
    citychat-icon-map.json
    citychat-motif-registry.json
    citychat-supporting-assets.registry.json

  color/
    citychat-color-role-map.json
    identity-surface-matrix.json
    supporting-asset-derivative-map.json
    supporting-asset-color-resolution.json

  views/
    first-value-scene.view.json
    city-band.view.json
    story-cell.view.json
    contribution-memory.view.json
    return-cue.view.json
    relevant-circle-share.view.json
    officer-work-item.view.json

  recipes/
    first-value/
      direct-story.recipe.yml
      locked-scan-story.recipe.yml
      no-story.recipe.yml
    narrative/
      storycell-citizen.recipe.yml
      community-thread.recipe.yml
      officer-close-loop.recipe.yml
    continuity/
      contribution-memory.recipe.yml
      return-cue.recipe.yml
      relevant-circle-share.recipe.yml
    motion/
      semantic-motion.citychat.yml

  fixtures/
    th/
    en/
    state-matrix.json

  qa/
    lint-rules.json
    acceptance-map.json
    rendered-state-matrix.json
    identity-color-matrix.json
    identity-resolution-matrix.json
    event-trace.schema.json
    manual-gates.md

  telemetry/
    event-catalog.citychat-core.v0.6.json
    event-adapter-map.citychat-core.v0.6.json

  migration/
    v0.5-to-v0.6.md
    v0.5-to-v0.6.mapping.json
    parity-fixtures.json

  release/
    release-receipt.template.json
    rollback-criteria.v0.6.json

  AI_AUTHORING.md
  HUMAN_REVIEW.md
```

The composition manifest MUST pin:

- LDS DS version, authoring revision, machine package, kit, Color Set and file hashes;
- exactly one applicable LDS profile and all triggered packs;
- CityChat VES version/hash;
- Product Brief/ADR and Product Experience Profile versions/statuses;
- every applicable view, recipe, identity, logo-placement, icon, motif, supporting-asset, color-resolution, event, acceptance and migration schema ID/version/hash;
- CityChat identity/media manifest, identity scene map, logo placement recipes, exact role approvals and hashes;
- CityChat icon map, motif registry, supporting-asset registry, color-role map, supporting-asset derivative-map and artifact color-resolution versions/hashes;
- exact LDS token, Color Set and icon-subset source hashes consumed by those maps;
- capability/channel matrix;
- telemetry scope and event catalog version;
- exact automated/manual QA evidence;
- artifact build ID and release receipt.

The Build Card, control inventory, capability matrix, identity manifest, icon map, motif registry, supporting-asset registry, color-role map, applicable supporting-asset color map, event catalog, event adapter map, acceptance map and release receipt are required release inputs, not optional documentation. A package missing any applicable record is authoring-only and MUST NOT claim v0.6 conformance.

#### Identity manifest and deterministic resolver

`citychat-identity.manifest.json` separates immutable asset evidence from permission to use that asset.

Each `assets[]` record includes:

```yaml
assetId: required
assetFamily: official_citychat | citychat_motif | supporting_illustration | provider_mark | media | source_evidence
path: required
mimeType: required
intrinsicWidth: required
intrinsicHeight: required
bytes: required
sha256: required
transparentCanvas: boolean
alphaBounds: required_when_transparent
sourceClass: required
sourceVersion: required
rightsRef: required
```

Each `roleApprovals[]` record authorizes exactly one role:

```yaml
approvalId: required
assetId: required
role: header_lockup | footer_lockup | compact_product_mark | browser_tab_favicon | search_result_favicon | apple_touch_icon | maskable_app_icon | social_preview_identity | share_preview_identity | splash_identity | watermark | export_mark | source_download_only | provider_identity | identity_motif | supporting_illustration
approvalState: approved | candidate | source_only | approval_missing | expired | revoked
authorityRef: required
approvalVersion: required
effectiveAt: required
expiresAt: required_explicit_date_or_null
approvedContentHash: must_equal_asset_sha256
artifactBinding:
  mode: exact_build | named_release_series | named_urls
  refs: required_nonempty
contexts: required_nonempty
themes: required_nonempty
backdrops: required_nonempty
outputTypes: required_nonempty
surfaceDecision: direct_surface | separate_plate | integral_background | not_applicable
surfaceRef: required_when_applicable
foregroundContractRef: required_when_applicable
clearSpaceRef: required_when_visible_identity
minDeliveredSizeRef: required_when_visible_identity
themeStrategy: required
transformPolicy: none
cropPolicy: none
maskPolicy: none
filterPolicy: none
recolorPolicy: none
animationPolicy: none
evidenceRefs: required_nonempty
manualReviewRefs: required_nonempty
```

`omittedRoles[]` remains separate and records why an optional role is unavailable. A primary CityChat product surface without an eligible header or compact role blocks release. Optional favicon, touch, maskable or social roles are omitted and reported; they are never derived from another role.

Cross-field rule: `citychat_motif` assets may use only `identity_motif`; `supporting_illustration` assets may use only `supporting_illustration`. A supporting illustration cannot masquerade as a motif, provider mark or functional icon. Its role approval still binds exact artifact, scene/context, theme, backdrop and output type.

Fallback belongs only to the scene’s `identityTreatment.logo.unresolvedPolicy`. A role approval authorizes bytes and scope; it never chooses fallback behavior. The resolver applies the treatment policy after role filtering. Scene-root `requiredSignatureRefs` and `inheritedFromRef` are the only identity signature/inheritance fields; leaf views inherit them and MUST NOT declare a parallel signature set.

`citychat-identity-scene-map.json` validates against `identity-scene-map.schema.json`. Each scene record includes `sceneId`, `audience`, `job`, `viewVariant`, `identityTreatmentRef`, allowed context/theme/backdrop/output-type refs, truth preconditions and acceptance IDs. One exact scene key resolves to one treatment; overlap at the same priority fails ambiguous. Ordered role preference exists only in `identityTreatment.logo.rolePreferenceRefs`.

`citychat-logo-placement-recipes.json` validates against `logo-placement-recipe.schema.json`. Each recipe includes `placementRecipeId`, one identity role, allowed scene/container refs, LDS surface recipe, surface decision, foreground contract, clear-space/min-size refs, responsive visibility behavior, accessible-name source, prohibited transforms and acceptance IDs. It contains no raw geometry, color, breakpoint or shadow value.

`citychat-supporting-assets.registry.json` validates against `supporting-asset-registry.schema.json`. Each ijji-derived or other recolorable supporting asset record includes:

```yaml
supportingAssetId: required
assetClass: approved_supporting_derivative
lineageClass: ijji_derived | citychat_original | other_authorized_source
sourceAssetRef: required
sourceAssetHash: required
sourceRightsRef: required
derivativeRightsRef: required
approvedDerivativeAssetRef: required
approvedDerivativeHash: required
roleApprovalRef: required
allowedSceneRefs: required_nonempty
colorMode: mapped_lds_derivative_exact_bytes
derivativeMapRef: required
prohibitedTargetTokenPrefixes:
  - product.ijji
  - --product-ijji
accessibilityTreatmentRef: required
acceptanceIds: required_nonempty
```

For `lineageClass: ijji_derived`, `mapped_lds_derivative_exact_bytes` is mandatory. `preserve_exact_bytes`, a missing derivative map, or any `product.ijji.*`/`--product-ijji-*` target fails validation. This rule prevents an approved motif classification from bypassing the slot-by-slot LDS remap.

`roleApprovalRef` is the single approval key. For a supporting derivative it MUST be identical in the supporting-asset registry, derivative map and runtime color resolution. Schemas reject a missing or different value; no secondary asset/color approval field is allowed.

Supporting-asset color resolution uses exactly one mode:

```yaml
resolutionId: required
assetRef: required
assetClass: official_citychat | provider_mark | material_symbol | approved_motif | approved_supporting_derivative | photo_media | map_data
colorMode: preserve_exact_bytes | mapped_lds_derivative_exact_bytes | currentColor_from_citychat_role | owning_data_registry | natural_media
roleApprovalRef: required_when_official_provider_motif_or_supporting_derivative
fontManifestRef: required_when_material_symbol
mediaRightsRef: required_when_photo_media
colorRoleRef: required_when_currentColor_from_citychat_role
owningRegistryRef: required_when_owning_data_registry
derivativeMapRef: required_when_mapped_lds_derivative_exact_bytes
surfaceContractRef: required
themeStrategy: required
prohibitedMeanings: required_nonempty
acceptanceIds: required_nonempty
```

Resolution rules:

1. Official CityChat and provider marks use `preserve_exact_bytes`; fix contrast with an approved clean surface/plate or block.
2. Material Symbols use `currentColor_from_citychat_role` through the exact icon map and LDS token.
3. An approved motif uses only the color mode allowed by its role approval; `currentColor` requires an explicit CityChat color-role mapping.
4. An approved supporting derivative uses `mapped_lds_derivative_exact_bytes`, an exact derivative hash and complete slot map; an ijji-derived record rejects every ijji product token target.
5. A photo uses `natural_media`; any scrim is an exact LDS surface recipe.
6. A map/data asset uses `owning_data_registry`; CityChat identity roles are prohibited.
7. Unknown, ambiguous or unapproved input is omitted or blocks according to the scene policy.

No authored raw color, sampled screenshot/logo value, `color-mix`, relative-color function, invented gradient, opacity/filter rescue or cross-product token is allowed. The only exceptions are exact hash-approved asset bytes and machine-generated LDS delivery metadata copied with provenance.

`identity-resolution.json` validates against `identity-resolution.schema.json` and includes:

```yaml
resolutionVersion: 0.6.0
resolverVersion: required
evaluationTime: required_supplied_input
inputSnapshots:
  - ref: required
    sha256: required
selectedAssets:
  - roleApprovalRef: required
    assetRef: required
    sha256: required
    role: required
selectedColorRoleRefs: []
selectedGlyphRefs: []
selectedMotifRefs: []
fallbackApplied: none | block_release | omit_role | internal_placeholder
blockedReasons: []
canonicalSerialization: RFC8785_JCS
outputSha256: required
```

Input arrays are sorted by stable record ID before evaluation; output arrays are sorted by stable semantic key before RFC 8785 JSON Canonicalization Scheme serialization. `evaluationTime` is supplied and hashed as an input; the resolver MUST NOT read the wall clock implicitly. `outputSha256` equals `SHA-256(JCS(resolution payload with the outputSha256 member omitted))`, then the digest is inserted into the final envelope. Reference/hash pairs are atomic objects and schemas reject duplicates, missing pairs or length/order ambiguity.

The identity resolver MUST:

1. pin and verify LDS, VES, identity manifest, scene map, icon map, motif registry and color-map hashes;
2. load the exact scene record by scene, audience and job—never by visual similarity;
3. walk only `identityTreatment.logo.rolePreferenceRefs` and keep approvals whose state, hash, time, artifact binding, context, theme, backdrop and surface decision match;
4. apply only `identityTreatment.logo.unresolvedPolicy` when no candidate remains, and fail ambiguous when more than one same-priority candidate remains;
5. resolve CityChat color roles to the exact LDS reference plus complete foreground/focus contract;
6. resolve functional icons through the pinned glyph map/subset and motifs only when truth preconditions and approvals match;
7. emit `identity-resolution.json` with selected approval/role/hash/token/glyph/motif/fallback and `blockedReasons`;
8. produce a byte-identical JCS resolution and matching `outputSha256` when replayed with identical snapshots, hashes, resolver version and evaluation time.

Humans and AI cannot mint an asset variant, approval, glyph synonym, token alias or role during resolution.

### 11.2 Narrative recipe contract

```yaml
recipeVersion: 0.6.0
id: required
status: candidate | approved
approval:
  approvalRef: required_when_status_is_approved
  effectiveAt: required_when_status_is_approved
  approvedContentHash: required_when_status_is_approved
ruleAuthority: required_nonempty
sourceVersion: required
productScope: citychat
mediaStatus: captured | conceptual | generated | editorial | not_applicable
audience: citizen | officer | public_shared
intent: required
governedObjectPattern: required
requiredCanonicalInputs: []
conditionalCanonicalInputs: []

slots:
  localHook:
    sourcePath: required_when_story_exists
    evidenceRefRequired: true
  mainMeaning:
    sourcePath: required
    cardinality: 1
  facts:
    sourcePath: required
    cardinality: 0..3
    evidenceRefRequired: true
  truthCue:
    sourcePath: required
  materialLimitation:
    sourcePath: required_when_interpretation_changes
  question:
    sourcePath: required_when_supported
    cardinality: 0..1
  primaryAction:
    sourcePath: required_or_deliberate_none
    cardinality: 0..1
  memory:
    sourcePath: receiptRef
    requiredWhen: persisted_effect

returnTriggerRef: required_when_a_governed_return_exists
refreshRef: required_when_story_or_return_can_expire_or_change
completion: next_trigger | clean_completion | recovery

officerRelief:
  burdenCategory: required_when_audience_is_officer
  hypothesis: required_when_audience_is_officer
  baselineTaskRef: required_when_audience_is_officer
  measurementPlanRef: required_when_audience_is_officer
  outcomeEvidenceRef: optional_until_measured

fallbackRef: required
motionBindingRefs: []
eventBindingRefs: []
acceptanceTestIds: required_nonempty
```

### 11.3 Authoring task

Humans and AI use the same structured task file.

```yaml
authoringTaskVersion: 0.6.0
taskId: required
authorityLedger:
  lds: required
  cityChatVes: required
  productProfile: required_or_unresolved
  productBriefOrAdr: required
  datasetOrWorkflowRegistries: []
releaseScope: required
audience: required
intent: required
routeRecipeRef: required
locale: required
canonicalContextRef: required
truthEnvelopeRef: required
evidenceRefs: required_nonempty
availableActionRefs: []
capabilityMatrixRef: required
identityManifestRef: required_for_citychat_owned_surface
colorRoleMapRef: required
iconMapRef: required_when_icons_render
motifRegistryRef: required_when_motif_renders
supportingAssetRegistryRef: required_when_supporting_asset_renders
supportingAssetDerivativeMapRef: required_when_supporting_derivative_has_editable_color_slots
assetRightsRef: required_when_media_identity_motif_or_supporting_asset_renders
```

Required outputs:

```text
view-model.json
copy/th.json
copy/en.json when English is in scope
source-map.json
unresolved.json
lint-report.json
human-review-record.yml
```

`authoring-result.schema.json` MUST require:

```yaml
authoringResultVersion: 0.6.0
taskId: required
generatedArtifactRefs: required_nonempty
sourceMapRef: required
authoritySnapshotRef: required
identityResolutionRef: required_when_citychat_identity_or_provider_mark_renders
colorResolutionRef: required_when_color_renders
iconResolutionRef: required_when_functional_icon_renders
motifResolutionRef: required_when_motif_renders
unresolvedRefs: []
blockedReasons: []
lintReportRef: required
acceptanceMapRef: required
humanReviewRecordRef: required
approvalClaim: prohibited
```

If `blockedReasons` is non-empty, the result MUST identify the affected route/view/control and honest fallback. It may remain reviewable, but it cannot be promoted to approved or release-ready by an authoring agent.

### 11.4 AI implementation rules

An implementation agent MUST:

1. use only supplied canonical inputs;
2. preserve exact authority/status values;
3. resolve evidence, capability, authorization and effect before rendering copy or controls;
4. keep Direct CityStory independent from CityScan;
5. treat StoryCell as a cognitive view, never an H3 identity;
6. use one primary thought, zero/one question and zero/one primary action;
7. omit unresolved actions and use an honest fallback;
8. create receipt, memory and return only from persisted state;
9. bind motion to the active LDS recipe and introduce no local values;
10. preserve the approved CityChat logo/mark for its exact role and keep Landometer secondary;
11. select every color through `citychat-color-role-map.json`, never from screenshot sampling, another product gradient or aesthetic guesswork;
12. resolve icons through `citychat-icon-map.json` and motifs through `citychat-motif-registry.json`; omit unresolved assets;
13. use an ijji-derived or other supporting derivative only when source/derivative rights, CityChat role approval, exact derivative hash and every editable color-slot mapping are supplied; never redraw or remap it at runtime;
14. use at most one primary semiotic focus and one motif geometry per scene;
15. write natural Thai from evidence, not by translating an English template;
16. source-map every fact and public claim;
17. return `blockedReasons` rather than inventing truth, workflow, officer action, notification or release evidence.

AI output cannot approve a rule, asset, claim, release or runtime capability.

### 11.5 Human review gates

The Build Card names reviewers for:

- source/authority verification;
- evidence and material limitation;
- Thai citizen/officer read-aloud;
- privacy/security/media rights;
- CityChat identity ownership, exact asset roles/hashes and Landometer endorsement hierarchy;
- LDS color-role mapping, logo/surface contrast, icon map, motif/supporting-asset registries, derivative rights and slot-by-slot supporting-asset color mapping;
- effect/persistence/recovery;
- final release approval.

### 11.6 Deterministic lint rules

| Rule ID | Release-blocking condition |
|---|---|
| `CC-LINT-AUTH-001` | Authority version/hash is missing or unresolved but presented as approved |
| `CC-LINT-AUTH-002` | Bare status/stage/phase/claim/evidenceStatus or parallel truth schema |
| `CC-LINT-TOKEN-001` | Local raw color/font/radius/breakpoint/shadow/z-index/motion value |
| `CC-LINT-IDENTITY-001` | Primary CityChat surface omits/substitutes CityChat identity, promotes Landometer to primary, or uses an asset outside its approved role/build |
| `CC-LINT-IDENTITY-002` | CityChat logo/mark is redrawn, traced, recolored, filtered, cropped, distorted or placed on an unapproved/failing surface |
| `CC-LINT-IDENTITY-003` | `source_only`, candidate, `approval_missing`, not-yet-effective, expired-by-date or revoked asset renders; approved hash differs; required approval proof is absent; or build/context/theme/backdrop/output-type/surface-decision scope mismatches |
| `CC-LINT-IDENTITY-004` | Scene/treatment resolution is missing, role scope mismatches, or multiple same-priority eligible assets remain ambiguous |
| `CC-LINT-ASSET-001` | Supporting/ijji-derived asset lacks exact source/hash, derivative rights, CityChat role approval, approved derivative hash or registered usage |
| `CC-LINT-COLOR-001` | Color is absent from the pinned LDS registry/CityChat role map, or CityChat consumes another product's identity gradient |
| `CC-LINT-COLOR-002` | Identity/energy color encodes status, data, priority, risk or completion without an owning semantic/data role and redundant cue |
| `CC-LINT-COLOR-003` | Raw/synthesized/sampled/relative/mixed/invented-gradient/cross-product color appears, or supporting-asset color mode/slot conflicts with its class or approval |
| `CC-LINT-ICON-001` | UI icon bypasses the pinned CityChat glyph map/LDS icon subset, mixes icon families, uses emoji, or changes locked axes |
| `CC-LINT-ICON-002` | Glyph is absent from the self-hosted subset, lacks visible/accessible label, uses FILL 1 outside selected state, or uses a brand/motif as a functional control |
| `CC-LINT-MOTIF-001` | Motif is unregistered, reconstructs logo geometry, acts as a UI icon/state/data cue, or renders outside its approved role |
| `CC-LINT-MOTIF-002` | Motif truth precondition, deletion test, scene placement or role approval fails; several motifs compete; or motif implies evidence/status/persistence absent from canonical truth |
| `CC-LINT-FV-001` | Auth/profile/follow/share/permission request precedes first value without a versioned `intrinsicRequirementRef` from the owning flow |
| `CC-LINT-FV-002` | Value-ready lacks place, meaning, truth cue, supported-question state or deliberate action/completion state |
| `CC-LINT-STORY-001` | Main meaning ≠1, facts >3, question >1 or primary action >1 |
| `CC-LINT-STORY-002` | Fact/qualifier has no evidence reference |
| `CC-LINT-STORY-003` | No-story/no-score is turned into a story or zero |
| `CC-LINT-COPY-001` | Frontstage contains unexplained AI/inspector/internal jargon or warning wall |
| `CC-LINT-ACTION-001` | Dead/generic control, unknown effect or missing recovery |
| `CC-LINT-RECEIPT-001` | Receipt before persistence or optimistic official state |
| `CC-LINT-RETURN-001` | Return cue lacks exact object/version/change/destination or appears before value |
| `CC-LINT-SHARE-001` | Share before value, unsafe object or handoff treated as outcome |
| `CC-LINT-MOTION-001` | Non-LDS motion, wrong profile intensity, loop/replay or animation telemetry |
| `CC-LINT-TELEM-001` | Event outside the closed catalog, private payload or cognition inference |
| `CC-LINT-AI-001` | Generated content lacks source map or promotes authority |
| `CC-LINT-OFFICER-001` | Officer view lacks owner/current step/gap/zero-or-one authorized action or clean completion/public-safe view |
| `CC-LINT-OFFICER-002` | Officer recipe lacks burden hypothesis, baseline task or measurement plan |
| `CC-LINT-RESP-001` | Overflow, containment, safe-area or long-Thai test fails |
| `CC-LINT-A11Y-001` | Focus/order/announcement/zoom/reduced-motion test fails |

Lint output MUST include rule ID, severity, file, path/line, expected, actual, source-rule references and `releaseBlocking`.

`acceptance-map.json` is normative for a package and MUST validate against `acceptance-map.schema.json`. Each record declares:

```yaml
acceptanceId: CC-AC-...
appliesTo:
  profileRefs: []
  routeRecipeRefs: []
  viewRefs: []
assertion: deterministic_or_named_human_judgement
automationClass: static | schema | rendered | state_trace | integration | human
sourceRuleRefs: required_nonempty
relatedLintRuleIds: []
fixtureRefs: required_nonempty
expectedEvidenceRef: required
releaseBlocking: true | false
```

A lint rule and an acceptance gate never share an ID. “Intrinsic” requirements, approvals and human judgements are never guessed: they require an owning reference, named reviewer or explicit unresolved result.

### 11.7 Event and telemetry semantics

Events describe observable system behavior, not inferred understanding.

The v0.6 core catalog is closed to the following semantic event IDs:

- `story_answer_presented` — a stable answer frame rendered; not comprehension;
- `evidence_opened`;
- `question_answer_started`;
- `action_persisted`;
- `action_failed_recovery_offered`;
- `receipt_resumed`;
- `scan_settled`;
- `scan_no_score_reason_presented`;
- `locked_scan_persisted`;
- `share_handoff_completed`;
- `officer_state_transitioned`;
- `close_loop_delivery_confirmed`.

An artifact MAY use only the applicable subset declared in `event-catalog.citychat-core.v0.6.json`. A new event ID requires a versioned catalog change, payload schema, privacy review, adapter mapping and approval; it cannot be invented inside a component or generated output.

Each event binding records authoritative precondition, context/correlation refs, payload allowlist, deduplication, prohibited inference, privacy review and acceptance ID.

`event-adapter-map.citychat-core.v0.6.json` MUST map every emitted semantic event to its owning source event or explicitly mark it `view_only`. It records source system, source event/version, canonical context and object/version refs, projection rule, required persistence/authorization, deduplication key and prohibited inference. Missing or ambiguous mapping fails closed.

Canonical CityScan events retain their owning names at the adapter boundary. For example, `scan_locked` may project to `locked_scan_persisted` only after authoritative persistence; both records share the exact governed object/version and correlation reference. The projection never promotes exposure into persistence, comprehension or outcome.

Do not include private text, contacts, share message, clipboard contents, unnecessary exact location or inferred sensitive attributes.

### 11.8 Implementation order

1. Resolve Build Card, authority ledger and open decisions.
2. Pin and validate exact LDS machine package and asset roles.
3. Add Base View Contract without changing visuals.
4. Build Direct Story `FirstValueScene` plus no-story/restricted/error branches.
5. Bind StoryCell to narrative and warmth recipes.
6. Add `ActionReceipt`/`ContributionMemoryView` from real persistence.
7. Add ReturnCue and relevant-circle share only when capability/effect is proven.
8. Bind semantic motion to LDS.
9. Add CityScan after geometry/data/LOCK/replay gates.
10. Add officer workflow from native owning objects/statuses.
11. Add LINE/follow adapters only when channel, permission, destination and persistence pass.
12. Generate lint, rendered, accessibility, manual and release evidence.

---

## 12. Performance and Outcome Measurement

### 12.1 Separate exposure, understanding and outcome

- `first_value_ready` is a QA marker for stable rendering, not a cognition event.
- Comprehension requires a user study or validated task measure.
- Action persistence comes from the owning effect.
- Civic outcome requires authoritative evidence beyond the handoff.

### 12.2 Product-specific measures

Each implementation SHOULD measure under a declared build/device/network fixture:

- time to first stable local meaning;
- time until eligible primary action is ready;
- evidence-detail response;
- action acknowledgement and persistence latency;
- context restoration on return;
- task completion and recovery;
- officer context switches, missing-information discovery and correction rate.

Targets other than inherited LDS profile budgets remain candidate until approved. Do not copy v0.3 performance numbers without current fixture evidence.

### 12.3 Benefit claims

Do not claim:

- “understood” from a render/open event;
- “reduced workload” without same-task evidence;
- “delivered” from copy/send;
- “outcome” from closure status alone;
- “live” from periodic or static data.

---

## 13. Migration from v0.5 to v0.6

### M0 — Freeze and pin

- preserve v0.5 as immutable historical evidence;
- pin LDS, v0.5, product profile, brief/ADR and registry hashes;
- inventory every CityChat logo, compact mark, icon, motif, illustration and ijji-derived lineage asset with exact path/hash/rights/role status;
- record real approver/effective date;
- keep unresolved decisions visible.

### M1 — Contract envelope, no visual reset

- wrap existing CityBand, StoryCell, PrimaryAction, ActionReceipt and OfficerWorkItemView;
- replace generic callbacks with semantic event/effect refs;
- add acceptance IDs;
- keep the protected CityChat logo bytes, approved assets and visual silhouette;
- bind functional icons to the LDS glyph map and record unresolved identity roles rather than manufacturing variants.

Identity migration boundaries:

- the PNG `94055c9b…` remains authorized only by the recorded v0.5 artifact-local scope for build `citychat-ui-20260822-02`; v0.6 does not inherit that approval;
- header and footer become separate v0.6 role approvals only after an identity owner records them;
- symbol SVG `4d8dfd72…` and lockup SVG `3a3cd1b4…` remain source-download evidence, not runtime/compact/favicon approval;
- favicon, touch, maskable and social roles remain omitted until independently approved;
- provider marks remain separately approved identity assets and never become functional icons;
- parity fixtures preserve exact CityChat logo bytes, product prominence, place, meaning and action continuity—not legacy CSS hue matching.

### M2 — Direct Story first value

- add `FirstValueScene`;
- put local meaning before login/setup/follow/share;
- add no-story/restricted/error branches;
- preserve Direct Story independence from CityScan.

### M3 — Narrative and warmth

- add Story Intent and Story Grammar recipes;
- add real `LivingCityCue`;
- add Thai source map and read-aloud review;
- keep protected CityChat logo/mark bytes unchanged;
- create no local token values;
- allow a supporting-asset derivative only after source/derivative rights, CityChat-scoped role approval, exact derivative hash and slot-by-slot LDS color mapping pass.

### M4 — Memory and continuity

- add `ContributionMemoryView`;
- add exact resumable receipt/return route;
- add RelevantCircleShare only for release-proven destinations;
- keep LINE conditional.

### M5 — Semantic motion

- map transitions to exact LDS primitives;
- remove local timing/easing/keyframes;
- add reduced/no-JS/state trace tests.

### M6 — Events and telemetry

- use allowlisted semantic events;
- deduplicate and apply privacy rules;
- keep QA timing separate from cognition telemetry.

### M7 — Officer relief

- add same-task officer fixtures;
- test context restoration, missing information, duplicate and recovery;
- do not claim workload reduction before evidence.

### M8 — Parity and release

- run schema, static, rendered, state, a11y and manual gates;
- preserve v0.5 route/object/link parity;
- generate `v0.5-to-v0.6.mapping.json` with every prior route, view ID, derived state, renamed/deprecated alias, replacement and sunset condition;
- run `parity-fixtures.json` against the same governed objects, facts, places, dates, permissions and effects;
- record rollback criteria and the last verified v0.5 immutable artifact before traffic moves;
- claim v0.6 conformance only after migration parity and an artifact-specific release receipt; normative approval alone is not conformance evidence.

Rollback is required when a critical route, object/version restoration, authorized action, receipt/recovery, accessibility meaning or public-safe projection regresses; it is also required for an unauthorized identity asset, missing primary CityChat identity, asset hash/scope/surface failure, cross-product identity substitution, or state/data color collision. Visual difference alone is not a rollback trigger when the v0.6 contract and upstream authority are satisfied.

`v0.5-to-v0.6.mapping.json` validates against `migration-map.schema.json` and records `migrationVersion`, exact from/to artifact and source hashes, prior route/view/state/asset-role IDs, replacement IDs, compatibility adapter, parity fixture, deprecation state, sunset condition, rollback trigger and owner. An unmapped v0.5 public route, state or identity role blocks migration parity.

---

## 14. Acceptance and Release Gates

These gates are additive to all applicable LDS, product, CityScan, data, privacy, security and deployment gates.

### 14.1 First value

- [ ] `CC-AC-FV-01` First stable citizen viewport shows place + one honest local meaning, or an honest no-story/no-score reason with a safe alternative or clean completion; a question appears only when evidence supports it, before non-intrinsic setup/login/dashboard.
- [ ] `CC-AC-FV-02` Source class and decision-changing limitation are visible.
- [ ] `CC-AC-FV-03` Zero/one action states its expected immediate consequence.
- [ ] `CC-AC-FV-04` Logo, atmosphere, map or animation alone does not count as first value.
- [ ] `CC-AC-FV-05` Unsupported story produces no-story fallback, never filler.
- [ ] `CC-AC-FV-06` First value remains complete with motion disabled and no JavaScript where the route can be static.
- [ ] `CC-AC-FV-07` Operational artifact meets its selected LDS profile AHA budget under a declared fixture.

### 14.2 Narrative and identity

- [ ] `CC-AC-STORY-01` Evidence resolves before Hook copy.
- [ ] `CC-AC-STORY-02` One primary thought, one Hook, zero/one question and zero/one action.
- [ ] `CC-AC-STORY-03` StoryCell does not require H3.
- [ ] `CC-AC-STORY-04` Resident report, calculated data and municipal status remain distinct.
- [ ] `CC-AC-STORY-05` Memory/Refresh reference owning contracts or are omitted.
- [ ] `CC-AC-IDENTITY-01` With logo/color hidden, reviewer still finds place, human meaning, evidence and civic action/completion.
- [ ] `CC-AC-IDENTITY-02` Atmosphere passes a recorded deletion test.
- [ ] `CC-AC-IDENTITY-03` Every rendered identity asset matches exact bytes/hash and one valid role approval for the current build, context, theme and backdrop.
- [ ] `CC-AC-IDENTITY-04` Primary CityChat surfaces keep CityChat primary; compact/favicon/touch/maskable/social/export roles are independently approved or explicitly omitted.
- [ ] `CC-AC-IDENTITY-05` Actual-size logo/surface recognition and intrinsic ratio pass with no crop, recolor, filter, opacity, mask or animation.
- [ ] `CC-AC-IDENTITY-RESOLVE-01` Identical resolver inputs replay identically; missing or ambiguous approval fails closed.
- [ ] `CC-AC-IJJI-01` Visual Aha, small action, progress memory and relevant-circle value use CityChat/LDS behavior without an ijji product token, brand/identity asset, unapproved literal graphic or copied product language; an approved CityChat-scoped derivative still passes its own rights/hash/slot-map gates.
- [ ] `CC-AC-WARMTH-01` Thai passes citizen/officer read-aloud without internal or AI language.

### 14.3 Civic continuity

- [ ] `CC-AC-LOOP-01` Every action ends in persisted, pending, recoverable failure or clean completion.
- [ ] `CC-AC-LOOP-02` Receipt matches object/version/time/visibility.
- [ ] `CC-AC-LOOP-03` Return is caused by a material versioned event.
- [ ] `CC-AC-LOOP-04` Share appears only after value and explains recipient relevance.
- [ ] `CC-AC-LOOP-05` Share preview uses current public-safe projection and rechecks authorization.
- [ ] `CC-AC-LOOP-06` No rank, count or generic activity drives civic priority.
- [ ] `CC-AC-LOOP-07` Handoff acknowledgement is not presented as recipient outcome.

### 14.4 Motion

- [ ] `CC-AC-MOTION-01` Every recipe maps to pinned LDS motion or uses no motion.
- [ ] `CC-AC-MOTION-02` No local duration/easing/keyframe exists.
- [ ] `CC-AC-MOTION-03` Final meaning, focus and state remain complete under reduced motion.
- [ ] `CC-AC-MOTION-04` Interrupted transition/back/forward restores correct context.
- [ ] `CC-AC-MOTION-05` Motion never blocks first meaning, action or receipt.
- [ ] `CC-AC-MOTION-06` No animation produces telemetry, urgency or fake live state.

### 14.5 Officer benefit

- [ ] `CC-AC-OFFICER-01` Within 15 seconds, officer identifies item/place, owner/step, gap, zero/one authorized action or clean completion, and public-safe projection.
- [ ] `CC-AC-OFFICER-02` Recipe names one workload hypothesis and measurement plan.
- [ ] `CC-AC-OFFICER-03` No workload-benefit claim appears before same-task evidence.
- [ ] `CC-AC-OFFICER-04` Native object/version/audit/closure authority remain intact.

### 14.6 Human/AI implementation

- [ ] `CC-AC-DEV-01` LDS, VES, product/ADR, asset and capability versions are pinned.
- [ ] `CC-AC-DEV-02` View contracts reference owning schemas and do not duplicate truth/status/effect.
- [ ] `CC-AC-DEV-03` Unknown capability, authorization, destination or persistence fails closed.
- [ ] `CC-AC-DEV-04` Direct Story, no-story and Locked Scan paths pass separately.
- [ ] `CC-AC-DEV-05` Generated implementation records fixture, authority refs, source map and acceptance IDs.
- [ ] `CC-AC-DEV-06` No v0.3 token, StoryCell=H3, fake liveness or optimistic receipt returns.
- [ ] `CC-AC-DEV-07` AI output has named human reviews and no authority-promotion claim.

### 14.7 Visual, responsive and accessibility

- [ ] `CC-AC-VISUAL-01` Exact identity/media role and hash recorded.
- [ ] `CC-AC-VISUAL-02` No protected asset is redrawn, recolored, cropped or filtered.
- [ ] `CC-AC-VISUAL-03` No local raw visual or motion values.
- [ ] `CC-AC-COLOR-01` Every rendered color resolves to the pinned LDS or owning data registry; no raw synthesis, sampling or cross-product identity role exists.
- [ ] `CC-AC-COLOR-02` When identity/energy color is removed, state, data, priority, risk, saved and completed meanings remain intact.
- [ ] `CC-AC-ASSET-COLOR-01` Every visual asset uses one class-appropriate color mode and proof—role/hash for identity/motif/derivative, font manifest for Material Symbols, rights for media or owning registry for map/data—plus a complete surface contract; every editable derivative slot resolves to its approved LDS target.
- [ ] `CC-AC-ICON-01` Exact Material Symbols Rounded role map, axes, subset and visible/accessible label pass.
- [ ] `CC-AC-MOTIF-01` Motif exact asset/hash/role/scene/truth precondition and deletion test pass; at most one motif geometry leads the scene.
- [ ] `CC-AC-CONTRAST-01` Foreground/surface pairs pass rendered contrast.
- [ ] `CC-AC-RESP-01` No horizontal overflow at 320/360/390, landscape, tablet and desktop.
- [ ] `CC-AC-RESP-02` 120+ Thai characters, long place/person names and combining marks remain readable.
- [ ] `CC-AC-A11Y-01` 200% zoom, keyboard, focus, 44px targets and safe areas pass.
- [ ] `CC-AC-MAP-01` Map has text/table equivalent and protected geometry.

### 14.8 Effect, privacy and release

- [ ] `CC-AC-EFFECT-01` Action persists or shows failure/recovery; duplicate effect prevented.
- [ ] `CC-AC-EFFECT-02` Receipt/closure copy comes only from owning authority.
- [ ] `CC-AC-PRIVACY-01` No restricted field leaks through DOM, link, screenshot or analytics.
- [ ] `CC-AC-RELEASE-01` Build Card, manifest, control inventory and exact QA evidence agree.
- [ ] `CC-AC-RELEASE-02` Machine-package consistency is not presented as artifact conformance.
- [ ] `CC-AC-RELEASE-03` Runtime availability is proven per channel.
- [ ] `CC-AC-RELEASE-04` Manual gates and open decisions remain visible.

---

## 15. Constructive and Rejected Reference Cases

All cases are conceptual unless a release receipt says otherwise. Keep object, facts, place, time and uncertainty fixed when creating before/after specimens.

### Case A — Direct Story first value

```yaml
ruleAuthority: CityChat-VES-v0.6-approved
sourceVersion: 0.6
mediaStatus: conceptual
runtimeEvidence: unresolved
```

```text
คนในพื้นที่แจ้งว่าถนนหน้าเทศบาลเริ่มติดหลังฝนตก
ตอนนี้บริเวณนี้ผ่านได้ตามปกติไหม
[ตอบว่าตอนนี้ผ่านได้ไหม]

คนในพื้นที่เล่า · อัปเดต [เวลา]
```

After persisted save:

```text
ส่งคำตอบแล้ว
เราบันทึกไว้กับเรื่องนี้
[ติดตามเรื่องนี้]  ← แสดงเมื่อ follow/persistence พร้อมจริงเท่านั้น
```

### Case B — Honest no-story

```yaml
ruleAuthority: CityChat-VES-v0.6-approved
sourceVersion: 0.6
mediaStatus: conceptual
runtimeEvidence: not_applicable
```

```text
ตอนนี้ยังไม่มีข้อมูลพอที่จะเล่าเรื่องนี้
ลองดูข้อมูลที่มี หรือเลือกพื้นที่อื่น
[ดูข้อมูลที่มี]
```

### Case C — Progress return

```yaml
ruleAuthority: CityChat-VES-v0.6-approved + owning-workflow-required
sourceVersion: 0.6
mediaStatus: conceptual
runtimeEvidence: unresolved
```

```text
เรื่องที่คุณเคยช่วยตอบมีข้อมูลใหม่
เทศบาลแจ้งว่าอยู่ระหว่างตรวจพื้นที่
อัปเดต [วันเวลา]
[ดูสิ่งที่เปลี่ยน]
```

This copy is allowed only when the owning workflow proves the exact state.

### Case D — Officer relief

```yaml
ruleAuthority: CityChat-VES-v0.6-approved + owning-officer-object-required
sourceVersion: 0.6
mediaStatus: conceptual
runtimeEvidence: unresolved
```

```text
เรื่อง: น้ำขังหน้าตลาด
ผู้รับผิดชอบ: ทีมพื้นที่
สิ่งที่ยังขาด: ภาพและเวลาปัจจุบัน
ขั้นต่อไป: ขอข้อมูลจากทีมพื้นที่
[ขอข้อมูลจากทีมพื้นที่]
```

Measure whether the view actually reduces searching, missing-information discovery or context switching.

### Case E — Relevant-circle share

```yaml
ruleAuthority: CityChat-VES-v0.6-approved
sourceVersion: 0.6
mediaStatus: conceptual
runtimeEvidence: unresolved
```

```text
ยังขาดคำตอบจากคนที่ใช้พื้นที่ช่วงเย็น
ชวนคนที่ใช้พื้นที่ช่วงนี้มาช่วยตอบ เพื่อให้เห็นภาพครบขึ้น
[ดูตัวอย่างก่อนแชร์]
```

### Rejected Case F — Fake living city

Reject:

- unsourced counter or pulse;
- “กำลังฮิตในพื้นที่” used to force attention;
- looping motion before meaning;
- receipt before persistence;
- “แชร์ให้เยอะที่สุด”;
- official status inferred from color or access tier;
- multiple peer CTAs;
- StoryCell forced into H3.

Recovery:

> Show one supported local meaning, one honest question when available, zero/one real action and the correct persisted/pending/failure/complete state.

---

## 16. Open Decisions

The following remain unresolved until their owners record approval:

1. Named approver and effective date for Product Brief v8.
2. Named approver and effective date for CityChat Product Experience Profile v0.4 or successor.
3. Approved CityScan topic registry, labels, eligibility, coverage and scale contracts.
4. Actual capability/channel matrix for Direct Story, LINE, follow, share, receipt, operations and notifications.
5. CityChat identity lineage and VES direction are approved by `CC-VES-APP-20260822-01`; reusable role approvals for header, footer, compact, favicon, touch, maskable, social, share and export remain unresolved beyond the existing artifact-specific v0.5 authorization.
6. Approved CityChat motif/illustration family and separate `identity_motif` / `supporting_illustration` role approvals; ijji-derived source and derivative rights, exact derivative hashes and slot-by-slot LDS color mappings. The normative family direction is approved, but no concrete motif or supporting illustration asset is thereby renderable.
7. Workflow status, closure authority, permissions, retention and correction rules for each deployment.
8. Approval of candidate Story Intent and narrative-family selection logic by the owning Product Brief/ADR; VES approval does not promote these data/product decisions.
9. Performance fixtures and product-specific thresholds beyond inherited LDS profile budgets.
10. Research evidence for citizen comprehension, return quality, relevant-circle value and officer workload reduction.

---

## Appendix A — Source and Authority Ledger

| ID | Source | Status/use | SHA-256 |
|---|---|---|---|
| CCIDDIR | `CityChat_identity_direction_decision_2026-08-22.json` (`CC-ID-DIR-20260822-01`) | Identity lineage and LDS-governed color direction approved through `CC-VES-APP-20260822-01`; not a release or unbound asset-role approval | `446b133de93c6db97dfe1a590a24453fb5817cc6d4042fc5fc11c868cd7fd982` |
| V03 | `sources/CityChat_design_system_v0_3_citystory_first_sensible_city_hook_loop.md` | Historical narrative/interaction intent; obsolete visual authority | `c1d558e646baeba9d4bc388bf48024fca350667a79401dcda836964f1519cfa8` |
| V04 | `CityChat_design_system_v0_4_citystory_first_intent_led_cityscan_aligned.md` | Draft Product Experience Profile dependency | `f1964af7b34a24ebf1f2afba1bcb1bba5f2d8df7cc871eeb7f4c72ba790689ba` |
| V05 | `CityChat_design_system_v0_5_visual_experience_citizen_officer_first.md` | Draft VES baseline for this revision | `57eee9139a247f1ed728ee070138b8250c29533c249bed2e0e3fcab83b10acd6` |
| LDS | `sources/Landometer Design System v0.9.0-r7.md` | Owner-approved normative visual authoring authority | `52ef41f1b231f8b84955a40c21a018991a114a4f5eaabd8c5111816bf8d645b1` |
| LDSMP | `reference_landometer_repo/deployment/machine/v0.9.0/package.json` | Vendored machine-package evidence; does not prove CityChat conformance | `0b4b8bfd9abcf403cfebdc8fe9b3299a821eb6e2e96d0d5c9495f1627f206e47` |
| LDSSUM | `reference_landometer_repo/deployment/machine/v0.9.0/SHA256SUMS.txt` | Vendored LDS machine checksum ledger | `bae8c0342fbcb48ea9ba972498b0b80505f25503ecffc1efbe5f8ffd7443ab32` |
| LDSTOK | `reference_landometer_repo/deployment/machine/v0.9.0/tokens.json` | Canonical token registry evidence consumed by color resolution | `5afa9a93bafa8f2e5edb7e929d4924bc548a415098377ad53e18097c56980287` |
| LDSCSS | `reference_landometer_repo/deployment/machine/v0.9.0/build-kit/lds-tokens.css` | Delivered token CSS evidence | `aa834b08c6ecd00704a0c3580da83d291237738815a8e2e408aba12bb9551323` |
| LDSCOL | `reference_landometer_repo/deployment/machine/v0.9.0/color-delivery.json` | Color delivery and surface/foreground evidence | `aa6833b5286f6eb957925cb0c538c951d6822217fb83b051a71473ff2bdbd9c5` |
| LDSSURF | `reference_landometer_repo/deployment/machine/v0.9.0/surface-recipes.json` | Shared LDS surface recipe evidence | `9e849896c0fa49411e226bfa7ca094d939e7e36cbd31e67cd0a76c44f0027d92` |
| LDSFONT | `reference_landometer_repo/deployment/machine/v0.9.0/font-assets.manifest.json` | Shared LDS font-delivery evidence | `d6c630bd4e03e3705a5d6f45fc54498f7c1bc96fe9a22210b8d0b8a0fedd6c18` |
| CCID05 | `citychat_publish_repo/deployment/assets/identity/identity-assets.v0.5.json` | Historical artifact-local identity authorization; not transferable to v0.6 | `628b40f0a604257f38135b6afe2ac615762c760ea8ed75999f94cfa53f5cf25f` |
| CCLOCKPNG | `citychat_publish_repo/deployment/assets/identity/citychat-horizontal-lockup.png` | Exact CityChat lockup bytes; role approval remains artifact-scoped | `94055c9b084eebaa585b3d31bef750abe87a1162fc1ec3be077f7fbcb2465e62` |
| CCLOCKSVG | `citychat_publish_repo/deployment/assets/identity/citychat-lockup.source.svg` | Source-download evidence only; not runtime/compact-role approval | `3a3cd1b4c6091a107bd41502e6df04ddfc62c3074b75b850bfabdf9ddacab98c` |
| CCSYMSVG | `citychat_publish_repo/deployment/assets/identity/citychat-symbol.source.svg` | Source-download evidence only; not favicon/touch/maskable approval | `4d8dfd72be8a666a80040291b8b75411854b9a0c90d6693111f79c721bbf1e74` |
| PB7 | `sources/Product_brief_CityChat_Landometer_v7_CityStory_First.md` | Current narrative baseline pending superseding approval | `ffba6c6d5adfa29be6ffa791614db108268a5d1c4ff763fb05d7a7147c23c0e8` |
| PB8 | `Product_brief_CityChat_Landometer_v8_CityScan_Ecosystem_Aligned.md` | Draft candidate product authority | `607bd2c42cab7a164274d0b3dbbcfd1e8f3d66f185ce2921123cdd9a0b222098` |
| GB | `CityStory_Global_Benchmarks_Examples_and_Sources_v0_1.md` (attached external source) | Directional benchmark evidence | `4cde04e7a75bda3cfcab1f8a8fb1a0f83e6d9b800f22fe1ef671e58b89763783` |
| CSA | `CityStory_StoryCell_Architecture_and_Narrative_Engine_Draft_0_1.md` (attached external source) | Draft reference architecture and narrative direction | `62953c5594aaba0ec83f0368cd63adf5c221c035eda9b110ba79c8a6b03cedeb` |
| RFCI | `CityStory_RFC_Series_Draft_0_1_Index.md` (attached external source) | RFC index; explicitly not a production specification | `3e370db3cf329bef1654b24f4d27998d6d1639370b413ebe2c68579aa376c4f4` |
| CMP | `CityChat_DS_v0_3_vs_VES_v0_5_Comparative_Review.md` | Comparative review that motivated v0.6; recommendation evidence only | `1360bb043a30f1b0669c0e60b746c7ee5974df4ed8f3bbdb65b5bf9d8945bc49` |

The v0.6 file hash is generated after the document is frozen and recorded in its release manifest; it is not self-declared here.

---

## Appendix B — Compact Human/AI Implementation Brief

```text
STATUS
CityChat VES v0.6 is approved for normative authoring under
CC-VES-APP-20260822-01. Product Brief/ADR and CityChat Product Experience
Profile or successor keep their independently recorded statuses. Normative
approval and component presence are not runtime, migration or release proof.

GOAL
Show a living city quickly from real place/evidence/change.
Ask one meaningful question when supported.
Offer zero/one safe action.
Remember only after persistence.
Make the next useful action, recovery or clean completion obvious.

BUILD
Use the exact pinned LDS package and authorized CityChat assets.
Keep CityChat as the primary product identity; keep Landometer as secondary endorsement.
Use the exact approved logo bytes for each separately approved role; never derive a missing variant.
Resolve functional icons through the pinned LDS glyph map and identity motifs through the CityChat registry.
Select colors by semantic job from the pinned LDS role map, with full surface/foreground/focus contracts.
For an approved ijji-derived supporting asset, require source/derivative rights, a CityChat-scoped derivative hash and slot-by-slot LDS color mapping; never import ijji product identity.
Use at most one primary semiotic focus and one gradient-bearing atmosphere group per compact scene.
Resolve evidence, capability, authorization and effect before copy or controls.
Keep Direct CityStory independent from CityScan.
Treat StoryCell as a cognitive view, never H3 identity.
Use Place → Hook → Discovery → Evidence/Boundary → Question → Action → Memory → Refresh.
Keep public Thai natural; keep technical terms behind governed detail.
Bind motion to allowlisted LDS primitives; introduce no local values.
Use persisted state for receipt, memory and return.
Omit unresolved capabilities and show an honest fallback.

DO NOT
Invent a claim, officer action, notification, workflow state, live signal,
recipient outcome, approval or release proof.
Do not create local tokens, fake counters, stage-derived receipts,
multiple primary CTAs, popularity-based civic priority, sampled/synthesized colors,
recolored logos, unregistered motifs or ad-hoc icon variants.

HANDOFF
Return view model, localized copy, source map, unresolved refs, blocked reasons,
lint report, acceptance map, rendered/accessibility evidence and named human review record.
Pass every applicable CC-LINT-* rule and CC-AC-* gate plus LDS/product/data/privacy/security/release gates.
```

---

## Appendix C — v0.5 to v0.6 Change Summary

| Area | v0.5 | v0.6 change |
|---|---|---|
| First value | Comprehension-oriented scene rules | Explicit pre-auth/setup first-value contract and derived view state |
| Identity | Six visual signatures | Preserves CityChat as the primary product identity; adds Voice/Evidence/Place/Care grammar, one-role asset approval, deterministic resolution and recognition/deletion tests |
| Color | LDS inheritance and accessible remap | Adds normative CityChat LDS role recipe, shared-atmosphere boundaries and deterministic supporting-asset slot mapping without importing ijji product identity |
| Icons and motifs | General inherited icon/motif boundary | Adds a pinned functional glyph map, separately governed CityChat motif/supporting-asset registries and scene-level semiotic binding |
| StoryCell | Safe visual anatomy | Adds Hook/Discovery/Memory/Refresh narrative recipe and no-story fallback |
| Civic loop | Safe actions and receipts | Adds human continuity map, valid return triggers and relevant-circle contract |
| Motion | State-led principle | Adds semantic recipes bound to LDS with deterministic motion contract |
| Officer | Work-item anatomy | Adds workload hypothesis and same-task evidence requirement |
| Dev usability | Package outline and crosswalk | Adds Base View Contract, recipe schemas, authoring task, lint IDs and golden implementation order |
| AI usability | Compact prompt | Adds source-mapped structured task/results, fail-closed rules and named human gates |
| Warmth | Plain Thai and calm character | Adds natural civic voice, Story Intent and real LivingCityCue without fake liveness |

---

## Final Rule

> **รักษาสมองและระบบประสาทของ v0.5 แล้วนำหัวใจของ v0.3 กลับมา: เมืองมีชีวิตจากเรื่องจริง หนึ่งคำถามที่มีความหมาย การช่วยที่ถูกจดจำ การกลับมาที่มีเหตุผล และประสบการณ์ที่อบอุ่นพอให้คนรู้สึกว่าเมืองกำลังฟัง—โดยไม่สร้างความมั่นใจเกินหลักฐาน**

CityChat v0.6 succeeds when citizens can understand one local matter and act safely, officers can continue the same governed context with less uncertainty, and both humans and AI can implement the experience without inventing truth, capability, state or visual rules.
