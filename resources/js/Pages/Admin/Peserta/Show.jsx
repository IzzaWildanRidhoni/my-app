import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    ArrowLeft, Pencil, Trash2, User, Phone, Mail, MapPin,
    Calendar, Hash, GraduationCap, Briefcase,
} from 'lucide-react';

function DetailRow({ icon: Icon, label, value, mono = false }) {
    return (
        <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                <p className={`text-sm font-medium break-all ${mono ? 'font-mono' : ''}`}>
                    {value || <span className="text-muted-foreground italic">—</span>}
                </p>
            </div>
        </div>
    );
}

export default function PesertaShow({ peserta }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteForm = useForm({});

    const handleDelete = () => {
        deleteForm.delete(route('admin.peserta.destroy', peserta.id), {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    const formatShort = (str) => str
        ? new Date(str).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
        : '—';

    const hitungUmur = (tgl) => {
        if (!tgl) return null;
        const today = new Date();
        const birth = new Date(tgl);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const umur = hitungUmur(peserta.tanggal_lahir);

    return (
        <AuthenticatedLayout header="Detail Peserta">
            <Head title={`Peserta - ${peserta.nama}`} />

            <div className="space-y-4">
                {/* Breadcrumb */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={route('admin.peserta.index')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Daftar Peserta
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{peserta.nama}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" asChild>
                            <Link href={route('admin.peserta.edit', peserta.id)}>
                                <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                            </Link>
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground" onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                    {/* ── LEFT: Profile card ── */}
                    <div className="space-y-4">
                        <Card>
                            <CardContent className="pt-6">
                                {/* Avatar */}
                                <div className="flex flex-col items-center text-center gap-3 mb-5">
                                    {peserta.foto ? (
                                        <img src={`/storage/${peserta.foto}`} alt={peserta.nama}
                                            className="h-28 w-28 rounded-full object-cover border-4 border-muted shadow" />
                                    ) : (
                                        <div className={`flex h-28 w-28 items-center justify-center rounded-full border-4 border-muted text-4xl font-bold
                                            ${peserta.jenis_kelamin === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'}`}>
                                            {peserta.nama.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-lg font-bold">{peserta.nama}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {peserta.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            {umur !== null && ` · ${umur} tahun`}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="mb-4" />

                                {/* Quick info */}
                                <div className="space-y-2 text-sm">
                                    {peserta.email && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            <span className="text-xs truncate">{peserta.email}</span>
                                        </div>
                                    )}
                                    {peserta.no_telepon && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-3.5 w-3.5" />
                                            <span className="text-xs">{peserta.no_telepon}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-3 text-muted-foreground divide-y">
                                <div className="flex justify-between pb-3">
                                    <span>ID</span>
                                    <span className="font-mono bg-muted px-1.5 rounded text-foreground">#{peserta.id}</span>
                                </div>
                                <div className="flex justify-between py-3">
                                    <span>Didaftarkan</span>
                                    <span>{formatShort(peserta.created_at)}</span>
                                </div>
                                <div className="flex justify-between pt-3">
                                    <span>Diperbarui</span>
                                    <span>{formatShort(peserta.updated_at)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── RIGHT: Detail Sections ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Identitas */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="h-4 w-4" /> Identitas Diri
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                <DetailRow icon={User}          label="Nama Lengkap"       value={peserta.nama} />
                                <DetailRow icon={MapPin}        label="Tempat, Tgl Lahir"  value={`${peserta.tempat_lahir}, ${formatShort(peserta.tanggal_lahir)}${umur ? ` (${umur} tahun)` : ''}`} />
                                <DetailRow icon={User}          label="Jenis Kelamin"       value={peserta.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                                <DetailRow icon={GraduationCap} label="Pendidikan Terakhir" value={peserta.pendidikan_terakhir} />
                                <DetailRow icon={Briefcase}     label="Pekerjaan"           value={peserta.pekerjaan} />
                            </CardContent>
                        </Card>

                        {/* Kontak & Alamat */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Phone className="h-4 w-4" /> Kontak & Alamat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                <DetailRow icon={Phone}  label="No. Telepon"    value={peserta.no_telepon} />
                                <DetailRow icon={Mail}   label="Email"          value={peserta.email} />
                                <DetailRow icon={MapPin} label="Alamat Lengkap" value={peserta.alamat} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Peserta</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus data peserta <strong className="text-foreground">{peserta.nama}</strong>?
                            Data yang sudah dihapus tidak dapat dikembalikan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteForm.processing}>
                            {deleteForm.processing ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}