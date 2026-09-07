# CityChat motif set — handoff (1.0.0-proposal · 7 September 2026)

ชุดภาพประกอบของ CityChat 3 ชิ้น + ข้อเสนอบอลลูนโลโก้ + motion อ้างอิง สร้างจากรูปบอลลูนและรอยยิ้มของ ConversationMotif ตัวจริง ใช้ได้ทุกสื่อภายใต้ `AMENDMENT.md` (กติกาเพิ่มเติมที่ชนะ LDS/Add-on ในข้อที่ระบุ) และ `PROMPT.md` (ข้อความสั่งงานสำหรับ Claude/agent)

## ในกล่องนี้

| ไฟล์ | บทบาท | bytes | SHA-256 |
|---|---|---:|---|
| `assets/3a-voice-home-light.svg` | 3a เสียงบ้านเรา · light | 11143 | `c175caf8dd9fb0b0…` |
| `assets/3a-voice-home-dark.svg` | 3a เสียงบ้านเรา · dark | 11143 | `9717b6f70a9442e4…` |
| `assets/3b-live-visit-trade-light.svg` | 3b น่าอยู่·น่าเที่ยว·น่าค้าขาย · light | 10504 | `3727a85d22e666c2…` |
| `assets/3b-live-visit-trade-dark.svg` | 3b น่าอยู่·น่าเที่ยว·น่าค้าขาย · dark | 10504 | `6f3a43b046b8c4a2…` |
| `assets/3c-our-voice-here-light.svg` | 3c เสียงเราอยู่ตรงนี้ · light | 12662 | `4d13de02f25e82f0…` |
| `assets/3c-our-voice-here-dark.svg` | 3c เสียงเราอยู่ตรงนี้ · dark | 12662 | `350fadd34a5472eb…` |
| `assets/logo-bubbles-proposal-light.svg` | 3d บอลลูนโลโก้ (ข้อเสนอ) · light overlay | 9249 | `388f82731025fe82…` |
| `assets/logo-bubbles-proposal-dark.svg` | 3d บอลลูนโลโก้ (ข้อเสนอ) · dark overlay | 9249 | `2bb77c85b0885526…` |
| `assets/lockup-without-bubbles-light.png` | wordmark + หมุด ไม่มีบอลลูน · light (ไฟล์ทำงาน) | 17608 | `df00f1c02f2c2c45…` |
| `assets/lockup-without-bubbles-dark.png` | wordmark + หมุด ไม่มีบอลลูน · dark (ไฟล์ทำงาน) | 17483 | `37af6d9675ee4c1e…` |
| `assets/conversation-motif-original.svg` | ConversationMotif ต้นฉบับจากเจ้าของ (ไม่แก้) | 11610 | `fa67237428dc510c…` |
| `motion/citychat-motif-motion.css` | CSS motion: คลาส + keyframes | 6779 | `67c4f2638ef76b7e…` |
| `motion/citychat-motif-motion.js` | ES module: SVG แบบเคลื่อนไหว 5 ชิ้น + css | 43005 | `fc60ace74fa51fb4…` |

hash เต็มอยู่ใน `asset-register.json`

## ความหมายของแต่ละชิ้น (ใช้เลือกชิ้นตามงาน)

| ชิ้น | ความหมาย | ใช้ที่ | ลีลา motion |
|---|---|---|---|
| **3a เสียงบ้านเรา** | ชาวบ้านเล่าเรื่องบ้านตัวเองอย่างภูมิใจ คนใหม่ (ใบเหลือง) เข้ามาร่วมวง | welcome, โพสต์ชวนคุย, บอร์ดเทศบาล, ไลน์กลุ่ม, ปกอัลบั้มเรื่องเล่า | กระโดดมายืน ยืด–ย่อ พยักหน้า · คนใหม่แอบโผล่จากขวา |
| **3b น่าอยู่ · น่าเที่ยว · น่าค้าขาย** | สามคำถามของละแวกบ้านหนึ่งแห่ง (บ้าน · กล้อง · ร้าน) ปักบนพื้นเดียวกัน | hero CityScan, roll-up, สไลด์สามคำถาม, สื่อแนะนำละแวกบ้าน | หมุนรอบแกนดิ่งคนละความเร็ว (2 · 3 · 1 รอบ) ชะลอแล้วหยุดไม่พร้อมกัน ภาพในใบโผล่ตอนใกล้หยุด |
| **3c เสียงเราอยู่ตรงนี้** | เสียงของเราปักอยู่ที่จุดจริงบนแผนที่ ท่ามกลางเสียงเพื่อนบ้าน | empty state "ยังไม่มีใครเล่าเรื่องแถวนี้", หน้าปักเรื่อง, สไลด์ "เสียงมีที่อยู่ตรวจสอบได้" | เพื่อนบ้านโผล่ทีละใบ ใบใหญ่งอกจากแผนที่แล้วส่ายตัวเข้าที่ วงแหวนกระเพื่อมหนึ่งวง |
| **ConversationMotif** | เมืองกำลังคุยกัน | welcome, คำชวน, empty, success | สองใบโผล่แล้วเอนเข้าหากันสลับจังหวะ |
| **3d โลโก้ (ข้อเสนอ)** | บอลลูนบนโลโก้เป็นรูปเดียวกับชุด | header / footer / ปก — หลังอนุมัติและออกไฟล์ใหม่จากต้นฉบับ | บอลลูนโผล่ จุดสามจุดกระโดดทีละจุด ครั้งเดียว (ใช้เฉพาะฉากเปิดวิดีโอ/สไลด์) |

## วิธีใช้ต่อสื่อ

- **เว็บ** — ภาพนิ่ง: `<img src=".../3a-voice-home-light.svg" alt="">` · เคลื่อนไหว: วาง SVG จาก `motion/citychat-motif-motion.js` แบบ inline พร้อม `motion/citychat-motif-motion.css` เล่นครั้งเดียวเมื่อเข้าจอ (IntersectionObserver threshold .14) — `<img>` จะได้ภาพนิ่งเท่านั้น
- **โซเชียล / LINE** — ส่งออก PNG 1080 หรือ 2048 px จาก SVG พื้นตาม rendition · วิดีโอสั้น: บันทึกหน้าอ้างอิงที่ 2× หรือสร้างใหม่ใน After Effects ตามตารางเวลาใน `AMENDMENT.md` §M
- **สิ่งพิมพ์ (roll-up, โปสเตอร์, สติกเกอร์)** — SVG ตรง ๆ ภาพนิ่งเสมอ เล็กสุด 24 px, ให้เห็นรอยยิ้ม 88 px ขึ้นไป
- **สไลด์** — PNG 2048 px; ถ้าเป็นสไลด์เปิดบนจอ ใช้วิดีโอจาก motion ได้
- **ในแอป** — SVG นิ่ง หรือ inline SVG + CSS สำหรับ welcome/empty/success
- **เลือก rendition ตามความสว่างของพื้นที่วางจริง**: พื้นสว่าง (#F6F7F3, ขาว, beige #F2F1DF, gradient CityChat ธีมมืด) → light · พื้นเข้ม (#11191D, #172126, gradient CityChat ธีมสว่าง #007A58→#007E79) → dark

## ยังเปิดอยู่
1. เจ้าของลงนาม `AMENDMENT.md` แล้วคัดลอกข้อ CC-MOTIF-01 … CC-EX-02 เข้า `brand/CityChat-DS-Addon-v0.9.1-normative.md`
2. โลโก้ 3d: ประกอบใหม่จากต้นฉบับใน Figma → PNG/SVG สองธีม → hash → แทน `citychat-lockup*.png`
3. ขึ้นทะเบียน 3a/3b/3c ใน asset registry ด้วย hash ใน `asset-register.json`
