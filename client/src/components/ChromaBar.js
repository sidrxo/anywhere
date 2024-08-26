// src/components/ChromaBar.js
import React from 'react';
import './component-styles/ChromaBar.css'; // Import the CSS file for styling

const ChromaBar = () => {
  return (
    <div className="chroma-bar">
      <div className="line-section red" onClick={() => alert('Red section clicked!')}></div>
      <div className="line-section yellow" onClick={() => alert('Yellow section clicked!')}></div>
      <div className="line-section green" onClick={() => alert('Green section clicked!')}></div>
      <div className="line-section blue" onClick={() => alert('Blue section clicked!')}></div>
    </div>
  );
};

export default ChromaBar;
