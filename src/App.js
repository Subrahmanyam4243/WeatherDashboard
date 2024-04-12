import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = '91106e118b421a5509e7c9fb66379b4d';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const CITIES_API_URL = 'https://public.opendatasoft.com/api/records/1.0/search/';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [citiesData, setCitiesData] = useState([]);
  const [error, setError] = useState(null);
  const InputFocus = useRef();

  useEffect(() => {
    InputFocus.current.focus();
    fetchCitiesData();
  }, []);

  const fetchCitiesData = async () => {
    try {
      const response = await axios.get(CITIES_API_URL, {
        params: {
          dataset: 'geonames-all-cities-with-a-population-1000',
          rows: 1000,
          sort: 'population',
        },
      });

      if (response.status === 200) {
        setCitiesData(response.data.records);
      } else {
        setError('Error fetching city data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
      setError('Error fetching city data. Please try again.');
    }
  };

  const fetchWeatherData = async (cityName) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: cityName,
          appid: API_KEY,
          units: 'metric',
        },
      });

      if (response.status === 200) {
        setWeatherData(response.data);
        setError(null);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data. Please try again.');
    }
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = () => {
    if (city.trim() !== '') {
      fetchWeatherData(city);
    }
  };

  // Function to get background color based on weather condition
  const getBackgroundColor = () => {
    if (!weatherData) return '#055dcf'; // Default background color

    // Example: Change background color based on weather description
    switch (weatherData.weather[0].main.toLowerCase()) {
      case 'clear':
        return '#fde248'; // Sunny
      case 'clouds':
        return '#c4c4c4'; // Cloudy
      case 'rain':
        return '#3e82fc'; // Rainy
      case 'snow':
        return '#ffffff'; // Snowy
      default:
        return '#055dcf'; // Default
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Dashboard</h1>
        <div className="search-container">
          <input
            type="text"
            value={city}
            onChange={handleCity}
            placeholder="Enter city"
            ref={InputFocus}
            list="city-names"
          />
          <datalist id="city-names">
            {citiesData.filter(c => c.fields.name.toLowerCase().includes(city.toLowerCase()))
              .map((filteredCity) => (
                <option key={filteredCity.recordid} value={filteredCity.fields.name} />
            ))}
          </datalist>
          <button onClick={handleSearch}>Get Weather</button>
        </div>
        {error && <p className="error">{error}</p>}
        {weatherData && (
          <div className="weather-info" style={{backgroundColor:getBackgroundColor()}} >
            <h2>{weatherData.name}</h2>
            <p>{weatherData.weather[0].description}</p>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>City</th>
                <th>Population</th>
                <th>Climate</th>
              </tr>
            </thead>
            <tbody>
              {citiesData.map((cityData) => (
                <tr key={cityData.recordid}>
                  <td>{cityData.fields.name}</td>
                  <td>{cityData.fields.population}</td>
                  <td>
                    <button onClick={() => fetchWeatherData(cityData.fields.name)}>View Climate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
