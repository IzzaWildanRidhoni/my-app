<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PembayaranKelas;
use App\Models\PendaftaranKelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PembayaranKelasController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'sort', 'direction', 'per_page', 'status_verifikasi']);
        $perPage = (int) ($filters['per_page'] ?? 10);
        $page    = (int) $request->get('page', 1);

        $pembayaran = PembayaranKelas::paginate($filters, $perPage, $page);
        $stats      = PembayaranKelas::getStats();

        return Inertia::render('Admin/PembayaranKelas/Index', [
            'pembayaran' => $pembayaran,
            'stats'      => $stats,
            'filters'    => $filters,
        ]);
    }

    public function show(int $id)
    {
        $pembayaran = PembayaranKelas::findById($id);

        if (!$pembayaran) {
            abort(404, 'Data pembayaran tidak ditemukan.');
        }

        return Inertia::render('Admin/PembayaranKelas/Show', [
            'pembayaran' => $pembayaran,
        ]);
    }

    /**
     * Admin verifikasi pembayaran (terima / tolak).
     */
    public function verifikasi(Request $request, int $id)
    {
        $pembayaran = PembayaranKelas::findById($id);
        if (!$pembayaran) {
            abort(404, 'Data pembayaran tidak ditemukan.');
        }

        $validated = $request->validate([
            'status_verifikasi' => 'required|in:diterima,ditolak',
            'catatan_admin'     => 'nullable|string|max:500',
        ]);

        PembayaranKelas::verifikasi($id, $validated['status_verifikasi'], $validated['catatan_admin'] ?? null);

        // Sinkronisasi status_pembayaran di tabel pendaftaran_kelas
        $statusBayar = $validated['status_verifikasi'] === 'diterima' ? 'lunas' : 'ditolak';
        PendaftaranKelas::updateStatusPembayaran($pembayaran->pendaftaran_kelas_id, $statusBayar);

        // Jika diterima, otomatis set pendaftaran jadi diterima
        if ($validated['status_verifikasi'] === 'diterima') {
            PendaftaranKelas::updateStatus($pembayaran->pendaftaran_kelas_id, 'diterima');
        }

        $label = $validated['status_verifikasi'] === 'diterima' ? 'diterima' : 'ditolak';

        return redirect()->route('admin.pembayaran-kelas.show', $id)
            ->with('success', "Pembayaran berhasil {$label}.");
    }

    /**
     * Upload bukti pembayaran (bisa dilakukan admin maupun peserta).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pendaftaran_kelas_id' => 'required|integer|exists:pendaftaran_kelas,id',
            'jumlah_bayar'         => 'required|numeric|min:0',
            'metode_pembayaran'    => 'nullable|string|max:100',
            'bukti_pembayaran'     => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'tanggal_bayar'        => 'required|date',
        ]);

        $validated['bukti_pembayaran'] = $request->file('bukti_pembayaran')
            ->store('pembayaran/bukti', 'public');

        $id = PembayaranKelas::create($validated);

        // Update status_pembayaran di pendaftaran menjadi menunggu_verifikasi
        PendaftaranKelas::updateStatusPembayaran(
            $validated['pendaftaran_kelas_id'],
            'menunggu_verifikasi'
        );

        return redirect()->route('admin.pembayaran-kelas.show', $id)
            ->with('success', 'Bukti pembayaran berhasil diupload dan menunggu verifikasi.');
    }

    public function destroy(int $id)
    {
        $pembayaran = PembayaranKelas::findById($id);
        if (!$pembayaran) {
            abort(404, 'Data pembayaran tidak ditemukan.');
        }

        // Hapus file bukti
        if ($pembayaran->bukti_pembayaran) {
            Storage::disk('public')->delete($pembayaran->bukti_pembayaran);
        }

        $pendaftaranId = $pembayaran->pendaftaran_kelas_id;

        PembayaranKelas::delete($id);

        // Reset status_pembayaran jika tidak ada pembayaran lain
        $sisaPembayaran = PembayaranKelas::findByPendaftaran($pendaftaranId);
        if (empty($sisaPembayaran)) {
            PendaftaranKelas::updateStatusPembayaran($pendaftaranId, 'belum_bayar');
        }

        return redirect()->route('admin.pembayaran-kelas.index')
            ->with('success', 'Data pembayaran berhasil dihapus.');
    }
}