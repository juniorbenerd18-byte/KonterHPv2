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
        $sale->load(['items', 'delivery']);
        return view('sales.receipt', compact('sale'));
    }

    public function confirmPayment(Sale $sale, Request $request)
    {
        $user = auth()->user();
        if (!$user || (!$user->isStaff() && $sale->user_id !== $user->id)) {
            abort(403, 'Anda tidak memiliki akses untuk mengonfirmasi pembayaran transaksi ini.');
        }

        $sale->load(['items', 'delivery']);

        // Auto create delivery task if delivery option was chosen
        if ($sale->delivery_type === 'delivery' && !$sale->delivery) {
            $trackingCode = \App\Models\Delivery::generateTrackingCode();
            $pin          = \App\Models\Delivery::generatePin();

            $delivery = \App\Models\Delivery::create([
                'tracking_code'    => $trackingCode,
                'sale_id'          => $sale->id,
                'courier_name'     => 'Kurir Express TECHCELL',
                'courier_phone'    => '081234567890',
                'customer_name'    => $sale->customer_name,
                'customer_phone'   => $sale->customer_phone,
                'customer_address' => $sale->customer_address ?? 'Alamat Pemesan',
                'customer_lat'     => $sale->customer_lat,
                'customer_lng'     => $sale->customer_lng,
                'delivery_pin'     => $pin,
                'status'           => 'pending',
                'notes'            => 'Pengantaran Pesanan Online #' . $sale->invoice_number,
            ]);

            \App\Models\Notification::create([
                'type'    => 'service',
                'title'   => '🚚 Tugas Pengantaran Baru #' . $delivery->tracking_code,
                'message' => 'Pengantaran ke ' . $delivery->customer_name . ' untuk Invoice #' . $sale->invoice_number,
                'link'    => route('delivery.index'),
            ]);
        }

        return back()->with('success', 'Pembayaran berhasil dikonfirmasi LUNAS! Pesanan diproses' . ($sale->delivery_type === 'delivery' ? ' & Tugas Pengantaran Kurir otomatis dibuat!' : '.'));
    }
}
