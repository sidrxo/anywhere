import React, { useState } from 'react';
import Search from '../components/Search'; // Adjust the path as needed
import SearchBoard from '../components/SearchBoard'; // Adjust the path as needed
import './page-styles/SearchPage.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="search-page-container">
      <Search onSearchResults={handleSearchResults} />
      <SearchBoard images={searchResults} numColumns={4} /> {/* Adjust numColumns as needed */}
    </div>
  );
};

export default SearchPage;
