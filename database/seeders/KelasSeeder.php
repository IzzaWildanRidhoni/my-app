<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $kelas = [
            [
                'nama_kelas'       => 'Tahsin Al-Quran Dasar',
                'deskripsi'        => 'Kelas belajar membaca Al-Quran dengan benar sesuai tajwid untuk pemula. Cocok bagi yang baru mulai belajar.',
                'lokasi'           => 'Aula Utama Lt. 1',
                'pengajar'         => 'Ustadz Ahmad Fauzi',
                'tipe'             => 'rutin',
                'tanggal_mulai'    => '2025-01-06',
                'tanggal_selesai'  => '2025-06-30',
                'kuota'            => 30,
                'biaya'            => 150000,
                'perlu_pembayaran' => 1,
                'status'           => 'aktif',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'nama_kelas'       => 'Tahsin Al-Quran Lanjutan',
                'deskripsi'        => 'Kelas lanjutan bagi peserta yang sudah menguasai dasar tajwid dan ingin memperdalam bacaan.',
                'lokasi'           => 'Ruang Kelas B',
                'pengajar'         => 'Ustadzah Siti Rahmah',
                'tipe'             => 'rutin',
                'tanggal_mulai'    => '2025-01-06',
                'tanggal_selesai'  => '2025-06-30',
                'kuota'            => 20,
                'biaya'            => 200000,
                'perlu_pembayaran' => 1,
                'status'           => 'aktif',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'nama_kelas'       => 'Workshop Kaligrafi Islam',
                'deskripsi'        => 'Workshop intensif seni kaligrafi Arab selama satu hari penuh bersama instruktur berpengalaman.',
                'lokasi'           => 'Studio Seni Lt. 2',
                'pengajar'         => 'Ustadz Hasan Basri',
                'tipe'             => 'event',
                'tanggal_mulai'    => '2025-03-15',
                'tanggal_selesai'  => '2025-03-15',
                'kuota'            => 25,
                'biaya'            => 100000,
                'perlu_pembayaran' => 1,
                'status'           => 'aktif',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'nama_kelas'       => 'Kajian Fiqih Muamalah',
                'deskripsi'        => 'Kajian ilmu fiqih seputar transaksi dan muamalah dalam kehidupan sehari-hari. Terbuka untuk umum tanpa biaya.',
                'lokasi'           => 'Masjid Al-Ikhlas',
                'pengajar'         => 'Ustadz Dr. Mahmud Al-Hafizh',
                'tipe'             => 'rutin',
                'tanggal_mulai'    => '2025-02-01',
                'tanggal_selesai'  => '2025-07-31',
                'kuota'            => 50,
                'biaya'            => 0,
                'perlu_pembayaran' => 0,
                'status'           => 'aktif',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
            [
                'nama_kelas'       => 'Seminar Parenting Islami',
                'deskripsi'        => 'Seminar sehari tentang pola asuh anak sesuai nilai-nilai Islam bersama narasumber dari berbagai daerah.',
                'lokasi'           => 'Aula Utama Lt. 1',
                'pengajar'         => 'Ustadzah Dr. Fatimah Azzahra',
                'tipe'             => 'event',
                'tanggal_mulai'    => '2025-04-20',
                'tanggal_selesai'  => '2025-04-20',
                'kuota'            => 100,
                'biaya'            => 50000,
                'perlu_pembayaran' => 1,
                'status'           => 'aktif',
                'created_at'       => $now,
                'updated_at'       => $now,
            ],
        ];

        DB::table('kelas')->insert($kelas);

        $this->command->info('KelasSeeder: ' . count($kelas) . ' kelas berhasil dibuat.');
    }
}