# Pure Wear E‑commerce — Hướng dẫn chạy dự án (A→Z)

Tài liệu này hướng dẫn đầy đủ cách cài đặt, chạy và test dự án trên Windows (XAMPP + PHP + MySQL + Node.js). Mặc định môi trường đã được cấu hình dùng USD và Stripe test mode.

---

## 1) Yêu cầu hệ thống

- Windows 10/11
- PHP 8.0+ (kèm Composer) — có thể dùng XAMPP (Apache + MySQL)
- MySQL 5.7+/8.x (XAMPP MySQL)
- Node.js LTS (v18+ khuyến nghị) + npm
- Stripe account (Test mode) để lấy Publishable Key (Frontend) và Secret Key (Backend)

Mặc định dự án đặt tại:
- Backend (Laravel): `c:\xampp\htdocs\ecommerce\backend`
- Frontend (React + Vite): `c:\xampp\htdocs\ecommerce\frontend`

---

## 2) Chuẩn bị database MySQL

1) Mở XAMPP và start MySQL.
2) Tạo database tên `ecommerce_project` (trùng với file `.env` backend):
   - phpMyAdmin → Databases → Create database: `ecommerce_project` (Collation: utf8mb4_general_ci).

Nếu đổi tên DB, nhớ sửa lại `DB_DATABASE` trong `backend/.env`.

---

## 3) Setup Backend (Laravel)

Thực hiện trong Command Prompt (cmd.exe):

1) Cài dependencies:
   - `cd c:\xampp\htdocs\ecommerce\backend`
   - `composer install`

2) Thiết lập biến môi trường:
   - File `backend/.env` đã có sẵn. Kiểm tra các dòng sau (chỉnh nếu cần):
     - `APP_URL=http://localhost`
     - `DB_HOST=127.0.0.1`
     - `DB_DATABASE=ecommerce_project`
     - `DB_USERNAME=root`
     - `DB_PASSWORD=` (trống nếu XAMPP mặc định)
     - Stripe (Test):
       - `STRIPE_SECRET=sk_test_...` (đã có mẫu test trong repo — bạn có thể thay khóa riêng)
       - `STRIPE_CURRENCY=usd`

3) Generate app key (nếu chưa có):
   - `php artisan key:generate`

4) Chạy migration + seed dữ liệu cơ bản:
   - `php artisan migrate --seed`
     - Seeder tạo sẵn:
       - Admin: `admin@purewear.com` / `admin123`
       - User test: `user@test.com` / `12345678`
       - Danh mục mẫu (Kids/Men/Women)
     - Sản phẩm demo: dùng file `seed_products.bat` ở root repo để sinh nhanh (5 Kids, 5 Men, 5 Women)

5) (Tùy chọn) Link storage khi dùng lưu ảnh local:
   - `php artisan storage:link`

6) Khởi động server Laravel:
   - `php artisan serve --host=127.0.0.1 --port=8000`
   - Server: http://127.0.0.1:8000

Lưu ý: Root `/` của backend tự động điều hướng theo session admin:
- Nếu đã đăng nhập admin → vào `/admin`
- Nếu chưa đăng nhập → vào `/admin/login`

---

## 4) Setup Frontend (React + Vite)

1) Cài dependencies:
   - `cd c:\xampp\htdocs\ecommerce\frontend`
   - `npm install`

2) Biến môi trường Frontend:
   - Sửa `frontend/.env` (đã có sẵn mẫu):
     - `VITE_API_URL=http://127.0.0.1:8000` (điểm tới backend)
     - `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...` (lấy trong Stripe → Developers → API keys → Test mode)

3) Chạy dev server (Vite):
   - `npm run dev`
   - Mặc định mở tại http://localhost:5173

Đường vào trang chủ storefront: `http://localhost:5173/home`
- Logo “Pure Wear” và menu “Home” cũng dẫn tới `/home`.

---

## 5) Tài khoản mẫu & đăng nhập

- Admin Panel: `http://127.0.0.1:8000/admin/login`
  - Email: `admin@purewear.com`
  - Password: `admin123`
- Storefront (khách hàng): đăng nhập tại `http://localhost:5173/login`
  - Email: `user@test.com`
  - Password: `12345678`
- Bạn có thể đăng ký tài khoản mới tại `/register` (storefront). API tạo mặc định role `customer`.

---

## 6) Tính năng chính (tóm tắt)

- Đăng ký/đăng nhập khách hàng (Sanctum + Bearer Token)
- Cart server‑backed theo user, tự động merge cart khách khi login
- Bảo vệ route (cart/checkout/account) — hiển thị prompt SweetAlert2 khi chưa login
- Checkout:
  - Thanh toán COD, Stripe Card (test mode)
  - Sau mua hàng chuyển đến trang chi tiết đơn
- Khu vực tài khoản: lịch sử đơn, chi tiết đơn, đổi mật khẩu, logout
- Admin Panel:
  - Quản lý sản phẩm, media
  - Quản lý đơn hàng (xem/sửa/xóa, cập nhật trạng thái shipping: Processing → Shipped → Delivered)
  - Quản lý người dùng (tạo/sửa/xóa). Lưu ý role hợp lệ: `customer` hoặc `admin`.
  - Dashboard hiển thị doanh thu (tính từ các đơn `payment_status = paid`)
- Doanh thu:
  - Tự động cộng khi đơn được đánh dấu `paid` (khi admin cập nhật, hoặc đơn thẻ Stripe tạo ở trạng thái `paid`)
  - Tự động trừ khi chuyển `paid` → non‑paid hoặc xóa đơn đang `paid`

---

## 7) Quy trình test nhanh (gợi ý)

1) Test Storefront (khách hàng)
   - Vào `http://localhost:5173/home` → vào Shop → xem sản phẩm
   - Thêm vào giỏ → nếu chưa login sẽ hỏi đăng nhập/đăng ký
   - Đăng nhập `user@test.com / 12345678`
   - Vào Cart `/cart` → Checkout `/checkout`
   - Test Stripe Card (test mode):
     - Số thẻ: `4242 4242 4242 4242`
     - Exp: bất kỳ tương lai (ví dụ 12/34)
     - CVC: 123
   - Hoàn tất thanh toán → được chuyển tới trang chi tiết đơn

2) Test Admin
   - Vào `http://127.0.0.1:8000/admin/login` → `admin@purewear.com / admin123`
   - Dashboard: kiểm tra Doanh thu đã tăng khi đơn `paid`
   - Orders: 
     - Mở chi tiết đơn → đổi `payment_status` giữa `paid`/`pending` để kiểm tra cộng/trừ doanh thu
     - Đổi trạng thái giao hàng giữa `Processing` → `Shipped` → `Delivered` (không ảnh hưởng doanh thu — doanh thu bám theo `paid`)
     - Xóa đơn `paid` → doanh thu giảm tương ứng
   - Users:
     - Thêm User mới → chọn role `Customer` hoặc `Admin` (không dùng `user`)

---

## 8) Sự cố thường gặp (Troubleshooting)

- Backend không chạy / 500 error:
  - Kiểm tra `php artisan serve` đang chạy.
  - `php artisan config:clear && php artisan cache:clear && php artisan route:clear` rồi khởi động lại server.

- Lỗi CORS/CSRF khi gọi API từ frontend:
  - Đảm bảo backend chạy tại `http://127.0.0.1:8000` và `frontend/.env` có `VITE_API_URL` trỏ đúng.

- Lỗi đăng nhập/đăng ký (422 Validation):
  - Xem message trả về để biết trường nào sai (email đã tồn tại, password không khớp, ...).

- Lỗi khi tạo User trong Admin: `SQLSTATE[01000]: 1265 Data truncated for column 'role'`:
  - Chọn role `Customer` (cột `role` ở DB là enum: `customer|admin`).

- Lỗi migration trùng cột `role`:
  - Migration đã có guard `hasColumn`. Nếu trước đó đã thêm cột `role` thủ công, hãy chỉnh/refresh migration hoặc bỏ migration thêm cột trùng lặp.

- Doanh thu không tăng:
  - Dashboard tính theo `payment_status='paid'`. Hãy set đơn sang `paid` hoặc thanh toán Stripe thành công.

---

## 9) Tùy chọn: Lưu ảnh với Cloudinary (Production‑friendly)

Xem file `DEPLOYMENT_IMAGE_SETUP.md` tại root repo. Hướng dẫn đã có đầy đủ bước cài đặt package, cấu hình `.env` và thay đổi controller/model để sinh URL ảnh.

---

## 10) Lệnh hữu ích (tham khảo)

- Chạy server backend: `php artisan serve --host=127.0.0.1 --port=8000`
- Ch dọn cache: `php artisan config:clear && php artisan cache:clear && php artisan route:clear`
- Migrate/Seed lại từ đầu: `php artisan migrate:fresh --seed`
- Sinh nhanh sản phẩm demo (Windows): chạy file `seed_products.bat` ở thư mục gốc repo
- Frontend dev: `npm run dev`

(Lệnh trên là tài liệu tham khảo — chạy trong đúng thư mục `backend` hoặc `frontend`.)

---

## 11) Ghi chú về điều hướng

- Backend `/` tự động điều hướng theo phiên admin: vào `/admin` (đã login) hoặc `/admin/login` (chưa login).
- Frontend `/home` là trang chủ cửa hàng. Navbar có **Home** và logo “Pure Wear” trỏ về `/home`.
- Một số route Storefront có bảo vệ bằng `RequireAuth` và hiển thị SweetAlert2 khi chưa đăng nhập (ví dụ `/cart`, `/checkout`, `/account`).

---

## 12) Liên hệ & mở rộng

- Muốn thay đổi chính sách doanh thu (ví dụ chỉ ghi nhận khi Delivered): có thể chỉnh Dashboard/logic cập nhật.
- Có sẵn artisan commands chuyển đổi tiền tệ (USD) cho products/orders.
- Có thể bổ sung báo cáo doanh thu theo ngày/tháng từ bảng `revenues` nếu cần.

Chúc bạn chạy dự án suôn sẻ. Nếu cần, mình có thể hỗ trợ remote fix nhanh các lỗi phát sinh trong quá trình setup/test!
