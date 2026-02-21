<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([RolePermissionSeeder::class]);
        $this->call([KelasSeeder::class]);
        $this->call([PendaftaranKelasSeeder::class]);
        $this->call([PembayaranKelasSeeder::class]);
    }
}
