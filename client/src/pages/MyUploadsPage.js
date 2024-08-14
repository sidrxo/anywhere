import React from 'react';
import UploadsBoard from '../components/UploadsBoard';
import './page-styles/MyUploadsPage.css'; // Create this CSS file to handle the layout

const MyUploadsPage = ({ numColumns}) => {
  return (
    <div className="uploads-container">
      <UploadsBoard numColumns={numColumns}  />
    </div>
  );
};

export default MyUploadsPage;
