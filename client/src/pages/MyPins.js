import React from 'react';
import ImageBoard from '../components/ImageBoard';
import './MyPins.css'; // Create this CSS file to handle the layout

const MyPins = ({ numColumns, imagePadding }) => {
  return (
    <div className="mypins-container">
      <ImageBoard numColumns={numColumns} imagePadding={imagePadding} />
    </div>
  );
};

export default MyPins;
