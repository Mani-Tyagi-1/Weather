const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);

const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "a9dd0256b75c52f8a9a571fd47a60ef4";
oldTab.classList.add("current-tab");

getfromSessionStorage();


function switchTab(newTab){
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if (!localCoordinates) {
        grantAccessContainer.classList.add('active');
        searchForm.classList.remove('active');
    }
    else {
        const coordinates = JSON.parse(localCoordinates);

        fetchUserWeatherInfo(coordinates);

    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    // API CALL

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherinfo(data);

    }
    catch (err) {
        loadingScreen.classList.remove("active");
        // 
        console.log("Error aa gyi bhai");
    }
}
    function renderWeatherinfo(weatherInfo) {
        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[ data-wheatherDesc]");
        const weatherIcon = document.querySelector("[ data-weatherIcon]");
        const temp = document.querySelector("[ data-temp]");
        const windSpeed = document.querySelector("[ data-windspeed]");
        const humidity = document.querySelector("[ data-humidity");
        const cloudiness = document.querySelector("[ data-cloudiness]");

        // fetch value 
        cityName.innerText=weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

        desc.innerText = weatherInfo?.weather?.[0]?.description;

        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

        temp.innerText = `${weatherInfo?.main?.temp}°C`;
        windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText =`${weatherInfo?.clouds?.all}%`;
        console.log(weatherInfo?.wind?.speed);
    }



// grant access btn

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // 
        alert("Location Not Found");
        console.log("Location not found");
    }
}

function showPosition(position) {

    const userCoodinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoodinates));
    fetchUserWeatherInfo(userCoodinates);

}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);


// search tab
const searchInput = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
    let cityName = searchInput.value;
    
  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userContainer.classList.remove("active");
  grantAccessBtn.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        console.log(data);
        console.log(`${weatherInfo?.cod}%`);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherinfo(data);
    }
    catch (e) {
        console.log("error aa gyi");
    }
}

