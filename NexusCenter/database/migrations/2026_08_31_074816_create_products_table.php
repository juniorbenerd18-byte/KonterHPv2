<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['smartphone', 'aksesoris', 'pulsa']);
            $table->string('brand')->nullable();
            $table->bigInteger('price');
            $table->integer('stock')->default(0);
            $table->string('icon')->default('📱');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->float('rating')->default(0);
            $table->integer('review_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
