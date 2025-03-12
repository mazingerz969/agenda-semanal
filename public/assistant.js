// Crear elementos del asistente
function createAssistant() {
  // Verificar si el asistente ya existe
  if (document.getElementById('ai-assistant-container')) {
    return;
  }
  
  // Crear contenedor principal
  const assistantContainer = document.createElement('div');
  assistantContainer.id = 'ai-assistant-container';
  assistantContainer.style.position = 'fixed';
  assistantContainer.style.bottom = '16px';
  assistantContainer.style.right = '16px';
  assistantContainer.style.zIndex = '9999';
  
  // Crear botón
  const toggleButton = document.createElement('button');
  toggleButton.id = 'ai-toggle-button';
  toggleButton.style.backgroundColor = '#3b82f6';
  toggleButton.style.color = 'white';
  toggleButton.style.border = 'none';
  toggleButton.style.borderRadius = '9999px';
  toggleButton.style.padding = '12px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  toggleButton.style.fontSize = '20px';
  toggleButton.textContent = '🤖';
  
  // Crear panel
  const assistantPanel = document.createElement('div');
  assistantPanel.id = 'ai-assistant-panel';
  assistantPanel.style.display = 'none';
  assistantPanel.style.backgroundColor = 'white';
  assistantPanel.style.borderRadius = '8px';
  assistantPanel.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
  assistantPanel.style.padding = '16px';
  assistantPanel.style.marginBottom = '8px';
  assistantPanel.style.width = '320px';
  assistantPanel.style.maxHeight = '384px';
  assistantPanel.style.overflowY = 'auto';
  assistantPanel.style.position = 'absolute';
  assistantPanel.style.bottom = '48px';
  assistantPanel.style.right = '0';
  
  // Crear mensaje
  const messageElement = document.createElement('div');
  messageElement.id = 'ai-message';
  messageElement.style.backgroundColor = '#f3f4f6';
  messageElement.style.padding = '12px';
  messageElement.style.borderRadius = '8px';
  messageElement.style.marginBottom = '16px';
  messageElement.textContent = '¿En qué puedo ayudarte hoy?';
  
  // Crear área de entrada
  const inputArea = document.createElement('div');
  inputArea.style.display = 'flex';
  
  // Crear input
  const userInput = document.createElement('input');
  userInput.id = 'ai-user-input';
  userInput.type = 'text';
  userInput.placeholder = 'Pregúntame algo sobre tus tareas...';
  userInput.style.flexGrow = '1';
  userInput.style.border = '1px solid #d1d5db';
  userInput.style.borderTopLeftRadius = '4px';
  userInput.style.borderBottomLeftRadius = '4px';
  userInput.style.padding = '8px';
  userInput.style.fontSize = '14px';
  
  // Crear botón de enviar
  const sendButton = document.createElement('button');
  sendButton.id = 'ai-send-button';
  sendButton.style.backgroundColor = '#3b82f6';
  sendButton.style.color = 'white';
  sendButton.style.border = 'none';
  sendButton.style.padding = '8px 12px';
  sendButton.style.borderTopRightRadius = '4px';
  sendButton.style.borderBottomRightRadius = '4px';
  sendButton.style.fontSize = '14px';
  sendButton.style.cursor = 'pointer';
  sendButton.textContent = 'Enviar';
  
  // Añadir elementos al DOM
  inputArea.appendChild(userInput);
  inputArea.appendChild(sendButton);
  
  assistantPanel.appendChild(messageElement);
  assistantPanel.appendChild(inputArea);
  
  assistantContainer.appendChild(toggleButton);
  assistantContainer.appendChild(assistantPanel);
  
  document.body.appendChild(assistantContainer);
  
  // Mensajes predefinidos
  const messages = [
    "¿En qué puedo ayudarte hoy?",
    "¿Necesitas organizar mejor tus tareas?",
    "¿Quieres que te sugiera formas de mejorar tu productividad?",
    "Estoy aquí para ayudarte a gestionar mejor tu tiempo.",
    "¿Tienes alguna pregunta sobre cómo usar la aplicación?"
  ];
  
  // Mostrar/ocultar el panel
  toggleButton.addEventListener('click', function() {
    console.log('Botón pulsado');
    const isVisible = assistantPanel.style.display !== 'none';
    
    if (isVisible) {
      assistantPanel.style.display = 'none';
      toggleButton.textContent = '🤖';
    } else {
      assistantPanel.style.display = 'block';
      toggleButton.textContent = '✕';
      
      // Mostrar un mensaje aleatorio
      const randomIndex = Math.floor(Math.random() * messages.length);
      messageElement.textContent = messages[randomIndex];
    }
  });
  
  // Enviar mensaje
  const sendMessage = function() {
    const text = userInput.value.trim();
    if (!text) return;
    
    // Respuesta simple
    messageElement.textContent = "Gracias por tu mensaje. Estoy aprendiendo a proporcionar respuestas más útiles.";
    userInput.value = '';
  };
  
  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
  });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createAssistant);
} else {
  createAssistant();
} 
