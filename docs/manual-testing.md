# Manual Testing Checklist

Dung checklist nay truoc khi deploy, quay demo hoac viet bao cao ket qua.

## Trang Thai Moi Truong

- Local dev URL: `http://localhost:3000`.
- Swagger UI: `http://localhost:3000/api-docs`.
- OpenAPI JSON: `http://localhost:3000/api/openapi`.
- Docker local: da pass trong smoke test truoc do.
- Lint/build gan nhat: pass.
- Can test tiep: cac flow yeu cau login that bang trinh duyet.

## Tai Khoan Seed

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hbms.vn` | `Admin123!` |
| Customer | `customer1@hbms.vn` | `Customer123!` |

## Smoke Test Khong Dang Nhap

- [x] `/` tra ve 200 tren dev server.
- [x] `/rooms` tra ve 200 tren dev server.
- [x] `/auth/login` tra ve 200 tren dev server.
- [x] `/my-bookings` khi chua login redirect sang login.
- [x] `/admin` khi chua login redirect sang login.
- [x] `/admin/rooms` khi chua login redirect sang login.
- [x] `/admin/bookings` khi chua login redirect sang login.
- [x] `/api-docs` hien Swagger UI tren trinh duyet.
- [x] `/api/openapi` tra OpenAPI JSON hop le tren trinh duyet.

## Auth Protection

- [x] Login customer thanh cong va redirect dung trang da yeu cau.
- [x] Login admin thanh cong va truy cap duoc `/admin`.
- [x] Customer khong truy cap duoc `/admin`.
- [x] Logout xoa session va quay ve trang public.
- [x] Theme sang/toi khong mat chu sau khi login/logout.

## Customer Flow

- [x] Login bang `customer1@hbms.vn`.
- [x] Mo `/rooms`, danh sach phong render dung.
- [x] Mo `/search`, nhap check-in/check-out/so khach.
- [x] Filter theo loai phong/gia khong mat chu o dark mode.
- [x] Chon phong trong va bam dat phong.
- [x] Tao booking thanh cong.
- [x] Nhan booking code dang `HTL-YYYYMMDD-XXXX`.
- [x] Mo `/my-bookings`, thay booking vua tao.
- [x] Mo `/my-bookings/[id]`, thay chi tiet phong/ngay/so khach/tong tien.
- [x] Huy booking khi con hop le.
- [x] Sau khi huy, status chuyen sang `cancelled`.
- [x] Neu booking da `checked_out`, form review hien thi.
- [x] Tao review thanh cong.

## Admin Booking Lifecycle

- [x] Login bang `admin@hbms.vn`.
- [x] Mo `/admin`, dashboard hien KPI va chart.
- [x] Mo `/admin/bookings`, table render dung.
- [x] Filter/search booking theo status hoac ma booking.
- [x] Mo mot booking `pending`.
- [x] Bam confirm, status chuyen `pending` -> `confirmed`.
- [x] Bam check-in, status chuyen `confirmed` -> `checked_in`.
- [x] Bam check-out, status chuyen `checked_in` -> `checked_out`.
- [x] Sau check-out, `payment_status` chuyen sang `paid`.
- [x] Mo mot booking co the huy.
- [x] Bam admin cancel, status chuyen sang `cancelled`.
- [x] Sau admin cancel, `payment_status` chuyen sang `refunded`.

## Admin CRUD

- [x] `/admin/room-types`: tao/sua/xoa loai phong.
- [x] `/admin/rooms`: tao/sua/xoa phong.
- [x] Upload anh phong JPG/PNG/WEBP <=5MB.
- [x] `/admin/services`: tao/sua/xoa dich vu.
- [x] `/admin/customers`: search customer.
- [x] `/admin/reviews`: xoa review vi pham.

## Profile / Upload

- [x] User mo `/profile`.
- [x] Cap nhat ho ten/so dien thoai/dia chi.
- [x] Upload avatar.
- [x] Navbar hien avatar moi sau refresh.

## Print Flow

- [x] Mo trang chi tiet booking.
- [x] Bam in phieu.
- [x] Trang print hien booking code, phong, ngay luu tru, khach va tong tien.
- [x] Preview in khong vo layout.

## Realtime

- [x] Admin dang mo `/admin/bookings` thay toast khi co booking moi.
- [x] Khi room status thay doi, `/admin/rooms` va `/rooms/[id]` cap nhat.

## Responsive / UI

- [x] Trang chu can doi tren desktop.
- [x] Trang chu can doi tren mobile.
- [x] Search card trang chu khong lech nut.
- [x] Dark mode khong mat chu tai `/search`.
- [x] Admin nen trang/sang dung yeu cau.
- [x] Navbar dropdown khong con Base UI warning.

## Ghi Chu

- 2026-05-29: Da smoke test lai bang local dev server. `/`, `/rooms`, `/auth/login` tra 200; `/my-bookings`, `/admin`, `/admin/rooms`, `/admin/bookings` redirect 307 sang login; `/api-docs` va `/api/openapi` tra 200 sau khi whitelist trong proxy auth.
- 2026-05-29: Da test realtime voi customer `customer1@hbms.vn`: sau khi dat phong va huy booking, admin thay trang thai cap nhat dung.
- 2026-05-29: Da manual test thanh cong cac nhom Auth Protection, Customer Flow, Admin Booking Lifecycle, Admin CRUD, Profile/Upload, Print Flow va Responsive/UI.
- Hien chua co Playwright/Cypress trong `package.json`, nen cac muc tren can test bang trinh duyet.
- Khong chay `npm run seed` tren database can giu du lieu.
- Sau khi test xong, tick lai file nay va dung ket qua lam bang chung trong bao cao.
