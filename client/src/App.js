import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ImageViewer from './components/ImageViewer';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';
import PageEditor from './components/PageEditor';
import Home from './pages/Home'; // Import Home page
import AdminMainPage from './pages/AdminMainPage';
import AdminUploadPage from './pages/AdminUploadPage';
import AdminDeletePage from './pages/AdminDeletePage';
import './App.css';
import MyUploadsPage from './pages/MyUploadsPage';
import LoginPage from './pages/LoginPage';
import Profile from './components/Profile.js';
import LandingPage from './pages/LandingPage.js';




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
            <Route path="/myuploadspage" element={<MyUploadsPage />} />
            <Route path="/image/:identifier" element={<ImageViewer />} />
            <Route path="/admin" element={<AdminMainPage />} />
            <Route path="/admin/upload" element={<AdminUploadPage />} />
            <Route path="/admin/delete" element={<AdminDeletePage />} />       
            <Route path="login" element={<LoginPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="landing" element={<LandingPage />} />       
           </Routes>
      </div>
    </Router>
  );
}

export default App;
