import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Pencil, Trash2, User, BookOpen, Calendar, CreditCard, Eye, CheckCircle2, XCircle, Clock, Plus } from 'lucide-react';
import { useEffect } from 'react';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);
const formatDate   = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
const formatDateTime = (s) => s ? new Date(s).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const STATUS_MAP = {
    pending:   { label: 'Pending',  variant: 'secondary', class: '' },
    diterima:  { label: 'Diterima', variant: 'outline', class: 'border-green-300 text-green-700 bg-green-50' },
    ditolak:   { label: 'Ditolak',  variant: 'outline', class: 'border-red-300 text-red-700 bg-red-50' },
    batal:     { label: 'Batal',    variant: 'secondary', class: 'text-muted-foreground' },
};

const BAYAR_MAP = {
    belum_bayar:           { label: 'Belum Bayar',        class: 'bg-gray-100 text-gray-600' },
    menunggu_verifikasi:   { label: 'Menunggu Verifikasi', class: 'bg-yellow-100 text-yellow-700' },
    lunas:                 { label: 'Lunas',              class: 'bg-green-100 text-green-700' },
    ditolak:               { label: 'Ditolak',            class: 'bg-red-100 text-red-700' },
};

const VERIF_MAP = {
    menunggu: { label: 'Menunggu', icon: Clock,        class: 'text-yellow-600' },
    diterima: { label: 'Diterima', icon: CheckCircle2, class: 'text-green-600' },
    ditolak:  { label: 'Ditolak',  icon: XCircle,      class: 'text-red-600' },
};

function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);
    useEffect(() => { setVisible(true); const t = setTimeout(() => setVisible(false), 4000); return () => clearTimeout(t); }, [flash]);
    if (!flash?.success || !visible) return null;
    return (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <span>{flash.success}</span>
            <button onClick={() => setVisible(false)}><XCircle className="h-4 w-4" /></button>
        </div>
    );
}

export default function PendaftaranKelasShow({ pendaftaran, pembayaran }) {
    const [deleteOpen, setDeleteOpen]   = useState(false);
    const [editStatus, setEditStatus]   = useState(false);

    const deleteForm = useForm({});
    const statusForm = useForm({
        status:            pendaftaran.status,
        status_pembayaran: pendaftaran.status_pembayaran,
        catatan:           pendaftaran.catatan || '',
    });

    const handleDelete = () => {
        deleteForm.delete(route('admin.pendaftaran-kelas.destroy', pendaftaran.id), {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    const handleStatusSubmit = (e) => {
        e.preventDefault();
        statusForm.patch(route('admin.pendaftaran-kelas.update', pendaftaran.id), {
            onSuccess: () => setEditStatus(false),
        });
    };

    const st = STATUS_MAP[pendaftaran.status] || STATUS_MAP.pending;
    const bt = BAYAR_MAP[pendaftaran.status_pembayaran] || BAYAR_MAP.belum_bayar;

    return (
        <AuthenticatedLayout header="Detail Pendaftaran">
            <Head title={`Pendaftaran - ${pendaftaran.peserta_nama}`} />

            <div className="space-y-4">
                <FlashMessage />

                {/* Breadcrumb */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={route('admin.pendaftaran-kelas.index')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" /> Daftar Pendaftaran
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{pendaftaran.peserta_nama}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditStatus(true)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Ubah Status
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground" onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                    {/* LEFT */}
                    <div className="space-y-4">
                        {/* Peserta Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center gap-3 mb-5">
                                    {pendaftaran.peserta_foto ? (
                                        <img src={`/storage/${pendaftaran.peserta_foto}`} alt={pendaftaran.peserta_nama} className="h-20 w-20 rounded-full object-cover border-4 border-muted" />
                                    ) : (
                                        <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-muted text-3xl font-bold ${pendaftaran.peserta_jk === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'}`}>
                                            {pendaftaran.peserta_nama?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="font-bold">{pendaftaran.peserta_nama}</h2>
                                        <p className="text-xs text-muted-foreground">{pendaftaran.peserta_email || pendaftaran.peserta_telepon || '—'}</p>
                                    </div>
                                </div>
                                <Separator className="mb-4" />
                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Status Daftar</span>
                                        <Badge variant={st.variant} className={st.class}>{st.label}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Pembayaran</span>
                                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${bt.class}`}>{bt.label}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-3 text-muted-foreground divide-y">
                                <div className="flex justify-between pb-3"><span>ID</span><span className="font-mono bg-muted px-1.5 rounded text-foreground">#{pendaftaran.id}</span></div>
                                <div className="flex justify-between py-3"><span>Tgl Daftar</span><span>{formatDate(pendaftaran.tanggal_daftar)}</span></div>
                                <div className="flex justify-between pt-3"><span>Dibuat</span><span>{formatDate(pendaftaran.created_at)}</span></div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Kelas Info */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BookOpen className="h-4 w-4" /> Info Kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Nama Kelas</p>
                                        <p className="font-medium">{pendaftaran.nama_kelas}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-muted/50 p-3">
                                        <p className="text-xs text-muted-foreground mb-0.5">Biaya Kelas</p>
                                        <p className="font-semibold">{pendaftaran.kelas_biaya > 0 ? formatRupiah(pendaftaran.kelas_biaya) : 'Gratis'}</p>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-3">
                                        <p className="text-xs text-muted-foreground mb-0.5">Lokasi</p>
                                        <p className="font-semibold">{pendaftaran.kelas_lokasi || '—'}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={route('admin.kelas.show', pendaftaran.kelas_id)}>
                                        <Eye className="mr-2 h-3.5 w-3.5" /> Lihat Detail Kelas
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Riwayat Pembayaran */}
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <CreditCard className="h-4 w-4" /> Riwayat Pembayaran
                                    </CardTitle>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={route('admin.pembayaran-kelas.index')}>
                                            <Plus className="mr-2 h-3.5 w-3.5" /> Upload Bukti
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {pembayaran.length === 0 ? (
                                    <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                                        <CreditCard className="h-8 w-8 opacity-20" />
                                        <p className="text-sm">Belum ada pembayaran</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pembayaran.map(pb => {
                                            const vf = VERIF_MAP[pb.status_verifikasi] || VERIF_MAP.menunggu;
                                            const VIcon = vf.icon;
                                            return (
                                                <div key={pb.id} className="flex items-start justify-between rounded-lg border p-3 gap-3">
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <VIcon className={`h-4 w-4 ${vf.class}`} />
                                                            <span className={`text-sm font-semibold ${vf.class}`}>{vf.label}</span>
                                                            <span className="text-xs text-muted-foreground">· {pb.metode_pembayaran || 'Manual'}</span>
                                                        </div>
                                                        <p className="font-bold">{formatRupiah(pb.jumlah_bayar)}</p>
                                                        <p className="text-xs text-muted-foreground">{formatDateTime(pb.tanggal_bayar)}</p>
                                                        {pb.catatan_admin && <p className="text-xs italic text-muted-foreground">"{pb.catatan_admin}"</p>}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={route('admin.pembayaran-kelas.show', pb.id)}><Eye className="h-3.5 w-3.5" /></Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Catatan */}
                        {pendaftaran.catatan && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Catatan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{pendaftaran.catatan}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Status Dialog */}
            <AlertDialog open={editStatus} onOpenChange={setEditStatus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ubah Status Pendaftaran</AlertDialogTitle>
                    </AlertDialogHeader>
                    <form onSubmit={handleStatusSubmit} className="space-y-4 py-2">
                        <div>
                            <Label>Status Pendaftaran</Label>
                            <Select value={statusForm.data.status} onValueChange={v => statusForm.setData('status', v)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Status Pembayaran</Label>
                            <Select value={statusForm.data.status_pembayaran} onValueChange={v => statusForm.setData('status_pembayaran', v)}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(BAYAR_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Catatan</Label>
                            <Textarea value={statusForm.data.catatan} onChange={e => statusForm.setData('catatan', e.target.value)} rows={3} placeholder="Catatan opsional..." className="mt-1" />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Batal</AlertDialogCancel>
                            <Button type="submit" disabled={statusForm.processing}>
                                {statusForm.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pendaftaran</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus pendaftaran <strong className="text-foreground">{pendaftaran.peserta_nama}</strong> dari kelas <strong className="text-foreground">{pendaftaran.nama_kelas}</strong>?
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