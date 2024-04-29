// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, onValue, get, update, increment} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBkrgaGra8l2MxC36TB45A-1RjWZHPHh3A",
    authDomain: "favorite-parks-56ca9.firebaseapp.com",
    databaseURL: "https://favorite-parks-56ca9-default-rtdb.firebaseio.com",
    projectId: "favorite-parks-56ca9",
    storageBucket: "favorite-parks-56ca9.appspot.com",
    messagingSenderId: "854199925442",
    appId: "1:854199925442:web:95c7d587f9af98b814d95b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const parksRef = ref(db, 'parks');

// Get's park count data and returns an array of ids and counts
const readParkData = (geojson) => {
    let countHTML = "";
    onValue(parksRef, (snapshot) => {
        snapshot.forEach(park => {
            const childKey = park.key;
            const childData = park.val().count;
            countHTML += `<li class="is-size-5"><span class="has-text-weight-bold">${getParkName(childKey, geojson)} (${childKey})</span> - Likes: ${childData}</li>`;
            document.querySelector("#data-list").innerHTML = countHTML;
        });
    });
}

const getParkCount = (id) => {
    let count = 0;

    onValue(ref(db, "parks/" + id), (data) => {
        let obj = data.val();
        if (obj != null) {
            count = obj.count;
        }
    });
    console.log(count);
    return count;
}

const incrementParkCount = (id) => {
const db = getDatabase();
  const updateParkRef = ref(db, 'parks/' + id);
  set(updateParkRef, {
    count: increment(1)
  });
}

const decrementParkCount = (id) => {
    const db = getDatabase();
    const updateParkRef = ref(db, 'parks/' + id);

    // Test if park exists
    get(updateParkRef).then(snapshot => {
        let park;
        if (snapshot.exists()) {
            // if it's already in "parks/" - update the count
            park = snapshot.val();
            let count = 0;

            // Stops having negative counts
            if(park.count - 1 <= 0){
                count = 0;
            }
            
            else {
                count = park.count - 1;
            }

            const newData = {
                count
            };
            const updates = {};
            updates['parks/' + id] = newData;
            update(ref(db), updates);
        } else {
            // if it does not exist, add to "parks/"
            set(updateParkRef, {
                count: 0
            });
        }
    }).catch((error) => {
        console.log(error);
    });
}

const getParkName = (id, geojson) => {
    const feature = geojson.features.find((feature) => feature.id == id);
    return feature.properties.title;
}

const countChanged = (geojson) => {
    onValue(parksRef, () => readParkData(geojson), {onlyOnce: false});
}

export { getParkCount, readParkData, incrementParkCount, decrementParkCount, getParkName, countChanged, parksRef };