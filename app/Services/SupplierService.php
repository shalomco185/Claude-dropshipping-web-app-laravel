<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Store;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class SupplierService
{
    /**
     * Import a product from a supplier URL.
     */
    public function importFromUrl(Store $store, string $url, string $supplierType, bool $aiEnhance = false): Product
    {
        $payload = $this->fetchProductData($url, $supplierType);

        $product = Product::create([
            'store_id' => $store->id,
            'external_id' => $payload['external_id'] ?? null,
            'title' => $payload['title'],
            'slug' => Str::slug($payload['title']) . '-' . Str::random(6),
            'description' => $payload['description'] ?? '',
            'price' => $payload['price'] ?? 0,
            'compare_price' => $payload['compare_price'] ?? null,
            'cost' => $payload['cost'] ?? null,
            'stock' => $payload['stock'] ?? 0,
            'images' => $payload['images'] ?? [],
            'variants' => $payload['variants'] ?? [],
            'tags' => $payload['tags'] ?? [],
            'status' => 'draft',
        ]);

        if ($aiEnhance) {
            try {
                $ai = app(AIService::class);
                $description = $ai->generateProductDescription($product->title, $payload['features'] ?? []);
                $product->update(['ai_description' => $description]);
            } catch (Throwable $e) {
                report($e);
            }
        }

        return $product;
    }

    /**
     * Fetch product data from the relevant supplier.
     * Returns a normalised array. In production, this would integrate the
     * supplier APIs and HTML scrapers - here we return a sane placeholder.
     */
    protected function fetchProductData(string $url, string $supplierType): array
    {
        return match ($supplierType) {
            'aliexpress' => $this->fetchFromAliexpress($url),
            'cjdropshipping' => $this->fetchFromCjDropshipping($url),
            'zendrop' => $this->fetchFromZendrop($url),
            'amazon' => $this->fetchFromAmazon($url),
            'temu' => $this->fetchFromTemu($url),
            default => $this->placeholder($url),
        };
    }

    protected function fetchFromAliexpress(string $url): array
    {
        // Real implementation requires AliExpress Affiliate / Open API.
        return $this->placeholder($url, 'AliExpress');
    }

    protected function fetchFromCjDropshipping(string $url): array
    {
        $key = config('services.cj_dropshipping.api_key');
        if ($key) {
            try {
                $response = Http::withHeaders(['CJ-Access-Token' => $key])
                    ->timeout(15)
                    ->get(config('services.cj_dropshipping.base_url') . '/product/query', [
                        'productUrl' => $url,
                    ]);

                if ($response->successful()) {
                    $data = $response->json('data', []);

                    return [
                        'external_id' => $data['pid'] ?? null,
                        'title' => $data['productNameEn'] ?? 'Imported product',
                        'description' => $data['description'] ?? '',
                        'price' => (float) ($data['sellPrice'] ?? 0),
                        'cost' => (float) ($data['sellPrice'] ?? 0),
                        'stock' => (int) ($data['inventory'] ?? 0),
                        'images' => $data['productImageSet'] ?? [],
                        'variants' => $data['variants'] ?? [],
                    ];
                }
            } catch (Throwable $e) {
                report($e);
            }
        }

        return $this->placeholder($url, 'CJDropshipping');
    }

    protected function fetchFromZendrop(string $url): array
    {
        return $this->placeholder($url, 'Zendrop');
    }

    protected function fetchFromAmazon(string $url): array
    {
        return $this->placeholder($url, 'Amazon');
    }

    protected function fetchFromTemu(string $url): array
    {
        return $this->placeholder($url, 'Temu');
    }

    protected function placeholder(string $url, string $source = 'Supplier'): array
    {
        return [
            'external_id' => 'ext-' . Str::random(10),
            'title' => "Imported product from {$source}",
            'description' => "This product was imported from {$source}. Source URL: {$url}",
            'price' => 29.99,
            'compare_price' => 49.99,
            'cost' => 9.99,
            'stock' => 100,
            'images' => [
                'https://via.placeholder.com/600x600/6366f1/ffffff?text=Imported+Product',
            ],
            'variants' => [],
            'tags' => [strtolower($source), 'imported'],
            'features' => ['High quality', 'Fast shipping', 'Best seller'],
        ];
    }
}
