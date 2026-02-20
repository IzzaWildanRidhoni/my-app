import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function RolesIndex({ roles, permissions }) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const createForm = useForm({ name: '', permissions: [] });
    const editForm   = useForm({ name: '', permissions: [] });
    const deleteForm = useForm({});

    const togglePermission = (form, permName) => {
        const curr = form.data.permissions;
        form.setData('permissions', curr.includes(permName) ? curr.filter(p => p !== permName) : [...curr, permName]);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.roles.store'), {
            onSuccess: () => { setCreateOpen(false); createForm.reset(); },
        });
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        editForm.setData({ name: role.name, permissions: role.permissions.map(p => p.name) });
        setEditOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.patch(route('admin.roles.update', editingRole.id), {
            onSuccess: () => { setEditOpen(false); setEditingRole(null); },
        });
    };

    const handleDelete = (role) => {
        if (confirm(`Delete role "${role.name}"?`)) deleteForm.delete(route('admin.roles.destroy', role.id));
    };

    const PermissionsGrid = ({ form }) => (
        <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto rounded-md border p-3">
            {permissions.map((perm) => (
                <div key={perm.id} className="flex items-center gap-2">
                    <Checkbox id={`p-${perm.id}`} checked={form.data.permissions.includes(perm.name)}
                        onCheckedChange={() => togglePermission(form, perm.name)} />
                    <Label htmlFor={`p-${perm.id}`} className="font-normal cursor-pointer text-sm">{perm.name}</Label>
                </div>
            ))}
        </div>
    );

    return (
        <AuthenticatedLayout header="Roles & Permissions">
            <Head title="Roles & Permissions" />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Roles</CardTitle>
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Role
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium capitalize">{role.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.slice(0, 4).map((p) => (
                                                <Badge key={p.id} variant="secondary" className="text-xs">{p.name}</Badge>
                                            ))}
                                            {role.permissions.length > 4 && (
                                                <Badge variant="outline" className="text-xs">+{role.permissions.length - 4} more</Badge>
                                            )}
                                            {role.permissions.length === 0 && (
                                                <span className="text-muted-foreground text-sm">No permissions</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(role)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(role)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Role</DialogTitle>
                        <DialogDescription>Create a new role and assign permissions.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Role Name</Label>
                            <Input value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} placeholder="e.g. editor" />
                            {createForm.errors.name && <p className="text-sm text-destructive">{createForm.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Permissions</Label>
                            <PermissionsGrid form={createForm} />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={createForm.processing}>Create Role</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>Update role and its permissions.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Role Name</Label>
                            <Input value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} />
                            {editForm.errors.name && <p className="text-sm text-destructive">{editForm.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Permissions</Label>
                            <PermissionsGrid form={editForm} />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={editForm.processing}>Update Role</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}