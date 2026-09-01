<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Public Landing Page & Promo
Route::get('/', function () {
    if (auth()->check() && auth()->user()->isStaff()) {
        return redirect()->route('dashboard');
    }
    $products = \App\Models\Product::where('is_active', true)->latest()->take(8)->get();
    return view('welcome', compact('products'));
})->name('home');

Route::get('/promo', [PromoController::class, 'index'])->name('promos.index');
Route::get('/lacak-servis', [ServiceController::class, 'track'])->name('services.track');
Route::get('/booking-servis', function () {
    return view('services.booking');
})->name('services.booking');
Route::post('/booking-servis', [ServiceController::class, 'storeBooking'])->name('services.booking.store');

// FIX #1: Nota servis bisa diakses publik (pelanggan booking perlu lihat konfirmasi tanpa login)
Route::get('/servis/{service}/nota', [ServiceController::class, 'receipt'])->name('services.receipt');

// GPS Courier Delivery Routes (Public Access for Tracking & Courier HP)
Route::get('/lacak-pengantaran', [\App\Http\Controllers\DeliveryController::class, 'userDeliveries'])->name('delivery.userIndex');
Route::get('/lacak-pengantaran/{tracking_code}', [\App\Http\Controllers\DeliveryController::class, 'track'])->name('delivery.track');
Route::get('/k/{tracking_code}', [\App\Http\Controllers\DeliveryController::class, 'courierTask'])->name('delivery.courier.task');
Route::get('/tugas-kurir', [\App\Http\Controllers\DeliveryController::class, 'courierDashboard'])->name('delivery.courier.dashboard');
Route::get('/api/delivery/location/{delivery}', [\App\Http\Controllers\DeliveryController::class, 'getLocation'])->name('api.delivery.location');
Route::post('/api/delivery/update-location/{delivery}', [\App\Http\Controllers\DeliveryController::class, 'updateLocation'])->name('api.delivery.updateLocation');
Route::post('/pengantaran/{delivery}/start', [\App\Http\Controllers\DeliveryController::class, 'startDelivery'])->name('delivery.start');
Route::post('/pengantaran/{delivery}/complete', [\App\Http\Controllers\DeliveryController::class, 'completeDelivery'])->name('delivery.complete');

Route::get('/pulsa-data', function () {
    return view('pulsa.index');
})->name('pulsa.index');

// Protected routes for all authenticated users (Admin, Kasir, Pengguna)
Route::middleware('auth')->group(function () {
    // Shared features for Pengguna / All Users
    Route::get('/produk', [ProductController::class, 'index'])->name('products.index');
    Route::get('/api/produk', [ProductController::class, 'apiList'])->name('products.api');

    // Cart, Checkout, Profile, Riwayat Servis & Receipts (all authenticated users)
    Route::get('/profil', [\App\Http\Controllers\ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profil', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::get('/profil/riwayat-servis', [ServiceController::class, 'userHistory'])->name('profile.services');
    Route::get('/keranjang', [CartController::class, 'index'])->name('cart.index');
    Route::post('/keranjang/tambah/{product}', [CartController::class, 'add'])->name('cart.add');
    Route::post('/keranjang/update/{product}', [CartController::class, 'updateQty'])->name('cart.update');
    Route::delete('/keranjang/hapus/{product}', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/keranjang/kosongkan', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');
    // Receipt accessible by all users (pengguna sees their own order after checkout)
    Route::get('/penjualan/{sale}/struk', [SaleController::class, 'receipt'])->name('sales.receipt');

    // Staff Only Routes (Admin & Kasir)
    Route::middleware('staff')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Notifications
        Route::post('/notifications/{notification}/read', [DashboardController::class, 'markNotificationRead'])->name('notifications.read');
        Route::post('/notifications/read-all', [DashboardController::class, 'markAllNotificationsRead'])->name('notifications.readAll');

        // Sales / POS
        Route::get('/penjualan', [SaleController::class, 'index'])->name('sales.index');
        Route::post('/penjualan', [SaleController::class, 'store'])->name('sales.store');

        // Service Management
        Route::get('/servis', [ServiceController::class, 'index'])->name('services.index');
        Route::post('/servis', [ServiceController::class, 'store'])->name('services.store');
        Route::put('/servis/{service}', [ServiceController::class, 'update'])->name('services.update');
        Route::post('/servis/{service}/pay', [ServiceController::class, 'pay'])->name('services.pay');
        Route::patch('/servis/{service}/status', [ServiceController::class, 'updateStatus'])->name('services.status');

        // Delivery Management
        Route::get('/manajemen-pengantaran', [\App\Http\Controllers\DeliveryController::class, 'index'])->name('delivery.index');
        Route::post('/manajemen-pengantaran', [\App\Http\Controllers\DeliveryController::class, 'store'])->name('delivery.store');
        Route::put('/manajemen-pengantaran/{delivery}', [\App\Http\Controllers\DeliveryController::class, 'update'])->name('delivery.update');
        Route::delete('/manajemen-pengantaran/{delivery}', [\App\Http\Controllers\DeliveryController::class, 'destroy'])->name('delivery.destroy');
        // Nota route sudah dipindah ke public (lihat di atas), staff tetap bisa akses via URL yang sama

        // History
        Route::get('/riwayat', [HistoryController::class, 'index'])->name('history.index');
    });

    // Admin Only Routes
    Route::middleware('admin')->group(function () {
        // Products Management
        Route::post('/produk', [ProductController::class, 'store'])->name('products.store');
        Route::put('/produk/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/produk/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

        // Service Deletion
        Route::delete('/servis/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');

        // Reports / Laporan
        Route::get('/laporan', [ReportController::class, 'index'])->name('reports.index');
    });
});
