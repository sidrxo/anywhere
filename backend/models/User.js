// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    googleId: { type: String },
    email: { type: String, unique: true, sparse: true }, // Sparse ensures that only users with emails must be unique
    name: { type: String },
    uuid: { type: String, unique: true },
    password: { type: String }, // Hashed password for email users
});



module.exports = mongoose.model('User', userSchema);
