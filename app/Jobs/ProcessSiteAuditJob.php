<?php

namespace App\Jobs;

use App\Models\SiteAudit;
use App\Services\SiteAudit\PowerPointService;
use App\Services\SiteAudit\SEMrushService;
use App\Services\SiteAudit\SiteAuditAIService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class ProcessSiteAuditJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;
    public int $tries   = 1;

    public function __construct(public readonly SiteAudit $audit) {}

    public function handle(
        SEMrushService $semrush,
        SiteAuditAIService $ai,
        PowerPointService $pptx,
    ): void {
        $this->progress(5, 'processing');

        $domain = $this->audit->domain;

        try {
            $this->progress(15, message: 'Fetching SEMrush domain overview...');
            $overview   = $semrush->getDomainOverview($domain);

            $this->progress(30, message: 'Fetching organic keywords...');
            $topKeywords = $semrush->getOrganicKeywords($domain, 'us', 10);

            $this->progress(45, message: 'Fetching backlink data...');
            $backlinks  = $semrush->getBacklinksOverview($domain);

            $semrushData = [
                'overview'     => $overview,
                'top_keywords' => $topKeywords,
                'backlinks'    => $backlinks,
            ];

            $this->audit->update(['semrush_data' => $semrushData]);

            $screamingFrogData = $this->audit->screaming_frog_data ?? [
                'total_pages' => 0,
                'issues' => [],
                'status_code_distribution' => [],
                'page_title_issues' => ['missing' => 0, 'too_long' => 0, 'too_short' => 0, 'duplicates' => 0],
                'meta_description_issues' => ['missing' => 0, 'too_long' => 0],
                'h1_issues' => ['missing' => 0, 'multiple' => 0],
            ];

            $this->progress(60, message: 'Running AI analysis...');
            $aiAnalysis = $ai->analyse($domain, $semrushData, $screamingFrogData, $this->audit->crawl_data ?? []);

            $this->audit->update(['ai_analysis' => $aiAnalysis]);

            $this->progress(80, message: 'Generating PowerPoint report...');
            $filename = 'site-audit-' . str_replace(['http://', 'https://', '/'], ['', '', '-'], $domain)
                . '-' . now()->format('Ymd-His') . '.pptx';

            $reportPath = $pptx->generate([
                'domain'         => $domain,
                'date'           => now()->format('d M Y'),
                'filename'       => $filename,
                'semrush'        => $semrushData,
                'screaming_frog' => $screamingFrogData,
                'ai_analysis'    => $aiAnalysis,
            ]);

            $this->audit->update([
                'status'       => 'completed',
                'progress'     => 100,
                'report_path'  => 'site-audits/' . $filename,
                'completed_at' => now(),
            ]);
        } catch (Throwable $e) {
            report($e);

            $this->audit->update([
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }

    private function progress(int $pct, ?string $status = null, string $message = ''): void
    {
        $update = ['progress' => $pct];

        if ($status) {
            $update['status'] = $status;
        }

        if ($pct === 5) {
            $update['started_at'] = now();
        }

        $this->audit->update($update);
    }
}
