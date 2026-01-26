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
            <section className="relative overflow-hidden py-20 px-4">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                        Visual Feedback<br />
                        <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">Made Simple</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Annotate any website, collaborate with your team, and streamline your design review process — all in one beautiful workspace.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link
                            to="/auth"
                            className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-lg font-bold text-lg flex items-center gap-2 transform hover:scale-105 active:scale-95"
                        >
                            Get Started Free
                            <ArrowRight size={20} />
                        </Link>
                        <a
                            href="#features"
                            className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition shadow-md font-bold text-lg border-2 border-gray-200"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything you need</h2>
                        <p className="text-xl text-gray-600">Powerful features for seamless collaboration</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition border border-gray-100">
                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-4">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Comment Anywhere</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Click anywhere on any website to add visual feedback. Pin your comments exactly where they belong.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Collaborate in Real-Time</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Work together with your team. Reply to comments, track changes, and keep everyone in sync.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Share2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Share with Ease</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Generate shareable links instantly. Clients and stakeholders can view and reply without signing up.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                                Built for designers,<br />developers & teams
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-gray-900">No Installation Required</h4>
                                        <p className="text-gray-600">Works directly in your browser, no plugins needed</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Works on Any Website</h4>
                                        <p className="text-gray-600">Annotate live sites, staging environments, or prototypes</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Responsive Preview</h4>
                                        <p className="text-gray-600">Test and comment on desktop, tablet, and mobile views</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                            <div className="aspect-video bg-gradient-to-br from-rose-100 to-purple-100 rounded-xl flex items-center justify-center text-gray-400">
                                <Globe size={64} className="text-rose-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold mb-6">Ready to get started?</h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Join teams around the world using Pastel for visual feedback
                    </p>
                    <Link
                        to="/auth"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition shadow-lg font-bold text-lg transform hover:scale-105 active:scale-95"
                    >
                        Start For Free
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 px-4">
                <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
                    <p>© 2026 Pastel. Built with React, Node.js & Supabase.</p>
                </div>
            </footer>
        </div>
    );
}
