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
const usrInputEl = document.querySelector('#cityName');
const searchHistEl = document.querySelector('.history');

let cityName = 'nanuet';

inputCity = function(e) {
    e.preventDefault();

    const inputVal = usrInputEl.value.trim();

    if (inputVal) {
        localStorage.setItem('cityName', JSON.stringify(inputVal));
        let savedItem = JSON.parse(localStorage.getItem('cityName'));
        let newItem = document.createElement('button');
        newItem.textContent = savedItem;
        searchHistEl.appendChild(newItem);


        searchCity(inputVal);

        usrInputEl.value = '';
    } else {
        alert ('Please enter a city name')
    }
}



function searchCity(city) {
    const geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=3c714b351bd071d5137b8a8f12fed03e`;

    fetch(geoCodeUrl) 
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
             // console.log(data);
              let lat = (data[0].lat);
              let lon = (data[0].lon);

              getWeather(lat, lon);
              
             // console.log(`lattitude: ${lat} , longitude: ${lon}`);
            })
        } else {
            alert(`Error: ${response.statusText}`); // change later.
        }
    })
}

function getWeather(lattitude, longitude) {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&units=imperial&appid=3c714b351bd071d5137b8a8f12fed03e`;

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

function displayWeather(get) {
    let location = get.city.name;
    let date = (get.list[0].dt_txt).split(' ');
    let dateFormat = date[0].split('-');
    let newDate = `${dateFormat[1]} - ${dateFormat[2]} - ${dateFormat[0]}`

    let icon = get.list[0].weather[0].icon;
    let temp = get.list[0].main.temp;
    let wind = get.list[0].wind.speed;
    let humid = get.list[0].main.humidity;

    // console.log(temp);
    // console.log(wind);
    // console.log(humid);
    // console.log(date);

    todayEl.innerHTML = `${location} \u00A0\ ${newDate}`;
    todayEl2.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    day0El.children[0].textContent = `Temp: ${temp} °F`;
    day0El.children[1].textContent = `Wind: ${wind} MPH`;
    day0El.children[2].textContent = `Humidity: ${humid} %`;

    const resArr = [8, 16, 24, 32, 39];

    for (let i = 0; i < resArr.length; i++) {
        daysArr[i].children[0].innerHTML = (get.list[resArr[i]].dt_txt);
        daysArr[i].children[1].src = `https://openweathermap.org/img/wn/${get.list[resArr[i]].weather[0].icon}@2x.png`;
        daysArr[i].children[2].children[0].textContent = `Temp: ${get.list[resArr[i]].main.temp} °F`;
        daysArr[i].children[2].children[1].textContent = `Wind: ${get.list[resArr[i]].wind.speed} MPH`;
        daysArr[i].children[2].children[2].textContent = `Humidity: ${get.list[resArr[i]].main.humidity} %`;

    }

}

searchBtnEl.addEventListener('click', inputCity);

// response = 40 arrays.
// 8 times slots per day: 00, 3, 6, 9, 12, 15, 18, 21.
// 8 arrays per day.
// 0th array for current/todays weather. 
// then every 8th array for next day. (8, 16, 24, 32, 39)
// every 8th array from the bottom. (37, 29, 21, 13, 5)
// 35, 19, 11, 3, 0


// searchCity();