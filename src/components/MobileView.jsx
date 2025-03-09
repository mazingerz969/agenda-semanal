// Versión sin importaciones no utilizadas
const MobileView = ({ tasks = [], setTasks }) => {
  // Función para cambiar el estado de completado de una tarea
  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };
  
  return (
    <div className="md:hidden">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-medium mb-3">Vista Móvil</h2>
        
        {tasks.length > 0 ? (
          <ul className="divide-y dark:divide-gray-700">
            {tasks.map(task => (
              <li key={task.id} className="py-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="mr-3 h-5 w-5 text-indigo-600 rounded"
                  />
                  <div>
                    <p className={task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}>
                      {task.title}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No hay tareas para mostrar
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileView; 