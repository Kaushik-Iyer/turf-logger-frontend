import React, { useState, useEffect } from 'react';
import { FaUserFriends, FaUserPlus, FaSpinner } from 'react-icons/fa';
import Modal from 'react-modal';
import EntryChart from './EntryChart';


function FriendsNetwork({ token }) {
    const [activeTab, setActiveTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchEmail, setSearchEmail] = useState('');
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [showStatsModal, setShowStatsModal] = useState(false);

    const fetchFriends = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/friends/list`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            const data = await response.json();
            setFriends(data);
        } catch (err) {
            setError('Failed to fetch friends');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/friends/requests`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            const data = await response.json();
            setRequests(data);
        } catch (err) {
            setError('Failed to fetch requests');
        }
    };

    const sendFriendRequest = async (email) => {
        try {
            await fetch(`${process.env.REACT_APP_SERVER_URL}/friends/request/${email}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            setSearchEmail('');
        } catch (err) {
            setError('Failed to send request');
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            await fetch(`${process.env.REACT_APP_SERVER_URL}/friends/accept/${requestId}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            fetchRequests();
            fetchFriends();
        } catch (err) {
            setError('Failed to accept request');
        }
    };

    useEffect(() => {
        fetchFriends();
        fetchRequests();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <div className="flex mb-6 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'friends' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('friends')}
                >
                    <FaUserFriends className="inline mr-2" />
                    Friends ({friends.length})
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'requests' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    <FaUserPlus className="inline mr-2" />
                    Requests ({requests.length})
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    {error}
                </div>
            )}

            {activeTab === 'friends' ? (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter email to add friend"
                            className="flex-1 p-2 border rounded"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <button
                            onClick={() => sendFriendRequest(searchEmail)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add Friend
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center">
                            <FaSpinner className="animate-spin text-3xl text-blue-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {friends.map((friend) => (
                                <div key={friend.email} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    <img
                                        src={friend.profile_pic_url}
                                        alt={friend.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <div className="font-bold">{friend.name}</div>
                                        <div className="text-sm text-gray-500">{friend.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={request.sender.profile_pic_url}
                                    alt={request.sender.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <div className="font-bold">{request.sender.name}</div>
                                    <div className="text-sm text-gray-500">{request.sender.email}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => acceptRequest(request._id)}
                                className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
                            >
                                Accept
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default FriendsNetwork;