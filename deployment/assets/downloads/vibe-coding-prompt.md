# CityChat vibe-coding starter prompt

Use this prompt after replacing every bracketed value with the real work object and release context. Playground artifact v0.6.1 implements approved normative CityChat VES v0.6; its implementation records are examples and bindings for this artifact, not VES v0.6.1 authority.

```text
Build a [page/screen/flow] for CityChat.

User intent
- Person: [citizen / explorer / officer / community intermediary]
- Place or governed object: [object type + exact ID/version]
- One job: [the decision or next useful action]
- Entry mode: [Direct CityStory / CityScan discovery / Officer target]

Authority
- Use Landometer Design System v0.9.0-r7 from vendor/landometer/v0.9.0.
- Load exactly one LDS profile: [profile ID].
- Use approved CityChat Visual Experience Specification v0.6 for first value, living-city identity, civic continuity, motion application, composition, contrast, density and plain-language frontstage copy.
- When adapting playground artifact v0.6.1, read resources/citychat-ves/v0.6.1/: citychat-color-role-map.json, citychat-icon-map.json, citychat-icon-resolution.json, font-assets.manifest.json and semantic-motion.citychat.yml. Treat them as artifact implementation bindings under VES v0.6, not new normative authority.
- Use an approved owning Product Brief/ADR/profile for product meaning, state, effect and availability. CityChat Product Experience Profile v0.4 remains a draft dependency and cannot authorize a capability by itself.
- Do not copy CityChat v0.3 visual tokens or invent local colour/type/motion values.

Truth
- productAuthority: [value]
- capabilityEvidenceStatus: [value]
- deliveryAvailability: [value]
- current authorization: [value + policy ref]
- claim level / label / signal class / value state: [values, when analytical]
- source, period, grain, coverage, freshness and limitation: [records]

Required experience
- Preserve the exact role/build/surface-authorized CityChat identity asset. Never add a local white logo card or recolour, crop, filter, mask, animate or rebuild the mark.
- Use the exact self-hosted LDS type roles and disable synthetic font weights.
- Use inherited LDS `.btn` or `.btn-icon` primitives. Keep their governed capsule/circle geometry, inline padding, gap, focus, disabled, busy and press behaviour; do not mint local button values.
- Use a functional icon only when its closed role and actual control binding are resolved. Load the exact self-hosted subset in the font manifest, keep text or an accessible name, use currentColor, and never use a CityChat logo fragment or motif as a control icon.
- Do not bind a library-only reply, share, history, receipt or officer icon to product UI until the named capability is separately evidenced and enabled.
- Resolve CityChat colour jobs through the product-usage overlay; use the pinned LDS source for values. Do not treat the overlay as a second palette or analytical scale, and do not guess a colour when authority is absent.
- Resolve motion to an inherited LDS primitive named by the semantic-motion record, or to `none`. Keep first meaning and action available before enhancement. Reduced-motion and no-JavaScript routes must reach the final readable state; animation must not create a receipt, state, semantic event or telemetry.
- Keep citizen scenes low-density; keep officer scenes compact but explicit about owner, current step, missing information and one allowed action.
- Use short, natural Thai in the interface. Keep internal field names in the handoff, not in citizen/officer copy.
- Show one place and one honest meaning before a dashboard or unrelated engagement request.
- StoryCell: one meaning, up to three facts, one supported question when useful, and zero or one primary action with its expected consequence.
- Put source/status beside the claim; put full evidence one interaction deep.
- Omit unavailable actions. Never simulate success, a municipal acknowledgement, liveness or participation counts.
- A persisted effect requires a receipt plus next trigger or clean completion; failure requires honest recovery. Return only for a material versioned change.
- Keep map/chart meaning available in text.
- Support keyboard, 320–390px, Thai 130%, 200% zoom and reduced motion.

Handoff
- Return the Build Card, capability matrix, component/state inventory, tested states, disabled capabilities and remaining manual gates with the implementation.
- Return the exact authority/version of every adopted control, icon, motion and colour record, and name any role you deliberately left unbound.
```

The prompt does not authorize a capability. Resolve the deployment's product authority, evidence, availability and current authorization before rendering any action.
