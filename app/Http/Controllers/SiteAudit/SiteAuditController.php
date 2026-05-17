<?php

namespace App\Http\Controllers\SiteAudit;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessSiteAuditJob;
use App\Models\SiteAudit;
use App\Services\SiteAudit\ScreamingFrogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteAuditController extends Controller
{
    public function __construct(private ScreamingFrogService $screamingFrog) {}

    public function index(): Response
    {
        $audits = SiteAudit::where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id'          => $a->id,
                'domain'      => $a->domain,
                'label'       => $a->label,
                'status'      => $a->status,
                'progress'    => $a->progress,
                'score'       => $a->overallScore(),
                'score_color' => $a->scoreColor(),
                'report_url'  => $a->report_path ? Storage::url($a->report_path) : null,
                'created_at'  => $a->created_at->diffForHumans(),
                'completed_at' => $a->completed_at?->format('d M Y, H:i'),
            ]);

        return Inertia::render('SiteAudit/Index', ['audits' => $audits]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'domain'               => 'required|string|max:255',
            'label'                => 'nullable|string|max:100',
            'ai_provider'          => 'nullable|in:anthropic,openai',
            'semrush_database'     => 'nullable|string|max:10',
            'screaming_frog_csv'   => 'nullable|file|mimes:csv,txt|max:20480',
        ]);

        $sfData = null;
        if ($request->hasFile('screaming_frog_csv')) {
            $sfData = $this->screamingFrog->parseCsvUpload($request->file('screaming_frog_csv'));
        }

        $domain = preg_replace('#^https?://#', '', rtrim($data['domain'], '/'));

        $audit = SiteAudit::create([
            'user_id'             => auth()->id(),
            'domain'              => $domain,
            'label'               => $data['label'] ?? null,
            'status'              => 'pending',
            'config'              => [
                'ai_provider'      => $data['ai_provider'] ?? config('siteaudit.ai_provider'),
                'semrush_database' => $data['semrush_database'] ?? 'us',
            ],
            'screaming_frog_data' => $sfData,
        ]);

        ProcessSiteAuditJob::dispatch($audit);

        return redirect()->route('site-audit.show', $audit)
            ->with('success', 'Audit started! Processing in background...');
    }

    public function show(SiteAudit $siteAudit): Response
    {
        $this->authorize('view', $siteAudit);

        return Inertia::render('SiteAudit/Show', [
            'audit' => [
                'id'             => $siteAudit->id,
                'domain'         => $siteAudit->domain,
                'label'          => $siteAudit->label,
                'status'         => $siteAudit->status,
                'progress'       => $siteAudit->progress,
                'score'          => $siteAudit->overallScore(),
                'score_color'    => $siteAudit->scoreColor(),
                'ai_analysis'    => $siteAudit->ai_analysis,
                'semrush_data'   => $siteAudit->semrush_data,
                'screaming_frog' => $siteAudit->screaming_frog_data,
                'config'         => $siteAudit->config,
                'report_url'     => $siteAudit->report_path ? Storage::url($siteAudit->report_path) : null,
                'error_message'  => $siteAudit->error_message,
                'created_at'     => $siteAudit->created_at->format('d M Y, H:i'),
                'completed_at'   => $siteAudit->completed_at?->format('d M Y, H:i'),
            ],
        ]);
    }

    public function status(SiteAudit $siteAudit): JsonResponse
    {
        $this->authorize('view', $siteAudit);

        return response()->json([
            'status'        => $siteAudit->status,
            'progress'      => $siteAudit->progress,
            'score'         => $siteAudit->overallScore(),
            'score_color'   => $siteAudit->scoreColor(),
            'report_url'    => $siteAudit->report_path ? Storage::url($siteAudit->report_path) : null,
            'error_message' => $siteAudit->error_message,
        ]);
    }

    public function destroy(SiteAudit $siteAudit): RedirectResponse
    {
        $this->authorize('delete', $siteAudit);

        if ($siteAudit->report_path) {
            Storage::delete($siteAudit->report_path);
        }

        $siteAudit->delete();

        return redirect()->route('site-audit.index')->with('success', 'Audit deleted.');
    }
}
