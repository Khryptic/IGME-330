/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as sprites from './sprites.js';

let ctx, canvasWidth, canvasHeight, analyserNode, audioData, velocity, counter, radians;


const setupCanvas = (canvasElement, analyserNodeRef) => {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
    counter = 0;
    radians = 50;
}

const draw = (params = {}, dataType = "frequency") => {

    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 
    if (dataType == "frequency") {
        analyserNode.getByteFrequencyData(audioData);  // frequency data
    }
    // OR
    else {
        analyserNode.getByteTimeDomainData(audioData); // waveform data
    }

    // 2 - draw background
    ctx.save();

    if (params.enableDarkHour) {
        ctx.fillStyle = "rgba(21, 107, 0, 1)";
        document.querySelector("body").style.color = "lime";
    }

    else {
        ctx.fillStyle = "rgba(0, 83, 157, 1)";
        document.querySelector("body").style.color = "aqua";
    }

    ctx.globalAlpha = .1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // draw Moon
    const moon = new sprites.CircleSprite(canvasWidth * 0.85, canvasHeight * 0.25);

    if (params.showMoon) {
        let maxRadius = canvasHeight / 4;
        ctx.save();
        ctx.globalAlpha = 0.5;

        for (let i = 0; i < audioData.length; i++) {
            let percent = audioData[i] / 255;
            let circleRadius = percent * maxRadius;
            moon.update(canvasWidth / 2, canvasHeight / 2, circleRadius);

            if (params.translateMoon) {
                moon.update(moon.x + Math.cos(radians - velocity * counter) * 530, 
                            moon.y + Math.sin(radians - velocity * counter) * 150, 
                            circleRadius);
                moon.draw(ctx, 0, 2 * Math.PI, true, utils.makeColor(250, 222, 120, .34 - percent / 3.0));
            }

            else {
                moon.update(canvasWidth * 0.85, canvasHeight * 0.25);
                moon.draw(ctx, 0, 2 * Math.PI, true, utils.makeColor(250, 222, 120, .34 - percent / 3.0));
                counter = 0;
            }
        }

        ctx.restore();

        // Reset moon to be off the screen at the right
        if(moon.x < -maxRadius - 20){
            counter = 0;
        }

        else{
            counter++;
        }
    }

    // draw buildings
    if (params.showBuildings) {
        // Background Building
        let barSpacing = 1;
        let margin = 4;
        let barWidth = 35;
        let barHeight = 200;
        let topSpacing = 70;

        const background = new sprites.BoxSprite();

        // Draw Foreground Buildings with Sprites
        let counter = 0;
        for (let i = 0; i < audioData.length; i++) {
            if (i % 6 == 0) {
                background.update(margin + counter * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight)
                background.draw(ctx, 'rgba(74, 74, 74, 1)', 'rgba(74, 74, 74, 0.7)');
                counter++;
            }
        }

        // Foreground Buildings
        barSpacing = 1;
        margin = 4;
        barWidth = 60;
        barHeight = 200;
        topSpacing = 125;

        const foreground = new sprites.BoxSprite();

        // Draw Foreground Buildings
        counter = 0;
        for (let i = 0; i < audioData.length; i++) {
            if (i % 10 == 0) {
                background.update(margin + counter * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight)
                background.draw(ctx, 'rgba(0, 0, 0, 1)', 'rgba(68, 68, 68, 0.7)');
                counter++;
            }
        }
    }
}

const setMovement = speed => {
    velocity = Number(speed);    // make sure that it's a Number rather than a String
}

export { setupCanvas, draw, setMovement };