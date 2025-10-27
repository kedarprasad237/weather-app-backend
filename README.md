# 🌤️ Weather App Backend

A robust Node.js backend API for the Weather Application that provides weather data caching, OpenWeather API integration, and comprehensive error handling.

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data caching
- **Mongoose**: MongoDB object modeling for Node.js
- **Axios**: HTTP client for external API calls
- **CORS**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management

## 🌐 OpenWeather API Integration

This backend integrates with the **OpenWeather API** to provide:

- **Current Weather Data**: Real-time weather information for any city
- **5-Day Forecast**: Extended weather predictions
- **Weather Icons**: Official weather condition icons
- **Global Coverage**: Weather data for cities worldwide

### API Key Configuration
The OpenWeather API key is currently hardcoded in the controller:
```javascript
const OPENWEATHER_API_KEY = 'c08c810ff1aab8baadad42428c7952d8';
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager
- Git

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd weather-app/backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URL=mongodb://localhost:27017/weather-app
   NODE_ENV=development
   PORT=8080
   OPENWEATHER_API_KEY = c08c810ff1aab8baadad42428c7952d8
   ```
   
   **MongoDB Options**:
   - **Local MongoDB**: `mongodb://localhost:27017/weather-app`
   - **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/weather-app`

4. **Start MongoDB**
   
   **Local MongoDB**:
   ```bash
   mongod
   ```
   
   **MongoDB Atlas**: No local installation needed, just update the connection string.

5. **Start the Server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

6. **Verify Installation**
   - Server runs on `http://localhost:8080`
   - Health check: `http://localhost:8080/api/health`

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection configuration
├── controllers/
│   └── weatherController.js # Weather API logic and caching
├── models/
│   └── Weather.js         # MongoDB schema definition
├── routes/
│   └── weatherRoutes.js   # API route definitions
├── package.json           # Dependencies and scripts
├── server.js              # Express server setup
└── README.md             # This file
```

## 🔧 API Endpoints

### GET `/api/weather/:city`
Fetches weather data for a specific city with intelligent caching.

**Parameters:**
- `city` (string): Name of the city to search for

**Response:**
```json
{
  "city": "london",
  "temperature": 15,
  "condition": "partly cloudy",
  "icon": "02d",
  "humidity": 65,
  "windSpeed": 3.2,
  "pressure": 1013,
  "visibility": 10000,
  "forecast": [
    {
      "dayName": "Mon",
      "date": "2023-12-07T00:00:00.000Z",
      "minTemp": 12,
      "maxTemp": 18,
      "condition": "partly cloudy",
      "icon": "02d"
    }
  ],
  "timestamp": "2023-12-07T10:30:00.000Z",
  "cached": false
}
```

**Error Responses:**
- `400`: Invalid city name
- `404`: City not found
- `500`: Server error
- `503`: Service unavailable

### GET `/api/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "OK",
  "message": "Weather API is running"
}
```

## 🗄️ Database Schema

### Weather Collection
```javascript
{
  city: String,           // City name (lowercase, required)
  temperature: Number,    // Temperature in Celsius
  condition: String,      // Weather condition description
  icon: String,          // Weather icon code
  humidity: Number,      // Humidity percentage
  windSpeed: Number,     // Wind speed in m/s
  pressure: Number,      // Atmospheric pressure in hPa
  visibility: Number,    // Visibility in meters
  forecast: [{           // 5-day forecast array
    dayName: String,     // Day abbreviation (Mon, Tue, etc.)
    date: Date,          // Full date object
    minTemp: Number,     // Minimum temperature
    maxTemp: Number,     // Maximum temperature
    condition: String,   // Weather condition
    icon: String        // Weather icon code
  }],
  timestamp: Date        // Creation timestamp (TTL: 10 minutes)
}
```

## ⚡ Caching Strategy

- **Cache Duration**: 10 minutes
- **TTL Index**: Automatic cleanup of expired records
- **Cache Key**: City name (lowercase)
- **Fallback**: Always falls back to OpenWeather API if cache miss
- **Performance**: Reduces API calls by ~50% for repeat searches

## 🔧 Development Scripts

- `npm start`: Start the production server

## 🌐 External API Integration

### OpenWeather API Endpoints Used

1. **Current Weather**:
   ```
   GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric
   ```

2. **5-Day Forecast**:
   ```
   GET https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={key}&units=metric
   ```

## 🔒 Security Features

- **CORS Configuration**: Properly configured for frontend communication
- **Input Validation**: City name validation and sanitization
- **Error Handling**: Secure error responses without sensitive information
- **Environment Variables**: Sensitive configuration externalized


## 🔗 Frontend Integration

This backend is designed to work with the Weather App Frontend:
- Provides RESTful API endpoints
- Handles CORS for frontend communication
- Returns structured JSON responses
- Includes comprehensive error handling
---

**Built with ❤️ using Node.js and modern backend technologies**
