import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './component-styles/UploadsBoard.css';
import ImageViewer from './ImageViewer';

const UploadsBoard = ({ numColumns }) => {
  const [images, setImages] = useState([]);
  const [selectedIdentifier, setSelectedIdentifier] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/imageuuid`);
        const fetchedImages = response.data;
        setImages(fetchedImages);
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
    <div className="uploads-board" style={{ '--num-columns': numColumns }}>
      {images.map((image) => (
        <div
          key={image.identifier}
          className="uploads-card"
          onClick={() => handleImageClick(image.identifier)}
        >
          <img src={image.url} alt="User Upload" />
        </div>
      ))}
      {selectedIdentifier && (
        <ImageViewer identifier={selectedIdentifier} onClose={closeImageViewer} />
      )}
    </div>
  );
};

export default UploadsBoard;
