import { useState, useEffect, useCallback } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    Search,
    X,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Shield,
} from 'lucide-react';

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────
function SortIcon({ field, sortField, sortDirection }) {
    if (sortField !== field)
        return <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50" />;
    return sortDirection === 'asc'
        ? <ChevronUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
        : <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-primary" />;
}

// ─── Flash message ────────────────────────────────────────────────────────────
function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const t = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(t);
    }, [flash]);

    if (!flash?.success || !visible) return null;

    return (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <span>{flash.success}</span>
            <button onClick={() => setVisible(false)}>
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

// ─── Permission Badge List ────────────────────────────────────────────────────
function PermissionBadges({ permissions, max = 3 }) {
    const shown  = permissions.slice(0, max);
    const hidden = permissions.length - max;
    return (
        <div className="flex flex-wrap gap-1">
            {shown.map((p) => (
                <Badge key={p.id} variant="secondary" className="text-xs font-mono">
                    {p.name}
                </Badge>
            ))}
            {hidden > 0 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{hidden} more
                </Badge>
            )}
            {permissions.length === 0 && (
                <span className="text-xs text-muted-foreground italic">No permissions</span>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RolesIndex({ roles, filters }) {
    const [search, setSearch]           = useState(filters.search || '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const deleteForm  = useForm({});
    const debouncedSearch = useDebounce(search, 400);

    const sortField     = filters.sort      || 'created_at';
    const sortDirection = filters.direction || 'desc';
    const perPage       = Number(filters.per_page || 10);

    const applyFilters = useCallback((overrides = {}) => {
        router.get(
            route('admin.roles.index'),
            {
                search:    overrides.search    !== undefined ? overrides.search    : search,
                sort:      overrides.sort      !== undefined ? overrides.sort      : sortField,
                direction: overrides.direction !== undefined ? overrides.direction : sortDirection,
                per_page:  overrides.per_page  !== undefined ? overrides.per_page  : perPage,
            },
            { preserveState: true, replace: true }
        );
    }, [search, sortField, sortDirection, perPage]);

    useEffect(() => {
        applyFilters({ search: debouncedSearch });
    }, [debouncedSearch]);

    const handleSort = (field) => {
        const newDir = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        applyFilters({ sort: field, direction: newDir });
    };

    const handlePerPage = (val) => applyFilters({ per_page: Number(val) });

    const handleClearSearch = () => {
        setSearch('');
        applyFilters({ search: '' });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteForm.delete(route('admin.roles.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const SortableHead = ({ field, children }) => (
        <TableHead
            className="cursor-pointer select-none whitespace-nowrap hover:bg-muted/50 transition-colors"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center">
                {children}
                <SortIcon field={field} sortField={sortField} sortDirection={sortDirection} />
            </div>
        </TableHead>
    );

    return (
        <AuthenticatedLayout header="Roles & Permissions">
            <Head title="Roles & Permissions" />

            <div className="space-y-4">
                <FlashMessage />

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Roles</h1>
                        <p className="text-sm text-muted-foreground">
                            {roles.total} role{roles.total !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.roles.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Role
                        </Link>
                    </Button>
                </div>

                {/* ── Table Card ── */}
                <Card>
                    {/* ── Toolbar ── */}
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search role name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 pr-9"
                                />
                                {search && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* ── Table ── */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-10 pl-6 text-center">#</TableHead>
                                        <SortableHead field="name">Role Name</SortableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead className="text-center">Total Permissions</TableHead>
                                        <SortableHead field="created_at">Created</SortableHead>
                                        <TableHead className="w-16 pr-6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-40 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Shield className="h-10 w-10 opacity-20" />
                                                    <p className="text-sm">No roles found</p>
                                                    {search && (
                                                        <Button variant="link" size="sm" onClick={handleClearSearch}>
                                                            Clear search
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        roles.data.map((role, index) => (
                                            <TableRow key={role.id} className="group">
                                                <TableCell className="pl-6 text-center text-muted-foreground text-sm">
                                                    {roles.from + index}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                                            <Shield className="h-3.5 w-3.5 text-primary" />
                                                        </div>
                                                        <span className="font-medium capitalize">{role.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs">
                                                    <PermissionBadges permissions={role.permissions} max={3} />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="tabular-nums">
                                                        {role.permissions.length}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                    {new Date(role.created_at).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('admin.roles.show', role.id)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('admin.roles.edit', role.id)}>
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setDeleteTarget(role)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* ── Footer: Per page + Pagination ── */}
                        {roles.total > 0 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
                                {/* Per page */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Show</span>
                                    <Select value={String(perPage)} onValueChange={handlePerPage}>
                                        <SelectTrigger className="h-8 w-16">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[10, 25, 50, 100].map((n) => (
                                                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span>
                                        of <strong>{roles.total}</strong> entries
                                        {roles.from && ` (showing ${roles.from}–${roles.to})`}
                                    </span>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline" size="icon" className="h-8 w-8"
                                        disabled={roles.current_page === 1}
                                        onClick={() => router.get(roles.first_page_url, {}, { preserveState: true })}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline" size="icon" className="h-8 w-8"
                                        disabled={!roles.prev_page_url}
                                        onClick={() => router.get(roles.prev_page_url, {}, { preserveState: true })}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    {roles.links.slice(1, -1).map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="icon"
                                            className="h-8 w-8 text-xs"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                    <Button
                                        variant="outline" size="icon" className="h-8 w-8"
                                        disabled={!roles.next_page_url}
                                        onClick={() => router.get(roles.next_page_url, {}, { preserveState: true })}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline" size="icon" className="h-8 w-8"
                                        disabled={roles.current_page === roles.last_page}
                                        onClick={() => router.get(roles.last_page_url, {}, { preserveState: true })}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
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
                        <AlertDialogTitle>Delete Role</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete role{' '}
                            <strong className="text-foreground capitalize">{deleteTarget?.name}</strong>?
                            Users assigned to this role will lose their permissions.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}