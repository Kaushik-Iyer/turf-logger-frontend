import React, { useState } from 'react';
import FootballPitch from './FootballPitch';
import '../assets/css/CreateEntry.css'

function CreateEntry() {
    const [player, setPlayer] = useState({ position: '', goals: 0, assists: 0 });
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
                setResponse(data);
                // Render the response here

            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="create-entry-container">
        <h3>Create Entry </h3>
        <p className="note">Please note: You can only add one entry per day. If you add more than one, the latest entry will replace the previous one for that day.</p>
        <form onSubmit={handleSubmit}>
            <fieldset>
            <label htmlFor="position">Position:</label>
            <select
                id="position"
                name="position"
                value={player.position}
                onChange={handleChange}
            >
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
            </select>

            <label htmlFor="goals">Goals:</label>
            <input
                type="number"
                id="goals"
                name="goals"
                value={player.goals}
                onChange={handleChange}
            />

            <label htmlFor="assists">Assists:</label>
            <input
                type="number"
                id="assists"
                name="assists"
                value={player.assists}
                onChange={handleChange}
            />
            </fieldset>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Create Entry</button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {/* {response && (
            <p>
            On this day, {response.player} also scored the same goals and assists in the match between {response.home_team} and {response.away_team} ({response.date}).
            </p>
        )} */}
        </div>

    );
}

export default CreateEntry;