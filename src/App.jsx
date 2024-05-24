import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import PlayersPage from './Players';
import Header from './Header';
import { useGoogleLogin } from '@react-oauth/google';

function App() {
    const [profile, setProfile] = useState(null);
    const [redirectTo, setRedirectTo] = useState('/login');

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            fetch('https://turf-logger-backend.onrender.com/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token: codeResponse.access_token })
            })
            .then(response => response.json())
            .then(data => {
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                    setRedirectTo('/players');
                }
            })
            .catch(error => console.error('Failed to fetch user:', error));
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setRedirectTo('/players');
        }
    }, []);

    if (redirectTo === '') {
        return 'Loading...';
    }

    return (
        <Router>
            {localStorage.getItem('access_token') && <Header />}
            <Routes>
                <Route path="/login" element={
                    profile ? (
                        <Navigate to={redirectTo} />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
                        <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '2rem' }}>Turf-Stats-Logger</h1>
                        <button onClick={login}style={{ padding: '1rem 2rem', fontSize: '1rem', color: '#fff', backgroundColor: '#4285f4', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign in with Google 🚀 </button>
                    </div>
                    )
                } />
                <Route path="/players" element={<PlayersPage />} />
            </Routes>
            <Navigate to={redirectTo} />
        </Router>
    );
}

export default App;