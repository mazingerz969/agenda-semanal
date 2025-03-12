<<<<<<< HEAD
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
=======
import React, { useState, useCallback } from 'react';
import { Calendar, List, CheckCircle, Clock, AlertCircle, Filter, Menu, X, Plus, BarChart3, Trophy, Download, Upload } from 'lucide-react';
import { trackEvent } from '../services/analyticsService';
import { Link } from 'react-router-dom';

const MobileView = ({ tasks = [], setTasks, showStats, setShowStats, showGamification, setShowGamification, addQuickTask }) => {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState('today');
  // Estado para el filtro de prioridad
  const [priorityFilter, setPriorityFilter] = useState('all');
  // Estado para mostrar filtros
  const [showFilters, setShowFilters] = useState(false);
  // Estado para mostrar menú
  const [showMenu, setShowMenu] = useState(false);
  // Estado para mostrar opciones de exportación/importación
  const [showDataOptions, setShowDataOptions] = useState(false);

  // Cambiar pestaña y registrar evento
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    trackEvent('Mobile', 'change_tab', tab);
  }, []);

  // Cambiar filtro de prioridad
  const handlePriorityChange = useCallback((priority) => {
    setPriorityFilter(priority);
    trackEvent('Mobile', 'filter_priority', priority);
  }, []);

  // Filtrar tareas según pestaña y prioridad
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    const today = new Date();
    
    // Filtro por pestaña
    let passesTabFilter = true;
    switch (activeTab) {
      case 'today':
        passesTabFilter = (
          taskDate.getDate() === today.getDate() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getFullYear() === today.getFullYear()
        );
        break;
      case 'pending':
        passesTabFilter = !task.completed;
        break;
      case 'completed':
        passesTabFilter = task.completed;
        break;
      case 'priority':
        passesTabFilter = task.priority === 'high';
        break;
      default:
        passesTabFilter = true;
    }
    
    // Filtro por prioridad
    let passesPriorityFilter = true;
    if (priorityFilter !== 'all') {
      passesPriorityFilter = task.priority === priorityFilter;
    }
    
    return passesTabFilter && passesPriorityFilter;
  });

  // Función para cambiar el estado de completado de una tarea
  const toggleTaskCompletion = useCallback((taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
    trackEvent('Task', 'toggle_completion', 'mobile_view');
  }, [setTasks]);

  // Obtener color según prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Función para editar una tarea
  const handleEditTask = useCallback((taskId) => {
    // Aquí iría la lógica para editar una tarea
    trackEvent('Task', 'edit', 'mobile_view');
    // Por ahora solo mostramos un mensaje
    alert(`Editar tarea ${taskId}`);
  }, []);

  // Función para eliminar una tarea
  const handleDeleteTask = useCallback((taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      trackEvent('Task', 'delete', 'mobile_view');
    }
  }, [setTasks]);

  return (
    <div className="md:hidden">
      {/* Barra superior fija */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-md">
        {/* Encabezado con menú */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h1 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Agenda</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={addQuickTask}
              className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
              aria-label="Añadir tarea"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              aria-label={showMenu ? "Cerrar menú" : "Abrir menú"}
            >
              {showMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        
        {/* Menú desplegable */}
        {showMenu && (
          <div className="bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700 animate-fadeIn">
            <div className="p-4 space-y-3">
              <button
                onClick={() => {
                  setShowStats(!showStats);
                  trackEvent('UI', 'toggle_stats', !showStats ? 'show' : 'hide');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Estadísticas</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${showStats ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400'}`}>
                  {showStats ? 'Activado' : 'Desactivado'}
                </span>
              </button>
              
              <button
                onClick={() => {
                  setShowGamification(!showGamification);
                  trackEvent('UI', 'toggle_gamification', !showGamification ? 'show' : 'hide');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Gamificación</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${showGamification ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400'}`}>
                  {showGamification ? 'Activado' : 'Desactivado'}
                </span>
              </button>
              
              <Link
                to="/pricing"
                className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => trackEvent('Subscription', 'view_plans', 'mobile_menu')}
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium text-white">Ver planes premium</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">PRO</span>
              </Link>
            </div>
          </div>
        )}
        
        {/* Pestañas de navegación */}
        <div className="grid grid-cols-4 w-full">
          <button
            onClick={() => handleTabChange('today')}
            className={`py-2 text-center ${
              activeTab === 'today'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Calendar size={16} className="mx-auto mb-1" />
            <span className="text-xs">Hoy</span>
          </button>
          <button
            onClick={() => handleTabChange('pending')}
            className={`py-2 text-center ${
              activeTab === 'pending'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Clock size={16} className="mx-auto mb-1" />
            <span className="text-xs">Pendientes</span>
          </button>
          <button
            onClick={() => handleTabChange('completed')}
            className={`py-2 text-center ${
              activeTab === 'completed'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <CheckCircle size={16} className="mx-auto mb-1" />
            <span className="text-xs">Completadas</span>
          </button>
          <button
            onClick={() => handleTabChange('priority')}
            className={`py-2 text-center ${
              activeTab === 'priority'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <AlertCircle size={16} className="mx-auto mb-1" />
            <span className="text-xs">Prioritarias</span>
>>>>>>> origin/feature/fix-darkmode-and-assistant
          </button>
        </div>
      </div>
      
<<<<<<< HEAD
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
=======
      {/* Espacio para que el contenido no quede debajo de la barra fija */}
      <div className="pt-28"></div>
      
      {/* Cabecera y filtros */}
      <div className="bg-white dark:bg-gray-800 mx-2 rounded-t-lg shadow-sm px-3 py-2 flex justify-between items-center">
        <h2 className="font-medium text-sm text-gray-800 dark:text-gray-200">
          {activeTab === 'today' && 'Tareas de hoy'}
          {activeTab === 'pending' && 'Tareas pendientes'}
          {activeTab === 'completed' && 'Tareas completadas'}
          {activeTab === 'priority' && 'Tareas prioritarias'}
        </h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label="Mostrar filtros"
        >
          <Filter size={14} />
        </button>
      </div>
      
      {/* Filtros desplegables */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 mx-2 px-3 py-2 shadow-sm border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Filtrar por prioridad:</p>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => handlePriorityChange('all')}
              className={`px-1 py-1 rounded-full text-xs ${
                priorityFilter === 'all' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => handlePriorityChange('high')}
              className={`px-1 py-1 rounded-full text-xs ${
                priorityFilter === 'high' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Alta
            </button>
            <button
              onClick={() => handlePriorityChange('medium')}
              className={`px-1 py-1 rounded-full text-xs ${
                priorityFilter === 'medium' 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Media
            </button>
            <button
              onClick={() => handlePriorityChange('low')}
              className={`px-1 py-1 rounded-full text-xs ${
                priorityFilter === 'low' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Baja
            </button>
          </div>
        </div>
      )}
      
      {/* Lista de tareas */}
      <div className="bg-white dark:bg-gray-800 mx-2 rounded-b-lg shadow overflow-hidden mb-20">
        {filteredTasks.length > 0 ? (
          <ul className="divide-y dark:divide-gray-700">
            {filteredTasks.map(task => (
              <li key={task.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="mr-2 h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className={`font-medium text-sm truncate ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                        {task.title}
                      </p>
                      <div className="flex space-x-1 ml-2">
                        <button 
                          onClick={() => handleEditTask(task.id)}
                          className="p-1 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                        {new Date(task.date).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' && 'Alta'}
                        {task.priority === 'medium' && 'Media'}
                        {task.priority === 'low' && 'Baja'}
                      </span>
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex ml-1 space-x-1">
                          {task.tags.map(tagId => (
                            <span key={tagId} className="w-2 h-2 rounded-full bg-blue-400"></span>
                          ))}
>>>>>>> origin/feature/fix-darkmode-and-assistant
                        </div>
                      )}
                    </div>
                  </div>
<<<<<<< HEAD
                  
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
=======
>>>>>>> origin/feature/fix-darkmode-and-assistant
                </div>
              </li>
            ))}
          </ul>
        ) : (
<<<<<<< HEAD
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
=======
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <List className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay tareas para mostrar</p>
            <p className="text-xs mt-1">Ajusta los filtros o añade nuevas tareas</p>
>>>>>>> origin/feature/fix-darkmode-and-assistant
          </div>
        )}
      </div>
      
<<<<<<< HEAD
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
=======
      {/* Botón flotante para añadir tarea */}
      <button
        onClick={addQuickTask}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center"
        aria-label="Añadir nueva tarea"
      >
        <Plus size={20} />
      </button>
      
      {/* Mini footer para móvil */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 flex justify-between items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 Agenda Semanal
        </p>
        <div className="flex space-x-3">
          <button 
            className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            onClick={() => {
              setShowDataOptions(true);
              trackEvent('Data', 'export_view', 'mobile');
            }}
          >
            <Download className="h-4 w-4" />
          </button>
          <button 
            className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            onClick={() => {
              setShowDataOptions(true);
              trackEvent('Data', 'import_view', 'mobile');
            }}
          >
            <Upload className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileView); 
>>>>>>> origin/feature/fix-darkmode-and-assistant
