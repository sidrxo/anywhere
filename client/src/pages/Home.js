import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ImageBoard from '../components/ImageBoard';
import './Home.css';

const Home = ({ numColumns }) => {
  const [images, setImages] = useState([]);
  const pinsRef = useRef(null); // Reference to the mypins-container

  const scrollThreshold = 40; // Number of pixels before the header starts moving

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/images`);
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = Math.max(pinsRef.current.scrollTop);
      const header = document.querySelector('header');

      // Apply the threshold before moving the header
      if (scrollTop > scrollThreshold) {
        header.style.transform = `translateY(-${scrollTop - scrollThreshold}px)`;
      } else {
        header.style.transform = 'translateY(0)'; // Keep the header in place until threshold is reached
      }
    };

    const pinsElement = pinsRef.current;

    // Add scroll event listeners
    pinsElement.addEventListener('scroll', handleScroll);

    return () => {
      // Clean up event listeners
      pinsElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="home">
      <div className="mypins-container" ref={pinsRef}>
        <ImageBoard images={images} numColumns={numColumns} />
      </div>
      <div className="gradient-fade"></div>
    </div>
  );
};

export default Home;
