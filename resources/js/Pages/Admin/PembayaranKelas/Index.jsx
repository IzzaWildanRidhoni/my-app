import { useState, useEffect, useCallback } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, DollarSign, CheckCircle2, Clock, XCircle, TrendingUp } from 'lucide-react';

function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);
    useEffect(() => { setVisible(true); const t = setTimeout(() => setVisible(false), 4000); return () => clearTimeout(t); }, [flash]);
    if (!flash?.success || !visible) return null;
    return (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <span>{flash.success}</span>
            <button onClick={() => setVisible(false)}><X className="h-4 w-4" /></button>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, iconClass }) {
    return (
        <Card><CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-2xl font-bold mt-0.5">{value ?? 0}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </CardContent></Card>
    );
}

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);
const formatDateTime = (s) => s ? new Date(s).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const VERIF_MAP = {
    menunggu: { label: 'Menunggu', class: 'bg-yellow-100 text-yellow-700' },
    diterima: { label: 'Diterima', class: 'bg-green-100 text-green-700' },
    ditolak:  { label: 'Ditolak',  class: 'bg-red-100 text-red-700' },
};

export default function PembayaranKelasIndex({ pembayaran, stats, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 400);

    const perPage = Number(filters.per_page || 10);

    const applyFilters = useCallback((overrides = {}) => {
        router.get(route('admin.pembayaran-kelas.index'), {
            search:             overrides.search             !== undefined ? overrides.search             : search,
            status_verifikasi:  overrides.status_verifikasi  !== undefined ? overrides.status_verifikasi  : (filters.status_verifikasi || ''),
            per_page:           overrides.per_page           !== undefined ? overrides.per_page           : perPage,
        }, { preserveState: true, replace: true });
    }, [search, filters, perPage]);

    useEffect(() => { applyFilters({ search: debouncedSearch }); }, [debouncedSearch]);

    return (
        <AuthenticatedLayout header="Pembayaran Kelas">
            <Head title="Pembayaran Kelas" />

            <div className="space-y-5">
                <FlashMessage />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard icon={DollarSign}  label="Total Transaksi" value={stats?.total}    iconClass="bg-slate-100 text-slate-600" />
                    <StatCard icon={Clock}       label="Menunggu"        value={stats?.menunggu}  iconClass="bg-yellow-100 text-yellow-600" />
                    <StatCard icon={CheckCircle2} label="Diterima"       value={stats?.diterima}  iconClass="bg-green-100 text-green-600" />
                    <StatCard icon={TrendingUp}  label="Total Pendapatan" value={formatRupiah(stats?.total_pendapatan)} iconClass="bg-violet-100 text-violet-600" />
                </div>

                <div>
                    <h1 className="text-xl font-semibold">Verifikasi Pembayaran</h1>
                    <p className="text-sm text-muted-foreground">{pembayaran.total} transaksi pembayaran</p>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-wrap gap-3">
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Cari peserta atau kelas..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-9" />
                                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="h-4 w-4" /></button>}
                            </div>
                            <Select value={filters.status_verifikasi || 'all'} onValueChange={v => applyFilters({ status_verifikasi: v === 'all' ? '' : v })}>
                                <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    {Object.entries(VERIF_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-10 pl-6 text-center">#</TableHead>
                                        <TableHead>Peserta</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Metode</TableHead>
                                        <TableHead>Jumlah</TableHead>
                                        <TableHead>Tgl Bayar</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-16 pr-6 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pembayaran.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-44 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <DollarSign className="h-10 w-10 opacity-20" />
                                                    <p className="text-sm">Tidak ada data pembayaran</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : pembayaran.data.map((pb, idx) => {
                                        const vf = VERIF_MAP[pb.status_verifikasi] || VERIF_MAP.menunggu;
                                        return (
                                            <TableRow key={pb.id} className="group">
                                                <TableCell className="pl-6 text-center text-muted-foreground text-sm">{pembayaran.from + idx}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2.5">
                                                        {pb.peserta_foto ? (
                                                            <img src={`/storage/${pb.peserta_foto}`} alt={pb.peserta_nama} className="h-7 w-7 rounded-full object-cover shrink-0" />
                                                        ) : (
                                                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${pb.peserta_jk === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'}`}>
                                                                {pb.peserta_nama?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-sm leading-none">{pb.peserta_nama}</p>
                                                            <p className="text-xs text-muted-foreground">{pb.peserta_email || '—'}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm">{pb.nama_kelas}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{pb.metode_pembayaran || '—'}</TableCell>
                                                <TableCell className="text-sm font-semibold">{formatRupiah(pb.jumlah_bayar)}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDateTime(pb.tanggal_bayar)}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${vf.class}`}>{vf.label}</span>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <Link href={route('admin.pembayaran-kelas.show', pb.id)}><Eye className="h-4 w-4" /></Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {pembayaran.total > 0 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Tampil</span>
                                    <Select value={String(perPage)} onValueChange={v => applyFilters({ per_page: Number(v) })}>
                                        <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
                                        <SelectContent>{[10, 25, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <span>dari <strong>{pembayaran.total}</strong> transaksi</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={pembayaran.current_page === 1} onClick={() => router.get(pembayaran.first_page_url, {}, { preserveState: true })}><ChevronsLeft className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!pembayaran.prev_page_url} onClick={() => router.get(pembayaran.prev_page_url, {}, { preserveState: true })}><ChevronLeft className="h-4 w-4" /></Button>
                                    {pembayaran.links.slice(1, -1).map((link, i) => (
                                        <Button key={i} variant={link.active ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!pembayaran.next_page_url} onClick={() => router.get(pembayaran.next_page_url, {}, { preserveState: true })}><ChevronRight className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={pembayaran.current_page === pembayaran.last_page} onClick={() => router.get(pembayaran.last_page_url, {}, { preserveState: true })}><ChevronsRight className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}