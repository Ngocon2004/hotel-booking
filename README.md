# HBMS Hotel - Hotel Booking Management System

Đồ án thi cuối kỳ môn **Các công nghệ mới trong phát triển phần mềm**.  
Đề tài: **Website quản lý đặt phòng khách sạn**.

## Trạng Thái Hiện Tại

- Source code: đã đồng bộ trên GitHub `origin/main`.
- Lint: `npm.cmd run lint` pass.
- Build: `npm.cmd run build` pass với Next.js 16.2.6.
- Docker: có `Dockerfile` multi-stage và `docker-compose.yml`; app chạy production trên `127.0.0.1:3000`.
- UI: đã có trang About, giao diện tiếng Việt có dấu, homepage hỗ trợ chuyển tiếng Việt/English.
- API docs: đã có `/api-docs` và `/api/openapi`, nhưng **chỉ admin được quyền xem**.
- Manual testing: đã pass và tick đầy đủ trong `docs/manual-testing.md`.
- Production HTTPS: đã deploy trên VPS tại `https://hbms.dghahai.io.vn/`.
- Domain: `dghahai.io.vn` tại BKNS, dùng subdomain `hbms.dghahai.io.vn`.
- Còn lại bắt buộc: báo cáo PDF >=20 trang, demo video.

## Demo

- Local dev: `http://localhost:3000`
- API docs admin-only: `http://localhost:3000/api-docs`
- OpenAPI JSON admin-only: `http://localhost:3000/api/openapi`
- Production: `https://hbms.dghahai.io.vn/`
- Repository: `https://github.com/Ngocon2004/hotel-booking`

## Tính Năng

### Public

- Trang chủ chuyên nghiệp với hero/search, GSAP animation, light/dark theme.
- Trang giới thiệu `/about` đã hoàn thiện, không public nút API docs.
- Đa ngôn ngữ giao diện chính: tiếng Việt và English.
- Danh sách phòng `/rooms` có filter, sort, pagination.
- Chi tiết phòng `/rooms/[id]` có gallery, review, realtime status.
- Tìm phòng theo ngày và số khách tại `/search`.

### Customer

- Đăng ký, đăng nhập, đăng xuất bằng Supabase Auth.
- Đăng nhập email/password, magic link và Google OAuth.
- Đặt phòng, chọn dịch vụ kèm theo, tính tổng tiền real-time.
- Nhận mã booking dạng `HTL-YYYYMMDD-XXXX`.
- Xem lịch sử booking, chi tiết booking, hủy booking hợp lệ.
- In phiếu booking.
- Cập nhật profile và upload avatar.
- Tạo review sau khi booking đã check-out.

### Admin

- Dashboard KPI và biểu đồ bằng Recharts.
- CRUD room types.
- CRUD rooms và upload ảnh Supabase Storage.
- CRUD services.
- Quản lý bookings: confirm, check-in, check-out, cancel.
- Quản lý customers.
- Quản lý reviews.
- Realtime toast khi có booking mới.
- Xem Swagger UI/OpenAPI nội bộ.

### Backend / API Documentation

- Backend chính: Next.js Server Actions + Supabase Auth/PostgreSQL/Storage/Realtime.
- Route thực tế:
  - `/auth/callback`
  - `/api/openapi` - admin-only.
  - `/api-docs` - admin-only.
- Swagger UI mô tả các business operations đang được cài đặt bằng Server Actions.
- Người chưa đăng nhập bị chuyển về login; customer đăng nhập bị chuyển về trang chủ khi truy cập API docs.

## Stack Công Nghệ

| Layer | Công nghệ |
| --- | --- |
| Frontend | Next.js 16.2.6 App Router, React 19.2.4, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Base UI |
| Animation | GSAP |
| Backend | Supabase Auth, PostgreSQL, Storage, Realtime |
| Validation | Zod |
| Date/Time | dayjs, timezone `Asia/Ho_Chi_Minh` |
| Chart | Recharts |
| Docs API | OpenAPI 3.0.3, Swagger UI admin-only |
| Container | Docker multi-stage, Docker Compose, reverse proxy ngoài bằng Caddy/Nginx/Cloudflare |

## Quick Start

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

Tạo `.env.local`:

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

Tài khoản seed:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hbms.vn` | `Admin123!` |
| Customer | `customer1@hbms.vn` | `Customer123!` |

## Docker

Tạo `.env` ở root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Chạy:

```bash
docker compose up -d --build
```

Mở `http://localhost:3000`.

Lưu ý: Docker build cần có `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` ở thời điểm build.

## Tài Liệu

- [SPEC.md](./SPEC.md) - đặc tả dự án cập nhật.
- [ROADMAP.md](./ROADMAP.md) - tiến độ và việc còn lại.
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - hướng dẫn cài đặt.
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - hướng dẫn Supabase.
- [docs/deployment.md](./docs/deployment.md) - Docker/VPS deploy checklist.
- [docs/manual-testing.md](./docs/manual-testing.md) - checklist manual test.
- [docs/ai-prompts.md](./docs/ai-prompts.md) - log AI prompts.

## Việc Còn Lại

1. Viết báo cáo PDF >=20 trang đúng format.
2. Quay demo video 3-5 phút.
3. Cập nhật screenshot/minh chứng production trong báo cáo.
