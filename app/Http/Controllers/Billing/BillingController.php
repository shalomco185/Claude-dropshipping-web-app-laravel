<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class BillingController extends Controller
{
    public function __construct(protected StripeService $stripe) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Settings/Billing', [
            'subscription' => $user->activeSubscription(),
            'plans' => [
                [
                    'id' => 'starter',
                    'name' => 'Starter',
                    'price' => 29,
                    'description' => 'Perfect for solo entrepreneurs starting their first store.',
                    'features' => [
                        '1 store',
                        '500 products',
                        'Basic analytics',
                        'Email support',
                    ],
                    'highlighted' => false,
                ],
                [
                    'id' => 'professional',
                    'name' => 'Professional',
                    'price' => 79,
                    'description' => 'For growing businesses needing AI and automation.',
                    'features' => [
                        '5 stores',
                        '5,000 products',
                        'AI product descriptions',
                        'Marketing automation',
                        'Priority support',
                    ],
                    'highlighted' => true,
                ],
                [
                    'id' => 'agency',
                    'name' => 'Agency',
                    'price' => 199,
                    'description' => 'Run multiple stores and white-label for clients.',
                    'features' => [
                        '20 stores',
                        'Unlimited products',
                        'White-label dashboards',
                        'Team collaboration',
                        'Dedicated CSM',
                    ],
                    'highlighted' => false,
                ],
                [
                    'id' => 'enterprise',
                    'name' => 'Enterprise',
                    'price' => null,
                    'description' => 'Custom plans for high-volume sellers and brands.',
                    'features' => [
                        'Unlimited everything',
                        'Custom integrations',
                        'SSO & advanced security',
                        '99.9% SLA',
                        'On-premise option',
                    ],
                    'highlighted' => false,
                ],
            ],
        ]);
    }

    public function subscribe(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'plan' => 'required|in:starter,professional,agency,enterprise',
        ]);

        $this->stripe->subscribe($request->user(), $data['plan']);

        return back()->with('success', 'Subscription updated to ' . ucfirst($data['plan']) . '.');
    }

    public function cancel(Request $request): RedirectResponse
    {
        $subscription = $request->user()->activeSubscription();

        if ($subscription) {
            $this->stripe->cancel($subscription);
        }

        return back()->with('success', 'Subscription cancelled.');
    }

    public function webhook(Request $request): JsonResponse
    {
        try {
            $event = $this->stripe->constructWebhookEvent(
                $request->getContent(),
                $request->header('Stripe-Signature', ''),
            );

            $type = is_object($event) ? ($event->type ?? null) : ($event['type'] ?? null);
            $data = is_object($event) ? ($event->data->object ?? null) : ($event['data']['object'] ?? null);

            match ($type) {
                'invoice.payment_succeeded' => $this->handlePaymentSucceeded($data),
                'invoice.payment_failed' => $this->handlePaymentFailed($data),
                'customer.subscription.updated' => $this->handleSubscriptionUpdated($data),
                'customer.subscription.deleted' => $this->handleSubscriptionDeleted($data),
                default => null,
            };
        } catch (Throwable $e) {
            Log::error('Stripe webhook failed', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'invalid signature'], 400);
        }

        return response()->json(['received' => true]);
    }

    protected function handlePaymentSucceeded($data): void
    {
        $stripeId = is_object($data) ? ($data->subscription ?? null) : ($data['subscription'] ?? null);
        if (! $stripeId) {
            return;
        }
        Subscription::where('stripe_id', $stripeId)
            ->update(['status' => 'active']);
    }

    protected function handlePaymentFailed($data): void
    {
        $stripeId = is_object($data) ? ($data->subscription ?? null) : ($data['subscription'] ?? null);
        if (! $stripeId) {
            return;
        }
        Subscription::where('stripe_id', $stripeId)
            ->update(['status' => 'past_due']);
    }

    protected function handleSubscriptionUpdated($data): void
    {
        $stripeId = is_object($data) ? ($data->id ?? null) : ($data['id'] ?? null);
        $status = is_object($data) ? ($data->status ?? null) : ($data['status'] ?? null);
        if (! $stripeId) {
            return;
        }
        Subscription::where('stripe_id', $stripeId)
            ->update(['status' => $status]);
    }

    protected function handleSubscriptionDeleted($data): void
    {
        $stripeId = is_object($data) ? ($data->id ?? null) : ($data['id'] ?? null);
        if (! $stripeId) {
            return;
        }
        Subscription::where('stripe_id', $stripeId)
            ->update(['status' => 'cancelled', 'ends_at' => now()]);
    }
}
