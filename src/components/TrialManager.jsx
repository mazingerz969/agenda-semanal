import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  startFreeTrial, 
  checkTrialStatus, 
  TrialBanner 
} from '../services/trialService';
import { trackEvent, ANALYTICS_EVENTS } from '../services/analyticsService';
import { Clock } from 'lucide-react';

const TrialManager = () => {
  const [trialStatus, setTrialStatus] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar estado de la prueba al cargar el componente
    const status = checkTrialStatus();
    setTrialStatus(status);
  }, []);
  
  const handleStartTrial = () => {
    // Iniciar prueba gratuita
    const trialData = startFreeTrial();
    setTrialStatus({
      active: true,
      eligible: false,
      daysLeft: 14, // TRIAL_DURATION_DAYS
      endDate: trialData.endDate
    });
    
    // Registrar evento de analítica
    trackEvent(
      'Subscription',
      ANALYTICS_EVENTS.SUBSCRIPTION.START_TRIAL
    );
    
    // Mostrar mensaje de éxito
    alert('¡Tu prueba gratuita ha comenzado! Disfruta de todas las funcionalidades premium durante 14 días.');
  };
  
  const handleViewPlans = () => {
    // Registrar evento de analítica
    trackEvent(
      'Subscription',
      ANALYTICS_EVENTS.SUBSCRIPTION.VIEW_PLANS,
      trialStatus?.active ? 'from_trial' : 'from_expired'
    );
    
    // Navegar a la página de precios
    navigate('/pricing');
  };
  
  if (!trialStatus) {
    return null;
  }
  
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-3 text-center text-sm">
      <div className="flex items-center justify-center flex-wrap gap-2">
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Estás disfrutando de tu prueba gratuita. Quedan 14 días.
        </span>
        <button 
          className="bg-white text-indigo-600 px-2 py-0.5 rounded-md text-xs font-medium hover:bg-opacity-90"
          onClick={handleViewPlans}
        >
          Más información
        </button>
      </div>
    </div>
  );
};

export default TrialManager;

