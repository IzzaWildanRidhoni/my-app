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
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function UserCreate({ roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        role:                  '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout header="Create User">
            <Head title="Create User" />

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
                    <span className="text-foreground font-medium">Create</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ── Form Card ── */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserPlus className="h-5 w-5" />
                                    User Information
                                </CardTitle>
                                <CardDescription>
                                    Fill in the details to create a new user account.
                                </CardDescription>
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
                                                    placeholder="e.g. John Doe"
                                                    autoComplete="name"
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
                                                    placeholder="john@example.com"
                                                    autoComplete="email"
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-destructive">{errors.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Security */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                            Security
                                        </h3>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="password">
                                                    Password <span className="text-destructive">*</span>
                                                </Label>
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
                                                <Label htmlFor="password_confirmation">
                                                    Confirm Password <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Repeat password"
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
                                            {processing ? 'Creating...' : 'Create User'}
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link href={route('admin.users.index')}>Cancel</Link>
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Tips Sidebar ── */}
                    <div className="space-y-4">
                        <Card className="border-dashed">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Tips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <p className="font-medium text-foreground mb-1">Password Policy</p>
                                    <p>Minimum 8 characters. Use a mix of letters, numbers, and symbols for a strong password.</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="font-medium text-foreground mb-1">Role Assignment</p>
                                    <p><strong className="text-foreground">Admin</strong> can manage all users, roles, and permissions.</p>
                                    <p className="mt-1"><strong className="text-foreground">User</strong> can only view the dashboard.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}