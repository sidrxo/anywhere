import React, { useEffect, useRef } from 'react';
import './component-styles/PageEditor.css';

const PageEditor = ({ isVisible, onClose, numColumns, setNumColumns }) => {
  const editorRef = useRef(null);

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
