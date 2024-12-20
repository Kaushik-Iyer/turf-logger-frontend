import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaMapMarkerAlt, FaSpinner, FaTimes, FaSearch } from 'react-icons/fa';

function NearbyTurfs({ token }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [turfData, setTurfData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleNearbyTurfs = async () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setIsLoading(true);
        setError(null);

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
                setTurfData(data.places.slice(0, 5));
                setModalIsOpen(true);
            } catch (error) {
                setError('Failed to fetch nearby turfs. Please try again.');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }, () => {
            setError('Unable to get your location. Please enable location services.');
            setIsLoading(false);
        });
    };

    const filteredTurfs = turfData?.filter(turf =>
        turf.displayName.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <button
                className="group bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg
                          transform transition duration-200 hover:scale-105 focus:outline-none 
                          focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                          flex items-center space-x-2 shadow-lg"
                onClick={handleNearbyTurfs}
                disabled={isLoading}
            >
                <FaMapMarkerAlt className="animate-bounce" />
                <span>{isLoading ? 'Locating...' : 'Find Nearby Turfs'}</span>
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Nearby Turfs"
                className="relative bg-white rounded-xl shadow-2xl max-w-md w-11/12 mx-auto"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    content: {
                        position: 'relative',
                        inset: 'auto',
                        padding: '0',
                    }
                }}
            >
                <div className="sticky top-0 bg-white p-4 border-b z-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Nearby Turfs</h2>
                        <button
                            onClick={() => setModalIsOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search turfs..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
                        {error}
                    </div>
                )}

                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <FaSpinner className="animate-spin text-3xl text-blue-500" />
                        </div>
                    ) : (
                        filteredTurfs?.map((turf, index) => (
                            <div
                                key={index}
                                className="mb-4 p-4 rounded-lg shadow-md bg-white hover:shadow-lg
                                          transform transition duration-200 hover:-translate-y-1
                                          border border-gray-100"
                            >
                                <h3 className="text-xl font-bold text-gray-800">
                                    {turf.displayName.text}
                                </h3>
                                <div className="mt-2 flex items-center text-gray-600">
                                    <FaMapMarkerAlt className="mr-2" />
                                    <span className="text-sm">
                                        {(turf.distance_km).toFixed(1)} km away
                                    </span>
                                </div>
                                <a
                                    href={turf.googleMapsUri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-lg
                                             hover:bg-blue-100 transition-colors text-sm font-medium"
                                >
                                    View on Google Maps
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </>
    );
}

export default NearbyTurfs;