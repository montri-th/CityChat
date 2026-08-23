# CityChat DS Add-on Playground v0.7.0

An interactive, source-limited guide for explaining CityChat to the team and helping developers carry its intent into working interfaces. Artifact v0.7.0 implements the approved, normative CityChat DS Add-on v0.7; it is not a new normative DS Add-on release.

Live route after publication: **https://montri-th.github.io/CityChat/**

## Start here

1. Open the playground and try the same synthetic matter through First Value, Saved & Return, CityScan discovery, and Officer modes.
2. Read [`DESIGN.md`](DESIGN.md) for the short human + developer contract.
3. Use the downloadable [CityChat DS Add-on v0.7](deployment/assets/downloads/citychat-ds-addon-v0.7.md) for first value, living-city identity, civic continuity, motion application, visual composition, and plain-language frontstage rules.
4. Open the v0.7.0 Implementation Library records for the exact [button rule](deployment/resources/citychat-ds-addon/v0.7.0/citychat-button-contract.json), [CityChat colour roles](deployment/resources/citychat-ds-addon/v0.7.0/citychat-color-role-map.json), [functional icons](deployment/resources/citychat-ds-addon/v0.7.0/citychat-icon-map.json), [verified icon bindings](deployment/resources/citychat-ds-addon/v0.7.0/citychat-icon-resolution.json), [scoped motion](deployment/resources/citychat-ds-addon/v0.7.0/semantic-motion.citychat.yml), and [safe asset library](deployment/assets/asset-library.v0.7.0.json).
5. Copy [`deployment/resources/starter/`](deployment/resources/starter/) into a prototype.
6. Use the inherited LDS `.btn` and `.btn-icon` primitives and the exact vendored build kit; do not recreate button geometry, tokens, fonts, icons, or motion values.
7. Run `npm test` before handing work to another person.

## Authority boundary

- **Landometer Design System v0.9.0-r7** owns shared tokens, typography, colour, geometry, motion primitives, accessibility and QA.
- **CityChat DS Add-on v0.7** is the approved normative authoring authority for CityChat composition, narrative presentation, motion application, and implementation recipes.
- **Playground artifact v0.7.0** adds implementation bindings for controls, a self-hosted functional-icon subset, scoped motion examples, and a CityChat colour-usage overlay. These records govern this team-learning artifact and do not create DS Add-on v0.7.0 authority.
- **CityChat Product Experience Profile v0.4** remains the draft interaction, evidence, object, state and release dependency.
- **CityScan context documents** remain proposed until their owning approvals exist.
- The examples in this repository are conceptual fixtures. They are not proof that LINE, persistence, receipts, CityScan scoring or officer operations are deployed.

The site is an internal-team learning artifact projected through a public GitHub Pages URL. Its HTML entry point requests page-level `noindex` and the evidence posture is `source_limited`; the public repository and directly linked resource files may still be discovered or indexed independently. Icons shown in the library do not enable reply, share, history, receipt, CityScan, or officer capabilities. Approval of the DS Add-on does not prove any CityChat runtime capability.

## Validate locally

```bash
npm test
python3 -m http.server 8000 --directory deployment
```

Then open `http://localhost:8000/`.
