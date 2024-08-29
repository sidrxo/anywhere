// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    googleId: { type: String },
    email: { type: String, unique: true, sparse: true }, // Sparse ensures that only users with emails must be unique
    name: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    uuid: { type: String, unique: true },
    password: { type: String }, // Hashed password for email users
});

// Method to hash password before saving a user
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Method to check if entered password matches the hashed password
userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
