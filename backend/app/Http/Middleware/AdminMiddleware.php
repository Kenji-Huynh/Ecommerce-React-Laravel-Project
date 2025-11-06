<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }
        
        return redirect()->route('admin.login')->with('error', 'Yêu cầu quyền quản trị để truy cập');
    }
}