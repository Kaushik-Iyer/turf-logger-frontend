import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import CreateEntry from "./CreateEntry";
import Players from "./Players";
import NearbyTurfs from "./NearbyTurfs";
import Injuries from "./Injuries";
import Friends from "./Friends";

function Profile() {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('access_token');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEntryCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const fetchUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });

        const data = await response.json();
        setUser(data);
    }

    useEffect(() => {
        fetchUser();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col sm:flex-row justify-center space-x-16">
            <div>
                <CreateEntry onEntryCreated={handleEntryCreated} />
            </div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                <div className="mb-6">
                    <img className="mx-auto h-20 w-20 rounded-full" src={user.profile_pic_url}
                        referrerpolicy="no-referrer"
                        alt="Profile" />
                    <div className="text-center mt-3">
                        <h2 className="text-lg">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                <NearbyTurfs token={token} />
                <Injuries token={token} />
                <Friends token={token} />
            </div>
            <Players key={refreshTrigger} />
        </div>
    );
}

export default Profile;