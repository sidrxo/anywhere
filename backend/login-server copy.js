const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const PORT = 7000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define the User model
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  picture: String,
});

const User = mongoose.model('User', userSchema);

// Endpoint to handle user data
app.post('/users', async (req, res) => {
  const { googleId, name, email, picture } = req.body;

  try {
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({ googleId, name, email, picture });
      await user.save();
    }

    res.status(200).json({ message: 'User data stored successfully' });
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/users/:googleId', async (req, res) => {
  const { googleId } = req.params;

  try {
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user from database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => console.log('Server running on port ${PORT}'));