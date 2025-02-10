import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHalf,
  faWind,
  faDroplet,
  faGauge,
  faEye,
  faSun,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import InfoBox from "./components/InfoBox/InfoBox.jsx";
import TimeForecast from "./components/TimeForecast/TimeForecast.jsx";
import DayForecast from "./components/DayForecast/DayForecast.jsx";

function App() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const timeoutRef = useRef(null);

  const API_KEY = "850adf2f87cda9d16d0a47944e838e34"; // DON'T DO THIS. DON'T PUSH API KEYS! BUT I HAD TO
  const weatherUrlLatLon = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const forecastUrlLatLon = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  const weatherUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  const forecastUrlCity = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

  async function fetchData(url, type) {
    try {
      let response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the city name.");
        }
        throw new Error("HTTP error! status:", response.status);
      }

      let data = await response.json();

      if (type === 0) {
        setWeatherData(data);
      } else {
        setForecastData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  // Get location of the user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (error) => {
        setLat(27.7103);
        setLon(85.3222);
        console.log("Error getting location:", error.message);
        setErrorMsg("locationError");
        timeoutRef.current = setTimeout(() => setErrorMsg(""), 3000);
      },
    );

    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      fetchData(weatherUrlLatLon, 0);
      fetchData(forecastUrlLatLon, 1);
    }
  }, [lat, lon, city]);

  if (weatherData === null || forecastData === null) {
    return <div>Loading...</div>;
  }

  function dtToTime(dt) {
    return `${new Date(dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  function dtToDay(dt) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return `${days[new Date(dt * 1000).getDay()]}`.toUpperCase().slice(0, 3);
  }

  function tempConv(temp) {
    return `${Math.floor(temp - 273.15)}°`;
  }

  function citySearch() {
    fetchData(weatherUrlCity, 0);
    fetchData(forecastUrlCity, 1);
  }

  // This is for the MainWeather container
  const temperature = Math.floor(weatherData.main.temp - 273.15);
  let weatherDescription = weatherData.weather[0].description;
  weatherDescription =
    weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
  const cityName = weatherData.name;
  const imgURL = `/mausam/weatherImages/${weatherData.weather[0].icon}.svg`;

  // Setting the window title to the current city
  document.title = `Mausam in ${weatherData.name}`;

  // This is for the InfoBox component just below the MainWeather container
  const infoBoxItems = [
    {
      icon: faTemperatureHalf,
      text: "FEELS LIKE",
      value: tempConv(weatherData.main.feels_like),
    },
    {
      icon: faWind,
      text: "WIND SPEED",
      value: `${Math.round(weatherData.wind.speed * 3.6 * 100) / 100} km/h`,
    },
    {
      icon: faDroplet,
      text: "HUMIDITY",
      value: `${weatherData.main.humidity}%`,
    },
    {
      icon: faGauge,
      text: "PRESSURE",
      value: `${weatherData.main.pressure} hPa`,
    },
    {
      icon: faEye,
      text: "VISIBILITY",
      value: `${weatherData.visibility / 1000} km`,
    },
    {
      icon: faSun,
      text: "SUNSET",
      value: dtToTime(weatherData.sys.sunset),
    },
  ];

  function getDayForecast(data) {
    // Removing only today's data
    const filteredData = data.filter(
      (item) => new Date(item.dt * 1000).getDate() !== new Date().getDate(),
    );

    const result = [];
    for (let i = 3; i < filteredData.length; i += 8) {
      result.push(filteredData[i]);
    }

    return result;
  }

  return (
    <>
      <div className={`error-box ${errorMsg ? "show" : ""}`}>
        There was an error getting your location!
      </div>
      <div className="leftBox">
        <div className="inputBox">
          <input
            id="citySearchInput"
            onChange={(e) => setCity(e.target.value)}
            type="text"
            placeholder="Search for cities"
          />
          <button onClick={citySearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <div className="mainWeatherBox">
          <div className="textBox">
            <h1 className="cityText">{cityName}</h1>
            <h1 className="tempText">{temperature}&deg;</h1>
            <p>{weatherDescription}</p>
          </div>
          <img
            className="weatherImg"
            src={imgURL}
            alt="Current Weather Picture"
          />
        </div>

        <div className="infoBoxContainer">
          {infoBoxItems.map((item, index) => (
            <InfoBox
              key={index}
              icon={item.icon}
              text={item.text}
              value={item.value}
            />
          ))}
        </div>
      </div>

      <div className="rightBox">
        <div className="timeForecast">
          <h6>NEXT THREE HOURS</h6>
          <div className="timeForecastBox">
            {forecastData.list.slice(0, 3).map((item, index) => (
              <TimeForecast
                key={index}
                time={dtToTime(item.dt)}
                img={item.weather[0].icon}
                temp={tempConv(item.main.temp)}
              />
            ))}
          </div>
        </div>

        <div className="dayForecast">
          <h6>FURTHER FORECASTS (11:45 AM)</h6>
          <ul>
            {getDayForecast(forecastData.list).map((item, index) => (
              <DayForecast
                key={index}
                day={dtToDay(item.dt)}
                img={item.weather[0].icon}
                desc={item.weather[0].main}
                maxTemp={tempConv(item.main.temp_max)}
                minTemp={tempConv(item.main.temp_min)}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
