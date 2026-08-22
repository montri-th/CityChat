# CityChat VES Interactive Playground v0.6.1

An interactive, source-limited guide for explaining CityChat to the team and helping developers carry its intent into working interfaces. Artifact v0.6.1 implements the approved, normative CityChat VES v0.6; it is not a new normative VES release.

Live route after publication: **https://montri-th.github.io/CityChat/**

## Start here

1. Open the playground and try the same synthetic matter through First Value, Saved & Return, CityScan discovery, and Officer modes.
2. Read [`DESIGN.md`](DESIGN.md) for the short human + developer contract.
3. Use the downloadable approved CityChat VES v0.6 for first value, living-city identity, civic continuity, motion application, visual composition, and plain-language frontstage rules.
4. Open the v0.6.1 Implementation Library records for the exact [CityChat colour roles](deployment/resources/citychat-ves/v0.6.1/citychat-color-role-map.json), [functional icons](deployment/resources/citychat-ves/v0.6.1/citychat-icon-map.json), [verified icon bindings](deployment/resources/citychat-ves/v0.6.1/citychat-icon-resolution.json), and [scoped motion](deployment/resources/citychat-ves/v0.6.1/semantic-motion.citychat.yml).
5. Copy [`deployment/resources/starter/`](deployment/resources/starter/) into a prototype.
6. Use the inherited LDS `.btn` and `.btn-icon` primitives and the exact vendored build kit; do not recreate button geometry, tokens, fonts, icons, or motion values.
7. Run `npm test` before handing work to another person.

## Authority boundary

- **Landometer Design System v0.9.0-r7** owns shared tokens, typography, colour, geometry, motion primitives, accessibility and QA.
- **CityChat VES v0.6** is the approved normative authoring authority for CityChat composition, narrative presentation, motion application, and implementation recipes.
- **Playground artifact v0.6.1** adds implementation bindings for controls, a self-hosted functional-icon subset, scoped motion examples, and a CityChat colour-usage overlay. These records govern this team-learning artifact and do not create VES v0.6.1 authority.
- **CityChat Product Experience Profile v0.4** remains the draft interaction, evidence, object, state and release dependency.
- **CityScan context documents** remain proposed until their owning approvals exist.
- The examples in this repository are conceptual fixtures. They are not proof that LINE, persistence, receipts, CityScan scoring or officer operations are deployed.

The site is an internal-team learning artifact projected through a public GitHub Pages URL. Its HTML entry point requests page-level `noindex` and the evidence posture is `source_limited`; the public repository and directly linked resource files may still be discovered or indexed independently. Icons shown in the library do not enable reply, share, history, receipt, CityScan, or officer capabilities. Approval of the VES does not prove any CityChat runtime capability.

## Validate locally

```bash
npm test
python3 -m http.server 8000 --directory deployment
```

Then open `http://localhost:8000/`.
