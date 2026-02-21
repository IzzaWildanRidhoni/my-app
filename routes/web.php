<?php

use App\Http\Controllers\Admin\PesertaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\PendaftaranKelasController;
use App\Http\Controllers\Admin\PembayaranKelasController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);  // full CRUD + show/create/edit pages
        Route::resource('roles', RoleController::class);

        Route::resource('peserta', PesertaController::class);
        Route::patch('peserta/{peserta}/status', [PesertaController::class, 'updateStatus'])
            ->name('peserta.status');

        // ── KELAS ─────────────────────────────────────────────────────────────────
        Route::resource('kelas', KelasController::class);

        // ── PENDAFTARAN KELAS ─────────────────────────────────────────────────────
        Route::resource('pendaftaran-kelas', PendaftaranKelasController::class);

        // ── PEMBAYARAN KELAS ──────────────────────────────────────────────────────
        Route::get('pembayaran-kelas',              [PembayaranKelasController::class, 'index'])    ->name('pembayaran-kelas.index');
        Route::post('pembayaran-kelas',             [PembayaranKelasController::class, 'store'])    ->name('pembayaran-kelas.store');
        Route::get('pembayaran-kelas/{id}',         [PembayaranKelasController::class, 'show'])     ->name('pembayaran-kelas.show');
        Route::post('pembayaran-kelas/{id}/verifikasi', [PembayaranKelasController::class, 'verifikasi'])->name('pembayaran-kelas.verifikasi');
        Route::delete('pembayaran-kelas/{id}',      [PembayaranKelasController::class, 'destroy'])  ->name('pembayaran-kelas.destroy');

    });
});

require __DIR__ . '/auth.php';
