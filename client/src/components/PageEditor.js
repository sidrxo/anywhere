import React, { useEffect } from 'react';
import './PageEditor.css';

const PageEditor = ({ isVisible, onClose, numColumns, setNumColumns }) => {
  const handleColumnsChange = (event) => {
    setNumColumns(event.target.value);
  };


  // Event listener to handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]); // Dependency array includes onClose to ensure it is properly referenced

  return (
    <div className={`page-editor ${isVisible ? 'open' : ''}`}>
      <button className="close" onClick={onClose}></button>
      <div className="editor-section">
        <h2>Columns</h2>
        <input
          type="range"
          min="3"
          max="10"
          value={numColumns}
          onChange={handleColumnsChange}
        />
      </div>
    </div>
  );
};

export default PageEditor;
