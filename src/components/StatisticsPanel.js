import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const StatisticsPanel = ({ tasks = {} }) => {
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
    const allTasks = Object.values(tasks).flat();
    if (allTasks.length > 0) {
      processStatistics(allTasks);
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
        { name: 'Media', value: 45 },
        { name: 'Baja', value: 30 },
      ]);
      
      setCompletionStats({
        total: 45,
        completed: 35,
        pending: 10,
        completionRate: 78
      });
    }
  }, [tasks]);

  const processStatistics = (tasks) => {
    if (!tasks || tasks.length === 0) return;
    
    // Tareas por día
    const dayCount = {
      'Lun': 0, 'Mar': 0, 'Mié': 0, 'Jue': 0, 'Vie': 0, 'Sáb': 0, 'Dom': 0
    };
    
    // Tareas por categoría
    const categoryCount = {};
    
    // Tareas por prioridad
    const priorityCount = {
      'alta': 0, 'media': 0, 'baja': 0
    };
    
    // Estadísticas de completado
    let completed = 0;
    
    tasks.forEach(task => {
      // Contar por día si tiene fecha
      if (task.date) {
        const date = new Date(task.date);
        const day = date.getDay(); // 0 = domingo, 1 = lunes, ...
        const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][day];
        dayCount[dayName]++;
      } else {
        // Si no tiene fecha, usar el día de la semana asignado
        Object.entries(window.tasks || {}).forEach(([dayName, dayTasks]) => {
          if (dayTasks.some(t => t.id === task.id)) {
            const shortDay = dayName.substring(0, 3);
            dayCount[shortDay]++;
          }
        });
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

  const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
  const PRIORITY_COLORS = {
    'Alta': '#ef4444', // rojo
    'Media': '#f59e0b', // ámbar
    'Baja': '#10b981', // verde
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">Panel de Estadísticas</h2>
      
      {Object.values(tasks).flat().length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No hay datos suficientes para mostrar estadísticas.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Añade algunas tareas para ver las estadísticas.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-indigo-500 dark:text-indigo-400 mb-4">Tareas por Día</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tasksByDay}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} tareas`, 'Cantidad']}
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }}
                  />
                  <Bar dataKey="tasks" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-indigo-500 dark:text-indigo-400 mb-4">Tareas por Categoría</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={tasksByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {tasksByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tareas`, 'Cantidad']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-indigo-500 dark:text-indigo-400 mb-4">Tareas por Prioridad</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {tasksByPriority.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={PRIORITY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tareas`, 'Cantidad']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-indigo-500 dark:text-indigo-400 mb-4">Resumen de Productividad</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded">
                  <p className="text-gray-600 dark:text-gray-300">Total de Tareas</p>
                  <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{completionStats.total}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded">
                  <p className="text-gray-600 dark:text-gray-300">Tareas Completadas</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completionStats.completed}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900 p-4 rounded">
                  <p className="text-gray-600 dark:text-gray-300">Tareas Pendientes</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{completionStats.pending}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded">
                  <p className="text-gray-600 dark:text-gray-300">Porcentaje Completado</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{completionStats.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPanel; 