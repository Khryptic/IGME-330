// Draws a new rectangle based on input parameters
const drawRectangle = (ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") => {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

// Draws a new arc based on input parameters
const drawArc = (ctx, x, y, radius, angleStart = 0, angleEnd = Math.PI * 2, fillStyle = "black", lineWidth = 0, strokeStyle = "black", counterclockwise = false) => {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.arc(x, y, radius, angleStart, angleEnd, counterclockwise);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

// Draws a new line based on input parameters
const drawLine = (ctx, x1, y1, x2, y2, lineWidth = 1, strokeStyle = "black") => {
    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

export default drawRectangle;
export {drawArc, drawLine};