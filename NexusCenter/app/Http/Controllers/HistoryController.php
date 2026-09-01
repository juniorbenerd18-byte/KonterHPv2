<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Service;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $salesQuery = Sale::with('items')->latest();
        $servicesQuery = Service::latest();

        // Date filter
        if ($request->filled('date_from')) {
            $salesQuery->whereDate('created_at', '>=', $request->date_from);
            $servicesQuery->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $salesQuery->whereDate('created_at', '<=', $request->date_to);
            $servicesQuery->whereDate('created_at', '<=', $request->date_to);
        }

        // Search
        if ($request->filled('q')) {
            $salesQuery->where(function($q) use ($request) {
                $q->where('invoice_number', 'like', '%' . $request->q . '%')
                  ->orWhere('customer_name', 'like', '%' . $request->q . '%');
            });
            $servicesQuery->where(function($q) use ($request) {
                $q->where('nota_number', 'like', '%' . $request->q . '%')
                  ->orWhere('customer_name', 'like', '%' . $request->q . '%');
            });
        }

        $type = $request->get('type', 'all');

        $sales    = ($type === 'all' || $type === 'penjualan') ? $salesQuery->paginate(15, ['*'], 'sales_page') : collect();
        $services = ($type === 'all' || $type === 'servis')    ? $servicesQuery->paginate(15, ['*'], 'services_page') : collect();

        return view('history.index', compact('sales', 'services', 'type'));
    }
}
