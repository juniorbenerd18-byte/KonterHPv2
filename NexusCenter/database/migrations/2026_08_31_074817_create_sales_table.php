<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('invoice_number')->unique();
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->bigInteger('subtotal');
            $table->integer('discount')->default(0); // percentage
            $table->bigInteger('total');
            $table->bigInteger('amount_paid')->default(0);
            $table->bigInteger('change_amount')->default(0);
            $table->enum('payment_method', ['Tunai', 'Transfer', 'QRIS', 'Debit'])->default('Tunai');
            $table->string('cashier_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
