import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import HomeBoard from '../components/HomeBoard';
import './page-styles/Home.css';

const Home = ({ numColumns }) => {
  const [images, setImages] = useState([]);
  const [prevScrollTop, setPrevScrollTop] = useState(0); // Track previous scroll position
  const [hideHeader, setHideHeader] = useState(false); // Track if header should be hidden
  const pinsRef = useRef(null); // Reference to the mypins-container

  const scrollThreshold = 10; // Threshold to start hiding the header
  const hideThreshold = 0; // Extra threshold for scrolling down

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/images`);
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

      // Only hide header after scrolling down past the hideThreshold
      if (currentScrollTop > prevScrollTop && currentScrollTop > scrollThreshold + hideThreshold) {
        setHideHeader(true);
      } else if (currentScrollTop < prevScrollTop) {
        setHideHeader(false);
      }

      // Apply the transform based on hideHeader state
      header.style.transform = hideHeader ? `translateY(-100%)` : `translateY(0)`;

      setPrevScrollTop(currentScrollTop); // Update previous scroll position
    };

    const pinsElement = pinsRef.current;

    // Add scroll event listeners
    pinsElement.addEventListener('scroll', handleScroll);

    return () => {
      // Clean up event listeners
      pinsElement.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollTop, hideHeader]);

  return (
    <div className="home">
      <div className="home-container" ref={pinsRef}>
        <HomeBoard images={images} numColumns={numColumns} />
      </div>
      <div className="gradient-fade"></div>
    </div>
  );
};

export default Home;
