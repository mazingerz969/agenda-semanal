import React from 'react';

const UniqueSellingPoints = () => {
  const features = [
    {
      id: 'ai-assistant',
      title: 'Asistente de Productividad IA',
      description: 'Recibe recomendaciones personalizadas basadas en tus patrones de trabajo y hábitos de productividad.',
      icon: '🧠',
      color: 'purple'
    },
    {
      id: 'gamification',
      title: 'Sistema de Gamificación',
      description: 'Convierte tus tareas diarias en un juego motivador con puntos, logros y recompensas por completar objetivos.',
      icon: '🏆',
      color: 'yellow'
    },
    {
      id: 'focus-mode',
      title: 'Modo de Enfoque Avanzado',
      description: 'Elimina distracciones y maximiza tu concentración con nuestro temporizador Pomodoro integrado y análisis de sesiones.',
      icon: '🎯',
      color: 'blue'
    },
    {
      id: 'rich-notes',
      title: 'Notas Enriquecidas',
      description: 'Toma notas detalladas con formato, enlaces, imágenes y organízalas junto a tus tareas relacionadas.',
      icon: '📝',
      color: 'green'
    },
    {
      id: 'integrations',
      title: 'Integraciones Profesionales',
      description: 'Conecta con tus herramientas favoritas como Slack, Teams, Notion, Trello y GitHub para un flujo de trabajo sin interrupciones.',
      icon: '🔄',
      color: 'red'
    }
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            ¿Por qué elegir nuestra Agenda Semanal?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
            Características únicas diseñadas para maximizar tu productividad y organización.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className={`relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-t-4 border-${feature.color}-500 hover:shadow-lg transition-shadow duration-300`}
              >
                <div className={`inline-flex items-center justify-center p-3 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-md shadow-lg mb-5`}>
                  <span className="text-3xl" role="img" aria-label={feature.title}>
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#pricing" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Descubre todos los beneficios
          </a>
        </div>
      </div>
    </div>
  );
};

export default UniqueSellingPoints; 