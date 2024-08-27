// src/components/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import the js-cookie library
import './component-styles/Header.css';

const Header = ({ onEditClick }) => {
  const location = useLocation();
  const userUUID = Cookies.get('user_uuid'); // Get the user_uuid cookie

  // Determine if the current path matches either /login or /profile
  const getLinkClass = (path1, path2) => 
    (location.pathname === path1 || location.pathname === path2) ? 'active-link' : '';

  return (
    <>
      {/* Main Header */}
      <header>
        <div className="header-section" id="section1">
          <div className="logo-container">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
          </div>
          <h1>chroma.</h1>
        </div>
        <div className="header-section" id="section2">
          <nav>
            <Link to="/home" className={getLinkClass('/home')}>home</Link>
            <Link to="/chroma" className={getLinkClass('/chroma')}>bar</Link>
            <Link to="/search" className={getLinkClass('/search')}>search</Link>
          </nav>
        </div>
        <div className="header-section" id="section3">
          <nav>
            <a href="#edit" onClick={(e) => { e.preventDefault(); onEditClick(); }}>edit</a>
            <Link to="/upload" className={getLinkClass('/upload')}>add</Link>
            {/* Conditionally render "Login" or "Profile" based on the presence of user_uuid */}
            <Link to={userUUID ? "/profile" : "/login"} className={getLinkClass('/login', '/profile')}>
              {userUUID ? "profile" : "login"}
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Footer Header */}
      <div className="mobile-header">
        <nav>
          <Link to="/home" className={getLinkClass('/home')}>home</Link>
          <Link to="/search" className={getLinkClass('/search')}>search</Link>
          <Link to="/myuploadspage" className={getLinkClass('/myuploadspage')}>my pins</Link>
          <Link to="/upload" className={getLinkClass('/upload')}>add</Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
