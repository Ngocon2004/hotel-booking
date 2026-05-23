# 📋 ĐẶC TẢ DỰ ÁN: WEBSITE QUẢN LÝ ĐẶT PHÒNG KHÁCH SẠN

> Đồ án thi cuối kỳ – Môn: Các công nghệ mới trong phát triển phần mềm  
> Đề tài 3: Hotel Booking Management System (HBMS)

---

## 1. THÔNG TIN CHUNG

- **Tên dự án**: Hotel Booking Management System (HBMS)
- **Stack**:
  - **Frontend**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui
  - **Backend**: Supabase (Auth + PostgreSQL + Storage + Realtime)
  - **Bảo mật**: Row Level Security (RLS)
  - **Deploy**: Docker + Docker Compose + VPS (Domain + SSL)
  - **Source**: GitHub với Conventional Commits
- **Hình thức**: Cá nhân
- **Thời gian**: 6 tuần

---

## 2. YÊU CẦU BẮT BUỘC (theo quy chế thi)

| # | Yêu cầu | Trạng thái |
|---|---------|-----------|
| 1 | Frontend: Next.js (App Router) + Tailwind/shadcn | ⏳ |
| 2 | Backend: Supabase (Auth + DB + Storage hoặc Realtime) | ⏳ |
| 3 | Containerization: Dockerfile + Docker Compose (multi-stage) | ⏳ |
| 4 | Deployment: VPS với Domain + SSL (HTTPS) | ⏳ |
| 5 | Source code: GitHub với Conventional Commits | ⏳ |
| 6 | AI Tool: Sử dụng + minh chứng (>5 prompts) | ⏳ |
| 7 | TypeScript với type annotations rõ ràng | ⏳ |
| 8 | Báo cáo PDF: tối thiểu 20 trang, Times New Roman 13, spacing 1.5 | ⏳ |

### 2.1. Chức năng tối thiểu (theo quy chế)
1. Authentication (đăng ký/đăng nhập/đăng xuất qua Supabase Auth)
2. CRUD dữ liệu (tạo, đọc, cập nhật, xóa)
3. Giao diện đẹp, responsive (Tailwind/shadcn)
4. RLS / Phân quyền chặt chẽ
5. File upload (Supabase Storage)
6. Dockerize (`docker compose up` chạy được)
7. Deploy lên VPS có domain + SSL

---

## 3. ROLES (Phân quyền)

| Role | Quyền |
|------|------|
| **Guest** | Xem danh sách phòng, tìm kiếm, lọc |
| **Customer** | Đặt phòng, hủy, đánh giá, xem lịch sử booking, upload avatar |
| **Admin** | CRUD toàn bộ hệ thống, dashboard thống kê, quản lý booking |

---

## 4. DATABASE SCHEMA (8 bảng chính)

### 4.1. `profiles` (mở rộng auth.users)
```sql
- id            UUID PK (FK → auth.users.id)
- full_name     TEXT
- phone         TEXT
- avatar_url    TEXT
- address       TEXT
- role          TEXT CHECK (role IN ('admin','customer')) DEFAULT 'customer'
- created_at    TIMESTAMPTZ
- updated_at    TIMESTAMPTZ
```

### 4.2. `room_types` (Loại phòng)
```sql
- id              UUID PK
- name            TEXT NOT NULL  -- Standard, Deluxe, Suite, VIP
- slug            TEXT UNIQUE
- description     TEXT
- base_price      DECIMAL(10,2) NOT NULL  -- giá/đêm
- max_occupancy   INT NOT NULL
- amenities       JSONB  -- ['wifi','tv','airconditioner']
- created_at      TIMESTAMPTZ
- updated_at      TIMESTAMPTZ
```

### 4.3. `rooms` (Phòng vật lý)
```sql
- id              UUID PK
- room_number     TEXT UNIQUE NOT NULL  -- "101", "201A"
- room_type_id    UUID FK → room_types.id
- floor           INT
- description     TEXT
- status          TEXT CHECK (status IN ('available','maintenance')) DEFAULT 'available'
- images          JSONB  -- mảng URLs
- created_at      TIMESTAMPTZ
- updated_at      TIMESTAMPTZ
```

### 4.4. `bookings` (Đặt phòng)
```sql
- id                UUID PK
- booking_code      TEXT UNIQUE  -- HTL-20251215-A3F2
- customer_id       UUID FK → profiles.id
- room_id           UUID FK → rooms.id
- check_in_date     DATE NOT NULL
- check_out_date    DATE NOT NULL
- total_guests      INT
- total_price       DECIMAL(10,2)
- status            TEXT CHECK IN ('pending','confirmed','checked_in','checked_out','cancelled')
- payment_status    TEXT CHECK IN ('unpaid','paid','refunded') DEFAULT 'unpaid'
- special_requests  TEXT
- created_at        TIMESTAMPTZ
- updated_at        TIMESTAMPTZ
- CHECK (check_out_date > check_in_date)
```

### 4.5. `payments` (Thanh toán)
```sql
- id              UUID PK
- booking_id      UUID FK → bookings.id
- amount          DECIMAL(10,2)
- method          TEXT  -- 'cash','bank_transfer','momo','vnpay'
- transaction_id  TEXT
- paid_at         TIMESTAMPTZ
```

### 4.6. `reviews` (Đánh giá)
```sql
- id            UUID PK
- booking_id    UUID FK → bookings.id (UNIQUE - 1 booking 1 review)
- customer_id   UUID FK → profiles.id
- rating        INT CHECK (rating BETWEEN 1 AND 5)
- comment       TEXT
- created_at    TIMESTAMPTZ
```

### 4.7. `services` (Dịch vụ kèm theo)
```sql
- id           UUID PK
- name         TEXT  -- giặt ủi, ăn sáng, đưa đón
- description  TEXT
- price        DECIMAL(10,2)
- icon         TEXT
```

### 4.8. `booking_services` (n-n)
```sql
- booking_id        UUID FK
- service_id        UUID FK
- quantity          INT DEFAULT 1
- price_at_booking  DECIMAL(10,2)
- PRIMARY KEY (booking_id, service_id)
```

### 4.9. SQL Function quan trọng
```sql
-- Kiểm tra phòng có trống trong khoảng ngày
CREATE FUNCTION check_room_availability(
  p_room_id UUID, p_check_in DATE, p_check_out DATE
) RETURNS BOOLEAN AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE room_id = p_room_id
      AND status NOT IN ('cancelled','checked_out')
      AND daterange(check_in_date, check_out_date) && daterange(p_check_in, p_check_out)
  );
$$ LANGUAGE SQL STABLE;
```

### 4.10. RLS Policies
- **profiles**: Read public; Update self; Admin update all
- **room_types/rooms**: Read public; Write Admin only
- **bookings**: Customer xem booking của mình; Admin xem all; Insert require auth
- **reviews**: Read public; Write require booking đã `checked_out`
- **payments**: Customer xem của mình; Admin xem all
- **services**: Read public; Write Admin only

---

## 5. CHỨC NĂNG CHI TIẾT

### 5.1. Public (Guest)
- `/` - Trang chủ (hero, search box, featured rooms, testimonials)
- `/rooms` - Danh sách phòng (filter: loại, giá, rating, tiện nghi)
- `/rooms/[id]` - Chi tiết phòng (gallery, mô tả, reviews, form đặt nhanh)
- `/search?check_in=&check_out=&guests=` - Kết quả tìm kiếm

### 5.2. Customer (đã đăng nhập)
- `/booking/[roomId]` - Form đặt phòng
- `/booking/success/[code]` - Xác nhận thành công
- `/my-bookings` - Lịch sử đặt phòng (filter: status)
- `/my-bookings/[id]` - Chi tiết booking + review form
- `/profile` - Cập nhật thông tin + avatar

### 5.3. Admin
- `/admin` - Dashboard (KPIs, charts, quick actions)
- `/admin/room-types` - CRUD loại phòng
- `/admin/rooms` - CRUD phòng (upload ảnh)
- `/admin/bookings` - Quản lý booking (xác nhận, hủy, check-in/out)
- `/admin/customers` - Danh sách khách hàng
- `/admin/reviews` - Quản lý đánh giá (xóa review vi phạm)
- `/admin/services` - CRUD dịch vụ kèm theo

---

## 6. ROADMAP 6 TUẦN

### **Tuần 1: Foundation**
- [x] Tạo SPEC.md
- [ ] Khởi tạo Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] Setup Supabase (project + .env.local)
- [ ] Viết schema.sql (8 bảng + RLS + function)
- [ ] Auth flow (login/register/middleware)
- [ ] Layout chung (Navbar + Footer)

### **Tuần 2: Quản lý Phòng**
- [ ] Admin: CRUD room_types, rooms
- [ ] Upload ảnh lên Supabase Storage
- [ ] Public: trang `/rooms` và `/rooms/[id]`

### **Tuần 3: Booking Flow**
- [ ] Search form với date picker
- [ ] Logic check phòng trống
- [ ] Trang đặt phòng + sinh booking_code
- [ ] Email xác nhận (Supabase Edge Function/Resend)

### **Tuần 4: Quản lý Booking**
- [ ] Customer: lịch sử booking, hủy đặt phòng
- [ ] Admin: xác nhận/hủy/check-in/check-out
- [ ] Trang in phiếu đặt phòng

### **Tuần 5: Tính năng nâng cao**
- [ ] Reviews (rating + comment) sau khi checked_out
- [ ] Realtime status phòng (Supabase Realtime)
- [ ] Dashboard Admin (Recharts: doanh thu, occupancy rate)
- [ ] Filter/Sort/Search nâng cao + Pagination

### **Tuần 6: Polish + Deploy**
- [ ] Dockerfile (multi-stage build) + docker-compose.yml
- [ ] Deploy VPS (Vultr/DigitalOcean) + Nginx + Let's Encrypt SSL
- [ ] GitHub repo với Conventional Commits
- [ ] AI prompts log (phụ lục) - tối thiểu 5 prompts
- [ ] Báo cáo PDF (≥20 trang, Times New Roman 13)
- [ ] Demo video 3-5 phút

---

## 7. CẤU TRÚC THƯ MỤC

```text
hotel-booking/
├── supabase/
│   ├── schema.sql                # Tables + RLS + functions
│   └── seed.sql                  # Data mẫu
├── scripts/
│   └── seed.ts                   # Seed data programmatic
├── docker/
│   └── nginx.conf                # Reverse proxy config
├── docs/
│   ├── ai-prompts.md             # Log prompts đã dùng (>5)
│   └── deployment.md             # Hướng dẫn deploy VPS
├── src/
│   ├── app/
│   │   ├── (auth)/               # login, register, callback
│   │   ├── (public)/             # rooms, search
│   │   ├── (customer)/           # my-bookings, profile, booking
│   │   ├── admin/                # Protected admin area
│   │   ├── actions/              # Server Actions
│   │   └── api/                  # Webhooks
│   ├── components/
│   │   ├── admin/
│   │   ├── booking/              # BookingForm, DateRangePicker
│   │   ├── room/                 # RoomCard, RoomGallery, RoomFilter
│   │   └── ui/                   # shadcn primitives
│   ├── lib/
│   │   ├── supabase/             # client.ts, server.ts, middleware.ts
│   │   ├── utils/                # date, price, slug helpers
│   │   └── validators/           # zod schemas
│   └── types/                    # database.types.ts
├── .env.local
├── Dockerfile
├── docker-compose.yml
├── README.md
└── SPEC.md (file này)
```

---

## 8. TIÊU CHÍ ĐÁNH GIÁ (Definition of Done)

### Bắt buộc (đạt qua môn):
- [x] Auth: register/login/logout
- [x] CRUD đầy đủ trên ít nhất 3 bảng
- [x] RLS hoạt động đúng (test với 2 account khác role)
- [x] File upload lên Supabase Storage
- [x] Responsive (mobile + tablet + desktop)
- [x] Docker chạy được `docker compose up`
- [x] Deploy có URL HTTPS thật
- [x] GitHub repo với commit history rõ ràng
- [x] AI prompts log (phụ lục)
- [x] Báo cáo PDF ≥20 trang

### Nâng cao (đạt giỏi):
- [x] Realtime cập nhật trạng thái phòng
- [x] Dashboard với charts (Recharts)
- [x] Search/Filter nâng cao + Pagination
- [x] Reviews + Rating
- [x] Booking lifecycle đầy đủ (pending → confirmed → checked_in → checked_out)

### Xuất sắc (optional):
- [ ] Thanh toán VNPay/MoMo sandbox
- [ ] PDF hóa đơn (react-pdf)
- [ ] Đa ngôn ngữ (next-intl)
- [ ] Email notification (Resend)

---

## 9. RỦI RO & GIẢI PHÁP

| Rủi ro | Giải pháp |
|--------|-----------|
| Logic kiểm tra trùng lịch booking | SQL function với `daterange && daterange` của PostgreSQL |
| Race condition khi 2 user đặt cùng phòng | Transaction + check trong DB |
| RLS bị bypass | Test với 2-3 account khác role |
| Upload ảnh fail | Validate size/format, dùng signed URL |
| Date timezone sai | dayjs với plugin utc, thống nhất `Asia/Ho_Chi_Minh` |
| Docker build chậm | Multi-stage build + .dockerignore |
| SSL cho VPS phức tạp | Dùng Caddy hoặc certbot tự động |

---

## 10. AI PROMPTS LOG (sẽ cập nhật trong quá trình dev)

> Yêu cầu quy chế: tối thiểu 5 prompts có minh chứng + giải thích lý do dùng.

| # | Prompt | Mục đích | Kết quả |
|---|--------|----------|---------|
| 1 | (sẽ ghi sau) | | |
| 2 | | | |
| ... | | | |
