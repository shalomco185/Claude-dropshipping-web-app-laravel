<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\User;
use Stripe\Customer;
use Stripe\Stripe;
use Stripe\Subscription as StripeSubscription;
use Stripe\Webhook;
use Throwable;

class StripeService
{
    public const PLAN_PRICE_IDS = [
        'starter' => 'price_starter_monthly',
        'professional' => 'price_professional_monthly',
        'agency' => 'price_agency_monthly',
        'enterprise' => 'price_enterprise_monthly',
    ];

    public const PLAN_PRICES = [
        'starter' => 29,
        'professional' => 79,
        'agency' => 199,
        'enterprise' => null,
    ];

    public function __construct()
    {
        if (config('services.stripe.secret')) {
            Stripe::setApiKey(config('services.stripe.secret'));
        }
    }

    public function createOrGetCustomer(User $user): ?string
    {
        if (! config('services.stripe.secret')) {
            return null;
        }

        $existing = $user->subscriptions()->whereNotNull('stripe_customer_id')->first();
        if ($existing) {
            return $existing->stripe_customer_id;
        }

        try {
            $customer = Customer::create([
                'email' => $user->email,
                'name' => $user->name,
                'metadata' => ['user_id' => $user->id],
            ]);

            return $customer->id;
        } catch (Throwable $e) {
            report($e);

            return null;
        }
    }

    public function subscribe(User $user, string $plan): ?Subscription
    {
        $priceId = self::PLAN_PRICE_IDS[$plan] ?? null;

        if (! $priceId) {
            return null;
        }

        $customerId = $this->createOrGetCustomer($user);

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $plan,
            'status' => 'trialing',
            'stripe_customer_id' => $customerId,
            'stripe_price_id' => $priceId,
            'trial_ends_at' => now()->addDays(14),
            'current_period_start' => now(),
            'current_period_end' => now()->addMonth(),
        ]);

        if (config('services.stripe.secret') && $customerId) {
            try {
                $stripeSub = StripeSubscription::create([
                    'customer' => $customerId,
                    'items' => [['price' => $priceId]],
                    'trial_period_days' => 14,
                ]);
                $subscription->update(['stripe_id' => $stripeSub->id]);
            } catch (Throwable $e) {
                report($e);
            }
        }

        $user->update(['plan' => $plan, 'trial_ends_at' => now()->addDays(14)]);

        return $subscription;
    }

    public function cancel(Subscription $subscription): bool
    {
        if ($subscription->stripe_id && config('services.stripe.secret')) {
            try {
                $stripeSub = StripeSubscription::retrieve($subscription->stripe_id);
                $stripeSub->cancel();
            } catch (Throwable $e) {
                report($e);
            }
        }

        $subscription->update([
            'status' => 'cancelled',
            'ends_at' => $subscription->current_period_end ?? now(),
        ]);

        return true;
    }

    public function constructWebhookEvent(string $payload, string $signature): mixed
    {
        $secret = config('services.stripe.webhook.secret');

        if (! $secret) {
            return json_decode($payload);
        }

        return Webhook::constructEvent($payload, $signature, $secret);
    }
}
