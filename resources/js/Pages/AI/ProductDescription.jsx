import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import { ClipboardDocumentIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function ProductDescription() {
    const [title, setTitle] = useState('');
    const [features, setFeatures] = useState('');
    const [tone, setTone] = useState('professional');
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState('');

    const generate = async (e) => {
        e?.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post(route('ai.product-description'), {
                title,
                features: features.split('\n').filter(Boolean),
                tone,
            });
            setOutput(res.data.description ?? '');
        } catch (err) {
            toast.error(err.response?.data?.message ?? 'Failed to generate.');
        } finally {
            setLoading(false);
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <form onSubmit={generate} className="card space-y-4 p-6">
                <h3 className="text-base font-semibold text-slate-900">Generate description</h3>
                <Input
                    label="Product title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Wireless noise-cancelling headphones"
                    required
                />
                <div>
                    <label className="form-label">Key features (one per line)</label>
                    <textarea
                        rows="5"
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        className="form-input"
                        placeholder={'40-hour battery\nActive noise cancellation\nBluetooth 5.3'}
                    />
                </div>
                <div>
                    <label className="form-label">Tone</label>
                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="form-input"
                    >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="playful">Playful</option>
                        <option value="luxurious">Luxurious</option>
                        <option value="bold">Bold</option>
                    </select>
                </div>
                <Button type="submit" loading={loading} className="w-full">
                    <SparklesIcon className="h-4 w-4" /> Generate
                </Button>
            </form>

            <div className="card p-6">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">Output</h3>
                    {output && (
                        <button
                            type="button"
                            onClick={copy}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                        >
                            <ClipboardDocumentIcon className="h-4 w-4" /> Copy
                        </button>
                    )}
                </div>
                <div className="min-h-[280px] whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    {loading
                        ? 'Generating...'
                        : output || 'Your generated description will appear here.'}
                </div>
            </div>
        </div>
    );
}
