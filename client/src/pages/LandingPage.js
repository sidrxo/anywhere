// src/pages/LandingPage.js
import React from 'react';
import './page-styles/LandingPage.css'; // Import the CSS file for styling

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="circle2-container">
        <div className="circle9 gradient-circle1"></div>
        <div className="circle9 gradient-circle2"></div>
        <div className="circle2 gradient-circle3"></div>
      </div>
      <div className="slogan-container">
        <h1 className="slogan">
          A new 
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;standard for image sharing
          <br />
          collaboration and discovery.
        </h1>
      </div>
    </div>
  );
};

export default LandingPage;
