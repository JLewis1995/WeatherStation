// need to add local local storage to list - add class btn via javascript - on click reload that city's weather - need to add attribute when pulled from storage that is equal to the value of the city "data-city"

// need to add images for what the weather is like - research to see if API can do this

var userFormEl = $("#user-form");
var userInput = $("#userInput");
var weatherContainerEl = $("#weather-container");
var weatherSearchTerm = $("#weather-search-term");
var previousCityDiv = $("#previous-city-div");
var previousCityList = $("#previous-list");
var storedCities = [];
var currentdate = moment();

function init() {
  var stored = JSON.parse(localStorage.getItem("cities"));
  if (stored !== null) {
    storedCities = stored;
  }
  console.log(storedCities);
  for (let i = 0; i < storedCities.length; i++) {
    var storedCC = storedCities[i];
    var prevCity = $(`<li></li>`);
    var prevCityBtn = $(`<button>${storedCC}</button>`)
      .addClass("previous")
      .attr("data-city", storedCC);
    prevCity.append(prevCityBtn);
    $("#previous-list").append(prevCity);
  }
}

var formSubmitHandler = function (event) {
  event.preventDefault();
  var city = userInput.val().trim();

  if (city) {
    storedCities.push(city);
    localStorage.setItem("cities", JSON.stringify(storedCities));
    getUserRepos(city);
  } else {
    alert('Please enter a city. Example: "Denver" or "New York"');
  }
};

var pCityClick = function (event) {
  // event.preventDefault();
  var pCity = event.target.getAttribute("data-city");

  if (pCity) {
    getUserRepos(pCity);
  }
};

var key = "33833f7677a089398d010fc62caf84d6";
var lat;
var lon;

var getUserRepos = function (city) {
  weatherContainerEl.children().remove();
  userInput.val("");
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
          var passedData = data;
          var passedCity = city;
          createVars(passedData, passedCity);
          createFive(passedData, passedCity);
          init();
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

  weatherContainerEl
    .append(`<h3> Date: ${currentdate.format("MMMM Do")}`)
    .addClass("children");

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

  var uviEl = $("<h3>");
  uviEl.addClass("uvi-class children");
  uviEl.textContent = `UV Index: ${curUVI}`;
  weatherContainerEl.append(uviEl);

  if (curUVI <= 2.9999) {
    uviEl.css("background-color", "lightgreen");
    var uviElSub = $("<h4>").text("LOW");
    uviEl.append(uviElSub);
  } else if (curUVI <= 5.9999) {
    uviEl.css("background-color", "yellow");
    var uviElSub = $("<h4>").text("MODERATE");
    uviEl.append(uviElSub);
  } else if (curUVI <= 7.9999) {
    uviEl.css("background-color", "orange");
    var uviElSub = $("<h4>").text("HIGH");
    uviEl.append(uviElSub);
  } else if (curUVI <= 10.9999) {
    uviEl.css("background-color", "red");
    var uviElSub = $("<h4>").text("VERY HIGH");
    uviEl.append(uviElSub);
  } else if (curUVI > 10.999) {
    uviEl.css("background-color", "lightpurple");
    var uviElSub = $("<h4>").text("EXTREME");
    uviEl.append(uviElSub);
  }
};

var createFive = function (data, city) {
  var nextFive = data.daily;

  for (let i = 0; i < 5; i++) {
    var maxTemp = nextFive[i].temp.max;
    var minTemp = nextFive[i].temp.min;
    var humidity = nextFive[i].humidity;
    var wind = nextFive[i].wind_speed;
    var curDayId = $(`#day-${[i]}`);
    var num = i + 1;
    var curDate = moment().add(num, "days").endOf("day");
    var curDateWF = curDate.format("MMMM Do");
    console.log(curDate);
    console.log(num);

    curDayId
      .append($(`<h3>Date: ${curDateWF}</h3>`).addClass("childrenFive"))
      .append(
        $(`<h3>Maximum Temperature: ${maxTemp} degrees f.</h3>`).addClass(
          "childrenFive"
        )
      )
      .append(
        $(`<h3>Min Temperature: ${minTemp} degrees f.</h3>`).addClass(
          "childrenFive"
        )
      )
      .append($(`<h3>Wind Speed: ${wind} mph</h3>`).addClass("childrenFive"))
      .append($(`<h3>Humidity: ${humidity}%</h3>`).addClass("childrenFive"));
  }
};

userFormEl.on("submit", formSubmitHandler);
previousCityList.on("click", ".previous", pCityClick);
init();
