<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            [
                'name' => 'Men',
                'image' => 'categories/men.jpg',
                'sort_order' => 1,
            ],
            [
                'name' => 'Women',
                'image' => 'categories/women.jpg',
                'sort_order' => 2,
            ],
            [
                'name' => 'Kids',
                'image' => 'categories/kids.jpg',
                'sort_order' => 3,
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'image' => $category['image'],
                'sort_order' => $category['sort_order'],
                'is_active' => true,
            ]);
        }
    }
}