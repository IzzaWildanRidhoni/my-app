<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Model Peserta
 * Semua query menggunakan raw SQL melalui DB facade.
 * TIDAK menggunakan Eloquent ORM.
 */
class Peserta
{
    protected static string $table = 'peserta';

    // ─── READ ──────────────────────────────────────────────────────────────────

    public static function paginate(array $filters = [], int $perPage = 10, int $page = 1): LengthAwarePaginator
    {
        $search    = $filters['search']    ?? null;
        $sortField = in_array($filters['sort'] ?? '', ['nama', 'tanggal_lahir', 'created_at'])
            ? $filters['sort'] : 'created_at';
        $sortDir   = ($filters['direction'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

        $where  = ['deleted_at IS NULL'];
        $params = [];

        if ($search) {
            $where[]  = '(nama LIKE ? OR email LIKE ? OR no_telepon LIKE ?)';
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        $countRow = DB::select("SELECT COUNT(*) as total FROM peserta {$whereSql}", $params);
        $total    = $countRow[0]->total ?? 0;

        $offset  = ($page - 1) * $perPage;
        $rows    = DB::select("
            SELECT
                id, nama, tempat_lahir, tanggal_lahir, jenis_kelamin,
                alamat, no_telepon, email, pendidikan_terakhir, pekerjaan,
                foto, created_at, updated_at
            FROM peserta
            {$whereSql}
            ORDER BY {$sortField} {$sortDir}
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
        $rows = DB::select(
            'SELECT * FROM peserta WHERE id = ? AND deleted_at IS NULL LIMIT 1',
            [$id]
        );
        return $rows[0] ?? null;
    }

    public static function isEmailExists(string $email, ?int $excludeId = null): bool
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

    public static function getStats(): object
    {
        $rows = DB::select("
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) as laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) as perempuan,
                SUM(CASE WHEN pendidikan_terakhir IN ('S1','S2','S3') THEN 1 ELSE 0 END) as sarjana
            FROM peserta
            WHERE deleted_at IS NULL
        ");
        return $rows[0];
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    public static function create(array $data): int
    {
        DB::insert("
            INSERT INTO peserta
                (nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat,
                 no_telepon, email, pendidikan_terakhir, pekerjaan, foto,
                 created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ", [
            $data['nama'],
            $data['tempat_lahir'],
            $data['tanggal_lahir'],
            $data['jenis_kelamin'],
            $data['alamat'],
            $data['no_telepon']          ?? null,
            $data['email']               ?? null,
            $data['pendidikan_terakhir'] ?? 'SMA',
            $data['pekerjaan']           ?? null,
            $data['foto']                ?? null,
        ]);

        return (int) DB::getPdo()->lastInsertId();
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    public static function update(int $id, array $data): bool
    {
        $affected = DB::update("
            UPDATE peserta SET
                nama                = ?,
                tempat_lahir        = ?,
                tanggal_lahir       = ?,
                jenis_kelamin       = ?,
                alamat              = ?,
                no_telepon          = ?,
                email               = ?,
                pendidikan_terakhir = ?,
                pekerjaan           = ?,
                foto                = ?,
                updated_at          = NOW()
            WHERE id = ? AND deleted_at IS NULL
        ", [
            $data['nama'],
            $data['tempat_lahir'],
            $data['tanggal_lahir'],
            $data['jenis_kelamin'],
            $data['alamat'],
            $data['no_telepon']          ?? null,
            $data['email']               ?? null,
            $data['pendidikan_terakhir'] ?? 'SMA',
            $data['pekerjaan']           ?? null,
            $data['foto']                ?? null,
            $id,
        ]);

        return $affected > 0;
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    public static function softDelete(int $id): bool
    {
        $affected = DB::update(
            'UPDATE peserta SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
            [$id]
        );
        return $affected > 0;
    }

    public static function forceDelete(int $id): bool
    {
        return DB::delete('DELETE FROM peserta WHERE id = ?', [$id]) > 0;
    }
}
