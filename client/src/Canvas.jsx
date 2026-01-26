import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
    Monitor,
    Smartphone,
    Tablet,
    ChevronLeft,
    MessageSquare,
    Share2,
    Clock,
    CheckCircle2,
    Edit2,
    Trash2,
    Reply,
    X,
    Send,
    User,
    Crown
} from 'lucide-react';

export default function Canvas() {
    const { id } = useParams();
    const { user, getToken } = useAuth();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState({});
    const [device, setDevice] = useState('desktop');
    const [loading, setLoading] = useState(true);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [toast, setToast] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const iframeRef = useRef(null);

    const isOwner = user && project && project.owner_id === user.id;

    useEffect(() => {
        loadProject();
        loadComments();

        const handleMessage = (e) => {
            if (e.data && e.data.projectId === id) {
                if (e.data.type === 'COMMENT_ADDED') {
                    loadComments();
                    setActiveCommentId(e.data.commentId);
                }
                if (e.data.type === 'MARKER_CLICKED') {
                    setActiveCommentId(e.data.commentId);
                    const comment = comments.find(c => c.id === e.data.commentId);
                    if (comment) {
                        loadReplies(comment.id);
                        setSelectedComment(comment);
                    }
                    const el = document.getElementById(`comment-${e.data.commentId}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [id, comments]);

    const loadProject = async () => {
        try {
            const res = await fetch(`http://localhost:3456/api/projects/${id}`);
            const data = await res.json();
            setProject(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            const res = await fetch(`http://localhost:3456/api/comments?projectId=${id}`);
            const data = await res.json();
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadReplies = async (commentId) => {
        try {
            const res = await fetch(`http://localhost:3456/api/replies?commentId=${commentId}`);
            const data = await res.json();
            setReplies(prev => ({ ...prev, [commentId]: data }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleCommentClick = (commentId) => {
        setActiveCommentId(commentId);
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'HIGHLIGHT_COMMENT',
                commentId
            }, '*');
        }
    };

    const handleEditComment = async () => {
        if (!editText.trim()) return;

        try {
            const res = await fetch(`http://localhost:3456/api/comments/${editingCommentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ text: editText })
            });

            if (res.ok) {
                loadComments();
                setEditingCommentId(null);
                setToast('Comment updated!');
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setToast('Failed to update comment');
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const res = await fetch(`http://localhost:3456/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (res.ok) {
                loadComments();
                setToast('Comment deleted!');
                setTimeout(() => setToast(null), 3000);
            } else {
                const errorData = await res.json().catch(() => ({}));
                setToast(errorData.error || 'Failed to delete comment');
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setToast('Network error occurred');
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleReply = async () => {
        if (!replyText.trim() || !selectedComment) return;

        try {
            const res = await fetch('http://localhost:3456/api/replies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && { 'Authorization': `Bearer ${getToken()}` })
                },
                body: JSON.stringify({
                    commentId: selectedComment.id,
                    text: replyText
                })
            });

            if (res.ok) {
                loadReplies(selectedComment.id);
                setReplyText('');
                setShowReplyForm(false);
                setToast('Reply added!');
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setToast('Link copied to clipboard!');
                setTimeout(() => setToast(null), 3000);
            })
            .catch(() => {
                setToast('Failed to copy link');
                setTimeout(() => setToast(null), 3000);
            });
    };

    const getWidth = () => {
        if (device === 'mobile') return '375px';
        if (device === 'tablet') return '768px';
        return '100%';
    };

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-400 font-medium">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mr-3"></div>
                Loading Project...
            </div>
        );
    }

    if (!project) return <div className="p-10 text-center text-red-500">Project not found</div>;

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-100 font-sans text-gray-900 relative">

            {/* Toast Notification */}
            {toast && (
                <div className="absolute top-20 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-down">
                    <CheckCircle2 size={20} className="text-green-400" />
                    <span className="font-medium text-sm">{toast}</span>
                </div>
            )}

            {/* Comment Detail Modal */}
            {selectedComment && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => {
                        setSelectedComment(null);
                        setShowReplyForm(false);
                        setReplyText('');
                    }}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-fade-in-down"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                    {comments.findIndex(c => c.id === selectedComment.id) + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Comment Details</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <User size={14} />
                                        {selectedComment.user_name}
                                        {user && selectedComment.user_id === user.id && (
                                            <span className="text-rose-600">(You)</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedComment(null);
                                    setShowReplyForm(false);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Main Comment */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                                    {selectedComment.text}
                                </p>
                                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(selectedComment.created_at).toLocaleString()}
                                    </div>
                                    <span>{selectedComment.text.length} characters</span>
                                </div>
                            </div>

                            {/* Replies Section */}
                            {replies[selectedComment.id] && replies[selectedComment.id].length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Reply size={16} />
                                        Replies ({replies[selectedComment.id].length})
                                    </h4>
                                    <div className="space-y-3">
                                        {replies[selectedComment.id].map((reply) => (
                                            <div key={reply.id} className="bg-white border border-gray-200 rounded-lg p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                                        <User size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-sm text-gray-900">{reply.user_name}</span>
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(reply.created_at).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 break-words">{reply.text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reply Form */}
                            {!showReplyForm ? (
                                <button
                                    onClick={() => setShowReplyForm(true)}
                                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium flex items-center justify-center gap-2"
                                >
                                    <Reply size={18} />
                                    Add Reply
                                </button>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write your reply..."
                                        className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                                        rows={3}
                                    />
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={handleReply}
                                            disabled={!replyText.trim()}
                                            className="flex-1 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Send size={16} />
                                            Send Reply
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowReplyForm(false);
                                                setReplyText('');
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to={user ? "/dashboard" : "/"} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-semibold text-lg leading-tight truncate max-w-xs md:max-w-md">{project.url}</h1>
                            {isOwner && (
                                <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded flex items-center gap-1">
                                    <Crown size={12} />
                                    OWNER
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            {isOwner ? 'Your Project' : 'View Only'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setDevice('desktop')}
                        className={`p-2 rounded-md transition ${device === 'desktop' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-500 hover:text-gray-900'}`}
                        title="Desktop View"
                    >
                        <Monitor size={18} />
                    </button>
                    <button
                        onClick={() => setDevice('tablet')}
                        className={`p-2 rounded-md transition ${device === 'tablet' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-500 hover:text-gray-900'}`}
                        title="Tablet View"
                    >
                        <Tablet size={18} />
                    </button>
                    <button
                        onClick={() => setDevice('mobile')}
                        className={`p-2 rounded-md transition ${device === 'mobile' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-500 hover:text-gray-900'}`}
                        title="Mobile View"
                    >
                        <Smartphone size={18} />
                    </button>
                </div>

                <div>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shadow-sm font-medium text-sm active:transform active:scale-95"
                    >
                        <Share2 size={16} />
                        <span>Share</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky top-0">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare size={14} />
                            Comments ({comments.length})
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                        {comments.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                                    <MessageSquare size={24} />
                                </div>
                                <p className="text-gray-900 font-medium">No comments yet</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isOwner ? 'Click anywhere on the website to add your first comment.' : 'The owner hasn\'t added any comments yet.'}
                                </p>
                            </div>
                        )}
                        {comments.map((c, i) => {
                            const isActive = activeCommentId === c.id;
                            const isEditing = editingCommentId === c.id;
                            const isAuthor = user && c.user_id === user.id;
                            const canDelete = isAuthor || isOwner;

                            return (
                                <div
                                    key={c.id}
                                    id={`comment-${c.id}`}
                                    className={`group p-4 rounded-xl border shadow-sm transition-all duration-200 ${isActive
                                        ? 'bg-blue-50 border-blue-200 shadow-md ring-1 ring-blue-100'
                                        : 'bg-white border-gray-200 hover:shadow-md hover:border-rose-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm mt-0.5 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'
                                            }`}>
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <textarea
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-rose-500/20"
                                                        rows={3}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleEditComment}
                                                            className="px-3 py-1 bg-rose-600 text-white text-xs rounded hover:bg-rose-700 transition"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingCommentId(null)}
                                                            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <p className={`text-sm leading-relaxed font-medium transition-colors break-words flex-1 ${isActive ? 'text-blue-900' : 'text-gray-800'
                                                            }`}
                                                            onClick={() => handleCommentClick(c.id)}
                                                        >
                                                            {truncateText(c.text)}
                                                        </p>
                                                        {isAuthor && (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCommentId(c.id);
                                                                    setEditText(c.text);
                                                                }}
                                                                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                        )}
                                                        {canDelete && (
                                                            <button
                                                                onClick={() => handleDeleteComment(c.id)}
                                                                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                                                            }`}>
                                                            <User size={10} />
                                                            {c.user_name}
                                                        </span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                                                            }`}>
                                                            <Clock size={10} />
                                                            {new Date(c.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Canvas */}
                <main className="flex-1 flex justify-center bg-gray-200/80 overflow-auto relative p-8">
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6b7280 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div
                        className="transition-all duration-500 ease-in-out relative bg-white shadow-2xl h-full z-10 mx-auto rounded-lg overflow-hidden border border-gray-300 ring-4 ring-gray-200/50"
                        style={{ width: getWidth(), maxWidth: '100%' }}
                    >
                        <iframe
                            ref={iframeRef}
                            src={`http://localhost:3456/proxy?url=${encodeURIComponent(project.url)}&projectId=${id}`}
                            className="w-full h-full border-0"
                            title="Website Viewer"
                            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
