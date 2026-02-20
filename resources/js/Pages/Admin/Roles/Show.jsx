import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Shield,
    Key,
    Users,
    Calendar,
    Clock,
} from 'lucide-react';

// Group permissions by last word
function groupPermissions(permissions) {
    const groups = {};
    permissions.forEach((perm) => {
        const parts = perm.name.split(' ');
        const group = parts.length > 1 ? parts[parts.length - 1] : 'general';
        if (!groups[group]) groups[group] = [];
        groups[group].push(perm);
    });
    return groups;
}

export default function RoleShow({ role, userCount }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteForm = useForm({});

    const grouped = groupPermissions(role.permissions);

    const handleDelete = () => {
        deleteForm.delete(route('admin.roles.destroy', role.id), {
            onSuccess: () => setDeleteOpen(false),
        });
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <AuthenticatedLayout header="Role Detail">
            <Head title={`Role - ${role.name}`} />

            <div className="space-y-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href={route('admin.roles.index')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Roles
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium capitalize">{role.name}</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ── Left: Summary Card ── */}
                    <div className="space-y-4">
                        <Card>
                            <CardContent className="pt-6">
                                {/* Role Icon + Name */}
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                                        <Shield className="h-10 w-10 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold capitalize">{role.name}</h2>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            Role #{role.id}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg border bg-muted/30 p-3 text-center">
                                        <div className="text-2xl font-bold text-primary">{role.permissions.length}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">Permissions</div>
                                    </div>
                                    <div className="rounded-lg border bg-muted/30 p-3 text-center">
                                        <div className="text-2xl font-bold text-primary">{userCount}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">Users</div>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <Button asChild className="w-full">
                                        <Link href={route('admin.roles.edit', role.id)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Role
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30"
                                        onClick={() => setDeleteOpen(true)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Role
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm divide-y">
                                <div className="flex items-start gap-2 py-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Created</p>
                                        <p className="font-medium">
                                            {new Date(role.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 py-2">
                                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Last Updated</p>
                                        <p className="font-medium">
                                            {new Date(role.updated_at).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 py-2">
                                    <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Assigned To</p>
                                        <p className="font-medium">
                                            {userCount} user{userCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Right: Permissions Detail ── */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Key className="h-4 w-4" />
                                    Permissions
                                    <Badge variant="secondary" className="ml-1 tabular-nums">
                                        {role.permissions.length}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    All permissions assigned to this role, grouped by module.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {role.permissions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <Key className="mb-3 h-10 w-10 opacity-20" />
                                        <p className="text-sm">No permissions assigned</p>
                                        <Button variant="link" size="sm" asChild className="mt-2">
                                            <Link href={route('admin.roles.edit', role.id)}>
                                                Add permissions →
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {Object.entries(grouped).map(([group, groupPerms]) => (
                                            <div key={group}>
                                                {/* Group label */}
                                                <div className="flex items-center gap-2 mb-2.5">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10">
                                                        <Shield className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="text-sm font-semibold capitalize">{group}</span>
                                                    <Badge variant="outline" className="text-xs h-5">
                                                        {groupPerms.length}
                                                    </Badge>
                                                </div>

                                                {/* Permission badges */}
                                                <div className="ml-8 flex flex-wrap gap-1.5">
                                                    {groupPerms.map((perm) => (
                                                        <Badge
                                                            key={perm.id}
                                                            variant="secondary"
                                                            className="text-xs font-mono"
                                                        >
                                                            {perm.name}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <Separator className="mt-4" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Role</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete role{' '}
                            <strong className="text-foreground capitalize">{role.name}</strong>?
                            {userCount > 0 && (
                                <span className="block mt-1 text-destructive font-medium">
                                    ⚠️ {userCount} user{userCount !== 1 ? 's' : ''} will lose their permissions.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
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