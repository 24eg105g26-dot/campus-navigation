// Backend API
const API_URL = "http://localhost:5000/api/locations";


// HTML elements
const locationSelect =
    document.getElementById("locationSelect");

const locationsContainer =
    document.getElementById("locationsContainer");

const navigateButton =
    document.getElementById("navigateButton");


// Store locations
let locations = [];


// Store map
let map;


// Store markers
let markers = [];


// ----------------------------------------
// CREATE MAP
// ----------------------------------------

map = L.map("map").setView(
    [17.452, 78.382],
    16
);


// OpenStreetMap
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ----------------------------------------
// GET LOCATIONS FROM BACKEND
// ----------------------------------------

fetch(API_URL)

    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Failed to get locations"
            );
        }

        return response.json();
    })

    .then(data => {

        locations = data;

        // Clear loading message
        locationsContainer.innerHTML = "";


        // Add every location
        data.forEach(location => {


            // --------------------------------
            // ADD TO DROPDOWN
            // --------------------------------

            const option =
                document.createElement("option");

            option.value = location.id;

            option.textContent =
                location.name;

            locationSelect.appendChild(option);


            // --------------------------------
            // CREATE LOCATION CARD
            // --------------------------------

            const card =
                document.createElement("div");

            card.className =
                "location-card";


            card.innerHTML = `
                <h3>
                    📍 ${location.name}
                </h3>

                <p>
                    <strong>Type:</strong>
                    ${location.type}
                </p>

                <p>
                    <strong>Latitude:</strong>
                    ${location.latitude}
                </p>

                <p>
                    <strong>Longitude:</strong>
                    ${location.longitude}
                </p>
            `;


            locationsContainer.appendChild(card);


            // --------------------------------
            // ADD MAP MARKER
            // --------------------------------

            const marker = L.marker([
                location.latitude,
                location.longitude
            ])
                .addTo(map);


            // Marker popup
            marker.bindPopup(`
                <strong>
                    ${location.name}
                </strong>

                <br>

                Type:
                ${location.type}
            `);


            // Store marker
            markers.push(marker);

        });

    })


    // ----------------------------------------
    // ERROR
    // ----------------------------------------

    .catch(error => {

        console.error(error);

        locationsContainer.innerHTML = `
            <p>
                ❌ Unable to connect to
                the backend server.
            </p>
        `;
    });


// ----------------------------------------
// NAVIGATE BUTTON
// ----------------------------------------

navigateButton.addEventListener(
    "click",
    () => {

        const selectedId =
            locationSelect.value;


        // Nothing selected
        if (!selectedId) {

            alert(
                "Please select a location."
            );

            return;
        }


        // Find selected location
        const selectedLocation =
            locations.find(
                location =>
                    location.id == selectedId
            );


        if (!selectedLocation) {

            alert(
                "Location not found."
            );

            return;
        }


        // --------------------------------
        // MOVE MAP TO LOCATION
        // --------------------------------

        map.setView(
            [
                selectedLocation.latitude,
                selectedLocation.longitude
            ],
            18
        );


        // --------------------------------
        // FIND MARKER
        // --------------------------------

        const markerIndex =
            locations.findIndex(
                location =>
                    location.id ==
                    selectedLocation.id
            );


        if (markerIndex !== -1) {

            markers[markerIndex].openPopup();

        }


        // --------------------------------
        // SHOW MESSAGE
        // --------------------------------

        alert(
            "Destination: " +
            selectedLocation.name
        );

    }
);