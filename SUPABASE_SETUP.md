# Huong Dan Setup Supabase Cho HBMS Hotel

File nay tap trung vao phan Supabase theo trang thai hien tai cua project.

## 1. Tao Project Supabase

1. Vao `https://supabase.com/dashboard`.
2. Dang nhap bang GitHub/Google/email.
3. Tao project moi:
   - Name: `hotel-booking`.
   - Region: Singapore neu uu tien gan Viet Nam.
   - Plan: Free.
4. Luu lai database password.

## 2. Chay Database Schema

Trong Supabase Dashboard:

1. Mo **SQL Editor**.
2. Tao query moi.
3. Copy toan bo file:

```text
supabase/schema.sql
```

4. Run query.

Schema hien tai tao:

- 8 bang: `profiles`, `room_types`, `rooms`, `bookings`, `payments`, `reviews`, `services`, `booking_services`.
- RLS policies cho guest/customer/admin.
- Storage buckets `rooms`, `avatars`.
- RPC `check_room_availability`.
- RPC `create_booking_transaction`.
- Triggers auto profile va update timestamp.

## 3. Lay API Keys

Vao **Project Settings > API** va copy:

- Project URL.
- anon public key.
- service_role key.

`service_role key` chi dung cho seed/admin script, khong dua vao client.

## 4. Tao Env Local

Tao `.env.local` tai root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. Cau Hinh Auth

Trong Supabase:

1. Authentication > Providers.
2. Bat Email provider.
3. Co the tat Confirm email de test local nhanh hon.
4. Neu dung Google OAuth:
   - Cau hinh Google Cloud OAuth.
   - Authorized redirect URI o Google la:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

5. Local redirect URL:

```text
http://localhost:3000/auth/callback
```

## 6. Seed Data

Chay:

```bash
npm run seed
```

Seed tao:

- Admin: `admin@hbms.vn` / `Admin123!`.
- Customers: `customer1@hbms.vn` den `customer5@hbms.vn` / `Customer123!`.
- Room types, rooms, services, bookings, reviews.

Can co `SUPABASE_SERVICE_ROLE_KEY` trong `.env.local`.

## 7. Storage

Bucket `rooms`:

- Dung cho anh phong.
- Public read.
- Admin upload/update.

Bucket `avatars`:

- Dung cho avatar user.
- Public read.
- User upload avatar cua minh.

## 8. Realtime

Project dang dung Supabase Realtime cho:

- Booking moi tren admin bookings.
- Room status update tren room pages/admin rooms.

Neu realtime khong chay, kiem tra:

- Realtime da bat cho bang can theo doi.
- Browser console co loi env/session khong.
- User co quyen doc bang theo RLS khong.

## 9. Production / Deploy

Khi co domain:

Cap nhat `.env.production`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Cap nhat Supabase Authentication URL Configuration:

```text
Site URL: https://your-domain.com
Redirect URLs:
https://your-domain.com/auth/callback
```

Sau khi doi `NEXT_PUBLIC_*`, phai build lai Docker image.

## 10. Kiem Tra Nhanh

- Dang ky user moi co profile trong `profiles`.
- Login admin vao duoc `/admin`.
- Customer bi chan khi vao `/admin`.
- Upload anh phong thanh cong.
- Upload avatar thanh cong.
- Dat phong khong trung lich.
- Review chi tao duoc sau check-out.

## 11. Troubleshooting

### Missing Supabase URL/API key

- Kiem tra `.env.local`.
- Restart dev server.
- Hard reload browser.
- Neu trong Docker, build lai image.

### RLS permission denied

- Kiem tra role trong `profiles`.
- Kiem tra user da login.
- Kiem tra policy trong `schema.sql` da chay day du.

### Seed fail

- Kiem tra `SUPABASE_SERVICE_ROLE_KEY`.
- Kiem tra schema da chay.
- Khong seed tren database production can giu du lieu.
