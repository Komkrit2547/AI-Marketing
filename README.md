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
- [Security](#-security)
- [คำสั่งที่ใช้บ่อย](#-คำสั่งที่ใช้บ่อย)
- [Troubleshooting / FAQ](#-troubleshooting--faq)
- [License](#-license)

---

## 🎯 ภาพรวมระบบ

ระบบประกอบด้วยฟีเจอร์หลัก:

| ฟีเจอร์ | รายละเอียด |
|---|---|
| **Dashboard** | แสดงภาพรวม: จำนวนร้านค้า, เทรนด์เดือนนี้, Campaign ทั้งหมด, AI Drafts, ร้านยอดฮิต 5 อันดับ, กลุ่มคำยอดฮิต (Keyword Cloud) |
| **AI Insights** | วิเคราะห์เทรนด์และโอกาสทางการตลาดจากข้อมูลชุมชน พร้อมคำแนะนำ (Recommendation) |
| **Campaigns** | สร้างและจัดการแคมเปญการตลาด รองรับสถานะ draft / active / completed พร้อม Caption และ Coupon |
| **News & Weather** | รวบรวมข่าวสารท้องถิ่น, ข้อมูลสภาพอากาศปัจจุบัน, และพยากรณ์อากาศล่วงหน้า เพื่อใช้ประกอบการวิเคราะห์ |
| **Businesses** | ฐานข้อมูลร้านค้าท้องถิ่นจาก Google Maps พร้อมข้อมูล Rating, Reviews, Location |
| **Facebook Scraper** | ดึงข้อมูลโพสต์จากกลุ่ม Facebook ชุมชนท้องถิ่นแบบอัตโนมัติตามตารางเวลา |
| **n8n Automation** | Workflow อัตโนมัติสำหรับ AI Analysis, ดึงข่าว, สภาพอากาศปัจจุบัน, และพยากรณ์อากาศ |

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

**การไหลของข้อมูล:**
1. **Scraper** ดึงข้อมูลโพสต์จาก Facebook → บันทึกลง MongoDB (`CommunityPost`)
2. **n8n** วิเคราะห์โพสต์ด้วย AI → สร้าง `AIInsight` และ `Campaign` (draft)
3. **n8n** ดึงข่าวสารและสภาพอากาศ → บันทึกลง `WeatherRecord`, `WeatherForecast`, `CommunityPost` (news)
4. **Backend** ให้บริการ REST API → ดึงข้อมูลจาก MongoDB ผ่าน Prisma ORM
5. **Frontend** แสดงผลข้อมูลทั้งหมดผ่าน Dashboard

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
| React Error Boundary | 6 | Error Handling |
| TypeScript | 5.6 | Type Safety |

### Backend
| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|---|---|---|
| Express.js | 4.21 | REST API Server |
| Prisma ORM | 5.22 | Database ORM |
| Zod | 3.23 | Request Validation |
| Helmet | 8.2 | Security HTTP Headers |
| express-rate-limit | 8.5 | Rate Limiting |
| compression | 1.8 | Response Compression |
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
├── docker-compose.yml            # Docker orchestration (7 services)
├── package.json                  # Root package (Prisma client)
├── fix_dates.js                  # Date fixing utility script
├── thap_sakae_businesses_cleaned.json  # Seed data (ร้านค้า อ.ทับสะแก)
│
├── prisma/
│   ├── schema.prisma             # Database schema (7 models)
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
│       ├── config/
│       │   └── index.ts          # App configuration (port, env)
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
│       ├── lib/
│       │   └── prisma.ts         # Prisma client singleton
│       ├── middleware/
│       │   └── errorHandler.ts   # Global error handler (Prisma, Validation)
│       ├── types/
│       │   └── index.ts          # TypeScript type definitions
│       └── validators/
│           └── campaign.ts       # Zod validation schema (Campaign)
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
│       │   └── news/             # หน้า News & Weather
│       ├── components/
│       │   ├── layout/
│       │   │   ├── DashboardLayout.tsx  # Main layout wrapper
│       │   │   ├── Header.tsx          # Top navigation header
│       │   │   └── Sidebar.tsx         # Side navigation menu
│       │   ├── ui/
│       │   │   └── Loading.tsx         # Loading spinner component
│       │   ├── providers/              # React context providers
│       │   └── BusinessDetailModal.tsx  # Business detail popup
│       ├── features/             # Feature-specific components
│       │   ├── dashboard/
│       │   │   └── DashboardStats.tsx  # Dashboard statistics widgets
│       │   ├── campaigns/
│       │   │   └── CampaignList.tsx    # Campaign list & management
│       │   ├── insights/
│       │   │   └── InsightList.tsx     # AI Insight list display
│       │   └── news/
│       │       └── NewsList.tsx        # News & weather display
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
│       ├── store/
│       │   └── dashboard.ts      # Zustand state store (Dashboard)
│       ├── lib/
│       │   └── api.ts            # API client utility (fetch wrapper)
│       └── types/
│           └── index.ts          # TypeScript types
│
├── scraper/
│   ├── .env                      # Scraper env (DATABASE_URL)
│   ├── .gitignore
│   ├── Dockerfile                # Playwright base image
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma.config.ts          # Prisma configuration for scraper
│   ├── facebook-session.json     # Facebook login session (⚠️ git-ignored)
│   └── src/
│       ├── index.ts              # Entry point (Login / Scheduler mode)
│       ├── jobs/
│       │   └── scrape.job.ts     # Cron job scheduler
│       ├── services/
│       │   ├── facebook.service.ts   # Facebook scraping logic
│       │   └── scraper.service.ts    # Scraping orchestration
│       ├── repositories/
│       │   └── post.repository.ts    # Database access layer (CommunityPost)
│       ├── utils/
│       │   ├── hashGenerator.ts      # Content hash generation
│       │   └── textCleaner.ts        # Text cleaning utilities
│       ├── test-scrape.ts        # Manual test script
│       ├── validate-data.ts      # Data validation script
│       └── clear-data.ts         # Data cleanup script
│
└── n8n/
    └── workflows/
        ├── AI.json                    # AI analysis workflow
        ├── news-weather-workflow.json # News & weather data workflow
        ├── Current Weather.json       # Current weather fetching workflow
        └── Daily Forecast.json        # Daily weather forecast workflow
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

ระบบจะ start services ทั้งหมด 7 ตัว:

| Service | URL | หน้าที่ |
|---|---|---|
| **Frontend** | http://localhost:3000 | เว็บไซต์หลัก |
| **Backend API** | http://localhost:4000 | REST API |
| **MongoDB** | localhost:27017 | ฐานข้อมูล |
| **db-migration** | - (รันครั้งเดียว) | Migration script |
| **n8n** | http://localhost:5678 | Workflow automation |
| **Prisma Studio** | http://localhost:5555 | Database GUI |
| **Scraper** | - (background) | Facebook scraper |

> 💡 **หมายเหตุ**: เมื่อ start ครั้งแรก ระบบจะ:
> 1. สร้าง MongoDB Replica Set อัตโนมัติ
> 2. รัน database initialization script (สร้าง collections + indexes)
> 3. รัน migration script (`fix-ai-insight-dates.js`)
> 4. Push Prisma schema ไปยัง MongoDB
> 5. Seed ข้อมูลร้านค้าจาก `thap_sakae_businesses_cleaned.json`
> 6. Import n8n workflows อัตโนมัติ (AI, News & Weather, Current Weather, Daily Forecast)

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

> ⚠️ **สำคัญ**: ต้องรัน `npm install` ที่ Root Directory ก่อน เพื่อติดตั้ง Prisma Client แบบรวมศูนย์ (Centralized) ให้ทั้ง Backend และ Scraper ใช้งานร่วมกัน

```bash
# 1. Root (ติดตั้ง Prisma Client กลาง)
npm install

# 2. Backend
cd backend
npm install

# 3. Frontend
cd ../frontend
npm install

# 4. Scraper (ถ้าต้องการ)
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

> 💡 **ข้อควรระวังเรื่อง `DATABASE_URL` (Host & Replica Set)**
> 
> ความแตกต่างของการตั้งค่า Connection String:
> - **`DATABASE_URL=mongodb://mongodb:27017/ai_marketing`**: ใช้เมื่อคุณรันแอปพลิเคชันผ่าน **Docker (เช่น docker-compose)** เนื่องจากระบบเน็ตเวิร์คของ Docker จะทำการจำลองชื่อคอนเทนเนอร์ `mongodb` ให้เป็น IP Address ภายในได้
> - **`DATABASE_URL="mongodb://localhost:27017/ai_marketing?replicaSet=rs0"`**: ใช้เมื่อคุณรันโปรแกรมหรือคำสั่งต่างๆ **บนเครื่อง Local (เช่น Windows/Mac) โดยตรง** (เช่น รัน `npm run dev`, `npx prisma db push`) โดยจำเป็นต้องเติม `?replicaSet=rs0` ต่อท้ายเสมอ เนื่องจาก Prisma บังคับใช้ MongoDB ในโหมด Replica Set
>
> ⚠️ **ข้อควรระวัง:** หากใช้คำว่า `localhost` ภายใน Docker มันจะหมายถึงตัวคอนเทนเนอร์เอง ไม่ใช่ฐานข้อมูล ดังนั้นควรแยก `.env` ของ Local ออกจากการตั้งค่าใน `docker-compose.yml` ให้ชัดเจน

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
| `GET` | `/api/dashboard?year=2026&month=7` | Dashboard ตามเดือน/ปีที่ระบุ |

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

ใช้ **MongoDB** ผ่าน **Prisma ORM** มี 7 Models:

| Model | คำอธิบาย | ฟิลด์หลัก |
|---|---|---|
| **AIInsight** | ผลวิเคราะห์ AI | title, summary, recommendation, category, priority, rank |
| **Campaign** | แคมเปญการตลาด | title, description, caption, couponText, status, startDate, endDate |
| **CommunityPost** | โพสต์จาก Facebook | source, groupName, content, reactionCount, commentCount, contentHash |
| **ScraperLog** | Log การ scrape | status, postsFound, postsInserted, timestamp |
| **WeatherRecord** | ข้อมูลสภาพอากาศปัจจุบัน | district, province, weather, temperature, humidity, rainfall, windSpeed |
| **WeatherForecast** | พยากรณ์อากาศรายวัน | district, province, forecastDate, dayName, weather, maxTemp, minTemp, rainfall |
| **Business** | ร้านค้าท้องถิ่น | name, category, address, latitude, longitude, rating, reviewCount, googleUrl |

> 💡 ดูรายละเอียด schema ทั้งหมดได้ที่ `prisma/schema.prisma` หรือเปิด Prisma Studio ที่ http://localhost:5555

### ความสัมพันธ์และ Indexes

| Model | Indexes |
|---|---|
| **AIInsight** | `createdAt` (DESC) |
| **CommunityPost** | `postedAt` (DESC), `contentHash` (UNIQUE) |
| **WeatherRecord** | `recordedAt` (DESC), `district` |
| **WeatherForecast** | `forecastDate` (ASC) |
| **Business** | `placeId` (UNIQUE), `category`, `city`, `province`, `rating` |

---

## ⚡ n8n Workflows

ระบบมี n8n workflows 4 ตัวที่ import อัตโนมัติ:

| Workflow | ไฟล์ | คำอธิบาย |
|---|---|---|
| **AI Analysis** | `n8n/workflows/AI.json` | วิเคราะห์ข้อมูลชุมชนด้วย AI แล้วสร้าง Insights และ Campaign drafts |
| **News & Weather** | `n8n/workflows/news-weather-workflow.json` | ดึงข่าวสารและสภาพอากาศรวมเข้าระบบ |
| **Current Weather** | `n8n/workflows/Current Weather.json` | ดึงข้อมูลสภาพอากาศปัจจุบัน → บันทึกเป็น `WeatherRecord` |
| **Daily Forecast** | `n8n/workflows/Daily Forecast.json` | ดึงข้อมูลพยากรณ์อากาศรายวัน → บันทึกเป็น `WeatherForecast` |

### การตั้งค่า Credential MongoDB ครั้งแรก

เมื่อเข้า n8n UI ที่ http://localhost:5678 ครั้งแรก ให้ตั้งค่า MongoDB credential:

| ค่า | รายละเอียด |
|---|---|
| `Connection String` | `mongodb://mongodb:27017/?replicaSet=rs0` |
| `Database` | `ai_marketing` |

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
| `npm run init-login` | Login Facebook ครั้งแรก (เปิดเบราว์เซอร์แบบ headed) |
| `npm run test-scrape` | ทดสอบ scrape ข้อมูลแบบ manual |
| `npm run validate` | ตรวจสอบความถูกต้องของข้อมูลที่ scrape มา |
| `npm run clear-data` | ลบข้อมูล community posts ทั้งหมด |
| `npm run build` | Build TypeScript → JavaScript |

### โหมดการทำงาน

| โหมด | คำอธิบาย |
|---|---|
| **Scheduler Mode** (default) | รันเป็น background service พร้อม cron job ดึงข้อมูลตามตารางเวลา |
| **Init Login Mode** (`--init-login`) | เปิดเบราว์เซอร์ให้ login Facebook แล้วบันทึก session |

---

## 🔒 Security

Backend มีการตั้งค่า Security ดังนี้:

| มาตรการ | รายละเอียด |
|---|---|
| **Helmet** | ตั้งค่า Security HTTP Headers อัตโนมัติ (CSP, X-Frame-Options, etc.) |
| **Rate Limiting** | จำกัด 100 requests ต่อ IP ทุก 15 นาที (สำหรับ `/api` routes) |
| **CORS** | เปิดใช้ Cross-Origin Resource Sharing |
| **Body Size Limit** | จำกัดขนาด JSON request body ที่ 10KB |
| **Response Compression** | บีบอัด response ด้วย gzip |
| **Error Handler** | Global error handler แยกประเภท (Prisma, Validation, Auth) ซ่อน stack trace ใน production |
| **Graceful Shutdown** | จัดการ SIGTERM สำหรับ Docker/PM2 ปิดระบบอย่างเรียบร้อย |

---

## 🛑 คำสั่งที่ใช้บ่อย

```bash
# เริ่มระบบทั้งหมด
docker compose up --build

# เริ่มระบบ (background)
docker compose up -d --build

# หยุดระบบทั้งหมด
docker compose down

# หยุดและลบ volumes (⚠️ ลบข้อมูลทั้งหมดด้วย)
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

# Rebuild image โดยไม่ใช้ cache
docker compose build --no-cache
```

---

## ❓ Troubleshooting / FAQ

### 1. MongoDB ไม่สามารถ start ได้ / Replica Set Error

**อาการ:** `MongoServerError: not master` หรือ `no replset config has been received`

**วิธีแก้:**
```bash
# ลบ volumes แล้ว start ใหม่
docker compose down -v
docker compose up --build
```

MongoDB ต้องรันเป็น Replica Set เนื่องจาก Prisma บังคับ — ระบบจะ initiate replica set อัตโนมัติผ่าน healthcheck

---

### 2. Prisma Generate / Push Error

**อาการ:** `Error: EPERM` หรือ `Cannot find module '@prisma/client'`

**วิธีแก้:**
```bash
# ต้อง install ที่ root ก่อน
npm install

# แล้วจึง generate
npx prisma generate

# Push schema
npx prisma db push
```

> ⚠️ ตรวจสอบว่า `DATABASE_URL` ใน `.env` ตรงกับสภาพแวดล้อม (Docker ใช้ `mongodb://mongodb:...`, Local ใช้ `mongodb://localhost:...?directConnection=true`)

---

### 3. Frontend ไม่สามารถเชื่อมต่อ Backend

**อาการ:** `Network Error`, `Failed to fetch`, หรือข้อมูลไม่แสดง

**วิธีแก้:**
1. ตรวจสอบว่า Backend รันอยู่ที่ port 4000:
   ```bash
   docker compose logs backend
   ```
2. ตรวจสอบ `NEXT_PUBLIC_API_URL` ใน `frontend/.env`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```
3. ถ้ารันผ่าน Docker ให้ตรวจสอบว่าทั้งสอง service อยู่ใน network เดียวกัน (`app-network`)

---

### 4. Facebook Scraper ไม่ทำงาน / Session หมดอายุ

**อาการ:** Scraper log แสดง error เกี่ยวกับ login หรือ authentication

**วิธีแก้:**
```bash
# Re-login เพื่อสร้าง session ใหม่
cd scraper
npm run init-login
```

> 💡 Facebook session มักหมดอายุเมื่อผ่านไปสักระยะ ต้องทำขั้นตอนนี้ซ้ำเมื่อ session หมดอายุ

---

### 5. n8n Workflows ไม่ทำงาน

**อาการ:** Workflows ไม่แสดงใน n8n UI หรือรันแล้ว error

**วิธีแก้:**
1. ตรวจสอบว่ามีการตั้งค่า MongoDB credential ใน n8n UI:
   - Connection String: `mongodb://mongodb:27017/?replicaSet=rs0`
   - Database: `ai_marketing`
2. ตรวจสอบว่า workflows ถูก import:
   ```bash
   docker compose logs n8n
   ```
3. หาก workflows หายไป ให้ restart n8n:
   ```bash
   docker compose restart n8n
   ```

---

### 6. Port ถูกใช้งานอยู่แล้ว

**อาการ:** `Error: listen EADDRINUSE :::3000` (หรือ port อื่น)

**วิธีแก้:**
```bash
# Windows: ค้นหา process ที่ใช้ port
netstat -ano | findstr :3000

# Kill process (แทน <PID> ด้วย Process ID)
taskkill /PID <PID> /F
```

หรือเปลี่ยน port ใน `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # เปลี่ยน host port เป็น 3001
```

---

### 7. Docker build ช้ามาก / ติดที่ npm install

**วิธีแก้:**
```bash
# Build โดยไม่ใช้ cache (เมื่อ dependencies เปลี่ยน)
docker compose build --no-cache

# หรือ build เฉพาะ service ที่ต้องการ
docker compose build --no-cache backend
```

> 💡 **Tips:** ถ้า `node_modules` มีปัญหา ลบ folder แล้ว install ใหม่:
> ```bash
> rm -rf node_modules package-lock.json
> npm install
> ```

---

### 8. Resource Limits ของ Docker

ระบบตั้งค่า resource limits ใน `docker-compose.yml`:

| Service | CPU | Memory |
|---|---|---|
| Frontend | 1.0 core | 1 GB |
| Backend | 1.0 core | 1 GB |
| MongoDB | 1.0 core | 2 GB |
| n8n | 1.0 core | 1 GB |
| Scraper | 1.0 core | 1 GB |

หากเครื่องมี RAM น้อย สามารถลดค่าลงได้ใน `docker-compose.yml` หรือถอด `deploy.resources.limits` ออก

---

## 📝 License

Private Project