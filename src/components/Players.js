import React, { useEffect, useState } from 'react';
import LiveScores from './LiveScores';
import styles from './Players.module.css';
import EntryChart from "./EntryChart";
import 'chartjs-adapter-moment';
import EntriesTable from './EntriesTable';
import { Chart, LinearScale, PointElement, Tooltip, Legend, TimeScale } from "chart.js";

Chart.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

function PlayersPage() {
  const [players, setPlayers] = useState(null);
  const token = localStorage.getItem('access_token');


  const deleteEntry = (id) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/entries/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Player was deleted:', data);
        const updatedPlayers = players.filter(player => player._id !== id);
        setPlayers(updatedPlayers);
      })
      .catch(error => {
        console.error('Error deleting player:', error);
      });

  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/players`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(response => response.json())
      .then(data => setPlayers(data));

  }, []);
  if (players === null) {
    return 'Loading...';
  }
  return (
    <div className={styles.container}>
      <EntryChart />
      <div className="flex flex-col md:flex-row gap-5">
        <div>
          <h1 className="text-3xl font-bold m-0">Your previous entries</h1>
          <EntriesTable players={players} onDelete={deleteEntry} />
        </div>
        <LiveScores />
      </div>
    </div>
  );
}

export default PlayersPage;