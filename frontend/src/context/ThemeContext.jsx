import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/themes`
        );
        setTheme(response.data.theme);
        applyTheme(response.data.theme);
      } catch (error) {
        console.error('Error fetching theme:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, []);

  const applyTheme = (themeData) => {
    if (!themeData || !themeData.colors) return;

    const root = document.documentElement;

    Object.keys(themeData.colors).forEach((key) => {
      root.style.setProperty(`--color-${key}`, themeData.colors[key]);
    });

    if (themeData.backgroundImage?.url) {
      document.body.style.backgroundImage = `url('${themeData.backgroundImage.url}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};