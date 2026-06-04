# 🚀 AI-Marketing Dashboard

ระบบ **AI-Marketing Dashboard** สำหรับวิเคราะห์ข้อมูลการตลาดท้องถิ่นอัจฉริยะ โดยรวบรวมข้อมูลจากหลายแหล่ง ได้แก่ Facebook Community, Google Maps, ข่าวสาร และสภาพอากาศ แล้วนำมาประมวลผลด้วย AI เพื่อสร้าง Insights และ Campaign อัตโนมัติ

---

## 📋 สารบัญ

- [ภาพรวมระบบ](#-ภาพรวมระบบ)
- [สถาปัตยกรรม](#-สถาปัตยกรรม)
- [Tech Stack](#-tech-stack)
- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [ข้อกำหนดเบื้องต้น](#-ข้อกำหนดเบื้องต้น)
- [การติดตั้งครั้งแรก](#-การติดตั้งครั้งแรก)
- [Environment Variables](#-environment-variables)
- [การรันด้วย Docker Compose](#-การรันด้วย-docker-compose)
- [การรันแบบ Local Development](#-การรันแบบ-local-development)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [n8n Workflows](#-n8n-workflows)
- [Facebook Scraper](#-facebook-scraper)

---

## 🎯 ภาพรวมระบบ

ระบบประกอบด้วยฟีเจอร์หลัก:

| ฟีเจอร์ | รายละเอียด |
|---|---|
| **Dashboard** | แสดงภาพรวม: จำนวนร้านค้า, เทรนด์เดือนนี้, Campaign ทั้งหมด, AI Drafts, ร้านยอดฮิต 5 อันดับ, กลุ่มคำยอดฮิต (Keyword Cloud) |
| **AI Insights** | วิเคราะห์เทรนด์และโอกาสทางการตลาดจากข้อมูลชุมชน พร้อมคำแนะนำ (Recommendation) |
| **Campaigns** | สร้างและจัดการแคมเปญการตลาด รองรับสถานะ draft / active / completed พร้อม Caption และ Coupon |
| **News & Weather** | รวบรวมข่าวสารท้องถิ่นและข้อมูลสภาพอากาศ เพื่อใช้ประกอบการวิเคราะห์ |
| **Businesses** | ฐานข้อมูลร้านค้าท้องถิ่นจาก Google Maps พร้อมข้อมูล Rating, Reviews, Location |
| **Facebook Scraper** | ดึงข้อมูลโพสต์จากกลุ่ม Facebook ชุมชนท้องถิ่นแบบอัตโนมัติตามตารางเวลา |
| **n8n Automation** | Workflow อัตโนมัติสำหรับ AI Analysis และดึงข่าว/สภาพอากาศ |

---

## 🏗 สถาปัตยกรรม

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│   MongoDB    │
│  (Next.js)   │     │  (Express)   │     │  (Replica)   │
│  Port: 3000  │     │  Port: 4000  │     │  Port: 27017 │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌──────────────┐              │
                     │   Scraper    │──────────────┘
                     │ (Playwright) │
                     └──────────────┘
                                                  │
                     ┌──────────────┐              │
                     │     n8n      │──────────────┘
                     │  Port: 5678  │
                     └──────────────┘

                     ┌──────────────┐
                     │ Prisma Studio│
                     │  Port: 5555  │
                     └──────────────┘
```

---

## 🛠 Tech Stack

### Frontend
| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|---|---|---|
| Next.js | 14 | React Framework (App Router) |
| React | 18 | UI Library |
| TailwindCSS | 3.4 | Styling |
| TanStack React Query | 5 | Data Fetching & Caching |
| Zustand | 5 | State Management |
| React Hook Form + Zod | 7 / 3.23 | Form Handling & Validation |
| TypeScript | 5.6 | Type Safety |

### Backend
| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|---|---|---|
| Express.js | 4.21 | REST API Server |
| Prisma ORM | 5.22 | Database ORM |
| Zod | 3.23 | Request Validation |
| TypeScript | 5.6 | Type Safety |
| tsx | 4.19 | Dev Runner (Hot Reload) |

### Scraper
| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|---|---|---|
| Playwright | 1.60 | Browser Automation |
| node-cron | 4 | Scheduled Jobs |
| Winston | 3.19 | Logging |
| Prisma ORM | 5.22 | Database Access |

### Infrastructure
| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|---|---|---|
| Docker & Docker Compose | - | Container Orchestration |
| MongoDB | 7 | Database (Replica Set) |
| n8n | latest | Workflow Automation |
| Prisma Studio | 5.22 | Database GUI |

---

## 📁 โครงสร้างโปรเจค

```
AI-Marketing/
├── .env                          # Environment variables (root)
├── .gitignore
├── docker-compose.yml            # Docker orchestration (6 services)
├── package.json                  # Root package (Prisma client)
├── thap_sakae_businesses_cleaned.json  # Seed data (ร้านค้า อ.ทับสะแก)
│
├── prisma/
│   ├── schema.prisma             # Database schema (6 models)
│   └── seed.js                   # Business data seeder
│
├── backend/
│   ├── .env                      # Backend env (DATABASE_URL, OPENAI_API_KEY, PORT)
│   ├── Dockerfile                # Multi-stage build
│   ├── package.json
│   ├── tsconfig.json
│   ├── database/
│   │   ├── init.js               # MongoDB collection & index initialization
│   │   └── fix-ai-insight-dates.js  # Data migration script
│   └── src/
│       ├── index.ts              # Express app entry point
│       ├── config/               # App configuration
│       ├── controllers/          # Request handlers
│       │   ├── dashboard.controller.ts
│       │   ├── insights.controller.ts
│       │   ├── campaigns.controller.ts
│       │   ├── businesses.controller.ts
│       │   └── news.controller.ts
│       ├── services/             # Business logic
│       │   ├── dashboard.service.ts
│       │   ├── insights.service.ts
│       │   ├── campaigns.service.ts
│       │   ├── businesses.service.ts
│       │   └── news.service.ts
│       ├── routes/               # API route definitions
│       │   ├── index.ts
│       │   ├── dashboard.routes.ts
│       │   ├── insights.routes.ts
│       │   ├── campaigns.routes.ts
│       │   ├── businesses.routes.ts
│       │   └── news.routes.ts
│       ├── lib/                  # Shared libraries (Prisma client)
│       ├── middleware/           # Express middlewares (Error handler)
│       ├── types/                # TypeScript type definitions
│       └── validators/           # Zod validation schemas
│
├── frontend/
│   ├── .env                      # Frontend env (NEXT_PUBLIC_API_URL)
│   ├── Dockerfile                # Multi-stage build
│   ├── package.json
│   ├── next.config.js            # Next.js config (standalone output)
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── app/                  # Next.js App Router pages
│       │   ├── layout.tsx        # Root layout (QueryClientProvider)
│       │   ├── globals.css       # Global styles
│       │   ├── page.tsx          # Dashboard (หน้าหลัก)
│       │   ├── campaigns/        # หน้า Campaigns
│       │   ├── insights/         # หน้า AI Insights
│       │   └── news/             # หน้า News
│       ├── components/
│       │   ├── layout/           # Layout components (Sidebar, Header)
│       │   ├── ui/               # Reusable UI components
│       │   └── BusinessDetailModal.tsx
│       ├── features/             # Feature-specific components
│       │   ├── dashboard/        # Dashboard widgets
│       │   ├── campaigns/        # Campaign components
│       │   ├── insights/         # Insight components
│       │   └── news/             # News components
│       ├── hooks/                # Custom React hooks
│       │   ├── useDashboard.ts
│       │   ├── useCampaigns.ts
│       │   ├── useInsights.ts
│       │   ├── useNews.ts
│       │   └── useBusinesses.ts
│       ├── services/             # API service functions
│       │   ├── dashboard.ts
│       │   ├── campaigns.ts
│       │   ├── insights.ts
│       │   ├── news.ts
│       │   └── businesses.ts
│       ├── store/                # Zustand state stores
│       ├── lib/                  # Utility libraries
│       └── types/                # TypeScript types
│
├── scraper/
│   ├── .env                      # Scraper env (DATABASE_URL)
│   ├── .gitignore
│   ├── Dockerfile                # Playwright base image
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma.config.ts
│   ├── facebook-session.json     # Facebook login session (git-ignored)
│   └── src/
│       ├── index.ts              # Entry point (Login / Scheduler mode)
│       ├── jobs/
│       │   └── scrape.job.ts     # Cron job scheduler
│       ├── services/
│       │   ├── facebook.service.ts   # Facebook scraping logic
│       │   └── scraper.service.ts    # Scraping orchestration
│       ├── repositories/         # Database access layer
│       ├── utils/                # Utility functions
│       ├── test-scrape.ts        # Manual test script
│       ├── validate-data.ts      # Data validation script
│       └── clear-data.ts         # Data cleanup script
│
└── n8n/
    └── workflows/
        ├── AI.json               # AI analysis workflow
        └── news-weather-workflow.json  # News & weather data workflow
```

---

## ⚙ ข้อกำหนดเบื้องต้น (Prerequisites)

ก่อนเริ่มต้น ต้องมีโปรแกรมเหล่านี้ติดตั้งแล้ว:

| ซอฟต์แวร์ | เวอร์ชันขั้นต่ำ | ลิงก์ดาวน์โหลด |
|---|---|---|
| **Docker Desktop** | 4.x | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Docker Compose** | v2 (มากับ Docker Desktop) | - |
| **Node.js** (สำหรับ Local Dev) | 20.x | [nodejs.org](https://nodejs.org/) |
| **Git** | 2.x | [git-scm.com](https://git-scm.com/) |

---

## 🚀 การติดตั้งครั้งแรก (First-Time Setup)

### ขั้นตอนที่ 1: Clone Repository

```bash
git clone https://github.com/Komkrit2547/AI-Marketing.git
cd AI-Marketing
```

### ขั้นตอนที่ 2: สร้างไฟล์ Environment Variables

สร้างไฟล์ `.env` ที่ **root** ของโปรเจค:

```bash
# สร้างไฟล์ .env ที่ root
cp .env.example .env
```

หรือสร้างไฟล์ `.env` เองตามตัวอย่างด้านล่าง:

```env
# .env (root)
DATABASE_URL=mongodb://mongodb:27017/ai_marketing
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
N8N_PORT=5678
N8N_HOST=http://localhost:5678
```

สร้างไฟล์ `.env` ใน **backend/**:

```env
# backend/.env
DATABASE_URL=mongodb://mongodb:27017/ai_marketing
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=4000
```

> ⚠️ **สำคัญ**: ต้องใส่ `OPENAI_API_KEY` จริงจาก [OpenAI Platform](https://platform.openai.com/api-keys) เพื่อให้ระบบ AI ทำงานได้

สร้างไฟล์ `.env` ใน **frontend/**:

```env
# frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

สร้างไฟล์ `.env` ใน **scraper/**:

```env
# scraper/.env
DATABASE_URL="mongodb://localhost:27017/ai_marketing?directConnection=true"
```

### ขั้นตอนที่ 3: รันด้วย Docker Compose (แนะนำ)

```bash
# Build และ start ทุก services
docker compose up --build
```

ระบบจะ start services ทั้งหมด 6 ตัว:

| Service | URL | หน้าที่ |
|---|---|---|
| **Frontend** | http://localhost:3000 | เว็บไซต์หลัก |
| **Backend API** | http://localhost:4000 | REST API |
| **MongoDB** | localhost:27017 | ฐานข้อมูล |
| **n8n** | http://localhost:5678 | Workflow automation |
| **Prisma Studio** | http://localhost:5555 | Database GUI |
| **Scraper** | - (background) | Facebook scraper |

> 💡 **หมายเหตุ**: เมื่อ start ครั้งแรก ระบบจะ:
> 1. สร้าง MongoDB Replica Set อัตโนมัติ
> 2. รัน database initialization script (สร้าง collections + indexes)
> 3. รัน migration script (fix-ai-insight-dates)
> 4. Push Prisma schema ไปยัง MongoDB
> 5. Seed ข้อมูลร้านค้าจาก `thap_sakae_businesses_cleaned.json`
> 6. Import n8n workflows อัตโนมัติ

### ขั้นตอนที่ 4: ตรวจสอบว่าระบบทำงาน

```bash
# ตรวจสอบว่าทุก services running
docker compose ps

# ดู logs ทั้งหมด
docker compose logs -f

# ดู logs เฉพาะ service
docker compose logs -f backend
docker compose logs -f frontend
```

เปิดเบราว์เซอร์:
- **Dashboard**: http://localhost:3000
- **n8n**: http://localhost:5678
- **Prisma Studio**: http://localhost:5555

---

## 🔧 การรันแบบ Local Development (ไม่ใช้ Docker)

หากต้องการพัฒนาแบบ local:

### 1. ติดตั้ง Dependencies

```bash
# Root (Prisma)
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Scraper (ถ้าต้องการ)
cd ../scraper
npm install
```

### 2. ตั้งค่า MongoDB

ต้องมี MongoDB 7 รันเป็น Replica Set:

```bash
# ใช้ Docker เฉพาะ MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:7 --replSet rs0

# Init replica set
docker exec -it mongodb mongosh --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'localhost:27017'}]})"
```

### 3. ตั้งค่า Prisma

```bash
# จาก root directory
npx prisma generate

# Push schema ไปยัง MongoDB
npx prisma db push

# (Optional) Seed ข้อมูลร้านค้า
node prisma/seed.js
```

### 4. แก้ไข DATABASE_URL สำหรับ Local

แก้ไข `backend/.env` เป็น:
```env
DATABASE_URL=mongodb://localhost:27017/ai_marketing?directConnection=true
```

### 5. รัน Development Servers

```bash
# Terminal 1 - Backend (port 4000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

---

## 🌐 Environment Variables

### Root `.env`

| ตัวแปร | ค่าตัวอย่าง | คำอธิบาย |
|---|---|---|
| `DATABASE_URL` | `mongodb://mongodb:27017/ai_marketing` | MongoDB connection string |
| `PORT` | `4000` | Backend API port |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | Frontend → Backend URL |
| `N8N_PORT` | `5678` | n8n port |
| `N8N_HOST` | `http://localhost:5678` | n8n host URL |

### Backend `.env`

| ตัวแปร | ค่าตัวอย่าง | คำอธิบาย |
|---|---|---|
| `DATABASE_URL` | `mongodb://mongodb:27017/ai_marketing` | MongoDB connection (Docker) |
| `OPENAI_API_KEY` | `sk-xxxx` | **ต้องตั้งค่า** - OpenAI API Key สำหรับ AI features |
| `PORT` | `4000` | Express server port |

### Frontend `.env`

| ตัวแปร | ค่าตัวอย่าง | คำอธิบาย |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | Backend API base URL |

### Scraper `.env`

| ตัวแปร | ค่าตัวอย่าง | คำอธิบาย |
|---|---|---|
| `DATABASE_URL` | `mongodb://localhost:27017/ai_marketing?directConnection=true` | MongoDB direct connection |

---

## 📡 API Endpoints

Backend API ทำงานที่ `http://localhost:4000/api`

### Dashboard
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/api/dashboard` | ข้อมูลรวม Dashboard (ร้านค้า, เทรนด์, ร้านยอดฮิต, Keywords) |

### AI Insights
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/api/insights` | ดึงรายการ AI Insights ทั้งหมด |

### Campaigns
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/api/campaigns` | ดึงรายการ Campaign ทั้งหมด |
| `POST` | `/api/campaigns` | สร้าง Campaign ใหม่ |
| `PUT` | `/api/campaigns/:id` | แก้ไข Campaign |
| `DELETE` | `/api/campaigns/:id` | ลบ Campaign |

### Businesses
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/api/businesses` | ดึงรายการร้านค้าทั้งหมด |

### News
| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/api/news` | ดึงรายการข่าวสารทั้งหมด |

---

## 🗄 Database Schema

ใช้ **MongoDB** ผ่าน **Prisma ORM** มี 6 Models:

| Model | คำอธิบาย | ฟิลด์หลัก |
|---|---|---|
| **AIInsight** | ผลวิเคราะห์ AI | title, summary, recommendation, category, priority, rank |
| **Campaign** | แคมเปญการตลาด | title, description, caption, couponText, status, startDate, endDate |
| **CommunityPost** | โพสต์จาก Facebook | source, groupName, content, reactionCount, commentCount, contentHash |
| **ScraperLog** | Log การ scrape | status, postsFound, postsInserted, timestamp |
| **WeatherRecord** | ข้อมูลสภาพอากาศ | district, province, weather, temperature, humidity, rainfall |
| **Business** | ร้านค้าท้องถิ่น | name, category, address, latitude, longitude, rating, reviewCount |

> 💡 ดูรายละเอียด schema ทั้งหมดได้ที่ `prisma/schema.prisma` หรือเปิด Prisma Studio ที่ http://localhost:5555

---

## ⚡ n8n Workflows

ระบบมี n8n workflows 2 ตัวที่ import อัตโนมัติ:

| Workflow | ไฟล์ | คำอธิบาย |
|---|---|---|
| **AI Analysis** | `n8n/workflows/AI.json` | วิเคราะห์ข้อมูลชุมชนด้วย AI แล้วสร้าง Insights |
| **News & Weather** | `n8n/workflows/news-weather-workflow.json` | ดึงข่าวสารและสภาพอากาศเข้าระบบ |

เข้าถึง n8n ได้ที่ http://localhost:5678

---

## 🕷 Facebook Scraper

Scraper ใช้ **Playwright** ดึงข้อมูลโพสต์จากกลุ่ม Facebook ชุมชนท้องถิ่น

### การตั้งค่า Facebook Session ครั้งแรก

```bash
# รัน init-login เพื่อ login Facebook แบบ manual (เปิดเบราว์เซอร์)
cd scraper
npm run init-login
```

> จะเปิดเบราว์เซอร์ขึ้นมาให้ login Facebook ด้วยตัวเอง → session จะถูกบันทึกลง `facebook-session.json`

### Scripts ที่มี

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm start` | รัน scraper ในโหมด Scheduler (cron) |
| `npm run init-login` | Login Facebook ครั้งแรก |
| `npm run test-scrape` | ทดสอบ scrape ข้อมูลแบบ manual |
| `npm run validate` | ตรวจสอบความถูกต้องของข้อมูล |
| `npm run clear-data` | ลบข้อมูล community posts ทั้งหมด |

---

## 🛑 คำสั่งที่ใช้บ่อย

```bash
# เริ่มระบบทั้งหมด
docker compose up --build

# เริ่มระบบ (background)
docker compose up -d --build

# หยุดระบบทั้งหมด
docker compose down

# หยุดและลบ volumes (ลบข้อมูลด้วย)
docker compose down -v

# Rebuild เฉพาะ service
docker compose build backend
docker compose build frontend

# Restart เฉพาะ service
docker compose restart backend

# เข้าไปใน container
docker compose exec backend sh
docker compose exec mongodb mongosh

# ดู Prisma Studio
docker compose up prisma-studio
```

---

## 📝 License

Private Project
