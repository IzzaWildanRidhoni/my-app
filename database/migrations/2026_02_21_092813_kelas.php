<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kelas', 150);
            $table->text('deskripsi')->nullable();
            $table->text('deskripsi_setelah_lunas')->nullable()->comment('Ditampilkan kepada peserta setelah pembayaran dikonfirmasi lunas');
            $table->string('lokasi')->nullable();
            $table->string('pengajar')->nullable();
            $table->enum('tipe', ['event', 'rutin'])->default('event');
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->integer('kuota')->nullable();
            $table->decimal('biaya', 12, 2)->default(0);
            $table->boolean('perlu_pembayaran')->default(true);
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};