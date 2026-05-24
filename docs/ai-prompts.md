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

### **Tuần 2 - Quản lý Phòng**

#### Prompt #6: Tạo Admin layout với sidebar và dashboard
**Ngữ cảnh:** Cần khu vực admin tách biệt với public, có sidebar điều hướng + header.

**Prompt:**
> "Tạo Admin layout với sidebar bên trái có 7 menu items (dashboard, room-types, rooms, bookings, customers, reviews, services), highlight active route bằng pathname. Header bên phải hiển thị avatar + nút logout. Layout có double-check role admin để bảo vệ route ở cả tầng UI."

**Lý do:** Bảo vệ route bằng nhiều tầng (proxy + RLS + UI check) là best practice cho Next.js auth.

**Kết quả:**
- `components/admin/sidebar.tsx` - client component dùng `usePathname()` highlight
- `app/admin/layout.tsx` - server component check role admin → redirect nếu không phải
- `app/admin/page.tsx` - dashboard với 4 KPI cards, biểu đồ doanh thu, recent bookings, quick actions

---

#### Prompt #7: CRUD form Room Types với multi-select amenities
**Ngữ cảnh:** Form thêm/sửa loại phòng có 12 tiện nghi (wifi, tv, bathtub...) cần multi-select.

**Prompt:**
> "Tạo form room-type-form.tsx tái sử dụng cho cả create và edit. Multi-select amenities dạng grid checkbox với border highlight khi chọn. Validate bằng zod, dùng useActionState. Tự động sinh slug từ name."

**Lý do:** Pattern reusable form (1 component dùng cho cả create/edit) tiết kiệm code, dễ maintain.

**Kết quả:**
- `lib/validators/room.ts` - zod schemas + AMENITIES_OPTIONS list + helper `getAmenityLabel`
- `actions/room-types.ts` - createRoomType, updateRoomType, deleteRoomType (kèm `requireAdmin()` guard)
- `components/admin/room-type-form.tsx` - form reusable với checkbox grid
- `app/admin/room-types/{page,delete-button,new,[id]/edit}` - đầy đủ CRUD pages

---

#### Prompt #8: Image Uploader trực tiếp lên Supabase Storage
**Ngữ cảnh:** Cần upload ảnh phòng (multiple, max 6) lên Supabase Storage bucket `rooms`, có preview, validate kích thước/format.

**Prompt:**
> "Tạo component ImageUploader: chấp nhận multiple file (jpg/png/webp, max 5MB), upload lên Supabase Storage bucket rooms qua server action, preview grid với nút xóa, render hidden inputs name='images' để form submit. Loading state khi upload."

**Lý do:** Upload trực tiếp lên Storage thay vì lưu base64/file system - đúng yêu cầu thi (file upload Supabase Storage).

**Kết quả:**
- `actions/rooms.ts::uploadRoomImage()` - server action validate + upload + return public URL
- `components/admin/image-uploader.tsx` - client với grid preview, drag-drop UI, lightbox-style
- Sử dụng `crypto.randomUUID()` làm tên file để tránh conflict

---

#### Prompt #9: Trang public /rooms với filter & sort
**Ngữ cảnh:** Trang khách xem danh sách phòng có filter theo loại, khoảng giá, sort theo giá/rating.

**Prompt:**
> "Tạo trang /rooms với layout 2 cột: filter sidebar bên trái (sticky), grid card phòng bên phải. Filter: loại phòng (Select), khoảng giá (input number from-to), sort (giá tăng/giảm/rating/mới). Đẩy state lên URL searchParams để có thể share link. Tính rating trung bình từ reviews qua bookings."

**Lý do:** Filter qua URL searchParams thân thiện SEO + share link, đúng pattern Next.js.

**Kết quả:**
- `components/room/rooms-filter.tsx` - client với useRouter + useSearchParams + useTransition
- `components/room/room-card.tsx` - card đẹp với cover image, rating badge, amenities preview
- `app/(public)/rooms/page.tsx` - server component với 2-step fetch reviews (tránh nested filter type error)

---

#### Prompt #10: Fix lỗi TypeScript "excessively deep" với nested Supabase select
**Ngữ cảnh:** Build fail vì query `supabase.from('reviews').select('rating, booking:bookings(room_id)').in('booking.room_id', ...)` - TypeScript không suy luận được type sâu.

**Prompt:**
> "Build báo lỗi 'Type instantiation is excessively deep' khi dùng .in('booking.room_id', ...) trên nested filter. Refactor để tách 2 query: lấy bookings theo room_id, rồi lấy reviews theo booking_id, gom kết quả thành Map."

**Lý do:** Code clear hơn, không depend vào tính năng nested filter của PostgREST mà TypeScript không hỗ trợ tốt.

**Kết quả:** Refactor thành 2 query đơn giản, build pass, performance tương đương.

---

### **Tuần 3 - Booking Flow**

#### Prompt #11: Logic check phòng trống real-time với daterange
**Ngữ cảnh:** Cần trang `/search` nhận `check_in`, `check_out`, `guests` từ URL và chỉ hiển thị phòng còn trống.

**Prompt:**
> "Tạo booking search flow cho Next.js App Router: component SearchForm dùng URL query params, trang /search gọi Supabase RPC get_available_rooms/check_room_availability, validate check-out sau check-in và không cho chọn ngày quá khứ, hiển thị empty state khi không có phòng."

**Lý do:** Tìm phòng theo ngày là bước đầu của booking flow, cần dựa trên SQL daterange để tránh trả về phòng đã được đặt.

**Kết quả:**
- `src/components/booking/search-form.tsx` - form tìm kiếm dùng native date input + guests.
- `src/app/(public)/search/page.tsx` - server page gọi RPC `get_available_rooms`.
- Tích hợp search form vào trang chủ và navbar compact.

---

#### Prompt #12: Booking form + sinh booking code
**Ngữ cảnh:** Sau khi chọn phòng, khách cần tạo booking có mã xác nhận, dịch vụ kèm theo và tổng tiền.

**Prompt:**
> "Tạo trang /booking/[roomId] protected bằng Supabase auth. Form hiển thị phòng, ngày, số khách, services checkbox, special requests, tính tổng tiền real-time. Server action createBooking phải validate lại dữ liệu, check phòng trống lần nữa, sinh booking_code dạng HTL-YYYYMMDD-XXXX, insert bookings và booking_services, rồi redirect sang confirmation page."

**Lý do:** Server action phải là nguồn tin cậy cuối cùng vì client form có thể bị sửa request.

**Kết quả:**
- `src/lib/validators/booking.ts` - zod schema cho search và create booking.
- `src/server/actions/bookings.ts` - `createBooking()` check auth, gọi RPC transaction-safe.
- `supabase/schema.sql` - RPC `create_booking_transaction()` dùng `pg_advisory_xact_lock` để serialize booking theo từng phòng.
- `src/components/booking/booking-form.tsx` - form đặt phòng với tổng tiền real-time.
- `src/app/(public)/booking/[roomId]/page.tsx` và `booking/success/[code]/page.tsx`.
- `src/components/rooms/book-quick-form.tsx` - kiểm tra availability trước khi điều hướng sang booking.

---

### **Tuần 4-6** (sẽ cập nhật khi hoàn thành)

---

## 💡 Bài học kinh nghiệm khi dùng AI

1. **Luôn cung cấp ngữ cảnh đầy đủ**: Stack, version, phạm vi cụ thể.
2. **Yêu cầu AI đọc docs**: Các framework mới (Next.js 16) có docs nội bộ trong `node_modules/`, AI nên tham khảo trước khi viết code.
3. **Verify code AI sinh**: Build/test ngay sau mỗi đoạn code, đừng tin tưởng 100%.
4. **Iterative refinement**: Ban đầu prompt rộng, sau đó refine từng phần dựa trên kết quả thực tế.
5. **Đọc lỗi build cẩn thận**: Lỗi TypeScript thường rất chi tiết - copy nguyên văn cho AI sẽ giúp fix nhanh.

---

## 📈 Thống kê

| Metric | Số lượng (đang Tuần 3) |
|--------|---------|
| Tổng prompts | 12+ |
| Files được sinh ra | ~58 files |
| Lines of code (LOC) | ~5600 |
| Time saved (ước tính) | ~36 giờ |

---

*Cập nhật cuối: Tuần 3 đang triển khai.*
