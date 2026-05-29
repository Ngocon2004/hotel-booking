# Hướng Dẫn Setup Supabase Cho HBMS Hotel

File này tập trung vào phần Supabase theo trạng thái hiện tại của project.

## 1. Tạo Project Supabase

1. Vào `https://supabase.com/dashboard`.
2. Đăng nhập bằng GitHub/Google/email.
3. Tạo project mới:
   - Name: `hotel-booking`.
   - Region: Singapore nếu ưu tiên gần Việt Nam.
   - Plan: Free.
4. Lưu lại database password.

## 2. Chạy Database Schema

Trong Supabase Dashboard:

1. Mở **SQL Editor**.
2. Tạo query mới.
3. Copy toàn bộ file:

```text
supabase/schema.sql
```

4. Run query.

Schema hiện tại tạo:

- 8 bảng: `profiles`, `room_types`, `rooms`, `bookings`, `payments`, `reviews`, `services`, `booking_services`.
- RLS policies cho guest/customer/admin.
- Storage buckets `rooms`, `avatars`.
- RPC `check_room_availability`.
- RPC `create_booking_transaction`.
- Triggers auto profile và update timestamp.

## 3. Lấy API Keys

Vào **Project Settings > API** và copy:

- Project URL.
- anon public key.
- service_role key.

`service_role key` chỉ dùng cho seed/admin script, không đưa vào client.

## 4. Tạo Env Local

Tạo `.env.local` tại root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. Cấu Hình Auth

Trong Supabase:

1. Authentication > Providers.
2. Bật Email provider.
3. Có thể tắt Confirm email để test local nhanh hơn.
4. Nếu dùng Google OAuth:
   - Cấu hình Google Cloud OAuth.
   - Authorized redirect URI ở Google là:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

5. Local redirect URL:

```text
http://localhost:3000/auth/callback
```

## 6. Seed Data

Chạy:

```bash
npm run seed
```

Seed tạo:

- Admin: `admin@hbms.vn` / `Admin123!`.
- Customers: `customer1@hbms.vn` đến `customer5@hbms.vn` / `Customer123!`.
- Room types, rooms, services, bookings, reviews.

Cần có `SUPABASE_SERVICE_ROLE_KEY` trong `.env.local`.

## 7. Storage

Bucket `rooms`:

- Dùng cho ảnh phòng.
- Public read.
- Admin upload/update.

Bucket `avatars`:

- Dùng cho avatar user.
- Public read.
- User upload avatar của mình.

## 8. Realtime

Project đang dùng Supabase Realtime cho:

- Booking mới trên admin bookings.
- Room status update trên room pages/admin rooms.

Đã test với `customer1@hbms.vn`: customer đặt và hủy booking, admin thấy trạng thái cập nhật đúng.

Nếu realtime không chạy, kiểm tra:

- Realtime đã bật cho bảng cần theo dõi.
- Browser console có lỗi env/session không.
- User có quyền đọc bảng theo RLS không.

## 9. Production / Deploy

Domain đã chuẩn bị: `dghahai.io.vn`.

Cập nhật `.env` trên VPS:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://dghahai.io.vn
```

Cập nhật Supabase Authentication URL Configuration:

```text
Site URL: https://dghahai.io.vn
Redirect URLs:
https://dghahai.io.vn/auth/callback
```

Sau khi đổi `NEXT_PUBLIC_*`, phải build lại Docker image:

```bash
docker compose up -d --build
```

Nếu OAuth bị redirect về `0.0.0.0`, kiểm tra lại `NEXT_PUBLIC_SITE_URL`, Supabase Site URL, Redirect URLs và rebuild container.

## 10. Kiểm Tra Nhanh

- Đăng ký user mới có profile trong `profiles`.
- Login admin vào được `/admin`.
- Customer bị chặn khi vào `/admin`.
- Customer bị chặn khi vào `/api-docs` và `/api/openapi`.
- Admin xem được `/api-docs` và `/api/openapi`.
- Upload ảnh phòng thành công.
- Upload avatar thành công.
- Đặt phòng không trùng lịch.
- Review chỉ tạo được sau check-out.

## 11. Troubleshooting

### Missing Supabase URL/API key

- Kiểm tra `.env.local` hoặc `.env` trên VPS.
- Restart dev server.
- Hard reload browser.
- Nếu trong Docker, build lại image.

### RLS permission denied

- Kiểm tra role trong `profiles`.
- Kiểm tra user đã login.
- Kiểm tra policy trong `schema.sql` đã chạy đầy đủ.

### Seed fail

- Kiểm tra `SUPABASE_SERVICE_ROLE_KEY`.
- Kiểm tra schema đã chạy.
- Không seed trên database production cần giữ dữ liệu.
