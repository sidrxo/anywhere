import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import HomeBoard from '../components/HomeBoard';
import { useDarkMode } from '../context/DarkModeContext'; // Import dark mode context

import './page-styles/Home.css';

axios.defaults.baseURL = 'http://localhost:5000'; // Your API base URL
axios.defaults.withCredentials = true; // Ensure cookies are included in requests

const Home = ({ numColumns }) => {
  const { isDarkMode } = useDarkMode(); // Use dark mode context
  const [images, setImages] = useState([]);
  const [hideHeader, setHideHeader] = useState(false); // Track if header should be hidden
  const pinsRef = useRef(null); // Reference to the mypins-container

  const scrollThreshold = 10; // Threshold to start hiding the header

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/images');
        const images = response.data;
        setImages(images);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = pinsRef.current.scrollTop;
      const header = document.querySelector('header');

      // Only hide header after scrolling down past the scrollThreshold
      if (currentScrollTop > scrollThreshold) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }

      // Apply the transform based on hideHeader state
      header.style.transform = hideHeader ? `translateY(-100%)` : `translateY(0)`;
    };

    const pinsElement = pinsRef.current;

    // Add scroll event listeners
    pinsElement.addEventListener('scroll', handleScroll);

    return () => {
      // Clean up event listeners
      pinsElement.removeEventListener('scroll', handleScroll);
    };
  }, [hideHeader]);

  return (
    <div className={`home ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="home-container" ref={pinsRef}>
        <HomeBoard images={images} numColumns={numColumns} />
      </div>
      <div className="gradient-fade"></div>
    </div>
  );
};

export default Home;
