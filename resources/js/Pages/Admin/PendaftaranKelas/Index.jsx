import { useState, useEffect, useCallback } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Eye, Trash2, Search, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

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

const STATUS_MAP = {
    pending:   { label: 'Pending',  variant: 'secondary', class: '' },
    diterima:  { label: 'Diterima', variant: 'outline', class: 'border-green-300 text-green-700 bg-green-50' },
    ditolak:   { label: 'Ditolak',  variant: 'outline', class: 'border-red-300 text-red-700 bg-red-50' },
    batal:     { label: 'Batal',    variant: 'secondary', class: 'text-muted-foreground' },
};

const BAYAR_MAP = {
    belum_bayar:           { label: 'Belum Bayar',       class: 'bg-gray-100 text-gray-600' },
    menunggu_verifikasi:   { label: 'Menunggu Verifikasi', class: 'bg-yellow-100 text-yellow-700' },
    lunas:                 { label: 'Lunas',             class: 'bg-green-100 text-green-700' },
    ditolak:               { label: 'Ditolak',           class: 'bg-red-100 text-red-700' },
};

export default function PendaftaranKelasIndex({ pendaftaran, stats, kelasList, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const deleteForm = useForm({});
    const debouncedSearch = useDebounce(search, 400);

    const perPage = Number(filters.per_page || 10);

    const applyFilters = useCallback((overrides = {}) => {
        router.get(route('admin.pendaftaran-kelas.index'), {
            search:             overrides.search             !== undefined ? overrides.search             : search,
            status:             overrides.status             !== undefined ? overrides.status             : (filters.status || ''),
            status_pembayaran:  overrides.status_pembayaran  !== undefined ? overrides.status_pembayaran  : (filters.status_pembayaran || ''),
            kelas_id:           overrides.kelas_id           !== undefined ? overrides.kelas_id           : (filters.kelas_id || ''),
            per_page:           overrides.per_page           !== undefined ? overrides.per_page           : perPage,
        }, { preserveState: true, replace: true });
    }, [search, filters, perPage]);

    useEffect(() => { applyFilters({ search: debouncedSearch }); }, [debouncedSearch]);

    const handleClear = () => { setSearch(''); router.get(route('admin.pendaftaran-kelas.index')); };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteForm.delete(route('admin.pendaftaran-kelas.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const formatDate = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <AuthenticatedLayout header="Pendaftaran Kelas">
            <Head title="Pendaftaran Kelas" />

            <div className="space-y-5">
                <FlashMessage />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard icon={Users}        label="Total"              value={stats?.total}               iconClass="bg-slate-100 text-slate-600" />
                    <StatCard icon={CheckCircle2} label="Diterima"           value={stats?.diterima}            iconClass="bg-green-100 text-green-600" />
                    <StatCard icon={Clock}        label="Pending"            value={stats?.pending}             iconClass="bg-yellow-100 text-yellow-600" />
                    <StatCard icon={AlertCircle}  label="Menunggu Verifikasi" value={stats?.menunggu_verifikasi} iconClass="bg-orange-100 text-orange-600" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Daftar Pendaftaran</h1>
                        <p className="text-sm text-muted-foreground">{pendaftaran.total} pendaftaran</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.pendaftaran-kelas.create')}><Plus className="mr-2 h-4 w-4" /> Daftarkan Peserta</Link>
                    </Button>
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
                            <Select value={filters.kelas_id || 'all'} onValueChange={v => applyFilters({ kelas_id: v === 'all' ? '' : v })}>
                                <SelectTrigger className="h-9 w-48"><SelectValue placeholder="Filter Kelas" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    {kelasList.map(k => <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={filters.status || 'all'} onValueChange={v => applyFilters({ status: v === 'all' ? '' : v })}>
                                <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    {Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={filters.status_pembayaran || 'all'} onValueChange={v => applyFilters({ status_pembayaran: v === 'all' ? '' : v })}>
                                <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Status Bayar" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Pembayaran</SelectItem>
                                    {Object.entries(BAYAR_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
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
                                        <TableHead>Tgl Daftar</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Pembayaran</TableHead>
                                        <TableHead className="w-16 pr-6 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendaftaran.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-44 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Users className="h-10 w-10 opacity-20" />
                                                    <p className="text-sm">Tidak ada pendaftaran ditemukan</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : pendaftaran.data.map((p, idx) => {
                                        const st = STATUS_MAP[p.status] || STATUS_MAP.pending;
                                        const bt = BAYAR_MAP[p.status_pembayaran] || BAYAR_MAP.belum_bayar;
                                        return (
                                            <TableRow key={p.id} className="group">
                                                <TableCell className="pl-6 text-center text-muted-foreground text-sm">{pendaftaran.from + idx}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2.5">
                                                        {p.peserta_foto ? (
                                                            <img src={`/storage/${p.peserta_foto}`} alt={p.peserta_nama} className="h-7 w-7 rounded-full object-cover shrink-0" />
                                                        ) : (
                                                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${p.peserta_jk === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'}`}>
                                                                {p.peserta_nama?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-sm leading-none">{p.peserta_nama}</p>
                                                            <p className="text-xs text-muted-foreground">{p.peserta_email || p.peserta_telepon || '—'}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm">{p.nama_kelas}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(p.tanggal_daftar)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={st.variant} className={st.class}>{st.label}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${bt.class}`}>{bt.label}</span>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('admin.pendaftaran-kelas.show', p.id)}><Eye className="mr-2 h-4 w-4" />Lihat Detail</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(p)}>
                                                                <Trash2 className="mr-2 h-4 w-4" />Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {pendaftaran.total > 0 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Tampil</span>
                                    <Select value={String(perPage)} onValueChange={v => applyFilters({ per_page: Number(v) })}>
                                        <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
                                        <SelectContent>{[10, 25, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <span>dari <strong>{pendaftaran.total}</strong> pendaftaran{pendaftaran.from && ` (${pendaftaran.from}–${pendaftaran.to})`}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={pendaftaran.current_page === 1} onClick={() => router.get(pendaftaran.first_page_url, {}, { preserveState: true })}><ChevronsLeft className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!pendaftaran.prev_page_url} onClick={() => router.get(pendaftaran.prev_page_url, {}, { preserveState: true })}><ChevronLeft className="h-4 w-4" /></Button>
                                    {pendaftaran.links.slice(1, -1).map((link, i) => (
                                        <Button key={i} variant={link.active ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!pendaftaran.next_page_url} onClick={() => router.get(pendaftaran.next_page_url, {}, { preserveState: true })}><ChevronRight className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={pendaftaran.current_page === pendaftaran.last_page} onClick={() => router.get(pendaftaran.last_page_url, {}, { preserveState: true })}><ChevronsRight className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pendaftaran</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus pendaftaran <strong className="text-foreground">{deleteTarget?.peserta_nama}</strong> dari kelas <strong className="text-foreground">{deleteTarget?.nama_kelas}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteForm.processing}>
                            {deleteForm.processing ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}