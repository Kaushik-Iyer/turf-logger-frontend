import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'



function EntryChart() {
    const [chartData, setChartData] = useState(null);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/visualize`,{
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,

            }
        })
            .then(response => response.json())
            .then(data => setChartData(data));
    }, []);

    if (!chartData) {
        return 'Loading...';
    }

    const data = {
        labels: chartData.dates,
        datasets: [
            {
                label: 'Goals',
                data: chartData.goals,
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
            },
            {
                label: 'Assists',
                data: chartData.assists,
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month'
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    return (<div style={{width: '70%', height: '70%', margin: 'auto'}}>
        <Line data={data} options={options}/>
    </div>
    );
}

export default EntryChart;