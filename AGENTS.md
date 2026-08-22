# CityChat implementation contract

Before changing an interface in this repository:

1. Read `DESIGN.md`, `deployment/assets/downloads/citychat-visual-experience-specification-v0.5.md`, and `deployment/assets/downloads/citychat-product-experience-profile-v0.4.md`.
2. Treat `deployment/vendor/landometer/v0.9.0/` as an immutable upstream snapshot. Never edit its bytes.
3. Load exactly one Landometer profile per artifact. The playground uses `designsystem.adoption`; operational CityChat uses `citychat.app`.
4. Use shared tokens and primitives from the vendored build kit. Do not introduce a parallel CityChat token palette.
5. Keep product authority, evidence, delivery availability, authorization, claim level, signal class, value state and workflow status as separate fields.
6. A StoryCell contains one main signal, up to three facts, one question and zero or one safe primary action.
7. Never render a receipt before authoritative persistence. A local demo acknowledgement must remain labelled as a fixture.
8. Never present a conceptual scan, synthetic count or illustrative municipality status as live or official.
9. Preserve source, date, coverage, boundary, limitation and object/version through every handoff.
10. Run `npm test` and inspect the declared viewport/theme/locale matrix before committing.
11. Keep public copy short and human. Put internal field names, schema terms and release codes behind team/developer disclosures.
12. Preserve the exact CityChat lockup only within the role and build recorded in the active identity manifest.

Files under `deployment/assets/downloads/` and `deployment/vendor/` are release inputs. Keep their hashes and manifest records synchronized.
