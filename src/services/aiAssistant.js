import { extractKeywords, extractDates, detectPriority, calculateTextSimilarity } from '../utils/textAnalysis';

// Estructura para respuestas contextuales
const contextualResponses = {
  taskCreation: [
    "Parece que estás creando una tarea relacionada con {category}. ¿Quieres establecer una fecha límite?",
    "He notado que esta tarea es similar a {similarTask}. ¿Quieres vincularlas?",
    "Basado en tus hábitos, el mejor momento para programar esta tarea sería {suggestedTime}.",
    "Esta tarea parece importante. ¿Quieres marcarla como prioritaria?",
    "¿Deseas añadir subtareas a esta actividad para organizarla mejor?"
  ],
  taskCompletion: [
    "¡Felicidades por completar esta tarea! Has ganado {points} puntos.",
    "Buen trabajo. Has completado {completedToday} tareas hoy.",
    "Estás en racha. Has completado tareas durante {streak} días consecutivos.",
    "Esta semana has sido un {productivityLevel}% más productivo que la semana pasada.",
    "¿Quieres programar una tarea similar para el futuro?"
  ],
  productivity: [
    "Tu hora más productiva parece ser {productiveHour}. ¿Quieres programar tareas importantes durante ese período?",
    "He notado que completas más tareas los {productiveDay}. ¿Quieres reorganizar tu agenda?",
    "Las tareas con etiqueta {productiveTag} tienen mayor tasa de finalización.",
    "Podrías mejorar tu productividad utilizando la técnica Pomodoro para tareas como esta.",
    "¿Has considerado agrupar tareas similares? Podría aumentar tu eficiencia."
  ],
  general: [
    "¿En qué puedo ayudarte hoy?",
    "¿Necesitas organizar mejor tus tareas?",
    "¿Quieres que te sugiera formas de mejorar tu productividad?",
    "Estoy aquí para ayudarte a gestionar mejor tu tiempo.",
    "¿Tienes alguna pregunta sobre cómo usar la aplicación?"
  ]
};

// Determinar el tipo de contexto
const determineContextType = (currentTask) => {
  if (!currentTask) return 'general';
  
  if (currentTask.completed) {
    return 'taskCompletion';
  } else if (currentTask.id && currentTask.createdAt) {
    return 'productivity';
  } else {
    return 'taskCreation';
  }
};

// Extraer categoría de una tarea
const extractCategory = (task) => {
  if (!task) return 'general';
  return task.category || 'sin categoría';
};

// Encontrar tareas similares
const findSimilarTasks = (tasks, currentTask) => {
  if (!tasks || !currentTask || !currentTask.content) return [];
  
  const similarTasks = tasks
    .filter(task => task.id !== currentTask.id)
    .map(task => ({
      ...task,
      similarity: calculateTextSimilarity(currentTask.content, task.content)
    }))
    .filter(task => task.similarity > 0.3)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
  
  return similarTasks;
};

// Calcular hora más productiva
const calculateProductiveTime = (userStats) => {
  if (!userStats || !userStats.productiveHours) return 'mañana';
  
  const hours = Object.entries(userStats.productiveHours);
  if (hours.length === 0) return 'mañana';
  
  hours.sort((a, b) => b[1] - a[1]);
  const mostProductiveHour = parseInt(hours[0][0]);
  
  if (mostProductiveHour < 12) {
    return 'mañana';
  } else if (mostProductiveHour < 18) {
    return 'tarde';
  } else {
    return 'noche';
  }
};

// Calcular día más productivo
const calculateProductiveDay = (userStats) => {
  if (!userStats || !userStats.productiveDays) return 'lunes';
  
  const days = Object.entries(userStats.productiveDays);
  if (days.length === 0) return 'lunes';
  
  days.sort((a, b) => b[1] - a[1]);
  const mostProductiveDay = parseInt(days[0][0]);
  
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dayNames[mostProductiveDay];
};

// Contar tareas completadas hoy
const countCompletedToday = (tasks) => {
  if (!tasks) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    completedDate.setHours(0, 0, 0, 0);
    return completedDate.getTime() === today.getTime();
  }).length;
};

// Calcular racha de productividad
const calculateStreak = (userStats) => {
  return userStats?.streak || 0;
};

// Calcular tendencia de productividad
const calculateProductivityTrend = (userStats) => {
  return userStats?.productivityTrend || 0;
};

// Sugerir categorías basadas en palabras clave
const suggestCategories = (keywords) => {
  if (!keywords || keywords.length === 0) return [];
  
  // Mapeo de palabras clave a categorías
  const categoryMappings = {
    'trabajo': ['proyecto', 'reunión', 'informe', 'cliente', 'presentación', 'email', 'correo'],
    'personal': ['casa', 'familia', 'amigos', 'salud', 'ejercicio', 'médico'],
    'estudio': ['curso', 'clase', 'examen', 'tarea', 'estudiar', 'leer', 'libro'],
    'compras': ['comprar', 'tienda', 'supermercado', 'lista', 'mercado'],
    'finanzas': ['banco', 'pagar', 'factura', 'dinero', 'presupuesto', 'ahorro'],
    'ocio': ['película', 'juego', 'descanso', 'viaje', 'vacaciones', 'diversión']
  };
  
  // Contar coincidencias por categoría
  const categoryMatches = {};
  
  keywords.forEach(keyword => {
    Object.entries(categoryMappings).forEach(([category, relatedWords]) => {
      if (relatedWords.includes(keyword) || category.includes(keyword)) {
        categoryMatches[category] = (categoryMatches[category] || 0) + 1;
      }
    });
  });
  
  // Ordenar categorías por número de coincidencias
  const sortedCategories = Object.keys(categoryMatches)
    .sort((a, b) => categoryMatches[b] - categoryMatches[a]);
  
  return sortedCategories.length > 0 ? sortedCategories : ['general'];
};

// Sugerir prioridad basada en palabras clave
const suggestPriority = (keywords, content) => {
  const detectedPriority = detectPriority(content);
  if (detectedPriority) return detectedPriority;
  
  const highPriorityWords = ['urgente', 'importante', 'crítico', 'inmediato', 'necesario'];
  const lowPriorityWords = ['eventual', 'cuando pueda', 'si hay tiempo', 'opcional'];
  
  for (const keyword of keywords) {
    if (highPriorityWords.includes(keyword)) return 'alta';
    if (lowPriorityWords.includes(keyword)) return 'baja';
  }
  
  return 'media';
};

// Sugerir fecha límite basada en palabras clave
const suggestDueDate = (keywords, content) => {
  const extractedDate = extractDates(content);
  if (extractedDate) return extractedDate.fullMatch;
  
  // Si no se encuentra una fecha específica, sugerir basado en prioridad
  const priority = suggestPriority(keywords, content);
  
  const today = new Date();
  
  if (priority === 'alta') {
    // Para tareas de alta prioridad, sugerir hoy o mañana
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('es-ES');
  } else if (priority === 'media') {
    // Para tareas de prioridad media, sugerir dentro de 3 días
    const threeDays = new Date(today);
    threeDays.setDate(threeDays.getDate() + 3);
    return threeDays.toLocaleDateString('es-ES');
  } else {
    // Para tareas de baja prioridad, sugerir dentro de una semana
    const oneWeek = new Date(today);
    oneWeek.setDate(oneWeek.getDate() + 7);
    return oneWeek.toLocaleDateString('es-ES');
  }
};

// Sugerir tareas relacionadas
const suggestRelatedTasks = (keywords) => {
  // Esta función necesitaría acceso a todas las tareas
  // Por ahora, devolvemos un array vacío
  return [];
};

// Función para analizar el contexto actual
const analyzeContext = (tasks, currentTask, userStats) => {
  const context = {
    type: determineContextType(currentTask),
    category: extractCategory(currentTask),
    similarTasks: findSimilarTasks(tasks, currentTask),
    productiveTime: calculateProductiveTime(userStats),
    productiveDay: calculateProductiveDay(userStats),
    completedToday: countCompletedToday(tasks),
    streak: calculateStreak(userStats),
    productivityLevel: calculateProductivityTrend(userStats),
    // Más datos contextuales
  };
  
  return context;
};

// Función para generar una respuesta basada en el contexto
const generateResponse = (context) => {
  // Seleccionar categoría de respuesta
  const responseCategory = contextualResponses[context.type] || contextualResponses.general;
  
  // Seleccionar una respuesta aleatoria de la categoría
  const randomIndex = Math.floor(Math.random() * responseCategory.length);
  let response = responseCategory[randomIndex];
  
  // Reemplazar placeholders con datos contextuales
  Object.keys(context).forEach(key => {
    response = response.replace(`{${key}}`, context[key]);
  });
  
  return response;
};

// Función para generar sugerencias basadas en el contenido de la tarea
const generateSuggestions = (taskContent) => {
  // Analizar el contenido para identificar palabras clave
  const keywords = extractKeywords(taskContent);
  
  // Generar sugerencias basadas en palabras clave
  const suggestions = {
    categories: suggestCategories(keywords),
    priority: suggestPriority(keywords, taskContent),
    dueDate: suggestDueDate(keywords, taskContent),
    relatedTasks: suggestRelatedTasks(keywords),
  };
  
  return suggestions;
};

export {
  analyzeContext,
  generateResponse,
  generateSuggestions
}; 
