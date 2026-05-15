import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import { SparklesIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function SEOGenerator() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [seo, setSeo] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async (e) => {
        e?.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post(route('ai.seo'), { title, description });
            setSeo(res.data.seo ?? null);
        } catch (err) {
            toast.error(err.response?.data?.message ?? 'Failed to generate.');
        } finally {
            setLoading(false);
        }
    };

    const copy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied!');
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <form onSubmit={generate} className="card space-y-4 p-6">
                <h3 className="text-base font-semibold text-slate-900">SEO meta generator</h3>
                <Input
                    label="Page title or product name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <div>
                    <label className="form-label">Description (optional)</label>
                    <textarea
                        rows="6"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-input"
                    />
                </div>
                <Button type="submit" loading={loading} className="w-full">
                    <SparklesIcon className="h-4 w-4" /> Generate SEO
                </Button>
            </form>

            <div className="card space-y-4 p-6">
                <h3 className="text-base font-semibold text-slate-900">Result</h3>
                {!seo && !loading && (
                    <p className="text-sm text-slate-500">SEO suggestions appear here.</p>
                )}
                {loading && <p className="text-sm text-slate-500">Generating...</p>}
                {seo && (
                    <div className="space-y-3">
                        {[
                            ['Meta title', seo.meta_title],
                            ['Meta description', seo.meta_description],
                            ['Keywords', seo.keywords],
                            ['Slug', seo.slug],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-lg border border-slate-200 p-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        {label}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => copy(value)}
                                        className="text-xs font-medium text-primary-600 hover:text-primary-700"
                                    >
                                        <ClipboardDocumentIcon className="inline h-4 w-4" /> Copy
                                    </button>
                                </div>
                                <p className="mt-1 text-sm text-slate-800 break-words">{value}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
