<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $orders = Sale::with('items')
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->orWhere('customer_name', $user->name);
            })
            ->latest()
            ->get();

        return view('profile.index', compact('user', 'orders'));
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone'     => 'nullable|string|max:25',
            'address'   => 'nullable|string',
            'latitude'  => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'password'  => 'nullable|string|min:6',
            'avatar'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $data = [
            'name'      => $request->name,
            'email'     => $request->email,
            'phone'     => $request->phone,
            'address'   => $request->address,
            'latitude'  => $request->latitude,
            'longitude' => $request->longitude,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        $user->update($data);

        return redirect()->route('profile.index')->with('success', 'Profil dan alamat berhasil diperbarui!');
    }
}
