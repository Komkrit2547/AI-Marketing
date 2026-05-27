# AI Contextual Marketing Dashboard

แพลตฟอร์มการตลาดเชิงบริบท (Contextual Marketing) ที่ขับเคลื่อนด้วย AI โดยใช้ข่าวท้องถิ่น ข้อมูลสภาพอากาศ และ OpenAI เพื่อสร้างข้อมูลเชิงลึก (Insights), แคมเปญการตลาด และคำแนะนำสำหรับธุรกิจท้องถิ่นแบบอัตโนมัติ

## สถาปัตยกรรมระบบ (Architecture)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│   MongoDB    │
│  Next.js 14  │     │  Express TS  │     │     (7)      │
│   :3000      │◀────│   :4000      │◀────│   :27017     │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │                      ▲
                            ▼                      │
                     ┌──────────────┐              │
                     │     n8n     │───────────────┘
                     │  Workflow   │
                     │   :5678     │
                     └──────┬──────┘
                            │
                     ┌──────▼───────┐
                     │   OpenAI     │
                     │   GPT-4      │
                     └──────────────┘
```

## เทคโนโลยีที่ใช้ (Tech Stack)

| Layer        | Technology                                            |
| ------------ | ----------------------------------------------------- |
| **Frontend** | Next.js 14, React 18, Tailwind CSS 3, TypeScript       |
| **Backend**  | Node.js, Express.js, TypeScript, Prisma ORM            |
| **Database** | MongoDB 7                                              |
| **AI**       | OpenAI GPT-4 (ทำงานผ่าน n8n workflow)                        |
| **Automation** | n8n (Pipeline สำหรับข่าว + สภาพอากาศ → AI Insights)         |
| **Validation** | Zod (ใช้ Schema ร่วมกันระหว่าง Frontend และ Backend)     |
| **State**    | Zustand (client state), TanStack React Query (server) |
| **Container** | Docker, Docker Compose                                |

## โครงสร้างโปรเจกต์ (Project Structure)

```
├── backend/
│   ├── src/
│   │   ├── config/          # การตั้งค่าแอป (Environment Variables)
│   │   ├── controllers/     # ตัวจัดการ Route
│   │   ├── lib/             # Prisma Client Singleton
│   │   ├── middleware/      # Middleware สำหรับจัดการ Error
│   │   ├── routes/          # การกำหนด Express Routes
│   │   ├── services/        # ชั้น Business Logic
│   │   ├── types/           # TypeScript Types ที่ใช้ร่วมกัน
│   │   ├── validators/      # Zod Schemas
│   │   └── index.ts         # จุดเริ่มต้นของ Express App
│   ├── prisma/
│   │   └── schema.prisma    # Database Models (News, AIInsight, Campaign)
│   ├── database/
│   │   └── init.js          # Script สำหรับเริ่มต้น MongoDB
│   ├── n8n/
│   │   └── workflows/       # Workflows ของ n8n
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # หน้าต่าง ๆ ของ Next.js App Router
│   │   │   ├── campaigns/
│   │   │   ├── insights/
│   │   │   └── news/
│   │   ├── components/      # Components สำหรับ Layout และ UI
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── features/        # Components แยกตามฟีเจอร์
│   │   │   ├── campaigns/
│   │   │   ├── dashboard/
│   │   │   ├── insights/
│   │   │   └── news/
│   │   ├── hooks/           # React Query Hooks
│   │   ├── lib/             # API Client
│   │   ├── services/        # Service สำหรับเรียก API
│   │   ├── store/           # Zustand Stores
│   │   └── types/           # TypeScript Types ที่ใช้ร่วมกัน
│   ├── Dockerfile
│   └── package.json
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

## API Endpoints

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/news`            | แสดงรายการข่าว (แบ่งหน้า)    |
| GET    | `/api/news/:id`        | แสดงข่าวเดียว              |
| GET    | `/api/insights`        | แสดงรายการข้อมูลเชิงลึกจาก AI |
| GET    | `/api/insights/:id`    | แสดงข้อมูลเชิงลึกจาก AI เดียว |
| GET    | `/api/campaigns`       | แสดงรายการแคมเปญ             |
| POST   | `/api/campaigns`       | สร้างแคมเปญ                 |
| GET    | `/api/campaigns/:id`   | แสดงแคมเปญเดียว             |

## การเริ่มต้นใช้งาน (Getting Started)

### สิ่งที่ต้องมี (Prerequisites)

- [Docker](https://docs.docker.com/get-docker/) และ [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) >= 20 (สำหรับการพัฒนาในเครื่อง)

### Environment Variables

สร้างไฟล์ `.env` ในโปรเจกต์ root:

```env
DATABASE_URL=mongodb://mongodb:27017/ai_marketing
OPENAI_API_KEY=sk-...            # จำเป็นสำหรับ n8n AI workflow
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
N8N_PORT=5678
N8N_HOST=http://localhost:5678
```

### การรันด้วย Docker (แนะนำ)

```bash
docker compose up -d
```

คำสั่งนี้จะเริ่มทั้ง 5 services พร้อมกัน และ dashboard จะพร้อมใช้งานที่ `http://localhost:3000`

### การพัฒนาแบบ Local

```bash
# Backend
cd backend
npm install
npx prisma generate
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### การตั้งค่า n8n Workflow

1. เปิด n8n ที่ `http://localhost:5678`
2. สร้างบัญชี
3. Import workflow จาก `backend/n8n/workflows/news-weather-workflow.json`
4. กำหนดค่า credentials:
   - **NewsAPI** - Get a free API key at [newsapi.org](https://newsapi.org)
   - **OpenWeatherMap** - Get a free API key at [openweathermap.org](https://openweathermap.org)
   - **OpenAI** - Use your OpenAI API key
   - **MongoDB** - Connection string: `mongodb://mongodb:27017/ai_marketing`
5. Activate the workflow

Workflow นี้จะทำงานตามเวลาที่กำหนด โดยจะ:

1. ดึงข่าวท้องถิ่น
2. ดึงข้อมูลสภาพอากาศ
3. ส่งข้อมูลไปให้ OpenAI GPT-4 วิเคราะห์
4. สร้าง Marketing Insights
5. บันทึกผลลัพธ์ลง MongoDB

## โมเดลฐานข้อมูล (Database Models)

### News
| Field       | Type     | Description          |
| ----------- | -------- | -------------------- |
| `title`     | String   | พาดหัวข่าว        |
| `content`   | String?  | เนื้อหาข่าวฉบับเต็ม |
| `source`    | String   | ชื่อแหล่งข่าว          |
| `url`       | String?  | URL ของบทความต้นฉบับ |
| `category`  | String?  | หมวดหมู่ข่าว        |
| `publishedAt` | DateTime? | วันที่เผยแพร่   |

### AIInsight
| Field            | Type     | Description                       |
| ---------------- | -------- | --------------------------------- |
| `title`          | String   | หัวข้อ Insight ที่ AI สร้างขึ้น   |
| `summary`        | String   | บทสรุป Insight                    |
| `recommendation` | String?  | คำแนะนำที่นำไปปฏิบัติได้         |
| `category`       | String?  | หมวดหมู่ของ Insight              |
| `relatedNewsId`  | String?  | อ้างอิงข่าวที่เกี่ยวข้อง          |

### Campaign
| Field       | Type     | Description               |
| ----------- | -------- | ------------------------- |
| `title`     | String   | ชื่อแคมเปญ              |
| `description` | String? | รายละเอียดแคมเปญ        |
| `caption`   | String?  | ข้อความสำหรับใช้ในแคมเปญ |
| `couponText`| String?  | ข้อความสำหรับใช้ในแคมเปญ |
| `status`    | String   | `draft`, `active`, `archived` |
| `startDate` | DateTime? | วันที่เริ่มต้นแคมเปญ      |
| `endDate`   | DateTime? | วันที่สิ้นสุดแคมเปญ         |

## Scripts ที่ใช้งานได้

### Backend
| Script              | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | รัน Development Server พร้อม Hot Reload   |
| `npm run build`     | Compile TypeScript                      |
| `npm run start`     | รัน Server ที่ Compile แล้ว                 |
| `npm run prisma:generate` | สร้าง Prisma Client              |
| `npm run prisma:push` | Push Schema ไปยังฐานข้อมูล              |
| `npm run lint`      | รัน ESLint                             |

### Frontend
| Script          | Description                      |
| --------------- | ------------------------ |
| `npm run dev`   |รัน Next.js Development Server |
| `npm run build` | Build สำหรับ Production   |
| `npm run start` | รัน Production Server      |
| `npm run lint`  | รัน Next.js lint         |
