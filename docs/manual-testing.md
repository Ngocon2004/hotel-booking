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
- [ ] `/api-docs` hien Swagger UI tren trinh duyet.
- [ ] `/api/openapi` tra OpenAPI JSON hop le tren trinh duyet.

## Auth Protection

- [ ] Login customer thanh cong va redirect dung trang da yeu cau.
- [ ] Login admin thanh cong va truy cap duoc `/admin`.
- [ ] Customer khong truy cap duoc `/admin`.
- [ ] Logout xoa session va quay ve trang public.
- [ ] Theme sang/toi khong mat chu sau khi login/logout.

## Customer Flow

- [ ] Login bang `customer1@hbms.vn`.
- [ ] Mo `/rooms`, danh sach phong render dung.
- [ ] Mo `/search`, nhap check-in/check-out/so khach.
- [ ] Filter theo loai phong/gia khong mat chu o dark mode.
- [ ] Chon phong trong va bam dat phong.
- [ ] Tao booking thanh cong.
- [ ] Nhan booking code dang `HTL-YYYYMMDD-XXXX`.
- [ ] Mo `/my-bookings`, thay booking vua tao.
- [ ] Mo `/my-bookings/[id]`, thay chi tiet phong/ngay/so khach/tong tien.
- [ ] Huy booking khi con hop le.
- [ ] Sau khi huy, status chuyen sang `cancelled`.
- [ ] Neu booking da `checked_out`, form review hien thi.
- [ ] Tao review thanh cong.

## Admin Booking Lifecycle

- [ ] Login bang `admin@hbms.vn`.
- [ ] Mo `/admin`, dashboard hien KPI va chart.
- [ ] Mo `/admin/bookings`, table render dung.
- [ ] Filter/search booking theo status hoac ma booking.
- [ ] Mo mot booking `pending`.
- [ ] Bam confirm, status chuyen `pending` -> `confirmed`.
- [ ] Bam check-in, status chuyen `confirmed` -> `checked_in`.
- [ ] Bam check-out, status chuyen `checked_in` -> `checked_out`.
- [ ] Sau check-out, `payment_status` chuyen sang `paid`.
- [ ] Mo mot booking co the huy.
- [ ] Bam admin cancel, status chuyen sang `cancelled`.
- [ ] Sau admin cancel, `payment_status` chuyen sang `refunded`.

## Admin CRUD

- [ ] `/admin/room-types`: tao/sua/xoa loai phong.
- [ ] `/admin/rooms`: tao/sua/xoa phong.
- [ ] Upload anh phong JPG/PNG/WEBP <=5MB.
- [ ] `/admin/services`: tao/sua/xoa dich vu.
- [ ] `/admin/customers`: search customer.
- [ ] `/admin/reviews`: xoa review vi pham.

## Profile / Upload

- [ ] User mo `/profile`.
- [ ] Cap nhat ho ten/so dien thoai/dia chi.
- [ ] Upload avatar.
- [ ] Navbar hien avatar moi sau refresh.

## Print Flow

- [ ] Mo trang chi tiet booking.
- [ ] Bam in phieu.
- [ ] Trang print hien booking code, phong, ngay luu tru, khach va tong tien.
- [ ] Preview in khong vo layout.

## Realtime

- [ ] Admin dang mo `/admin/bookings` thay toast khi co booking moi.
- [ ] Khi room status thay doi, `/admin/rooms` va `/rooms/[id]` cap nhat.

## Responsive / UI

- [ ] Trang chu can doi tren desktop.
- [ ] Trang chu can doi tren mobile.
- [ ] Search card trang chu khong lech nut.
- [ ] Dark mode khong mat chu tai `/search`.
- [ ] Admin nen trang/sang dung yeu cau.
- [ ] Navbar dropdown khong con Base UI warning.

## Ghi Chu

- Hien chua co Playwright/Cypress trong `package.json`, nen cac muc tren can test bang trinh duyet.
- Khong chay `npm run seed` tren database can giu du lieu.
- Sau khi test xong, tick lai file nay va dung ket qua lam bang chung trong bao cao.
