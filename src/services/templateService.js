// Simulación de servicio de plantillas
// En una implementación real, estas funciones se conectarían a un backend o localStorage

// Clave para almacenar plantillas en localStorage
const TEMPLATES_STORAGE_KEY = 'agenda_task_templates';

// Función para obtener plantillas guardadas
export const getTemplates = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Intentar obtener plantillas del localStorage
        const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        const templates = storedTemplates ? JSON.parse(storedTemplates) : [];
        console.log('Plantillas cargadas:', templates);
        resolve(templates);
      } catch (error) {
        console.error('Error al cargar plantillas:', error);
        resolve([]);
      }
    }, 500);
  });
};

// Función para guardar una nueva plantilla
export const saveTemplate = async (template) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Obtener plantillas existentes
        const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        const templates = storedTemplates ? JSON.parse(storedTemplates) : [];
        
        // Crear nueva plantilla con ID único
        const newTemplate = {
          ...template,
          id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString()
        };
        
        // Añadir la nueva plantilla y guardar
        templates.push(newTemplate);
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
        
        console.log('Plantilla guardada:', newTemplate);
        resolve(newTemplate);
      } catch (error) {
        console.error('Error al guardar plantilla:', error);
        throw new Error('No se pudo guardar la plantilla');
      }
    }, 800);
  });
};

// Función para eliminar una plantilla
export const deleteTemplate = async (templateId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Obtener plantillas existentes
        const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        if (!storedTemplates) {
          resolve(true);
          return;
        }
        
        // Filtrar la plantilla a eliminar
        const templates = JSON.parse(storedTemplates);
        const updatedTemplates = templates.filter(template => template.id !== templateId);
        
        // Guardar las plantillas actualizadas
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedTemplates));
        
        console.log('Plantilla eliminada:', templateId);
        resolve(true);
      } catch (error) {
        console.error('Error al eliminar plantilla:', error);
        throw new Error('No se pudo eliminar la plantilla');
      }
    }, 600);
  });
};

// Función para aplicar una plantilla (crear tareas basadas en la plantilla)
export const applyTemplate = async (template) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Generar nuevas tareas basadas en la plantilla
        const now = new Date();
        const newTasks = template.tasks.map(task => ({
          ...task,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Fecha aleatoria en los próximos 7 días
          completed: false, // Siempre iniciar como no completada
          createdAt: new Date().toISOString(),
          fromTemplate: template.id
        }));
        
        console.log('Plantilla aplicada, nuevas tareas:', newTasks);
        resolve(newTasks);
      } catch (error) {
        console.error('Error al aplicar plantilla:', error);
        throw new Error('No se pudo aplicar la plantilla');
      }
    }, 1000);
  });
};
