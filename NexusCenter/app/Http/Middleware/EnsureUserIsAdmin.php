<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Akses ditolak. Fitur ini hanya untuk Admin.'], 403);
            }
            return redirect()->route('dashboard')->with('error', 'Akses ditolak. Fitur ini hanya untuk Admin.');
        }

        return $next($request);
    }
}
