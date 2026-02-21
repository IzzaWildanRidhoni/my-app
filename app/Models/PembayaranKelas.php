<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Model PembayaranKelas
 */
class PembayaranKelas
{
    // ─── READ ──────────────────────────────────────────────────────────────────

    public static function paginate(array $filters = [], int $perPage = 10, int $page = 1): LengthAwarePaginator
    {
        $search    = $filters['search']             ?? null;
        $status    = $filters['status_verifikasi']  ?? null;
        $sortField = in_array($filters['sort'] ?? '', ['tanggal_bayar', 'jumlah_bayar', 'created_at'])
            ? $filters['sort'] : 'created_at';
        $sortDir   = ($filters['direction'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

        $where  = ['1=1'];
        $params = [];

        if ($search) {
            $where[]  = '(p.nama LIKE ? OR k.nama_kelas LIKE ?)';
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }
        if ($status) {
            $where[]  = 'pb.status_verifikasi = ?';
            $params[] = $status;
        }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        $countRow = DB::select("
            SELECT COUNT(*) as total
            FROM pembayaran_kelas pb
            JOIN pendaftaran_kelas pk ON pk.id = pb.pendaftaran_kelas_id
            JOIN peserta p  ON p.id  = pk.peserta_id
            JOIN kelas k    ON k.id  = pk.kelas_id
            {$whereSql}
        ", $params);
        $total = $countRow[0]->total ?? 0;

        $offset = ($page - 1) * $perPage;
        $rows   = DB::select("
            SELECT
                pb.*,
                pk.peserta_id,
                pk.kelas_id,
                pk.status           as status_pendaftaran,
                pk.status_pembayaran,
                p.nama              as peserta_nama,
                p.email             as peserta_email,
                p.foto              as peserta_foto,
                p.jenis_kelamin     as peserta_jk,
                k.nama_kelas,
                k.biaya             as kelas_biaya
            FROM pembayaran_kelas pb
            JOIN pendaftaran_kelas pk ON pk.id = pb.pendaftaran_kelas_id
            JOIN peserta p  ON p.id  = pk.peserta_id
            JOIN kelas k    ON k.id  = pk.kelas_id
            {$whereSql}
            ORDER BY pb.{$sortField} {$sortDir}
            LIMIT ? OFFSET ?
        ", array_merge($params, [$perPage, $offset]));

        return new LengthAwarePaginator(
            collect($rows),
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );
    }

    public static function findById(int $id): ?object
    {
        $rows = DB::select("
            SELECT
                pb.*,
                pk.peserta_id,
                pk.kelas_id,
                pk.status           as status_pendaftaran,
                pk.status_pembayaran,
                p.nama              as peserta_nama,
                p.email             as peserta_email,
                p.no_telepon        as peserta_telepon,
                p.foto              as peserta_foto,
                p.jenis_kelamin     as peserta_jk,
                k.nama_kelas,
                k.biaya             as kelas_biaya,
                k.perlu_pembayaran
            FROM pembayaran_kelas pb
            JOIN pendaftaran_kelas pk ON pk.id = pb.pendaftaran_kelas_id
            JOIN peserta p  ON p.id  = pk.peserta_id
            JOIN kelas k    ON k.id  = pk.kelas_id
            WHERE pb.id = ?
            LIMIT 1
        ", [$id]);
        return $rows[0] ?? null;
    }

    public static function findByPendaftaran(int $pendaftaranId): array
    {
        return DB::select(
            'SELECT * FROM pembayaran_kelas WHERE pendaftaran_kelas_id = ? ORDER BY created_at DESC',
            [$pendaftaranId]
        );
    }

    public static function getStats(): object
    {
        $rows = DB::select("
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status_verifikasi = 'menunggu' THEN 1 ELSE 0 END) as menunggu,
                SUM(CASE WHEN status_verifikasi = 'diterima' THEN 1 ELSE 0 END) as diterima,
                SUM(CASE WHEN status_verifikasi = 'ditolak'  THEN 1 ELSE 0 END) as ditolak,
                SUM(CASE WHEN status_verifikasi = 'diterima' THEN jumlah_bayar ELSE 0 END) as total_pendapatan
            FROM pembayaran_kelas
        ");
        return $rows[0];
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    public static function create(array $data): int
    {
        DB::insert("
            INSERT INTO pembayaran_kelas
                (pendaftaran_kelas_id, jumlah_bayar, metode_pembayaran,
                 bukti_pembayaran, tanggal_bayar, status_verifikasi, catatan_admin,
                 created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ", [
            $data['pendaftaran_kelas_id'],
            $data['jumlah_bayar'],
            $data['metode_pembayaran']  ?? null,
            $data['bukti_pembayaran'],
            $data['tanggal_bayar'],
            $data['status_verifikasi']  ?? 'menunggu',
            $data['catatan_admin']      ?? null,
        ]);

        return (int) DB::getPdo()->lastInsertId();
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    public static function verifikasi(int $id, string $status, ?string $catatan = null): bool
    {
        $affected = DB::update(
            'UPDATE pembayaran_kelas SET status_verifikasi = ?, catatan_admin = ?, updated_at = NOW() WHERE id = ?',
            [$status, $catatan, $id]
        );
        return $affected > 0;
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    public static function delete(int $id): bool
    {
        return DB::delete('DELETE FROM pembayaran_kelas WHERE id = ?', [$id]) > 0;
    }
}