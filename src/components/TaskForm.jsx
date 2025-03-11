import React, { useState } from 'react';
import { trackEvent } from '../services/analyticsService';
import AISuggestions from './AISuggestions';
import { useTaskContext } from '../contexts/TaskContext';

const TaskForm = ({ initialTask = {}, allTasks = [], onSave, onCancel }) => {
  const [task, setTask] = useState({
    id: initialTask.id || Date.now(),
    title: initialTask.title || '',
    description: initialTask.description || '',
    date: initialTask.date || new Date().toISOString(),
    priority: initialTask.priority || 'medium',
    completed: initialTask.completed || false,
    category: initialTask.category || '',
    timeEstimate: initialTask.timeEstimate || 30,
    tags: initialTask.tags || []
  });

  const { addTask, updateTask } = useTaskContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (initialTask.id) {
      // Actualizar tarea existente
      updateTask(initialTask.id, task);
    } else {
      // Crear nueva tarea
      addTask(task);
    }
    
    if (onSave) onSave(task);
    trackEvent('Task', initialTask.id ? 'edit' : 'create', 'form_submit');
  };

  const handleAISuggestion = (type, value) => {
    // Aplicar la sugerencia al formulario
    setTask(prev => ({ ...prev, [type]: value }));
    trackEvent('AI', 'apply_suggestion_in_form', type);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Título
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        ></textarea>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Fecha
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={task.date ? new Date(task.date).toISOString().split('T')[0] : ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Prioridad
        </label>
        <select
          id="priority"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Categoría
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={task.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="timeEstimate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tiempo estimado (minutos)
        </label>
        <input
          type="number"
          id="timeEstimate"
          name="timeEstimate"
          value={task.timeEstimate}
          onChange={handleChange}
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Componente de sugerencias de IA */}
      {task.description && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sugerencias de IA
          </h3>
          <AISuggestions 
            taskContent={task.description} 
            onApplySuggestion={handleAISuggestion}
          />
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialTask.id ? 'Actualizar' : 'Crear'} Tarea
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
