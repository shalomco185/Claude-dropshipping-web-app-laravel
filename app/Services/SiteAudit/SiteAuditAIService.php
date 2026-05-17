<?php

namespace App\Services\SiteAudit;

use Illuminate\Support\Facades\Http;
use OpenAI;
use Throwable;

class SiteAuditAIService
{
    private string $provider;

    public function __construct()
    {
        $this->provider = config('siteaudit.ai_provider', 'anthropic');
    }

    /**
     * Run full AI analysis on aggregated audit data.
     */
    public function analyse(string $domain, array $semrush, array $screamingFrog, array $crawl): array
    {
        $dataJson = json_encode([
            'domain' => $domain,
            'semrush' => $semrush,
            'technical_seo' => $screamingFrog,
            'crawl' => $crawl,
        ], JSON_PRETTY_PRINT);

        $systemPrompt = <<<'SYSTEM'
You are a senior SEO consultant and web performance specialist with 15 years of experience.
Your task is to analyse a website audit dataset and produce a structured JSON analysis.
Be precise, data-driven, and prioritise actionable insights. Score each area 0-100.
SYSTEM;

        $userPrompt = <<<PROMPT
Analyse the following site audit data for {$domain} and return a JSON object with this exact structure:

{
  "overall_score": <integer 0-100>,
  "executive_summary": "<2-3 sentence executive summary>",
  "scores": {
    "technical_seo": <integer 0-100>,
    "on_page_seo": <integer 0-100>,
    "backlink_profile": <integer 0-100>,
    "performance": <integer 0-100>,
    "content_quality": <integer 0-100>
  },
  "top_issues": [
    {"priority": "critical|high|medium|low", "category": "<category>", "issue": "<issue>", "recommendation": "<recommendation>"}
  ],
  "quick_wins": ["<actionable item>"],
  "strengths": ["<strength>"],
  "action_plan": [
    {"week": "Week 1-2", "tasks": ["<task>"]},
    {"week": "Week 3-4", "tasks": ["<task>"]},
    {"week": "Month 2-3", "tasks": ["<task>"]}
  ],
  "keyword_insights": "<2-3 sentences about keyword strategy>",
  "backlink_insights": "<2-3 sentences about backlink profile>",
  "technical_insights": "<2-3 sentences about technical health>"
}

Audit Data:
{$dataJson}

Return only valid JSON, no markdown or explanation.
PROMPT;

        try {
            $raw = match ($this->provider) {
                'anthropic' => $this->callAnthropic($systemPrompt, $userPrompt),
                'openai' => $this->callOpenAI($systemPrompt, $userPrompt),
                default => null,
            };

            if ($raw) {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    return $decoded;
                }
            }
        } catch (Throwable $e) {
            report($e);
        }

        return $this->fallbackAnalysis($domain, $semrush, $screamingFrog);
    }

    private function callAnthropic(string $system, string $user): string
    {
        $apiKey = config('siteaudit.anthropic_api_key');

        if (! $apiKey) {
            throw new \RuntimeException('Anthropic API key not configured.');
        }

        $response = Http::withHeaders([
            'x-api-key' => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->timeout(60)->post('https://api.anthropic.com/v1/messages', [
            'model' => config('siteaudit.anthropic_model', 'claude-sonnet-4-6'),
            'max_tokens' => 4096,
            'system' => $system,
            'messages' => [
                ['role' => 'user', 'content' => $user],
            ],
        ]);

        if ($response->failed()) {
            throw new \RuntimeException('Anthropic API error: ' . $response->body());
        }

        return $response->json('content.0.text', '');
    }

    private function callOpenAI(string $system, string $user): string
    {
        $apiKey = config('services.openai.api_key');

        if (! $apiKey) {
            throw new \RuntimeException('OpenAI API key not configured.');
        }

        $client = OpenAI::client($apiKey);

        $response = $client->chat()->create([
            'model' => config('services.openai.model', 'gpt-4o'),
            'response_format' => ['type' => 'json_object'],
            'messages' => [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => $user],
            ],
            'temperature' => 0.3,
        ]);

        return trim($response->choices[0]->message->content ?? '');
    }

    private function fallbackAnalysis(string $domain, array $semrush, array $screamingFrog): array
    {
        $totalPages = $screamingFrog['total_pages'] ?? 0;
        $issues = $screamingFrog['issues'] ?? [];
        $errorCount = count(array_filter($issues, fn ($i) => ($i['type'] ?? '') === 'error'));

        $score = max(30, 100 - ($errorCount * 10));

        return [
            'overall_score' => $score,
            'executive_summary' => "Site audit for {$domain} completed. Configure AI provider keys (ANTHROPIC_API_KEY or OPENAI_API_KEY) for detailed AI-generated insights.",
            'scores' => [
                'technical_seo' => $score,
                'on_page_seo' => $score,
                'backlink_profile' => 50,
                'performance' => 50,
                'content_quality' => 50,
            ],
            'top_issues' => array_map(fn ($i) => [
                'priority' => $i['type'] === 'error' ? 'high' : 'medium',
                'category' => 'Technical SEO',
                'issue' => $i['message'],
                'recommendation' => 'Review and fix this issue as soon as possible.',
            ], $issues),
            'quick_wins' => [
                'Add missing title tags',
                'Fill in meta descriptions',
                'Fix broken links (4xx errors)',
            ],
            'strengths' => ['Site is crawlable'],
            'action_plan' => [
                ['week' => 'Week 1-2', 'tasks' => ['Fix critical technical errors', 'Add missing meta tags']],
                ['week' => 'Week 3-4', 'tasks' => ['Optimise page titles', 'Build internal linking']],
                ['week' => 'Month 2-3', 'tasks' => ['Content strategy', 'Link building']],
            ],
            'keyword_insights' => 'Configure SEMRUSH_API_KEY for keyword data.',
            'backlink_insights' => 'Configure SEMRUSH_API_KEY for backlink data.',
            'technical_insights' => "{$totalPages} pages analysed. {$errorCount} critical issues found.",
        ];
    }
}
