import React, { useState, useEffect } from 'react';
import { Moon, Sun, Calendar, BarChart2, Search, User as UserIcon, Settings } from 'lucide-react';
import WeeklyPlanner from './components/WeeklyPlanner';
import MonthlyCalendar from './components/MonthlyCalendar';
import StatisticsPanel from './components/StatisticsPanel';
import SearchFilter from './components/SearchFilter';
import UserAvatar from './components/UserAvatar';

function App() {
  const [activeView, setActiveView] = useState('weekly');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [tasks, setTasks] = useState({});
  const [filteredTasks, setFilteredTasks] = useState({});

  // Cargar tareas desde localStorage al iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Guardar tareas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Aplicar filtros a las tareas
  useEffect(() => {
    if (Object.keys(searchFilters).length === 0) {
      setFilteredTasks(tasks);
      return;
    }

    const filtered = {};
    
    Object.entries(tasks).forEach(([day, dayTasks]) => {
      filtered[day] = dayTasks.filter(task => {
        // Filtrar por texto de búsqueda
        if (searchFilters.searchTerm && !task.title.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) && 
            !task.description?.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())) {
          return false;
        }
        
        // Filtrar por categoría
        if (searchFilters.category && searchFilters.category !== 'all' && 
            task.category !== searchFilters.category) {
          return false;
        }
        
        // Filtrar por prioridad
        if (searchFilters.priority && searchFilters.priority !== 'all' && 
            task.priority !== searchFilters.priority) {
          return false;
        }
        
        // Filtrar por estado
        if (searchFilters.status === 'completada' && !task.completed) {
          return false;
        }
        if (searchFilters.status === 'pendiente' && task.completed) {
          return false;
        }
        
        // Filtrar por etiquetas
        if (searchFilters.tags && searchFilters.tags.length > 0) {
          const hasTag = searchFilters.tags.some(tagId => 
            task.tags && task.tags.includes(tagId)
          );
          if (!hasTag) return false;
        }
        
        return true;
      });
    });
    
    setFilteredTasks(filtered);
  }, [tasks, searchFilters]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Cargar preferencias del usuario desde localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedAvatar = localStorage.getItem('userAvatar');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode);
    }
    
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const handleAvatarChange = (avatarUrl) => {
    setUserAvatar(avatarUrl);
    if (avatarUrl) {
      localStorage.setItem('userAvatar', avatarUrl);
    } else {
      localStorage.removeItem('userAvatar');
    }
  };

  const handleFilterChange = (filters) => {
    setSearchFilters(filters);
  };

  const handleTasksChange = (newTasks) => {
    setTasks(newTasks);
  };

  const renderView = () => {
    switch(activeView) {
      case 'weekly':
        return <WeeklyPlanner tasks={filteredTasks} onTasksChange={handleTasksChange} />;
      case 'monthly':
        return <MonthlyCalendar tasks={filteredTasks} onTasksChange={handleTasksChange} />;
      case 'statistics':
        return <StatisticsPanel tasks={tasks} />;
      default:
        return <WeeklyPlanner tasks={filteredTasks} onTasksChange={handleTasksChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Agenda Semanal</h1>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-2">
              <button 
                onClick={() => setActiveView('weekly')}
                className={`px-4 py-2 rounded flex items-center ${activeView === 'weekly' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
              >
                <Calendar size={18} className="mr-1" /> Semanal
              </button>
              <button 
                onClick={() => setActiveView('monthly')}
                className={`px-4 py-2 rounded flex items-center ${activeView === 'monthly' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
              >
                <Calendar size={18} className="mr-1" /> Mensual
              </button>
              <button 
                onClick={() => setActiveView('statistics')}
                className={`px-4 py-2 rounded flex items-center ${activeView === 'statistics' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
              >
                <BarChart2 size={18} className="mr-1" /> Estadísticas
              </button>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded hover:bg-indigo-500 transition-colors"
              aria-label="Cambiar modo oscuro"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowUserSettings(!showUserSettings)}
                className="focus:outline-none"
              >
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center cursor-pointer">
                    <UserIcon size={20} />
                  </div>
                )}
              </button>
              
              {showUserSettings && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Perfil de Usuario</h3>
                    <button 
                      onClick={() => setShowUserSettings(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Settings size={18} />
                    </button>
                  </div>
                  <div className="mb-4">
                    <UserAvatar onAvatarChange={handleAvatarChange} />
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={toggleDarkMode}
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {isDarkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                      {isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="md:hidden bg-indigo-500 text-white p-2">
        <div className="container mx-auto flex justify-between">
          <button 
            onClick={() => setActiveView('weekly')}
            className={`px-3 py-1 rounded ${activeView === 'weekly' ? 'bg-indigo-700' : ''}`}
          >
            Semanal
          </button>
          <button 
            onClick={() => setActiveView('monthly')}
            className={`px-3 py-1 rounded ${activeView === 'monthly' ? 'bg-indigo-700' : ''}`}
          >
            Mensual
          </button>
          <button 
            onClick={() => setActiveView('statistics')}
            className={`px-3 py-1 rounded ${activeView === 'statistics' ? 'bg-indigo-700' : ''}`}
          >
            Estadísticas
          </button>
        </div>
      </div>
      
      <main className="container mx-auto mt-8 px-4">
        <div className="mb-6">
          <SearchFilter onFilterChange={handleFilterChange} />
        </div>
        
        {renderView()}
      </main>
      
      <footer className="mt-12 py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>Agenda Semanal &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
