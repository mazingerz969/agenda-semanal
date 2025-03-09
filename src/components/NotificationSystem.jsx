import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

function NotificationSystem() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("Este navegador no soporta notificaciones");
      return;
    }
    
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === "granted");
  };
  
  const sendNotification = (task) => {
    if (notificationsEnabled) {
      new Notification("¡Recordatorio!", {
        body: `Es hora de: ${task?.title || "tu tarea"}`,
        icon: '/logo192.png'
      });
    }
  };
  
  return (
    <div className="flex items-center gap-2 p-2">
      <button 
        onClick={requestPermission}
        className="flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
      >
        {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
        {notificationsEnabled ? 'Notificaciones activadas' : 'Activar notificaciones'}
      </button>
    </div>
  );
}

export default NotificationSystem; 