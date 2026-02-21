import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, User, Calendar, Users, CreditCard, CheckCircle2, ArrowLeft, Clock, AlertCircle } from 'lucide-react';

const formatRupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);

const formatDate = (s) =>
    s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

function InfoRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

export default function UserKelasShow({ kelas, pendaftaran, peserta }) {
    const { flash } = usePage().props;
    const { post, processing } = useForm({});

    const terdaftar = !!pendaftaran;
    const penuh     = kelas.kuota !== null && kelas.jumlah_peserta >= kelas.kuota;
    const bisaDaftar = !terdaftar && !penuh && peserta;

    const handleDaftar = () => {
        post(route('user.kelas.daftar', kelas.id));
    };

    const statusColor = {
        pending:  'bg-yellow-50 border-yellow-200 text-yellow-800',
        diterima: 'bg-green-50 border-green-200 text-green-800',
        ditolak:  'bg-red-50 border-red-200 text-red-800',
        batal:    'bg-gray-50 border-gray-200 text-gray-600',
    };

    return (
        <AuthenticatedLayout header="Detail Kelas">
            <Head title={kelas.nama_kelas} />

            <div className="space-y-5 max-w-3xl mx-auto">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {flash.error}
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href={route('user.kelas.index')} className="flex items-center gap-1 hover:text-foreground">
                        <ArrowLeft className="h-3.5 w-3.5" /> Jadwal Kelas
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium truncate">{kelas.nama_kelas}</span>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant={kelas.tipe === 'event' ? 'default' : 'secondary'} className="capitalize">
                                        {kelas.tipe}
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

                    <CardContent className="space-y-5">
                        {kelas.deskripsi && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{kelas.deskripsi}</p>
                        )}

                        <Separator />

                        <div className="grid gap-3 sm:grid-cols-2">
                            <InfoRow icon={User}     label="Pengajar"       value={kelas.pengajar} />
                            <InfoRow icon={MapPin}    label="Lokasi"         value={kelas.lokasi} />
                            <InfoRow icon={Calendar}  label="Tanggal Mulai"  value={formatDate(kelas.tanggal_mulai)} />
                            <InfoRow icon={Calendar}  label="Tanggal Selesai" value={formatDate(kelas.tanggal_selesai)} />
                            {kelas.kuota && (
                                <InfoRow icon={Users} label="Kuota" value={`${kelas.jumlah_peserta} / ${kelas.kuota} peserta`} />
                            )}
                            <InfoRow icon={CreditCard} label="Pembayaran"
                                value={kelas.biaya > 0 ? formatRupiah(kelas.biaya) : 'Gratis'} />
                        </div>

                        <Separator />

                        {/* Status pendaftaran jika sudah daftar */}
                        {terdaftar && (
                            <div className={`rounded-lg border p-4 ${statusColor[pendaftaran.status] || ''}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <p className="font-semibold text-sm">Anda sudah terdaftar</p>
                                </div>
                                <p className="text-xs">
                                    Status: <strong>{pendaftaran.status}</strong> &middot;
                                    Pembayaran: <strong>{pendaftaran.status_pembayaran?.replace(/_/g, ' ')}</strong>
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <Button size="sm" asChild>
                                        <Link href={route('user.pendaftaran.show', pendaftaran.id)}>
                                            Lihat Detail Pendaftaran
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Tombol daftar */}
                        {!terdaftar && (
                            <div>
                                {!peserta && (
                                    <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-3">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span>Data peserta Anda belum tersedia. Lengkapi profil terlebih dahulu.</span>
                                    </div>
                                )}
                                <Button
                                    className="w-full"
                                    disabled={!bisaDaftar || processing || penuh}
                                    onClick={handleDaftar}
                                >
                                    {processing ? 'Memproses...' : penuh ? 'Kelas Sudah Penuh' : 'Daftar Sekarang'}
                                </Button>
                                {kelas.biaya > 0 && kelas.perlu_pembayaran && !penuh && (
                                    <p className="text-xs text-muted-foreground text-center mt-2">
                                        <Clock className="inline h-3 w-3 mr-1" />
                                        Setelah mendaftar, upload bukti pembayaran untuk dikonfirmasi admin.
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}