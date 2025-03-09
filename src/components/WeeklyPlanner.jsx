import React, { useState } from 'react';
import { Plus, Check, X, Edit2, Trash2 } from 'lucide-react';

function WeeklyPlanner({ tasks = [], setTasks }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    date: new Date().toISOString().split('T')[0]
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
      date: new Date().toISOString().split('T')[0]
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
      date: new Date(task.date).toISOString().split('T')[0]
    });
    setShowTaskForm(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Selector de días */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {days.map(day => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id)}
            className={`flex-1 py-3 text-center ${
              selectedDay === day.id
                ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
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
            getTasksForDay(selectedDay).map(task => (
              <div
                key={task.id}
                className={`p-3 rounded-md border ${
                  task.completed
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                    : task.priority === 'high'
                    ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20'
                    : task.priority === 'medium'
                    ? 'border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`mt-1 p-1 rounded-full ${
                        task.completed
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                      }`}
                    >
                      <Check size={14} />
                    </button>
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {task.description}
                        </p>
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
            ))
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