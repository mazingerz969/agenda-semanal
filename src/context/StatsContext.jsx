import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTaskContext } from './TaskContext';

const StatsContext = createContext();

export const useUserStats = () => useContext(StatsContext);

export const StatsProvider = ({ children }) => {
  const { tasks } = useTaskContext();
  const [stats, setStats] = useState({
    completedToday: 0,
    completedThisWeek: 0,
    streak: 0,
    productiveHours: {},
    productiveDays: {},
    productivityTrend: 0,
    tasksByCategory: {},
    completionRate: 0
  });
  
  // Calcular estadísticas cuando cambian las tareas
  useEffect(() => {
    if (!tasks.length) return;
    
    // Obtener fecha actual
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = today - (now.getDay() * 24 * 60 * 60 * 1000);
    
    // Tareas completadas hoy
    const completedToday = tasks.filter(task => {
      if (!task.completed || !task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate.getTime() >= today;
    }).length;
    
    // Tareas completadas esta semana
    const completedThisWeek = tasks.filter(task => {
      if (!task.completed || !task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate.getTime() >= weekStart;
    }).length;
    
    // Calcular horas productivas
    const productiveHours = {};
    tasks.forEach(task => {
      if (task.completed && task.completedAt) {
        const hour = new Date(task.completedAt).getHours();
        productiveHours[hour] = (productiveHours[hour] || 0) + 1;
      }
    });
    
    // Calcular días productivos
    const productiveDays = {};
    tasks.forEach(task => {
      if (task.completed && task.completedAt) {
        const day = new Date(task.completedAt).getDay();
        productiveDays[day] = (productiveDays[day] || 0) + 1;
      }
    });
    
    // Calcular tasa de finalización
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Agrupar por categoría
    const tasksByCategory = {};
    tasks.forEach(task => {
      if (task.category) {
        tasksByCategory[task.category] = (tasksByCategory[task.category] || 0) + 1;
      }
    });
    
    // Calcular racha (días consecutivos con tareas completadas)
    // Simplificado para este ejemplo
    const streak = calculateStreak(tasks);
    
    // Tendencia de productividad (comparación con semana anterior)
    // Simplificado para este ejemplo
    const productivityTrend = 5; // Valor de ejemplo
    
    setStats({
      completedToday,
      completedThisWeek,
      streak,
      productiveHours,
      productiveDays,
      productivityTrend,
      tasksByCategory,
      completionRate
    });
  }, [tasks]);
  
  // Función para calcular racha
  const calculateStreak = (tasks) => {
    // Implementación simplificada
    return 3; // Valor de ejemplo
  };
  
  return (
    <StatsContext.Provider value={stats}>
      {children}
    </StatsContext.Provider>
  );
}; 
