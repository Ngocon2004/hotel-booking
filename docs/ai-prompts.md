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

### **Tuần 4 - Quản lý Booking Lifecycle**

#### Prompt #13: Customer booking history và hủy booking
**Ngữ cảnh:** Sau khi đặt phòng thành công, customer cần có khu vực riêng để xem toàn bộ lịch sử đặt phòng, lọc theo trạng thái và hủy booking theo đúng rule nghiệp vụ. Dự án đang dùng Next.js App Router, Supabase RLS và Server Actions nên logic phân quyền phải nằm ở server, không chỉ ẩn nút ở UI.

**Prompt:**
> "Tạo flow quản lý booking cho customer trong hotel-booking. Cần trang `/my-bookings` hiển thị lịch sử booking của user đang đăng nhập, có filter theo status pending/confirmed/checked_in/checked_out/cancelled. Tạo trang `/my-bookings/[id]` xem chi tiết booking, hiển thị phòng, ngày check-in/check-out, số khách, tổng tiền, payment status. Viết server action `cancelBooking()` chỉ cho phép user hủy booking của chính họ, chỉ hủy khi booking đang `pending` hoặc còn hơn 24 giờ trước check-in. Sau khi hủy phải revalidate danh sách và trang chi tiết."

**Lý do dùng:** Flow này liên quan trực tiếp đến phân quyền và dữ liệu cá nhân của customer. Nếu chỉ filter ở client hoặc tin vào UI thì user có thể sửa request để hủy booking của người khác. AI được dùng để thiết kế lại luồng theo hướng server-side guard + RLS + revalidate đúng route.

**Kết quả:**
- Tạo `src/app/(public)/my-bookings/page.tsx` để customer xem lịch sử booking và filter theo trạng thái.
- Tạo `src/app/(public)/my-bookings/[id]/page.tsx` để xem chi tiết booking.
- Thêm `cancelBooking()` trong `src/server/actions/bookings.ts`.
- Kiểm tra ownership bằng `booking.customer_id === user.id` trước khi update.
- Áp dụng rule hủy: `pending` hoặc trước check-in tối thiểu 24 giờ.
- Revalidate `/my-bookings`, `/my-bookings/[id]` và `/admin/bookings` sau khi hủy.

---

#### Prompt #14: Admin booking lifecycle actions
**Ngữ cảnh:** Admin cần quản lý vòng đời booking từ lúc khách đặt đến lúc hoàn tất lưu trú. Các trạng thái chính gồm `pending`, `confirmed`, `checked_in`, `checked_out`, `cancelled`; payment status cũng cần cập nhật khi checkout hoặc hủy.

**Prompt:**
> "Xây dựng admin booking lifecycle cho Next.js + Supabase. Tạo trang `/admin/bookings` dạng table có search/filter và trang `/admin/bookings/[id]` hiển thị chi tiết booking. Thêm các Server Actions: `confirmBooking()` đổi pending sang confirmed, `checkInBooking()` đổi confirmed sang checked_in, `checkOutBooking()` đổi checked_in sang checked_out và cập nhật `payment_status = paid`, `cancelBookingAdmin()` đổi sang cancelled và cập nhật `payment_status = refunded`. Mọi action phải check role admin ở server, trả lỗi rõ ràng, revalidate lại admin pages."

**Lý do dùng:** Booking lifecycle có nhiều trạng thái và dễ bị thiếu bước cập nhật dữ liệu phụ như `payment_status`. AI được dùng để đảm bảo các action có cấu trúc nhất quán, tái sử dụng helper kiểm tra admin và không lặp code update/revalidate.

**Kết quả:**
- Tạo `src/app/(admin)/admin/bookings/page.tsx` với table booking, filter/search và status badges.
- Tạo `src/app/(admin)/admin/bookings/[id]/page.tsx` với chi tiết khách, phòng, ngày lưu trú và khu vực thao tác lifecycle.
- Thêm helper `updateBookingStatus()` trong `src/server/actions/bookings.ts`.
- Thêm `confirmBooking()`, `checkInBooking()`, `checkOutBooking()`, `cancelBookingAdmin()`.
- Checkout cập nhật `payment_status` thành `paid`.
- Admin cancel cập nhật `payment_status` thành `refunded`.
- Các route admin được revalidate sau mutation.

---

#### Prompt #15: Customer management và phiếu in booking
**Ngữ cảnh:** Ngoài quản lý booking, admin cần xem danh sách khách hàng và lịch sử booking từng khách. Customer/admin cũng cần có bản in phiếu đặt phòng để minh chứng flow đặt phòng trong demo và báo cáo.

**Prompt:**
> "Bổ sung customer management cho admin và trang in phiếu đặt phòng. Tạo `/admin/customers` để liệt kê khách hàng, search theo tên/email/số điện thoại nếu có dữ liệu. Tạo `/admin/customers/[id]` hiển thị thông tin khách và booking history. Tạo trang `/booking/[roomId]/print` dùng print stylesheet, bố cục gọn để in phiếu đặt phòng với booking code, thông tin phòng, ngày lưu trú, khách, tổng tiền. Thêm nút in ở trang detail."

**Lý do dùng:** Đây là nhóm tính năng phụ trợ nhưng quan trọng khi demo nghiệp vụ end-to-end: admin không chỉ xử lý từng booking mà còn xem được lịch sử theo khách, còn người dùng có chứng từ đặt phòng. AI được dùng để nhanh chóng dựng các page đọc dữ liệu nhiều bảng mà vẫn giữ đúng route convention.

**Kết quả:**
- Tạo `src/app/(admin)/admin/customers/page.tsx`.
- Tạo `src/app/(admin)/admin/customers/[id]/page.tsx`.
- Tạo `src/app/(public)/booking/[roomId]/print/page.tsx`.
- Tạo `src/components/bookings/print-button.tsx`.
- Bổ sung UI hiển thị status/payment badges và thông tin booking phục vụ in ấn.

---

### **Tuần 5 - Rà soát tính năng nâng cao**

#### Prompt #16: Ưu tiên tính năng nâng cao trước deadline
**Ngữ cảnh:** Sau khi hoàn thành core flow Tuần 1-4, dự án còn nhiều tính năng nâng cao như reviews, services CRUD, profile, realtime, dashboard chart và pagination. Cần phân loại việc nào bắt buộc, việc nào optional để không ảnh hưởng deadline nộp bài.

**Prompt:**
> "Rà soát backlog Tuần 5 cho dự án hotel-booking: reviews, services CRUD, profile page + avatar upload, Supabase Realtime, dashboard Recharts, pagination/search nâng cao. Hãy phân loại theo mức độ quan trọng cho đồ án: bắt buộc để qua môn, nên làm nếu còn thời gian, và optional đạt điểm cao. Đề xuất thứ tự triển khai thực tế khi core booking flow đã xong nhưng còn Docker/deploy/report."

**Lý do dùng:** Backlog Tuần 5 rộng, nếu làm dàn trải sẽ dễ chậm các yêu cầu bắt buộc như Docker, deploy và báo cáo. AI được dùng để sắp xếp lại ưu tiên theo rủi ro deadline.

**Kết quả:**
- Xác định các mục Tuần 5 là optional/nâng cao, không chặn core requirement nếu đã có auth, CRUD, upload, RLS và booking flow.
- Đưa reviews, services CRUD, profile, realtime, dashboard, pagination vào nhóm "làm nếu còn thời gian".
- Giữ Docker smoke test, AI prompts log, polish, deploy và report ở luồng chuẩn bị nộp bài.
- Cập nhật `ROADMAP.md` để phản ánh Tuần 5 đang pending/optional.

---

### **Tuần 6 - Docker, tài liệu và kiểm tra trước nộp**

#### Prompt #17: Docker multi-stage build cho Next.js standalone
**Ngữ cảnh:** Quy chế yêu cầu containerization bằng Dockerfile và Docker Compose. Dự án dùng Next.js 16, cần build production theo standalone output để chạy gọn trong container, kèm Nginx reverse proxy.

**Prompt:**
> "Tạo Dockerfile multi-stage cho Next.js 16 production build. Dùng `node:20-alpine`, `npm ci`, `npm run build`, copy `.next/standalone`, `.next/static`, `public` sang runner non-root user. Thêm `.dockerignore`, `docker-compose.yml` gồm service app và nginx reverse proxy port 80, thêm `docker/nginx.conf` proxy sang app:3000. Cập nhật `next.config.ts` nếu cần `output: 'standalone'`."

**Lý do dùng:** Docker cho Next.js standalone có nhiều chi tiết dễ thiếu: copy đúng output, chạy non-root, exclude file không cần thiết, và cấu hình Nginx đúng upstream trong compose network. AI được dùng để tạo cấu hình theo best practice nhưng vẫn bám stack hiện tại.

**Kết quả:**
- Tạo `Dockerfile` multi-stage.
- Tạo `.dockerignore`.
- Tạo `docker-compose.yml` với `app` và `nginx`.
- Tạo `docker/nginx.conf`.
- Cấu hình Next.js standalone output.
- Smoke test ngày 2026-05-27: `docker compose up -d --build` build thành công, container `hotel-booking-app-1` và `hotel-booking-nginx-1` đều chạy, truy cập `http://localhost` trả HTTP 200.
- Tối ưu runner stage từ `node:20-alpine` sang `alpine:3.23` + `apk add nodejs`, giảm image `hotel-booking-app:latest` từ khoảng 276MB xuống khoảng 194MB.
- Image đã đạt target `<200MB`.

---

#### Prompt #18: Cập nhật roadmap và thứ tự công việc cuối kỳ
**Ngữ cảnh:** Một số việc như deploy VPS/domain/HTTPS, viết báo cáo PDF và quay demo video cần làm sau cùng vì phụ thuộc vào trạng thái app đã ổn định. Cần cập nhật roadmap để không triển khai sớm các việc cuối kỳ trước khi test Docker, polish và hoàn thiện prompt log.

**Prompt:**
> "Đọc toàn bộ Markdown trong dự án hotel-booking, tổng hợp công việc còn lại, rồi cập nhật `ROADMAP.md` để xếp Deploy VPS/domain/HTTPS, báo cáo PDF tối thiểu 20 trang và demo video 3-5 phút xuống nhóm làm sau cùng. Sau đó hệ thống lại Next Actions theo thứ tự: Docker smoke test, verify manual booking lifecycle, optional features nếu còn thời gian, cập nhật AI prompts, cuối cùng mới deploy/report/demo."

**Lý do dùng:** Roadmap cũ có nhiều nguồn trạng thái lệch nhau giữa README, SPEC, SETUP_GUIDE và ROADMAP. AI được dùng để đọc đồng loạt tài liệu Markdown, xác định nguồn đáng tin nhất và chỉnh thứ tự công việc theo chiến lược nộp bài.

**Kết quả:**
- Rà soát 10 file Markdown trong dự án.
- Xác định `ROADMAP.md` là nguồn trạng thái chính.
- Chuyển `VPS Deploy/domain/HTTPS`, `Báo cáo PDF`, `Demo Video` xuống cuối nhóm Tuần 6.
- Chỉnh `Next Actions` để deploy/report/demo nằm sau Docker, polish, optional features và AI prompts.
- Phát hiện `README.md`, `SETUP_GUIDE.md`, `SPEC.md` còn một số checklist cũ chưa khớp với code hiện tại.

---

#### Prompt #19: Verify AI prompts log đủ tiêu chí minh chứng
**Ngữ cảnh:** Quy chế yêu cầu minh chứng sử dụng AI tool tối thiểu 5 prompts. Dự án đã có hơn 10 prompts, nhưng cần kiểm tra mỗi prompt có đủ 4 phần: ngữ cảnh, prompt, lý do dùng và kết quả để đưa vào báo cáo/phụ lục.

**Prompt:**
> "Kiểm tra `docs/ai-prompts.md` và chuẩn hóa các prompt log. Mỗi prompt phải có đủ: `Ngữ cảnh`, `Prompt`, `Lý do dùng`, `Kết quả`. Bổ sung prompt Tuần 4-6 thật chi tiết, nêu rõ file/tính năng tạo ra, quyết định kỹ thuật và trạng thái verify. Cập nhật thống kê tổng số prompts, số file, LOC ước tính và thời gian tiết kiệm."

**Lý do dùng:** Prompt log là bằng chứng trực tiếp cho yêu cầu AI tool. Nếu ghi quá sơ sài hoặc thiếu trường, phụ lục báo cáo sẽ yếu dù số lượng prompt đã đủ. AI được dùng để chuẩn hóa tài liệu theo checklist nhất quán.

**Kết quả:**
- Bổ sung chi tiết Prompt #13 đến #19.
- Mỗi prompt có đủ 4 phần: `Ngữ cảnh`, `Prompt`, `Lý do dùng`, `Kết quả`.
- Cập nhật trạng thái thống kê sang Tuần 6.
- Thêm bảng kiểm tra coverage prompt để dễ đưa vào báo cáo.

---

## ✅ Kiểm tra cấu trúc Prompt Log

| Prompt | Ngữ cảnh | Prompt | Lý do dùng | Kết quả |
|--------|----------|--------|------------|---------|
| #1 | ✅ | ✅ | ✅ | ✅ |
| #2 | ✅ | ✅ | ✅ | ✅ |
| #3 | ✅ | ✅ | ✅ | ✅ |
| #4 | ✅ | ✅ | ✅ | ✅ |
| #5 | ✅ | ✅ | ✅ | ✅ |
| #6 | ✅ | ✅ | ✅ | ✅ |
| #7 | ✅ | ✅ | ✅ | ✅ |
| #8 | ✅ | ✅ | ✅ | ✅ |
| #9 | ✅ | ✅ | ✅ | ✅ |
| #10 | ✅ | ✅ | ✅ | ✅ |
| #11 | ✅ | ✅ | ✅ | ✅ |
| #12 | ✅ | ✅ | ✅ | ✅ |
| #13 | ✅ | ✅ | ✅ | ✅ |
| #14 | ✅ | ✅ | ✅ | ✅ |
| #15 | ✅ | ✅ | ✅ | ✅ |
| #16 | ✅ | ✅ | ✅ | ✅ |
| #17 | ✅ | ✅ | ✅ | ✅ |
| #18 | ✅ | ✅ | ✅ | ✅ |
| #19 | ✅ | ✅ | ✅ | ✅ |

**Kết luận:** Đã vượt yêu cầu tối thiểu ≥5 prompts. Toàn bộ prompt hiện có đủ ngữ cảnh, nội dung prompt, lý do sử dụng và kết quả.

---

## 💡 Bài học kinh nghiệm khi dùng AI

1. **Luôn cung cấp ngữ cảnh đầy đủ**: Stack, version, phạm vi cụ thể.
2. **Yêu cầu AI đọc docs**: Các framework mới (Next.js 16) có docs nội bộ trong `node_modules/`, AI nên tham khảo trước khi viết code.
3. **Verify code AI sinh**: Build/test ngay sau mỗi đoạn code, đừng tin tưởng 100%.
4. **Iterative refinement**: Ban đầu prompt rộng, sau đó refine từng phần dựa trên kết quả thực tế.
5. **Đọc lỗi build cẩn thận**: Lỗi TypeScript thường rất chi tiết - copy nguyên văn cho AI sẽ giúp fix nhanh.

---

## 📈 Thống kê

| Metric | Số lượng (đang Tuần 6) |
|--------|---------|
| Tổng prompts | 19 |
| Files được sinh ra/chỉnh sửa | ~75 files |
| Lines of code (LOC) | ~7000+ |
| Time saved (ước tính) | ~50 giờ |

---

*Cập nhật cuối: Tuần 6 - sau booking lifecycle core, Docker smoke test và chuẩn hóa prompt log.*
---

#### Prompt #20: Them Swagger UI va dong bo tai lieu Markdown
**Ngu canh:** Sau khi tao nham file Word mo ta backend, can sua dung yeu cau thanh Swagger UI. Dong thoi cac file README, SPEC, ROADMAP, SETUP_GUIDE va checklist test dang lech trang thai voi code hien tai.

**Prompt:**
> "Y toi la Swagger UI. Hay them Swagger UI/OpenAPI vao du an Next.js hien tai, mo ta backend dang dung Server Actions + Supabase, sau do cap nhat toan bo file Markdown theo trang thai that cua du an: tinh nang da xong, Docker da pass, Swagger da co, con lai VPS/domain/HTTPS, bao cao PDF, demo video va manual test."

**Ly do dung:** Yeu cau lien quan nhieu file va can thong nhat giua implementation, documentation va checklist nop bai. AI duoc dung de doc cau truc project, them route dung Next.js 16, tao OpenAPI spec va chuan hoa tai lieu.

**Ket qua:**
- Them `/api-docs` hien Swagger UI.
- Them `/api/openapi` tra OpenAPI JSON.
- Xoa file Word backend tao nham.
- Cap nhat README, ROADMAP, SPEC, SETUP_GUIDE, SUPABASE_SETUP, deployment guide, manual testing checklist va source structure docs.
- Lint/build pass sau khi them Swagger UI.

## Cap Nhat Thong Ke Moi

| Metric | So luong hien tai |
| --- | --- |
| Tong prompts | 20+ |
| Files duoc sinh/chinh sua | ~80 files |
| Lines of code/docs uoc tinh | ~7500+ |
| Time saved uoc tinh | ~55 gio |

*Cap nhat cuoi: Tuan 6 - sau Swagger UI, Docker smoke test, UI polish va dong bo tai lieu Markdown.*
