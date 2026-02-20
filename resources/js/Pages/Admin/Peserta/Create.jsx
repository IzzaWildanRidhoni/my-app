import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PesertaForm from '@/Components/PesertaForm';
import { ArrowLeft } from 'lucide-react';

export default function PesertaCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nik:                  '',
        nama:                 '',
        tempat_lahir:         '',
        tanggal_lahir:        '',
        jenis_kelamin:        '',
        alamat:               '',
        no_telepon:           '',
        email:                '',
        pendidikan_terakhir:  'SMA',
        pekerjaan:            '',
        nama_kegiatan:        '',
        tanggal_daftar:       new Date().toISOString().split('T')[0],
        status:               'aktif',
        foto:                 null,
        catatan:              '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.peserta.store'), {
            forceFormData: true, // penting untuk upload file
        });
    };

    return (
        <AuthenticatedLayout header="Tambah Peserta">
            <Head title="Tambah Peserta" />

            <div className="space-y-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href={route('admin.peserta.index')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Kembali ke Daftar Peserta
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Tambah Peserta</span>
                </div>

                <PesertaForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    mode="create"
                    backRoute={route('admin.peserta.index')}
                />
            </div>
        </AuthenticatedLayout>
    );
}