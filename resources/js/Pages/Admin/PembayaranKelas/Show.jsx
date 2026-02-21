import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, CheckCircle2, XCircle, Clock, User, BookOpen, CreditCard, Eye, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const formatRupiah  = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);
const formatDate    = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
const formatDateTime = (s) => s ? new Date(s).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const VERIF_MAP = {
    menunggu: { label: 'Menunggu Verifikasi', icon: Clock,        class: 'text-yellow-600',  bg: 'bg-yellow-50 border-yellow-200' },
    diterima: { label: 'Pembayaran Diterima', icon: CheckCircle2, class: 'text-green-600',   bg: 'bg-green-50 border-green-200' },
    ditolak:  { label: 'Pembayaran Ditolak',  icon: XCircle,      class: 'text-red-600',     bg: 'bg-red-50 border-red-200' },
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

export default function PembayaranKelasShow({ pembayaran }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [terimaOpen, setTerimaOpen] = useState(false);
    const [tolakOpen,  setTolakOpen]  = useState(false);

    const deleteForm = useForm({});
    const terimaForm = useForm({ status_verifikasi: 'diterima', catatan_admin: '' });
    const tolakForm  = useForm({ status_verifikasi: 'ditolak',  catatan_admin: '' });

    const handleDelete = () => {
        deleteForm.delete(route('admin.pembayaran-kelas.destroy', pembayaran.id), {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    const handleTerima = (e) => {
        e.preventDefault();
        terimaForm.post(route('admin.pembayaran-kelas.verifikasi', pembayaran.id), {
            onSuccess: () => setTerimaOpen(false),
        });
    };

    const handleTolak = (e) => {
        e.preventDefault();
        tolakForm.post(route('admin.pembayaran-kelas.verifikasi', pembayaran.id), {
            onSuccess: () => setTolakOpen(false),
        });
    };

    const vf = VERIF_MAP[pembayaran.status_verifikasi] || VERIF_MAP.menunggu;
    const VIcon = vf.icon;
    const isMenunggu = pembayaran.status_verifikasi === 'menunggu';

    return (
        <AuthenticatedLayout header="Detail Pembayaran">
            <Head title={`Pembayaran - ${pembayaran.peserta_nama}`} />

            <div className="space-y-4">
                <FlashMessage />

                {/* Breadcrumb */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={route('admin.pembayaran-kelas.index')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" /> Daftar Pembayaran
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">#{pembayaran.id}</span>
                    </div>
                    <div className="flex gap-2">
                        {isMenunggu && (
                            <>
                                <Button size="sm" onClick={() => setTerimaOpen(true)} className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Terima
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => setTolakOpen(true)}>
                                    <XCircle className="mr-2 h-3.5 w-3.5" /> Tolak
                                </Button>
                            </>
                        )}
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground" onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Hapus
                        </Button>
                    </div>
                </div>

                {/* Status Banner */}
                <div className={`flex items-center gap-3 rounded-lg border p-4 ${vf.bg}`}>
                    <VIcon className={`h-6 w-6 ${vf.class}`} />
                    <div>
                        <p className={`font-semibold ${vf.class}`}>{vf.label}</p>
                        {pembayaran.catatan_admin && <p className="text-sm text-muted-foreground mt-0.5">{pembayaran.catatan_admin}</p>}
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                    {/* LEFT */}
                    <div className="space-y-4">
                        {/* Peserta Info */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center gap-3">
                                    {pembayaran.peserta_foto ? (
                                        <img src={`/storage/${pembayaran.peserta_foto}`} alt={pembayaran.peserta_nama} className="h-16 w-16 rounded-full object-cover border-4 border-muted" />
                                    ) : (
                                        <div className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-muted text-2xl font-bold ${pembayaran.peserta_jk === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'}`}>
                                            {pembayaran.peserta_nama?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="font-bold">{pembayaran.peserta_nama}</h2>
                                        <p className="text-xs text-muted-foreground">{pembayaran.peserta_email || pembayaran.peserta_telepon || '—'}</p>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={route('admin.pendaftaran-kelas.show', pembayaran.pendaftaran_kelas_id)}>
                                        <Eye className="mr-2 h-3.5 w-3.5" /> Lihat Pendaftaran
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-3 text-muted-foreground divide-y">
                                <div className="flex justify-between pb-3"><span>ID</span><span className="font-mono bg-muted px-1.5 rounded text-foreground">#{pembayaran.id}</span></div>
                                <div className="flex justify-between py-3"><span>Diupload</span><span>{formatDate(pembayaran.created_at)}</span></div>
                                <div className="flex justify-between pt-3"><span>Diperbarui</span><span>{formatDate(pembayaran.updated_at)}</span></div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Detail Pembayaran */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CreditCard className="h-4 w-4" /> Detail Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="rounded-lg bg-muted/50 p-3">
                                        <p className="text-xs text-muted-foreground">Jumlah Bayar</p>
                                        <p className="text-xl font-bold mt-0.5">{formatRupiah(pembayaran.jumlah_bayar)}</p>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-3">
                                        <p className="text-xs text-muted-foreground">Biaya Kelas</p>
                                        <p className="text-xl font-bold mt-0.5">{formatRupiah(pembayaran.kelas_biaya)}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Kelas</span>
                                        <span className="font-medium">{pembayaran.nama_kelas}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Metode</span>
                                        <span className="font-medium">{pembayaran.metode_pembayaran || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tanggal Bayar</span>
                                        <span className="font-medium">{formatDateTime(pembayaran.tanggal_bayar)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bukti Pembayaran */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Bukti Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pembayaran.bukti_pembayaran ? (
                                    <div className="space-y-3">
                                        {pembayaran.bukti_pembayaran.endsWith('.pdf') ? (
                                            <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
                                                <div className="text-center">
                                                    <p className="text-sm text-muted-foreground mb-2">File PDF</p>
                                                    <Button asChild size="sm">
                                                        <a href={`/storage/${pembayaran.bukti_pembayaran}`} target="_blank" rel="noreferrer">
                                                            <Eye className="mr-2 h-3.5 w-3.5" /> Buka PDF
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="overflow-hidden rounded-lg border">
                                                <a href={`/storage/${pembayaran.bukti_pembayaran}`} target="_blank" rel="noreferrer">
                                                    <img
                                                        src={`/storage/${pembayaran.bukti_pembayaran}`}
                                                        alt="Bukti Pembayaran"
                                                        className="w-full object-contain max-h-96 hover:opacity-90 transition-opacity"
                                                    />
                                                </a>
                                            </div>
                                        )}
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={`/storage/${pembayaran.bukti_pembayaran}`} target="_blank" rel="noreferrer">
                                                <Eye className="mr-2 h-3.5 w-3.5" /> Lihat Ukuran Penuh
                                            </a>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                                        <CreditCard className="h-8 w-8 opacity-20" />
                                        <p className="text-sm">Tidak ada bukti pembayaran</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Terima Dialog */}
            <AlertDialog open={terimaOpen} onOpenChange={setTerimaOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Terima Pembayaran</AlertDialogTitle>
                        <AlertDialogDescription>
                            Konfirmasi penerimaan pembayaran sebesar <strong>{formatRupiah(pembayaran.jumlah_bayar)}</strong> dari <strong>{pembayaran.peserta_nama}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleTerima} className="space-y-3 py-2">
                        <div>
                            <Label>Catatan (opsional)</Label>
                            <Textarea value={terimaForm.data.catatan_admin} onChange={e => terimaForm.setData('catatan_admin', e.target.value)} placeholder="Catatan untuk peserta..." rows={2} className="mt-1" />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Batal</AlertDialogCancel>
                            <Button type="submit" disabled={terimaForm.processing} className="bg-green-600 hover:bg-green-700">
                                {terimaForm.processing ? 'Memproses...' : 'Ya, Terima Pembayaran'}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            {/* Tolak Dialog */}
            <AlertDialog open={tolakOpen} onOpenChange={setTolakOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tolak Pembayaran</AlertDialogTitle>
                        <AlertDialogDescription>
                            Berikan alasan penolakan pembayaran dari <strong>{pembayaran.peserta_nama}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleTolak} className="space-y-3 py-2">
                        <div>
                            <Label>Alasan Penolakan <span className="text-destructive">*</span></Label>
                            <Textarea value={tolakForm.data.catatan_admin} onChange={e => tolakForm.setData('catatan_admin', e.target.value)} placeholder="Contoh: Nominal tidak sesuai, bukti tidak terbaca..." rows={3} className="mt-1" required />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">Batal</AlertDialogCancel>
                            <Button type="submit" disabled={tolakForm.processing} className="bg-destructive hover:bg-destructive/90">
                                {tolakForm.processing ? 'Memproses...' : 'Tolak Pembayaran'}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Pembayaran</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus data pembayaran ini? File bukti pembayaran juga akan dihapus.
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