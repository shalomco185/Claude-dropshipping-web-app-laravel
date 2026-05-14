import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import { SparklesIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'google', label: 'Google' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
];

export default function AdCopy() {
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [platform, setPlatform] = useState('facebook');
    const [variations, setVariations] = useState([]);
    const [loading, setLoading] = useState(false);

    const generate = async (e) => {
        e?.preventDefault();
        if (!product.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post(route('ai.ad-copy'), {
                product,
                audience,
                platform,
            });
            setVariations(res.data.variations ?? []);
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
                <h3 className="text-base font-semibold text-slate-900">Generate ad copy</h3>
                <Input
                    label="Product"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="Smart ergonomic chair"
                    required
                />
                <Input
                    label="Target audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Remote workers aged 25-45"
                />
                <div>
                    <label className="form-label">Platform</label>
                    <div className="grid grid-cols-2 gap-2">
                        {platforms.map((p) => (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => setPlatform(p.value)}
                                className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                                    platform === p.value
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
                <Button type="submit" loading={loading} className="w-full">
                    <SparklesIcon className="h-4 w-4" /> Generate variations
                </Button>
            </form>

            <div className="space-y-4">
                {variations.length === 0 && !loading && (
                    <div className="card p-6 text-center text-sm text-slate-500">
                        Your ad variations will show up here.
                    </div>
                )}
                {loading && (
                    <div className="card p-6 text-center text-sm text-slate-500">Generating...</div>
                )}
                {variations.map((v, idx) => (
                    <div key={idx} className="card p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Variation {idx + 1}
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    copy(`${v.headline}\n${v.primary_text}\n${v.cta}`)
                                }
                                className="text-xs font-medium text-primary-600 hover:text-primary-700"
                            >
                                <ClipboardDocumentIcon className="inline h-4 w-4" /> Copy
                            </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{v.headline}</p>
                        <p className="mt-2 text-sm text-slate-700">{v.primary_text}</p>
                        <span className="mt-3 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                            {v.cta}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
