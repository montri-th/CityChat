# CityChat DS Add-on v0.9 — เก็บตัวตนเดิม บนฐาน LDS v0.9.1

> คู่มือสำหรับทำให้ CityChat มีตัวตน อบอุ่น อ่านง่าย และพาคนจาก “เห็นพื้นที่” ไปสู่ “เข้าใจ–เล่า–ทำต่อ” โดยใช้สี ตัวอักษร ปุ่ม ไอคอน และการโต้ตอบจาก Landometer Design System v0.9.1

## 0. สถานะและแหล่งอ้างอิง

- **สถานะ:** Approved owner direction — effective normative CityChat DS Add-on ตั้งแต่ 2 กันยายน 2026; artifact และหน้า public ยังไม่ได้ migrate หรือ publish เป็น v0.9
- **รุ่น normative:** CityChat DS Add-on v0.9; artifact ที่นำไปใช้จริงเริ่มที่ v0.9.0
- **หลักฐานอนุมัติ:** `owner-message:2026-09-02:approve-citychat-ds-addon-v0.9`
- **ฐาน normative:** Landometer Design System v0.9.1, authoring revision `0.9.1-r8`
- **LDS source SHA-256:** `64f5d6277b557176502285bc65890ecc4c81faf4b97946eb5e3a2ef2c0d90d19`
- **LDS ruleset:** `lds-rules-0.9.1`
- **LDS machine identity:** `v0.9.1-mp7`
- **LDS release.json SHA-256:** `389dffc54644a9a563fb7551979645fdbaa01f2f506ce614c5e744b51e76960b`
- **LDS package checksum-root SHA-256:** `8ca2ff6a099f19214c4bf056aba6c7d44a7ac8c34307007e273741fee06d272a`
- **LDS machine authority sourceRef:** `owner-delivery:Landometer-Design-System-v0.9.1-approved.zip`
- **LDS approved ZIP SHA-256:** `a082ff39e7c36d802a85cbec8fa36a2ecd2a8117664b07373eb76774d0892b92`
- **LDS package trust SPKI:** `da5c12310fe39ac9c18d5f4cb51669f54064fd627f7d5a3c88356130c1736e44`
- **LDS validator SHA-256:** `645cb68302d88943b9945dc4979beacee25b5afb646c600eb31e6e1c965e020d`
- **Color Set:** `color-srgb-05` — ค่าสี normative ไม่เปลี่ยนจาก LDS v0.9.0-r7
- **Icon Set:** `icon-rounded-outline-01`
- **Type Set:** `type-script-aware-02`
- **เอกสารก่อนหน้า:** CityChat DS Add-on v0.8 เป็น immutable predecessor และยังอธิบายหน้า public v0.8 ที่ใช้อยู่ แต่ไม่ใช่กติกาสำรองสำหรับงานใหม่

LDS v0.9.1 master และ machine package เป็น owner-approved effective release แล้ว Exact approved package ผ่าน validator ด้วย external owner trust จำนวน **5,394 checks**: 50 rules, 6 format packs, 79 migrations, 37 schema fixtures และ 373 adversarial mutations

GitHub public projection ตั้งใจเผยแพร่ human master และ reference โดยระบุ `machinePackageDelivery: identity_only`; machine authority อยู่ใน approved package แยกต่างหาก ปัจจุบัน CityChat repo ยังไม่ได้ vendor package bytes ชุดนั้น ดังนั้น:

1. เอกสารนี้อ้างกติกาและ machine identity v0.9.1 ได้
2. implementation ใหม่ต้อง vendor exact approved package ที่ตรง hash ข้างบน และใช้ external trust store/policy ที่ caller เป็นเจ้าของ
3. ห้ามกล่าวว่า **CityChat artifact** ผ่าน v0.9.1 conformance จนกว่า CityChat Build Card, component bindings, outputs และ receipts จะตรวจผ่าน package นี้จริง

### 0.1 สรุปให้ทีมเข้าใจตรงกัน

1. เก็บโลโก้ CityChat ภาพจำเรื่องเมือง ความอบอุ่น และวิธีพูดจากงานข้าวกล้อง
2. ใช้สี ฟอนต์ ปุ่ม ช่องกรอก ไอคอนสั่งงาน ระยะ และ motion จาก LDS v0.9.1
3. ใช้ Figma และ Drive เป็นตู้ต้นฉบับ ไม่ใช่หน้าจอให้คัดลอกลงระบบตรง ๆ
4. ภาพหรือไอคอนจากงานเดิมจะใช้จริงได้เมื่อรู้ที่มา สิทธิ์ บทบาท และไฟล์ที่แน่นอน
5. CityScan เริ่มจากสามคำถาม: `แถวนี้น่าอยู่ยังไง`, `น่าเที่ยวตรงไหน`, `น่าค้าขายอะไรดี`
6. หนึ่งช่วงมีคำถามที่มีความหมายไม่เกินหนึ่ง และปุ่มหลักไม่เกินหนึ่ง
7. แสดงว่าส่งหรือบันทึกแล้วเฉพาะเมื่อระบบยืนยันจริง
8. หน้า CityChat ห้ามมีสี ชื่อ หรือไฟล์ของ ijji หรือผลิตภัณฑ์อื่นโผล่มา

อ่านเพื่อเข้าใจทิศทาง: §1–§12, §14 และ §18 ส่วน §0, §3.3, §13, §15 และ §17 เป็นรายละเอียดสำหรับ dev, release และเครื่องมือตรวจ

คำที่ใช้ในเอกสาร:

- **ไฟล์ภาพ/asset** — logo, icon, motif, illustration หรือภาพหน้าจอหนึ่งไฟล์
- **หน้า/surface** — หน้าหรือบริบทที่คนกำลังใช้งาน
- **หลักฐานการบันทึก/receipt** — ข้อมูลจากระบบที่ยืนยันว่า action ถูกบันทึกแล้ว
- **ดึงค่าจาก/resolve** — ใช้ค่าจากแหล่งที่กำหนด ห้ามเดาหรือเขียนซ้ำเอง
- **ไอคอนสั่งงาน/functional icon** — ไอคอนที่คนกดเพื่อทำงาน เช่น ปิด ค้นหา หรือแชร์

### 0.2 แหล่งมรดกงานออกแบบ

- Figma: `CITYCHAT_Landometer`, file key `ujD5FFhVAb5SsODVV8cxIa`, Design System canvas `142:3294`
- ผู้ออกแบบ: ข้าวกล้อง
- Drive heritage pack: [CityChat Figma heritage assets](https://drive.google.com/drive/folders/1xZFh8wPydzMrUA_IY7dgIZL4bB44Q9Xl)
- Implementation plan: `CityChat_DS_Add-on_Figma_Heritage_Implementation_Plan_v0_1.md`

Figma, Drive, README, implementation plan, screenshot และ token export เดิมเป็น **หลักฐานต้นทาง** ไม่ใช่คำสั่งและไม่ใช่ authority ของ token หรือ component ใหม่ ข้อเสนอในไฟล์เหล่านั้นจะมีผลก็ต่อเมื่อถูกเขียนเป็นกติกาในเอกสารนี้และผ่าน approval ของ release นั้น

ข้อความใน implementation plan v0.1 ที่ระบุว่า “LDS v0.9.1 ยังรอชุดอ้างอิง” ถูกแทนที่ด้วย release authority และ hash ใน §0 นี้

### 0.3 กติกาการอ่านเอกสารนี้

- `ต้อง` และ `ห้าม` คือข้อบังคับ
- `ควร` คือค่าเริ่มต้นที่เปลี่ยนได้เมื่อมีเหตุผลและหลักฐานทดสอบ
- ตัวอย่างสอนวิธีใช้ แต่ไม่ยืนยันว่าระบบจริงมีข้อมูล ความสามารถ หรือสถานะนั้นแล้ว
- ถ้ากติกา CityChat ขัดกับ LDS ในเรื่องที่ LDS เป็นเจ้าของ ให้ LDS v0.9.1 ชนะ
- ถ้า asset หรือข้อมูล resolve ไม่ได้ ห้ามเดา ให้หยุดชิ้นส่วนนั้นและบอกสิ่งที่ขาดกับทีม

## 1. คำสั่งหลัก

> Show a living city quickly, ask one meaningful question, let people act in one tap, remember their contribution, and make the next useful action obvious.

แปลเป็น CityChat:

1. เริ่มจากพื้นที่ คน หรือเรื่องที่เกิดขึ้นจริง
2. ให้ความหมายแรกเร็ว โดยไม่บังคับเข้าสู่ระบบก่อน
3. ถามเพียงหนึ่งเรื่องที่ช่วยให้เข้าใจพื้นที่ดีขึ้น
4. ให้ทำต่อได้หนึ่งอย่าง และบอกก่อนว่ากดแล้วเกิดอะไร
5. จำสิ่งที่คนช่วยเฉพาะเมื่อบันทึกจริง
6. ชวนกลับมาเมื่อเรื่องเดิมมีอะไรเปลี่ยนจริง

`เมืองมีชีวิต` ไม่ได้แปลว่าหน้าจอต้องกระพริบหรือมีตัวเลขวิ่ง แต่หมายถึงคนเห็นสายสัมพันธ์ระหว่าง:

`พื้นที่ → สิ่งที่รู้ → เสียงของคน → งานที่ทำต่อ → สิ่งที่เปลี่ยน`

## 2. ใครคุมอะไร

| ส่วน | เจ้าของกติกา | สิ่งที่ต้องทำ |
|---|---|---|
| สี UI, type role, spacing, radius, border, elevation, primitive, focus, state, motion, navigation และ accessibility | LDS v0.9.1 | resolve จาก LDS เท่านั้น ไม่คัดค่าจาก Figma เดิม |
| Logo CityChat, conversation motif, graphic เฉพาะเรื่องเมือง, น้ำเสียง, CityStory, CityCell และลำดับ experience | CityChat DS Add-on | เพิ่มบุคลิกและความหมายโดยไม่สร้าง primitive ซ้ำ |
| metric, source, coverage, freshness, unknown/zero, scale และ spatial grain | product/data contract | ใช้ข้อมูลและคำอธิบายที่อนุมัติแล้ว |
| persistence, receipt, ผู้รับผิดชอบ, การมอบหมาย และสถานะทางการ | ระบบเจ้าของงาน | แสดงผลสำเร็จเฉพาะเมื่อระบบยืนยัน |
| source, rights, modification, public use, hash และ approved role ของ asset | artifact-owned asset registry | อนุญาตเป็นรายไฟล์และรายบทบาท |
| Figma/Drive heritage pack | historical design evidence | ใช้เลือกสิ่งที่จะเก็บ ปรับ หรือเลิกใช้เท่านั้น |

กติกาหลักคือ:

> **เก็บบุคลิก ภาพ ภาษา และวิธีเล่าเรื่องของข้าวกล้อง แล้วประกอบใหม่ด้วยฐานของ LDS v0.9.1**

## 3. วิธีรับมรดกงานออกแบบ

### 3.1 สถานะการรับแต่ละชิ้น

ทุก item จาก Figma/Drive ต้องมีการตัดสินหนึ่งค่า:

| สถานะ | ความหมาย |
|---|---|
| `retain_exact` | รักษา exact approved bytes เช่น canonical CityChat logo; การตัดสินนี้ไม่ย้าย role approval เดิมมาให้ release ใหม่อัตโนมัติ |
| `retain_principle` | เก็บเจตนา วิธีเล่า หรือความอบอุ่น แต่ตรวจข้อความ/บริบทใหม่ก่อนใช้ |
| `adapt_as_citychat_asset` | รักษาแนวคิดหรือภาพเดิม แต่จัด role, สี, format และ accessibility ใหม่ |
| `rebuild_with_lds` | รักษา intent แต่สร้าง UI ใหม่ด้วย LDS primitive |
| `reference_only` | ใช้ดูทิศทางหรือเทียบงาน ห้ามนำเป็น runtime asset |
| `retire` | ไม่ใช้ในงานใหม่ |

### 3.2 Adoption matrix

ตารางนี้ตัดสินระดับ “กลุ่มงาน” เพื่อให้ทีมรู้ทิศทาง ยังไม่อนุมัติไฟล์ใดโดยตัวมันเอง ก่อน implement ต้องมี adoption ledger ที่ map `source item → decision → target component/asset → exact repository bytes`

| ของเดิม | การตัดสิน | กติกาใหม่ |
|---|---|---|
| CityChat pin/meter mark + wordmark + chat bubbles | `retain_exact` | รักษาตัวตนเดิม; v0.9 ต้องเลือก exact file/hash และออก role approval ใหม่ ห้ามถือว่า SVG ใน Drive พร้อม render โดยอัตโนมัติ |
| กล่องสนทนาซ้อนกันพร้อมหน้ายิ้ม | `adapt_as_citychat_asset` | ใช้เป็น `ConversationMotif` สำหรับ welcome, invitation, empty และ success; ยังไม่ใช่ secondary logo |
| ภาพบ้าน เมือง ผู้คน และ badge ทรงกลม | `adapt_as_citychat_asset` | เลือกหนึ่ง visual family; ใช้กับ story, acknowledgement และ return โดยไม่เปลี่ยนเป็นคะแนนคุณค่าคน |
| Pictogram น้ำท่วม แผ่นดินไหว ฝุ่น–ไฟ สารเคมี และรวมแชท | `adapt_as_citychat_asset` | ใช้เป็น `TopicMark` ที่มี label ไม่ใช่ generic control icon |
| Question-first card พร้อมผู้ชวน หน่วยงาน และวันที่ | `rebuild_with_lds` | สร้างเป็น `StoryInviteCard` ด้วย LDS card, metadata และ action primitive |
| สลับ “ข้อมูล / ห้องแชท” | `rebuild_with_lds` | สร้างเป็น `EvidenceConversationSwitch` ด้วย LDS segmented control |
| Navigation ประชาชน/เจ้าหน้าที่ | `rebuild_with_lds` | เก็บ information model; ใช้ LDS geometry, direct target, disclosure และ responsive rules |
| Login, field, modal, button, chip, tab และ filter เดิม | `rebuild_with_lds` | ไม่คัดสี ขนาด radius shadow หรือ state เดิม |
| ภาษาสั้นและเป็นกันเอง | `retain_principle` | ตรวจข้อความกับ product ปัจจุบันและเขียน TH/EN แยกตามธรรมชาติ |
| Achievement/level | `adapt_as_citychat_asset` | เปลี่ยนเป็น `ParticipationMilestone` ที่อ้าง receipt จริง; ไม่ใช้ rank จัดลำดับ civic priority |
| Palette เดิม รวม TapBlue `#15C5CE`, iOS alias, wireframe และ UI-kit residue | `retire` | UI ใช้ LDS v0.9.1 roles เท่านั้น |
| Button shadow หลายชั้น, fixed width และ legacy geometry | `retire` | ใช้ LDS component contract |
| MUI, Heroicons และ `react-icons` เดิมสำหรับ functional UI | `retire` | ใช้ LDS approved Material Symbols subset |
| Raster color board | `reference_only` | Color Atlas ต้องสร้างจาก machine role map |
| Light/dark screen PNG | `reference_only` | ใช้เทียบ composition และความอบอุ่น ไม่ใช้เป็น UI asset |
| `archive` / old-version screens | `retire` | ห้าม generator หรือ dev ใช้เป็น current reference |

### 3.3 ข้อมูลที่ asset ทุกชิ้นต้องมี

รายการข้างล่างเป็น **human field map** สำหรับตกลงข้อมูลที่ต้องมี ยังไม่ใช่ JSON Schema ที่นำไป validate ได้ จนกว่า v0.9 resource package จะส่ง schema รุ่นและ fixture ที่ผ่าน validator

Asset ที่จะใช้จริงต้องมีอย่างน้อย:

```yaml
assetId: required
adoptionDecision: retain_exact | retain_principle | adapt_as_citychat_asset | rebuild_with_lds | reference_only | retire
role: identity | conversation_motif | topic_mark | interface_icon_subset | editorial_illustration | atmosphere | ui_capture
status: approved | candidate | reference_only | retired
source:
  figmaFileKey: optional
  figmaNodeId: optional
  driveFileId: optional
  immutableSourceRef: required_for_candidate_or_approved
  sourceSha256: required_for_candidate_or_approved
  capturedAt: required
  exportLineage: []
creator: required
licenseOrPermission:
  recordRef: required
  recordSha256: required
  owner: required
  commercialUse: allowed | blocked | unknown
  modification: allowed | blocked | unknown
  publicRedistribution: allowed | blocked | unknown
  publicationPermission: allowed | blocked | unknown
  attribution: string_or_none
approval:
  approver: required_for_approved
  approvedAt: required_for_approved
  approvalReceiptRef: required_for_approved
  approvalReceiptSha256: required_for_approved
  allowedRoles: []
  allowedFormats: []
  allowedSurfaces: []
  allowedAudiences: []
  blockedUses: []
delivery:
  repositoryPath: required_for_approved
  mime: required
  bytes: required
  sha256: required
  theme: light | dark | both | theme_independent
accessibility:
  treatment: decorative | visible_label | accessible_name | long_description
  visibleLabel: string_or_none
  accessibleName: string_or_none
  textEquivalent: string_or_none
  glyphs: []
fallback: required
derivedFrom: []
```

รายการที่เป็น `candidate` หรือ `approved` ต้องมี immutable source reference อย่างน้อยหนึ่งรายการ Drive หรือ Figma URL ห้ามเป็น production asset URL ไฟล์ที่อนุมัติต้องอยู่ใน CityChat repo พร้อม checksum เพื่อให้คนและเครื่องมือสร้างงานใช้ bytes เดียวกัน

### 3.4 Inventory gate

หลักฐาน snapshot `CC-HERITAGE-DRIVE-20260901-01` วันที่ 1 กันยายน 2026 พบไฟล์ใน `05_graphics` ที่อ่านได้ 426 ไฟล์:

- design-system 34
- illustrations 22
- screens-light 167
- screens-dark 167
- archive 36

README และ export script ระบุ 428 ไฟล์ จึงมีส่วนต่าง 2 ไฟล์ ตัวเลขนี้เป็น observation ของ snapshot ไม่ใช่จำนวนถาวรในกติกา ก่อนออก release ต้องสร้าง immutable heritage-inventory ledger ที่มี Drive file IDs, capturedAt, count และ hash แล้วทำให้ **source snapshot count = inventory manifest count** พร้อมอธิบาย duplicate/missing file ทุกตัว ห้ามถือว่า “แชร์ Drive แล้ว” เท่ากับพร้อมใช้งานจริง

## 4. ตัวตน ภาพ และ icon ของ CityChat

### 4.1 `CityChatLockup`

- ใช้ exact approved CityChat logo bytes เท่านั้น
- พื้นหลังต้องโปร่งใส; surface รอบ logo เป็นหน้าที่ของ layout
- ห้ามสร้าง wordmark ด้วย HTML text หรือ UI font
- ห้าม crop, recolour, filter, mask, distort, animate หรือแยกชิ้นส่วน logo มาประกอบใหม่
- ห้ามใส่แผ่นขาวหรือแผ่นดำติดกับไฟล์ logo เว้นแต่ carrier นั้นเป็น approved identity asset โดยตรง
- ต้องมี minimum size, clear space, light/dark placement และตัวอย่างห้ามใช้
- สีใน approved logo เป็น source artwork; ห้ามดูดสีออกมาเป็น UI token

Current baseline ที่ต้อง reconcile ก่อนออก v0.9:

- runtime v0.8 อนุมัติ PNG `citychat-horizontal-lockup-png-94055c9b`, SHA-256 `94055c9b084eebaa585b3d31bef750abe87a1162fc1ec3be077f7fbcb2465e62` เฉพาะ header/footer ของ exact v0.8 build
- SVG lockup SHA-256 `3a3cd1b4c6091a107bd41502e6df04ddfc62c3074b75b850bfabdf9ddacab98c` เป็น source-only และยังห้าม runtime render
- Logo exports ใน Drive/Figma ต้องเทียบกับสองรายการนี้ เลือก canonical bytes แล้วออก v0.9 approval ตาม role/surface ใหม่

### 4.2 `ConversationMotif`

- เป็นภาพประกอบที่สื่อว่า “เมืองกำลังคุยกัน” ไม่ใช่ logo ตัวที่สอง
- ใช้ได้กับ welcome, invitation, empty state, contribution receipt และ calm success
- ต้องไม่แข่งกับหัวข้อหลัก ไม่แทน evidence และไม่แทน functional icon
- ข้อความสำคัญต้องเป็น live text ไม่ฝังในภาพ
- decorative use ใช้ empty alt; meaningful use ต้องมีคำอธิบายสารที่ภาพสื่อ
- ถ้า rights, source หรือ approved role ยังไม่ครบ ให้ใช้ fallback illustration ที่อนุมัติแล้ว ไม่ดึงจาก Drive ตรง ๆ

### 4.3 `TopicMark`

- ใช้บอก “หมวดเรื่อง” เช่น น้ำท่วม หรือหนึ่งในสามคำถาม CityScan
- ต้องมี visible label เสมอ
- ไม่ใช้แทนปุ่ม back, close, search, share, favorite หรือเมนู
- ไม่ encode score, magnitude, evidence quality หรือ official status ด้วยรูป/สีลำพัง
- pictogram เดิมอาจรักษา metaphor ได้ แต่ต้อง normalize viewBox, optical size, container และ theme treatment
- CityScan ต้องมี family ที่สอดคล้องกันสำหรับ `daily_life`, `visitor_identity` และ `local_activity`

### 4.4 Functional interface icon

- ใช้ LDS approved Material Symbols Rounded subset
- คง `FILL 0`, `wght 300`, `GRAD 0` ทุก state
- selected state ใช้ surface, outline container, label และ semantic color ไม่เปลี่ยน glyph เป็นทึบหรือหนาขึ้น
- icon-only action ต้องมี accessible name
- identity mark, TopicMark, data symbol และ interface icon เป็นคนละระบบ ห้ามใช้ข้ามบทบาท
- ชุด icon จำนวนมากที่ import จาก `react-icons v4.6.0` ใน heritage pack ไม่ใช่ CityChat original และถูก retire จาก normative UI system

LDS v0.9.1 base package อนุมัติ glyph อยู่ 7 ตัว: `open_in_new`, `menu`, `close`, `light_mode`, `dark_mode`, `contrast`, `groups` เท่านั้น

- ถ้า CityChat ต้องใช้ back, search, share, favorite, location หรือ glyph อื่น ต้องเพิ่มเข้า **CityChat product-owned approved subset** พร้อมชื่อ บทบาท font bytes/hash และ approval ก่อน
- ระหว่างยังไม่อนุมัติ ให้ใช้ labelled action ที่เข้าใจได้ ห้ามดึง glyph ใกล้เคียงมาแทนเงียบ ๆ
- TopicMark จากข้าวกล้องไม่ใช่ทางลัดสำหรับขยาย functional subset
- ชุด 9 icon ใน artifact v0.8 เป็น exact-build binding ไม่ย้ายมา v0.9 อัตโนมัติ v0.9 ต้องจัดแต่ละตัวเป็น `map_to_lds_base`, `approve_product_subset` หรือ `retire`

### 4.5 ภาพประกอบ

- เลือกหนึ่ง visual family ต่อ release เพื่อไม่ให้ภาพ line, solid, stock และ 3D ปนกัน
- ภาพชื่อหรือที่มาคล้าย stock เช่น `25634619_7004846` และ `13403761_5238959` ต้องมี source/license record ก่อน public use
- illustration ไม่ใช่หลักฐานข้อมูล
- screenshot ใช้เป็น QA/reference เท่านั้น เว้นแต่มี `ui_capture` approval แยก
- ภาพที่ไม่ใช่ locked identity artwork ต้อง map สีผ่าน approved CityChat illustration palette ซึ่ง resolve ไป LDS v0.9.1

## 5. สี ตัวอักษร และพื้นผิว

### 5.1 สี

- UI, text, surface, state และ data color ต้อง resolve จาก LDS `color-srgb-05`
- CityChat role map เป็นตัวกลาง ห้ามเลือก token จากชื่อสีหรือ hex ด้วยตา
- current CityChat product mapping, stylesheet projection, visible Color Atlas และ rendered output ต้องไม่ resolve หรือแสดง role ของ `ijji` หรือผลิตภัณฑ์อื่น Raw upstream package อาจเก็บ portfolio profiles เพื่อคง authority ได้ แต่ต้องไม่กลายเป็น CityChat runtime role หรือ downloadable CityChat asset
- `brand.blue`, `brand.beige`, `energy.sky`, `energy.mint`, `energy.coral` และ `energy.yellow` ใช้ตาม role ที่ LDS อนุญาต ไม่ใช่สีแทนกันได้
- energy color ใช้สร้างบรรยากาศหรือจุดเน้นเล็ก ๆ; ห้ามใช้แทน action, success, warning, error, selected, official หรือ data value เพียงเพราะสีดูใกล้กัน
- identity/atmosphere/participation color ห้ามใช้เป็น analytical scale
- no-data, zero, unknown, stale และ out-of-coverage ต้องแยกด้วยข้อความและรูปแบบ ไม่ใช้สีอย่างเดียว
- analytical scale ต้องอ้าง exact LUT จากทะเบียนข้อมูลที่อนุมัติ ห้ามสร้าง gradient ใหม่เพื่อความสวย
- Color Atlas ของ CityChat ต้องแสดง role → LDS token → theme → contrast pair → allowed/blocked use และตัวอย่างจริง

CityChat product roles ที่ LDS v0.9.1 อนุมัติแล้ว:

| Role | Production token | Atomic value |
|---|---|---|
| Light primary | `--ldm-product-citychat-light-primary` | `#007A58` |
| Light accent | `--ldm-product-citychat-light-accent` | `#007E79` |
| Dark primary | `--ldm-product-citychat-dark-primary` | `#3BD19B` |
| Dark accent | `--ldm-product-citychat-dark-accent` | `#3BD3CB` |

Dev ต้องอ้าง production token ไม่ hard-code atomic value ตารางนี้ใช้ตรวจความตรงเท่านั้น Audience web ใช้ `color-srgb-05.production.css`; raw color registry เป็น provenance และห้ามส่งตรงเข้า audience bundle

### 5.2 ตัวอักษร

| บทบาท | Latin | Thai | น้ำหนัก |
|---|---|---|---:|
| display/headline | Arvo | IBM Plex Sans Thai Looped | 700 |
| body/UI | Bai Jamjuree | Bai Jamjuree | 400 / 600 |
| technical/data | JetBrains Mono | IBM Plex Sans Thai | 400 |
| interface symbol | Material Symbols Rounded approved subset | ระบบ glyph เดียวกัน | 300 |

- exact font files, fallback และ binding ต้องมาจาก LDS v0.9.1 package ที่ตรวจ hash แล้ว
- Logo wordmark เป็น locked artwork ไม่ใช่ typography role
- type size และ line-height เดิมใน Figma ใช้ดู hierarchy ได้ แต่ห้ามคัดมาเป็น value
- Thai display line-height 1.16 ไม่ใช่ค่าปลอดภัยสำหรับทุกขนาด ต้องทดสอบการชน clipping และวรรณยุกต์จริง
- ต้องทดสอบ Thai/English, text expansion, 200% zoom, narrow mobile และ export context

### 5.3 พื้นผิวและ contrast

- ใช้ LDS surface/text pairs ที่ผ่าน contrast ใน context จริง
- ห้ามใช้ดำสนิท–ขาว–เขียวสดจาก dark mockup เดิมเป็น palette ตรง ๆ
- text ปกติต้องผ่าน WCAG AA; large text และ non-text controls ต้องผ่านเกณฑ์ applicable ของ LDS
- focus ต้องมองเห็นได้ทั้ง light/dark และไม่ถูกเงา/gradient กลบ
- ภาพพื้นหลังต้องมี scrim/surface ตาม role และข้อความต้องไม่พึ่งส่วนที่สว่างหรือมืดของภาพแบบบังเอิญ

## 6. Control, navigation และ interaction geometry

เริ่มจากงานของ control ไม่ใช่รูปร่างที่อยากได้

| งาน | รูปแบบ | กติกา |
|---|---|---|
| ทำสิ่งหนึ่งต่อด้วยข้อความ หรือ icon+ข้อความ | labelled action capsule | ใช้ LDS control/CTA contract; min-height 44 ใน runtime ที่ใช้ |
| ทำสิ่งหนึ่งต่อด้วย icon อย่างเดียว | icon action circle | 44 × 44; icon เดียว + accessible name |
| เลือกหนึ่งมุมมองจากหลายมุมมอง | segmented selector | ใช้ LDS segmented primitive; สมาชิกไม่ใช่ CTA capsule |
| เปิด/ปิดรายละเอียด | disclosure | ใช้ semantic disclosure พร้อม state/focus restoration |
| กรอกหรือเลือกค่า | field/select/checkbox | label ต้องมองเห็นและ state ครบ |
| ไปยังอีกหน้า/anchor | navigation link | destination จริง ไม่ปลอมเป็น action ที่ไม่มีปลายทาง |

### 6.1 Button และ CTA

- หนึ่ง scene มี primary CTA ไม่เกินหนึ่ง
- label ต้องเริ่มด้วยคำกริยาและบอกผล เช่น `ดูข้อมูลแถวนี้`, `เล่าให้เทศบาลรู้`, `ติดตามเรื่องนี้`
- action ทุกอันต้องมี outcome และ destination/result จริงหนึ่งอย่าง
- ห้ามคัด fixed width, padding, radius, shadow หรือ class name จาก Figma เดิม
- disabled, loading, error, success และ recovery ต้องตรงกับงานจริง ไม่ใช้ disabled เพื่อซ่อนสิ่งที่ขาด
- consequential action ต้องบอกผลก่อนกดและมี confirmation เมื่อจำเป็น

Exact LDS v0.9.1 geometry:

| Control | Shape | ขนาดและระยะ |
|---|---|---|
| Text หรือ icon+label button | capsule | min-height 44; inline padding 24; gap 8; border 2; radius `layout.radiusPx.pill` |
| Icon-only button | circle | 44 × 44; border 2; accessible name required |
| Inline text link | text link | ไม่บังคับสร้างกล่อง 44 px แต่ต้องมีระยะรอบที่กด/อ่านง่ายตาม text-link branch |

ค่าข้างบนต้อง resolve จาก `tokens.v0.9.1.json#/control/textOrIconLabelButton` และ `#/control/iconOnlyButton` ผ่าน adapter ห้ามเขียน local geometry ชุดใหม่เพื่อเลียน screenshot

### 6.2 Segmented selector

- ใช้เมื่อเปลี่ยนสิ่งที่กำลังดู ไม่ได้ส่งหรือบันทึกข้อมูล
- selected state ต้องเห็นได้โดยไม่พึ่งสีอย่างเดียวและมี programmatic state
- keyboard ใช้ลูกศร, Home และ End ตาม component contract
- หลังเปลี่ยน ต้องประกาศชื่อ view ใหม่ให้ assistive technology
- `EvidenceConversationSwitch` ต้องคง `caseId/contextRef` เดิมเมื่อสลับ `ข้อมูล` กับ `ห้องแชท`

### 6.3 Navigation

- desktop แสดง direct header controls รวม brand ไม่เกิน 4
- mobile แสดง direct header controls รวม brand ไม่เกิน 2
- ทุก direct control อย่างน้อย 44 × 44
- brand control ไป destination ของ CityChat จริงหนึ่งแห่ง
- ส่วนที่เหลือใช้ disclosure แบบ semantic ไม่ย่อ control ให้ต้องแตะปลุกก่อน
- Citizen/Officer navigation รักษา information model จากงานเดิมได้ แต่ต้องบอก product, พื้นที่, หน่วยงาน และบทบาทอย่างไม่ปนกัน

## 7. Component และ pattern ของ CityChat

ทุก component ต้องมี: purpose, non-purpose, semantic element, content slots, relevant states, responsive behavior, accessibility, LDS bindings, truth boundary, fixture และ anti-pattern

| Component | ใช้เพื่อ | ห้ามใช้เพื่อ |
|---|---|---|
| `CityChatLockup` | บอกตัวตนผลิตภัณฑ์ | สร้าง logo ใหม่หรือวาง carrier เอง |
| `ConversationMotif` | เพิ่มความอบอุ่นให้คำชวน/empty/success | แทน logo, evidence หรือ functional icon |
| `CityBand` | บอกผลิตภัณฑ์ พื้นที่ หน่วยงาน และบทบาท | ยัดทุก destination ลง header |
| `EvidenceConversationSwitch` | สลับสิ่งที่รู้กับสิ่งที่คนเล่าในเรื่องเดียวกัน | เปลี่ยน case หรือทำเป็นสอง CTA |
| `TopicMark` | ช่วยจำหมวดเรื่องพร้อม label | แทน score, status หรือ control icon |
| `StoryInviteCard` | บอกเรื่อง พื้นที่ ผู้ชวน วันที่ และ action เดียว | feed card ที่มีหลาย CTA แข่งกัน |
| `PlaceContextPicker` | เลือกตำแหน่งปัจจุบัน ปักหมุด หรือพื้นที่ที่บันทึกไว้ | เดาตำแหน่ง ขอสิทธิ์โดยไม่อธิบาย หรือทำให้ตำแหน่งหนึ่งดูแม่นกว่าความจริง |
| `CityCellDetail` | อธิบายความหมาย ที่มา วันที่ และสิ่งที่ยังไม่รู้ | metric dump หรือคำแนะนำลงทุน |
| `CivicAction` | ให้คนช่วยหนึ่งอย่างและรู้ผลทันที | ทำหลาย action เท่ากันใน scene เดียว |
| `ContributionReceipt` | ยืนยันว่าระบบบันทึกอะไร เมื่อไร และใครเห็น | success illustration ที่ไม่มี persistence |
| `ParticipationMilestone` | จำ contribution ที่ยืนยันแล้วและชวนทำต่อ | leaderboard หรือคะแนนตัดสินคน/พื้นที่ |
| `OutcomeReturn` | พากลับมาเห็น material change และ next step | notification เพื่อเรียกยอดโดยไม่มีอะไรเปลี่ยน |

### 7.1 `StoryInviteCard`

ต้องมี:

1. เรื่องอะไร
2. ที่ไหน หรือเกี่ยวกับพื้นที่ใด
3. ใครชวน/หน่วยงานใด เมื่อข้อมูลนั้นช่วยสร้างความไว้ใจ
4. วันที่หรือความสดของเรื่อง
5. primary action ไม่เกินหนึ่ง
6. บอกผลหลัง action

ภาพประกอบ optional แต่ข้อความหลักต้องอ่านได้โดยไม่มีภาพ

### 7.2 `EvidenceConversationSwitch`

- label ที่คนเห็นคือ `ข้อมูล` และ `ห้องแชท` หรือคำที่ product owner อนุมัติ
- ทั้งสอง view ใช้ context identity เดียวกัน
- view ข้อมูลแสดง source/freshness/unknown ในภาษาคน
- view ห้องแชทแสดงสิ่งที่คนเล่าโดยไม่ทำให้ดูเป็นข้อมูลทางการ
- selected view ต้องคงอยู่เมื่อกลับจาก detail ตาม product navigation contract

### 7.3 `ParticipationMilestone`

- แสดงหลัง authoritative receipt เท่านั้น
- บอกสิ่งที่ผู้ใช้ช่วยจริง ไม่สร้างตัวเลขทดแทน
- ชื่อระดับเดิม เช่น `โก๋ปากซอย`, `ป้าข้างบ้าน`, `กำนัน`, `เจ้าแม่` ยังเป็น candidate ต้องผ่าน user/product/ethics review ก่อนใช้จริง
- คะแนน ระดับ และยอดนิยมต้องไม่เข้า logic จัด civic priority

### 7.4 `PlaceContextPicker`

รักษาสามทางเลือกจากงานเดิมเมื่อ product รองรับจริง:

1. `ใช้ตำแหน่งตอนนี้` — ขอ permission หลังบอกประโยชน์และมีทางเลือกอื่น
2. `ปักหมุดบนแผนที่` — ให้คนยืนยันจุดและเห็นชื่อพื้นที่ที่ระบบเข้าใจ
3. `เลือกพื้นที่ที่บันทึกไว้` — แสดงเฉพาะเมื่อผู้ใช้มีพื้นที่ที่บันทึกจริง

- ผลลัพธ์ต้องเป็น `placeRef` และ visible place label เดียวกันตลอด case
- ตำแหน่งที่หาไม่ได้หรือ permission ถูกปฏิเสธต้องมี recovery ไม่ปิดทางเล่าเรื่อง
- ห้ามกล่าวว่า GPS, pin หรือ saved area มีความแม่นยำเท่ากันถ้าข้อมูลไม่ได้ยืนยัน

## 8. First value, Civic loop และการกลับมา

### 8.1 First value

ก่อนขอ login, follow, share หรือข้อมูลส่วนตัว คนต้องเห็นอย่างน้อย:

1. กำลังดูพื้นที่หรือเรื่องไหน
2. เรารู้อะไรหนึ่งอย่าง
3. ยังไม่รู้อะไร
4. ถ้ามีคำถาม คำถามนั้นช่วยอะไร
5. ถ้ามี action กดแล้วเกิดอะไร

### 8.2 Civic loop

`SEE → UNDERSTAND → ANSWER/ACT → KNOW THE RESULT → RETURN FOR CHANGE`

- SEE — เห็นพื้นที่หรือเรื่องจริง
- UNDERSTAND — เห็นความหมายและที่มา
- ANSWER/ACT — ช่วยหนึ่งอย่าง
- KNOW THE RESULT — รู้ว่าส่งหรือบันทึกสำเร็จหรือไม่
- RETURN FOR CHANGE — กลับมาเพราะเรื่องเดิมมีข้อมูลหรือสถานะใหม่

อันดับ เหรียญ streak และยอดนิยมไม่ใช่หลักฐานว่าเรื่องเมืองสำคัญกว่า เรื่องสำคัญเพราะผลกระทบ ความเร่งด่วนตามหลักฐาน และหน้าที่ที่ต้องรับผิดชอบ

### 8.3 Receipt และ return

- แสดง `ส่งแล้ว`, `บันทึกแล้ว`, `รับเรื่องแล้ว`, `มอบหมายแล้ว` หรือ `ปิดแล้ว` เฉพาะเมื่อระบบเจ้าของงานยืนยัน
- ต้องบอกว่าบันทึกอะไร เมื่อไร ใครเห็น และมี reference ที่ตรวจได้
- ถ้าส่งไม่สำเร็จ ต้องรักษาสิ่งที่คนพิมพ์ไว้และให้ลองใหม่
- แจ้งกลับเมื่อมี material change ของเรื่องเดิม
- illustration, badge หรือ motion ไม่ใช่หลักฐานว่า action สำเร็จ

ข้อความที่คนเห็นควรตรงและอบอุ่น:

- `ส่งให้เทศบาลแล้ว`
- `บันทึกเรื่องของคุณแล้ว`
- `เลขอ้างอิง …`
- `ยังส่งไม่สำเร็จ ข้อความของคุณยังอยู่ ลองอีกครั้งได้`

## 9. CityScan และ CityCell

### 9.1 สามคำถามหลักใน viewport

CityScan ใช้สามคำถามนี้เท่านั้นเป็น entry intent:

1. `daily_life` — **แถวนี้น่าอยู่ยังไง**
2. `visitor_identity` — **น่าเที่ยวตรงไหน**
3. `local_activity` — **น่าค้าขายอะไรดี**

แต่ละคำถามมี `TopicMark` family เดียวกันได้ แต่ต้องมีข้อความกำกับและห้ามรวมเป็นคะแนนเมืองค่าเดียว

### 9.2 แถวนี้น่าอยู่ยังไง

| กลุ่มที่คนเห็น | CityCell ตัวอย่าง | ขอบเขตที่ต้องบอก |
|---|---|---|
| บริการจำเป็นใกล้ตัว | โรงพยาบาล, ตำรวจ, ดับเพลิง | การเข้าถึงบริการไม่เท่ากับพิสูจน์ความปลอดภัย |
| ของใช้และบริการประจำวัน | โรงเรียน, ตลาด, ร้านสะดวกซื้อ, ร้านอาหาร | จำนวนสถานที่ไม่เท่ากับคุณภาพหรือคนใช้จริง |
| พักผ่อนและธรรมชาติ | สวนสุขภาพ, แหล่งธรรมชาติ | ต้องบอก coverage และชนิดแหล่งข้อมูล |
| ร้านค้าและกิจกรรม | แหล่งช็อปปิง, ที่เที่ยวกลางคืน, คาเฟ่ | จำนวนสถานที่ไม่ใช่ความคึกคักจริง |

### 9.3 น่าเที่ยวตรงไหน

| กลุ่ม | CityCell ตัวอย่าง | ขอบเขตที่ต้องบอก |
|---|---|---|
| กิน | ร้านเด่น, Michelin, คาเฟ่ | คะแนนและรีวิวบอกเฉพาะข้อมูลจากแหล่งนั้น |
| นอน | โรงแรม | จำนวนที่พักไม่ใช่จำนวนผู้มาเยือน อัตราเข้าพัก หรือคุณภาพ |
| เที่ยว | ธรรมชาติ, วัฒนธรรม, แหล่งช็อปปิง | แยกประเภทและที่มา ไม่รวมเป็นคะแนนเดียว |

### 9.4 น่าค้าขายอะไรดี

| กลุ่ม | CityCell ตัวอย่าง | ขอบเขตที่ต้องบอก |
|---|---|---|
| คนอยู่แถวนี้ | จำนวนคนที่อยู่อาศัย, จำนวนครัวเรือน | ค่าประมาณไม่เท่ากับทะเบียนหรือลูกค้าที่จะมาร้าน |
| คนมาเยือน | ยังไม่ได้กำหนด | บอกว่า `ส่วนนี้ยังไม่มีข้อมูล` ไม่แสดง 0 และไม่เติมเอง |
| คนมาทำงานหรือเรียน | บริษัท, โรงงาน, หน่วยงานรัฐ, โรงเรียน | การมีสถานที่ไม่ได้บอกจำนวนคนหรือความต้องการซื้อจริง |

ข้อมูลนี้ใช้สำรวจโอกาสเบื้องต้น ก่อนตัดสินใจต้องเช็กคนซื้อ ต้นทุน คู่แข่ง และกติกาของพื้นที่เพิ่มเติม CityScan ไม่ใช่คำแนะนำลงทุน ใบอนุญาต หรือการรับรองจากเทศบาล

### 9.5 CityCell contract

รายการข้างล่างเป็น human field map ไม่ใช่ JSON Schema จนกว่า v0.9 resource package จะส่ง schema และ fixtures ที่ตรวจผ่าน CityCell ทุกตัวต้องมี:

```yaml
cityCellId: stable_id
publicLabel: plain_language
presentationKind: observation | proxy | question | unavailable
valueState: observed | observed_zero | unknown | out_of_coverage | stale | not_applicable | suppressed_privacy
claimLevel: no_claim | observe | compare | flag | suggest_question
evidenceRef: required_when_claim_exists
publicMeaning: required
forbiddenClaims: []
topicMarkRef: optional
```

`unknown`, `out_of_coverage`, `stale` และ `suppressed_privacy` ห้ามกลายเป็น 0

CityCell ไม่ใช่ H3 cell, metric, Evidence Capsule หรือ StoryCell ฝั่งข้อมูลใช้ `spatialCell` หรือ `h3Cell` เพื่อไม่ให้สับสน เมื่อเปิด CityCell เป็น StoryCell ให้ใช้ **one signal + facts ไม่เกินสาม + one question + action ไม่เกินหนึ่ง**

## 10. สาม surface ต้องเป็นเรื่องเดียวกัน

`CityScan → CityChat สำหรับประชาชน → Officer CityMETER`

ทุก surface ต้องคงอย่างน้อย:

- `caseId`
- `contextRef`
- `snapshotRef`
- `topicId`
- `responseVersion`
- place/time context

### 10.1 CityScan — ดูพื้นที่

- เริ่มจาก viewport และสามคำถาม
- เปิด CityCell, ที่มา, วันที่ และสิ่งที่ยังไม่รู้ได้
- เมื่อเลือกกรอบ ให้เก็บ context identity ที่ส่งต่อได้
- ไม่กล่าวว่าเป็นเรื่องร้องเรียนหรือสถานะทางการ

### 10.2 CityChat สำหรับประชาชน — ฟังเสียงคน

- แปลง CityCell ที่เลือกเป็นเรื่องใกล้ตัว
- แสดงความหมายหนึ่งอย่าง ถามหนึ่งเรื่อง และให้ช่วยหนึ่งอย่าง
- บอกก่อนว่าใครจะเห็นและกดแล้วเกิดอะไร
- แสดง receipt เฉพาะเมื่อบันทึกจริง

### 10.3 Officer CityMETER — ใช้ทำงาน

- เปิดเรื่องเดียวกันด้วย context identity เดิม
- แยก `สิ่งที่ข้อมูลบอก`, `สิ่งที่คนเล่า` และ `สิ่งที่ต้องตรวจ`
- แสดง source, coverage, freshness, ช่องว่าง, ผู้รับผิดชอบ และงานต่อหนึ่งอย่าง
- ไม่ให้ leaderboard หรือยอดนิยมกำหนด civic priority
- ไม่แสดง official status หากระบบเจ้าของงานยังไม่ยืนยัน

## 11. ภาษาและการสื่อสาร

CityChat พูดเหมือนคนคุยกับคน สั้น กระชับ เป็นกันเอง และเกี่ยวกับสิ่งที่ผู้ใช้กำลังทำ

### 11.1 สูตรข้อความ

`เรื่องอะไร → ที่ไหน/เมื่อไร → ชวนทำอะไรต่อ`

ตัวอย่าง:

- `ช่วงเย็นนี้ หน้าเทศบาลรถติดแค่ไหน?`
- `แถวถนนลงหาด วันนี้`
- `เล่าให้เทศบาลรู้`

### 11.2 กติกา

- หนึ่งข้อความหลักต่อหนึ่งเจตนา
- CTA เริ่มด้วยคำกริยา เช่น `ดู`, `เล่า`, `ตอบ`, `ติดตาม`, `เช็ก`, `ส่งต่อ`
- ใช้ชื่อพื้นที่จริงก่อนศัพท์เทคนิค
- บอกผลของการกดด้วยภาษาคน
- ฝั่งประชาชนไม่ใช้ศัพท์ระบบหรือศัพท์ AI
- ฝั่งเจ้าหน้าที่ใช้คำทำงานที่ตรง เช่น `ดูเรื่องในพื้นที่`, `เช็กข้อมูล`, `ส่งต่อทีม`, `อัปเดตสถานะ`
- ภาษาไทยและอังกฤษเขียนแยกตามธรรมชาติ ไม่แปลคำต่อคำ
- ถ้าข้อมูลยังไม่มี ใช้ `ยังไม่มีข้อมูลส่วนนี้` ไม่แสดง 0
- ข้อจำกัดที่จำเป็นต้องบอกต้องแปลเป็นผลต่อผู้ใช้ เช่น `ข้อมูลล่าสุดเดือน...` หรือ `พื้นที่นี้ยังไม่มีข้อมูล` ไม่โยนคำเทคนิคให้ผู้ใช้ตีความ

### 11.3 คำที่ห้ามใช้บนหน้าผู้ใช้ทั่วไป

- truth envelope, claim ceiling, source_limited, runtime, fixture, schema
- AI analysis, agent, inspector, inference, confidence
- capability, authorization decision, delivery availability
- build ID, hash, QA code และชื่อ package ภายใน

คำทีมอยู่หลัง developer reference ได้ แต่ต้องไม่หลุดเข้า product copy

### 11.4 Content pattern record

ข้อความที่ใช้ซ้ำต้องมี source เดียว:

```json
{
  "id": "story.invite.traffic",
  "audience": "citizen",
  "surface": "citychat",
  "intent": "invite_contribution",
  "placeRequired": true,
  "th": {
    "title": "ช่วงเย็นนี้ หน้าเทศบาลรถติดแค่ไหน?",
    "action": "เล่าให้เทศบาลรู้"
  },
  "en": {
    "title": "How busy is traffic near City Hall this evening?",
    "action": "Tell the city what you see"
  },
  "nextState": "story_composer",
  "prohibitedVariants": ["ส่งข้อมูลให้ AI วิเคราะห์"]
}
```

HTML, fixture และ component demo ต้องอ่านจาก record เดียว ไม่เขียน copy ซ้ำหลายที่

## 12. Motion และ feedback

ใช้ motion เพื่อช่วยเห็นสิ่งที่เปลี่ยน ไม่ใช้ทำให้ระบบดูฉลาดหรือ live

- final state ของ first value, evidence และ primary action ต้องอยู่ใน source ตั้งแต่ต้น
- press/focus/state feedback ใช้ LDS primitive
- reveal ลำดับอ่านทำได้ครั้งเดียวเมื่อช่วย orientation และต้องไม่ซ่อนข้อมูลหาก script/observer ไม่ทำงาน
- CTA discovery cue ใช้ได้เฉพาะ primary navigational CTA ที่มีเหตุผลเรื่อง discoverability บันทึกไว้
- cue รันครั้งเดียวต่อ page load; re-entry ไม่รันซ้ำ
- stateful หรือ consequential action ห้ามใช้ cue เพื่อเร่งให้กด
- ห้าม endless loop, flicker, perpetual pulse, auto-carousel, sweep, score count-up และ parallax
- logo ไม่ animate
- `prefers-reduced-motion`, observer failure, deep link, focus และ history restore ต้องเห็น final state ทันที
- loading ต้องบอกว่ากำลังทำอะไร; success/error ต้องตรงผลจริงและมี recovery

### 12.1 Motion roles จาก LDS v0.9.1

| Role | Duration | ใช้กับ |
|---|---:|---|
| feedback | 120 ms / movement ไม่เกิน 2 px | press และ immediate feedback |
| state | 200 ms | selected, disclosure และ state change เล็ก |
| map | 280 ms | map state ที่ไม่ทำให้ตำแหน่งจริงคลาดเคลื่อน |
| chart | 360 ms | เปลี่ยน chart state โดยไม่ count-up หลอก |
| approach opacity | 760 ms | supporting reveal ที่มี benefit และ fail-open |
| approach transform | 920 ms | supporting orientation; reduced-motion ตัดออก |
| approach media | 900 ms | media support ที่ไม่ gate เนื้อหา |

Stagger ที่อนุมัติคือ `0 / 150 / 300 / 450 ms`; observer threshold `0.14`; watchdog `2400 ms` หาก lifecycle ผิดปกติให้แสดง final state ไม่ซ่อน content

### 12.2 CTA discovery cue

- ใช้เฉพาะ primary **navigational** CTA ที่บันทึก benefit ว่า “ช่วยให้หา action เจอ”
- duration 540 ms และต้องไม่เกิน 600 ms
- รันครั้งเดียวต่อ page load; pointer-inert; ไม่ขยับ layout
- reduced motion และ failure ใช้ final state ปกติทันที
- ห้ามใช้กับ submit, delete, payment, official submission หรือ action ที่มีผลสำคัญ

## 13. Contract สำหรับคนและเครื่องมือสร้างงาน

CityChat scene record เป็น extension ของ LDS Build Card และ component inventory ไม่ทำสำเนาค่าสี ฟอนต์ geometry หรือ motion timing ไว้อีกชุด

รายการข้างล่างเป็น human field map ห้าม copy ไปประกาศว่า validate แล้วจนกว่าจะมี versioned JSON Schema, examples และ failing fixtures ใน v0.9 resource package

```yaml
sceneId: required
audience: citizen | officer | team
surface: cityscan | citychat_public | officer_citymeter | playground
job: one_short_human_job
caseId: required
contextRef: required
placeRef: required
timeContextRef: required
snapshotRef: required_when_data_is_shown
responseVersion: required
topicId: daily_life | visitor_identity | local_activity | none
cityCellRefs: []
ldsReleaseRef: required
citychatAddonRef: required
buildCardRef: required
formatProfileRef: required
runtimeClass: browser | native | static
firstMeaning: one_plain_sentence
question: zero_or_one
primaryActionRef: zero_or_one
immediateConsequence: required_when_action_exists
resultRef: required_when_action_can_complete
receiptRef: required_when_persistence_is_claimed
citychatComponentIds: []
componentContractRefs: []
heritageAssetRefs: []
contentPatternRefs: []
states: [loading, ready, empty, error, permission_denied]
truthBoundaryRef: required
blockedReasons: []
```

คนหรือ generator ห้ามอ่าน screenshot แล้วเดา token, glyph, role, metric, threshold, asset permission หรือสถานะระบบ

กติกา resolver:

1. LDS-owned value ต้อง resolve จาก pinned LDS v0.9.1 record
2. CityChat asset ต้อง resolve approved registry record และ exact hash
3. copy ต้อง resolve content pattern และ locale
4. data claim ต้อง resolve product/data contract
5. action result ต้อง resolve product capability/receipt contract
6. ถ้าขาดข้อใด ให้คืน `blockedReason` และไม่สร้างข้อความหรือ asset ทดแทนเอง

## 14. ตัวอย่างที่ Playground ต้องมี

ทุกตัวอย่างที่ควรทำใช้พื้นที่และข้อมูลชุดเดียวกันตลอดเส้นทาง และแสดงสามมุม:

`แนวคิดจาก Figma → เวอร์ชันที่ประกอบด้วย LDS → เหตุผลที่เปลี่ยน`

### CASE-A — CityScan: ดูแถวนี้อย่างเข้าใจง่าย

- แสดงสามคำถามหลักและ TopicMark family เดียวกัน
- เปิด CityCell เพื่อดูความหมาย วันที่ ที่มา และสิ่งที่ยังไม่รู้
- สลับ `ข้อมูล / ห้องแชท` โดยไม่เปลี่ยน case
- ไม่รวมเป็น CityScore
- primary action: `ดูข้อมูลแถวนี้`

### CASE-B — CityChat: จากข้อมูลไปเป็นเรื่องใกล้ตัว

- ใช้ `StoryInviteCard` ที่รักษาความอบอุ่นจาก Figma
- แสดงผู้ชวน หน่วยงาน พื้นที่ วันที่ และ action เดียว
- composer ถามภาษาธรรมดา
- ถ้าเรื่องต้องมีตำแหน่ง ใช้ `PlaceContextPicker` และคง placeRef เดิม
- เมื่อบันทึกสำเร็จจึงแสดง receipt และ next useful action
- primary action: `เล่าให้เทศบาลรู้`

### CASE-C — Officer CityMETER: รับเรื่องเดียวกันไปทำงาน

- `CityBand` แสดงโหมดเจ้าหน้าที่และพื้นที่ชัด
- เห็นข้อความประชาชนพร้อม CityCell ที่เกี่ยวข้อง
- แยกข้อมูล เสียงคน และสิ่งที่ต้องตรวจ
- action จริง เช่น `เช็กข้อมูล`, `ส่งต่อทีม`, `อัปเดตสถานะ`
- official status ต้องมาจากระบบเจ้าของงาน

### CASE-D — กลับมาแล้วเห็นว่าการช่วยมีความหมาย

- ใช้ `ParticipationMilestone` จาก visual family ที่อนุมัติ
- แสดง contribution ที่มี receipt จริง
- ชวน next useful action ที่สัมพันธ์กับเรื่องเดิม
- ไม่มี leaderboard และไม่ให้แต้มกำหนด civic priority

### CASE-E — Topic hazard

- ใช้ TopicMark น้ำท่วม/แผ่นดินไหว/ฝุ่น–ไฟ/สารเคมี/รวมแชทเป็น content category
- generic UI action เช่น back, close, share และ favorite ใช้ LDS icon
- แสดง light/dark parity, visible labels และ color-independent meaning

### `REJECT-01` — ตัวอย่างที่ไม่ควรใช้: คัด Figma เดิมลง production ตรง ๆ

ตัวอย่างที่ไม่ผ่าน:

- ใช้ TapBlue/legacy hex และ dark palette เดิม
- ใช้ font, fixed-width button, multi-layer shadow และ arbitrary icon เดิม
- ใช้ screen PNG เป็น UI
- ใช้ conversation motif เป็น secondary logo โดยไม่มี approval
- แสดง badge หรือ success ทั้งที่ยังไม่มี receipt

การแก้: รักษา intent และ asset ที่ผ่าน role approval แล้วสร้าง component ด้วย LDS v0.9.1

### `REJECT-02` — ตัวอย่างที่ไม่ควรใช้: คะแนนเดียวตัดสินพื้นที่

`CityScore 87 — ดีทุกด้าน เปิดร้านได้เลย`

เหตุผล: รวมคำถาม คน แหล่งข้อมูล ช่วงเวลา และหน่วยที่เข้ากันไม่ได้ ให้กลับไปเลือกหนึ่งในสามคำถามและเปิด CityCell แยกกัน

## 15. Release package ขั้นต่ำ

artifact v0.9.0 จะถือว่า implement ครบและพร้อมขอ publish ได้เมื่อมี:

1. normative DS Add-on exact bytes และ owner approval record
2. v0.8 → v0.9 migration ledger
3. LDS v0.9.1 source binding, exact approved package bytes, external trust verification และ machine-package delivery receipt
4. Build Card, control inventory และ artifact manifest รุ่นใหม่
5. heritage source inventory และ adoption matrix
6. asset rights record, asset registry, role approvals และ asset-only checksums
7. canonical logo, selected ConversationMotif, TopicMark family และ illustration assets ใน repo
8. CityChat component contracts ตาม §7
9. content pattern record และ locale review
10. CityScan taxonomy, CityCell contract และ case library
11. color role map, generated Color Atlas, type/icon/motion resolution records
12. responsive/accessibility matrix
13. full JSON Schema validation ไม่ใช่เพียงตรวจ required fields
14. source QA, rendered QA, manual review, exact release checksums และ production receipt

ก่อนครบ ห้ามเปลี่ยน `release.config`, current v0.8 approval, current live manifest หรือหน้า public ให้กล่าวว่า v0.9 ผ่าน release แล้ว

## 16. Migration จาก v0.8

### 16.1 เก็บไว้

- North Star และคำแปลหกข้อ
- First value, Civic loop และ return
- CityChat exact identity และข้อห้ามเรื่องแผ่นขาวหลังโลโก้
- action capsule, icon circle และ segmented selector
- สามคำถาม CityScan และ CityCell truth states
- สาม-surface continuity
- plain Thai และการไม่ใช้ภาษาระบบบนหน้าผู้ใช้
- Color Atlas separation, motion boundary และ asset checksum
- caseId/contextRef และกติกาห้ามรวมเป็น CityScore

### 16.2 เพิ่มใน v0.9

- LDS v0.9.1 authority binding และ machine-package boundary
- Figma/Drive heritage adoption model
- `ConversationMotif`, `TopicMark`, `StoryInviteCard`, `EvidenceConversationSwitch`, `ContributionReceipt` และ `ParticipationMilestone`
- role/rights/hash contract สำหรับ asset ทุกชิ้น
- distinction ระหว่าง interface icon, TopicMark, identity และ illustration
- navigation budget, direct target และ fail-open motion จาก LDS v0.9.1
- content pattern record ที่เป็น source เดียว
- full component anatomy และ case teaching format
- inventory reconciliation gate ระหว่าง immutable source snapshot กับ release manifest

### 16.3 ยกเลิกหรือแทนที่

- LDS v0.9.0-r7 pin → LDS v0.9.1-r8 source binding
- legacy Figma color/type/control/icon values → LDS v0.9.1 roles/primitives
- arbitrary custom functional SVG → LDS approved interface icon subset
- badge/level ที่ไม่มี receipt → verified participation milestone
- dated runtime observation ใน normative body → QA/evidence record แยก
- implementation class names เช่น `.btn` → component/semantic contract

### 16.4 ไม่อนุญาตให้เกิด rule drift

v0.8 และ approval เดิมต้องคงเป็น immutable history ห้ามแก้ชื่อรุ่นหรือใช้ approval เดิมรับรอง v0.9 Acceptance ID เดิมที่ยังใช้ต้อง map ไปข้อใหม่อย่างชัดเจน ห้ามหายเงียบ

- `CC-DA-ASSET-01` จาก v0.8 → `CC-DA-HERITAGE-01` + `CC-DA-VISUAL-ASSET-01` + `CC-DA-ASSET-INVENTORY-01`
- Acceptance เดิมอื่นที่ชื่อเหมือน v0.9 คงความหมายหลักไว้ แต่ต้องออก record/schema/receipt รุ่นใหม่ ห้ามใช้ receipt v0.8 แทน

## 17. Acceptance ที่บล็อก release

| Rule | Automated/record gate | Human/visual gate |
|---|---|---|
| `CC-DA-AUTHORITY-01` | LDS source/release/root/ZIP hash ตรง; external trust verify ผ่าน; CityChat delivery state ไม่กล่าวเกินจริง | เจ้าของ domain review ถูกส่วน |
| `CC-DA-HERITAGE-01` | ทุก item มี source, decision, rights, path และ hash | บุคลิกเดิมยังอยู่โดยไม่คัด legacy UI |
| `CC-DA-IDENTITY-01` | exact logo bytes/role approval | ไม่มี carrier, crop, reconstruction หรือ recolour |
| `CC-DA-VISUAL-ASSET-01` | motif/illustration/TopicMark แยก role และ fallback | visual family สอดคล้อง ไม่แย่งเนื้อหา |
| `CC-DA-ASSET-INVENTORY-01` | immutable source snapshot count ตรง manifest; mismatch/duplicate/missing file มี disposition; manifest ตรง bytes | archive/reference ไม่หลุดเป็น current asset |
| `CC-DA-FOREIGN-ASSET-01` | public page, visible Color Atlas และ downloadable CityChat assets ไม่มี foreign product role/name/file; upstream vendor ถูกแยกและไม่ถูกส่งต่อเข้า CityChat | ไม่มี ijji หรือ identity ผลิตภัณฑ์อื่นโผล่ใน CityChat |
| `CC-DA-COLOR-01` | visible role resolve `color-srgb-05`; ไม่มี legacy/foreign role | contrast/theme/redundancy ผ่าน |
| `CC-DA-TYPE-01` | exact v0.9.1 font binding/hash | Thai/Latin/zoom/export fixtures อ่านได้ |
| `CC-DA-ICON-01` | interface icon approved subset; FILL 0/wght 300 | label, optical balance และ theme ผ่าน |
| `CC-DA-CONTROL-01` | target/semantics/state/destination ตรง contract | capsule/circle/selector/focus ไม่เสียรูป |
| `CC-DA-NAV-01` | budget 4 desktop/2 mobile รวม brand; target ≥44 | hierarchy และ disclosure เข้าใจง่าย |
| `CC-DA-COMPONENT-01` | inventory กับ complete contract ตรงกัน | rendered states/responsive/locale ผ่าน |
| `CC-DA-SWITCH-01` | keyboard/current state และ context identity คงเดิม | คนเข้าใจ `ข้อมูล / ห้องแชท` ว่าเป็นเรื่องเดียวกัน |
| `CC-DA-PLACE-01` | placeRef/permission/result/recovery ตรง contract | สามทางเลือกเข้าใจง่ายและไม่กล่าวความแม่นยำเกินจริง |
| `CC-DA-FIRSTVALUE-01` | first value มาก่อน nonessential gate | ผู้ใช้รู้พื้นที่ สิ่งที่รู้/ไม่รู้ และทางต่อ |
| `CC-DA-RETURN-01` | persistence claim มี receipt | failure/recovery และ next step ชัด |
| `CC-DA-FAIRNESS-01` | rank/point ไม่เข้า priority logic | ไม่มี popularity framing ที่บิด civic value |
| `CC-DA-CITYSCAN-01` | สาม prompt ครบ ไม่มี aggregate score | TopicMark ครบและมี label |
| `CC-DA-CITYCELL-01` | truth fields/evidence boundary ครบ | unknown ไม่ถูกอ่านเป็น zero |
| `CC-DA-HANDOFF-01` | context identity parity 3 surface | citizen/officer meaning ตรงกัน |
| `CC-DA-LANG-01` | content record/locale parity | native TH/EN review; ไม่มีภาษาระบบบนหน้าผู้ใช้ |
| `CC-DA-MOTION-01` | benefit, finite lifecycle, fail-open, reduced motion | final state stable ไม่มี loop/flicker/parallax |
| `CC-DA-PLAYGROUND-01` | CASE A–E + REJECT 01–02 ครบ | อธิบาย Figma intent → LDS implementation → benefit ได้ |
| `CC-DA-RELEASE-01` | schema, QA, checksum, production receipt zero exception | owner signs exact release bytes |

Color Atlas acceptance เดิม map ดังนี้:

- `CC-AC-IDENTITY-*` → `CC-DA-IDENTITY-01` และ `CC-DA-VISUAL-ASSET-01`
- `CC-AC-COLOR-*`, `CC-AC-CONTRAST-*`, `CC-AC-MAP-*` → `CC-DA-COLOR-01`
- `CC-AC-ASSET-COLOR-*` → `CC-DA-COLOR-01`, `CC-DA-HERITAGE-01` และ `CC-DA-VISUAL-ASSET-01`

## 18. Definition of Done

CityChat DS Add-on v0.9 พร้อมใช้เมื่อ:

1. คนเห็นว่าเป็น CityChat ทันทีจาก exact logo, conversation language และ visual family ที่อนุมัติ
2. สี ตัวอักษร control icon navigation และ motion resolve จาก LDS v0.9.1 จริง
3. งานข้าวกล้องทุกชิ้นที่ใช้มีสถานะ source rights role path และ hash ชัด
4. คนเห็น first value ก่อนถูกขอ login หรือข้อมูลที่ไม่จำเป็น
5. CityScan ตอบสาม intent ด้วย CityCell ย่อยและไม่รวมเป็นคะแนนเดียว
6. เรื่องเดียวกันเดินผ่าน CityScan, CityChat และ Officer CityMETER ด้วย context เดิม
7. action หนึ่งครั้งมีผลที่บอกล่วงหน้าและมี receipt เมื่อบันทึกจริง
8. language เป็นภาษาคน ไม่มีศัพท์ระบบบนหน้าผู้ใช้
9. motion ช่วย orientation/state change และยังใช้งานได้เมื่อ motion ไม่ทำงาน
10. light/dark, mobile/desktop, keyboard, screen reader, reduced motion, Thai/English และ 200% zoom ผ่าน
11. Playground มี good cases และ rejected cases ที่ dev, product, sales และ designer เข้าใจตรงกัน
12. exact release bytes ผ่าน full schema, asset, accessibility, rendered, manual และ production checks

## 19. ข้อสรุปสั้นที่สุด

**LDS v0.9.1 คุมฐานที่ต้องสม่ำเสมอ ส่วน CityChat DS Add-on คุมตัวตน ภาพ ภาษา และวิธีพาคนจากพื้นที่ไปสู่บทสนทนาและงานที่ทำต่อได้ งานของข้าวกล้องจึงไม่หาย แต่ถูกจัดบทบาทใหม่ให้ใช้จริงได้ ชัดขึ้น และไม่สร้าง Design System ซ้อนอีกชุด**
