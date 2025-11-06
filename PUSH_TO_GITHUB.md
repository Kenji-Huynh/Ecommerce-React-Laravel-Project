# 🚀 Push Code Lên GitHub An Toàn

## ✅ HOÀN TẤT! Repo đã sạch secrets

Bạn đã làm xong các bước:
- ✅ Rotate Stripe keys mới
- ✅ Làm sạch Git history (orphan branch)
- ✅ .env không bị track
- ✅ .gitignore đầy đủ

## 📤 BƯỚC CUỐI: Force Push Lên GitHub

Vì bạn đã có remote origin, chỉ cần chạy:

```bash
cd /d c:\xampp\htdocs\ecommerce
git push -f origin main
```

**Lưu ý:** 
- Lệnh này sẽ GHI ĐÈ lịch sử trên GitHub bằng history sạch.
- Nếu có người khác đang làm việc trên repo, họ sẽ cần `git fetch` và `git reset --hard origin/main`.
- Nếu GitHub yêu cầu xác thực:
  - Dùng Personal Access Token (không phải password GitHub)
  - Tạo token tại: https://github.com/settings/tokens
  - Chọn quyền: `repo` (full)
  - Khi nhập password, paste token thay vì password

## 🔍 Xác Minh Sau Khi Push

1. **Kiểm tra GitHub Secret Scanning:**
   - Truy cập: https://github.com/Kenji-Huynh/Ecommerce-React-Laravel-Project/security/secret-scanning
   - Không còn alert mới → ✅ THÀNH CÔNG

2. **Kiểm tra History:**
   - Vào repo trên GitHub
   - Xem commits → chỉ còn 1 commit: "fresh history: secrets removed"

3. **Kiểm tra .env không bị track:**
   - Trong repo GitHub, không thấy `backend/.env` hoặc `frontend/.env`

## 📝 Nếu GitHub Vẫn Block Push

### Trường hợp 1: "secret was detected"
- Có thể còn secret trong working tree (không phải history)
- Kiểm tra lại: `git grep -i "sk_test"`
- Nếu chỉ thấy trong `backend/.env` → OK (file này ignored)

### Trường hợp 2: "Permission denied"
- Dùng PAT (Personal Access Token) thay vì password
- Hoặc setup SSH key (khuyến nghị cho dài hạn)

### Trường hợp 3: "non-fast-forward"
- Dùng `-f` để force push (bạn đang làm clean history)

## 🔐 Setup SSH Key (Khuyến Nghị)

Để không phải nhập token mỗi lần:

```bash
# 1. Tạo SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. Copy public key
type %USERPROFILE%\.ssh\id_ed25519.pub

# 3. Thêm vào GitHub:
# Settings → SSH and GPG keys → New SSH key → paste nội dung

# 4. Đổi remote sang SSH
git remote set-url origin git@github.com:Kenji-Huynh/Ecommerce-React-Laravel-Project.git

# 5. Push (không cần password)
git push -f origin main
```

## 📋 Checklist Deploy Sau Khi Push

- [ ] Push lên GitHub thành công
- [ ] Không còn secret scanning alerts
- [ ] File .env không xuất hiện trong repo
- [ ] History sạch (1 commit mới)
- [ ] Deploy Frontend lên Vercel:
  - Root Directory: `frontend/`
  - Build Command: `npm run build`
  - Output: `dist`
  - Env: `VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Deploy Backend lên Railway/Render:
  - Root Directory: `backend/`
  - Env: `STRIPE_SECRET` (key mới), `STRIPE_CURRENCY=usd`
  - Chạy: `php artisan migrate --force`

## 🎯 Lệnh Push Tóm Tắt

```bash
# Kiểm tra branch hiện tại
git branch

# Kiểm tra remote
git remote -v

# Force push (ghi đè history)
git push -f origin main

# Nếu lỗi auth, dùng SSH hoặc PAT
```

## ⚠️ Sau Khi Push - QUAN TRỌNG

1. **Revoke Stripe Keys Cũ:**
   - Vào Stripe Dashboard
   - API keys → tìm key cũ (nếu còn)
   - Delete/Revoke để chắc chắn không ai dùng

2. **Cập nhật Deploy Environments:**
   - Railway/Render: set STRIPE_SECRET (key mới)
   - Vercel: set VITE_STRIPE_PUBLISHABLE_KEY (key mới)

3. **Test Production:**
   - Thử checkout với Stripe test card: 4242 4242 4242 4242
   - Xác minh payment_status=paid
   - Kiểm tra doanh thu trong admin dashboard

---

Nếu gặp lỗi khi push, paste thông báo lỗi đầy đủ để mình debug tiếp nhé!
