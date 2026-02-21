import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KelasForm from '@/Components/KelasForm';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KelasEdit() {
    const { kelas } = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        nama_kelas:               kelas?.nama_kelas              ?? '',
        deskripsi:                kelas?.deskripsi               ?? '',
        deskripsi_setelah_lunas:  kelas?.deskripsi_setelah_lunas ?? '',
        lokasi:                   kelas?.lokasi                  ?? '',
        pengajar:                 kelas?.pengajar                ?? '',
        tipe:                     kelas?.tipe                    ?? 'event',
        tanggal_mulai:            kelas?.tanggal_mulai           ?? '',
        tanggal_selesai:          kelas?.tanggal_selesai         ?? '',
        kuota:                    kelas?.kuota                   ?? '',
        biaya:                    kelas?.biaya                   ?? 0,
        perlu_pembayaran:         !!kelas?.perlu_pembayaran,
        status:                   kelas?.status                  ?? 'aktif',
    });

    if (!kelas) {
        return (
            <AuthenticatedLayout header="Edit Kelas">
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                    Data kelas tidak ditemukan.
                </div>
            </AuthenticatedLayout>
        );
    }

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.kelas.update', kelas.id));
    };

    return (
        <AuthenticatedLayout header="Edit Kelas">
            <Head title={`Edit - ${kelas.nama_kelas}`} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={route('admin.kelas.index')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" /> Daftar Kelas
                        </Link>
                        <span>/</span>
                        <Link href={route('admin.kelas.show', kelas.id)} className="hover:text-foreground transition-colors truncate max-w-[160px]">
                            {kelas.nama_kelas}
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">Edit</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.kelas.show', kelas.id)}>
                            <Eye className="mr-2 h-3.5 w-3.5" /> Lihat Detail
                        </Link>
                    </Button>
                </div>
                <KelasForm
                    data={data} setData={setData} errors={errors}
                    processing={processing} onSubmit={submit}
                    mode="edit" backRoute={route('admin.kelas.show', kelas.id)}
                />
            </div>
        </AuthenticatedLayout>
    );
}