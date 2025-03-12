/**
 * Utilidades para optimizar el rendimiento de la aplicación
 */

// Función para debounce (retrasar la ejecución de una función)
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Función para throttle (limitar la frecuencia de ejecución)
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Función para memoizar resultados de funciones costosas
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Función para detectar si estamos en un dispositivo móvil
export const isMobileDevice = () => {
  return (
    typeof window !== 'undefined' && 
    (window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  );
};

// Función para optimizar imágenes según el dispositivo
export const getOptimizedImageUrl = (imageUrl, isMobile = false) => {
  if (!imageUrl) return '';
  
  // Si es móvil, cargar una versión más pequeña de la imagen
  if (isMobile) {
    return imageUrl.replace(/\.(jpg|png|webp)/, '-mobile.$1');
  }
  
  return imageUrl;
};

// Función para cargar recursos de manera progresiva
export const progressiveLoad = (callback, delay = 100) => {
  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete') {
      setTimeout(callback, delay);
    } else {
      window.addEventListener('load', () => setTimeout(callback, delay));
    }
  }
};

// Añade esta función para medir el rendimiento
export const measurePerformance = (label) => {
  if (typeof performance !== 'undefined') {
    const now = performance.now();
    console.log(`⏱️ ${label}: ${now.toFixed(2)}ms`);
    return now;
  }
  return 0;
}; 
