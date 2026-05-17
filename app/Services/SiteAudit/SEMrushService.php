<?php

namespace App\Services\SiteAudit;

use Illuminate\Support\Facades\Http;
use Throwable;

class SEMrushService
{
    private const BASE_URL = 'https://api.semrush.com';

    private ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('siteaudit.semrush_api_key');
    }

    public function getDomainOverview(string $domain, string $database = 'us'): array
    {
        if (! $this->apiKey) {
            return $this->stub('domain_overview', $domain);
        }

        try {
            $response = Http::timeout(30)->get(self::BASE_URL . '/', [
                'type' => 'domain_ranks',
                'key' => $this->apiKey,
                'export_columns' => 'Db,Dn,Rk,Or,Ot,Oc,Ad,At,Ac',
                'domain' => $domain,
                'database' => $database,
            ]);

            return $this->parseCsvResponse($response->body(), [
                'database', 'domain', 'rank', 'organic_keywords',
                'organic_traffic', 'organic_cost', 'adwords_keywords',
                'adwords_traffic', 'adwords_cost',
            ]);
        } catch (Throwable $e) {
            report($e);

            return $this->stub('domain_overview', $domain);
        }
    }

    public function getOrganicKeywords(string $domain, string $database = 'us', int $limit = 10): array
    {
        if (! $this->apiKey) {
            return $this->stub('organic_keywords', $domain);
        }

        try {
            $response = Http::timeout(30)->get(self::BASE_URL . '/', [
                'type' => 'domain_organic',
                'key' => $this->apiKey,
                'export_columns' => 'Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td',
                'domain' => $domain,
                'database' => $database,
                'display_limit' => $limit,
                'display_sort' => 'tr_desc',
            ]);

            return $this->parseCsvLines($response->body());
        } catch (Throwable $e) {
            report($e);

            return $this->stub('organic_keywords', $domain);
        }
    }

    public function getBacklinksOverview(string $domain): array
    {
        if (! $this->apiKey) {
            return $this->stub('backlinks', $domain);
        }

        try {
            $response = Http::timeout(30)->get(self::BASE_URL . '/analytics/v1/', [
                'action' => 'report',
                'type' => 'backlinks_overview',
                'key' => $this->apiKey,
                'target' => $domain,
                'target_type' => 'root_domain',
                'export_columns' => 'ascore,total,domains_num,urls_num,ips_num,follows_num,nofollows_num',
            ]);

            return $this->parseCsvResponse($response->body(), [
                'authority_score', 'total_backlinks', 'referring_domains',
                'referring_urls', 'referring_ips', 'follow', 'nofollow',
            ]);
        } catch (Throwable $e) {
            report($e);

            return $this->stub('backlinks', $domain);
        }
    }

    public function getSiteAuditIssues(string $domain): array
    {
        if (! $this->apiKey) {
            return $this->stub('site_issues', $domain);
        }

        try {
            $response = Http::timeout(30)->get(self::BASE_URL . '/', [
                'type' => 'domain_organic',
                'key' => $this->apiKey,
                'domain' => $domain,
                'export_columns' => 'Ph,Po',
                'display_limit' => 5,
            ]);

            return ['raw' => $response->body()];
        } catch (Throwable $e) {
            report($e);

            return $this->stub('site_issues', $domain);
        }
    }

    private function parseCsvResponse(string $body, array $headers): array
    {
        $lines = array_filter(explode("\n", trim($body)));

        if (count($lines) < 2) {
            return [];
        }

        $dataLine = $lines[1] ?? '';
        $values = str_getcsv($dataLine, ';');

        return array_combine(
            array_slice($headers, 0, count($values)),
            $values,
        );
    }

    private function parseCsvLines(string $body): array
    {
        $lines = array_filter(explode("\n", trim($body)));

        if (count($lines) < 2) {
            return [];
        }

        $headerLine = array_shift($lines);
        $headers = str_getcsv($headerLine, ';');
        $results = [];

        foreach ($lines as $line) {
            $values = str_getcsv($line, ';');
            if (count($values) === count($headers)) {
                $results[] = array_combine($headers, $values);
            }
        }

        return $results;
    }

    private function stub(string $type, string $domain): array
    {
        return match ($type) {
            'domain_overview' => [
                'domain' => $domain,
                'rank' => 'N/A (API key not configured)',
                'organic_keywords' => 0,
                'organic_traffic' => 0,
                'organic_cost' => 0,
                '_stub' => true,
            ],
            'organic_keywords' => [
                ['keyword' => 'example keyword', 'position' => 1, 'search_volume' => 1000, '_stub' => true],
            ],
            'backlinks' => [
                'authority_score' => 0,
                'total_backlinks' => 0,
                'referring_domains' => 0,
                '_stub' => true,
            ],
            default => ['_stub' => true, 'domain' => $domain],
        };
    }
}
