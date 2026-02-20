import { useState, useEffect, useCallback } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Plus, MoreHorizontal, Pencil, Trash2, Eye, Search, X,
    ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, Users, UserCheck, UserX, GraduationCap, LogOut,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

function SortIcon({ field, sortField, sortDirection }) {
    if (sortField !== field) return <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50" />;
    return sortDirection === 'asc'
        ? <ChevronUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
        : <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-primary" />;
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

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    aktif:               { label: 'Aktif',               variant: 'default',     className: 'bg-green-100 text-green-800 border-green-200' },
    nonaktif:            { label: 'Non Aktif',            variant: 'secondary',   className: 'bg-gray-100 text-gray-700 border-gray-200' },
    lulus:               { label: 'Lulus',                variant: 'outline',     className: 'bg-blue-100 text-blue-800 border-blue-200' },
    mengundurkan_diri:   { label: 'Mengundurkan Diri',    variant: 'destructive', className: 'bg-red-100 text-red-800 border-red-200' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || { label: status, className: '' };
    return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.className}`}>{cfg.label}</span>;
}

function JKBadge({ jk }) {
    return (
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold ${jk === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'}`}>
            {jk === 'L' ? 'L' : 'P'}
        </span>
    );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, iconClass }) {
    return (
        <Card>
            <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                        <p className="text-2xl font-bold mt-0.5">{value ?? 0}</p>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function PesertaIndex({ peserta, stats, kegiatans, filters }) {
    const [search,       setSearch]       = useState(filters.search    || '');
    const [statusFilter, setStatusFilter] = useState(filters.status    || '');
    const [kegiatanFilter, setKegiatanFilter] = useState(filters.kegiatan || '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const deleteForm = useForm({});
    const debouncedSearch = useDebounce(search, 400);

    const sortField     = filters.sort      || 'created_at';
    const sortDirection = filters.direction || 'desc';
    const perPage       = Number(filters.per_page || 10);

    const applyFilters = useCallback((overrides = {}) => {
        router.get(route('admin.peserta.index'), {
            search:    overrides.search    !== undefined ? overrides.search    : search,
            status:    overrides.status    !== undefined ? overrides.status    : statusFilter,
            kegiatan:  overrides.kegiatan  !== undefined ? overrides.kegiatan  : kegiatanFilter,
            sort:      overrides.sort      !== undefined ? overrides.sort      : sortField,
            direction: overrides.direction !== undefined ? overrides.direction : sortDirection,
            per_page:  overrides.per_page  !== undefined ? overrides.per_page  : perPage,
        }, { preserveState: true, replace: true });
    }, [search, statusFilter, kegiatanFilter, sortField, sortDirection, perPage]);

    useEffect(() => { applyFilters({ search: debouncedSearch }); }, [debouncedSearch]);

    const handleStatus   = (val) => { const v = val === 'all' ? '' : val; setStatusFilter(v);   applyFilters({ status: v }); };
    const handleKegiatan = (val) => { const v = val === 'all' ? '' : val; setKegiatanFilter(v); applyFilters({ kegiatan: v }); };
    const handleSort     = (field) => { const d = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'; applyFilters({ sort: field, direction: d }); };
    const handlePerPage  = (val) => applyFilters({ per_page: Number(val) });
    const handleClear    = () => { setSearch(''); setStatusFilter(''); setKegiatanFilter(''); router.get(route('admin.peserta.index')); };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteForm.delete(route('admin.peserta.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const hasFilters = search || statusFilter || kegiatanFilter;

    const SortableHead = ({ field, children }) => (
        <TableHead className="cursor-pointer select-none whitespace-nowrap hover:bg-muted/50 transition-colors" onClick={() => handleSort(field)}>
            <div className="flex items-center">{children}<SortIcon field={field} sortField={sortField} sortDirection={sortDirection} /></div>
        </TableHead>
    );

    return (
        <AuthenticatedLayout header="Peserta Management">
            <Head title="Peserta Management" />

            <div className="space-y-5">
                <FlashMessage />

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <StatCard icon={Users}      label="Total"              value={stats?.total}              iconClass="bg-slate-100 text-slate-600" />
                    <StatCard icon={UserCheck}  label="Aktif"              value={stats?.aktif}              iconClass="bg-green-100 text-green-600" />
                    <StatCard icon={UserX}      label="Non Aktif"          value={stats?.nonaktif}           iconClass="bg-gray-100 text-gray-500" />
                    <StatCard icon={GraduationCap} label="Lulus"           value={stats?.lulus}              iconClass="bg-blue-100 text-blue-600" />
                    <StatCard icon={LogOut}     label="Undur Diri"         value={stats?.mengundurkan_diri}  iconClass="bg-red-100 text-red-500" />
                    <StatCard icon={Users}      label="Laki / Perempuan"   value={`${stats?.laki_laki ?? 0} / ${stats?.perempuan ?? 0}`} iconClass="bg-violet-100 text-violet-600" />
                </div>

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Daftar Peserta</h1>
                        <p className="text-sm text-muted-foreground">{peserta.total} peserta terdaftar</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.peserta.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Peserta
                        </Link>
                    </Button>
                </div>

                {/* ── Table Card ── */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* Search */}
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Cari nama, NIK, email, telepon..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-9" />
                                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {/* Status filter */}
                                <Select value={statusFilter || 'all'} onValueChange={handleStatus}>
                                    <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Semua status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                                            <SelectItem key={val} value={val}>{cfg.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Kegiatan filter */}
                                <Select value={kegiatanFilter || 'all'} onValueChange={handleKegiatan}>
                                    <SelectTrigger className="w-44 h-9"><SelectValue placeholder="Semua kegiatan" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kegiatan</SelectItem>
                                        {kegiatans.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                                    </SelectContent>
                                </Select>

                                {hasFilters && (
                                    <Button variant="ghost" size="sm" onClick={handleClear} className="gap-1.5 h-9">
                                        <X className="h-3.5 w-3.5" /> Reset
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-10 pl-6 text-center">#</TableHead>
                                        <TableHead className="w-8">JK</TableHead>
                                        <SortableHead field="nama">Nama</SortableHead>
                                        <SortableHead field="nik">NIK</SortableHead>
                                        <TableHead>Kegiatan</TableHead>
                                        <SortableHead field="tanggal_daftar">Tgl Daftar</SortableHead>
                                        <SortableHead field="status">Status</SortableHead>
                                        <TableHead className="w-16 pr-6 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {peserta.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-44 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Users className="h-10 w-10 opacity-20" />
                                                    <p className="text-sm">Tidak ada peserta ditemukan</p>
                                                    {hasFilters && <Button variant="link" size="sm" onClick={handleClear}>Reset filter</Button>}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : peserta.data.map((p, idx) => (
                                        <TableRow key={p.id} className="group">
                                            <TableCell className="pl-6 text-center text-muted-foreground text-sm">{peserta.from + idx}</TableCell>
                                            <TableCell><JKBadge jk={p.jenis_kelamin} /></TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2.5">
                                                    {p.foto ? (
                                                        <img src={`/storage/${p.foto}`} alt={p.nama} className="h-7 w-7 rounded-full object-cover shrink-0" />
                                                    ) : (
                                                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${p.jenis_kelamin === 'L' ? 'bg-sky-100 text-sky-700' : 'bg-pink-100 text-pink-700'}`}>
                                                            {p.nama.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium leading-none">{p.nama}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{p.email || p.no_telepon || '—'}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">{p.nik}</TableCell>
                                            <TableCell className="max-w-[160px]">
                                                <p className="truncate text-sm">{p.nama_kegiatan}</p>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                {new Date(p.tanggal_daftar).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </TableCell>
                                            <TableCell><StatusBadge status={p.status} /></TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.peserta.show', p.id)}><Eye className="mr-2 h-4 w-4" />Lihat Detail</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.peserta.edit', p.id)}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(p)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* ── Footer ── */}
                        {peserta.total > 0 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Tampil</span>
                                    <Select value={String(perPage)} onValueChange={handlePerPage}>
                                        <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
                                        <SelectContent>{[10,25,50,100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <span>dari <strong>{peserta.total}</strong> peserta{peserta.from && ` (${peserta.from}–${peserta.to})`}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={peserta.current_page === 1} onClick={() => router.get(peserta.first_page_url, {}, { preserveState: true })}><ChevronsLeft className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!peserta.prev_page_url} onClick={() => router.get(peserta.prev_page_url, {}, { preserveState: true })}><ChevronLeft className="h-4 w-4" /></Button>
                                    {peserta.links.slice(1, -1).map((link, i) => (
                                        <Button key={i} variant={link.active ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!peserta.next_page_url} onClick={() => router.get(peserta.next_page_url, {}, { preserveState: true })}><ChevronRight className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={peserta.current_page === peserta.last_page} onClick={() => router.get(peserta.last_page_url, {}, { preserveState: true })}><ChevronsRight className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Delete Confirm ── */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Peserta</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus peserta <strong className="text-foreground">{deleteTarget?.nama}</strong>? Data yang dihapus tidak dapat dikembalikan.
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