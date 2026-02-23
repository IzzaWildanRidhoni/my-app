import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Upload, CreditCard, Trash2 } from 'lucide-react';

export default function RekeningAktifEdit({ rekening }) {
    const { data, setData, post, processing, errors } = useForm({
        _method:        'PUT',
        nama_bank:      rekening.nama_bank,
        nomor_rekening: rekening.nomor_rekening,
        nama_pemilik:   rekening.nama_pemilik,
        logo:           null,
        hapus_logo:     false,
        is_aktif:       !!rekening.is_aktif,
        urutan:         rekening.urutan ?? 0,
    });

    const [preview, setPreview] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('logo', file);
        setPreview(URL.createObjectURL(file));
        if (data.hapus_logo) setData('hapus_logo', false);
    };

    const handleHapusLogo = () => {
        setData('hapus_logo', true);
        setPreview(null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.rekening.update', rekening.id), { forceFormData: true });
    };

    const logoSrc = preview || (rekening.logo && !data.hapus_logo ? `/storage/${rekening.logo}` : null);

    return (
        <AuthenticatedLayout header="Edit Rekening">
            <Head title="Edit Rekening" />

            <div className="max-w-xl space-y-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href={route('admin.rekening.index')} className="flex items-center gap-1 hover:text-foreground">
                        <ArrowLeft className="h-3.5 w-3.5" /> Rekening Aktif
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Edit</span>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CreditCard className="h-4 w-4" /> Edit Rekening
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">

                            <div>
                                <Label htmlFor="nama_bank">Nama Bank <span className="text-destructive">*</span></Label>
                                <Input
                                    id="nama_bank"
                                    className="mt-1"
                                    placeholder="Contoh: Bank BCA"
                                    value={data.nama_bank}
                                    onChange={(e) => setData('nama_bank', e.target.value)}
                                />
                                {errors.nama_bank && <p className="text-xs text-destructive mt-1">{errors.nama_bank}</p>}
                            </div>

                            <div>
                                <Label htmlFor="nomor_rekening">Nomor Rekening <span className="text-destructive">*</span></Label>
                                <Input
                                    id="nomor_rekening"
                                    className="mt-1 font-mono"
                                    value={data.nomor_rekening}
                                    onChange={(e) => setData('nomor_rekening', e.target.value)}
                                />
                                {errors.nomor_rekening && <p className="text-xs text-destructive mt-1">{errors.nomor_rekening}</p>}
                            </div>

                            <div>
                                <Label htmlFor="nama_pemilik">Nama Pemilik Rekening <span className="text-destructive">*</span></Label>
                                <Input
                                    id="nama_pemilik"
                                    className="mt-1"
                                    value={data.nama_pemilik}
                                    onChange={(e) => setData('nama_pemilik', e.target.value)}
                                />
                                {errors.nama_pemilik && <p className="text-xs text-destructive mt-1">{errors.nama_pemilik}</p>}
                            </div>

                            {/* Logo */}
                            <div>
                                <Label>Logo Bank</Label>
                                <div className="mt-1 space-y-2">
                                    {logoSrc ? (
                                        <div className="flex items-center gap-3 rounded-lg border p-3">
                                            <img src={logoSrc} alt="Logo" className="h-14 w-14 rounded-lg object-contain border bg-white p-1" />
                                            <div className="flex-1">
                                                <p className="text-sm text-muted-foreground">Logo saat ini</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive"
                                                onClick={handleHapusLogo}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                                            </Button>
                                        </div>
                                    ) : null}

                                    <label
                                        htmlFor="logo"
                                        className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 hover:border-primary/50 transition-colors"
                                    >
                                        <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">{logoSrc ? 'Ganti logo' : 'Upload logo bank'}</p>
                                            <p className="text-xs text-muted-foreground">JPG, PNG, WebP — maks. 1 MB</p>
                                        </div>
                                        <input id="logo" type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={handleFile} />
                                    </label>
                                </div>
                                {errors.logo && <p className="text-xs text-destructive mt-1">{errors.logo}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="urutan">Urutan Tampil</Label>
                                    <Input
                                        id="urutan"
                                        type="number"
                                        min="0"
                                        className="mt-1"
                                        value={data.urutan}
                                        onChange={(e) => setData('urutan', parseInt(e.target.value) || 0)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Angka kecil tampil lebih dulu</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <div className="mt-2 flex items-center gap-3 rounded-lg border px-3 py-2.5">
                                        <Switch
                                            id="is_aktif"
                                            checked={data.is_aktif}
                                            onCheckedChange={(v) => setData('is_aktif', v)}
                                        />
                                        <Label htmlFor="is_aktif" className="cursor-pointer font-normal">
                                            {data.is_aktif ? 'Aktif' : 'Nonaktif'}
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route('admin.rekening.index')}>Batal</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}