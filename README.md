# CozyHub Commerce

A production-ready B2B ecommerce solutions SaaS platform that helps businesses start selling online (Amazon/Flipkart), manage inventory, optimize product listings, and scale ecommerce operations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, React Hook Form + Zod, Axios, Zustand |
| Backend | Golang, Gin Framework, Clean Architecture |
| Database | PostgreSQL, GORM |
| Deployment | Vercel (frontend) + Render (backend) + Neon (database) |

## Features

- **Public Website** — Hero, Services, About, Contact pages
- **Enquiry System** — Lead capture with business type classification
- **Visitor Tracking** — IP, user agent, page tracking
- **Admin Dashboard** — JWT-protected analytics, enquiry management
- **Analytics** — Visitors/enquiries per day, conversion rate charts

## Monorepo Structure

```
cozy-hub-commerce/
  backend/          # Golang/Gin REST API
  frontend/         # Next.js 14 (Pages Router)
  docker-compose.yml
  README.md
```

---

## Local Development

### Prerequisites
- Go 1.22+
- Node.js 18+
- Docker & Docker Compose (for local DB)

### Option A — Docker Compose (Recommended)

```bash
# Start PostgreSQL + Backend
docker-compose up --build

# In a separate terminal, start frontend
cd frontend
npm install
npm run dev
```

### Option B — Manual

**Database**
```bash
# Start a local Postgres instance, then create DB
psql -c "CREATE DATABASE cozyhub;"
```

**Backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
go mod download
go run .
```

**Frontend**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your NEXT_PUBLIC_API_URL
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db?sslmode=require` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-super-secret-key` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://your-api.onrender.com` |

---

## Deployment

### Database — Neon

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string (use the **pooled** connection string)
3. Set as `DATABASE_URL` in Render backend env vars

### Backend — Render

1. Connect your GitHub repo at [render.com](https://render.com)
2. **New Web Service** → select `cozy-hub-commerce` repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `go build -o app .`
   - **Start Command**: `./app`
4. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `PORT=8080`
5. Deploy — Render auto-deploys on every push to `main`

### Frontend — Vercel

1. Import repo at [vercel.com](https://vercel.com)
2. Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy — Vercel auto-deploys on every push to `main`

---

## API Reference

### Public Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/enquiries` | Submit enquiry |
| `POST` | `/api/v1/visitors` | Track visitor |

### Admin Endpoints (JWT Required)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/admin/login` | Admin login |
| `GET` | `/api/v1/admin/enquiries` | List enquiries |
| `PATCH` | `/api/v1/admin/enquiries/:id` | Update enquiry status |
| `GET` | `/api/v1/admin/analytics` | Analytics data |

### Default Admin Credentials
On first startup, a default admin is seeded:
- **Email**: `admin@cozyhub.com`
- **Password**: `Admin@123`

> **Change these immediately in production.**

---

## Development Scripts

### Backend
```bash
make run       # go run .
make build     # go build -o app .
make test      # go test ./...
make tidy      # go mod tidy
```

### Frontend
```bash
npm run dev    # Start dev server (localhost:3000)
npm run build  # Production build
npm run start  # Start production server
npm run lint   # ESLint
```

---

## Architecture

```
backend/
  main.go                      # Entry point
  internal/
    config/config.go           # Environment config
    database/database.go       # GORM connection + auto-migrate
    models/                    # GORM models
    dto/                       # Request/response types
    repository/                # DB queries (interface + impl)
    service/                   # Business logic
    controller/                # HTTP handlers
    middleware/                # Auth, CORS, logging, rate-limit
    router/router.go           # Route definitions

frontend/
  pages/                       # Next.js pages (SSR/SSG)
  components/
    layout/                    # Header, Footer, Layout
    home/                      # Hero, Services, Stats, etc.
    forms/                     # EnquiryForm
    admin/                     # Dashboard components
  services/                    # Axios API calls
  store/                       # Zustand state
  hooks/                       # Custom React hooks
```

---

Built with by CozyHub Commerce
