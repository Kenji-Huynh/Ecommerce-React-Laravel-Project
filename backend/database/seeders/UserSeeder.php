<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Tạo user test nếu chưa tồn tại
        if (!User::where('email', 'user@test.com')->exists()) {
            User::create([
                'name' => 'User Test',
                'email' => 'user@test.com',
                'password' => Hash::make('12345678'),
                'role' => 'customer',
            ]);

            echo "✅ User test đã được tạo (email: user@test.com, password: 12345678)\n";
        }

        // Tạo thêm một số user khác
        if (!User::where('email', 'john@example.com')->exists()) {
            User::create([
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
            ]);
        }

        if (!User::where('email', 'jane@example.com')->exists()) {
            User::create([
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'role' => 'customer',
            ]);
        }
    }
}
