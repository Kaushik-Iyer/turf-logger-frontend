import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import PlayersPage from './components/Players';
import Header from './components/Header';
import Login from './components/Login';
import './App.css';
import Footer from './components/Footer';

function App() {
    const [redirectTo, setRedirectTo] = useState('/login');

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
                <Route path="/login" element={<Login setRedirectTo={setRedirectTo} />} />
                <Route path="/players" element={<PlayersPage />} />
            </Routes>
            <Navigate to={redirectTo} />
            {localStorage.getItem('access_token') && <Footer />}
        </Router>
    );
}

export default App;