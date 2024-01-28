// user input --> city name.
// use Geocoding API to get to convert city to lat and lon.
// use geocoding API in a function.
// pass lat and lon to function containing weather API.
// input lat and lon into weather API.
// request units to imperial.
// display: weather icon (rainy, sunny, cloudy, etc.)
// display: temp, wind speed, humidity.
// save location name in local storage.
// when saved location is clicked, run the geocoding API function.

let cityName = 'london';

searchCity(cityName);

function searchCity(city) {
    const geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=3c714b351bd071d5137b8a8f12fed03e`;

    fetch(geoCodeUrl) 
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
              console.log(data);
              let lat = (data[0].lat);
              let lon = (data[0].lon);
             // console.log(`lattitude: ${lat} , longitude: ${lon}`);
            })
        } else {
            alert(`Error: ${response.statusText}`); // change later.
        }
    })
}




// searchCity();