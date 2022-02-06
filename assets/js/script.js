// need to add local local storage to list - add class btn via javascript - on click reload that city's weather - need to add attribute when pulled from storage that is equal to the value of the city "data-city"

var userFormEl = $("#user-form");
var userInput = $("#userInput");
var weatherContainerEl = $("#weather-container");
var weatherSearchTerm = $("#weather-search-term");
var previousCityDiv = $("#previous-city-div");
var previousCityList = $("#previous-city-list");

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = userInput.val().trim();

  if (city) {
    getUserRepos(city);

    weatherContainerEl.textContent = "";
    userInput.value = "";
  } else {
    alert('Please enter a city. Example: "Denver" or "New York"');
  }
};

var buttonClickHandler = function (event) {
  var pCity = event.target.getAttribute("data-city");

  if (pCity) {
    getUserRepos(pCity);

    weatherContainerEl.textContent = "";
  }
};

var key = "33833f7677a089398d010fc62caf84d6";
var lat;
var lon;

var getUserRepos = function (city) {
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=5" +
    "&appid=" +
    key;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data[0].lat;
      lon = data[0].lon;

      fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&units=imperial&exclude=minutely,hourly,alerts&appid=" +
          key
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          var passedData = data;
          var passedCity = city;
          createVars(passedData, passedCity);
          createFive(passedData, passedCity);
        });
    })
    .catch(function (error) {
      alert("Unable to connect to WeatherStation");
    });
};

var createVars = function (data, city) {
  var curUVI = data.current.uvi;
  var curTemp = data.current.temp;
  var curHumidity = data.current.humidity;
  var curWind = data.current.wind_speed;

  var cityEl = document.createElement("h1");
  cityEl.classList.add("children");
  cityEl.textContent = city;
  weatherContainerEl.append(cityEl);

  var tempEl = document.createElement("h3");
  tempEl.classList.add("children");
  tempEl.textContent = `Temperature: ${curTemp}`;
  weatherContainerEl.append(tempEl);

  var windEl = document.createElement("h3");
  windEl.classList.add("children");
  windEl.textContent = `Wind speed: ${curWind}mph`;
  weatherContainerEl.append(windEl);

  var humidityEl = document.createElement("h3");
  humidityEl.classList.add("children");
  humidityEl.textContent = `Humidity: ${curHumidity}%`;
  weatherContainerEl.append(humidityEl);

  var uviEl = document.createElement("h3");
  uviEl.classList.add("uvi-class");
  uviEl.classList.add("children");
  uviEl.textContent = `UV Index: ${curUVI}`;
  weatherContainerEl.append(uviEl);

  if (curUVI <= 2.9999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "lightgreen";
    var uviElSub = document.createElement("h4");
    uviElSub.textContent = "LOW";
    uviEl.appendChild(uviElSub);
  } else if (curUVI <= 5.9999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "yellow";
    var uviElSub = document.createElement("h4");
    uviElSub.textContent = "MODERATE";
    uviEl.appendChild(uviElSub);
  } else if (curUVI <= 7.9999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "orange";
    var uviElSub = document.createElement("h4");
    uviElSub.textContent = "HIGH";
    uviEl.appendChild(uviElSub);
  } else if (curUVI <= 10.9999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "red";
    var uviElSub = document.createElement("h4");
    uviElSub.textContent = "VERY HIGH";
    uviEl.appendChild(uviElSub);
  } else if (curUVI > 10.999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "lightpurple";
    var uviElSub = document.createElement("h4");
    uviElSub.textContent = "EXTREME";
    uviEl.appendChild(uviElSub);
  }
};

//   city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

var createFive = function (data, city) {
  var nextFive = data.daily;
  console.log(nextFive);

  for (let i = 0; i < 5; i++) {
    var maxTemp = nextFive[i].temp.max;
    var minTemp = nextFive[i].temp.min;
    var humidity = nextFive[i].humidity;
    var wind = nextFive[i].wind_speed;
    var curDayId = $(`#day-${[i]}`);
    console.log(`NEW DAY`);
    console.log(maxTemp);
    console.log(minTemp);
    console.log(humidity);
    console.log(wind);

    var maxTempEl = $("<h3>");

    curDayId.append(
      $(`<h3>Maximum Temperature: ${maxTemp} degrees f.</h3>`).addClass(
        "childrenFive"
      )
    );
    curDayId.append(
      $(`<h3>Min Temperature: ${minTemp} degrees f.</h3>`).addClass(
        "childrenFive"
      )
    );
    curDayId.append(
      $(`<h3>Wind Speed: ${wind} mph</h3>`).addClass("childrenFive")
    );
    curDayId.append(
      $(`<h3>Humidity: ${humidity}%</h3>`).addClass("childrenFive")
    );
  }
};

userFormEl.on("submit", formSubmitHandler);
previousCityDiv.on("click", buttonClickHandler);
