import React, { useState } from 'react';
import { Plus, Check, X, Edit2, Trash2, Tag } from 'lucide-react';
import TagSelector from './TagSelector';

function WeeklyPlanner({ tasks = [], setTasks }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    date: new Date().toISOString().split('T')[0],
    tags: []
  });

  const days = [
    { id: 0, name: 'Domingo', shortName: 'Dom' },
    { id: 1, name: 'Lunes', shortName: 'Lun' },
    { id: 2, name: 'Martes', shortName: 'Mar' },
    { id: 3, name: 'Miércoles', shortName: 'Mié' },
    { id: 4, name: 'Jueves', shortName: 'Jue' },
    { id: 5, name: 'Viernes', shortName: 'Vie' },
    { id: 6, name: 'Sábado', shortName: 'Sáb' }
  ];

  // Obtener tareas para el día seleccionado
  const getTasksForDay = (dayId) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getDay() === dayId;
    });
  };

  // Añadir o editar tarea
  const handleSaveTask = () => {
    if (!newTask.title.trim()) return;

    if (editingTask) {
      // Editar tarea existente
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...task, ...newTask } : task
      ));
    } else {
      // Añadir nueva tarea
      const taskToAdd = {
        ...newTask,
        id: Date.now(),
        completed: false,
        date: new Date(newTask.date).toISOString()
      };
      setTasks([...tasks, taskToAdd]);
    }

    // Resetear formulario
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      date: new Date().toISOString().split('T')[0],
      tags: []
    });
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // Eliminar tarea
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Marcar tarea como completada
  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Editar tarea existente
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      date: new Date(task.date).toISOString().split('T')[0],
      tags: task.tags || []
    });
    setShowTaskForm(true);
  };

  // Obtener etiquetas para una tarea
  const getTagsForTask = (task) => {
    // Obtener todas las etiquetas disponibles
    const savedTags = localStorage.getItem('agenda-tags');
    const allTags = savedTags ? JSON.parse(savedTags) : [];
    
    // Filtrar solo las etiquetas que están en la tarea
    return allTags.filter(tag => task.tags && task.tags.includes(tag.id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Selector de días */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {days.map(day => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id)}
            className={lex-1 py-3 text-center }
          >
            <span className="hidden md:block">{day.name}</span>
            <span className="md:hidden">{day.shortName}</span>
          </button>
        ))}
      </div>

      {/* Lista de tareas */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{days.find(d => d.id === selectedDay).name}</h2>
          <button
            onClick={() => {
              setShowTaskForm(true);
              setEditingTask(null);
              setNewTask({
                ...newTask,
                date: new Date().toISOString().split('T')[0]
              });
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus size={16} />
            Nueva tarea
          </button>
        </div>

        {/* Tareas del día */}
        <div className="space-y-2">
          {getTasksForDay(selectedDay).length === 0 ? (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">
              No hay tareas para este día
            </p>
          ) : (
            getTasksForDay(selectedDay).map(task => {
              const taskTags = getTagsForTask(task);
              
              return (
                <div
                  key={task.id}
                  className={p-3 rounded-md border }
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        className={mt-1 p-1 rounded-full }
                      >
                        <Check size={14} />
                      </button>
                      <div>
                        <h3 className={ont-medium }>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        )}
                        
                        {/* Mostrar etiquetas */}
                        {taskTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {taskTags.map(tag => {
                              const COLORS = [
                                { bg: 'bg-red-100', text: 'text-red-800', dark: 'dark:bg-red-900/20 dark:text-red-300' },
                                { bg: 'bg-orange-100', text: 'text-orange-800', dark: 'dark:bg-orange-900/20 dark:text-orange-300' },
                                { bg: 'bg-yellow-100', text: 'text-yellow-800', dark: 'dark:bg-yellow-900/20 dark:text-yellow-300' },
                                { bg: 'bg-green-100', text: 'text-green-800', dark: 'dark:bg-green-900/20 dark:text-green-300' },
                                { bg: 'bg-blue-100', text: 'text-blue-800', dark: 'dark:bg-blue-900/20 dark:text-blue-300' },
                                { bg: 'bg-indigo-100', text: 'text-indigo-800', dark: 'dark:bg-indigo-900/20 dark:text-indigo-300' },
                                { bg: 'bg-purple-100', text: 'text-purple-800', dark: 'dark:bg-purple-900/20 dark:text-purple-300' },
                                { bg: 'bg-pink-100', text: 'text-pink-800', dark: 'dark:bg-pink-900/20 dark:text-pink-300' },
                              ];
                              const color = COLORS[tag.color];
                              
                              return (
                                <span 
                                  key={tag.id} 
                                  className={inline-flex items-center px-2 py-0.5 rounded text-xs font-medium   }
                                >
                                  {tag.name}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Formulario para añadir/editar tarea */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingTask ? 'Editar tarea' : 'Nueva tarea'}
              </h3>
              <button
                onClick={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                }}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Título de la tarea"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Descripción (opcional)"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridad
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Etiquetas
                </label>
                <TagSelector 
                  selectedTags={newTask.tags || []} 
                  onChange={(tags) => setNewTask({ ...newTask, tags })}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveTask}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyPlanner;
