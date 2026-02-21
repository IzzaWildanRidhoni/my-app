import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft, Pencil, Trash2, BookOpen, MapPin, User,
    Calendar, Users, CreditCard, Lock, ExternalLink, MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const formatRupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);

const formatDate = (s) =>
    s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

function InfoRow({ icon: Icon, label, value }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-start gap-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

// Render deskripsi setelah lunas dengan deteksi link otomatis
function DeskripsiLunas({ text }) {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+|wa\.me\/[^\s]+)/g;
    const parts    = text.split(urlRegex);

    return (
        <div className="space-y-2">
            {parts.map((part, i) => {
                const isUrl = /^(https?:\/\/|wa\.me\/)/.test(part);
                if (isUrl) {
                    const isWa  = part.includes('wa.me');
                    const href  = part.startsWith('http') ? part : `https://${part}`;
                    return (
                        <a key={i} href={href} target="_blank" rel="noreferrer"
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                isWa ? 'bg-green-600 text-white hover:bg-green-700'
                                     : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}>
                            {isWa ? <MessageCircle className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                            {isWa ? 'WhatsApp' : part}
                        </a>
                    );
                }
                return part ? (
                    <p key={i} className="text-sm text-muted-foreground whitespace-pre-line">{part}</p>
                ) : null;
            })}
        </div>
    );
}

export default function KelasShow() {
    const { kelas, flash } = usePage().props;
    const [showDelete, setShowDelete] = useState(false);
    const deleteForm = useForm({});

    const confirmDelete = () => {
        deleteForm.delete(route('admin.kelas.destroy', kelas.id), {
            onSuccess: () => setShowDelete(false),
        });
    };

    const penuh = kelas.kuota !== null && kelas.jumlah_peserta >= kelas.kuota;

    return (
        <AuthenticatedLayout header="Detail Kelas">
            <Head title={kelas.nama_kelas} />

            <div className="space-y-5 max-w-4xl mx-auto">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                {/* Breadcrumb + Actions */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={route('admin.kelas.index')} className="flex items-center gap-1 hover:text-foreground">
                            <ArrowLeft className="h-3.5 w-3.5" /> Daftar Kelas
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium truncate max-w-[200px]">{kelas.nama_kelas}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.kelas.edit', kelas.id)}>
                                <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                    {/* ── LEFT: Info Utama ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <Badge variant={kelas.tipe === 'event' ? 'default' : 'secondary'} className="capitalize">
                                                {kelas.tipe}
                                            </Badge>
                                            <Badge variant={kelas.status === 'aktif' ? 'outline' : 'secondary'}
                                                className={kelas.status === 'aktif' ? 'border-green-300 text-green-700 bg-green-50' : ''}>
                                                {kelas.status}
                                            </Badge>
                                            {penuh && <Badge variant="destructive">Penuh</Badge>}
                                        </div>
                                        <CardTitle className="text-xl">{kelas.nama_kelas}</CardTitle>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            {kelas.biaya > 0 ? formatRupiah(kelas.biaya) : (
                                                <span className="text-green-600">Gratis</span>
                                            )}
                                        </p>
                                        {kelas.kuota && (
                                            <p className={`text-xs mt-0.5 ${penuh ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                                                {kelas.jumlah_peserta} / {kelas.kuota} peserta
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {kelas.deskripsi && (
                                    <>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                                                Deskripsi Publik
                                            </p>
                                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                                {kelas.deskripsi}
                                            </p>
                                        </div>
                                        <Separator />
                                    </>
                                )}

                                <div className="divide-y">
                                    <InfoRow icon={User}     label="Pengajar"        value={kelas.pengajar} />
                                    <InfoRow icon={MapPin}   label="Lokasi"          value={kelas.lokasi} />
                                    <InfoRow icon={Calendar} label="Tanggal Mulai"   value={formatDate(kelas.tanggal_mulai)} />
                                    <InfoRow icon={Calendar} label="Tanggal Selesai" value={formatDate(kelas.tanggal_selesai)} />
                                    <InfoRow icon={Users}    label="Peserta / Kuota"
                                        value={kelas.kuota
                                            ? `${kelas.jumlah_peserta} / ${kelas.kuota}`
                                            : `${kelas.jumlah_peserta} (tidak terbatas)`} />
                                    <InfoRow icon={CreditCard} label="Biaya"
                                        value={kelas.biaya > 0 ? formatRupiah(kelas.biaya) : 'Gratis'} />
                                    <InfoRow icon={BookOpen} label="Wajib Pembayaran"
                                        value={kelas.perlu_pembayaran ? 'Ya — peserta harus upload bukti' : 'Tidak'} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Deskripsi Setelah Lunas */}
                        <Card className="border-green-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base text-green-800">
                                    <Lock className="h-4 w-4" /> Informasi Setelah Pembayaran Lunas
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Hanya ditampilkan kepada peserta yang pembayarannya sudah dikonfirmasi.
                                </p>
                            </CardHeader>
                            <CardContent>
                                {kelas.deskripsi_setelah_lunas ? (
                                    <div className="rounded-lg border bg-green-50/50 p-4">
                                        <DeskripsiLunas text={kelas.deskripsi_setelah_lunas} />
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                                        Belum diisi. Klik <strong>Edit</strong> untuk menambahkan informasi seperti link grup WA, Zoom, dll.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── RIGHT: Sidebar Info ── */}
                    <div className="space-y-4">
                        <Card>
                            <CardContent className="pt-5 space-y-3 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground">Dibuat</p>
                                    <p className="font-medium">{formatDate(kelas.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Terakhir diubah</p>
                                    <p className="font-medium">{formatDate(kelas.updated_at)}</p>
                                </div>
                                <Separator />
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={route('admin.pendaftaran-kelas.index') + `?kelas_id=${kelas.id}`}>
                                        <Users className="mr-2 h-4 w-4" /> Lihat Peserta
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus kelas <strong className="text-foreground">{kelas.nama_kelas}</strong>?
                            Data yang dihapus tidak dapat dikembalikan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}