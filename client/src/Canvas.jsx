import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MessageSquare,
    Share2,
    Settings,
    ChevronRight,
    ArrowLeft,
    Monitor,
    Smartphone,
    Tablet,
    CheckCircle2,
    Clock,
    Send,
    Trash2,
    Filter,
    Users,
    Search,
    Zap,
    Tag,
    Trash,
    Loader2,
    Check
} from 'lucide-react';
import { useAuth } from './AuthContext';
import ConfirmModal from './ConfirmModal';
import io from 'socket.io-client';

// Use current origin for socket connection. Vite proxy handles /socket.io in dev, 
// and in prod it's the same host.
const socket = io(window.location.origin);

export default function Canvas() {
    const { projectId } = useParams();
    const { user, getToken } = useAuth();
    const [project, setProject] = useState(null);
    const [view, setView] = useState('desktop');
    const [comments, setComments] = useState([]);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [remoteHoveredComment, setRemoteHoveredComment] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, commentId: null });
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [showResolved, setShowResolved] = useState(true);

    useEffect(() => {
        fetchProject();
        fetchComments();

        // Socket.io integration
        socket.emit('join_project', projectId);

        socket.on('comment_added', (newComment) => {
            setComments(prev => [...prev, newComment]);
            // Notify iframe
            const iframe = document.querySelector('iframe');
            if (iframe) iframe.contentWindow.postMessage({ type: 'COMMENT_ADDED' }, '*');
        });

        socket.on('comment_updated', (updatedComment) => {
            setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c));
            // Notify iframe if marker moved or resolved
            const iframe = document.querySelector('iframe');
            if (iframe) iframe.contentWindow.postMessage({ type: 'COMMENT_UPDATED', comment: updatedComment }, '*');
        });

        socket.on('comment_deleted', (commentId) => {
            setComments(prev => prev.filter(c => c.id !== commentId));
            if (activeCommentId === commentId) setActiveCommentId(null);
            // Notify iframe
            const iframe = document.querySelector('iframe');
            if (iframe) iframe.contentWindow.postMessage({ type: 'COMMENT_DELETED', commentId }, '*');
        });

        socket.on('reply_added', (newReply) => {
            setComments(prev => prev.map(c => {
                if (c.id === newReply.comment_id) {
                    return { ...c, replies: [...(c.replies || []), newReply] };
                }
                return c;
            }));
        });

        socket.on('comment_hovered', ({ commentId, isHovering }) => {
            setRemoteHoveredComment(isHovering ? commentId : null);
            // Notify iframe
            const iframe = document.querySelector('iframe');
            if (iframe) iframe.contentWindow.postMessage({ type: 'REMOTE_HOVER', commentId, isHovering }, '*');
        });

        const handleMessage = (event) => {
            if (event.data.type === 'COMMENT_ADDED') {
                // Actually now handled by socket, but we keep this for local feedback if needed
                // or just rely on socket.
                fetchComments();
            }
            if (event.data.type === 'MARKER_CLICKED') {
                setActiveCommentId(event.data.commentId);
                const el = document.getElementById(`comment-${event.data.commentId}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (event.data.type === 'MARKER_HOVER') {
                socket.emit('hover_comment', { projectId, commentId: event.data.commentId, isHovering: event.data.isHovering });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
            socket.off('comment_added');
            socket.off('comment_updated');
            socket.off('comment_deleted');
            socket.off('reply_added');
        };
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            const data = await res.json();
            setProject(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?projectId=${projectId}`);
            const data = await res.json();
            setComments(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleResolve = async (commentId) => {
        try {
            const token = getToken();
            const comment = comments.find(c => c.id === commentId);
            await fetch(`/api/comments/${commentId}/resolve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ resolved: !comment.resolved })
            });
            fetchComments();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteComment = (commentId) => {
        setConfirmDelete({ isOpen: true, commentId });
    };

    const confirmDeleteAnnotation = async () => {
        const commentId = confirmDelete.commentId;
        try {
            const token = getToken();
            await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            fetchComments();
            if (activeCommentId === commentId) setActiveCommentId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddReply = async (commentId) => {
        if (!replyText.trim()) return;
        try {
            const token = getToken();
            await fetch(`/api/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    commentId,
                    text: replyText,
                    userName: user?.name || 'Anonymous'
                })
            });
            setReplyText('');
            fetchComments();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredComments = comments.filter(c => showResolved || !c.resolved);

    if (loading) return (
        <div className="h-screen w-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-8 border-[#4B2182]/10 border-t-[#4B2182] rounded-full animate-spin"></div>
                <span className="text-xs font-black text-[#4B2182] tracking-widest uppercase">Booting Workspace...</span>
            </div>
        </div>
    );

    return (
        <div id="main-content" className="h-screen w-screen bg-[#F8FAFC] flex flex-col font-jakarta overflow-hidden">

            {/* Canvas Top Bar */}
            <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-30 shadow-sm">
                <div className="flex items-center gap-6">
                    <Link to="/dashboard" aria-label="Go back to dashboard" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-[#4B2182] transition-colors focus-visible:ring-2 focus-visible:ring-[#4B2182] outline-none">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <img src="/logo.png" alt="Logo" className="h-6" />
                        <div className="hidden sm:block h-6 w-[1.5px] bg-gray-100 mx-1"></div>
                        <h1 className="text-[13px] font-extrabold text-[#4B2182] tracking-tight truncate max-w-[240px] uppercase" title={project?.url}>
                            {project?.url.replace(/^https?:\/\//, '')}
                        </h1>
                    </div>
                </div>

                {/* Viewport Controls */}
                <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1.5 rounded-[1.25rem]">
                    {[
                        { id: 'desktop', icon: <Monitor size={18} /> },
                        { id: 'tablet', icon: <Tablet size={18} /> },
                        { id: 'mobile', icon: <Smartphone size={18} /> }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            aria-label={`Switch to ${item.id} view`}
                            className={`p-3 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-[#4B2182] outline-none ${view === item.id
                                ? 'bg-[#4B2182] text-white shadow-lg shadow-[#4B2182]/20'
                                : 'text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-500 hover:text-[#4B2182] transition-colors focus-visible:ring-2 focus-visible:ring-[#4B2182] outline-none">
                        <Share2 size={16} />
                        Share Workspace
                    </button>
                    <button aria-label="Settings" className="p-3 bg-gray-900 text-white rounded-xl hover:bg-[#F58220] transition-all transform active:scale-95 focus-visible:ring-2 focus-visible:ring-gray-900 outline-none">
                        <Settings size={18} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">

                {/* Main Canvas Area */}
                <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-auto bg-gray-50/50 scrollbar-hide">
                    <div className={`bg-white shadow-3xl shadow-gray-200/50 rounded-2xl overflow-hidden transition-all duration-700 ${view === 'desktop' ? 'w-full max-w-[1600px] h-full' :
                        view === 'tablet' ? 'w-[768px] h-full' :
                            'w-[375px] h-full'
                        } relative border border-gray-100`}>
                        {project && (
                            <iframe
                                src={`/proxy?url=${encodeURIComponent(project.url)}&projectId=${project.id}`}
                                className="w-full h-full border-none"
                                title="Website Preview"
                            />
                        )}
                    </div>
                </div>

                {/* Feedback Sidebar */}
                <aside className="w-[420px] bg-white border-l border-gray-100 flex flex-col z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.02)]">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#4B2182]/5 rounded-xl flex items-center justify-center text-[#4B2182]">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">Annotations</h2>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{comments.length} total pins</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowResolved(!showResolved)}
                                className={`p-3 rounded-xl transition-all ${!showResolved ? 'bg-[#F58220] text-white' : 'bg-gray-50 text-gray-400'}`}
                                title="Toggle Resolved"
                            >
                                <Filter size={18} />
                            </button>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#4B2182] transition-colors" size={16} aria-hidden="true" />
                            <input
                                type="text"
                                placeholder="Search annotations..."
                                aria-label="Search annotations"
                                className="w-full bg-gray-50/50 border-transparent focus:bg-white focus:border-[#4B2182]/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#4B2182]"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-6 space-y-4 scrollbar-hide">
                        {filteredComments.map((c, i) => (
                            <div
                                key={c.id}
                                id={`comment-${c.id}`}
                                onMouseEnter={() => socket.emit('hover_comment', { projectId, commentId: c.id, isHovering: true })}
                                onMouseLeave={() => socket.emit('hover_comment', { projectId, commentId: c.id, isHovering: false })}
                                onClick={() => {
                                    setActiveCommentId(c.id);
                                    // Message iframe to highlight
                                    const iframe = document.querySelector('iframe');
                                    if (iframe) iframe.contentWindow.postMessage({ type: 'HIGHLIGHT_COMMENT', commentId: c.id }, '*');
                                }}
                                className={`group p-6 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${activeCommentId === c.id
                                    ? 'bg-white border-[#4B2182] shadow-xl shadow-[#4B2182]/5'
                                    : 'bg-white border-gray-50 hover:border-gray-100 hover:shadow-lg'
                                    } ${c.resolved ? 'opacity-50' : ''} ${remoteHoveredComment === c.id ? 'ring-2 ring-orange-400 ring-inset bg-orange-50/20' : ''}`}
                            >
                                {/* Visual Accent */}
                                <div className={`absolute top-0 left-0 w-1 h-full transition-all ${activeCommentId === c.id ? 'bg-[#4B2182]' : 'bg-gray-100 group-hover:bg-[#4B2182]/20'}`}></div>

                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center text-[10px] font-black group-hover:bg-[#4B2182] transition-colors">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-gray-900 tracking-tight">{c.userName || 'Guest User'}</h4>
                                            <span className="text-[10px] font-black text-gray-300 uppercase italic">Just now</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleResolve(c.id); }}
                                            aria-label={c.resolved ? "Unresolve comment" : "Resolve comment"}
                                            className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-green-500 outline-none ${c.resolved ? 'bg-orange-50 text-[#F58220]' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                                                }`}
                                        >
                                            {c.resolved ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <Check size={16} strokeWidth={3} />}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteComment(c.id); }}
                                            aria-label="Delete comment"
                                            className="p-2.5 bg-red-50 text-red-400 hover:text-red-500 hover:bg-red-100 rounded-xl transition-all hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                                        >
                                            <Trash2 size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
                                    {c.text}
                                </p>

                                {activeCommentId === c.id && (
                                    <div className="mt-6 pt-6 border-t border-gray-100 animate-slide-up">
                                        <div className="space-y-4 mb-4">
                                            {c.replies?.map(r => (
                                                <div key={r.id} className="flex gap-3">
                                                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[8px] font-black">YU</div>
                                                    <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                                                        <p className="text-xs font-medium text-gray-700">{r.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Type a reply..."
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                onKeyPress={e => e.key === 'Enter' && handleAddReply(c.id)}
                                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-[#4B2182]/10 rounded-xl py-3 pl-4 pr-12 text-xs font-bold outline-none transition-all"
                                            />
                                            <button
                                                onClick={() => handleAddReply(c.id)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#4B2182] hover:text-[#F58220] transition-colors"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-4 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                            <div className="flex items-center gap-2"><Clock size={12} /> Live Sync</div>
                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                            <div className="flex items-center gap-2"><Tag size={12} /> Auto-Context</div>
                        </div>
                    </div>
                </aside>
            </div>

            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, commentId: null })}
                onConfirm={confirmDeleteAnnotation}
                title="Delete Annotation?"
                message="This will permanently remove this comment and its position on the website. This action cannot be undone."
                type="danger"
                confirmText="Delete Annotation"
            />
        </div>
    );
}
