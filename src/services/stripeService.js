// Servicio para integración con Stripe
import { loadStripe } from '@stripe/stripe-js';

// Cargar Stripe (en una implementación real, usarías tu clave pública de Stripe)
const stripePromise = loadStripe('pk_test_TU_CLAVE_PUBLICA_DE_STRIPE');

// Iniciar checkout de Stripe
export const startSubscription = async (planId) => {
  try {
    const stripe = await stripePromise;
    
    // En una implementación real, esto haría una llamada a tu backend
    // para crear una sesión de checkout
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
      }),
    });
    
    const session = await response.json();
    
    // Redirigir al checkout de Stripe
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (result.error) {
      console.error(result.error.message);
      return {
        success: false,
        error: result.error.message
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error al iniciar suscripción:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verificar estado de suscripción
export const checkSubscriptionStatus = async () => {
  try {
    // En una implementación real, esto haría una llamada a tu backend
    const response = await fetch('/api/subscription-status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error al verificar suscripción:', error);
    return {
      active: false,
      error: error.message
    };
  }
};

// Cancelar suscripción
export const cancelSubscription = async () => {
  try {
    // En una implementación real, esto haría una llamada a tu backend
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
