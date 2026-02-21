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
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, Search, X, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, BookOpen, Users, CalendarDays, TrendingUp } from 'lucide-react';

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

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);
const formatDate   = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function KelasIndex({ kelas, stats, filters }) {
    const [search, setSearch]   = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const deleteForm = useForm({});
    const debouncedSearch = useDebounce(search, 400);

    const sortField     = filters.sort      || 'created_at';
    const sortDirection = filters.direction || 'desc';
    const perPage       = Number(filters.per_page || 10);

    const applyFilters = useCallback((overrides = {}) => {
        router.get(route('admin.kelas.index'), {
            search:    overrides.search    !== undefined ? overrides.search    : search,
            sort:      overrides.sort      !== undefined ? overrides.sort      : sortField,
            direction: overrides.direction !== undefined ? overrides.direction : sortDirection,
            per_page:  overrides.per_page  !== undefined ? overrides.per_page  : perPage,
            status:    overrides.status    !== undefined ? overrides.status    : (filters.status || ''),
            tipe:      overrides.tipe      !== undefined ? overrides.tipe      : (filters.tipe || ''),
        }, { preserveState: true, replace: true });
    }, [search, sortField, sortDirection, perPage, filters.status, filters.tipe]);

    useEffect(() => { applyFilters({ search: debouncedSearch }); }, [debouncedSearch]);

    const handleSort    = (field) => { const d = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'; applyFilters({ sort: field, direction: d }); };
    const handlePerPage = (val) => applyFilters({ per_page: Number(val) });
    const handleClear   = () => { setSearch(''); router.get(route('admin.kelas.index')); };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteForm.delete(route('admin.kelas.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const SortableHead = ({ field, children }) => (
        <TableHead className="cursor-pointer select-none whitespace-nowrap hover:bg-muted/50 transition-colors" onClick={() => handleSort(field)}>
            <div className="flex items-center">{children}<SortIcon field={field} sortField={sortField} sortDirection={sortDirection} /></div>
        </TableHead>
    );

    return (
        <AuthenticatedLayout header="Manajemen Kelas">
            <Head title="Manajemen Kelas" />

            <div className="space-y-5">
                <FlashMessage />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard icon={BookOpen}    label="Total Kelas"   value={stats?.total}  iconClass="bg-slate-100 text-slate-600" />
                    <StatCard icon={TrendingUp}  label="Aktif"         value={stats?.aktif}  iconClass="bg-green-100 text-green-600" />
                    <StatCard icon={CalendarDays} label="Event"        value={stats?.event}  iconClass="bg-blue-100 text-blue-600" />
                    <StatCard icon={Users}        label="Rutin"         value={stats?.rutin}  iconClass="bg-violet-100 text-violet-600" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Daftar Kelas</h1>
                        <p className="text-sm text-muted-foreground">{kelas.total} kelas terdaftar</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.kelas.create')}>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Kelas
                        </Link>
                    </Button>
                </div>

                {/* Table Card */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Cari nama, pengajar, lokasi..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-9" />
                                {search && (
                                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <Select value={filters.status || 'all'} onValueChange={(v) => applyFilters({ status: v === 'all' ? '' : v })}>
                                <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filters.tipe || 'all'} onValueChange={(v) => applyFilters({ tipe: v === 'all' ? '' : v })}>
                                <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Tipe" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                    <SelectItem value="rutin">Rutin</SelectItem>
                                </SelectContent>
                            </Select>
                            {(search || filters.status || filters.tipe) && (
                                <Button variant="ghost" size="sm" onClick={handleClear} className="gap-1.5 h-9">
                                    <X className="h-3.5 w-3.5" /> Reset
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-10 pl-6 text-center">#</TableHead>
                                        <SortableHead field="nama_kelas">Nama Kelas</SortableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead>Pengajar</TableHead>
                                        <SortableHead field="biaya">Biaya</SortableHead>
                                        <TableHead>Peserta</TableHead>
                                        <SortableHead field="tanggal_mulai">Mulai</SortableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-16 pr-6 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kelas.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-44 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <BookOpen className="h-10 w-10 opacity-20" />
                                                    <p className="text-sm">Tidak ada kelas ditemukan</p>
                                                    {search && <Button variant="link" size="sm" onClick={handleClear}>Reset filter</Button>}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : kelas.data.map((k, idx) => (
                                        <TableRow key={k.id} className="group">
                                            <TableCell className="pl-6 text-center text-muted-foreground text-sm">{kelas.from + idx}</TableCell>
                                            <TableCell>
                                                <p className="font-medium">{k.nama_kelas}</p>
                                                {k.lokasi && <p className="text-xs text-muted-foreground">{k.lokasi}</p>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={k.tipe === 'event' ? 'default' : 'secondary'} className="capitalize">
                                                    {k.tipe}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{k.pengajar || '—'}</TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {k.biaya > 0 ? formatRupiah(k.biaya) : <span className="text-green-600 text-xs font-semibold">Gratis</span>}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <span className={k.kuota && k.jumlah_peserta >= k.kuota ? 'text-red-600 font-semibold' : ''}>
                                                    {k.jumlah_peserta ?? 0}
                                                    {k.kuota ? ` / ${k.kuota}` : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(k.tanggal_mulai)}</TableCell>
                                            <TableCell>
                                                <Badge variant={k.status === 'aktif' ? 'outline' : 'secondary'} className={k.status === 'aktif' ? 'border-green-300 text-green-700 bg-green-50' : ''}>
                                                    {k.status}
                                                </Badge>
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
                                                            <Link href={route('admin.kelas.show', k.id)}><Eye className="mr-2 h-4 w-4" />Lihat Detail</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.kelas.edit', k.id)}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(k)}>
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

                        {/* Pagination */}
                        {kelas.total > 0 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Tampil</span>
                                    <Select value={String(perPage)} onValueChange={handlePerPage}>
                                        <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
                                        <SelectContent>{[10, 25, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <span>dari <strong>{kelas.total}</strong> kelas{kelas.from && ` (${kelas.from}–${kelas.to})`}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={kelas.current_page === 1} onClick={() => router.get(kelas.first_page_url, {}, { preserveState: true })}><ChevronsLeft className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!kelas.prev_page_url} onClick={() => router.get(kelas.prev_page_url, {}, { preserveState: true })}><ChevronLeft className="h-4 w-4" /></Button>
                                    {kelas.links.slice(1, -1).map((link, i) => (
                                        <Button key={i} variant={link.active ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={!kelas.next_page_url} onClick={() => router.get(kelas.next_page_url, {}, { preserveState: true })}><ChevronRight className="h-4 w-4" /></Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8" disabled={kelas.current_page === kelas.last_page} onClick={() => router.get(kelas.last_page_url, {}, { preserveState: true })}><ChevronsRight className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Yakin ingin menghapus kelas <strong className="text-foreground">{deleteTarget?.nama_kelas}</strong>? Data yang dihapus tidak dapat dikembalikan.
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