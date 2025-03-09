import React, { useState, useEffect } from 'react';
import NotificationSystem from './components/NotificationSystem';
import DataManager from './components/DataManager';
import MonthlyCalendar from './components/MonthlyCalendar';
import StatisticsPanel from './components/StatisticsPanel';
import WeeklyPlanner from './components/WeeklyPlanner';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { 
  Calendar, 
  BarChart3, 
  List, 
  Download, 
  Upload, 
  Plus, 
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Trophy
} from 'lucide-react';
import GamificationSystem from './components/GamificationSystem';
import MobileView from './components/MobileView';

function App() {
  // Estado para almacenar las tareas - asegurarse de que sea un array
  const [tasks, setTasks] = useState([]);
  // Estado para controlar la vista actual (semanal o mensual)
  const [currentView, setCurrentView] = useState('weekly');
  // Estado para mostrar/ocultar estadísticas
  const [showStats, setShowStats] = useState(false);
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para mostrar/ocultar gamificación
  const [showGamification, setShowGamification] = useState(false);

  // Cargar tareas desde localStorage al iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem('agenda-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Verificar que sea un array
        setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
        setTasks([]);
      }
    } else {
      // Datos de ejemplo para ver algo en la interfaz
      const exampleTasks = [
        {
          id: 1,
          title: 'Reunión de equipo',
          date: new Date(2025, 2, 10).toISOString(),
          priority: 'high',
          completed: false,
          tags: [1, 3]
        },
        {
          id: 2,
          title: 'Entregar informe',
          date: new Date(2025, 2, 12).toISOString(),
          priority: 'medium',
          completed: true,
          tags: [1, 4]
        },
        {
          id: 3,
          title: 'Revisar correos',
          date: new Date(2025, 2, 15).toISOString(),
          priority: 'low',
          completed: false,
          tags: [2]
        }
      ];
      setTasks(exampleTasks);
    }
  }, []);

  // Guardar tareas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('agenda-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Filtrar tareas según término de búsqueda
  const filteredTasks = Array.isArray(tasks) 
    ? tasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Función para añadir una nueva tarea rápida
  const addQuickTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'Nueva tarea',
      date: new Date().toISOString(),
      priority: 'medium',
      completed: false,
      tags: []
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Agenda Semanal</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <NotificationSystem tasks={tasks} />
                <DataManager tasks={tasks} setTasks={setTasks} />
                
                {/* Selector de vista con iconos */}
                <div className="flex rounded-md shadow-sm">
                  <button
                    onClick={() => setCurrentView('weekly')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md flex items-center ${
                      currentView === 'weekly'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <List className="h-4 w-4 mr-1" />
                    Semanal
                  </button>
                  <button
                    onClick={() => setCurrentView('monthly')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md flex items-center ${
                      currentView === 'monthly'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Mensual
                  </button>
                </div>
              </div>
            </div>
            
            {/* Barra de búsqueda y acciones rápidas */}
            <div className="mt-4 flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={addQuickTask}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Nueva tarea
                </button>
                
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <BarChart3 className="h-5 w-5 mr-1" />
                  {showStats ? 'Ocultar estadísticas' : 'Mostrar estadísticas'}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Vista móvil */}
          <MobileView tasks={tasks} setTasks={setTasks} />
          
          {/* Vista de escritorio */}
          <div className="hidden md:block">
            {/* Panel de estadísticas */}
            {showStats && (
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h2 className="text-xl font-bold">Estadísticas</h2>
                </div>
                <StatisticsPanel tasks={tasks} />
              </div>
            )}
            
            {/* Resumen de tareas */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                    <h3 className="font-medium">Pendientes</h3>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {Array.isArray(tasks) ? tasks.filter(task => !task.completed).length : 0}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tareas que necesitan tu atención
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-medium">Completadas</h3>
                  </div>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {Array.isArray(tasks) ? tasks.filter(task => task.completed).length : 0}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tareas que has finalizado
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="font-medium">Prioritarias</h3>
                  </div>
                  <span className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {Array.isArray(tasks) ? tasks.filter(task => task.priority === 'high').length : 0}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tareas de alta prioridad
                </p>
              </div>
            </div>
            
            {/* Etiquetas populares */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center mb-3">
                <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h3 className="font-medium">Etiquetas populares</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  Trabajo
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                  Personal
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Proyecto
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                  Reunión
                </span>
              </div>
            </div>
            
            {/* Botón para mostrar/ocultar gamificación */}
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setShowGamification(!showGamification)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
              >
                <Trophy className="h-5 w-5 mr-2" />
                {showGamification ? 'Ocultar progreso' : 'Mostrar progreso'}
              </button>
            </div>
            
            {/* Panel de gamificación */}
            {showGamification && (
              <div className="mb-6">
                <GamificationSystem tasks={tasks} />
              </div>
            )}
            
            {/* Vistas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center">
                {currentView === 'weekly' ? (
                  <List className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                ) : (
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                )}
                <h2 className="text-lg font-medium">
                  {currentView === 'weekly' ? 'Vista Semanal' : 'Vista Mensual'}
                </h2>
              </div>
              
              <div className="p-4">
                {currentView === 'weekly' ? (
                  <WeeklyPlanner 
                    tasks={filteredTasks} 
                    setTasks={setTasks} 
                  />
                ) : (
                  <MonthlyCalendar 
                    tasks={filteredTasks} 
                    setTasks={setTasks} 
                  />
                )}
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2023 Agenda Semanal
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <Download className="h-5 w-5" />
                </button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <Upload className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
