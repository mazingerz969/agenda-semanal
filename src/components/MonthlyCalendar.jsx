import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

function MonthlyCalendar({ tasks = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Función para obtener las tareas de un día específico
  const getTasksForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, day);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Días de la semana */}
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
        
        {/* Espacios vacíos para el primer día */}
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 bg-gray-50 dark:bg-gray-800 rounded-md"></div>
        ))}
        
        {/* Días del mes */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayTasks = getTasksForDay(day);
          
          return (
            <div key={`day-${day}`} className="h-24 border border-gray-200 dark:border-gray-700 rounded-md p-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="font-bold">{day}</span>
                <button className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-full p-1">
                  <Plus size={14} />
                </button>
              </div>
              
              <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                {dayTasks.map((task, taskIndex) => (
                  <div 
                    key={`task-${day}-${taskIndex}`}
                    className={`text-xs p-1 rounded truncate ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {renderCalendar()}
    </div>
  );
}

export default MonthlyCalendar;

