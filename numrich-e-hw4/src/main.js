import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js"
import * as firebase from "./firebase.js"

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let favoriteIds = ["p20", "p79", "p180", "p43"];
let geojson;

// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatNYS);
	};

	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45, 0);
		map.flyTo(lnglatNYS);
	};

	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	};

	refreshFavorites();
}

const init = () => {
	// Initialize favorites from localStorage
	favoriteIds = storage.readFromLocalStorage("favorites");
	if (!Array.isArray(favoriteIds)) {
		favoriteIds = [];
	}

	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails)
		setupUI();
	});
};

const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = `<p><span class="has-text-weight-bold">Address: </span>${feature.properties.address}</p>
													  <p><span class="has-text-weight-bold">Phone: </span><a href="tel:+1${feature.properties.phone}">${feature.properties.phone}</a></p>
													  <p><span class="has-text-weight-bold">Website: </span><a href="${feature.properties.url}">${feature.properties.url}</a></p>
													  <span>
													  <button id='btn-favorite' class='button is-primary'>Favorite <i class='fas fa-check'></i></button>
													  <button id='btn-remove' class='button is-danger'>Remove <i class='fas fa-trash-alt'></i></button>
													  </span>`;
	document.querySelector("#details-3").innerHTML = feature.properties.description;

	// Add functionality to new favorite and remove buttons
	swapButtons(testFavorite(favoriteIds, feature.id));
	document.querySelector("#btn-remove").onclick = () => {
		favoriteIds.splice(favoriteIds.indexOf(feature.id), 1);
		swapButtons(testFavorite(favoriteIds, feature.id));
		refreshFavorites();

		//Update local storage
		storage.writeToLocalStorage("favorites", favoriteIds);

		//Update Firebase
		firebase.decrementParkCount(feature.id);
	}

	document.querySelector("#btn-favorite").onclick = () => {
		favoriteIds.push(feature.id);
		swapButtons(testFavorite(favoriteIds, feature.id));
		refreshFavorites();

		//Update local storage
		storage.writeToLocalStorage("favorites", favoriteIds);

		//Update Firebase
		firebase.incrementParkCount(feature.id);
	}
};

const getFeatureById = (id) => {
	return geojson.features.find((feature) => feature.id == id);
};

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for (const id of favoriteIds) {
		favoritesContainer.appendChild(createFavoriteElement(id));
	};
};

const createFavoriteElement = (id) => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};

	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}
	`;

	return a;
};

// Test if feature is in favorites list
const testFavorite = (favoriteIds, id) => {
	return favoriteIds.includes(id);
}

// Enable/Disable Favorite and remove buttons
const swapButtons = (isFavorite) => {
	if (isFavorite) {
		document.querySelector("#btn-favorite").disabled = true;
		document.querySelector("#btn-remove").disabled = false;
	}

	else {
		document.querySelector("#btn-favorite").disabled = false;
		document.querySelector("#btn-remove").disabled = true;
	}
}

init();