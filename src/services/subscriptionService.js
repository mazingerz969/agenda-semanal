// Servicio para gestionar suscripciones y acceso a funcionalidades

// Niveles de suscripción
export const SUBSCRIPTION_LEVELS = {
  FREE: 'free',
  PREMIUM: 'premium',
  BUSINESS: 'business'
};

// Mapeo de características por nivel de suscripción
const FEATURES_BY_LEVEL = {
  [SUBSCRIPTION_LEVELS.FREE]: [
    'tasks.basic',
    'calendar.weekly',
    'theme',
    'categories.basic',
    'reminders.basic'
  ],
  [SUBSCRIPTION_LEVELS.PREMIUM]: [
    'tasks.unlimited',
    'calendar.sync',
    'ai.assistant',
    'gamification',
    'templates',
    'notes.rich',
    'focus.mode',
    'stats.advanced',
    'data.export',
    'no.ads'
  ],
  [SUBSCRIPTION_LEVELS.BUSINESS]: [
    'collaboration',
    'task.assignment',
    'reports',
    'integrations',
    'support.priority',
    'admin.panel'
  ]
};

// Obtener nivel de suscripción actual del usuario
export const getCurrentSubscriptionLevel = () => {
  // En una implementación real, esto verificaría con el backend
  // Por ahora, leemos del localStorage para desarrollo
  const storedLevel = localStorage.getItem('subscriptionLevel');
  return storedLevel || SUBSCRIPTION_LEVELS.FREE;
};

// Verificar si el usuario tiene acceso a una característica
export const hasAccess = (featureId) => {
  const currentLevel = getCurrentSubscriptionLevel();
  
  // Si es BUSINESS, tiene acceso a todo
  if (currentLevel === SUBSCRIPTION_LEVELS.BUSINESS) {
    return true;
  }
  
  // Si es PREMIUM, tiene acceso a características FREE y PREMIUM
  if (currentLevel === SUBSCRIPTION_LEVELS.PREMIUM) {
    return FEATURES_BY_LEVEL[SUBSCRIPTION_LEVELS.FREE].includes(featureId) || 
           FEATURES_BY_LEVEL[SUBSCRIPTION_LEVELS.PREMIUM].includes(featureId);
  }
  
  // Si es FREE, solo tiene acceso a características FREE
  return FEATURES_BY_LEVEL[SUBSCRIPTION_LEVELS.FREE].includes(featureId);
};

// Verificar si el usuario ha alcanzado límites (ej: número máximo de tareas)
export const checkLimit = (limitType) => {
  const currentLevel = getCurrentSubscriptionLevel();
  
  switch (limitType) {
    case 'tasks':
      if (currentLevel === SUBSCRIPTION_LEVELS.FREE) {
        // Verificar si el usuario ha alcanzado el límite de 20 tareas
        // En una implementación real, esto consultaría el número actual de tareas
        const taskCount = JSON.parse(localStorage.getItem('tasks') || '[]').length;
        return {
          limited: true,
          current: taskCount,
          max: 20,
          reached: taskCount >= 20
        };
      }
      return { limited: false };
    
    default:
      return { limited: false };
  }
};

// Mostrar mensaje de actualización para características premium
export const showUpgradeMessage = (feature) => {
  return {
    title: 'Característica Premium',
    message: `La característica "${feature}" está disponible en el plan Premium. ¿Deseas actualizar tu cuenta?`,
    upgradeUrl: '/pricing'
  };
};

