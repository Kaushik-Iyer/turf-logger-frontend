import React,{useEffect, useRef, useState} from 'react';
import { drawPitch, drawDirectionLine} from "../utils/canvasUtils";


function ShotMap(){
    const [shots, setShots] = useState([]);
    const canvasRef = useRef(null);
    const token = localStorage.getItem('access_token');

    useEffect(() =>{
        fetch(`${process.env.REACT_APP_SERVER_URL}/shots`,{
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
        }})
        .then(response => response.json())
        .then(data => setShots(data));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        drawPitch(context, canvas);
        drawDirectionLine(context, canvas);

        // Draw shots
        context.strokeStyle = '#FF0000'; // Red for shots
        context.lineWidth = 3;
        shots.forEach((shotData)=>{
            shotData.shots.forEach(shot=>{
                context.beginPath()
                context.moveTo(shot.start.x, shot.start.y);
                context.lineTo(shot.end.x, shot.end.y);
                context.stroke();
            })
        })

        context.fillStyle='#000000';
        context.font = '16px Arial';
        context.fillText("Shot Map", 10, 20);
    }, [shots]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                style={{border: '1px solid black'}}
                width= {900}
                height= {400}
            />
        </div>
    );
}

export default ShotMap;