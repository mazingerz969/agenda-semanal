import React from 'react';

const AssistantIframe = () => {
  return (
    <iframe 
      src="/assistant.html"
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '350px',
        height: '450px',
        border: 'none',
        zIndex: 9999
      }}
      title="Asistente IA"
    />
  );
};

export default AssistantIframe; 
