import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // For cookie handling
import { Link } from 'react-router-dom';
import './component-styles/UploadsBoard.css';

const UploadsBoard = ({ numColumns, imagePadding }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const userUuid = Cookies.get('user_uuid'); // Read the cookie
        if (!userUuid) {
          throw new Error('User UUID not found in cookies');
        }

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/images/user`, {
          params: { user_uuid: userUuid }, // Send the user_uuid as a query parameter
        });

        const fetchedImages = response.data;
        setImages(fetchedImages);  // Set images without shuffling
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setError('Failed to fetch images.');
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

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

export default UploadsBoard;
