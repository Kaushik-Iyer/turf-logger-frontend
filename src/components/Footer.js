import React, { useState } from 'react';

function Footer() {
    const [comment, setComment] = useState('');

    const handleChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://turf-logger-backend-4ea39f4ebb11.herokuapp.com/suggestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            body: JSON.stringify({ 
                suggestion: comment
             }),
        });
        setComment('');
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Latitude: ' + position.coords.latitude);
                console.log('Longitude: ' + position.coords.longitude);
                fetch (`https://turf-logger-backend-4ea39f4ebb11.herokuapp.com/turf_near_me?lat=${position.coords.latitude}&lon=${position.coords.longitude}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    },
                })
                .then(response => response.json())
                .then(data => console.log(data)) // Log the response data
                .catch(error => console.error('Error:', error));
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }

    return (
        <footer style={{ backgroundColor: '#f5f5f5', padding: '1rem', marginTop: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Kaushik Iyer</h4>
                <a style={{ marginRight: '1rem', color: '#007bff', textDecoration: 'underline' }} href="https://www.linkedin.com/in/kaushik-iyer-8aa347216/" target="_blank" rel="noreferrer">LinkedIn</a>
                <a style={{ marginRight: '1rem', color: '#007bff', textDecoration: 'underline' }} href="https://github.com/Kaushik-Iyer" target="_blank" rel="noreferrer">GitHub</a>
                <a style={{ color: '#007bff', textDecoration: 'underline' }} href="https://www.instagram.com/iyerkaushik/" target="_blank" rel="noreferrer">Instagram</a>
                {/* <button onClick={handleLocation} style={{ marginTop: '0.5rem', padding: '0.5rem', fontSize: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Get Location</button> */}
            </div>
                <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Suggestions/Bugs</h4>
                    <form onSubmit={handleSubmit}>
                        <label style={{ fontSize: '1rem' }}>
                            Comment:<br />
                            <textarea name="comment" value={comment} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }} /><br />
                        </label>
                        <input type="submit" value="Send" style={{ marginTop: '0.5rem', padding: '0.5rem', fontSize: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }} />
                    </form>
                </div>
            </div>
        </footer>
    );
}

export default Footer;