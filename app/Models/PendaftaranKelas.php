<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Model PendaftaranKelas
 */
class PendaftaranKelas
{
    // ─── READ ──────────────────────────────────────────────────────────────────

    public static function paginate(array $filters = [], int $perPage = 10, int $page = 1): LengthAwarePaginator
    {
        $search         = $filters['search']          ?? null;
        $status         = $filters['status']          ?? null;
        $statusBayar    = $filters['status_pembayaran'] ?? null;
        $kelasId        = $filters['kelas_id']        ?? null;
        $sortField      = in_array($filters['sort'] ?? '', ['tanggal_daftar', 'created_at'])
            ? $filters['sort'] : 'created_at';
        $sortDir        = ($filters['direction'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

        $where  = ['1=1'];
        $params = [];

        if ($search) {
            $where[]  = '(p.nama LIKE ? OR p.email LIKE ? OR k.nama_kelas LIKE ?)';
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }
        if ($status) {
            $where[]  = 'pk.status = ?';
            $params[] = $status;
        }
        if ($statusBayar) {
            $where[]  = 'pk.status_pembayaran = ?';
            $params[] = $statusBayar;
        }
        if ($kelasId) {
            $where[]  = 'pk.kelas_id = ?';
            $params[] = $kelasId;
        }

        $whereSql = 'WHERE ' . implode(' AND ', $where);

        $countRow = DB::select("
            SELECT COUNT(*) as total
            FROM pendaftaran_kelas pk
            JOIN peserta p ON p.id = pk.peserta_id
            JOIN kelas k   ON k.id = pk.kelas_id
            {$whereSql}
        ", $params);
        $total = $countRow[0]->total ?? 0;

        $offset = ($page - 1) * $perPage;
        $rows   = DB::select("
            SELECT
                pk.*,
                p.nama          as peserta_nama,
                p.email         as peserta_email,
                p.no_telepon    as peserta_telepon,
                p.foto          as peserta_foto,
                p.jenis_kelamin as peserta_jk,
                k.nama_kelas,
                k.biaya         as kelas_biaya,
                k.perlu_pembayaran,
                k.tipe          as kelas_tipe,
                (SELECT COUNT(*) FROM pembayaran_kelas pb WHERE pb.pendaftaran_kelas_id = pk.id) as jumlah_pembayaran
            FROM pendaftaran_kelas pk
            JOIN peserta p ON p.id = pk.peserta_id
            JOIN kelas k   ON k.id = pk.kelas_id
            {$whereSql}
            ORDER BY pk.{$sortField} {$sortDir}
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
                pk.*,
                p.nama                    as peserta_nama,
                p.email                   as peserta_email,
                p.no_telepon              as peserta_telepon,
                p.foto                    as peserta_foto,
                p.jenis_kelamin           as peserta_jk,
                p.alamat                  as peserta_alamat,
                k.nama_kelas,
                k.deskripsi               as kelas_deskripsi,
                k.deskripsi_setelah_lunas as kelas_deskripsi_setelah_lunas,
                k.biaya                   as kelas_biaya,
                k.perlu_pembayaran,
                k.tipe                    as kelas_tipe,
                k.lokasi                  as kelas_lokasi,
                k.pengajar                as kelas_pengajar,
                k.tanggal_mulai,
                k.tanggal_selesai
            FROM pendaftaran_kelas pk
            JOIN peserta p ON p.id = pk.peserta_id
            JOIN kelas k   ON k.id = pk.kelas_id
            WHERE pk.id = ?
            LIMIT 1
        ", [$id]);
        return $rows[0] ?? null;
    }


    public static function findByPesertaKelas(int $pesertaId, int $kelasId): ?object
    {
        $rows = DB::select(
            'SELECT * FROM pendaftaran_kelas WHERE peserta_id = ? AND kelas_id = ? LIMIT 1',
            [$pesertaId, $kelasId]
        );
        return $rows[0] ?? null;
    }

    public static function getStats(): object
    {
        $rows = DB::select("
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as diterima,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status_pembayaran = 'menunggu_verifikasi' THEN 1 ELSE 0 END) as menunggu_verifikasi,
                SUM(CASE WHEN status_pembayaran = 'lunas' THEN 1 ELSE 0 END) as lunas
            FROM pendaftaran_kelas
        ");
        return $rows[0];
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    public static function create(array $data): int
    {
        DB::insert("
            INSERT INTO pendaftaran_kelas
                (peserta_id, kelas_id, tanggal_daftar, status, status_pembayaran, catatan, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        ", [
            $data['peserta_id'],
            $data['kelas_id'],
            $data['tanggal_daftar'],
            $data['status']            ?? 'pending',
            $data['status_pembayaran'] ?? 'belum_bayar',
            $data['catatan']           ?? null,
        ]);

        return (int) DB::getPdo()->lastInsertId();
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    public static function updateStatus(int $id, string $status, ?string $catatan = null): bool
    {
        $affected = DB::update(
            'UPDATE pendaftaran_kelas SET status = ?, catatan = ?, updated_at = NOW() WHERE id = ?',
            [$status, $catatan, $id]
        );
        return $affected > 0;
    }

    public static function updateStatusPembayaran(int $id, string $statusPembayaran): bool
    {
        $affected = DB::update(
            'UPDATE pendaftaran_kelas SET status_pembayaran = ?, updated_at = NOW() WHERE id = ?',
            [$statusPembayaran, $id]
        );
        return $affected > 0;
    }

    public static function update(int $id, array $data): bool
    {
        $affected = DB::update("
            UPDATE pendaftaran_kelas SET
                status            = ?,
                status_pembayaran = ?,
                catatan           = ?,
                updated_at        = NOW()
            WHERE id = ?
        ", [
            $data['status'],
            $data['status_pembayaran'],
            $data['catatan'] ?? null,
            $id,
        ]);
        return $affected > 0;
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    public static function delete(int $id): bool
    {
        return DB::delete('DELETE FROM pendaftaran_kelas WHERE id = ?', [$id]) > 0;
    }
}