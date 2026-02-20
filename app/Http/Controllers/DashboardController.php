<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DashboardController extends Controller
{
    public function index()
    {
        $user  = auth()->user();
        $stats = [];

        if ($user->hasRole('admin')) {
            $stats = [
                'total_users'       => User::count(),
                'total_roles'       => Role::count(),
                'total_permissions' => Permission::count(),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats'    => $stats,
            'userRole' => $user->getRoleNames()->first(),
        ]);
    }
}
