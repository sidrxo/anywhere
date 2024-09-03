import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './component-styles/HomeBoard.css';
import ImageViewer from './ImageViewer'; // Import ImageViewer

const HomeBoard = ({ numColumns }) => {
  const [images, setImages] = useState([]); // Define the images state
  const [selectedIdentifier, setSelectedIdentifier] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/images`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (identifier) => {
    setSelectedIdentifier(identifier);
  };

  const closeImageViewer = () => {
    setSelectedIdentifier(null);
  };

  return (
    <div className="home-board" style={{ '--num-columns': numColumns }}>
      {images.map((image) => (
        <div key={image.identifier} className="home-card" onClick={() => handleImageClick(image.identifier)}>
          <img src={image.url} alt="User Upload" />
        </div>
      ))}
      {selectedIdentifier && (
        <ImageViewer identifier={selectedIdentifier} onClose={closeImageViewer} /> // Pass the identifier and close function
      )}
    </div>
  );
};

export default HomeBoard;
