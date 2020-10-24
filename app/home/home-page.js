const HomeViewModel = require("./home-view-model");

var limeScooterCoordinates = [];

function pageLoaded(args) {
    var page = args.object;

    getLimeScooters();

    limeScooterCoordinates.forEach(scooter => {
        console.log(scooter.x + " , " + scooter.y);
        /*
        map.addOverlay(new GMarker(
            new GLatLng(scooter.x, scooter.y)));
        var point = new GLatLng(scooter.x, scooter.y);
        map.setCenter(point, 10);
        var marker = new GMarker(point);
        map.addOverlay(marker);
        */
    });
}

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}

function getLimeScooters() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://web-production.lime.bike/api/rider/v1/views/map?ne_lat=39.3&ne_lng=-76.6&sw_lat=39.2&sw_lng=-76.7&user_latitude=39.2904&user_longitude=-76.6122&zoom=16", true);

    xhttp.onload = function() {
        if (this.status == 200) {
            var jsonResponse = JSON.parse(xhttp.response);
            jsonResponse.data.attributes.bikes.forEach(bike => {
                if (bike.attributes.type_name === "scooter") {
                    storeCoordinate(bike.attributes.latitude, bike.attributes.longitude, limeScooterCoordinates);
                }
            });
        }
    }

    xhttp.setRequestHeader("Authorization", getString(R.string.lime_authorization));
    xhttp.setRequestHeader("Cookie", getString(R.string.lime_cookie));
    xhttp.send();
}

function storeCoordinate(xVal, yVal, coordinates) {
    coordinates.push({x: xVal, y: yVal});
}

exports.pageLoaded = pageLoaded;
exports.onNavigatingTo = onNavigatingTo;
