import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const RecurringTaskOptions = ({ onOptionsChange }) => {
  const [frequency, setFrequency] = useState('none');
  const [endDate, setEndDate] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);
    updateOptions(newFrequency, endDate, daysOfWeek);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    updateOptions(frequency, newEndDate, daysOfWeek);
  };

  const handleDayToggle = (day) => {
    const newDaysOfWeek = {
      ...daysOfWeek,
      [day]: !daysOfWeek[day],
    };
    setDaysOfWeek(newDaysOfWeek);
    updateOptions(frequency, endDate, newDaysOfWeek);
  };

  const updateOptions = (freq, end, days) => {
    onOptionsChange({
      frequency: freq,
      endDate: end,
      daysOfWeek: days,
    });
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Opciones de Recurrencia</h3>
      
      <div className="mb-3">
        <label className="block text-gray-700 dark:text-gray-300 mb-1">Frecuencia</label>
        <select
          value={frequency}
          onChange={handleFrequencyChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="none">Sin repetición</option>
          <option value="daily">Diariamente</option>
          <option value="weekly">Semanalmente</option>
          <option value="monthly">Mensualmente</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>

      {frequency === 'weekly' && (
        <div className="mb-3">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Días de la semana</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries({
              monday: 'L',
              tuesday: 'M',
              wednesday: 'X',
              thursday: 'J',
              friday: 'V',
              saturday: 'S',
              sunday: 'D',
            }).map(([day, label]) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`w-8 h-8 rounded-full ${
                  daysOfWeek[day]
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {frequency !== 'none' && (
        <div className="mb-3">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Fecha de finalización</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar size={16} className="text-gray-500" />
            </div>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full p-2 pl-10 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringTaskOptions; 
