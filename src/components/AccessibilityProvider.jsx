import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear contexto para la accesibilidad
const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  // Estados para diferentes configuraciones de accesibilidad
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  
  // Cargar preferencias guardadas
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setHighContrast(settings.highContrast || false);
        setLargeText(settings.largeText || false);
        setReducedMotion(settings.reducedMotion || false);
        setScreenReaderMode(settings.screenReaderMode || false);
      }
      
      // Detectar preferencias del sistema
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setReducedMotion(true);
      }
    } catch (error) {
      console.error('Error al cargar configuraciones de accesibilidad:', error);
    }
  }, []);
  
  // Guardar cambios en las preferencias
  useEffect(() => {
    try {
      const settings = {
        highContrast,
        largeText,
        reducedMotion,
        screenReaderMode
      };
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
      
      // Aplicar clases al documento
      const htmlElement = document.documentElement;
      
      if (highContrast) {
        htmlElement.classList.add('high-contrast');
      } else {
        htmlElement.classList.remove('high-contrast');
      }
      
      if (largeText) {
        htmlElement.classList.add('large-text');
      } else {
        htmlElement.classList.remove('large-text');
      }
      
      if (reducedMotion) {
        htmlElement.classList.add('reduced-motion');
      } else {
        htmlElement.classList.remove('reduced-motion');
      }
      
      if (screenReaderMode) {
        htmlElement.classList.add('screen-reader');
      } else {
        htmlElement.classList.remove('screen-reader');
      }
    } catch (error) {
      console.error('Error al guardar configuraciones de accesibilidad:', error);
    }
  }, [highContrast, largeText, reducedMotion, screenReaderMode]);
  
  // Valores y funciones a exponer en el contexto
  const value = {
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    reducedMotion,
    setReducedMotion,
    screenReaderMode,
    setScreenReaderMode
  };
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 