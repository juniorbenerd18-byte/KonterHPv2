<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Notification;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();

        if ($request->filled('q')) {
            $query->where(function($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->q . '%')
                  ->orWhere('customer_phone', 'like', '%' . $request->q . '%')
                  ->orWhere('nota_number', 'like', '%' . $request->q . '%')
                  ->orWhere('device', 'like', '%' . $request->q . '%');
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $services = $query->latest()->get();
        return view('services.index', compact('services'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name'  => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'device'         => 'required|string|max:100',
            'service_type'   => 'required|string|max:100',
            'issue'          => 'nullable|string',
            'price'          => 'nullable|integer|min:0',
            'deposit'        => 'nullable|integer|min:0',
            'status'         => 'required|in:Diterima,Dalam Proses,Menunggu Sparepart,Selesai,Diambil',
            'estimated_date' => 'nullable|date',
            'technician'     => 'nullable|string|max:100',
            'notes'          => 'nullable|string',
        ]);

        $data['nota_number'] = Service::generateNotaNumber();
        $data['price']   = $data['price'] ?? 0;
        $data['deposit'] = $data['deposit'] ?? 0;

        Service::create($data);

        return back()->with('success', 'Data servis berhasil disimpan!');
    }

    public function updateStatus(Request $request, Service $service)
    {
        $request->validate([
            'status' => 'required|in:Diterima,Dalam Proses,Menunggu Sparepart,Selesai,Diambil',
        ]);

        $service->update(['status' => $request->status]);

        return response()->json(['success' => true, 'status' => $service->status]);
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return back()->with('success', 'Data servis berhasil dihapus!');
    }

    public function receipt(Service $service)
    {
        return view('services.receipt', compact('service'));
    }

    public function track(Request $request)
    {
        // FIX #4: Return koleksi $services (bukan single $service)
        // sehingga view bisa tampilkan semua servis jika cari by nomor HP
        $services = collect();
        if ($request->filled('q')) {
            $q = trim($request->q);

            // Cek apakah input adalah nomor nota (format SRV-YYYYMMDD-XXXX)
            $isNota = preg_match('/^SRV-\d{8}-\d{4}$/i', $q);

            if ($isNota) {
                // Cari exact match by nota number → hasilnya max 1
                $found = Service::with('delivery')->where('nota_number', $q)->first();
                if ($found) $services = collect([$found]);
            } else {
                // Cari by nomor HP → bisa multiple
                $services = Service::with('delivery')->where('customer_phone', $q)
                    ->latest()
                    ->get();
            }
        }

        return view('services.tracking', compact('services'));
    }

    public function storeBooking(Request $request)
    {
        $data = $request->validate([
            'customer_name'  => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'device'         => 'required|string|max:100',
            'service_type'   => 'required|string|max:100',
            'issue'          => 'nullable|string',
        ]);

        // FIX #5: Cek apakah nomor HP sudah punya servis aktif (belum Diambil)
        $activeService = Service::where('customer_phone', $data['customer_phone'])
            ->whereNotIn('status', ['Diambil'])
            ->latest()
            ->first();

        if ($activeService) {
            return back()
                ->withInput()
                ->withErrors([
                    'customer_phone' => 'Nomor HP ini masih memiliki servis aktif (' .
                        $activeService->nota_number . ' — ' . $activeService->status .
                        '). Selesaikan servis sebelumnya terlebih dahulu atau hubungi kami langsung.',
                ]);
        }

        $data['nota_number'] = Service::generateNotaNumber();
        $data['status'] = 'Diterima';
        $data['price'] = 0;
        $data['deposit'] = 0;
        if (auth()->check()) {
            $data['user_id'] = auth()->id();
        }

        $service = Service::create($data);

        // Notification for Admin/Kasir
        Notification::create([
            'type'    => 'service',
            'title'   => '🔧 Booking Servis Baru #' . $service->nota_number,
            'message' => 'Booking ' . $service->service_type . ' (' . $service->device . ') oleh ' . $service->customer_name,
        ]);

        return redirect()->route('services.receipt', $service->id)->with('success', 'Booking servis Anda berhasil dikirim! Simpan Nomor Nota ini untuk pelacakan.');
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'customer_name'  => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'device'         => 'required|string|max:100',
            'service_type'   => 'required|string|max:100',
            'issue'          => 'nullable|string',
            'price'          => 'required|integer|min:0',
            'deposit'        => 'required|integer|min:0',
            'status'         => 'required|in:Diterima,Dalam Proses,Menunggu Sparepart,Selesai,Diambil',
            'estimated_date' => 'nullable|date',
            'technician'     => 'nullable|string|max:100',
            'notes'          => 'nullable|string',
        ]);

        $service->update($data);

        return back()->with('success', 'Detail & estimasi servis #' . $service->nota_number . ' berhasil diperbarui!');
    }

    public function pay(Request $request, Service $service)
    {
        $request->validate([
            'amount_paid'    => 'required|integer|min:0',
            'payment_method' => 'required|string',
        ]);

        $remaining = $service->remaining_payment;
        if ($request->amount_paid < $remaining) {
            return back()->with('error', 'Jumlah pembayaran (Rp ' . number_format($request->amount_paid, 0, ',', '.') . ') kurang dari sisa tagihan (Rp ' . number_format($remaining, 0, ',', '.') . ').');
        }

        // Tandai deposit = total price (pelunasan penuh) dan status = Diambil
        $service->update([
            'deposit' => $service->price,
            'status'  => 'Diambil',
            'notes'   => trim(($service->notes ? $service->notes . "\n" : '') . '[LUNAS] Pelunasan sisa via ' . $request->payment_method . ' sebesar Rp ' . number_format($remaining, 0, ',', '.') . ' pada ' . date('d/m/Y H:i'))
        ]);

        return back()->with('success', 'Pelunasan servis #' . $service->nota_number . ' berhasil diproses! Perangkat resmi diserahkan.');
    }

    public function userHistory(Request $request)
    {
        $user = auth()->user();
        $query = Service::query();

        // Cari berdasarkan ID user atau nama pelanggan yang cocok
        $query->where(function ($q) use ($user) {
            if ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('customer_name', $user->name);
            }
        });

        // Filter status jika ada
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter pencarian kata kunci
        if ($request->filled('q')) {
            $keyword = trim($request->q);
            $query->where(function ($q) use ($keyword) {
                $q->where('nota_number', 'like', '%' . $keyword . '%')
                  ->orWhere('device', 'like', '%' . $keyword . '%')
                  ->orWhere('service_type', 'like', '%' . $keyword . '%');
            });
        }

        $services = $query->with('delivery')->latest()->paginate(10);

        return view('profile.service_history', compact('user', 'services'));
    }
}
