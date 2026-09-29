# CityChat DS Add-on v0.9.1 — normative (dev edition)

**สถานะ:** normative สำหรับ CityChat artifact ที่สร้างหลัง 3 กันยายน 2026 · owner-directed 2–3 กันยายน 2026 · **ต่อยอด** `CityChat-DS-Addon-v0.9.md` (หลักการ §1–§19 ยังใช้) — ไฟล์นี้บันทึกเฉพาะ **กติกาที่ตกลงจริงจากการ build landing** ให้ dev ใช้กับ Claude ร่วมกับ LDS v0.9.1 ได้ทันที
**ฐาน:** Landometer Design System v0.9.1 (authoring `0.9.1-r8` · ruleset `lds-rules-0.9.1` · machine `v0.9.1-mp7` · Color Set `color-srgb-05`) — LDS ชนะทุกเรื่องที่ LDS เป็นเจ้าของ
**Reference implementation:** `templates/citychat-landing/CitychatLanding.dc.html` + `citychat.css` — hash ปัจจุบันใน `handoff/citychat-landing/handoff/SHA256SUMS.txt` (ห้ามพิมพ์ hash จากความจำ)

> ทุกบรรทัดในไฟล์นี้เป็น governance — **ห้าม render ขึ้นหน้าผู้ใช้** (OUTPUT-CLARITY-01)

---

## A · ลำดับอำนาจและวิธีอ่าน

1. คำตัดสินเจ้าของที่บันทึกวันที่ไว้ (ยกไว้ในข้อที่เกี่ยว)
2. LDS v0.9.1 master + Build Kit (`build-kit/lds-tokens.css`, `lds-base.css`) — tokens, type, geometry, motion roles, icon axes, navigation budget
3. ไฟล์นี้ → `CityChat-DS-Addon-v0.9.md` → `citychat.css`
4. reference implementation

ขัดกัน = รายงานเป็นข้อ ห้ามเลือกข้างเงียบ ๆ · `ต้อง/ห้าม` = บังคับ · `ควร` = ค่าเริ่มต้น

## B · Surface contract (CC-SURF-01)

CityChat product gradient เป็น fixed surface ที่ **ธีมสลับความสว่าง**: light = deep field (`#007A58→#007E79`) · dark = light field (`#3BD19B→#3BD3CB`)

- ink บน gradient อ่านจาก `--on-product-citychat`, `-2`, `-line`, `-metadata`, `-surface`, `-ink`, `-focus` เท่านั้น (นิยามใน `citychat.css`) — **ห้าม** `--text-primary`
- asset ที่มี 2 rendition (lockup, depa/dSURE/TDC) เลือกตาม **พื้นที่วางจริง** ไม่ใช่ตามธีม: บน gradient ธีมมืด = ใช้ rendition สำหรับพื้นสว่าง (บันทึกจาก defect 2026-09-02)
- `--citychat-heading` = Brand Blue บน canvas สว่าง / `--text-primary` บน canvas มืด (1.81:1 ไม่ผ่าน) — ใช้กับ h2/h3 ของ section บน canvas เท่านั้น
- add-on **เพิ่มชื่อใหม่เท่านั้น** ห้าม redefine token ของ build kit

## C · Identity และโลโก้พันธมิตร

| Asset | กติกา |
|---|---|
| CityChat lockup | exact bytes `assets/citychat-lockup.png` (Brand Blue wordmark, พื้นสว่าง) / `citychat-lockup-dark.png` (Sky wordmark, พื้นมืด) — ไม่มี carrier/plate/filter |
| Landometer บน nav | symbol `landometer-symbol-color.png` 54px **ทั้งสองธีม** + wordmark พิมพ์ Arvo 700 23px `#757575` (owner directive 29 ส.ค. 2026 — **ข้อยกเว้นที่ประกาศ** ของ LOGO-SURFACE/SC-03 ต่อ identity authority; ขัดกับ SKILL.md ข้อ "never a self-composed lockup" → ต้องมี identityApproval record ก่อน production) |
| ตราเทศบาล (CC-SEAL-01) | 512×512 พื้นโปร่งใส ครอปวงกลม margin 2% **ทุกตราขนาดเดียวกัน** (script: `skills/refresh-citychat-landing/scripts/normalize-seals.js.txt`) · แสดง 72px บนการ์ด · alt = "ตรา<ชื่อเทศบาล>" · ห้าม recolor · ใช้ได้เฉพาะ อปท. ที่ **ลงนาม LOI แล้ว** |
| depa · dSURE · TDC | `depa-dsure-tdc.png` (สี, พื้นสว่าง) / `depa-dsure-tdc-white.png` (พื้นมืด) — สลับด้วย `hidden` ตามพื้น; alt เต็ม "depa · dSURE software · บัญชีบริการดิจิทัล" |
| Persona ข้าวกล้อง (CC-PERSONA-01) | ป้า = ชาวบ้าน · ลุง = อปท. (owner 2026-09-02) · 480px วงกลม ตัด caption · สี remap เป็น token เท่านั้น: coral `#FF5A5F`, yellow `#FFBC1F`, brand blue `#1D4497`; **สีผิวห้ามแตะ** · decorative (`alt=""`) · ไม่ใช่ badge/level/leaderboard |
| ภาพหน้าจอเจ้าหน้าที่ | role `ui_capture` · `aspect-ratio:1900/895` · caption = ชื่อชั้นข้อมูล + ตัวเลขที่อ่านได้จากภาพ + ข้อจำกัดที่ระบบบอก ("ตำแหน่งที่ตั้ง ไม่ใช่สถานะการใช้งานจริง") |

## D · Navigation — unified nav r7 (CC-NAV-01)

ใช้โครงเดียวกับ `templates/unified-nav` แต่ค่า calm เป็น **r7** จาก `citychat.css` (`[data-cc-nav]`):

- แถบ 76px sticky z-100 · identity · `/ CityChat` · CityMETER · CityWiki · CTA capsule "รับสิทธิ์ทดลองใช้" → `#offer` · ปุ่มเมนูวงกลม 44 — งบ 4 controls หลัง identity
- calm เมื่อเลื่อนลง >24px (delta >4px): bar 29px · bg canvas 26% · row `width:200%; scale(.5)` origin left · opacity .72 · เส้นล่าง 20% · 560ms `--motion-ease-state` · คืนเมื่อเลื่อนขึ้น / y<24 / hover / focus / เมนูเปิด · **ข้อยกเว้น hit-target ที่ประกาศ** (สถานะพัก ไม่ใช่สถานะใช้งาน)
- **Bookmark rail** `[data-cc-rail]` fixed right 16px กลางจอ — ต้อง**อยู่นอก `<nav>`** (nav มี `backdrop-filter` → เป็น containing block ของ fixed) · 44px วงกลม · scrollspy → `aria-current="location"` · glyph ตาม `handoff/glyph-map.json`
- แผงเมนู 340px radius 16 `--elevation-sm`: ปุ่มธีม 3 สถานะ (system→light→dark, glyph `dark_mode`/`light_mode`) → กลุ่ม "Landometer ecosystem" 5 แถว (CityChat = `aria-current="page"` + "· อยู่ที่นี่") → ลิงก์ landometer.com · Escape/คลิกนอกปิด
- theme init inline ใน `<head>` ก่อน first paint (static build) · `data-theme` + `color-scheme` + `theme-color`
- skip link → `#main-content` เป็น element แรก

### CTA sweep highlight — ข้อยกเว้นที่ประกาศ (CC-EX-01)

owner directive 29 ส.ค. 2026 ให้ CTA บนแถบมี sweep `ccSweep 3.7s` + `ccFlick 1.09s steps(1,end)` (คาบไม่ลงตัว) เป็นลายเซ็น — **ขัด** `[MOTION-01]` (LDS ห้าม looping ambience) และ Add-on v0.9 §12 · เงื่อนไขใช้: หนึ่งจุดต่อฉาก · layer เป็นสำเนาป้าย `aria-hidden` `pointer-events:none` · `prefers-reduced-motion` หยุดที่เฟรมเต็มคำ (`clip-path:inset(0)`) · ต้องบันทึกใน Build Card เป็น `exceptionIds:["CC-EX-01"]` และรอ owner sign-off ทุก release — ค่า LDS-conformant ถ้าไม่ได้รับอนุมัติคือ `motion.cta.discovery-cue.01` (540ms ครั้งเดียว)

## E · Motion — Riddim approach (CC-MOTION-01)

- CSS state deltas อยู่ใน `citychat.css` (`[data-approach]…`), adapter อยู่ใน logic class (`initApproach`) — static build ต้องมีพฤติกรรมเทียบเท่า: threshold `.14` · rootMargin `0 0 -12% 0` · once-only · delay `min(i,3)×150ms` จาก direct-child order ใน `[data-approach-sequence]` · transition `760/920ms` จาก token · arm เฉพาะ target ที่อยู่ใต้ viewport ตอน init
- roles ที่ใช้: `section_opener` (หัว section) · `peer_group` (การ์ดพี่น้อง) · `paired_inline` (`data-approach-from="inline-start|inline-end"` คู่ media/copy) · `proof_preview` (แถบหลักฐาน, การ์ด record) · `contact_group`
- **ห้าม** ครอบ hero (`data-hero`), nav, h1, ข้อความ truth label, ปุ่มหลักแรก
- fail-open: reduced-motion / no IntersectionObserver / focusin / hashchange / 2400ms audit → land ทันที ไม่มี transition
- wrapper ของหน้า (`#top`) ต้อง `overflow-x:clip` — inline travel 36px ก่อน reveal ห้ามทำให้เกิด hscroll (ห้ามใส่ที่ nav)
- press = `translateY(2px)` 120ms · hover = `--surface-blue-tint` · ไม่มี parallax/loop อื่นนอก CC-EX-01

## F · Icons (CC-ICON-01)

- `<span class="ls-icon" aria-hidden="true">glyph</span>` — Material Symbols Rounded · FILL 0 · wght 300 · GRAD 0 ทุกสถานะ
- ทุกรายการยาว (≥3 ข้อ, ข้อละ >8 คำ) **ควร** นำด้วยไอคอนสื่อความ 24px `--interaction-accent` ใน grid `28px 1fr` + `<strong>` คำหลัก — ไอคอนช่วยสแกน ไม่แทนคำ
- glyph ที่อนุมัติสำหรับ CityChat (46 ตัว) อยู่ใน `handoff/citychat-landing/handoff/glyph-map.json` — เพิ่มใหม่ต้องเพิ่มลงไฟล์นั้นและ subset font ก่อน production; ห้ามหยิบ glyph ใกล้เคียงแทนเงียบ ๆ
- TopicMark (หมวดเรื่อง) = ไอคอน 28px + label เสมอ — ชุดปัจจุบัน: `flood` น้ำท่วมและจุดเสี่ยงภัย · `air` ฝุ่น PM2.5 · `elderly` กลุ่มเปราะบาง · `home_pin` พิกัดครัวเรือน · `storefront` ท่องเที่ยวและร้านค้า · `forum` เรื่องร้องเรียน

## G · Content จาก LOI (CC-LOI-01)

- ทุกตัวเลข/ชื่อ/วันที่/KPI ของ อปท. มาจาก `templates/citychat-landing/LOI-analysis-2569.md` เท่านั้น (สรุปจาก LOI ที่ลงนาม) — แก้ที่ไฟล์นั้นก่อนแล้วจึงแก้หน้า
- การ์ด อปท. = ตรา 72px · จังหวัด · เลขที่ LOI (ถ้ามี) · เดือน/ปี · ชื่อเทศบาล · โจทย์หลัก (ไอคอน + accent) · ย่อหน้าเดียว ≤ 60 คำ ที่ยกจาก pain point/KPI ของ LOI
- "สิ่งที่ อปท. ได้ภายใน 12 เดือน" = 5 ข้อ (GIS ≥5 ชุด · Dashboard · พิกัดครัวเรือน/กลุ่มเปราะบาง · จุดเสี่ยง/เรื่องแจ้ง · อบรม ≥1 รอบ ≥20 คน) — ข้อ API/Open Data **ถูกตัด** (owner 2026-09-02) ห้ามใส่กลับโดยไม่มีคำสั่ง
- ทิศทางที่ต้องสื่อ: "รับทุกความต้องการของ 10 อปท. แรก แล้ว reposition" → hero นำด้วยฐานข้อมูล 5 ชุด (CityMETER) ก่อน ห้องแชทเป็นทางไปถึงหน้างาน (CityChat) · ปิดด้วย "เหลือที่อีก N แห่ง" โดย N = 10 − จำนวน LOI ที่ลงนาม
- ห้ามคำว่า real-time/สำเร็จ/แก้แล้ว, ห้ามคะแนนรวม, unknown ≠ 0, ตัวอย่างข้อมูลต้องมี truth label "ตัวอย่างโครงสร้างข้อมูล — ยังไม่ผูกกับฐานข้อมูลจริง" จนกว่าจะอ่านจาก data contract

## H · Contact และ team (CC-CONTACT-01)

- การ์ดคน = ภาพ 88px วงกลมจาก Landom (`montri-th.github.io/Landom/public/assets/people/<id>.jpg`) · ชื่อเล่น · ตำแหน่ง (technical-th) · ชื่อจริง · ปุ่ม `tel:` capsule outline · ลิงก์ "โปรไฟล์บน Landom ↗" → `https://montri-th.github.io/Landom/?person=<id>&lang=th`
- บุคคลปัจจุบัน: เสก `P0001` ผู้จัดการแพลตฟอร์มข้อมูลเมือง 087-453-7407 · ฟิล์ม `S0004` ผู้จัดการผลิตภัณฑ์ CityChat 065-969-5850 · อีเมลกลาง `citychat@landometer.com`
- footer ต้องลิงก์ครบ ecosystem: Landometer · CityMETER · CityWiki · Landom

## I · Media (CC-MEDIA-01)

- `<video>` ต้อง `controls muted playsinline preload="metadata"` · ตรวจ `error`/`networkState===3` ด้วย JS แล้วสลับเป็น fallback (ไอคอน `videocam_off` + ประโยค + ลิงก์ดาวน์โหลด) — **ห้าม** กล่องเทาว่าง · ห้าม inline `onError` ใน DC template
- โคเดกที่ ship ต้อง H.264/AAC (ไฟล์ `citylens-lq` เดิม error code 4 — ยังรอไฟล์ใหม่จากเจ้าของ)
- ภาพ `loading="lazy"` ยกเว้นใน hero

## J · Build Card ขั้นต่ำสำหรับ CityChat web artifact

```yaml
artifact: citychat-landing
lds: { release: "0.9.1", authoring: "0.9.1-r8", machine: "v0.9.1-mp7", colorSet: "color-srgb-05" }
addon: { doc: "brand/CityChat-DS-Addon-v0.9.1-normative.md", css: "templates/citychat-landing/citychat.css", sha256: "<from SHA256SUMS.txt>" }
nav: { preset: "citychat", calm: "r7", rail: 6, ctaSweep: "CC-EX-01" }
motion: { contract: "riddim-approach", intensity: "guided", roles: [section_opener, peer_group, paired_inline, proof_preview, contact_group], reducedMotion: final_state, noJavaScript: final_state }
icons: { glyphMap: "handoff/citychat-landing/handoff/glyph-map.json", axes: "FILL 0 · wght 300 · GRAD 0" }
content: { loiLedger: "templates/citychat-landing/LOI-analysis-2569.md", signedLois: 4, seatsLeft: 6 }
qa: { exceptionIds: ["CC-EX-01"], outputClarity: pass|fail, hscroll: 0, liveChecked: true|false }
```

## K · Acceptance (บล็อก release)

| Rule | ตรวจอัตโนมัติ | ตรวจด้วยตา |
|---|---|---|
| CC-SURF-01 | ไม่มี `--text-primary` ใน subtree ของ gradient | lockup/depa อ่านออกทั้งสองธีม |
| CC-SEAL-01 | ตราทุกไฟล์ 512×512 มี alpha | วงกลมเท่ากันในแถว |
| CC-NAV-01 | bar 76/29 · controls ≥44 · rail `offsetParent===body` · `scrollWidth===clientWidth` ที่ 1280/1024/390 | calm ไม่กระตุก, เมนูปิดด้วย Escape |
| CC-EX-01 | sweep มีจุดเดียว · reduced-motion ไม่มี animation | owner sign-off บันทึกใน Build Card |
| CC-MOTION-01 | reduced-motion → ไม่มี element `opacity:0` หลัง load · no-JS ข้อความครบ | reveal ไม่ซ่อน first value |
| CC-ICON-01 | ทุก glyph ∈ glyph-map · `font-variation-settings` FILL 0 wght 300 | ไอคอนสื่อความตรงข้อความ |
| CC-LOI-01 | ทุกตัวเลข อปท. มี match ใน LOI-analysis | ไม่มีคำต้องห้าม |
| CC-MEDIA-01 | ไม่มี `<video>` ที่ `error` แล้วยังแสดง | fallback อ่านออก |
| OUTPUT-CLARITY-01 | ไม่มีคำจากไฟล์นี้/BRIEF บนหน้า | — |

## L · สิ่งที่ยังเปิดอยู่ (ต้องปิดก่อน production)

1. identityApproval ของ lockup ประกอบ symbol + Arvo wordmark (นอกเหนือ SKILL.md)
2. owner sign-off CC-EX-01 ต่อ release
3. ไฟล์ LOI depa × Landometer (อ้างเป็นข้อความอยู่)
4. วิดีโอ CityScan H.264
5. rights/role record ของ persona ข้าวกล้อง 2 ตัว (`adapt_as_citychat_asset` — source Figma `ujD5FFhVAb5SsODVV8cxIa`)
6. self-host subset Material Symbols ครบ 46 glyph + license record
