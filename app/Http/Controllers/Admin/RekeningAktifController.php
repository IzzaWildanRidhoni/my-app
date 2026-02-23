<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RekeningAktif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RekeningAktifController extends Controller
{
    public function index()
    {
        $rekening = RekeningAktif::all();

        return Inertia::render('Admin/RekeningAktif/Index', [
            'rekening' => $rekening,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/RekeningAktif/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_bank'      => 'required|string|max:100',
            'nomor_rekening' => 'required|string|max:50',
            'nama_pemilik'   => 'required|string|max:100',
            'logo'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024',
            'is_aktif'       => 'boolean',
            'urutan'         => 'integer|min:0',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('rekening', 'public');
        }

        RekeningAktif::create($validated);

        return redirect()->route('admin.rekening.index')
            ->with('success', 'Rekening berhasil ditambahkan.');
    }

    public function edit(int $id)
    {
        $rekening = RekeningAktif::findById($id);
        if (!$rekening) abort(404);

        return Inertia::render('Admin/RekeningAktif/Edit', [
            'rekening' => $rekening,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $rekening = RekeningAktif::findById($id);
        if (!$rekening) abort(404);

        $validated = $request->validate([
            'nama_bank'      => 'required|string|max:100',
            'nomor_rekening' => 'required|string|max:50',
            'nama_pemilik'   => 'required|string|max:100',
            'logo'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024',
            'hapus_logo'     => 'boolean',
            'is_aktif'       => 'boolean',
            'urutan'         => 'integer|min:0',
        ]);

        // Hapus logo lama jika diminta
        if ($request->boolean('hapus_logo') && $rekening->logo) {
            Storage::disk('public')->delete($rekening->logo);
            $validated['logo'] = null;
        } else {
            $validated['logo'] = $rekening->logo; // pertahankan logo lama
        }

        // Upload logo baru jika ada
        if ($request->hasFile('logo')) {
            if ($rekening->logo) {
                Storage::disk('public')->delete($rekening->logo);
            }
            $validated['logo'] = $request->file('logo')->store('rekening', 'public');
        }

        RekeningAktif::update($id, $validated);

        return redirect()->route('admin.rekening.index')
            ->with('success', 'Rekening berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $rekening = RekeningAktif::findById($id);
        if (!$rekening) abort(404);

        if ($rekening->logo) {
            Storage::disk('public')->delete($rekening->logo);
        }

        RekeningAktif::delete($id);

        return redirect()->route('admin.rekening.index')
            ->with('success', 'Rekening berhasil dihapus.');
    }
}
