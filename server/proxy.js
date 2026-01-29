const axios = require('axios');
const cheerio = require('cheerio');

async function handleProxy(req, res) {
    const { url } = req.query;
    const projectId = req.query.projectId; // Pass this to the embed script

    if (!url) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    // SSRF Protection: Basic check for internal/reserved IPs
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;

        // Blacklist for common internal/reserved addresses
        const internalPattern = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|169\.254\.)/;
        if (internalPattern.test(hostname)) {
            console.warn(`SSRF attempt blocked for: ${url}`);
            return res.status(403).json({ error: 'Forbidden: Internal addresses are not allowed' });
        }
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        // 1. Fetch the target URL
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            responseType: 'text',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000, // 10s timeout
            validateStatus: () => true
        });

        const contentType = response.headers['content-type'] || '';

        // Copy headers (selectively)
        // We explicitly DO NOT copy CSP or Frame Options
        const headersToCopy = ['content-type', 'cache-control', 'last-modified', 'etag'];
        headersToCopy.forEach(h => {
            if (response.headers[h]) {
                res.setHeader(h, response.headers[h]);
            }
        });

        // Allow framing
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // 2. If HTML, inject our stuff
        if (contentType.includes('text/html')) {
            const $ = cheerio.load(response.data);

            // Inject <base> tag if not present (or replace?)
            // Ideally prepend to head
            if ($('base').length === 0) {
                $('head').prepend(`<base href="${url}">`);
            } else {
                // If it exists, we might need to update it, but usually sites don't have it.
            }

            // Inject our embed script
            // Use the current host to determine the server URL
            // We can also inject some global config
            let protocol = req.headers['x-forwarded-proto'] || 'http';
            const host = req.headers.host;

            // On Vercel, always prefer https if it's not localhost
            if (process.env.VERCEL && !host.includes('localhost')) {
                protocol = 'https';
            }

            const serverUrl = `${protocol}://${host}`;
            const scriptUrl = `${serverUrl}/embed.js`;

            // We can also inject some global config
            $('body').append(`
            <script>
                window.PASTEL_CONFIG = {
                    projectId: "${projectId}",
                    serverUrl: "${serverUrl}"
                };
            </script>
            <script src="${scriptUrl}"></script>
        `);

            // Removing script integrity checks if any, because they might block our injection or other scripts if we messed with them
            $('script').removeAttr('integrity');

            res.send($.html());
        } else {
            // Just send the data
            res.send(response.data);
        }

    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).send(`Error fetching URL: ${error.message}`);
    }
}

module.exports = handleProxy;
