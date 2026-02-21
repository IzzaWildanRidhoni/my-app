import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, BookOpen } from 'lucide-react';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);

export default function PendaftaranKelasCreate({ kelasList, pesertaList }) {
    const { data, setData, post, processing, errors } = useForm({
        peserta_id:    '',
        kelas_id:      '',
        tanggal_daftar: new Date().toISOString().split('T')[0],
        status:        'pending',
        catatan:       '',
    });

    const selectedKelas = kelasList.find(k => String(k.id) === String(data.kelas_id));

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.pendaftaran-kelas.store'));
    };

    return (
        <AuthenticatedLayout header="Daftarkan Peserta">
            <Head title="Daftarkan Peserta" />

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href={route('admin.pendaftaran-kelas.index')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" /> Kembali
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Daftarkan Peserta</span>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-5 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-5">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <User className="h-4 w-4" /> Pilih Peserta & Kelas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Peserta <span className="text-destructive">*</span></Label>
                                        <Select value={data.peserta_id} onValueChange={v => setData('peserta_id', v)}>
                                            <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih peserta..." /></SelectTrigger>
                                            <SelectContent>
                                                {pesertaList.map(p => (
                                                    <SelectItem key={p.id} value={String(p.id)}>
                                                        {p.nama} {p.email ? `— ${p.email}` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.peserta_id} />
                                    </div>

                                    <div>
                                        <Label>Kelas <span className="text-destructive">*</span></Label>
                                        <Select value={data.kelas_id} onValueChange={v => setData('kelas_id', v)}>
                                            <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih kelas..." /></SelectTrigger>
                                            <SelectContent>
                                                {kelasList.map(k => (
                                                    <SelectItem key={k.id} value={String(k.id)}>
                                                        {k.nama_kelas} {k.biaya > 0 ? `— ${formatRupiah(k.biaya)}` : '— Gratis'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.kelas_id} />
                                    </div>

                                    {selectedKelas && (
                                        <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                                            <p className="font-medium">{selectedKelas.nama_kelas}</p>
                                            <p className="text-muted-foreground">Biaya: {selectedKelas.biaya > 0 ? formatRupiah(selectedKelas.biaya) : 'Gratis'}</p>
                                            <p className="text-muted-foreground">Tipe: <span className="capitalize">{selectedKelas.tipe}</span></p>
                                        </div>
                                    )}

                                    <div>
                                        <Label>Tanggal Daftar <span className="text-destructive">*</span></Label>
                                        <Input type="date" value={data.tanggal_daftar} onChange={e => setData('tanggal_daftar', e.target.value)} className="mt-1" />
                                        <FieldError message={errors.tanggal_daftar} />
                                    </div>

                                    <div>
                                        <Label>Catatan</Label>
                                        <Textarea value={data.catatan} onChange={e => setData('catatan', e.target.value)} placeholder="Catatan opsional..." rows={3} className="mt-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-5">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Status Awal</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <Label>Status Pendaftaran</Label>
                                        <Select value={data.status} onValueChange={v => setData('status', v)}>
                                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="diterima">Diterima</SelectItem>
                                                <SelectItem value="ditolak">Ditolak</SelectItem>
                                                <SelectItem value="batal">Batal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.status} />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-2">
                                <Button type="submit" disabled={processing} className="w-full">
                                    {processing ? 'Mendaftarkan...' : 'Daftarkan Peserta'}
                                </Button>
                                <Button variant="outline" asChild className="w-full">
                                    <Link href={route('admin.pendaftaran-kelas.index')}>Batal</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}