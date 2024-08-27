import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './component-styles/UploadsBoard.css';

const HomeBoard = ({ numColumns}) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/imageuuid`);
        const fetchedImages = response.data;
        setImages((fetchedImages));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);


  return (
    <div
      className="uploads-board"
      style={{ '--num-columns': numColumns }}
    >
      {images.map((image) => (
        <div key={image.identifier} className="uploads-card">
          <Link to={`/image/${image.identifier}`}>
            <img src={image.url} alt="User Upload" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default HomeBoard;