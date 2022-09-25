let lat, lon;
let SettedLocation = "Current";
var options = {
    // If possible, set to true to read high-accuracy locations (e.g. GPS, etc.)
    // However, this functionality affects battery life.
    enableHighAccuracy: false, // Approximate value doesn't matter: default value

    maximumAge: 30000,     // No modifications required until 5 minutes have passed : default value is 0

    // How long will you wait to receive location information?
    // The default is Infinity, so getCurrentPosition() waits indefinitely.
    timeout: 15000    // don't wait more than 15 seconds.
}

if (navigator.geolocation) { // If you support geolocation, request the location. 
    navigator.geolocation.getCurrentPosition(success, error, options);
} else {
    locationError.innerHTML = "Geolocation is not supported with this browser.";
}

// If the geolocation request fails, call this function.
function error(e) {
    // The error object has numerical codes and text messages.
    // The code values are as follows.
    // 1: User does not provide permission to share location information.
    // 2: Browser cannot get location.
    // 3: Timeout occurred.
    locationError.innerHTML = "Geolocation error" + e.code + ": " + e.message;
}

// This function is called if the geolocation request is successful.
function success(pos) {

    console.log(pos); // [Debugging] Check Position Object

    lat = latitude.innerHTML = pos.coords.latitude;
    lon = longitude.innerHTML = pos.coords.longitude;
}

// get api key from https://openweathermap.org/api
const API_KEY = '030a06ef3a21f98e9fad039e0133fbbe';
const IMAGE_BASE = "https://openweathermap.org/img/w/";

getWeather.addEventListener('click', () => {

    // console.log("lat : " + lat + "lon : " + lon);

    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
     )
        .then(response => response.json())
        .then(data => {
            locationWeather.innerHTML = " : " + SettedLocation;
            temperature.innerHTML = data.main.temp;
            weather.innerHTML = data.weather[0].main;
            WeatherLatitude.innerHTML = lat;
            WeatherLongitude.innerHTML = lon;
        });
});

citySearch.addEventListener('click', () => {
    fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName.value}&appid=${API_KEY}`,
    )
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.length) {
                SettedLocation = data[0].name;
                lat = data[0].lat;
                lon = data[0].lon;
                console.log(SettedLocation);
                locationWeather.innerHTML = "";
                locationForecast.innerHTML = "";
                fiveDaysWeatherTable.innerHTML = "";
            } else {
                console.log("No city");
            }
        });
})

forecast.addEventListener('click', () => {
    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
     )
        .then(response => response.json())
        .then(data => {
            // whole data is displayed console.log, instead access below link to show whole data
            // https://api.openweathermap.org/data/2.5/forecast?lat=49.2288149&lon=-123.1141329&appid=030a06ef3a21f98e9fad039e0133fbbe
            // console.log(JSON.stringify(data));
            let list = data.list;
            locationForecast.innerHTML = " : " + SettedLocation;
            fiveDaysWeatherTable.innerHTML = "";
            for (item of list) {
                // console.log("forecast weather date : " + item.dt_txt);
                // console.log("forecast weather data : " + item.weather[0].main);
                let symbol = item.weather[0].icon + ".png";
                let imageSrcUrl = IMAGE_BASE + symbol;
                let row = fiveDaysWeatherTable.insertRow();

                // define cells each rows.
                const cellDate = row.insertCell(0);
                const cellWeatherIcon = row.insertCell(1);
                const cellWeather = row.insertCell(2);
                const cellTemp = row.insertCell(3);

                cellDate.innerHTML = item.dt_txt;
                cellWeatherIcon.innerHTML = `<img src=${imageSrcUrl}>`;
                cellWeather.innerHTML = item.weather[0].main;
                cellTemp.innerHTML = item.main.temp + "℃";
            }
        });
});
