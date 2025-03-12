import React, { useState, useEffect, useRef } from 'react';
import { productivityAnalytics } from '../services/productivityAnalytics';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { trackEvent } from '../services/analyticsService';

const TaskTimer = ({ task }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);
  
  // Inicializar temporizador
  useEffect(() => {
    return () => {
      // Limpiar temporizador al desmontar
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Si el temporizador estaba corriendo, registrar pausa
      if (isRunning) {
        productivityAnalytics.pauseTaskWork(task.id);
      }
    };
  }, [isRunning, task.id]);
  
  // Formatear tiempo en formato HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Iniciar temporizador
  const startTimer = () => {
    if (isRunning) return;
    
    // Registrar inicio o reanudación
    if (startTime === null) {
      productivityAnalytics.startTaskWork(task.id);
    } else {
      productivityAnalytics.resumeTaskWork(task.id);
    }
    
    setIsRunning(true);
    setStartTime(Date.now() - elapsedTime * 1000);
    
    timerRef.current = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(currentElapsed);
    }, 1000);
    
    trackEvent('Task', 'start_timer', task.id);
  };
  
  // Pausar temporizador
  const pauseTimer = () => {
    if (!isRunning) return;
    
    clearInterval(timerRef.current);
    setIsRunning(false);
    
    productivityAnalytics.pauseTaskWork(task.id);
    trackEvent('Task', 'pause_timer', task.id);
  };
  
  // Detener temporizador
  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
    
    productivityAnalytics.completeTaskWork(task.id, task);
    trackEvent('Task', 'stop_timer', task.id);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 flex items-center">
        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
        <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
      </div>
      
      <div className="flex space-x-1">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-800/40"
            title="Iniciar temporizador"
          >
            <Play size={14} />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-800/40"
            title="Pausar temporizador"
          >
            <Pause size={14} />
          </button>
        )}
        
        <button
          onClick={stopTimer}
          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-800/40"
          title="Detener y guardar"
          disabled={!isRunning && elapsedTime === 0}
        >
          <Square size={14} />
        </button>
      </div>
    </div>
  );
};

export default TaskTimer; 