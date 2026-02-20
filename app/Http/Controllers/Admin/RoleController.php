<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Roles/Index', [
            'roles'       => Role::with('permissions')->get(),
            'permissions' => Permission::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);

        return back()->with('success', 'Role created successfully.');
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name'        => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);

        return back()->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return back()->with('success', 'Role deleted successfully.');
    }
}
