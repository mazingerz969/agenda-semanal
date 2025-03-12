// Servicio para gestionar pruebas gratuitas
import React from 'react';

// Duración de la prueba en días
const TRIAL_DURATION_DAYS = 14;

// Iniciar una prueba gratuita
export const startFreeTrial = () => {
  const now = new Date();
  const trialEndDate = new Date(now);
  trialEndDate.setDate(now.getDate() + TRIAL_DURATION_DAYS);
  
  const trialData = {
    active: true,
    startDate: now.toISOString(),
    endDate: trialEndDate.toISOString(),
    plan: 'premium'
  };
  
  // Guardar datos de la prueba en localStorage (en una implementación real, esto estaría en el backend)
  localStorage.setItem('trialData', JSON.stringify(trialData));
  
  // También actualizar el nivel de suscripción
  localStorage.setItem('subscriptionLevel', 'premium');
  
  return trialData;
};

// Verificar estado de la prueba gratuita
export const checkTrialStatus = () => {
  const trialDataString = localStorage.getItem('trialData');
  
  if (!trialDataString) {
    return {
      active: false,
      eligible: true, // El usuario es elegible para una prueba si nunca ha tenido una
      daysLeft: 0
    };
  }
  
  const trialData = JSON.parse(trialDataString);
  const now = new Date();
  const endDate = new Date(trialData.endDate);
  
  // Calcular días restantes
  const diffTime = endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Verificar si la prueba sigue activa
  if (diffDays <= 0) {
    // La prueba ha expirado, actualizar estado
    localStorage.setItem('subscriptionLevel', 'free');
    
    return {
      active: false,
      eligible: false, // Ya ha usado su prueba gratuita
      daysLeft: 0,
      expired: true
    };
  }
  
  return {
    active: true,
    eligible: false, // Ya está en una prueba activa
    daysLeft: diffDays,
    endDate: trialData.endDate
  };
};

// Mostrar recordatorio de fin de prueba
export const getTrialReminder = () => {
  const status = checkTrialStatus();
  
  if (!status.active) {
    return null;
  }
  
  // Mostrar recordatorios más frecuentes cuando queden pocos días
  if (status.daysLeft <= 3) {
    return {
      type: 'urgent',
      message: `Tu prueba gratuita termina en ${status.daysLeft} ${status.daysLeft === 1 ? 'día' : 'días'}. ¡Suscríbete ahora para no perder acceso a las características premium!`,
      action: 'Suscribirse ahora'
    };
  } else if (status.daysLeft <= 7) {
    return {
      type: 'warning',
      message: `Quedan ${status.daysLeft} días de tu prueba gratuita. Considera suscribirte para mantener todas las funcionalidades.`,
      action: 'Ver planes'
    };
  }
  
  return {
    type: 'info',
    message: `Estás disfrutando de tu prueba gratuita. Quedan ${status.daysLeft} días.`,
    action: 'Más información'
  };
};

// Finalizar prueba gratuita (por ejemplo, si el usuario se suscribe)
export const endTrial = () => {
  const trialDataString = localStorage.getItem('trialData');
  
  if (trialDataString) {
    const trialData = JSON.parse(trialDataString);
    
    // Marcar la prueba como finalizada
    trialData.active = false;
    trialData.endedEarly = true;
    trialData.endedAt = new Date().toISOString();
    
    localStorage.setItem('trialData', JSON.stringify(trialData));
  }
};

// Componente para mostrar banner de prueba gratuita
export const TrialBanner = ({ onStartTrial, onViewPlans }) => {
  const status = checkTrialStatus();
  
  if (status.active) {
    // Mostrar banner de prueba activa
    const reminder = getTrialReminder();
    
    return (
      <div className={`p-3 ${
        reminder.type === 'urgent' 
          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
          : reminder.type === 'warning'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      } rounded-md flex justify-between items-center`}>
        <p>{reminder.message}</p>
        <button 
          onClick={onViewPlans}
          className="px-3 py-1 bg-white dark:bg-gray-800 rounded-md text-sm font-medium"
        >
          {reminder.action}
        </button>
      </div>
    );
  } else if (status.eligible) {
    // Mostrar banner para iniciar prueba gratuita
    return (
      <div className="p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-md flex justify-between items-center">
        <p>¡Prueba todas las funcionalidades premium gratis durante 14 días!</p>
        <button 
          onClick={onStartTrial}
          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
        >
          Iniciar prueba gratuita
        </button>
      </div>
    );
  } else if (status.expired) {
    // Mostrar banner de prueba expirada
    return (
      <div className="p-3 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded-md flex justify-between items-center">
        <p>Tu prueba gratuita ha terminado. ¡Suscríbete para seguir disfrutando de todas las funcionalidades!</p>
        <button 
          onClick={onViewPlans}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Ver planes
        </button>
      </div>
    );
  }
  
  return null;
};