const path = require('path');
try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (e) { }
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Use environment variables for credentials
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-use-env-in-prod';

// Initialize Supabase.
const supabase = createClient(
    SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_KEY || 'placeholder'
);

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('WARNING: SUPABASE_URL or SUPABASE_KEY environment variables are missing.');
}

module.exports = {
    supabase,

    // ===== AUTHENTICATION =====
    async createUser(email, password, name) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('users')
            .insert({ email, password: hashedPassword, name })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getUserByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
    },

    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    },

    async updateUser(userId, updates) {
        const { name, email, password } = updates;
        const dataToUpdate = {};
        if (name) dataToUpdate.name = name;
        if (email) dataToUpdate.email = email;
        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const { data, error } = await supabase
            .from('users')
            .update(dataToUpdate)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ===== PROJECTS =====
    async createProject(url, userId) {
        const { data, error } = await supabase
            .from('projects')
            .insert({ url, owner_id: userId })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getProject(id) {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async getUserProjects(userId) {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                comments:comments(count)
            `)
            .eq('owner_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform comment count
        return data.map(project => ({
            ...project,
            comment_count: project.comments?.[0]?.count || 0,
            comments: undefined
        }));
    },

    async deleteProject(projectId, userId) {
        // First check ownership
        const { data: project } = await supabase
            .from('projects')
            .select('owner_id')
            .eq('id', projectId)
            .single();

        if (!project || project.owner_id !== userId) {
            throw new Error('Unauthorized');
        }

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) throw error;
        return true;
    },

    // ===== COMMENTS =====
    async getComments(projectId) {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    async createComment({ projectId, userId, userName, text, x, y, selector }) {
        const { data, error } = await supabase
            .from('comments')
            .insert({
                project_id: projectId,
                user_id: userId,
                user_name: userName,
                text,
                x,
                y,
                selector: selector || ''
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateComment(commentId, userId, text) {
        // First check ownership
        const { data: comment } = await supabase
            .from('comments')
            .select('user_id')
            .eq('id', commentId)
            .single();

        if (!comment || comment.user_id !== userId) {
            throw new Error('Unauthorized');
        }

        const { data, error } = await supabase
            .from('comments')
            .update({ text })
            .eq('id', commentId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteComment(commentId, userId) {
        // 1. Fetch the comment
        const { data: comment, error: commentError } = await supabase
            .from('comments')
            .select('*')
            .eq('id', commentId)
            .single();

        if (commentError || !comment) {
            console.error('Delete error: Comment not found', commentId);
            throw new Error('Comment not found');
        }

        // 2. Fetch the project to get the owner_id
        const { data: project } = await supabase
            .from('projects')
            .select('owner_id')
            .eq('id', comment.project_id)
            .single();

        const projectOwnerId = project?.owner_id;

        // 3. Authorization: Must be comment author OR project owner
        if (String(comment.user_id) === String(userId) || String(projectOwnerId) === String(userId)) {
            console.log('Authorization successful');
        } else {
            console.warn('Unauthorized delete attempt blocked');
            throw new Error('Unauthorized');
        }

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) throw error;
        return comment;
    },

    async updateCommentPosition(commentId, userId, x, y) {
        // First check ownership
        const { data: comment } = await supabase
            .from('comments')
            .select('user_id')
            .eq('id', commentId)
            .single();

        if (!comment || comment.user_id !== userId) {
            throw new Error('Unauthorized');
        }

        const { data, error } = await supabase
            .from('comments')
            .update({ x, y })
            .eq('id', commentId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async resolveComment(commentId, userId, resolved) {
        // Authorization: Must be comment author OR project owner
        const { data: comment, error: commentError } = await supabase
            .from('comments')
            .select('*, projects(owner_id)')
            .eq('id', commentId)
            .single();

        if (commentError || !comment) throw new Error('Comment not found');

        const projectOwnerId = comment.projects?.owner_id;

        if (comment.user_id === userId || projectOwnerId === userId) {
            // Authorized
        } else {
            throw new Error('Unauthorized');
        }

        const { data, error } = await supabase
            .from('comments')
            .update({ resolved })
            .eq('id', commentId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ===== REPLIES =====
    async getReplies(commentId) {
        const { data, error } = await supabase
            .from('replies')
            .select('*')
            .eq('comment_id', commentId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    async createReply({ commentId, userId, userName, text }) {
        const { data, error } = await supabase
            .from('replies')
            .insert({
                comment_id: commentId,
                user_id: userId,
                user_name: userName,
                text
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteReply(replyId, userId) {
        // 1. Fetch the reply
        const { data: reply, error: replyError } = await supabase
            .from('replies')
            .select('*')
            .eq('id', replyId)
            .single();

        if (replyError || !reply) throw new Error('Reply not found');

        // 2. Fetch the comment to get the project_id
        const { data: comment } = await supabase
            .from('comments')
            .select('project_id')
            .eq('id', reply.comment_id)
            .single();

        // 3. Fetch the project to get the owner_id
        let projectOwnerId = null;
        if (comment) {
            const { data: project } = await supabase
                .from('projects')
                .select('owner_id')
                .eq('id', comment.project_id)
                .single();
            projectOwnerId = project?.owner_id;
        }

        // 4. Authorization: Must be reply author OR project owner
        if (reply.user_id == userId || projectOwnerId == userId) {
            // Success
        } else {
            throw new Error('Unauthorized');
        }

        const { error } = await supabase
            .from('replies')
            .delete()
            .eq('id', replyId);

        if (error) throw error;
        return true;
    }
};
