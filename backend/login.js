const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const app = express();

// Replace these with your actual values from the Google Cloud Console
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

// User database or in-memory store (replace with your own user management system)
const users = [];

// Configure cookie session
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  keys: ['asdfasdf'] // Replace with your own secret key
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js with Google OAuth
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  // Check if user already exists in our database
  const existingUser = users.find(user => user.googleId === profile.id);
  if (existingUser) {
    // User already exists, return user
    return done(null, existingUser);
  }

  // User does not exist, create a new user
  const newUser = {
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value
  };
  users.push(newUser);
  done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.googleId);
});

passport.deserializeUser((id, done) => {
  const user = users.find(user => user.googleId === id);
  done(null, user);
});

// Routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/home'); // Redirect to a profile page or wherever you want
});

app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/api/current_user', (req, res) => {
  res.send(req.user);
  
});

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5000', // or your frontend URL
  credentials: true
}));



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
