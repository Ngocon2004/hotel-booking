# 📘 Hướng dẫn Setup Supabase + Chạy dự án (Cực chi tiết)

> File này hướng dẫn từng click một - dành cho người chưa từng dùng Supabase.

---

## ⏱️ Tổng thời gian: ~15 phút

| Bước | Thời gian | Nội dung |
|------|-----------|----------|
| 1 | 3 phút | Đăng ký tài khoản + tạo project Supabase |
| 2 | 2 phút | Chạy schema.sql để tạo database |
| 3 | 2 phút | Lấy API keys |
| 4 | 1 phút | Tắt email confirmation (cho dev) |
| 5 | 2 phút | Tạo file `.env.local` |
| 6 | 2 phút | Chạy seed + dev server |
| 7 | 3 phút | Test các flow |

---

## 🟢 BƯỚC 1: Tạo Supabase Project

### 1.1. Đăng ký / Đăng nhập

1. Mở trình duyệt → vào **https://supabase.com/dashboard**
2. Click **Sign in** (góc trên phải)
3. Chọn 1 trong 3 cách:
   - **Sign in with GitHub** (khuyến nghị - dùng tài khoản GitHub có sẵn)
   - **Sign in with Google**
   - **Sign in with Email** (đăng ký mới)
4. Sau khi đăng nhập, bạn sẽ thấy Dashboard chính

### 1.2. Tạo Organization (lần đầu tiên)

Lần đầu sẽ yêu cầu tạo **Organization**:
- **Name**: nhập tên bạn muốn (ví dụ: `My Projects` hoặc tên bạn)
- **Type**: chọn **Personal**
- **Plan**: chọn **Free** (đủ dùng cho đồ án)
- Click **Create organization**

### 1.3. Tạo Project mới

1. Click nút **New Project** màu xanh
2. Điền thông tin:
   - **Name**: `hotel-booking`
   - **Database Password**: Tạo mật khẩu mạnh
     - ⚠️ **GHI LẠI MẬT KHẨU NÀY** (không khôi phục được!)
     - Ví dụ: `MyHotel@2026`
   - **Region**: chọn **Southeast Asia (Singapore)** (gần VN nhất - tốc độ nhanh)
   - **Pricing Plan**: **Free** (mặc định)
3. Click **Create new project**
4. ⏳ Chờ ~2 phút để Supabase setup database

**Khi xong**, bạn sẽ thấy giao diện chính của project.

---

## 🟢 BƯỚC 2: Khởi tạo Database (chạy schema.sql)

### 2.1. Mở SQL Editor

Trong sidebar bên trái Supabase:
1. Tìm icon **SQL Editor** (biểu tượng `</>`)
2. Click vào đó
3. Click nút **+ New query** (góc trên trái)

### 2.2. Copy nội dung file schema.sql

Mở file trong VSCode:
```
D:\Nam4\Web_New\hotel-booking\supabase\schema.sql
```

1. Nhấn `Ctrl + A` để chọn tất cả
2. Nhấn `Ctrl + C` để copy

### 2.3. Paste vào SQL Editor và Run

1. Quay lại tab Supabase trên trình duyệt
2. Click vào ô SQL Editor (vùng trắng lớn)
3. Nhấn `Ctrl + V` để paste
4. Click nút **Run** màu xanh (góc dưới phải) hoặc nhấn `Ctrl + Enter`
5. Chờ ~5-10 giây

### 2.4. Kiểm tra kết quả

✅ **Thành công**: thấy thông báo `Success. No rows returned` ở dưới cùng

❌ **Nếu báo lỗi**:

| Lỗi | Cách sửa |
|-----|---------|
| `relation "..." already exists` | Bạn đã chạy schema rồi → BỎ QUA, vào bước tiếp theo |
| `permission denied for schema auth` | Đảm bảo đang ở SQL Editor (không phải Table Editor) |
| `syntax error` | Có thể paste thiếu - copy lại toàn bộ file |

### 2.5. Verify database

1. Sidebar → click **Table Editor** (icon bảng)
2. Bạn phải thấy đủ **8 bảng**:
   - profiles
   - room_types
   - rooms
   - bookings
   - payments
   - reviews
   - services
   - booking_services

✅ Nếu đủ 8 bảng → Database OK!

---

## 🟢 BƯỚC 3: Lấy API Keys

### 3.1. Vào Settings → API

1. Sidebar → click icon **Settings** (bánh răng ⚙️) ở dưới cùng
2. Trong menu Settings, click **API**

### 3.2. Copy 3 giá trị quan trọng

Bạn sẽ thấy các trường sau - copy mỗi cái ra notepad tạm:

#### A. Project URL
- Tìm phần **Project URL**
- Có dạng: `https://abcdefghijk.supabase.co`
- Click icon copy bên phải để copy

#### B. anon public key (anon key)
- Cuộn xuống phần **Project API keys**
- Tìm dòng có nhãn **`anon`** **`public`**
- Click vào đoạn text mờ để hiện key
- Click icon copy
- Key dài ~200 ký tự, bắt đầu bằng `eyJ...`

#### C. service_role key (⚠️ BÍ MẬT)
- Cũng trong **Project API keys**
- Tìm dòng có nhãn **`service_role`** **`secret`**
- Click **Reveal** để hiện
- Click icon copy
- ⚠️ **KHÔNG BAO GIỜ** commit key này lên Git!

📋 **Bây giờ bạn có 3 giá trị**, lưu tạm vào notepad:
```
URL:     https://abcdefghijk.supabase.co
ANON:    eyJhbGc...rất dài
SERVICE: eyJhbGc...rất dài (khác anon)
```

---

## 🟢 BƯỚC 4: Tắt Email Confirmation (cho dev)

> Để test cho nhanh - không cần verify email khi đăng ký.

### 4.1. Vào Authentication

1. Sidebar → click icon **Authentication** (hình người)
2. Click tab **Sign In / Providers** (hoặc **Providers**)

### 4.2. Cấu hình Email provider

1. Click vào dòng **Email**
2. Cuộn xuống tìm phần **Confirm email** hoặc **Confirm email change**
3. **Tắt** toggle **Confirm email**
   - (Để khi register không cần check inbox)
4. Click **Save** ở dưới cùng

✅ Xong! Giờ có thể đăng ký user mà không cần verify email.

---

## 🟢 BƯỚC 5: Tạo file `.env.local`

### 5.1. Mở terminal trong VSCode

1. Mở VSCode → mở thư mục `D:\Nam4\Web_New\hotel-booking`
2. Nhấn `` Ctrl + ` `` để mở Terminal
3. Đảm bảo đang ở thư mục `hotel-booking`:
   ```bash
   pwd
   # Phải hiện: D:\Nam4\Web_New\hotel-booking hoặc /d/Nam4/Web_New/hotel-booking
   ```

### 5.2. Tạo file .env.local

**Cách 1**: Dùng VSCode UI
1. Trong VSCode Explorer, click chuột phải vào thư mục `hotel-booking`
2. Chọn **New File**
3. Đặt tên: `.env.local` (có dấu chấm ở đầu)

**Cách 2**: Dùng terminal
```bash
# Trong PowerShell:
New-Item .env.local

# Trong Git Bash:
touch .env.local
```

### 5.3. Điền nội dung

Mở file `.env.local` vừa tạo, paste nội dung sau (thay giá trị thật):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...your-real-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...your-real-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### ⚠️ LƯU Ý KHI TẠO .env.local

| ❌ SAI | ✅ ĐÚNG |
|--------|--------|
| `URL = "https://..."` (có dấu cách + ngoặc kép) | `URL=https://...` (không dấu cách, không ngoặc) |
| `URL=https://... ` (có space cuối) | `URL=https://...` (không space) |
| Đặt file ngoài thư mục project | Đặt trong `hotel-booking/` |
| Đặt tên `env.local` | Đặt tên `.env.local` (có dấu chấm) |

### 5.4. Verify file

```bash
# Xem nội dung file
cat .env.local
```

Phải thấy 4 dòng với giá trị thật, không có placeholder.

---

## 🟢 BƯỚC 6: Chạy Seed + Dev Server

### 6.1. Cài dependencies (nếu chưa)

```bash
cd D:\Nam4\Web_New\hotel-booking
npm install
```

### 6.2. Chạy seed (tạo data mẫu)

```bash
npm run seed
```

✅ **Output thành công** sẽ giống:
```
🚀 Bắt đầu seed dữ liệu...
🧹 Xóa dữ liệu cũ...
👥 Tạo users...
   ✅ Admin: admin@hbms.vn / Admin123!
   ✅ Đã tạo 5 customers
🏨 Tạo loại phòng...
   ✅ 4 loại phòng
🚪 Tạo phòng...
   ✅ 11 phòng
🛎️  Tạo dịch vụ...
   ✅ 6 dịch vụ
📅 Tạo bookings...
   ✅ 10 bookings
⭐ Tạo reviews...
   ✅ X reviews

✨ Seed thành công!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Admin:    admin@hbms.vn / Admin123!
📧 Customer: customer1@hbms.vn / Customer123!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

❌ **Nếu lỗi**:

| Lỗi | Cách sửa |
|-----|---------|
| `Missing env vars` | Kiểm tra `.env.local` có đúng 4 dòng và đúng tên biến không |
| `connect ECONNREFUSED` | URL Supabase sai - copy lại |
| `Invalid API key` | anon key hoặc service_role key sai - copy lại |
| `relation "profiles" does not exist` | Bạn chưa chạy schema.sql ở Bước 2 |
| `User already registered` | Đã seed rồi - không sao, script tự skip |

### 6.3. Chạy dev server

```bash
npm run dev
```

✅ **Output thành công**:
```
▲ Next.js 16.2.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000
- Environments: .env.local
✓ Ready in 657ms
```

⚠️ **Nếu thấy `Port 3000 in use`**: Server tự chuyển sang `3001` - không sao.

---

## 🟢 BƯỚC 7: Test các flow

### 7.1. Mở trình duyệt

Vào: **http://localhost:3000** (hoặc port hiện ở terminal)

### 7.2. Test Trang chủ

✅ Phải thấy:
- Hero section với gradient amber
- Search box ở giữa
- Features grid (Wi-Fi, Bữa sáng, Đưa đón, 5 sao)
- CTA "Đăng ký ngay"
- Navbar có "Đăng nhập / Đăng ký"
- Footer

### 7.3. Test danh sách phòng

1. Click **Phòng** trên Navbar (hoặc vào `/rooms`)
2. ✅ Phải thấy 11 phòng được seed (4 Standard, 4 Deluxe, 2 Suite, 1 Presidential)
3. Thử filter:
   - Click dropdown **Loại phòng** → chọn **Suite**
   - Nhập **Khoảng giá**: 2000000 - 5000000
   - Click **Áp dụng**
   - URL phải đổi thành `/rooms?type=...&min=2000000&max=5000000`

### 7.4. Test chi tiết phòng

1. Click vào 1 phòng → vào `/rooms/[id]`
2. ✅ Phải thấy:
   - Gallery 3 ảnh ở đầu (click để mở lightbox)
   - Mô tả phòng + tiện nghi
   - Reviews (nếu có)
   - **Form đặt phòng** bên phải sticky

### 7.5. Test Login Admin

1. Click **Đăng nhập** → vào `/auth/login`
2. Nhập:
   - Email: `admin@hbms.vn`
   - Password: `Admin123!`
3. Click **Đăng nhập**
4. ✅ Phải redirect về trang chủ
5. Click avatar góc phải → menu phải có **🛡️ Trang quản trị**

### 7.6. Test Admin Dashboard

1. Click **🛡️ Trang quản trị** → vào `/admin`
2. ✅ Phải thấy:
   - Hero "Chào mừng trở lại, Admin!"
   - 4 KPI cards (Tổng phòng: 11, Booking: 10, Khách: 5, Pending: X)
   - Card doanh thu màu xanh emerald
   - Recent bookings list
   - Quick actions

### 7.7. Test Admin CRUD Loại phòng

1. Sidebar → click **Loại phòng**
2. ✅ Phải thấy 4 loại: Standard, Deluxe, Suite, Presidential
3. Click **+ Thêm loại phòng**
4. Điền:
   - Tên: `VIP Test`
   - Giá: `5000000`
   - Sức chứa: `4`
   - Tick vài amenities
5. Click **Tạo mới** → quay về danh sách + thấy loại mới
6. Click icon ✏️ Pencil để Edit, đổi giá rồi Save
7. Click icon 🗑️ Trash để Delete → confirm dialog → xoá

### 7.8. Test Upload ảnh phòng

1. Sidebar → click **Phòng**
2. Click **+ Thêm phòng**
3. Điền:
   - Số phòng: `999`
   - Loại phòng: chọn từ dropdown
   - Tầng: `9`
4. Phần **Hình ảnh phòng** → click ô **Thêm ảnh** → chọn 1-3 ảnh từ máy
5. ✅ Phải thấy ảnh upload xong + preview
6. Click **Tạo phòng** → quay về danh sách → thấy phòng mới với ảnh

### 7.9. Verify ảnh đã lên Supabase Storage

1. Quay lại tab Supabase Dashboard
2. Sidebar → **Storage**
3. Click bucket **rooms**
4. ✅ Phải thấy các file ảnh vừa upload

### 7.10. Test với Customer

1. Click avatar admin → **Đăng xuất**
2. Click **Đăng nhập** → đăng nhập với:
   - Email: `customer1@hbms.vn`
   - Password: `Customer123!`
3. ✅ Menu user **KHÔNG có** "Trang quản trị"
4. Vào `/admin` trực tiếp → bị redirect về `/` (RLS + proxy hoạt động)

---

## 🎉 NẾU MỌI THỨ ĐỀU OK

Bạn đã hoàn thành setup! Tiếp tục Tuần 3 với booking flow.

---

## 🆘 Troubleshooting tổng hợp

### Lỗi đăng ký/đăng nhập

| Lỗi | Nguyên nhân | Cách sửa |
|-----|------------|---------|
| `Email rate limit exceeded` | Đã đăng ký quá nhiều email test | Đợi 1 giờ hoặc tạo project Supabase mới |
| `Invalid login credentials` | Sai email/password | Kiểm tra lại - phân biệt hoa thường |
| Sau login bị redirect liên tục | Cookie issue | Mở DevTools → Application → Cookies → xoá hết → thử lại |

### Lỗi runtime trong dev

| Lỗi | Cách sửa |
|-----|---------|
| `fetch failed` | Kiểm tra `.env.local` đúng URL chưa, restart `npm run dev` |
| Trang trắng / loading mãi | Kiểm tra Console (F12) → xem lỗi |
| Ảnh không hiển thị | Kiểm tra Storage bucket `rooms` có public không (đã có trong schema.sql) |
| RLS error "permission denied" | User chưa login hoặc role khác - check Table Editor → profiles |

### Cần reset database

Nếu muốn xoá hết data và bắt đầu lại:
```sql
-- Chạy trong SQL Editor
DROP TABLE IF EXISTS booking_services, payments, reviews, bookings, rooms, room_types, services, profiles CASCADE;

-- Rồi chạy lại schema.sql
```

Sau đó: `npm run seed` lại.

### Cần tạo Admin thủ công

Nếu seed không tạo được admin:
```sql
-- 1. Đăng ký user qua /auth/register trên web
-- 2. Vào Supabase → Table Editor → profiles
-- 3. Tìm row của user vừa đăng ký
-- 4. Đổi cột `role` từ `customer` thành `admin`
-- 5. Save
```

---

## 📞 Cần hỗ trợ?

- Đọc lại file này từ đầu xem có bỏ sót bước nào không
- Xem console (F12) trong trình duyệt để xem lỗi cụ thể
- Xem terminal `npm run dev` để xem lỗi server-side
- Hoặc nhắn lại để tôi hỗ trợ

---

✅ **Chúc bạn setup thành công!** Sau khi xong, nhắn tôi để tiếp tục **Tuần 3 - Booking Flow** 🚀
