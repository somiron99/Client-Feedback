import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageSquare, Users, Share2, ArrowRight, CheckCircle } from 'lucide-react';

export default function Homepage() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                                <Globe size={24} />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Pastel</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/auth"
                                className="px-4 py-2 text text-gray-700 hover:text-gray-900 font-medium transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/auth"
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition shadow-sm font-medium"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 px-4">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-none">
                                Visual Feedback<br />
                                <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">Perfected.</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
                                The faster way for designers and developers to collaborate. Comment directly on live websites, stage environments, or prototypes.
                            </p>
                            <div className="flex items-center gap-4 flex-wrap">
                                <Link
                                    to="/auth"
                                    className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-lg font-bold text-lg flex items-center gap-2 transform hover:scale-105 active:scale-95"
                                >
                                    Get Started Free
                                    <ArrowRight size={20} />
                                </Link>
                                <a
                                    href="#features"
                                    className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition shadow-md font-bold text-lg border-2 border-gray-100"
                                >
                                    How it works
                                </a>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-rose-500 to-purple-600 rounded-2xl opacity-10 blur-2xl group-hover:opacity-20 transition duration-1000"></div>
                            <img
                                src="/assets/hero.png"
                                alt="Pastel Insight Hero"
                                className="relative rounded-2xl shadow-2xl border border-gray-200 transform hover:-rotate-1 transition duration-500 ease-out"
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section (Social Proof) */}
            <section className="py-12 bg-gray-50/50 border-y border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by creative teams everywhere</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition duration-500">
                        {['Designing', 'Invision', 'Framer', 'ProductHunt', 'Vercel'].map(name => (
                            <span key={name} className="text-2xl font-black text-gray-400">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Everything you need</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Pastel is built to handle the most complex design review workflows without getting in your way.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="group p-10 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition duration-700"></div>
                            <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-rose-600/20">
                                <MessageSquare size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Comment Anywhere</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Click anywhere on any website to add visual feedback. Pin your comments exactly where they belong on the page.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-10 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition duration-700"></div>
                            <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-600/20">
                                <Users size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Sync</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Work together with your team instantly. See comments as they happen and solve design conflicts in seconds.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-10 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition duration-700"></div>
                            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20">
                                <Share2 size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Sharing</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Share projects with a single link. No login required for clients to leave feedback, making reviews frictionless.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Showcase Section */}
            <section className="py-32 px-4 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <img
                                src="/assets/collaboration.png"
                                alt="Feature Collaboration"
                                className="rounded-3xl shadow-3xl transform hover:scale-105 transition duration-700"
                                loading="lazy"
                            />
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-rose-500 font-bold tracking-widest uppercase text-sm mb-4 block">Enhanced Workflow</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                                Built for designers, developers & visionaries
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 flex-shrink-0">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-white">No Installation Required</h4>
                                        <p className="text-gray-400 leading-relaxed">Works directly in your browser with zero friction. No extensions, no plugins, just efficiency.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 flex-shrink-0">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-white">Any Website, Any Environment</h4>
                                        <p className="text-gray-400 leading-relaxed">Whether it's a live site, a staging environment, or a local mockup, Pastel has you covered.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-white">Full Responsive Testing</h4>
                                        <p className="text-gray-400 leading-relaxed">Toggle between desktop, tablet, and mobile views to ensure your design works perfectly everywhere.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Responsive Showcase */}
            <section className="py-32 px-4 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-16">Tested on every screen</h2>
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute -inset-10 bg-gradient-to-r from-rose-100 to-purple-100 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                        <img
                            src="/assets/devices.png"
                            alt="Responsive Mockup"
                            className="relative mx-auto rounded-3xl shadow-2xl transition hover:brightness-105 duration-500"
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-4 bg-gradient-to-br from-rose-600 to-purple-700 text-white relative">
                <div className="absolute inset-0 bg-black opacity-10 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl font-extrabold mb-8 tracking-tight">Ready to streamline your workflow?</h2>
                    <p className="text-2xl text-rose-100 mb-12 font-medium opacity-90">
                        Join 20,000+ teams shipping better websites, faster.
                    </p>
                    <Link
                        to="/auth"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 rounded-2xl hover:bg-gray-50 transition shadow-2xl font-bold text-xl transform hover:scale-105 active:scale-95"
                    >
                        Start For Free Today
                        <ArrowRight size={24} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-16 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <Globe size={18} />
                        </div>
                        <span className="text-lg font-bold text-gray-900 tracking-tight">Pastel Insight</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-gray-500 font-medium">
                        <a href="#" className="hover:text-rose-600 transition">Terms</a>
                        <a href="#" className="hover:text-rose-600 transition">Privacy</a>
                        <a href="#" className="hover:text-rose-600 transition">Contact</a>
                    </div>
                    <p className="text-gray-400 text-sm">© 2026 Pastel. Engineering excellence.</p>
                </div>
            </footer>
        </div>
    );
}
