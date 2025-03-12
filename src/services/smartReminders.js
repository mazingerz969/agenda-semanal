import { trackEvent } from './analyticsService';

class SmartReminderService {
  constructor() {
    this.reminders = new Map();
    this.notificationPermission = false;
    this.initialized = false;
  }
  
  async initialize() {
    if (this.initialized) return true;
    
    // Verificar soporte para notificaciones
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones de escritorio');
      return false;
    }
    
    // Solicitar permiso si es necesario
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission === 'granted';
    } else {
      this.notificationPermission = true;
    }
    
    // Registrar Service Worker para notificaciones en segundo plano
    if ('serviceWorker' in navigator && this.notificationPermission) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if ('periodicSync' in registration) {
          await registration.periodicSync.register('check-reminders', {
            minInterval: 15 * 60 * 1000 // 15 minutos
          });
        }
      } catch (error) {
        console.error('Error al registrar sincronización periódica:', error);
      }
    }
    
    this.initialized = true;
    return this.notificationPermission;
  }
  
  // Crear un recordatorio para una tarea
  async createReminder(task, options = {}) {
    await this.initialize();
    
    const now = new Date();
    const taskDate = new Date(task.date);
    
    // Configuración predeterminada
    const defaultOptions = {
      reminderTime: new Date(taskDate.getTime() - 30 * 60 * 1000), // 30 minutos antes
      smartTiming: true,
      repeat: false,
      repeatInterval: 'never', // 'never', 'daily', 'weekly', 'monthly'
      locationBased: false,
      location: null
    };
    
    const reminderOptions = { ...defaultOptions, ...options };
    
    // Generar ID único para el recordatorio
    const reminderId = `reminder_${task.id}_${Date.now()}`;
    
    // Crear objeto de recordatorio
    const reminder = {
      id: reminderId,
      taskId: task.id,
      taskTitle: task.title,
      scheduledTime: reminderOptions.reminderTime,
      createdAt: now,
      options: reminderOptions,
      status: 'scheduled'
    };
    
    // Guardar recordatorio
    this.reminders.set(reminderId, reminder);
    
    // Programar recordatorio
    this.scheduleReminder(reminder);
    
    trackEvent('Reminder', 'create', task.id);
    return reminderId;
  }
  
  // Programar un recordatorio
  scheduleReminder(reminder) {
    const now = new Date();
    const reminderTime = new Date(reminder.scheduledTime);
    
    // Si el recordatorio ya pasó, marcarlo como vencido
    if (reminderTime < now) {
      reminder.status = 'expired';
      return;
    }
    
    // Calcular tiempo hasta el recordatorio
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    // Programar timeout para mostrar la notificación
    reminder.timerId = setTimeout(() => {
      this.showNotification(reminder);
      
      // Si es un recordatorio recurrente, programar el siguiente
      if (reminder.options.repeat) {
        this.scheduleNextRecurrence(reminder);
      } else {
        reminder.status = 'completed';
      }
    }, timeUntilReminder);
    
    reminder.status = 'scheduled';
  }
  
  // Mostrar notificación
  async showNotification(reminder) {
    if (!this.notificationPermission) {
      await this.initialize();
      if (!this.notificationPermission) return false;
    }
    
    try {
      const notification = new Notification(`Recordatorio: ${reminder.taskTitle}`, {
        body: `Es hora de trabajar en esta tarea.`,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: reminder.id,
        renotify: true,
        actions: [
          { action: 'view', title: 'Ver tarea' },
          { action: 'snooze', title: 'Posponer' }
        ]
      });
      
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        // Aquí se podría navegar a la tarea específica
        trackEvent('Reminder', 'notification_click', reminder.taskId);
      };
      
      trackEvent('Reminder', 'show_notification', reminder.taskId);
      return true;
    } catch (error) {
      console.error('Error al mostrar notificación:', error);
      trackEvent('Reminder', 'notification_error', error.message);
      return false;
    }
  }
  
  // Programar siguiente recurrencia para recordatorios repetitivos
  scheduleNextRecurrence(reminder) {
    const currentTime = new Date(reminder.scheduledTime);
    let nextTime;
    
    switch (reminder.options.repeatInterval) {
      case 'daily':
        nextTime = new Date(currentTime);
        nextTime.setDate(nextTime.getDate() + 1);
        break;
      case 'weekly':
        nextTime = new Date(currentTime);
        nextTime.setDate(nextTime.getDate() + 7);
        break;
      case 'monthly':
        nextTime = new Date(currentTime);
        nextTime.setMonth(nextTime.getMonth() + 1);
        break;
      default:
        return; // No repetir
    }
    
    // Crear nuevo recordatorio con la siguiente fecha
    const newReminder = { ...reminder };
    newReminder.id = `reminder_${reminder.taskId}_${Date.now()}`;
    newReminder.scheduledTime = nextTime;
    newReminder.status = 'scheduled';
    
    // Guardar y programar nuevo recordatorio
    this.reminders.set(newReminder.id, newReminder);
    this.scheduleReminder(newReminder);
  }
  
  // Cancelar un recordatorio
  cancelReminder(reminderId) {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) return false;
    
    // Cancelar el timeout si existe
    if (reminder.timerId) {
      clearTimeout(reminder.timerId);
    }
    
    reminder.status = 'cancelled';
    trackEvent('Reminder', 'cancel', reminder.taskId);
    return true;
  }
  
  // Posponer un recordatorio
  snoozeReminder(reminderId, minutes = 10) {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) return false;
    
    // Cancelar el timeout actual
    if (reminder.timerId) {
      clearTimeout(reminder.timerId);
    }
    
    // Calcular nueva hora
    const newTime = new Date();
    newTime.setMinutes(newTime.getMinutes() + minutes);
    
    reminder.scheduledTime = newTime;
    reminder.status = 'snoozed';
    
    // Reprogramar
    this.scheduleReminder(reminder);
    
    trackEvent('Reminder', 'snooze', reminder.taskId);
    return true;
  }
  
  // Obtener todos los recordatorios para una tarea
  getTaskReminders(taskId) {
    const taskReminders = [];
    
    for (const reminder of this.reminders.values()) {
      if (reminder.taskId === taskId) {
        taskReminders.push(reminder);
      }
    }
    
    return taskReminders;
  }
  
  // Verificar y mostrar recordatorios pendientes
  checkPendingReminders() {
    const now = new Date();
    
    for (const reminder of this.reminders.values()) {
      if (reminder.status === 'scheduled') {
        const reminderTime = new Date(reminder.scheduledTime);
        
        // Si el recordatorio debería haberse mostrado ya pero no se mostró
        if (reminderTime <= now && reminderTime > new Date(now.getTime() - 5 * 60 * 1000)) {
          this.showNotification(reminder);
          
          if (reminder.options.repeat) {
            this.scheduleNextRecurrence(reminder);
          } else {
            reminder.status = 'completed';
          }
        }
      }
    }
  }
}

export const smartReminders = new SmartReminderService(); 
