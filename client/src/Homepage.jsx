import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MessageSquare,
    MousePointer2,
    Share2,
    CheckCircle2,
    Zap,
    ArrowRight,
    ShieldCheck,
    Users,
    Clock,
    Play,
    Monitor,
    Layout,
    Layers,
    Sparkles,
    ChevronRight,
    Menu,
    X,
    Plus
} from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Homepage() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white font-jakarta selection:bg-[#F58220]/20 text-[#0F172A]">

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`glass rounded-3xl px-8 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-2xl shadow-[#4B2182]/5' : ''}`}>
                        <Link to="/" className="flex items-center group">
                            <img src="/logo.png" alt="FlexyPin Logo" className="h-9 group-hover:scale-105 transition-transform" />
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            {[
                                { name: 'Product', href: '#' },
                                { name: 'Pricing', href: '#pricing' },
                                { name: 'Docs', href: '#' },
                                { name: 'Blog', href: '#' },
                                { name: 'Contact', href: '#contact' }
                            ].map((item) => (
                                <a key={item.name} href={item.href} className="text-[13px] font-extrabold text-gray-400 hover:text-[#4B2182] transition-colors tracking-tight uppercase">{item.name}</a>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="hidden sm:block text-sm font-black text-gray-900 hover:text-[#4B2182] transition-colors px-4">Dashboard</Link>
                                    <Link to="/landing" className="bg-[#4B2182] text-white px-8 py-3.5 rounded-2xl text-[13px] font-black hover:bg-[#F58220] transition-all transform hover:scale-105 shadow-xl shadow-[#4B2182]/20 active:scale-95 uppercase tracking-tight">
                                        New Project
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/auth" className="hidden sm:block text-sm font-black text-gray-900 hover:text-[#4B2182] transition-colors px-4">Login</Link>
                                    <Link to="/landing" className="bg-[#4B2182] text-white px-8 py-3.5 rounded-2xl text-[13px] font-black hover:bg-[#F58220] transition-all transform hover:scale-105 shadow-xl shadow-[#4B2182]/20 active:scale-95 uppercase tracking-tight">
                                        Get Started
                                    </Link>
                                </>
                            )}
                            <button className="md:hidden p-2 text-gray-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X strokeWidth={2.5} /> : <Menu strokeWidth={2.5} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white md:hidden pt-32 px-10 animate-fade-in">
                    <div className="flex flex-col gap-8 text-2xl font-black text-gray-900">
                        <a href="#">Product</a>
                        <a href="#">Enterprise</a>
                        <a href="#">Pricing</a>
                        <Link to="/landing">Get Started</Link>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden mesh-bg">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#4B2182]/10 bg-white/50 backdrop-blur-sm mb-10 animate-slide-up">
                        <span className="w-2 h-2 rounded-full bg-[#F58220] animate-pulse"></span>
                        <span className="text-xs font-black text-[#4B2182] tracking-widest uppercase">Visual Feedback for Teams</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8 animate-slide-up [animation-delay:100ms]">
                        Turn your website into a <span className="text-[#F58220]">collaborative</span> canvas.
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl font-medium text-gray-500 mb-12 animate-slide-up [animation-delay:200ms]">
                        Skip the back-and-forth emails. Annotate live websites, track design feedback, and ship faster with FlexyPin.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up [animation-delay:300ms]">
                        <Link to="/landing" className="w-full sm:w-auto bg-[#4B2182] text-white px-10 py-5 rounded-[2rem] text-lg font-black hover:bg-[#F58220] transition-all transform hover:scale-105 shadow-2xl shadow-[#4B2182]/30 flex items-center justify-center gap-3 group">
                            Install FlexyPin
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <button className="w-full sm:w-auto bg-white text-gray-900 px-10 py-5 rounded-[2rem] text-lg font-black hover:bg-gray-50 transition-all border border-gray-100 flex items-center justify-center gap-3 shadow-xl">
                            <Play size={20} className="text-[#F58220] fill-current" />
                            Watch Demo
                        </button>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-24 relative animate-slide-up [animation-delay:400ms]">
                        <div className="glass rounded-[3rem] p-4 shadow-3xl shadow-gray-200/50 relative">
                            <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden aspect-[16/9] relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                                    alt="FlexyPin Platform"
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                                {/* Overlay Markers Simulation */}
                                <div className="absolute top-1/4 left-1/3 w-10 h-10 bg-[#F58220] rounded-xl flex items-center justify-center text-white font-black shadow-2xl animate-bounce">1</div>
                                <div className="absolute top-1/2 left-2/3 w-10 h-10 bg-[#4B2182] rounded-xl flex items-center justify-center text-white font-black shadow-2xl animate-pulse">2</div>

                                <div className="absolute bottom-10 left-10 text-left">
                                    <div className="glass-dark p-6 rounded-3xl max-w-sm">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-4 h-4 rounded-full bg-[#F58220]"></div>
                                            <span className="text-[10px] font-black text-white tracking-widest uppercase">Comment Active</span>
                                        </div>
                                        <p className="text-white font-medium italic">"Maybe we should make the CTA button larger and use our brand orange?"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                        <div className="max-w-xl">
                            <span className="text-[#F58220] font-black text-xs tracking-[0.3em] uppercase mb-6 block">Product Suite</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85] text-[#4B2182]">Everything you need to ship faster.</h2>
                        </div>
                        <p className="text-gray-500 font-medium text-lg max-w-sm pb-2 leading-relaxed">
                            FlexyPin bridges the gap between design and development by bringing feedback directly onto the website.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <MousePointer2 className="text-[#F58220]" strokeWidth={2.5} />,
                                label: "Point & Click",
                                title: "Visual Annotations",
                                text: "Click anywhere on a live website to leave a pinpoint comment. No more screenshots."
                            },
                            {
                                icon: <Users className="text-[#4B2182]" strokeWidth={2.5} />,
                                label: "Real-time",
                                title: "Team Collaboration",
                                text: "Tag team members, reply to threads, and resolve feedback in real-time."
                            },
                            {
                                icon: <Sparkles className="text-[#F58220]" strokeWidth={2.5} />,
                                label: "Automated",
                                title: "Context Capture",
                                text: "FlexyPin automatically captures browser, OS, and screen resolution with every comment."
                            }
                        ].map((item, i) => (
                            <div key={i} className="group p-12 rounded-[3.5rem] bg-gray-50/50 hover:bg-white hover:shadow-3xl hover:shadow-[#4B2182]/5 transition-all duration-500 border border-transparent hover:border-[#4B2182]/5">
                                <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase mb-6 block">{item.label}</span>
                                <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">{item.title}</h3>
                                <p className="text-gray-500 font-medium text-base leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-40 px-6 bg-gray-50/50">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-[#F58220] font-black text-xs tracking-[0.3em] uppercase mb-6 block">Clear Pricing</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-[#4B2182] mb-12">Built for teams of all sizes.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                        {[
                            { name: 'Starter', price: '0', features: ['3 Projects', 'Unlimited Comments', '7-day History'] },
                            { name: 'Pro', price: '29', features: ['Unlimited Projects', 'Team Workspaces', 'Custom Branding', 'Priority Support'], highlighted: true },
                            { name: 'Enterprise', price: 'Custom', features: ['SSO & SAML', 'VPC Deployment', 'Dedicated Manager', 'Custom SLAs'] }
                        ].map((plan, i) => (
                            <div key={i} className={`p-10 rounded-[3rem] ${plan.highlighted ? 'bg-[#4B2182] text-white shadow-3xl shadow-[#4B2182]/30 scale-105' : 'bg-white border border-gray-100'} transition-all`}>
                                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                                <div className="mb-8">
                                    <span className="text-4xl font-black">${plan.price}</span>
                                    {plan.price !== 'Custom' && <span className="text-sm font-bold opacity-60">/mo</span>}
                                </div>
                                <ul className="text-left space-y-4 mb-10">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-center gap-3 text-sm font-bold opacity-80">
                                            <CheckCircle2 size={16} className={plan.highlighted ? 'text-[#F58220]' : 'text-green-500'} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${plan.highlighted ? 'bg-white text-[#4B2182] hover:bg-[#F58220] hover:text-white' : 'bg-gray-900 text-white hover:bg-[#4B2182]'}`}>
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-40 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-[#4B2182] mb-8">Let's talk.</h2>
                    <p className="text-xl text-gray-500 font-medium mb-16">Have questions or need a custom solution? Our team is here to help you ship faster.</p>
                    <div className="glass p-12 rounded-[4rem] text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Full Name</label>
                                    <input type="text" className="w-full bg-gray-50 border-transparent rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#4B2182]/5 transition-all" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Email Address</label>
                                    <input type="email" className="w-full bg-gray-50 border-transparent rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#4B2182]/5 transition-all" placeholder="john@company.com" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Message</label>
                                <textarea className="w-full h-[148px] bg-gray-50 border-transparent rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#4B2182]/5 transition-all resize-none" placeholder="Tell us about your project..."></textarea>
                            </div>
                        </div>
                        <button className="mt-8 bg-[#4B2182] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-[#F58220] transition-all transform hover:scale-105 shadow-2xl shadow-[#4B2182]/20">
                            Send Message
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#4B2182] rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-3xl shadow-[#4B2182]/30">
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#F58220]/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10 max-w-2xl text-white">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] mb-10">
                                Ready to pin your first <span className="text-[#F58220]">feedback?</span>
                            </h2>
                            <p className="text-xl text-white/70 font-medium mb-12">
                                Join over 5,000+ teams using FlexyPin to build better websites.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/landing" className="bg-white text-[#4B2182] px-10 py-5 rounded-[2rem] text-lg font-black hover:bg-[#F58220] hover:text-white transition-all text-center">
                                    Get Started for Free
                                </Link>
                                <button className="bg-transparent text-white border border-white/20 px-10 py-5 rounded-[2rem] text-lg font-black hover:bg-white/10 transition-all">
                                    Book a Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="max-w-sm">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <img src="/logo.png" alt="FlexyPin Logo" className="h-8" />
                        </Link>
                        <p className="text-gray-500 font-medium mb-8">
                            The visual feedback platform for modern teams. Ship better web experiences with less friction.
                        </p>
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100"></div>)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                        <div>
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-8">Platform</h4>
                            <ul className="flex flex-col gap-4 text-sm font-bold text-gray-500">
                                <li><a href="#" className="hover:text-[#4B2182]">Overview</a></li>
                                <li><a href="#" className="hover:text-[#4B2182]">Features</a></li>
                                <li><a href="#" className="hover:text-[#4B2182]">Integrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-8">Resources</h4>
                            <ul className="flex flex-col gap-4 text-sm font-bold text-gray-500">
                                <li><a href="#" className="hover:text-[#4B2182]">Docs</a></li>
                                <li><a href="#" className="hover:text-[#4B2182]">Blog</a></li>
                                <li><a href="#" className="hover:text-[#4B2182]">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-8">Follow</h4>
                            <ul className="flex flex-col gap-4 text-sm font-bold text-gray-500">
                                <li><a href="#" className="hover:text-[#4B2182]">Twitter</a></li>
                                <li><a href="#" className="hover:text-[#4B2182]">LinkedIn</a></li>
                                <li><a href="#" className="hover:text-[#4B2182]">GitHub</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                    <p>© 2026 FlexyPin Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-[#4B2182]">Privacy Policy</a>
                        <a href="#" className="hover:text-[#4B2182]">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
