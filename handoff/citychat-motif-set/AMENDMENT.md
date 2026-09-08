# CityChat DS Add-on — amendment: motif set (proposal for owner sign-off)

**สถานะ:** candidate · เสนอ 7 September 2026 · แก้ครั้งที่ 1: 8 September 2026 (สีบอลลูนเล็กบนโลโก้) · มีผลเมื่อเจ้าของลงนามท้ายไฟล์ แล้วคัดลอกข้อ CC-MOTIF-01 … CC-EX-02 เข้า `brand/CityChat-DS-Addon-v0.9.1-normative.md`
**ฐาน:** LDS v0.9.1 (0.9.1-r8 · lds-rules-0.9.1 · v0.9.1-mp7 · color-srgb-05) + CityChat DS Add-on v0.9.1
**ลำดับอำนาจ:** ข้อในไฟล์นี้ **ชนะ** LDS และ Add-on เฉพาะเรื่องที่ระบุชัดข้างล่าง (รูป สี motion ของ motif และบอลลูนโลโก้) เรื่องอื่นทั้งหมด LDS/Add-on ยังคุมตามเดิม
**hash ของ asset:** `asset-register.json` ในแพ็กเกจเดียวกัน — ห้ามพิมพ์ hash จากความจำ

> ทุกบรรทัดเป็น governance — ห้าม render ขึ้นหน้าผู้ใช้ (OUTPUT-CLARITY-01)

## CC-MOTIF-01 · ชุด motif CityChat (role: conversation_motif family)

- asset ที่อนุมัติ: `3a-voice-home`, `3b-live-visit-trade`, `3c-our-voice-here` อย่างละ 2 rendition (light/dark) + `ConversationMotif` ต้นฉบับ — exact bytes ตาม `asset-register.json`
- ความหมายที่ผูกกับชิ้น (ห้ามสลับ): 3a = ชวนเล่าอย่างภูมิใจ ต้อนรับคนใหม่ · 3b = สามคำถามของละแวกบ้าน (น่าอยู่ · น่าเที่ยว · น่าค้าขาย) · 3c = เสียงเราปักอยู่ที่จุดจริง ท่ามกลางเพื่อนบ้าน
- **allowed surfaces: ทุกสื่อ** — เว็บ, แอป, โซเชียล, LINE, สิ่งพิมพ์, roll-up, สไลด์, วิดีโอ, สื่อในชุมชน (แก้ข้อจำกัด "welcome/empty/success เท่านั้น" ของ Add-on §4.2 ให้ครอบทั้ง family นี้)
- หนึ่งฉากใช้ motif เดียว · ไม่เป็น bullet, ไอคอนปุ่ม, ป้ายสถานะ, ลวดลายปูพื้น · ไม่ฝังตัวอักษร · ไม่แทนหลักฐานหรือสถานะ
- ขนาด: ภาพนิ่ง ≥ 24 px · เห็นรอยยิ้มชัด ≥ 88 px · เคลื่อนไหว ≥ 120 px · พื้นที่ว่างรอบ ≥ 10 % ของความกว้าง · ขยาย–ย่อตามสัดส่วนเท่านั้น ไม่ครอป ไม่ยืด ไม่หมุน ไม่กลับด้านเพิ่ม
- เลือก rendition ตามความสว่างของพื้นที่วางจริง ไม่ใช่ตามชื่อธีม · ไม่วางบนภาพถ่ายหรือ gradient อื่นของ Landometer · ไม่เติมเงา แผ่นรอง glow
- ทุก asset มี `alt=""` เมื่อเป็นภาพประกอบ; ข้อความสำคัญเป็น live text นอกภาพ

## CC-COLOR-02 · คู่สีบอลลูน (overrule ขอบเขต energy.mint สำหรับ motif CityChat)

- บอลลูนสองใบในภาพเดียวต้องต่างกันด้วย **ความเข้ม–อ่อน** ห้ามใช้ `#007A58` คู่กับ `#007E79` ในภาพเดียวกัน
- คู่สีที่อนุมัติ — light: ใบหลัก `#007A58` (ink `#FFFFFF`) + ใบรอง `#0AD69C` (ink `#182327`) · dark: ใบหลัก `#3BD19B` (ink `#182327`) + ใบรอง `#007E79` (ink `#FFFFFF`)
- คนใหม่ / จุดต้อนรับ: `#FFBC1F` (ink `#182327`) — energy accent ที่สองและสุดท้ายในภาพ
- `#0AD69C` (energy.mint) ใช้เป็น **สีเติมภาพประกอบของ CityChat motif เท่านั้น** ผ่านชื่อใหม่ `--cc-motif-second` (Add-on เพิ่มชื่อใหม่ ไม่ redefine token) — ไม่กลายเป็น UI, state, data หรือ product color
- เส้นพื้น/กริด/กระดาษ: light `#C9D0CB` / `#DCE1DD` / `#FCFCFA` · dark `#46524F` / `#33403D` / `#20292D`
- ห้ามสีอื่นทุกกรณี (ไม่มี coral, น้ำเงิน, gradient ในบอลลูน, เวอร์ชันสีเดียว, outline ทั้งภาพ)
- ข้อยกเว้นของคู่สี: บอลลูนเล็กบนโลโก้ใช้ `brand.blue` / `brand.beige` ตาม CC-LOGO-02 ไม่ใช่ใบรองสีเขียว

## CC-LOGO-02 · บอลลูนบนโลโก้ CityChat (แก้ Add-on §C "CityChat lockup")

- บอลลูนเหลี่ยมสองใบบน lockup ถูกแทนด้วยรูปบอลลูนของ ConversationMotif: ใบใหญ่บน i (ปลายหางที่ x 158 y 41 ของ viewBox 494 × 106, scale .33) · ใบเล็กกลับด้านหลัง t (ปลายหาง x 470 y 36, scale .38) · ใบใหญ่ใช้สีใบหลักตาม CC-COLOR-02 · **ใบเล็กไม่ใช้เขียวคู่ที่สอง** แต่ใช้สี brand ตาม rendition: light `#1D4497` (จุด `#FFFFFF`) · dark `#F2F1DF` (จุด `#182327`) — อ่านได้บน hero gradient CityChat ทั้งสองธีม: #1D4497 บน #3BD19B→#3BD3CB 4.6–4.9:1 · #F2F1DF บน #007A58→#007E79 4.3–4.7:1 · จุดสามจุดคงไว้
- wordmark และหมุด Landometer **ไม่แตะ**
- จนกว่าจะออกไฟล์ใหม่จากต้นฉบับใน Figma และขึ้นทะเบียน hash ทั้งสองธีม `citychat-lockup.png` / `citychat-lockup-dark.png` เดิมยังเป็น asset ที่ใช้จริง; `logo-bubbles-proposal-*.svg` + `lockup-without-bubbles-*.png` เป็นไฟล์ทำงานเท่านั้น ห้ามขึ้น production

## CC-MOTION-02 · motion ของ motif (ลีลาตามความหมาย · ไวยากรณ์เดียว)

- ไวยากรณ์ร่วม: มาถึง → หน้า/ภาพในใบโผล่ (+480 ms) → กะพริบตาหนึ่งที (+870 ms) → นิ่ง · เล่น **ครั้งเดียว** เมื่อเข้าจอ (threshold .14) · ไม่วน ไม่ pulse ไม่ hover · ยาวสุด 1.8 s (3b 2.4 s)
- เส้นโค้ง LDS: state (.2,0,0,1) · enter (.16,1,.3,1) · settle (.2,.9,.25,1.08) · stagger 0/150/300/450 ms
- ลีลาผูกกับความหมาย (ห้ามสลับ): ConversationMotif = คุยกัน (โผล่แล้วเอน ±6° สลับ) · 3a = กระโดดมายืน ยืด–ย่อ พยักหน้า + คนใหม่แอบโผล่จากขวา · 3b = หมุนรอบแกนดิ่ง 2/3/1 รอบ ที่ 1.5/2.2/1.7 s ชะลอจนหยุดไม่พร้อมกัน (จำลอง rotateY ด้วย scaleX) ภาพในใบโผล่ตอนใกล้หยุด · 3c = เพื่อนบ้านโผล่ 150→450 ms ใบหลักงอกจากแผนที่ (sprout 920 ms) แล้วส่ายตัว วงแหวนกระเพื่อมหนึ่งวง
- fail-open: ไฟล์ต้นทางคือภาพนิ่ง · prefers-reduced-motion, ไม่มี JS, พิมพ์, PDF, สไลด์ที่ส่งเป็นไฟล์ = ภาพนิ่ง · ข้อความหลักและปุ่มหลักไม่รอ animation
- implementation อ้างอิง: `motion/citychat-motif-motion.css` + `.js` (inline SVG); วิดีโอสร้างใหม่ตามตารางนี้ได้

## CC-EX-02 · ข้อยกเว้น: โลโก้เคลื่อนไหว (ขัด LDS "logo never animates" และ Add-on §12)

- อนุญาตเฉพาะ **บอลลูนสองใบ** บน lockup ที่แก้ตาม CC-LOGO-02: โผล่ 0/150 ms (420 ms) + จุดสามจุดกระโดด 380→620 / 530→770 ms · ครั้งเดียว · wordmark และหมุดนิ่งเสมอ
- ใช้ได้เฉพาะ ฉากเปิดวิดีโอ, สไลด์เปิดบนจอ, splash ของแอป (ครั้งเดียวต่อ session) · **ห้าม** บนแถบนำทาง, เอกสาร, PDF, สื่อพิมพ์
- บันทึกใน Build Card: `exceptionIds:["CC-EX-01","CC-EX-02"]` · ถ้าเจ้าของไม่ลงนามข้อนี้ โลโก้ทุกสื่อยังนิ่งตาม LDS

## Acceptance (บล็อก release)

| Rule | ตรวจอัตโนมัติ | ตรวจด้วยตา |
|---|---|---|
| CC-MOTIF-01 | ไฟล์ตรง hash ใน asset-register.json · ไม่มี `<text>` ในภาพ · ≤ 1 motif ต่อฉาก | ความหมายตรงชิ้น · rendition ตรงพื้น · ไม่ครอป/ยืด |
| CC-COLOR-02 | ไม่มี #007A58 ร่วม #007E79 ในภาพเดียว · สีทั้งหมด ∈ ชุดที่ระบุ | ยิ้มอ่านออกทั้งสองธีม |
| CC-LOGO-02 | production ยังใช้ lockup เดิมจนมี hash ใหม่ | wordmark/หมุดไม่เปลี่ยน |
| CC-MOTION-02 | ไม่มี `infinite` · reduced-motion ไม่มี animation · ยาวสุดตามข้อ | ลีลาตรงความหมาย เล่นครั้งเดียว |
| CC-EX-02 | ปรากฏเฉพาะ surface ที่อนุญาต · exceptionIds บันทึกแล้ว | wordmark นิ่ง |

## ลงนาม

- ผู้เสนอ: ทีมออกแบบ CityChat · 7 September 2026
- เจ้าของอนุมัติ: ______________________ วันที่ ____________ (ข้อที่อนุมัติ: CC-MOTIF-01 ☐ CC-COLOR-02 ☐ CC-LOGO-02 ☐ CC-MOTION-02 ☐ CC-EX-02 ☐)
