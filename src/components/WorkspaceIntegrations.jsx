import React, { useState } from 'react';

const WorkspaceIntegrations = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack', connected: false, icon: '🔵' },
    { id: 'teams', name: 'Microsoft Teams', connected: false, icon: '🟣' },
    { id: 'notion', name: 'Notion', connected: false, icon: '⚫' },
    { id: 'trello', name: 'Trello', connected: false, icon: '🔷' },
    { id: 'github', name: 'GitHub', connected: false, icon: '⚫' },
    { id: 'gmail', name: 'Gmail', connected: false, icon: '🔴' }
  ]);
  
  const [statusMessage, setStatusMessage] = useState('');

  const toggleConnection = (integrationId) => {
    setIntegrations(prevIntegrations => 
      prevIntegrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, connected: !integration.connected } 
          : integration
      )
    );
    
    const integration = integrations.find(i => i.id === integrationId);
    const newStatus = !integration.connected;
    
    setStatusMessage(`${integration.name} ${newStatus ? 'conectado' : 'desconectado'} correctamente`);
    
    // Aquí implementarías la lógica real de conexión/desconexión
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Integraciones de Trabajo</h2>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Conecta tu agenda con tus herramientas de trabajo favoritas para sincronizar tareas y aumentar tu productividad.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {integrations.map(integration => (
          <div 
            key={integration.id}
            className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{integration.icon}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{integration.name}</span>
            </div>
            <button
              onClick={() => toggleConnection(integration.id)}
              className={`px-3 py-1 rounded text-sm ${
                integration.connected 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/50' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50'
              }`}
            >
              {integration.connected ? 'Desconectar' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
      
      {statusMessage && (
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
          {statusMessage}
        </div>
      )}
      
      <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
        <h3 className="text-md font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Beneficios de la integración</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Sincroniza automáticamente tareas desde correos y mensajes</li>
          <li>Convierte issues de GitHub en tareas gestionables</li>
          <li>Recibe notificaciones en Slack/Teams cuando se acercan fechas límite</li>
          <li>Importa notas de Notion como tareas estructuradas</li>
          <li>Mantén tu equipo actualizado sobre el progreso de tus tareas</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkspaceIntegrations;
