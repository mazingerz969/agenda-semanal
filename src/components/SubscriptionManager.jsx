import React, { useState, useEffect } from 'react';

const SubscriptionManager = ({ currentUser, onUpgrade }) => {
  const [plans, setPlans] = useState([
    {
      id: 'free',
      name: 'Plan Gratuito',
      price: 0,
      features: [
        'Gestión básica de tareas',
        'Calendario semanal',
        'Tema claro/oscuro',
        'Hasta 20 tareas'
      ],
      recommended: false
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: 4.99,
      interval: 'mes',
      features: [
        'Tareas ilimitadas',
        'Sincronización con Google Calendar',
        'Plantillas de tareas',
        'Notas enriquecidas',
        'Modo de enfoque',
        'Estadísticas avanzadas'
      ],
      recommended: true
    },
    {
      id: 'business',
      name: 'Plan Empresarial',
      price: 9.99,
      interval: 'mes',
      features: [
        'Todo lo del plan Premium',
        'Colaboración en equipo',
        'Asignación de tareas',
        'Reportes de productividad',
        'Integración con Slack/Teams',
        'Soporte prioritario'
      ],
      recommended: false
    }
  ]);

  const handleSelectPlan = (planId) => {
    // Aquí implementarías la lógica de pago
    // Podrías integrar con Stripe, PayPal, etc.
    onUpgrade(planId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Planes de suscripción</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div 
            key={plan.id} 
            className={`border rounded-lg p-4 ${plan.recommended ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'}`}
          >
            {plan.recommended && (
              <div className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-t mb-2 -mt-4 -mx-4 text-center">
                RECOMENDADO
              </div>
            )}
            
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{plan.name}</h3>
            
            <div className="my-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.price === 0 ? 'Gratis' : `${plan.price}€`}
              </span>
              {plan.interval && (
                <span className="text-gray-500 dark:text-gray-400">/{plan.interval}</span>
              )}
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => handleSelectPlan(plan.id)}
              className={`w-full py-2 px-4 rounded ${
                plan.recommended 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white'
              }`}
            >
              {plan.price === 0 ? 'Comenzar gratis' : 'Suscribirse'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionManager;

