<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Peserta;
use App\Models\PendaftaranKelas;
use App\Models\PembayaranKelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PendaftaranKelasController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'sort', 'direction', 'per_page', 'status', 'status_pembayaran', 'kelas_id']);
        $perPage = (int) ($filters['per_page'] ?? 10);
        $page    = (int) $request->get('page', 1);

        $pendaftaran = PendaftaranKelas::paginate($filters, $perPage, $page);
        $stats       = PendaftaranKelas::getStats();
        $kelasList   = Kelas::all(false);

        return Inertia::render('Admin/PendaftaranKelas/Index', [
            'pendaftaran' => $pendaftaran,
            'stats'       => $stats,
            'kelasList'   => $kelasList,
            'filters'     => $filters,
        ]);
    }

    public function create()
    {
        $kelasList   = Kelas::all(true);
        $pesertaList = Peserta::all();

        return Inertia::render('Admin/PendaftaranKelas/Create', [
            'kelasList'   => $kelasList,
            'pesertaList' => $pesertaList,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'peserta_id'    => 'required|integer|exists:peserta,id',
            'kelas_id'      => 'required|integer|exists:kelas,id',
            'tanggal_daftar' => 'required|date',
            'status'         => 'required|in:pending,diterima,ditolak,batal',
            'catatan'        => 'nullable|string',
        ]);

        // Cek duplikasi
        if (PendaftaranKelas::findByPesertaKelas($validated['peserta_id'], $validated['kelas_id'])) {
            return back()->withErrors(['peserta_id' => 'Peserta ini sudah terdaftar di kelas tersebut.']);
        }

        // Cek kuota
        $kelas = Kelas::findById($validated['kelas_id']);
        if ($kelas && $kelas->kuota !== null && $kelas->jumlah_peserta >= $kelas->kuota) {
            return back()->withErrors(['kelas_id' => 'Kuota kelas sudah penuh.']);
        }

        // Tentukan status pembayaran awal
        $validated['status_pembayaran'] = (!$kelas->perlu_pembayaran || $kelas->biaya == 0)
            ? 'lunas'
            : 'belum_bayar';

        $id = PendaftaranKelas::create($validated);

        return redirect()->route('admin.pendaftaran-kelas.show', $id)
            ->with('success', 'Pendaftaran berhasil ditambahkan.');
    }

    public function show(int $id)
    {
        $pendaftaran = PendaftaranKelas::findById($id);

        if (!$pendaftaran) {
            abort(404, 'Pendaftaran tidak ditemukan.');
        }

        $pembayaran = PembayaranKelas::findByPendaftaran($id);

        return Inertia::render('Admin/PendaftaranKelas/Show', [
            'pendaftaran' => $pendaftaran,
            'pembayaran'  => $pembayaran,
        ]);
    }

    public function edit(int $id)
    {
        $pendaftaran = PendaftaranKelas::findById($id);

        if (!$pendaftaran) {
            abort(404, 'Pendaftaran tidak ditemukan.');
        }

        return Inertia::render('Admin/PendaftaranKelas/Edit', [
            'pendaftaran' => $pendaftaran,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $pendaftaran = PendaftaranKelas::findById($id);
        if (!$pendaftaran) {
            abort(404, 'Pendaftaran tidak ditemukan.');
        }

        $validated = $request->validate([
            'status'            => 'required|in:pending,diterima,ditolak,batal',
            'status_pembayaran' => 'required|in:belum_bayar,menunggu_verifikasi,lunas,ditolak',
            'catatan'           => 'nullable|string',
        ]);

        PendaftaranKelas::update($id, $validated);

        return redirect()->route('admin.pendaftaran-kelas.show', $id)
            ->with('success', 'Status pendaftaran berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $pendaftaran = PendaftaranKelas::findById($id);
        if (!$pendaftaran) {
            abort(404, 'Pendaftaran tidak ditemukan.');
        }

        PendaftaranKelas::delete($id);

        return redirect()->route('admin.pendaftaran-kelas.index')
            ->with('success', 'Pendaftaran berhasil dihapus.');
    }
}