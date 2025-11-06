# 🔧 FIX ĐĂNG KÝ/ĐĂNG NHẬP

## ✅ Đã sửa các vấn đề:

### 1. **Sanctum Middleware** (VẤN ĐỀ CHÍNH!)
- ❌ Cũ: `EnsureFrontendRequestsAreStateful` bị comment
- ✅ Mới: Đã uncomment trong `app/Http/Kernel.php`
- 🔥 **BẮT BUỘC PHẢI RESTART LARAVEL SERVER**

### 2. **ToastContainer**
- ✅ Đã thêm vào `App.jsx` để hiển thị thông báo

### 3. **API Interceptors**
- ✅ Thêm log console để debug
- ✅ Set headers `Content-Type` và `Accept`

### 4. **CORS & Sanctum Config**
- ✅ Đã thêm `SANCTUM_STATEFUL_DOMAINS` trong `.env`
- ✅ Đã thêm `SESSION_DOMAIN=localhost`

### 5. **Test Components**
- ✅ Tạo `/test-auth` route để test trực tiếp

## 🚀 CÁCH FIX (QUAN TRỌNG!):

### Bước 1: RESTART LARAVEL SERVER
```bash
# Dừng server hiện tại (Ctrl+C)
cd c:\xampp\htdocs\ecommerce\backend

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Khởi động lại
php artisan serve
```

### Bước 2: Restart Frontend (nếu cần)
```bash
# Dừng (Ctrl+C) và khởi động lại
cd c:\xampp\htdocs\ecommerce\frontend
npm run dev
```

### Bước 3: Test trên trình duyệt
1. Mở `http://localhost:5173/test-auth`
2. Mở Console (F12)
3. Click "Test Register"
4. Xem log trong Console

### Bước 4: Test trang Register thực tế
1. Truy cập `http://localhost:5173/register`
2. Điền form:
   - Họ tên: Test User
   - Email: test@example.com
   - Mật khẩu: 12345678
   - Xác nhận mật khẩu: 12345678
3. Click "Đăng Ký"
4. Nếu thành công → Toast hiện "Đăng ký thành công!"

## 🐛 Nếu vẫn lỗi:

### Lỗi: "Network Error"
➡️ Check backend có chạy không: http://127.0.0.1:8000

### Lỗi: "419 CSRF Token Mismatch"
➡️ Chạy:
```bash
php artisan config:clear
php artisan cache:clear
```

### Lỗi: "CORS Error"
➡️ Check file `.env` backend có:
```
SANCTUM_STATEFUL_DOMAINS="localhost:5173,127.0.0.1:5173"
SESSION_DOMAIN=localhost
```

### Lỗi: "422 Validation Error"
➡️ Check Console để xem lỗi cụ thể (email đã tồn tại, password không khớp, v.v.)

## 📝 Tài khoản test có sẵn:
- **Email**: user@test.com
- **Password**: 12345678

## 🔍 Debug:
- Mở Console (F12) → Tab Console
- Xem log của API Request/Response
- Kiểm tra Laravel logs: `backend/storage/logs/laravel.log`
