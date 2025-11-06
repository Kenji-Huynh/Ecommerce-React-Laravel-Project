# 📸 Giải pháp Upload Ảnh cho Production

## ⚠️ Vấn đề hiện tại
- Local: Ảnh lưu vào `public/storage` → OK
- Deploy: Filesystem bị reset mỗi khi redeploy → ❌ MẤT ẢNH

---

## ✅ GIẢI PHÁP 1: CLOUDINARY (Khuyên dùng - Free 25GB)

### Bước 1: Đăng ký Cloudinary
1. Truy cập: https://cloudinary.com/users/register/free
2. Lấy thông tin:
   - Cloud Name
   - API Key
   - API Secret

### Bước 2: Cài đặt Laravel Cloudinary
```bash
cd c:\xampp\htdocs\ecommerce\backend
composer require cloudinary-labs/cloudinary-laravel
```

### Bước 3: Cấu hình .env (Backend)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name

# Đổi filesystem mặc định
FILESYSTEM_DISK=cloudinary
```

### Bước 4: Cấu hình config/filesystems.php
```php
'disks' => [
    // ... existing disks

    'cloudinary' => [
        'driver' => 'cloudinary',
        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        'api_key' => env('CLOUDINARY_API_KEY'),
        'api_secret' => env('CLOUDINARY_API_SECRET'),
    ],
],

// Đổi default disk
'default' => env('FILESYSTEM_DISK', 'cloudinary'),
```

### Bước 5: Sửa Controller Upload (Backend)
```php
// app/Http/Controllers/Admin/ProductController.php

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required',
        'price' => 'required|numeric',
        'main_image' => 'required|image|max:2048',
        'images.*' => 'image|max:2048',
    ]);

    // Upload main image to Cloudinary
    if ($request->hasFile('main_image')) {
        $path = $request->file('main_image')->store('products', 'cloudinary');
        $validated['main_image'] = $path;
        
        // Hoặc lấy full URL:
        // $validated['main_image'] = Storage::disk('cloudinary')->url($path);
    }

    $product = Product::create($validated);

    // Upload additional images
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $path = $image->store('products', 'cloudinary');
            $product->images()->create(['image_path' => $path]);
        }
    }

    return response()->json($product->load('images'), 201);
}
```

### Bước 6: Helper để lấy URL (Backend)
```php
// app/helpers.php (tạo mới nếu chưa có)
use Illuminate\Support\Facades\Storage;

if (!function_exists('cloudinary_url')) {
    function cloudinary_url($path) {
        if (!$path) return null;
        
        // Nếu đã là full URL
        if (str_starts_with($path, 'http')) {
            return $path;
        }
        
        // Generate Cloudinary URL
        return Storage::disk('cloudinary')->url($path);
    }
}
```

### Bước 7: Autoload helper (composer.json)
```json
{
    "autoload": {
        "files": [
            "app/helpers.php"
        ],
        "psr-4": {
            "App\\": "app/"
        }
    }
}
```

Chạy: `composer dump-autoload`

### Bước 8: Sửa API Response (Backend)
```php
// app/Models/Product.php
protected $appends = ['main_image_url', 'images_urls'];

public function getMainImageUrlAttribute()
{
    return cloudinary_url($this->main_image);
}

public function getImagesUrlsAttribute()
{
    return $this->images->map(function($img) {
        return cloudinary_url($img->image_path);
    });
}
```

---

## ✅ GIẢI PHÁP 2: AWS S3 (Professional)

### Bước 1: Tạo AWS Account & S3 Bucket
1. Đăng ký AWS: https://aws.amazon.com/free
2. Tạo S3 Bucket
3. Tạo IAM User với quyền S3 Full Access
4. Lấy Access Key & Secret Key

### Bước 2: Cài đặt Laravel
```bash
composer require league/flysystem-aws-s3-v3 "^3.0"
```

### Bước 3: Cấu hình .env
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=your-bucket-name
AWS_USE_PATH_STYLE_ENDPOINT=false

FILESYSTEM_DISK=s3
```

### Bước 4: Upload với S3
```php
// Same như Cloudinary, chỉ đổi disk
$path = $request->file('main_image')->store('products', 's3');
$url = Storage::disk('s3')->url($path);
```

---

## ✅ GIẢI PHÁP 3: Database Storage (Không khuyên dùng)

Lưu ảnh dạng Base64 trong database - **CHỈ DÙNG CHO TESTING**

```php
// Store
$imageData = base64_encode(file_get_contents($request->file('main_image')));
$product->main_image = $imageData;

// Display (Frontend)
<img src={`data:image/jpeg;base64,${product.main_image}`} />
```

❌ **Hạn chế:** Database phình to, chậm, không nên dùng production

---

## ✅ GIẢI PHÁP 4: External Storage Server

Nếu bạn có VPS riêng:
1. Setup storage server (Nginx/Apache)
2. Upload qua SSH/SFTP
3. Serve ảnh qua subdomain: `https://cdn.yourdomain.com/images/`

---

## 🎯 So sánh các giải pháp

| Giải pháp | Free Tier | Dễ setup | Performance | Khuyên dùng |
|-----------|-----------|----------|-------------|-------------|
| **Cloudinary** | 25GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ **Best choice** |
| **AWS S3** | 5GB (1 năm) | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Cho scale lớn |
| **Google Cloud** | $300 credit | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Nếu quen GCP |
| **Database** | Unlimited | ⭐⭐⭐⭐⭐ | ⭐ | ❌ Chỉ test |
| **Local disk** | Unlimited | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ❌ Deploy fail |

---

## 🚀 Khuyến nghị cho bạn

### Nếu mới bắt đầu: **DÙNG CLOUDINARY**
- Free 25GB
- Setup 10 phút
- Laravel driver sẵn
- CDN auto
- Image transformation (resize, crop, optimize)

### Setup nhanh nhất (5 phút):

1. **Đăng ký Cloudinary Free**: https://cloudinary.com/users/register/free

2. **Cài package**:
   ```bash
   cd c:\xampp\htdocs\ecommerce\backend
   composer require cloudinary-labs/cloudinary-laravel
   ```

3. **Copy credentials vào .env**:
   ```env
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   FILESYSTEM_DISK=cloudinary
   ```

4. **Sửa 1 dòng trong controller**:
   ```php
   // Thay vì:
   $path = $request->file('main_image')->store('products');
   
   // Dùng:
   $path = $request->file('main_image')->store('products', 'cloudinary');
   ```

5. **Done!** ✅ Ảnh tự động lên cloud, không mất khi redeploy

---

## 📝 Checklist Deploy

- [ ] Đã đăng ký Cloud Storage (Cloudinary/S3)
- [ ] Đã cài package Laravel
- [ ] Đã cấu hình .env với credentials
- [ ] Đã test upload local → thấy ảnh lên cloud
- [ ] Đã deploy backend với .env mới
- [ ] Đã test upload production → OK
- [ ] (Optional) Migrate ảnh cũ lên cloud

---

Bạn muốn tôi giúp implement giải pháp nào? Tôi khuyên **Cloudinary** vì nhanh nhất! 🚀
