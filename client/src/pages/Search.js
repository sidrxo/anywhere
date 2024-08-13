import React, { useState } from 'react';
import axios from 'axios';
import './Search.css'; // Create CSS file for styling

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!query) {
      setError('Please enter a search query.');
      return;
    }

    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/search', {
        params: { q: query },
      });
      setResults(response.data);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to fetch search results.');
    }
  };

  return (
    <div className="search-page">
      <h2>Search Images</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="search-results">
        {results.map((image) => (
          <div key={image._id} className="image-card">
            <img src={image.url} alt={image.description || 'User Upload'} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
