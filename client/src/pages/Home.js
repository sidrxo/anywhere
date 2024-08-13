import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageBoard from '../components/ImageBoard';
import './Home.css';

const Home = ({ numColumns, imagePadding }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/images');
        const images = response.data;
        setImages(shuffleArray(images));
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
    <div className="home">
      <div className="mypins-container">
        <ImageBoard images={images} numColumns={numColumns} imagePadding={imagePadding} />
      </div>
    </div>
  );
};

export default Home;
