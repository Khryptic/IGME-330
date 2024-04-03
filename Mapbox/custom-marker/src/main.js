const init = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZW1uNTEwMCIsImEiOiJjbHVrNDgwamYwa3hxMmxvMjZxbGpud3M2In0._mTIJ0k1-83i0iG067VYdw';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-96, 37.8],
        zoom: 3
    });

    // Load GeoJSON Data
    const geojson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-77.032, 38.913]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'Washington, D.C.'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-122.414, 37.776]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'San Francisco, California'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    title: 'Point',
                    coordinates: [-76.663970, 40.287120]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'Hershey Park, Hershey, Pennyslvania'
                }
            }
        ]
    };

    // Add features to map
    for (const feature of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // Make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);

        // Make a popup for each marker on the map
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
            )
            .addTo(map);
    }
}

export {init};