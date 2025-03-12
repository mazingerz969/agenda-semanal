// Simulación de API para servicios de calendario
// En una implementación real, estas funciones se conectarían a las APIs reales

// Función para conectar con Google Calendar
export const connectToGoogleCalendar = async () => {
  // Simulación de proceso de autenticación
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Conectado a Google Calendar');
      resolve(true);
    }, 1500);
  });
};

// Función para conectar con Outlook Calendar
export const connectToOutlookCalendar = async () => {
  // Simulación de proceso de autenticación
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Conectado a Outlook Calendar');
      resolve(true);
    }, 1500);
  });
};

// Función para importar eventos
export const importEvents = async (service) => {
  // Simulación de importación de eventos
  return new Promise((resolve) => {
    setTimeout(() => {
      const demoEvents = [
        {
          id: `import-${Date.now()}-1`,
          title: `Reunión importada de ${service}`,
          description: 'Evento importado automáticamente',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
          completed: false,
          priority: 'medium',
          category: 'trabajo'
        },
        {
          id: `import-${Date.now()}-2`,
          title: `Tarea importada de ${service}`,
          description: 'Tarea importada automáticamente',
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Pasado mañana
          completed: false,
          priority: 'high',
          category: 'personal'
        }
      ];
      console.log(`Eventos importados de ${service}`, demoEvents);
      resolve(demoEvents);
    }, 2000);
  });
};

// Función para exportar eventos
export const exportEvents = async (service, tasks) => {
  // Simulación de exportación de eventos
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${tasks.length} tareas exportadas a ${service}`);
      resolve(true);
    }, 2000);
  });
}; 
