<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayaran_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_kelas_id')->constrained('pendaftaran_kelas')->onDelete('cascade');
            $table->decimal('jumlah_bayar', 12, 2);
            $table->string('metode_pembayaran')->nullable();
            $table->string('bukti_pembayaran');
            $table->dateTime('tanggal_bayar');
            $table->enum('status_verifikasi', ['menunggu', 'diterima', 'ditolak'])->default('menunggu');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayaran_kelas');
    }
};