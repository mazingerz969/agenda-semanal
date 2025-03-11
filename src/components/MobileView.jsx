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
          </button>
        </div>
      </div>
      
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <List className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No hay tareas para mostrar</p>
            <p className="text-xs mt-1">Ajusta los filtros o añade nuevas tareas</p>
          </div>
        )}
      </div>
      
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