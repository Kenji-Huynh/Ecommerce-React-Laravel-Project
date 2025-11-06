<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Đăng ký người dùng mới (chỉ tạo role user)
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // Bảng users đang dùng enum('customer','admin'), nên luôn tạo với role 'customer'
            'role' => 'customer',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Đăng nhập và tạo token (chỉ cho phép user, không cho admin)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Thông tin đăng nhập không chính xác.'],
            ]);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        // Chỉ cho phép user đăng nhập, không cho admin
        if ($user->role === 'admin') {
            throw ValidationException::withMessages([
                'email' => ['Tài khoản admin không thể đăng nhập vào trang này. Vui lòng sử dụng trang admin panel.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Lấy thông tin người dùng hiện tại
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Đăng xuất (xóa token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công',
        ]);
    }

    /**
     * Đổi mật khẩu người dùng hiện tại
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu hiện tại không chính xác.',
                'errors' => [ 'current_password' => ['Mật khẩu hiện tại không chính xác.'] ]
            ], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công.'
        ]);
    }
}