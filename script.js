let map;
let targetLat;
let targetLng;
let targetName = "";

async function generateMission() {

    document.getElementById("loading").innerHTML =
        "📡 Searching nearby places...";

    navigator.geolocation.getCurrentPosition(
        findNearbyPlace,
        showError
    );
}

async function findNearbyPlace(position) {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const userInput =
        document
        .getElementById("themeInput")
        .value
        .toLowerCase();

    let type = "cafe";

    if(userInput.includes("restaurant"))
        type = "restaurant";

    if(userInput.includes("bar"))
        type = "bar";

    if(userInput.includes("park"))
        type = "park";

    const response =
        await fetch(
            `/api/places?lat=${lat}&lng=${lng}&type=${type}`
        );

    const data =
        await response.json();

    if(
        !data.elements ||
        data.elements.length === 0
    ){
        alert("No places found nearby.");
        return;
    }

    const place =
        data.elements[
            Math.floor(
                Math.random() *
                data.elements.length
            )
        ];

    targetLat = place.lat;
    targetLng = place.lon;
    targetName =
        place.tags?.name ||
        "Mystery Location";

    createMap(lat,lng);

    updateMission(lat,lng);
}

function createMap(lat,lng){

    if(map){
        map.remove();
    }

    map =
        L.map("map")
        .setView([lat,lng],15);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:"OpenStreetMap"
        }
    ).addTo(map);

    L.circle(
        [targetLat,targetLng],
        {
            radius:100,
            color:"cyan",
            fillOpacity:0.2
        }
    ).addTo(map);

    L.marker([lat,lng])
        .addTo(map);

    navigator.geolocation.watchPosition(
        watchUser
    );
}

function watchUser(position){

    updateMission(
        position.coords.latitude,
        position.coords.longitude
    );
}

function updateMission(lat,lng){

    const distance =
        calculateDistance(
            lat,
            lng,
            targetLat,
            targetLng
        );

    if(distance <= 100){

        unlockMission();

        return;
    }

    document.getElementById(
        "missionBox"
    ).innerHTML = `
        <h2>Mission Active</h2>
        <p>Distance:
        ${distance.toFixed(0)}m</p>
    `;
}

function unlockMission(){

    if(navigator.vibrate){
        navigator.vibrate([200,100,200]);
    }

    document.getElementById(
        "missionBox"
    ).innerHTML = `
        <div class="revealCard">
            <h2>🔓 Vault Unlocked</h2>
            <h3>${targetName}</h3>
            <p>
            You discovered a real place.
            More lore coming soon.
            </p>
        </div>
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
        (lat2-lat1)*Math.PI/180;

    const dLon =
        (lon2-lon1)*Math.PI/180;

    const a =
        Math.sin(dLat/2) *
        Math.sin(dLat/2)
        +
        Math.cos(lat1*Math.PI/180)
        *
        Math.cos(lat2*Math.PI/180)
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