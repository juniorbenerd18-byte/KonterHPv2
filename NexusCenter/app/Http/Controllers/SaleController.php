<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        $products = Product::where('is_active', true)->where('stock', '>', 0)->get();
        return view('sales.pos', compact('products'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'items'          => 'required|array|min:1',
            'items.*.id'     => 'required|exists:products,id',
            'items.*.qty'    => 'required|integer|min:1',
            'discount'       => 'nullable|integer|min:0|max:100',
            'payment_method' => 'required|in:Tunai,Transfer,QRIS,Debit',
            'amount_paid'    => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($request) {
            $subtotal = 0;
            $saleItems = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);
                if ($product->stock < $item['qty']) {
                    abort(422, "Stok {$product->name} tidak cukup.");
                }
                $itemSubtotal = $product->price * $item['qty'];
                $subtotal += $itemSubtotal;

                $saleItems[] = [
                    'product_id'   => $product->id,
                    'product_name' => $product->name,
                    'price'        => $product->price,
                    'quantity'     => $item['qty'],
                    'subtotal'     => $itemSubtotal,
                ];

                $product->decrement('stock', $item['qty']);
            }

            $discount = $request->integer('discount', 0);
            $total = $subtotal - ($subtotal * $discount / 100);
            $amountPaid = $request->integer('amount_paid');

            if ($amountPaid < $total) {
                abort(422, "Pembayaran kurang! Total tagihan Rp " . number_format($total, 0, ',', '.') . ", tetapi uang yang dibayar Rp " . number_format($amountPaid, 0, ',', '.'));
            }

            $change = max(0, $amountPaid - $total);

            $sale = Sale::create([
                'invoice_number' => Sale::generateInvoiceNumber(),
                'customer_name'  => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'subtotal'       => $subtotal,
                'discount'       => $discount,
                'total'          => $total,
                'amount_paid'    => $amountPaid,
                'change_amount'  => $change,
                'payment_method' => $request->payment_method,
                'cashier_name'   => Auth::user()->name,
            ]);

            foreach ($saleItems as &$si) {
                $si['sale_id'] = $sale->id;
                $si['created_at'] = now();
                $si['updated_at'] = now();
            }
            SaleItem::insert($saleItems);
        });

        return response()->json(['success' => true, 'message' => 'Transaksi berhasil!']);
    }

    public function receipt(Sale $sale)
    {
        $sale->load('items');
        return view('sales.receipt', compact('sale'));
    }
}
