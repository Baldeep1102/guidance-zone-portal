# Guidance Zone (GuZo) Web Portal

## Project Overview
Spiritual guidance web portal for Acharya Navneetji. Full-stack app with React frontend and Express backend.

## Architecture
```
Guidance Zone Web Portal/
├── app/          # React 19 + Vite 7 + Tailwind CSS frontend
├── server/       # Express 5 + TypeScript + Prisma ORM backend
├── render.yaml   # Render.com deployment blueprint
└── package.json  # Root scripts (install:all, build, start)
```

## Tech Stack
- **Frontend**: React 19, Vite 7, Tailwind CSS, shadcn/ui, GSAP (ScrollTrigger animations), Axios
- **Backend**: Express 5, TypeScript, Prisma ORM 6, PostgreSQL
- **Auth**: JWT (access 15min + refresh 7d HTTP-only cookie), Google OAuth (google-auth-library)
- **Email**: Resend (gracefully skipped if no API key)
- **Deployment**: Render.com (free tier web service + free PostgreSQL)

## Key Patterns

### Frontend
- `useApi<T>(fetcher)` hook for all data fetching → `{ data, loading, error, refetch }`
- `useAuth()` hook consuming `AuthContext` for user state, login/signup/logout
- `ProtectedRoute` / `AdminRoute` guards for route protection
- Axios client (`src/api/client.ts`) with automatic token refresh on 401
- All API modules in `src/api/` (courses, talks, books, downloads, projects, registrations, admin)
- GSAP ScrollTrigger animations in Home.tsx — must trigger after data loads

### Backend
- Controllers in `server/src/controllers/` — one per resource
- Routes in `server/src/routes/` — auth middleware applied per-route
- Zod validators in `server/src/validators/`
- Express 5 quirks: `req.params` values typed as `string | string[]` — cast with `as string`
- Express 5 quirks: wildcard routes need named params (`*path` not `*`)
- Email service (`server/src/services/email.ts`) skips sending if no RESEND_API_KEY (logs to console)
- In production, Express serves the built React SPA from `app/dist/` with fallback to `index.html`

### Database
- Prisma schema at `server/prisma/schema.prisma`
- Seed script at `server/prisma/seed.ts` — idempotent (upsert/skipDuplicates), safe to re-run
- Admin credentials (seed): `admin@guzo.org` / `guzo2026`

## Models
User, Course, CourseSession, CourseMaterial, Talk, Book, Download, Project, Registration, SiteSettings

## Pages

### Public
Home, About, Courses, Talks, Books, Downloads, Projects, Dashboard (enrolled user), Login, Signup, VerifyEmail

### Admin (`/admin/*`)
AdminLogin, AdminDashboard, AdminCourses, AdminTalks, AdminBooks, AdminDownloads, AdminProjects, AdminRegistrations, AdminUsers, AdminSettings (CMS)

## API Routes (all under `/api/v1`)
- `/auth` — signup, login, google, refresh, verify-email, forgot-password, reset-password, me
- `/courses` — CRUD + `/admin` (all courses), sessions & materials sub-routes
- `/talks`, `/books`, `/downloads`, `/projects` — standard CRUD
- `/registrations` — register, /my, admin getAll, updateStatus
- `/users` — admin list/detail
- `/admin/stats` — dashboard stats
- `/admin/settings` — GET/PUT site settings (CMS)
- `/calendar/ics/:courseId`, `/calendar/google/:courseId` — calendar integration

## Development

### Prerequisites
- Node.js 22+
- PostgreSQL (or Docker: `docker run -d --name guzo-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=guzo -p 5432:5432 postgres:16-alpine`)

### Setup
```bash
# Install dependencies
cd app && npm install && cd ../server && npm install

# Create server/.env (copy from server/.env.example)

# Run database migrations and seed
cd server
npx prisma migrate dev
npx prisma db seed

# Start both servers
cd server && npm run dev    # Express on :3001
cd app && npm run dev       # Vite on :5173 (proxies /api → :3001)
```

### Environment Variables (server/.env)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — JWT signing secrets
- `PORT` — Server port (default 3001)
- `CLIENT_URL` — Frontend URL (default http://localhost:5173)
- `NODE_ENV` — development/production
- `RESEND_API_KEY` — Optional, email service
- `GOOGLE_CLIENT_ID` — Optional, Google OAuth
- `FROM_EMAIL` — Sender email address

## Deployment (Render.com)
- `render.yaml` defines: free web service + free PostgreSQL database
- Build: install deps (with --include=dev for TypeScript) → build frontend → prisma generate → prisma migrate deploy → prisma db seed
- Start: `node --import tsx src/index.ts` (Express serves API + static SPA)
- URL: https://guzo-portal.onrender.com
- Set `CLIENT_URL` env var to the Render URL after first deploy
- Free tier spins down on inactivity (~50s cold start)

## Important Notes
- The old `store.ts` (localStorage-based data) was deleted after full API migration
- Registration responses filter out sensitive user fields (passwordHash, tokens)
- Prisma nullable fields (`string | null`) passed to `<img src>` need `?? undefined`
- Frontend build runs `tsc -b && vite build` — strict TypeScript checking
- Vite config `base: '/'` (not `'./'`) for proper SPA routing in production
