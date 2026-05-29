# HBMS Hotel - Hướng Dẫn Cài Đặt

Tài liệu này phản ánh trạng thái hiện tại của project sau khi đã có booking flow, admin, Docker, Swagger UI admin-only, About page, realtime và các tính năng nâng cao.

## 1. Yêu Cầu

- Node.js 20.9+ khuyến nghị cho Next.js 16.
- npm.
- Git.
- Tài khoản Supabase.
- Docker Desktop nếu cần chạy container.

## 2. Cài Dependencies

```bash
npm install
```

## 3. Cấu Hình Supabase

Tạo project Supabase, sau đó chạy:

```text
supabase/schema.sql
```

File schema tạo:

- 8 bảng chính.
- RLS policies.
- Functions/RPC.
- Triggers.
- Storage buckets `rooms`, `avatars`.

Tạo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Seed Data

```bash
npm run seed
```

Tài khoản mẫu:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hbms.vn` | `Admin123!` |
| Customer | `customer1@hbms.vn` | `Customer123!` |

Seed tạo room types, rooms, services, customers, bookings và reviews mẫu.

## 5. Chạy Development

```bash
npm run dev
```

Mở:

- App: `http://localhost:3000`
- Swagger UI admin-only: `http://localhost:3000/api-docs`
- OpenAPI JSON admin-only: `http://localhost:3000/api/openapi`

Muốn xem API docs phải đăng nhập bằng tài khoản admin `admin@hbms.vn`.

## 6. Build Production

```bash
npm run lint
npm run build
npm start
```

Trạng thái gần nhất:

- `npm.cmd run lint`: pass.
- `npm.cmd run build`: pass.

## 7. Docker

Tạo `.env`:

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

Mở:

```text
http://localhost:3000
```

Docker local đã pass trước đó, image app khoảng `197MB`.

Lưu ý: với Next.js, các biến `NEXT_PUBLIC_*` phải có ở thời điểm build Docker vì sẽ được inline vào client bundle.

## 8. Các Route Chính Để Test

### Public

- `/`
- `/about`
- `/rooms`
- `/rooms/[id]`
- `/search`

### Auth / Customer

- `/auth/login`
- `/auth/register`
- `/my-bookings`
- `/profile`
- `/booking/[roomId]`

### Admin

- `/admin`
- `/admin/rooms`
- `/admin/room-types`
- `/admin/bookings`
- `/admin/customers`
- `/admin/services`
- `/admin/reviews`
- `/api-docs`
- `/api/openapi`

## 9. Việc Cần Làm Trước Khi Nộp

1. Viết báo cáo PDF >=20 trang.
2. Quay demo video 3-5 phút.
3. Chụp screenshot production `https://hbms.dghahai.io.vn/` để đưa vào báo cáo.

## 10. Troubleshooting

### Supabase env bị lỗi trên browser

- Kiểm tra `.env.local`.
- Restart dev server.
- Hard reload trình duyệt vì client bundle cũ có thể đang bị cache.

### RLS permission denied

- Kiểm tra user đã login.
- Kiểm tra role trong bảng `profiles`.
- Kiểm tra đã chạy đúng `supabase/schema.sql`.

### Docker đã sửa env nhưng vẫn lỗi

- Build lại container, không chỉ restart:

```bash
docker compose up -d --build
```

### Swagger UI không hiện

- Đăng nhập bằng tài khoản admin.
- Kiểm tra `/api/openapi` bằng tài khoản admin.
- Nếu đang dùng VPS, kiểm tra `NEXT_PUBLIC_SITE_URL` và Supabase redirect URL.
