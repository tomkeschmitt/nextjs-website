import fetch from 'node-fetch';

export default async function handler(req, res) {
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    const data = new URLSearchParams();
    data.append('client_id', process.env.DISCORD_CLIENT_ID);
    data.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', process.env.REDIRECT_URI);
    data.append('scope', 'identify email');

    // Token holen
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;

    // Userdaten holen
    const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const userJson = await userRes.json();

    res.status(200).json({
        username: userJson.username,
        avatar: `https://cdn.discordapp.com/avatars/${userJson.id}/${userJson.avatar}.png`
    });
}
