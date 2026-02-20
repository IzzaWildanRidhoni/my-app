import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Pencil, Eye } from 'lucide-react';

export default function UserEdit({ user, roles }) {
    const { data, setData, patch, processing, errors } = useForm({
        name:                  user.name,
        email:                 user.email,
        password:              '',
        password_confirmation: '',
        role:                  user.roles[0]?.name || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id));
    };

    return (
        <AuthenticatedLayout header="Edit User">
            <Head title={`Edit ${user.name}`} />

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
                    <Link
                        href={route('admin.users.show', user.id)}
                        className="hover:text-foreground transition-colors"
                    >
                        {user.name}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Edit</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ── Form Card ── */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Pencil className="h-5 w-5" />
                                            Edit User
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            Update information for <strong>{user.name}</strong>
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('admin.users.show', user.id)}>
                                            <Eye className="mr-2 h-3.5 w-3.5" />
                                            View
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Personal Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                            Personal Info
                                        </h3>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Full Name <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Full name"
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-destructive">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email Address <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="email@example.com"
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-destructive">{errors.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Change Password */}
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                                Change Password
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Leave blank to keep current password.
                                            </p>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="password">New Password</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Min. 8 characters"
                                                    autoComplete="new-password"
                                                />
                                                {errors.password && (
                                                    <p className="text-sm text-destructive">{errors.password}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Repeat new password"
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Role */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                            Access Control
                                        </h3>

                                        <div className="max-w-xs space-y-2">
                                            <Label htmlFor="role">
                                                Role <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={data.role}
                                                onValueChange={(val) => setData('role', val)}
                                            >
                                                <SelectTrigger id="role">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem
                                                            key={role.id}
                                                            value={role.name}
                                                            className="capitalize"
                                                        >
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.role && (
                                                <p className="text-sm text-destructive">{errors.role}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <Button type="submit" disabled={processing} className="min-w-28">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link href={route('admin.users.index')}>Cancel</Link>
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Info Sidebar ── */}
                    <div className="space-y-4">
                        <Card className="border-dashed">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Current Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">User ID</span>
                                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{user.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Current Role</span>
                                    <Badge variant="outline" className="capitalize text-xs">
                                        {user.roles[0]?.name || 'None'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Member Since</span>
                                    <span>
                                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Updated</span>
                                    <span>
                                        {new Date(user.updated_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}