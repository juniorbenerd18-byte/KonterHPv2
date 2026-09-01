<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    }

    public function test_product_list_can_be_rendered(): void
    {
        Product::create([
            'name' => 'Samsung S24',
            'category' => 'smartphone',
            'price' => 15000000,
            'stock' => 10,
        ]);

        $response = $this->actingAs($this->user)->get('/produk');

        $response->assertStatus(200);
        $response->assertSee('Samsung S24');
    }

    public function test_product_can_be_created_by_admin(): void
    {
        $response = $this->actingAs($this->user)->post('/produk', [
            'name' => 'Charger Anker 65W',
            'category' => 'aksesoris',
            'brand' => 'Anker',
            'price' => 350000,
            'stock' => 15,
            'icon' => '🔌',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'name' => 'Charger Anker 65W',
            'price' => 350000,
            'stock' => 15,
        ]);
    }

    public function test_kasir_cannot_create_product(): void
    {
        $kasir = User::factory()->create(['role' => 'kasir', 'is_active' => true]);

        $response = $this->actingAs($kasir)->post('/produk', [
            'name' => 'Unauthorized Product',
            'category' => 'aksesoris',
            'price' => 50000,
            'stock' => 5,
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertDatabaseMissing('products', ['name' => 'Unauthorized Product']);
    }

    public function test_product_can_be_updated_by_admin(): void
    {
        $product = Product::create([
            'name' => 'Product Old',
            'category' => 'aksesoris',
            'price' => 10000,
            'stock' => 5,
        ]);

        $response = $this->actingAs($this->user)->put("/produk/{$product->id}", [
            'name' => 'Product Updated',
            'category' => 'aksesoris',
            'price' => 12000,
            'stock' => 8,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Product Updated',
            'price' => 12000,
        ]);
    }

    public function test_product_can_be_soft_deleted_by_admin(): void
    {
        $product = Product::create([
            'name' => 'Product to Delete',
            'category' => 'pulsa',
            'price' => 50000,
            'stock' => 100,
        ]);

        $response = $this->actingAs($this->user)->delete("/produk/{$product->id}");

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_active' => false,
        ]);
    }

    public function test_api_product_list_returns_active_products(): void
    {
        Product::create([
            'name' => 'Active Product',
            'category' => 'smartphone',
            'price' => 5000000,
            'stock' => 5,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/produk');

        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Active Product']);
    }
}
