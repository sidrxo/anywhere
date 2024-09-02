import React, { createContext, useState, useEffect } from 'react';

// Create a Context for Dark Mode
const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
  // Initialize dark mode from local storage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Toggle dark mode and save preference to local storage
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  // Save dark mode preference on mount
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

const useDarkMode = () => React.useContext(DarkModeContext);

export { DarkModeProvider, useDarkMode };
