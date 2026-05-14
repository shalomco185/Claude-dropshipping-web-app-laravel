<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@dropship.test'],
            [
                'name' => 'Demo Owner',
                'password' => Hash::make('password'),
                'plan' => 'professional',
                'trial_ends_at' => now()->addDays(14),
                'email_verified_at' => now(),
            ],
        );

        $store = Store::firstOrCreate(
            ['user_id' => $user->id, 'domain' => 'demo-store'],
            [
                'name' => 'Demo Store',
                'currency' => 'USD',
                'language' => 'en',
                'is_active' => true,
            ],
        );

        if ($store->products()->count() === 0) {
            collect([
                ['Wireless headphones', 79.99],
                ['Smart fitness watch', 129.99],
                ['Eco bamboo toothbrush', 9.99],
                ['Aroma diffuser', 39.99],
                ['Portable mini projector', 159.99],
            ])->each(function ($p) use ($store) {
                Product::create([
                    'store_id' => $store->id,
                    'title' => $p[0],
                    'slug' => Str::slug($p[0]) . '-' . Str::random(4),
                    'description' => "High quality {$p[0]} for everyday use.",
                    'price' => $p[1],
                    'cost' => $p[1] * 0.3,
                    'stock' => rand(20, 200),
                    'images' => ['https://via.placeholder.com/600x600/6366f1/ffffff?text=' . urlencode($p[0])],
                    'status' => 'active',
                ]);
            });
        }

        if ($store->customers()->count() === 0) {
            collect(range(1, 5))->each(function ($i) use ($store) {
                Customer::create([
                    'store_id' => $store->id,
                    'name' => "Customer {$i}",
                    'email' => "customer{$i}@example.com",
                    'total_orders' => rand(1, 5),
                    'total_spent' => rand(100, 1000),
                    'last_order_at' => now()->subDays(rand(1, 30)),
                ]);
            });
        }

        if ($store->orders()->count() === 0) {
            $customers = $store->customers;
            collect(range(1, 8))->each(function ($i) use ($store, $customers) {
                $statuses = ['pending', 'processing', 'shipped', 'delivered'];
                Order::create([
                    'store_id' => $store->id,
                    'customer_id' => $customers->random()->id,
                    'order_number' => 'ORD' . str_pad((string) (1000 + $i), 5, '0', STR_PAD_LEFT),
                    'status' => $statuses[array_rand($statuses)],
                    'payment_status' => 'paid',
                    'subtotal' => rand(20, 500),
                    'tax' => rand(2, 50),
                    'shipping' => rand(0, 25),
                    'total' => rand(40, 600),
                    'currency' => 'USD',
                    'items' => [
                        ['title' => 'Sample item', 'quantity' => 1, 'price' => 50],
                    ],
                ]);
            });
        }
    }
}
