import React from 'react';
import { googleLogout } from '@react-oauth/google';
import { useLocation } from 'react-router-dom';

function LogoutPage() {
    const location = useLocation();
    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem('access_token');

        window.location = '/';
    };

    return (
        <header className='mb-4'>
            <button
                className="absolute top-2 right-2 bg-blue-500 text-base border-none cursor-pointer px-8 py-4 rounded-lg text-white"
                onClick={handleLogout}
            >
                Logout
            </button>
        </header>
    );
}

export default LogoutPage;

