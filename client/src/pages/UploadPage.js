import React, { useState } from 'react';
import axios from 'axios';
import { useDarkMode } from '../context/DarkModeContext'; // Import dark mode context
import './page-styles/UploadPage.css';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('description', description);
  
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Ensure cookies are sent with the request
      });
      setMessage('File uploaded successfully!');
      setSelectedFile(null);
      setDescription('');
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file.');
    }
  };

  return (
    <div className={`upload-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <h3>Upload Page</h3>
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
          className="description-input"
        />
        <button type="submit" className="upload-button">Upload</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default UploadPage;
