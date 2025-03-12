import React, { useState, useEffect, useMemo } from 'react';

const AdvancedStatistics = ({ tasks }) => {
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Obtener categorías únicas de las tareas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(tasks.map(task => task.category))];
    return ['all', ...uniqueCategories];
  }, [tasks]);

  // Filtrar tareas según el rango de tiempo seleccionado
  const filteredTasks = useMemo(() => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      const matchesDate = taskDate >= startDate && taskDate <= now;
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
      return matchesDate && matchesCategory;
    });
  }, [tasks, timeRange, categoryFilter]);

  // Calcular estadísticas
  const statistics = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.completed).length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    // Agrupar por prioridad
    const byPriority = {
      high: filteredTasks.filter(task => task.priority === 'high').length,
      medium: filteredTasks.filter(task => task.priority === 'medium').length,
      low: filteredTasks.filter(task => task.priority === 'low').length,
    };
    
    // Agrupar por categoría
    const byCategory = {};
    filteredTasks.forEach(task => {
      if (!byCategory[task.category]) {
        byCategory[task.category] = 0;
      }
      byCategory[task.category]++;
    });
    
    // Calcular tendencia de completado (últimos 7 días)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const completionTrend = last7Days.map(date => {
      const dayTasks = filteredTasks.filter(task => task.date === date);
      const dayCompleted = dayTasks.filter(task => task.completed).length;
      const dayTotal = dayTasks.length;
      return {
        date,
        completionRate: dayTotal > 0 ? (dayCompleted / dayTotal) * 100 : 0,
        total: dayTotal,
        completed: dayCompleted
      };
    });
    
    // Calcular tiempo promedio de completado (en días)
    let avgCompletionTime = 0;
    const tasksWithCompletionTime = filteredTasks.filter(task => 
      task.completed && task.completedAt && task.createdAt
    );
    
    if (tasksWithCompletionTime.length > 0) {
      const totalDays = tasksWithCompletionTime.reduce((sum, task) => {
        const created = new Date(task.createdAt);
        const completed = new Date(task.completedAt);
        const diffTime = Math.abs(completed - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      
      avgCompletionTime = totalDays / tasksWithCompletionTime.length;
    }
    
    return {
      total,
      completed,
      pending: total - completed,
      completionRate,
      byPriority,
      byCategory,
      completionTrend,
      avgCompletionTime
    };
  }, [filteredTasks]);

  // Renderizar gráfico de barras simple para categorías
  const renderCategoryChart = () => {
    const categories = Object.keys(statistics.byCategory);
    const maxValue = Math.max(...Object.values(statistics.byCategory), 1);
    
    return (
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Tareas por categoría</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center">
              <span className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate">{category}</span>
              <div className="flex-grow h-5 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${(statistics.byCategory[category] / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {statistics.byCategory[category]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar gráfico de tendencia de completado
  const renderCompletionTrend = () => {
    const maxValue = Math.max(...statistics.completionTrend.map(day => day.total), 1);
    
    return (
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Tendencia de completado (7 días)</h3>
        <div className="flex items-end h-40 space-x-1">
          {statistics.completionTrend.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-grow">
              <div className="flex flex-col-reverse w-full">
                <div 
                  className="bg-green-500 rounded-t"
                  style={{ height: `${(day.completed / maxValue) * 100}%` }}
                ></div>
                <div 
                  className="bg-red-400 rounded-t"
                  style={{ height: `${((day.total - day.completed) / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>Completadas</span>
          <span>Pendientes</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Estadísticas Avanzadas</h2>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Período
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="year">Último año</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoría
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Tareas totales</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{statistics.total}</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Completadas</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">{statistics.completed}</p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded">
          <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Tasa de completado</h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            {statistics.completionRate.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Distribución por prioridad</h3>
        <div className="flex h-8 rounded overflow-hidden">
          <div 
            className="bg-red-500" 
            style={{ width: `${(statistics.byPriority.high / statistics.total) * 100}%` }}
            title={`Alta: ${statistics.byPriority.high}`}
          ></div>
          <div 
            className="bg-yellow-500" 
            style={{ width: `${(statistics.byPriority.medium / statistics.total) * 100}%` }}
            title={`Media: ${statistics.byPriority.medium}`}
          ></div>
          <div 
            className="bg-green-500" 
            style={{ width: `${(statistics.byPriority.low / statistics.total) * 100}%` }}
            title={`Baja: ${statistics.byPriority.low}`}
          ></div>
        </div>
        <div className="flex text-xs mt-1 text-gray-600 dark:text-gray-400 justify-between">
          <span>Alta: {statistics.byPriority.high}</span>
          <span>Media: {statistics.byPriority.medium}</span>
          <span>Baja: {statistics.byPriority.low}</span>
        </div>
      </div>
      
      {renderCategoryChart()}
      
      {renderCompletionTrend()}
      
      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded">
        <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Tiempo promedio de completado</h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {statistics.avgCompletionTime.toFixed(1)} días
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tiempo promedio desde la creación hasta la finalización de tareas
        </p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">Resumen</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {statistics.completionRate > 75 
            ? '¡Excelente trabajo! Tu tasa de completado es muy alta.'
            : statistics.completionRate > 50
              ? 'Buen trabajo. Estás completando más de la mitad de tus tareas.'
              : 'Hay margen de mejora en tu tasa de completado de tareas.'}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {statistics.byPriority.high > (statistics.byPriority.medium + statistics.byPriority.low)
            ? 'Tienes muchas tareas de alta prioridad. Considera redistribuir tu carga de trabajo.'
            : 'Tu distribución de prioridades parece equilibrada.'}
        </p>
      </div>
    </div>
  );
};

export default AdvancedStatistics;
