import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowRight,
    Globe,
    Sparkles,
    Zap,
    CheckCircle2,
    ChevronLeft
} from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Landing() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return;

        setIsLoading(true);
        let formattedUrl = url;
        if (!formattedUrl.startsWith('http')) {
            formattedUrl = 'https://' + formattedUrl;
        }

        try {
            const token = getToken();
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ url: formattedUrl })
            });
            const project = await res.json();
            navigate(`/canvas/${project.id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to create project');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-jakarta overflow-hidden flex flex-col">

            {/* Background Ornament */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#4B2182]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#F58220]/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 -z-10"></div>

            {/* Header */}
            <header className="p-8 flex items-center justify-between">
                <Link to="/" className="flex items-center group">
                    <img src="/logo.png" alt="FlexyPin Logo" className="h-7 group-hover:scale-105 transition-transform" />
                </Link>
                <Link to="/auth" className="text-[10px] font-black text-gray-400 hover:text-[#4B2182] focus-visible:text-[#4B2182] outline-none transition-colors uppercase tracking-[0.3em]">
                    Sign In
                </Link>
            </header>

            <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="max-w-3xl w-full text-center">

                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#4B2182]/5 border border-[#4B2182]/10 mb-8 animate-slide-up">
                        <Zap size={14} className="text-[#F58220] fill-current" />
                        <span className="text-[10px] font-black text-[#4B2182] tracking-widest uppercase">Start your first session</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#0F172A] mb-8 leading-[0.9] animate-slide-up [animation-delay:100ms]">
                        Enter a URL to start <span className="text-[#F58220]">pinning.</span>
                    </h1>

                    <p className="text-xl text-gray-500 font-medium mb-12 max-w-xl mx-auto animate-slide-up [animation-delay:200ms]">
                        We'll create a collaboration-ready version of your site in seconds. Join the modern feedback revolution.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        role="search"
                        aria-label="Create a new project"
                        className="relative max-w-2xl mx-auto mb-12 animate-slide-up [animation-delay:300ms]"
                    >
                        <div className="glass rounded-[2.5rem] p-3 flex items-center shadow-3xl shadow-[#4B2182]/10">
                            <div className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-[#4B2182] mr-4">
                                <Globe size={24} aria-hidden="true" />
                            </div>
                            <label htmlFor="url-input" className="sr-only">Website URL</label>
                            <input
                                id="url-input"
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="yoursite.com"
                                className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-gray-900 placeholder:text-gray-300 mr-4"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#4B2182] text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-[#F58220] focus-visible:bg-[#F58220] outline-none transition-all transform hover:scale-105 shadow-2xl shadow-[#4B2182]/30 flex items-center gap-3 disabled:opacity-50"
                                aria-label={isLoading ? "Preparing project" : "Create project"}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Preparing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Let's Go <ChevronLeft className="rotate-180" size={20} strokeWidth={3} />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Social Proof / Tip */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[10px] font-black text-gray-400 tracking-widest uppercase animate-slide-up [animation-delay:400ms]">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-green-500" />
                            No extension required
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-green-500" />
                            Works on any framework
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-green-500" />
                            Real-time sync
                        </div>
                    </div>
                </div>
            </main>

            <footer className="p-8 text-center">
                <Link to="/dashboard" className="text-xs font-black text-[#4B2182] hover:text-[#F58220] focus-visible:text-[#F58220] outline-none uppercase tracking-widest transition-colors mb-4 inline-block">
                    Go to Dashboard
                </Link>
            </footer>
        </div>
    );
}
