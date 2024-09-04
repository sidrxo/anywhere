const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

require('dotenv').config();

app.use(express.json()); // Middleware to parse JSON bodies

const allowedOrigins = [
  'http://localhost:5001', // Add your local development origin
  'https://anywhere-1-1ud7.onrender.com', // Add your production origin
  'https://chroma.bar', // Add your production origin
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 1. Cookie Parser Middleware
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {

});

// 2. Session Middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
  }
}));

// 3. Passport Initialization Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:5050/api/auth/google/callback'
    : 'https://server.chroma.bar/api/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    } else {
      const newUser = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        uuid: uuid.v4(),
      });
      await newUser.save();
      return done(null, newUser);
    }
  } catch (err) {
    console.error('Error in Google Strategy:', err);
    done(err);
  }
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  if (user && user.uuid) {
    done(null, user.uuid);
  } else {
    done(new Error('User or UUID not found'));
  }
});

passport.deserializeUser(async (uuid, done) => {
  try {
    const user = await User.findOne({ uuid });
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  } catch (err) {
    done(err);
  }
});

// 4. Routes
// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.cookie('user_uuid', req.user.uuid, {
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });
    res.redirect(`${process.env.FRONTEND_URL}/profile`);
  }
);

// Logout Route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie('user_uuid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Route to Get User Data
app.get('/user', async (req, res) => {
  const userUuid = req.cookies['user_uuid'];

  if (!userUuid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findOne({ uuid: userUuid });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Something went wrong!');
});

// Email Check Route
app.post('/auth/check-email', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sign-Up Route
app.post('/auth/sign-up', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      console.log('Sign-Up Request Data:', { name, email, password }); // Log input data

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'Email is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword); // Log hashed password

      const newUser = new User({
          name,
          email,
          password: hashedPassword,
          uuid: uuid.v4()
      });

      console.log('New User Object:', newUser); // Log new user object

      await newUser.save();

      // Set user_uuid cookie
      res.cookie('user_uuid', newUser.uuid, {
        sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000
      });

      res.status(201).json({ message: 'Sign-up successful' });
  } catch (error) {
      console.error('Error during sign-up:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Login Route
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
      console.log('Login Request Data:', { email, password }); // Log input data

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }

      console.log('User From Database:', user); // Log user data from MongoDB

      // Compare the plaintext password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password Comparison Result:', isMatch); // Log result of password comparison

      if (!isMatch) {
          return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Set user_uuid cookie if login is successful
      res.cookie('user_uuid', user.uuid, {
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000
      });

      res.json({ message: 'Login successful' });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



const PORT = 7001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
