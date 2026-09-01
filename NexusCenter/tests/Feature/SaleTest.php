<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaleTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['name' => 'CashierUser', 'role' => 'kasir', 'is_active' => true]);
    }

    public function test_pos_page_can_be_rendered(): void
    {
        $response = $this->actingAs($this->user)->get('/penjualan');
        $response->assertStatus(200);
    }

    public function test_sale_transaction_can_be_completed(): void
    {
        $product = Product::create([
            'name' => 'Test Product',
            'category' => 'aksesoris',
            'price' => 100000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->user)->postJson('/penjualan', [
            'items' => [
                ['id' => $product->id, 'qty' => 2]
            ],
            'discount' => 10,
            'payment_method' => 'Tunai',
            'amount_paid' => 200000,
            'customer_name' => 'Budi',
            'customer_phone' => '08123456789',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Stock should be decremented from 10 to 8
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 8,
        ]);

        // Subtotal = 200,000, Discount = 10% (20,000), Total = 180,000, Change = 20,000
        $this->assertDatabaseHas('sales', [
            'customer_name' => 'Budi',
            'subtotal' => 200000,
            'discount' => 10,
            'total' => 180000,
            'amount_paid' => 200000,
            'change_amount' => 20000,
            'cashier_name' => 'CashierUser',
        ]);
    }

    public function test_sale_fails_if_insufficient_stock(): void
    {
        $product = Product::create([
            'name' => 'Limited Product',
            'category' => 'smartphone',
            'price' => 1000000,
            'stock' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->user)->postJson('/penjualan', [
            'items' => [
                ['id' => $product->id, 'qty' => 5]
            ],
            'payment_method' => 'Tunai',
            'amount_paid' => 5000000,
        ]);

        $response->assertStatus(422);
    }
}
