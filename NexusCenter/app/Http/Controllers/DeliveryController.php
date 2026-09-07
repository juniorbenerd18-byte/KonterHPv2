<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Service;
use App\Models\Sale;
use App\Models\Notification;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    /**
     * Manajemen Pengantaran untuk Admin & Kasir (/manajemen-pengantaran)
     */
    public function index(Request $request)
    {
        $query = Delivery::with(['service', 'sale']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('q')) {
            $q = trim($request->q);
            $query->where(function ($sub) use ($q) {
                $sub->where('tracking_code', 'like', "%{$q}%")
                    ->orWhere('courier_name', 'like', "%{$q}%")
                    ->orWhere('customer_name', 'like', "%{$q}%")
                    ->orWhere('customer_phone', 'like', "%{$q}%");
            });
        }

        $deliveries = $query->latest()->paginate(10);
        $readyServices = Service::whereIn('status', ['Selesai', 'Diterima'])->latest()->get();
        $readySales    = Sale::latest()->take(30)->get();

        return view('delivery.index', compact('deliveries', 'readyServices', 'readySales'));
    }

    /**
     * Membuat tugas pengantaran baru oleh Staf
     */
    public function store(Request $request)
    {
        $request->validate([
            'service_id'       => 'nullable|exists:services,id',
            'sale_id'          => 'nullable|exists:sales,id',
            'courier_name'     => 'required|string|max:100',
            'courier_phone'    => 'required|string|max:20',
            'customer_name'    => 'required|string|max:100',
            'customer_phone'   => 'required|string|max:20',
            'customer_address' => 'required|string',
            'customer_lat'     => 'nullable|numeric',
            'customer_lng'     => 'nullable|numeric',
            'notes'            => 'nullable|string',
        ]);

        $trackingCode = Delivery::generateTrackingCode();
        $pin          = Delivery::generatePin();
        $lat          = is_numeric($request->customer_lat) ? (float) $request->customer_lat : null;
        $lng          = is_numeric($request->customer_lng) ? (float) $request->customer_lng : null;

        if ($request->sale_id) {
            $sale = Sale::find($request->sale_id);
            if ($sale && $sale->customer_lat && $sale->customer_lng) {
                $lat = $lat ?? (float) $sale->customer_lat;
                $lng = $lng ?? (float) $sale->customer_lng;
            }
        }

        // Auto-geocode address if coordinates are empty
        if (empty($lat) || empty($lng)) {
            try {
                $geoUrl = 'https://nominatim.openstreetmap.org/search?q=' . urlencode($request->customer_address) . '&format=json&limit=1';
                $opts = ['http' => ['header' => "User-Agent: NexusCenterApp/1.0\r\n"]];
                $ctx = stream_context_create($opts);
                $json = @file_get_contents($geoUrl, false, $ctx);
                if ($json) {
                    $geoData = json_decode($json, true);
                    if (!empty($geoData[0]['lat']) && !empty($geoData[0]['lon'])) {
                        $lat = (float) $geoData[0]['lat'];
                        $lng = (float) $geoData[0]['lon'];
                    }
                }
            } catch (\Throwable $e) {}
        }

        $delivery = Delivery::create([
            'tracking_code'    => $trackingCode,
            'service_id'       => $request->service_id,
            'sale_id'          => $request->sale_id,
            'courier_name'     => $request->courier_name,
            'courier_phone'    => $request->courier_phone,
            'customer_name'    => $request->customer_name,
            'customer_phone'   => $request->customer_phone,
            'customer_address' => $request->customer_address,
            'customer_lat'     => !empty($lat) ? (float) $lat : null,
            'customer_lng'     => !empty($lng) ? (float) $lng : null,
            'delivery_pin'     => $pin,
            'status'           => 'pending',
            'notes'            => $request->notes,
        ]);

        // Buat Notifikasi Sistem
        Notification::create([
            'type'    => 'service',
            'title'   => '🚚 Tugas Pengantaran Baru #' . $delivery->tracking_code,
            'message' => 'Pengantaran ke ' . $delivery->customer_name . ' oleh Kurir ' . $delivery->courier_name,
            'link'    => route('delivery.index'),
        ]);

        return back()->with('success', 'Tugas pengantaran berhasil dibuat! Kode PIN Pelanggan: ' . $pin);
    }

    /**
     * Halaman Tugas Kurir di HP (/tugas-kurir)
     */
    public function courierDashboard()
    {
        $deliveries = Delivery::whereIn('status', ['pending', 'diantar'])
            ->latest()
            ->get();

        return view('delivery.courier_dashboard', compact('deliveries'));
    }

    /**
     * Halaman Pengantaran HP Kurir (/k/{tracking_code})
     */
    public function courierTask(string $tracking_code)
    {
        $delivery = Delivery::where('tracking_code', $tracking_code)->firstOrFail();
        return view('delivery.courier', compact('delivery'));
    }

    /**
     * Mulai Pengantaran (Kurir menekan Mulai Antar)
     */
    public function startDelivery(Request $request, Delivery $delivery)
    {
        $delivery->update([
            'status'     => 'diantar',
            'started_at' => now(),
        ]);

        // Buat Notifikasi Realtime untuk Pelanggan / Sistem
        Notification::create([
            'type'    => 'service',
            'title'   => '🚚 Kurir ' . $delivery->courier_name . ' Mulai Mengantar Pesanan Anda!',
            'message' => 'Pengantaran #' . $delivery->tracking_code . ' ke ' . $delivery->customer_name . ' sedang bergerak. Klik untuk melacak posisi driver realtime.',
            'link'    => route('delivery.track', $delivery->tracking_code),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengantaran dimulai! GPS Aktif & Notifikasi terkirim.'
        ]);
    }

    /**
     * API Receive GPS Location dari HP Kurir (POST /api/delivery/update-location/{delivery})
     */
    public function updateLocation(Request $request, Delivery $delivery)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $delivery->update([
            'courier_lat' => $request->lat,
            'courier_lng' => $request->lng,
        ]);

        return response()->json([
            'success' => true,
            'lat'     => $delivery->courier_lat,
            'lng'     => $delivery->courier_lng,
        ]);
    }

    /**
     * Halaman Lacak Live Peta Pelanggan (/lacak-pengantaran/{tracking_code})
     */
    public function track(string $tracking_code)
    {
        $delivery = Delivery::with(['service', 'sale'])->where('tracking_code', $tracking_code)->firstOrFail();
        return view('delivery.track', compact('delivery'));
    }

    /**
     * Halaman Khusus Pelanggan / Pengguna untuk Melacak Driver & Orderan Pengantaran (/lacak-pengantaran)
     */
    public function userDeliveries(Request $request)
    {
        $query = Delivery::with(['service', 'sale'])->latest();
        $user = auth()->user();

        // Filter pencarian jika ada input keyword
        if ($request->filled('q')) {
            $keyword = trim($request->q);
            $query->where(function($q) use ($keyword) {
                $q->where('tracking_code', 'like', '%' . $keyword . '%')
                  ->orWhere('customer_name', 'like', '%' . $keyword . '%')
                  ->orWhere('customer_phone', 'like', '%' . $keyword . '%')
                  ->orWhere('courier_name', 'like', '%' . $keyword . '%');
            });
        } elseif ($user) {
            // Jika user login, tampilkan pengantaran milik user
            $query->where(function($q) use ($user) {
                $q->whereHas('sale', function($sq) use ($user) {
                      $sq->where('user_id', $user->id);
                  })
                  ->orWhereHas('service', function($sq) use ($user) {
                      $sq->where('user_id', $user->id);
                  });
                if ($user->phone) {
                    $q->orWhere('customer_phone', $user->phone);
                }
            });
        }

        $deliveries = $query->paginate(10);

        return view('delivery.user_index', compact('deliveries'));
    }

    /**
     * API Get Location Realtime untuk Peta Pelanggan (GET /api/delivery/location/{delivery})
     */
    public function getLocation(Delivery $delivery)
    {
        $distanceMeters = null;
        if ($delivery->courier_lat && $delivery->courier_lng && $delivery->customer_lat && $delivery->customer_lng) {
            $distanceMeters = Delivery::calculateDistanceInMeters(
                $delivery->courier_lat,
                $delivery->courier_lng,
                $delivery->customer_lat,
                $delivery->customer_lng
            );
        }

        return response()->json([
            'status'          => $delivery->status,
            'courier_lat'     => $delivery->courier_lat,
            'courier_lng'     => $delivery->courier_lng,
            'customer_lat'    => $delivery->customer_lat,
            'customer_lng'    => $delivery->customer_lng,
            'distance_meters' => $distanceMeters ? round($distanceMeters) : null,
            'updated_at'      => $delivery->updated_at ? $delivery->updated_at->diffForHumans() : 'Belum aktif',
        ]);
    }

    /**
     * Selesaikan Pengantaran (Verifikasi PIN 4 Digit + Radius Geofencing)
     */
    public function completeDelivery(Request $request, Delivery $delivery)
    {
        $request->validate([
            'pin' => 'required|string|size:4',
        ]);

        if (trim($request->pin) !== trim($delivery->delivery_pin)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode PIN yang dimasukkan salah! Minta 4 digit PIN di HP pelanggan.',
            ], 422);
        }

        // Tandai Pengantaran Selesai
        $delivery->update([
            'status'       => 'selesai',
            'completed_at' => now(),
        ]);

        // Buat Notifikasi Selesai
        Notification::create([
            'type'    => 'service',
            'title'   => '🎉 Pengantaran #' . $delivery->tracking_code . ' Selesai!',
            'message' => 'Pesanan/servis telah diterima oleh ' . $delivery->customer_name . '. Terima kasih telah menggunakan TECHCELL NexusCenter!',
            'link'    => route('delivery.track', $delivery->tracking_code),
        ]);

        // Jika terhubung ke Servis, tandai servis lunas & diambil
        if ($delivery->service) {
            $service = $delivery->service;
            $service->update([
                'deposit' => $service->price,
                'status'  => 'Diambil',
                'notes'   => trim(($service->notes ? $service->notes . "\n" : '') . '[LUNAS & TERKIRIM] Diantar oleh kurir ' . $delivery->courier_name . ' pada ' . date('d/m/Y H:i')),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pengantaran Berhasil Diselesaikan! HP resmi diserahkan kepada pelanggan.',
        ]);
    }

    /**
     * Update data pengantaran (Ganti nama/nomor kurir atau penerima)
     */
    public function update(Request $request, Delivery $delivery)
    {
        $data = $request->validate([
            'courier_name'     => 'required|string|max:100',
            'courier_phone'    => 'required|string|max:20',
            'customer_name'    => 'required|string|max:100',
            'customer_phone'   => 'required|string|max:20',
            'customer_address' => 'required|string',
            'status'           => 'required|in:pending,diantar,selesai,batal',
        ]);

        $delivery->update($data);

        return back()->with('success', 'Data pengantaran #' . $delivery->tracking_code . ' berhasil diperbarui!');
    }

    /**
     * Hapus data pengantaran
     */
    public function destroy(Delivery $delivery)
    {
        $delivery->delete();
        return back()->with('success', 'Data pengantaran berhasil dihapus!');
    }
}
