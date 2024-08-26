import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar.js'; // Import the ProgressBar component
import './page-styles/UploadPage.css'; // Import your CSS file

const UploadPage = () => {
    const [progress, setProgress] = useState(0); // State for the progress bar
    const [uploading, setUploading] = useState(false); // State to track uploading status

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        // Simulate file upload with a timeout
        const simulateUpload = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress === 100) {
                    clearInterval(simulateUpload);
                    setUploading(false);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 300); // Update progress every 300ms
    };

    return (
        <div className="upload-page">
            <h1>Upload Your Files</h1>
            <div className="upload-form">
                <input type="file" className="file-input" onChange={handleFileChange} />
                {uploading && <ProgressBar progress={progress} />}
                <button className="upload-button" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <div className="message">
                    {uploading ? 'Please wait while your file is being uploaded.' : 'Select a file to upload.'}
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
