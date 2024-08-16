import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './component-styles/Search.css'; // Import the CSS file for Search

const Search = () => {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/images`);
        setImages(response.data);
        setFilteredImages(response.data); // Initially, show all images
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const results = images.filter(image => {
      // Check if the search query matches the description or any of the tags
      const matchesDescription = image.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesDescription || matchesTags;
    });

    setFilteredImages(results);
  }, [searchQuery, images]);

  return (
    <div className="search-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by description or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="search-board">
        {filteredImages.map((image) => (
          <div key={image._id} className="search-card">
            <img src={image.url} alt="User Upload" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
