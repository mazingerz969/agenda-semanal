import React, { useEffect } from 'react';

const AnalyticsTracker = () => {
  useEffect(() => {
    // Usar window.location en lugar de useLocation
    const pathname = window.location.pathname;
    
    // Tu código de analítica
    console.log(`Página visitada: ${pathname}`);
    
    // Opcional: Configurar un listener para cambios de URL
    const handleLocationChange = () => {
      const newPathname = window.location.pathname;
      console.log(`Página visitada: ${newPathname}`);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return null; // Este componente no renderiza nada
};

export default AnalyticsTracker; 
