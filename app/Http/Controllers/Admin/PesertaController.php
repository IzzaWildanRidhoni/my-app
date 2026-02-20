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
            'nama'                 => 'required|string|max:100',
            'tempat_lahir'         => 'required|string|max:50',
            'tanggal_lahir'        => 'required|date|before:today',
            'jenis_kelamin'        => 'required|in:L,P',
            'alamat'               => 'required|string',
            'no_telepon'           => 'nullable|string|max:20',
            'email'                => 'nullable|email|max:100',
            'pendidikan_terakhir'  => 'required|in:SD,SMP,SMA,D1,D2,D3,D4,S1,S2,S3',
            'pekerjaan'            => 'nullable|string|max:100',
            'foto'                 => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if (!empty($validated['email']) && Peserta::isEmailExists($validated['email'])) {
            return back()->withErrors(['email' => 'Email sudah terdaftar.']);
        }

        $validated['foto'] = null;
        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('peserta/foto', 'public');
        }

        $id = Peserta::create($validated);

        return redirect()->route('admin.peserta.show', $id)
            ->with('success', "Peserta \"{$validated['nama']}\" berhasil ditambahkan.");
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
        $peserta = Peserta::findById($id);
        if (!$peserta) {
            abort(404, 'Peserta tidak ditemukan.');
        }

        $validated = $request->validate([
            'nama'                 => 'required|string|max:100',
            'tempat_lahir'         => 'required|string|max:50',
            'tanggal_lahir'        => 'required|date|before:today',
            'jenis_kelamin'        => 'required|in:L,P',
            'alamat'               => 'required|string',
            'no_telepon'           => 'nullable|string|max:20',
            'email'                => 'nullable|email|max:100',
            'pendidikan_terakhir'  => 'required|in:SD,SMP,SMA,D1,D2,D3,D4,S1,S2,S3',
            'pekerjaan'            => 'nullable|string|max:100',
            'foto'                 => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if (!empty($validated['email']) && Peserta::isEmailExists($validated['email'], $id)) {
            return back()->withErrors(['email' => 'Email sudah digunakan peserta lain.']);
        }

        if ($request->hasFile('foto')) {
            if ($peserta->foto) {
                Storage::disk('public')->delete($peserta->foto);
            }
            $validated['foto'] = $request->file('foto')->store('peserta/foto', 'public');
        } else {
            $validated['foto'] = $peserta->foto;
        }

        Peserta::update($id, $validated);

        return redirect()->route('admin.peserta.show', $id)
            ->with('success', "Data peserta \"{$validated['nama']}\" berhasil diperbarui.");
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
