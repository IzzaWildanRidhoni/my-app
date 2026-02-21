<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Peserta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PesertaController extends Controller
{
    // ─── INDEX ─────────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'sort', 'direction', 'per_page']);
        $perPage = (int) ($filters['per_page'] ?? 10);
        $page    = (int) $request->get('page', 1);

        $peserta = Peserta::paginate($filters, $perPage, $page);
        $stats   = Peserta::getStats();

        return Inertia::render('Admin/Peserta/Index', [
            'peserta' => $peserta,
            'stats'   => $stats,
            'filters' => $filters,
        ]);
    }

    // ─── CREATE ────────────────────────────────────────────────────────────────

    public function create()
    {
        return Inertia::render('Admin/Peserta/Create');
    }
public function store(Request $request)
{
    $validated = $request->validate([
        'nama'                => 'required|string|max:100',
        'tempat_lahir'        => 'required|string|max:50',
        'tanggal_lahir'       => 'required|date',
        'jenis_kelamin'       => 'required|in:L,P',
        'alamat'              => 'required|string',
        'no_telepon'          => 'nullable|string|max:20',
        'email'               => 'nullable|email|max:100|unique:peserta,email',
        'pendidikan_terakhir' => 'nullable|string|max:20',
        'pekerjaan'           => 'nullable|string|max:100',
        // foto dihandle terpisah
    ]);

    $userId = null;

    // Jika ada email, buat akun User sekaligus
    if (!empty($validated['email'])) {
        // Cek apakah user dengan email ini sudah ada
        $existingUser = \Illuminate\Support\Facades\DB::select(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [$validated['email']]
        );

        if ($existingUser) {
            $userId = $existingUser[0]->id;
        } else {
            // Buat user baru dengan password default = nama (tanpa spasi, lowercase)
            $defaultPassword = strtolower(str_replace(' ', '', $validated['nama'])) . '123';

            $user = \App\Models\User::create([
                'name'     => $validated['nama'],
                'email'    => $validated['email'],
                'password' => bcrypt($defaultPassword),
            ]);
            $user->assignRole('user');
            $userId = $user->id;
        }
    }

    // Handle foto jika ada
    $foto = null;
    if ($request->hasFile('foto')) {
        $foto = $request->file('foto')->store('peserta/foto', 'public');
    }

    \Illuminate\Support\Facades\DB::insert("
        INSERT INTO peserta
            (user_id, nama, tempat_lahir, tanggal_lahir, jenis_kelamin,
             alamat, no_telepon, email, pendidikan_terakhir, pekerjaan,
             foto, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ", [
        $userId,
        $validated['nama'],
        $validated['tempat_lahir'],
        $validated['tanggal_lahir'],
        $validated['jenis_kelamin'],
        $validated['alamat'],
        $validated['no_telepon']          ?? null,
        $validated['email']               ?? null,
        $validated['pendidikan_terakhir'] ?? 'SMA',
        $validated['pekerjaan']           ?? null,
        $foto,
    ]);

    $id = (int) \Illuminate\Support\Facades\DB::getPdo()->lastInsertId();

    return redirect()->route('admin.peserta.show', $id)
        ->with('success', "Peserta \"{$validated['nama']}\" berhasil ditambahkan." .
            ($userId && empty($existingUser ?? null) ? " Akun user dibuat dengan password default." : ""));
}



    // ─── SHOW ──────────────────────────────────────────────────────────────────

    public function show(int $id)
    {
        $peserta = Peserta::findById($id);

        if (!$peserta) {
            abort(404, 'Peserta tidak ditemukan.');
        }

        return Inertia::render('Admin/Peserta/Show', [
            'peserta' => $peserta,
        ]);
    }

    // ─── EDIT ──────────────────────────────────────────────────────────────────

    public function edit(int $id)
    {
        $peserta = Peserta::findById($id);

        if (!$peserta) {
            abort(404, 'Peserta tidak ditemukan.');
        }

        return Inertia::render('Admin/Peserta/Edit', [
            'peserta' => $peserta,
        ]);
    }

    
    public function update(Request $request, int $id)
    {
        $peserta = \Illuminate\Support\Facades\DB::select(
            'SELECT * FROM peserta WHERE id = ? AND deleted_at IS NULL LIMIT 1',
            [$id]
        );
        if (!$peserta) abort(404);
        $peserta = $peserta[0];

        $validated = $request->validate([
            'nama'                => 'required|string|max:100',
            'tempat_lahir'        => 'required|string|max:50',
            'tanggal_lahir'       => 'required|date',
            'jenis_kelamin'       => 'required|in:L,P',
            'alamat'              => 'required|string',
            'no_telepon'          => 'nullable|string|max:20',
            'email'               => 'nullable|email|max:100|unique:peserta,email,' . $id,
            'pendidikan_terakhir' => 'nullable|string|max:20',
            'pekerjaan'           => 'nullable|string|max:100',
        ]);

        // Handle foto
        $foto = $peserta->foto;
        if ($request->hasFile('foto')) {
            if ($foto) \Illuminate\Support\Facades\Storage::disk('public')->delete($foto);
            $foto = $request->file('foto')->store('peserta/foto', 'public');
        }

        // Sinkronisasi nama ke tabel users jika ada relasi
        if ($peserta->user_id) {
            \Illuminate\Support\Facades\DB::update(
                'UPDATE users SET name = ?, updated_at = NOW() WHERE id = ?',
                [$validated['nama'], $peserta->user_id]
            );
        }

        \Illuminate\Support\Facades\DB::update("
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
            WHERE id = ?
        ", [
            $validated['nama'],
            $validated['tempat_lahir'],
            $validated['tanggal_lahir'],
            $validated['jenis_kelamin'],
            $validated['alamat'],
            $validated['no_telepon']          ?? null,
            $validated['email']               ?? null,
            $validated['pendidikan_terakhir'] ?? 'SMA',
            $validated['pekerjaan']           ?? null,
            $foto,
            $id,
        ]);

        return redirect()->route('admin.peserta.show', $id)
            ->with('success', "Peserta \"{$validated['nama']}\" berhasil diperbarui.");
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    public function destroy(int $id)
    {
        $peserta = Peserta::findById($id);
        if (!$peserta) {
            abort(404, 'Peserta tidak ditemukan.');
        }

        if ($peserta->foto) {
            Storage::disk('public')->delete($peserta->foto);
        }

        Peserta::softDelete($id);

        return redirect()->route('admin.peserta.index')
            ->with('success', "Peserta \"{$peserta->nama}\" berhasil dihapus.");
    }
}
