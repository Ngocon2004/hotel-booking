# ĐẶC TẢ DỰ ÁN - HBMS HOTEL BOOKING MANAGEMENT SYSTEM

## 1. Thông Tin Chung

- Tên dự án: **HBMS Hotel Booking Management System**.
- Đề tài: Website quản lý đặt phòng khách sạn.
- Hình thức: đồ án cá nhân.
- Stack hiện tại:
  - Frontend: Next.js 16.2.6 App Router, React 19.2.4, TypeScript.
  - UI: Tailwind CSS v4, shadcn/ui, Base UI, lucide-react.
  - Animation: GSAP.
  - Backend: Supabase Auth, PostgreSQL, Storage, Realtime.
  - Validation: Zod.
  - Chart: Recharts.
  - API docs: OpenAPI 3.0.3 + Swagger UI admin-only.
  - Deploy: Docker multi-stage + Docker Compose; VPS/HTTPS còn lại.

## 2. Mục Tiêu

Xây dựng hệ thống đặt phòng khách sạn có đầy đủ flow cho khách hàng và admin:

- Khách xem phòng, tìm phòng theo ngày, đặt phòng, hủy booking, đánh giá.
- Admin quản lý phòng, loại phòng, dịch vụ, booking, customer, review.
- Hệ thống có RLS, upload file, realtime, dashboard, Docker và tài liệu API nội bộ cho admin.

## 3. Role Và Quyền

| Role | Quyền |
| --- | --- |
| Guest | Xem phòng, tìm kiếm, lọc, xem review |
| Customer | Đặt phòng, xem/hủy booking của mình, review sau check-out, cập nhật profile/avatar |
| Admin | CRUD dữ liệu, quản lý lifecycle booking, dashboard, customer, review, xem API docs |

## 4. Database Schema

Hệ thống dùng 8 bảng chính:

| Bảng | Mục đích |
| --- | --- |
| `profiles` | Mở rộng `auth.users`, lưu role và thông tin cá nhân |
| `room_types` | Loại phòng, giá cơ bản, sức chứa, tiện nghi |
| `rooms` | Phòng vật lý, trạng thái, ảnh |
| `bookings` | Đặt phòng, trạng thái, payment status |
| `payments` | Dữ liệu thanh toán |
| `reviews` | Đánh giá sau check-out |
| `services` | Dịch vụ kèm theo |
| `booking_services` | Quan hệ booking - services |

### Function / Trigger Quan Trọng

- `check_room_availability`: kiểm tra trùng lịch bằng PostgreSQL daterange.
- `create_booking_transaction`: tạo booking trong transaction, tránh race condition bằng lock.
- `handle_new_user`: tự động tạo profile khi đăng ký.
- `update_updated_at_column`: cập nhật timestamp.

## 5. RLS / Bảo Mật

- Guest chỉ đọc dữ liệu public cần thiết.
- Customer chỉ xem và cập nhật dữ liệu của mình.
- Admin có quyền quản lý toàn bộ bảng nghiệp vụ.
- Storage bucket `rooms` public read, admin write.
- Storage bucket `avatars` public read, user upload/update avatar của mình.
- Protected routes được bảo vệ bằng `src/proxy.ts`.
- `/api-docs` và `/api/openapi` chỉ admin được quyền xem.

## 6. Chức Năng Đã Cài Đặt

### Public

- `/`: trang chủ có hero, animation, search form.
- `/about`: trang giới thiệu cao cấp, tiếng Việt có dấu, không public API docs.
- `/rooms`: danh sách phòng, filter, sort, pagination.
- `/rooms/[id]`: chi tiết phòng, gallery, reviews, realtime status, quick booking.
- `/search`: tìm phòng theo check-in/check-out/guests, filter giá/loại phòng.

### Auth

- `/auth/login`: email/password, magic link, Google OAuth.
- `/auth/register`: đăng ký user.
- `/auth/callback`: route handler Supabase OAuth/OTP callback.
- Logout bằng Server Action.

### Customer

- `/booking/[roomId]`: form đặt phòng, chọn services, tính tổng tiền.
- `/booking/success/[code]`: xác nhận booking.
- `/my-bookings`: lịch sử booking.
- `/my-bookings/[id]`: chi tiết, hủy booking, review sau check-out.
- `/booking/[roomId]/print`: trang in phiếu booking.
- `/profile`: cập nhật thông tin, upload avatar.

### Admin

- `/admin`: dashboard KPI/charts.
- `/admin/room-types`: CRUD loại phòng.
- `/admin/rooms`: CRUD phòng, upload ảnh.
- `/admin/bookings`: quản lý booking, filter/search/pagination.
- `/admin/bookings/[id]`: confirm, check-in, check-out, cancel.
- `/admin/customers`: danh sách customer.
- `/admin/customers/[id]`: chi tiết customer + lịch sử booking.
- `/admin/services`: CRUD service.
- `/admin/reviews`: quản lý review.

### API Documentation

- `/api-docs`: Swagger UI admin-only.
- `/api/openapi`: OpenAPI JSON admin-only.
- Swagger mô tả các operation backend đang cài đặt qua Server Actions/Supabase.
- Route docs không public: guest redirect login, customer redirect về `/`, admin được phép xem.

## 7. Docker / Deploy

Đã có:

- `Dockerfile` multi-stage.
- `docker-compose.yml` chạy app production trên `127.0.0.1:3000`.
- Cấu hình reverse proxy tham khảo: `docker/nginx.conf`, `docker/caddy/Caddyfile`.
- Local smoke test Docker pass.
- Image app khoảng `197MB`.

Còn lại:

- Deploy VPS.
- Trỏ domain `dghahai.io.vn`.
- HTTPS.
- Cập nhật Supabase Auth redirect URL production.

## 8. Kiểm Thử Hiện Tại

Đã pass:

- `npm.cmd run lint`.
- `npm.cmd run build`.
- Docker local smoke test trước đó.
- HTTP smoke test dev cho route public/protected redirect.
- Manual test bằng trình duyệt cho Auth Protection, Customer Flow, Admin Booking Lifecycle, Admin CRUD, Profile/Upload, Print Flow, Realtime và Responsive/UI.
- Realtime đặt/hủy booking với `customer1@hbms.vn`: admin thấy trạng thái phòng/booking cập nhật đúng.

Cần test lại sau deploy:

- Domain `https://dghahai.io.vn`.
- Supabase Auth callback production.
- HTTPS và redirect URL.
- API docs admin-only trên production.

## 9. Yêu Cầu Bắt Buộc Và Trạng Thái

| Yêu cầu | Trạng thái |
| --- | --- |
| Auth | Done |
| CRUD >=3 bảng | Done |
| RLS / phân quyền | Done |
| File upload | Done |
| Responsive UI | Done |
| Docker Compose | Done local |
| GitHub + commits | Done |
| AI prompts >=5 | Done |
| Swagger UI | Done, admin-only |
| Deploy HTTPS | Chưa hoàn tất |
| Báo cáo PDF >=20 trang | Chưa |
| Demo video | Chưa |

## 10. Optional

- Email confirmation.
- VNPay/MoMo sandbox.
- PDF hóa đơn.
- i18n chuẩn bằng `next-intl`.
