import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, CreditCard, GripVertical, CheckCircle2, XCircle } from 'lucide-react';

export default function RekeningAktifIndex({ rekening }) {
    const { flash } = usePage().props;

    const handleDelete = (id, namaBank, nomorRekening) => {
        if (!confirm(`Hapus rekening ${namaBank} - ${nomorRekening}?`)) return;
        router.delete(route('admin.rekening.destroy', id));
    };

    return (
        <AuthenticatedLayout header="Rekening Aktif">
            <Head title="Rekening Aktif" />

            <div className="space-y-5">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Rekening Aktif</h1>
                        <p className="text-sm text-muted-foreground">
                            Rekening tujuan transfer pembayaran kelas ({rekening.length} rekening)
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.rekening.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Rekening
                        </Link>
                    </Button>
                </div>

                {rekening.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <CreditCard className="h-12 w-12 opacity-20 mb-3" />
                            <p className="text-sm font-medium">Belum ada rekening</p>
                            <p className="text-xs mt-1">Tambahkan rekening tujuan transfer untuk peserta.</p>
                            <Button className="mt-4" asChild>
                                <Link href={route('admin.rekening.create')}>Tambah Rekening</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {rekening.map((r) => (
                            <Card key={r.id} className={!r.is_aktif ? 'opacity-60' : ''}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Logo / Ikon */}
                                        <div className="shrink-0">
                                            {r.logo ? (
                                                <img
                                                    src={`/storage/${r.logo}`}
                                                    alt={r.nama_bank}
                                                    className="h-12 w-12 rounded-lg object-contain border bg-white p-1"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <CreditCard className="h-6 w-6 text-primary" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-sm">{r.nama_bank}</span>
                                                <Badge
                                                    variant={r.is_aktif ? 'default' : 'secondary'}
                                                    className="text-xs"
                                                >
                                                    {r.is_aktif ? (
                                                        <><CheckCircle2 className="mr-1 h-3 w-3" />Aktif</>
                                                    ) : (
                                                        <><XCircle className="mr-1 h-3 w-3" />Nonaktif</>
                                                    )}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">Urutan: {r.urutan}</span>
                                            </div>
                                            <p className="text-base font-mono font-medium mt-0.5">{r.nomor_rekening}</p>
                                            <p className="text-xs text-muted-foreground">a.n. {r.nama_pemilik}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.rekening.edit', r.id)}>
                                                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(r.id, r.nama_bank, r.nomor_rekening)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    💡 Rekening yang <strong>aktif</strong> akan ditampilkan ke peserta saat upload bukti pembayaran.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}