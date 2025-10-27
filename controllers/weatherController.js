const axios = require('axios');
const Weather = require('../models/Weather');

const OPENWEATHER_API_KEY = 'c08c810ff1aab8baadad42428c7952d8';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

const getWeatherData = async (req, res) => {
  try {
    console.log("getWeatherData city", req.params);
    const { city } = req.params;
    
    if (!city || city.trim() === '') {
      return res.status(400).json({ 
        error: 'City name is required',
        message: 'Please provide a valid city name'
      });
    }

    const cityName = city.toLowerCase().trim();
    
    // Check if we have cached data within the last 10 minutes
    const cachedWeather = await Weather.findOne({ 
      city: cityName,
      timestamp: { $gte: new Date(Date.now() - CACHE_DURATION) }
    });

    if (cachedWeather) {
      console.log(`Returning cached data for ${cityName}`);
      return res.json({
        city: cachedWeather.city,
        temperature: cachedWeather.temperature,
        condition: cachedWeather.condition,
        icon: cachedWeather.icon,
        timestamp: cachedWeather.timestamp,
        cached: true
      });
    }

    // Fetch fresh data from OpenWeather API
    console.log(`Fetching fresh data for ${cityName} from OpenWeather API`);
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await axios.get(apiUrl);
    const weatherData = response.data;

    // Extract required data
    const weatherInfo = {
      city: cityName,
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      timestamp: new Date()
    };

    // Save to database
    const newWeather = new Weather(weatherInfo);
    await newWeather.save();

    // Return the data
    res.json({
      ...weatherInfo,
      cached: false
    });

  } catch (error) {
    console.error('Error fetching weather data:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Base error response structure
    const errorResponse = {
      error: '',
      message: '',
      details: process.env.NODE_ENV === 'development' ? {
        originalError: error.message,
        stack: error.stack,
        code: error.code,
        timestamp: new Date().toISOString()
      } : undefined
    };
    
    if (error.response) {
      // API error response
      const statusCode = error.response.status;
      const apiErrorData = error.response.data;
      
      if (statusCode === 404) {
        errorResponse.error = 'City not found';
        errorResponse.message = 'The city you searched for could not be found. Please check the spelling and try again.';
        if (process.env.NODE_ENV === 'development') {
          errorResponse.details.apiResponse = apiErrorData;
          errorResponse.details.statusCode = statusCode;
        }
        return res.status(404).json(errorResponse);
      } else if (statusCode === 401) {
        errorResponse.error = 'API authentication failed';
        errorResponse.message = 'There was an issue with the weather service. Please try again later.';
        if (process.env.NODE_ENV === 'development') {
          errorResponse.details.apiResponse = apiErrorData;
          errorResponse.details.statusCode = statusCode;
        }
        return res.status(500).json(errorResponse);
      } else {
        errorResponse.error = 'Weather service error';
        errorResponse.message = 'Unable to fetch weather data. Please try again later.';
        if (process.env.NODE_ENV === 'development') {
          errorResponse.details.apiResponse = apiErrorData;
          errorResponse.details.statusCode = statusCode;
        }
        return res.status(statusCode).json(errorResponse);
      }
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // Network error
      errorResponse.error = 'Service unavailable';
      errorResponse.message = 'Unable to connect to weather service. Please check your internet connection.';
      if (process.env.NODE_ENV === 'development') {
        errorResponse.details.networkError = error.code;
        errorResponse.details.url = error.config?.url;
      }
      return res.status(503).json(errorResponse);
    } else {
      // Other errors (MongoDB, validation, etc.)
      errorResponse.error = 'Internal server error';
      errorResponse.message = 'Something went wrong while fetching weather data.';
      if (process.env.NODE_ENV === 'development') {
        errorResponse.details.errorType = error.name || 'Unknown';
      }
      return res.status(500).json(errorResponse);
    }
  }
};

module.exports = {
  getWeatherData
};
