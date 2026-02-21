import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KelasForm from '@/Components/KelasForm';
import { ArrowLeft } from 'lucide-react';

export default function KelasCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama_kelas:       '',
        deskripsi:        '',
        lokasi:           '',
        pengajar:         '',
        tipe:             'event',
        tanggal_mulai:    '',
        tanggal_selesai:  '',
        kuota:            '',
        biaya:            0,
        perlu_pembayaran: true,
        status:           'aktif',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.kelas.store'));
    };

    return (
        <AuthenticatedLayout header="Tambah Kelas">
            <Head title="Tambah Kelas" />
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href={route('admin.kelas.index')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Daftar Kelas
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Tambah Kelas</span>
                </div>
                <KelasForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    mode="create"
                    backRoute={route('admin.kelas.index')}
                />
            </div>
        </AuthenticatedLayout>
    );
}