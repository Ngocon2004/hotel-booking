# ROADMAP - Hotel Booking Management System

Cập nhật: 2026-05-29

## Tổng Quan Tiến Độ

Trạng thái tổng thể: **khoảng 95-96% phần code và tài liệu kỹ thuật**.

Đã hoàn thành phần code chính, Docker production build, Swagger UI admin-only, UI polish, theme sáng/tối, animation, About page, chuẩn hóa tiếng Việt có dấu và các flow nghiệp vụ chính. Manual test có đăng nhập đã pass. Phần còn lại chủ yếu là **deploy VPS/domain/HTTPS**, **báo cáo PDF**, và **demo video**.

## Yêu Cầu Bắt Buộc Theo Quy Chế

| # | Yêu cầu | Trạng thái |
| --- | --- | --- |
| 1 | Frontend Next.js + Tailwind/shadcn | Done |
| 2 | Backend Supabase Auth + DB + Storage/Realtime | Done |
| 3 | Dockerfile + Docker Compose multi-stage | Done, local build/run đã pass |
| 4 | VPS + Domain + SSL HTTPS | Chưa hoàn tất, đã có domain `dghahai.io.vn` |
| 5 | GitHub + Conventional Commits | Done |
| 6 | AI prompts minh chứng >=5 | Done, đã có 20+ prompts |
| 7 | TypeScript types rõ ràng | Done |
| 8 | Báo cáo PDF >=20 trang | Chưa |

## Đã Hoàn Thành

### Foundation

- Next.js 16.2.6 + React 19.2.4 + TypeScript.
- Tailwind CSS v4 + shadcn/ui/Base UI.
- Supabase SSR clients cho server/client/proxy.
- Auth: register/login/logout, magic link, Google OAuth.
- Proxy bảo vệ `/admin`, `/my-bookings`, `/profile`, `/api-docs`, `/api/openapi`.
- Root layout, public layout, admin layout.
- Navbar, footer, theme toggle không còn hydration mismatch.
- Light/dark mode đã sửa lỗi mất chữ.

### Database / Supabase

- Schema 8 bảng: `profiles`, `room_types`, `rooms`, `bookings`, `payments`, `reviews`, `services`, `booking_services`.
- RLS cho admin/customer/guest.
- Storage buckets: `rooms`, `avatars`.
- RPC:
  - `check_room_availability`
  - `create_booking_transaction`
- Trigger tự động tạo profile và update `updated_at`.
- Seed data: admin, customers, room types, rooms, services, bookings, reviews.

### Public / Customer

- Trang chủ đã polish giao diện, màu sáng/tối/xanh dương.
- Homepage có chuyển tiếng Việt/English cho nội dung chính.
- Trang About `/about` đã hoàn thiện và không còn nút public API docs.
- GSAP animation/chuyển cảnh.
- Search form cân đối lại trên trang chủ.
- `/rooms` có filter/sort/pagination.
- `/rooms/[id]` có gallery, reviews, quick booking form.
- `/search` đã sửa dark mode mất chữ.
- Booking flow hoàn chỉnh.
- Booking success page.
- My bookings + chi tiết booking.
- Hủy booking theo rule.
- Print booking invoice.
- Profile update + avatar upload.
- Reviews sau check-out.

### Admin

- Dashboard KPI + Recharts.
- CRUD room types.
- CRUD rooms + upload ảnh.
- CRUD services.
- Quản lý bookings lifecycle:
  - pending -> confirmed
  - confirmed -> checked_in
  - checked_in -> checked_out
  - cancel/refund
- Quản lý customers.
- Quản lý reviews.
- Pagination/search debounced.
- Giao diện admin đã chỉnh nền mặc định sáng/trắng hơn.

### Realtime

- Toast realtime booking mới trên admin bookings.
- Realtime room status trên room detail/admin rooms.
- Đã test với customer `customer1@hbms.vn`: customer đặt/hủy booking, admin thấy trạng thái cập nhật đúng.

### Swagger UI / API Docs

- `/api-docs`: Swagger UI admin-only.
- `/api/openapi`: OpenAPI JSON admin-only.
- Người chưa đăng nhập bị redirect sang login.
- Customer đăng nhập không được xem API docs.
- Admin được xem API docs.
- OpenAPI mô tả các module Auth, Bookings, Rooms, Room Types, Services, Reviews, Profiles.
- Ghi chú rõ backend đang dùng Next Server Actions + Supabase, không phải REST controller truyền thống.

### Docker / Build

- `Dockerfile` multi-stage.
- `docker-compose.yml` chạy app production trên `127.0.0.1:3000`.
- Có sẵn cấu hình reverse proxy tham khảo trong `docker/nginx.conf` và `docker/caddy/Caddyfile`.
- Docker local smoke test đã pass.
- Image `hotel-booking-app:latest` khoảng `197MB`.
- `npm.cmd run lint`: pass.
- `npm.cmd run build`: pass.

## Việc Còn Lại

### Ưu Tiên Cao

1. **Deploy VPS/domain/HTTPS**
   - Trỏ DNS A record của `dghahai.io.vn` về IP VPS.
   - Tạo `.env` production.
   - Chạy `docker compose up -d --build`.
   - Cấu hình HTTPS bằng Cloudflare, Caddy hoặc Nginx/Certbot.
   - Cập nhật Supabase Auth redirect URLs.
   - Smoke test lại `/`, `/rooms`, login, booking, admin và API docs admin-only trên domain thật.

2. **Báo cáo PDF >=20 trang**
   - Times New Roman 13, spacing 1.5.
   - Có screenshot giao diện, Supabase, Docker, Swagger UI admin-only, GitHub.
   - Có phụ lục AI prompts.

3. **Demo video 3-5 phút**
   - Public search/booking.
   - Customer my bookings/review.
   - Admin dashboard/lifecycle.
   - API docs bằng tài khoản admin.
   - Docker/deploy nếu đã có production URL.

### Polish Nhỏ

- Tạo favicon riêng cho HBMS.
- Accessibility audit: alt text, aria-label, contrast.
- Cập nhật screenshot minh chứng trong báo cáo.

### Optional Nếu Còn Thời Gian

- Email confirmation bằng Resend/Supabase Edge Function.
- VNPay/MoMo sandbox.
- PDF hóa đơn bằng thư viện PDF.
- i18n chuẩn bằng `next-intl`.

## Trạng Thái Tài Liệu

- `README.md`: đã cập nhật.
- `SPEC.md`: đã cập nhật.
- `SETUP_GUIDE.md`: đã cập nhật.
- `SUPABASE_SETUP.md`: đã cập nhật.
- `docs/deployment.md`: đã cập nhật theo compose hiện tại.
- `docs/manual-testing.md`: đã cập nhật checklist và trạng thái API docs admin-only.
- `docs/ai-prompts.md`: đã cập nhật thêm prompt mới.
- `src/README.md`: đã cập nhật cấu trúc route.

## Definition Of Done Còn Lại

- [x] Manual testing checklist được tick đầy đủ.
- [x] API docs chỉ admin được xem.
- [x] About page không còn nút xem API docs.
- [ ] Có production HTTPS URL chạy ổn định.
- [ ] Báo cáo PDF >=20 trang hoàn thành.
- [ ] Demo video 3-5 phút hoàn thành.
- [ ] README cập nhật production URL sau deploy.
