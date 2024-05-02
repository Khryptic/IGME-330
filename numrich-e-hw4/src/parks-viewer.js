import * as firebase from "./firebase.js"
import * as ajax from "./ajax.js"

// Get the geojson data
let geojson;

const init = () => {
    ajax.downloadFile("data/parks.geojson", (str) => {
        geojson = JSON.parse(str);
        firebase.readParkData(geojson);
        firebase.countChanged(geojson);
    });
}

// Increment/Decrement button
document.querySelector("#btn-admin").onclick = _ => {
    let parkId = document.querySelector("#id-field").value;
    let isChecked = document.querySelector("#chk-decrement").checked;

    // Decrement park count if checked, increment if not
    if (isChecked) {
        firebase.decrementParkCount(parkId);
    }

    else {
        firebase.incrementParkCount(parkId);
    }
};

init();