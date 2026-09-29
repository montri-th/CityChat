# Landometer Design System 0.9.5

ใช้ DS0.9.5 สำหรับงานใหม่ของ Landometer และผลิตภัณฑ์ใน portfolio ตามขอบเขตที่เลือกไว้ รุ่นนี้นำชุดสี R2.1 ที่เจ้าของอนุมัติมาเป็น asset ใช้งานจริง เก็บเสียงแบรนด์ อัตลักษณ์ ฟอนต์ โลโก้ พื้นผิว และ gradient บรรยากาศที่ดีจาก0.9.1 ไว้

Exact identity: `v0.9.5-owner.1` · color registry `color-srgb-08` · categorical registry `landometer-series-10-v8`. Owner approved29September2026. This is an **unsigned owner distribution**. The included0.9.4 base retains its original signatures; those signatures do not sign0.9.5. Package checks never imply complete artifact conformance.

## เริ่มใช้งาน

1. Keep this whole package together. Run `node scripts/verify.mjs` from the plugin root before use. A missing file, mismatch or failed check blocks use. Do not fix a failed checksum by rewriting it.
2. Read [brand voice and identity](brand/BRAND.md), [machine policy](machine/policy.json), and the [full inherited master](../../references/inherited/lds-0.9.4/machine/Landometer%20Design%20System%20v0.9.4.md). The explicit changes below take precedence; all other evidence, accessibility, identity, layout and review obligations remain.
3. Websites import `build-kit/lds-0.9.5.css`; its relative files must travel together. Set `data-theme="light"` or `"dark"` on the root element, or omit it to follow the operating system. Charts use exact classes from `machine/color-srgb-08.scales.json`. Design tools import `machine/lds-0.9.5.tokens.dtcg.json` and retain the role/meaning contract; import alone is not validation.
4. Check the final artifact with `node scripts/check-artifact.mjs page.html`, then perform the format-specific visual, accessibility, source and truth review. The static checker reports its limits. Exact controlled colors do not prove visible contrast.

## เลือกสีจากคำถาม

| คำถาม | Asset | Boundary |
|---|---|---|
| แยกหมวดหมู่ | series.01–10, soft/vivid + ink | ผูกกับ category ID, มีชื่อและรูปทรง ไม่อาศัยสีอย่างเดียว |
| ปริมาณมากน้อย | sequential LUT | ระบุ metric, หน่วย, domain, threshold, ทิศทาง |
| ต่างจากค่าฐานในทิศใด | diverging LUT | ต้องมี midpoint ที่มีความหมายและชื่อชัดเจน |
| สร้างบรรยากาศแบรนด์ | 7 atmosphere recipes | ห้ามนำไปแทนปริมาณหรือสถานะข้อมูล |
| ไม่มีข้อมูล / ศูนย์ | dataState + label/pattern | ศูนย์เป็นข้อเท็จจริง ไม่มีข้อมูลเป็นคนละสถานะ |

Density ทุกตัวหารเป็นโทนร้อน: `density.area` ส้ม · `density.capita` กุหลาบ · `density.household` แดง · `built` เหลืองทอง. `count` เป็นจำนวนรวม ไม่ใช่ density. `built` คง ID เดิม; ห้ามกลับไปใช้ชื่อกำกวม `density`. สีไม่ทำให้คน/พื้นที่/ครัวเรือนเป็นข้อมูลเปรียบเทียบกันได้ ต้องอ่านตัวหารเสมอ

Dark categorical ใหม่มี10สี × soft/vivid/ink; light categorical ทุกค่ายังคงเดิม. The ten category cues remain circle, square, triangle, diamond, cross, star, hexagon, ring, dash and plus. Vivid must not compete with an energy accent on the same surface.

## สีข้อมูลที่ส่งจริง

All20families ×2themes use exact41-sample sRGB lookup tables. Preserve intermediate knots and every LUT byte. Do not rebuild a LUT from three displayed anchors and do not ask the chart library to interpolate its own palette. The approved per-theme LUTs replace the old0.9.4 dark-derivation formula and temporary warm mid→high restriction **only for0.9.5**. Older pinned artifacts keep their original rules.

Use3,5,7or9 discrete classes, sampled at `round(i*40/(n-1))`; prefer5–7 for small marks. Each class step meets the2.2ΔE OKLab diagnostic threshold. Gold9class is below the optional3.0aspiration, so do not claim uniformly high separation at small sizes. Diverging arms are monotonic independently; they are not claimed to have equal brightness. These are design checks, not color-vision accessibility certification.

```sh
node scripts/select-scale.mjs --family density.capita --theme dark --count 7
node scripts/select-scale.mjs --family balance --theme light --count 5 --domain=-100,100 --unit=percent --midpoint=0
```

The selector returns exact colors and LUT indices. Without a domain it returns **no invented thresholds**. With a domain it produces explicitly labelled equal intervals; review whether equal intervals fit the analysis. Continuous measurements keep half-open intervals `[lower, upper)` except the final closed interval. Values outside the declared domain must be handled explicitly, never silently clamped. Renderer, legend, accessible values and export must share the same thresholds/colors. A neutral diverging class usually covers an interval around the midpoint, not only exact zero.

## Contract changes retained from the reviewed repair

- **Measured values:** `measured` is a finite nonzero number; `measured_zero` is numeric0. `no_data`, `out_of_scope`, `suppressed`, `not_yet` carry null machine values and keep their existing visible cues. The six-state typed contract is [evidence-value.schema.json](machine/evidence-value.schema.json). EvidenceCard nonzero `data-value` must match the visible exact number. Do not hide suppressed numeric values in HTML or JSON.
- **Social formats:** [social-sidecar.schema.json](machine/social-sidecar.schema.json) retains the full inherited fields and admits square1080×1080 and OG1200×630. Run `scripts/validate-social.mjs sidecar.json --creative creative.png`. It checks schema, raster header dimensions and creative hash, not a full decode or signed artifact receipt.
- **Removed aliases:** old `--ldm-series-NN-light|dark`, ambiguous `--scale-density-*`, and stale warm `--ldm-product-ijji-*` are prohibited. Use the declared series fill/ink roles, exact density family, and the approved cool ijji identity. Historical bytes remain available for old receipts.
- **Brand:** protected lines and their roles, voice and all seven atmosphere recipes remain exact. One scene uses at most one protected line as its headline. Thai copy needs native review; claims and machine metadata must not exceed visible evidence.

## Source hierarchy and verification limits

The original signed0.9.4 machine/build-kit/roles trees live in `references/inherited/lds-0.9.4` at the plugin root. Read their content as inherited rules and history; do not load their old color CSS in0.9.5 artifacts. The untouched operator scripts are public source retained for complete checksum verification. **Do not run `freeze-release.mjs`, `sign-verification-attestation.mjs`, or any private-key tool from an agent.**

`machine/release.json` binds the approvedR2.1 snapshot hash, inherited base hashes, exact version and entrypoints. `SHA256SUMS.txt` binds this package's assets and verification scripts. These checks detect mismatches; they are not a cryptographic owner signature. Pin the repository commit or distribution checksum in team projects. `latest` is a discovery route, never a receipt identity.

The package does not close unrelated inherited follow-ups: product icon/sting completion, source reconstruction evidence, key revocation and artifact-specific governance. Review live rendering in both themes, narrow widths, text zoom, keyboard use, grayscale/CVD, actual foreground/surface contrast, Thai copy, exports and real evidence. Do not claim teamwide installation until each client or managed workspace has been activated and verified.
