# CityChat DS Add-on v0.7 — Living City, Clear Actions, Useful Return

> คู่มือเสริมสำหรับนำ Landometer Design System มาใช้กับ CityChat ให้มีหน้าตา น้ำเสียง และจังหวะการใช้งานที่ชัดเจน โดยไม่สร้าง Design System ซ้ำอีกชุด

## 0. สถานะและขอบเขต

- **สถานะ:** Approved owner direction — normative add-on delta, 23 Aug 2026
- **ชื่อที่ใช้ต่อจากนี้:** `CityChat DS Add-on`
- **ฐานที่ใช้ร่วมกัน:** Landometer Design System v0.9.0-r7 และ machine package v0.9.0-mp1
- **ฐาน CityChat เดิม:** CityChat Visual Experience Specification v0.6, SHA-256 `5a137425ab195c4b5dd123ea86d0ee8730b370540eb57f05baf978fc6ca33a21`
- **สิ่งที่เอกสารนี้ทำ:** เปลี่ยนชื่อเรียกให้เข้าใจง่าย และเพิ่มกติกาที่คุมปุ่ม asset hero CityScan ภาษา และ output ของคน/AI ได้จริง
- **สิ่งที่เอกสารนี้ไม่ทำ:** ไม่สร้าง token, font, primitive, button geometry, accessibility baseline หรือ motion timing ชุดใหม่

หลังเอกสารนี้มีผล คำว่า `VES` ใช้เฉพาะในประวัติรุ่นและชื่อไฟล์เก่าเท่านั้น หน้าเว็บ คู่มือใหม่ และบทสนทนากับทีมใช้คำว่า `CityChat DS Add-on` หรือภาษาไทยว่า `คู่มือเสริม CityChat`.

## 1. กติกาหลักที่ทุกคนอ่านรู้เรื่อง

> Show a living city quickly, ask one meaningful question, let people act in one tap, remember their contribution, and make the next useful action obvious.

สำหรับ CityChat หมายถึง:

1. เริ่มจากสถานที่ คน หรือเรื่องที่เกิดขึ้นจริง
2. บอกความหมายหนึ่งอย่างให้เข้าใจก่อน
3. ถามหนึ่งคำถามเมื่อข้อมูลรองรับ ถ้ายังถามอย่างซื่อสัตย์ไม่ได้ ไม่ต้องฝืนถาม
4. ให้ทำต่อได้ไม่เกินหนึ่งอย่าง และบอกว่ากดแล้วจะเกิดอะไร
5. จำสิ่งที่คนทำเฉพาะเมื่อบันทึกจริง
6. ชวนกลับมาเฉพาะเมื่อมีสิ่งสำคัญเปลี่ยน หรือจบอย่างชัดเจนได้

`เมืองมีชีวิต` ไม่ได้แปลว่าต้องมีตัวเลขวิ่ง pulse หรือ animation ตลอดเวลา แต่หมายถึงคนเห็นความเชื่อมโยงระหว่างสถานที่ หลักฐาน เสียงของคน การลงมือทำ และสิ่งที่เปลี่ยนจริง

## 2. ใครเป็นเจ้าของอะไร

| เรื่อง | เจ้าของกติกา |
|---|---|
| สี ฟอนต์ spacing radius ปุ่ม icon focus motion primitive และ accessibility | Landometer DS รุ่นที่ pin ไว้ |
| หน้าตา CityChat การเรียงเรื่อง น้ำเสียง และวิธีประกอบ component | CityChat DS Add-on |
| ความหมายข้อมูล metric scale geometry และ LOCK | ทะเบียนข้อมูลหรือ CityScan contract ที่อนุมัติ |
| สถานะงาน สิทธิ์ การบันทึก และผลทางการ | ระบบเจ้าของงานและ release evidence |
| โลโก้ ภาพ และ asset ที่ใช้ได้ | role approval ของไฟล์นั้นโดยตรง |

ไม่มีลำดับ authority แบบเหมาเรื่องเดียว ทุกคำถามต้องส่งไปหาเจ้าของกติกาของเรื่องนั้น

## 3. ปุ่ม CityChat มีเพียงสองทรง

### 3.1 ตัดสินจากคำถามเดียว

**มีข้อความที่มองเห็นบนปุ่มไหม?**

- มีข้อความ หรือมี icon + ข้อความ → ใช้ **แคปซูล**: `.btn`
- ไม่มีข้อความ มีแต่ icon → ใช้ **วงกลม 44×44**: `.btn.btn-icon` พร้อม accessible name

ไม่มีปุ่มทรงที่สาม ไม่มีปุ่มสี่เหลี่ยมมุมมนที่ทีมกำหนดเอง และไม่มีการแก้ padding, radius, height, focus, disabled, busy หรือ press feedback ของ LDS

### 3.2 ตัวอย่างที่ถูก

```html
<button class="btn" type="button">
  ดูข้อมูลพื้นที่นี้
</button>

<button class="btn" type="button">
  <span class="icon-symbol" aria-hidden="true">description</span>
  ดูที่มา
</button>

<button class="btn btn-icon" type="button" aria-label="ดูที่มา">
  <span class="icon-symbol" aria-hidden="true">description</span>
</button>
```

### 3.3 ตัวอย่างที่ไม่ผ่าน

- icon-only แต่ใช้แคปซูลเปล่า
- มีข้อความแต่บีบเป็นวงกลม
- สร้าง `.citychat-button` พร้อม radius หรือ padding ใหม่
- ปุ่มที่ตัดข้อความไทย
- icon-only ที่ไม่มี accessible name
- ปุ่มที่กดแล้วไม่มีผลลัพธ์ ไม่มีคำอธิบาย หรือไม่มีทางฟื้นเมื่อผิดพลาด

### 3.4 การคุม output ของคนและ AI

ทุก artifact ต้องมี `citychat-button-contract.json` และผ่านกฎต่อไปนี้:

1. `.btn:not(.btn-icon)` ต้องมีข้อความที่มองเห็นได้
2. `.btn.btn-icon` ต้องมี icon เพียงหนึ่งตัว ไม่มีข้อความที่มองเห็น และมี accessible name
3. stylesheet ของ product ห้าม override geometry properties ของ `.btn` และ `.btn-icon`
4. control inventory ต้องบอก `labelMode`, `geometryRole`, ผลทันที และ recovery
5. rendered QA ต้องทดสอบ 320/360/390px, ข้อความไทยยาว, 200% zoom, keyboard และ focus

ถ้าตัดสินไม่ได้ ให้หยุดและคืน `blockedReason` ห้ามเดาทรงปุ่มเอง

## 4. ตัวตน CityChat และ asset

CityChat มีโลโก้และภาษาภาพของตัวเอง การใช้ LDS ไม่ได้แปลว่าต้องทำให้ CityChat หน้าตาเหมือนผลิตภัณฑ์อื่น

### 4.1 สิ่งที่รักษาไว้

- โลโก้ CityChat ที่อนุมัติตามไฟล์และบทบาท
- pin + chat motif เมื่อมีไฟล์ สิทธิ์ hash และ role approval ครบ
- แผนที่หรือภาพพื้นที่เป็นฉากหลัก
- การ์ดบทสนทนาที่อบอุ่น อ่านง่าย และอิงสถานที่
- สีเขียว–teal ใกล้เคียงบุคลิกเดิม โดยเลือกจาก role ที่ Landometer DS มีให้
- ภาษาไทยธรรมดา เป็นกันเอง และตรงกับงานของชาวบ้านหรือเจ้าหน้าที่

### 4.2 กติกา asset

- โลโก้ต้องใช้ exact bytes ห้ามวาดใหม่ เปลี่ยนสี crop filter mask หรือ animate
- โลโก้ไม่ใช่ functional icon
- source SVG ดาวน์โหลดได้ตามสิทธิ์ แต่ไม่ได้แปลว่าใช้เป็น favicon, compact mark หรือ motif ได้
- photo, avatar, screenshot และแผนที่จริงต้องมีสิทธิ์และ privacy clearance ก่อนเผยแพร่
- ทุกไฟล์ใน Asset Library ต้องมี path, MIME, bytes, SHA-256, ที่มา, licence/rights, allowed uses และ blocked uses
- ไฟล์ที่ยังไม่อนุมัติให้ดาวน์โหลดเป็นหลักฐานได้เฉพาะเมื่อระบุ `source_only` ชัดเจน และห้ามนำไป render ใน runtime

## 5. CityScan hero ที่ควรกลับมา

Hero ที่ดีต้องทำให้คนรู้สึกว่า CityChat เริ่มจาก “พื้นที่” ไม่ใช่เริ่มจากกล่องข้อความทั่วไป

### 5.1 องค์ประกอบ

1. `PlaceStage` — ฉากพื้นที่ที่เห็น grid เส้นทาง จุด และขอบเขตตัวอย่าง
2. `ScanFrame` — กรอบที่บอกว่ากำลังดูบริเวณใด โดยไม่แกล้งทำเป็นคะแนนหรือผลวิเคราะห์
3. `StoryCard` — การ์ดซ้อนบนพื้นที่ แสดงสถานที่ ความหมายหนึ่งอย่าง สิ่งที่ยังไม่รู้ และคำถามหนึ่งข้อเมื่อเหมาะสม
4. `PrimaryAction` — ปุ่มแคปซูลหนึ่งปุ่ม พาไปตัวอย่างพื้นที่จริงใน playground
5. `FixtureLabel` — คำสั้น ๆ ว่าเป็นข้อมูลจำลอง ไม่ใช่ข้อมูลพื้นที่จริง

### 5.2 กติกาความจริง

- กราฟิก grid เส้นทาง และจุดเป็น fixture เชิงภาพ ไม่ใช่หลักฐาน
- ใช้ map tokens จาก LDS โดยตรง ห้ามแต่ง analytical colour scale เอง
- ไม่มีคะแนนรวม ไม่มีสถานะทางการ และไม่มีการเรียก static fixture ว่า live
- เมื่อข้อมูลไม่พอ ให้พูดว่า `ข้อมูลยังไม่พอ` ไม่แสดงศูนย์หรือผลเดิม
- Hero ต้องนิ่ง ไม่ใช้ sweep, pulse, loop หรือ parallax เพื่อทำให้ดูเหมือนกำลังสแกนจริง

## 6. ภาษา CityChat

หน้าที่คนเห็นต้องพูดเหมือนคนคุยกับคน

### ใช้

- `ดูข้อมูลพื้นที่นี้`
- `เล่าเรื่องในพื้นที่นี้`
- `เข้าสู่ระบบเพื่อตอบเรื่องนี้`
- `ข้อมูลยังไม่พอ`
- `ส่งแล้ว`
- `ใครจะเห็น`
- `อัปเดตเมื่อ`
- `ดูที่มา`

### ไม่ใช้หน้าเวที

- truth envelope, claim ceiling, source_limited, runtime, fixture, schema
- AI analysis, agent, inspector
- capability, delivery availability, authorization decision
- รหัส QA, hash, build ID

คำเหล่านี้อยู่ใน `รายละเอียดสำหรับทีมพัฒนา` ได้ แต่ห้ามบังคับให้ชาวบ้านหรือเจ้าหน้าที่แปลระบบแทนเรา

## 7. โครงสร้างสำหรับ implement

หนึ่ง scene recipe ต้องบอกให้ครบ:

```yaml
sceneId: citychat-story-example
user: citizen | officer
job: one short human job
canonicalRefs: []
firstMeaning: one plain sentence
question: zero_or_one
primaryAction: zero_or_one
expectedConsequence: required_when_action_exists
states: [loading, ready, empty, error, permission_denied]
identityRoles: []
buttonContractRef: citychat-button-contract-v0.7
iconRoleRefs: []
motionBinding: inherited_lds_primitive_or_none
assetRefs: []
responsiveRules: []
accessibilityChecks: []
testIds: []
blockedReasons: []
```

AI และ code generator ต้องใช้ไฟล์ role map/contract ที่ pin ไว้ ไม่อ่านภาพแล้วเดา token, glyph, asset role หรือสถานะระบบ

## 8. ไฟล์ขั้นต่ำของ DS Add-on release

- DS Add-on document + approval record
- exact Landometer DS package/version/hash
- Build Card
- control inventory
- button contract + schema
- icon map + font asset manifest + resolution record
- color role map + atlas
- semantic motion map
- identity manifest
- asset catalog + licence/rights references
- responsive/accessibility test matrix
- source QA + rendered QA + manual gates
- release manifest + SHA256SUMS + live release receipt

## 9. Acceptance ที่บล็อก release

### CC-DA-BTN-01 — Two-shape rule

ทุก action control เป็น labelled capsule หรือ icon-only circle เท่านั้น ไม่มี geometry override และทุกปุ่มมีผลหรือขอบเขตที่เข้าใจได้

### CC-DA-ASSET-01 — Downloadable asset library

ทุก asset ที่เผยแพร่มี metadata, hash, rights, allowed/blocked use และลิงก์ดาวน์โหลดตรง ไฟล์ส่วนบุคคลหรือสิทธิ์ไม่ชัดไม่ถูกเผยแพร่

### CC-DA-HERO-01 — Place-first CityScan hero

Hero แสดงพื้นที่ก่อน มี story ซ้อนอย่างอ่านง่าย ใช้ fixture ที่บอกขอบเขตชัด ไม่มีสีคะแนนปลอม และ primary action เปิดตัวอย่าง CityScan ในหน้าได้จริง

### CC-DA-LANG-01 — Human frontstage language

ข้อความที่คนเห็นใช้ภาษาธรรมดา ไม่มีศัพท์ระบบก่อน disclosure และคำกริยาบอกผลของ action โดยตรง

### CC-DA-OUTPUT-01 — Deterministic human/AI output

ทุก scene, button, icon, colour, motion และ asset resolve ไปยัง contract/registry ที่ pin ไว้ได้ ถ้า resolve ไม่ได้ต้อง fail closed พร้อม blocked reason

### CC-DA-RELEASE-01 — Exact release evidence

release ผ่าน LDS checks และ CityChat artifact checks บน bytes เดียวกับที่ deploy จริง เครื่อง package ผ่านอย่างเดียวไม่ใช่หลักฐานว่า CityChat implementation ผ่าน

## 10. การย้ายจาก VES v0.6

- เก็บไฟล์ VES v0.6 และ approval เดิมไว้เป็น historical inherited base
- เปลี่ยนชื่อที่คนเห็น เอกสารเริ่มต้น และ prompt ใหม่เป็น `CityChat DS Add-on`
- ย้าย implementation resources ไปใต้ `resources/citychat-ds-addon/`
- เพิ่ม button contract และ asset catalog
- คืน CityScan hero composition จากต้นแบบ v0.4 โดยใช้ token และ truth boundary ปัจจุบัน
- ห้ามย้าย role approval ของ asset ข้าม build โดยอัตโนมัติ
- rollback หากปุ่มมีทรงที่สาม, asset ไม่ทราบสิทธิ์, hero ทำให้ fixture ดูเหมือนข้อมูลจริง, public copy กลับไปเป็นภาษาระบบ หรือ release bytes ไม่ตรง manifest

## 11. ข้อสรุปสั้นที่สุด

**Landometer DS ให้ชิ้นส่วนและกติกากลาง ส่วน CityChat DS Add-on บอกว่าต้องประกอบชิ้นส่วนเหล่านั้นอย่างไรให้เป็น CityChat ที่คนเข้าใจ ใช้ต่อได้ และยังซื่อสัตย์กับสิ่งที่ระบบทำได้จริง**

## 12. รหัสตรวจเดิมที่ยังใช้ต่อ

เพื่อให้เครื่องมือตรวจรุ่นก่อนอ่านต่อได้ รหัสเหล่านี้ยังชี้ไปยังกติกาเดิม แต่หน้าเว็บไม่ต้องแสดงรหัสให้ผู้ใช้เห็น:

- `CC-AC-IDENTITY-01`, `CC-AC-IDENTITY-02`, `CC-AC-IDENTITY-03`, `CC-AC-IDENTITY-04`, `CC-AC-IDENTITY-05`
- `CC-AC-CONTRAST-01`
- `CC-AC-COLOR-01`, `CC-AC-COLOR-02`
- `CC-AC-MAP-01`
- `CC-AC-ASSET-COLOR-01`
