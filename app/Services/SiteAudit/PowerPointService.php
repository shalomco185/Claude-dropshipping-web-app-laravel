<?php

namespace App\Services\SiteAudit;

use PhpOffice\PhpPresentation\IOFactory;
use PhpOffice\PhpPresentation\PhpPresentation;
use PhpOffice\PhpPresentation\Shape\AutoShape;
use PhpOffice\PhpPresentation\Shape\RichText;
use PhpOffice\PhpPresentation\Slide as PptxSlide;
use PhpOffice\PhpPresentation\Style\Alignment;
use PhpOffice\PhpPresentation\Style\Border;
use PhpOffice\PhpPresentation\Style\Color;
use PhpOffice\PhpPresentation\Style\Fill;

class PowerPointService
{
    private const PRIMARY = 'FF1E40AF';
    private const ACCENT  = 'FF7C3AED';
    private const SUCCESS = 'FF16A34A';
    private const WARNING = 'FFD97706';
    private const DANGER  = 'FFDC2626';
    private const DARK    = 'FF0F172A';
    private const LIGHT   = 'FFF8FAFC';
    private const GRAY    = 'FF64748B';
    private const WHITE   = 'FFFFFFFF';

    private PhpPresentation $pptx;

    public function generate(array $auditData): string
    {
        $this->pptx = new PhpPresentation();
        $this->pptx->getDocumentProperties()
            ->setCreator('Dropship SaaS - Site Audit')
            ->setTitle('Site Audit Report – ' . $auditData['domain'])
            ->setDescription('Comprehensive SEO & Technical Site Audit')
            ->setKeywords('SEO Site Audit Technical Analysis');

        $this->makeCoverSlide($auditData);
        $this->makeExecutiveSummarySlide($auditData);
        $this->makeScoreSlide($auditData);
        $this->makeTechnicalSeoSlide($auditData);
        $this->makeOrganicPerformanceSlide($auditData);
        $this->makeBacklinksSlide($auditData);
        $this->makeTopIssuesSlide($auditData);
        $this->makeActionPlanSlide($auditData);

        $dir = storage_path('app/public/site-audits');
        if (! is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        $path = $dir . '/' . $auditData['filename'];
        IOFactory::createWriter($this->pptx, 'PowerPoint2007')->save($path);

        return $path;
    }

    private function makeCoverSlide(array $data): void
    {
        $slide = $this->pptx->getActiveSlide();
        $this->rect($slide, 0, 0, 960, 540, self::PRIMARY);

        $this->txt($slide, $data['domain'], 40, 160, 40, 680, 80, self::WHITE, true);
        $this->txt($slide, 'SEO & Technical Site Audit Report', 22, 250, 40, 680, 50, 'FFBFDBFE');
        $this->txt($slide, 'Generated: ' . $data['date'], 13, 310, 40, 400, 30, 'FF93C5FD');

        $score      = $data['ai_analysis']['overall_score'] ?? 0;
        $scoreColor = $score >= 80 ? self::SUCCESS : ($score >= 60 ? self::WARNING : self::DANGER);

        $this->rect($slide, 180, 760, 160, 160, '22FFFFFF');
        $this->txt($slide, (string) $score, 52, 210, 780, 120, 80, $scoreColor, true, Alignment::HORIZONTAL_CENTER);
        $this->txt($slide, 'Overall Score', 12, 295, 760, 160, 30, 'FFBFDBFE', false, Alignment::HORIZONTAL_CENTER);
    }

    private function makeExecutiveSummarySlide(array $data): void
    {
        $slide = $this->newSlide();
        $this->header($slide, 'Executive Summary');

        $summary = $data['ai_analysis']['executive_summary'] ?? 'No summary available.';
        $this->txt($slide, $summary, 15, 90, 40, 880, 80, self::DARK);

        $this->bulletSection($slide, 'Strengths', $data['ai_analysis']['strengths'] ?? [], 185, 40, 420, self::SUCCESS);
        $this->bulletSection($slide, 'Quick Wins', $data['ai_analysis']['quick_wins'] ?? [], 185, 480, 420, self::ACCENT);
    }

    private function makeScoreSlide(array $data): void
    {
        $slide  = $this->newSlide();
        $this->header($slide, 'Audit Score Breakdown');

        $scores = $data['ai_analysis']['scores'] ?? [];
        $labels = [
            'technical_seo'    => 'Technical SEO',
            'on_page_seo'      => 'On-Page SEO',
            'backlink_profile'  => 'Backlink Profile',
            'performance'      => 'Performance',
            'content_quality'  => 'Content Quality',
        ];

        $y = 100;
        foreach ($labels as $key => $label) {
            $val   = (int) ($scores[$key] ?? 0);
            $color = $val >= 80 ? self::SUCCESS : ($val >= 60 ? self::WARNING : self::DANGER);

            $this->txt($slide, $label, 13, $y, 40, 220, 24, self::DARK, true);
            $this->rect($slide, $y + 2, 270, 620, 18, 'FFE2E8F0');
            $this->rect($slide, $y + 2, 270, max(4, (int) ($val / 100 * 620)), 18, $color);

            $valShape = $this->txt($slide, $val . '/100', 12, $y, 905, 60, 24, $color, true);
            $valShape->getActiveParagraph()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

            $y += 76;
        }
    }

    private function makeTechnicalSeoSlide(array $data): void
    {
        $slide = $this->newSlide();
        $this->header($slide, 'Technical SEO Analysis');

        $sf   = $data['screaming_frog'] ?? [];
        $stat = $sf['status_code_distribution'] ?? [];
        $ti   = $sf['page_title_issues'] ?? [];
        $mi   = $sf['meta_description_issues'] ?? [];
        $hi   = $sf['h1_issues'] ?? [];

        $this->statCard($slide, (string) ($sf['total_pages'] ?? 0), 'Pages Crawled', 85, 30, self::PRIMARY);
        $this->statCard($slide, (string) ($stat['200'] ?? 0), '200 OK', 85, 255, self::SUCCESS);
        $this->statCard($slide, (string) (($stat['404'] ?? 0) + ($stat['500'] ?? 0)), 'Error Pages', 85, 480, self::DANGER);
        $this->statCard($slide, (string) (($stat['301'] ?? 0) + ($stat['302'] ?? 0)), 'Redirects', 85, 705, self::WARNING);

        $this->issueTable($slide, 'On-Page Issues', [
            ['Missing Titles',    $ti['missing'] ?? 0],
            ['Long Titles (>60)', $ti['too_long'] ?? 0],
            ['Duplicate Titles',  $ti['duplicates'] ?? 0],
            ['Missing Meta Desc', $mi['missing'] ?? 0],
            ['Long Meta Desc',    $mi['too_long'] ?? 0],
            ['Missing H1',        $hi['missing'] ?? 0],
            ['Multiple H1',       $hi['multiple'] ?? 0],
        ], 295);

        $insights = $data['ai_analysis']['technical_insights'] ?? '';
        $this->txt($slide, $insights, 12, 470, 40, 880, 55, self::GRAY);
    }

    private function makeOrganicPerformanceSlide(array $data): void
    {
        $slide = $this->newSlide();
        $this->header($slide, 'Organic Search Performance');

        $ov = $data['semrush']['overview'] ?? [];
        $this->statCard($slide, $this->fmt($ov['organic_keywords'] ?? 0), 'Organic Keywords', 85, 30, self::PRIMARY);
        $this->statCard($slide, $this->fmt($ov['organic_traffic'] ?? 0), 'Est. Traffic / Mo', 85, 255, self::SUCCESS);
        $this->statCard($slide, '$' . $this->fmt($ov['organic_cost'] ?? 0), 'Traffic Value', 85, 480, self::ACCENT);
        $this->statCard($slide, (string) ($ov['rank'] ?? 'N/A'), 'SEMrush Rank', 85, 705, self::WARNING);

        $kw    = $data['semrush']['top_keywords'] ?? [];
        $kwRows = array_map(
            fn ($k) => [$k['Ph'] ?? $k['keyword'] ?? '?', '#' . ($k['Po'] ?? $k['position'] ?? '?')],
            array_slice($kw, 0, 8),
        );
        if ($kwRows) {
            $this->issueTable($slide, 'Top Keywords → Rank', $kwRows, 285);
        }

        $insights = $data['ai_analysis']['keyword_insights'] ?? '';
        $this->txt($slide, $insights, 12, 465, 40, 880, 55, self::GRAY);
    }

    private function makeBacklinksSlide(array $data): void
    {
        $slide = $this->newSlide();
        $this->header($slide, 'Backlink Profile');

        $bl = $data['semrush']['backlinks'] ?? [];
        $this->statCard($slide, $this->fmt($bl['authority_score'] ?? 0), 'Authority Score', 130, 30, self::PRIMARY);
        $this->statCard($slide, $this->fmt($bl['total_backlinks'] ?? 0), 'Total Backlinks', 130, 255, self::SUCCESS);
        $this->statCard($slide, $this->fmt($bl['referring_domains'] ?? 0), 'Referring Domains', 130, 480, self::ACCENT);
        $this->statCard($slide, $this->fmt($bl['follow'] ?? 0), 'DoFollow Links', 130, 705, self::WARNING);

        $insights = $data['ai_analysis']['backlink_insights'] ?? '';
        $this->txt($slide, $insights, 15, 340, 40, 880, 90, self::DARK);
    }

    private function makeTopIssuesSlide(array $data): void
    {
        $slide  = $this->newSlide();
        $this->header($slide, 'Top Issues & Recommendations');

        $issues = array_slice($data['ai_analysis']['top_issues'] ?? [], 0, 5);
        $y      = 90;

        foreach ($issues as $issue) {
            $priority = strtolower($issue['priority'] ?? 'medium');
            $color    = match ($priority) {
                'critical' => self::DANGER,
                'high'     => self::WARNING,
                'medium'   => self::PRIMARY,
                default    => self::GRAY,
            };

            $this->rect($slide, $y + 2, 30, 80, 22, $color);
            $this->txt($slide, strtoupper($priority), 9, $y + 5, 30, 80, 16, self::WHITE, true, Alignment::HORIZONTAL_CENTER);

            $this->txt($slide, ($issue['category'] ?? '') . ': ' . ($issue['issue'] ?? ''), 13, $y, 120, 800, 24, self::DARK, true);
            $this->txt($slide, '→ ' . ($issue['recommendation'] ?? ''), 12, $y + 26, 120, 800, 22, self::GRAY);
            $this->rect($slide, $y + 60, 30, 900, 1, 'FFE2E8F0');

            $y += 70;
        }
    }

    private function makeActionPlanSlide(array $data): void
    {
        $slide  = $this->newSlide();
        $this->header($slide, '90-Day Action Plan');

        $plan   = array_slice($data['ai_analysis']['action_plan'] ?? [], 0, 3);
        $colors = [self::SUCCESS, self::PRIMARY, self::ACCENT];
        $x      = 30;

        foreach ($plan as $i => $phase) {
            $color = $colors[$i] ?? self::GRAY;

            $this->rect($slide, 90, $x, 285, 36, $color);
            $headerTxt = $this->txt($slide, $phase['week'] ?? "Phase " . ($i + 1), 13, 92, $x, 285, 32, self::WHITE, true, Alignment::HORIZONTAL_CENTER);
            $headerTxt->getActiveParagraph()->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

            $ty = 138;
            foreach ($phase['tasks'] ?? [] as $task) {
                $this->txt($slide, '• ' . $task, 12, $ty, $x + 8, 269, 32, self::DARK);
                $ty += 36;
            }

            $x += 315;
        }
    }

    // ─── Primitives ──────────────────────────────────────────────────────────

    private function newSlide(): PptxSlide
    {
        $slide = $this->pptx->createSlide();
        $this->rect($slide, 0, 0, 960, 540, self::LIGHT);

        return $slide;
    }

    private function header(PptxSlide $slide, string $title): void
    {
        $this->rect($slide, 0, 0, 960, 68, self::PRIMARY);
        $shape = $this->txt($slide, $title, 22, 14, 30, 900, 44, self::WHITE, true);
        $shape->getActiveParagraph()->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
    }

    /**
     * Add a solid-filled rectangle (AutoShape).
     */
    private function rect(PptxSlide $slide, int $y, int $x, int $w, int $h, string $color): AutoShape
    {
        $shape = $slide->createAutoShape();
        $shape->setWidth($w)->setHeight($h)->setOffsetX($x)->setOffsetY($y);
        $shape->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color($color));
        $shape->getBorder()->setLineStyle(Border::LINE_NONE);

        return $shape;
    }

    /**
     * Add a text run and return the RichText shape (for alignment chaining).
     */
    private function txt(
        PptxSlide $slide,
        string $text,
        int $fontSize,
        int $y,
        int $x,
        int $w,
        int $h,
        string $color = self::DARK,
        bool $bold = false,
        string $hAlign = Alignment::HORIZONTAL_LEFT,
    ): RichText {
        $shape = $slide->createRichTextShape();
        $shape->setWidth($w)->setHeight($h)->setOffsetX($x)->setOffsetY($y);
        $shape->getActiveParagraph()->getAlignment()
            ->setHorizontal($hAlign)
            ->setMarginLeft(0)
            ->setMarginRight(0);

        $run = $shape->createTextRun($text);
        $run->getFont()
            ->setName('Calibri')
            ->setSize($fontSize)
            ->setBold($bold)
            ->setColor(new Color($color));

        return $shape;
    }

    private function statCard(PptxSlide $slide, string $value, string $label, int $y, int $x, string $color): void
    {
        $box = $slide->createAutoShape();
        $box->setWidth(205)->setHeight(88)->setOffsetX($x)->setOffsetY($y);
        $box->getFill()->setFillType(Fill::FILL_SOLID)->setStartColor(new Color(self::WHITE));
        $box->getBorder()->setLineStyle(Border::LINE_SINGLE)->setLineWidth(1)->setColor(new Color($color));

        $this->txt($slide, $value, 26, $y + 10, $x, 205, 36, $color, true, Alignment::HORIZONTAL_CENTER);
        $this->txt($slide, $label, 11, $y + 54, $x, 205, 24, self::GRAY, false, Alignment::HORIZONTAL_CENTER);
    }

    private function bulletSection(PptxSlide $slide, string $title, array $items, int $y, int $x, int $w, string $color): void
    {
        $this->txt($slide, $title, 14, $y, $x, $w, 26, $color, true);
        $ty = $y + 32;
        foreach (array_slice($items, 0, 5) as $item) {
            $this->txt($slide, '✓ ' . $item, 12, $ty, $x + 8, $w - 8, 22, self::DARK);
            $ty += 27;
        }
    }

    private function issueTable(PptxSlide $slide, string $title, array $pairs, int $y): void
    {
        $this->txt($slide, $title, 13, $y, 40, 500, 24, self::PRIMARY, true);
        $ty = $y + 30;
        foreach ($pairs as [$label, $value]) {
            $this->txt($slide, (string) $label, 12, $ty, 40, 380, 22, self::DARK);
            $this->txt($slide, (string) $value, 12, $ty, 430, 100, 22, self::DANGER, true);
            $ty += 26;
        }
    }

    private function fmt(mixed $val): string
    {
        $n = (int) $val;

        return match (true) {
            $n >= 1_000_000 => number_format($n / 1_000_000, 1) . 'M',
            $n >= 1_000     => number_format($n / 1_000, 1) . 'K',
            default         => (string) $n,
        };
    }
}
