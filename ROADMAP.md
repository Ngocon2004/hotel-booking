# ROADMAP - Hotel Booking Management System

Cap nhat: 2026-05-28

## Tong Quan Tien Do

Trang thai tong the: **khoang 88-90%**.

Da hoan thanh phan code chinh, Docker local, Swagger UI, UI polish, theme sang/toi, animation, chuc nang nang cao.
Con lai chu yeu la **manual test co dang nhap**, **deploy VPS/domain/HTTPS**, **bao cao PDF**, va **demo video**.

## Yeu Cau Bat Buoc Theo Quy Che

| # | Yeu cau | Trang thai |
| --- | --- | --- |
| 1 | Frontend Next.js + Tailwind/shadcn | Done |
| 2 | Backend Supabase Auth + DB + Storage/Realtime | Done |
| 3 | Dockerfile + Docker Compose multi-stage | Done, local smoke test pass |
| 4 | VPS + Domain + SSL HTTPS | Chua |
| 5 | GitHub + Conventional Commits | Done |
| 6 | AI prompts minh chung >=5 | Done, da co 20+ prompts |
| 7 | TypeScript types ro rang | Done |
| 8 | Bao cao PDF >=20 trang | Chua |

## Da Hoan Thanh

### Foundation

- Next.js 16.2.6 + React 19.2.4 + TypeScript.
- Tailwind CSS v4 + shadcn/ui/Base UI.
- Supabase SSR clients cho server/client/proxy.
- Auth: register/login/logout, magic link, Google OAuth.
- Proxy bao ve `/admin`, `/my-bookings`, `/profile`.
- Root layout, public layout, admin layout.
- Navbar, footer, theme toggle khong con hydration mismatch.
- Light/dark mode da sua loi mat chu.

### Database / Supabase

- Schema 8 bang: `profiles`, `room_types`, `rooms`, `bookings`, `payments`, `reviews`, `services`, `booking_services`.
- RLS cho admin/customer/guest.
- Storage buckets: `rooms`, `avatars`.
- RPC:
  - `check_room_availability`
  - `create_booking_transaction`
- Trigger auto tao profile va update `updated_at`.
- Seed data: admin, customers, room types, rooms, services, bookings, reviews.

### Public / Customer

- Trang chu da polish giao dien, bo mau trang/den/xanh duong.
- GSAP animation/chuyen canh.
- Search form can doi lai tren trang chu.
- `/rooms` co filter/sort/pagination.
- `/rooms/[id]` co gallery, reviews, quick booking form.
- `/search` da sua dark mode mat chu.
- Booking flow hoan chinh.
- Booking success page.
- My bookings + chi tiet booking.
- Huy booking theo rule.
- Print booking invoice.
- Profile update + avatar upload.
- Reviews sau check-out.

### Admin

- Dashboard KPI + Recharts.
- CRUD room types.
- CRUD rooms + upload anh.
- CRUD services.
- Quan ly bookings lifecycle:
  - pending -> confirmed
  - confirmed -> checked_in
  - checked_in -> checked_out
  - cancel/refund
- Quan ly customers.
- Quan ly reviews.
- Pagination/search debounced.
- Giao dien admin da chinh nen mac dinh sang/trang hon.

### Realtime

- Toast realtime booking moi tren admin bookings.
- Realtime room status tren room detail/admin rooms.

### Swagger UI / API Docs

- `/api-docs`: Swagger UI.
- `/api/openapi`: OpenAPI JSON.
- OpenAPI mo ta cac module Auth, Bookings, Rooms, Room Types, Services, Reviews, Profiles.
- Ghi chu ro backend dang dung Next Server Actions + Supabase, khong phai REST controller truyen thong.

### Docker / Build

- `Dockerfile` multi-stage.
- `docker-compose.yml` chay app + Nginx.
- `docker/nginx.conf` da tang proxy buffer.
- Docker local smoke test da pass.
- Image `hotel-booking-app:latest` khoang `197MB`.
- `npm.cmd run lint`: pass.
- `npm.cmd run build`: pass.

## Viec Con Lai

### Uu Tien Cao

1. **Manual test bang trinh duyet**
   - Customer login/search/book/cancel.
   - Admin confirm/check-in/check-out/cancel.
   - Upload avatar/room image.
   - Print preview.
   - Realtime toast/status.
   - Swagger UI tai `/api-docs`.

2. **Deploy VPS/domain/HTTPS**
   - Chuan bi VPS.
   - Tro DNS A record.
   - Tao `.env.production`.
   - Chay `docker compose up -d --build`.
   - Cau hinh HTTPS bang Cloudflare, Caddy hoac Certbot.
   - Cap nhat Supabase Auth redirect URLs.

3. **Bao cao PDF >=20 trang**
   - Times New Roman 13, spacing 1.5.
   - Co screenshot giao dien, Supabase, Docker, Swagger UI, GitHub.
   - Co phu luc AI prompts.

4. **Demo video 3-5 phut**
   - Public search/booking.
   - Customer my bookings/review.
   - Admin dashboard/lifecycle.
   - Swagger UI.
   - Docker/deploy neu da co production URL.

### Polish Nho

- Tao favicon rieng cho HBMS.
- Accessibility audit: alt text, aria-label, contrast.
- Cap nhat screenshot minh chung trong bao cao.

### Optional Neu Con Thoi Gian

- Email confirmation bang Resend/Supabase Edge Function.
- VNPay/MoMo sandbox.
- PDF hoa don bang thu vien PDF.
- i18n chuan bang `next-intl`.

## Trang Thai Tai Lieu

- `README.md`: da cap nhat.
- `SPEC.md`: da cap nhat.
- `SETUP_GUIDE.md`: da cap nhat.
- `docs/deployment.md`: da cap nhat.
- `docs/manual-testing.md`: da cap nhat checklist.
- `docs/ai-prompts.md`: da cap nhat them prompt Swagger/tai lieu.

## Definition Of Done Con Lai

- [ ] Manual testing checklist duoc tick day du.
- [ ] Co production HTTPS URL.
- [ ] Bao cao PDF >=20 trang hoan thanh.
- [ ] Demo video 3-5 phut hoan thanh.
- [ ] README cap nhat production URL sau deploy.
