import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Mail,
    Lock,
    ArrowRight,
    Github,
    Zap,
    CheckCircle2,
    ShieldCheck,
    Users,
    Loader2
} from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = isLogin
                ? await login(email, password)
                : await signup(email, password, name);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Authentication failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-jakarta flex overflow-hidden">
            <Helmet>
                <title>{isLogin ? 'Login' : 'Sign Up'} | FlexyPin</title>
                <meta name="description" content={isLogin ? 'Login to your FlexyPin account to manage your projects and feedback.' : 'Create a free FlexyPin account and start collaborating on your websites today.'} />
            </Helmet>

            {/* Left Design Side */}
            <div className="hidden lg:flex w-1/2 bg-[#4B2182] relative flex-col justify-between p-20 overflow-hidden">
                {/* Decorative Blooms */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#F58220]/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"></div>

                <Link to="/" className="flex items-center group relative z-10">
                    <img src="/logo.png" alt="FlexyPin Logo" className="h-9 brightness-0 invert group-hover:scale-105 transition-transform" />
                </Link>

                <div className="relative z-10">
                    <h2 className="text-7xl font-black text-white leading-[0.85] tracking-tighter mb-8 animate-slide-up">
                        Join the modern <span className="text-[#F58220]">feedback</span> loop.
                    </h2>
                    <p className="text-xl text-white/70 font-medium max-w-md mb-12 animate-slide-up [animation-delay:100ms]">
                        Join over 10,000+ designers and developers building the future of the web with FlexyPin.
                    </p>

                    <div className="grid grid-cols-2 gap-6 animate-slide-up [animation-delay:200ms]">
                        {[
                            { icon: <Zap size={18} strokeWidth={2.5} className="text-[#F58220]" />, text: "Real-time sync" },
                            { icon: <CheckCircle2 size={18} strokeWidth={2.5} className="text-[#F58220]" />, text: "Visual threads" },
                            { icon: <ShieldCheck size={18} strokeWidth={2.5} className="text-[#F58220]" />, text: "Bank-grade security" },
                            { icon: <Users size={18} strokeWidth={2.5} className="text-[#F58220]" />, text: "Team workspaces" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-black text-white/80 uppercase tracking-widest">
                                {item.icon}
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">
                    © 2026 FlexyPin Inc. Global Feedback Standard.
                </div>
            </div>

            {/* Right Form Side */}
            <div id="main-content" className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
                <div className="max-w-md w-full animate-slide-up">

                    <div className="lg:hidden flex justify-center mb-12">
                        <Link to="/" className="flex items-center">
                            <img src="/logo.png" alt="FlexyPin Logo" className="h-9" />
                        </Link>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-none">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {isLogin ? "Enter your details to access your dashboard." : "Start your 14-day free trial today."}
                        </p>
                    </div>

                    {error && (
                        <div role="alert" className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold mb-8 animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            {!isLogin && (
                                <div className="relative group">
                                    <label htmlFor="full-name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block px-2">Full Name</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#4B2182] transition-colors" size={18} strokeWidth={2.5} aria-hidden="true" />
                                        <input
                                            id="full-name"
                                            type="text"
                                            className="w-full bg-white border border-gray-100 focus:border-[#4B2182]/20 focus:ring-4 focus:ring-[#4B2182]/5 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-bold placeholder:text-gray-300 transition-all outline-none shadow-sm focus-visible:ring-[#4B2182]/20"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative group">
                                <label htmlFor="work-email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block px-2">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#4B2182] transition-colors" size={18} strokeWidth={2.5} aria-hidden="true" />
                                    <input
                                        id="work-email"
                                        type="email"
                                        className="w-full bg-white border border-gray-100 focus:border-[#4B2182]/20 focus:ring-4 focus:ring-[#4B2182]/5 rounded-2xl py-5 pl-12 pr-4 text-sm font-bold placeholder:text-gray-300 transition-all outline-none shadow-sm focus-visible:ring-[#4B2182]/20"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block px-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#4B2182] transition-colors" size={18} strokeWidth={2.5} aria-hidden="true" />
                                    <input
                                        id="password"
                                        type="password"
                                        className="w-full bg-white border border-gray-100 focus:border-[#4B2182]/20 focus:ring-4 focus:ring-[#4B2182]/5 rounded-2xl py-5 pl-12 pr-4 text-sm font-bold placeholder:text-gray-300 transition-all outline-none shadow-sm focus-visible:ring-[#4B2182]/20"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex justify-end">
                                <a href="#" className="text-[10px] font-black text-[#4B2182] hover:text-[#F58220] transition-colors uppercase tracking-widest px-2">Forgot Password?</a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#4B2182] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F58220] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#4B2182]/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                            <div className="relative flex justify-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                <span className="bg-[#F8FAFC] px-4">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                aria-label="Sign in with Google"
                                className="flex items-center justify-center gap-3 bg-white border border-gray-100 py-4.5 rounded-2xl hover:bg-gray-50 transition-all shadow-sm group focus-visible:ring-2 focus-visible:ring-[#4B2182] outline-none"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 group-hover:scale-110 transition-transform" alt="" aria-hidden="true" />
                                <span className="text-[13px] font-black text-gray-700">Google</span>
                            </button>
                            <button
                                type="button"
                                aria-label="Sign in with GitHub"
                                className="flex items-center justify-center gap-3 bg-white border border-gray-100 py-4.5 rounded-2xl hover:bg-gray-50 transition-all shadow-sm group focus-visible:ring-2 focus-visible:ring-[#4B2182] outline-none"
                            >
                                <Github className="h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                                <span className="text-[13px] font-black text-gray-700">GitHub</span>
                            </button>
                        </div>
                    </form>

                    <p className="mt-12 text-center text-sm font-bold text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="ml-2 text-[#4B2182] font-black hover:text-[#F58220] transition-colors uppercase tracking-widest"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
