<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;

/**
 * Model RekeningAktif
 */
class RekeningAktif
{
    // ─── READ ──────────────────────────────────────────────────────────────────

    /** Semua rekening (bisa difilter aktif saja) */
    public static function all(bool $aktifSaja = false): array
    {
        $where = $aktifSaja ? 'WHERE is_aktif = 1' : '';
        return DB::select("SELECT * FROM rekening_aktif {$where} ORDER BY urutan ASC, id ASC");
    }

    public static function findById(int $id): ?object
    {
        $rows = DB::select('SELECT * FROM rekening_aktif WHERE id = ? LIMIT 1', [$id]);
        return $rows[0] ?? null;
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    public static function create(array $data): int
    {
        DB::insert("
            INSERT INTO rekening_aktif (nama_bank, nomor_rekening, nama_pemilik, logo, is_aktif, urutan, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        ", [
            $data['nama_bank'],
            $data['nomor_rekening'],
            $data['nama_pemilik'],
            $data['logo']     ?? null,
            $data['is_aktif'] ?? true,
            $data['urutan']   ?? 0,
        ]);
        return (int) DB::getPdo()->lastInsertId();
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    public static function update(int $id, array $data): bool
    {
        $affected = DB::update("
            UPDATE rekening_aktif SET
                nama_bank       = ?,
                nomor_rekening  = ?,
                nama_pemilik    = ?,
                logo            = ?,
                is_aktif        = ?,
                urutan          = ?,
                updated_at      = NOW()
            WHERE id = ?
        ", [
            $data['nama_bank'],
            $data['nomor_rekening'],
            $data['nama_pemilik'],
            $data['logo']     ?? null,
            $data['is_aktif'] ?? true,
            $data['urutan']   ?? 0,
            $id,
        ]);
        return $affected > 0;
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    public static function delete(int $id): bool
    {
        return DB::delete('DELETE FROM rekening_aktif WHERE id = ?', [$id]) > 0;
    }
}
