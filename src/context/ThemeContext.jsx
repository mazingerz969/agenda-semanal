import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
export const ThemeContext = createContext();

// Hook personalizado para usar el contexto
export const useTheme = () => useContext(ThemeContext);

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  // Estado para el modo oscuro
  const [darkMode, setDarkMode] = useState(false);

  // Cargar preferencia del usuario al iniciar
  useEffect(() => {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    
    // Verificar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Establecer el tema inicial
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Función para cambiar el tema
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      
      // Guardar preferencia en localStorage
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      // Aplicar clase al elemento HTML
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      console.log('Modo oscuro:', newMode ? 'activado' : 'desactivado');
      
      return newMode;
    });
  };

  const value = {
    darkMode,
    setDarkMode,
    toggleDarkMode
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 
