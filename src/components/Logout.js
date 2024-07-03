import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // fetch(`${process.env.REACT_APP_SERVER_URL}/logout`, {
        //     method: 'GET',
        //     credentials: 'include',
        //     redirect: 'follow'
        // })
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error(`Logout failed: ${response.statusText}`);
        //     }
        //     return response.json();
        // })
        // .then(() => {
        //     navigate('/'); // navigate to the root page
        // })
        // .catch(error => {
        //     console.error('Logout failed:', error);
        // });
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutPage;