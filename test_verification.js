const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

(async () => {
    try {
        console.log('Testing Create Project...');
        const createRes = await request({
            hostname: 'localhost',
            port: 3456,
            path: '/api/projects',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, JSON.stringify({ url: 'https://example.com/' }));

        console.log('Create Project Status:', createRes.statusCode);
        const project = JSON.parse(createRes.body);
        console.log('Project ID:', project.id);

        if (!project.id) throw new Error('No project ID returned');

        console.log('Testing Get Project...');
        const getProjectRes = await request({
            hostname: 'localhost',
            port: 3456,
            path: `/api/projects/${project.id}`,
            method: 'GET'
        });
        console.log('Get Project Status:', getProjectRes.statusCode);
        if (getProjectRes.statusCode !== 200) throw new Error('Failed to get project');

        console.log('Testing Proxy...');
        const proxyRes = await request({
            hostname: 'localhost',
            port: 3456,
            path: `/proxy?url=${encodeURIComponent('https://example.com/')}&projectId=${project.id}`,
            method: 'GET'
        });

        console.log('Proxy Status:', proxyRes.statusCode);
        const proxyBody = proxyRes.body;

        const hasBase = proxyBody.includes('<base href="https://example.com/">');
        const hasScript = proxyBody.includes('embed.js');

        console.log('Has <base> tag:', hasBase);
        console.log('Has embed script:', hasScript);

        console.log('Testing Create Comment...');
        const commentData = JSON.stringify({
            projectId: project.id,
            text: 'QA Test Comment',
            x: 50,
            y: 50,
            selector: 'body'
        });
        const createCommentRes = await request({
            hostname: 'localhost',
            port: 3456,
            path: '/api/comments',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(commentData)
            }
        }, commentData);
        console.log('Create Comment Status:', createCommentRes.statusCode);
        if (createCommentRes.statusCode !== 200) throw new Error('Failed to create comment');

        console.log('Testing Get Comments...');
        const getCommentsRes = await request({
            hostname: 'localhost',
            port: 3456,
            path: `/api/comments?projectId=${project.id}`,
            method: 'GET'
        });
        console.log('Get Comments Status:', getCommentsRes.statusCode);
        const comments = JSON.parse(getCommentsRes.body);
        console.log('Comments found:', comments.length);
        if (comments.length === 0 || comments[0].text !== 'QA Test Comment') throw new Error('Comment verification failed');

        if (hasBase && hasScript) {
            console.log('FULL QA VERIFICATION SUCCESS');
        } else {
            console.log('VERIFICATION FAILED: Proxy content missing');
        }

    } catch (e) {
        console.error('Test Failed:', e);
    }
})();
