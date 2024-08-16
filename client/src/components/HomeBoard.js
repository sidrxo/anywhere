import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './component-styles/HomeBoard.css';

const HomeBoard = ({ numColumns}) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/images`);
        const fetchedImages = response.data;
        setImages(shuffleArray(fetchedImages));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  // Function to shuffle the images array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  return (
    <div
      className="home-board"
      style={{ '--num-columns': numColumns }}
    >
      {images.map((image) => (
        <div key={image.identifier} className="home-card">
          <Link to={`/image/${image.identifier}`}>
            <img src={image.url} alt="User Upload" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default HomeBoard;