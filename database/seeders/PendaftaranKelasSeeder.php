<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PendaftaranKelasSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // Ambil kelas dan peserta yang sudah ada
        $kelasList  = DB::table('kelas')->pluck('id')->toArray();
        $pesertaList = DB::table('peserta')->pluck('id')->toArray();

        if (empty($kelasList) || empty($pesertaList)) {
            $this->command->warn('PendaftaranKelasSeeder: Tidak ada kelas atau peserta. Jalankan KelasSeeder & PesertaSeeder dahulu.');
            return;
        }

        $pendaftaran = [];

        // Buat beberapa pendaftaran sample
        $samples = [
            // [peserta_idx, kelas_idx, status, status_pembayaran, hari_lalu]
            [0, 0, 'diterima',  'lunas',               30],
            [1, 0, 'diterima',  'lunas',               28],
            [2, 0, 'pending',   'menunggu_verifikasi', 5],
            [3, 0, 'pending',   'belum_bayar',         2],
            [0, 1, 'diterima',  'lunas',               25],
            [1, 2, 'diterima',  'lunas',               20],
            [2, 2, 'pending',   'belum_bayar',         3],
            [3, 3, 'diterima',  'lunas',               15],  // kelas gratis
            [0, 3, 'diterima',  'lunas',               10],  // kelas gratis
            [1, 4, 'pending',   'belum_bayar',         1],
        ];

        foreach ($samples as $s) {
            $pesertaId = $pesertaList[$s[0]] ?? $pesertaList[0];
            $kelasId   = $kelasList[$s[1]]   ?? $kelasList[0];

            // Hindari duplikasi
            $exists = collect($pendaftaran)->contains(fn($p) =>
                $p['peserta_id'] === $pesertaId && $p['kelas_id'] === $kelasId
            );
            if ($exists) continue;

            $pendaftaran[] = [
                'peserta_id'        => $pesertaId,
                'kelas_id'          => $kelasId,
                'tanggal_daftar'    => now()->subDays($s[4])->toDateString(),
                'status'            => $s[2],
                'status_pembayaran' => $s[3],
                'catatan'           => null,
                'created_at'        => now()->subDays($s[4]),
                'updated_at'        => now()->subDays($s[4]),
            ];
        }

        DB::table('pendaftaran_kelas')->insert($pendaftaran);

        $this->command->info('PendaftaranKelasSeeder: ' . count($pendaftaran) . ' pendaftaran berhasil dibuat.');
    }
}