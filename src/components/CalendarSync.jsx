import React, { useState, useEffect } from 'react';
import { connectToGoogleCalendar, connectToOutlookCalendar, importEvents, exportEvents } from '../services/calendarService';

const CalendarSync = ({ tasks, onImportTasks }) => {
  const [connectedServices, setConnectedServices] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const handleConnectGoogle = async () => {
    try {
      const connected = await connectToGoogleCalendar();
      if (connected) {
        setConnectedServices(prev => [...prev, 'google']);
        setSyncStatus('Conectado a Google Calendar exitosamente');
      }
    } catch (error) {
      setSyncStatus(`Error al conectar con Google Calendar: ${error.message}`);
    }
  };

  const handleConnectOutlook = async () => {
    try {
      const connected = await connectToOutlookCalendar();
      if (connected) {
        setConnectedServices(prev => [...prev, 'outlook']);
        setSyncStatus('Conectado a Outlook Calendar exitosamente');
      }
    } catch (error) {
      setSyncStatus(`Error al conectar con Outlook Calendar: ${error.message}`);
    }
  };

  const handleImport = async (service) => {
    setIsImporting(true);
    setSyncStatus(`Importando eventos de ${service}...`);
    try {
      const importedEvents = await importEvents(service);
      onImportTasks(importedEvents);
      setSyncStatus(`Eventos importados exitosamente de ${service}`);
    } catch (error) {
      setSyncStatus(`Error al importar eventos: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async (service) => {
    setIsExporting(true);
    setSyncStatus(`Exportando tareas a ${service}...`);
    try {
      await exportEvents(service, tasks);
      setSyncStatus(`Tareas exportadas exitosamente a ${service}`);
    } catch (error) {
      setSyncStatus(`Error al exportar tareas: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Sincronización de Calendario</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Conectar servicios</h3>
        <div className="flex space-x-2">
          <button 
            onClick={handleConnectGoogle}
            disabled={connectedServices.includes('google')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {connectedServices.includes('google') ? 'Conectado a Google' : 'Conectar Google Calendar'}
          </button>
          <button 
            onClick={handleConnectOutlook}
            disabled={connectedServices.includes('outlook')}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:bg-gray-400"
          >
            {connectedServices.includes('outlook') ? 'Conectado a Outlook' : 'Conectar Outlook Calendar'}
          </button>
        </div>
      </div>

      {connectedServices.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Importar/Exportar</h3>
          <div className="space-y-2">
            {connectedServices.map(service => (
              <div key={service} className="flex space-x-2">
                <span className="capitalize text-gray-700 dark:text-gray-300">{service}:</span>
                <button 
                  onClick={() => handleImport(service)}
                  disabled={isImporting}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  Importar
                </button>
                <button 
                  onClick={() => handleExport(service)}
                  disabled={isExporting}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
                >
                  Exportar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {syncStatus && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm text-gray-800 dark:text-gray-200">{syncStatus}</p>
        </div>
      )}
    </div>
  );
};

export default CalendarSync; 
