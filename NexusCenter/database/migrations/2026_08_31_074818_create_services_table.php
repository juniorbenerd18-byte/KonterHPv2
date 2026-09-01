<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('nota_number')->unique();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('device');
            $table->string('service_type');
            $table->text('issue')->nullable();
            $table->bigInteger('price')->default(0);
            $table->bigInteger('deposit')->default(0);
            $table->enum('status', ['Diterima', 'Dalam Proses', 'Menunggu Sparepart', 'Selesai', 'Diambil'])->default('Diterima');
            $table->date('estimated_date')->nullable();
            $table->string('technician')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
