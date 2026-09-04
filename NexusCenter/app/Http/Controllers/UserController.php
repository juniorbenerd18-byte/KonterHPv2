<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Tampilkan daftar akun terdaftar untuk Admin (/manajemen-user)
     */
    public function index(Request $request)
    {
        $query = User::latest();

        // Filter Role
        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter Keyword Search
        if ($request->filled('q')) {
            $q = trim($request->q);
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%");
            });
        }

        $users = $query->paginate(12);

        // Calculate statistics
        $stats = [
            'total'    => User::count(),
            'admin'    => User::where('role', 'admin')->count(),
            'kasir'    => User::where('role', 'kasir')->count(),
            'pengguna' => User::whereIn('role', ['pengguna', 'user'])->count(),
            'active'   => User::where('is_active', true)->count(),
        ];

        return view('users.index', compact('users', 'stats'));
    }

    /**
     * Tambah akun baru oleh Admin
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,kasir,pengguna',
            'phone'    => 'nullable|string|max:20',
            'address'  => 'nullable|string',
        ], [
            'name.required'     => 'Nama wajib diisi.',
            'email.required'    => 'Email wajib diisi.',
            'email.unique'      => 'Email sudah terdaftar.',
            'password.required' => 'Password wajib diisi.',
            'role.required'     => 'Role akun wajib dipilih.',
        ]);

        User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => $request->role,
            'is_active' => true,
            'phone'     => $request->phone,
            'address'   => $request->address,
        ]);

        return back()->with('success', 'Akun ' . $request->name . ' (' . ucfirst($request->role) . ') berhasil dibuat!');
    }

    /**
     * Toggle status aktif / nonaktif akun user
     */
    public function toggleStatus(User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menonaktifkan akun sendiri!');
        }

        $user->update([
            'is_active' => !$user->is_active
        ]);

        $statusText = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', 'Status akun ' . $user->name . ' berhasil ' . $statusText . '!');
    }

    /**
     * Update role pengguna
     */
    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,kasir,pengguna',
        ]);

        if (auth()->id() === $user->id && $request->role !== 'admin') {
            return back()->with('error', 'Anda tidak dapat mengubah role akun sendiri!');
        }

        $user->update([
            'role' => $request->role
        ]);

        return back()->with('success', 'Role ' . $user->name . ' berhasil diperbarui menjadi ' . ucfirst($request->role) . '!');
    }

    /**
     * Hapus akun pengguna
     */
    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun sendiri!');
        }

        $name = $user->name;
        $user->delete();

        return back()->with('success', 'Akun ' . $name . ' berhasil dihapus dari sistem!');
    }
}
