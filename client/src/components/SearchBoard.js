import React from 'react';
import './component-styles/SearchBoard.css'; // Ensure you have this file or adjust the path

const SearchBoard = ({ images = [], numColumns }) => {
  if (!Array.isArray(images)) {
    console.error('Invalid images prop: Expected an array.');
    return null;
  }

  return (
    <div className="search-board" style={{ '--num-columns': numColumns }}>
      {images.length === 0 ? (
        <p>No images found.</p>
      ) : (
        images.map((image) => (
          <div key={image._id} className="search-card">
            <img src={image.url} alt={image.description || 'User Upload'} />
          </div>
        ))
      )}
    </div>
  );
};

export default SearchBoard;
