import React, { useState, useEffect } from 'react';

const AIProductivityAssistant = ({ tasks, userActivity }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [insight, setInsight] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simular análisis de IA
  const analyzeProductivity = () => {
    setIsAnalyzing(true);
    
    // En una implementación real, esto se conectaría a una API de IA
    setTimeout(() => {
      const newSuggestions = [
        {
          id: 1,
          type: 'schedule_optimization',
          title: 'Optimización de horario',
          description: 'Basado en tus patrones de completado, eres más productivo por las mañanas. Considera programar tareas importantes entre 9:00 y 11:00.',
          action: 'Reorganizar tareas prioritarias'
        },
        {
          id: 2,
          type: 'task_grouping',
          title: 'Agrupación de tareas',
          description: 'Detectamos que alternas frecuentemente entre categorías. Agrupar tareas similares puede aumentar tu eficiencia en un 23%.',
          action: 'Agrupar tareas por categoría'
        },
        {
          id: 3,
          type: 'break_reminder',
          title: 'Recordatorio de descansos',
          description: 'Trabajas continuamente por períodos prolongados. Incorporar descansos breves puede mejorar tu concentración y productividad general.',
          action: 'Activar recordatorios de descanso'
        }
      ];
      
      setSuggestions(newSuggestions);
      setInsight('Tu productividad ha aumentado un 12% en la última semana. Continúa con tu buen trabajo en tareas de categoría "trabajo", pero considera dedicar más tiempo a tareas de "desarrollo personal".');
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleApplySuggestion = (suggestionId) => {
    // Implementar la lógica para aplicar la sugerencia
    console.log(`Aplicando sugerencia ${suggestionId}`);
    // Aquí implementarías la acción correspondiente
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Asistente de Productividad IA</h2>
        <button 
          onClick={analyzeProductivity}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 flex items-center"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analizando...
            </>
          ) : 'Analizar mi productividad'}
        </button>
      </div>
      
      {insight && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="text-md font-semibold text-purple-700 dark:text-purple-300 mb-2">Análisis personalizado</h3>
          <p className="text-gray-700 dark:text-gray-300">{insight}</p>
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Sugerencias inteligentes</h3>
          <div className="space-y-3">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{suggestion.description}</p>
                  </div>
                  <button 
                    onClick={() => handleApplySuggestion(suggestion.id)}
                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                  >
                    {suggestion.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!insight && !isAnalyzing && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Haz clic en "Analizar mi productividad" para recibir sugerencias personalizadas basadas en tus patrones de trabajo.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIProductivityAssistant;
