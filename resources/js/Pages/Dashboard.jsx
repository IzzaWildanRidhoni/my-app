import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Key, Activity } from 'lucide-react';

export default function Dashboard({ stats, userRole }) {
    const isAdmin = userRole === 'admin';

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Welcome back! 👋</h2>
                            <p className="text-muted-foreground mt-1">
                                {isAdmin
                                    ? "Here's an overview of your application."
                                    : 'You are logged in as a regular user.'}
                            </p>
                        </div>
                        <Badge variant={isAdmin ? 'default' : 'secondary'} className="capitalize">
                            {userRole}
                        </Badge>
                    </div>
                </div>

                {isAdmin && stats && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_users}</div>
                                <p className="text-xs text-muted-foreground">Registered users</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                                <Shield className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_roles}</div>
                                <p className="text-xs text-muted-foreground">Defined roles</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                                <Key className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_permissions}</div>
                                <p className="text-xs text-muted-foreground">Total permissions</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {!isAdmin && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Your Activity
                            </CardTitle>
                            <CardDescription>
                                This is your personal dashboard. Contact an admin for more access.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-12 text-muted-foreground">
                                <div className="text-center">
                                    <Activity className="mx-auto mb-4 h-12 w-12 opacity-30" />
                                    <p>No activity to show yet.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}