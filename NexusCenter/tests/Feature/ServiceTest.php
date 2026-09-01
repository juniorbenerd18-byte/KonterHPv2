<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['role' => 'kasir', 'is_active' => true]);
    }

    public function test_service_list_can_be_rendered(): void
    {
        Service::create([
            'nota_number' => 'NEX-20260831-0001',
            'customer_name' => 'Andi',
            'customer_phone' => '0811223344',
            'device' => 'iPhone 13',
            'service_type' => 'Ganti LCD',
            'status' => 'Diterima',
            'price' => 1500000,
        ]);

        $response = $this->actingAs($this->user)->get('/servis');

        $response->assertStatus(200);
        $response->assertSee('NEX-20260831-0001');
        $response->assertSee('iPhone 13');
    }

    public function test_service_can_be_created(): void
    {
        $response = $this->actingAs($this->user)->post('/servis', [
            'customer_name' => 'Siti',
            'customer_phone' => '08987654321',
            'device' => 'Samsung S22',
            'service_type' => 'Ganti Baterai',
            'issue' => 'Baterai kembung dan cepat habis',
            'price' => 450000,
            'deposit' => 100000,
            'status' => 'Diterima',
            'technician' => 'Budi Tech',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('services', [
            'customer_name' => 'Siti',
            'device' => 'Samsung S22',
            'service_type' => 'Ganti Baterai',
            'price' => 450000,
            'deposit' => 100000,
        ]);
    }

    public function test_service_status_can_be_updated(): void
    {
        $service = Service::create([
            'nota_number' => 'NEX-20260831-0002',
            'customer_name' => 'Rudi',
            'customer_phone' => '081299990000',
            'device' => 'Xiaomi 12',
            'service_type' => 'Flash IC',
            'status' => 'Diterima',
        ]);

        $response = $this->actingAs($this->user)->patchJson("/servis/{$service->id}/status", [
            'status' => 'Selesai',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true, 'status' => 'Selesai']);
        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'status' => 'Selesai',
        ]);
    }

    public function test_service_can_be_deleted_by_admin(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $service = Service::create([
            'nota_number' => 'NEX-20260831-0003',
            'customer_name' => 'Joko',
            'customer_phone' => '0877112233',
            'device' => 'Oppo Reno 8',
            'service_type' => 'Servis Speaker',
            'status' => 'Diterima',
        ]);

        $response = $this->actingAs($admin)->delete("/servis/{$service->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('services', [
            'id' => $service->id,
        ]);
    }

    public function test_kasir_cannot_delete_service(): void
    {
        $kasir = User::factory()->create(['role' => 'kasir', 'is_active' => true]);
        $service = Service::create([
            'nota_number' => 'NEX-20260831-0004',
            'customer_name' => 'Budi',
            'customer_phone' => '0877112233',
            'device' => 'Oppo Reno 8',
            'service_type' => 'Servis Speaker',
            'status' => 'Diterima',
        ]);

        $response = $this->actingAs($kasir)->delete("/servis/{$service->id}");

        $response->assertRedirect('/dashboard');
        $this->assertDatabaseHas('services', [
            'id' => $service->id,
        ]);
    }

    public function test_customer_can_booking_service_and_trigger_notification(): void
    {
        $customer = User::factory()->create(['role' => 'pengguna', 'is_active' => true]);

        $response = $this->actingAs($customer)->post('/booking-servis', [
            'customer_name' => 'Pelanggan Baru',
            'customer_phone' => '08123456789',
            'device' => 'iPhone 14 Pro',
            'service_type' => 'Ganti Baterai',
            'issue' => 'Baterai boros',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('services', [
            'customer_name' => 'Pelanggan Baru',
            'device' => 'iPhone 14 Pro',
            'service_type' => 'Ganti Baterai',
            'status' => 'Diterima',
        ]);

        $this->assertDatabaseHas('notifications', [
            'type' => 'service',
        ]);
    }
}
