const http = require('http');

async function request(path, method, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const body = data ? JSON.stringify(data) : '';
        const options = {
            hostname: 'localhost',
            port: 3456,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
                try {
                    const parsed = resBody ? JSON.parse(resBody) : null;
                    resolve({ statusCode: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: resBody });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function testAuth() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'Password123!';
    const name = 'Test User';

    console.log('--- Testing Signup ---');
    const signupRes = await request('/api/auth/signup', 'POST', { email, password, name });
    console.log('Signup Status:', signupRes.statusCode);
    console.log('Signup Body:', signupRes.body);

    if (signupRes.statusCode !== 200) {
        console.error('Signup failed!');
        return;
    }

    const { token, user } = signupRes.body;

    console.log('\n--- Testing Login ---');
    const loginRes = await request('/api/auth/login', 'POST', { email, password });
    console.log('Login Status:', loginRes.statusCode);
    console.log('Login Body:', loginRes.body);

    console.log('\n--- Testing Profile Update (Authorized) ---');
    const updateRes = await request('/api/auth/profile', 'PUT', { name: 'Updated Name' }, {
        'Authorization': `Bearer ${token}`
    });
    console.log('Update Status:', updateRes.statusCode);
    console.log('Update Body:', updateRes.body);

    console.log('\n--- Testing Projects (Authorized) ---');
    const projectsRes = await request('/api/projects', 'GET', null, {
        'Authorization': `Bearer ${token}`
    });
    console.log('Projects Status:', projectsRes.statusCode);
    console.log('Projects Body count:', Array.isArray(projectsRes.body) ? projectsRes.body.length : projectsRes.body);
}

testAuth().catch(console.error);
