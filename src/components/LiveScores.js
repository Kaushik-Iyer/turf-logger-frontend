// LiveScores.js
import React, { useEffect, useState } from 'react';

function LiveScores() {
    const [scores, setScores] = useState(null);

    useEffect(() => {
        fetch('https://turf-logger-backend.onrender.com/live_scores', {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => setScores(data));
    }, []);

    if (scores === null) {
        return 'Loading live scores...';
    }

    return (
        <div>
            <h2>Live Scores</h2>
            {scores.map((match, index) => (
                <div key={index} style={{border: '1px solid #ccc', padding: '10px', margin: '10px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <img src={match.homeCrest} alt={`${match.homeTeam} crest`} style={{width: '50px'}} />
                            <h3>{match.homeTeam}</h3>
                        </div>
                        <div>
                            <img src={match.awayCrest} alt={`${match.awayTeam} crest`} style={{width: '50px'}} />
                            <h3>{match.awayTeam}</h3>
                        </div>
                    </div>
                    <p>Time: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(match.time))}</p>
                    <p>Score: {match.score.home} - {match.score.away}</p>
                </div>
            ))}
        </div>
    );
}

export default LiveScores;