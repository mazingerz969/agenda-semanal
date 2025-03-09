// Simulación de servicio de colaboración
// En una implementación real, estas funciones se conectarían a un backend

// Función para crear un enlace compartible
export const createShareableLink = async (tasks) => {
  // Simulación de creación de enlace
  return new Promise((resolve) => {
    setTimeout(() => {
      // Crear un identificador único para el conjunto de tareas
      const shareId = `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      // En una implementación real, guardaríamos las tareas en una base de datos
      // y generaríamos un enlace real
      const shareableLink = `https://agenda-semanal.example.com/shared/${shareId}`;
      console.log('Enlace generado:', shareableLink, 'para tareas:', tasks);
      resolve(shareableLink);
    }, 1000);
  });
};

// Función para obtener tareas compartidas con el usuario
export const getSharedTasks = async () => {
  // Simulación de obtención de tareas compartidas
  return new Promise((resolve) => {
    setTimeout(() => {
      // Datos de ejemplo
      const sharedTasks = [
        {
          id: `shared-${Date.now()}-1`,
          title: 'Preparar presentación del proyecto',
          description: 'Crear slides para la reunión del viernes',
          date: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 días después
          completed: false,
          priority: 'high',
          category: 'trabajo',
          sharedBy: 'ana.martinez@example.com'
        },
        {
          id: `shared-${Date.now()}-2`,
          title: 'Organizar cena de equipo',
          description: 'Reservar restaurante y confirmar asistentes',
          date: new Date(Date.now() + 432000000).toISOString().split('T')[0], // 5 días después
          completed: false,
          priority: 'medium',
          category: 'social',
          sharedBy: 'carlos.lopez@example.com'
        }
      ];
      console.log('Tareas compartidas obtenidas:', sharedTasks);
      resolve(sharedTasks);
    }, 1500);
  });
};

// Función para compartir tareas con otro usuario
export const shareTasksWithUser = async (email, tasks) => {
  // Simulación de compartir tareas
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Tareas compartidas con ${email}:`, tasks);
      resolve(true);
    }, 1500);
  });
};

// Función para aceptar tareas compartidas
export const acceptSharedTasks = async (tasks) => {
  // Simulación de aceptación de tareas
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Tareas aceptadas:', tasks);
      resolve(true);
    }, 1000);
  });
}; 