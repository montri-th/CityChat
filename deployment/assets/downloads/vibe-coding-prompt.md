# CityChat vibe-coding starter prompt

Use this prompt after replacing every bracketed value with the real work object and release context. Playground artifact v0.8.0 implements approved normative CityChat DS Add-on v0.8; its implementation records are examples and bindings for this artifact, not DS Add-on v0.8.0 authority.

```text
Build a [page/screen/flow] for CityChat.

User intent
- Person: [citizen / explorer / officer / community intermediary]
- Place or governed object: [object type + exact ID/version]
- One job: [the decision or next useful action]
- Surface/lens: [CityScan — scan / CityChat for citizens — citizen / Officer CityMETER — officer]
- CityScan topic when used: [daily_life / visitor_identity / local_activity]
- Shared context: [caseId + contextRef + place/snapshot version]

Authority
- Use Landometer Design System v0.9.0-r7 from vendor/landometer/v0.9.0.
- Load exactly one LDS profile: [profile ID].
- Use approved CityChat DS Add-on v0.8 for first value, CityChat identity, civic continuity, CityScan/CityCell composition, motion application, contrast, density and plain-language frontstage copy.
- When adapting playground artifact v0.8.0, read resources/citychat-ds-addon/v0.8.0/: cityscan-citycell-taxonomy.json, citychat-case-library.json, citychat-color-role-map.json, citychat-button-contract.json, citychat-icon-map.json, citychat-icon-resolution.json, font-assets.manifest.json and semantic-motion.citychat.yml. Treat them as artifact implementation bindings under DS Add-on v0.8, not new normative authority.
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
- Keep frontstage identity CityChat-only. Do not render or resolve another product's name, mark, motif, gradient, profile or product token into CityChat. Files inside an immutable vendor snapshot do not become CityChat assets.
- Use the exact self-hosted LDS type roles and disable synthetic font weights.
- Use inherited LDS `.btn` or `.btn-icon` primitives. Keep their governed capsule/circle geometry, inline padding, gap, focus, disabled, busy and press behaviour; do not mint local button values.
- Use a functional icon only when its closed role and actual control binding are resolved. Load the exact self-hosted subset in the font manifest, keep text or an accessible name, use currentColor, and never use a CityChat logo fragment or motif as a control icon.
- Do not bind a library-only reply, share, history, receipt or officer icon to product UI until the named capability is separately evidenced and enabled.
- Resolve CityChat colour jobs through the product-usage overlay; use the pinned LDS source for values. Do not treat the overlay as a second palette or analytical scale, and do not guess a colour when authority is absent.
- Resolve motion to an inherited LDS primitive named by the semantic-motion record, or to `none`. Keep first meaning and action available before enhancement. Reduced-motion and no-JavaScript routes must reach the final readable state; animation must not create a receipt, state, semantic event or telemetry.
- When CityScan is present, show exactly three viewport prompts: "แถวนี้น่าอยู่ยังไง", "น่าเที่ยวตรงไหน", and "น่าค้าขายอะไรดี". Treat them as exploration questions, never as verdicts and never as one aggregate score.
- Open detail through the governed CityCells for the selected topic. Preserve `cityCellId`, public label, presentation kind, value state, claim level, evidence reference, public meaning and forbidden claims.
- Keep `unknown`, `out_of_coverage`, `stale`, `suppressed_privacy`, and unresolved mappings distinct from zero. Do not invent missing visitor evidence or silently move the unresolved hotel mapping.
- For connected examples, preserve the same case/context/snapshot from CityScan to citizen CityChat to Officer CityMETER. Use `LIVE-01`, `VISIT-01`, or `TRADE-01` as a structural reference; use `REJECT-01` to test that an aggregate CityScore is rejected.
- Keep citizen scenes low-density; keep officer scenes compact but explicit about source, freshness, gap, owner, current step and one allowed action.
- Use short, natural Thai in the interface. Say what a person needs to know; keep internal field names, system terms and technical caveats in the handoff, not in citizen/officer copy.
- Show one place and one honest meaning before a dashboard or unrelated engagement request.
- StoryCell: one meaning, up to three facts, one supported question when useful, and zero or one primary action with its expected consequence.
- Put source/status beside the claim; put full evidence one interaction deep.
- Omit unavailable actions. Never simulate success, a municipal acknowledgement, liveness or participation counts.
- A persisted effect requires a receipt plus next trigger or clean completion; failure requires honest recovery. Return only for a material versioned change.
- Keep map/chart meaning available in text.
- Support keyboard, 320–390px, Thai 130%, 200% zoom and reduced motion.
- If using playground data, label it as a local conceptual fixture. Do not present it as live place data, official status, persisted contribution, integrated cross-surface handoff or deployed officer work.

Handoff
- Return the Build Card, capability matrix, component/state inventory, tested states, disabled capabilities and remaining manual gates with the implementation.
- Return the exact authority/version of every adopted control, icon, motion and colour record, and name any role you deliberately left unbound.
- Return the chosen CityScan topic, CityCell IDs, `caseId`, `contextRef`, snapshot/version, evidence gaps, forbidden claims and whether every effect is local-only or backed by an owning runtime.
```

The prompt does not authorize a capability. Resolve the deployment's product authority, evidence, availability and current authorization before rendering any action.
