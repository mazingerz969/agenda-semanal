import { trackEvent } from './analyticsService';

class ProductivityAnalyticsService {
  constructor() {
    this.taskCompletionTimes = new Map();
    this.productiveHours = Array(24).fill(0);
    this.productiveDays = Array(7).fill(0);
    this.categoryPerformance = new Map();
    this.initialized = false;
    
    // Intentar cargar datos guardados
    this.loadSavedData();
  }
  
  // Inicializar el servicio
  initialize() {
    if (this.initialized) return;
    
    // Registrar evento de inicialización
    trackEvent('Productivity', 'initialize', 'success');
    this.initialized = true;
    
    // Configurar guardado periódico
    setInterval(() => this.saveData(), 5 * 60 * 1000); // Cada 5 minutos
  }
  
  // Cargar datos guardados
  loadSavedData() {
    try {
      const savedData = localStorage.getItem('productivityData');
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Restaurar datos de horas productivas
        if (data.productiveHours) {
          this.productiveHours = data.productiveHours;
        }
        
        // Restaurar datos de días productivos
        if (data.productiveDays) {
          this.productiveDays = data.productiveDays;
        }
        
        // Restaurar datos de rendimiento por categoría
        if (data.categoryPerformance) {
          this.categoryPerformance = new Map(Object.entries(data.categoryPerformance));
        }
        
        console.log('Datos de productividad cargados correctamente');
      }
    } catch (error) {
      console.error('Error al cargar datos de productividad:', error);
    }
  }
  
  // Guardar datos
  saveData() {
    try {
      const dataToSave = {
        productiveHours: this.productiveHours,
        productiveDays: this.productiveDays,
        categoryPerformance: Object.fromEntries(this.categoryPerformance)
      };
      
      localStorage.setItem('productivityData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error al guardar datos de productividad:', error);
    }
  }
  
  // Registrar inicio de trabajo en una tarea
  startTaskWork(taskId) {
    if (!this.initialized) this.initialize();
    
    this.taskCompletionTimes.set(taskId, {
      startTime: Date.now(),
      pauses: [],
      currentPause: null,
      totalPauseTime: 0,
      completed: false
    });
    
    trackEvent('Productivity', 'start_task_work', taskId);
    return true;
  }
  
  // Pausar trabajo en una tarea
  pauseTaskWork(taskId) {
    if (!this.initialized) this.initialize();
    
    const taskData = this.taskCompletionTimes.get(taskId);
    if (!taskData) return false;
    
    taskData.currentPause = Date.now();
    trackEvent('Productivity', 'pause_task_work', taskId);
    return true;
  }
  
  // Reanudar trabajo en una tarea
  resumeTaskWork(taskId) {
    if (!this.initialized) this.initialize();
    
    const taskData = this.taskCompletionTimes.get(taskId);
    if (!taskData || !taskData.currentPause) return false;
    
    const pauseDuration = Date.now() - taskData.currentPause;
    taskData.pauses.push({
      start: taskData.currentPause,
      end: Date.now(),
      duration: pauseDuration
    });
    
    taskData.totalPauseTime += pauseDuration;
    taskData.currentPause = null;
    
    trackEvent('Productivity', 'resume_task_work', taskId);
    return true;
  }
  
  // Completar trabajo en una tarea
  completeTaskWork(taskId, task) {
    if (!this.initialized) this.initialize();
    
    const taskData = this.taskCompletionTimes.get(taskId);
    if (!taskData) return null;
    
    // Si hay una pausa activa, finalizarla
    if (taskData.currentPause) {
      this.resumeTaskWork(taskId);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - taskData.startTime;
    const activeTime = totalTime - taskData.totalPauseTime;
    
    taskData.endTime = endTime;
    taskData.totalTime = totalTime;
    taskData.activeTime = activeTime;
    taskData.completed = true;
    
    // Actualizar estadísticas de productividad
    this.updateProductivityStats(task, activeTime);
    
    // Guardar datos actualizados
    this.saveData();
    
    trackEvent('Productivity', 'complete_task_work', taskId);
    return {
      taskId,
      totalTime,
      activeTime,
      pauses: taskData.pauses.length,
      pauseTime: taskData.totalPauseTime
    };
  }
  
  // Actualizar estadísticas de productividad
  updateProductivityStats(task, activeTime) {
    if (!task) return;
    
    // Actualizar horas productivas
    const completionHour = new Date().getHours();
    this.productiveHours[completionHour] += activeTime;
    
    // Actualizar días productivos
    const completionDay = new Date().getDay();
    this.productiveDays[completionDay] += activeTime;
    
    // Actualizar rendimiento por categoría
    if (task.category) {
      const categoryData = this.categoryPerformance.get(task.category) || {
        tasksCompleted: 0,
        totalTime: 0,
        averageTime: 0
      };
      
      categoryData.tasksCompleted += 1;
      categoryData.totalTime += activeTime;
      categoryData.averageTime = categoryData.totalTime / categoryData.tasksCompleted;
      
      this.categoryPerformance.set(task.category, categoryData);
    }
  }
  
  // Registrar tarea completada sin seguimiento de tiempo
  registerTaskCompletion(task) {
    if (!this.initialized) this.initialize();
    if (!task) return false;
    
    // Estimar tiempo basado en prioridad
    let estimatedTime = 0;
    switch (task.priority) {
      case 'high':
        estimatedTime = 45 * 60 * 1000; // 45 minutos
        break;
      case 'medium':
        estimatedTime = 30 * 60 * 1000; // 30 minutos
        break;
      case 'low':
        estimatedTime = 15 * 60 * 1000; // 15 minutos
        break;
      default:
        estimatedTime = 30 * 60 * 1000; // 30 minutos por defecto
    }
    
    // Actualizar estadísticas con tiempo estimado
    this.updateProductivityStats(task, estimatedTime);
    
    // Guardar datos actualizados
    this.saveData();
    
    trackEvent('Productivity', 'register_completion', task.id);
    return true;
  }
  
  // Obtener análisis de productividad
  getProductivityAnalysis() {
    if (!this.initialized) this.initialize();
    
    // Determinar hora más productiva
    let mostProductiveHour = 0;
    let mostProductiveHourValue = this.productiveHours[0];
    
    for (let i = 1; i < this.productiveHours.length; i++) {
      if (this.productiveHours[i] > mostProductiveHourValue) {
        mostProductiveHour = i;
        mostProductiveHourValue = this.productiveHours[i];
      }
    }
    
    // Determinar día más productivo
    let mostProductiveDay = 0;
    let mostProductiveDayValue = this.productiveDays[0];
    
    for (let i = 1; i < this.productiveDays.length; i++) {
      if (this.productiveDays[i] > mostProductiveDayValue) {
        mostProductiveDay = i;
        mostProductiveDayValue = this.productiveDays[i];
      }
    }
    
    // Determinar categoría más eficiente
    let mostEfficientCategory = null;
    let bestEfficiency = Infinity;
    
    for (const [category, data] of this.categoryPerformance.entries()) {
      if (data.averageTime < bestEfficiency && data.tasksCompleted > 0) {
        mostEfficientCategory = category;
        bestEfficiency = data.averageTime;
      }
    }
    
    // Convertir tiempos de milisegundos a minutos para mejor legibilidad
    const hourlyProductivityMinutes = this.productiveHours.map(ms => Math.round(ms / 60000));
    const dailyProductivityMinutes = this.productiveDays.map(ms => Math.round(ms / 60000));
    
    // Preparar datos de categorías para devolver
    const categoryData = {};
    for (const [category, data] of this.categoryPerformance.entries()) {
      categoryData[category] = {
        tasksCompleted: data.tasksCompleted,
        totalTimeMinutes: Math.round(data.totalTime / 60000),
        averageTimeMinutes: Math.round(data.averageTime / 60000)
      };
    }
    
    // Nombres de los días de la semana
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    return {
      mostProductiveHour,
      mostProductiveHourFormatted: `${mostProductiveHour}:00 - ${mostProductiveHour + 1}:00`,
      mostProductiveDay,
      mostProductiveDayName: dayNames[mostProductiveDay],
      mostEfficientCategory,
      hourlyProductivity: hourlyProductivityMinutes,
      dailyProductivity: dailyProductivityMinutes,
      categoryPerformance: categoryData,
      totalProductiveTimeMinutes: Math.round(
        this.productiveHours.reduce((sum, current) => sum + current, 0) / 60000
      )
    };
  }
  
  // Obtener datos para gráficos
  getChartData() {
    if (!this.initialized) this.initialize();
    
    // Datos para gráfico de horas
    const hourlyData = {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{
        label: 'Minutos productivos',
        data: this.productiveHours.map(ms => Math.round(ms / 60000)),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      }]
    };
    
    // Datos para gráfico de días
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dailyData = {
      labels: dayNames,
      datasets: [{
        label: 'Minutos productivos',
        data: this.productiveDays.map(ms => Math.round(ms / 60000)),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }]
    };
    
    // Datos para gráfico de categorías
    const categories = Array.from(this.categoryPerformance.keys());
    const categoryData = {
      labels: categories,
      datasets: [{
        label: 'Tareas completadas',
        data: categories.map(cat => this.categoryPerformance.get(cat).tasksCompleted),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1
      }, {
        label: 'Tiempo promedio (min)',
        data: categories.map(cat => Math.round(this.categoryPerformance.get(cat).averageTime / 60000)),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }]
    };
    
    return {
      hourlyData,
      dailyData,
      categoryData
    };
  }
  
  // Reiniciar estadísticas
  resetStats() {
    if (!this.initialized) this.initialize();
    
    this.productiveHours = Array(24).fill(0);
    this.productiveDays = Array(7).fill(0);
    this.categoryPerformance = new Map();
    
    // Guardar datos reiniciados
    this.saveData();
    
    trackEvent('Productivity', 'reset_stats', 'user_initiated');
    return true;
  }
}

// Exportar una instancia única del servicio
export const productivityAnalytics = new ProductivityAnalyticsService(); 