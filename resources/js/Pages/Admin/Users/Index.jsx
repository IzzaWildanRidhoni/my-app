import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function UsersIndex({ users, roles }) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const createForm = useForm({ name: '', email: '', password: '', role: '' });
    const editForm   = useForm({ name: '', email: '', password: '', role: '' });
    const deleteForm = useForm({});

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            onSuccess: () => { setCreateOpen(false); createForm.reset(); },
        });
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        editForm.setData({ name: user.name, email: user.email, password: '', role: user.roles[0]?.name || '' });
        setEditOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.patch(route('admin.users.update', editingUser.id), {
            onSuccess: () => { setEditOpen(false); setEditingUser(null); },
        });
    };

    const handleDelete = (user) => {
        if (confirm(`Delete user "${user.name}"?`)) {
            deleteForm.delete(route('admin.users.destroy', user.id));
        }
    };

    const UserForm = ({ form, onSubmit, submitLabel }) => (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Full name" />
                {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
            </div>
            <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} placeholder="email@example.com" />
                {form.errors.email && <p className="text-sm text-destructive">{form.errors.email}</p>}
            </div>
            <div className="space-y-2">
                <Label>Password {submitLabel === 'Update' && <span className="text-muted-foreground text-xs">(leave blank to keep)</span>}</Label>
                <Input type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} placeholder="Min. 8 characters" />
                {form.errors.password && <p className="text-sm text-destructive">{form.errors.password}</p>}
            </div>
            <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.data.role} onValueChange={(val) => form.setData('role', val)}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={role.name} className="capitalize">{role.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.errors.role && <p className="text-sm text-destructive">{form.errors.role}</p>}
            </div>
            <DialogFooter>
                <Button variant="outline" type="button" onClick={() => submitLabel === 'Create' ? setCreateOpen(false) : setEditOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit" disabled={form.processing}>{submitLabel} User</Button>
            </DialogFooter>
        </form>
    );

    return (
        <AuthenticatedLayout header="User Management">
            <Head title="User Management" />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Users</CardTitle>
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.roles.map((role) => (
                                            <Badge key={role.id} variant="outline" className="capitalize">{role.name}</Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {users.last_page > 1 && (
                        <div className="mt-4 flex justify-end gap-2">
                            {users.links.map((link, i) => (
                                <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && (window.location.href = link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create User</DialogTitle>
                        <DialogDescription>Add a new user to the system.</DialogDescription>
                    </DialogHeader>
                    <UserForm form={createForm} onSubmit={handleCreate} submitLabel="Create" />
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information.</DialogDescription>
                    </DialogHeader>
                    <UserForm form={editForm} onSubmit={handleUpdate} submitLabel="Update" />
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}