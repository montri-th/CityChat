# CityChat vibe-coding starter prompt

Use this prompt after replacing every bracketed value with the real work object and release context.

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
- Use CityChat Visual Experience Specification v0.5 for CityChat composition, contrast, density and plain-language frontstage copy.
- Use CityChat Product Experience Profile v0.4 for product interaction intent.
- Do not copy CityChat v0.3 visual tokens or invent local colour/type/motion values.

Truth
- productAuthority: [value]
- capabilityEvidenceStatus: [value]
- deliveryAvailability: [value]
- current authorization: [value + policy ref]
- claim level / label / signal class / value state: [values, when analytical]
- source, period, grain, coverage, freshness and limitation: [records]

Required experience
- Preserve the exact role-authorized CityChat identity asset and use stable LDS reading surfaces.
- Keep citizen scenes low-density; keep officer scenes compact but explicit about owner, current step, missing information and one allowed action.
- Use short, natural Thai in the interface. Keep internal field names in the handoff, not in citizen/officer copy.
- Show one main meaning before a dashboard.
- StoryCell: one signal, up to three facts, one question, zero or one primary action.
- Put source/status beside the claim; put full evidence one interaction deep.
- Omit unavailable actions. Never simulate success, a municipal acknowledgement, liveness or participation counts.
- A persisted effect requires receipt + next trigger or clean completion; failure requires honest recovery.
- Keep map/chart meaning available in text.
- Support keyboard, 320–390px, Thai 130%, 200% zoom and reduced motion.

Handoff
- Return the Build Card, capability matrix, component/state inventory, tested states, disabled capabilities and remaining manual gates with the implementation.
```

The prompt does not authorize a capability. Resolve the deployment's product authority, evidence, availability and current authorization before rendering any action.
