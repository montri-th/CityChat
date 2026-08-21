# CityChat Design Identity Playground v0.4

An interactive, source-limited guide for explaining CityChat to the team and helping developers carry its intent into working interfaces.

Live route after publication: **https://montri-th.github.io/CityChat/**

## Start here

1. Open the playground and try the same governed place through Direct CityStory, CityScan discovery, and Officer target modes.
2. Read [`DESIGN.md`](DESIGN.md) for the short human + developer contract.
3. Copy [`deployment/resources/starter/`](deployment/resources/starter/) into a prototype.
4. Use the exact vendored Landometer build kit; do not recreate tokens.
5. Run `npm test` before handing work to another person.

## Authority boundary

- **Landometer Design System v0.9.0-r7** owns shared tokens, typography, colour, geometry, motion primitives, accessibility and QA.
- **CityChat Product Experience Profile v0.4** owns CityChat interaction, evidence, object, state and release intent.
- **CityScan context documents** remain proposed until their owning approvals exist.
- The examples in this repository are conceptual fixtures. They are not proof that LINE, persistence, receipts, CityScan scoring or officer operations are deployed.

The site is an internal-team learning artifact projected through a public GitHub Pages URL. Its HTML entry points request page-level `noindex` and the evidence posture is `source_limited`; the public repository and directly linked resource files may still be discovered or indexed independently.

## Validate locally

```bash
npm test
python3 -m http.server 8000 --directory deployment
```

Then open `http://localhost:8000/`.
