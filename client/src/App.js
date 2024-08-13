import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ImageViewer from './components/ImageViewer';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/Search';
import ProfilePage from './pages/Profile';
import PageEditor from './components/PageEditor';
import MyPins from './pages/MyPins';
import Home from './pages/Home'; // Import Home page
import AdminMainPage from './pages/AdminMainPage';
import AdminUploadPage from './pages/AdminUploadPage';
import AdminDeletePage from './pages/AdminDeletePage';

import './App.css';

function App() {
  const [isEditorVisible, setEditorVisible] = useState(false);
  const [numColumns, setNumColumns] = useState(6); // Default number of columns

  const handleEditClick = () => {
    setEditorVisible(true);
  };

  const handleCloseEditor = () => {
    setEditorVisible(false);
  };

  // Inline styles to set CSS variables
  const style = {
    '--num-columns': numColumns,
  };

  return (
    <Router>
      <div className="app" style={style}>
        <Header onEditClick={handleEditClick} />
        <PageEditor
          isVisible={isEditorVisible}
          onClose={handleCloseEditor}
          numColumns={numColumns}
          setNumColumns={setNumColumns}
        />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/mypins" element={<MyPins />} />
            <Route path="/image/:identifier" element={<ImageViewer />} />
            <Route path="/admin" element={<AdminMainPage />} />
            <Route path="/admin/upload" element={<AdminUploadPage />} />
            <Route path="/admin/delete" element={<AdminDeletePage />} />       
           </Routes>
      </div>
    </Router>
  );
}

export default App;
