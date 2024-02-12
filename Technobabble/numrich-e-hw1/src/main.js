import randomElement from "./utils.js";

let phrase;
let words1;
let words2;
let words3;
let output;
let buttonGet1;
let buttonGet5;

//Generate a number of technobabble based on input
const  generateTechno = (num) => {

    phrase = ``;
    for (let i = 0; i < num; i++){
        phrase += `<div>${randomElement(words1)} ${randomElement(words2)} ${randomElement(words3)}<div>`;
    }

    output.innerHTML = phrase;
}

const init = () => {
    //Get buttons and output
    output = document.querySelector("#output");
    buttonGet1 = document.querySelector("#btn-gen-1");
    buttonGet5 = document.querySelector("#btn-gen-5");

    //One-time initialization of JSON words and button.onclick events
    loadBabble("./data/babble-data.json", babbleLoaded);
}

const loadBabble = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onload = e => callback(e);
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
}

const babbleLoaded = (e) => {
    const allWords = e.target.responseText;
    const json = JSON.parse(allWords);

    //Creates all words arrays
    words1 = json["words1"];
    words2 = json["words2"];
    words3 = json["words3"];

    //Events for buttons to generate their respective babble counts
    buttonGet1.addEventListener("click", () => { generateTechno(1) });
    buttonGet5.addEventListener("click", () => { generateTechno(5) });

    //If device screen width is 1408 pixels or more, show 5 technobabble on startup
    if(window.innerWidth >= 1408)
    {
        generateTechno(5);
    }

    //If width is under 1408, only show 1 at startup
    else
    {
        generateTechno(1);
    }
}

init();