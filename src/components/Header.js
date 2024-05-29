import React from 'react';
import CreateEntry from './CreateEntry';
import { googleLogout } from '@react-oauth/google';

function LogoutPage() {
    const handleLogout = () => {
        // Remove user's data from session storage
        googleLogout();
        localStorage.removeItem('access_token');

        // Redirect to the login page
        window.location = '/';
    };

    return (
        <header>
            <button 
                style={{
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px',
                    padding: '10px 20px',
                    fontSize: '1em',
                    borderRadius: '5px',
                    border: 'none',
                    color: '#fff',
                    backgroundColor: '#007BFF',
                    cursor: 'pointer'
                }} 
                onClick={handleLogout}
            >
                Logout
            </button>
            <CreateEntry /> {}
        </header>
    );
}

export default LogoutPage;

