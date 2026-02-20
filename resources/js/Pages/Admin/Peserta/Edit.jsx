import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PesertaForm from '@/Components/PesertaForm';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PesertaEdit({ peserta }) {
    const { data, setData, post, processing, errors } = useForm({
        _method:              'PATCH', // method spoofing untuk file upload
        nik:                  peserta.nik,
        nama:                 peserta.nama,
        tempat_lahir:         peserta.tempat_lahir,
        tanggal_lahir:        peserta.tanggal_lahir?.split('T')[0] || peserta.tanggal_lahir || '',
        jenis_kelamin:        peserta.jenis_kelamin,
        alamat:               peserta.alamat,
        no_telepon:           peserta.no_telepon || '',
        email:                peserta.email || '',
        pendidikan_terakhir:  peserta.pendidikan_terakhir || 'SMA',
        pekerjaan:            peserta.pekerjaan || '',
        nama_kegiatan:        peserta.nama_kegiatan,
        tanggal_daftar:       peserta.tanggal_daftar?.split('T')[0] || peserta.tanggal_daftar || '',
        status:               peserta.status,
        foto:                 null, // null = tidak mengganti foto
        catatan:              peserta.catatan || '',
    });

    // Gunakan POST dengan _method PATCH karena multipart tidak support PATCH langsung
    const submit = (e) => {
        e.preventDefault();
        post(route('admin.peserta.update', peserta.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header="Edit Peserta">
            <Head title={`Edit - ${peserta.nama}`} />

            <div className="space-y-4">
                {/* Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href={route('admin.peserta.index')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Daftar Peserta
                        </Link>
                        <span>/</span>
                        <Link href={route('admin.peserta.show', peserta.id)} className="hover:text-foreground transition-colors truncate max-w-[160px]">
                            {peserta.nama}
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">Edit</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.peserta.show', peserta.id)}>
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            Lihat Detail
                        </Link>
                    </Button>
                </div>

                <PesertaForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={submit}
                    mode="edit"
                    fotoPreview={peserta.foto}
                    backRoute={route('admin.peserta.show', peserta.id)}
                />
            </div>
        </AuthenticatedLayout>
    );
}