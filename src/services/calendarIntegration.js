import { trackEvent } from './analyticsService';

class CalendarIntegrationService {
  constructor() {
    this.providers = {
      google: {
        name: 'Google Calendar',
        connected: false,
        lastSync: null
      },
      outlook: {
        name: 'Outlook Calendar',
        connected: false,
        lastSync: null
      },
      apple: {
        name: 'Apple Calendar',
        connected: false,
        lastSync: null
      }
    };
    
    this.syncInProgress = false;
  }
  
  // Conectar con Google Calendar
  async connectGoogleCalendar() {
    try {
      // Cargar la API de Google Calendar
      await this.loadGoogleApi();
      
      // Iniciar el proceso de autenticación
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn({
        scope: 'https://www.googleapis.com/auth/calendar'
      });
      
      if (user) {
        this.providers.google.connected = true;
        this.providers.google.lastSync = new Date();
        trackEvent('Calendar', 'connect', 'google');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al conectar con Google Calendar:', error);
      trackEvent('Calendar', 'connect_error', 'google');
      return false;
    }
  }
  
  // Cargar la API de Google
  async loadGoogleApi() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client:auth2', () => {
          gapi.client.init({
            apiKey: 'YOUR_API_KEY',
            clientId: 'YOUR_CLIENT_ID',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: 'https://www.googleapis.com/auth/calendar'
          }).then(resolve).catch(reject);
        });
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  
  // Importar eventos de Google Calendar
  async importFromGoogleCalendar(startDate, endDate) {
    if (!this.providers.google.connected) {
      await this.connectGoogleCalendar();
    }
    
    try {
      const response = await gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': startDate.toISOString(),
        'timeMax': endDate.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'startTime'
      });
      
      const events = response.result.items;
      const importedTasks = events.map(event => ({
        id: `google_${event.id}`,
        title: event.summary,
        description: event.description || '',
        date: new Date(event.start.dateTime || event.start.date),
        completed: false,
        priority: this.guessPriorityFromEvent(event),
        source: 'google_calendar',
        externalId: event.id,
        location: event.location || '',
        allDay: !event.start.dateTime
      }));
      
      this.providers.google.lastSync = new Date();
      trackEvent('Calendar', 'import', 'google');
      
      return importedTasks;
    } catch (error) {
      console.error('Error al importar eventos de Google Calendar:', error);
      trackEvent('Calendar', 'import_error', 'google');
      return [];
    }
  }
  
  // Exportar tareas a Google Calendar
  async exportToGoogleCalendar(tasks) {
    if (!this.providers.google.connected) {
      await this.connectGoogleCalendar();
    }
    
    try {
      const results = [];
      
      for (const task of tasks) {
        // Verificar si la tarea ya existe en Google Calendar
        const existingEventId = task.externalId;
        
        if (existingEventId) {
          // Actualizar evento existente
          const updatedEvent = await gapi.client.calendar.events.update({
            calendarId: 'primary',
            eventId: existingEventId,
            resource: this.taskToGoogleEvent(task)
          });
          
          results.push({
            task,
            success: true,
            action: 'updated',
            eventId: updatedEvent.result.id
          });
        } else {
          // Crear nuevo evento
          const newEvent = await gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: this.taskToGoogleEvent(task)
          });
          
          results.push({
            task,
            success: true,
            action: 'created',
            eventId: newEvent.result.id
          });
        }
      }
      
      this.providers.google.lastSync = new Date();
      trackEvent('Calendar', 'export', 'google');
      
      return results;
    } catch (error) {
      console.error('Error al exportar tareas a Google Calendar:', error);
      trackEvent('Calendar', 'export_error', 'google');
      return [];
    }
  }
  
  // Convertir tarea a formato de evento de Google
  taskToGoogleEvent(task) {
    const taskDate = new Date(task.date);
    const endDate = new Date(taskDate);
    endDate.setHours(endDate.getHours() + 1); // Por defecto, 1 hora de duración
    
    return {
      summary: task.title,
      description: task.description || '',
      start: {
        dateTime: taskDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: task.location || '',
      colorId: this.getPriorityColorId(task.priority)
    };
  }
  
  // Obtener ID de color según prioridad
  getPriorityColorId(priority) {
    switch (priority) {
      case 'high': return '4'; // Rojo
      case 'medium': return '5'; // Amarillo
      case 'low': return '2'; // Verde
      default: return '1'; // Azul
    }
  }
  
  // Adivinar prioridad a partir de un evento
  guessPriorityFromEvent(event) {
    if (event.colorId === '4') return 'high';
    if (event.colorId === '5') return 'medium';
    if (event.colorId === '2') return 'low';
    
    // Intentar adivinar por el título
    const title = event.summary.toLowerCase();
    if (title.includes('urgente') || title.includes('importante')) {
      return 'high';
    }
    
    return 'medium'; // Prioridad por defecto
  }
  
  // Desconectar de Google Calendar
  disconnectGoogleCalendar() {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      authInstance.signOut();
      
      this.providers.google.connected = false;
      this.providers.google.lastSync = null;
      
      trackEvent('Calendar', 'disconnect', 'google');
      return true;
    } catch (error) {
      console.error('Error al desconectar de Google Calendar:', error);
      return false;
    }
  }
  
  // Obtener estado de conexión de todos los proveedores
  getConnectionStatus() {
    return {
      google: {
        ...this.providers.google
      },
      outlook: {
        ...this.providers.outlook
      },
      apple: {
        ...this.providers.apple
      }
    };
  }
}

export const calendarIntegration = new CalendarIntegrationService(); 