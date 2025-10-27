const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  temperature: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  windSpeed: {
    type: Number,
    required: true
  },
  pressure: {
    type: Number,
    required: true
  },
  visibility: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 600 // TTL: 10 minutes (600 seconds)
  }
});

// Create TTL index for automatic cleanup
weatherSchema.index({ timestamp: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('Weather', weatherSchema);
