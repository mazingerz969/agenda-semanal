import React, { useState, useEffect } from 'react';
import { isMobileDevice, getOptimizedImageUrl } from '../utils/performanceOptimizer';

const OptimizedImage = ({ src, alt, className, width, height, lazy = true }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Determinar si estamos en móvil
  const isMobile = isMobileDevice();
  
  // Obtener URL optimizada
  const optimizedSrc = getOptimizedImageUrl(src, isMobile);
  
  // Manejar carga de imagen
  const handleLoad = () => {
    setLoaded(true);
  };
  
  // Manejar error de carga
  const handleError = () => {
    setError(true);
    console.warn(`Error loading image: ${src}`);
  };
  
  // Efecto para precargar la imagen
  useEffect(() => {
    const img = new Image();
    img.src = optimizedSrc;
    img.onload = handleLoad;
    img.onerror = handleError;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [optimizedSrc]);
  
  if (error) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 dark:text-gray-500 text-sm">Error al cargar imagen</span>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {!loaded && (
        <div 
          className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading={lazy ? "lazy" : "eager"}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default React.memo(OptimizedImage); 
