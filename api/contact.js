// Vercel Serverless Function
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

        // If RECAPTCHA_SECRET_KEY is set, verify the recaptcha token before proceeding.
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        if (recaptchaSecret) {
            const token = req.body?.recaptchaToken;
            if (!token) return res.status(400).json({ error: 'recaptcha token missing' });

            const params = new URLSearchParams();
            params.append('secret', recaptchaSecret);
            params.append('response', token);

            const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            });
            const verifyJson = await verifyRes.json().catch(() => ({}));
            // For reCAPTCHA v3, you may want to check score >= 0.5; here we require success:true.
            if (!verifyJson.success || (typeof verifyJson.score === 'number' && verifyJson.score < 0.3)) {
                console.error('recaptcha failed', verifyJson);
                return res.status(400).json({ error: 'recaptcha verification failed' });
            }
        }

        const embed = {
            fields: [
                { name: 'Name', value: n, inline: true },
                { name: 'Email', value: e, inline: true },
                { name: 'Discord', value: clean(discord) || '—', inline: true },
            ],
            title: s,
            description: m,
            color: 0x00ff99,
            timestamp: new Date().toISOString(),
        };

        // Optionally mention a specific Discord user on new messages.
        // Set NOTIFY_DISCORD_ID in Vercel to your numeric Discord ID (snowflake) to enable mentions.
        const notifyId = process.env.NOTIFY_DISCORD_ID;
        const content = notifyId ? `<@${notifyId}> New contact from ${n}: ${s}` : undefined;

        const payload = {
            username: 'Dikonakaya.com Message',
            ...(content ? { content } : {}),
            embeds: [embed],
            // Restrict allowed mentions to only the configured user to avoid accidental mass-pings
            allowed_mentions: notifyId ? { parse: [], users: [notifyId] } : { parse: [] },
        };

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
