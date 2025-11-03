// Vercel Serverless Function: api/contact.js
// This will be deployed automatically with the main site when using Vercel.

// Simple validation and forwarding to a Discord Incoming Webhook.

module.exports = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { name, email, discord, subject, message } = req.body || {};

        function clean(s = '') {
            return typeof s === 'string' ? s.trim() : '';
        }

        const MAX = { name: 100, email: 200, discord: 100, subject: 200, message: 1900 };
        const n = clean(name);
        const e = clean(email);
        const s = clean(subject);
        const m = clean(message);

        if (!n || n.length > MAX.name) return res.status(400).json({ error: 'Invalid name' });
        if (!e || e.length > MAX.email) return res.status(400).json({ error: 'Invalid email' });
        if (!s || s.length > MAX.subject) return res.status(400).json({ error: 'Invalid subject' });
        if (!m || m.length > MAX.message) return res.status(400).json({ error: 'Invalid message' });

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) return res.status(500).json({ error: 'Webhook not configured' });

        const embed = {
            title: s,
            description: m,
            color: 0x00ff99,
            fields: [
                { name: 'Name', value: n, inline: true },
                { name: 'Email', value: e, inline: true },
                { name: 'Discord', value: clean(discord) || '—', inline: true },
            ],
            timestamp: new Date().toISOString(),
        };

        const payload = { username: 'Website Contact', embeds: [embed] };

        // Use global fetch (available on Vercel / Node 18+)
        const r = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!r.ok) {
            const text = await r.text().catch(() => '');
            console.error('Discord webhook error', r.status, text);
            return res.status(502).json({ error: 'Failed to send to Discord' });
        }

        return res.json({ success: true });
    } catch (err) {
        console.error('api/contact error', err);
        return res.status(500).json({ error: 'Server error' });
    }
};
