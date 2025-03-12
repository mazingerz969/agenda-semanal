import React, { useState, useEffect } from 'react';

const StandaloneAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [userInput, setUserInput] = useState('');
  
  // Mensajes predefinidos
  const messages = [
    "¿En qué puedo ayudarte hoy?",
    "¿Necesitas organizar mejor tus tareas?",
    "¿Quieres que te sugiera formas de mejorar tu productividad?",
    "Estoy aquí para ayudarte a gestionar mejor tu tiempo.",
    "¿Tienes alguna pregunta sobre cómo usar la aplicación?"
  ];
  
  // Mostrar un mensaje aleatorio cuando se abre el asistente
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
    }
  }, [isOpen]);
  
  // Manejar el envío de mensajes
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    setMessage("Gracias por tu mensaje. Estoy aprendiendo a proporcionar respuestas más útiles.");
    setUserInput('');
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{isOpen ? '✕' : '🤖'}</span>
      </button>
      
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl p-4 mb-2 w-80 max-h-96 overflow-y-auto absolute bottom-12 right-0">
          <div className="bg-gray-100 p-3 rounded-lg mb-4">
            {message}
          </div>
          
          <div className="flex">
            <input 
              type="text" 
              placeholder="Pregúntame algo sobre tus tareas..."
              className="flex-grow border rounded-l px-2 py-1 text-sm"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="bg-blue-500 text-white px-3 py-1 rounded-r text-sm"
              onClick={handleSendMessage}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandaloneAIAssistant; 
