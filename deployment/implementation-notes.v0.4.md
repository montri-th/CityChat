# CityChat Design Identity Playground v0.4 — implementation notes

## Application decision

This artifact uses the `design-identity-playground` page kind and the `designsystem.adoption` profile. It does not use the operational `citychat.app` AHA budget because the work object is team learning and adoption, not a civic report or follow-up flow.

## Preserved upstream boundary

The complete Landometer machine package at `vendor/landometer/v0.9.0/` is copied byte-for-byte from commit `d82ac775ab9d35a84cfb0dc77bc0ae804a7a0665`. The page loads only the exact `lds-tokens.css` and `lds-base.css` build-kit files. Build-local CSS composes semantic variables and does not copy the stale upstream skeleton identity literals.

## Product boundary

The CityChat Product Experience Profile v0.4 is a draft candidate. Product Brief v7 remains the current baseline until v8 is approved. CityScan, officer operations, LINE, persistence, receipts, sharing and telemetry remain unavailable in this artifact.

All named product surfaces are conceptual, synthetic fixtures. PLACE-DEMO-01 describes no real municipality, person, service coverage, or operational outcome. The local LOCK state and local demonstration acknowledgement are explicitly not product persistence or receipts.

## Identity boundary

The supplied CityChat horizontal PNG is used in header and footer only. The supplied SVG files are retained as source evidence but are not promoted to favicon, touch, maskable, social-preview or runtime roles. Those roles remain omitted until approved variants exist.

## Delivery

The intended route is a public GitHub Pages projection whose HTML entry points request page-level `noindex`, with `source_limited` evidence and no analytics. The public repository and directly linked resource files may still be indexed independently because GitHub Pages does not provide artifact-specific response headers here. `llms.txt` is a navigation aid only. It is not permission, conformance, action authority or readiness.

## Remaining manual gates

- Thai and English independent language review with product owner;
- native iOS and Android browser behavior;
- exact CityChat asset-role approvals;
- profile/Product Brief v8 approval;
- CityScan name/legal/metric/claim-ceiling decisions;
- recipient comprehension study and 15-second acceptance evidence.
