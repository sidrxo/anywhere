import React, { useState } from 'react';
import axios from 'axios';
import './AdminUploadPage.css';

const AdminUploadPage = () => {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleImageChange = (event) => {
    setImages([...event.target.files]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post('http://localhost:5000/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Images uploaded successfully!');
      console.log('Uploaded images:', response.data);
    } catch (error) {
      console.error('Error uploading images:', error.message);
      setMessage('Error uploading images');
    }
  };

  return (
    <div className="admin-upload-page">
      <h1>Upload Images</h1>
      <div className="upload-section">
        <input type="file" multiple onChange={handleImageChange} />
        <button onClick={handleUpload}>Upload Images</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminUploadPage;
