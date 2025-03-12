import React, { useState, useEffect } from 'react';
import { productivityAnalytics } from '../services/productivityAnalytics';
import { Clock, Calendar, Tag, BarChart2, RefreshCw } from 'lucide-react';
import { trackEvent } from '../services/analyticsService';

// Importación dinámica de Chart.js para reducir el tamaño del bundle inicial
const ProductivityCharts = React.lazy(() => import('./ProductivityCharts'));

const ProductivityPanel = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);
  
  // Cargar estadísticas al montar el componente
  useEffect(() => {
    const loadStats = () => {
      const productivityStats = productivityAnalytics.getProductivityAnalysis();
      setStats(productivityStats);
      setLoading(false);
    };
    
    loadStats();
    
    // Actualizar estadísticas cuando cambie el estado de productividad
    const handleProductivityUpdate = () => {
      loadStats();
    };
    
    window.addEventListener('productivity-updated', handleProductivityUpdate);
    
    return () => {
      window.removeEventListener('productivity-updated', handleProductivityUpdate);
    };
  }, []);
  
  // Manejar cambio de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    trackEvent('Productivity', 'change_tab', tab);
  };
  
  // Manejar reinicio de estadísticas
  const handleResetStats = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar todas las estadísticas de productividad? Esta acción no se puede deshacer.')) {
      productivityAnalytics.resetStats();
      setStats(productivityAnalytics.getProductivityAnalysis());
      trackEvent('Productivity', 'reset_stats', 'confirmed');
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Cabecera */}
      <div className="border-b dark:border-gray-700 px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Análisis de Productividad
        </h2>
        <button
          onClick={handleResetStats}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title="Reiniciar estadísticas"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      
      {/* Pestañas */}
      <div className="border-b dark:border-gray-700">
        <nav className="flex">
          <button
            onClick={() => handleTabChange('summary')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'summary'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => handleTabChange('time')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'time'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Tiempo
          </button>
          <button
            onClick={() => handleTabChange('categories')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'categories'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Categorías
          </button>
          <button
            onClick={() => handleTabChange('charts')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'charts'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Gráficos
          </button>
        </nav>
      </div>
      
      {/* Contenido */}
      <div className="p-4">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Hora más productiva */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                    Hora más productiva
                  </h3>
                </div>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">
                  {stats.mostProductiveHourFormatted}
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                  {stats.hourlyProductivity[stats.mostProductiveHour]} minutos de actividad
                </p>
              </div>
              
              {/* Día más productivo */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                    Día más productivo
                  </h3>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                  {stats.mostProductiveDayName}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  {stats.dailyProductivity[stats.mostProductiveDay]} minutos de actividad
                </p>
              </div>
              
              {/* Categoría más eficiente */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Tag className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Categoría más eficiente
                  </h3>
                </div>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
                  {stats.mostEfficientCategory || 'Sin datos'}
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  {stats.mostEfficientCategory && stats.categoryPerformance[stats.mostEfficientCategory]
                    ? `${stats.categoryPerformance[stats.mostEfficientCategory].averageTimeMinutes} min/tarea`
                    : 'Completa tareas para ver estadísticas'}
                </p>
              </div>
            </div>
            
            {/* Tiempo total productivo */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
              <div className="flex items-center mb-2">
                <BarChart2 className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300">
                  Tiempo total productivo
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                {stats.totalProductiveTimeMinutes} minutos
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                {Math.floor(stats.totalProductiveTimeMinutes / 60)} horas y {stats.totalProductiveTimeMinutes % 60} minutos
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'time' && (
          <div className="space-y-4">
            {/* Productividad por hora */}
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                Productividad por hora del día
              </h3>
              <div className="grid grid-cols-6 gap-1">
                {stats.hourlyProductivity.map((minutes, hour) => (
                  <div key={hour} className="flex flex-col items-center">
                    <div 
                      className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t"
                      style={{ 
                        height: `${Math.min(100, minutes / 2)}px`,
                        minHeight: minutes > 0 ? '4px' : '1px'
                      }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {hour}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Productividad por día */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                Productividad por día de la semana
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {stats.dailyProductivity.map((minutes, day) => {
                  const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
                  return (
                    <div key={day} className="flex flex-col items-center">
                      <div 
                        className="w-full bg-green-100 dark:bg-green-900/30 rounded-t"
                        style={{ 
                          height: `${Math.min(100, minutes / 3)}px`,
                          minHeight: minutes > 0 ? '4px' : '1px'
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {dayNames[day]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div>
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              Rendimiento por categoría
            </h3>
            
            {Object.keys(stats.categoryPerformance).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.categoryPerformance).map(([category, data]) => (
                  <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {category}
                      </h4>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-full">
                        {data.tasksCompleted} tareas
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Tiempo total: {data.totalTimeMinutes} min</span>
                      <span>Promedio: {data.averageTimeMinutes} min/tarea</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div 
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (data.averageTimeMinutes / 60) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Tag className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No hay datos de categorías disponibles.</p>
                <p className="text-sm mt-1">Completa tareas con categorías para ver estadísticas.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'charts' && (
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          }>
            <ProductivityCharts />
          </React.Suspense>
        )}
      </div>
    </div>
  );
};

export default ProductivityPanel; 