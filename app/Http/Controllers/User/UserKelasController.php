<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\PendaftaranKelas;
use App\Models\PembayaranKelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserKelasController extends Controller
{
    /**
     * Daftar semua kelas aktif.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'tipe']);
        $perPage = 9;
        $page    = (int) $request->get('page', 1);

        $kelas = Kelas::paginate(
            array_merge($filters, ['status' => 'aktif']),
            $perPage,
            $page
        );

        $peserta     = $this->getPeserta();
        $sudahDaftar = [];

        if ($peserta) {
            $rows = DB::select(
                "SELECT kelas_id FROM pendaftaran_kelas WHERE peserta_id = ? AND status != 'batal'",
                [$peserta->id]
            );
            $sudahDaftar = array_column($rows, 'kelas_id');
        }

        return Inertia::render('User/Kelas/Index', [
            'kelas'       => $kelas,
            'filters'     => $filters,
            'sudahDaftar' => $sudahDaftar,
        ]);
    }

    /**
     * Detail kelas.
     */
    public function show(int $id)
    {
        $kelas = Kelas::findById($id);

        if (!$kelas || $kelas->status !== 'aktif') {
            abort(404, 'Kelas tidak ditemukan.');
        }

        $peserta     = $this->getPeserta();
        $pendaftaran = null;

        if ($peserta) {
            $pendaftaran = PendaftaranKelas::findByPesertaKelas($peserta->id, $id);
        }

        return Inertia::render('User/Kelas/Show', [
            'kelas'       => $kelas,
            'pendaftaran' => $pendaftaran,
            'peserta'     => $peserta,
        ]);
    }

    /**
     * Proses daftar kelas.
     */
    public function daftar(Request $request, int $id)
    {
        $kelas = Kelas::findById($id);

        if (!$kelas || $kelas->status !== 'aktif') {
            abort(404, 'Kelas tidak ditemukan.');
        }

        $peserta = $this->getPeserta();

        if (!$peserta) {
            return back()->withErrors(['general' => 'Data peserta Anda belum lengkap. Silakan lengkapi profil terlebih dahulu.']);
        }

        if (PendaftaranKelas::findByPesertaKelas($peserta->id, $id)) {
            return back()->withErrors(['general' => 'Anda sudah terdaftar di kelas ini.']);
        }

        if ($kelas->kuota !== null && $kelas->jumlah_peserta >= $kelas->kuota) {
            return back()->withErrors(['general' => 'Maaf, kuota kelas sudah penuh.']);
        }

        $statusBayar = (!$kelas->perlu_pembayaran || $kelas->biaya == 0) ? 'lunas' : 'belum_bayar';

        $pendaftaranId = PendaftaranKelas::create([
            'peserta_id'        => $peserta->id,
            'kelas_id'          => $id,
            'tanggal_daftar'    => now()->toDateString(),
            'status'            => 'pending',
            'status_pembayaran' => $statusBayar,
        ]);

        return redirect()->route('user.pendaftaran.show', $pendaftaranId)
            ->with('success', "Berhasil mendaftar kelas \"{$kelas->nama_kelas}\"." .
                ($statusBayar === 'belum_bayar' ? ' Silakan upload bukti pembayaran.' : ''));
    }

    /**
     * Riwayat pendaftaran milik user.
     */
    public function pendaftaranSaya(Request $request)
    {
        $peserta = $this->getPeserta();
        $list    = [];

        if ($peserta) {
            $list = DB::select("
                SELECT
                    pk.*,
                    k.nama_kelas,
                    k.tipe          as kelas_tipe,
                    k.lokasi        as kelas_lokasi,
                    k.tanggal_mulai,
                    k.biaya         as kelas_biaya,
                    k.perlu_pembayaran,
                    k.pengajar,
                    (SELECT COUNT(*) FROM pembayaran_kelas pb WHERE pb.pendaftaran_kelas_id = pk.id) as jumlah_bukti
                FROM pendaftaran_kelas pk
                JOIN kelas k ON k.id = pk.kelas_id
                WHERE pk.peserta_id = ?
                ORDER BY pk.created_at DESC
            ", [$peserta->id]);
        }

        return Inertia::render('User/Pendaftaran/Index', [
            'pendaftaranList' => $list,
            'peserta'         => $peserta,
        ]);
    }

    /**
     * Detail pendaftaran + riwayat pembayaran.
     */
    public function showPendaftaran(int $id)
    {
        $pendaftaran = PendaftaranKelas::findById($id);

        if (!$pendaftaran) {
            abort(404, 'Pendaftaran tidak ditemukan.');
        }

        $peserta = $this->getPeserta();

        if (!$peserta || $pendaftaran->peserta_id !== $peserta->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $pembayaran = PembayaranKelas::findByPendaftaran($id);

        return Inertia::render('User/Pendaftaran/Show', [
            'pendaftaran' => $pendaftaran,
            'pembayaran'  => $pembayaran,
        ]);
    }

    /**
     * Upload bukti pembayaran oleh user.
     */
    public function uploadBukti(Request $request, int $pendaftaranId)
    {
        $pendaftaran = PendaftaranKelas::findById($pendaftaranId);

        if (!$pendaftaran) {
            abort(404, 'Pendaftaran tidak ditemukan.');
        }

        $peserta = $this->getPeserta();

        if (!$peserta || $pendaftaran->peserta_id !== $peserta->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        if ($pendaftaran->status_pembayaran === 'lunas') {
            return back()->withErrors(['general' => 'Pembayaran Anda sudah lunas.']);
        }

        $validated = $request->validate([
            'jumlah_bayar'      => 'required|numeric|min:0',
            'metode_pembayaran' => 'required|string|max:100',
            'bukti_pembayaran'  => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'tanggal_bayar'     => 'required|date|before_or_equal:today',
        ], [
            'bukti_pembayaran.mimes' => 'File harus berformat JPG, PNG, atau PDF.',
            'bukti_pembayaran.max'   => 'Ukuran file maksimal 5 MB.',
        ]);

        $validated['bukti_pembayaran']     = $request->file('bukti_pembayaran')
            ->store('pembayaran/bukti', 'public');
        $validated['pendaftaran_kelas_id'] = $pendaftaranId;
        $validated['status_verifikasi']    = 'menunggu';

        PembayaranKelas::create($validated);

        PendaftaranKelas::updateStatusPembayaran($pendaftaranId, 'menunggu_verifikasi');

        return redirect()->route('user.pendaftaran.show', $pendaftaranId)
            ->with('success', 'Bukti pembayaran berhasil dikirim. Menunggu verifikasi admin.');
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    /**
     * Ambil data peserta berdasarkan user_id yang sedang login.
     * Fallback ke email jika user_id belum terhubung (data lama).
     */
    private function getPeserta(): ?object
    {
        $user = Auth::user();

        // Cari berdasarkan user_id (relasi baru)
        $rows = DB::select(
            'SELECT * FROM peserta WHERE user_id = ? AND deleted_at IS NULL LIMIT 1',
            [$user->id]
        );

        if (!empty($rows)) {
            return $rows[0];
        }

        // Fallback: cari berdasarkan email (untuk data peserta lama yang belum punya user_id)
        if ($user->email) {
            $rows = DB::select(
                'SELECT * FROM peserta WHERE email = ? AND deleted_at IS NULL LIMIT 1',
                [$user->email]
            );

            // Jika ketemu lewat email, hubungkan user_id sekaligus (auto-link)
            if (!empty($rows)) {
                DB::update(
                    'UPDATE peserta SET user_id = ? WHERE id = ?',
                    [$user->id, $rows[0]->id]
                );
                return $rows[0];
            }
        }

        return null;
    }
}