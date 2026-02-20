<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::with('roles')->paginate(10),
            'roles' => Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role'     => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
        ]);
        $user->assignRole($request->role);

        return back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role'  => 'required|exists:roles,name',
        ]);

        $user->update(['name' => $request->name, 'email' => $request->email]);
        if ($request->password) {
            $user->update(['password' => bcrypt($request->password)]);
        }
        $user->syncRoles([$request->role]);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'User deleted successfully.');
    }
}
