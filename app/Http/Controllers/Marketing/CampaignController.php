<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\MarketingCampaign;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function overview(Request $request): Response
    {
        $store = $this->currentStore($request);

        return Inertia::render('Marketing/Index', [
            'campaigns' => $store
                ? $store->campaigns()->latest()->limit(10)->get()
                : [],
            'coupons' => $store
                ? $store->coupons()->latest()->limit(10)->get()
                : [],
        ]);
    }

    public function index(Request $request): Response
    {
        $store = $this->currentStore($request);

        return Inertia::render('Marketing/Campaigns/Index', [
            'campaigns' => $store
                ? $store->campaigns()->latest()->paginate(20)
                : null,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Marketing/Campaigns/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $store = $this->currentStore($request);
        abort_unless($store, 403);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:email,sms,whatsapp,push',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        $data['store_id'] = $store->id;
        $data['status'] = $data['scheduled_at'] ?? false ? 'scheduled' : 'draft';

        MarketingCampaign::create($data);

        return redirect()->route('marketing.campaigns.index')
            ->with('success', 'Campaign created.');
    }

    public function show(MarketingCampaign $campaign): Response
    {
        abort_unless($campaign->store->user_id === auth()->id(), 403);

        return Inertia::render('Marketing/Campaigns/Show', [
            'campaign' => $campaign,
        ]);
    }

    public function edit(MarketingCampaign $campaign): Response
    {
        abort_unless($campaign->store->user_id === auth()->id(), 403);

        return Inertia::render('Marketing/Campaigns/Create', [
            'campaign' => $campaign,
        ]);
    }

    public function update(Request $request, MarketingCampaign $campaign): RedirectResponse
    {
        abort_unless($campaign->store->user_id === auth()->id(), 403);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'scheduled_at' => 'nullable|date',
        ]);

        $campaign->update($data);

        return back()->with('success', 'Campaign updated.');
    }

    public function destroy(MarketingCampaign $campaign): RedirectResponse
    {
        abort_unless($campaign->store->user_id === auth()->id(), 403);

        $campaign->delete();

        return back()->with('success', 'Campaign deleted.');
    }

    protected function currentStore(Request $request)
    {
        return $request->user()->stores()->where('is_active', true)->first()
            ?? $request->user()->stores()->first();
    }
}
