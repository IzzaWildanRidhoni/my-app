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
    User,
    Mail,
    Shield,
    Key,
    Calendar,
    Clock,
} from 'lucide-react';

function InfoRow({ icon: Icon, label, value, mono = false }) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    {label}
                </p>
                <p className={`text-sm font-medium break-all ${mono ? 'font-mono' : ''}`}>
                    {value || <span className="text-muted-foreground italic">—</span>}
                </p>
            </div>
        </div>
    );
}

export default function UserShow({ user }) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteForm = useForm({});

    const handleDelete = () => {
        deleteForm.delete(route('admin.users.destroy', user.id), {
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
        <AuthenticatedLayout header="User Detail">
            <Head title={`User - ${user.name}`} />

            <div className="space-y-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href={route('admin.users.index')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Users
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">{user.name}</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ── Left: Profile Card ── */}
                    <div className="space-y-4">
                        <Card>
                            <CardContent className="pt-6">
                                {/* Avatar */}
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">{user.name}</h2>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <Badge
                                                    key={role.id}
                                                    variant={role.name === 'admin' ? 'default' : 'secondary'}
                                                    className="capitalize"
                                                >
                                                    {role.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <Badge variant="outline">No Role</Badge>
                                        )}
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {/* Quick Actions */}
                                <div className="flex flex-col gap-2">
                                    <Button asChild className="w-full">
                                        <Link href={route('admin.users.edit', user.id)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit User
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30"
                                        onClick={() => setDeleteOpen(true)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete User
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Permissions count */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    Permissions Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary">
                                    {user.permissions.length}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    permissions via {user.roles.length} role{user.roles.length !== 1 ? 's' : ''}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Right: Detail Cards ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Account Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="h-4 w-4" />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                <InfoRow icon={User} label="Full Name" value={user.name} />
                                <InfoRow icon={Mail} label="Email Address" value={user.email} />
                                <InfoRow
                                    icon={Shield}
                                    label="Assigned Roles"
                                    value={
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <Badge key={role.id} variant="outline" className="capitalize text-xs">
                                                        {role.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-muted-foreground italic text-sm">No roles assigned</span>
                                            )}
                                        </div>
                                    }
                                />
                                <InfoRow icon={Calendar} label="Member Since" value={formatDate(user.created_at)} />
                                <InfoRow icon={Clock} label="Last Updated" value={formatDate(user.updated_at)} />
                            </CardContent>
                        </Card>

                        {/* Permissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Key className="h-4 w-4" />
                                    Permissions
                                </CardTitle>
                                <CardDescription>
                                    All permissions inherited from assigned roles.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {user.permissions.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.permissions.map((perm) => (
                                            <Badge key={perm.id} variant="secondary" className="text-xs font-mono">
                                                {perm.name}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                                        <div className="text-center">
                                            <Key className="mx-auto mb-2 h-8 w-8 opacity-20" />
                                            <p className="text-sm">No permissions assigned</p>
                                        </div>
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
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <strong className="text-foreground">{user.name}</strong>?
                            This action cannot be undone.
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