const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  profilePicture: String,
  uniqueId: String, // Add uniqueId field
});

module.exports = mongoose.model('User', userSchema);
