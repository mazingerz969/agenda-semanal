import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Calendar, Clock, Tag, Repeat, Image as ImageIcon } from 'lucide-react';
import CustomTagSelector from './CustomTagSelector';
import RecurringTaskOptions from './RecurringTaskOptions';
import TaskImagePicker from './TaskImagePicker';

const WeeklyPlanner = ({ tasks = {}, onTasksChange }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  // Estados para el formulario de tarea
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskPriority, setTaskPriority] = useState('media');
  const [taskCategory, setTaskCategory] = useState('personal');
  const [taskTags, setTaskTags] = useState([]);
  const [taskRecurring, setTaskRecurring] = useState({ frequency: 'none' });
  const [taskImage, setTaskImage] = useState(null);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const openDayModal = (day) => {
    setSelectedDay(day);
    resetForm();
  };

  const openEditModal = (day, taskId) => {
    const task = tasks[day]?.find(t => t.id === taskId);
    if (task) {
      setCurrentTask(task);
      setTaskTitle(task.title);
      setTaskDescription(task.description || '');
      setTaskDate(task.date || '');
      setTaskTime(task.time || '');
      setTaskPriority(task.priority || 'media');
      setTaskCategory(task.category || 'personal');
      setTaskTags(task.tags || []);
      setTaskRecurring(task.recurring || { frequency: 'none' });
      setTaskImage(task.image || null);
      setSelectedDay(day);
      setIsEditing(true);
    }
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskDate('');
    setTaskTime('');
    setTaskPriority('media');
    setTaskCategory('personal');
    setTaskTags([]);
    setTaskRecurring({ frequency: 'none' });
    setTaskImage(null);
    setCurrentTask(null);
    setIsEditing(false);
  };

  const closeModal = () => {
    setSelectedDay(null);
    resetForm();
  };

  const addTask = () => {
    if (taskTitle.trim()) {
      const newTask = {
        id: isEditing ? currentTask.id : Date.now(),
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        date: taskDate,
        time: taskTime,
        priority: taskPriority,
        category: taskCategory,
        tags: taskTags,
        recurring: taskRecurring,
        image: taskImage,
        completed: isEditing ? currentTask.completed : false,
      };

      const updatedTasks = { ...tasks };
      
      if (!updatedTasks[selectedDay]) {
        updatedTasks[selectedDay] = [];
      }
      
      if (isEditing) {
        updatedTasks[selectedDay] = updatedTasks[selectedDay].map(task => 
          task.id === currentTask.id ? newTask : task
        );
      } else {
        updatedTasks[selectedDay] = [...updatedTasks[selectedDay], newTask];
      }
      
      onTasksChange(updatedTasks);
      closeModal();
    }
  };

  const removeTask = (day, taskId) => {
    const updatedTasks = { ...tasks };
    
    if (updatedTasks[day]) {
      updatedTasks[day] = updatedTasks[day].filter(task => task.id !== taskId);
      onTasksChange(updatedTasks);
    }
  };

  const toggleTaskCompletion = (day, taskId) => {
    const updatedTasks = { ...tasks };
    
    if (updatedTasks[day]) {
      updatedTasks[day] = updatedTasks[day].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      onTasksChange(updatedTasks);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'trabajo': return '💼';
      case 'personal': return '👤';
      case 'estudio': return '📚';
      case 'salud': return '🏥';
      case 'finanzas': return '💰';
      default: return '📝';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Planificador Semanal</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <div 
            key={day} 
            className="border rounded p-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => openDayModal(day)}
          >
            <h2 className="font-semibold text-indigo-500 dark:text-indigo-300 mb-2">{day}</h2>
            <div className="space-y-2">
              {tasks[day]?.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-2 rounded ${
                    task.completed ? 'bg-gray-100 dark:bg-gray-700 line-through text-gray-500' : 'bg-white dark:bg-gray-800'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(day, task.id);
                  }}
                >
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 ${getPriorityColor(task.priority)}`}
                    ></div>
                    <span className="truncate max-w-[100px]">{task.title}</span>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(day, task.id);
                      }}
                      className="text-gray-500 hover:text-indigo-600 mr-1"
                    >
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        readOnly
                      />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTask(day, task.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="mt-2 w-full flex items-center justify-center p-1 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded"
              onClick={(e) => {
                e.stopPropagation();
                openDayModal(day);
              }}
            >
              <Plus size={16} className="mr-1" /> Añadir
            </button>
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
              {isEditing ? 'Editar tarea' : 'Nueva tarea'} - {selectedDay}
            </h2>
            
            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input 
                  type="text" 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Título de la tarea"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                <textarea 
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Descripción de la tarea"
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  rows="3"
                ></textarea>
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={16} className="text-gray-500" />
                    </div>
                    <input 
                      type="date" 
                      value={taskDate}
                      onChange={(e) => setTaskDate(e.target.value)}
                      className="w-full p-2 pl-10 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Hora</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Clock size={16} className="text-gray-500" />
                    </div>
                    <input 
                      type="time" 
                      value={taskTime}
                      onChange={(e) => setTaskTime(e.target.value)}
                      className="w-full p-2 pl-10 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Prioridad y Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="trabajo">Trabajo</option>
                    <option value="personal">Personal</option>
                    <option value="estudio">Estudio</option>
                    <option value="salud">Salud</option>
                    <option value="finanzas">Finanzas</option>
                  </select>
                </div>
              </div>

              {/* Etiquetas */}
              <CustomTagSelector 
                selectedTags={taskTags} 
                onTagsChange={setTaskTags} 
              />

              {/* Opciones de recurrencia */}
              <RecurringTaskOptions 
                onOptionsChange={setTaskRecurring} 
              />

              {/* Selector de imagen */}
              <TaskImagePicker 
                onImageChange={setTaskImage} 
              />
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button 
                onClick={addTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {isEditing ? 'Actualizar' : 'Añadir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanner; 