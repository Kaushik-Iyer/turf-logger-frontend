import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import ProfilePage from './components/Profile';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/profile"
                    element={
                        localStorage.getItem('access_token') ? (
                            <>
                                <Header />
                                <ProfilePage />
                                <Footer />
                            </>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;