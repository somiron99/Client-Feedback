import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Globe, Plus, Trash2, ExternalLink, MessageSquare, LogOut, User } from 'lucide-react';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProjectUrl, setNewProjectUrl] = useState('');
    const [showNewProject, setShowNewProject] = useState(false);
    const [creating, setCreating] = useState(false);
    const { user, logout, getToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const response = await fetch('http://localhost:3456/api/projects', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectUrl) return;

        setCreating(true);
        let submitUrl = newProjectUrl;
        if (!submitUrl.startsWith('http')) {
            submitUrl = 'https://' + submitUrl;
        }

        try {
            const response = await fetch('http://localhost:3456/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ url: submitUrl })
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/project/${data.id}`);
            } else {
                alert('Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`http://localhost:3456/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (response.ok) {
                setProjects(projects.filter(p => p.id !== projectId));
            } else {
                alert('Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Pastel</h1>
                                <p className="text-xs text-gray-500">Your Projects</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                                <User size={16} />
                                <span className="font-medium">{user?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                            >
                                <LogOut size={16} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">My Projects</h2>
                        <p className="text-gray-600 mt-1">Create and manage your annotation projects</p>
                    </div>
                    <button
                        onClick={() => setShowNewProject(!showNewProject)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-md font-semibold"
                    >
                        <Plus size={20} />
                        New Project
                    </button>
                </div>

                {/* New Project Form */}
                {showNewProject && (
                    <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Project</h3>
                        <form onSubmit={handleCreateProject} className="flex gap-3">
                            <div className="flex-1 relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    placeholder="example.com"
                                    value={newProjectUrl}
                                    onChange={(e) => setNewProjectUrl(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={creating}
                                className="px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition shadow-sm font-semibold disabled:opacity-50"
                            >
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowNewProject(false);
                                    setNewProjectUrl('');
                                }}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Globe size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
                        <p className="text-gray-500 mb-6">Create your first project to get started</p>
                        <button
                            onClick={() => setShowNewProject(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-md font-semibold"
                        >
                            <Plus size={20} />
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition group"
                            >
                                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                                    <Globe size={48} className="text-gray-300" />
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 mb-1 truncate group-hover:text-rose-600 transition">
                                        {project.url}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Created {new Date(project.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MessageSquare size={16} />
                                            <span>{project.comment_count || 0} comments</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/project/${project.id}`)}
                                                className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                title="Open project"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProject(project.id)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete project"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
