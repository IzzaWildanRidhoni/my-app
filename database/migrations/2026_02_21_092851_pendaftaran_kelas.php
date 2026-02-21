<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pendaftaran_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('peserta_id')->constrained('peserta')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->date('tanggal_daftar');
            $table->enum('status', ['pending', 'diterima', 'ditolak', 'batal'])->default('pending');
            $table->enum('status_pembayaran', [
                'belum_bayar',
                'menunggu_verifikasi',
                'lunas',
                'ditolak'
            ])->default('belum_bayar');
            $table->text('catatan')->nullable();
            $table->timestamps();
            $table->unique(['peserta_id', 'kelas_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_kelas');
    }
};