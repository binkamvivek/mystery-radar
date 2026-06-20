let map;

function generateMission(){

    document.getElementById("missionBox").innerHTML = `
        <h2>Mission 1</h2>
        <p>Checking your location...</p>
    `;

    navigator.geolocation.getCurrentPosition(
        showMap,
        showError
    );
}

function showMap(position){

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if(map){
        map.remove();
    }

    map = L.map('map').setView(
        [lat, lng],
        15
    );

    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution:'OpenStreetMap'
        }
    ).addTo(map);

    L.marker([lat,lng])
        .addTo(map)
        .bindPopup("You are here")
        .openPopup();

    createHiddenTarget(lat,lng);
}

function createHiddenTarget(lat,lng){

    const targetLat =
        lat + 0.002;

    const targetLng =
        lng + 0.002;

    const distance =
        calculateDistance(
            lat,
            lng,
            targetLat,
            targetLng
        );

    document.getElementById(
        "missionBox"
    ).innerHTML = `
        <h2>Mission 1</h2>

        <p>
        Hidden destination generated.
        </p>

        <p>
        Distance:
        ${distance.toFixed(0)}
        meters
        </p>
    `;
}

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
){

    const R = 6371000;

    const dLat =
        (lat2-lat1) *
        Math.PI/180;

    const dLon =
        (lon2-lon1) *
        Math.PI/180;

    const a =
        Math.sin(dLat/2) *
        Math.sin(dLat/2)
        +
        Math.cos(
            lat1*Math.PI/180
        )
        *
        Math.cos(
            lat2*Math.PI/180
        )
        *
        Math.sin(dLon/2)
        *
        Math.sin(dLon/2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1-a)
        );

    return R*c;
}

function showError(){
    alert(
        "Location access denied"
    );
}