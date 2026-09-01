<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            $user = Auth::user();
            $targetRoute = $user->isStaff() ? 'dashboard' : 'products.index';
            return redirect()->route($targetRoute);
        }
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'password' => 'required|string',
        ], [
            'name.required'     => 'Nama wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $user = User::where(function ($q) use ($request) {
                    $q->where('name', $request->name)
                      ->orWhere('email', $request->name);
                })
                ->where('is_active', true)
                ->first();

        if ($user && Hash::check($request->password, $user->password)) {
            Auth::login($user, $request->boolean('remember'));
            $request->session()->regenerate();
            $targetRoute = $user->isStaff() ? 'dashboard' : 'products.index';
            return redirect()->route($targetRoute)->with('success', 'Selamat datang, ' . $user->name . '!');
        }

        return back()->withErrors([
            'name' => 'Nama atau password salah.',
        ])->withInput($request->only('name'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }
}
