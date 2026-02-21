<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PembayaranKelasSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil pendaftaran yang perlu bayar (bukan gratis / belum bayar)
        $pendaftaranList = DB::table('pendaftaran_kelas as pk')
            ->join('kelas as k', 'k.id', '=', 'pk.kelas_id')
            ->where('k.perlu_pembayaran', 1)
            ->where('k.biaya', '>', 0)
            ->whereIn('pk.status_pembayaran', ['lunas', 'menunggu_verifikasi'])
            ->select('pk.id', 'pk.status_pembayaran', 'k.biaya', 'pk.tanggal_daftar')
            ->get();

        if ($pendaftaranList->isEmpty()) {
            $this->command->warn('PembayaranKelasSeeder: Tidak ada pendaftaran yang memerlukan pembayaran.');
            return;
        }

        $pembayaran = [];

        foreach ($pendaftaranList as $p) {
            $statusVerifikasi = $p->status_pembayaran === 'lunas' ? 'diterima' : 'menunggu';

            $pembayaran[] = [
                'pendaftaran_kelas_id' => $p->id,
                'jumlah_bayar'         => $p->biaya,
                'metode_pembayaran'    => collect(['Transfer Bank', 'QRIS', 'Tunai'])->random(),
                'bukti_pembayaran'     => 'pembayaran/bukti/sample_bukti.jpg', // placeholder
                'tanggal_bayar'        => now()->subDays(rand(1, 10))->toDateString(),
                'status_verifikasi'    => $statusVerifikasi,
                'catatan_admin'        => $statusVerifikasi === 'diterima' ? 'Pembayaran telah dikonfirmasi.' : null,
                'created_at'           => now()->subDays(rand(1, 10)),
                'updated_at'           => now(),
            ];
        }

        DB::table('pembayaran_kelas')->insert($pembayaran);

        $this->command->info('PembayaranKelasSeeder: ' . count($pembayaran) . ' pembayaran berhasil dibuat.');
    }
}