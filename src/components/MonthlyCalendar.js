import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthlyCalendar = ({ tasks = {}, onTasksChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Nombres de los meses en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Nombres de los días en español
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
    let firstDayIndex = firstDay.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    // Rellenar días del mes anterior
    for (let i = 0; i < firstDayIndex; i++) {
      const prevMonthDay = new Date(year, month, -firstDayIndex + i + 1);
      days.push({
        date: prevMonthDay,
        isCurrentMonth: false
      });
    }
    
    // Añadir días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentMonthDay = new Date(year, month, i);
      days.push({
        date: currentMonthDay,
        isCurrentMonth: true
      });
    }
    
    // Rellenar días del mes siguiente hasta completar la última semana
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDay = new Date(year, month + 1, i);
        days.push({
          date: nextMonthDay,
          isCurrentMonth: false
        });
      }
    }
    
    return days;
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const getTasksForDate = (date) => {
    // Convertir la fecha a día de la semana en español
    const dayIndex = date.getDay(); // 0 = domingo, 1 = lunes, ...
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayName = dayNames[dayIndex];
    
    // Buscar tareas para ese día de la semana
    const dayTasks = tasks[dayName] || [];
    
    // Filtrar tareas por fecha específica si tienen fecha
    return dayTasks.filter(task => {
      if (!task.date) return true; // Incluir tareas sin fecha
      
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const toggleTaskCompletion = (taskId, dayName) => {
    if (!tasks[dayName]) return;
    
    const updatedTasks = { ...tasks };
    updatedTasks[dayName] = updatedTasks[dayName].map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    onTasksChange(updatedTasks);
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => changeMonth(-1)} 
          className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 p-2 rounded"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button 
          onClick={() => changeMonth(1)} 
          className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 p-2 rounded"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="font-semibold text-center text-indigo-500 dark:text-indigo-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dayTasks = getTasksForDate(day.date);
          const isToday = new Date().toDateString() === day.date.toDateString();
          
          return (
            <div 
              key={index} 
              onClick={() => handleDayClick(day)}
              className={`
                border rounded p-2 min-h-[80px] cursor-pointer transition-colors
                ${!day.isCurrentMonth ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600' : ''}
                ${day.isCurrentMonth ? 'hover:bg-indigo-50 dark:hover:bg-gray-700' : ''}
                ${isToday ? 'border-indigo-500 dark:border-indigo-400 border-2' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                  {day.date.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <span className="bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {dayTasks.length}
                  </span>
                )}
              </div>
              
              <div className="mt-1 space-y-1 overflow-hidden max-h-[60px]">
                {dayTasks.slice(0, 2).map((task, idx) => (
                  <div 
                    key={idx} 
                    className={`text-xs truncate p-1 rounded ${
                      task.completed ? 'line-through bg-gray-100 dark:bg-gray-700 text-gray-500' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{dayTasks.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            {selectedDay.date.getDate()} de {monthNames[selectedDay.date.getMonth()]}
          </h3>
          <div className="space-y-2">
            {getTasksForDate(selectedDay.date).length > 0 ? (
              getTasksForDate(selectedDay.date).map((task, idx) => {
                // Obtener el día de la semana para esta tarea
                const dayIndex = selectedDay.date.getDay();
                const dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayIndex];
                
                return (
                  <div 
                    key={idx} 
                    className={`p-2 ${task.completed ? 'bg-gray-100 dark:bg-gray-700 line-through text-gray-500' : 'bg-indigo-50 dark:bg-gray-700'} rounded flex justify-between items-center`}
                  >
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.description && <div className="text-sm text-gray-600 dark:text-gray-400">{task.description}</div>}
                      {task.time && <div className="text-sm text-gray-500 dark:text-gray-400">{task.time}</div>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        task.priority === 'alta' ? 'bg-red-500' : 
                        task.priority === 'media' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id, dayName)}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No hay tareas para este día</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyCalendar; 