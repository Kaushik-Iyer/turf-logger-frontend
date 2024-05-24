import React, { useState } from 'react';
import FootballPitch from './FootballPitch';

function CreateEntry() {
    const [player, setPlayer] = useState({ name: '', goals: 0, assists: 0 });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Add this line
    const [response, setResponse] = useState(null);
    const token=localStorage.getItem('access_token');


    const handleChange = (event) => {
        if (event.target.name === 'goals' || event.target.name === 'assists') {
            if (event.target.value < 0) {
                setError(`${event.target.name} cannot be negative`);
                return;
            }
        }
        setError('');
        setPlayer({
            ...player,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (error) {
            return;
        }

        fetch('https://turf-logger-backend.onrender.com/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            credentials: 'include',
            body: JSON.stringify(player)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Player was created:', data);
                setSuccessMessage('Player was created successfully'); // Add this line
                const date = new Date();
                const day = date.getDate();
                const month = date.getMonth() + 1; // Months are zero-based
                const { goals, assists } = player;

                return fetch(`https://turf-logger-backend.onrender.com/players/${day}/${month}/${goals}/${assists}`, {
                    credentials: 'include'
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Response from /players/day/month/goals/assists/:', data);
                setResponse(data);
                // Render the response here

            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>
                    Name:
                    <input type="text" name="name" value={player.name} onChange={handleChange} style={{ padding: '5px' }} />
                </label>
                <label>
                    Goals:
                    <input type="number" name="goals" value={player.goals} onChange={handleChange} style={{ padding: '5px' }} />
                </label>
                <label>
                    Assists:
                    <input type="number" name="assists" value={player.assists} onChange={handleChange} style={{ padding: '5px' }} />
                </label>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: 'fit-content' }}>Create Entry</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {response && (
                <p>
                    On this day, {response.player} also scored the same goals and assists in the match between {response.home_team} and {response.away_team} ({response.date}).
                </p>
            )}
        </div>
    );
}

export default CreateEntry;