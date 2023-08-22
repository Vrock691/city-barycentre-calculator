let cities = new Array;
let addcitybutton = document.getElementById('addcity');
let cityinput = document.getElementById('cityinput');
let citieslist = document.getElementById('citieslist')

// insertion de la carte openstreetmap
let map = L.map('map').setView([45.7578137, 4.8320114], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
L.tileLayer('https://vrock691.web.app', {
    attribution: '<a href="https://vrock691.web.app">Valentin Mary</a>'
}).addTo(map);

// fonction onclick sur la carte
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

// input search
cityinput.onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.code || e.key;
    if (keyCode == 'Enter') {
        var query = document.getElementById('cityinput').value;
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`, {
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => {
                var city = json[0]

                if (city == undefined) {
                    alert('Ville non trouvée')
                } else {
                    console.log(city);
                    map.panTo([city.lat, city.lon])
                    popup
                        .setLatLng([city.lat, city.lon])
                        .setContent(`<strong>${city.display_name}</strong><br>Cliquez sur le bouton pour ajouter cette ville au calcul.`)
                        .openOn(map);
                    addcitybutton.disabled = false;
                }
            })
        return false;
    }
}

function calcBarycentre() {
    
    var sumLat = cities
    var sumLon = 0
    cities.forEach(city => {
        sumLat += parseFloat(city.lat);
        sumLon += parseFloat(city.lon);

    })
}

addcitybutton.addEventListener('click', ev => {
    addcitybutton.disabled = true;
    cities.push([city.display_name, city.lat, city.lon]);
    calcBarycentre()
})