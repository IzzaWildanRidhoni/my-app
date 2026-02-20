import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => { return () => { reset('password', 'password_confirmation'); }; }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />
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
                            <CardTitle>Create an account</CardTitle>
                            <CardDescription>Enter your details to get started</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" type="text" value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="John Doe" required autoComplete="name" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="you@example.com" required />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Min. 8 characters" required />
                                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input id="password_confirmation" type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••" required />
                                </div>

                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Creating account...' : 'Create account'}
                                </Button>
                            </form>

                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href={route('login')}
                                    className="text-foreground underline-offset-4 hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="mt-4 text-center text-xs text-muted-foreground">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="underline-offset-4 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="underline-offset-4 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </>
    );
}