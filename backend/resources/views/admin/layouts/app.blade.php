<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - Pure Wear Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <style>
        .sidebar {
            min-height: 100vh;
            background-color: #343a40;
        }
        .sidebar .nav-link {
            color: rgba(255,255,255,.75);
        }
        .sidebar .nav-link.active {
            color: #fff;
        }
        .sidebar .nav-link:hover {
            color: #fff;
        }
        
        /* Custom Pagination Styles */
        .pagination {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin-top: 30px;
        }
        
        .pagination .page-item {
            list-style: none;
        }
        
        .pagination .page-link {
            position: relative;
            display: block;
            padding: 10px 16px;
            font-size: 14px;
            font-weight: 500;
            color: #6c757d;
            text-decoration: none;
            background-color: #fff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            transition: all 0.3s ease;
            min-width: 45px;
            text-align: center;
        }
        
        .pagination .page-link:hover {
            color: #fff;
            background-color: #0d6efd;
            border-color: #0d6efd;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
        }
        
        .pagination .page-item.active .page-link {
            z-index: 3;
            color: #fff;
            font-weight: 600;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .pagination .page-item.disabled .page-link {
            color: #adb5bd;
            pointer-events: none;
            background-color: #f8f9fa;
            border-color: #dee2e6;
            opacity: 0.6;
        }
        
        .pagination .page-link:focus {
            z-index: 3;
            outline: 0;
            box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
        }
        
        /* Previous/Next buttons */
        .pagination .page-item:first-child .page-link,
        .pagination .page-item:last-child .page-link {
            font-weight: 600;
            padding: 10px 20px;
        }
        
        /* Responsive */
        @media (max-width: 576px) {
            .pagination .page-link {
                padding: 8px 12px;
                font-size: 13px;
                min-width: 38px;
            }
            
            .pagination .page-item:first-child .page-link,
            .pagination .page-item:last-child .page-link {
                padding: 8px 14px;
            }
        }
        
        /* Table improvements */
        .table-hover tbody tr:hover {
            background-color: rgba(102, 126, 234, 0.05);
            transition: background-color 0.2s ease;
        }
        
        .btn-group .btn {
            transition: all 0.2s ease;
        }
        
        .btn-group .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 d-md-block sidebar collapse">
                <div class="position-sticky pt-3">
                    <div class="text-center mb-4">
                        <h5 class="text-white">Pure Wear Admin</h5>
                    </div>
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" href="{{ route('admin.dashboard') }}">
                                <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('admin.products.*') ? 'active' : '' }}" href="{{ route('admin.products.index') }}">
                                <i class="fas fa-box me-2"></i>Sản phẩm
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('admin.orders.*') ? 'active' : '' }}" href="{{ route('admin.orders.index') }}">
                                <i class="fas fa-shopping-cart me-2"></i>Đơn hàng
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('admin.users.*') ? 'active' : '' }}" href="{{ route('admin.users.index') }}">
                                <i class="fas fa-users me-2"></i>Người dùng
                            </a>
                        </li>
                        <li class="nav-item">
                            <form action="{{ route('admin.logout') }}" method="POST" class="d-inline">
                                @csrf
                                <button type="submit" class="nav-link border-0 bg-transparent">
                                    <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
                                </button>
                            </form>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Main content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                @yield('content')
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    @yield('scripts')
</body>
</html>