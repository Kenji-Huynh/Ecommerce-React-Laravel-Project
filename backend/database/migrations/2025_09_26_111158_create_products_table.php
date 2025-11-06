<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('compare_price', 10, 2)->nullable();
            $table->integer('discount')->default(0);
            $table->string('sku')->nullable();
            $table->boolean('is_new')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('in_stock')->default(true);
            $table->integer('stock_quantity')->default(0);
            $table->string('main_image');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->json('sizes')->nullable();
            $table->json('colors')->nullable();
            $table->json('tags')->nullable();
            $table->float('rating')->default(0);
            $table->integer('reviews_count')->default(0);
            $table->string('material')->nullable();
            $table->string('origin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};