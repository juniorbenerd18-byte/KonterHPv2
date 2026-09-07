<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('q')) {
            $query->where('name', 'like', '%' . $request->q . '%')
                  ->orWhere('brand', 'like', '%' . $request->q . '%');
        }
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $products = $query->where('is_active', true)->latest()->get();

        return view('products.index', compact('products'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|in:smartphone,aksesoris,pulsa',
            'brand'       => 'nullable|string|max:100',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'icon'        => 'nullable|string|max:10',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($data);

        return back()->with('success', 'Produk berhasil ditambahkan!');
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|in:smartphone,aksesoris,pulsa',
            'brand'       => 'nullable|string|max:100',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'icon'        => 'nullable|string|max:10',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) Storage::disk('public')->delete($product->image);
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return back()->with('success', 'Produk berhasil diperbarui!');
    }

    public function destroy(Product $product)
    {
        if ($product->image) Storage::disk('public')->delete($product->image);
        $product->update(['is_active' => false]);
        return back()->with('success', 'Produk berhasil dihapus!');
    }

    // API for POS - return JSON
    public function apiList(Request $request)
    {
        $query = Product::where('is_active', true)->where('stock', '>', 0);

        if ($request->filled('q')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->q . '%')
                  ->orWhere('brand', 'like', '%' . $request->q . '%');
            });
        }
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        return response()->json($query->get()->map(fn($p) => [
            'id'       => $p->id,
            'name'     => $p->name,
            'brand'    => $p->brand,
            'category' => $p->category,
            'price'    => $p->price,
            'stock'    => $p->stock,
            'icon'     => $p->icon,
            'image'    => $p->image ? Storage::url($p->image) : null,
        ]));
    }

    public function addReview(Request $request, Product $product)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $currCount = (int) ($product->review_count ?: 0);
        $currRating = (float) ($product->rating ?: 0);

        if ($currCount === 0 || $currRating === 0.0) {
            $newCount = 1;
            $newRating = (float) $request->rating;
        } else {
            $newCount = $currCount + 1;
            $newRating = round((($currRating * $currCount) + $request->rating) / $newCount, 1);
        }

        $product->update([
            'review_count' => $newCount,
            'rating'       => $newRating,
        ]);

        return back()->with('success', "Ulasan bintang {$request->rating} berhasil dikirim! Terima kasih atas masukan Anda.");
    }
}
