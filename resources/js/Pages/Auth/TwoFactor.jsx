import AuthLayout from '@/Layouts/AuthLayout';
import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function TwoFactor({ enabled }) {
    const { data, setData, post, processing, errors } = useForm({ code: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('two-factor.verify'));
    };

    return (
        <AuthLayout
            title="Two-factor authentication"
            subtitle={enabled ? 'Enter the 6-digit code from your authenticator app.' : 'Two-factor is currently disabled.'}
        >
            <form onSubmit={submit} className="space-y-4">
                <Input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    label="Authentication code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    error={errors.code}
                    autoFocus
                    maxLength={6}
                    required
                />
                <Button type="submit" loading={processing} className="w-full">
                    Verify
                </Button>
            </form>
        </AuthLayout>
    );
}
