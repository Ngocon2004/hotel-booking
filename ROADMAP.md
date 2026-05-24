# 🗺️ ROADMAP - Hotel Booking Management System (HBMS)

> Đồ án thi cuối kỳ — Các công nghệ mới trong phát triển phần mềm
> Đề tài 3: Website quản lý đặt phòng khách sạn
> Cập nhật: 2026-05-24

---

## 📊 Tổng quan tiến độ

```
[██████████████████░░░░░░░░░] 70% (Tuần 4 core xong, Tuần 6 Docker đã chuẩn bị)
```

| Tuần | Chủ đề | Trạng thái | Ghi chú |
|------|--------|-----------|---------|
| **Tuần 1** | Foundation (Auth + Schema + Layout) | ✅ **DONE** | Commit `6816b8f` |
| **Tuần 2** | Quản lý phòng (Admin CRUD + Public) | ✅ **DONE** | Commit `090fdb7` |
| **Tuần 3** | Booking Flow (Search + Đặt phòng) | ✅ **DONE** | Build pass |
| **Tuần 4** | Quản lý booking (Lifecycle) | ✅ **DONE (core)** | Cần verify manual trên dữ liệu thật |
| **Tuần 5** | Tính năng nâng cao (Reviews, Realtime, Dashboard) | ⏸️ Pending | |
| **Tuần 6** | Polish + Docker + Deploy + Báo cáo | 🟠 **IN PROGRESS** | Docker files đã có, deploy/báo cáo chưa |

---

## 🎯 Yêu cầu BẮT BUỘC theo quy chế thi

| # | Yêu cầu | Trạng thái | Tuần |
|---|---------|-----------|------|
| 1 | Frontend: Next.js 16 + Tailwind v4 + shadcn/ui | ✅ Done | T1 |
| 2 | Backend: Supabase (Auth + DB + Storage) | ✅ Done | T1 |
| 3 | **Docker + Compose** (multi-stage) | 🟠 Đã tạo file, smoke test để sau | T6 |
| 4 | **VPS + Domain + SSL** (HTTPS) | ❌ Chưa | T6 |
| 5 | GitHub + Conventional Commits | ✅ Đang làm | T1-T6 |
| 6 | AI Tool minh chứng ≥5 prompts | ✅ Done (10+ prompts) | T1-T6 |
| 7 | TypeScript với types rõ ràng | ✅ Done | T1 |
| 8 | **Báo cáo PDF ≥20 trang** (Times New Roman 13) | ❌ Chưa | T6 |
| 9 | RLS / Phân quyền chặt chẽ | ✅ Done (schema.sql) | T1 |
| 10 | File upload (Supabase Storage) | ✅ Done | T2 |
| 11 | Responsive (mobile + tablet + desktop) | ✅ Done | T1-T2 |

**⚠️ Còn 3 yêu cầu BẮT BUỘC cần hoàn tất trước khi nộp:**
- Docker + Compose (đã tạo file, smoke test để sau khi bật Docker Desktop)
- VPS Deploy + SSL
- Báo cáo PDF

---

## ✅ ĐÃ HOÀN THÀNH

### 🟢 Tuần 1 — Foundation (commit `6816b8f`)

#### Cấu hình & Setup
- [x] Khởi tạo Next.js 16 + React 19 + TypeScript + Turbopack
- [x] Tailwind CSS v4 + shadcn/ui (base-ui thay Radix)
- [x] Cấu trúc thư mục `src/app`, `src/components`, `src/lib`, `src/types`
- [x] Cài thư viện: `@supabase/ssr`, `zod`, `dayjs`, `recharts`, `react-day-picker`, `sonner`, `lucide-react`
- [x] File `.env.example` mẫu
- [x] `package.json` với script `seed`

#### Database (Supabase)
- [x] `supabase/schema.sql` (>400 dòng) gồm:
  - [x] 8 bảng: `profiles`, `room_types`, `rooms`, `bookings`, `payments`, `reviews`, `services`, `booking_services`
  - [x] Indexes phù hợp cho từng bảng
  - [x] CHECK constraints (rating 1-5, status enum, date overlap)
  - [x] **RLS policies** cho từng role (admin/customer/guest)
  - [x] Helper function `is_admin(uuid)`
  - [x] SQL function `check_room_availability(room_id, check_in, check_out)` dùng `daterange && daterange`
  - [x] Trigger `handle_new_user` auto tạo profile khi đăng ký
  - [x] Trigger `update_updated_at_column` cho `updated_at`
  - [x] Storage buckets: `rooms` (public), `avatars` (public) + policies

#### Supabase Client
- [x] `src/lib/supabase/client.ts` — browser client
- [x] `src/lib/supabase/server.ts` — server component client (cookies async)
- [x] `src/lib/supabase/middleware.ts` — session refresh helper
- [x] `src/proxy.ts` (Next.js 16 thay `middleware.ts`) — bảo vệ `/admin`, matcher loại trừ static

#### Auth Flow
- [x] `src/lib/validators/auth.ts` — zod `loginSchema`, `registerSchema`
- [x] `src/server/actions/auth.ts` — Server Actions: `login`, `register`, `logout`
- [x] `src/app/(auth)/auth/login/page.tsx` + `login-form.tsx` (Suspense + `useActionState`)
- [x] `src/app/(auth)/auth/register/page.tsx`
- [x] `src/app/(auth)/auth/layout.tsx`
- [x] Magic link email + Google OAuth qua Supabase (`src/app/(auth)/auth/callback/route.ts`)
- [x] Đã test Google OAuth và phân quyền admin với tài khoản Google

#### Layout chung
- [x] `src/app/layout.tsx` — Root layout (font, metadata, Toaster)
- [x] `src/app/(public)/layout.tsx` — public layout có Navbar + Footer
- [x] `src/components/layout/navbar.tsx` — dropdown user menu (login/logout, admin link)
- [x] `src/components/layout/footer.tsx`
- [x] `src/app/(public)/page.tsx` — Trang chủ Hero + Features + CTA

#### Seed Data
- [x] `scripts/seed.ts` (faker-js) — sinh:
  - 1 Admin: `admin@hbms.vn` / `Admin123!`
  - 5 Customers: `customer1-5@hbms.vn` / `Customer123!`
  - 4 loại phòng, 11 phòng vật lý, 6 dịch vụ
  - 10 bookings + reviews mẫu

#### Documentation
- [x] `SPEC.md` (đặc tả chi tiết)
- [x] `SETUP_GUIDE.md`
- [x] `SUPABASE_SETUP.md` (cực chi tiết từng bước)
- [x] `README.md`
- [x] `docs/ai-prompts.md` (đã có 10+ prompts)

---

### 🟢 Tuần 2 — Quản lý Phòng (commit `090fdb7`)

#### Admin Layout & Dashboard
- [x] `src/app/(admin)/admin/layout.tsx` — double-check role admin, redirect nếu không phải
- [x] `src/components/admin/sidebar.tsx` — 7 menu items, highlight active route
- [x] `src/app/(admin)/admin/page.tsx` — Dashboard với 4 KPI cards + doanh thu + recent bookings + quick actions

#### CRUD Room Types
- [x] `src/lib/validators/room.ts` — zod schemas + `AMENITIES_OPTIONS` (12 amenities) + helper `getAmenityLabel`
- [x] `src/server/actions/room-types.ts` — `createRoomType`, `updateRoomType`, `deleteRoomType` + `requireAdmin()` guard
- [x] `src/components/admin/room-type-form.tsx` — reusable form (create + edit), multi-select amenities grid
- [x] `src/app/(admin)/admin/room-types/page.tsx` — danh sách
- [x] `src/app/(admin)/admin/room-types/new/page.tsx` — thêm
- [x] `src/app/(admin)/admin/room-types/[id]/edit/page.tsx` — sửa
- [x] `src/app/(admin)/admin/room-types/delete-button.tsx` — confirm dialog xoá

#### CRUD Rooms + Upload ảnh
- [x] `src/server/actions/rooms.ts` — CRUD + `uploadRoomImage()` (validate jpg/png/webp ≤5MB)
- [x] `src/components/admin/image-uploader.tsx` — multi-upload, preview grid, hidden inputs
- [x] `src/components/admin/room-form.tsx` — reusable
- [x] `src/app/(admin)/admin/rooms/{page,new,[id]/edit,delete-button}.tsx`
- [x] Upload trực tiếp lên Supabase Storage bucket `rooms` với `crypto.randomUUID()` tránh conflict

#### Public Catalog
- [x] `src/app/(public)/rooms/page.tsx` — danh sách + filter (loại, giá, sort) qua URL searchParams
- [x] `src/components/rooms/rooms-filter.tsx` — `useRouter` + `useSearchParams` + `useTransition`
- [x] `src/components/rooms/room-card.tsx` — cover image + rating badge + amenities preview
- [x] `src/app/(public)/rooms/[id]/page.tsx` — chi tiết phòng
- [x] `src/components/rooms/room-gallery.tsx` — gallery + lightbox
- [x] `src/components/rooms/book-quick-form.tsx` — form đặt nhanh (UI thôi, chưa submit được)
- [x] Tính rating trung bình từ reviews qua 2-step query (tránh nested type error)

#### Utilities
- [x] `src/lib/utils/format.ts` — `formatCurrency`, `formatDate`, helpers
- [x] `src/types/database.ts` — types cho 8 bảng

#### UI Components (shadcn)
- [x] `button`, `card`, `input`, `label`, `select`, `textarea`, `badge`
- [x] `dialog`, `popover`, `sheet`, `tabs`, `dropdown-menu`
- [x] `avatar`, `calendar`, `separator`, `skeleton`, `sonner`, `table`

---

## 🔴 ĐANG CHỜ HOÀN THÀNH

### 🟠 Tuần 3 — Booking Flow (TIẾP THEO)

> **Mục tiêu:** Khách có thể tìm phòng theo ngày, đặt phòng, nhận confirmation.

#### 3.1. Search form
- [x] `src/components/booking/search-form.tsx` — date inputs (check-in, check-out) + guests selector
- [x] Tích hợp vào Hero trang chủ
- [x] Tích hợp vào Navbar (compact version)
- [x] Validate: check_out > check_in, không cho chọn ngày quá khứ

#### 3.2. Trang search results
- [x] `src/app/(public)/search/page.tsx` — URL `?check_in=&check_out=&guests=`
- [x] Query phòng available qua SQL function `get_available_rooms` / `check_room_availability`
- [x] Filter thêm theo loại phòng, giá
- [x] Hiển thị kết quả dạng grid card + nút "Đặt ngay"
- [x] Empty state khi không có phòng trống

#### 3.3. Trang đặt phòng
- [x] `src/app/(public)/booking/[roomId]/page.tsx` — protected (require login)
- [x] `src/components/booking/booking-form.tsx`:
  - [x] Hiển thị thông tin phòng + ngày + tổng tiền
  - [x] Chọn dịch vụ kèm theo (services)
  - [x] Special requests textarea
  - [x] Tính tổng tiền real-time (room + services)
- [x] `src/lib/validators/booking.ts` — zod schema
- [x] `src/server/actions/bookings.ts`:
  - [x] `createBooking()` — check available lần nữa, insert booking + booking_services, sinh `booking_code`
  - [x] Helper sinh booking code: `HTL-YYYYMMDD-XXXX` (4 ký tự hex random)
  - [x] Transaction/RPC để tránh race condition tuyệt đối (`create_booking_transaction`)

#### 3.4. Trang confirmation
- [x] `src/app/(public)/booking/success/[code]/page.tsx` — hiển thị booking_code + chi tiết
- [ ] Email confirmation (optional, có thể để Tuần 5)

#### 3.5. Fix book-quick-form ở trang chi tiết
- [x] Connect `src/components/rooms/book-quick-form.tsx` với booking flow thật
- [x] Date picker thay vì input text
- [x] Validate available trước khi cho submit

#### 3.6. AI Prompts mới
- [x] Prompt #11 trong `docs/ai-prompts.md`: Logic check phòng trống real-time
- [x] Prompt #12: Booking flow + sinh code

---

### 🟡 Tuần 4 — Quản lý Booking Lifecycle

> **Mục tiêu:** Customer xem/huỷ booking, Admin quản lý vòng đời booking.

#### 4.1. Customer booking management
- [x] `src/app/(public)/my-bookings/page.tsx` — lịch sử booking + filter status (pending/confirmed/checked_in/checked_out/cancelled)
- [x] `src/app/(public)/my-bookings/[id]/page.tsx` — chi tiết booking
- [x] `src/server/actions/bookings.ts::cancelBooking()` — chỉ cho phép huỷ khi `pending` hoặc trước check_in 24h
- [x] Hiển thị status badge với màu sắc khác nhau

#### 4.2. Admin booking management
- [x] `src/app/(admin)/admin/bookings/page.tsx` — table tất cả booking + filter/search
- [x] `src/app/(admin)/admin/bookings/[id]/page.tsx` — chi tiết + action buttons
- [x] Actions:
  - [x] `confirmBooking()` — pending → confirmed
  - [x] `checkInBooking()` — confirmed → checked_in
  - [x] `checkOutBooking()` — checked_in → checked_out
  - [x] `cancelBookingAdmin()` — admin huỷ
- [x] Cập nhật `payment_status` khi checkout/cancel

#### 4.3. Customers management
- [x] `src/app/(admin)/admin/customers/page.tsx` — danh sách + search
- [x] `src/app/(admin)/admin/customers/[id]/page.tsx` — chi tiết khách + booking history

#### 4.4. Print booking invoice
- [x] `src/app/(public)/booking/[roomId]/print/page.tsx` — layout in (print stylesheet)
- [x] Nút "In phiếu" trong trang detail

---

### 🟡 Tuần 5 — Tính năng nâng cao

> **Mục tiêu:** Reviews, Realtime, Dashboard với charts, Pagination.

#### 5.1. Reviews
- [ ] `src/server/actions/reviews.ts` — `createReview()` chỉ cho phép khi booking `checked_out`
- [ ] `src/components/review/review-form.tsx` — star rating + comment
- [ ] Tích hợp vào `/my-bookings/[id]` (sau khi check_out)
- [ ] `src/app/(admin)/admin/reviews/page.tsx` — quản lý + xoá review vi phạm
- [ ] Hiển thị reviews trong `/rooms/[id]` (đã có, cần verify)

#### 5.2. Services CRUD
- [ ] `src/server/actions/services.ts`
- [ ] `src/components/admin/service-form.tsx`
- [ ] `src/app/(admin)/admin/services/{page,new,[id]/edit}.tsx`

#### 5.3. Profile
- [ ] `src/app/profile/page.tsx` — update full_name, phone, address
- [ ] Upload avatar lên Supabase Storage bucket `avatars`
- [ ] `src/server/actions/profile.ts`

#### 5.4. Realtime
- [ ] Supabase Realtime subscription cho `rooms.status` (available/maintenance)
- [ ] Trang `/admin/bookings` realtime update khi có booking mới (toast notification)
- [ ] Trang `/rooms/[id]` realtime cập nhật available

#### 5.5. Dashboard Admin với Recharts
- [ ] Biểu đồ doanh thu theo tháng (LineChart hoặc BarChart)
- [ ] Biểu đồ occupancy rate (% phòng được đặt)
- [ ] Phân bố booking theo trạng thái (PieChart)
- [ ] Top 5 loại phòng được đặt nhiều nhất

#### 5.6. Pagination + Search nâng cao
- [ ] Pagination component reusable
- [ ] Áp dụng cho `/rooms`, `/admin/bookings`, `/admin/customers`, `/admin/reviews`
- [ ] Search debounced với `useTransition`

---

### 🔴 Tuần 6 — Polish + Docker + Deploy + Báo cáo

> **Mục tiêu:** Hoàn thiện yêu cầu BẮT BUỘC còn lại.

#### 6.1. Docker (⚠️ BẮT BUỘC)
- [x] `Dockerfile` multi-stage build:
  - [x] Stage 1: `node:20-alpine` install deps
  - [x] Stage 2: build Next.js standalone
  - [x] Stage 3: production runner
- [x] `.dockerignore`
- [x] `docker-compose.yml` (Next.js + Nginx reverse proxy)
- [ ] Test: `docker compose up -d --build` chạy được local (để sau theo quyết định hiện tại)
- [ ] Tối ưu image size (target < 200MB)

#### 6.2. Nginx + SSL
- [x] `docker/nginx.conf` — reverse proxy → Next.js port 3000
- [ ] Cấu hình Let's Encrypt (certbot hoặc Caddy auto SSL)
- [ ] HTTPS redirect

#### 6.3. VPS Deploy (⚠️ BẮT BUỘC)
- [ ] Mua domain (`.com`, `.vn` hoặc free `.tk`)
- [ ] Thuê VPS (Vultr/DigitalOcean/Contabo ~$5/month)
- [ ] SSH setup + firewall (ufw)
- [ ] Clone repo + tạo `.env.production`
- [ ] `docker compose up -d`
- [ ] Trỏ DNS A record → IP VPS
- [ ] SSL cert via Let's Encrypt
- [ ] Test domain HTTPS hoạt động
- [x] `docs/deployment.md` — ghi lại quá trình

#### 6.4. AI Prompts Log (⚠️ BẮT BUỘC ≥5)
- [x] Đã có 10+ prompts ✅
- [ ] Cập nhật thêm prompts từ Tuần 3-6
- [ ] Verify mỗi prompt có: ngữ cảnh, prompt, lý do, kết quả

#### 6.5. Báo cáo PDF (⚠️ BẮT BUỘC ≥20 trang)
- [ ] Trang bìa
- [ ] Mục lục
- [ ] **Chương 1: Tổng quan** (3-4 trang)
  - Giới thiệu đề tài, mục tiêu, phạm vi
  - Công nghệ sử dụng
- [ ] **Chương 2: Phân tích & Thiết kế** (5-6 trang)
  - Use case diagram
  - ERD database
  - Sequence diagram (booking flow)
  - Wireframes/Screenshots
- [ ] **Chương 3: Triển khai** (6-8 trang)
  - Setup môi trường
  - Auth flow code snippets
  - Booking logic
  - RLS policies
  - Docker config
- [ ] **Chương 4: Kết quả** (3-4 trang)
  - Screenshots các trang
  - Test cases
- [ ] **Chương 5: Kết luận** (1-2 trang)
- [ ] **Phụ lục: AI Prompts Log** (>5 prompts)
- [ ] Format: Times New Roman 13, spacing 1.5
- [ ] Convert sang PDF

#### 6.6. Demo Video (3-5 phút)
- [ ] Quay screen recording các flow:
  - Đăng ký + đăng nhập
  - Tìm phòng + đặt phòng
  - Admin quản lý
  - Realtime demo
- [ ] Voice-over hoặc subtitle
- [ ] Upload YouTube unlisted

#### 6.7. Final Polish
- [ ] Loading states cho tất cả pages
- [ ] Error boundaries
- [ ] 404 page custom
- [ ] SEO meta tags
- [ ] Open Graph tags
- [ ] Favicon
- [ ] Accessibility audit (alt text, aria-labels)

---

## 📦 Stack công nghệ đã cài

| Package | Version | Mục đích |
|---------|---------|----------|
| `next` | 16.2.6 | Framework |
| `react` | 19.2.4 | UI library |
| `@supabase/ssr` | 0.10.3 | Supabase SSR |
| `@supabase/supabase-js` | 2.106.1 | Supabase client |
| `@base-ui/react` | 1.5.0 | shadcn primitives |
| `zod` | 4.4.3 | Validation |
| `dayjs` | 1.11.20 | Date utils |
| `react-day-picker` | 9.14.0 | Date picker |
| `recharts` | 3.8.1 | Charts (T5) |
| `sonner` | 2.0.7 | Toast |
| `lucide-react` | 1.16.0 | Icons |
| `tailwindcss` | 4.x | Styling |
| `@faker-js/faker` | 10.4.0 | Seed data |

---

## 🗄️ Database Tables Status

| Bảng | Schema | RLS | Seed | Sử dụng (UI) |
|------|--------|-----|------|-------------|
| `profiles` | ✅ | ✅ | ✅ | ✅ (auth, navbar) |
| `room_types` | ✅ | ✅ | ✅ | ✅ (admin CRUD) |
| `rooms` | ✅ | ✅ | ✅ | ✅ (admin + public) |
| `bookings` | ✅ | ✅ | ✅ | ✅ (booking flow + lifecycle) |
| `payments` | ✅ | ✅ | ⏳ | ⏳ T5/optional |
| `reviews` | ✅ | ✅ | ✅ | ⏳ T5 |
| `services` | ✅ | ✅ | ✅ | ⏳ T3/T5 |
| `booking_services` | ✅ | ✅ | ⏳ | ⏳ T3 |

---

## 🛡️ RLS Policies Coverage

| Bảng | Read | Insert | Update | Delete |
|------|------|--------|--------|--------|
| `profiles` | Public | Auto (trigger) | Self / Admin | Admin |
| `room_types` | Public | Admin | Admin | Admin |
| `rooms` | Public | Admin | Admin | Admin |
| `bookings` | Self / Admin | Auth | Self (cancel) / Admin | Admin |
| `payments` | Self / Admin | Admin | Admin | Admin |
| `reviews` | Public | Auth (checked_out) | Self | Self / Admin |
| `services` | Public | Admin | Admin | Admin |
| `booking_services` | Self / Admin | Auth | Admin | Admin |

---

## 🤖 AI Prompts Log Status

| # | Prompt | Tuần | Status |
|---|--------|------|--------|
| 1 | Lập kế hoạch dự án | T1 | ✅ |
| 2 | Thiết kế Database Schema | T1 | ✅ |
| 3 | Setup Next.js 16 + Supabase SSR | T1 | ✅ |
| 4 | Form Login/Register | T1 | ✅ |
| 5 | Fix TypeScript base-ui + react-day-picker | T1 | ✅ |
| 6 | Admin layout + dashboard | T2 | ✅ |
| 7 | CRUD form Room Types | T2 | ✅ |
| 8 | Image Uploader Supabase Storage | T2 | ✅ |
| 9 | Trang public /rooms với filter | T2 | ✅ |
| 10 | Fix TypeScript "excessively deep" | T2 | ✅ |
| 11 | Logic check phòng trống | T3 | ✅ |
| 12 | Booking flow + sinh code | T3 | ✅ |
| 13+ | (sẽ cập nhật) | T4-T6 | ⏳ |

**Đã đạt ≥5 prompts (yêu cầu quy chế) ✅**

---

## 📋 Definition of Done (Tiêu chí đánh giá)

### Bắt buộc (đạt qua môn)
- [x] Auth: register/login/logout
- [x] CRUD đầy đủ trên ≥3 bảng (room_types, rooms, sắp tới bookings)
- [x] RLS hoạt động đúng (test với 2 role)
- [x] File upload Supabase Storage
- [x] Responsive
- [ ] **Docker chạy được `docker compose up`** ⚠️ (đã có file, chờ test)
- [ ] **Deploy có URL HTTPS** ⚠️
- [x] GitHub commit history
- [x] AI prompts log (đã có 10+)
- [ ] **Báo cáo PDF ≥20 trang** ⚠️

### Nâng cao (đạt giỏi)
- [ ] Realtime cập nhật trạng thái phòng (T5)
- [ ] Dashboard với Recharts (T5)
- [ ] Search/Filter nâng cao + Pagination (T5)
- [ ] Reviews + Rating (T5)
- [x] Booking lifecycle đầy đủ (T3-T4 core)

### Xuất sắc (optional)
- [ ] Thanh toán VNPay/MoMo sandbox
- [ ] PDF hóa đơn (react-pdf)
- [ ] Đa ngôn ngữ (next-intl)
- [ ] Email notification (Resend)

---

## ⚠️ Issues & Risks

### Đã giải quyết ✅
- ✅ Next.js 16 dùng `proxy.ts` thay `middleware.ts` (đã đọc docs trong `node_modules/next/dist/docs/`)
- ✅ shadcn dùng `@base-ui/react` không có `asChild` → dùng `render={<Component/>}`
- ✅ react-day-picker v10 không tương thích → downgrade v9
- ✅ `useSearchParams()` cần Suspense boundary → wrap LoginForm
- ✅ TypeScript "excessively deep" với nested filter → tách 2 query

### Chưa giải quyết / Rủi ro
- ✅ **Race condition** khi 2 user đặt cùng phòng cùng lúc → đã thêm RPC `create_booking_transaction()` với `pg_advisory_xact_lock`
- ⚠️ **Date timezone** sai (UTC vs Asia/Ho_Chi_Minh) → cần dayjs plugin utc + timezone
- ✅ **Docker build chậm** → đã cấu hình multi-stage + `.dockerignore` + standalone output
- ⚠️ **SSL cho VPS** → khuyến nghị dùng Caddy thay Nginx + certbot (đơn giản hơn)
- ⚠️ **File `SUPABASE_SETUP.md` chưa commit** → cần `git add` + commit

---

## 🎬 Next Actions (Ưu tiên ngay)

1. **[CHỌN 1]** Commit file `SUPABASE_SETUP.md` còn untracked
   ```bash
   git add SUPABASE_SETUP.md ROADMAP.md
   git commit -m "docs: add detailed Supabase setup guide and roadmap"
   ```

2. **[Tuần 6 - Report]** Viết báo cáo PDF tối thiểu 20 trang

3. **[Tuần 6 - Deploy]** Chuẩn bị VPS/domain/SSL và cập nhật Supabase Auth URL

4. **[Tuần 6 - Docker]** Khi bật Docker Desktop: test `docker compose up -d --build`

5. **[Tuần 4 - Polish]** Verify manual flow: customer cancel, admin confirm/check-in/check-out/cancel

6. **[Tuần 5 Optional]** Reviews, Services CRUD, Profile, Dashboard charts nếu còn thời gian

---

## 📅 Timeline ước tính

| Mốc | Deadline | Trạng thái |
|-----|----------|-----------|
| Tuần 1 - Foundation | Tuần 1 | ✅ |
| Tuần 2 - Rooms | Tuần 2 | ✅ |
| Tuần 3 - Booking Flow | Tuần 3 | ✅ |
| Tuần 4 - Booking Lifecycle | Tuần 4 | ✅ Core xong |
| Tuần 5 - Advanced Features | Tuần 5 | ⏸️ |
| Tuần 6 - Deploy + Báo cáo | Tuần 6 | 🟠 Đang chuẩn bị |
| **Nộp bài** | Cuối Tuần 6 | 🎯 |

---

## 🔗 Tài liệu liên quan

- 📄 [SPEC.md](./SPEC.md) - Đặc tả chi tiết dự án
- 📘 [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn cài đặt
- 🔧 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Setup Supabase chi tiết
- 🤖 [docs/ai-prompts.md](./docs/ai-prompts.md) - AI Prompts log
- 📖 [README.md](./README.md) - Giới thiệu dự án

---

*File này được cập nhật mỗi khi hoàn thành một milestone. Cập nhật lần cuối: sau Google OAuth admin + Tuần 4 core + Docker files.*
