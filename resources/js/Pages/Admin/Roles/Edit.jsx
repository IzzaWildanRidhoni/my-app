import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Pencil, Eye, CheckSquare, Square } from 'lucide-react';

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

export default function RoleEdit({ role, permissions }) {
    const { data, setData, patch, processing, errors } = useForm({
        name:        role.name,
        permissions: role.permissions.map((p) => p.name),
    });

    const grouped = groupPermissions(permissions);

    const togglePermission = (permName) => {
        setData(
            'permissions',
            data.permissions.includes(permName)
                ? data.permissions.filter((p) => p !== permName)
                : [...data.permissions, permName]
        );
    };

    const toggleGroup = (groupPerms) => {
        const groupNames = groupPerms.map((p) => p.name);
        const allChecked = groupNames.every((n) => data.permissions.includes(n));
        if (allChecked) {
            setData('permissions', data.permissions.filter((p) => !groupNames.includes(p)));
        } else {
            setData('permissions', [...new Set([...data.permissions, ...groupNames])]);
        }
    };

    const selectAll = () => setData('permissions', permissions.map((p) => p.name));
    const clearAll  = () => setData('permissions', []);

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.roles.update', role.id));
    };

    return (
        <AuthenticatedLayout header="Edit Role">
            <Head title={`Edit Role - ${role.name}`} />

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
                    <Link
                        href={route('admin.roles.show', role.id)}
                        className="hover:text-foreground capitalize transition-colors"
                    >
                        {role.name}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Edit</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ── Form ── */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Role name */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Pencil className="h-5 w-5" />
                                            Edit Role
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            Update role <strong className="capitalize">{role.name}</strong> and its permissions.
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('admin.roles.show', role.id)}>
                                            <Eye className="mr-2 h-3.5 w-3.5" />
                                            View
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form id="role-form" onSubmit={submit}>
                                    <div className="space-y-2 max-w-sm">
                                        <Label htmlFor="name">
                                            Role Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Role name"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Role name will be saved in lowercase.
                                        </p>
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Permissions */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-base">Permissions</CardTitle>
                                        <CardDescription className="mt-1">
                                            Select which permissions this role should have.
                                        </CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="tabular-nums">
                                        {data.permissions.length} / {permissions.length} selected
                                    </Badge>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <Button type="button" variant="outline" size="sm" onClick={selectAll} className="gap-1.5 text-xs h-7">
                                        <CheckSquare className="h-3.5 w-3.5" />
                                        Select All
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={clearAll} className="gap-1.5 text-xs h-7" disabled={data.permissions.length === 0}>
                                        <Square className="h-3.5 w-3.5" />
                                        Clear All
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {Object.entries(grouped).map(([group, groupPerms]) => {
                                    const groupNames   = groupPerms.map((p) => p.name);
                                    const checkedCount = groupNames.filter((n) => data.permissions.includes(n)).length;
                                    const allChecked   = checkedCount === groupNames.length;
                                    const someChecked  = checkedCount > 0 && !allChecked;

                                    return (
                                        <div key={group}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <button type="button" onClick={() => toggleGroup(groupPerms)} className="flex items-center gap-2 group">
                                                    <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors
                                                        ${allChecked ? 'bg-primary border-primary' : someChecked ? 'bg-primary/30 border-primary/50' : 'border-input bg-background'}`}
                                                    >
                                                        {(allChecked || someChecked) && (
                                                            <svg className="h-2.5 w-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                {allChecked
                                                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                                }
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-semibold capitalize text-foreground group-hover:text-primary transition-colors">
                                                        {group}
                                                    </span>
                                                </button>
                                                <span className="text-xs text-muted-foreground">
                                                    ({checkedCount}/{groupNames.length})
                                                </span>
                                            </div>

                                            <div className="ml-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {groupPerms.map((perm) => (
                                                    <label
                                                        key={perm.id}
                                                        className="flex items-center gap-2.5 cursor-pointer rounded-md border px-3 py-2 hover:bg-muted/50 transition-colors"
                                                    >
                                                        <Checkbox
                                                            checked={data.permissions.includes(perm.name)}
                                                            onCheckedChange={() => togglePermission(perm.name)}
                                                        />
                                                        <span className="text-sm font-mono">{perm.name}</span>
                                                    </label>
                                                ))}
                                            </div>

                                            <Separator className="mt-5" />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Button type="submit" form="role-form" disabled={processing} className="min-w-28">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={route('admin.roles.index')}>Cancel</Link>
                            </Button>
                        </div>
                    </div>

                    {/* ── Summary Sidebar ── */}
                    <div className="space-y-4">
                        {/* Meta info */}
                        <Card className="border-dashed">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Role Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Role ID</span>
                                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{role.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span>{new Date(role.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Updated</span>
                                    <span>{new Date(role.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Selected preview */}
                        <Card className="sticky top-6">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Selected Permissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {data.permissions.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <Square className="mx-auto mb-2 h-8 w-8 opacity-20" />
                                        <p className="text-xs">No permissions selected</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
                                        {data.permissions.map((p) => (
                                            <Badge
                                                key={p}
                                                variant="secondary"
                                                className="text-xs font-mono cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => togglePermission(p)}
                                            >
                                                {p} ×
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}