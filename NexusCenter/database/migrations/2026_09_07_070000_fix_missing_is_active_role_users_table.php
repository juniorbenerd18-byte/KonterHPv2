<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambah kolom role dan is_active ke tabel users jika belum ada.
     * Migration ini dibuat karena migration sebelumnya sudah dicatat
     * sebagai "Ran" tapi kolom sebenarnya tidak terbuat di database.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role', 20)->default('kasir')->after('email');
            }
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('role');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('users', 'is_active')) {
                $columns[] = 'is_active';
            }
            if (Schema::hasColumn('users', 'role')) {
                $columns[] = 'role';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
