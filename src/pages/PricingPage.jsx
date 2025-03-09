import React, { useState } from 'react';
import { trackEvent, ANALYTICS_EVENTS } from '../services/analyticsService';

const PricingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const plans = [
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
      id: 'premium-monthly',
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
      id: 'premium-yearly',
      name: 'Plan Premium Anual',
      price: 49.99,
      interval: 'año',
      discount: '17% de descuento',
      features: [
        'Tareas ilimitadas',
        'Sincronización con Google Calendar',
        'Plantillas de tareas',
        'Notas enriquecidas',
        'Modo de enfoque',
        'Estadísticas avanzadas'
      ],
      recommended: false
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
  ];
  
  const handleSelectPlan = async (planId) => {
    if (planId === 'free') {
      // Redirigir a la aplicación con plan gratuito
      window.location.href = '/app';
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // En una implementación real, aquí iniciarías el proceso de pago
      // Por ahora, solo registramos el evento
      trackEvent(
        'Subscription',
        ANALYTICS_EVENTS.SUBSCRIPTION.SUBSCRIBE,
        planId
      );
      
      // Simular proceso de pago
      setTimeout(() => {
        alert(`Has seleccionado el plan ${planId}. En una implementación real, aquí se procesaría el pago.`);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Error inesperado al procesar la suscripción');
      console.error(err);
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Planes y Precios
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
            Elige el plan perfecto para ti o tu equipo
          </p>
        </div>
        
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-4">
          {plans.map(plan => (
            <div 
              key={plan.id} 
              className={`border rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700 ${
                plan.recommended 
                  ? 'border-blue-500 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.recommended && (
                <div className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-t text-center">
                  RECOMENDADO
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">{plan.name}</h2>
                {plan.discount && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">{plan.discount}</p>
                )}
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">
                  {plan.id === 'free' 
                    ? 'Perfecto para comenzar a organizar tus tareas' 
                    : plan.id === 'business'
                      ? 'Para equipos que necesitan colaboración y análisis avanzados'
                      : 'Para profesionales que buscan maximizar su productividad'}
                </p>
                
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price === 0 ? 'Gratis' : `${plan.price}€`}
                  </span>
                  {plan.interval && (
                    <span className="text-base font-medium text-gray-500 dark:text-gray-300">/{plan.interval}</span>
                  )}
                </p>
                
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading}
                  className={`mt-8 block w-full py-2 px-4 border rounded-md text-sm font-semibold text-center ${
                    plan.recommended
                      ? 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white'
                      : plan.id === 'free'
                        ? 'bg-gray-800 hover:bg-gray-900 border-gray-800 text-white dark:bg-gray-200 dark:hover:bg-white dark:border-gray-200 dark:text-gray-900'
                        : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white'
                  }`}
                >
                  {loading 
                    ? 'Procesando...' 
                    : plan.id === 'free' 
                      ? 'Comenzar gratis' 
                      : plan.id === 'business'
                        ? 'Contactar para demo'
                        : 'Suscribirse'}
                </button>
              </div>
              
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Incluye:</h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex space-x-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-500 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="mt-8 max-w-md mx-auto p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">¿Tienes preguntas?</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            Contáctanos en <a href="mailto:soporte@agendasemanal.com" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">soporte@agendasemanal.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
