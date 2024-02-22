import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = '91106e118b421a5509e7c9fb66379b4d';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const InputFocus=useRef();
  useEffect(()=>{
      InputFocus.current.focus();

  },[])
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
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
  const handleCity=(e)=>{
    setCity(e.target.value)
  }
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Dashboard</h1>
        <div>
          <input
            type="text"
            value={city}
            onChange={handleCity}
            placeholder="Enter city"
            ref={InputFocus}
          />
          <button onClick={fetchWeatherData}>Get Weather</button>
        </div>
        {error && <p className="error">{error}</p>}
        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}</h2>

            <p>{weatherData.weather[0].description}</p>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
