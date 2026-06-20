let map;
let targetLat;
let targetLng;

function generateMission(){

    const loading =
        document.getElementById("loading");

    loading.innerHTML =
        "📡 Plotting unmapped coordinates...";

    setTimeout(() => {

        navigator.geolocation.getCurrentPosition(
            startMission,
            showError
        );

    },1500);
}

function startMission(position){

    document.getElementById(
        "loading"
    ).innerHTML = "";

    const lat =
        position.coords.latitude;

    const lng =
        position.coords.longitude;

    targetLat =
        lat + 0.002;

    targetLng =
        lng + 0.002;

    createMap(
        lat,
        lng
    );

    updateMission(
        lat,
        lng
    );
}

function createMap(
    lat,
    lng
){

    if(map){
        map.remove();
    }

    map =
        L.map('map')
        .setView(
            [lat,lng],
            15
        );

    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution:
            'OpenStreetMap'
        }
    ).addTo(map);

    L.circle(
        [targetLat,targetLng],
        {
            radius:100,
            color:'cyan',
            fillOpacity:0.2
        }
    ).addTo(map);

    L.marker(
        [lat,lng]
    ).addTo(map);

    navigator.geolocation.watchPosition(
        watchUser
    );
}

function watchUser(position){

    const lat =
        position.coords.latitude;

    const lng =
        position.coords.longitude;

    updateMission(
        lat,
        lng
    );
}

function updateMission(
    lat,
    lng
){

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

        <p>
        Distance:
        ${distance.toFixed(0)}
        meters
        </p>

        <p>
        Move closer to the signal.
        </p>
    `;
}

function unlockMission(){

    if(
        navigator.vibrate
    ){
        navigator.vibrate(
            [200,100,200]
        );
    }

    document.getElementById(
        "missionBox"
    ).innerHTML = `
        <div class="revealCard">

            <h2>
            🔓 Vault Unlocked
            </h2>

            <h3>
            Hidden Street Gallery
            </h3>

            <p>
            The walls around this
            area hide some of the
            city's most overlooked
            artwork.
            </p>

            <p>
            The AI selected this
            waypoint because it
            matched your explorer
            vibe.
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