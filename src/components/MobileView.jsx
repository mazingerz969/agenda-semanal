import React, { useState } from 'react';
import { Calendar, List, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Check } from 'lucide-react';

function MobileView({ tasks, setTasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Función para obtener el nombre del día
  const getDayName = (date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'long' });
  };
  
  // Función para formatear la fecha
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  };
  
  // Función para ir al día anterior
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  
  // Función para ir al día siguiente
  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };
  
  // Función para ir al día actual
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Función para obtener las tareas del día actual
  const getTasksForCurrentDay = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toISOString().split('T')[0] === dateStr;
    });
  };
  
  // Función para añadir una nueva tarea
  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      completed: false,
      date: currentDate.toISOString()
    };
    
    setTasks([...tasks, taskToAdd]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      date: currentDate.toISOString().split('T')[0]
    });
    setShowAddTask(false);
  };
  
  // Función para eliminar una tarea
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  // Función para marcar una tarea como completada/pendiente
  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  // Obtener las tareas del día actual
  const currentDayTasks = getTasksForCurrentDay();
  
  // Verificar si es hoy
  const isToday = new Date().toISOString().split('T')[0] === currentDate.toISOString().split('T')[0];
  
  return (
    <div className="md:hidden">
      {/* Cabecera con navegación de días */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center">
            <div className="text-lg font-medium capitalize">
              {getDayName(currentDate)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(currentDate)}
              {isToday && (
                <span className="ml-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full">
                  Hoy
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={goToNextDay}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex justify-center space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Hoy
          </button>
          
          <button
            onClick={() => setShowAddTask(true)}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Añadir tarea
          </button>
        </div>
      </div>
      
      {/* Lista de tareas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <List className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Tareas para hoy
        </h3>
        
        {currentDayTasks.length > 0 ? (
          <ul className="space-y-3">
            {currentDayTasks.map(task => (
              <li 
                key={task.id}
                className={`p-3 rounded-md ${
                  task.completed 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`mr-3 ${
                        task.completed 
                          ? 'text-green-500 hover:text-green-600' 
                          : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      <Check size={20} />
                    </button>
                    <div>
                      <div className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {/* Implementar edición */}}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Prioridad */}
                <div className="mt-2 flex items-center">
                  <div 
                    className={`w-2 h-2 rounded-full mr-2 ${
                      task.priority === 'high' 
                        ? 'bg-red-500' 
                        : task.priority === 'medium' 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    Prioridad {task.priority === 'high' ? 'alta' : task.priority === 'medium' ? 'media' : 'baja'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
            <p>No hay tareas para este día</p>
            <button
              onClick={() => setShowAddTask(true)}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Añadir tarea
            </button>
          </div>
        )}
      </div>
      
      {/* Modal para añadir tarea */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Nueva tarea</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Añadir tarea
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileView; 