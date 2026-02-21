import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft, Calendar, MapPin, User, CreditCard, Upload, CheckCircle2,
    Clock, XCircle, AlertCircle, FileText, Eye
} from 'lucide-react';

const formatRupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);

const formatDate = (s) =>
    s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const formatDateTime = (s) =>
    s ? new Date(s).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const statusBayarConfig = {
    belum_bayar:         { label: 'Belum Bayar',         icon: XCircle,       bg: 'bg-red-50 border-red-200 text-red-700' },
    menunggu_verifikasi: { label: 'Menunggu Verifikasi', icon: Clock,         bg: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    lunas:               { label: 'Lunas',                icon: CheckCircle2, bg: 'bg-green-50 border-green-200 text-green-700' },
    ditolak:             { label: 'Pembayaran Ditolak',   icon: XCircle,      bg: 'bg-red-50 border-red-200 text-red-700' },
};

function UploadBuktiForm({ pendaftaranId, biaya, onSuccess }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        jumlah_bayar:      biaya || '',
        metode_pembayaran: '',
        bukti_pembayaran:  null,
        tanggal_bayar:     new Date().toISOString().split('T')[0],
    });

    const [preview, setPreview] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('bukti_pembayaran', file);
        if (file.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('user.pendaftaran.bayar', pendaftaranId), {
            forceFormData: true,
            onSuccess: () => { reset(); setPreview(null); },
        });
    };

    return (
        <Card className="border-orange-200">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-orange-700">
                    <Upload className="h-4 w-4" /> Upload Bukti Pembayaran
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="jumlah_bayar">Jumlah Bayar (Rp) <span className="text-destructive">*</span></Label>
                            <Input
                                id="jumlah_bayar"
                                type="number"
                                min="0"
                                value={data.jumlah_bayar}
                                onChange={(e) => setData('jumlah_bayar', e.target.value)}
                                className="mt-1"
                                placeholder="Masukkan jumlah"
                            />
                            {errors.jumlah_bayar && <p className="text-xs text-destructive mt-1">{errors.jumlah_bayar}</p>}
                        </div>
                        <div>
                            <Label htmlFor="tanggal_bayar">Tanggal Bayar <span className="text-destructive">*</span></Label>
                            <Input
                                id="tanggal_bayar"
                                type="date"
                                value={data.tanggal_bayar}
                                onChange={(e) => setData('tanggal_bayar', e.target.value)}
                                className="mt-1"
                            />
                            {errors.tanggal_bayar && <p className="text-xs text-destructive mt-1">{errors.tanggal_bayar}</p>}
                        </div>
                    </div>

                    <div>
                        <Label>Metode Pembayaran <span className="text-destructive">*</span></Label>
                        <Select value={data.metode_pembayaran} onValueChange={(v) => setData('metode_pembayaran', v)}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih metode..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Transfer Bank BCA">Transfer Bank BCA</SelectItem>
                                <SelectItem value="Transfer Bank BRI">Transfer Bank BRI</SelectItem>
                                <SelectItem value="Transfer Bank BNI">Transfer Bank BNI</SelectItem>
                                <SelectItem value="Transfer Bank Mandiri">Transfer Bank Mandiri</SelectItem>
                                <SelectItem value="QRIS">QRIS</SelectItem>
                                <SelectItem value="Tunai">Tunai</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.metode_pembayaran && <p className="text-xs text-destructive mt-1">{errors.metode_pembayaran}</p>}
                    </div>

                    <div>
                        <Label htmlFor="bukti">Bukti Pembayaran <span className="text-destructive">*</span></Label>
                        <div className="mt-1 flex flex-col gap-2">
                            <label
                                htmlFor="bukti"
                                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 hover:border-primary/50 transition-colors"
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="max-h-40 rounded-md object-contain" />
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground text-center">
                                            Klik untuk upload foto / PDF bukti transfer
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF — maks. 5 MB</p>
                                    </>
                                )}
                                <input id="bukti" type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile} />
                            </label>
                            {data.bukti_pembayaran && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <FileText className="h-3.5 w-3.5" /> {data.bukti_pembayaran.name}
                                </p>
                            )}
                        </div>
                        {errors.bukti_pembayaran && <p className="text-xs text-destructive mt-1">{errors.bukti_pembayaran}</p>}
                    </div>

                    {errors.general && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.general}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={processing || !data.bukti_pembayaran || !data.metode_pembayaran}>
                        {processing ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function RiwayatPembayaran({ pembayaran }) {
    if (!pembayaran || pembayaran.length === 0) return null;

    const verifikasiColor = {
        menunggu: 'text-yellow-600',
        diterima: 'text-green-600',
        ditolak:  'text-red-600',
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-4 w-4" /> Riwayat Pembayaran
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {pembayaran.map((p, i) => (
                        <div key={p.id} className="flex items-start justify-between rounded-lg border p-3 gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-muted-foreground">#{i + 1}</span>
                                    <Badge variant="outline" className={`text-xs capitalize ${verifikasiColor[p.status_verifikasi]}`}>
                                        {p.status_verifikasi === 'menunggu' ? 'Menunggu Verifikasi' :
                                         p.status_verifikasi === 'diterima' ? 'Diterima' : 'Ditolak'}
                                    </Badge>
                                </div>
                                <p className="text-sm font-semibold">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p.jumlah_bayar)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {p.metode_pembayaran} &middot; {formatDate(p.tanggal_bayar)}
                                </p>
                                {p.catatan_admin && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">
                                        Admin: {p.catatan_admin}
                                    </p>
                                )}
                            </div>
                            {p.bukti_pembayaran && (
                                <Button variant="outline" size="sm" className="shrink-0 h-8 text-xs" asChild>
                                    <a href={`/storage/${p.bukti_pembayaran}`} target="_blank" rel="noreferrer">
                                        <Eye className="h-3 w-3 mr-1" /> Lihat
                                    </a>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function UserPendaftaranShow({ pendaftaran, pembayaran }) {
    const { flash } = usePage().props;

    const sc = statusBayarConfig[pendaftaran.status_pembayaran] || statusBayarConfig.belum_bayar;
    const Icon = sc.icon;

    const perluUpload =
        pendaftaran.perlu_pembayaran &&
        pendaftaran.kelas_biaya > 0 &&
        ['belum_bayar', 'ditolak'].includes(pendaftaran.status_pembayaran) &&
        pendaftaran.status !== 'batal';

    return (
        <AuthenticatedLayout header="Detail Pendaftaran">
            <Head title="Detail Pendaftaran" />

            <div className="space-y-5 max-w-2xl mx-auto">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href={route('user.pendaftaran.index')} className="flex items-center gap-1 hover:text-foreground">
                        <ArrowLeft className="h-3.5 w-3.5" /> Pendaftaran Saya
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Detail</span>
                </div>

                {/* Info Kelas */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Informasi Kelas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant={pendaftaran.kelas_tipe === 'event' ? 'default' : 'secondary'} className="capitalize text-xs">
                                    {pendaftaran.kelas_tipe}
                                </Badge>
                            </div>
                            <h2 className="text-lg font-semibold">{pendaftaran.nama_kelas}</h2>
                        </div>

                        <div className="grid gap-2 text-sm text-muted-foreground">
                            {pendaftaran.kelas_pengajar && (
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 shrink-0" /> {pendaftaran.kelas_pengajar}
                                </div>
                            )}
                            {pendaftaran.kelas_lokasi && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 shrink-0" /> {pendaftaran.kelas_lokasi}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 shrink-0" />
                                {formatDate(pendaftaran.tanggal_mulai)} – {formatDate(pendaftaran.tanggal_selesai)}
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 shrink-0" />
                                {pendaftaran.kelas_biaya > 0 ? formatRupiah(pendaftaran.kelas_biaya) : 'Gratis'}
                            </div>
                        </div>

                        <Separator />

                        {/* Status pendaftaran & bayar */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Status Pendaftaran</p>
                                <Badge variant="outline" className="capitalize">
                                    {pendaftaran.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Status Pembayaran</p>
                                <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${sc.bg}`}>
                                    <Icon className="h-3 w-3" />
                                    {sc.label}
                                </div>
                            </div>
                        </div>

                        {pendaftaran.catatan && (
                            <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                                <strong>Catatan Admin:</strong> {pendaftaran.catatan}
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            Tanggal daftar: {formatDate(pendaftaran.tanggal_daftar)}
                        </p>
                    </CardContent>
                </Card>

                {/* Form upload bukti */}
                {perluUpload && (
                    <UploadBuktiForm
                        pendaftaranId={pendaftaran.id}
                        biaya={pendaftaran.kelas_biaya}
                    />
                )}

                {/* Riwayat pembayaran */}
                <RiwayatPembayaran pembayaran={pembayaran} />

                <div className="flex justify-center">
                    <Button variant="outline" asChild>
                        <Link href={route('user.pendaftaran.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Link>
                    </Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}