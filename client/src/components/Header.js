import React from 'react';
import { Link } from 'react-router-dom';
import './component-styles/Header.css';

const Header = ({ onEditClick }) => {
  return (
    <>
      {/* Main Header */}
      <header>
        <div className="header-section" id="section1">
          <h1>ANYWH3RE</h1>
        </div>
        <div className="header-section" id="section2">
          <nav>
            <Link to="/home">home</Link> {/* Navigate to Home */}
            <Link to="/search">search</Link>
            <Link to="/myuploadspage">my pins</Link>
          </nav>
        </div>
        <div className="header-section" id="section3">
          <nav>
            <a href="#edit" onClick={(e) => { e.preventDefault(); onEditClick(); }}>edit</a> {/* Link to trigger edit */}
            <Link to="/upload">add</Link> {/* Link to Upload Page */}
            <Link to="/profile">profile</Link>
          </nav>
        </div>
      </header>

      {/* Mobile Footer Header */}
      <div className="mobile-header">
        <nav>
          <Link to="/home">home</Link>
          <Link to="/search">search</Link>
          <Link to="/myuploadspage">my pins</Link>
          <Link to="/upload">add</Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
