# 🏨 HBMS Hotel - Hotel Booking Management System

> Đồ án thi cuối kỳ — **Các công nghệ mới trong phát triển phần mềm**  
> Đề tài 3: Website quản lý đặt phòng khách sạn

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)

## 🎯 Demo

- **Production**: TBD (deploy VPS/domain/HTTPS làm sau cùng)
- **Repository**: TBD

## ✨ Tính năng

### 🔓 Public
- Trang chủ với hero, search box, danh sách phòng nổi bật
- Danh sách phòng có filter (loại, giá, tiện nghi)
- Chi tiết phòng với gallery ảnh + reviews

### 👤 Customer
- Đăng ký / Đăng nhập (Supabase Auth)
- Tìm phòng theo ngày + số khách
- Đặt phòng + sinh booking_code
- Lịch sử đặt phòng + huỷ booking
- Đánh giá sau khi check-out

### 🛡️ Admin
- Dashboard thống kê doanh thu, occupancy rate
- CRUD loại phòng + phòng (upload ảnh)
- Quản lý booking (xác nhận / check-in / check-out)
- Quản lý khách hàng + reviews

## 🛠️ Stack công nghệ

| Layer | Công nghệ |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (base-ui) |
| Backend | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Validation | Zod |
| Date/Time | dayjs |
| Charts | Recharts |
| Date Picker | react-day-picker |
| Container | Docker + Docker Compose (local smoke test pass, image ~194MB) |
| Deploy | VPS + Domain + SSL (làm sau cùng) |

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone <repo-url>
cd hotel-booking
npm install

# 2. Tạo Supabase project tại supabase.com, chạy supabase/schema.sql

# 3. Tạo .env.local theo .env.example

# 4. Seed data (optional)
npm run seed

# 5. Run dev
npm run dev
```

📖 Xem [SETUP_GUIDE.md](./SETUP_GUIDE.md) cho hướng dẫn chi tiết.

## 📁 Cấu trúc

```
src/
├── app/
│   ├── (public)/     # Trang công khai (Navbar/Footer layout)
│   ├── auth/         # Login/Register
│   ├── admin/        # Trang quản trị (protected)
│   ├── actions/      # Server Actions
│   └── proxy.ts      # Next.js 16 Proxy (replaces middleware)
├── components/
│   ├── navbar.tsx, footer.tsx
│   └── ui/           # shadcn primitives
├── lib/
│   ├── supabase/     # client/server/middleware
│   ├── utils/        # format helpers
│   └── validators/   # zod schemas
└── types/            # database types
supabase/schema.sql   # 8 bảng + RLS + functions
scripts/seed.ts       # data mẫu
```

## 📚 Tài liệu

- [SPEC.md](./SPEC.md) - Đặc tả chi tiết dự án
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn cài đặt
- [docs/ai-prompts.md](./docs/ai-prompts.md) - Log AI prompts đã dùng
- [docs/manual-testing.md](./docs/manual-testing.md) - Checklist test thủ công trước khi demo/deploy

## 📅 Roadmap

- [x] **Tuần 1**: Foundation (Auth, Schema, Layout)
- [x] **Tuần 2**: Quản lý phòng (Admin CRUD + Upload ảnh + Public list/detail)
- [x] **Tuần 3**: Booking flow (Search + Đặt phòng)
- [x] **Tuần 4**: Quản lý booking (Lifecycle core)
- [ ] **Tuần 5**: Tính năng nâng cao (Reviews, Realtime, Dashboard)
- [ ] **Tuần 6**: Docker + VPS Deploy + Báo cáo (Docker local đã pass; deploy/báo cáo/demo làm sau cùng)

## 👤 Tác giả

Đồ án cá nhân - SV Khoa CNTT.

---

*Generated with [Devin](https://cli.devin.ai/docs)*
