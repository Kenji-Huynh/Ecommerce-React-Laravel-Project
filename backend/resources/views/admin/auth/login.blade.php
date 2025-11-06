{{-- filepath: c:\xampp\htdocs\ecommerce\backend\resources\views\admin\auth\login.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Pure Wear</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-gold: #d4a574;
            --secondary-gold: #c89968;
            --dark-brown: #3e2723;
        }

        body {
            /* Gradient mới: Từ xanh dương nhạt sang xanh lá nhẹ */
            /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
            
            /* Hoặc chọn 1 trong các gradient đẹp sau: */
            
            /* Option 1: Gradient cam đỏ sang hồng */
            /* background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); */
            
            /* Option 2: Gradient xanh dương sang xanh lục */
            /* background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); */
            
            /* Option 3: Gradient cam vàng sang đỏ */
            /* background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); */
            
            /* Option 4: Gradient xanh lá sang xanh lam */
            /* background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); */
            
            /* Option 5: Gradient xám xanh sang xám tím */
            /* background: linear-gradient(135deg, #868f96 0%, #596164 100%); */
            
            /* Option 6: Gradient nâu vàng (phù hợp Pure Wear) */
            background: linear-gradient(135deg, #d4a574 0%, #8b6f47 100%);
            
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .auth-container {
            max-width: 450px;
            width: 100%;
            margin: 20px;
        }

        .auth-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }

        .auth-header {
            background: linear-gradient(135deg, var(--primary-gold), var(--secondary-gold));
            padding: 30px;
            text-align: center;
            color: white;
        }

        .auth-header h1 {
            margin: 0;
            font-size: 1.8rem;
            font-weight: 700;
        }

        .auth-header p {
            margin: 5px 0 0;
            opacity: 0.9;
            font-size: 0.9rem;
        }

        .auth-body {
            padding: 30px;
        }

        .nav-tabs {
            border-bottom: 2px solid #f0f0f0;
            margin-bottom: 25px;
        }

        .nav-tabs .nav-link {
            color: #666;
            border: none;
            padding: 10px 20px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .nav-tabs .nav-link:hover {
            color: var(--primary-gold);
        }

        .nav-tabs .nav-link.active {
            color: var(--primary-gold);
            border-bottom: 3px solid var(--primary-gold);
            background: none;
        }

        .form-label {
            font-weight: 600;
            color: var(--dark-brown);
            margin-bottom: 8px;
        }

        .form-control {
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 12px 15px;
            transition: all 0.3s;
        }

        .form-control:focus {
            border-color: var(--primary-gold);
            box-shadow: 0 0 0 0.2rem rgba(212, 165, 116, 0.25);
        }

        .input-group-text {
            border: 2px solid #e0e0e0;
            border-right: none;
            background: white;
            border-radius: 10px 0 0 10px;
        }

        .input-group .form-control {
            border-left: none;
            border-radius: 0 10px 10px 0;
        }

        .btn-auth {
            background: linear-gradient(135deg, var(--primary-gold), var(--secondary-gold));
            border: none;
            border-radius: 10px;
            padding: 12px;
            font-weight: 600;
            color: white;
            width: 100%;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-auth:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(212, 165, 116, 0.4);
        }

        .alert {
            border-radius: 10px;
            border: none;
        }

        .form-check-input:checked {
            background-color: var(--primary-gold);
            border-color: var(--primary-gold);
        }

        .invalid-feedback {
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h1><i class="fas fa-tshirt me-2"></i>Pure Wear</h1>
                <p>Admin Panel</p>
            </div>

            <div class="auth-body">
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul class="mb-0">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @if (session('success'))
                    <div class="alert alert-success">
                        {{ session('success') }}
                    </div>
                @endif

                <!-- Tabs -->
                <ul class="nav nav-tabs" id="authTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab">
                            Đăng nhập
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button" role="tab">
                            Đăng ký
                        </button>
                    </li>
                </ul>

                <div class="tab-content" id="authTabsContent">
                    <!-- Login Form -->
                    <div class="tab-pane fade show active" id="login" role="tabpanel">
                        <form method="POST" action="{{ route('admin.login') }}">
                            @csrf

                            <div class="mb-3">
                                <label for="login-email" class="form-label">Email</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                    <input 
                                        type="email" 
                                        class="form-control @error('email') is-invalid @enderror" 
                                        id="login-email" 
                                        name="email" 
                                        value="{{ old('email') }}" 
                                        required 
                                        autofocus
                                        placeholder="admin@purewear.com"
                                    >
                                </div>
                                @error('email')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="login-password" class="form-label">Mật khẩu</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                    <input 
                                        type="password" 
                                        class="form-control @error('password') is-invalid @enderror" 
                                        id="login-password" 
                                        name="password" 
                                        required
                                        placeholder="••••••••"
                                    >
                                </div>
                                @error('password')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="remember" name="remember">
                                <label class="form-check-label" for="remember">Ghi nhớ đăng nhập</label>
                            </div>

                            <button type="submit" class="btn btn-auth">
                                <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
                            </button>
                        </form>
                    </div>

                    <!-- Register Form -->
                    <div class="tab-pane fade" id="register" role="tabpanel">
                        <form method="POST" action="{{ route('admin.register') }}">
                            @csrf

                            <div class="mb-3">
                                <label for="register-name" class="form-label">Họ tên</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                                    <input 
                                        type="text" 
                                        class="form-control @error('name') is-invalid @enderror" 
                                        id="register-name" 
                                        name="name" 
                                        value="{{ old('name') }}" 
                                        required
                                        placeholder="Nguyễn Văn A"
                                    >
                                </div>
                                @error('name')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="register-email" class="form-label">Email</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                    <input 
                                        type="email" 
                                        class="form-control @error('email') is-invalid @enderror" 
                                        id="register-email" 
                                        name="email" 
                                        value="{{ old('email') }}" 
                                        required
                                        placeholder="admin@purewear.com"
                                    >
                                </div>
                                @error('email')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="register-password" class="form-label">Mật khẩu</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                    <input 
                                        type="password" 
                                        class="form-control @error('password') is-invalid @enderror" 
                                        id="register-password" 
                                        name="password" 
                                        required
                                        placeholder="••••••••"
                                    >
                                </div>
                                @error('password')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="register-password-confirm" class="form-label">Xác nhận mật khẩu</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                    <input 
                                        type="password" 
                                        class="form-control" 
                                        id="register-password-confirm" 
                                        name="password_confirmation" 
                                        required
                                        placeholder="••••••••"
                                    >
                                </div>
                            </div>

                            <button type="submit" class="btn btn-auth">
                                <i class="fas fa-user-plus me-2"></i>Đăng ký
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-3 text-white">
            <small>&copy; 2025 Pure Wear. All rights reserved.</small>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
</body>
</html>