<?php

namespace App\Services;

use OpenAI;
use OpenAI\Client;
use Throwable;

class AIService
{
    protected ?Client $client = null;

    protected string $model;

    public function __construct()
    {
        $this->model = config('services.openai.model', 'gpt-4o-mini');

        if (config('services.openai.api_key')) {
            $this->client = OpenAI::client(config('services.openai.api_key'));
        }
    }

    /**
     * Generate a product description.
     */
    public function generateProductDescription(string $productTitle, array $features = [], string $tone = 'professional'): string
    {
        $featureText = $features ? "Features:\n- " . implode("\n- ", $features) : '';

        $prompt = <<<PROMPT
Write a compelling, SEO-optimised product description for an e-commerce product.

Product: {$productTitle}
{$featureText}
Tone: {$tone}

Requirements:
- 120-180 words
- Use persuasive copy that converts
- Include benefits, not just features
- End with a soft call to action
- Use short paragraphs and scannable text
PROMPT;

        return $this->complete($prompt, 'You are a senior e-commerce copywriter.');
    }

    /**
     * Generate ad copy for a given platform.
     */
    public function generateAdCopy(string $product, string $platform = 'facebook', string $audience = 'general'): array
    {
        $prompt = <<<PROMPT
Generate 3 high-converting ad copy variations for the {$platform} platform.

Product: {$product}
Target Audience: {$audience}

Format each variation as JSON with:
- headline (max 40 chars)
- primary_text (max 125 chars for facebook, 90 for google, 100 for tiktok)
- cta (single short call to action)

Return only a JSON array.
PROMPT;

        $raw = $this->complete($prompt, 'You are a direct-response advertising expert.');

        $decoded = json_decode($raw, true);

        return is_array($decoded) ? $decoded : [
            [
                'headline' => 'Discover ' . $product,
                'primary_text' => 'Upgrade your routine with ' . $product . ' - loved by thousands of happy customers.',
                'cta' => 'Shop Now',
            ],
        ];
    }

    /**
     * Generate SEO meta data.
     */
    public function generateSeo(string $title, string $description = ''): array
    {
        $prompt = <<<PROMPT
Generate SEO meta data for an e-commerce product page.

Product Title: {$title}
Product Description: {$description}

Return strictly a JSON object with:
- meta_title (max 60 chars)
- meta_description (max 155 chars)
- keywords (comma separated, 5-8 keywords)
- slug (URL friendly slug)
PROMPT;

        $raw = $this->complete($prompt, 'You are an SEO specialist.');

        $decoded = json_decode($raw, true);

        return is_array($decoded) ? $decoded : [
            'meta_title' => substr($title, 0, 60),
            'meta_description' => substr($description, 0, 155),
            'keywords' => '',
            'slug' => str()->slug($title),
        ];
    }

    /**
     * Internal completion helper. Falls back to a stubbed response when no API key is configured.
     */
    protected function complete(string $prompt, string $system = 'You are a helpful assistant.'): string
    {
        if (! $this->client) {
            return $this->fallbackResponse($prompt);
        }

        try {
            $response = $this->client->chat()->create([
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => $system],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.7,
            ]);

            return trim($response->choices[0]->message->content ?? '');
        } catch (Throwable $e) {
            report($e);

            return $this->fallbackResponse($prompt);
        }
    }

    protected function fallbackResponse(string $prompt): string
    {
        return "AI service is not configured. Please add your OPENAI_API_KEY to your .env file. "
            . "Prompt received: " . substr($prompt, 0, 80) . '...';
    }
}
