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
  previousCityList.children().remove();
  var stored = JSON.parse(localStorage.getItem("cities"));
  if (stored !== null) {
    storedCities = stored;
  }

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
    getWeather(city);
  } else {
    alert('Please enter a city. Example: "Denver" or "New York"');
  }
};

var pCityClick = function (event) {
  var pCity = event.target.getAttribute("data-city");

  if (pCity) {
    getWeather(pCity);
  }
};

var key = "33833f7677a089398d010fc62caf84d6";
var lat;
var lon;

var getWeather = function (city) {
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
          console.log(data);
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
  var iconNum = data.current.weather[0].icon;
  var iconEl = $(
    `<img src=" http://openweathermap.org/img/wn/${iconNum}.png"  alt="Weather Image">`
  );
  var curUVI = data.current.uvi;
  var curTemp = data.current.temp;
  var curHumidity = data.current.humidity;
  var curWind = data.current.wind_speed;
  var cityEl = $("<h1>").addClass("children").text(city);
  var tempEl = $("<h3>").addClass("children").text(`Temperature: ${curTemp}`);
  var windEl = $("<h3>").addClass("children").text(`Wind speed: ${curWind}mph`);
  var humidityEl = $("<h3>")
    .addClass("children")
    .text(`Humidity: ${curHumidity}%`);
  var uviEl = $("<h3>")
    .addClass("uvi-class children")
    .text(`UV Index: ${curUVI}`);

  weatherContainerEl
    .append(cityEl)
    .append(`<h3> Date: ${currentdate.format("MMMM Do")}`)
    .addClass("children")
    .append(iconEl)
    .append(tempEl)
    .append(windEl)
    .append(humidityEl)
    .append(uviEl);

  if (curUVI <= 2.9999) {
    var uviElSub = $("<h4>").text("LOW");
    uviEl.css("background-color", "lightgreen").append(uviElSub);
  } else if (curUVI <= 5.9999) {
    var uviElSub = $("<h4>").text("MODERATE");
    uviEl.css("background-color", "yellow").append(uviElSub);
  } else if (curUVI <= 7.9999) {
    var uviElSub = $("<h4>").text("HIGH");
    uviEl.css("background-color", "orange").append(uviElSub);
  } else if (curUVI <= 10.9999) {
    var uviElSub = $("<h4>").text("VERY HIGH");
    uviEl.css("background-color", "red").append(uviElSub);
  } else if (curUVI > 10.999) {
    var uviElSub = $("<h4>").text("EXTREME");
    uviEl.css("background-color", "lightpurple").append(uviElSub);
  }
};

var createFive = function (data, city) {
  $(".five").text("");
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
    var iconNum = data.daily[i].weather[0].icon;

    curDayId
      .append($(`<h3>Date: ${curDateWF}</h3>`).addClass("childrenFive"))
      .append(
        $(
          `<img src=" http://openweathermap.org/img/wn/${iconNum}.png"  alt="Weather Image">`
        )
      )
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
