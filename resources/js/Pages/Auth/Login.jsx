import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => { return () => { reset('password'); }; }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex flex-col items-center gap-2 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
                            A
                        </div>
                        <h1 className="text-2xl font-bold">My App</h1>
                    </div>

                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle>Welcome back</CardTitle>
                            <CardDescription>Login to your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status && (
                                <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
                                    {status}
                                </div>
                            )}
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="you@example.com" required autoComplete="username" />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        {canResetPassword && (
                                            <Link href={route('password.request')}
                                                className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                    <Input id="password" type="password" value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••" required autoComplete="current-password" />
                                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked)} />
                                    <Label htmlFor="remember" className="font-normal cursor-pointer">
                                        Remember me
                                    </Label>
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </form>

                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <Link href={route('register')}
                                    className="text-foreground underline-offset-4 hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}