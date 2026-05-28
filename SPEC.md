# DAC TA DU AN - HBMS HOTEL BOOKING MANAGEMENT SYSTEM

## 1. Thong Tin Chung

- Ten du an: **HBMS Hotel Booking Management System**.
- De tai: Website quan ly dat phong khach san.
- Hinh thuc: do an ca nhan.
- Stack hien tai:
  - Frontend: Next.js 16.2.6 App Router, React 19.2.4, TypeScript.
  - UI: Tailwind CSS v4, shadcn/ui, Base UI, lucide-react.
  - Animation: GSAP.
  - Backend: Supabase Auth, PostgreSQL, Storage, Realtime.
  - Validation: Zod.
  - Chart: Recharts.
  - API docs: OpenAPI 3.0.3 + Swagger UI.
  - Deploy: Docker multi-stage + Docker Compose + Nginx, VPS/HTTPS con lai.

## 2. Muc Tieu

Xay dung he thong dat phong khach san co day du flow cho khach hang va admin:

- Khach xem phong, tim phong theo ngay, dat phong, huy booking, danh gia.
- Admin quan ly phong, loai phong, dich vu, booking, customer, review.
- He thong co RLS, upload file, realtime, dashboard, Docker va tai lieu API.

## 3. Role Va Quyen

| Role | Quyen |
| --- | --- |
| Guest | Xem phong, tim kiem, loc, xem review |
| Customer | Dat phong, xem/huy booking cua minh, review sau check-out, cap nhat profile/avatar |
| Admin | CRUD du lieu, quan ly lifecycle booking, dashboard, customer, review |

## 4. Database Schema

He thong dung 8 bang chinh:

| Bang | Muc dich |
| --- | --- |
| `profiles` | Mo rong `auth.users`, luu role va thong tin ca nhan |
| `room_types` | Loai phong, gia co ban, suc chua, tien nghi |
| `rooms` | Phong vat ly, trang thai, anh |
| `bookings` | Dat phong, trang thai, payment status |
| `payments` | Du lieu thanh toan |
| `reviews` | Danh gia sau check-out |
| `services` | Dich vu kem theo |
| `booking_services` | Quan he booking - services |

### Function / Trigger Quan Trong

- `check_room_availability`: kiem tra trung lich bang PostgreSQL daterange.
- `create_booking_transaction`: tao booking trong transaction, tranh race condition bang lock.
- `handle_new_user`: tu dong tao profile khi dang ky.
- `update_updated_at_column`: cap nhat timestamp.

## 5. RLS / Bao Mat

- Guest chi doc du lieu public can thiet.
- Customer chi xem va cap nhat du lieu cua minh.
- Admin co quyen quan ly toan bo bang nghiep vu.
- Storage bucket `rooms` public read, admin write.
- Storage bucket `avatars` public read, user upload/update avatar cua minh.
- Protected routes duoc bao ve bang `src/proxy.ts`.

## 6. Chuc Nang Da Cai Dat

### Public

- `/`: trang chu co hero, animation, search form.
- `/rooms`: danh sach phong, filter, sort, pagination.
- `/rooms/[id]`: chi tiet phong, gallery, reviews, realtime status, quick booking.
- `/search`: tim phong theo check-in/check-out/guests, filter gia/loai phong.

### Auth

- `/auth/login`: email/password, magic link, Google OAuth.
- `/auth/register`: dang ky user.
- `/auth/callback`: route handler Supabase OAuth/OTP callback.
- Logout bang Server Action.

### Customer

- `/booking/[roomId]`: form dat phong, chon services, tinh tong tien.
- `/booking/success/[code]`: xac nhan booking.
- `/my-bookings`: lich su booking.
- `/my-bookings/[id]`: chi tiet, huy booking, review sau check-out.
- `/booking/[roomId]/print`: trang in phieu booking.
- `/profile`: cap nhat thong tin, upload avatar.

### Admin

- `/admin`: dashboard KPI/charts.
- `/admin/room-types`: CRUD loai phong.
- `/admin/rooms`: CRUD phong, upload anh.
- `/admin/bookings`: quan ly booking, filter/search/pagination.
- `/admin/bookings/[id]`: confirm, check-in, check-out, cancel.
- `/admin/customers`: danh sach customer.
- `/admin/customers/[id]`: chi tiet customer + lich su booking.
- `/admin/services`: CRUD service.
- `/admin/reviews`: quan ly review.

### API Documentation

- `/api-docs`: Swagger UI.
- `/api/openapi`: OpenAPI JSON.
- Swagger mo ta cac operation backend dang cai dat qua Server Actions/Supabase.

## 7. Docker / Deploy

Da co:

- `Dockerfile` multi-stage.
- `docker-compose.yml`.
- `docker/nginx.conf`.
- Local smoke test Docker pass.
- Image app khoang `197MB`.

Con lai:

- VPS.
- Domain.
- HTTPS.
- Cap nhat Supabase Auth redirect URL production.

## 8. Kiem Thu Hien Tai

Da pass:

- `npm.cmd run lint`.
- `npm.cmd run build`.
- Docker local smoke test truoc do.
- HTTP smoke test dev cho cac route public/protected redirect.

Can test bang trinh duyet:

- Customer booking lifecycle.
- Admin booking lifecycle.
- Upload avatar/room image.
- Realtime toast/status.
- Print preview.
- Swagger UI hien thi tren browser.

## 9. Yeu Cau Bat Buoc Va Trang Thai

| Yeu cau | Trang thai |
| --- | --- |
| Auth | Done |
| CRUD >=3 bang | Done |
| RLS / phan quyen | Done |
| File upload | Done |
| Responsive UI | Done |
| Docker Compose | Done local |
| GitHub + commits | Done |
| AI prompts >=5 | Done |
| Swagger UI | Done them theo yeu cau bo sung |
| Deploy HTTPS | Chua |
| Bao cao PDF >=20 trang | Chua |
| Demo video | Chua |

## 10. Optional

- Email confirmation.
- VNPay/MoMo sandbox.
- PDF hoa don.
- i18n chuan bang `next-intl`.
