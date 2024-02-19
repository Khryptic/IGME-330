import { getRandomColor, getRandomRedColor, getRandomBlueColor, getRandomGreenColor } from "./utils.js";
import getRandomInt from "./utils.js";
import drawRectangle from "./canvas-utils.js";
import {drawArc, drawLine} from "./canvas-utils.js";

// #1 call the `init` function after the pages loads
let ctx;
let canvas;
let paused = true
let createRectangles = true;
let createArcs = true;
let createLines = true;

const init = () => {
    console.log("page loaded!");
    // #2 Now that the page has loaded, start drawing!

    // A - `canvas` variable points at <canvas> tag
    canvas = document.querySelector("canvas");

    // B - the `ctx` variable points at a "2D drawing context"
    ctx = canvas.getContext("2d");

    // C - all fill operations are now in red (in helper function)

    // D - fill a rectangle with the current fill color
    drawRectangle(ctx, 20, 20, 600, 440, "red", 0, "white");

    // Second Rectangle with color by rgb values
    drawRectangle(ctx, 120, 120, 400, 300, "#ffffff");

    // Rectangle border
    drawRectangle(ctx, 120, 120, 400, 300, "rgb(133, 133, 233)", 10, "magenta");

    // Lines
    drawLine(ctx, 20, 20, 620, 460, 5, "magenta");
    drawLine(ctx, 20, 240, 620, 240, 20, "magenta");
    drawLine(ctx, 620, 20, 20, 460, 5, "magenta");

    // Circle
    drawArc(ctx, 320, 240, 50, 0, Math.PI * 2, "white", 5, "black");

    // Small Circle "Mouth"
    drawArc(ctx, 320, 240, 20, 0, Math.PI, "maroon", 5, "black");

    // Eyes
    drawArc(ctx, 340, 220, 10, 0, Math.PI * 2, "aqua", 5, "black");
    drawArc(ctx, 300, 220, 10, 0, Math.PI * 2, "aqua", 5, "black");

    setupUI();
    update();
}

// Draws new shapes every frame if not paused
const update = () => {
    requestAnimationFrame(update);

    drawArc(ctx);

    // Fixed spamming by moving this if statement below the animation frame request
    // Don't draw if paused
    if (paused) {
        return
    }

    // Get a number to draw one of three shapes each update call
    let randomNum = getRandomInt(1, 3);

    // Switches drawing rectangles, arcs, or lines depending on the random number
    switch (randomNum) {
        case 1:
            if (createRectangles) {
                drawRectangle(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomInt(10, 90), getRandomBlueColor(), getRandomInt(2, 12), getRandomBlueColor());
            }
            break;

        case 2:
            if (createArcs) {
                drawArc(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(0, 120), getRandomInt(0, 360), Math.PI * 2, getRandomRedColor(), getRandomInt(2, 12), getRandomRedColor(), getRandomInt(0, 1));
            }
            break;

        case 3:
            if (createLines) {
                drawLine(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(1, 7), getRandomGreenColor())
            }
            break;
    }
}

// Draws 10 rectangles around where mouse clicks canvas
const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX, mouseY);

    for (let i = 0; i < 10; i++) {
        let x = mouseX + getRandomInt(-80, 80);
        let y = mouseY + getRandomInt(-80, 80);
        let radius = getRandomInt(0, 30);
        let angleStart = getRandomInt(0, 360);
        let angleEnd = getRandomInt(0, 360);
        let strokeWidth = getRandomInt(1, 7);
        let color = getRandomColor();

        drawArc(ctx, x, y, radius, angleStart, angleEnd, color, strokeWidth);
    }
}

// Initializes buttons, canvas, and checkbox events
const setupUI = () => {
    document.querySelector("#cb-rectangles").addEventListener("click", (e) => { createRectangles = e.target.checked; })
    document.querySelector("#cb-arcs").addEventListener("click", (e) => { createArcs = e.target.checked; })
    document.querySelector("#cb-lines").addEventListener("click", (e) => { createLines = e.target.checked; })

    document.querySelector("#btn-pause").addEventListener("click", () => { paused = true; })
    document.querySelector("#btn-play").addEventListener("click", () => { paused = false; })
    document.querySelector("#btn-clear").addEventListener("click", () => { ctx.clearRect(0, 0, 640, 480); })

    canvas.addEventListener("click", (e) => { canvasClicked(e); })
}

init();