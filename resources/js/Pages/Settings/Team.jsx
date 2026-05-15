import AppLayout from '@/Layouts/AppLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Badge from '@/Components/Badge';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const mockMembers = [
    { id: 1, name: 'You (Owner)', email: 'me@example.com', role: 'owner' },
];

export default function Team() {
    const [members] = useState(mockMembers);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('manager');

    return (
        <AppLayout title="Team">
            <div className="mx-auto max-w-4xl">
                <h2 className="mb-6 text-2xl font-semibold text-slate-900">Team members</h2>

                <div className="card mb-6 p-5">
                    <h3 className="mb-3 text-base font-semibold text-slate-900">Invite a team member</h3>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1"
                        />
                        <div className="sm:w-48">
                            <label className="form-label">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="form-input"
                            >
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="support">Support</option>
                                <option value="marketing">Marketing</option>
                            </select>
                        </div>
                        <Button>
                            <PlusIcon className="h-4 w-4" /> Invite
                        </Button>
                    </div>
                </div>

                <div className="card overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="table-header">Member</th>
                                <th className="table-header">Email</th>
                                <th className="table-header">Role</th>
                                <th className="table-header"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50">
                                    <td className="table-cell font-medium">{member.name}</td>
                                    <td className="table-cell text-slate-600">{member.email}</td>
                                    <td className="table-cell">
                                        <Badge color="indigo">{member.role}</Badge>
                                    </td>
                                    <td className="table-cell text-right text-sm">
                                        {member.role !== 'owner' && (
                                            <button className="text-red-600 hover:text-red-700">
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
