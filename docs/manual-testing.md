# Manual Testing Checklist

Dùng checklist này trước khi deploy, quay demo hoặc viết báo cáo kết quả.

## Trạng Thái Môi Trường

- Local dev URL: `http://localhost:3000`.
- Swagger UI admin-only: `http://localhost:3000/api-docs`.
- OpenAPI JSON admin-only: `http://localhost:3000/api/openapi`.
- Docker local: đã pass trong smoke test trước đó.
- Lint/build gần nhất: pass.
- Manual test bằng trình duyệt: đã hoàn thành các nhóm chính.

## Tài Khoản Seed

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hbms.vn` | `Admin123!` |
| Customer | `customer1@hbms.vn` | `Customer123!` |

## Smoke Test Không Đăng Nhập

- [x] `/` trả về 200 trên dev server.
- [x] `/about` trả về 200 trên dev server.
- [x] `/rooms` trả về 200 trên dev server.
- [x] `/auth/login` trả về 200 trên dev server.
- [x] `/my-bookings` khi chưa login redirect sang login.
- [x] `/admin` khi chưa login redirect sang login.
- [x] `/admin/rooms` khi chưa login redirect sang login.
- [x] `/admin/bookings` khi chưa login redirect sang login.
- [x] `/api-docs` khi chưa login redirect sang login.
- [x] `/api/openapi` khi chưa login redirect sang login.

## Auth Protection

- [x] Login customer thành công và redirect đúng trang đã yêu cầu.
- [x] Login admin thành công và truy cập được `/admin`.
- [x] Customer không truy cập được `/admin`.
- [x] Customer không truy cập được `/api-docs`.
- [x] Customer không truy cập được `/api/openapi`.
- [x] Admin truy cập được `/api-docs`.
- [x] Admin truy cập được `/api/openapi`.
- [x] Logout xóa session và quay về trang public.
- [x] Theme sáng/tối không mất chữ sau khi login/logout.

## Customer Flow

- [x] Login bằng `customer1@hbms.vn`.
- [x] Mở `/rooms`, danh sách phòng render đúng.
- [x] Mở `/search`, nhập check-in/check-out/số khách.
- [x] Filter theo loại phòng/giá không mất chữ ở dark mode.
- [x] Chọn phòng trống và bấm đặt phòng.
- [x] Tạo booking thành công.
- [x] Nhận booking code dạng `HTL-YYYYMMDD-XXXX`.
- [x] Mở `/my-bookings`, thấy booking vừa tạo.
- [x] Mở `/my-bookings/[id]`, thấy chi tiết phòng/ngày/số khách/tổng tiền.
- [x] Hủy booking khi còn hợp lệ.
- [x] Sau khi hủy, status chuyển sang `cancelled`.
- [x] Nếu booking đã `checked_out`, form review hiển thị.
- [x] Tạo review thành công.

## Admin Booking Lifecycle

- [x] Login bằng `admin@hbms.vn`.
- [x] Mở `/admin`, dashboard hiện KPI và chart.
- [x] Mở `/admin/bookings`, table render đúng.
- [x] Filter/search booking theo status hoặc mã booking.
- [x] Mở một booking `pending`.
- [x] Bấm confirm, status chuyển `pending` -> `confirmed`.
- [x] Bấm check-in, status chuyển `confirmed` -> `checked_in`.
- [x] Bấm check-out, status chuyển `checked_in` -> `checked_out`.
- [x] Sau check-out, `payment_status` chuyển sang `paid`.
- [x] Mở một booking có thể hủy.
- [x] Bấm admin cancel, status chuyển sang `cancelled`.
- [x] Sau admin cancel, `payment_status` chuyển sang `refunded`.

## Admin CRUD

- [x] `/admin/room-types`: tạo/sửa/xóa loại phòng.
- [x] `/admin/rooms`: tạo/sửa/xóa phòng.
- [x] Upload ảnh phòng JPG/PNG/WEBP <=5MB.
- [x] `/admin/services`: tạo/sửa/xóa dịch vụ.
- [x] `/admin/customers`: search customer.
- [x] `/admin/reviews`: xóa review vi phạm.

## Profile / Upload

- [x] User mở `/profile`.
- [x] Cập nhật họ tên/số điện thoại/địa chỉ.
- [x] Upload avatar.
- [x] Navbar hiện avatar mới sau refresh.

## Print Flow

- [x] Mở trang chi tiết booking.
- [x] Bấm in phiếu.
- [x] Trang print hiện booking code, phòng, ngày lưu trú, khách và tổng tiền.
- [x] Preview in không vỡ layout.

## Realtime

- [x] Admin đang mở `/admin/bookings` thấy toast khi có booking mới.
- [x] Khi room status thay đổi, `/admin/rooms` và `/rooms/[id]` cập nhật.
- [x] Customer `customer1@hbms.vn` đặt rồi hủy booking, admin thấy trạng thái booking/phòng cập nhật đúng.

## Responsive / UI

- [x] Trang chủ cân đối trên desktop.
- [x] Trang chủ cân đối trên mobile.
- [x] Search card trang chủ không lệch nút.
- [x] Dark mode không mất chữ tại `/search`.
- [x] Admin nền trắng/sáng đúng yêu cầu.
- [x] Navbar dropdown không còn Base UI warning.
- [x] About page hiển thị tiếng Việt có dấu.
- [x] About page không còn nút xem API docs.
- [x] Chuyển homepage qua English không còn text tiếng Việt lẫn vào phần chính.

## Production Sau Deploy

- [x] Production URL đã có: `https://hbms.dghahai.io.vn/`.
- [x] VPS/domain/HTTPS đã hoàn thành theo xác nhận triển khai.
- [ ] `https://hbms.dghahai.io.vn/auth/callback` hoạt động với Supabase Auth.
- [ ] Google OAuth không redirect về `0.0.0.0`.
- [ ] API docs vẫn admin-only trên production.
- [ ] Realtime hoạt động trên domain thật.

## Ghi Chú

- 2026-05-29: Đã smoke test local dev server. `/`, `/rooms`, `/auth/login` trả 200; `/my-bookings`, `/admin`, `/admin/rooms`, `/admin/bookings` redirect sang login khi chưa đăng nhập.
- 2026-05-29: API docs đã chuyển từ public sang admin-only; không public `/api-docs` và `/api/openapi`.
- 2026-05-29: Đã test realtime với customer `customer1@hbms.vn`: sau khi đặt phòng và hủy booking, admin thấy trạng thái cập nhật đúng.
- 2026-05-29: Đã manual test thành công các nhóm Auth Protection, Customer Flow, Admin Booking Lifecycle, Admin CRUD, Profile/Upload, Print Flow, Realtime và Responsive/UI.
- 2026-05-29: Đã có production HTTPS URL: `https://hbms.dghahai.io.vn/`.
- Hiện chưa có Playwright/Cypress trong `package.json`, nên các mục trên được test bằng trình duyệt.
- Không chạy `npm run seed` trên database cần giữ dữ liệu.
