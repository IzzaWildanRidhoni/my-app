import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, MapPin, User, Calendar, Search, X, CheckCircle2, Clock } from 'lucide-react';

const formatRupiah = (n) =>
    n > 0
        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
        : null;

const formatDate = (s) =>
    s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

function KelasCard({ kelas, sudahDaftar }) {
    const terdaftar = sudahDaftar.includes(kelas.id);
    const penuh     = kelas.kuota !== null && kelas.jumlah_peserta >= kelas.kuota;

    return (
        <Card className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-snug line-clamp-2">{kelas.nama_kelas}</h3>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                        <Badge variant={kelas.tipe === 'event' ? 'default' : 'secondary'} className="capitalize text-xs">
                            {kelas.tipe}
                        </Badge>
                        {penuh && <Badge variant="destructive" className="text-xs">Penuh</Badge>}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
                {kelas.deskripsi && (
                    <p className="line-clamp-3 text-foreground/70 text-xs leading-relaxed">{kelas.deskripsi}</p>
                )}
                <div className="space-y-1.5 pt-1">
                    {kelas.pengajar && (
                        <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{kelas.pengajar}</span>
                        </div>
                    )}
                    {kelas.lokasi && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{kelas.lokasi}</span>
                        </div>
                    )}
                    {kelas.tanggal_mulai && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>{formatDate(kelas.tanggal_mulai)}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-semibold text-base text-foreground">
                        {kelas.biaya > 0 ? formatRupiah(kelas.biaya) : (
                            <span className="text-green-600">Gratis</span>
                        )}
                    </span>
                    {kelas.kuota && (
                        <span className={`text-xs ${penuh ? 'text-red-500 font-semibold' : ''}`}>
                            {kelas.jumlah_peserta}/{kelas.kuota} peserta
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0 gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={route('user.kelas.show', kelas.id)}>Detail</Link>
                </Button>
                {terdaftar ? (
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" disabled>
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Terdaftar
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        className="flex-1"
                        disabled={penuh}
                        asChild={!penuh}
                    >
                        {penuh ? (
                            <span>Penuh</span>
                        ) : (
                            <Link href={route('user.kelas.show', kelas.id)}>Daftar</Link>
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export default function UserKelasIndex({ kelas, filters, sudahDaftar }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (overrides = {}) => {
        router.get(route('user.kelas.index'), {
            search: overrides.search !== undefined ? overrides.search : search,
            tipe:   overrides.tipe   !== undefined ? overrides.tipe   : (filters.tipe || ''),
        }, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    return (
        <AuthenticatedLayout header="Jadwal Kelas">
            <Head title="Jadwal Kelas" />

            <div className="space-y-5">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <div>
                    <h1 className="text-xl font-semibold">Jadwal Kelas</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Temukan dan daftar kelas yang sesuai dengan kebutuhanmu.
                    </p>
                </div>

                {/* Filter */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama kelas, pengajar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            className="pl-9"
                        />
                    </div>
                    <Select value={filters.tipe || 'all'} onValueChange={(v) => applyFilters({ tipe: v === 'all' ? '' : v })}>
                        <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Semua Tipe" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="rutin">Rutin</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => applyFilters()} className="h-9">
                        <Search className="h-4 w-4 mr-1.5" /> Cari
                    </Button>
                    {(search || filters.tipe) && (
                        <Button variant="ghost" size="sm" className="h-9" onClick={() => {
                            setSearch('');
                            router.get(route('user.kelas.index'));
                        }}>
                            <X className="h-4 w-4 mr-1.5" /> Reset
                        </Button>
                    )}
                </div>

                {/* Grid */}
                {kelas.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <BookOpen className="h-12 w-12 opacity-20 mb-3" />
                        <p className="text-sm">Tidak ada kelas yang ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {kelas.data.map((k) => (
                            <KelasCard key={k.id} kelas={k} sudahDaftar={sudahDaftar} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {kelas.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {kelas.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Shortcut ke pendaftaran */}
                <div className="rounded-lg border bg-muted/30 p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Lihat Pendaftaran Saya</p>
                        <p className="text-xs text-muted-foreground">Cek status dan upload bukti pembayaran.</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('user.pendaftaran.index')}>
                            <Clock className="mr-1.5 h-4 w-4" /> Riwayat
                        </Link>
                    </Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}