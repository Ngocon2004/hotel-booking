# 🏨 HBMS Hotel - Hướng dẫn Cài đặt

> Hệ thống quản lý đặt phòng khách sạn xây dựng bằng **Next.js 16 + Supabase**.  
> Đồ án thi cuối kỳ - Các công nghệ mới trong phát triển phần mềm.

---

## 📋 Yêu cầu chuẩn bị

Trước khi bắt đầu, hãy cài đặt:

1. **Node.js** v18.17+ ([Tải tại đây](https://nodejs.org/), chọn LTS)
2. **VSCode** ([Tải](https://code.visualstudio.com/))
3. **Git** ([Tải](https://git-scm.com/))
4. **Tài khoản Supabase** (miễn phí tại [supabase.com](https://supabase.com))

---

## 🚀 Bước 1: Tạo Supabase Project

### 1.1. Tạo project mới

1. Vào [https://supabase.com/dashboard](https://supabase.com/dashboard) → đăng nhập
2. Click **New Project**
3. Điền:
   - **Name**: `hotel-booking` (tuỳ ý)
   - **Database Password**: nhập mật khẩu mạnh (lưu lại!)
   - **Region**: Singapore (gần VN)
4. Click **Create new project** → đợi ~2 phút.

### 1.2. Khởi tạo Database

1. Trong Supabase Dashboard, vào **SQL Editor** (icon `</>`)
2. Click **New Query**
3. Mở file `supabase/schema.sql` trong project, copy TẤT CẢ nội dung
4. Paste vào SQL Editor → click **Run** (hoặc `Ctrl+Enter`)
5. Đợi thông báo ✅ "Success" - DB đã sẵn sàng (có 8 bảng + RLS + functions)

### 1.3. Lấy API Keys

1. Vào **Project Settings** (icon ⚙️) → tab **API**
2. Copy 3 giá trị:
   - **Project URL** (vd: `https://abcxyz.supabase.co`)
   - **anon public key** (chuỗi rất dài bắt đầu bằng `eyJ...`)
   - **service_role key** (chỉ dùng cho seed - ⚠️ KHÔNG để lộ!)

### 1.4. Cấu hình Authentication

1. Vào **Authentication** → **Providers** → đảm bảo **Email** đang Enable
2. *(Quan trọng cho dev)* Click vào **Email** → tắt **Confirm email** → **Save**
   - (Để test cho nhanh, không cần verify email khi đăng ký)
3. *(Tuỳ chọn)* Bật **GitHub OAuth** nếu muốn login bằng GitHub

---

## 💻 Bước 2: Cài đặt Project

### 2.1. Cài dependencies

```bash
cd hotel-booking
npm install
```

### 2.2. Cấu hình `.env.local`

Tạo file `.env.local` ở thư mục gốc với nội dung:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Thay các giá trị placeholder bằng giá trị thật từ **Bước 1.3**.

### 2.3. Chạy Seed (tạo data mẫu)

```bash
npm run seed
```

Sẽ tạo:
- 1 Admin: `admin@hbms.vn` / `Admin123!`
- 5 Customers: `customer1@hbms.vn` đến `customer5@hbms.vn` / `Customer123!`
- 4 loại phòng (Standard, Deluxe, Suite, Presidential)
- 11 phòng vật lý
- 6 dịch vụ kèm theo
- 10 bookings + reviews mẫu

---

## 🏃 Bước 3: Chạy Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### Test các tính năng:

| Action | Cách thực hiện |
|--------|---------------|
| Đăng ký | Click "Đăng ký" → tạo tài khoản mới |
| Đăng nhập Admin | `admin@hbms.vn` / `Admin123!` → vào `/admin` |
| Đăng nhập Customer | `customer1@hbms.vn` / `Customer123!` |
| Xem phòng | Vào `/rooms` |
| Đặt phòng | Click 1 phòng → "Đặt ngay" (cần đăng nhập) |
| Lịch sử booking | `/my-bookings` (sau khi login) |

---

## 🛠️ Bước 4: Build Production

```bash
npm run build
npm start
```

---

## 🐳 Bước 5: Docker

```bash
docker compose up -d --build
```

Dockerfile + docker-compose.yml đã có. Local smoke test đã pass ngày 2026-05-27, image `hotel-booking-app:latest` khoảng 194MB.

---

## ❓ Troubleshooting

### Lỗi "Missing env vars"
- Kiểm tra `.env.local` có đúng path không (phải nằm trong thư mục gốc `hotel-booking/`)
- Kiểm tra format: không có space, không có dấu ngoặc kép thừa.
- Restart `npm run dev` sau khi sửa.

### Lỗi "Email rate limit exceeded" khi đăng ký
- Trong Supabase Dashboard, **Authentication** → **Providers** → **Email** → tắt **Confirm email**.

### Lỗi RLS "permission denied"
- Đảm bảo đã chạy `schema.sql` thành công (kiểm tra trong **Table Editor** thấy đủ 8 bảng).
- Tạo Admin: `UPDATE profiles SET role = 'admin' WHERE id = '<your-uuid>';`

### Lỗi "cannot find module @/..."
- Restart TS server: VSCode → `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

## 📚 Cấu trúc thư mục

```
hotel-booking/
├── supabase/schema.sql       # DB schema + RLS
├── scripts/seed.ts           # Data mẫu
├── src/
│   ├── app/
│   │   ├── (public)/         # Trang công khai (có Navbar/Footer)
│   │   ├── auth/             # login, register
│   │   ├── admin/            # (sẽ tạo Tuần 2+)
│   │   ├── actions/          # Server Actions
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── ui/               # shadcn components
│   ├── lib/
│   │   ├── supabase/         # client.ts, server.ts, middleware.ts
│   │   ├── utils/            # format.ts
│   │   └── validators/       # zod schemas
│   ├── types/database.ts
│   └── proxy.ts              # Next.js 16 Proxy (replaces middleware)
├── docs/                     # AI prompts log, deployment guide
├── SPEC.md                   # Đặc tả dự án
└── SETUP_GUIDE.md            # File này
```

---

## 🎯 Tiến độ Tuần 1 (đã xong)

- [x] Khởi tạo Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui
- [x] Cài Supabase SSR client
- [x] Database schema 8 bảng + RLS Policies + SQL Functions
- [x] Trigger tự tạo profile khi đăng ký
- [x] Storage buckets (rooms, avatars)
- [x] Auth flow: Login + Register (Server Actions + zod validation)
- [x] Proxy (middleware) bảo vệ `/admin`
- [x] Layout: Navbar (với dropdown user menu), Footer, Trang chủ Hero
- [x] Seed script với data mẫu phong phú

## 📅 Tuần 2 (đã xong)

- [x] Trang `/rooms` - danh sách phòng public
- [x] Trang `/rooms/[id]` - chi tiết phòng
- [x] `/admin/room-types` - CRUD loại phòng
- [x] `/admin/rooms` - CRUD phòng + upload ảnh

## 📅 Tuần 3-4 (core đã xong)

- [x] Search phòng theo ngày/số khách
- [x] Booking flow + confirmation code
- [x] Customer xem/hủy booking
- [x] Admin quản lý lifecycle booking
- [x] Trang in phiếu booking

## 📅 Tuần 5-6 (còn lại)

- [ ] Tính năng nâng cao nếu còn thời gian: reviews, services CRUD, profile, realtime, dashboard, pagination
- [ ] Deploy VPS/domain/HTTPS (làm sau cùng)
- [ ] Báo cáo PDF tối thiểu 20 trang (làm sau cùng)
- [ ] Demo video 3-5 phút (làm sau cùng)

---

**Chúc bạn code vui vẻ!** 🚀
