import React from 'react';
import './ProgressBar.css'; // Import the CSS file for styling

const ProgressBar = ({ progress }) => {
    return (
        <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
                {progress}%
            </div>
        </div>
    );
};

export default ProgressBar;
