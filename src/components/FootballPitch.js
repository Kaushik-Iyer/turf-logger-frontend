import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal'; // Import Modal for Save/Close functionality
import { drawPitch,drawDirectionLine } from "../utils/canvasUtils";

function FootballPitch() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [currentLine, setCurrentLine] = useState(null);
    const [passes, setPasses] = useState([]);
    const [shots, setShots] = useState([]);
    const [lineType, setLineType] = useState(null);
    const [selectedLineType, setSelectedLineType] = useState('pass');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const token = localStorage.getItem('access_token');



    const saveDrawing = async () => {
        const canvasImage=canvasRef.current.toDataURL();

        const data = {
            image: canvasImage,
            passes: passes,
            shots: shots
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/pitch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            console.log('Drawing was saved:', responseData);
        }
        catch (error) {
            console.error('Error saving drawing:', error);
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        drawPitch(context, canvas);
        drawDirectionLine(context, canvas);

        // Draw passes
        context.strokeStyle = '#0000FF'; // Blue for passes
        context.lineWidth = 2;
        context.setLineDash([5, 5]); // Dashed line for passes
        passes.forEach(line => {
            context.beginPath();
            context.moveTo(line.start.x, line.start.y);
            context.lineTo(line.end.x, line.end.y);
            context.stroke();
        });

        // Draw shots
        context.strokeStyle = '#FF0000'; // Red for shots
        context.lineWidth = 2;
        context.setLineDash([]); // Solid line for shots
        shots.forEach(line => {
            context.beginPath();
            context.moveTo(line.start.x, line.start.y);
            context.lineTo(line.end.x, line.end.y);
            context.stroke();
        });

        // Draw current line
        if (currentLine) {
            context.strokeStyle = lineType === 'pass' ? '#0000FF' : '#FF0000';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(currentLine.start.x, currentLine.start.y);
            context.lineTo(currentLine.end.x, currentLine.end.y);
            context.stroke();
        }
    }, [passes, shots, currentLine, lineType]);

    const handleMouseDown = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setDrawing(true);
        setCurrentLine({ start: { x: x, y: y }, end: { x: x, y: y } });
        setLineType(selectedLineType);
    };

    const handleMouseMove = (event) => {
        if (!drawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setCurrentLine(prevLine => ({ ...prevLine, end: { x: x, y: y } }));
    };

    const handleMouseUp = () => {
        setDrawing(false);
        if (lineType === 'pass') {
            setPasses(prevPasses => [...prevPasses, currentLine]);
        } else {
            setShots(prevShots => [...prevShots, currentLine]);
        }
        setCurrentLine(null);
    };

    const openModal = () => {
        setModalIsOpen(true);
        saveDrawing();
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-auto bg-gray-200">
            <div className="toolbar">
                <select value={selectedLineType} onChange={(e) => setSelectedLineType(e.target.value)}>
                    <option value="pass">Pass</option>
                    <option value="shot">Shot</option>
                </select>
                <button onClick={openModal}>Save</button>
            </div>
            <canvas ref={canvasRef} width={900} height={400} onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}/>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Save/Close Modal"
            >
            <h2>Save your drawing</h2>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
}

export default FootballPitch;
