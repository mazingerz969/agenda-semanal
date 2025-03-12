import { trackEvent } from './analyticsService';

class VoiceAssistantService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.commandHandlers = new Map();
  }
  
  initialize() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Reconocimiento de voz no soportado en este navegador');
      return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'es-ES';
    
    this.recognition.onresult = this.handleSpeechResult.bind(this);
    this.recognition.onerror = this.handleSpeechError.bind(this);
    this.recognition.onend = () => {
      this.isListening = false;
    };
    
    // Registrar comandos básicos
    this.registerCommand('crear tarea', this.createTaskCommand);
    this.registerCommand('mostrar tareas', this.showTasksCommand);
    this.registerCommand('completar tarea', this.completeTaskCommand);
    
    return true;
  }
  
  registerCommand(phrase, handler) {
    this.commandHandlers.set(phrase.toLowerCase(), handler);
  }
  
  startListening() {
    if (!this.recognition) {
      if (!this.initialize()) return false;
    }
    
    try {
      this.recognition.start();
      this.isListening = true;
      trackEvent('Voice', 'start_listening', 'success');
      return true;
    } catch (error) {
      console.error('Error al iniciar reconocimiento de voz:', error);
      trackEvent('Voice', 'start_listening', 'error');
      return false;
    }
  }
  
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      trackEvent('Voice', 'stop_listening', 'success');
    }
  }
  
  speak(text) {
    if (!this.synthesis) return false;
    
    // Detener cualquier síntesis en curso
    this.synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    this.synthesis.speak(utterance);
    trackEvent('Voice', 'speak', 'success');
    return true;
  }
  
  handleSpeechResult(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    trackEvent('Voice', 'recognition_result', transcript);
    
    // Buscar comandos que coincidan
    for (const [phrase, handler] of this.commandHandlers.entries()) {
      if (transcript.includes(phrase)) {
        handler(transcript);
        return;
      }
    }
    
    // Si no se encontró ningún comando
    this.speak('Lo siento, no entendí ese comando. Puedes decir "crear tarea", "mostrar tareas" o "completar tarea".');
  }
  
  handleSpeechError(event) {
    console.error('Error de reconocimiento de voz:', event.error);
    trackEvent('Voice', 'recognition_error', event.error);
  }
  
  // Implementaciones de comandos
  createTaskCommand(transcript) {
    // Extraer título de la tarea del transcript
    const titleMatch = transcript.match(/crear tarea (.+)/i);
    if (titleMatch && titleMatch[1]) {
      const taskTitle = titleMatch[1].trim();
      // Aquí se dispararía un evento o se llamaría a una función para crear la tarea
      // ...
      this.speak(`Creando tarea: ${taskTitle}`);
    } else {
      this.speak('¿Qué tarea quieres crear?');
    }
  }
  
  showTasksCommand() {
    // Implementación para mostrar tareas
    // ...
  }
  
  completeTaskCommand(transcript) {
    // Implementación para completar tarea
    // ...
  }
}

export const voiceAssistant = new VoiceAssistantService(); 
