const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const handleProxy = require('./proxy');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    }
});
const PORT = 3456;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // set `RateLimit` and `RateLimit-Policy` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Apply the rate limiting middleware to all requests.
app.use('/api/', limiter);

// ===== MIDDLEWARE =====

// Auth middleware
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const user = db.verifyToken(token);

    if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
};

// Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_project', (projectId) => {
        socket.join(projectId);
        console.log(`Socket ${socket.id} joined project: ${projectId}`);
    });

    socket.on('hover_comment', ({ projectId, commentId, isHovering }) => {
        socket.to(projectId).emit('comment_hovered', { commentId, isHovering, userId: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Optional auth middleware (for public routes that enhance with user data)
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const user = db.verifyToken(token);
        if (user) {
            req.user = user;
        }
    }
    next();
};

// ===== AUTHENTICATION ROUTES =====

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existing = await db.getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await db.createUser(email, password, name);
        const token = db.generateToken(user);

        res.json({
            user: { id: user.id, email: user.email, name: user.name },
            token
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Get user
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const valid = await db.verifyPassword(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = db.generateToken(user);

        res.json({
            user: { id: user.id, email: user.email, name: user.name },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.put('/api/auth/profile', authenticate, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updatedUser = await db.updateUser(req.user.id, { name, email, password });
        const token = db.generateToken(updatedUser);

        res.json({
            user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name },
            token
        });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// ===== PROJECT ROUTES =====

// Get user's projects
app.get('/api/projects', authenticate, async (req, res) => {
    try {
        const projects = await db.getUserProjects(req.user.id);
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create Project (optional auth for testing or public sandbox)
app.post('/api/projects', optionalAuth, async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).send('URL required');

        const userId = req.user?.id || null;
        const project = await db.createProject(url, userId);
        res.json(project);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get Project (public for viewers)
app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await db.getProject(req.params.id);
        if (!project) return res.status(404).send('Not found');
        res.json(project);
    } catch (err) {
        if (err.code === 'PGRST116') {
            return res.status(404).send('Not found');
        }
        console.error('Error fetching project:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete Project (owner only)
app.delete('/api/projects/:id', authenticate, async (req, res) => {
    try {
        await db.deleteProject(req.params.id, req.user.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting project:', err);
        if (err.message === 'Unauthorized') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.status(500).json({ error: err.message });
    }
});

// ===== COMMENT ROUTES =====

// Get Comments (public)
app.get('/api/comments', async (req, res) => {
    try {
        const { projectId } = req.query;
        if (!projectId) return res.status(400).send('ProjectId required');

        const comments = await db.getComments(projectId);
        res.json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create Comment (requires auth or allow anonymous with temp user)
app.post('/api/comments', optionalAuth, async (req, res) => {
    try {
        const { projectId, text, x, y, selector } = req.body;

        // Use authenticated user or create anonymous user data
        const userId = req.user?.id || null;
        const userName = req.user?.name || 'Anonymous';

        const comment = await db.createComment({
            projectId,
            userId,
            userName,
            text,
            x,
            y,
            selector
        });

        // Emit real-time event
        io.to(projectId).emit('comment_added', comment);

        res.json(comment);
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update Comment (owner only)
app.put('/api/comments/:id', authenticate, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Text required' });

        const comment = await db.updateComment(req.params.id, req.user.id, text);

        // Emit real-time event
        io.to(comment.project_id).emit('comment_updated', comment);

        res.json(comment);
    } catch (err) {
        console.error('Error updating comment:', err);
        if (err.message === 'Unauthorized') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update Comment Position (restricted to owner)
app.patch('/api/comments/:id/position', authenticate, async (req, res) => {
    try {
        const { x, y } = req.body;
        if (x === undefined || y === undefined) return res.status(400).json({ error: 'X and Y required' });

        const comment = await db.updateCommentPosition(req.params.id, req.user.id, x, y);

        // Emit real-time event
        io.to(comment.project_id).emit('comment_updated', comment);

        res.json(comment);
    } catch (err) {
        console.error('Error updating comment position:', err);
        if (err.message === 'Unauthorized') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/comments/:id/resolve', authenticate, async (req, res) => {
    try {
        const { resolved } = req.body;
        const comment = await db.resolveComment(req.params.id, req.user.id, resolved);

        // Emit real-time event
        io.to(comment.project_id).emit('comment_updated', comment);

        res.json(comment);
    } catch (err) {
        console.error('Error resolving comment:', err);
        if (err.message === 'Unauthorized') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete Comment (owner only)
app.delete('/api/comments/:id', authenticate, async (req, res) => {
    try {
        const comment = await db.deleteComment(req.params.id, req.user.id);

        if (comment) {
            io.to(comment.project_id).emit('comment_deleted', req.params.id);
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting comment:', err);
        if (err.message === 'Unauthorized') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.status(500).json({ error: err.message });
    }
});

// ===== REPLY ROUTES =====

// Get Replies
app.get('/api/replies', async (req, res) => {
    try {
        const { commentId } = req.query;
        if (!commentId) return res.status(400).send('CommentId required');

        const replies = await db.getReplies(commentId);
        res.json(replies);
    } catch (err) {
        console.error('Error fetching replies:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create Reply (optional auth)
app.post('/api/replies', optionalAuth, async (req, res) => {
    try {
        const { commentId, text } = req.body;
        if (!text) return res.status(400).json({ error: 'Text required' });

        const userId = req.user?.id || null;
        const userName = req.user?.name || 'Anonymous';

        const reply = await db.createReply({ commentId, userId, userName, text });

        // Get project_id for emission
        const { data: targetComment } = await db.supabase.from('comments').select('project_id').eq('id', commentId).single();
        if (targetComment) {
            io.to(targetComment.project_id).emit('reply_added', { ...reply, project_id: targetComment.project_id });
        }

        res.json(reply);
    } catch (err) {
        console.error('Error creating reply:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete Reply (owner only)
app.delete('/api/replies/:id', authenticate, async (req, res) => {
    try {
        await db.deleteReply(req.params.id, req.user.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting reply:', err);
        if (err.message === 'Unauthorized') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.status(500).json({ error: err.message });
    }
});

// ===== PROXY ROUTE =====
app.get('/proxy', handleProxy);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Export app for Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
