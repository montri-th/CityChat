# CityChat Visual Experience Specification (VES) v0.5 — Citizen & Officer First

> **Landometer DS วางรากฐานภาพและการเข้าถึง ส่วน CityChat VES กำหนดวิธีประกอบรากฐานนั้นให้เป็นประสบการณ์ CityChat ที่ชาวบ้านและเจ้าหน้าที่เข้าใจและใช้ประโยชน์ได้จริง**

## 0. Document Control

| Field | Value |
|---|---|
| Document class | CityChat Visual Experience Specification (VES), product-specific overlay under Landometer Design System |
| Compatibility filename | Retains `CityChat_design_system_*` so existing project references can migrate; the normative document class is VES, not a second Design System |
| Version | v0.5 |
| Status | Draft — owner-directed candidate; not yet an approved or shipped-state claim |
| Date | 2026-08-22 |
| Evidence cutoff | 2026-08-22 |
| Primary users | ชาวบ้าน / คนในพื้นที่, เจ้าหน้าที่ อปท. |
| Secondary users | ผู้ดูแลชุมชน, designer, developer, QA, content designer |
| Visual foundation | Landometer Design System v0.9.0-r7; machine package v0.9.0-mp1 |
| Product interaction contract | CityChat Product Experience Profile v0.4 — draft candidate; becomes authority only after explicit approval |
| Product direction | CityChat Product Brief v8 candidate; v7 remains the current narrative baseline until v8 approval is recorded |
| Screenshot evidence | 14 supplied desktop/mobile captures; filenames and hashes in Appendix A |
| Supersession | After approval and migration parity, v0.5 overlays CityChat-specific visual composition and frontstage copy form only. Approved v0.4 or an approved successor continues to own object/state/effect/disclosure contracts; until then, approved owning sources and the current narrative baseline govern their domains. |

### 0.1 Why this document exists

CityChat already has a recognizable identity and several useful patterns. The goal is not to redesign it from zero. This specification keeps the strongest existing assets and interaction shapes, then fixes the parts that currently make the product harder to read or use:

- contrast is too weak on several dark and bright-green surfaces;
- some mobile cards and Thai text overflow or are cut off;
- map, post, tabs, timeline and data controls compete for the same space;
- bright mint is used too broadly and can look like success, urgency or readiness;
- user-facing copy sometimes mixes Thai, English and system language;
- popularity, ranks, coins and levels can distract from real civic benefit;
- the prior v0.4 defines experience semantics well but deliberately does not define enough CityChat-specific visual composition.

### 0.2 Decision

CityChat will use **LDS + CityChat VES**, not a second independent visual system.

| Layer | Owns | Must not own |
|---|---|---|
| Product Brief / approved ADR | user, job, workflow, outcome, product limits | raw colors, component styling |
| Landometer DS v0.9.0-r7 | tokens, typography, shared controls, icons, focus, motion primitives, accessibility baseline, common QA | CityChat product truth or municipal workflow truth |
| CityChat Product Experience Profile v0.4, after approval | governed objects, effect, receipt, permission, CityScan/Story behavior, release gating | parallel palette or local primitives |
| **CityChat VES v0.5** | visual signatures, component composition, responsive scenes, density, frontstage copy form/presentation within approved truth, contrast-role selection, asset placement | new meaning/limitation, raw tokens, scoring logic, official status, capability availability |
| Dataset / CityScan / workflow registries | metric meaning, scale, coverage, LOCK, official workflow status | visual hierarchy outside their governed domain |
| Release evidence | what is actually implemented and available | future product intent |

### 0.3 Normative language

- **MUST / ต้อง** = required for CityChat v0.5 conformance.
- **SHOULD / ควร** = recommended; deviations need a written reason.
- **MAY / อาจ** = optional.
- A component in this document is not proof that its backend, channel or workflow is available.
- A screenshot is evidence of visual lineage only, not evidence of implementation quality, permission, legal status or runtime capability.
- Before explicit approval, every MUST/SHOULD in v0.5 is a candidate requirement, not a claim of current conformance or authority.
- Any composition or gate that depends on v0.4 is likewise candidate until v0.4 or an owner-approved successor ADR has a named approver and effective date; production-conformance claims remain blocked before then.

## 1. Experience Promise

### 1.1 Product promise

CityChat should make one local matter easy to understand and easy to act on:

> **รู้ว่าเป็นเรื่องที่ไหน → เข้าใจว่าเกิดอะไร → รู้ว่าทำอะไรต่อได้ → กลับมาดูความคืบหน้าได้เมื่อระบบรองรับ**

Every citizen-facing scene MUST answer, in this order:

1. เรื่องนี้อยู่ที่ไหน
2. เกิดอะไรขึ้น หรือกำลังชวนตอบเรื่องอะไร
3. ข้อมูลหรือข้อความนี้มาจากใคร
4. ข้อมูลนี้ยังบอกอะไรไม่ได้ เมื่อข้อจำกัดนั้นเปลี่ยนความหมายหรือการตัดสินใจ
5. ผู้ใช้ทำอะไรต่อได้หนึ่งอย่าง
6. หลังทำแล้วจะเกิดอะไร

Every officer-facing scene MUST answer:

1. เป็นเรื่องของพื้นที่และรายการใด
2. ใครรับผิดชอบหรือยังไม่มีผู้รับผิดชอบ
3. ตอนนี้อยู่ขั้นไหน
4. ยังขาดข้อมูลอะไร
5. ทำอะไรต่อได้หนึ่งอย่างตามสิทธิ์
6. ข้อความใดปลอดภัยสำหรับประชาชน

### 1.2 CityChat character

CityChat is:

- **local** — เริ่มจากสถานที่จริง ไม่เริ่มจากเมนูระบบ;
- **human** — ใช้ภาพ คน เรื่องเล่า และภาษาที่คนพูดกัน;
- **clear** — หนึ่งหน้าทำหนึ่งงาน มีหนึ่งสิ่งสำคัญที่สุด;
- **warm but calm** — เป็นกันเองโดยไม่เร่ง ไม่เล่นกับความกลัว;
- **useful** — ทุก action บอกผลที่จะเกิด ไม่ชวนกดเพราะอยากเพิ่ม engagement;
- **alive through real change** — เมืองดูมีชีวิตจากสถานที่ คน และการเปลี่ยนแปลงจริง ไม่ใช่ตัวเลขสดปลอม แสงกระพริบ หรือ counter ที่แต่งขึ้น.

CityChat is not:

- generic chatbot;
- expert-only GIS dashboard;
- complaint inbox with no return path;
- social feed where popularity decides civic priority;
- game of coins, levels or rankings;
- AI- or inspector-facing interface presented to citizens;
- a wall of warnings before the user gets value.

### 1.3 One-job rule

Each page state MUST have:

- one dominant place or governed object;
- one primary message;
- zero or one primary action;
- a clear completion or recovery state.

Audit/read-only, waiting, permission-denied and clean-completion states MAY have no primary action.

## 2. Visual Lineage: Keep, Adjust, Retire

### 2.1 Keep

These form the recognizable CityChat lineage and SHOULD remain visually familiar:

1. CityChat pin + chat-bubble lockup, using a role-authorized, hash-pinned asset.
2. Tagline **“คุยเรื่องเมือง พูดเรื่องบ้านคุณ”**.
3. Illustrated cityscape and speech-bubble atmosphere on entry/orientation scenes.
4. Floating dark rounded header that keeps product, place and role close together.
5. Map-first and place-grounded entry, including municipal/community boundaries.
6. Dark conversation cards, rounded composition and capsule actions.
7. Real local photo/story, avatar, reply, share and report patterns.
8. The existing identity-then-area setup as a candidate post-AHA pattern, not a universal prerequisite.
9. Natural Thai such as “ยังไม่มีคนตอบ”, “เป็นคนแรกที่ตอบกลับ!” and “แตะเพื่อเพิ่มรูปโปรไฟล์ (ไม่บังคับ)”.
10. Timeline and legend as data-navigation patterns when their meaning is complete.

### 2.2 Adjust

Keep the component or silhouette, but change its visual contract:

| Existing pattern | Required adjustment |
|---|---|
| Blue CityChat wordmark on dark green | Place the exact lockup on a clean approved adjacent surface or a separately approved opaque plate, or use an authorized inverse asset when available; never recolor the file |
| Full-page neon green background | Restrict to short identity moments; use stable LDS surfaces for reading, forms and data |
| Muted grey helper/metadata | Use canonical text roles without additional opacity; important instructions cannot use disabled styling |
| White text on bright mint CTA | Use the LDS dark interactive ink on bright mint, or choose a darker approved action surface for white text |
| Map post + data controls | Give the map a protected safe area and collapse non-primary overlays |
| Long post and municipality names | Wrap naturally, allow expansion, and never extend beyond the viewport |
| `Flood Impact` pill | Treat as a data-topic control, not success/status; use an approved Thai metric label from the data owner |
| Timeline dots | Keep visual dots, enlarge invisible hit area to at least 44×44 CSS px |
| Login modal | State the task being unlocked, not just “เข้าสู่ระบบ” |
| Area setup | Treat the two-step flow as a candidate post-AHA pattern; require an area only when the approved owning workflow makes it intrinsic |

### 2.3 Retire or reinterpret

The following are not protected CityChat identity and MUST NOT determine civic importance in a conforming civic scene. Product-wide deprecation or any bounded non-civic exception still requires the owning Product Brief/ADR:

- weekly popularity ranking and numbered podiums;
- coins, points, levels, stars and achievement loops;
- “variable reward” or synthetic live counters;
- likes/shares as a priority score;
- green as automatic proof of success, completion or official acceptance;
- community posts presented as if they were verified CityStory evidence;
- generic success receipts before the system has actually saved the action.

A reaction MAY remain as personal expression when it does not rank municipal work, imply outcome or compete with the primary action.

## 3. CityChat Visual Signatures

These are product compositions, not new LDS primitives.

### 3.1 `CityBand`

A floating orientation band containing:

1. role-authorized, hash-pinned CityChat lockup;
2. current place, shortened only with a user-accessible full label;
3. current role in plain Thai only when it changes meaning, permission or the user’s next action;
4. avatar or account control when permissioned;
5. at most one utility action.

Rules:

- On small screens, place takes priority over decorative product text.
- The band MUST not hide a map reticle or the selected geometry.
- The lockup MUST use a role-authorized asset/surface pair recorded for that artifact.
- `ประชาชน`, `เจ้าหน้าที่` and `ผู้ดูแล` are role labels; show them only when useful and do not use unexplained abbreviations. Anonymous citizen entry may omit the role label.

### 3.2 `PlaceStage`

The main visual context may be:

- a map;
- a local photo;
- a CityChat illustration;
- a governed before/after view.

The stage provides place and atmosphere. It MUST NOT independently encode official status, analytical score or proof.

### 3.3 `PlaceThread`

A human conversation layer anchored to the place. It may contain a `MapPostCard`, `ConversationCard` or `StoryCell`, but those remain distinct types.

Rules:

- one expanded thread at a time on mobile;
- the author, place scope and content type are visible;
- community content is labelled “คนในพื้นที่เล่า” or equivalent;
- generated or calculated data is not styled as a person’s post;
- personal identity and precise location follow the selected visibility policy.

### 3.4 `CommunityPresence`

Avatars, photos and chat bubbles signal that CityChat connects real people to a place.

- Preserve the component pattern, not personal screenshot pixels.
- Use only permissioned assets.
- A missing photo uses the inherited neutral avatar; it is not an error.
- Counts MAY be shown only when they are real, useful and not used to determine public priority.

### 3.5 `CivicAction`

One prominent capsule action expresses the next safe step.

- label = action + immediate object/result;
- one primary action per scene;
- capability unavailable or unknown = omit the action;
- disabled is allowed only when the user can understand and fix the requirement;
- bright identity color does not imply success.

### 3.6 `OutcomeReturn`

After an action, show one of:

- a real saved receipt and what happens next;
- a pending state that says what is waiting;
- a failure state that preserves input and offers recovery;
- clean completion.

Do not substitute coins, applause, streaks or rank for civic outcome.

## 4. LDS Inheritance and No-Fork Rule

### 4.1 Inherited without local values

CityChat MUST inherit the exact selected LDS version for:

- brand and semantic color registry;
- typography, Thai font delivery and type roles;
- spacing, container, breakpoints, radius, depth and z-index;
- buttons, icon buttons, form controls and focus behavior;
- Material Symbols and approved identity/media registries;
- light/dark theme initialization;
- shared empty/error/loading states;
- motion primitives and reduced-motion behavior;
- minimum touch target, keyboard, zoom and WCAG baseline;
- map and data-visualization packs when triggered.

No CityChat implementation may introduce a local raw hex, font, radius, breakpoint, shadow or motion duration as a “temporary” product token.

### 4.2 Allowed CityChat semantic aliases

Aliases MAY improve readability in implementation, but each MUST resolve to an LDS variable and be recorded in the Build Card.

```css
:root {
  --cc-page: var(--surface-canvas);
  --cc-panel: var(--surface-card);
  --cc-panel-raised: var(--surface-raised);
  --cc-text: var(--text-primary);
  --cc-text-secondary: var(--text-secondary);
  --cc-metadata: var(--text-metadata);
  --cc-border: var(--border-default);
  --cc-focus: var(--interaction-focus-ring);
  --cc-atmosphere-action-surface: var(--fg-interactive-surface);
  --cc-atmosphere-action-ink: var(--fg-interactive-ink);
  --cc-identity-atmosphere: var(--product-citychat-gradient);
  --cc-identity-ink: var(--fg-on-deep-primary);
  --cc-identity-ink-secondary: var(--fg-on-deep-secondary);
  --cc-map-overlay: var(--overlay-glass);
  --cc-map-overlay-ink: var(--overlay-glass-ink);
}

[data-theme="dark"] {
  --cc-identity-ink: var(--fg-on-light-primary);
  --cc-identity-ink-secondary: var(--fg-on-light-secondary);
}
```

The identity gradient and both identity ink aliases are one theme-resolved contract; implementations MUST NOT consume the gradient alone. `--cc-focus` is not automatically safe on every gradient pixel and must pass the rendered focus-boundary test in both themes. Normal buttons inherit the LDS Button recipe unchanged. The atmosphere action pair is only for an approved action inside an atmosphere scene, never a general gradient-button token.

These aliases do not authorize new values and MUST NOT be copied into an independent token registry.

### 4.3 Triggered packages

Load only what the artifact actually needs and can evidence:

- every artifact: exactly one applicable LDS profile + `[PUB-01]`; operational CityChat web uses `citychat.app`, while read-only explainer/campaign/social/presentation artifacts use their owning profile;
- every delivery: matching `[DELIVERY-01]` branch;
- public deployable/discoverable route: `[WEB-DISCOVERY-01]` when its discovery state is authorized;
- data: `[DATA-01]`;
- map: `[MAP-01]`;
- analytical ramp/choropleth: `[DATAVIZ-01]`;
- authentication: `[AUTH-01]`;
- copy/share: `[SHARE-01]` plus destination, visibility and safe-object checks; a handoff is not recipient outcome;
- `direct_send`, post or invite: `[SHARE-01] + [EFFECT-01] + [AUTH-01] + [ABUSE-INTEGRITY-01]`, with a real destination and recovery;
- follow/watch: `[HOOK-01] + [EFFECT-01] + [AUTH-01] + [ABUSE-INTEGRITY-01]`, plus `[LEARN-01]` when it becomes a persisted preference/learning record, and persistence, delete/withdraw, permission re-check and recovery;
- receipt: `[EFFECT-01] + [AUTH-01]` and real persistence; a receipt is never inferred from access tier;
- co-creation/submission: `[COCREATE-01] + [AUTH-01] + [ABUSE-INTEGRITY-01] + [EFFECT-01]`, with moderation/correction paths;
- telemetry: `[TELEMETRY-01]` and only approved observable events.

Package presence does not mean the product capability is live.

## 5. Color, Contrast and Surface Contracts

### 5.1 Core decision

CityChat keeps green/teal energy, but stops using it as an unbounded full-page treatment.

Use identity energy for:

- entry and orientation;
- selected product identity moment;
- one candidate atmosphere action when its treatment is separately approved and the correct ink pair is used; normal actions inherit the LDS Button recipe;
- a small progress or focus accent;
- closure atmosphere after real completion.

Do not use identity energy for:

- long forms;
- paragraph backgrounds;
- analytical score, risk or coverage;
- official status;
- disabled fields;
- persistent map panels;
- success without a real effect.

### 5.2 Foreground/surface pair rule

Every text, icon, border and focus ring MUST declare its rendered surface. Do not choose foreground and background independently.

| Use | Surface role | Foreground role | Rule |
|---|---|---|---|
| Normal page | `--surface-canvas` | `--text-primary` | Default reading |
| Card | `--surface-card` | `--text-primary` | Long-form and forms |
| Secondary copy | page/card | `--text-secondary` or `--text-metadata` | No extra opacity |
| Approved atmosphere action | LDS atmosphere/interactive surface | `--fg-interactive-ink` | Dark ink required on luminous mint; normal buttons inherit LDS Button and are not gradients |
| Deep atmosphere or map overlay | approved deep surface / `--overlay-glass` | `--fg-on-deep-primary` / overlay ink | Local contrast contract required |
| Status | semantic fill | matching semantic ink | Must also include word/icon/pattern |
| Disabled control | inherited disabled styling | adjacent readable instruction remains separate | Disabled text cannot carry the only instruction |

### 5.3 Token-pair evidence

The following are calculations from the exact LDS v0.9.0-mp1 sRGB token values. They are not a substitute for testing the rendered application.

| Pair | Approx. contrast | Decision |
|---|---:|---|
| White on dark-theme CityChat mint start | 1.95:1 | Do not use for normal text or CTA label |
| White on dark-theme CityChat mint end | 1.85:1 | Do not use for normal text or CTA label |
| LDS interactive dark ink on the same mint stops | 8.24–8.69:1 | Preferred foreground contract |
| Brand Blue on light-theme CityChat deep-green stops | 1.69–1.83:1 | Do not place the blue wordmark directly here |
| Brand Blue on LDS light canvas | 8.39:1 | Suitable candidate surface; still inspect exact image bounds |
| Dark-theme muted text on dark canvas/card | 6.28:1 / 5.24:1 | Token pair is viable; do not reduce with opacity |
| Dark-theme disabled text on dark canvas/card | 4.35:1 / 3.63:1 | Not for essential instructions or body copy |

### 5.4 Logo and identity assets

1. Use only a role-authorized, hash-pinned CityChat lockup for the declared artifact role.
2. Never recolor, filter, outline, distort, redraw or crop the lockup.
3. The current horizontal lockup is user-supplied and authorized only for artifact `citychat-ui-20260822-01` header/footer; that authorization does not transfer to a new build and official reuse approval remains unresolved.
4. Until a reversed/light lockup is role-authorized and hash-pinned, dark or deep-green placement MUST use a clean approved adjacent surface or a separately approved opaque plate. A merely contrast-tested local carrier is not enough; if no approved pairing exists, block that placement/release.
5. Header, favicon, touch icon, maskable icon and social image are separate approvals.
6. A screenshot of an asset is not an approved reusable file.

### 5.5 Map contrast

- Text over satellite imagery MUST sit on an opaque panel or a deterministic tested scrim.
- Administrative/scan geometry needs outline plus halo/scrim where adjacent imagery changes.
- Selected geometry, hover and boundary MUST remain distinguishable without color alone.
- Map labels may be dimmed behind an open reading panel, but place identity remains available in text.
- Data ramps MUST pass adjacent-class, grayscale and common color-vision-deficiency checks.

### 5.6 Runtime contrast gate

Rendered QA MUST measure actual glyph/icon bounds against their actual surfaces in light and dark themes, including representative satellite tiles.

- normal text: at least 4.5:1;
- large text: at least 3:1;
- meaningful non-text UI, focus, selected geometry and critical boundary: at least 3:1 against adjacent rendered colors;
- no essential message only in placeholder, disabled or low-opacity text.

The screenshots identify risk but do not by themselves prove a full WCAG result.

## 6. Typography and Plain-Language Thai

### 6.1 Public-language principle

Write as one person helping another person in the same place:

> **สถานที่หรือเรื่อง → เกิดอะไรหรือกำลังถามอะไร → ทำอะไรต่อได้**

Use ordinary verbs:

- ดู
- เลือก
- ตอบ
- แจ้ง
- ติดตาม
- แก้ไข
- กลับไป

Short is good only when the result remains clear. Friendly does not mean slang-heavy.

### 6.2 Frontstage versus backstage

| Frontstage: ชาวบ้าน/เจ้าหน้าที่ | Backstage: dev/data/QA only |
|---|---|
| ที่มา | evidence reference / provenance |
| อัปเดตเมื่อ | freshness timestamp |
| ยังไม่มีข้อมูลพอ | insufficient / no-score reason |
| คนในพื้นที่เล่า | user report |
| ข้อมูลคำนวณจาก… | calculated/modelled signal |
| สถานะจากเทศบาล | authoritative workflow status |
| ใครจะเห็น | visibility / public projection |
| ส่งแล้วหรือยัง | persistence/effect state |
| รอเจ้าหน้าที่ตรวจ | pending authoritative review |
| ดูรายละเอียด | evidence drawer / disclosure |

Do not expose these terms in public L1 copy unless the user has explicitly opened technical detail:

- AI analysis, AI confidence, agent, inspector;
- claim ceiling, truth envelope, evidence capsule;
- source_limited, fixture, runtime, schema;
- H3, R3, proxy, baseline, idempotency;
- trigger pack, build receipt, capability matrix.

### 6.3 Truth without a caveat wall

The interface MUST stay honest without opening with a disclaimer paragraph.

Use three disclosure levels:

1. **Answer** — direct plain-language meaning, including `คนในพื้นที่เล่า`, `ข้อมูลคำนวณ` or another material source class when it changes interpretation.
2. **Short truth line** — source type, time and any limitation that changes meaning, e.g. “ข้อมูลคำนวณ อัปเดต มิ.ย. 2568 · ยังไม่ยืนยันเหตุในแต่ละจุด”.
3. **Details on demand** — `ดูที่มา`, containing method, coverage and limitations.

If the limitation changes the decision, show it next to the action in one plain sentence.

### 6.4 Copy replacement table

| Avoid | Use |
|---|---|
| `Flood Impact` | `ข้อมูลน้ำท่วม` or the approved Thai metric name |
| `US` | `EN`, only when the English locale is declared and release-ready; otherwise omit the selector |
| `Display Name` | `ชื่อที่อยากให้คนอื่นเห็น` |
| `ดำเนินการต่อด้วย Google` | `ใช้บัญชี Google` |
| `ดำเนินการต่อด้วย Line` | `ใช้บัญชี LINE` |
| `คำอธิบายโปรไฟล์` | `แนะนำตัวสั้น ๆ (ไม่บังคับ)` |
| `พื้นที่หลัก` | `พื้นที่ที่คุณอยากติดตาม` |
| `พื้นที่รอง` | `เพิ่มอีกพื้นที่ (ไม่บังคับ)` |
| `เริ่มแชร์เรื่องราวของคุณ!` | `เล่าเรื่องในพื้นที่นี้` |
| `เข้าสู่ระบบ` in a reply gate | `เข้าสู่ระบบเพื่อตอบเรื่องนี้` |
| `ข้อมูลเมือง` | `ดูข้อมูลพื้นที่` |
| `ห้องแชท` | Use the real destination: `เปิดบทสนทนานี้` for a thread or `คุยเรื่องพื้นที่นี้` for an area; never change route meaning for nicer copy |
| `LOCK` | `ล็อกพื้นที่นี้` |
| `NO_SCORE` | `ข้อมูลยังไม่พอคำนวณ` |
| `Coverage 82%` | `ข้อมูลครอบคลุม [coverage]` |
| `ปีที่เลือก` | `ดูปี [selected year]` |
| `เฉลี่ย 14 ปี` | `เทียบค่าเฉลี่ย [comparison period]` |

The final Thai data-topic name MUST come from its owning metric/data contract. This VES supplies copy form, not metric meaning.

### 6.5 System-copy recipes

#### Citizen question

```text
[เกิดอะไรในพื้นที่นี้]
[คำถามเดียว]
[ปุ่ม: กริยา + เรื่อง]
```

Example:

```text
มีคนในพื้นที่แจ้งว่าถนนหน้าเทศบาลเริ่มติดหลังฝนตก
ตอนนี้บริเวณนี้ผ่านได้ตามปกติไหม
[ตอบว่าตอนนี้ผ่านได้ไหม]
```

#### Saved action

```text
ส่งคำตอบแล้ว
คุณกลับมาดูเรื่องนี้ได้จาก “เรื่องที่ติดตาม”
```

Only show this when the action is actually persisted and the return path exists.

#### Not enough data

```text
ข้อมูลของพื้นที่นี้ยังไม่พอคำนวณ
ลองขยายพื้นที่ หรือดูที่มา
```

#### Officer work item

```text
เรื่อง: น้ำขังหน้าตลาด
ผู้รับผิดชอบ: ยังไม่มีผู้รับผิดชอบ
ขั้นต่อไป: ตรวจพื้นที่
[รับเรื่องไปตรวจ]
```

### 6.6 User-generated content

- Preserve the user’s natural voice unless moderation, safety or legal policy requires action.
- Do not rewrite a resident’s wording into official or AI language.
- Clearly separate “คนในพื้นที่เล่า”, “ข้อมูลคำนวณ” and “สถานะจากเทศบาล”.
- Never make a person’s report look verified through color or placement alone.

## 7. Responsive Shells and Density

### 7.1 Two modes, one visual family

#### Citizen shell

- story/place first;
- low density;
- one expanded card;
- one primary action;
- details one interaction deep;
- return status visible after participation.

#### Officer shell

- compact but not cryptic;
- object, place, owner, current step, evidence gap and next action visible;
- queue and record detail remain distinct;
- private fields never leak into the public preview;
- desktop may use a stable information rail; an active mobile scan uses one composed scan HUD/tray plus at most one disclosure sheet.

### 7.2 Viewport rules

Test at minimum:

- 320, 360 and 390 CSS px mobile;
- mobile landscape;
- the full inherited LDS matrix, including 768, 1024 and 1180 px widths;
- 834 px product-specific tablet fixture;
- 1366×768 and 1440×900 product-specific desktop fixtures;
- 200% browser zoom;
- Thai text at 130% of the nominal test fixture length.

At every size:

- no horizontal page scroll;
- no card, post, CTA or reply escapes the viewport;
- long Thai wraps naturally;
- names and place labels may truncate only with a discoverable full value;
- sticky actions clear browser, LINE and device safe areas;
- keyboard opening does not hide the active field or submit action;
- touch targets are at least 44×44 CSS px.

### 7.3 Density budget

#### Citizen first view

Maximum visible before disclosure:

- one place header;
- one primary story/post/scan result;
- up to three supporting facts;
- one short source/time line;
- zero or one primary action;
- one secondary disclosure.

#### Active map scan

Maximum persistent composition:

- one composed scan HUD/tray containing compact `CityBand`, scan readout, eligible primary action and the minimum control cluster;
- map controls that remain outside the Scan Frame;
- at most one disclosure surface opened by the user.

This is one visual system, not five floating groups. Community cards, account detail and secondary analytics MUST collapse while scanning. No HUD, tray, disclosure sheet/panel, legend, CTA, control, safe-area inset or software keyboard may intersect the calculation frame or reticle.

#### Officer desktop

Use a stable split between queue/map/context and record detail. Do not stack every tool over the map.

### 7.4 Safe-area contract

- Use platform safe-area insets for fixed headers, sheets and bottom actions.
- Add scroll completion space below the last required control.
- A fixed CTA MUST not touch browser chrome in the supplied mobile configurations.
- Sheet drag handles and close controls remain reachable at 200% zoom.

## 8. Component Composition Contracts

All components inherit LDS primitives. This section defines visible CityChat composition and order, not raw styling or replacement domain schemas. Canonical context, truth, authorization, effect, visibility and state fields from v0.4/owning registries remain required even when not repeated here.

### 8.1 `GovernedContextHeader` / `CityBand`

Order:

1. product identity;
2. place;
3. role/status label;
4. user control.

Variants:

- public anonymous;
- citizen signed-in;
- officer signed-in;
- compact map;
- embedded/shared story.

Acceptance:

- exact asset role authorization is recorded;
- long LGU name does not push controls off-screen;
- place remains available to assistive technology;
- role is not shown by color alone.

### 8.2 `MapPostCard` / `ConversationCard`

This is community content. It is not a `StoryCell`.

Anatomy:

1. content-type label: `คนในพื้นที่เล่า`;
2. author or privacy-safe identity;
3. place scope;
4. body/media;
5. time;
6. zero or one primary action;
7. secondary reply/reaction/share/report tools.

Rules:

- 120-character Thai fixture MUST wrap or show a labelled `อ่านต่อ`;
- author text and action row cannot overflow;
- likes/shares never determine civic priority;
- reply input appears only when the reply path works;
- signed-out user may continue reading when safe;
- auth gate explains the blocked action.

### 8.3 `StoryCell`

This is the governed meaning-card view for direct CityStory or a successful Locked Scan. Its visible anatomy does not replace the v0.4 `StoryCell` object/state contract.

Visual order:

1. place and period;
2. one main meaning;
3. up to three traceable facts;
4. one question;
5. material calculated/modelled/proxy qualifier and limitation in the first visible interpretation when it changes meaning;
6. short data/source status;
7. zero or one primary action;
8. `ดูที่มา`.

Variants:

- direct story, no H3 requirement;
- scan-origin, locked context required;
- text only;
- media or mini-map;
- no action / clean completion;
- insufficient data;
- pending or failed action;
- restricted.

Do not use the shape or badge of a community post to imply governed evidence.

### 8.4 `EvidenceSummary` and `EvidenceDrawer`

Public summary:

```text
ข้อมูลคำนวณ · อัปเดต มิ.ย. 2568
[ดูที่มา]
```

Drawer order:

1. ข้อมูลมาจากไหน
2. อัปเดตเมื่อ
3. ครอบคลุมพื้นที่แค่ไหน
4. คำนวณอย่างไรแบบย่อ
5. ยังบอกอะไรไม่ได้
6. ดูรายละเอียดสำหรับเจ้าหน้าที่, when role and need allow.

Do not show an internal field dump to citizens.

### 8.5 `PrimaryAction`

Label examples:

- `ตอบว่าตอนนี้ผ่านได้ไหม`
- `เล่าเรื่องในพื้นที่นี้`
- `ติดตามเรื่องนี้`
- `ดูข้อมูลน้ำท่วมของพื้นที่นี้`
- `รับเรื่องไปตรวจ`
- `บันทึกข้อมูลที่แก้แล้ว`

Rules:

- zero or one primary per scene;
- label says the immediate result;
- normal action uses the inherited LDS Button recipe; any atmosphere-action treatment uses one separately approved LDS pair and never a local gradient;
- pending prevents duplicate action;
- failure preserves user input and offers recovery;
- no decorative CTA with no destination/effect.

### 8.6 `ActionReceipt`

Anatomy:

1. what was saved;
2. when;
3. who can see it;
4. current state in plain language;
5. next trigger or clean completion;
6. recovery/correction route when applicable.

Never say `รับเรื่องแล้ว`, `เจ้าหน้าที่กำลังดำเนินการ` or `แก้แล้ว` unless the owning system confirms that exact state.

### 8.7 Auth gate

Use task-specific copy:

```text
เข้าสู่ระบบเพื่อตอบเรื่องนี้
คุณยังอ่านเรื่องนี้ต่อได้
[ใช้บัญชี LINE]
[ใช้บัญชี Google]
```

Show only sign-in methods actually available in that release. Do not imply that sign-in itself submits the reply.

### 8.8 Candidate post-AHA profile setup

This is a candidate continuation pattern from the supplied UI, not a universal first-use gate. Defer or omit it until after first value unless the approved owning workflow says identity is intrinsic to the attempted action.

Step 1 asks only what is needed now:

- `ชื่อที่อยากให้คนอื่นเห็น` — required only when participation needs a public/display identity;
- photo — optional;
- `แนะนำตัวสั้น ๆ (ไม่บังคับ)` — optional and may be deferred.

The example preview MUST use readable foreground roles and must not expose more information than the selected visibility.

### 8.9 Candidate post-AHA followed-area setup

This is a candidate continuation pattern. It MUST NOT delay first value unless an approved product/persistence contract makes a followed area intrinsic to the selected job.

Step 2:

- `พื้นที่ที่คุณอยากติดตาม` — one area only when the owning product/persistence contract requires a followed area for the selected job;
- `เพิ่มอีกพื้นที่ (ไม่บังคับ)` — deferred until after first value unless needed;
- `เริ่มใช้งาน` activates only when the required area is valid;
- disabled styling is paired with a readable instruction explaining what remains.

### 8.10 `OfficerWorkItemView`

`OfficerWorkItemView` is a candidate visual projection over the canonical v0.4 `OfficerModerationItem` and/or `OperationsObject`. It does not mint a new work object, status registry or authority model. The projection MUST preserve stable object ID/version, authorization, audit/correction history, allowed transitions, closure authority and public-safe projection references.

Anatomy:

1. matter and place;
2. source type;
3. current responsible person/team;
4. current step;
5. missing information;
6. deadline or next review time, when real;
7. one allowed next action;
8. public-safe preview.

No field may be forced into a map/H3 identity if the work record is naturally object-native.

### 8.11 Canonical component crosswalk

VES names are view/composition names. They MUST map one-to-one to the versioned v0.4/owning authoring contract and MUST `$ref` it when an approved machine schema exists. They MUST NOT create a parallel object, truth, state or effect model.

| VES composition | Canonical dependency | Minimum view inputs | State/effect source |
|---|---|---|---|
| `CityBand` | v0.4 `GovernedContextHeader` | `contextRef`, place label, role/permission projection, authorized asset ref | owning context/authorization |
| `MapPostCard` / `ConversationCard` | owning community-post record + v0.4 governed context | stable post ID/version, author projection, place scope, visibility, media rights, action refs | owning post/moderation/effect registry |
| `StoryCell` | v0.4 `StoryCell` | canonical StoryCell ref, analytical truth ref, facts, question, action ref | v0.4 Story/effect contracts |
| `PrimaryAction` | v0.4 `PrimaryAction` | action ref, destination/effect, authorization decision, immediate result, recovery | v0.4 effect contract |
| `ActionReceipt` | v0.4 `ActionReceipt` | receipt ref, object/version/time, authoritative state, visibility, completion/recovery | owning persistence/workflow |
| scan compositions | v0.4 `AreaSignalStatus` / `CityScanFrame` / `ScanReadout` / `LockControl` | frame/geometry ref, atomic response ref, topic refs, coverage/freshness, lock eligibility | approved CityScan contract |
| `OfficerWorkItemView` | v0.4 `OfficerModerationItem` / `OperationsObject` | native ID/version, owner, workflow ref, evidence gap, permission, public projection | owning operations/workflow registry |

Every view contract MUST declare:

- canonical record/reference and version;
- applicable capability, authorization and visibility references;
- allowed visual states from the owning contract;
- emitted observable event or effect reference rather than a generic `onClick`;
- accessible name, reading/focus order and announcement behavior;
- acceptance-test IDs.

Machine files use names such as `story-cell.view.schema.json`. They MUST `$ref` the canonical schema when an approved machine schema exists; otherwise they require a reviewed one-to-one mapping and validation record against the exact versioned authoring contract. The absence of a machine schema does not permit an invented parallel contract, and prose anatomy alone is not a substitute for the mapping record.

## 9. Scene Contracts

### 9.1 Citizen entry

Order:

1. role-authorized, hash-pinned lockup and tagline;
2. one current local invitation or followed-area update;
3. one action: `เล่าเรื่องในพื้นที่นี้` or `ดูเรื่องนี้`;
4. Landometer relationship in a quiet footer role.

Do not lead with ranking, coins or a dense feed. Keep the cityscape atmosphere, but place reading content on stable local surfaces.

### 9.2 Direct CityStory

Order:

1. place;
2. main meaning;
3. one question;
4. material source class and limitation when it changes interpretation;
5. source/time line;
6. zero or one action;
7. receipt/recovery or clean completion.

CityScan is optional; a direct story MUST work without a Lock.

### 9.3 CityScan discovery

Order:

1. map + visible Scan Frame;
2. current place/geometry;
3. separate topic readouts required by the approved owning CityScan contract; the current proposed three-topic model is an example, not v0.5 authority;
4. coverage/freshness/no-score reason;
5. `ล็อกพื้นที่นี้` only when the latest result is ready;
6. locked story after successful Lock.

No community overlay may obscure the calculation frame while scanning.

### 9.4 Community conversation

Order:

1. local media/post;
2. author and place scope;
3. reply/share/report as secondary tools;
4. task-specific sign-in only when the user attempts a protected action.

### 9.5 Officer review and close loop

Order:

1. work item;
2. place and current responsibility;
3. evidence and missing information;
4. one authorized action;
5. authoritative saved state;
6. public-safe update.

The same governed context or explicitly linked versioned objects should connect citizen and officer views, while each view reveals only what the role may see.

## 10. State-to-Visual Grammar

Do not collapse all meanings into a generic `status` badge.

### 10.1 Visually relevant projections of canonical truth

This table guides visible composition only. It does not replace the canonical v0.4 truth model, publication truth or an owning workflow registry.

| Axis | User question | Visible expression |
|---|---|---|
| Processing | ระบบกำลังทำอะไร | loading/progress text + stateful motion |
| Analytical value | ข้อมูลมีค่าแบบไหน | value + label + pattern; unknown is not zero |
| Workflow | เรื่องอยู่ขั้นไหน | plain workflow text from owning system |
| Authorization | ผู้ใช้นี้ทำอะไรได้ | allowed action, checking, denied with safe alternative |
| Product authority | สิ่งนี้เป็น product truth ระดับใด | normally backstage; visible only when needed to prevent overclaim |
| Capability evidence | มีหลักฐานว่า capability ทำงานระดับใด | no simulated proof or effect |
| Delivery availability | ฟังก์ชันนี้ใช้ได้ใน release นี้ไหม | unavailable action omitted or honest read-only state |
| Publication truth | artifact/ข้อความนี้เผยแพร่ด้วยหลักฐานระดับใด | plain source/status projection where relevant |

Color MAY support a state but never carries it alone.

### 10.2 Required distinctions

- selected ≠ locked;
- locked ≠ published;
- replied ≠ saved;
- saved ≠ reviewed;
- reviewed ≠ accepted;
- closed ≠ outcome;
- unknown ≠ zero;
- out of coverage ≠ no event;
- stale ≠ current;
- user report ≠ official status.

### 10.3 CityScan public-copy subset

This table is a public-copy projection, not the complete CityScan state machine. Offline, restricted, story loading/error, snapshot unavailable and any other approved owning states remain mandatory even when not repeated here. Analytical `stale` also remains distinct from processing state.

| Internal state | Public Thai | Visual behavior |
|---|---|---|
| idle | `เลื่อนแผนที่เพื่อดูพื้นที่` | quiet frame |
| scanning | `กำลังดูพื้นที่นี้` | values cleared; no fake live count |
| settling | `กำลังสรุปข้อมูล` | state-led progress |
| signal_ready | `ข้อมูลพร้อม` plus topic values | Lock may become available |
| insufficient | `ข้อมูลยังไม่พอคำนวณ` | reason + safe alternative; never 0 |
| out_of_range | `พื้นที่นี้อยู่นอกขอบเขตข้อมูล` | explain where data is available |
| stale | `ข้อมูลนี้เก่าแล้ว` | date + refresh/retry when possible |
| locking | `กำลังล็อกพื้นที่นี้` | duplicate action prevented |
| locked | `ล็อกพื้นที่แล้ว` | exact geometry/snapshot visible |
| error | `ดูข้อมูลไม่สำเร็จ` | input/context retained + retry |

### 10.4 Motion

- Motion explains a state change; it does not manufacture excitement.
- Use LDS state-led motion for operational CityChat.
- No flashing, fake urgency, bouncing counters or variable reward.
- Reduced motion keeps the same information and final state.
- CityScan transient, settled and locked states remain distinguishable without animation.

## 11. Map, Timeline and Data Presentation

### 11.1 Protected map-safe area

During scan/read mode:

- the active geometry/Scan Frame remains fully visible;
- persistent overlays do not intersect the calculation frame or reticle;
- opening a panel either resizes both visible map and calculation geometry together, or overlays without changing either;
- the selected place persists in text when imagery is obscured;
- a locked story preserves a mini-map or exact place reference.

Desktop SHOULD use a stable information rail. During an active mobile scan, the implementation MUST use one composed scan HUD/tray and at most one disclosure sheet, not multiple stacked cards.

### 11.2 Map controls

Mobile and desktop MUST provide equivalent access to:

- zoom;
- locate/current place when permissioned;
- layer/legend;
- reset view;
- keyboard or non-map alternative.

Controls remain outside browser/LINE safe areas and have at least 44×44 CSS px hit targets.

### 11.3 Analytical ramp

Use the exact owning metric/data scale and LDS data-visualization rules.

The legend MUST show:

1. metric name in approved Thai;
2. unit;
3. period/year;
4. class/domain meaning;
5. current selected value/class;
6. no-data key;
7. source/update date;
8. coverage or reason data is insufficient;
9. `ดูที่มา`.

Use the canonical 41-stop LUT or an exact named 5-, 7- or 9-class subset defined by the owning scale registry. One governed view MUST pin one class-set/classification ID across every viewport. A 5-class public view and a 7-/9-class expert view are explicit alternate governed views with their own IDs and exact breaks; desktop size alone never switches the class set. A viewport change may alter layout and disclosure depth, but MUST NOT silently re-bin the view.

Renderer, legend, readout, text/table equivalent and export MUST carry one parity record with the same `scaleVersion`, classification method, domain, breaks, zero/no-data/neutral/outlier policy and selected value. A mismatch fails closed; it is not repaired visually in the client.

Keep distinct:

- meaningful zero;
- no data;
- stale;
- privacy-suppressed;
- out of coverage;
- below/above displayed range.

### 11.4 Timeline

- Label the selected year as an action/result, e.g. `ดูปี [selected year]`; screenshot values such as 2024 are fixtures, not normative content.
- Show the full comparison period in plain Thai.
- Dots may be visually small, but each touch target remains 44×44 CSS px.
- Play/pause has an accessible name and never implies live data.
- Changing year clears or marks old values stale until the new atomic result is ready.

### 11.5 Community content over data

- A post overlay includes a visible content-type label.
- It collapses during active scanning.
- It does not cover the selected geometry, legend or primary data readout.
- A user’s words do not inherit the data layer’s authority.

## 12. Accessibility, Privacy and Localization

### 12.1 Accessibility baseline

In addition to inherited LDS rules:

- critical paths work by keyboard, touch and switch input;
- focus order follows the visible reading order;
- drawer/sheet close returns focus to its opener;
- settled and locked scan changes are announced without excessive live-region noise;
- every map result has a text/table equivalent;
- selected, disabled, error and no-data states use text/icon/pattern as well as color;
- Thai marks and line height remain intact at 200% zoom;
- no hover-only map control;
- no sound is required to understand a state.

### 12.2 Privacy

- Screenshots containing names, faces and precise places are not reusable assets by default.
- The component pattern may be preserved; personal pixels require rights and purpose confirmation.
- Public preview uses the safest approved projection.
- Restricted person, household or precise-location data must not enter the public DOM, deep link, screenshot fixture or analytics payload.
- Ask only information needed for the immediate task.
- Plain copy states who can see submitted information at the decision moment.

### 12.3 Thai and English

- Thai is authored first, not translated mechanically from English.
- English may be offered as `EN`, not `US`, only when the locale is declared and release-ready; otherwise omit the selector.
- Same governed fields and state meaning appear in both languages.
- Test long Thai LGU names, person names, post text and button labels.
- Do not shrink essential Thai below the inherited readable type role to make it fit.

## 13. Dev Implementation Contract

### 13.1 Package shape

Recommended handoff:

```text
citychat-ves/
  citychat-ves.v0.5.md
  composition-manifest.citychat-ves.v0.5.json
  aliases.citychat-ves.css
  components/
    city-band.view.schema.json
    map-post-card.view.schema.json
    story-cell.view.schema.json
    primary-action.view.schema.json
    action-receipt.view.schema.json
  recipes/
    citizen-entry.md
    direct-story.md
    cityscan.md
    community-thread.md
    officer-review.md
  qa/
    visual-state-matrix.json
    copy-lint.json
    screenshot-baseline.json
    acceptance-map.json
```

The package MUST pin:

- LDS DS version, authoring revision, kit, Color Set and file hashes;
- exactly one applicable LDS profile; use `citychat.app` only when the package scope is operational CityChat web. The VES composition manifest is not a second LDS profile;
- CityChat VES version;
- Product Brief and ADR references;
- asset manifest version;
- triggered packs;
- supported capabilities/channels for that release;
- release receipt and artifact-specific QA.

### 13.2 Canonical schema inheritance

VES adds no truth, status, effect or workflow schema. View schemas MUST map the canonical v0.4/owning fields unchanged and `$ref` them when an approved machine schema exists, including `productAuthority`, `capabilityEvidenceStatus`, `deliveryAvailability`, `authorizationTruth.currentActorDecision` or its canonical reference, `claimLevel`, LDS `claimLabel`/`signalClass`, `valueState`, publication truth and workflow-owned `workflowStatus`.

Do not create generic `status`, `stage`, `phase`, `claim` or `evidenceStatus` fields that merge these meanings. Do not duplicate a canonical field under a CityChat visual alias.

### 13.3 Implementation order

1. Pin and validate the exact LDS machine package.
2. Inventory role-authorized CityChat assets and unresolved official/reuse approvals.
3. Replace legacy color/opacity rules with inherited LDS surfaces and foreground pairs.
4. Fix overflow, safe area and long-Thai behavior without changing asset silhouette.
5. Clean citizen/officer public copy.
6. Build the Direct CityStory vertical slice.
7. Add community conversation as a separate component family.
8. Add CityScan only after geometry, data scale, state and replay contracts pass.
9. Add officer workflow only from the approved native object/status registry.
10. Add LINE/share/follow adapters only when persistence, authorization and destination are release-proven.

### 13.4 Capability boundary

If a destination, backend effect, notification, official status, persistence or authorization is unknown, the UI MUST fail closed:

- omit unavailable control;
- show an honest read-only or recovery state;
- never render an optimistic receipt;
- preserve the user’s object/input when possible.

## 14. Migration from v0.4 / Current UI

### M0 — Approve boundaries

- approve v0.5 as CityChat VES candidate;
- record owner and effective date;
- pin LDS and v0.4 hashes;
- open decisions remain visible.

### M1 — Preserve assets, repair contrast

- create asset/rights/role registry;
- keep role-authorized, hash-pinned lockup and illustrations unchanged within their recorded roles;
- move lockup to a clean approved adjacent surface or separately approved opaque plate; block the placement if neither exists;
- replace local colors/opacity with LDS roles;
- test actual rendered foreground/surface pairs.

### M2 — Repair responsive behavior

- remove horizontal overflow;
- protect map-safe area;
- establish one-sheet mobile behavior;
- clear browser/LINE safe areas;
- add long-Thai fixtures.

### M3 — Simplify public language

- replace mixed English/system labels;
- make CTA describe outcome;
- move technical detail behind `ดูที่มา`;
- remove AI/inspector/internal vocabulary from frontstage copy.

### M4 — Replace engagement mechanics

- omit or demote rank, coins, levels and popularity mechanics from conforming civic scenes so they cannot determine civic priority; record product-wide deprecation or any bounded exception in the owning Product Brief/ADR;
- replace with question, follow, real receipt and useful update;
- keep reaction only as non-prioritizing expression when approved.

### M5 — Normalize component families

- `CityBand` as a visual variant of `GovernedContextHeader`;
- `PlaceStage`;
- `MapPostCard` / `ConversationCard` over an owning community-post record;
- `StoryCell` view over canonical v0.4 `StoryCell`;
- `PrimaryAction` view over canonical v0.4 `PrimaryAction`;
- `ActionReceipt` view over canonical v0.4 `ActionReceipt`;
- `OfficerWorkItemView` over canonical `OfficerModerationItem` / `OperationsObject`.

### M6 — Conditional expansion

- CityScan after approved data/LOCK/replay gates;
- officer workflow after owning status/permission evidence;
- LINE/share/follow after real effect and destination checks;
- v0.4 visual guidance deprecated only after parity and release QA.

## 15. Acceptance and Release Gates

These gates are additive. They never replace applicable LDS, v0.4, Product Brief/ADR, CityScan, data, privacy, security or deployment gates.

### 15.1 Visual and identity

- [ ] Exact role authorization + asset + role + hash recorded; official/reuse approval is not inferred.
- [ ] No recolor/filter/redraw/crop of protected identity.
- [ ] No local raw color/font/radius/breakpoint/motion values.
- [ ] CityChat remains recognizable through its six visual signatures.
- [ ] Identity atmosphere does not encode data/status.

### 15.2 Contrast

- [ ] Normal text ≥4.5:1 on actual rendered surface.
- [ ] Large text and meaningful non-text UI ≥3:1.
- [ ] Focus, selected geometry and critical boundary ≥3:1 against adjacent pixels.
- [ ] Bright mint action uses approved dark ink or an approved darker surface.
- [ ] Logo/surface pairing passes without changing logo bytes.
- [ ] No essential instruction uses placeholder/disabled/opacity-only text.
- [ ] Light, dark, system/auto and supported high-contrast settings are checked.
- [ ] Text, icons, focus, boundary and selection are sampled on representative satellite-tile fixtures.
- [ ] Every ramp passes adjacent-anchor, grayscale, named CVD and cross-scale-confusion checks.
- [ ] Contrast and meaning remain available at 200% zoom and in the text/table equivalent.

### 15.3 Responsive and Thai

- [ ] No horizontal overflow at 320/360/390 px, mobile landscape, tablet and desktop.
- [ ] 120+ character Thai post wraps or provides `อ่านต่อ`.
- [ ] Long municipality/person name remains understandable.
- [ ] 200% zoom works without horizontal page scroll on the critical path.
- [ ] Sticky actions clear safe areas and on-screen keyboard.
- [ ] All controls have at least 44×44 CSS px target.
- [ ] `document.documentElement.scrollWidth <= document.documentElement.clientWidth` on every no-horizontal-scroll test route; body and critical container widths are also asserted.
- [ ] Every critical component bounding rectangle remains within its viewport/container.
- [ ] Thai fixture expansion and 200% browser zoom are tested independently.
- [ ] Fixtures include 120+ Thai characters, maximum supported municipality/person labels, combining marks, keyboard-open and safe-area states.

### 15.4 Citizen comprehension

Within 15 seconds, a first-time citizen can identify:

- [ ] place;
- [ ] what happened/what is being asked;
- [ ] whether it is a resident report, calculated data or municipal status;
- [ ] any limitation that materially changes the meaning or decision;
- [ ] one available action;
- [ ] what happens after that action.

Any numeric pass threshold remains a proposed research gate until the study owner approves it.

### 15.5 Officer comprehension

Within 15 seconds, a first-time officer can identify:

- [ ] governed work item and place;
- [ ] owner/current step;
- [ ] missing information;
- [ ] one allowed next action;
- [ ] public-safe projection.

### 15.6 Map and CityScan

This gate is additive. CityChat Product Experience Profile v0.4 §14.4 and any applicable approved owning CityScan acceptance contract remain mandatory; this VES cannot weaken or replace them. Until an approval record exists, the current CityScan contract remains a proposed minimum candidate gate and does not authorize production release.

- [ ] Visible Scan Frame after all safe-area/panel/keyboard insets equals the API viewport polygon and polygon hash used for calculation.
- [ ] Panel, disclosure, orientation, safe-area and keyboard changes cannot silently change that polygon; a real change starts a new request/state.
- [ ] Frame, reticle, HUD/tray, disclosure sheet/panel, legend, CTA, controls and safe areas have zero forbidden intersection.
- [ ] Mobile and desktop resolve the same object, geometry, metric, period and selected state.
- [ ] All topic signals required by the approved owning contract arrive together with one atomic `responseVersion`; no overall score is invented. The current proposed three-topic set is not promoted by v0.5.
- [ ] Coverage is separate from topic score and can never raise it.
- [ ] Legend includes metric, unit, period, scale meaning, no-data, source/date and coverage.
- [ ] Renderer, legend, readout, text/table and export match exact `scaleVersion`, method, domain, breaks and zero/no-data/neutral/outlier policy.
- [ ] Zero, no-data, stale, privacy-suppressed and out-of-coverage are distinct.
- [ ] Latest request wins; old result cannot overwrite new frame.
- [ ] Geometry/frame change clears old values immediately, except a real compatible computed preview explicitly marked `ประมาณ`. Period change may retain the prior period only as a separately labelled reference, never as the current value. No old value remains when the new response is no-score or error.
- [ ] Transient, settled, locking and locked states are separately visible and announced.
- [ ] Lock unavailable before latest atomic result is ready.
- [ ] Server accepts only the latest eligible result token and issues an opaque locked-scan ID.
- [ ] Tenant, actor, role and cell scope are derived/rechecked server-side; IDOR tests fail safely.
- [ ] Failed Lock creates no locked ID or receipt.
- [ ] Reopened Lock reproduces the exact snapshot.
- [ ] Reopen/share re-evaluates current authorization and public-safe projection.
- [ ] Story error or back navigation returns to the same Locked Scan without silently rescanning.
- [ ] Map has accessible text/table equivalent.

### 15.7 Action and effect

- [ ] Action label names its immediate result.
- [ ] Action persists or shows honest failure/recovery.
- [ ] Duplicate effect is prevented.
- [ ] Receipt matches object/version/time.
- [ ] `รับเรื่องแล้ว` or closure copy comes only from owning authority.
- [ ] Permission is re-evaluated on reopen/share.

### 15.8 Copy lint

- [ ] Public L1 contains no unexplained internal/AI/inspector terms.
- [ ] No disclaimer wall before first value.
- [ ] Essential source/time/status stays visible in plain Thai.
- [ ] One scene has zero or one primary action.
- [ ] Popularity, coin, rank or level does not determine civic priority.
- [ ] Thai has been read aloud and reviewed by a citizen/officer representative.

### 15.9 Privacy and security

- [ ] No restricted person/household/location fields in public DOM, deep link, screenshot or analytics.
- [ ] Visibility is stated at submission.
- [ ] Personal media rights and purpose are recorded.
- [ ] Role/tenant rules are enforced by the owning system, not color or hidden UI alone.

### 15.10 Release evidence

- [ ] Artifact-specific Build Card and manifest generated together.
- [ ] Control inventory contains no dead or simulated controls.
- [ ] Automated and manual QA records point to exact artifact bytes.
- [ ] Machine-package consistency is not presented as CityChat artifact conformance.
- [ ] Actual availability is release-proven per channel.

## 16. Constructive Reference Cases

### Case A — Citizen reads and answers one local question

- `ruleAuthority: VES v0.5 candidate + v0.4 draft interaction contract`
- `sourceVersion: screenshot lineage A-03/A-05/A-06 + S3`
- `mediaStatus: conceptual`
- `runtimeEvidence: unresolved`

**Scene:** local photo or map → one plain meaning → one question → one action.

**Keep:** place, local voice, dark rounded card, avatar pattern, capsule action.

**Improve:** stable contrast surface, source type, clear result, receipt only after save.

**Good public copy:**

```text
คนในพื้นที่แจ้งว่าถนนหน้าเทศบาลเริ่มติดหลังฝนตก
ตอนนี้ผ่านได้ตามปกติไหม
[ตอบว่าตอนนี้ผ่านได้ไหม]
```

### Case B — Citizen explores CityScan

- `ruleAuthority: VES v0.5 candidate + proposed CityScan S5/S6`
- `sourceVersion: screenshot lineage A-04/A-12/A-13/A-14 + S5/S6`
- `mediaStatus: conceptual`
- `runtimeEvidence: not evidenced`

**Scene:** protected map frame → settled topic signals → data coverage → `ล็อกพื้นที่นี้` → StoryCell.

**Keep:** map-led context, boundary, timeline and legend.

**Improve:** one map-safe scene, complete Thai scale, visible state, no community overlay during scanning.

This is a target/candidate composition until CityScan runtime, topic labels, data readiness and acceptance gates are approved and release-proven.

### Case C — Officer closes a real loop

- `ruleAuthority: VES v0.5 candidate + owning workflow registry when approved`
- `sourceVersion: S3/S4; no captured officer workflow supplied`
- `mediaStatus: conceptual`
- `runtimeEvidence: not evidenced`

**Scene:** same governed item → owner/current step → missing evidence → one allowed action → public-safe update.

**Keep:** dark compact card family and place context.

**Improve:** remove social ranking, show responsibility and effect, use authoritative state only.

This case is a target composition until an approved officer workflow and runtime evidence are supplied.

### Rejected Case D — Popularity and optimistic success

- `ruleAuthority: VES v0.5 candidate rejection rule`
- `sourceVersion: screenshot lineage A-02/A-03/A-11 + S3`
- `mediaStatus: conceptual`
- `runtimeEvidence: not-applicable`

Reject:

- fake live pulse;
- weekly rank as civic importance;
- coins/levels for reporting;
- white label on bright mint without a passing pair;
- “เทศบาลรับเรื่องแล้ว” immediately after a local-only click;
- a long post clipped outside the viewport;
- community post presented as official evidence.

Recovery:

- show a real question or update;
- use a stable readable surface;
- omit unavailable action;
- show saved/pending/failure based on the real effect;
- preserve the user’s input.

## Appendix A — Screenshot Audit Ledger

The captures are visual-lineage evidence supplied on 2026-08-22. They do not prove capability, data quality, permission or full accessibility.

| # | File | View | General health | Main observation | SHA-256 |
|---:|---|---|---|---|---|
| 1 | `codex-clipboard-903c35da-94a6-4ea8-9dc2-1779d0e71ac3.png` | Desktop CityMETER | Partial | Strong map/data visual lineage; excessive density, weak secondary contrast, clipped scale labels | `b23b548d642e50a275e695786f1435628cb676cbf4f2cc7016d3dcad299cb5e4` |
| 2 | `codex-clipboard-09ce5688-1784-4453-8742-4259c8bcd75c.png` | Desktop CityChat entry | Partial | Strong identity/cityscape; blue lockup loses contrast, bright field blooms, ranking distracts | `7ee17ca7858d048236376e1c07f0ad28ae4fb7cc049b85702ddf915b814e3e9c` |
| 3 | `S__598021.jpg` | Mobile CityChat entry | Partial | Identity remains strong; summary truncation, ranking/CTA crowding and contrast risk | `35bf4127c2fef9498e08fd06385dbd2e13465d0be35f8caf7472a81476d43e4c` |
| 4 | `S__598022.jpg` | Mobile CityMETER | Partial | Place-grounded; mixed language, incomplete legend and overlay density | `2aa30a1a73957d3a2447b0ef834c87048902f41071c98edca83a2662efdb6105` |
| 5 | `S__598023.jpg` | Post detail | Partial | Useful local photo/reply pattern; muted controls and unclear next action | `0d787055e449c946a461877a13b7e96443a1bcb237dcb031df8590d52281a467` |
| 6 | `S__598024.jpg` | Reply auth gate | Partial–healthy | Friendly illustration; login copy should name the reply task | `af73095dece2ef67e502bf7bcb46cf16adaaf99319783962e78be3b188805d5e` |
| 7 | `S__598025.jpg` | Login | Partial | Clear form; mixed language and weak placeholder/border hierarchy | `7a76dca895baf0df382952477fcbd91ae22dc4652296a804373d545e3199069f` |
| 8 | `S__598026.jpg` | Profile setup empty | Weak–partial | Understandable step; helper/placeholder/disabled contrast and green bloom | `a79a34cff17204f2876d2b974becb25800479131037c20fa740d6e179377c0c6` |
| 9 | `S__598027.jpg` | Profile setup filled | Partial–healthy | Filled state clearer; mixed English and muted helper copy remain | `04d0bba0ee920a1c845384521932c9178002be4f49ee011c4f8d6630a6fd5961` |
| 10 | `S__598028.jpg` | Followed-area setup | Partial | Task is clear; disabled controls, full-page glow and bottom safe area need repair | `e3fb4096063fef95a57edd45b28a5588f8cd5d259c3ff98e8616d621ab1c98fb` |
| 11 | `S__598029.jpg` | Profile/gamification | Weak for civic job | Component craft visible; coin/level/points/achievement conflict with civic priority | `efffa0ec7cbcb3894b4494ee326b98b5d2e2ccf7e559362e32445de52c921cca` |
| 12 | `S__598030.jpg` | Map + community post | Partial | Real local story is valuable; too many overlays obscure map and data | `922b1aa1e2e0163493f374f66183cfef5ed86da5a1b8c2e462be8526f4163d6c` |
| 13 | `S__598032.jpg` | Long map post | Blocker | Confirmed horizontal clipping/overflow and excessive overlay stack | `ab46ccf5025e4e9da5e85132e521cfda8249baf149ad69a02bde6d1217f2cab8` |
| 14 | `S__598033.jpg` | Reply state on map | Partial | Reply continuity is clear; overflow, density and contrast risks remain | `beb792b0a857c23643486caad1970d114dd9173a0669f96eefd81f52c87276ef` |

## Appendix B — Source and Authority Ledger

| ID | Source | Status/use | SHA-256 |
|---|---|---|---|
| S1 | `sources/Landometer Design System v0.9.0-r7.md` | Owner-approved visual authoring authority | `52ef41f1b231f8b84955a40c21a018991a114a4f5eaabd8c5111816bf8d645b1` |
| S2 | `reference_landometer_repo/deployment/machine/v0.9.0/build-kit/lds-tokens.css` | Exact generated token delivery used for calculations; must remain byte-pinned | `aa834b08c6ecd00704a0c3580da83d291237738815a8e2e408aba12bb9551323` |
| S2a | `reference_landometer_repo/deployment/machine/v0.9.0/package.json` | Machine package identity and exact component/profile/pack inventory | `0b4b8bfd9abcf403cfebdc8fe9b3299a821eb6e2e96d0d5c9495f1627f206e47` |
| S2b | `reference_landometer_repo/deployment/machine/v0.9.0/SHA256SUMS.txt` | Machine package byte manifest | `bae8c0342fbcb48ea9ba972498b0b80505f25503ecffc1efbe5f8ffd7443ab32` |
| S2c | `reference_landometer_repo/deployment/machine/v0.9.0/profiles/citychat.app.json` | Exact CityChat shared LDS profile projection; authoring master remains authority | `5f2fa8aae51f33483fe309f50d793b3e4943d6e5d2c4aa2512cc90b80cbce340` |
| S3 | `CityChat_design_system_v0_4_citystory_first_intent_led_cityscan_aligned.md` | Draft product experience/interaction contract | `f1964af7b34a24ebf1f2afba1bcb1bba5f2d8df7cc871eeb7f4c72ba790689ba` |
| S4 | `Product_brief_CityChat_Landometer_v8_CityScan_Ecosystem_Aligned.md` | Draft candidate product authority | `607bd2c42cab7a164274d0b3dbbcfd1e8f3d66f185ce2921123cdd9a0b222098` |
| S5 | `cityscan_dev_handoff_v1/06_UX_UI_SCAN_LOCK_STORY_SPEC.md` | Proposed CityScan UX/state contract; runtime unverified | `9f0589edb956ed8cb08640cd8f22144302501e6c7c6ce32691fbbb26478b59fc` |
| S6 | `cityscan_dev_handoff_v1/08_ACCEPTANCE_TESTS_AND_ROLLOUT.md` | Proposed CityScan acceptance/rollout contract | `dafe83dadb1040edc71229dbafd8ed307ec924b010b14293a40ff542af5dbeb4` |
| S7 | `citychat_publish_repo/deployment/assets/identity/citychat-horizontal-lockup.png` | Exact asset bytes; PNG alone grants no role authorization | `94055c9b084eebaa585b3d31bef750abe87a1162fc1ec3be077f7fbcb2465e62` |
| S7a | `citychat_publish_repo/deployment/assets/identity/identity-assets.v0.4.json` | Artifact-local authorization record for `citychat-ui-20260822-01` header/footer only; does not transfer to a new build | `aacd6e2d5738c229173fd948e1398c701c7a04c376bbefdffdce674f51127e4d` |
| S8 | `sources/Product_brief_CityChat_Landometer_v7_CityStory_First.md` | Current narrative baseline; approval status unrecorded | `ffba6c6d5adfa29be6ffa791614db108268a5d1c4ff763fb05d7a7147c23c0e8` |

Authority is routed by domain, not collapsed into one global precedence list:

1. approved owner amendment / Product Brief / ADR owns product users, jobs, limits and intended outcomes;
2. LDS authoring authority owns shared visual rules, while the exact validated LDS machine bytes own implementation delivery within that visual domain;
3. approved owning dataset, CityScan and workflow registries own metric meaning, scale, geometry, LOCK and official state;
4. approved CityChat VES owns only CityChat composition, frontstage copy form/presentation within approved truth and product-specific visual expression;
5. artifact-specific release evidence and deployment authorization alone own actual availability.

Draft v0.4, draft v0.5 or a polished implementation cannot override an approved owning registry in its domain.

## Appendix C — Open Decisions

These do not block use of v0.5 as a draft implementation guide, but they block an authoritative production-conformance claim where relevant:

1. Named approver and effective date for Product Brief v8, CityChat Product Experience Profile v0.4 (or an owner-approved successor ADR) and CityChat VES v0.5. Without all applicable approvals, production-conformance claims remain blocked.
2. Official CityChat identity registry, including inverse/light lockup, favicon, touch, maskable and social variants with role-specific hashes.
3. Rights/purpose/expiry for current illustrations, avatars and personal photos.
4. Exact Thai name, unit, source, period, scale and coverage contract for the screenshot topic labelled `Flood Impact`.
5. Release-proven Google/LINE auth, reply, follow, receipt, notification and officer-operation capabilities by deployment.
6. Approved officer workflow/status registry and captured officer usability evidence.
7. Approved CityScan topic labels, thresholds, data readiness and runtime implementation evidence.
8. Product-wide deprecation timing for current rank/coin/level features, and whether any bounded non-civic exception exists; these mechanics are non-conformant as civic-priority signals now.

## Appendix D — Compact Vibe-Coding Brief

```text
PROTOTYPE ONLY until Product Brief/ADR, CityChat Product Experience Profile v0.4
(or owner-approved successor) and CityChat VES v0.5 have named approval,
effective date and migration parity. Do not claim production conformance from this prompt.

Build the prototype from the exact pinned Landometer DS package and this v0.5 candidate.

Keep:
- the recognizable lockup/cityscape/chat/map/card/photo/avatar patterns;
- use exact assets only when the new artifact has role authorization and media permission;
- never reuse personal screenshot pixels as assets;
- keep one capsule-action composition while rendering the inherited LDS Button.

Change:
- use LDS surface/foreground pairs; no local raw values or extra text opacity;
- an approved atmosphere action uses dark ink on bright mint; normal buttons inherit LDS;
- blue lockup needs a clean approved adjacent surface or separately approved opaque plate;
- citizen scenes are story-first and low-density;
- officer scenes show place, owner, current step, missing information and one action;
- public copy is short natural Thai; no AI/inspector/internal terms;
- preserve source/time/status in plain language, details under “ดูที่มา”;
- separate MapPostCard from governed StoryCell;
- protect the map/Scan Frame and keep only one mobile sheet;
- wrap long Thai and clear all safe areas;
- omit actions whose destination/effect/authorization is not release-proven;
- show receipt only after real persistence.

Omit or demote as civic-priority mechanics pending the owning Product Brief/ADR:
- weekly ranking, coins, levels, points, synthetic live counters and popularity scoring.

Before handoff, pass all applicable LDS, v0.4, CityScan, data, privacy, security
and deployment gates plus Sections 15.1–15.10. Attach the exact Build Card,
manifest, control inventory, screenshot baseline and release receipt.
```

---

**Final rule:** CityChat keeps its own face and way of speaking. LDS protects the shared visual quality. After approval, v0.5 controls how both are composed so citizens and officers can understand one local matter and take one useful next step without visual noise, difficult language or false confidence.
