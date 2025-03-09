import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  startFreeTrial, 
  checkTrialStatus, 
  TrialBanner 
} from '../services/trialService';
import { trackEvent, ANALYTICS_EVENTS } from '../services/analyticsService';

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
    <TrialBanner 
      onStartTrial={handleStartTrial}
      onViewPlans={handleViewPlans}
    />
  );
};

export default TrialManager;
