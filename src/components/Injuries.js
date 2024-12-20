import React, { useState } from 'react';
import Modal from 'react-modal';

function Injuries({ token }) {
    const [injuryData, setInjuryData] = useState(null);
    const [injuryModalIsOpen, setInjuryModalIsOpen] = useState(false);
    const [addInjuryFormIsOpen, setAddInjuryFormIsOpen] = useState(false);
    const [newInjury, setNewInjury] = useState({ injury_type: '', duration: 0, location: { x: 0, y: 0 } });

    const handleInjuryData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/injuries`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });
            const data = await response.json();
            setInjuryData(data);
            setInjuryModalIsOpen(true);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleAddInjury = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/injuries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(newInjury),
            });
            const data = await response.json();
            setInjuryData([...injuryData, data]);
            setAddInjuryFormIsOpen(false);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleInjuryData}>
                Your Injury Data
            </button>
            <Modal
                isOpen={injuryModalIsOpen}
                onRequestClose={() => setInjuryModalIsOpen(false)}
                contentLabel="Injury Data"
                style={{
                    overlay: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    content: {
                        position: 'relative',
                        width: '80%',
                        height: '80%',
                        overflow: 'auto',
                        padding: '2rem',
                    },
                }}
                className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
                <button onClick={() => setInjuryModalIsOpen(false)} className="absolute top-0 right-3 mt-2 mr-2">X</button>
                <h2 className="text-2xl font-bold mb-4">Your Injury Data</h2>
                {injuryData && injuryData.map((injury, index) => (
                    <div key={index} className="mb-4 p-4 rounded shadow-lg bg-gray-100">
                        <h3 className="text-xl font-bold">{injury.injury_type}</h3>
                        <p className="mb-2">Duration: {injury.duration} days</p>
                        <p className="mb-2">Days remaining: {Math.max(injury.duration - Math.floor((Date.now() - new Date(injury.created_at).getTime()) / (1000 * 60 * 60 * 24)), 0)}</p>
                    </div>
                ))}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={() => setAddInjuryFormIsOpen(true)}
                >
                    Add New Injury
                </button>
            </Modal>

            <Modal
                isOpen={addInjuryFormIsOpen}
                onRequestClose={() => setAddInjuryFormIsOpen(false)}
                contentLabel="Add New Injury"
                style={{
                    overlay: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    content: {
                        position: 'relative',
                        width: '25%',
                        height: '50%',
                        overflow: 'auto',
                        padding: '2rem',
                    },
                }}
            >
                <button onClick={() => setAddInjuryFormIsOpen(false)} className="absolute top-0 right-3 mt-2 mr-2">X</button>
                <h2 className="text-2xl font-bold mb-4">Add New Injury</h2>
                <form onSubmit={handleAddInjury} className="space-y-4">
                    <label className="block">
                        <span className="text-gray-700">Type:</span>
                        <input
                            type="text"
                            value={newInjury.injury_type}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            onChange={(e) => setNewInjury({ ...newInjury, injury_type: e.target.value })}
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Duration:</span>
                        <input
                            type="number"
                            value={newInjury.duration}
                            onChange={(e) => setNewInjury({ ...newInjury, duration: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>
                    <button type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Submit
                    </button>
                </form>
            </Modal>
        </>
    );
}

export default Injuries;