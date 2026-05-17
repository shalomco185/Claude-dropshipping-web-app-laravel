<?php

return [
    'semrush_api_key' => env('SEMRUSH_API_KEY'),

    'anthropic_api_key' => env('ANTHROPIC_API_KEY'),
    'anthropic_model'   => env('ANTHROPIC_MODEL', 'claude-sonnet-4-6'),

    'ai_provider' => env('SITE_AUDIT_AI_PROVIDER', 'anthropic'),
];
