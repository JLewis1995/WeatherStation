// need to add local local storage to list - add class btn via javascript - on click reload that city's weather - need to add attribute when pulled from storage that is equal to the value of the city "data-city"

var userFormEl = document.querySelector('#user-form');
var userInput = document.querySelector('#userInput');
var weatherContainerEl = document.querySelector('#weather-container');
var weatherSearchTerm = document.querySelector('#weather-search-term');
var previousCityBtn = document.querySelector('#previous-city-btn');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = userInput.value.trim();

  if (city) {
    getUserRepos(city);

    weatherContainerEl.textContent = '';
    userInput.value = '';
  } else {
    alert('Please enter a city. Example: "Denver" or "New York"');
  }
};

var buttonClickHandler = function (event) {
  var pCity = event.target.getAttribute('data-city');

  if (pCity) {
    getUserRepos(pCity);

    weatherContainerEl.textContent = '';
  }
};

var key = "33833f7677a089398d010fc62caf84d6";
var lat;
var lon;


var getUserRepos = function (city) {
  var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5' + '&appid=' + key;

  fetch(apiUrl)
    .then(function (response) {
      return response.json() 
    })
    .then(function(data){
      lat = data[0].lat;
      lon = data[0].lon;

      fetch ('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly,alerts&appid=' + key)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        console.log(data);
        var passedData = data;
        var passedCity = city;
        createVars(passedData, passedCity)
      })
    })
    .catch(function (error) {
      alert('Unable to connect to WeatherStation');
    });
};

var createVars = function (data, city) {
  var curUVI = data.current.uvi;
  var curTemp = data.current.temp;
  var curHumidity = data.current.humidity;
  var curWind = data.current.wind_speed;

  var cityEl = document.createElement('h1');
  cityEl.textContent = city;
  weatherContainerEl.appendChild(cityEl);

  var tempEl = document.createElement('h3');
  tempEl.textContent = `Temperature: ${curTemp}`;
  weatherContainerEl.appendChild(tempEl);

  var windEl = document.createElement('h3');
  windEl.textContent = `Wind speed: ${curWind}mph`;
  weatherContainerEl.appendChild(windEl);

  var humidityEl = document.createElement('h3');
  humidityEl.textContent = `Humidity: ${curHumidity}%`;
  weatherContainerEl.appendChild(humidityEl);

  var uviEl = document.createElement('h3');
  uviEl.classList.add('uvi-class');
  uviEl.textContent = `UV Index: ${curUVI}`;
  weatherContainerEl.appendChild(uviEl);

  if (curUVI <= 2.9999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "lightgreen";
    var uviElSub = document.createElement('h4');
    uviElSub.textContent = "LOW";
    uviEl.appendChild(uviElSub);
  } else if (curUVI <= 5.9999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "yellow";
    var uviElSub = document.createElement('h4');
    uviElSub.textContent = "MODERATE";
    uviEl.appendChild(uviElSub);
  } else if (curUVI <= 7.9999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "orange";
    var uviElSub = document.createElement('h4');
    uviElSub.textContent = "HIGH";
    uviEl.appendChild(uviElSub);
  } else if (curUVI <= 10.9999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "red";
    var uviElSub = document.createElement('h4');
    uviElSub.textContent = "VERY HIGH";
    uviEl.appendChild(uviElSub);
  } else if (curUVI > 10.999) {
    console.log(curUVI);
    uviEl.style.backgroundColor = "lightpurple";
    var uviElSub = document.createElement('h4');
    uviElSub.textContent = "EXTREME";
    uviEl.appendChild(uviElSub);
  }

  weatherContainerEl.children.classList.add('children');

}

//   city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    weatherContainerEl.textContent = 'No weather found.';
    return;
  }

  weatherSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('a');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    weatherContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);
previousCityBtn.addEventListener('click', buttonClickHandler);
