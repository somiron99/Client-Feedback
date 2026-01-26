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
        .comment-marker {
            position: absolute;
            width: 32px;
            height: 32px;
            background: #E11D48; /* Rose-600 */
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            z-index: 2147483640;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-family: sans-serif;
            font-size: 14px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .comment-marker:hover {
            transform: translate(-50%, -50%) scale(1.15);
            z-index: 2147483650;
        }
        .comment-marker.active {
            background: #2563EB; /* Blue-600 */
            transform: translate(-50%, -50%) scale(1.25);
            z-index: 2147483650;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.3);
            animation: pulse-ring 2s infinite;
        }
        @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        .comment-form {
            position: absolute;
            background: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 2147483647;
            width: 280px;
            font-family: sans-serif;
            animation: slide-up 0.2s ease-out;
            border: 1px solid #e5e7eb;
        }
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .comment-form textarea {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 12px;
            box-sizing: border-box;
            resize: vertical;
            min-height: 80px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        .comment-form textarea:focus {
            border-color: #2563EB;
            ring: 2px solid #bfdbfe;
        }
        .comment-form button {
            background: #E11D48;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: background 0.2s;
        }
        .comment-form button:hover {
            background: #be123c;
        }
        .comment-form button.cancel {
            background: transparent;
            color: #64748b;
            margin-left: 8px;
        }
        .comment-form button.cancel:hover {
            color: #1e293b;
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
    async function loadComments() {
        try {
            const res = await fetch(`${config.serverUrl}/api/comments?projectId=${config.projectId}`);
            const comments = await res.json();
            renderComments(comments);
        } catch (e) {
            console.error('Failed to load comments', e);
        }
    }

    function renderComments(comments) {
        // Clear existing markers
        const staticMarkers = shadow.querySelectorAll('.static-marker');
        staticMarkers.forEach(m => m.remove());

        comments.forEach((c, index) => {
            const el = document.createElement('div');
            el.className = 'comment-marker static-marker';
            if (c.id === activeCommentId) {
                el.classList.add('active');
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
                setActive(c.id);
                window.parent.postMessage({
                    type: 'MARKER_CLICKED',
                    projectId: config.projectId,
                    commentId: c.id
                }, '*');
            });

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
    });

    // --- Interactions ---
    document.addEventListener('click', (e) => {
        if (container.contains(e.target)) return;
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
        shadow.appendChild(tempMarker);

        tempForm = document.createElement('div');
        tempForm.className = 'comment-form';
        tempForm.style.left = (pageX + 20) + 'px';
        tempForm.style.top = pageY + 'px';
        tempForm.innerHTML = `
            <textarea placeholder="Write a comment..."></textarea>
            <div>
                <button id="submit-btn">Send</button>
                <button class="cancel" id="cancel-btn">Cancel</button>
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
            alert('Failed to save comment');
        }
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(loadComments, 200);
    });

    loadComments();

})();
