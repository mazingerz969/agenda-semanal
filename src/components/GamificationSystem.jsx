<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Award, Target, TrendingUp } from 'lucide-react';

function GamificationSystem({ tasks }) {
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    tasksCompleted: 0,
    achievements: []
  });
  
  const [showAchievement, setShowAchievement] = useState(null);
  
  // Definir logros disponibles
  const availableAchievements = [
    {
      id: 'first_task',
      title: 'Primer paso',
      description: 'Completar tu primera tarea',
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      condition: (stats) => stats.tasksCompleted >= 1,
      points: 10
    },
    {
      id: 'productive_day',
      title: 'Día productivo',
      description: 'Completar 5 tareas en un día',
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      condition: (stats, tasks) => {
        const today = new Date().toISOString().split('T')[0];
        const completedToday = tasks.filter(
          task => task.completed && new Date(task.completedAt).toISOString().split('T')[0] === today
        ).length;
        return completedToday >= 5;
      },
      points: 50
    },
    {
      id: 'streak_3',
      title: 'Constancia',
      description: 'Mantener una racha de 3 días',
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      condition: (stats) => stats.streak >= 3,
      points: 30
    },
    {
      id: 'streak_7',
      title: 'Semana perfecta',
      description: 'Mantener una racha de 7 días',
      icon: <Flame className="h-6 w-6 text-red-500" />,
      condition: (stats) => stats.streak >= 7,
      points: 100
    },
    {
      id: 'high_priority',
      title: 'Enfocado en lo importante',
      description: 'Completar 10 tareas de alta prioridad',
      icon: <Target className="h-6 w-6 text-red-500" />,
      condition: (stats, tasks) => {
        const highPriorityCompleted = tasks.filter(
          task => task.completed && task.priority === 'high'
        ).length;
        return highPriorityCompleted >= 10;
      },
      points: 75
    },
    {
      id: 'master_planner',
      title: 'Maestro organizador',
      description: 'Completar 50 tareas en total',
      icon: <Award className="h-6 w-6 text-purple-500" />,
      condition: (stats) => stats.tasksCompleted >= 50,
      points: 200
    }
  ];
  
  // Cargar estadísticas guardadas
  useEffect(() => {
    const savedStats = localStorage.getItem('agenda-gamification');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);
  
  // Actualizar estadísticas cuando cambian las tareas
  useEffect(() => {
    if (!Array.isArray(tasks)) return;
    
    // Calcular tareas completadas
    const completedTasks = tasks.filter(task => task.completed).length;
    
    // Calcular racha actual
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const completedToday = tasks.some(
      task => task.completed && new Date(task.completedAt).toISOString().split('T')[0] === today
    );
    
    const completedYesterday = tasks.some(
      task => task.completed && new Date(task.completedAt).toISOString().split('T')[0] === yesterday
    );
    
    let newStreak = stats.streak;
    
    if (completedToday) {
      if (completedYesterday || stats.lastActive === yesterday) {
        newStreak += 1;
      } else if (stats.lastActive !== today) {
        newStreak = 1;
      }
    } else if (stats.lastActive !== today) {
      newStreak = 0;
    }
    
    const longestStreak = Math.max(stats.longestStreak, newStreak);
    
    // Actualizar estadísticas
    const updatedStats = {
      ...stats,
      tasksCompleted: completedTasks,
      streak: newStreak,
      longestStreak,
      lastActive: today
    };
    
    // Verificar logros
    const newAchievements = [];
    
    availableAchievements.forEach(achievement => {
      const alreadyAchieved = stats.achievements.some(a => a.id === achievement.id);
      
      if (!alreadyAchieved && achievement.condition(updatedStats, tasks)) {
        newAchievements.push({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          achievedAt: new Date().toISOString(),
          points: achievement.points
        });
      }
    });
    
    if (newAchievements.length > 0) {
      const pointsToAdd = newAchievements.reduce((sum, a) => sum + a.points, 0);
      
      updatedStats.points += pointsToAdd;
      updatedStats.achievements = [...stats.achievements, ...newAchievements];
      
      // Calcular nivel (1 nivel cada 100 puntos)
      updatedStats.level = Math.floor(updatedStats.points / 100) + 1;
      
      // Mostrar notificación del logro más reciente
      setShowAchievement(newAchievements[newAchievements.length - 1]);
      
      // Ocultar notificación después de 5 segundos
      setTimeout(() => {
        setShowAchievement(null);
      }, 5000);
    }
    
    setStats(updatedStats);
    localStorage.setItem('agenda-gamification', JSON.stringify(updatedStats));
  }, [tasks, stats]);
  
  return (
    <div>
      {/* Panel de gamificación */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            Progreso
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Nivel {stats.level}
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Puntos y nivel */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Puntos: {stats.points}</span>
              <span>Siguiente nivel: {stats.level * 100}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-yellow-500 h-2.5 rounded-full" 
                style={{ width: `${(stats.points % 100) / 100 * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.tasksCompleted}
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400">
                Completadas
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center">
                {stats.streak} <Flame className="h-4 w-4 ml-1" />
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">
                Racha actual
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.longestStreak}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                Mejor racha
              </div>
            </div>
          </div>
          
          {/* Logros recientes */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Award className="h-4 w-4 mr-1" />
              Logros recientes
            </h4>
            
            <div className="space-y-2">
              {stats.achievements.length > 0 ? (
                stats.achievements.slice(-3).reverse().map(achievement => (
                  <div 
                    key={achievement.id}
                    className="flex items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-md"
                  >
                    <div className="mr-3">
                      {availableAchievements.find(a => a.id === achievement.id)?.icon || 
                        <Star className="h-6 w-6 text-yellow-500" />
                      }
                    </div>
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </div>
                    </div>
                    <div className="ml-auto text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      +{achievement.points}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  Completa tareas para desbloquear logros
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Notificación de logro */}
      {showAchievement && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs animate-slide-up z-50">
          <div className="flex items-start">
            <div className="mr-3">
              {availableAchievements.find(a => a.id === showAchievement.id)?.icon || 
                <Star className="h-8 w-8 text-yellow-500" />
              }
            </div>
            <div>
              <div className="font-bold">¡Nuevo logro desbloqueado!</div>
              <div className="font-medium">{showAchievement.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {showAchievement.description}
              </div>
              <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mt-1">
                +{showAchievement.points} puntos
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
=======
import React, { useMemo } from 'react';
import { Trophy, Award, TrendingUp } from 'lucide-react';

const GamificationSystem = ({ tasks = [] }) => {
  // Calcular puntos y logros basados en las tareas
  const { points, level, achievements, streak } = useMemo(() => {
    // Puntos base por tarea completada
    const basePoints = 10;
    
    // Puntos adicionales por prioridad
    const priorityPoints = {
      high: 15,
      medium: 10,
      low: 5
    };
    
    let totalPoints = 0;
    let currentStreak = 0;
    let achievedBadges = [];
    
    // Calcular puntos totales
    tasks.forEach(task => {
      if (task.completed) {
        // Puntos base por completar
        totalPoints += basePoints;
        
        // Puntos adicionales por prioridad
        totalPoints += priorityPoints[task.priority] || 0;
      }
    });
    
    // Calcular nivel (1 nivel cada 100 puntos)
    const userLevel = Math.max(1, Math.floor(totalPoints / 100) + 1);
    
    // Calcular racha actual (días consecutivos con tareas completadas)
    // Simplificado para este ejemplo
    currentStreak = Math.min(7, Math.floor(totalPoints / 50));
    
    // Determinar logros desbloqueados
    if (tasks.filter(t => t.completed).length >= 5) {
      achievedBadges.push({
        id: 'first_steps',
        name: 'Primeros Pasos',
        description: 'Completar 5 tareas',
        icon: '🏆'
      });
    }
    
    if (totalPoints >= 100) {
      achievedBadges.push({
        id: 'point_collector',
        name: 'Coleccionista de Puntos',
        description: 'Acumular 100 puntos',
        icon: '⭐'
      });
    }
    
    if (tasks.filter(t => t.priority === 'high' && t.completed).length >= 3) {
      achievedBadges.push({
        id: 'priority_master',
        name: 'Maestro de Prioridades',
        description: 'Completar 3 tareas de alta prioridad',
        icon: '🔥'
      });
    }
    
    return {
      points: totalPoints,
      level: userLevel,
      achievements: achievedBadges,
      streak: currentStreak
    };
  }, [tasks]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
          Sistema de Gamificación
        </h2>
        <div className="bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full">
          <span className="text-indigo-800 dark:text-indigo-200 font-medium">Nivel {level}</span>
        </div>
      </div>
      
      {/* Puntos y progreso */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300">Puntos totales</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{points}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${(points % 100) / 100 * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {100 - (points % 100)} puntos para el siguiente nivel
        </div>
      </div>
      
      {/* Racha actual */}
      <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-amber-500 mr-2" />
          <h3 className="font-medium text-amber-700 dark:text-amber-300">Racha actual</h3>
        </div>
        <div className="flex justify-between mt-2">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i < streak 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      
      {/* Logros */}
      <div>
        <div className="flex items-center mb-3">
          <Award className="h-5 w-5 text-purple-500 mr-2" />
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Logros desbloqueados</h3>
        </div>
        
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center"
              >
                <span className="text-2xl mr-2">{achievement.icon}</span>
                <div>
                  <h4 className="font-medium text-purple-700 dark:text-purple-300">{achievement.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Completa tareas para desbloquear logros
          </p>
        )}
      </div>
    </div>
  );
};
>>>>>>> origin/feature/fix-darkmode-and-assistant

export default GamificationSystem; 