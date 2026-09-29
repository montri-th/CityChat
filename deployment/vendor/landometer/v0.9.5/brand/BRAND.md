# Brand contract retained in DS0.9.5

The following protected lines and voice are exact inherited0.9.4 master §4.1–4.2, unchanged from0.9.1. Data-color changes do not replace brand identity.

## 4. Brand, voice และ protected language

### 4.1 Brand lines และบทบาท

Protected brand lines:

| Role | Canonical line |
|---|---|
| North Star | Visualize City, Shape Tomorrow. |
| Promise | Measure What Matters. Make It Actionable. |
| Cultural activation | Let us cultivate our city with data. |

Supporting systems are exact explanatory structures, not peer slogans:

| Role | Canonical system line | Use |
|---|---|---|
| Ecosystem | Land · Location · Living · Local Decisions. | explain shared portfolio scope |
| Product loop | See → Understand → Decide → Act → Learn. | explain behavioral sequence |

**BRAND-01 — Protected brand lines retain roles.** การใช้ protected line เป็น optional เว้นแต่ Build Card จะ select ไว้ เมื่อใช้ แต่ละ protected line MUST ปรากฏ verbatim พร้อม canonical punctuation และคง recorded role ของตน หนึ่ง scene ใช้ได้เพียงหนึ่ง protected line เป็น headline ห้าม stack เป็น peer slogans Supporting systems MAY appear only when explaining scope/behavior and MUST NOT become a headline slogan by default

Protected wording ใช้ canonical punctuation ตาม registry ในทุก locale เว้นแต่ registry มี owner-approved locale-specific record แยกต่างหาก การแปลหรือ adaptation ที่ปรากฏใน implementation—even เมื่อดูดี—MUST NOT ถูกใช้เป็น protected line, metadata title หรือ portfolio authority โดยอัตโนมัติ

ในกฎนี้ **scene** คือ composition ที่ผู้ใช้รับรู้เป็นหน่วยหนึ่ง มี primary proposition และ reading/action path ของตัวเอง ขอบเขตใช้ดังนี้:

- web/app: route, view, dialog หรือ top-level section ที่มี primary heading ของตัวเอง;
- deck: หนึ่ง slide;
- document/PDF: cover, chapter opener หรือ titled section ระหว่าง peer headings;
- social static: หนึ่ง creative.

Card, column, tab panel, animation state หรือ DOM wrapper ไม่กลายเป็น scene ใหม่เพียงเพื่อใช้ protected line เพิ่ม เว้นแต่ผู้ใช้เข้าถึงเป็นหน่วยอิสระที่มี primary heading และ path ของตัวเอง Navbar, footer, metadata, source note และ repeated running header ไม่สร้าง scene และ MUST NOT host protected line เพิ่มเป็น headline ภายใน scene เดิม การนับ scene ยึดสิ่งที่ผู้ใช้เห็น/อ่าน ไม่ยึดชื่อ component หรือโครงสร้างไฟล์

Acceptance:

- BRAND-01-A — automated: text ตรง canonical registry exact
- BRAND-01-B — manual: scene ไม่วาง protected lines หลายอันแข่งกัน

### 4.2 Voice

Landometer voice คือ calm, clear, evidence-aware, civic-minded และ action-capable ใช้ประโยคสั้นเมื่อสั่งงาน ใช้ plain language ก่อน terminology และบอก limit ใกล้ claim ที่มันจำกัด ห้าม urgency, certainty, official status หรือ scale ที่หลักฐานไม่รองรับ

CTA/copy สำหรับ Thai MUST ผ่าน native review; การตัดคำและ line break ต้องคำนึงถึง phrase ไม่ใช่ความยาวตัวอักษรเท่านั้น Metadata และ machine wording ห้ามมี claim มากกว่า visible wording


## Visual assets and scope

Use the exact logo and font files in `../build-kit/assets/`, and icons/motifs in the build kit. Read the full inherited master §4.3 for identity eligibility, contrast, minimum size and clear space. Do not redraw a logo or replace a missing product symbol with a portfolio mark. The seven atmosphere recipes in `../machine/tokens.v0.9.5.json` retain exact values and roles. Atmosphere is decorative; it must never encode data or state. Brand, foundation, semantic state, spacing, typography and motion contracts are inherited unless this0.9.5 guide names an explicit change.

The previously approved ijji identity uses ground.mist in light and #59C7E8 → #3BD3CB in dark. The obsolete warm `--ldm-product-ijji-*` aliases are not part of0.9.5 production delivery. Unresolved legacy ijji font/identity claims require the owning product evidence; this release does not invent replacements. WOFF2 files are web assets, not desktop-font installers.
