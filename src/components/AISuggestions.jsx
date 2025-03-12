import React, { useEffect, useState } from 'react';
import { generateSuggestions } from '../services/aiAssistant';

const AISuggestions = ({ taskContent, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState(null);
  
  useEffect(() => {
    if (taskContent && taskContent.length > 3) {
      const generatedSuggestions = generateSuggestions(taskContent);
      setSuggestions(generatedSuggestions);
    } else {
      setSuggestions(null);
    }
  }, [taskContent]);
  
  if (!suggestions) return null;
  
  return (
    <div className="ai-suggestions-container bg-blue-50 p-3 rounded-lg mt-3">
      <h4 className="ai-suggestions-title text-sm font-semibold mb-2">Sugerencias inteligentes:</h4>
      
      {suggestions.categories && suggestions.categories.length > 0 && (
        <div className="suggestion-item mb-2">
          <span className="suggestion-label text-xs text-gray-600">Categoría:</span>
          <div className="suggestion-options flex flex-wrap gap-1 mt-1">
            {suggestions.categories.map((category, index) => (
              <button 
                key={index}
                className="suggestion-option bg-white border border-blue-300 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-100"
                onClick={() => onApplySuggestion('category', category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {suggestions.priority && (
        <div className="suggestion-item mb-2">
          <span className="suggestion-label text-xs text-gray-600">Prioridad:</span>
          <button 
            className={`suggestion-option text-xs px-2 py-1 rounded mt-1 ${
              suggestions.priority === 'alta' 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : suggestions.priority === 'media'
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : 'bg-green-100 text-green-700 border border-green-300'
            }`}
            onClick={() => onApplySuggestion('priority', suggestions.priority)}
          >
            {suggestions.priority}
          </button>
        </div>
      )}
      
      {suggestions.dueDate && (
        <div className="suggestion-item mb-2">
          <span className="suggestion-label text-xs text-gray-600">Fecha límite:</span>
          <button 
            className="suggestion-option bg-white border border-blue-300 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-100 mt-1"
            onClick={() => onApplySuggestion('dueDate', suggestions.dueDate)}
          >
            {suggestions.dueDate}
          </button>
        </div>
      )}
      
      {suggestions.relatedTasks && suggestions.relatedTasks.length > 0 && (
        <div className="suggestion-item">
          <span className="suggestion-label text-xs text-gray-600">Tareas relacionadas:</span>
          <div className="suggestion-options flex flex-wrap gap-1 mt-1">
            {suggestions.relatedTasks.map((task, index) => (
              <button 
                key={index}
                className="suggestion-option bg-white border border-blue-300 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-100"
                onClick={() => onApplySuggestion('relatedTask', task.id)}
              >
                {task.title || task.content.substring(0, 20)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISuggestions;
