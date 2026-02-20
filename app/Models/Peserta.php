<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Peserta extends Model
{
    // Karena kita pakai SQL murni, kita tetap definisikan nama tabelnya
    protected $table = 'peserta';

    // ─── READ (STATIC METHODS) ──────────────────────────────────────────────────

    /**
     * Ambil semua peserta dengan filter, search, sort, dan pagination.
     */
    public static function paginateRaw(array $filters = [], int $perPage = 10, int $page = 1): LengthAwarePaginator
    {
        $search    = $filters['search']    ?? null;
        $status    = $filters['status']    ?? null;
        $kegiatan  = $filters['kegiatan']  ?? null;
        $sortField = in_array($filters['sort'] ?? '', ['nama', 'nik', 'tanggal_daftar', 'status', 'created_at'])
            ? ($filters['sort'] ?? 'created_at') : 'created_at';
        $sortDir   = (strtolower($filters['direction'] ?? '') === 'asc') ? 'ASC' : 'DESC';

        $where  = ['deleted_at IS NULL'];
        $params = [];

        if ($search) {
            $where[]  = '(nama LIKE ? OR nik LIKE ? OR email LIKE ? OR no_telepon LIKE ?)';
            array_push($params, "%{$search}%", "%{$search}%", "%{$search}%", "%{$search}%");
        }

        if ($status) {
            $where[]  = 'status = ?';
            $params[] = $status;
        }

        if ($kegiatan) {
            $where[]  = 'nama_kegiatan LIKE ?';
            $params[] = "%{$kegiatan}%";
        }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        // COUNT total
        $countRow = DB::select("SELECT COUNT(*) as total FROM peserta {$whereSql}", $params);
        $total    = $countRow[0]->total ?? 0;

        // Fetch data
        $offset     = ($page - 1) * $perPage;
        $dataParams = array_merge($params, [$perPage, $offset]);

        $rows = DB::select("
            SELECT * FROM peserta 
            {$whereSql} 
            ORDER BY {$sortField} {$sortDir} 
            LIMIT ? OFFSET ?
        ", $dataParams);

        return new LengthAwarePaginator(
            collect($rows),
            $total,
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()]
        );
    }

    public static function findByIdRaw(int $id): ?object
    {
        $rows = DB::select('SELECT * FROM peserta WHERE id = ? AND deleted_at IS NULL LIMIT 1', [$id]);
        return $rows[0] ?? null;
    }

    public static function isNikExists(string $nik, ?int $excludeId = null): bool
    {
        $sql = 'SELECT id FROM peserta WHERE nik = ? AND deleted_at IS NULL';
        $params = [$nik];

        if ($excludeId) {
            $sql .= ' AND id != ?';
            $params[] = $excludeId;
        }

        return count(DB::select($sql . ' LIMIT 1', $params)) > 0;
    }

    public static function getStatsRaw(): object
    {
        $rows = DB::select("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'aktif' THEN 1 ELSE 0 END) as aktif,
                SUM(CASE WHEN status = 'nonaktif' THEN 1 ELSE 0 END) as nonaktif,
                SUM(CASE WHEN status = 'lulus' THEN 1 ELSE 0 END) as lulus,
                SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) as laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) as perempuan
            FROM peserta WHERE deleted_at IS NULL
        ");
        return $rows[0];
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    public static function createRaw(array $data): int
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
            $data['no_telepon'] ?? null,
            $data['email'] ?? null,
            $data['pendidikan_terakhir'] ?? 'SMA',
            $data['pekerjaan'] ?? null,
            $data['nama_kegiatan'],
            $data['tanggal_daftar'],
            $data['status'] ?? 'aktif',
            $data['foto'] ?? null,
            $data['catatan'] ?? null
        ]);

        return (int) DB::getPdo()->lastInsertId();
    }

    // ─── UPDATE (INSTANCE METHODS) ─────────────────────────────────────────────

    public function updateRaw(array $data): bool
    {
        return DB::update("
            UPDATE peserta SET 
                nik = ?, nama = ?, tempat_lahir = ?, tanggal_lahir = ?, 
                jenis_kelamin = ?, alamat = ?, no_telepon = ?, email = ?, 
                pendidikan_terakhir = ?, pekerjaan = ?, nama_kegiatan = ?, 
                tanggal_daftar = ?, status = ?, foto = ?, catatan = ?, 
                updated_at = NOW() 
            WHERE id = ? AND deleted_at IS NULL
        ", [
            $data['nik'],
            $data['nama'],
            $data['tempat_lahir'],
            $data['tanggal_lahir'],
            $data['jenis_kelamin'],
            $data['alamat'],
            $data['no_telepon'] ?? null,
            $data['email'] ?? null,
            $data['pendidikan_terakhir'] ?? 'SMA',
            $data['pekerjaan'] ?? null,
            $data['nama_kegiatan'],
            $data['tanggal_daftar'],
            $data['status'],
            $data['foto'] ?? null,
            $data['catatan'] ?? null,
            $this->id
        ]) > 0;
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    public function deleteRaw(): bool
    {
        return DB::update(
            'UPDATE peserta SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
            [$this->id]
        ) > 0;
    }
}
