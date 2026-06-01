# Facebook Scraper Analytics Fields Plan

คุณต้องการเพิ่มฟังก์ชันเก็บข้อมูลจำนวนการกดไลก์/รีแอคชัน (`reactionCount`), คอมเมนต์ (`commentCount`), และการแชร์ (`shareCount`) จากโพสต์ในแต่ละเพจ/กลุ่ม Facebook และบันทึกลงในฐานข้อมูล

## User Review Required

> [!IMPORTANT]
> **การเปลี่ยนแปลง Schema ของฐานข้อมูล:** 
> จะมีการเพิ่ม Column ใหม่ 3 ตัวในตาราง `CommunityPost` ซึ่งหลังจากแก้ไขโค้ดเสร็จแล้ว จะต้องรันคำสั่ง `npx prisma db push` หรือ `npx prisma migrate dev` เพื่ออัปเดตโครงสร้างฐานข้อมูลให้ตรงกับ Prisma Schema ด้วย

## Proposed Changes

### Prisma Schema
#### [MODIFY] [schema.prisma](file:///c:/Users/Komkrit/Desktop/AI-Marketing/prisma/schema.prisma)
- เพิ่มฟิลด์ใหม่ 3 ตัวลงใน `model CommunityPost` เพื่อรองรับข้อมูลตัวเลข:
  - `reactionCount Int @default(0)`
  - `commentCount  Int @default(0)`
  - `shareCount    Int @default(0)`

### Facebook Scraper Service
#### [MODIFY] [facebook.service.ts](file:///c:/Users/Komkrit/Desktop/AI-Marketing/scraper/src/services/facebook.service.ts)
- **อัปเดต `ScrapedPost` Interface:** เพิ่ม type ของ `reactionCount`, `commentCount`, และ `shareCount` ให้เป็น `number` (หรือจะปล่อยเป็น optional `number?` ก็ได้)
- **อัปเดตฟังก์ชัน `extractContentFromPostUrl`:**
  - เขียน logic เพิ่มเติมภายในบล็อก `page.evaluate()` เพื่ออ่านข้อมูลจำนวนยอด Like, Comment, และ Share โดยจะพยายามเล็งหา element ที่แสดงผลตัวเลขหรือข้อความเช่น "ความรู้สึก X รายการ", "ความคิดเห็น Y รายการ", "แชร์ Z ครั้ง"
  - ทำการแปลง (Parse) ข้อความตัวเลขที่มีคำกำกับ (เช่น "1.2K", "3 หมื่น", "2.5 แสน") ให้อยู่ในรูปแบบ Integer ธรรมดา
- **ส่งค่า Return:** ส่งค่าสถิติดังกล่าวกลับไปตอนใส่ข้อมูลลงอาร์เรย์ `scrapedPosts` 

### Scraper Service & Repository
#### [MODIFY] [scraper.service.ts](file:///c:/Users/Komkrit/Desktop/AI-Marketing/scraper/src/services/scraper.service.ts)
- ตอนเรียกใช้ `postRepository.createPost(...)` ให้นำค่า `reactionCount`, `commentCount`, และ `shareCount` ที่ดึงมาได้ ส่งเข้าไปบันทึกด้วย
#### [MODIFY] [post.repository.ts](file:///c:/Users/Komkrit/Desktop/AI-Marketing/scraper/src/repositories/post.repository.ts)
- ตัว repository นี้ใช้ `Prisma.CommunityPostCreateInput` อยู่แล้ว หากอัปเดต Schema และ generate ใหม่ โค้ดจะไม่แดงและรองรับฟิลด์ใหม่ทันที 

## Verification Plan

### Automated Tests
- สั่งรัน `npx prisma generate` (ผ่าน `npm run prisma:generate`) เพื่อให้ระบบอัปเดต type definition
- ตรวจสอบโค้ดด้วย TypeScript ว่าไม่มี type error ในการส่งค่าลง Database

### Manual Verification
- รัน Script การ scrape แบบทดสอบ (เช่น สคริปต์เดี่ยวๆ สำหรับโพสต์ใดโพสต์หนึ่ง หรือ `npm run test-scrape` ถ้ามี) 
- ตรวจสอบผ่านฐานข้อมูล (MongoDB Client หรือ `npx prisma studio`) ว่าข้อมูล record ใหม่ๆ ใน `community_posts` มีการบันทึกค่าตัวเลขทั้งสามช่องนี้ลงไปได้อย่างถูกต้องหรือไม่
