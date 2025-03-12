import React, { useState, useEffect } from 'react';
import { 
  createShareableLink, 
  getSharedTasks, 
  shareTasksWithUser,
  acceptSharedTasks
} from '../services/collaborationService';

const CollaborationMode = ({ tasks, onImportSharedTasks }) => {
  const [shareableLink, setShareableLink] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // Cargar tareas compartidas al montar el componente
    const loadSharedTasks = async () => {
      try {
        const shared = await getSharedTasks();
        setSharedWithMe(shared);
      } catch (error) {
        setStatusMessage(`Error al cargar tareas compartidas: ${error.message}`);
      }
    };
    
    loadSharedTasks();
  }, []);

  const handleCreateLink = async () => {
    if (selectedTasks.length === 0) {
      setStatusMessage('Selecciona al menos una tarea para compartir');
      return;
    }
    
    try {
      const link = await createShareableLink(
        tasks.filter(task => selectedTasks.includes(task.id))
      );
      setShareableLink(link);
      setStatusMessage('Enlace generado correctamente');
    } catch (error) {
      setStatusMessage(`Error al generar enlace: ${error.message}`);
    }
  };

  const handleShareWithUser = async () => {
    if (!recipientEmail || selectedTasks.length === 0) {
      setStatusMessage('Ingresa un email y selecciona tareas para compartir');
      return;
    }
    
    try {
      await shareTasksWithUser(
        recipientEmail,
        tasks.filter(task => selectedTasks.includes(task.id))
      );
      setStatusMessage(`Tareas compartidas con ${recipientEmail}`);
      setRecipientEmail('');
      setSelectedTasks([]);
    } catch (error) {
      setStatusMessage(`Error al compartir tareas: ${error.message}`);
    }
  };

  const handleAcceptShared = async (sharedTaskId) => {
    try {
      const taskToImport = sharedWithMe.find(task => task.id === sharedTaskId);
      if (taskToImport) {
        await acceptSharedTasks([taskToImport]);
        onImportSharedTasks([taskToImport]);
        setSharedWithMe(prev => prev.filter(task => task.id !== sharedTaskId));
        setStatusMessage('Tarea aceptada y añadida a tu agenda');
      }
    } catch (error) {
      setStatusMessage(`Error al aceptar tarea: ${error.message}`);
    }
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Colaboración</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Mis tareas para compartir</h3>
        <div className="max-h-60 overflow-y-auto mb-3">
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => toggleTaskSelection(task.id)}
                    className="mr-2"
                  />
                  <span className={`text-gray-700 dark:text-gray-300 ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No tienes tareas para compartir</p>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <button 
              onClick={handleCreateLink}
              disabled={selectedTasks.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Generar enlace compartible
            </button>
            
            {shareableLink && (
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded flex">
                <input 
                  type="text" 
                  value={shareableLink} 
                  readOnly 
                  className="flex-grow bg-transparent text-gray-800 dark:text-gray-200 outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(shareableLink);
                    setStatusMessage('Enlace copiado al portapapeles');
                  }}
                  className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded"
                >
                  Copiar
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="email" 
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Email del colaborador"
              className="flex-grow px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button 
              onClick={handleShareWithUser}
              disabled={!recipientEmail || selectedTasks.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              Compartir
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Compartido conmigo</h3>
        {sharedWithMe.length > 0 ? (
          <ul className="space-y-2">
            {sharedWithMe.map(task => (
              <li key={task.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Compartido por: {task.sharedBy}
                  </p>
                </div>
                <button 
                  onClick={() => handleAcceptShared(task.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Aceptar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay tareas compartidas contigo</p>
        )}
      </div>

      {statusMessage && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm text-gray-800 dark:text-gray-200">{statusMessage}</p>
        </div>
      )}
    </div>
  );
};

export default CollaborationMode;

