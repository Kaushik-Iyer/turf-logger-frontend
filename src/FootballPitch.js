import React, { useEffect, useRef, useState } from 'react';

function FootballPitch() {
    const canvasRef = useRef(null);
    const [lines, setLines] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [currentLine, setCurrentLine] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw pitch
        context.fillStyle = '#90EE90'; // Light green
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw border
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        // Draw goalposts
        context.fillStyle = '#FFFFFF'; // White for goalposts
        context.fillRect(0, canvas.height / 2 - 50, 10, 100);
        context.fillRect(canvas.width - 10, canvas.height / 2 - 50, 10, 100);
        context.strokeStyle = '#000000'; // Black border for goalposts
        context.strokeRect(0, canvas.height / 2 - 50, 10, 100);
        context.strokeRect(canvas.width - 10, canvas.height / 2 - 50, 10, 100);

        // Draw direction of attack line
        context.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // Half-transparent black
        context.beginPath();
        context.moveTo(canvas.width / 4, canvas.height / 2);
        context.lineTo(3 * canvas.width / 4, canvas.height / 2);
        context.stroke();

        // Draw arrowhead
        const dx = 3 * canvas.width / 4 - canvas.width / 4;
        const dy = 0;
        const angle = Math.atan2(dy, dx);
        context.lineTo(3 * canvas.width / 4 - 10 * Math.cos(angle - Math.PI / 6), canvas.height / 2 - 10 * Math.sin(angle - Math.PI / 6));
        context.moveTo(3 * canvas.width / 4, canvas.height / 2);
        context.lineTo(3 * canvas.width / 4 - 10 * Math.cos(angle + Math.PI / 6), canvas.height / 2 - 10 * Math.sin(angle + Math.PI / 6));
        context.stroke();

        // Draw user lines
        context.strokeStyle = '#FF0000';
        lines.forEach(line => {
            context.beginPath();
            context.moveTo(line.start.x, line.start.y);
            context.lineTo(line.end.x, line.end.y);
            context.stroke();

            // Draw arrowhead
            const dx = line.end.x - line.start.x;
            const dy = line.end.y - line.start.y;
            const angle = Math.atan2(dy, dx);
            context.lineTo(line.end.x - 10 * Math.cos(angle - Math.PI / 6), line.end.y - 10 * Math.sin(angle - Math.PI / 6));
            context.moveTo(line.end.x, line.end.y);
            context.lineTo(line.end.x - 10 * Math.cos(angle + Math.PI / 6), line.end.y - 10 * Math.sin(angle + Math.PI / 6));
            context.stroke();
        });

        // Draw current line
        if (currentLine) {
            context.beginPath();
            context.moveTo(currentLine.start.x, currentLine.start.y);
            context.lineTo(currentLine.end.x, currentLine.end.y);
            context.stroke();
        }
    }, [lines, currentLine]);

    const handleMouseDown = (event) => {
        if (lines.length >= 5) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setDrawing(true);
        setCurrentLine({ start: { x: x, y: y }, end: { x: x, y: y } });
    };

    const handleMouseMove = (event) => {
        if (!drawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setCurrentLine(prevLine => ({ points: [...prevLine.points, { x: x, y: y }] }));
    };

    const handleMouseUp = () => {
        setDrawing(false);
        setLines(prevLines => [...prevLines, currentLine]);
        setCurrentLine(null);
    };

    return <canvas ref={canvasRef} width={500} height={300} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />;
}

export default FootballPitch;