import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import CreateEntry from "./CreateEntry";
import Players from "./Players";

function Profile() {

    const [user, setUser] = useState(null);
    const token=localStorage.getItem('access_token');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [turfData, setTurfData] = useState(null);
    const [injuryData, setInjuryData] = useState(null);
    const [injuryModalIsOpen, setInjuryModalIsOpen] = useState(false);
    const [addInjuryFormIsOpen, setAddInjuryFormIsOpen] = useState(false);
    const [newInjury, setNewInjury] = useState({ injury_type: '', duration: 0, location: {x:0, y: 0} });




    const handleInjuryData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/injuries`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });

            const data= await response.json();
            setInjuryData(data);
            setInjuryModalIsOpen(true);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleAddInjury = async(event) => {
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


    const handleInjuryLocation = (event) => {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left - event.target.clientLeft;
        const y = event.clientY - rect.top - event.target.clientTop;
        setNewInjury({ ...newInjury, location: { x, y } });
    }



    const handleNearbyTurfs = async () => {
        if(!navigator.geolocation){
            console.log('Geolocation is not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;


        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/turf_near_me?lat=${latitude}&long=${longitude}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            });

            const data = await response.json();
            setTurfData(data.places);
            setModalIsOpen(true);
            // Handle the data from the API here
        } catch (error) {
            console.error('Error:', error);
        }
    });
    };


    const fetchUser = async() => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });

        const data = await response.json();
        console.log('Fetched user data:', data); // Log the fetched user data
        setUser(data);
    }

    useEffect(() => {
        fetchUser();
    }, []);

    if (!user) {
        return <div>Loading...</div>; // Replace this with a loading spinner if you want
    }

    return (
        <div className="flex flex-col sm:flex-row justify-center space-x-16">
            <div>
                <CreateEntry/>
            </div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                <div className="mb-6">
                    <img className="mx-auto h-20 w-20 rounded-full" src={user.profile_pic_url}
                         referrerpolicy="no-referrer"
                         alt="Profile"/>
                    <div className="text-center mt-3">
                        <h2 className="text-lg">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleNearbyTurfs}>
                    See Turfs Near Me
                </button>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Nearby Turfs"
                    style={{
                        overlay: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        content: {
                            position: 'relative',
                            width: '90%', // For mobile screens
                            height: '80%', // For mobile screens
                            overflow: 'auto',
                        },
                    }}
                    className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4" // Responsive width classes

                >
                    <button onClick={() => setModalIsOpen(false)} className="absolute top-0 right-3 mt-2 mr-2">X
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Nearby Turfs</h2>
                    {turfData && turfData.map((turf, index) => (
                        <div key={index} className="mb-4 p-4 rounded shadow-lg bg-gray-100">
                            <h3 className="text-xl font-bold">{turf.displayName.text}</h3>
                            <p className="mb-2">Location: {turf.location.latitude}, {turf.location.longitude}</p>
                            <a href={turf.googleMapsUri} target="_blank" rel="noopener noreferrer"
                               className="text-blue-500 hover:underline">View on Google Maps</a>
                        </div>
                    ))}
                    <button onClick={() => setModalIsOpen(false)}>Close</button>
                </Modal>
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
                            width: '80%', // For mobile screens
                            height: '80%', // For mobile screens
                            overflow: 'auto',
                            padding: '2rem',
                        },
                    }}
                    className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4" // Responsive width classes

                >
                    <button onClick={() => setInjuryModalIsOpen(false)} className="absolute top-0 right-3 mt-2 mr-2">X
                    </button>
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
                    <button onClick={() => setAddInjuryFormIsOpen(false)} className="absolute top-0 right-3 mt-2 mr-2">X
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Add New Injury</h2>
                    <form onSubmit={handleAddInjury} className="space-y-4">
                        <label className="block">
                            <span className="text-gray-700">Type:</span>
                            <input
                                type="text"
                                value={newInjury.injury_type}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                onChange={(e) => setNewInjury({...newInjury, injury_type: e.target.value})}
                            />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Duration:</span>
                            <input
                                type="number"
                                value={newInjury.duration}
                                onChange={(e) => setNewInjury({...newInjury, duration: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <button type="submit"
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit
                        </button>
                    </form>

                </Modal>

            </div>
            <Players/>
        </div>
    );
}

export default Profile;