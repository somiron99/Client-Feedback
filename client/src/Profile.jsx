import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    User,
    Mail,
    Lock,
    ShieldCheck,
    ChevronLeft,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (password && password !== confirmPassword) {
            return setStatus({ type: 'error', message: 'Passwords do not match' });
        }

        setIsLoading(true);
        const updates = { name, email };
        if (password) updates.password = password;

        const result = await updateProfile(updates);
        if (result.success) {
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setPassword('');
            setConfirmPassword('');
        } else {
            setStatus({ type: 'error', message: result.error || 'Failed to update profile' });
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-jakarta">
            {/* Top Navigation */}
            <nav className="glass sticky top-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center group">
                            <img src="/logo.png" alt="FlexyPin" className="h-8 group-hover:scale-105 transition-transform" />
                        </Link>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-[#4B2182] transition-colors group">
                            <ChevronLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Projects
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">Account Settings</h1>
                    <p className="text-lg text-gray-500 font-medium">Manage your personal information and security preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Sidebar */}
                    <div className="space-y-2">
                        <button
                            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#4B2182] text-white font-black text-sm transition-all shadow-lg shadow-[#4B2182]/20 focus-visible:ring-2 focus-visible:ring-[#4B2182] outline-none"
                            aria-current="page"
                        >
                            <User size={18} strokeWidth={2.5} aria-hidden="true" />
                            General
                        </button>
                        <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-gray-500 hover:bg-white hover:text-[#4B2182] font-black text-sm transition-all group focus-visible:ring-2 focus-visible:ring-[#4B2182] outline-none">
                            <ShieldCheck size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
                            Security
                        </button>
                    </div>

                    {/* Form */}
                    <div id="main-content" className="md:col-span-2">
                        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
                            {status.message && (
                                <div role="alert" className={`mb-8 flex items-center gap-3 p-5 rounded-2xl font-bold text-sm animate-slide-up ${status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                    {status.type === 'success' ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profile Information</h3>

                                    <div className="relative group">
                                        <label htmlFor="full-name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block px-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#4B2182] transition-colors" size={18} strokeWidth={2.5} aria-hidden="true" />
                                            <input
                                                id="full-name"
                                                type="text"
                                                className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#4B2182]/20 focus:ring-4 focus:ring-[#4B2182]/5 rounded-2xl py-5 pl-12 pr-4 text-sm font-bold placeholder:text-gray-300 transition-all outline-none focus-visible:ring-[#4B2182]/20"
                                                placeholder="Your name"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label htmlFor="email-address" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block px-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#4B2182] transition-colors" size={18} strokeWidth={2.5} aria-hidden="true" />
                                            <input
                                                id="email-address"
                                                type="email"
                                                className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#4B2182]/20 focus:ring-4 focus:ring-[#4B2182]/5 rounded-2xl py-5 pl-12 pr-4 text-sm font-bold placeholder:text-gray-300 transition-all outline-none focus-visible:ring-[#4B2182]/20"
                                                placeholder="name@company.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100"></div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Security</h3>

                                    <div className="relative group">
                                        <label htmlFor="new-password" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block px-2">New Password (Optional)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#4B2182] transition-colors" size={18} strokeWidth={2.5} aria-hidden="true" />
                                            <input
                                                id="new-password"
                                                type="password"
                                                className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#4B2182]/20 focus:ring-4 focus:ring-[#4B2182]/5 rounded-2xl py-5 pl-12 pr-4 text-sm font-bold placeholder:text-gray-300 transition-all outline-none focus-visible:ring-[#4B2182]/20"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label htmlFor="confirm-password" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block px-2">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#4B2182] transition-colors" size={18} strokeWidth={2.5} aria-hidden="true" />
                                            <input
                                                id="confirm-password"
                                                type="password"
                                                className="w-full bg-gray-50/50 border border-gray-100 focus:border-[#4B2182]/20 focus:ring-4 focus:ring-[#4B2182]/5 rounded-2xl py-5 pl-12 pr-4 text-sm font-bold placeholder:text-gray-300 transition-all outline-none focus-visible:ring-[#4B2182]/20"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                required={!!password}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#4B2182] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F58220] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#4B2182]/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                            <>
                                                <Save size={18} strokeWidth={2.5} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
