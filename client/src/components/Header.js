// src/components/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './component-styles/Header.css';

const Header = ({ onEditClick }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Determine the current path to highlight the active link
  const getLinkClass = (path) => (location.pathname === path ? 'active-link' : '');

  return (
    <>
      {/* Main Header */}
      <header className={isLoginPage ? 'header-black' : ''}>
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
            <Link to="/profile" className={getLinkClass('/profile')}>profile</Link>
          </nav>
        </div>
      </header>

      {/* Mobile Footer Header */}
      <div className={isLoginPage ? 'mobile-header header-black' : 'mobile-header'}>
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
