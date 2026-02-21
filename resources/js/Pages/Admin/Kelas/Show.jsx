import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Pencil, Trash2, BookOpen, MapPin, User, Calendar, DollarSign, Users, CreditCard, CheckCircle2, XCircle } from 'lucide-react';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);
const formatDate   = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-medium">{value || <span className="text-muted-foreground italic">—</span>}</p>
            </div>
        </div>
    );
}

export default function KelasShow({ kelas }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteForm = useForm({});

    const handleDelete = () => {
        deleteForm.delete(route('admin.kelas.destroy', kelas.id), {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    const isKuotaPenuh = kelas.kuota && kelas.jumlah_peserta >= kelas.kuota;

    return (
        <AuthenticatedLayout header="Detail Kelas">
            <Head title={`Kelas - ${kelas.nama_kelas}`} />

            <div className="space-y-4">
                {/* Breadcrumb */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={route('admin.kelas.index')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" /> Daftar Kelas
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{kelas.nama_kelas}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" asChild>
                            <Link href={route('admin.kelas.edit', kelas.id)}><Pencil className="mr-2 h-3.5 w-3.5" /> Edit</Link>
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground" onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                    {/* LEFT */}
                    <div className="space-y-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center gap-3 mb-5">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                                        <BookOpen className="h-9 w-9 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">{kelas.nama_kelas}</h2>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <Badge variant={kelas.tipe === 'event' ? 'default' : 'secondary'} className="capitalize">{kelas.tipe}</Badge>
                                            <Badge variant="outline" className={kelas.status === 'aktif' ? 'border-green-300 text-green-700 bg-green-50' : ''}>{kelas.status}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="mb-4" />

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Peserta</span>
                                        <span className={`font-semibold ${isKuotaPenuh ? 'text-red-600' : ''}`}>
                                            {kelas.jumlah_peserta ?? 0}{kelas.kuota ? ` / ${kelas.kuota}` : ''}
                                            {isKuotaPenuh && <span className="ml-1 text-xs">(Penuh)</span>}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Biaya</span>
                                        <span className="font-semibold">{kelas.biaya > 0 ? formatRupiah(kelas.biaya) : <span className="text-green-600">Gratis</span>}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Wajib Bayar</span>
                                        {kelas.perlu_pembayaran
                                            ? <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            : <XCircle className="h-4 w-4 text-muted-foreground" />}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-3 text-muted-foreground divide-y">
                                <div className="flex justify-between pb-3">
                                    <span>ID</span>
                                    <span className="font-mono bg-muted px-1.5 rounded text-foreground">#{kelas.id}</span>
                                </div>
                                <div className="flex justify-between py-3">
                                    <span>Dibuat</span>
                                    <span>{formatDate(kelas.created_at)}</span>
                                </div>
                                <div className="flex justify-between pt-3">
                                    <span>Diperbarui</span>
                                    <span>{formatDate(kelas.updated_at)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Button variant="outline" className="w-full" asChild>
                            <Link href={route('admin.pendaftaran-kelas.index', { kelas_id: kelas.id })}>
                                <Users className="mr-2 h-4 w-4" /> Lihat Pendaftaran
                            </Link>
                        </Button>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BookOpen className="h-4 w-4" /> Informasi Kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                <DetailRow icon={BookOpen} label="Nama Kelas"  value={kelas.nama_kelas} />
                                <DetailRow icon={User}     label="Pengajar"    value={kelas.pengajar} />
                                <DetailRow icon={MapPin}   label="Lokasi"      value={kelas.lokasi} />
                                {kelas.deskripsi && (
                                    <div className="py-3">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Deskripsi</p>
                                        <p className="text-sm">{kelas.deskripsi}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Calendar className="h-4 w-4" /> Jadwal & Kuota
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                <DetailRow icon={Calendar} label="Tanggal Mulai"   value={formatDate(kelas.tanggal_mulai)} />
                                <DetailRow icon={Calendar} label="Tanggal Selesai" value={formatDate(kelas.tanggal_selesai)} />
                                <DetailRow icon={Users}    label="Kuota"           value={kelas.kuota ? `${kelas.kuota} orang` : 'Tidak terbatas'} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus kelas <strong className="text-foreground">{kelas.nama_kelas}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteForm.processing}>
                            {deleteForm.processing ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}