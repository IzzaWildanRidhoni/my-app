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
    Clock, XCircle, AlertCircle, FileText, Eye, ExternalLink, MessageCircle,
    BookOpen, PartyPopper, Lock
} from 'lucide-react';

const formatRupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);

const formatDate = (s) =>
    s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const statusBayarConfig = {
    belum_bayar:         { label: 'Belum Bayar',         icon: XCircle,      bg: 'bg-red-50 border-red-200 text-red-700' },
    menunggu_verifikasi: { label: 'Menunggu Verifikasi', icon: Clock,        bg: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    lunas:               { label: 'Lunas',               icon: CheckCircle2, bg: 'bg-green-50 border-green-200 text-green-700' },
    ditolak:             { label: 'Pembayaran Ditolak',  icon: XCircle,      bg: 'bg-red-50 border-red-200 text-red-700' },
};

// Render teks dengan deteksi URL otomatis jadi tombol
function DeskripsiRenderer({ text }) {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+|wa\.me\/[^\s]+)/g;
    const parts    = text.split(urlRegex);

    return (
        <div className="space-y-2">
            {parts.map((part, i) => {
                const isUrl = /^(https?:\/\/|wa\.me\/)/.test(part);
                if (isUrl) {
                    const isWa = part.includes('wa.me');
                    const href = part.startsWith('http') ? part : `https://${part}`;
                    return (
                        <a key={i} href={href} target="_blank" rel="noreferrer"
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                isWa
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }`}>
                            {isWa
                                ? <MessageCircle className="h-4 w-4" />
                                : <ExternalLink className="h-4 w-4" />}
                            {isWa ? 'Hubungi via WhatsApp' : 'Buka Link'}
                        </a>
                    );
                }
                return part ? (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{part}</p>
                ) : null;
            })}
        </div>
    );
}

// Card setelah lunas — menampilkan info kelas + deskripsi_setelah_lunas
function InfoKelasLunas({ pendaftaran }) {
    return (
        <Card className="border-green-300 bg-green-50/50">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-green-800">
                    <PartyPopper className="h-5 w-5" />
                    Pendaftaran Anda Aktif!
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-green-700">
                    Pembayaran Anda telah dikonfirmasi. Berikut informasi untuk mengikuti kelas:
                </p>

                {/* Info dasar kelas */}
                <div className="rounded-lg border border-green-200 bg-white p-4 space-y-2.5">
                    {pendaftaran.kelas_pengajar && (
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{pendaftaran.kelas_pengajar}</span>
                        </div>
                    )}
                    {pendaftaran.kelas_lokasi && (
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{pendaftaran.kelas_lokasi}</span>
                        </div>
                    )}
                    {pendaftaran.tanggal_mulai && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>Mulai {formatDate(pendaftaran.tanggal_mulai)}</span>
                        </div>
                    )}

                    {/* Deskripsi setelah lunas — ini yang baru */}
                    {pendaftaran.kelas_deskripsi_setelah_lunas && (
                        <>
                            <Separator className="my-1" />
                            <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Lock className="h-3.5 w-3.5 text-green-600" />
                                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                                        Informasi Khusus Peserta
                                    </p>
                                </div>
                                <DeskripsiRenderer text={pendaftaran.kelas_deskripsi_setelah_lunas} />
                            </div>
                        </>
                    )}

                    {/* Fallback jika admin belum mengisi */}
                    {!pendaftaran.kelas_deskripsi_setelah_lunas &&
                     !pendaftaran.kelas_pengajar &&
                     !pendaftaran.kelas_lokasi && (
                        <p className="text-sm text-muted-foreground italic">
                            Detail kelas akan segera diinformasikan oleh admin.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Form upload bukti pembayaran
function UploadBuktiForm({ pendaftaranId, biaya }) {
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
                            <Input id="jumlah_bayar" type="number" min="0" value={data.jumlah_bayar}
                                onChange={(e) => setData('jumlah_bayar', e.target.value)}
                                className="mt-1" placeholder="Masukkan jumlah" />
                            {errors.jumlah_bayar && <p className="text-xs text-destructive mt-1">{errors.jumlah_bayar}</p>}
                        </div>
                        <div>
                            <Label htmlFor="tanggal_bayar">Tanggal Bayar <span className="text-destructive">*</span></Label>
                            <Input id="tanggal_bayar" type="date" value={data.tanggal_bayar}
                                onChange={(e) => setData('tanggal_bayar', e.target.value)} className="mt-1" />
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
                        <label htmlFor="bukti"
                            className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 hover:border-primary/50 transition-colors">
                            {preview ? (
                                <img src={preview} alt="Preview" className="max-h-40 rounded-md object-contain" />
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground text-center">Klik untuk upload foto / PDF bukti transfer</p>
                                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF — maks. 5 MB</p>
                                </>
                            )}
                            <input id="bukti" type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile} />
                        </label>
                        {data.bukti_pembayaran && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" /> {data.bukti_pembayaran.name}
                            </p>
                        )}
                        {errors.bukti_pembayaran && <p className="text-xs text-destructive mt-1">{errors.bukti_pembayaran}</p>}
                    </div>

                    {errors.general && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.general}
                        </div>
                    )}

                    <Button type="submit" className="w-full"
                        disabled={processing || !data.bukti_pembayaran || !data.metode_pembayaran}>
                        {processing ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

// Riwayat pembayaran
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
            <CardContent className="space-y-3">
                {pembayaran.map((p, i) => (
                    <div key={p.id} className="flex items-start justify-between rounded-lg border p-3 gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs text-muted-foreground">#{i + 1}</span>
                                <Badge variant="outline" className={`text-xs ${verifikasiColor[p.status_verifikasi]}`}>
                                    {p.status_verifikasi === 'menunggu' ? 'Menunggu Verifikasi'
                                     : p.status_verifikasi === 'diterima' ? 'Diterima' : 'Ditolak'}
                                </Badge>
                            </div>
                            <p className="text-sm font-semibold">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p.jumlah_bayar)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {p.metode_pembayaran} &middot; {formatDate(p.tanggal_bayar)}
                            </p>
                            {p.catatan_admin && (
                                <p className="text-xs text-muted-foreground mt-1 italic">Admin: {p.catatan_admin}</p>
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
            </CardContent>
        </Card>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UserPendaftaranShow({ pendaftaran, pembayaran }) {
    const { flash } = usePage().props;

    const sc      = statusBayarConfig[pendaftaran.status_pembayaran] || statusBayarConfig.belum_bayar;
    const Icon    = sc.icon;
    const isLunas = pendaftaran.status_pembayaran === 'lunas';

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
                    <span className="text-foreground font-medium truncate">{pendaftaran.nama_kelas}</span>
                </div>

                {/* Card lunas + deskripsi_setelah_lunas */}
                {isLunas && <InfoKelasLunas pendaftaran={pendaftaran} />}

                {/* Info Pendaftaran */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <BookOpen className="h-4 w-4" /> Informasi Pendaftaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Badge variant={pendaftaran.kelas_tipe === 'event' ? 'default' : 'secondary'} className="capitalize text-xs">
                                    {pendaftaran.kelas_tipe}
                                </Badge>
                            </div>
                            <h2 className="text-lg font-semibold">{pendaftaran.nama_kelas}</h2>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Status Pendaftaran</p>
                                <Badge variant="outline" className="capitalize">{pendaftaran.status}</Badge>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Status Pembayaran</p>
                                <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${sc.bg}`}>
                                    <Icon className="h-3 w-3" />
                                    {sc.label}
                                </div>
                            </div>
                        </div>

                        {pendaftaran.kelas_biaya > 0 && (
                            <div className="rounded-md bg-muted/40 px-3 py-2 text-sm">
                                Biaya kelas: <strong>{formatRupiah(pendaftaran.kelas_biaya)}</strong>
                            </div>
                        )}

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
                    <UploadBuktiForm pendaftaranId={pendaftaran.id} biaya={pendaftaran.kelas_biaya} />
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