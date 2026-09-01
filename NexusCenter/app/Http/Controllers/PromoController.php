<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    public function index()
    {
        $flashSales = Product::where('is_active', true)->take(4)->get();
        $promos = Product::where('is_active', true)->latest()->take(6)->get();

        return view('promos.index', compact('flashSales', 'promos'));
    }
}
