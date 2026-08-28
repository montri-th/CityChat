# CityChat DS Add-on v0.8 — One City, Three Useful Views

> คู่มือเสริมสำหรับประกอบ Landometer Design System ให้เป็น CityChat ที่อบอุ่น อ่านง่าย และพาคนจาก “เห็นพื้นที่” ไปสู่ “เข้าใจ–เล่า–ทำต่อ” โดยไม่สร้าง Design System ซ้ำอีกชุด

## 0. สถานะและขอบเขต

- **สถานะ:** Approved owner direction — normative DS Add-on, 28 Aug 2026
- **ใช้กับงานใหม่ตั้งแต่รุ่นนี้:** CityChat DS Add-on v0.8
- **ฐานร่วม:** Landometer Design System v0.9.0-r7 และ machine package v0.9.0-mp1
- **เอกสารก่อนหน้า:** v0.6 และ v0.7 เป็นหลักฐานประวัติ ไม่ใช่แหล่งกติกาสำรองสำหรับงานใหม่
- **สิ่งที่เอกสารนี้คุม:** ตัวตน CityChat, first value, Civic loop, CityScan/CityCell, การส่งต่อระหว่างหน้าประชาชน–CityScan–Officer CityMETER, ภาษา, การใช้ปุ่ม สี icon asset และ motion
- **สิ่งที่ยังต้องมีเจ้าของแยก:** นิยาม metric, แหล่งข้อมูล, scale, สิทธิ์ข้อมูล, workflow เจ้าหน้าที่, การบันทึก, receipt และสถานะทางการ

กติกาของ CityChat ต้องอ่านจากเอกสารนี้ร่วมกับ LDS ที่ pin ไว้ ห้ามย้อนเลือกกติกาจากเอกสารเก่าเฉพาะส่วนที่ทำให้ทำงานง่ายขึ้น

## 1. คำสั่งหลัก

> Show a living city quickly, ask one meaningful question, let people act in one tap, remember their contribution, and make the next useful action obvious.

แปลเป็น CityChat:

1. เริ่มจากพื้นที่ คน หรือเรื่องที่เกิดขึ้นจริง
2. ให้ความหมายแรกเร็ว โดยไม่บังคับเข้าสู่ระบบก่อน
3. ถามเพียงหนึ่งเรื่องที่ช่วยให้เข้าใจพื้นที่ดีขึ้น
4. ให้ทำต่อได้หนึ่งอย่าง และบอกก่อนว่ากดแล้วเกิดอะไร
5. จำสิ่งที่คนช่วยเฉพาะเมื่อบันทึกจริง
6. ชวนกลับมาเมื่อเรื่องเดิมมีอะไรเปลี่ยนจริง

`เมืองมีชีวิต` ไม่ได้แปลว่าหน้าจอต้องกระพริบหรือมีตัวเลขวิ่ง แต่หมายถึงคนเห็นสายสัมพันธ์ระหว่าง **พื้นที่ → หลักฐาน → เสียงของคน → งานที่ทำต่อ → สิ่งที่เปลี่ยน**

## 2. LDS กับ CityChat DS Add-on ทำงานร่วมกันอย่างไร

| เรื่อง | เจ้าของกติกา |
|---|---|
| token, spacing, radius, type role, primitive, focus, contrast, motion timing | Landometer DS รุ่นที่ pin ไว้ |
| หน้าตา CityChat, ลำดับเรื่อง, น้ำเสียง, CityCell และการประกอบ scene | CityChat DS Add-on |
| metric, coverage, freshness, spatial unit, scale, no-data/zero | ทะเบียนข้อมูลหรือ CityScan contract ที่อนุมัติ |
| ผู้รับผิดชอบ, การมอบหมาย, การบันทึก, receipt, สถานะทางการ | ระบบเจ้าของงาน |
| logo, motif, photo, screenshot, map และสิทธิ์ใช้ไฟล์ | asset approval ของไฟล์นั้น |

ห้ามให้สีหรือภาพตัวอย่างทำหน้าที่แทนข้อมูล ห้ามให้ DS Add-on ประกาศความสามารถที่ระบบจริงยังไม่มี

## 3. ตัวตน CityChat ต้องเป็น CityChat เท่านั้น

### 3.1 สิ่งที่คงไว้

- ใช้โลโก้ CityChat exact bytes ตามบทบาทที่อนุมัติ
- ใช้ pin + chat motif เมื่อมีไฟล์ สิทธิ์ hash และ role approval ครบ
- ให้แผนที่ ภาพพื้นที่ และเรื่องของคนเป็นฉากหลัก
- ใช้การ์ดบทสนทนาที่อบอุ่น มีพื้นที่หายใจ และอ่านข้อความไทยได้ง่าย
- ใช้สี teal–green ที่ใกล้บุคลิกเดิมผ่าน CityChat role ซึ่ง resolve ไปยัง LDS token
- พูดเหมือนคนคุยกับคน

### 3.2 สิ่งที่ห้าม

- ห้ามวางแผ่นขาวเฉพาะหลังโลโก้ เว้นแต่ไฟล์และ role approval กำหนดไว้ตรง ๆ
- ห้าม crop, recolour, filter, mask, animate หรือประกอบโลโก้ใหม่
- ห้ามนำชื่อ โลโก้ motif gradient profile หรือ product token ของผลิตภัณฑ์อื่นมาเป็น CityChat asset
- shared LDS token ใช้ได้เฉพาะเมื่อ resolve ผ่าน CityChat role ที่อนุมัติ
- `cc.energy.participation` ใช้เป็นจุดสีเล็กใกล้คำชวนได้ แต่ไม่ใช่สีตัวตน ไม่ใช่ success, saved, official, urgent หรือ data value

vendored LDS package อาจมี profile ของหลายผลิตภัณฑ์เพื่อคง bytes จาก upstream แต่ไฟล์เหล่านั้นไม่ใช่ CityChat Asset Library และห้ามถูก render หรือ resolve เข้าสู่ current CityChat resources

## 4. Control ใช้ทรงไหน

อย่าเริ่มจากคำว่า “ปุ่ม” ให้เริ่มจากงานของ control

| งาน | รูปแบบ | กติกา |
|---|---|---|
| ทำสิ่งหนึ่งต่อ | **Labelled action capsule** | `.btn`; มีข้อความที่เห็นชัด จะมี icon นำหน้าหรือไม่ก็ได้ |
| ทำสิ่งหนึ่งต่อด้วย icon อย่างเดียว | **Icon action circle 44×44** | `.btn.btn-icon`; icon เดียว + accessible name |
| เลือกหนึ่งมุมมองจากหลายมุมมอง | **Segmented selector** | ใช้ LDS segmented primitive; เป็นกลุ่มเดียว สมาชิกไม่ใช่ CTA capsule |
| เปิด/ปิดรายละเอียด | **Disclosure** | ใช้ `details/summary` หรือ LDS disclosure; ไม่แต่งเป็น CTA |
| กรอกหรือเลือกค่า | **Form control** | ใช้ LDS field/select/checkbox; label ต้องมองเห็น |

### 4.1 Action button มีเพียงสองทรง

```html
<button class="btn" type="button">ดูที่มาและเกณฑ์</button>

<button class="btn btn-icon" type="button" aria-label="ดูที่มา">
  <span class="icon-symbol" aria-hidden="true">description</span>
</button>
```

ไม่มีปุ่ม action ทรงที่สาม ไม่มีการแก้ height, padding, radius, focus, disabled, busy หรือ press feedback ของ LDS เอง

### 4.2 Segmented selector ไม่ใช่ชุดปุ่ม action

- ใช้เมื่อแต่ละตัวเลือกเปลี่ยนสิ่งที่กำลังดู ไม่ได้ส่งหรือบันทึกข้อมูล
- กลุ่มมี label ชัด และเลือกได้ทีละหนึ่ง
- selected state ต้องมีทั้งสีและ `aria-selected`/`aria-pressed`
- แป้นลูกศร, Home และ End ต้องใช้งานได้
- หลังเปลี่ยนมุมมอง ต้องประกาศชื่อมุมมองใหม่ให้ screen reader

## 5. First value, Civic loop และการกลับมา

### 5.1 First value

ก่อนขอ login, follow, share หรือกรอกข้อมูล คนต้องเห็นอย่างน้อย:

1. กำลังดูพื้นที่หรือเรื่องไหน
2. เรารู้อะไรหนึ่งอย่าง
3. ยังไม่รู้อะไร
4. ถ้ามีคำถาม คำถามนั้นช่วยอะไร
5. ถ้ามี action กดแล้วเกิดอะไร

### 5.2 Civic loop

`SEE → UNDERSTAND → ANSWER/ACT → KNOW THE RESULT → RETURN FOR CHANGE`

- SEE — เห็นพื้นที่หรือเรื่องจริง
- UNDERSTAND — เห็นความหมายและที่มา
- ANSWER/ACT — ช่วยหนึ่งอย่าง
- KNOW THE RESULT — รู้ว่าส่งหรือบันทึกสำเร็จหรือไม่
- RETURN FOR CHANGE — กลับมาเพราะเรื่องเดิมมีข้อมูลหรือสถานะใหม่

อันดับ เหรียญ streak และยอดนิยมไม่ใช่หลักฐานว่าเรื่องเมืองสำคัญกว่า เรื่องสำคัญเพราะผลกระทบ ความเร่งด่วนตามหลักฐาน และหน้าที่ที่ต้องรับผิดชอบ

### 5.3 การกลับมา

- แสดง `ส่งแล้ว` เฉพาะเมื่อระบบเจ้าของงานยืนยัน persistence
- ต้องบอกว่าใครเห็นข้อมูล และมี receipt/context reference ที่ตรวจได้
- ถ้าส่งไม่สำเร็จ เก็บสิ่งที่คนพิมพ์ไว้และให้ลองใหม่
- แจ้งกลับเมื่อมี material change ของเรื่องเดิม ไม่ใช้ notification เพื่อเรียกยอด

## 6. CityScan ตอบสามคำถามใน viewport

CityScan ช่วยสำรวจพื้นที่ที่กำลังเห็นบนจอด้วย **สามคำถามหลักเท่านั้น**:

1. `daily_life` — **แถวนี้น่าอยู่ยังไง**
2. `visitor_identity` — **น่าเที่ยวตรงไหน**
3. `local_activity` — **น่าค้าขายอะไรดี**

คำถามเหล่านี้เป็นคำชวนสำรวจ ไม่ใช่คำตัดสิน และ **ห้ามรวมเป็นคะแนนเมืองค่าเดียว**

### 6.1 แถวนี้น่าอยู่ยังไง

| ป้ายจากบอร์ด | คำที่คนเห็น | CityCell ตัวอย่าง | ขอบเขต |
|---|---|---|---|
| ปลอดภัย | บริการจำเป็นใกล้ตัว | โรงพยาบาล, ตำรวจ, ดับเพลิง | บอกการเข้าถึงบริการ ไม่ได้พิสูจน์ว่าพื้นที่ปลอดภัย |
| สะดวก | ของใช้และบริการประจำวัน | โรงเรียน, ตลาด, C-Store, ร้านอาหาร | POI count ไม่เท่ากับคุณภาพ ความนิยม หรือคนใช้จริง |
| สบาย | พักผ่อนและธรรมชาติ | สวนสุขภาพ, แหล่งธรรมชาติ | ต้องบอก coverage และชนิดแหล่งข้อมูล |
| มีสีสัน | ร้านค้าและกิจกรรม | Shopping, Nightlife, Café | ไม่ใช้จำนวนสถานที่แทนความคึกคักจริง |

### 6.2 น่าเที่ยวตรงไหน

| กลุ่ม | CityCell ตัวอย่าง | ขอบเขต |
|---|---|---|
| กิน | ร้านเด่น, Michelin, Café | rating/review เป็นหลักฐานของ platform นั้น ไม่ใช่ชื่อเสียงสากลหรือยอดขาย |
| นอน | โรงแรม | จำนวนโรงแรมเป็น accommodation-supply proxy ไม่ใช่ visitor, occupancy หรือคุณภาพ |
| เที่ยว | ธรรมชาติ, วัฒนธรรม, Shopping | ต้องแยกประเภทและที่มา ไม่รวมเป็นคะแนนเดียว |

เกณฑ์ `rating`, `review count` และ `ADR` ใน working note เป็น **เกณฑ์ตัวอย่างที่ยังไม่อนุมัติ** ต้องมี metric definition, source, coverage, baseline และ owner approval ก่อนแสดงเป็นผลจริง Michelin mapping ยังไม่ชัด ห้ามเดาว่าเป็นดาวหรือ Bib Gourmand

### 6.3 น่าค้าขายอะไรดี

| กลุ่ม | CityCell ตัวอย่าง | ขอบเขต |
|---|---|---|
| คนอยู่แถวนี้ | Population, Household | แบบจำลองประชากรไม่เท่ากับทะเบียนราษฎร ครัวเรือน หรือลูกค้า |
| คนมาเยือน | **ยังไม่ได้กำหนด** | ต้องแสดง unresolved ไม่ใช่ 0 และห้ามเติมข้อมูลเอง |
| คนมาทำงานหรือเรียน | Company, Factory, Govt. Offices, Schools | การมีสถานที่เป็น daytime anchor ไม่ใช่จำนวน workers หรือ demand |

`Hotel` อยู่ใต้ Residents ใน working note แต่ขัดกับความหมาย จึงต้องคง `mappingStatus: unresolved` จนกว่า owner จะตัดสิน ห้ามย้ายเอง

คำตอบของ CityScan ไม่ใช่คำแนะนำลงทุน ไม่ใช่ใบอนุญาต และไม่ใช่การรับรองจากเทศบาล

## 7. CityCell คืออะไร

CityCell เป็นหน่วยนำเสนอเล็กใต้หนึ่งหัวข้อ CityScan ใช้เปิดดูความหมาย ที่มา และช่องว่างของข้อมูล

CityCell ต้องมี:

- `cityCellId` ที่คงที่
- `publicLabel` ภาษาคน
- `presentationKind`: observation | proxy | question | unavailable
- `valueState`: observed | observed_zero | unknown | out_of_coverage | stale | not_applicable | suppressed_privacy
- `claimLevel`: no_claim | observe | compare | flag | suggest_question
- `evidenceRef` เมื่อมี claim
- `publicMeaning` และ `forbiddenClaims`

`unknown`, `out_of_coverage`, `stale` และ `suppressed_privacy` ห้ามกลายเป็น 0

CityCell ไม่ใช่ H3 cell, metric, Evidence Capsule หรือ StoryCell ฝั่งข้อมูลต้องใช้ชื่อ `spatialCell` หรือ `h3Cell` เพื่อไม่ให้สับสน เมื่อเปิด CityCell เป็น StoryCell ให้กลับไปใช้กติกา **one signal + facts ไม่เกินสาม + one question + action ไม่เกินหนึ่ง**

## 8. สามหน้าต้องพูดถึงพื้นที่เดียวกัน

CityChat ที่ทีมกำลังประกอบมีสาม surface ซึ่งต้องส่งต่อ context เดียวกัน:

`CityScan → CityChat สำหรับประชาชน → Officer CityMETER`

### 8.1 CityScan — ดูพื้นที่

- เริ่มจาก viewport และสามคำถาม
- เปิด CityCell และที่มาได้
- เก็บ `caseId`, `contextRef`, snapshot, topic และ response version เมื่อผู้ใช้เลือกกรอบ
- ยังไม่กล่าวว่าเป็นเรื่องร้องเรียนหรือสถานะทางการ

### 8.2 CityChat สำหรับประชาชน — ฟังเสียงคน

- แปลง CityCell ที่เลือกเป็นเรื่องใกล้ตัว
- แสดงความหมายหนึ่งอย่าง ถามหนึ่งเรื่อง และให้ช่วยหนึ่งอย่าง
- บอกก่อนว่าใครจะเห็นและกดแล้วเกิดอะไร
- แสดง receipt เฉพาะเมื่อบันทึกจริง

### 8.3 Officer CityMETER — ใช้ทำงาน

- เปิดเรื่องเดียวกันด้วย `caseId/contextRef` เดิม
- แสดงที่มา coverage freshness ช่องว่าง ผู้รับผิดชอบ และงานต่อหนึ่งอย่าง
- ไม่ให้ leaderboard หรือยอดนิยมกำหนด civic priority
- ไม่แสดงว่า “รับเรื่องแล้ว”, “มอบหมายแล้ว” หรือ “ปิดงานแล้ว” หากระบบเจ้าของงานยังไม่ยืนยัน

### 8.4 ผลจากการ inspect ของจริง 28 Aug 2026

- `/` ส่งไป `/citymeter` และแสดง survey + feed เรื่องยอดนิยม
- `/cityscan` ยังแสดง public surface เดียวกัน แม้ title/route บอกว่า CityScan
- officer URL ส่งไป `/auth` แต่หน้า browser ที่ตรวจยังคงแสดง public surface และไม่มีฟอร์มให้กรอก

นี่เป็น runtime observation เพื่อช่วยจัดตัวอย่าง ไม่ใช่ normative authority รุ่นนี้จึงใช้ conceptual fixture และไม่กล่าวอ้างว่าสาม surface เชื่อมกันแล้ว

## 9. Case library ที่ต้องมีใน Playground

ทุก constructive case ต้องเปิดดูได้สามมุม: **ดูพื้นที่ / ฟังเสียงคน / ใช้ทำงาน**

### LIVE-01 — แถวนี้น่าอยู่ยังไง

- CityScan: แยกบริการจำเป็น ของใช้ประจำวัน พักผ่อน และกิจกรรม ไม่รวมคะแนน
- Citizen: ถาม `ทางไปจุดบริการช่วงฝนตกผ่านสะดวกไหม?`
- Officer: เห็นจุดบริการ ที่มา วันที่ สิ่งที่ยังขาด และงานตรวจต่อ
- Next: `ช่วยบอกทางที่ใช้จริง`

### VISIT-01 — น่าเที่ยวตรงไหน

- CityScan: แยกกิน นอน เที่ยว พร้อมที่มาและเกณฑ์
- Citizen: ถามเวลาและวิธีเดินทางจากประสบการณ์คนในพื้นที่
- Officer: เห็นความสนใจของพื้นที่พร้อม coverage/source ก่อนใช้วางบริการ
- Next: `ดูที่มาและเกณฑ์`

### TRADE-01 — น่าค้าขายอะไรดี

- CityScan: แยกคนอยู่ คนมาเยือน คนมาทำงานหรือเรียน
- Citizen: ถาม `แถวนี้ยังขาดของหรือบริการอะไร?`
- Officer: ตรวจแหล่งข้อมูลและข้อจำกัดก่อนส่งต่อทีมเศรษฐกิจ
- Boundary: คนมาเยือนยัง unresolved; ไม่ใช่คำแนะนำลงทุน

### REJECT-01 — คะแนนเดียวตัดสินทุกอย่าง

ตัวอย่างที่ไม่ผ่าน: `CityScore 87 — ดีทุกด้าน เปิดร้านได้เลย`

เหตุผล: รวมคำถาม คน แหล่งข้อมูล ช่วงเวลา และหน่วยที่เข้ากันไม่ได้ การแก้คือกลับไปเลือกหนึ่งในสามคำถาม แล้วเปิด CityCell และที่มาแยกกัน

## 10. ภาษา CityChat

หน้าที่ชาวบ้านหรือเจ้าหน้าที่เห็นต้องสั้น ง่าย และบอกประโยชน์ตรง ๆ

### ใช้

- `ดูว่าแถวนี้มีอะไร`
- `แถวนี้น่าอยู่ยังไง`
- `น่าเที่ยวตรงไหน`
- `น่าค้าขายอะไรดี`
- `ข้อมูลส่วนนี้ยังไม่พร้อม`
- `ช่วยบอกทางที่ใช้จริง`
- `ดูที่มาและเกณฑ์`
- `ใครจะเห็น`
- `อัปเดตเมื่อ`

### ไม่ใช้หน้าเวที

- truth envelope, claim ceiling, source_limited, runtime, fixture, schema
- AI analysis, agent, inspector
- capability, authorization decision, delivery availability
- build ID, hash, QA code

คำทีมอยู่หลัง disclosure ได้ แต่ไม่บังคับให้ผู้ใช้แปลภาษาระบบแทนเรา

## 11. สีและ Color Atlas

- ใช้ CityChat role map เป็นตัวกลาง ห้ามเลือก token จากชื่อสีด้วยตา
- identity/atmosphere/participation colour ห้ามใช้เป็น analytical scale
- action, success, warning, error, selected และ focus เป็นคนละงาน
- สีข้อมูลต้องมี label, shape/pattern หรือค่าตัวเลขกำกับเสมอ
- no-data กับ zero ต้องแยกทั้งสี/ลายและข้อความ
- analytical scale ต้องอ้าง exact LUT จากทะเบียนที่อนุมัติ ห้ามสร้าง ramp ใหม่ใน CityChat
- current CityChat UI และ current downloadable implementation resources ต้องไม่มีชื่อหรือ role ของผลิตภัณฑ์อื่น

## 12. Motion และ interaction

ใช้ motion เพื่อช่วยเห็นสิ่งที่เปลี่ยน ไม่ใช้เพื่อทำให้ระบบดูฉลาดหรือ live

- press feedback ใช้ LDS primitive
- reveal ลำดับอ่านทำได้ครั้งเดียวเมื่อเข้าจอ: เรื่อง → ที่มา → next step
- เปลี่ยน tab/selector ให้ focus และประกาศชื่อมุมมอง ไม่ animate ข้อมูลเป็นคะแนน
- SCAN → LOCK → STORY ต้องเปลี่ยนเฉพาะเมื่อมี state จริง; fixture ใช้เพื่อสอนหน้าตาเท่านั้น
- ห้าม sweep, pulse, endless loop, auto-carousel และ parallax บน CityScan hero
- `prefers-reduced-motion` ต้องเห็น final state ทันที

## 13. Contract สำหรับคนและ AI

ทุก scene ต้อง resolve ไปยังไฟล์ที่ pin ไว้:

```yaml
sceneId: required
user: citizen | officer | team
job: one short human job
caseId: required
contextRef: required
firstMeaning: one plain sentence
question: zero_or_one
primaryAction: zero_or_one
immediateConsequence: required_when_action_exists
cityScanTopic: daily_life | visitor_identity | local_activity | none
cityCellRefs: []
states: [loading, ready, empty, error, permission_denied]
buttonContractRef: citychat-button-contract-v0.8
colorRoleRefs: []
iconRoleRefs: []
motionBinding: inherited_lds_primitive_or_none
assetRefs: []
responsiveRules: []
accessibilityChecks: []
blockedReasons: []
```

AI หรือ code generator ห้ามอ่าน screenshot แล้วเดา token, glyph, role, metric, threshold, asset permission หรือสถานะระบบ ถ้า resolve ไม่ได้ให้หยุดพร้อม `blockedReason`

## 14. ไฟล์ขั้นต่ำของ release

- normative DS Add-on + approval record
- pinned LDS version/hash
- Build Card + control inventory
- button/control contract
- CityScan taxonomy + case library
- icon map + resolution + font manifest
- color role map + generated Color Atlas
- semantic motion map
- identity manifest + safe Asset Catalog + asset-only checksums
- responsive/accessibility matrix
- source QA + rendered QA + manual gates
- release manifest + full release checksums + live receipt

## 15. Acceptance ที่บล็อก release

- **CC-DA-IDENTITY-01:** โลโก้ exact bytes ไม่มี local white plate และ current CityChat scope ไม่มี product identity อื่น
- **CC-DA-CONTROL-01:** action เป็น labelled capsule หรือ icon-only circle; selector ใช้ segmented primitive และไม่ปลอมเป็น CTA
- **CC-DA-CITYSCAN-01:** มีสามคำถามหลักครบ ไม่มี overall CityScore
- **CC-DA-CITYCELL-01:** ทุก CityCell มี state/claim/evidence boundary; unknown ไม่กลายเป็น zero
- **CC-DA-HANDOFF-01:** constructive case ทุกเคสเปิดได้สามมุมและคง caseId/contextRef
- **CC-DA-FIRSTVALUE-01:** เห็นคุณค่าก่อน login/follow/share และมีคำถามไม่เกินหนึ่ง
- **CC-DA-RETURN-01:** saved/received/assigned/closed ต้องมีหลักฐานจากระบบเจ้าของงาน
- **CC-DA-LANG-01:** frontstage ใช้ภาษาคน ไม่มีศัพท์ระบบก่อน disclosure
- **CC-DA-COLOR-01:** visible swatch role-token pair ตรง machine map; current scope ไม่มี cross-product role
- **CC-DA-MOTION-01:** motion scoped, once-only, non-looping และ reduced-motion safe
- **CC-DA-ASSET-01:** ทุก public asset มี path, MIME, bytes, SHA-256, rights, allowed/blocked use และ asset-only checksum
- **CC-DA-RELEASE-01:** source, rendered และ live bytes ตรง release evidence เดียวกัน

Color Atlas machine map เก็บ acceptance ID เดิมเพื่อให้เครื่องมือรุ่นก่อนยังตรวจต่อได้ โดย map ไปยังกติกาข้างบนดังนี้:

- `CC-AC-IDENTITY-01`, `CC-AC-IDENTITY-02`, `CC-AC-IDENTITY-03`, `CC-AC-IDENTITY-04`, `CC-AC-IDENTITY-05` → `CC-DA-IDENTITY-01`
- `CC-AC-COLOR-01`, `CC-AC-COLOR-02`, `CC-AC-CONTRAST-01`, `CC-AC-MAP-01`, `CC-AC-ASSET-COLOR-01` → `CC-DA-COLOR-01` และ `CC-DA-ASSET-01` ตามบทบาท

## 16. ข้อสรุปสั้นที่สุด

**Landometer DS ให้ชิ้นส่วนและกติกากลาง ส่วน CityChat DS Add-on บอกวิธีประกอบให้คนเห็นพื้นที่ เข้าใจหนึ่งเรื่อง ช่วยได้หนึ่งอย่าง และส่งต่อเรื่องเดียวกันไปยัง CityScan, CityChat และ Officer CityMETER อย่างซื่อสัตย์**
