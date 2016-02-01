var request = require("request");

request("http://api.open-notify.org/iss-now.json", function(err, res, body){
        if (!err) {                                                                                 
        var issInfo = JSON.parse(body);          
        //if there's no error, parse the BODY
        console.log(issInfo);
        //we do this to check what the properties in the objest (issInfo) look like
        issInfo.iss_position.latitude = issInfo.iss_position.latitude.toFixed(2);
        issInfo.iss_position.longitude = issInfo.iss_position.longitude.toFixed(2);
        //we saw the property name is iss_position, and the two we need would be .latitude and .longitude
        console.log("The ISS is now at: " + issInfo.iss_position.latitude + " x " + issInfo.iss_position.longitude);
    }
    else {
        console.log("there was an error: " + err);
    }
})