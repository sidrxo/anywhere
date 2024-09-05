import React, { useEffect, useRef, useState } from 'react';
import './component-styles/PageEditor.css';
import { useDarkMode } from '../context/DarkModeContext'; // Import the dark mode context

const PageEditor = ({ isVisible, onClose, setNumColumns }) => {
  const [numColumns, setLocalNumColumns] = useState(6); // Default value
  const editorRef = useRef(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use dark mode context

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
    <>
      {/* Page Editor */}
      <div className={`page-editor ${isVisible ? 'open' : ''} ${isDarkMode ? 'dark-mode' : ''}`} ref={editorRef}>
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

        {/* Dark Mode Toggle Switch */}
        <div className="toggle-switch">
          <label className="switch-label">
            <input
              type="checkbox"
              className="checkbox"
              checked={isDarkMode} // Sync with dark mode state
              onChange={toggleDarkMode} // Toggle dark mode on change
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Overlay (placed after Page Editor to stay beneath it) */}
      {isVisible && <div className="overlay"></div>}
    </>
  );
};

export default PageEditor;
