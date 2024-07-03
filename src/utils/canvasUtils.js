// src/utils/canvasUtils.js

export const drawPitch = (context, canvas) => {
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
};

export const drawDirectionLine = (context, canvas) => {
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
    context.beginPath();
    context.moveTo(3 * canvas.width / 4, canvas.height / 2);
    context.lineTo(3 * canvas.width / 4 - 10 * Math.cos(angle - Math.PI / 6), canvas.height / 2 - 10 * Math.sin(angle - Math.PI / 6));
    context.moveTo(3 * canvas.width / 4, canvas.height / 2);
    context.lineTo(3 * canvas.width / 4 - 10 * Math.cos(angle + Math.PI / 6), canvas.height / 2 - 10 * Math.sin(angle + Math.PI / 6));
    context.stroke();
};