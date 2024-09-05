import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './component-styles/ImageViewer.css';

const ImageViewer = ({ identifier, onClose }) => {
  const [image, setImage] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [menuShifted, setMenuShifted] = useState(false);
  const [error, setError] = useState(null);

  const { identifier: urlIdentifier } = useParams();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/image/${identifier}`);
        setImage(response.data);
        setError(null);
        // Update the URL in the address bar
        window.history.pushState(null, '', `/image/${identifier}`);
      } catch (error) {
        console.error('Error fetching image:', error);
        setError('Image not found.');
      }
    };

    if (identifier) {
      fetchImage();
    }

    // Cleanup function to reset the URL when the component unmounts
    return () => {
      window.history.pushState(null, '', '/');
    };
  }, [identifier]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleClose = () => {
    onClose();
  };

  const handleInfo = (e) => {
    e.stopPropagation();
    setInfoVisible(!infoVisible);
    setMenuShifted(!menuShifted);
  };

  const handleSave = (e) => {
    e.stopPropagation();
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

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
      {image && (
        <div className={`info-overlay ${infoVisible ? 'visible' : ''}`}>
          <h2>Image Information</h2>
          <p><strong>Identifier:</strong> {identifier}</p>
          <p><strong>URL:</strong> {image.url}</p>
          <p><strong>Description:</strong> {image.description || 'No description available'}</p>
          <p><strong>Upload Date:</strong> {image.uploadDate ? new Date(image.uploadDate).toLocaleDateString() : 'No date available'}</p>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
