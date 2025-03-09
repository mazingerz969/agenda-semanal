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

export default GamificationSystem; 