# 🗂️ Sistem Manajemen Peserta

Aplikasi web manajemen peserta berbasis **Laravel 11**, **React (Inertia.js)**, dan **shadcn/ui**. Mendukung autentikasi, manajemen role, dan CRUD peserta dengan raw SQL tanpa Eloquent ORM.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 11 |
| Frontend | React 18 + Inertia.js |
| UI Components | shadcn/ui + Tailwind CSS |
| Auth | Laravel Breeze (Inertia stack) |
| Role & Permission | Middleware custom `role:admin` |
| Database | MySQL (raw SQL via `DB` facade) |
| File Storage | Laravel Storage (public disk) |

---

## 📋 Persyaratan Sistem

- PHP >= 8.2
- Composer >= 2.x
- Node.js >= 18.x + npm
- MySQL >= 8.0

---

## 🚀 Instalasi

### 1. Clone & install dependensi

```bash
git clone https://github.com/username/nama-repo.git
cd nama-repo

composer install
npm install
```

### 2. Konfigurasi environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit file `.env` dan sesuaikan koneksi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Jalankan migrasi

```bash
php artisan migrate
```

### 4. Buat symlink storage

```bash
php artisan storage:link
```

### 5. Build aset frontend

```bash
# Development
npm run dev

# Production
npm run build
```

### 6. Jalankan server

```bash
php artisan serve
```

Akses aplikasi di `http://localhost:8000`

---

## 🗄️ Struktur Database

### Tabel `peserta`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | bigint | Primary key |
| `nama` | varchar(100) | Nama lengkap |
| `tempat_lahir` | varchar(50) | Kota tempat lahir |
| `tanggal_lahir` | date | Tanggal lahir |
| `jenis_kelamin` | enum(L, P) | Jenis kelamin |
| `alamat` | text | Alamat lengkap |
| `no_telepon` | varchar(20) | Nomor telepon (opsional) |
| `email` | varchar(100) | Email unik (opsional) |
| `pendidikan_terakhir` | varchar(20) | SD–S3 |
| `pekerjaan` | varchar(100) | Pekerjaan (opsional) |
| `foto` | varchar(255) | Path foto di storage |
| `created_at` | timestamp | — |
| `updated_at` | timestamp | — |
| `deleted_at` | timestamp | Soft delete |

---

## 🔀 Routing

Semua route ada di `routes/web.php`.

| Method | URI | Name | Keterangan |
|--------|-----|------|------------|
| GET | `/` | — | Halaman welcome |
| GET | `/dashboard` | `dashboard` | Dashboard utama |
| GET | `/profile` | `profile.edit` | Edit profil pengguna |
| PATCH | `/profile` | `profile.update` | Update profil |
| DELETE | `/profile` | `profile.destroy` | Hapus akun |
| GET | `/admin/users` | `admin.users.index` | Daftar user |
| GET | `/admin/roles` | `admin.roles.index` | Daftar role |
| GET | `/admin/peserta` | `admin.peserta.index` | Daftar peserta |
| GET | `/admin/peserta/create` | `admin.peserta.create` | Form tambah peserta |
| POST | `/admin/peserta` | `admin.peserta.store` | Simpan peserta baru |
| GET | `/admin/peserta/{id}` | `admin.peserta.show` | Detail peserta |
| GET | `/admin/peserta/{id}/edit` | `admin.peserta.edit` | Form edit peserta |
| PATCH | `/admin/peserta/{id}` | `admin.peserta.update` | Update data peserta |
| DELETE | `/admin/peserta/{id}` | `admin.peserta.destroy` | Hapus peserta (soft delete) |

> Semua route `/admin/*` dilindungi middleware `auth`, `verified`, dan `role:admin`.

---

## 📁 Struktur Proyek (Relevan)

```
app/
├── Http/
│   └── Controllers/
│       ├── Admin/
│       │   ├── PesertaController.php
│       │   ├── UserController.php
│       │   └── RoleController.php
│       ├── DashboardController.php
│       └── ProfileController.php
└── Models/
    └── Peserta.php          # Static methods + raw SQL

database/
└── migrations/
    └── ..._create_peserta_table.php

resources/
└── js/
    ├── Components/
    │   └── PesertaForm.jsx  # Form shared (Create & Edit)
    └── Pages/
        └── Admin/
            └── Peserta/
                ├── Index.jsx
                ├── Create.jsx
                ├── Edit.jsx
                └── Show.jsx

routes/
└── web.php
```

---

## 🧩 Fitur

### Manajemen Peserta
- ✅ Tambah, lihat, edit, hapus peserta (soft delete)
- ✅ Upload foto peserta (JPG/PNG/WEBP, maks. 2MB)
- ✅ Pencarian real-time (nama, email, telepon)
- ✅ Sorting kolom (nama, tanggal lahir, tanggal dibuat)
- ✅ Pagination dengan pilihan jumlah data per halaman (10/25/50/100)
- ✅ Statistik ringkasan (total, laki-laki, perempuan, sarjana)
- ✅ Validasi email unik

### Autentikasi & Otorisasi
- ✅ Login, register, verifikasi email (Laravel Breeze)
- ✅ Middleware role-based (`role:admin`)
- ✅ Manajemen user dan role oleh admin

---

## 🎨 Komponen UI

Proyek ini menggunakan [shadcn/ui](https://ui.shadcn.com/) dengan komponen antara lain:

- `Button`, `Input`, `Textarea`, `Label`
- `Select`, `Card`, `Badge`, `Separator`
- `Table` (dengan sort & pagination)
- `DropdownMenu` (aksi per baris)
- `AlertDialog` (konfirmasi hapus)

---

## ⚙️ Konvensi Raw SQL

Model `Peserta` menggunakan raw SQL via `DB` facade Laravel tanpa Eloquent. Semua operasi database dilakukan melalui static methods:

```php
Peserta::paginate($filters, $perPage, $page);
Peserta::findById($id);
Peserta::create($data);
Peserta::update($id, $data);
Peserta::softDelete($id);
Peserta::isEmailExists($email, $excludeId);
Peserta::getStats();
```

---

## 📸 Upload Foto

Foto peserta disimpan di `storage/app/public/peserta/foto/` dan diakses via URL `/storage/peserta/foto/namafile.jpg`. Pastikan symlink sudah dibuat:

```bash
php artisan storage:link
```

---

## 👤 Default Admin

Setelah registrasi, assign role admin secara manual di database atau buat seeder sendiri:

```sql
-- Contoh assign role admin ke user id 1
INSERT INTO role_user (user_id, role_id) VALUES (1, 1);
```

---

## 📄 Lisensi

Proyek ini untuk keperluan internal. Tidak untuk didistribusikan.