<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DashboardController extends Controller
{
    public function index()
    {
        $user  = auth()->user();
        $stats = [];

        if ($user->hasRole('admin')) {
            $stats = $this->getAdminStats();
        } else {
            $stats = $this->getUserStats($user);
        }

        return Inertia::render('Dashboard', [
            'stats'    => $stats,
            'userRole' => $user->getRoleNames()->first(),
        ]);
    }

    // ─── Admin Stats ──────────────────────────────────────────────────────────

    private function getAdminStats(): array
    {
        // Statistik dasar
        $overview = DB::select("
            SELECT
                (SELECT COUNT(*) FROM peserta WHERE deleted_at IS NULL) as total_peserta,
                (SELECT COUNT(*) FROM kelas WHERE deleted_at IS NULL) as total_kelas,
                (SELECT COUNT(*) FROM kelas WHERE deleted_at IS NULL AND status = 'aktif') as kelas_aktif,
                (SELECT COUNT(*) FROM pendaftaran_kelas) as total_pendaftaran,
                (SELECT COUNT(*) FROM pendaftaran_kelas WHERE status_pembayaran = 'menunggu_verifikasi') as menunggu_verifikasi,
                (SELECT COUNT(*) FROM pendaftaran_kelas WHERE status_pembayaran = 'lunas') as total_lunas,
                (SELECT COALESCE(SUM(jumlah_bayar), 0) FROM pembayaran_kelas WHERE status_verifikasi = 'diterima') as total_pendapatan,
                (SELECT COUNT(*) FROM pembayaran_kelas WHERE status_verifikasi = 'menunggu') as bukti_menunggu
        ")[0];

        // Pendaftaran 6 bulan terakhir (untuk chart line)
        $pendaftaranBulanan = DB::select("
            SELECT
                DATE_FORMAT(created_at, '%Y-%m') as bulan,
                DATE_FORMAT(created_at, '%b %Y') as label,
                COUNT(*) as total,
                SUM(CASE WHEN status_pembayaran = 'lunas' THEN 1 ELSE 0 END) as lunas
            FROM pendaftaran_kelas
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')
            ORDER BY bulan ASC
        ");

        // Distribusi status pendaftaran (untuk pie chart)
        $statusPendaftaran = DB::select("
            SELECT status, COUNT(*) as total
            FROM pendaftaran_kelas
            GROUP BY status
        ");

        // Top 5 kelas terpopuler
        $topKelas = DB::select("
            SELECT
                k.nama_kelas,
                k.tipe,
                COUNT(pk.id) as jumlah_peserta,
                k.kuota
            FROM kelas k
            LEFT JOIN pendaftaran_kelas pk ON pk.kelas_id = k.id AND pk.status != 'batal'
            WHERE k.deleted_at IS NULL
            GROUP BY k.id, k.nama_kelas, k.tipe, k.kuota
            ORDER BY jumlah_peserta DESC
            LIMIT 5
        ");

        // Pendapatan per bulan 6 bulan terakhir
        $pendapatanBulanan = DB::select("
            SELECT
                DATE_FORMAT(created_at, '%Y-%m') as bulan,
                DATE_FORMAT(created_at, '%b %Y') as label,
                SUM(jumlah_bayar) as total
            FROM pembayaran_kelas
            WHERE status_verifikasi = 'diterima'
              AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')
            ORDER BY bulan ASC
        ");

        // Peserta baru per bulan
        $pesertaBaru = DB::select("
            SELECT
                DATE_FORMAT(created_at, '%b %Y') as label,
                COUNT(*) as total
            FROM peserta
            WHERE deleted_at IS NULL
              AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')
            ORDER BY MIN(created_at) ASC
        ");

        return [
            'overview'           => $overview,
            'pendaftaran_bulanan' => $pendaftaranBulanan,
            'status_pendaftaran' => $statusPendaftaran,
            'top_kelas'          => $topKelas,
            'pendapatan_bulanan' => $pendapatanBulanan,
            'peserta_baru'       => $pesertaBaru,
            'total_users'        => User::count(),
            'total_roles'        => Role::count(),
            'total_permissions'  => Permission::count(),
        ];
    }

    // ─── User Stats ───────────────────────────────────────────────────────────

    private function getUserStats($user): array
    {
        // Cari peserta berdasarkan user
        $peserta = DB::select(
            'SELECT * FROM peserta WHERE user_id = ? AND deleted_at IS NULL LIMIT 1',
            [$user->id]
        )[0] ?? null;

        if (!$peserta) {
            // Fallback email
            $rows = DB::select(
                'SELECT * FROM peserta WHERE email = ? AND deleted_at IS NULL LIMIT 1',
                [$user->email]
            );
            $peserta = $rows[0] ?? null;
        }

        if (!$peserta) {
            return ['has_peserta' => false];
        }

        // Statistik pendaftaran user
        $overview = DB::select("
            SELECT
                COUNT(*) as total_daftar,
                SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as diterima,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status_pembayaran = 'lunas' THEN 1 ELSE 0 END) as lunas,
                SUM(CASE WHEN status_pembayaran = 'belum_bayar' THEN 1 ELSE 0 END) as belum_bayar,
                SUM(CASE WHEN status_pembayaran = 'menunggu_verifikasi' THEN 1 ELSE 0 END) as menunggu_verifikasi
            FROM pendaftaran_kelas
            WHERE peserta_id = ?
        ", [$peserta->id])[0] ?? null;

        // Riwayat pendaftaran terbaru
        $riwayat = DB::select("
            SELECT
                pk.id,
                pk.status,
                pk.status_pembayaran,
                pk.tanggal_daftar,
                k.nama_kelas,
                k.tipe as kelas_tipe,
                k.biaya as kelas_biaya,
                k.tanggal_mulai,
                k.lokasi
            FROM pendaftaran_kelas pk
            JOIN kelas k ON k.id = pk.kelas_id
            WHERE pk.peserta_id = ?
            ORDER BY pk.created_at DESC
            LIMIT 5
        ", [$peserta->id]);

        // Status pembayaran distribusi (pie)
        $statusBayar = DB::select("
            SELECT status_pembayaran as status, COUNT(*) as total
            FROM pendaftaran_kelas
            WHERE peserta_id = ?
            GROUP BY status_pembayaran
        ", [$peserta->id]);

        // Kelas aktif yang bisa diikuti (belum daftar)
        $kelasAktif = DB::select("
            SELECT COUNT(*) as total
            FROM kelas
            WHERE status = 'aktif'
              AND deleted_at IS NULL
              AND id NOT IN (
                  SELECT kelas_id FROM pendaftaran_kelas
                  WHERE peserta_id = ? AND status != 'batal'
              )
        ", [$peserta->id])[0]->total ?? 0;

        return [
            'has_peserta'  => true,
            'peserta'      => $peserta,
            'overview'     => $overview,
            'riwayat'      => $riwayat,
            'status_bayar' => $statusBayar,
            'kelas_tersedia' => $kelasAktif,
        ];
    }
}
