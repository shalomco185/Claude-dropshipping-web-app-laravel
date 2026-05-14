import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import {
    SparklesIcon,
    DocumentTextIcon,
    MegaphoneIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import ProductDescription from './ProductDescription';
import { useState } from 'react';
import AdCopy from './AdCopy';
import SEOGenerator from './SEOGenerator';

const tools = [
    {
        id: 'description',
        name: 'Product description',
        icon: DocumentTextIcon,
        description: 'Generate compelling, SEO-friendly product descriptions in seconds.',
    },
    {
        id: 'ad',
        name: 'Ad copy',
        icon: MegaphoneIcon,
        description: 'Create high-converting ads for Facebook, Google, TikTok and more.',
    },
    {
        id: 'seo',
        name: 'SEO generator',
        icon: MagnifyingGlassIcon,
        description: 'Auto-generate meta titles, descriptions and keywords.',
    },
];

export default function AIIndex() {
    const [activeTool, setActiveTool] = useState('description');

    return (
        <AppLayout title="AI Tools">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 p-2.5">
                    <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">AI Tools</h2>
                    <p className="text-sm text-slate-500">
                        Supercharge your store with AI-generated content.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        type="button"
                        onClick={() => setActiveTool(tool.id)}
                        className={`card text-left p-5 transition hover:shadow-lg ${
                            activeTool === tool.id ? 'ring-2 ring-primary-500' : ''
                        }`}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                            <tool.icon className="h-5 w-5 text-primary-500" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-slate-900">
                            {tool.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {activeTool === 'description' && <ProductDescription />}
                {activeTool === 'ad' && <AdCopy />}
                {activeTool === 'seo' && <SEOGenerator />}
            </div>
        </AppLayout>
    );
}
