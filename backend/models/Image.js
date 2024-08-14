// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: String,
  keywords: [String], // Array of keywords
  uploadDate: { type: Date, default: Date.now } // Automatically set to the current date
});

module.exports = mongoose.model('Image', imageSchema);
