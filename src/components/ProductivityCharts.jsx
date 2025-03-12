import React, { useEffect, useState } from 'react';
import { productivityAnalytics } from '../services/productivityAnalytics';

const ProductivityCharts = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    // Cargar estadísticas al montar el componente
    const loadStats = () => {
      const productivityStats = productivityAnalytics.getProductivityAnalysis();
      setStats(productivityStats);
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
  
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Gráfico de horas (versión simplificada) */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
          Productividad por hora del día
        </h3>
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-end h-full">
            {stats.hourlyProductivity.map((minutes, hour) => (
              <div key={hour} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-indigo-500 dark:bg-indigo-600 rounded-t"
                  style={{ 
                    height: `${Math.max(4, (minutes / Math.max(...stats.hourlyProductivity)) * 100)}%`,
                  }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {hour}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Gráfico de días (versión simplificada) */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
          Productividad por día de la semana
        </h3>
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-end h-full">
            {stats.dailyProductivity.map((minutes, day) => {
              const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
              return (
                <div key={day} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-green-500 dark:bg-green-600 rounded-t"
                    style={{ 
                      height: `${Math.max(4, (minutes / Math.max(...stats.dailyProductivity)) * 100)}%`,
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
      
      {/* Rendimiento por categoría (versión simplificada) */}
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
            <p>No hay datos de categorías disponibles.</p>
            <p className="text-sm mt-1">Completa tareas con categorías para ver estadísticas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductivityCharts; 
