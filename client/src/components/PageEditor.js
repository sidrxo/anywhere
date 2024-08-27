import React, { useEffect, useRef, useState } from 'react';
import './component-styles/PageEditor.css';

const PageEditor = ({ isVisible, onClose, setNumColumns }) => {
  const [numColumns, setLocalNumColumns] = useState(6); // Default value

  const editorRef = useRef(null);

  // Effect to initialize numColumns from local storage on load
  useEffect(() => {
    const savedColumns = localStorage.getItem('numColumns');
    if (savedColumns) {
      setLocalNumColumns(Number(savedColumns));
      setNumColumns(Number(savedColumns)); // Ensure parent state is also updated
    }
  }, [setNumColumns]);

  const handleColumnsChange = (event) => {
    const newNumColumns = Number(event.target.value);
    setLocalNumColumns(newNumColumns);
    setNumColumns(newNumColumns); // Update parent state
    localStorage.setItem('numColumns', newNumColumns); // Store in local storage
  };

  // Event listener to handle ESC key press and click outside
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={`page-editor ${isVisible ? 'open' : ''}`} ref={editorRef}>
      <button className="close" onClick={onClose}>×</button>
      <div className="editor-section">
        <h2>size</h2>
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
