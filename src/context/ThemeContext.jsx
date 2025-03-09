import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const ThemeContext = createContext();

// Hook personalizado para usar el contexto
export const useTheme = () => useContext(ThemeContext);

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  // Obtener el tema del localStorage o usar 'light' como predeterminado
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Actualizar el tema en el DOM y localStorage cuando cambia
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Eliminar clases antiguas
    root.classList.remove('light', 'dark');
    
    // Añadir la clase del tema actual
    root.classList.add(theme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para cambiar entre temas
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Proporcionar el tema y la función para cambiarlo
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 