<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\PesertaRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PesertaController extends Controller
{
    public function __construct(private PesertaRepository $repo) {}

    // ─── INDEX ─────────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'kegiatan', 'sort', 'direction', 'per_page']);
        $perPage = (int) ($filters['per_page'] ?? 10);
        $page    = (int) $request->get('page', 1);

        $peserta   = $this->repo->paginate($filters, $perPage, $page);
        $stats     = $this->repo->getStats();
        $kegiatans = $this->repo->getKegiatanList();

        return Inertia::render('Admin/Peserta/Index', [
            'peserta'   => $peserta,
            'stats'     => $stats,
            'kegiatans' => $kegiatans,
            'filters'   => $filters,
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
            'nik'                  => 'required|string|max:20|digits:16',
            'nama'                 => 'required|string|max:100',
            'tempat_lahir'         => 'required|string|max:50',
            'tanggal_lahir'        => 'required|date|before:today',
            'jenis_kelamin'        => 'required|in:L,P',
            'alamat'               => 'required|string',
            'no_telepon'           => 'nullable|string|max:20',
            'email'                => 'nullable|email|max:100',
            'pendidikan_terakhir'  => 'required|in:SD,SMP,SMA,D1,D2,D3,D4,S1,S2,S3',
            'pekerjaan'            => 'nullable|string|max:100',
            'nama_kegiatan'        => 'required|string|max:150',
            'tanggal_daftar'       => 'required|date',
            'status'               => 'required|in:aktif,nonaktif,lulus,mengundurkan_diri',
            'foto'                 => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'catatan'              => 'nullable|string',
        ]);

        // Cek NIK unik
        if ($this->repo->isNikExists($validated['nik'])) {
            return back()->withErrors(['nik' => 'NIK sudah terdaftar.']);
        }

        // Cek email unik
        if (!empty($validated['email']) && $this->repo->isEmailExists($validated['email'])) {
            return back()->withErrors(['email' => 'Email sudah terdaftar.']);
        }

        // Upload foto
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('peserta/foto', 'public');
        }

        $validated['foto'] = $fotoPath;
        $id = $this->repo->create($validated);

        return redirect()->route('admin.peserta.show', $id)
            ->with('success', "Peserta \"{$validated['nama']}\" berhasil ditambahkan.");
    }

    // ─── SHOW ──────────────────────────────────────────────────────────────────

    public function show(int $id)
    {
        $peserta = $this->repo->findById($id);

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
        $peserta = $this->repo->findById($id);

        if (!$peserta) {
            abort(404, 'Peserta tidak ditemukan.');
        }

        return Inertia::render('Admin/Peserta/Edit', [
            'peserta' => $peserta,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $peserta = $this->repo->findById($id);
        if (!$peserta) {
            abort(404, 'Peserta tidak ditemukan.');
        }

        $validated = $request->validate([
            'nik'                  => 'required|string|max:20|digits:16',
            'nama'                 => 'required|string|max:100',
            'tempat_lahir'         => 'required|string|max:50',
            'tanggal_lahir'        => 'required|date|before:today',
            'jenis_kelamin'        => 'required|in:L,P',
            'alamat'               => 'required|string',
            'no_telepon'           => 'nullable|string|max:20',
            'email'                => 'nullable|email|max:100',
            'pendidikan_terakhir'  => 'required|in:SD,SMP,SMA,D1,D2,D3,D4,S1,S2,S3',
            'pekerjaan'            => 'nullable|string|max:100',
            'nama_kegiatan'        => 'required|string|max:150',
            'tanggal_daftar'       => 'required|date',
            'status'               => 'required|in:aktif,nonaktif,lulus,mengundurkan_diri',
            'foto'                 => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'catatan'              => 'nullable|string',
        ]);

        // Cek NIK unik (kecuali diri sendiri)
        if ($this->repo->isNikExists($validated['nik'], $id)) {
            return back()->withErrors(['nik' => 'NIK sudah digunakan peserta lain.']);
        }

        // Cek email unik (kecuali diri sendiri)
        if (!empty($validated['email']) && $this->repo->isEmailExists($validated['email'], $id)) {
            return back()->withErrors(['email' => 'Email sudah digunakan peserta lain.']);
        }

        // Upload foto baru, hapus yang lama
        if ($request->hasFile('foto')) {
            if ($peserta->foto) {
                Storage::disk('public')->delete($peserta->foto);
            }
            $validated['foto'] = $request->file('foto')->store('peserta/foto', 'public');
        } else {
            $validated['foto'] = $peserta->foto; // pertahankan foto lama
        }

        $this->repo->update($id, $validated);

        return redirect()->route('admin.peserta.show', $id)
            ->with('success', "Data peserta \"{$validated['nama']}\" berhasil diperbarui.");
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    public function destroy(int $id)
    {
        $peserta = $this->repo->findById($id);
        if (!$peserta) {
            abort(404, 'Peserta tidak ditemukan.');
        }

        // Hapus foto dari storage
        if ($peserta->foto) {
            Storage::disk('public')->delete($peserta->foto);
        }

        $this->repo->delete($id);

        return redirect()->route('admin.peserta.index')
            ->with('success', "Peserta \"{$peserta->nama}\" berhasil dihapus.");
    }

    // ─── UPDATE STATUS (AJAX) ──────────────────────────────────────────────────

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:aktif,nonaktif,lulus,mengundurkan_diri',
        ]);

        $peserta = $this->repo->findById($id);
        if (!$peserta) {
            abort(404);
        }

        $this->repo->updateStatus($id, $request->status);

        return back()->with('success', "Status peserta \"{$peserta->nama}\" diperbarui.");
    }
}
