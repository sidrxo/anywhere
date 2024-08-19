const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure you have a User model defined
const cors = require('cors'); // Import CORS middleware


const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5001', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  credentials: true // Allow cookies to be sent with requests
}));


app.post('/users', async (req, res) => {
  try {
    const { googleId, name, email, profilePicture, uniqueId } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ googleId });
    if (user) {
      // Update user details if already exists
      user.name = name;
      user.email = email;
      user.profilePicture = profilePicture;
      user.uniqueId = uniqueId; // Update uniqueId if necessary
      user = await user.save();
    } else {
      // Create new user if not exists
      user = new User({
        googleId,
        name,
        email,
        profilePicture,
        uniqueId,
      });
      await user.save();
    }
    res.status(200).json({ message: 'User data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving user data' });
  }
});

app.get('/users', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Connect to MongoDB and start server
mongoose.connect('mongodb+srv://sidrxo:Merlin2911@anywhere.omaoaeq.mongodb.net/?retryWrites=true&w=majority&appName=ANYWHERE', {

});

app.listen(7000, () => {
  console.log('Server is running on port 7000');
});
