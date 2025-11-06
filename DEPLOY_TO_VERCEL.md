# Deploy lên Vercel (và backend)

Ngắn gọn: Vercel rất phù hợp để deploy frontend (React + Vite). Backend Laravel (PHP) không phù hợp chạy trực tiếp trên Vercel vì:
- Vercel tối ưu cho serverless Node/Edge; PHP không phải runtime chính thức cho app stateful.
- Laravel cần runtime PHP-FPM, queue, scheduler, storage… và filesystem trên Vercel là ephemeral.

=> Kiến trúc khuyến nghị:
- Frontend (React): Vercel
- Backend (Laravel): Render / Railway / Fly.io / DigitalOcean App Platform / VPS (Forge) / Laravel Vapor (AWS)
- Database: MySQL managed (Railway, PlanetScale, RDS…)
- Media: Cloudinary (đã có hướng dẫn trong `DEPLOYMENT_IMAGE_SETUP.md`) để tránh mất file khi deploy lại.

---

## 1) Tổng quan kiến trúc production

- `https://your-frontend.vercel.app` → gọi API `https://api.your-backend.com`
- Backend expose API REST (Sanctum token Bearer) → không phụ thuộc cookie stateful, CORS dễ cấu hình.
- Ảnh: lưu Cloudinary, trả URL public.

---

## 2) Deploy Frontend lên Vercel

1) Push code repo lên GitHub.
2) Tạo Project mới trên Vercel → Import repo → chọn thư mục `frontend/` làm **Root Directory**.
3) Thiết lập build:
   - Framework: Vite (React)
   - Build Command: `npm run build`
   - Output: `dist`
4) Environment Variables (Vercel → Settings → Environment Variables):
   - `VITE_API_URL` = `https://api.your-backend.com` (domain backend bạn triển khai)
   - `VITE_STRIPE_PUBLISHABLE_KEY` = khóa publishable test/prod của Stripe
5) Deploy → domain ví dụ: `https://purewear.vercel.app`.

Lưu ý: Trang chủ storefront ở `/home` (logo và mục "Home" trỏ về `/home`).

---

## 3) Deploy Backend (khuyến nghị Render/Railway)

Vercel không phù hợp cho Laravel. Bạn nên chọn một trong các nhà cung cấp dưới đây:

### 3.1 Option A — Railway (nhanh cho demo)

- Railway tự phát hiện PHP qua Nixpacks, chạy được demo (không tối ưu production).
- Các bước:
  1) Tạo project Railway → New → Deploy from GitHub repo.
  2) Chọn **Root Directory**: `backend/`.
  3) Start Command (Service → Settings):
     - Demo: `php -S 0.0.0.0:$PORT -t public`
     - Hoặc: `php -d variables_order=EGPCS -S 0.0.0.0:$PORT -t public public/index.php`
     - Lưu ý: built-in server của PHP chỉ nên dùng demo/staging.
  4) Environment Variables:
     - `APP_ENV=production`
     - `APP_DEBUG=false`
     - `APP_KEY=` (tạo bằng `php -r "echo base64_encode(random_bytes(32));";` rồi thêm tiền tố `base64:`)
     - `APP_URL=https://api.your-backend.com`
     - DB: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (dùng Railway MySQL plugin hoặc PlanetScale)
     - Stripe: `STRIPE_SECRET`, `STRIPE_CURRENCY=usd`
     - Storage (khuyên dùng): `FILESYSTEM_DISK=cloudinary` và `CLOUDINARY_URL=cloudinary://...` (xem `DEPLOYMENT_IMAGE_SETUP.md`)
  5) Post-deploy (migrations): bật Shell/Deploy hooks để chạy: `php artisan migrate --force`

- CORS: trong `backend/config/cors.php`, thêm domain frontend Vercel vào `allowed_origins` (hoặc `allowed_origins_patterns`).

### 3.2 Option B — Render (ổn định hơn cho production tối giản)

- Tạo Web Service từ repo, **Root Directory** = `backend/`.
- Dùng Blueprint hoặc Docker (Laravel + Nginx + PHP-FPM) theo hướng dẫn của Render.
- Env variables tương tự Railway.
- Command phổ biến (Docker): chạy `php-fpm` + `nginx`; hoặc dùng Build & Start theo mẫu của Render (tham khảo docs Render cho Laravel).
- Post-deploy: `php artisan migrate --force`.

### 3.3 Option C — Forge/VPS hoặc Laravel Vapor (production chuẩn)

- Forge + VPS (DigitalOcean) cho full kiểm soát (Nginx + PHP-FPM + Supervisor queue…)
- Laravel Vapor (AWS Lambda) cho serverless PHP (tốn công setup nhưng mở rộng tốt).

---

## 4) Cấu hình quan trọng Backend khi lên cloud

- `.env` backend:
  - `APP_URL=https://api.your-backend.com`
  - `APP_ENV=production`, `APP_DEBUG=false`
  - DB… (theo nhà cung cấp MySQL)
  - Stripe: `STRIPE_SECRET`, `STRIPE_CURRENCY=usd`
  - Storage: ưu tiên Cloudinary (`FILESYSTEM_DISK=cloudinary`, `CLOUDINARY_URL=...`)
- CORS (`config/cors.php`): thêm domain Vercel (`https://your-frontend.vercel.app`) vào allowed origins.
- Sanctum: Bạn đang dùng Bearer token (auth:sanctum) → không cần cấu hình stateful domain; chỉ cần CORS đúng.
- Admin panel: chạy trên domain backend: `https://api.your-backend.com/admin`.

---

## 5) Liên kết Frontend ↔ Backend

- Sau khi backend có domain (ví dụ `https://api.purewear.xyz`):
  - Vào Vercel → Project Frontend → Settings → Environment Variables → cập nhật `VITE_API_URL`.
  - Redeploy frontend để áp dụng.

---

## 6) Kiểm thử sau khi deploy

1) Mở frontend Vercel `/home` → duyệt sản phẩm.
2) Đăng ký/Đăng nhập → thêm giỏ hàng → Checkout Stripe (test card 4242 4242 4242 4242).
3) Backend Admin → đăng nhập → Dashboard xem Doanh thu (bám theo `payment_status=paid`).
4) Chuyển `payment_status` giữa `paid`/`pending` để xác minh logic cộng/trừ doanh thu.

---

## 7) Câu hỏi thường gặp

- Có chạy cả backend Laravel trực tiếp trên Vercel được không?
  - Không khuyến nghị. Vercel không có PHP runtime stateful sẵn sàng cho Laravel. Hãy dùng Render/Railway/Forge/Vapor.
- Ảnh sản phẩm lưu ở đâu khi deploy?
  - Dùng Cloudinary (xem `DEPLOYMENT_IMAGE_SETUP.md`). Filesystem ephemeral của nhiều PaaS sẽ mất file khi redeploy.
- Stripe webhook có bắt buộc không?
  - Flow hiện tại không yêu cầu webhook (client confirm + tạo order). Nếu sau này cần refund/webhook events, hãy cấu hình server endpoint chuyên dụng.

---

## 8) Checklist nhanh

- [ ] Backend chạy trên domain riêng, DB hoạt động
- [ ] `APP_URL`, `CORS` đã set cho domain Vercel
- [ ] Cloudinary cấu hình (nếu dùng upload ảnh)
- [ ] Stripe keys chuẩn môi trường
- [ ] Frontend Vercel `VITE_API_URL` trỏ đúng backend
- [ ] Migrate/seed đã chạy thành công

Nếu cần, mình có thể tạo sẵn cấu hình Render/Railway (Dockerfile/Nixpacks) để bạn bấm deploy là chạy.
