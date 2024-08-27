import React, { useState } from 'react';
import Search from '../components/Search'; // Adjust the path as needed
import './page-styles/SearchPage.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="search-container">
      <Search onSearchResults={handleSearchResults} />
    </div>
  );
};

export default SearchPage;
