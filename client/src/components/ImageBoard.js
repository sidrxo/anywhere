import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ImageBoard.css';

const ImageBoard = ({ numColumns, imagePadding }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/images');
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
      className="image-board"
      style={{ '--num-columns': numColumns }}
    >
      {images.map((image) => (
        <div key={image.identifier} className="image-card">
          <Link to={`/image/${image.identifier}`}>
            <img src={image.url} alt="User Upload" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ImageBoard;
