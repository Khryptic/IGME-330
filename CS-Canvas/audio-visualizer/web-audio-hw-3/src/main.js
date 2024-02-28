/*
  main.js is primarily responsible for hooking up the UI to the rest of the application 
  and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as visualizer from './visualizer.js';

const drawParams = {
  showGradient: true,
  showBars: true,
  showCircles: true,
  showNoise: true,
  showInvert: false,
  showEmboss: false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
  sound1: "media/New Adventure Theme.mp3"
});

const init = () => {
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebaudio(DEFAULTS.sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  visualizer.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}

const setupUI = canvasElement => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");

  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    //check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }

    console.log(`audioCtx.state after = ${audio.audioCtx.state}`)

    if (e.target.dataset.playing == "no") {
      //if track is currently paused, play it
      audio.playCurrentSound();
      e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
      // if track IS playing, pause it
    }

    else {
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
    }
  };

  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");

  //add .oninput event to slider
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);

    // update value of label to match the value of slider
    volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
  };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#trackSelect");

  // add .onchange to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);

    //pause current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  }

  // hookup checkboxes and functionality
  document.querySelector("#gradientCB").addEventListener("change", () => drawParams.showGradient = document.querySelector("#gradientCB").checked);
  document.querySelector("#barsCB").addEventListener("change", () => drawParams.showBars = document.querySelector("#barsCB").checked);
  document.querySelector("#circlesCB").addEventListener("change", () => drawParams.showCircles = document.querySelector("#circlesCB").checked);
  document.querySelector("#noiseCB").addEventListener("change", () => drawParams.showNoise = document.querySelector("#noiseCB").checked);
  document.querySelector("#invertCB").addEventListener("change", () => drawParams.showInvert = document.querySelector("#invertCB").checked);
  document.querySelector("#embossCB").addEventListener("change", () => drawParams.showEmboss = document.querySelector("#embossCB").checked);

} // end setupUI

const loop = () => {
  requestAnimationFrame(loop);
  visualizer.draw(drawParams);
} // end loop

export { init };