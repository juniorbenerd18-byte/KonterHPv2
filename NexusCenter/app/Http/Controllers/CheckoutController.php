<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('products.index')->with('info', 'Keranjang belanja Anda masih kosong.');
        }

        $subtotal = 0;
        foreach ($cart as $item) {
            $subtotal += $item['price'] * $item['qty'];
        }

        return view('checkout.index', compact('cart', 'subtotal'));
    }

    public function process(Request $request)
    {
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('products.index')->with('error', 'Keranjang belanja kosong.');
        }

        $request->validate([
            'customer_name'    => 'required|string|max:100',
            'customer_phone'   => 'required|string|max:20',
            'customer_address' => 'nullable|string',
            'customer_lat'     => 'nullable|numeric',
            'customer_lng'     => 'nullable|numeric',
            'delivery_type'    => 'required|in:delivery,pickup',
            'payment_method'   => 'required|in:Tunai,Transfer,QRIS,Debit',
        ]);

        try {
            $sale = DB::transaction(function () use ($request, $cart) {
                // Re-calculate subtotal with fresh database prices & check stock
                $subtotal = 0;
                $validatedItems = [];

                foreach ($cart as $item) {
                    $product = Product::lockForUpdate()->find($item['id']);
                    if (!$product || !$product->is_active) {
                        throw new \Exception("Produk {$item['name']} tidak lagi tersedia.");
                    }
                    if ($product->stock < $item['qty']) {
                        throw new \Exception("Stok {$product->name} tidak mencukupi (Sisa stok: {$product->stock}).");
                    }

                    $itemSubtotal = $product->price * $item['qty'];
                    $subtotal += $itemSubtotal;

                    $validatedItems[] = [
                        'product'      => $product,
                        'product_name' => $product->name,
                        'price'        => $product->price,
                        'qty'          => $item['qty'],
                        'subtotal'     => $itemSubtotal,
                    ];
                }

                $sale = Sale::create([
                    'user_id'          => auth()->id(),
                    'invoice_number'   => Sale::generateInvoiceNumber(),
                    'customer_name'    => $request->customer_name,
                    'customer_phone'   => $request->customer_phone,
                    'customer_address' => $request->customer_address,
                    'customer_lat'     => $request->customer_lat,
                    'customer_lng'     => $request->customer_lng,
                    'delivery_type'    => $request->delivery_type,
                    'subtotal'         => $subtotal,
                    'discount'         => 0,
                    'total'            => $subtotal,
                    'amount_paid'      => $subtotal,
                    'change_amount'    => 0,
                    'payment_method'   => $request->payment_method,
                    'cashier_name'     => auth()->check() ? auth()->user()->name : 'Online Customer',
                ]);

                foreach ($validatedItems as $vi) {
                    SaleItem::create([
                        'sale_id'      => $sale->id,
                        'product_id'   => $vi['product']->id,
                        'product_name' => $vi['product_name'],
                        'price'        => $vi['price'],
                        'quantity'     => $vi['qty'],
                        'subtotal'     => $vi['subtotal'],
                    ]);

                    $vi['product']->decrement('stock', $vi['qty']);
                    $vi['product']->increment('review_count', $vi['qty']);
                }

                // Auto-save/update address in User profile so user doesn't need to re-enter it next time
                if (auth()->check()) {
                    auth()->user()->update([
                        'phone'     => $request->customer_phone,
                        'address'   => $request->customer_address ?: auth()->user()->address,
                        'latitude'  => $request->customer_lat ?: auth()->user()->latitude,
                        'longitude' => $request->customer_lng ?: auth()->user()->longitude,
                    ]);
                }

                return $sale;
            });
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        session()->forget('cart');

        // Create Admin Notification
        $isDelivery = $request->delivery_type === 'delivery';
        Notification::create([
            'type'    => 'sale',
            'title'   => ($isDelivery ? '🚚 [Minta Diantar] ' : '🛒 ') . 'Pesanan Baru #' . $sale->invoice_number,
            'message' => 'Pesanan ' . $sale->formatted_total . ' oleh ' . $sale->customer_name . ($isDelivery && $sale->customer_address ? ' (Alamat: ' . $sale->customer_address . ')' : ''),
            'link'    => $isDelivery ? route('delivery.index', ['sale_id' => $sale->id]) : route('sales.receipt', $sale->id),
        ]);

        return redirect()->route('sales.receipt', $sale->id)->with('success', 'Pesanan Anda berhasil diproses!');
    }
}
