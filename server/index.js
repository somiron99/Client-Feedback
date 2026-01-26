const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const handleProxy = require('./proxy');

const app = express();
const PORT = 3456;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// Create Project (requires auth)
app.post('/api/projects', authenticate, async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).send('URL required');

        const project = await db.createProject(url, req.user.id);
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
        res.json(comment);
    } catch (err) {
        console.error('Error updating comment:', err);
        if (err.message === 'Unauthorized') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete Comment (owner only)
app.delete('/api/comments/:id', authenticate, async (req, res) => {
    try {
        console.log(`DELETE request for comment ${req.params.id} from user ${req.user.id}`);
        await db.deleteComment(req.params.id, req.user.id);
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

// Export app for Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
