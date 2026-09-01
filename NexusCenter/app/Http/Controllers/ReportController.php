<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', 'today');

        [$from, $to] = match($period) {
            'week'  => [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()],
            'month' => [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()],
            'year'  => [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()],
            default => [Carbon::today(), Carbon::today()->endOfDay()],
        };

        $totalSales     = Sale::whereBetween('created_at', [$from, $to])->sum('total');
        $totalService   = Service::whereBetween('created_at', [$from, $to])
                                 ->whereIn('status', ['Selesai', 'Diambil'])->sum('price');
        $totalTransactions = Sale::whereBetween('created_at', [$from, $to])->count();
        $activeServices = Service::whereNotIn('status', ['Selesai', 'Diambil'])->count();

        // Top products
        $topProducts = SaleItem::select('product_name')
            ->selectRaw('SUM(quantity) as total_qty')
            ->selectRaw('SUM(subtotal) as total_revenue')
            ->whereHas('sale', fn($q) => $q->whereBetween('created_at', [$from, $to]))
            ->groupBy('product_name')
            ->orderByDesc('total_qty')
            ->take(5)
            ->get();

        // Top services
        $topServices = Service::select('service_type')
            ->selectRaw('COUNT(*) as total')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('service_type')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        return view('reports.index', compact(
            'period', 'totalSales', 'totalService', 'totalTransactions',
            'activeServices', 'topProducts', 'topServices', 'from', 'to'
        ));
    }
}
