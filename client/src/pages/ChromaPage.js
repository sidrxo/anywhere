// src/pages/ChromaPage.js
import React from 'react';
import ChromaBar from '../components/ChromaBar.js'; // Import the ChromaBar component
import { useDarkMode } from '../context/DarkModeContext'; // Import the dark mode context
import './page-styles/ChromaPage.css'; // Import any additional CSS if needed

const ChromaPage = () => {
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  return (
    <div className={`chroma-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1>bar is coming soon.</h1>
      <ChromaBar />
    </div>
  );
};

export default ChromaPage;
