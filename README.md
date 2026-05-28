# HBMS Hotel - Hotel Booking Management System

Do an thi cuoi ky mon **Cac cong nghe moi trong phat trien phan mem**.
De tai: **Website quan ly dat phong khach san**.

## Trang Thai Hien Tai

- Source code: da dong bo tren GitHub `origin/main`.
- Lint: `npm.cmd run lint` pass.
- Build: `npm.cmd run build` pass voi Next.js 16.2.6.
- Docker local: da build/run thanh cong bang `docker compose up -d --build`, image khoang `197MB`.
- Swagger UI: da co tai `/api-docs`.
- OpenAPI JSON: da co tai `/api/openapi`.
- Con lai bat buoc: deploy VPS/domain/HTTPS, bao cao PDF >=20 trang, demo video, manual test day du bang trinh duyet.

## Demo

- Local dev: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api/openapi`
- Production: chua deploy, se cap nhat sau khi co VPS/domain/SSL.
- Repository: `https://github.com/Ngocon2004/hotel-booking`

## Tinh Nang

### Public

- Trang chu chuyen nghiep voi hero/search, GSAP animation, light/dark theme.
- Da ngon ngu giao dien chinh: Tieng Viet va English.
- Danh sach phong `/rooms` co filter, sort, pagination.
- Chi tiet phong `/rooms/[id]` co gallery, review, realtime status.
- Tim phong theo ngay, so khach tai `/search`.

### Customer

- Dang ky, dang nhap, dang xuat bang Supabase Auth.
- Dang nhap email/password, magic link va Google OAuth.
- Dat phong, chon dich vu kem theo, tinh tong tien real-time.
- Nhan ma booking dang `HTL-YYYYMMDD-XXXX`.
- Xem lich su booking, chi tiet booking, huy booking hop le.
- In phieu booking.
- Cap nhat profile va upload avatar.
- Tao review sau khi booking da check-out.

### Admin

- Dashboard KPI va bieu do bang Recharts.
- CRUD room types.
- CRUD rooms va upload anh Supabase Storage.
- CRUD services.
- Quan ly bookings: confirm, check-in, check-out, cancel.
- Quan ly customers.
- Quan ly reviews.
- Realtime toast khi co booking moi.

### Backend / API Documentation

- Backend chinh: Next.js Server Actions + Supabase Auth/PostgreSQL/Storage/Realtime.
- Route thuc te:
  - `/auth/callback`
  - `/api/openapi`
  - `/api-docs`
- Swagger UI mo ta cac business operations dang duoc cai dat bang Server Actions.

## Stack Cong Nghe

| Layer | Cong nghe |
| --- | --- |
| Frontend | Next.js 16.2.6 App Router, React 19.2.4, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Base UI |
| Animation | GSAP |
| Backend | Supabase Auth, PostgreSQL, Storage, Realtime |
| Validation | Zod |
| Date/Time | dayjs, timezone `Asia/Ho_Chi_Minh` |
| Chart | Recharts |
| Docs API | OpenAPI 3.0.3, Swagger UI |
| Container | Docker multi-stage, Docker Compose, Nginx reverse proxy |

## Quick Start

```bash
npm install
npm run dev
```

Mo `http://localhost:3000`.

Tao `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Seed data:

```bash
npm run seed
```

Tai khoan seed:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hbms.vn` | `Admin123!` |
| Customer | `customer1@hbms.vn` | `Customer123!` |

## Docker

```bash
docker compose up -d --build
```

Mo `http://localhost`.

Luu y: Docker build can co `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` o thoi diem build.

## Tai Lieu

- [SPEC.md](./SPEC.md) - dac ta du an cap nhat.
- [ROADMAP.md](./ROADMAP.md) - tien do va viec con lai.
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - huong dan cai dat.
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - huong dan Supabase.
- [docs/deployment.md](./docs/deployment.md) - Docker/VPS deploy checklist.
- [docs/manual-testing.md](./docs/manual-testing.md) - checklist manual test.
- [docs/ai-prompts.md](./docs/ai-prompts.md) - log AI prompts.

## Viec Con Lai

1. Manual test bang trinh duyet va tick lai `docs/manual-testing.md`.
2. Deploy VPS/domain/HTTPS.
3. Viet bao cao PDF >=20 trang dung format.
4. Quay demo video 3-5 phut.
5. Polish nho: favicon, accessibility audit, screenshot minh chung.
