import React, { useState } from 'react';
import Modal from 'react-modal';
import FootballPitch from './FootballPitch';
import '../assets/css/CreateEntry.css'

function CreateEntry() {
    const [player, setPlayer] = useState({ position: '', goals: 0, assists: 0 });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Add this line
    const [response, setResponse] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
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

        fetch(`${process.env.REACT_APP_SERVER_URL}/entries`, {
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

                return fetch(`${process.env.REACT_APP_SERVER_URL}/players/${day}/${month}/${goals}/${assists}`, {
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
        <div className="create-entry-container mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col max-w-lg">
            <h3>Create Entry </h3>
            <p className="note">Please note: You can only add one entry per day. If you add more than one, the latest
                entry will replace the previous one for that day.</p>
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
                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Entry</button>
                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    style={{*/}
                    {/*        background: 'none',*/}
                    {/*        border: 'none',*/}
                    {/*        color: 'blue',*/}
                    {/*        textDecoration: 'underline',*/}
                    {/*        cursor: 'pointer'*/}
                    {/*    }}*/}
                    {/*    onClick={() => setModalIsOpen(true)}*/}
                    {/*>*/}
                    {/*    Draw Pass and Shot Progression*/}
                    {/*</button>*/}
                </div>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {/* {response && (
            <p>
            On this day, {response.player} also scored the same goals and assists in the match between {response.home_team} and {response.away_team} ({response.date}).
            </p>
        )} */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Pass and Shot Progression"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        height: '50%'
                    }
                }}
            >
                <FootballPitch/>
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>
        </div>

    );
}

export default CreateEntry;