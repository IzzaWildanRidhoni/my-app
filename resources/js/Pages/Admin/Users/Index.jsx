import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    Users,
} from 'lucide-react';
import { useEffect, useCallback, useRef } from 'react';

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
    if (sortField !== field) return <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50" />;
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UsersIndex({ users, roles, filters }) {
    const [search, setSearch]         = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const deleteForm = useForm({});

    const debouncedSearch = useDebounce(search, 400);

    const sortField     = filters.sort || 'created_at';
    const sortDirection = filters.direction || 'desc';
    const perPage       = Number(filters.per_page || 10);

    // Reload table when filters change
    const applyFilters = useCallback((overrides = {}) => {
        router.get(
            route('admin.users.index'),
            {
                search:    overrides.search    !== undefined ? overrides.search    : search,
                role:      overrides.role      !== undefined ? overrides.role      : roleFilter,
                sort:      overrides.sort      !== undefined ? overrides.sort      : sortField,
                direction: overrides.direction !== undefined ? overrides.direction : sortDirection,
                per_page:  overrides.per_page  !== undefined ? overrides.per_page  : perPage,
            },
            { preserveState: true, replace: true }
        );
    }, [search, roleFilter, sortField, sortDirection, perPage]);

    // Search debounce effect
    useEffect(() => {
        applyFilters({ search: debouncedSearch });
    }, [debouncedSearch]);

    const handleRoleFilter = (val) => {
        const newRole = val === 'all' ? '' : val;
        setRoleFilter(newRole);
        applyFilters({ role: newRole });
    };

    const handleSort = (field) => {
        const newDir = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        applyFilters({ sort: field, direction: newDir });
    };

    const handlePerPage = (val) => {
        applyFilters({ per_page: Number(val) });
    };

    const handleClearFilters = () => {
        setSearch('');
        setRoleFilter('');
        router.get(route('admin.users.index'), {}, { preserveState: false });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteForm.delete(route('admin.users.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const hasActiveFilters = search || roleFilter;

    // Sortable column header
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
        <AuthenticatedLayout header="User Management">
            <Head title="User Management" />

            <div className="space-y-4">
                <FlashMessage />

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Users</h1>
                        <p className="text-sm text-muted-foreground">
                            {users.total} user{users.total !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.users.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                {/* ── Table Card ── */}
                <Card>
                    {/* ── Toolbar ── */}
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* Search */}
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 pr-9"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Role filter */}
                                <Select value={roleFilter || 'all'} onValueChange={handleRoleFilter}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue placeholder="All roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All roles</SelectItem>
                                        {roles.map((r) => (
                                            <SelectItem key={r.id} value={r.name} className="capitalize">
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Clear filters */}
                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1.5">
                                        <X className="h-3.5 w-3.5" />
                                        Clear
                                    </Button>
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
                                        <SortableHead field="name">Name</SortableHead>
                                        <SortableHead field="email">Email</SortableHead>
                                        <TableHead>Role</TableHead>
                                        <SortableHead field="created_at">Created</SortableHead>
                                        <TableHead className="w-16 pr-6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-40 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Users className="h-10 w-10 opacity-20" />
                                                    <p className="text-sm">No users found</p>
                                                    {hasActiveFilters && (
                                                        <Button variant="link" size="sm" onClick={handleClearFilters}>
                                                            Clear filters
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user, index) => (
                                            <TableRow key={user.id} className="group">
                                                <TableCell className="pl-6 text-center text-muted-foreground text-sm">
                                                    {users.from + index}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {/* Avatar */}
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium">{user.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.length > 0 ? (
                                                            user.roles.map((role) => (
                                                                <Badge
                                                                    key={role.id}
                                                                    variant={role.name === 'admin' ? 'default' : 'secondary'}
                                                                    className="capitalize text-xs"
                                                                >
                                                                    {role.name}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">No role</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', {
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
                                                                <Link href={route('admin.users.show', user.id)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route('admin.users.edit', user.id)}>
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setDeleteTarget(user)}
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
                        {users.total > 0 && (
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
                                        of <strong>{users.total}</strong> entries
                                        {users.from && ` (showing ${users.from}–${users.to})`}
                                    </span>
                                </div>

                                {/* Page buttons */}
                                <div className="flex items-center gap-1">
                                    {/* First */}
                                    <Button
                                        variant="outline" size="icon" className="h-8 w-8"
                                        disabled={users.current_page === 1}
                                        onClick={() => router.get(users.first_page_url, {}, { preserveState: true })}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    {/* Prev */}
                                    <Button
                                        variant="outline" size="icon" className="h-8 w-8"
                                        disabled={!users.prev_page_url}
                                        onClick={() => router.get(users.prev_page_url, {}, { preserveState: true })}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Page numbers */}
                                    {users.links.slice(1, -1).map((link, i) => (
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

                                    {/* Next */}
                                    <Button
                                        variant="outline" size="icon" className="h-8 w-8"
                                        disabled={!users.next_page_url}
                                        onClick={() => router.get(users.next_page_url, {}, { preserveState: true })}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    {/* Last */}
                                    <Button
                                        variant="outline" size="icon" className="h-8 w-8"
                                        disabled={users.current_page === users.last_page}
                                        onClick={() => router.get(users.last_page_url, {}, { preserveState: true })}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Delete Confirm Dialog ── */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong className="text-foreground">{deleteTarget?.name}</strong>?
                            This action cannot be undone.
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