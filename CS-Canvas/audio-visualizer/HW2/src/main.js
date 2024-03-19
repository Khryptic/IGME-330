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
  showBuildings: true,
  showMoon: true,
  enableDarkHour: false,
  translateMoon: false,
};

let dataType = "frequency";

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
  sound1: "media/Full Moon Full Life.mp3"
});

const init = () => {
  console.log("init called");
  audio.setupWebaudio(DEFAULTS.sound1);

  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);

  // Load JSON
  const url = "data/av-data.json";
  const xhr = new XMLHttpRequest();
  xhr.onload = (e) => {
    console.log(`In onload - HTTP Status Code = ${e.target.status}`);
    const text = e.target.responseText;
    const json = JSON.parse(text);

    // Load website title
    const title = json["title"];
    document.querySelector("title").innerHTML = title;
    document.querySelector("#title").innerHTML = title;

    // Load tracklist
    const locations = json["directory"];
    const tracklist = json["tracklist"];
    const directions = json["directions"];
    let directionsText = directions.map(phrase => `${phrase}`).join("<br>");

    let tracksHTML = `<option value="${locations[0]}">${tracklist[0]}</option>`;
    for (let i = 1; i < tracklist.length; i++) {
      tracksHTML += `<option value="${locations[i]}">${tracklist[i]}</option>`;
    }

    document.querySelector("#select-track").innerHTML = tracksHTML;
    document.querySelector("#directions").innerHTML += directionsText;
    console.log("Loading Complete");
  }

  xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
  xhr.open("GET", url);
  xhr.send();

  visualizer.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}

const setupUI = canvasElement => {
  // A - hookup fullscreen button
  const playButton = document.querySelector("#btn-play");
  const fsButton = document.querySelector("#btn-fs");

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
  let volumeSlider = document.querySelector("#slider-volume");
  let volumeLabel = document.querySelector("#label-volume");
  let translationSlider = document.querySelector("#slider-speed");
  let speedLabel = document.querySelector("#label-speed");

  //add .oninput event to sliders
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);

    // update value of label to match the value of slider
    volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
  };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  translationSlider.oninput = e => {
    visualizer.setMovement(e.target.value);

    speedLabel.innerHTML = Math.round((e.target.value * 10000));
  };

  // set value of label to match initial value of slider
  translationSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#select-track");
  let dataSelect = document.querySelector("#data-type");

  // add .onchange to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);

    //pause current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  }

  dataSelect.onchange = e => {
    dataType = e.target.value;
  }

  // hookup checkboxes and functionality
  document.querySelector("#cb-buildings").addEventListener("change", () => drawParams.showBuildings = document.querySelector("#cb-buildings").checked);
  document.querySelector("#cb-moon").addEventListener("change", () => drawParams.showMoon = document.querySelector("#cb-moon").checked);
  document.querySelector("#cb-darkhour").addEventListener("change", () => drawParams.enableDarkHour = document.querySelector("#cb-darkhour").checked);
  document.querySelector("#cb-translate").addEventListener("change", () => drawParams.translateMoon = document.querySelector("#cb-translate").checked);
  document.querySelector("#cb-treble").addEventListener("change", () => { audio.params.enableTreble = document.querySelector("#cb-treble").checked; audio.toggleTreble(); });
  document.querySelector("#cb-bass").addEventListener("change", () => { audio.params.enableBass = document.querySelector("#cb-bass").checked; audio.toggleBass(); });

} // end setupUI

const loop = () => {
  setTimeout(loop, 1000 / 60);
  visualizer.draw(drawParams, dataType);
} // end loop

export { init };