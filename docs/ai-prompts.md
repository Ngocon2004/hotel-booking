# 🤖 AI Prompts Log - Hotel Booking Management System

> Yêu cầu của môn học: Sử dụng ít nhất 1 AI tool và minh chứng tối thiểu **5 prompts** đã sử dụng trong quá trình phát triển.  
> AI tool sử dụng: **Devin (Claude Opus)** — coding assistant tích hợp trong terminal.

---

## 📊 Tổng quan

| AI Tool | Phiên bản | Mục đích sử dụng |
|---------|----------|------------------|
| Devin (Claude Opus) | claude-opus-4-7-max | Coding assistant chính - lập kế hoạch, viết code, debug |
| GitHub Copilot | (tuỳ chọn) | Autocomplete trong IDE |
| ChatGPT | GPT-4 | Tham khảo lý thuyết, design pattern |

---

## 📝 Danh sách Prompts đã thực hiện

### **Tuần 1 - Foundation**

#### Prompt #1: Lập kế hoạch dự án
**Ngữ cảnh:** Bắt đầu dự án từ con số 0, cần overview kế hoạch đầy đủ.

**Prompt:**
> "Tôi chọn đề tài 3: Website quản lý đặt phòng khách sạn để làm dự án thi cuối kỳ. Lên cho tôi kế hoạch cụ thể và chi tiết từng bước với stack Next.js + Supabase, mức độ khá-giỏi, làm cá nhân trong 6 tuần."

**Lý do dùng:** Tận dụng AI để có roadmap toàn diện, không bị bỏ sót yêu cầu nào.

**Kết quả:** AI đã trích xuất nội dung từ file PDF quy chế thi, phát hiện thêm các yêu cầu BẮT BUỘC (Docker, VPS, AI prompts log) mà tôi chưa biết, và tạo timeline 6 tuần chi tiết với database schema 8 bảng, danh sách tính năng cốt lõi/nâng cao và rủi ro & giải pháp.

---

#### Prompt #2: Thiết kế Database Schema
**Ngữ cảnh:** Cần schema PostgreSQL hoàn chỉnh cho hệ thống đặt phòng có RLS.

**Prompt:**
> "Viết schema.sql hoàn chỉnh cho hotel booking với 8 bảng: profiles, room_types, rooms, bookings, payments, reviews, services, booking_services. Bao gồm RLS policies, SQL function check_room_availability dùng daterange overlap, và triggers tự tạo profile khi user đăng ký."

**Lý do dùng:** Schema phức tạp với nhiều ràng buộc và chính sách bảo mật, dễ sai nếu viết tay.

**Kết quả:** AI đã tạo file `supabase/schema.sql` (>400 dòng) với:
- 8 bảng + indexes phù hợp
- RLS policies cho từng role (admin, customer)
- Function `check_room_availability` dùng `daterange && daterange` để check overlap
- Triggers `handle_new_user`, `update_updated_at_column`
- Storage buckets cho rooms/avatars + policies
- Helper function `is_admin()` để giảm trùng code policy

---

#### Prompt #3: Setup Next.js 16 với Supabase SSR
**Ngữ cảnh:** Next.js 16 có breaking change (proxy.ts thay middleware.ts), cần setup auth flow đúng convention.

**Prompt:**
> "Setup Supabase SSR cho Next.js 16 App Router. Tạo client.ts (browser), server.ts (server components), proxy.ts (replace middleware.ts trong v16) để refresh session và bảo vệ /admin chỉ cho role admin."

**Lý do dùng:** Next.js 16 có nhiều thay đổi mới (cookies async, proxy thay middleware), tôi không nắm hết.

**Kết quả:** AI đọc docs trong `node_modules/next/dist/docs/` để xác định cú pháp đúng cho v16, tạo:
- `lib/supabase/client.ts`, `server.ts`, `middleware.ts` (helper functions)
- `src/proxy.ts` với matcher loại trừ static assets
- Logic redirect `/admin` về `/` nếu role != 'admin'

---

#### Prompt #4: Form Login/Register với Server Actions + zod
**Ngữ cảnh:** Next.js 16 dùng React 19 với `useActionState`, cần form có validation zod.

**Prompt:**
> "Tạo form đăng ký/đăng nhập dùng Server Actions của Next.js 16 + React useActionState + zod validation. Hiển thị lỗi inline theo từng field, có loading state khi pending."

**Lý do dùng:** Pattern mới của React 19, cần hiểu cách kết hợp với Server Actions.

**Kết quả:**
- `lib/validators/auth.ts` - zod schemas (loginSchema, registerSchema)
- `app/actions/auth.ts` - Server Actions (login, register, logout)
- `app/auth/login/login-form.tsx` (client component) + `page.tsx` (Suspense wrapper)
- Toàn bộ flow validate → call Supabase → redirect

---

#### Prompt #5: Fix lỗi TypeScript với base-ui và react-day-picker
**Ngữ cảnh:** Build fail vì:
1. shadcn dùng `@base-ui/react` thay Radix - không có `asChild` prop
2. react-day-picker v10 đổi `table` thành `month_grid`
3. `useSearchParams()` cần Suspense boundary

**Prompt:**
> "Build fail với 3 lỗi: (1) DropdownMenuTrigger không nhận asChild prop, (2) Calendar component có ClassNames key 'table' không tồn tại, (3) useSearchParams cần Suspense. Fix giúp tôi từng lỗi."

**Lý do dùng:** Lỗi từ thư viện, cần hiểu sâu cách hoạt động của base-ui và react-day-picker mới.

**Kết quả:**
- Đổi `<DropdownMenuTrigger asChild>` → `<DropdownMenuTrigger className="...">` với children
- Đổi `<DropdownMenuItem asChild>` → `<DropdownMenuItem render={<Link/>}>`
- Downgrade react-day-picker từ v10 xuống v9 (compatible với shadcn)
- Wrap LoginForm trong Suspense, tách thành 2 file (`page.tsx` server + `login-form.tsx` client)

→ Build pass ✅

---

### **Tuần 2-6** (sẽ cập nhật khi hoàn thành)

#### Prompt #6: Component Room Card với image carousel
*(coming soon)*

#### Prompt #7: Logic check phòng trống real-time
*(coming soon)*

---

## 💡 Bài học kinh nghiệm khi dùng AI

1. **Luôn cung cấp ngữ cảnh đầy đủ**: Stack, version, phạm vi cụ thể.
2. **Yêu cầu AI đọc docs**: Các framework mới (Next.js 16) có docs nội bộ trong `node_modules/`, AI nên tham khảo trước khi viết code.
3. **Verify code AI sinh**: Build/test ngay sau mỗi đoạn code, đừng tin tưởng 100%.
4. **Iterative refinement**: Ban đầu prompt rộng, sau đó refine từng phần dựa trên kết quả thực tế.
5. **Đọc lỗi build cẩn thận**: Lỗi TypeScript thường rất chi tiết - copy nguyên văn cho AI sẽ giúp fix nhanh.

---

## 📈 Thống kê

| Metric | Số lượng |
|--------|---------|
| Tổng prompts | 5+ (tuần 1) |
| Files được sinh ra | ~25 files |
| Lines of code (LOC) | ~2000 |
| Time saved (ước tính) | ~15 giờ |

---

*Cập nhật cuối: Tuần 1 hoàn thành.*
