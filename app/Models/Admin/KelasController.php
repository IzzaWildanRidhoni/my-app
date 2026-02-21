<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'sort', 'direction', 'per_page', 'status', 'tipe']);
        $perPage = (int) ($filters['per_page'] ?? 10);
        $page    = (int) $request->get('page', 1);

        $kelas = Kelas::paginate($filters, $perPage, $page);
        $stats = Kelas::getStats();

        return Inertia::render('Admin/Kelas/Index', [
            'kelas'   => $kelas,
            'stats'   => $stats,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Kelas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas'       => 'required|string|max:150',
            'deskripsi'        => 'nullable|string',
            'lokasi'           => 'nullable|string|max:200',
            'pengajar'         => 'nullable|string|max:150',
            'tipe'             => 'required|in:event,rutin',
            'tanggal_mulai'    => 'nullable|date',
            'tanggal_selesai'  => 'nullable|date|after_or_equal:tanggal_mulai',
            'kuota'            => 'nullable|integer|min:1',
            'biaya'            => 'required|numeric|min:0',
            'perlu_pembayaran' => 'required|boolean',
            'status'           => 'required|in:aktif,nonaktif',
        ]);

        $id = Kelas::create($validated);

        return redirect()->route('admin.kelas.show', $id)
            ->with('success', "Kelas \"{$validated['nama_kelas']}\" berhasil ditambahkan.");
    }

    public function show(int $id)
    {
        $kelas = Kelas::findById($id);

        if (!$kelas) {
            abort(404, 'Kelas tidak ditemukan.');
        }

        return Inertia::render('Admin/Kelas/Show', [
            'kelas' => $kelas,
        ]);
    }

    public function edit(int $id)
    {
        $kelas = Kelas::findById($id);

        if (!$kelas) {
            abort(404, 'Kelas tidak ditemukan.');
        }

        return Inertia::render('Admin/Kelas/Edit', [
            'kelas' => $kelas,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $kelas = Kelas::findById($id);
        if (!$kelas) {
            abort(404, 'Kelas tidak ditemukan.');
        }

        $validated = $request->validate([
            'nama_kelas'       => 'required|string|max:150',
            'deskripsi'        => 'nullable|string',
            'lokasi'           => 'nullable|string|max:200',
            'pengajar'         => 'nullable|string|max:150',
            'tipe'             => 'required|in:event,rutin',
            'tanggal_mulai'    => 'nullable|date',
            'tanggal_selesai'  => 'nullable|date|after_or_equal:tanggal_mulai',
            'kuota'            => 'nullable|integer|min:1',
            'biaya'            => 'required|numeric|min:0',
            'perlu_pembayaran' => 'required|boolean',
            'status'           => 'required|in:aktif,nonaktif',
        ]);

        Kelas::update($id, $validated);

        return redirect()->route('admin.kelas.show', $id)
            ->with('success', "Kelas \"{$validated['nama_kelas']}\" berhasil diperbarui.");
    }

    public function destroy(int $id)
    {
        $kelas = Kelas::findById($id);
        if (!$kelas) {
            abort(404, 'Kelas tidak ditemukan.');
        }

        Kelas::softDelete($id);

        return redirect()->route('admin.kelas.index')
            ->with('success', "Kelas \"{$kelas->nama_kelas}\" berhasil dihapus.");
    }
}