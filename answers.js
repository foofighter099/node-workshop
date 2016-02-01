Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
};

var request = require("request");


var prompt = require('prompt');

prompt.start();

var userLoc;

prompt.get('location', function(err, result) {

    if (!err) {
        var userLoc = result.location;
        //console.log(userLoc + " is your location");
        //here is where my userLoc is saved
    }
    else {
        console.log("there was an error: " + err);
    }

    request("https://maps.googleapis.com/maps/api/geocode/json?address=" + userLoc, function(err, res, body) {
        if (!err) {
            var locInfo = JSON.parse(body);
            //console.log(locInfo);
            locInfo.results[0].geometry.location.lat = locInfo.results[0].geometry.location.lat.toFixed(2);
            locInfo.results[0].geometry.location.lng = locInfo.results[0].geometry.location.lng.toFixed(2);
            console.log("Your location is: " + locInfo.results[0].geometry.location.lat + " x " + locInfo.results[0].geometry.location.lng);

        }
        else {
            console.log("there was an error: " + err);
        }


        request("http://api.open-notify.org/iss-now.json", function(err, res, body) {
            if (!err) {
                var issInfo = JSON.parse(body);
                //if there's no error, parse the BODY
                //console.log(issInfo);
                //we do this to check what the properties in the objest (issInfo) look like
                issInfo.iss_position.latitude = issInfo.iss_position.latitude.toFixed(2);
                issInfo.iss_position.longitude = issInfo.iss_position.longitude.toFixed(2);
                //we saw the property name is iss_position, and the two we need would be .latitude and .longitude
                console.log("The ISS is now at: " + issInfo.iss_position.latitude + " x " + issInfo.iss_position.longitude);

            }
            else {
                console.log("there was an error: " + err);
            }

            var lat1 = locInfo.results[0].geometry.location.lat;
            var lon1 = locInfo.results[0].geometry.location.lng;
            var lat2 = issInfo.iss_position.latitude;
            var lon2 = issInfo.iss_position.longitude;

            function LatLon(lat, lon) {
                // allow instantiation without 'new'
                if (!(this instanceof LatLon)) return new LatLon(lat, lon);

                this.lat = Number(lat);
                this.lon = Number(lon);
            }


            /**
             * Returns the distance from 'this' point to destination point (using haversine formula).
             *
             * @param   {LatLon} point - Latitude/longitude of destination point.
             * @param   {number} [radius=6371e3] - (Mean) radius of earth (defaults to radius in metres).
             * @returns {number} Distance between this point and destination point, in same units as radius.
             *
             * @example
             *     var p1 = new LatLon(52.205, 0.119), p2 = new LatLon(48.857, 2.351);
             *     var d = p1.distanceTo(p2); // Number(d.toPrecision(4)): 404300
             */
            LatLon.prototype.distanceTo = function(point, radius) {
                if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');
                radius = (radius === undefined) ? 6371e3 : Number(radius);

                var R = radius;
                var φ1 = this.lat.toRadians(),
                    λ1 = this.lon.toRadians();
                var φ2 = point.lat.toRadians(),
                    λ2 = point.lon.toRadians();
                var Δφ = φ2 - φ1;
                var Δλ = λ2 - λ1;

                var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;

                return d;
            };
            var p1 = new LatLon(locInfo.results[0].geometry.location.lat, locInfo.results[0].geometry.location.lng);
            var p2 = new LatLon(issInfo.iss_position.latitude, issInfo.iss_position.longitude);
            var d = p1.distanceTo(p2);
            console.log("You are " + Number(d.toPrecision(4)) / 1000 + " kilometers away from the I.S.S.");

        });

    });
});