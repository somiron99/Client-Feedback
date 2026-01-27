import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    ExternalLink,
    Trash2,
    Search,
    LayoutGrid,
    List,
    Clock,
    Layers,
    ChevronRight,
    ArrowRight,
    Monitor,
    SearchIcon,
    Filter,
    User,
    LogOut,
    Settings,
    ChevronDown
} from 'lucide-react';
import { useAuth } from './AuthContext';
import ConfirmModal from './ConfirmModal';

export default function Dashboard() {
    const { user, getToken, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, projectId: null });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = getToken();
            const res = await fetch('/api/projects', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                logout();
                navigate('/auth');
                return;
            }

            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch projects', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setConfirmDelete({ isOpen: true, projectId: id });
    };

    const confirmDeleteProject = async () => {
        const id = confirmDelete.projectId;
        try {
            const token = getToken();
            const res = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-jakarta">

            {/* Sidebar / Top Nav */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between shadow-sm">
                <Link to="/" className="flex items-center group">
                    <img src="/logo.png" alt="FlexyPin Logo" className="h-7 group-hover:scale-105 transition-transform" />
                </Link>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="User menu"
                            aria-expanded={isMenuOpen}
                            className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-50 transition-all group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-[#4B2182]/5 flex items-center justify-center text-[#4B2182] group-hover:bg-[#4B2182] group-hover:text-white transition-all">
                                <User size={18} strokeWidth={2.5} />
                            </div>
                            <div className="hidden md:flex flex-col items-start leading-none">
                                <span className="text-[11px] font-black text-gray-900 mb-1">{user?.name || 'User'}</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Free Plan</span>
                            </div>
                            <ChevronDown size={14} className={`text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-3 w-56 glass rounded-3xl p-2 shadow-2xl animate-slide-up border border-white/50">
                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-[#4B2182]/5 hover:text-[#4B2182] transition-all group">
                                    <Settings size={16} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform" />
                                    Account Settings
                                </Link>
                                <button
                                    onClick={() => { logout(); navigate('/auth'); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
                                >
                                    <LogOut size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/landing"
                        aria-label="Create new project"
                        className="w-11 h-11 rounded-2xl bg-[#4B2182] text-white flex items-center justify-center hover:bg-[#F58220] hover:scale-105 shadow-lg shadow-[#4B2182]/20 active:scale-95 transition-all"
                    >
                        <Plus size={22} strokeWidth={2.5} />
                    </Link>
                </div>
            </nav>

            <main className="pt-28 pb-20 max-w-7xl mx-auto px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl font-black text-[#4B2182] tracking-tight mb-2">My Projects</h1>
                        <p className="text-gray-500 font-medium">Manage and review your active feedback sessions.</p>
                    </div>
                    <Link
                        to="/landing"
                        className="bg-[#4B2182] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm hover:bg-[#F58220] transition-all transform hover:scale-105 shadow-xl shadow-[#4B2182]/20 flex items-center gap-3"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Create Project
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="glass rounded-3xl p-4 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4B2182] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full bg-gray-50/50 border-transparent focus:bg-white focus:border-[#4B2182]/20 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold placeholder:text-gray-400 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl text-[#4B2182]"><LayoutGrid size={18} /></button>
                        <button className="p-3 text-gray-400 hover:text-[#4B2182] transition-colors"><List size={18} /></button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-[4rem] p-20 text-center border border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <Layers size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-4">No projects found</h3>
                        <p className="text-gray-500 font-medium mb-12 max-w-xs mx-auto">Start by adding a website URL to create your first feedback workspace.</p>
                        <Link to="/landing" className="inline-flex items-center gap-3 text-[#4B2182] font-black hover:text-[#F58220] transition-colors">
                            Get started now <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((p) => (
                            <Link
                                key={p.id}
                                to={`/canvas/${p.id}`}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 hover:shadow-3xl hover:shadow-[#4B2182]/5 transition-all duration-500 relative overflow-hidden flex flex-col"
                            >
                                {/* Decorative Accent */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F58220]/10 to-transparent rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="w-14 h-14 bg-[#4B2182]/5 rounded-[1.25rem] flex items-center justify-center text-[#4B2182] group-hover:bg-[#4B2182] group-hover:text-white transition-all duration-500">
                                        <Monitor size={24} />
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(p.id, e)}
                                        aria-label="Delete project"
                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all transform active:scale-90"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="mb-8 relative z-10">
                                    <h3 className="text-xl font-black text-gray-900 truncate mb-1" title={p.url}>
                                        {p.url.replace(/^https?:\/\//, '')}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                        <Clock size={12} />
                                        Active Feedback
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between bg-gray-50 rounded-2xl p-4 group-hover:bg-[#4B2182]/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-[#4B2182] border-2 border-white flex items-center justify-center text-[10px] text-white font-black">FP</div>
                                            <div className="w-8 h-8 rounded-full bg-[#F58220] border-2 border-white flex items-center justify-center text-[10px] text-white font-black">?</div>
                                        </div>
                                        <span className="text-xs font-black text-gray-900">2 Stakeholders</span>
                                    </div>
                                    <ChevronRight size={18} className="text-[#4B2182] group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, projectId: null })}
                onConfirm={confirmDeleteProject}
                title="Delete Project?"
                message="This will permanently remove the project and all associated annotations. This action cannot be undone."
                type="danger"
                confirmText="Delete Project"
            />
        </div>
    );
}
