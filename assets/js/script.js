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

// selects classes and ids for required html elements.
const todayEl = document.querySelector('.card-title');
const todayEl2 = document.querySelector('.weather-icon');
const day0El = document.querySelector('.day-0');
const day1El = document.querySelector('#day-1');
const day2El = document.querySelector('#day-2');
const day3El = document.querySelector('#day-3');
const day4El = document.querySelector('#day-4');
const day5El = document.querySelector('#day-5');

const daysArr = [day1El, day2El, day3El, day4El, day5El];

const searchBtnEl = document.querySelector('#searchBtn');
const clearBtnEl = document.querySelector('#clearBtn');

const usrInputEl = document.querySelector('#cityName');
const searchHistEl = document.querySelector('.history');
const listDivEl = document.querySelector('.list-div');

// pulls saved location from local storage.
let savedCities = JSON.parse(localStorage.getItem('cityNames'));

// defines array containing locations and initializes based on the if statement below.
let cityNamesArr;

if (savedCities !== null) {
    cityNamesArr = savedCities;
} else {
    cityNamesArr = [];
}


// clears appended locations.
function clearCities() { 
        searchHistEl.innerHTML = '';
        localStorage.removeItem('cityNames');
}

// appends saved locations to the page upon page-load.
function displayCities() {
    if (savedCities !== null) {
        for (let i = 0; i < savedCities.length; i++) {
            let newCity = document.createElement('li');
            newCity.classList.add('saved');
            newCity.textContent = savedCities[i];
            newCity.addEventListener('click', function() {
                searchCity(savedCities[i]);
            })
            searchHistEl.appendChild(newCity);
        } 
    }
}

// gets user input, saves to local storage and appends value to page with a 'click' event listener.
// sends input value to searchCity function.
function inputCity(e) {
    e.preventDefault();
    
    const inputVal = usrInputEl.value.trim();
    
    if (inputVal) {
        if (cityNamesArr === null || !(cityNamesArr.includes(inputVal))) {
            cityNamesArr.push(inputVal);
            localStorage.setItem('cityNames', JSON.stringify(cityNamesArr));
            
            let newItem = document.createElement('li');
            newItem.textContent = inputVal;
            newItem.addEventListener('click', function() {
                searchCity(inputVal);
            });

            searchHistEl.appendChild(newItem);
        }
        
        searchCity(inputVal);
        usrInputEl.value = '';

    } else {
        alert ('Please enter a city name')
    }
}

// uses the Openweather geoCode API to to convert location name input to lattitude and longitude.
// passes lattitude and longitude values to getWeather function.
function searchCity(city) {
    
    const geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=3c714b351bd071d5137b8a8f12fed03e`;

    fetch(geoCodeUrl) 
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
             // console.log(data);
              let lat = (data[0].lat);
              let lon = (data[0].lon);

              getWeather(lat, lon);
              
            })
        } else {
            alert(`Error: ${response.statusText}`);
        }
    })
}

// inputs the lattitude and longitudethe to the Openweather weather API to retrieve weather info. 
function getWeather(lattitude, longitude) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&units=imperial&appid=3c714b351bd071d5137b8a8f12fed03e`;

    fetch(weatherUrl)
      .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayWeather(data);
            })
        }
      })
}
// gets weather info (icon, temo, wind, humidity of currend day).
// appends info to page.
function displayWeather(get) {
    let location = get.city.name;
    let date = (get.list[0].dt_txt).split(' ');
    let dateFormat = date[0].split('-');
    let newDate = `${dateFormat[1]}-${dateFormat[2]}-${dateFormat[0]}`

    let icon = get.list[0].weather[0].icon;
    let temp = get.list[0].main.temp;
    let wind = get.list[0].wind.speed;
    let humid = get.list[0].main.humidity;

    todayEl.innerHTML = `${location} \u00A0\ ${newDate}`;
    todayEl2.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    day0El.children[0].textContent = `Temp: ${Math.round(temp)} °F`;
    day0El.children[1].textContent = `Wind: ${Math.round(wind)} MPH`;
    day0El.children[2].textContent = `Humidity: ${humid} %`;

    // gets weather info (icon, temo, wind, humidity of the next five days).
    // appends info to page.
    // gets info from the following arrays of the 40 arrays available.
    // the arrays below are the start of the new day and updates over time.
    const resArr = [8, 16, 24, 32, 39];

    for (let i = 0; i < resArr.length; i++) {
        let futureDate = (get.list[resArr[i]].dt_txt).split(' ')[0].split('-');
        daysArr[i].children[0].innerHTML = `${futureDate[1]}-${futureDate[2]}-${futureDate[0]}`;
        daysArr[i].children[1].src = `https://openweathermap.org/img/wn/${get.list[resArr[i]].weather[0].icon}@2x.png`;
        daysArr[i].children[2].children[0].textContent = `Temp: ${Math.round(get.list[resArr[i]].main.temp)} °F`;
        daysArr[i].children[2].children[1].textContent = `Wind: ${Math.round(get.list[resArr[i]].wind.speed)} MPH`;
        daysArr[i].children[2].children[2].textContent = `Humidity: ${get.list[resArr[i]].main.humidity} %`;

    }

}
// runs the displayCities function and appends items from the local storage.
displayCities();
// provides input value to the geocode function, in order to retrieve and display weather info.
searchBtnEl.addEventListener('click', inputCity);
// clears all items saved in local storage, and removes appended items.
clearBtnEl.addEventListener('click', clearCities);

