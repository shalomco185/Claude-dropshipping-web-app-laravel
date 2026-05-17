import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    ArrowDownTrayIcon,
    ArrowLeftIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

function ScoreGauge({ score, label, color }) {
    const colors = {
        green: { ring: '#16a34a', bg: 'bg-green-50', text: 'text-green-700' },
        yellow: { ring: '#d97706', bg: 'bg-amber-50', text: 'text-amber-700' },
        red: { ring: '#dc2626', bg: 'bg-red-50', text: 'text-red-700' },
    };
    const c = colors[color] ?? colors.red;
    const r = 44;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;

    return (
        <div className={`flex flex-col items-center rounded-xl p-4 ${c.bg}`}>
            <svg width="100" height="100" className="-rotate-90">
                <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle cx="50" cy="50" r={r} fill="none" stroke={c.ring} strokeWidth="8"
                    strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
            </svg>
            <p className={`-mt-2 text-3xl font-bold ${c.text}`}>{score}</p>
            <p className="mt-1 text-xs font-medium text-slate-600">{label}</p>
        </div>
    );
}

function MiniScore({ label, score }) {
    const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
    const bg    = score >= 80 ? 'bg-green-50' : score >= 60 ? 'bg-amber-50' : 'bg-red-50';
    const bar   = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';

    return (
        <div className="flex items-center gap-3">
            <span className="w-36 shrink-0 text-sm text-slate-600">{label}</span>
            <div className="flex-1 rounded-full bg-slate-200 h-2">
                <div className={`h-2 rounded-full ${bar}`} style={{ width: `${score}%` }} />
            </div>
            <span className={`w-12 text-right text-sm font-semibold ${color}`}>{score}/100</span>
        </div>
    );
}

const PRIORITY_CONFIG = {
    critical: { label: 'Critical', bg: 'bg-red-600',    icon: ExclamationCircleIcon },
    high:     { label: 'High',     bg: 'bg-amber-500',  icon: ExclamationTriangleIcon },
    medium:   { label: 'Medium',   bg: 'bg-blue-600',   icon: null },
    low:      { label: 'Low',      bg: 'bg-slate-400',  icon: null },
};

function IssueCard({ issue }) {
    const cfg = PRIORITY_CONFIG[issue.priority?.toLowerCase()] ?? PRIORITY_CONFIG.medium;
    const Icon = cfg.icon;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <span className={`mt-0.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${cfg.bg}`}>
                    {cfg.label}
                </span>
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        {issue.category}: {issue.issue}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{issue.recommendation}</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ value, label, color = 'primary' }) {
    const colors = {
        primary: 'border-blue-200 text-blue-700',
        success: 'border-green-200 text-green-700',
        danger:  'border-red-200 text-red-700',
        warning: 'border-amber-200 text-amber-700',
    };
    return (
        <div className={`rounded-xl border bg-white p-4 text-center shadow-sm ${colors[color]}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{label}</p>
        </div>
    );
}

function fmt(n) {
    const num = parseInt(n) || 0;
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return String(num);
}

function ProcessingView({ audit }) {
    const [progress, setProgress] = useState(audit.progress);
    const [status, setStatus]     = useState(audit.status);
    const [error, setError]       = useState(audit.error_message);

    useEffect(() => {
        if (status === 'completed' || status === 'failed') return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/site-audit/${audit.id}/status`, {
                    headers: { Accept: 'application/json' },
                });
                const data = await res.json();
                setProgress(data.progress ?? 0);
                setStatus(data.status);
                setError(data.error_message);

                if (data.status === 'completed') {
                    clearInterval(interval);
                    router.reload({ only: ['audit'] });
                } else if (data.status === 'failed') {
                    clearInterval(interval);
                }
            } catch {}
        }, 3000);

        return () => clearInterval(interval);
    }, [status]);

    if (status === 'failed') {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <ExclamationCircleIcon className="mb-4 h-14 w-14 text-red-400" />
                <h3 className="text-lg font-semibold text-slate-800">Audit Failed</h3>
                <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>
                <Link href={route('site-audit.index')} className="mt-6 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                    Back to Audits
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <ArrowPathIcon className="mb-4 h-14 w-14 animate-spin text-primary-500" />
            <h3 className="text-lg font-semibold text-slate-800">Audit in Progress</h3>
            <p className="mt-1 text-sm text-slate-500">
                Fetching SEMrush data, processing Screaming Frog results, and running AI analysis…
            </p>
            <div className="mt-6 w-full max-w-sm">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-200">
                    <div
                        className="h-3 rounded-full bg-primary-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function SiteAuditShow({ audit }) {
    if (audit.status !== 'completed') {
        return (
            <AppLayout title={`Audit – ${audit.domain}`}>
                <div className="mb-4">
                    <Link href={route('site-audit.index')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
                        <ArrowLeftIcon className="h-4 w-4" />
                        All Audits
                    </Link>
                </div>
                <ProcessingView audit={audit} />
            </AppLayout>
        );
    }

    const ai  = audit.ai_analysis ?? {};
    const sf  = audit.screaming_frog ?? {};
    const sem = audit.semrush_data ?? {};
    const ov  = sem.overview ?? {};
    const bl  = sem.backlinks ?? {};
    const kw  = sem.top_keywords ?? [];
    const stat = sf.status_code_distribution ?? {};
    const scoreLabel = audit.score >= 80 ? 'Good' : audit.score >= 60 ? 'Average' : 'Needs Work';

    return (
        <AppLayout title={`Audit – ${audit.domain}`}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={route('site-audit.index')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
                        <ArrowLeftIcon className="h-4 w-4" />
                        All Audits
                    </Link>
                </div>
                {audit.report_url && (
                    <a href={audit.report_url} download
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Download PowerPoint
                    </a>
                )}
            </div>

            <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900">{audit.domain}</h2>
                {audit.label && <p className="text-sm text-slate-500">{audit.label}</p>}
                <p className="text-xs text-slate-400">
                    Completed {audit.completed_at} · Generated {audit.created_at}
                </p>
            </div>

            {/* Score + summary */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <ScoreGauge score={audit.score} label={scoreLabel} color={audit.score_color} />
                <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Executive Summary</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{ai.executive_summary}</p>

                    {ai.strengths?.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-2">Strengths</p>
                            <ul className="space-y-1">
                                {ai.strengths.map((s, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Score breakdown */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">Score Breakdown</h3>
                <div className="space-y-3">
                    {Object.entries({
                        'Technical SEO':   ai.scores?.technical_seo ?? 0,
                        'On-Page SEO':     ai.scores?.on_page_seo ?? 0,
                        'Backlink Profile': ai.scores?.backlink_profile ?? 0,
                        'Performance':     ai.scores?.performance ?? 0,
                        'Content Quality': ai.scores?.content_quality ?? 0,
                    }).map(([label, score]) => (
                        <MiniScore key={label} label={label} score={score} />
                    ))}
                </div>
            </div>

            {/* Technical SEO */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">Technical SEO</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
                    <StatCard value={sf.total_pages ?? 0} label="Pages Crawled" color="primary" />
                    <StatCard value={stat['200'] ?? 0} label="200 OK" color="success" />
                    <StatCard value={(stat['404'] ?? 0) + (stat['500'] ?? 0)} label="Error Pages" color="danger" />
                    <StatCard value={(stat['301'] ?? 0) + (stat['302'] ?? 0)} label="Redirects" color="warning" />
                </div>

                {sf.page_title_issues && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <StatCard value={sf.page_title_issues.missing ?? 0} label="Missing Titles" color="danger" />
                        <StatCard value={sf.page_title_issues.too_long ?? 0} label="Long Titles" color="warning" />
                        <StatCard value={sf.meta_description_issues?.missing ?? 0} label="Missing Meta Desc" color="danger" />
                        <StatCard value={sf.meta_description_issues?.too_long ?? 0} label="Long Meta Desc" color="warning" />
                        <StatCard value={sf.h1_issues?.missing ?? 0} label="Missing H1" color="danger" />
                        <StatCard value={sf.h1_issues?.multiple ?? 0} label="Multiple H1s" color="warning" />
                    </div>
                )}

                {ai.technical_insights && (
                    <p className="mt-4 text-sm text-slate-500 italic">{ai.technical_insights}</p>
                )}
            </div>

            {/* Organic performance */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-slate-700">Organic Search Performance</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <StatCard value={fmt(ov.organic_keywords)} label="Organic Keywords" color="primary" />
                        <StatCard value={fmt(ov.organic_traffic)} label="Est. Traffic/Mo" color="success" />
                        <StatCard value={'$' + fmt(ov.organic_cost)} label="Traffic Value" color="warning" />
                        <StatCard value={ov.rank ?? 'N/A'} label="SEMrush Rank" color="primary" />
                    </div>
                    {ai.keyword_insights && (
                        <p className="text-sm text-slate-500 italic">{ai.keyword_insights}</p>
                    )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-slate-700">Backlink Profile</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <StatCard value={bl.authority_score ?? 0} label="Authority Score" color="primary" />
                        <StatCard value={fmt(bl.total_backlinks)} label="Total Backlinks" color="success" />
                        <StatCard value={fmt(bl.referring_domains)} label="Referring Domains" color="warning" />
                        <StatCard value={fmt(bl.follow)} label="DoFollow Links" color="success" />
                    </div>
                    {ai.backlink_insights && (
                        <p className="text-sm text-slate-500 italic">{ai.backlink_insights}</p>
                    )}
                </div>
            </div>

            {/* Top keywords */}
            {kw.length > 0 && (
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-slate-700">Top Organic Keywords</h3>
                    <div className="divide-y divide-slate-100">
                        {kw.slice(0, 8).map((k, i) => (
                            <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                                <span className="text-slate-700">{k.Ph ?? k.keyword}</span>
                                <div className="flex items-center gap-6">
                                    <span className="text-slate-400">{fmt(k.Nq ?? k.search_volume ?? 0)} searches</span>
                                    <span className="w-12 text-right font-semibold text-primary-600">
                                        #{k.Po ?? k.position ?? '?'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Issues */}
            {ai.top_issues?.length > 0 && (
                <div className="mb-6">
                    <h3 className="mb-3 text-sm font-semibold text-slate-700">Top Issues &amp; Recommendations</h3>
                    <div className="space-y-3">
                        {ai.top_issues.map((issue, i) => (
                            <IssueCard key={i} issue={issue} />
                        ))}
                    </div>
                </div>
            )}

            {/* Quick wins */}
            {ai.quick_wins?.length > 0 && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5">
                    <h3 className="mb-3 text-sm font-semibold text-green-800">Quick Wins</h3>
                    <ul className="space-y-2">
                        {ai.quick_wins.map((w, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-green-700">
                                <CheckCircleIcon className="h-4 w-4 shrink-0 text-green-500" />
                                {w}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action plan */}
            {ai.action_plan?.length > 0 && (
                <div className="mb-6">
                    <h3 className="mb-3 text-sm font-semibold text-slate-700">90-Day Action Plan</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {ai.action_plan.map((phase, i) => {
                            const colors = [
                                'border-green-300 bg-green-50',
                                'border-blue-300 bg-blue-50',
                                'border-purple-300 bg-purple-50',
                            ];
                            const headerColors = ['bg-green-600', 'bg-blue-600', 'bg-purple-600'];
                            return (
                                <div key={i} className={`rounded-xl border overflow-hidden ${colors[i] ?? colors[0]}`}>
                                    <div className={`px-4 py-2.5 text-xs font-bold text-white ${headerColors[i] ?? headerColors[0]}`}>
                                        {phase.week}
                                    </div>
                                    <ul className="space-y-2 p-4">
                                        {(phase.tasks ?? []).map((task, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                                                <span className="mt-0.5 shrink-0 text-slate-400">•</span>
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
