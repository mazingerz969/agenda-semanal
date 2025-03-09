import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function StatisticsPanel({ tasks = [] }) {
  // Datos para el gráfico de barras (tareas por día)
  const tasksByDay = useMemo(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const shortDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    const countByDay = Array(7).fill(0);
    
    tasks.forEach(task => {
      const date = new Date(task.date);
      const dayOfWeek = date.getDay();
      countByDay[dayOfWeek]++;
    });
    
    return shortDays.map((day, index) => ({
      name: day,
      fullName: days[index],
      tasks: countByDay[index]
    }));
  }, [tasks]);
  
  // Datos para el gráfico circular (tareas por prioridad)
  const tasksByPriority = useMemo(() => {
    const priorities = {
      high: { name: 'Alta', count: 0, color: '#EF4444' },
      medium: { name: 'Media', count: 0, color: '#F59E0B' },
      low: { name: 'Baja', count: 0, color: '#10B981' }
    };
    
    tasks.forEach(task => {
      if (priorities[task.priority]) {
        priorities[task.priority].count++;
      }
    });
    
    return Object.values(priorities).filter(p => p.count > 0);
  }, [tasks]);
  
  // Estadísticas generales
  const stats = useMemo(() => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;
    const completionRate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
    
    return {
      total: tasks.length,
      completed,
      pending,
      completionRate: completionRate.toFixed(1)
    };
  }, [tasks]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Estadísticas de productividad</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de barras */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Tareas por día</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByDay}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [value, 'Tareas']}
                  labelFormatter={(label) => tasksByDay.find(d => d.name === label)?.fullName}
                />
                <Bar dataKey="tasks" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráfico circular */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Tareas por prioridad</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="count"
                  label={({ name, count }) => `${name}: ${count}`}
                >
                  {tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [value, 'Tareas']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Estadísticas generales */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-indigo-500 dark:text-indigo-300">Total de tareas</h4>
          <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-200">{stats.total}</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-green-500 dark:text-green-300">Completadas</h4>
          <p className="text-2xl font-bold text-green-700 dark:text-green-200">{stats.completed}</p>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-500 dark:text-yellow-300">Pendientes</h4>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-200">{stats.pending}</p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-blue-500 dark:text-blue-300">Tasa de completado</h4>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">{stats.completionRate}%</p>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPanel;
