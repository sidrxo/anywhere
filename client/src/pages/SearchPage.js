import React, { useState } from 'react';
import Search from '../components/Search'; // Adjust the path as needed
import { useDarkMode } from '../context/DarkModeContext'; // Import the dark mode context
import './page-styles/SearchPage.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className={`search-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Search onSearchResults={handleSearchResults} />
      <div className="gradient-fade"></div>
    </div>
  );
};

export default SearchPage;
