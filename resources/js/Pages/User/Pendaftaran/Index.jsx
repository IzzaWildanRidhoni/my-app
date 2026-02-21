import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, CreditCard, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const formatRupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);

const formatDate = (s) =>
    s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const statusConfig = {
    pending:  { label: 'Menunggu',  variant: 'secondary', icon: Clock,         color: 'text-yellow-600' },
    diterima: { label: 'Diterima',  variant: 'outline',   icon: CheckCircle2,  color: 'text-green-600' },
    ditolak:  { label: 'Ditolak',   variant: 'destructive', icon: XCircle,     color: 'text-red-600' },
    batal:    { label: 'Dibatalkan', variant: 'secondary', icon: XCircle,      color: 'text-gray-500' },
};

const bayarConfig = {
    belum_bayar:          { label: 'Belum Bayar',           color: 'text-red-500' },
    menunggu_verifikasi:  { label: 'Menunggu Verifikasi',   color: 'text-yellow-600' },
    lunas:                { label: 'Lunas',                  color: 'text-green-600' },
    ditolak:              { label: 'Pembayaran Ditolak',     color: 'text-red-600' },
};

export default function UserPendaftaranIndex({ pendaftaranList }) {
    const { flash } = usePage().props;

    const needsBayar = (p) =>
        p.perlu_pembayaran && p.kelas_biaya > 0 &&
        ['belum_bayar', 'ditolak'].includes(p.status_pembayaran) &&
        p.status !== 'batal';

    return (
        <AuthenticatedLayout header="Pendaftaran Saya">
            <Head title="Pendaftaran Saya" />

            <div className="space-y-5 max-w-3xl mx-auto">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Pendaftaran Saya</h1>
                        <p className="text-sm text-muted-foreground">{pendaftaranList.length} kelas terdaftar</p>
                    </div>
                    <Button asChild>
                        <Link href={route('user.kelas.index')}>
                            <BookOpen className="mr-2 h-4 w-4" /> Cari Kelas
                        </Link>
                    </Button>
                </div>

                {pendaftaranList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <BookOpen className="h-12 w-12 opacity-20 mb-3" />
                        <p className="text-sm font-medium">Belum ada pendaftaran</p>
                        <p className="text-xs mt-1">Temukan kelas yang cocok dan segera daftar!</p>
                        <Button className="mt-4" asChild>
                            <Link href={route('user.kelas.index')}>Lihat Jadwal Kelas</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendaftaranList.map((p) => {
                            const sc = statusConfig[p.status] || statusConfig.pending;
                            const bc = bayarConfig[p.status_pembayaran] || {};
                            const Icon = sc.icon;
                            const perluBayar = needsBayar(p);

                            return (
                                <Card key={p.id} className={`transition-shadow hover:shadow-md ${perluBayar ? 'border-orange-300' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <Badge variant={p.kelas_tipe === 'event' ? 'default' : 'secondary'} className="capitalize text-xs">
                                                        {p.kelas_tipe}
                                                    </Badge>
                                                    <Badge variant={sc.variant} className="text-xs capitalize">
                                                        <Icon className="mr-1 h-3 w-3" />{sc.label}
                                                    </Badge>
                                                </div>
                                                <h3 className="font-semibold text-sm">{p.nama_kelas}</h3>
                                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
                                                    {p.pengajar && <span>{p.pengajar}</span>}
                                                    {p.kelas_lokasi && <span>{p.kelas_lokasi}</span>}
                                                    {p.tanggal_mulai && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />{formatDate(p.tanggal_mulai)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-semibold">
                                                    {p.kelas_biaya > 0 ? formatRupiah(p.kelas_biaya) : (
                                                        <span className="text-green-600 text-xs">Gratis</span>
                                                    )}
                                                </p>
                                                {p.kelas_biaya > 0 && (
                                                    <p className={`text-xs mt-0.5 ${bc.color}`}>{bc.label}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Alert perlu bayar */}
                                        {perluBayar && (
                                            <div className="mt-3 flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700">
                                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                Upload bukti pembayaran untuk mengkonfirmasi pendaftaran Anda.
                                            </div>
                                        )}

                                        <div className="mt-3 flex justify-end">
                                            <Button variant="ghost" size="sm" className="gap-1 text-xs h-8" asChild>
                                                <Link href={route('user.pendaftaran.show', p.id)}>
                                                    Lihat Detail <ChevronRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}