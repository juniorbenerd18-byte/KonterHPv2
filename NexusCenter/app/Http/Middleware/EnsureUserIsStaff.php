<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsStaff
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isStaff()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Akses ditolak. Halaman ini khusus untuk Staf (Kasir/Admin).'], 403);
            }
            return redirect()->route('products.index')->with('info', 'Selamat datang! Silakan jelajahi Katalog Produk atau Lacak Servis HP Anda.');
        }

        return $next($request);
    }
}
