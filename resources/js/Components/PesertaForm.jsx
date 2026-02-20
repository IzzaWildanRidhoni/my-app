// resources/js/Components/PesertaForm.jsx
// Komponen form yang dipakai bersama oleh Create dan Edit

import { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, BookOpen, Briefcase, Camera } from 'lucide-react';

const PENDIDIKAN_OPTIONS = ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'];
const STATUS_OPTIONS = [
    { value: 'aktif',             label: 'Aktif' },
    { value: 'nonaktif',          label: 'Non Aktif' },
    { value: 'lulus',             label: 'Lulus' },
    { value: 'mengundurkan_diri', label: 'Mengundurkan Diri' },
];

function FormField({ label, error, required, children, hint }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function SectionTitle({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        </div>
    );
}

export default function PesertaForm({ data, setData, errors, processing, onSubmit, mode = 'create', fotoPreview, backRoute }) {
    const fotoRef = useRef(null);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) setData('foto', file);
    };

    return (
        <form onSubmit={onSubmit} encType="multipart/form-data">
            <div className="grid gap-6 lg:grid-cols-3">
                {/* ── LEFT: Main Form ── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Identitas Diri */}
                    <Card>
                        <CardContent className="pt-6">
                            <SectionTitle icon={User} title="Identitas Diri" />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField label="NIK" error={errors.nik} required hint="16 digit Nomor Induk Kependudukan">
                                    <Input value={data.nik} onChange={(e) => setData('nik', e.target.value)}
                                        placeholder="3301xxxxxxxxxx00" maxLength={16} className="font-mono" />
                                </FormField>

                                <FormField label="Nama Lengkap" error={errors.nama} required>
                                    <Input value={data.nama} onChange={(e) => setData('nama', e.target.value)} placeholder="Nama sesuai KTP" />
                                </FormField>

                                <FormField label="Tempat Lahir" error={errors.tempat_lahir} required>
                                    <Input value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} placeholder="Kota tempat lahir" />
                                </FormField>

                                <FormField label="Tanggal Lahir" error={errors.tanggal_lahir} required>
                                    <Input type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} />
                                </FormField>

                                <FormField label="Jenis Kelamin" error={errors.jenis_kelamin} required>
                                    <Select value={data.jenis_kelamin} onValueChange={(v) => setData('jenis_kelamin', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih jenis kelamin" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Laki-laki</SelectItem>
                                            <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label="Pendidikan Terakhir" error={errors.pendidikan_terakhir} required>
                                    <Select value={data.pendidikan_terakhir} onValueChange={(v) => setData('pendidikan_terakhir', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih pendidikan" /></SelectTrigger>
                                        <SelectContent>
                                            {PENDIDIKAN_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <div className="sm:col-span-2">
                                    <FormField label="Pekerjaan" error={errors.pekerjaan}>
                                        <Input value={data.pekerjaan} onChange={(e) => setData('pekerjaan', e.target.value)} placeholder="Pekerjaan saat ini (opsional)" />
                                    </FormField>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak & Alamat */}
                    <Card>
                        <CardContent className="pt-6">
                            <SectionTitle icon={MapPin} title="Kontak & Alamat" />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField label="No. Telepon" error={errors.no_telepon}>
                                    <Input value={data.no_telepon} onChange={(e) => setData('no_telepon', e.target.value)} placeholder="08xxxxxxxxxx" />
                                </FormField>

                                <FormField label="Email" error={errors.email}>
                                    <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="email@contoh.com" />
                                </FormField>

                                <div className="sm:col-span-2">
                                    <FormField label="Alamat Lengkap" error={errors.alamat} required>
                                        <Textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)}
                                            placeholder="Jl. ... No. ..., Kelurahan, Kecamatan, Kota, Provinsi" rows={3} />
                                    </FormField>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kegiatan & Status */}
                    <Card>
                        <CardContent className="pt-6">
                            <SectionTitle icon={BookOpen} title="Kegiatan & Status" />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <FormField label="Nama Kegiatan" error={errors.nama_kegiatan} required>
                                        <Input value={data.nama_kegiatan} onChange={(e) => setData('nama_kegiatan', e.target.value)}
                                            placeholder="e.g. Pelatihan Web Development 2025" />
                                    </FormField>
                                </div>

                                <FormField label="Tanggal Daftar" error={errors.tanggal_daftar} required>
                                    <Input type="date" value={data.tanggal_daftar} onChange={(e) => setData('tanggal_daftar', e.target.value)} />
                                </FormField>

                                <FormField label="Status" error={errors.status} required>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <div className="sm:col-span-2">
                                    <FormField label="Catatan" error={errors.catatan}>
                                        <Textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)}
                                            placeholder="Catatan tambahan (opsional)" rows={2} />
                                    </FormField>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pb-6">
                        <Button type="submit" disabled={processing} className="min-w-32">
                            {processing
                                ? (mode === 'create' ? 'Menyimpan...' : 'Memperbarui...')
                                : (mode === 'create' ? 'Simpan Peserta' : 'Simpan Perubahan')
                            }
                        </Button>
                        <Button variant="outline" asChild type="button">
                            <Link href={backRoute}>Batal</Link>
                        </Button>
                    </div>
                </div>

                {/* ── RIGHT: Foto Sidebar ── */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Camera className="h-4 w-4" />
                                Foto Peserta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Preview */}
                            <div className="mb-4 flex justify-center">
                                <div className="relative">
                                    {(data.foto instanceof File) ? (
                                        <img src={URL.createObjectURL(data.foto)} alt="Preview" className="h-36 w-36 rounded-full object-cover border-4 border-muted" />
                                    ) : fotoPreview ? (
                                        <img src={`/storage/${fotoPreview}`} alt="Foto" className="h-36 w-36 rounded-full object-cover border-4 border-muted" />
                                    ) : (
                                        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-muted border-4 border-muted text-4xl font-bold text-muted-foreground">
                                            {data.nama ? data.nama.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => fotoRef.current?.click()}
                                        className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <input
                                ref={fotoRef}
                                type="file"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                onChange={handleFotoChange}
                                className="hidden"
                            />

                            <Button type="button" variant="outline" className="w-full" size="sm" onClick={() => fotoRef.current?.click()}>
                                {fotoPreview || (data.foto instanceof File) ? 'Ganti Foto' : 'Upload Foto'}
                            </Button>

                            {errors.foto && <p className="mt-2 text-sm text-destructive">{errors.foto}</p>}

                            <p className="mt-2 text-xs text-muted-foreground text-center">
                                JPG, PNG, atau WEBP. Maks. 2MB.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card className="border-dashed">
                        <CardContent className="pt-5 text-xs text-muted-foreground space-y-2">
                            <p>• NIK harus 16 digit sesuai KTP</p>
                            <p>• Email dan NIK harus unik di sistem</p>
                            <p>• Kolom bertanda <span className="text-destructive">*</span> wajib diisi</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}