<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Dashboard
            'view dashboard',

            // Users
            'manage users',
            'create user',
            'edit user',
            'delete user',

            // Roles & Permissions
            'manage roles',
            'create role',
            'edit role',
            'delete role',
            'manage permissions',

            // Kelas
            'view kelas',
            'create kelas',
            'edit kelas',
            'delete kelas',

            // Pendaftaran Kelas
            'view pendaftaran',
            'create pendaftaran',
            'edit pendaftaran',
            'delete pendaftaran',
            'view own pendaftaran',    // user hanya lihat milik sendiri
            'create own pendaftaran',  // user daftar sendiri

            // Pembayaran Kelas
            'view pembayaran',
            'create pembayaran',
            'delete pembayaran',
            'verifikasi pembayaran',   // admin verifikasi bukti
            'upload bukti pembayaran', // user upload bukti
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ─── Roles ────────────────────────────────────────────────────────────

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole  = Role::firstOrCreate(['name' => 'user']);

        // Admin: semua permission
        $adminRole->givePermissionTo(Permission::all());

        // User: permission terbatas (aksi milik sendiri)
        $userRole->givePermissionTo([
            'view dashboard',
            'view kelas',
            'view own pendaftaran',
            'create own pendaftaran',
            'upload bukti pembayaran',
        ]);

        // ─── Users ────────────────────────────────────────────────────────────

        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name'     => 'Admin',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole('admin');

        $user = User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name'     => 'User',
                'password' => bcrypt('password'),
            ]
        );
        $user->assignRole('user');
    }
}