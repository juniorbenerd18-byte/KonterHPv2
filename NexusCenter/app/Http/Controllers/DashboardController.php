<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $todaySales       = Sale::whereDate('created_at', $today)->sum('total');
        $totalTransactions= Sale::count();
        $todayTransactions= Sale::whereDate('created_at', $today)->count();
        $activeServices   = Service::whereNotIn('status', ['Selesai', 'Diambil'])->count();
        $totalProducts    = Product::where('is_active', true)->count();
        $totalServices    = Service::count();
        $lowStockProducts = Product::where('stock', '<=', 5)->where('is_active', true)->count();

        // Recent transactions (sales)
        $recentSales = Sale::with('items')->latest()->take(5)->get();
        // Recent services
        $recentServices = Service::latest()->take(5)->get();

        return view('dashboard', compact(
            'todaySales', 'totalTransactions', 'todayTransactions',
            'activeServices', 'totalProducts', 'totalServices',
            'lowStockProducts', 'recentSales', 'recentServices'
        ));
    }

    public function markNotificationRead(\App\Models\Notification $notification)
    {
        $notification->update(['is_read' => true]);
        if ($notification->link) {
            return redirect($notification->link);
        }
        return back();
    }

    public function markAllNotificationsRead()
    {
        \App\Models\Notification::where('is_read', false)->update(['is_read' => true]);
        return back()->with('success', 'Semua notifikasi ditandai dibaca.');
    }
}
