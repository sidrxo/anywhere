import React from 'react';
import { Link } from 'react-router-dom';
import './AdminMainPage.css';

const AdminMainPage = () => {
  return (
    <div className="admin-main-page">
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/admin/upload">Upload Images</Link></li>
          <li><Link to="/admin/delete">Delete Images</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminMainPage;
