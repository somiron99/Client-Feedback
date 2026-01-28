(function () {
    const config = window.PASTEL_CONFIG;
    if (!config) return;

    // Create a container for our UI
    const container = document.createElement('div');
    container.id = 'pastel-overlay-container';

    // Use Shadow DOM
    const shadow = container.attachShadow({ mode: 'open' });
    document.body.appendChild(container);

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .comment-marker {
            position: absolute;
            width: 32px;
            height: 32px;
            background: #F58220; /* FlexyPin Orange */
            border: 2px solid white;
            border-radius: 10px;
            box-shadow: 0 10px 15px -3px rgba(245, 130, 32, 0.4);
            cursor: pointer;
            z-index: 2147483640;
            transform: translate(-50%, -50%) rotate(0deg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 13px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: marker-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes marker-pop {
            from { transform: translate(-50%, -50%) scale(0) rotate(-10deg); opacity: 0; }
            to { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }
        .comment-marker:hover {
            transform: translate(-50%, -50%) scale(1.15) rotate(5deg);
            box-shadow: 0 20px 25px -5px rgba(245, 130, 32, 0.5);
            z-index: 2147483650;
        }
        .comment-marker.active {
            background: #4B2182; /* FlexyPin Purple */
            transform: translate(-50%, -50%) scale(1.2) rotate(0deg);
            z-index: 2147483651;
            box-shadow: 0 0 0 5px rgba(245, 130, 32, 0.2), 0 25px 50px -12px rgba(75, 33, 130, 0.5);
            border-color: #F58220;
        }
        .comment-marker.resolved {
            background: #10B981; /* Green-500 */
            opacity: 0.85;
            box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
            border-color: #ECFDF5;
        }
        .comment-marker.remote-hover {
            background: #F58220;
            box-shadow: 0 0 0 4px rgba(245, 130, 32, 0.4), 0 20px 25px -5px rgba(245, 130, 32, 0.5);
            transform: translate(-50%, -50%) scale(1.15);
            z-index: 2147483655;
            border-color: #4B2182;
        }
        .comment-marker.resolved:hover {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
        }
        .comment-marker.resolved::after {
            content: '✓';
            position: absolute;
            top: -6px; right: -6px;
            background: white;
            color: #10B981;
            width: 16px; height: 16px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 900;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid #ECFDF5;
        }

        .comment-marker:focus-visible {
            background: #4B2182;
            transform: translate(-50%, -50%) scale(1.2);
            box-shadow: 0 0 0 4px rgba(75, 33, 130, 0.3);
            outline: none;
        }

        .comment-form {
            position: absolute;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            padding: 24px;
            border-radius: 24px;
            box-shadow: 0 30px 60px -12px rgba(75, 33, 130, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.15);
            z-index: 2147483647;
            width: 320px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            animation: form-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .comment-form:focus-within {
            border-color: #4B2182/20;
        }
        @keyframes form-slide-up {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .comment-form textarea {
            width: 100%;
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 20px;
            box-sizing: border-box;
            resize: none;
            min-height: 120px;
            font-size: 14px;
            font-weight: 500;
            outline: none;
            transition: all 0.2s;
            background: rgba(249, 250, 251, 0.8);
            color: #1E293B;
            font-family: inherit;
        }
        .comment-form textarea:focus {
            border-color: #F58220;
            background: white;
            box-shadow: 0 0 0 4px rgba(245, 130, 32, 0.08);
        }
        .comment-form-footer {
            display: flex;
            gap: 12px;
        }
        .comment-form button {
            background: linear-gradient(135deg, #4B2182 0%, #6D28D9 100%);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 16px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 800;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            flex: 2;
            font-family: inherit;
            box-shadow: 0 10px 20px -5px rgba(75, 33, 130, 0.3);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            outline: none;
        }
        .comment-form button:focus-visible {
            box-shadow: 0 0 0 4px rgba(75, 33, 130, 0.4);
        }
        .comment-form button:hover {
            background: linear-gradient(135deg, #F58220 0%, #FF9D4D 100%);
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 15px 25px -5px rgba(245, 130, 32, 0.4);
        }
        .comment-form button:active {
            transform: translateY(0) scale(0.98);
        }
        .comment-form button.cancel {
            background: white;
            color: #64748B;
            box-shadow: none;
            border: 1px solid #E2E8F0;
            flex: 1;
            text-transform: none;
            letter-spacing: normal;
        }
        .comment-form button.cancel:hover {
            background: #F8FAFC;
            color: #EF4444;
            border-color: #FEE2E2;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
        }
        .comment-form button.cancel:focus-visible {
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
            border-color: #EF4444;
        }
    `;
    shadow.appendChild(style);

    // State
    let tempMarker = null;
    let tempForm = null;
    let activeCommentId = null;

    // --- Helper: Generate Unique CSS Selector ---
    function getCssPath(el) {
        if (!(el instanceof Element)) return;
        const path = [];
        while (el.nodeType === Node.ELEMENT_NODE && el !== document.documentElement) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + el.id;
                path.unshift(selector);
                break; // IDs are unique enough usually
            } else {
                let sib = el, nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() == selector) nth++;
                }
                if (nth != 1) selector += ":nth-of-type(" + nth + ")";
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
    }

    // --- Helper: Get position relative to document ---
    function getOffset(el) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height
        };
    }

    // --- API ---
    function renderComments(comments) {
        // Clear existing markers
        const staticMarkers = shadow.querySelectorAll('.static-marker');
        staticMarkers.forEach(m => m.remove());

        comments.forEach((c, index) => {
            const el = document.createElement('div');
            el.className = 'comment-marker static-marker';
            el.tabIndex = 0;
            el.setAttribute('role', 'button');
            el.setAttribute('aria-label', `Annotation ${index + 1}: ${c.text}`);
            if (c.id === activeCommentId) {
                el.classList.add('active');
                el.setAttribute('aria-expanded', 'true');
            } else {
                el.setAttribute('aria-expanded', 'false');
            }
            if (c.resolved) {
                el.classList.add('resolved');
            }
            el.dataset.id = c.id;

            // Positioning Logic
            let top, left;

            if (c.selector && c.selector !== 'body') {
                const targetEl = document.querySelector(c.selector);
                if (targetEl) {
                    const offset = getOffset(targetEl);
                    left = offset.left + (c.x / 100 * offset.width);
                    top = offset.top + (c.y / 100 * offset.height);
                } else {
                    console.warn('Target element not found:', c.selector);
                    return;
                }
            } else {
                // Legacy / Global fallback
                left = (c.x / 100) * document.documentElement.scrollWidth;
                top = (c.y / 100) * document.documentElement.scrollHeight;
            }

            el.style.left = left + 'px';
            el.style.top = top + 'px';
            el.textContent = index + 1;
            el.title = c.text;

            // Click Handler
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isDragging) return;
                toggleMarkerSelection(c.id);
            });

            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMarkerSelection(c.id);
                }
            });

            el.addEventListener('mouseenter', () => {
                window.parent.postMessage({ type: 'MARKER_HOVER', commentId: c.id, isHovering: true }, '*');
            });

            el.addEventListener('mouseleave', () => {
                window.parent.postMessage({ type: 'MARKER_HOVER', commentId: c.id, isHovering: false }, '*');
            });

            function toggleMarkerSelection(id) {
                setActive(id);
                window.parent.postMessage({
                    type: 'MARKER_CLICKED',
                    projectId: config.projectId,
                    commentId: id
                }, '*');
            }

            shadow.appendChild(el);
        });
    }

    function setActive(id) {
        activeCommentId = id;
        const markers = shadow.querySelectorAll('.static-marker');
        markers.forEach(m => {
            if (m.dataset.id === id) {
                m.classList.add('active');
            } else {
                m.classList.remove('active');
            }
        });
    }

    // Listen for messages from parent
    window.addEventListener('message', (e) => {
        if (e.data.type === 'HIGHLIGHT_COMMENT') {
            setActive(e.data.commentId);
            // Scroll to marker if needed
            const marker = Array.from(shadow.querySelectorAll('.static-marker')).find(m => m.dataset.id === e.data.commentId);
            if (marker) {
                marker.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }
        }

        if (e.data.type === 'REMOTE_HOVER') {
            const marker = Array.from(shadow.querySelectorAll('.static-marker')).find(m => m.dataset.id === e.data.commentId);
            if (marker) {
                if (e.data.isHovering) {
                    marker.classList.add('remote-hover');
                } else {
                    marker.classList.remove('remote-hover');
                }
            }
        }

        if (e.data.type === 'COMMENT_ADDED') {
            loadComments();
        }

        if (e.data.type === 'COMMENT_UPDATED') {
            // Update local state and re-render
            const updated = e.data.comment;
            allComments = allComments.map(c => c.id === updated.id ? updated : c);
            renderComments(allComments);
        }

        if (e.data.type === 'COMMENT_DELETED') {
            const commentId = e.data.commentId;
            allComments = allComments.filter(c => c.id !== commentId);
            renderComments(allComments);
        }
    });

    // --- Interactions ---
    // Dragging disabled per user request to ensure pins "not moving"
    let isDragging = false;

    document.addEventListener('click', (e) => {
        if (isDragging) return;
        if (container.contains(e.target)) return;
        if (e.target.closest('.static-marker')) return; // handled by marker click
        if (e.target.closest('a')) e.preventDefault();

        const targetEl = e.target;
        const selector = getCssPath(targetEl) || 'body';

        const rect = targetEl.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const xPercent = (offsetX / rect.width) * 100;
        const yPercent = (offsetY / rect.height) * 100;

        const pageX = e.pageX;
        const pageY = e.pageY;

        showAddForm(pageX, pageY, xPercent, yPercent, selector);

    }, true);

    function showAddForm(pageX, pageY, xPct, yPct, selector) {
        if (tempMarker) tempMarker.remove();
        if (tempForm) tempForm.remove();

        tempMarker = document.createElement('div');
        tempMarker.className = 'comment-marker';
        tempMarker.textContent = '+';
        tempMarker.style.left = pageX + 'px';
        tempMarker.style.top = pageY + 'px';
        tempMarker.setAttribute('aria-label', 'New annotation marker');
        shadow.appendChild(tempMarker);

        tempForm = document.createElement('div');
        tempForm.className = 'comment-form';
        tempForm.setAttribute('role', 'form');
        tempForm.setAttribute('aria-label', 'Add new annotation');
        tempForm.style.left = (pageX + 20) + 'px';
        tempForm.style.top = pageY + 'px';
        tempForm.innerHTML = `
            <div id="form-title" style="font-size: 11px; font-weight: 800; color: #4B2182; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <div style="width: 8px; height: 8px; background: #F58220; border-radius: 2px;" aria-hidden="true"></div>
                Annotate with FlexyPin
            </div>
            <textarea placeholder="Write your thoughts..." aria-labelledby="form-title"></textarea>
            <div class="comment-form-footer">
                <button class="cancel" id="cancel-btn" aria-label="Discard annotation">Discard</button>
                <button id="submit-btn" style="flex: 2;" aria-label="Post comment">Post Comment</button>
            </div>
        `;
        shadow.appendChild(tempForm);

        const textarea = tempForm.querySelector('textarea');
        textarea.focus();

        tempForm.querySelector('#submit-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            const text = textarea.value;
            if (!text) return;

            await saveComment(text, xPct, yPct, selector);
            closeForm();
        });

        tempForm.querySelector('#cancel-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            closeForm();
        });

        tempForm.addEventListener('click', e => e.stopPropagation());
    }

    function closeForm() {
        if (tempMarker) tempMarker.remove();
        if (tempForm) tempForm.remove();
        tempMarker = null;
        tempForm = null;
    }

    async function saveComment(text, x, y, selector) {
        try {
            const res = await fetch(`${config.serverUrl}/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: config.projectId,
                    text,
                    x,
                    y,
                    selector
                })
            });
            await loadComments();
            // Get ID of new comment
            const data = await res.json();
            window.parent.postMessage({ type: 'COMMENT_ADDED', projectId: config.projectId, commentId: data.id }, '*');
        } catch (e) {
            console.error('Error saving comment', e);
        }
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(loadComments, 200);
    });

    let allComments = [];
    async function loadComments() {
        try {
            const res = await fetch(`${config.serverUrl}/api/comments?projectId=${config.projectId}`);
            allComments = await res.json();
            renderComments(allComments);
        } catch (e) {
            console.error('Failed to load comments', e);
        }
    }

    loadComments();

})();
