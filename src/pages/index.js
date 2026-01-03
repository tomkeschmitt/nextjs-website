import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../app/style.css'; // dein CSS importieren

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const code = router.query.code;

    // Nach Login: Discord Userdaten holen
    useEffect(() => {
        if (code) {
            fetch(`/api/discord?code=${code}`)
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(console.error);
        }
    }, [code]);

    // Login Button Klick
    const login = () => {
        const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID; // Frontend-safe
        const redirectUri = encodeURIComponent('https://nextjs-website-ruddy-omega.vercel.app/');
        const scope = encodeURIComponent('identify email guilds');
        window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    };

    // Logout Button
    const logout = () => {
        setUser(null);
        router.push('/');
    };

    return (
        <div>
            {/* Vor Login */}
            {!user && (
                <div className="centered">
                    <button id="login-btn" onClick={login}>Login mit Discord</button>
                </div>
            )}

            {/* Nach Login */}
            {user && (
                <div id="main-container">
                    <div className="sidebar">
                        <img src={user.avatar} alt="Avatar" />
                        <p>{user.username}</p>
                        <button onClick={logout}>Logout</button>
                    </div>
                    <div className="main-content">
                        <h1>Willkommen, {user.username}!</h1>
                        <p>Hier ist dein Content nach Login.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
