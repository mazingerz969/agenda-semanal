import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Repeat, AlertCircle } from 'lucide-react';

function RecurringTaskOptions({ value, onChange }) {
  const [frequency, setFrequency] = useState(value?.frequency || 'none');
  const [interval, setInterval] = useState(value?.interval || 1);
  const [weekdays, setWeekdays] = useState(value?.weekdays || []);
  const [endDate, setEndDate] = useState(value?.endDate || '');
  const [occurrences, setOccurrences] = useState(value?.occurrences || 0);
  const [endType, setEndType] = useState(value?.endType || 'never');
  
  // Actualizar el valor cuando cambian los campos
  useEffect(() => {
    if (frequency === 'none') {
      onChange(null);
      return;
    }
    
    const newValue = {
      frequency,
      interval: Number(interval),
      weekdays: frequency === 'weekly' ? weekdays : [],
      endType,
      endDate: endType === 'date' ? endDate : '',
      occurrences: endType === 'occurrences' ? Number(occurrences) : 0
    };
    
    onChange(newValue);
  }, [frequency, interval, weekdays, endType, endDate, occurrences, onChange]);
  
  const toggleWeekday = (day) => {
    if (weekdays.includes(day)) {
      setWeekdays(weekdays.filter(d => d !== day));
    } else {
      setWeekdays([...weekdays, day]);
    }
  };
  
  if (frequency === 'none') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Repetición
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="none">No repetir</option>
            <option value="daily">Diariamente</option>
            <option value="weekly">Semanalmente</option>
            <option value="monthly">Mensualmente</option>
            <option value="yearly">Anualmente</option>
          </select>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Repeat className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Repetición
          </label>
        </div>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="none">No repetir</option>
          <option value="daily">Diariamente</option>
          <option value="weekly">Semanalmente</option>
          <option value="monthly">Mensualmente</option>
          <option value="yearly">Anualmente</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">Cada</span>
        <input
          type="number"
          min="1"
          max="99"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">
          {frequency === 'daily' && 'día(s)'}
          {frequency === 'weekly' && 'semana(s)'}
          {frequency === 'monthly' && 'mes(es)'}
          {frequency === 'yearly' && 'año(s)'}
        </span>
      </div>
      
      {frequency === 'weekly' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Repetir en
          </label>
          <div className="flex flex-wrap gap-2">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleWeekday(index + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  weekdays.includes(index + 1)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Finalizar
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="end-never"
              name="end-type"
              value="never"
              checked={endType === 'never'}
              onChange={() => setEndType('never')}
              className="h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="end-never" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Nunca
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="end-date"
              name="end-type"
              value="date"
              checked={endType === 'date'}
              onChange={() => setEndType('date')}
              className="h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="end-date" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              En fecha
            </label>
            {endType === 'date' && (
              <div className="ml-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="end-occurrences"
              name="end-type"
              value="occurrences"
              checked={endType === 'occurrences'}
              onChange={() => setEndType('occurrences')}
              className="h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label htmlFor="end-occurrences" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Después de
            </label>
            {endType === 'occurrences' && (
              <div className="ml-2 flex items-center">
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={occurrences}
                  onChange={(e) => setOccurrences(e.target.value)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  ocurrencias
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {(frequency !== 'none' && (endType === 'never' || !endDate || !occurrences)) && (
        <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>
            Las tareas recurrentes sin fin pueden acumularse. Considera establecer un límite.
          </span>
        </div>
      )}
    </div>
  );
}

export default RecurringTaskOptions; 
