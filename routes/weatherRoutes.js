const express = require('express');
const { getWeatherData } = require('../controllers/weatherController');

const router = express.Router();

// GET /api/weather/:city - Get weather data for a specific city
router.get('/:city', getWeatherData);

module.exports = router;
