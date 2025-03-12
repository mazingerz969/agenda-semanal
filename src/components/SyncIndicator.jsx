import React, { useState, useEffect } from 'react';
import { syncService } from '../services/syncService';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

const SyncIndicator = () => {
  const [syncStatus, setSyncStatus] = useState(syncService.syncStatus);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Escuchar cambios en el estado de sincronización
    const unsubscribe = syncService.onSyncStatusChanged(status => {
      setSyncStatus(status);
    });
    
    // Escuchar cambios en el estado de la conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Determinar el icono y el mensaje según el estado
  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff size={16} className="text-yellow-500" />,
        text: 'Modo offline',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-800 dark:text-yellow-300'
      };
    }
    
    switch (syncStatus.status) {
      case 'synced':
        return {
          icon: <Wifi size={16} className="text-green-500" />,
          text: 'Sincronizado',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          textColor: 'text-green-800 dark:text-green-300'
        };
      case 'syncing':
        return {
          icon: <RefreshCw size={16} className="text-blue-500 animate-spin" />,
          text: 'Sincronizando...',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          textColor: 'text-blue-800 dark:text-blue-300'
        };
      case 'error':
        return {
          icon: <AlertTriangle size={16} className="text-red-500" />,
          text: 'Error de sincronización',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          textColor: 'text-red-800 dark:text-red-300'
        };
      case 'connected':
        return {
          icon: <Wifi size={16} className="text-indigo-500" />,
          text: 'Conectado',
          bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
          textColor: 'text-indigo-800 dark:text-indigo-300'
        };
      default:
        return {
          icon: <WifiOff size={16} className="text-gray-500" />,
          text: 'Desconectado',
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          textColor: 'text-gray-800 dark:text-gray-300'
        };
    }
  };
  
  const { icon, text, bgColor, textColor } = getStatusInfo();
  
  return (
    <div className={`flex items-center px-2 py-1 rounded-full text-xs ${bgColor} ${textColor}`}>
      {icon}
      <span className="ml-1">{text}</span>
    </div>
  );
};

export default SyncIndicator; 
