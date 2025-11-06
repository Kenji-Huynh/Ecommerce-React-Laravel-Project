<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('revenues', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->decimal('amount', 12, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('revenues');
    }
};
