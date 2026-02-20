<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * PesertaRepository
 * Semua query menggunakan raw SQL melalui DB::select / DB::insert / DB::update / DB::delete
 * TIDAK menggunakan Eloquent ORM sama sekali.
 */
class PesertaRepository
{
    // ─── READ ──────────────────────────────────────────────────────────────────

    /**
     * Ambil semua peserta dengan filter, search, sort, dan pagination (manual).
     */
    public function paginate(array $filters = [], int $perPage = 10, int $page = 1): LengthAwarePaginator
    {
        $search    = $filters['search']    ?? null;
        $status    = $filters['status']    ?? null;
        $kegiatan  = $filters['kegiatan']  ?? null;
        $sortField = in_array($filters['sort'] ?? '', ['nama', 'nik', 'tanggal_daftar', 'status', 'created_at'])
            ? ($filters['sort'] ?? 'created_at') : 'created_at';
        $sortDir   = ($filters['direction'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

        // ── WHERE clauses ──
        $where  = ['p.deleted_at IS NULL'];
        $params = [];

        if ($search) {
            $where[]  = '(p.nama LIKE ? OR p.nik LIKE ? OR p.email LIKE ? OR p.no_telepon LIKE ?)';
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }

        if ($status) {
            $where[]  = 'p.status = ?';
            $params[] = $status;
        }

        if ($kegiatan) {
            $where[]  = 'p.nama_kegiatan LIKE ?';
            $params[] = "%{$kegiatan}%";
        }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        // ── COUNT total ──
        $countSql = "SELECT COUNT(*) as total FROM peserta p {$whereSql}";
        $countRow = DB::select($countSql, $params);
        $total    = $countRow[0]->total ?? 0;

        // ── Fetch data ──
        $offset  = ($page - 1) * $perPage;
        $dataSql = "
            SELECT
                p.id,
                p.nik,
                p.nama,
                p.tempat_lahir,
                p.tanggal_lahir,
                p.jenis_kelamin,
                p.alamat,
                p.no_telepon,
                p.email,
                p.pendidikan_terakhir,
                p.pekerjaan,
                p.nama_kegiatan,
                p.tanggal_daftar,
                p.status,
                p.foto,
                p.catatan,
                p.created_at,
                p.updated_at
            FROM peserta p
            {$whereSql}
            ORDER BY p.{$sortField} {$sortDir}
            LIMIT ? OFFSET ?
        ";

        $dataParams   = array_merge($params, [$perPage, $offset]);
        $rows         = DB::select($dataSql, $dataParams);

        return new LengthAwarePaginator(
            collect($rows),
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );
    }

    /**
     * Cari satu peserta berdasarkan ID.
     */
    public function findById(int $id): ?object
    {
        $rows = DB::select(
            'SELECT * FROM peserta WHERE id = ? AND deleted_at IS NULL LIMIT 1',
            [$id]
        );
        return $rows[0] ?? null;
    }

    /**
     * Cek apakah NIK sudah dipakai (kecuali ID tertentu untuk update).
     */
    public function isNikExists(string $nik, ?int $excludeId = null): bool
    {
        if ($excludeId) {
            $rows = DB::select(
                'SELECT id FROM peserta WHERE nik = ? AND id != ? AND deleted_at IS NULL LIMIT 1',
                [$nik, $excludeId]
            );
        } else {
            $rows = DB::select(
                'SELECT id FROM peserta WHERE nik = ? AND deleted_at IS NULL LIMIT 1',
                [$nik]
            );
        }
        return count($rows) > 0;
    }

    /**
     * Cek apakah email sudah dipakai (kecuali ID tertentu untuk update).
     */
    public function isEmailExists(string $email, ?int $excludeId = null): bool
    {
        if ($excludeId) {
            $rows = DB::select(
                'SELECT id FROM peserta WHERE email = ? AND id != ? AND deleted_at IS NULL LIMIT 1',
                [$email, $excludeId]
            );
        } else {
            $rows = DB::select(
                'SELECT id FROM peserta WHERE email = ? AND deleted_at IS NULL LIMIT 1',
                [$email]
            );
        }
        return count($rows) > 0;
    }

    /**
     * Ambil daftar kegiatan unik (untuk filter dropdown).
     */
    public function getKegiatanList(): array
    {
        $rows = DB::select(
            'SELECT DISTINCT nama_kegiatan FROM peserta WHERE deleted_at IS NULL ORDER BY nama_kegiatan ASC'
        );
        return array_column($rows, 'nama_kegiatan');
    }

    /**
     * Statistik ringkasan untuk dashboard.
     */
    public function getStats(): object
    {
        $rows = DB::select("
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'aktif' THEN 1 ELSE 0 END) as aktif,
                SUM(CASE WHEN status = 'nonaktif' THEN 1 ELSE 0 END) as nonaktif,
                SUM(CASE WHEN status = 'lulus' THEN 1 ELSE 0 END) as lulus,
                SUM(CASE WHEN status = 'mengundurkan_diri' THEN 1 ELSE 0 END) as mengundurkan_diri,
                SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) as laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) as perempuan
            FROM peserta
            WHERE deleted_at IS NULL
        ");
        return $rows[0];
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    /**
     * Insert peserta baru, return ID yang baru dibuat.
     */
    public function create(array $data): int
    {
        DB::insert("
            INSERT INTO peserta
                (nik, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat,
                 no_telepon, email, pendidikan_terakhir, pekerjaan,
                 nama_kegiatan, tanggal_daftar, status, foto, catatan,
                 created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ", [
            $data['nik'],
            $data['nama'],
            $data['tempat_lahir'],
            $data['tanggal_lahir'],
            $data['jenis_kelamin'],
            $data['alamat'],
            $data['no_telepon']           ?? null,
            $data['email']                ?? null,
            $data['pendidikan_terakhir']  ?? 'SMA',
            $data['pekerjaan']            ?? null,
            $data['nama_kegiatan'],
            $data['tanggal_daftar'],
            $data['status']               ?? 'aktif',
            $data['foto']                 ?? null,
            $data['catatan']              ?? null,
        ]);

        return (int) DB::getPdo()->lastInsertId();
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    /**
     * Update data peserta berdasarkan ID.
     */
    public function update(int $id, array $data): bool
    {
        $affected = DB::update("
            UPDATE peserta SET
                nik                 = ?,
                nama                = ?,
                tempat_lahir        = ?,
                tanggal_lahir       = ?,
                jenis_kelamin       = ?,
                alamat              = ?,
                no_telepon          = ?,
                email               = ?,
                pendidikan_terakhir = ?,
                pekerjaan           = ?,
                nama_kegiatan       = ?,
                tanggal_daftar      = ?,
                status              = ?,
                foto                = ?,
                catatan             = ?,
                updated_at          = NOW()
            WHERE id = ? AND deleted_at IS NULL
        ", [
            $data['nik'],
            $data['nama'],
            $data['tempat_lahir'],
            $data['tanggal_lahir'],
            $data['jenis_kelamin'],
            $data['alamat'],
            $data['no_telepon']           ?? null,
            $data['email']                ?? null,
            $data['pendidikan_terakhir']  ?? 'SMA',
            $data['pekerjaan']            ?? null,
            $data['nama_kegiatan'],
            $data['tanggal_daftar'],
            $data['status'],
            $data['foto']                 ?? null,
            $data['catatan']              ?? null,
            $id,
        ]);

        return $affected > 0;
    }

    /**
     * Update hanya kolom foto.
     */
    public function updateFoto(int $id, ?string $foto): bool
    {
        $affected = DB::update(
            'UPDATE peserta SET foto = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
            [$foto, $id]
        );
        return $affected > 0;
    }

    /**
     * Update hanya status peserta.
     */
    public function updateStatus(int $id, string $status): bool
    {
        $affected = DB::update(
            'UPDATE peserta SET status = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
            [$status, $id]
        );
        return $affected > 0;
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    /**
     * Soft delete peserta (set deleted_at).
     */
    public function delete(int $id): bool
    {
        $affected = DB::update(
            'UPDATE peserta SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
            [$id]
        );
        return $affected > 0;
    }

    /**
     * Hard delete — permanent (hanya untuk keperluan admin khusus).
     */
    public function forceDelete(int $id): bool
    {
        $affected = DB::delete(
            'DELETE FROM peserta WHERE id = ?',
            [$id]
        );
        return $affected > 0;
    }
}
