import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatisticsPanel = ({ tasks = [] }) => {
  const [tasksByDay, setTasksByDay] = useState([]);
  const [tasksByCategory, setTasksByCategory] = useState([]);
  const [tasksByPriority, setTasksByPriority] = useState([]);
  const [completionStats, setCompletionStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });

  useEffect(() => {
    // Procesar estadísticas cuando cambian las tareas
    if (Array.isArray(tasks) && tasks.length > 0) {
      processStatistics(tasks);
    } else {
      // Usar datos de ejemplo si no hay tareas
      setTasksByDay([
        { day: 'Lun', tasks: 5 },
        { day: 'Mar', tasks: 3 },
        { day: 'Mié', tasks: 7 },
        { day: 'Jue', tasks: 4 },
        { day: 'Vie', tasks: 6 },
        { day: 'Sáb', tasks: 2 },
        { day: 'Dom', tasks: 1 },
      ]);
      
      setTasksByCategory([
        { name: 'Trabajo', value: 40 },
        { name: 'Personal', value: 30 },
        { name: 'Estudio', value: 20 },
        { name: 'Otros', value: 10 },
      ]);
      
      setTasksByPriority([
        { name: 'Alta', value: 25 },
        { name: 'Media', value: 50 },
        { name: 'Baja', value: 25 },
      ]);
      
      setCompletionStats({
        total: 10,
        completed: 4,
        pending: 6,
        completionRate: 40
      });
    }
  }, [tasks]);

  const processStatistics = (tasks) => {
    if (!Array.isArray(tasks) || tasks.length === 0) return;
    
    // Contadores
    const dayCount = {
      'Lun': 0, 'Mar': 0, 'Mié': 0, 'Jue': 0, 'Vie': 0, 'Sáb': 0, 'Dom': 0
    };
    const categoryCount = {};
    const priorityCount = { 'alta': 0, 'media': 0, 'baja': 0 };
    let completed = 0;
    
    // Mapeo de día de la semana a abreviatura
    const dayMap = {
      0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb'
    };
    
    tasks.forEach(task => {
      // Contar por día si tiene fecha
      if (task.date) {
        const date = new Date(task.date);
        const day = date.getDay(); // 0 = domingo, 1 = lunes, ...
        dayCount[dayMap[day]]++;
      }
      
      // Contar por categoría
      const category = task.category || 'otros';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      
      // Contar por prioridad
      const priority = task.priority || 'media';
      priorityCount[priority]++;
      
      // Contar completadas
      if (task.completed) {
        completed++;
      }
    });
    
    // Formatear datos para gráficos
    const tasksByDayData = Object.entries(dayCount).map(([day, count]) => ({
      day,
      tasks: count
    }));
    
    const tasksByCategoryData = Object.entries(categoryCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
    
    const tasksByPriorityData = Object.entries(priorityCount).map(([name, value]) => ({
      name: name === 'alta' ? 'Alta' : name === 'media' ? 'Media' : 'Baja',
      value
    }));
    
    // Calcular estadísticas
    const total = tasks.length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Actualizar estado
    setTasksByDay(tasksByDayData);
    setTasksByCategory(tasksByCategoryData);
    setTasksByPriority(tasksByPriorityData);
    setCompletionStats({
      total,
      completed,
      pending,
      completionRate
    });
  };

  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const PRIORITY_COLORS = {
    'Alta': '#ef4444',
    'Media': '#f59e0b',
    'Baja': '#10b981'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      
      {Array.isArray(tasks) && tasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No hay suficientes datos para mostrar estadísticas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de tareas por día */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tareas por día</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tasksByDay}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} tareas`, 'Cantidad']}
                    labelFormatter={(label) => `Día: ${label}`}
                  />
                  <Bar dataKey="tasks" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Gráfico de tareas por categoría */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tareas por categoría</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Tooltip formatter={(value) => [`${value} tareas`, 'Cantidad']} />
                  <Pie
                    data={tasksByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {tasksByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Gráfico de tareas por prioridad */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tareas por prioridad</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Tooltip formatter={(value) => [`${value} tareas`, 'Cantidad']} />
                  <Pie
                    data={tasksByPriority}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {tasksByPriority.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={PRIORITY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Estadísticas de completado */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Resumen de progreso</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Completado ({completionStats.completionRate}%)</span>
                  <span>{completionStats.completed}/{completionStats.total}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${completionStats.completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Pendientes</div>
                  <div className="text-2xl font-bold">{completionStats.pending}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Completadas</div>
                  <div className="text-2xl font-bold">{completionStats.completed}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel; 
