import React, { useState } from 'react';
import { hasAccess, showUpgradeMessage } from '../services/subscriptionService';

// Componente que envuelve características premium
const PremiumFeature = ({ featureId, fallback, children }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  
  // Verificar si el usuario tiene acceso a esta característica
  const canAccess = hasAccess(featureId);
  
  if (canAccess) {
    return children;
  }
  
  // Si no tiene acceso, mostrar mensaje de actualización o fallback
  const handleUpgradeClick = () => {
    setShowUpgrade(true);
  };
  
  const handleCloseUpgrade = () => {
    setShowUpgrade(false);
  };
  
  const upgradeInfo = showUpgradeMessage(featureId);
  
  return (
    <>
      {fallback ? (
        <div className="relative">
          {fallback}
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 flex items-center justify-center">
            <button
              onClick={handleUpgradeClick}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Desbloquear
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">
            Característica Premium
          </h3>
          <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
            Esta característica está disponible en el plan Premium.
          </p>
          <button
            onClick={handleUpgradeClick}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Actualizar ahora
          </button>
        </div>
      )}
      
      {showUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {upgradeInfo.title}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {upgradeInfo.message}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleCloseUpgrade}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Más tarde
              </button>
              <a
                href={upgradeInfo.upgradeUrl}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ver planes
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PremiumFeature;
