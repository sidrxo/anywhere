import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ImageViewer.css';

const ImageViewer = () => {
  const { identifier } = useParams();
  const [image, setImage] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false); // State to manage info panel visibility
  const [menuShifted, setMenuShifted] = useState(false); // State to manage menu shifting

  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/image/${identifier}`);
        setImage(response.data);
      } catch (error) {
        console.error('Error fetching image:', error);
        // Optionally handle the error or redirect
      }
    };

    fetchImage();
  }, [identifier]);

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleInfo = (e) => {
    e.stopPropagation(); // Prevent the overlay from closing
    setInfoVisible(!infoVisible); // Toggle info panel visibility
    setMenuShifted(!menuShifted); // Shift menu when info is toggled
  };

  const handleSave = (e) => {
    e.stopPropagation(); // Prevent the overlay from closing
    // Implement save functionality here
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent the overlay from closing
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    // Add event listener for Escape key
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`image-viewer-overlay ${image ? 'visible' : ''}`} onClick={handleButtonClick}>
      <div className={`image-viewer-menu ${menuShifted ? 'shifted' : ''}`} onClick={handleButtonClick}>
          <button className="image-viewer-save-button" onClick={handleSave}>save</button>
          <button className="image-viewer-info-button" onClick={handleInfo}>info</button>
          <button className="image-viewer-close-button" onClick={handleClose}>close</button>
      </div>
      <div className={`image-viewer-content ${infoVisible ? 'shifted' : ''}`} onClick={(e) => e.stopPropagation()}>
        {image ? (
          <img src={image.url} alt="Enlarged View" />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className={`info-overlay ${infoVisible ? 'visible' : ''}`}>
        <h2>Image Information</h2>
        <p><strong>Identifier:</strong> {identifier}</p>
        <p><strong>URL:</strong> {image?.url}</p>
        <p><strong>Description:</strong> {image?.description || 'No description available'}</p>
        <p><strong>Placeholder Metadata:</strong> Example metadata goes here.</p>
      </div>
    </div>
  );
};

export default ImageViewer;
