# CityChat DS Add-on Playground v0.8.0

An interactive, source-limited guide for explaining CityChat and carrying its intent into working interfaces. Artifact v0.8.0 implements the approved normative CityChat DS Add-on v0.8; it does not create a new normative version or prove that a product capability is live.

Live route after publication: **https://montri-th.github.io/CityChat/**

## Start here

1. Open the playground and try one local fixture through three connected views: **CityScan → CityChat for citizens → Officer CityMETER**.
2. Read [`DESIGN.md`](DESIGN.md) for the short human + developer contract.
3. Use the downloadable [CityChat DS Add-on v0.8](deployment/assets/downloads/citychat-ds-addon-v0.8.md) for first value, CityChat identity, civic continuity, motion application, visual composition, and plain-language frontstage rules.
4. Start CityScan with exactly three prompts: **แถวนี้น่าอยู่ยังไง**, **น่าเที่ยวตรงไหน**, and **น่าค้าขายอะไรดี**. Open their meaning, source, and limits through [CityCells](deployment/resources/citychat-ds-addon/v0.8.0/cityscan-citycell-taxonomy.json); never collapse them into one overall score.
5. Try the [case library](deployment/resources/citychat-ds-addon/v0.8.0/citychat-case-library.json): three constructive cases, each shown through scan/citizen/officer lenses, plus one rejected aggregate-score example.
6. Open the v0.8.0 Implementation Library for the exact [button rule](deployment/resources/citychat-ds-addon/v0.8.0/citychat-button-contract.json), [CityChat colour roles](deployment/resources/citychat-ds-addon/v0.8.0/citychat-color-role-map.json), [functional icons](deployment/resources/citychat-ds-addon/v0.8.0/citychat-icon-map.json), [verified icon bindings](deployment/resources/citychat-ds-addon/v0.8.0/citychat-icon-resolution.json), [scoped motion](deployment/resources/citychat-ds-addon/v0.8.0/semantic-motion.citychat.yml), and [safe asset library](deployment/assets/asset-library.v0.8.0.json).
7. Copy [`deployment/resources/starter/`](deployment/resources/starter/) into a prototype. Use the inherited LDS `.btn` capsule and `.btn-icon` circle; do not recreate button geometry, tokens, fonts, icons, or motion values.
8. Run `npm test` before handing work to another person or AI.

## Authority boundary

- **Landometer Design System v0.9.0-r7** owns shared tokens, typography, colour, geometry, motion primitives, accessibility and QA.
- **CityChat DS Add-on v0.8** is the approved normative authoring authority for CityChat identity, composition, narrative presentation, CityScan/CityCell use, motion application, and implementation recipes.
- **Playground artifact v0.8.0** adds implementation bindings for controls, a self-hosted functional-icon subset, scoped motion examples, and a CityChat colour-usage overlay. These records govern this team-learning artifact and do not create DS Add-on v0.8.0 authority.
- **CityChat Product Experience Profile v0.4** remains the draft interaction, evidence, object, state and release dependency.
- **CityScan context documents** remain proposed until their owning approvals exist.
- The examples in this repository are local conceptual fixtures. They are not live place data and are not proof that LINE, persistence, receipts, CityScan scoring, cross-surface handoff, or officer operations are deployed.

Only CityChat identity may appear in the current frontstage and public asset library. Vendored LDS files remain an immutable upstream dependency; identities from other products inside that vendor snapshot are neither CityChat assets nor permission to render them.

The site is an internal-team learning artifact projected through a public GitHub Pages URL. Its HTML entry point requests page-level `noindex` and the evidence posture is `source_limited`; the public repository and directly linked resource files may still be discovered or indexed independently. Icons shown in the library do not enable reply, share, history, receipt, CityScan, or officer capabilities. Approval of the DS Add-on does not prove any CityChat runtime capability.

## Validate locally

```bash
npm test
python3 -m http.server 8000 --directory deployment
```

Then open `http://localhost:8000/`.
