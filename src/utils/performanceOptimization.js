// Utilidades para optimizar el rendimiento

// Función para detectar si el dispositivo es de gama baja
export const isLowEndDevice = () => {
  // Verificar memoria RAM disponible (si está disponible)
  if (navigator.deviceMemory) {
    return navigator.deviceMemory < 4; // Menos de 4GB de RAM
  }
  
  // Verificar número de núcleos lógicos
  if (navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency < 4; // Menos de 4 núcleos
  }
  
  // Si no podemos detectar, asumimos que no es de gama baja
  return false;
};

// Función para limitar la frecuencia de ejecución de una función
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Función para retrasar la ejecución de una función hasta que pase un tiempo sin llamadas
export const debounce = (func, delay) => {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

// Función para virtualizar listas largas
export const virtualizeList = (items, visibleItemsCount, startIndex) => {
  // Determinar el rango de elementos a renderizar
  const endIndex = Math.min(startIndex + visibleItemsCount, items.length);
  
  // Devolver solo los elementos visibles
  return items.slice(startIndex, endIndex);
};

// Función para cargar imágenes de forma progresiva
export const loadImageProgressively = (url, lowQualityUrl, callback) => {
  // Primero cargamos la imagen de baja calidad
  const lowQualityImage = new Image();
  lowQualityImage.src = lowQualityUrl;
  lowQualityImage.onload = () => {
    callback(lowQualityUrl, false);
    
    // Luego cargamos la imagen de alta calidad
    const highQualityImage = new Image();
    highQualityImage.src = url;
    highQualityImage.onload = () => {
      callback(url, true);
    };
  };
};

// Función para determinar si se debe usar modo ligero
export const shouldUseLightMode = () => {
  return isLowEndDevice() || 
         navigator.connection?.saveData === true || 
         navigator.connection?.effectiveType === 'slow-2g' || 
         navigator.connection?.effectiveType === '2g';
};

// Función para dividir tareas pesadas en fragmentos más pequeños
export const executeInChunks = (items, process, chunkSize = 5, delay = 16) => {
  if (items.length === 0) return Promise.resolve();
  
  return new Promise(resolve => {
    let i = 0;
    
    function doChunk() {
      const chunk = items.slice(i, i + chunkSize);
      i += chunkSize;
      
      // Procesar el fragmento actual
      chunk.forEach(process);
      
      // Si hay más elementos, programar el siguiente fragmento
      if (i < items.length) {
        setTimeout(doChunk, delay);
      } else {
        resolve();
      }
    }
    
    doChunk();
  });
}; 