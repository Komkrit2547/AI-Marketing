# AI Contextual Marketing Dashboard

แพลตฟอร์มการตลาดเชิงบริบท (Contextual Marketing) ที่ขับเคลื่อนด้วย AI โดยใช้ข่าวท้องถิ่น ข้อมูลสภาพอากาศ โพสต์จาก Facebook Group และ OpenAI เพื่อสร้างข้อมูลเชิงลึก (Insights), แคมเปญการตลาด และคำแนะนำสำหรับธุรกิจท้องถิ่นแบบอัตโนมัติ

## สถาปัตยกรรมระบบ (Architecture)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│   MongoDB    │
│  Next.js 14  │     │  Express TS  │     │     (7)      │
│   :3000      │◀────│   :4000      │◀────│   :27017     │
└──────────────┘     └──────┬───────┘     └──────▲───────┘
                            │                    │
                            ▼                    │
                     ┌──────────────┐            │
                     │     n8n     │─────────────┤
                     │  Workflow   │             │
                     │   :5678     │             │
                     └──────┬──────┘             │
                            │                    │
                     ┌──────▼───────┐     ┌──────┴───────┐
                     │   OpenAI     │     │ FB Scraper   │
                     │   GPT-4      │     │ Playwright   │
                     └──────────────┘     └──────────────┘
```

## เทคโนโลยีที่ใช้ (Tech Stack)

| Layer        | Technology                                            |
| ------------ | ----------------------------------------------------- |
| **Frontend** | Next.js 14, React 18, Tailwind CSS 3, TypeScript       |
| **Backend**  | Node.js, Express.js, TypeScript, Prisma ORM            |
| **Database** | MongoDB 7                                              |
| **AI**       | OpenAI GPT-4 (ทำงานผ่าน n8n workflow)                        |
| **Automation** | n8n (Pipeline สำหรับข่าว + สภาพอากาศ → AI Insights)         |
| **Scraping** | Playwright (ดึงข้อมูลโพสต์จาก Facebook Groups ท้องถิ่น)      |
| **Validation** | Zod (ใช้ Schema ร่วมกันระหว่าง Frontend และ Backend)     |
| **State**    | Zustand (client state), TanStack React Query (server) |
| **Container** | Docker, Docker Compose                                |

## โครงสร้างโปรเจกต์ (Project Structure)

```
├── prisma/                  # ศูนย์กลาง Database Schema
│   └── schema.prisma        
├── backend/                 # API Server
│   ├── src/                 
│   ├── Dockerfile
│   └── package.json
├── scraper/                 # Facebook Scraper Service
│   ├── src/                 # โค้ดสำหรับดึง Facebook Groups
│   ├── facebook-session.json # เก็บสถานะ Login Facebook
│   ├── Dockerfile
│   └── package.json
├── frontend/                # Next.js UI (Dashboard)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── n8n/                     # AI Workflows (ข่าว & สภาพอากาศ)
└── docker-compose.yml
```

## Services

| Service        | Port | Description                               |
| -------------- | ---- | ----------------------------------------- |
| `frontend`     | 3000 | Dashboard UI ของ Next.js                  |
| `backend`      | 4000 | REST API ของ Express                          |
| `mongodb`      | 27017 | ฐานข้อมูล MongoDB 7                       |
| `n8n`          | 5678 | ระบบ Workflow Automation (AI Pipeline)       |
| `prisma-studio`| 5555 | Prisma Studio สำหรับจัดการฐานข้อมูล     |
| `scraper`      | -    | ดึงข้อมูลโพสต์ Facebook อัตโนมัติทุก 2 ชม. |

## การเริ่มต้นใช้งาน (Getting Started)

### สิ่งที่ต้องมี (Prerequisites)

- [Docker](https://docs.docker.com/get-docker/) และ [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) >= 20 (สำหรับการพัฒนาในเครื่อง และการตั้งค่า Facebook Login ครั้งแรก)

### Environment Variables

สร้างไฟล์ `.env` ในโปรเจกต์ root:

```env
DATABASE_URL=mongodb://mongodb:27017/ai_marketing
OPENAI_API_KEY=sk-...            # จำเป็นสำหรับ n8n AI workflow
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
N8N_PORT=5678
N8N_HOST=http://localhost:5678
FACEBOOK_EMAIL=your_email@gmail.com # (Option) สำหรับ Scraper
FACEBOOK_PASSWORD=your_password     # (Option) สำหรับ Scraper
```

### ⚠️ การตั้งค่า Facebook Scraper ครั้งแรก (สำคัญมาก)

ก่อนที่จะรัน Docker Compose คุณ**ต้องทำการ Login Facebook อย่างน้อย 1 ครั้ง**บนเครื่องของคุณเอง เพื่อสร้างไฟล์ `facebook-session.json` สำหรับให้ Docker นำไปใช้งานดึงข้อมูล

1. เข้าไปที่โฟลเดอร์ `scraper`
   ```bash
   cd scraper
   npm install
   ```
2. รันคำสั่ง Initial Login
   ```bash
   npm run init-login
   ```
3. ระบบจะเปิดหน้าต่างเบราว์เซอร์ Chrome/Edge ขึ้นมา ให้คุณ **กรอกอีเมลและรหัสผ่าน Facebook** และกดยอมรับคุกกี้ต่างๆ ให้เรียบร้อย
4. เมื่อเข้าสู่หน้า Feed สำเร็จ ระบบจะบันทึกไฟล์ `facebook-session.json` ไว้ในโฟลเดอร์ `scraper` และปิดเบราว์เซอร์อัตโนมัติ
5. ตอนนี้ Scraper พร้อมสำหรับการนำไปรันใน Docker แล้ว!

### การรันด้วย Docker (แนะนำ)

กลับไปที่ Root โฟลเดอร์ แล้วสั่งรัน Docker Compose:

```bash
cd ..
docker compose up -d --build
```

คำสั่งนี้จะเริ่มทั้ง 6 services พร้อมกัน (รวมถึง Scraper ที่จะเริ่มทำงานดึงโพสต์จาก 3 กลุ่มท้องถิ่นทันที)
Dashboard จะพร้อมใช้งานที่ `http://localhost:3000`

### การพัฒนาแบบ Local

```bash
# อัปเดต Prisma (ทำที่ Root ได้เลย)
docker compose run --rm backend npx prisma db push
docker compose up -d --build

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# Scraper (ทดสอบดึงข้อมูล)
cd scraper
npm run test-scrape
```

## โมเดลฐานข้อมูล (Database Models)

### CommunityPost (Facebook Posts)
| Field       | Type     | Description          |
| ----------- | -------- | -------------------- |
| `groupId`   | String   | ID ของกลุ่ม Facebook |
| `groupName` | String   | ชื่อกลุ่ม (เช่น คนรักทับสะแก) |
| `content`   | String   | ข้อความในโพสต์ (ล้างขยะแล้ว) |
| `postUrl`   | String?  | ลิงก์ไปยังโพสต์ต้นฉบับ |
| `contentHash`| String  | Hash ไว้เช็คโพสต์ซ้ำ    |

### News
| Field       | Type     | Description          |
| ----------- | -------- | -------------------- |
| `title`     | String   | พาดหัวข่าว        |
| `content`   | String?  | เนื้อหาข่าวฉบับเต็ม |
| `source`    | String   | ชื่อแหล่งข่าว          |
| `url`       | String?  | URL ของบทความต้นฉบับ |

### WeatherRecord
| Field       | Type     | Description          |
| ----------- | -------- | -------------------- |
| `district`  | String   | อำเภอ             |
| `temperature`| Float   | อุณหภูมิ           |
| `weather`   | String   | สภาพอากาศ (เช่น มีเมฆมาก) |

### AIInsight
| Field            | Type     | Description                       |
| ---------------- | -------- | --------------------------------- |
| `title`          | String   | หัวข้อ Insight ที่ AI สร้างขึ้น   |
| `summary`        | String   | บทสรุป Insight                    |
| `recommendation` | String?  | คำแนะนำที่นำไปปฏิบัติได้         |

### Campaign
| Field       | Type     | Description               |
| ----------- | -------- | ------------------------- |
| `title`     | String   | ชื่อแคมเปญ              |
| `description` | String? | รายละเอียดแคมเปญ        |
| `caption`   | String?  | ข้อความสำหรับใช้ในแคมเปญ |
| `status`    | String   | `draft`, `active`, `archived` |

## Scripts ที่ใช้งานได้

### Scraper
| Script              | Description                             |
| ------------------- | --------------------------------------- |
| `npm run init-login`| เปิดเบราว์เซอร์เพื่อให้ผู้ใช้ Login FB สร้าง Session |
| `npm run test-scrape`| ทดสอบดึงโพสต์ทั้ง 3 กลุ่ม 1 รอบทันที         |
| `npm start`         | รันระบบตั้งเวลาดึงโพสต์อัตโนมัติ (ใช้ใน Docker) |

### Backend
| Script              | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | รัน Development Server พร้อม Hot Reload   |
| `npm run build`     | Compile TypeScript                      |

### Frontend
| Script          | Description                      |
| --------------- | ------------------------ |
| `npm run dev`   |รัน Next.js Development Server |
| `npm run build` | Build สำหรับ Production   |
