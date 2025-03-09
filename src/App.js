import React, { useState, useEffect } from 'react';
import NotificationSystem from './components/NotificationSystem';
import DataManager from './components/DataManager';
import MonthlyCalendar from './components/MonthlyCalendar';
import StatisticsPanel from './components/StatisticsPanel';
import WeeklyPlanner from './components/WeeklyPlanner';

function App() {
  // Estado para almacenar las tareas
  const [tasks, setTasks] = useState([]);
  // Estado para controlar la vista actual (semanal o mensual)
  const [currentView, setCurrentView] = useState('weekly');
  // Estado para mostrar/ocultar estadísticas
  const [showStats, setShowStats] = useState(false);

  // Cargar tareas desde localStorage al iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem('agenda-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Datos de ejemplo para ver algo en la interfaz
      const exampleTasks = [
        {
          id: 1,
          title: 'Reunión de equipo',
          date: new Date(2025, 2, 10).toISOString(),
          priority: 'high',
          completed: false
        },
        {
          id: 2,
          title: 'Entregar informe',
          date: new Date(2025, 2, 12).toISOString(),
          priority: 'medium',
          completed: true
        },
        {
          id: 3,
          title: 'Revisar correos',
          date: new Date(2025, 2, 15).toISOString(),
          priority: 'low',
          completed: false
        }
      ];
      setTasks(exampleTasks);
    }
  }, []);

  // Guardar tareas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('agenda-tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Agenda Semanal</h1>
          
          <div className="flex items-center space-x-4">
            <NotificationSystem />
            <DataManager tasks={tasks} setTasks={setTasks} />
            
            {/* Selector de vista */}
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setCurrentView('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  currentView === 'weekly'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setCurrentView('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  currentView === 'monthly'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                Mensual
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Botón para mostrar/ocultar estadísticas */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {showStats ? 'Ocultar estadísticas' : 'Mostrar estadísticas'}
          </button>
        </div>
        
        {/* Panel de estadísticas */}
        {showStats && (
          <div className="mb-6">
            <StatisticsPanel tasks={tasks} />
          </div>
        )}
        
        {/* Vistas */}
        {currentView === 'weekly' ? (
          <WeeklyPlanner tasks={tasks} setTasks={setTasks} />
        ) : (
          <MonthlyCalendar tasks={tasks} />
        )}
      </main>
    </div>
  );
}

export default App; 