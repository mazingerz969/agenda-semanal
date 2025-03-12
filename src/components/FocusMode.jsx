import React, { useState, useEffect } from 'react';

const FocusMode = ({ onEnterFocusMode, onExitFocusMode }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25); // Minutos
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // Segundos
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      // Sesión completada
      setIsRunning(false);
      setCompletedSessions(prev => prev + 1);
      handleExitFocusMode();
      
      // Notificar al usuario
      if (Notification.permission === 'granted') {
        new Notification('¡Tiempo de enfoque completado!', {
          body: 'Has completado tu sesión de enfoque. ¡Tómate un descanso!',
          icon: '/favicon.ico'
        });
      }
    }
    
    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);

  const handleEnterFocusMode = () => {
    setIsFocusMode(true);
    setTimeRemaining(focusDuration * 60);
    setIsRunning(true);
    
    // Solicitar permiso para notificaciones si no se ha hecho antes
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    onEnterFocusMode();
  };

  const handleExitFocusMode = () => {
    setIsFocusMode(false);
    setIsRunning(false);
    onExitFocusMode();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setTimeRemaining(focusDuration * 60);
    setIsRunning(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Modo de Enfoque</h2>
      
      {!isFocusMode ? (
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            El modo de enfoque te ayuda a concentrarte eliminando distracciones y utilizando la técnica Pomodoro.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duración (minutos)
            </label>
            <input 
              type="number" 
              min="1"
              max="120"
              value={focusDuration}
              onChange={(e) => setFocusDuration(parseInt(e.target.value) || 25)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <button 
            onClick={handleEnterFocusMode}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Iniciar Modo de Enfoque
          </button>
          
          {completedSessions > 0 && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Sesiones completadas hoy: {completedSessions}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="text-5xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            {formatTime(timeRemaining)}
          </div>
          
          <div className="flex justify-center space-x-3 mb-6">
            <button 
              onClick={handlePauseResume}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isRunning ? 'Pausar' : 'Reanudar'}
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reiniciar
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900 rounded">
            <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Consejos para mantener el enfoque:</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 text-left list-disc pl-5 space-y-1">
              <li>Silencia notificaciones en tu dispositivo</li>
              <li>Trabaja en un solo objetivo a la vez</li>
              <li>Mantén una postura cómoda pero alerta</li>
              <li>Toma un descanso corto cuando termine el temporizador</li>
            </ul>
          </div>
          
          <button 
            onClick={handleExitFocusMode}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Salir del Modo de Enfoque
          </button>
        </div>
      )}
    </div>
  );
};

export default FocusMode;

