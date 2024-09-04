import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './component-styles/HomeBoard.css';
import ImageViewer from './ImageViewer';

const HomeBoard = ({ numColumns }) => {
  const [images, setImages] = useState([]);
  const [selectedIdentifier, setSelectedIdentifier] = useState(null);

  useEffect(() => {
    const fetchDailyImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/daily-images`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching daily images:', error);
      }
    };

    fetchDailyImages();

    // Refresh the images daily
    const refreshInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const intervalId = setInterval(fetchDailyImages, refreshInterval);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
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
        <ImageViewer identifier={selectedIdentifier} onClose={closeImageViewer} />
      )}
    </div>
  );
};

export default HomeBoard;
