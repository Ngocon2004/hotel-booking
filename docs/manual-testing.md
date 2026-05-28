# Manual Testing Checklist

> Dùng checklist này trước khi quay demo hoặc deploy. Không chạy `npm run seed` trên database đang cần giữ dữ liệu vì script seed có bước cleanup.

## Trạng thái môi trường

- Docker local: pass ngày 2026-05-27.
- URL local qua Nginx: `http://localhost`.
- HTTP smoke test: `http://localhost` trả `200`.
- Docker image: `hotel-booking-app:latest` khoảng `197MB`.
- Supabase data check: có đủ dữ liệu test cho booking lifecycle.

## Tài khoản seed

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@hbms.vn` | `Admin123!` |
| Customer | `customer1@hbms.vn` | `Customer123!` |

## Auth protection

- [x] Truy cập `/my-bookings` khi chưa login phải redirect sang `/auth/login?redirect=%2Fmy-bookings`.
- [x] Truy cập `/admin/bookings` khi chưa login phải redirect sang `/auth/login?redirect=%2Fadmin%2Fbookings`.
- [ ] Login customer thành công và redirect đúng trang đã yêu cầu.
- [ ] Login admin thành công và truy cập được `/admin`.
- [ ] Customer không truy cập được `/admin`.

## Customer Flow

- [ ] Login bằng `customer1@hbms.vn`.
- [ ] Mở `/rooms`, kiểm tra danh sách phòng render đúng.
- [ ] Mở `/search`, nhập check-in/check-out/số khách.
- [ ] Chọn phòng trống và bấm đặt phòng.
- [ ] Tạo booking thành công, nhận booking code dạng `HTL-YYYYMMDD-XXXX`.
- [ ] Mở `/my-bookings`, thấy booking vừa tạo.
- [ ] Mở `/my-bookings/[id]`, thấy chi tiết phòng/ngày/số khách/tổng tiền.
- [ ] Hủy booking khi còn hợp lệ.
- [ ] Sau khi hủy, status chuyển sang `cancelled` và danh sách được cập nhật.

## Admin Booking Lifecycle

- [ ] Login bằng `admin@hbms.vn`.
- [ ] Mở `/admin/bookings`, kiểm tra table booking render đúng.
- [ ] Filter/search booking theo status hoặc mã booking.
- [ ] Mở một booking `pending`.
- [ ] Bấm confirm, status chuyển `pending` -> `confirmed`.
- [ ] Bấm check-in, status chuyển `confirmed` -> `checked_in`.
- [ ] Bấm check-out, status chuyển `checked_in` -> `checked_out`.
- [ ] Sau check-out, `payment_status` chuyển sang `paid`.
- [ ] Mở một booking có thể hủy.
- [ ] Bấm admin cancel, status chuyển sang `cancelled`.
- [ ] Sau admin cancel, `payment_status` chuyển sang `refunded`.

## Print Flow

- [ ] Mở trang chi tiết booking.
- [ ] Bấm in phiếu.
- [ ] Trang print hiển thị booking code, phòng, ngày lưu trú, khách và tổng tiền.
- [ ] Preview in không bị vỡ layout.

## Optional Feature Checks

- [ ] Admin mở `/admin/services`, tạo/sửa/xóa dịch vụ.
- [ ] User mở `/profile`, cập nhật họ tên/số điện thoại/địa chỉ.
- [ ] User upload avatar, navbar hiển thị avatar mới sau refresh.
- [ ] Admin dashboard hiển thị biểu đồ doanh thu, trạng thái booking và top loại phòng.
- [ ] Admin dashboard hiển thị occupancy rate.
- [ ] `/admin/bookings` phân trang đúng khi có nhiều hơn 10 booking.
- [ ] `/rooms`, `/admin/customers`, `/admin/reviews` phân trang đúng.
- [ ] Search ở `/admin/bookings` và `/admin/customers` tự cập nhật sau khi dừng gõ.
- [ ] Khi có booking mới, admin đang mở `/admin/bookings` thấy toast realtime.
- [ ] Khi room status thay đổi, `/admin/rooms` và `/rooms/[id]` cập nhật realtime.

## Ghi chú

- Hiện chưa có Playwright/Cypress trong `package.json`, nên các bước UI ở trên cần test bằng trình duyệt hoặc bổ sung E2E runner.
- Không dùng service role để update trạng thái booking thay cho UI khi xác nhận demo, vì như vậy không kiểm tra được form/action/redirect thực tế.
## Cap nhat smoke test - 2026-05-28

- Docker Desktop hien khong chay tren may local, nen chua test lai duoc `docker compose ps` hoac Nginx `http://localhost`.
- Da khoi dong Next.js dev server tai `http://localhost:3000`.
- HTTP smoke test dev server:
  - `/`: `200`.
  - `/rooms`: `200`.
  - `/auth/login`: `200`.
  - `/my-bookings` khi chua login: `307` -> `/auth/login?redirect=%2Fmy-bookings`.
  - `/admin`: `307` -> `/auth/login?redirect=%2Fadmin`.
  - `/admin/rooms`: `307` -> `/auth/login?redirect=%2Fadmin%2Frooms`.
  - `/admin/bookings`: `307` -> `/auth/login?redirect=%2Fadmin%2Fbookings`.
  - `/admin/customers`: `307` -> `/auth/login?redirect=%2Fadmin%2Fcustomers`.
  - `/admin/services`: `307` -> `/auth/login?redirect=%2Fadmin%2Fservices`.
  - `/admin/reviews`: `307` -> `/auth/login?redirect=%2Fadmin%2Freviews`.
- `npm.cmd run lint`: pass.
- `npm.cmd run build`: pass.
- Da sua rui ro timezone: cac phep validate ngay booking, format date-only, tinh so dem, sinh booking code va rule huy truoc check-in dung timezone `Asia/Ho_Chi_Minh`.
- Cac flow can trinh duyet dang nhap that van can test tiep: customer booking lifecycle, admin confirm/check-in/check-out/cancel, upload avatar, realtime toast va print preview.
