import React, { useState, useEffect } from 'react';
import { 
  getTemplates, 
  saveTemplate, 
  deleteTemplate, 
  applyTemplate 
} from '../services/templateService';

const TaskTemplates = ({ tasks, onApplyTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('trabajo');
  const [statusMessage, setStatusMessage] = useState('');

  // Categorías disponibles
  const categories = ['trabajo', 'personal', 'estudio', 'hogar', 'salud', 'otro'];

  useEffect(() => {
    // Cargar plantillas al montar el componente
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const loadedTemplates = await getTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      setStatusMessage(`Error al cargar plantillas: ${error.message}`);
    }
  };

  const handleSaveTemplate = async () => {
    if (selectedTasks.length === 0 || !templateName.trim()) {
      setStatusMessage('Debes seleccionar al menos una tarea y proporcionar un nombre para la plantilla');
      return;
    }

    try {
      const templateTasks = tasks.filter(task => selectedTasks.includes(task.id));
      await saveTemplate({
        name: templateName,
        category: templateCategory,
        tasks: templateTasks
      });
      
      setStatusMessage('Plantilla guardada correctamente');
      setTemplateName('');
      setSelectedTasks([]);
      loadTemplates(); // Recargar plantillas
    } catch (error) {
      setStatusMessage(`Error al guardar plantilla: ${error.message}`);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteTemplate(templateId);
      setStatusMessage('Plantilla eliminada correctamente');
      loadTemplates(); // Recargar plantillas
    } catch (error) {
      setStatusMessage(`Error al eliminar plantilla: ${error.message}`);
    }
  };

  const handleApplyTemplate = async (templateId) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        const appliedTasks = await applyTemplate(template);
        onApplyTemplate(appliedTasks);
        setStatusMessage('Plantilla aplicada correctamente');
      }
    } catch (error) {
      setStatusMessage(`Error al aplicar plantilla: ${error.message}`);
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
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Plantillas de Tareas</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Crear nueva plantilla</h3>
        
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre de la plantilla
            </label>
            <input 
              type="text" 
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Ej: Tareas semanales de trabajo"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría
            </label>
            <select
              value={templateCategory}
              onChange={(e) => setTemplateCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Seleccionar tareas para la plantilla</h4>
          <div className="max-h-60 overflow-y-auto">
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
              <p className="text-gray-500 dark:text-gray-400">No hay tareas disponibles</p>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleSaveTemplate}
          disabled={selectedTasks.length === 0 || !templateName.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Guardar plantilla
        </button>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Mis plantillas</h3>
        {templates.length > 0 ? (
          <div className="space-y-3">
            {templates.map(template => (
              <div key={template.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">{template.name}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                      {template.category}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleApplyTemplate(template.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Aplicar
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{template.tasks.length} tareas en esta plantilla</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No has creado plantillas todavía</p>
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

export default TaskTemplates;

