import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';

function NotificationSystem({ tasks }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    reminderTime: 15, // minutos antes
    soundEnabled: true,
    notifyOnlyHighPriority: false
  });
  
  // Verificar permisos al cargar
  useEffect(() => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      setNotificationsEnabled(permission === 'granted');
    }
  }, []);
  
  // Configurar notificaciones para tareas
  useEffect(() => {
    if (!notificationsEnabled || !tasks || !Array.isArray(tasks)) return;
    
    // Limpiar notificaciones anteriores
    const timers = [];
    
    // Programar notificaciones para tareas futuras
    tasks.forEach(task => {
      if (task.completed) return;
      if (notificationSettings.notifyOnlyHighPriority && task.priority !== 'high') return;
      
      const taskDate = new Date(task.date);
      if (isNaN(taskDate.getTime())) return;
      
      // Si tiene hora específica, usar esa
      if (task.time) {
        const [hours, minutes] = task.time.split(':').map(Number);
        taskDate.setHours(hours, minutes);
      }
      
      // Calcular tiempo de recordatorio (minutos antes)
      const reminderDate = new Date(taskDate);
      reminderDate.setMinutes(reminderDate.getMinutes() - notificationSettings.reminderTime);
      
      // Si la fecha de recordatorio ya pasó, no programar
      if (reminderDate <= new Date()) return;
      
      // Programar notificación
      const timerId = setTimeout(() => {
        sendNotification(task);
      }, reminderDate.getTime() - Date.now());
      
      timers.push(timerId);
    });
    
    // Limpiar timers al desmontar
    return () => {
      timers.forEach(id => clearTimeout(id));
    };
  }, [tasks, notificationsEnabled, notificationSettings]);
  
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador no soporta notificaciones de escritorio');
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        new Notification('¡Notificaciones activadas!', {
          body: 'Ahora recibirás recordatorios para tus tareas',
          icon: '/logo192.png'
        });
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  };
  
  const sendNotification = (task) => {
    if (notificationsEnabled) {
      const notification = new Notification("¡Recordatorio!", {
        body: `Es hora de: ${task?.title || "tu tarea"}`,
        icon: '/logo192.png'
      });
      
      if (notificationSettings.soundEnabled) {
        // Reproducir sonido
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('Error al reproducir sonido:', e));
      }
      
      // Cerrar automáticamente después de 5 segundos
      setTimeout(() => notification.close(), 5000);
    }
  };
  
  const toggleNotifications = () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
    } else {
      requestPermission();
    }
  };
  
  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleNotifications}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label={notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
        >
          {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Configurar notificaciones"
        >
          <Settings size={18} />
        </button>
      </div>
      
      {showSettings && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 z-10">
          <h3 className="text-sm font-medium mb-3">Configuración de notificaciones</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Recordar
              </label>
              <select
                value={notificationSettings.reminderTime}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  reminderTime: Number(e.target.value)
                })}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value={5}>5 minutos antes</option>
                <option value={15}>15 minutos antes</option>
                <option value={30}>30 minutos antes</option>
                <option value={60}>1 hora antes</option>
                <option value={120}>2 horas antes</option>
                <option value={1440}>1 día antes</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sound-enabled"
                checked={notificationSettings.soundEnabled}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  soundEnabled: e.target.checked
                })}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="sound-enabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Reproducir sonido
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="high-priority-only"
                checked={notificationSettings.notifyOnlyHighPriority}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  notifyOnlyHighPriority: e.target.checked
                })}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="high-priority-only" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Solo tareas de alta prioridad
              </label>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowSettings(false)}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationSystem; 
