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
            'view dashboard',
            'manage users',
            'create user',
            'edit user',
            'delete user',
            'manage roles',
            'create role',
            'edit role',
            'delete role',
            'manage permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $adminRole = Role::create(['name' => 'admin']);
        $userRole  = Role::create(['name' => 'user']);

        $adminRole->givePermissionTo(Permission::all());
        $userRole->givePermissionTo('view dashboard');

        $admin = User::create([
            'name'     => 'Admin',
            'email'    => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('admin');

        $user = User::create([
            'name'     => 'User',
            'email'    => 'user@example.com',
            'password' => bcrypt('password'),
        ]);
        $user->assignRole('user');
    }
}
