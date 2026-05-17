<?php

namespace App\Services\SiteAudit;

use Illuminate\Http\UploadedFile;

class ScreamingFrogService
{
    /**
     * Parse a Screaming Frog CSV export (Internal HTML tab).
     */
    public function parseCsvUpload(UploadedFile $file): array
    {
        $path = $file->getRealPath();
        $handle = fopen($path, 'r');

        if (! $handle) {
            return [];
        }

        $headers = null;
        $rows = [];
        $lineCount = 0;

        while (($row = fgetcsv($handle)) !== false && $lineCount < 2000) {
            if ($headers === null) {
                $headers = array_map('trim', $row);
                continue;
            }

            if (count($row) !== count($headers)) {
                continue;
            }

            $rows[] = array_combine($headers, $row);
            $lineCount++;
        }

        fclose($handle);

        return $this->analyseRows($rows, $headers ?? []);
    }

    /**
     * Parse multiple Screaming Frog CSV exports keyed by type.
     *
     * Supported keys: internal_html, response_codes, page_titles, meta_descriptions, h1, images
     */
    public function parseMultiple(array $files): array
    {
        $results = [];

        foreach ($files as $type => $file) {
            if ($file instanceof UploadedFile) {
                $results[$type] = $this->parseSingleFile($file, $type);
            }
        }

        return $this->buildSummary($results);
    }

    private function parseSingleFile(UploadedFile $file, string $type): array
    {
        $handle = fopen($file->getRealPath(), 'r');

        if (! $handle) {
            return [];
        }

        $headers = null;
        $rows = [];

        while (($row = fgetcsv($handle)) !== false && count($rows) < 1000) {
            if ($headers === null) {
                $headers = array_map('trim', $row);
                continue;
            }

            if (count($row) === count($headers)) {
                $rows[] = array_combine($headers, $row);
            }
        }

        fclose($handle);

        return $rows;
    }

    private function analyseRows(array $rows, array $headers): array
    {
        $analysis = [
            'total_pages' => count($rows),
            'issues' => [],
            'status_code_distribution' => [],
            'page_title_issues' => [],
            'meta_description_issues' => [],
            'h1_issues' => [],
            'content_issues' => [],
        ];

        $statusCodes = [];
        $missingTitles = 0;
        $duplicateTitles = [];
        $longTitles = 0;
        $shortTitles = 0;
        $missingMeta = 0;
        $longMeta = 0;
        $missingH1 = 0;
        $multipleH1 = 0;
        $titlesSeen = [];

        foreach ($rows as $row) {
            $statusCode = $row['Status Code'] ?? $row['Status'] ?? '200';
            $statusCodes[$statusCode] = ($statusCodes[$statusCode] ?? 0) + 1;

            $title = $row['Title 1'] ?? $row['Page Title'] ?? $row['Title'] ?? '';
            $titleLen = strlen($title);

            if (empty($title)) {
                $missingTitles++;
            } elseif ($titleLen > 60) {
                $longTitles++;
            } elseif ($titleLen < 30) {
                $shortTitles++;
            }

            if ($title && isset($titlesSeen[$title])) {
                $duplicateTitles[] = $title;
            } elseif ($title) {
                $titlesSeen[$title] = true;
            }

            $meta = $row['Meta Description 1'] ?? $row['Meta Description'] ?? '';
            if (empty($meta)) {
                $missingMeta++;
            } elseif (strlen($meta) > 160) {
                $longMeta++;
            }

            $h1Count = (int) ($row['H1-1'] ?? $row['H1'] ?? 0);
            if (empty($row['H1-1'] ?? $row['H1'] ?? '')) {
                $missingH1++;
            }

            $h1_2 = $row['H1-2'] ?? '';
            if (! empty($h1_2)) {
                $multipleH1++;
            }
        }

        $analysis['status_code_distribution'] = $statusCodes;
        $analysis['page_title_issues'] = [
            'missing' => $missingTitles,
            'too_long' => $longTitles,
            'too_short' => $shortTitles,
            'duplicates' => count(array_unique($duplicateTitles)),
        ];
        $analysis['meta_description_issues'] = [
            'missing' => $missingMeta,
            'too_long' => $longMeta,
        ];
        $analysis['h1_issues'] = [
            'missing' => $missingH1,
            'multiple' => $multipleH1,
        ];

        $errorPages = ($statusCodes['404'] ?? 0) + ($statusCodes['500'] ?? 0)
            + ($statusCodes['301'] ?? 0) + ($statusCodes['302'] ?? 0);

        if ($missingTitles > 0) {
            $analysis['issues'][] = ['type' => 'error', 'message' => "{$missingTitles} pages missing title tags"];
        }
        if ($longTitles > 0) {
            $analysis['issues'][] = ['type' => 'warning', 'message' => "{$longTitles} titles exceed 60 characters"];
        }
        if ($missingMeta > 0) {
            $analysis['issues'][] = ['type' => 'warning', 'message' => "{$missingMeta} pages missing meta descriptions"];
        }
        if ($missingH1 > 0) {
            $analysis['issues'][] = ['type' => 'error', 'message' => "{$missingH1} pages missing H1 tags"];
        }
        if ($errorPages > 0) {
            $analysis['issues'][] = ['type' => 'error', 'message' => "{$errorPages} pages with error/redirect status codes"];
        }

        return $analysis;
    }

    private function buildSummary(array $parsed): array
    {
        $summary = [
            'total_pages' => 0,
            'issues' => [],
            'status_code_distribution' => [],
            'page_title_issues' => ['missing' => 0, 'too_long' => 0, 'too_short' => 0, 'duplicates' => 0],
            'meta_description_issues' => ['missing' => 0, 'too_long' => 0],
            'h1_issues' => ['missing' => 0, 'multiple' => 0],
        ];

        if (isset($parsed['internal_html']) && is_array($parsed['internal_html'])) {
            $analysed = $this->analyseRows($parsed['internal_html'], []);
            $summary = array_merge($summary, $analysed);
        }

        return $summary;
    }
}
