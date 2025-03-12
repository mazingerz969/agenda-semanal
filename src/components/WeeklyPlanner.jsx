import React, { useState } from 'react';
<<<<<<< HEAD
import { Plus, Check, X, Edit2, Trash2, Tag } from 'lucide-react';
import TagSelector from './TagSelector';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import RecurringTaskOptions from './RecurringTaskOptions';

function WeeklyPlanner({ tasks, setTasks }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    isRecurring: false,
    recurringParentId: null,
    taskRecurring: 'daily'
  });
  const [newSubtask, setNewSubtask] = useState('');

  const days = [
    { id: 0, name: 'Domingo', shortName: 'Dom' },
    { id: 1, name: 'Lunes', shortName: 'Lun' },
    { id: 2, name: 'Martes', shortName: 'Mar' },
    { id: 3, name: 'Miércoles', shortName: 'Mié' },
    { id: 4, name: 'Jueves', shortName: 'Jue' },
    { id: 5, name: 'Viernes', shortName: 'Vie' },
    { id: 6, name: 'Sábado', shortName: 'Sáb' }
  ];

  // Obtener fechas para la semana actual
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = lunes, etc.
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Ajustar cuando es domingo
    
    const monday = new Date(today.setDate(diff));
    const weekDates = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDates.push(day);
    }
    
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();
  
  // Agrupar tareas por día
  const getTasksByDay = () => {
    const tasksByDay = {};
    
    weekDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      tasksByDay[dateStr] = [];
    });
    
    tasks.forEach(task => {
      const taskDate = new Date(task.date);
      const dateStr = taskDate.toISOString().split('T')[0];
      
      if (tasksByDay[dateStr]) {
        tasksByDay[dateStr].push(task);
      }
    });
    
    return tasksByDay;
  };
  
  const tasksByDay = getTasksByDay();
  
  // Obtener tareas para el día seleccionado
  const getTasksForDay = (dayId) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getDay() === dayId;
    });
  };

  // Añadir nueva tarea
  const addTask = (date) => {
    if (!newTask.title.trim()) return;
    
    const newTaskToAdd = {
      ...newTask,
      id: Date.now(),
      completed: false,
      date: new Date(date).toISOString(),
      isRecurring: newTask.isRecurring,
      recurringParentId: newTask.recurringParentId,
      taskRecurring: newTask.taskRecurring
    };
    
    setTasks(prevTasks => [...prevTasks, newTaskToAdd]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      isRecurring: false,
      recurringParentId: null,
      taskRecurring: 'daily'
    });
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // Eliminar tarea
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Marcar tarea como completada/pendiente
  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Editar tarea existente
  const editTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      date: new Date(task.date).toISOString().split('T')[0],
      tags: task.tags || [],
      isRecurring: task.isRecurring,
      recurringParentId: task.recurringParentId,
      taskRecurring: task.taskRecurring
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

  // Función para manejar el final del arrastre
  const handleDragEnd = (result) => {
    // Si no hay destino válido, no hacer nada
    if (!result.destination) return;
    
    // Obtener el día de origen y destino
    const sourceDate = result.source.droppableId;
    const destinationDate = result.destination.droppableId;
    
    // Crear una copia de las tareas agrupadas por día
    const tasksCopy = {...tasksByDay};
    
    // Obtener la tarea que se está moviendo
    const sourceTasks = [...tasksCopy[sourceDate]];
    const [movedTask] = sourceTasks.splice(result.source.index, 1);
    
    // Si el destino es el mismo día, solo reordenar
    if (sourceDate === destinationDate) {
      sourceTasks.splice(result.destination.index, 0, movedTask);
      tasksCopy[sourceDate] = sourceTasks;
    } else {
      // Si el destino es otro día, mover la tarea y actualizar su fecha
      const destinationTasks = [...tasksCopy[destinationDate]];
      
      // Actualizar la fecha de la tarea al nuevo día
      const updatedTask = {
        ...movedTask,
        date: new Date(destinationDate).toISOString()
      };
      
      destinationTasks.splice(result.destination.index, 0, updatedTask);
      tasksCopy[sourceDate] = sourceTasks;
      tasksCopy[destinationDate] = destinationTasks;
    }
    
    // Convertir el objeto de tareas agrupadas de nuevo a un array plano
    const updatedTasks = Object.values(tasksCopy).flat();
    setTasks(updatedTasks);
  };

  // Continuar con la función generateRecurringTasks
  const generateRecurringTasks = (baseTask, currentDate) => {
    let tasks = [];
    let occurrenceCount = 1;

    while (currentDate <= new Date(baseTask.endDate)) {
      // Añadir la nueva instancia
      tasks.push({
        ...baseTask,
        id: baseTask.id + occurrenceCount,
        date: new Date(currentDate).toISOString(),
        isRecurringInstance: true,
        recurringParentId: baseTask.id
      });
      
      occurrenceCount++;
      currentDate.setDate(currentDate.getDate() + baseTask.recurringInterval);
    }
    
    return tasks;
  };

  // Añadir nueva subtarea
  const addSubtask = (taskId) => {
    if (!newSubtask.trim()) return;
    
    const newSubtaskToAdd = {
      id: Date.now(),
      title: newSubtask,
      completed: false,
      date: new Date().toISOString(),
      taskId: taskId
    };
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, subtasks: [...(task.subtasks || []), newSubtaskToAdd] } : task
      )
    );
    setNewSubtask('');
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayTasks = tasksByDay[dateStr] || [];
          const isToday = new Date().toISOString().split('T')[0] === dateStr;
          
          return (
            <div 
              key={index} 
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-3 ${
                isToday ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
              }`}
            >
              <h3 className={`text-sm font-medium mb-2 ${
                isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
              </h3>
              
              <Droppable droppableId={dateStr}>
                {(provided) => (
                  <ul 
                    className="space-y-2 mb-3 min-h-[100px]"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {dayTasks.map((task, taskIndex) => (
                      <Draggable 
                        key={task.id.toString()} 
                        draggableId={task.id.toString()} 
                        index={taskIndex}
                      >
                        {(provided, snapshot) => (
                          <li 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-2 rounded-md ${
                              task.completed 
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' 
                                : 'bg-white dark:bg-gray-800'
                            } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          >
                            {editingTask && editingTask.id === task.id ? (
                              <div className="flex items-center">
                                <input
                                  type="text"
                                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                  value={newTask.title}
                                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                  onKeyDown={(e) => e.key === 'Enter' && addTask(date)}
                                  autoFocus
                                />
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    addTask(date);
                                  }}
                                  className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                >
                                  <Check size={18} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <button 
                                    onClick={() => toggleTaskCompletion(task.id)}
                                    className={`mr-2 ${
                                      task.completed 
                                        ? 'text-green-500 hover:text-green-600' 
                                        : 'text-gray-400 hover:text-gray-500'
                                    }`}
                                  >
                                    {task.completed ? <Check size={18} /> : <Check size={18} />}
                                  </button>
                                  <span className={task.completed ? 'line-through' : ''}>
                                    {task.title}
                                  </span>
                                </div>
                                <div className="flex space-x-1">
                                  <button 
                                    onClick={() => editTask(task)}
                                    className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => deleteTask(task.id)}
                                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {/* Formulario para añadir subtarea */}
                            <div className="flex items-center mt-2">
                              <input
                                type="text"
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700 dark:text-white"
                                placeholder="Nueva subtarea..."
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addSubtask(task.id)}
                              />
                              <button
                                onClick={() => addSubtask(task.id)}
                                className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
              
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700 dark:text-white"
                  placeholder="Nueva tarea..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addTask(date)}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addTask(date);
                  }}
                  className="px-2 py-1 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">
              {editingTask ? 'Editar tarea' : 'Nueva tarea'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              addTask(new Date());
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
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newTask.date}
                    onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Repetición
                  </label>
                  <RecurringTaskOptions 
                    value={newTask.taskRecurring} 
                    onChange={(value) => setNewTask({...newTask, taskRecurring: value})} 
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskForm(false);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingTask ? 'Guardar cambios' : 'Añadir tarea'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </DragDropContext>
  );
}

export default WeeklyPlanner; 
=======
import { trackEvent, ANALYTICS_EVENTS } from '../services/analyticsService';
// ... otros imports

const WeeklyPlanner = () => {
  // ... tu código existente
  
  // Ejemplo: función para crear una nueva tarea
  const handleCreateTask = (task) => {
    // Lógica para crear la tarea
    // ...
    
    // Rastrear el evento de creación de tarea
    trackEvent(
      'Task',
      ANALYTICS_EVENTS.TASK.CREATE,
      task.category,
      task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1
    );
  };
  
  // Ejemplo: función para completar una tarea
  const handleCompleteTask = (taskId) => {
    // Lógica para marcar la tarea como completada
    // ...
    
    // Rastrear el evento de completar tarea
    trackEvent(
      'Task',
      ANALYTICS_EVENTS.TASK.COMPLETE
    );
  };
  
  // ... resto de tu componente
};

export default WeeklyPlanner;
>>>>>>> origin/feature/fix-darkmode-and-assistant
