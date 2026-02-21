<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Kelas
{
    protected static string $table = 'kelas';

    // ─── READ ──────────────────────────────────────────────────────────────────

    public static function paginate(array $filters = [], int $perPage = 10, int $page = 1): LengthAwarePaginator
    {
        $search    = $filters['search'] ?? null;
        $status    = $filters['status'] ?? null;
        $tipe      = $filters['tipe']   ?? null;
        $sortField = in_array($filters['sort'] ?? '', ['nama_kelas', 'tanggal_mulai', 'biaya', 'created_at'])
            ? $filters['sort'] : 'created_at';
        $sortDir   = ($filters['direction'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

        $where  = ['k.deleted_at IS NULL'];
        $params = [];

        if ($search) {
            $where[]  = '(k.nama_kelas LIKE ? OR k.pengajar LIKE ? OR k.lokasi LIKE ?)';
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }
        if ($status) { $where[] = 'k.status = ?'; $params[] = $status; }
        if ($tipe)   { $where[] = 'k.tipe = ?';   $params[] = $tipe; }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        $countRow = DB::select("SELECT COUNT(*) as total FROM kelas k {$whereSql}", $params);
        $total    = $countRow[0]->total ?? 0;

        $offset = ($page - 1) * $perPage;
        $rows   = DB::select("
            SELECT
                k.*,
                COUNT(DISTINCT pk.id) as jumlah_peserta
            FROM kelas k
            LEFT JOIN pendaftaran_kelas pk ON pk.kelas_id = k.id AND pk.status != 'batal'
            {$whereSql}
            GROUP BY k.id
            ORDER BY k.{$sortField} {$sortDir}
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
                k.*,
                COUNT(DISTINCT pk.id) as jumlah_peserta
            FROM kelas k
            LEFT JOIN pendaftaran_kelas pk ON pk.kelas_id = k.id AND pk.status != 'batal'
            WHERE k.id = ? AND k.deleted_at IS NULL
            GROUP BY k.id
            LIMIT 1
        ", [$id]);
        return $rows[0] ?? null;
    }

    public static function all(bool $onlyAktif = false): array
    {
        $where = $onlyAktif ? "WHERE deleted_at IS NULL AND status = 'aktif'" : 'WHERE deleted_at IS NULL';
        return DB::select("SELECT id, nama_kelas, biaya, perlu_pembayaran, kuota, tipe FROM kelas {$where} ORDER BY nama_kelas ASC");
    }

    public static function getStats(): object
    {
        $rows = DB::select("
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'aktif' THEN 1 ELSE 0 END) as aktif,
                SUM(CASE WHEN tipe = 'event' THEN 1 ELSE 0 END) as event,
                SUM(CASE WHEN tipe = 'rutin' THEN 1 ELSE 0 END) as rutin
            FROM kelas
            WHERE deleted_at IS NULL
        ");
        return $rows[0];
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    public static function create(array $data): int
    {
        DB::insert("
            INSERT INTO kelas
                (nama_kelas, deskripsi, deskripsi_setelah_lunas, lokasi, pengajar, tipe,
                 tanggal_mulai, tanggal_selesai, kuota, biaya,
                 perlu_pembayaran, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ", [
            $data['nama_kelas'],
            $data['deskripsi']                ?? null,
            $data['deskripsi_setelah_lunas']  ?? null,
            $data['lokasi']                   ?? null,
            $data['pengajar']                 ?? null,
            $data['tipe']                     ?? 'event',
            $data['tanggal_mulai']            ?? null,
            $data['tanggal_selesai']          ?? null,
            $data['kuota']                    ?? null,
            $data['biaya']                    ?? 0,
            $data['perlu_pembayaran']         ?? true,
            $data['status']                   ?? 'aktif',
        ]);

        return (int) DB::getPdo()->lastInsertId();
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    public static function update(int $id, array $data): bool
    {
        $affected = DB::update("
            UPDATE kelas SET
                nama_kelas               = ?,
                deskripsi                = ?,
                deskripsi_setelah_lunas  = ?,
                lokasi                   = ?,
                pengajar                 = ?,
                tipe                     = ?,
                tanggal_mulai            = ?,
                tanggal_selesai          = ?,
                kuota                    = ?,
                biaya                    = ?,
                perlu_pembayaran         = ?,
                status                   = ?,
                updated_at               = NOW()
            WHERE id = ? AND deleted_at IS NULL
        ", [
            $data['nama_kelas'],
            $data['deskripsi']                ?? null,
            $data['deskripsi_setelah_lunas']  ?? null,
            $data['lokasi']                   ?? null,
            $data['pengajar']                 ?? null,
            $data['tipe']                     ?? 'event',
            $data['tanggal_mulai']            ?? null,
            $data['tanggal_selesai']          ?? null,
            $data['kuota']                    ?? null,
            $data['biaya']                    ?? 0,
            $data['perlu_pembayaran']         ?? true,
            $data['status']                   ?? 'aktif',
            $id,
        ]);

        return $affected > 0;
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    public static function softDelete(int $id): bool
    {
        $affected = DB::update(
            'UPDATE kelas SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
            [$id]
        );
        return $affected > 0;
    }
}