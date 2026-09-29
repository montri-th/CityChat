# CityChat DS Add-on v0.9.2 — LDS 0.9.5 migration

**สถานะ:** owner-directed migration record สำหรับงาน CityChat ใหม่ตั้งแต่ 30 กันยายน 2026 ตามคำสั่งให้ย้าย repository, website และ Project source ไป LDS 0.9.5. [CityChat DS Add-on v0.9.2 — current Project Source](citychat-ds-addon-v0.9.2-project-source.md) เป็นเอกสาร normative ที่รวมกติกา CityChat ปัจจุบันไว้ครบในไฟล์เดียว. เอกสารนี้ไม่เปลี่ยนประวัติหรือสถานะการอนุมัติของ Add-on v0.9 และ v0.9.1 และไม่ใช่หลักฐานว่า ChatGPT, Claude หรือสมาชิกทีมทุกคนติดตั้งแล้ว

**ฐานปัจจุบัน:** Landometer Design System **0.9.5**, release `v0.9.5-owner.1`, Color Set `color-srgb-08`. ใช้ package และคู่มือที่ [`vendor/landometer/v0.9.5/`](../../vendor/landometer/v0.9.5/) ใน repository หรือ [หน้า LDS 0.9.5](https://montri-th.github.io/Landometer/v0.9.5/). `machine/release.json` มี SHA-256 `9a2725d21927a19b0d78d04455ad95ad0e7571ce2d45d74da21a17786cc9e829`; package `SHA256SUMS.txt` มี SHA-256 `2f6da2d1e283bdf191a7714704a9818dad262449753abaff4403f47e230ca985`. LDS 0.9.5 เป็น **owner-approved unsigned distribution**; ลายเซ็นของฐาน 0.9.4 ไม่ได้ลงนามให้ค่าสี 0.9.5

## ลำดับที่ใช้ตัดสิน

1. คำสั่งเจ้าของที่ลงวันที่และขอบเขตงานปัจจุบัน
2. LDS 0.9.5 `GUIDE.md`, `brand/BRAND.md`, `machine/policy.json`, machine tokens, สี, scale และ asset ที่ตรวจความถูกต้องแล้ว สำหรับเรื่องที่ LDS เป็นเจ้าของ
3. [CityChat Add-on v0.9.2 current Project Source](citychat-ds-addon-v0.9.2-project-source.md) สำหรับตัวตน ภาษา ลำดับการเล่าเรื่องและข้อกำหนด CityChat บนฐานใหม่
4. เอกสาร migration record นี้สำหรับที่มาและ audit; [CityChat Add-on v0.9](citychat-ds-addon-v0.9.md) และ [v0.9.1 normative dev edition](citychat-ds-addon-v0.9.1-normative.md) สำหรับประวัติเท่านั้น
5. Implementation และตัวอย่างใน repository สำหรับพฤติกรรมที่ทดสอบได้จริงเท่านั้น

ไฟล์ v0.9 มี SHA-256 `0ff5bddb77774bbcdb36ed2cbc056c25025a20cd31be98904caf70fe77caf4db`; v0.9.1 มี SHA-256 `6956ee39bb0e83036efd9ef730bd0200e97e1facf3f39ca2195a5da7de65d3e3`. ทั้งคู่เก็บเป็น **historical exact bytes**. ข้อความในสองไฟล์ที่ pin LDS 0.9.1, `v0.9.1-mp7`, `color-srgb-05`, path ของ Build Kit เก่า และข้อยกเว้น motion เก่า ถูกแทนด้วยฐานและข้อจำกัดในเอกสารนี้สำหรับงานใหม่เท่านั้น

## สิ่งที่คงเป็น CityChat

- CityChat ใช้โลโก้, motif, ภาพ, ภาษาและลำดับ experience ของตนตาม approval ของแต่ละไฟล์. ห้ามใช้โลโก้ Landometer หรือ motif ผลิตภัณฑ์อื่นแทน และห้าม recolor, crop, mask หรือประกอบ logo ใหม่จาก screenshot
- เริ่มจากพื้นที่และความหมายแรกโดยเร็ว. แยกสิ่งที่รู้, ไม่รู้, และสิ่งที่ถาม/ทำต่อได้. หนึ่ง StoryCell มีหนึ่ง main signal, ข้อเท็จจริงตรวจย้อนกลับได้ไม่เกินสาม, คำถามที่มีประโยชน์ไม่เกินหนึ่ง, และ action ที่อนุญาตไม่เกินหนึ่ง
- CityScan มีคำถามหลักสามชุด: **แถวนี้น่าอยู่ยังไง**, **น่าเที่ยวตรงไหน**, **น่าค้าขายอะไรดี**. ห้ามรวมเป็น CityScore เดียว. Fixture และ screenshot ไม่ใช่ข้อมูลสดหรือสถานะทางการ
- Officer CityMETER ต้องรับ context, source, snapshot, limitation และ object/version เดียวกันไปตามสิทธิ์ของระบบเจ้าของงาน. Receipt แสดงได้หลัง authoritative persistence เท่านั้น
- ภาษาไทยและอังกฤษต้องสั้น ชัด อบอุ่น และแยก claim ออกจากภาพบรรยากาศ. คง brand voice ที่ดีของ LDS 0.9.1 ผ่าน 0.9.5: calm, clear, evidence-aware, civic-minded, action-capable

## สิ่งที่เปลี่ยนเมื่อใช้ LDS 0.9.5

- สีฐาน, semantic state, categorical และ analytical scale ใช้ `color-srgb-08` จาก `machine/color-srgb-08.tokens.json`, `.scales.json` และ `.production.css`. ห้ามหยิบ `color-srgb-05` หรือสร้าง palette/gradient ตัวเลขใหม่. ชุดสีหมวดบนพื้นมืดเป็นค่าปัจจุบันของ 0.9.5; สีหมวดบนพื้นสว่างคงเดิม
- Density ต้องเลือก family จากตัวหารจริง: พื้นที่ = ส้ม, ต่อประชากร = กุหลาบ, ต่อครัวเรือน = แดง, ต่อพื้นที่อาคาร = เหลืองทอง. Legend ต้องบอกตัวหาร หน่วย แหล่งข้อมูล และขอบเขต. ใช้ LUT และ class set ที่ให้มา; สีไม่พิสูจน์ความถูกต้องหรือสิทธิ์ของข้อมูล
- Product identity gradient CityChat คงค่าที่อนุมัติ: light `#007A58 → #007E79`, dark `#3BD19B → #3BD3CB`. ใช้ข้อความของ surface contract บนพื้น gradient จริง ไม่อาศัย theme text color ทั่วไป. Gradient บรรยากาศของ LDS ทั้งเจ็ดสูตรคงเดิมและไม่ใช้แทนค่า metric หรือสถานะ
- ฟอนต์และไฟล์ asset ต้องเป็น exact bytes จาก package 0.9.5 หรือไฟล์ CityChat ที่มี hash/role approval อยู่แล้ว. หน้าเว็บ import `vendor/landometer/v0.9.5/build-kit/lds-0.9.5.css` พร้อมไฟล์ relative ทั้งชุด. ตัวเลข density, zero, no-data, suppressed, out-of-scope และ not-yet ต้องคงความหมายและ cue ที่ต่างกัน
- Navigation, selected item, tab, card และ callout **ห้ามใช้ bracket highlight หรือเส้นสีด้านซ้ายเพื่อบอกสถานะ**. ใช้พื้นหลัง น้ำหนักตัวอักษรและระยะอย่างสงบ; keyboard focus ต้องยังมองเห็น. เส้นขอบตารางและกราฟที่ช่วยอ่านข้อมูลยังต้องอยู่
- `CC-EX-01` ซึ่งยอมให้ CTA sweep/flicker แบบวนซ้ำในเอกสาร dev เดิม **เลิกใช้ในงานใหม่**. ถ้าใช้ cue บน CTA ให้ใช้ LDS `motion.cta.discovery-cue.01` ครั้งเดียวต่อ page load, 540ms, และให้ลด motion ลงสู่ final state. `CC-EX-02` ของ CityChat logo bubbles ยังคงมีเฉพาะ asset, build และ role ที่บันทึก approval ไว้; ไม่ขยายเป็นข้อยกเว้นทั่วไป
- Approach motion ของ LDS 0.9.5 มี owner rule ใหม่สำหรับการกลับเข้าจอ. Implementation ที่ยังเป็น once-only ต้องปรับให้ตรงกับ machine contract หรือเลือก `none` ที่ยังอ่านได้เสมอ; อย่าบอกว่า animation เดิม conform โดยอาศัย token สีอย่างเดียว

## ใช้ใน ChatGPT / Claude / Codex

Project source ต้องมี **CityChat Add-on v0.9.2 current Project Source** และ normative LDS 0.9.5 หรือ link/release package ที่เครื่องมืออ่านได้จริง. Add-on v0.9 และ v0.9.1 หากคงอยู่ให้ระบุว่าเป็น historical. Project instructions ระบุว่า “สำหรับงาน CityChat ใหม่ ให้ใช้ Add-on v0.9.2 บน LDS 0.9.5; ไฟล์ v0.9/v0.9.1 เป็นประวัติเท่านั้น; ห้ามเลือก pin LDS 0.9.1 จากไฟล์เก่า”. การอัปโหลด Project source ไม่ได้เปิดใช้ plugin หรือ skill ใน Chat/Cowork/Design/Code โดยอัตโนมัติ; ต้องตรวจการเปิดใช้แต่ละ client และให้ session ใหม่รายงาน release ที่อ่านได้จริง

## เกณฑ์ส่งมอบ

ตรวจ package integrity, CSS ที่หน้าเว็บโหลดจริง, theme light/dark, ภาษาไทย/อังกฤษ, กว้าง 320–1440px, Thai wrapping, keyboard/focus, reduced motion, no JavaScript, menu, CTA และ footer download. ตรวจ asset rights และ claim/source ตามบทบาท. Automated pass หรือ hash ตรงไม่ได้เท่ากับ artifact conformance เต็มรูปแบบ. บันทึก build, ไฟล์ที่ตรวจ, ผลที่เห็นจริง และข้อที่ยังเปิดอยู่ก่อนประกาศว่าใช้งานครบทุกช่องทาง
