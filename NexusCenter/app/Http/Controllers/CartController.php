<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = session()->get('cart', []);
        $subtotal = 0;
        foreach ($cart as $item) {
            $subtotal += $item['price'] * $item['qty'];
        }

        return view('cart.index', compact('cart', 'subtotal'));
    }

    public function add(Request $request, Product $product)
    {
        if (!$product->is_active || $product->stock <= 0) {
            return back()->with('error', 'Produk ini sedang tidak tersedia atau stok habis.');
        }

        $request->validate([
            'qty' => 'nullable|integer|min:1',
        ]);

        $cart = session()->get('cart', []);
        $qty = max(1, (int) $request->get('qty', 1));
        $currentInCart = isset($cart[$product->id]) ? $cart[$product->id]['qty'] : 0;

        if ($currentInCart + $qty > $product->stock) {
            return back()->with('error', "Stok {$product->name} tidak mencukupi (Sisa stok: {$product->stock}).");
        }

        if (isset($cart[$product->id])) {
            $cart[$product->id]['qty'] += $qty;
        } else {
            $cart[$product->id] = [
                'id'       => $product->id,
                'name'     => $product->name,
                'price'    => $product->price,
                'brand'    => $product->brand,
                'icon'     => $product->icon,
                'image'    => $product->image,
                'qty'      => $qty,
            ];
        }

        session()->put('cart', $cart);
        return redirect()->route('cart.index')->with('success', 'Produk berhasil ditambahkan ke Keranjang Belanja!');
    }

    public function remove(Product $product)
    {
        $cart = session()->get('cart', []);
        if (isset($cart[$product->id])) {
            unset($cart[$product->id]);
            session()->put('cart', $cart);
        }
        return back()->with('success', 'Produk dihapus dari Keranjang.');
    }

    public function updateQty(Request $request, Product $product)
    {
        $cart = session()->get('cart', []);
        $action = $request->get('action', 'add'); // 'add' or 'sub'

        if (isset($cart[$product->id])) {
            if ($action === 'sub') {
                $cart[$product->id]['qty'] = max(1, $cart[$product->id]['qty'] - 1);
            } else {
                if ($cart[$product->id]['qty'] + 1 > $product->stock) {
                    return back()->with('error', "Stok {$product->name} maksimal {$product->stock} unit.");
                }
                $cart[$product->id]['qty'] += 1;
            }
            session()->put('cart', $cart);
        }
        return back()->with('success', 'Jumlah produk diperbarui.');
    }

    public function clear()
    {
        session()->forget('cart');
        return back()->with('success', 'Keranjang Belanja dikosongkan.');
    }
}
