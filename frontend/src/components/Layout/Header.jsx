import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar productos..."
            className="search-input"
          />
        </div>
      </div>
    </header>
  );
};

export default Header; 