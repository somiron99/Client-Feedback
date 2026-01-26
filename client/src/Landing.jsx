import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Loader2 } from 'lucide-react';

export default function Landing() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return;
        setLoading(true);

        let submitUrl = url;
        if (!submitUrl.startsWith('http')) {
            submitUrl = 'https://' + submitUrl;
        }

        try {
            const res = await fetch('http://localhost:3456/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: submitUrl })
            });
            const data = await res.json();
            navigate(`/project/${data.id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-10 z-10 border border-white/50">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
                        <Globe size={32} />
                    </div>
                </div>

                <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">Pastel Clone</h1>
                <p className="text-center text-gray-500 mb-10 text-lg">Enter a website URL to start reviewing and commenting directly on the design.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                        <input
                            type="text"
                            required
                            placeholder="example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm text-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Preparing Canvas...
                            </>
                        ) : (
                            <>
                                Start Reviewing
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Powered by React, Node.js & Supabase
                </p>
            </div>
        </div>
    );
}
