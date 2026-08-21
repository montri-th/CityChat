<!-- Generated package copy — VERBATIM extraction of Appendix D from the authoring master
     (v0.9.0-r7); the master remains the authority. -->

# Appendix D — Reference-only Thai voice recipe and approved structural fixtures

**Reference ID:** `thai-voice-fixtures-v0.8.7-v1`
**v0.8.9 disposition:** retained unchanged; v0.8.9 changes composition rather than voice
**Status:** owner-approved structural fixture set; exact Thai/English siblings and review records live in `thai-voice-fixtures-v0.8.7.json`
**Load behavior:** reference and QA only; never part of default Core, Profile, or visible UI

These fixtures test structure and naturalness. Placeholders MUST resolve from the Build Card and canonical evidence record before use. Approval makes the structures usable as QA fixtures; it does not turn them into CityMETER claims, campaign copy, product availability, or evidence. The generated fixture file carries independently structured English siblings and the owner approval/parity record.

## D1. Thai lint and deletion tests

Flag for human review when these words appear without a named object and observable consequence:

```text
ขับเคลื่อน
ยกระดับ
ปลดล็อก
พลิกโฉม
ศักยภาพ
โซลูชัน
อินไซต์
ผลกระทบ
มีความหมาย
มีประสิทธิภาพ
อย่างชาญฉลาด
ไร้รอยต่อ
ตอบโจทย์
ครบวงจร
```

These words are not absolutely banned. The writer must show why each is more exact than an ordinary alternative.

Flag:

- English-shaped Thai;
- abstract-noun piles;
- bureaucratic passive voice without a responsible actor;
- repeated `ช่วยให้ / ทำให้ / เพื่อให้` chains;
- CTA labels that do not say what happens next;
- machine-translated symmetry between Thai and English;
- repeated caveats that make verified work sound untrustworthy;
- inspirational claims that could belong to any AI, SaaS, consultancy, or civic-tech company.

Deletion tests:

1. **Adjective deletion:** remove adjectives. If nothing specific remains, rewrite.
2. **Brand deletion:** remove the logo and company name. If the copy still fits any AI/SaaS company, rewrite.
3. **Value deletion:** ask who did what, what changed, what supports it, and who can act. If simplification removed those answers, restore them.

Fixture review asks:

- Would a Thai colleague say this to explain real work?
- Is there a visible person, object, place, decision, or consequence?
- Does the sentence give verified work its proper weight?
- Is the limitation specific and proportionate?
- Does the CTA describe what happens next?
- Could the line be pasted into any AI/SaaS website unchanged?

## D2. Approved native-Thai structures

| Context | Reject | Approved structure |
|---|---|---|
| Adoption CTA | `ลองกับงานของฉัน` | `เลือกงานที่จะลอง` — only when the action opens a real work-object selection |
| Adoption support | `ดูว่าอะไรเปลี่ยน และทีมถัดไปทำงานต่อง่ายขึ้นอย่างไร` | `เลือก [แผนที่/รายงาน/ข้อมูลพื้นที่ตาม Build Card] ที่กำลังทำ แล้วตรวจว่าคนที่รับงานต่อเห็นสิ่งที่พบ แหล่งข้อมูล ข้อจำกัด และขั้นตอนถัดไปครบหรือยัง` |
| Handoff receipt | `ส่งต่องานสำเร็จ` | `ส่ง [ชื่อชิ้นงาน] ฉบับที่ [เลข] พร้อมแหล่งข้อมูลและข้อจำกัดแล้ว` |
| Shared data explanation | `เปลี่ยนข้อมูลให้เป็นผลลัพธ์ที่มีความหมาย` | `จาก [ชุดข้อมูล/แหล่งข้อมูล/วันที่] พบว่า [สิ่งที่พบ] ภายใน [พื้นที่/ช่วงเวลา] ใช้ประกอบ [การตัดสินใจ] ได้เมื่อ [เงื่อนไข] และยังไม่ครอบคลุม [ข้อจำกัด]` |
| Shared work-artifact explanation | `สร้างความหมายร่วมให้ทุกการส่งต่อ` | `[ชื่อชิ้นงาน] สรุป [ข้อค้นพบ] จาก [แหล่งข้อมูล] และระบุสิ่งที่ [ผู้รับช่วงต่อ] ตรวจหรือทำต่อได้` |
| Decision framing | `ข้อมูลเมืองที่ขับเคลื่อนการตัดสินใจอย่างชาญฉลาด` | `เริ่มจากคำถามว่า ใครกำลังตัดสินใจเรื่องอะไร และยังต้องมีข้อมูลหรือหลักฐานอะไรเพิ่ม` |
| CityMETER map start | `สำรวจอินไซต์` | `เลือกพื้นที่บนแผนที่` — only when the control opens a real map selection |
| CityMETER result | `พื้นที่นี้มีความเสี่ยงสูง` | `ใน [ชื่อชุดข้อมูล] พบ [สิ่งที่พบ] ภายใน [พื้นที่] ช่วง [เวลา] จึงควรตรวจ [สิ่งต่อไป] ก่อนตัดสินใจเรื่อง [เรื่อง]` |
| Comparison | `พื้นที่ ก มีประสิทธิภาพดีกว่า` | `[ตัวชี้วัด/หน่วย] ของ [พื้นที่ ก] สูงกว่า [พื้นที่ ข] ในช่วง [เวลา] แต่ข้อมูลนี้ยังไม่บอกสาเหตุ ต้องตรวจ [ข้อมูลเพิ่ม] ก่อนสรุป` |
| Limitation | `ข้อมูลอาจไม่สมบูรณ์ โปรดใช้วิจารณญาณ` | `ข้อมูลชุดนี้อัปเดตถึง [วันที่] และยังไม่รวม [ขอบเขต] ใช้ดู [ประเด็น] ได้ แต่ยังใช้ยืนยัน [ข้อสรุป] ไม่ได้` |
| Provisional state | `ผลลัพธ์นี้เป็นเพียงค่าประมาณ` | `จาก [หลักฐาน] ผลเบื้องต้นชี้ว่า [ข้อ] แต่ [เรื่องที่ยังสรุปไม่ได้] ต้องตรวจเพิ่ม เพราะ [เหตุผล]` |
| Source note | `ตรวจสอบ Source Ledger ก่อนสรุปผล` | `ดูแหล่งข้อมูล วันที่อัปเดต วิธีคำนวณ และข้อจำกัดก่อนนำผลนี้ไปใช้` |
| Empty state | `ไม่พบอินไซต์ที่เกี่ยวข้อง` | `ยังไม่มีข้อมูลที่ตอบคำถามนี้ ลองขยายช่วงเวลา หรือเลือกชั้นข้อมูลอื่น` |
| Error and recovery | `เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง` | `เปิด [ชื่อชุดข้อมูล] ไม่ได้ในตอนนี้ พื้นที่ที่เลือกไว้ยังอยู่ ลองอีกครั้งหรือเลือกดู [ทางเลือก]` |
| Boundary warning | `ขอบเขตอาจมีความคลาดเคลื่อน` | `เส้นเขตนี้มาจาก [แหล่งข้อมูล/วันที่] และอาจไม่ตรงกับขอบเขตที่ใช้หน้างาน` |
| Recommendation | `AI แนะนำให้ดำเนินการทันที` | `จากข้อมูลที่มี ควรตรวจ [จุด/เรื่อง] ต่อก่อน ข้อมูลนี้ยังยืนยัน [ผล] ไม่ได้` |
| Executive answer | `ข้อมูลแสดงอินไซต์ที่มีนัยสำคัญ` | `จาก [หลักฐานที่ยืนยันแล้ว] ตอนนี้สรุปได้ว่า [สิ่งที่พบ] ภายใน [ขอบเขต] ส่วน [เรื่อง] ยังต้องมี [ข้อมูลเพิ่ม] ก่อนตัดสินใจเรื่อง [เรื่อง]` |
| Correction | `ข้อมูลได้รับการอัปเดตแล้ว` | `แก้ไขเมื่อ [วันที่]: เปลี่ยน [ข้อความ/ค่า] เพราะตรวจพบว่า [สิ่งที่ผิด] เวอร์ชันก่อนยังเปิดดูย้อนหลังได้` |
| Recruitment | `ร่วมสร้างผลกระทบที่มีความหมายกับเรา` | `คุณจะได้ทำงานกับโจทย์เมืองจริง ตั้งแต่ตั้งคำถาม ตรวจข้อมูล ไปจนถึงทำชิ้นงานที่ทีมใช้ต่อได้` |

An approved fixture may use `ยืนยันได้` only when the governed truth state is explicitly verified. It MUST NOT convert provisional, modelled, proxy, or recommendation status into verified fact.
