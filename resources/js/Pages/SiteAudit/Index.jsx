import AppLayout from '@/Layouts/AppLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    MagnifyingGlassCircleIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    TrashIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

const STATUS_CONFIG = {
    pending:    { label: 'Queued',     icon: ClockIcon,             color: 'text-slate-500 bg-slate-100' },
    processing: { label: 'Processing', icon: ArrowPathIcon,         color: 'text-blue-600 bg-blue-50',   spin: true },
    completed:  { label: 'Done',       icon: CheckCircleIcon,       color: 'text-green-600 bg-green-50' },
    failed:     { label: 'Failed',     icon: ExclamationCircleIcon, color: 'text-red-600 bg-red-50' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
            <Icon className={`h-3.5 w-3.5 ${cfg.spin ? 'animate-spin' : ''}`} />
            {cfg.label}
        </span>
    );
}

function ScoreRing({ score, color }) {
    const strokeColor = color === 'green' ? '#16a34a' : color === 'yellow' ? '#d97706' : '#dc2626';
    const r = 22;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width="60" height="60" className="-rotate-90">
                <circle cx="30" cy="30" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
                <circle
                    cx="30" cy="30" r={r} fill="none"
                    stroke={strokeColor} strokeWidth="5"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute text-sm font-bold" style={{ color: strokeColor }}>{score}</span>
        </div>
    );
}

function NewAuditModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        domain: '',
        label: '',
        ai_provider: 'anthropic',
        semrush_database: 'us',
        screaming_frog_csv: null,
    });

    function submit(e) {
        e.preventDefault();
        post(route('site-audit.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); onClose(); },
        });
    }

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h3 className="text-lg font-semibold text-slate-900">New Site Audit</h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Enter a domain to start a full SEO audit with AI-powered analysis.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4 p-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Domain *</label>
                        <input
                            type="text"
                            value={data.domain}
                            onChange={e => setData('domain', e.target.value)}
                            placeholder="example.com"
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        />
                        {errors.domain && <p className="mt-1 text-xs text-red-600">{errors.domain}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Label (optional)</label>
                        <input
                            type="text"
                            value={data.label}
                            onChange={e => setData('label', e.target.value)}
                            placeholder="e.g. Q2 2025 Audit"
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">AI Provider</label>
                            <select
                                value={data.ai_provider}
                                onChange={e => setData('ai_provider', e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="anthropic">Claude (Anthropic)</option>
                                <option value="openai">GPT-4o (OpenAI)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">SEMrush DB</label>
                            <select
                                value={data.semrush_database}
                                onChange={e => setData('semrush_database', e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="us">US</option>
                                <option value="uk">UK</option>
                                <option value="ca">Canada</option>
                                <option value="au">Australia</option>
                                <option value="de">Germany</option>
                                <option value="fr">France</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Screaming Frog CSV Export
                            <span className="ml-1 text-xs text-slate-400">(optional – Internal HTML tab)</span>
                        </label>
                        <input
                            type="file"
                            accept=".csv,.txt"
                            onChange={e => setData('screaming_frog_csv', e.target.files[0])}
                            className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                        />
                        <p className="mt-1 text-xs text-slate-400">
                            Export from Screaming Frog → Bulk Export → Internal → HTML
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60">
                            {processing ? 'Starting…' : 'Start Audit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function SiteAuditIndex({ audits }) {
    const [showModal, setShowModal] = useState(false);

    function deleteAudit(id) {
        if (!confirm('Delete this audit?')) return;
        router.delete(route('site-audit.destroy', id));
    }

    return (
        <AppLayout title="Site Audit">
            <NewAuditModal show={showModal} onClose={() => setShowModal(false)} />

            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5">
                        <MagnifyingGlassCircleIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Site Audit</h2>
                        <p className="text-sm text-slate-500">
                            AI-powered SEO audits with SEMrush &amp; Screaming Frog data.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                    <PlusIcon className="h-4 w-4" />
                    New Audit
                </button>
            </div>

            {audits.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
                    <MagnifyingGlassCircleIcon className="mb-4 h-12 w-12 text-slate-300" />
                    <h3 className="text-base font-semibold text-slate-700">No audits yet</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Start your first site audit to get AI-powered SEO insights.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                    >
                        Start Audit
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {audits.map(audit => (
                        <div key={audit.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                {audit.status === 'completed'
                                    ? <ScoreRing score={audit.score} color={audit.score_color} />
                                    : (
                                        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-slate-100">
                                            <span className="text-xs text-slate-400">{audit.progress}%</span>
                                        </div>
                                    )}
                                <div>
                                    <p className="font-semibold text-slate-900">{audit.domain}</p>
                                    {audit.label && <p className="text-xs text-slate-400">{audit.label}</p>}
                                    <p className="mt-0.5 text-xs text-slate-400">{audit.created_at}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <StatusBadge status={audit.status} />

                                {audit.status === 'completed' && (
                                    <Link href={route('site-audit.show', audit.id)}
                                        className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100">
                                        View Report
                                    </Link>
                                )}

                                {audit.report_url && (
                                    <a href={audit.report_url} download
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100">
                                        <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                                        PPTX
                                    </a>
                                )}

                                <button onClick={() => deleteAudit(audit.id)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
