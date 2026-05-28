# HBMS Hotel - Huong Dan Cai Dat

Tai lieu nay phan anh trang thai hien tai cua project sau khi da co booking flow, admin, Docker, Swagger UI va cac tinh nang nang cao.

## 1. Yeu Cau

- Node.js 20.9+ khuyen nghi cho Next.js 16.
- npm.
- Git.
- Tai khoan Supabase.
- Docker Desktop neu can chay container.

## 2. Cai Dependencies

```bash
npm install
```

## 3. Cau Hinh Supabase

Tao project Supabase, sau do chay:

```text
supabase/schema.sql
```

File schema tao:

- 8 bang chinh.
- RLS policies.
- Functions/RPC.
- Triggers.
- Storage buckets `rooms`, `avatars`.

Tao `.env.local`:

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

Tai khoan mau:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hbms.vn` | `Admin123!` |
| Customer | `customer1@hbms.vn` | `Customer123!` |

Seed tao room types, rooms, services, customers, bookings va reviews mau.

## 5. Chay Development

```bash
npm run dev
```

Mo:

- App: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api/openapi`

## 6. Build Production

```bash
npm run lint
npm run build
npm start
```

Trang thai gan nhat:

- `npm.cmd run lint`: pass.
- `npm.cmd run build`: pass.

## 7. Docker

Tao `.env.production`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost
```

Chay:

```bash
docker compose up -d --build
```

Mo:

```text
http://localhost
```

Docker local da pass truoc do, image app khoang `197MB`.

Luu y: voi Next.js, cac bien `NEXT_PUBLIC_*` phai co o thoi diem build Docker vi se duoc inline vao client bundle.

## 8. Cac Route Chinh De Test

### Public

- `/`
- `/rooms`
- `/rooms/[id]`
- `/search`
- `/api-docs`

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

## 9. Viec Can Lam Truoc Khi Nop

1. Test bang trinh duyet theo `docs/manual-testing.md`.
2. Deploy VPS/domain/HTTPS.
3. Cap nhat `README.md` bang production URL.
4. Viet bao cao PDF >=20 trang.
5. Quay demo video 3-5 phut.

## 10. Troubleshooting

### Supabase env bi loi tren browser

- Kiem tra `.env.local`.
- Restart dev server.
- Hard reload trinh duyet vi client bundle cu co the dang bi cache.

### RLS permission denied

- Kiem tra user da login.
- Kiem tra role trong bang `profiles`.
- Kiem tra da chay dung `supabase/schema.sql`.

### Docker da sua env nhung van loi

- Build lai container, khong chi restart:

```bash
docker compose up -d --build
```

### Swagger UI khong hien

- Kiem tra `/api/openapi` co tra JSON khong.
- Kiem tra internet neu browser can tai asset tu `unpkg.com`.
