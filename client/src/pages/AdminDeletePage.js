import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDeletePage.css';

const AdminDeletePage = () => {
  const [images, setImages] = useState([]);
  const [basket, setBasket] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/images');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error.message);
      }
    };

    fetchImages();
  }, []);

  const handleDeleteClick = (identifier) => {
    setBasket([...basket, identifier]);
  };

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(
        basket.map((identifier) =>
          axios.delete(`http://localhost:5000/image/${identifier}`)
        )
      );
      setMessage('Selected images deleted successfully.');
      setImages(images.filter((image) => !basket.includes(image.identifier)));
      setBasket([]);
    } catch (error) {
      console.error('Error deleting images:', error.message);
      setMessage('Error deleting images');
    }
  };

  const handleRemoveFromBasket = (identifier) => {
    setBasket(basket.filter((id) => id !== identifier));
  };

  const getImageById = (identifier) => {
    return images.find(image => image.identifier === identifier);
  };

  return (
    <div className="admin-delete-page">
      <h1>Delete Images</h1>
      <div className="image-list">
        {images.map((image) => (
          <div key={image.identifier} className="image-item">
            <img src={image.url} alt="Uploaded" />
            <button onClick={() => handleDeleteClick(image.identifier)}>Delete</button>
          </div>
        ))}
      </div>
      {basket.length > 0 && (
        <div className="basket">
          <h2>Deletion Basket</h2>
          <ul>
            {basket.map((identifier) => {
              const image = getImageById(identifier);
              return image ? (
                <li key={identifier}>
                  <img src={image.url} alt={`Thumbnail of ${identifier}`} className="basket-thumbnail" />
                  <span>{identifier}</span>
                  <button onClick={() => handleRemoveFromBasket(identifier)}>Remove</button>
                </li>
              ) : null;
            })}
          </ul>
          <button className="confirm-delete" onClick={handleConfirmDelete}>
            Confirm Deletion of {basket.length} Image(s)
          </button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminDeletePage;
