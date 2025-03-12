// Función para extraer palabras clave del texto
export const extractKeywords = (text) => {
  if (!text) return [];
  
  // Lista de palabras vacías (stop words) en español
  const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'si', 'no', 'en', 'con', 'por', 'para', 'de', 'a', 'del', 'al'];
  
  // Normalizar texto: minúsculas y eliminar caracteres especiales
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Dividir en palabras y filtrar palabras vacías
  const words = normalizedText.split(/\s+/).filter(word => 
    word.length > 2 && !stopWords.includes(word)
  );
  
  // Contar frecuencia de palabras
  const wordFrequency = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Ordenar por frecuencia
  const sortedWords = Object.keys(wordFrequency).sort((a, b) => 
    wordFrequency[b] - wordFrequency[a]
  );
  
  return sortedWords.slice(0, 5); // Devolver las 5 palabras más frecuentes
};

// Función para detectar fechas en el texto
export const extractDates = (text) => {
  if (!text) return null;
  
  // Patrones para fechas en español
  const datePatterns = [
    // "10 de enero", "10 de enero de 2023"
    /(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)(\s+de\s+\d{4})?/i,
    
    // "mañana", "pasado mañana", "próximo lunes"
    /(mañana|pasado\s+mañana|próximo\s+(lunes|martes|miércoles|jueves|viernes|sábado|domingo))/i,
    
    // "en 3 días", "en una semana"
    /en\s+(\d+|una|dos|tres|cuatro|cinco)\s+(día|días|semana|semanas|mes|meses)/i,
    
    // Formato numérico: 10/01/2023, 10-01-2023
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/
  ];
  
  // Buscar coincidencias con los patrones
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        fullMatch: match[0],
        details: match.slice(1).filter(Boolean)
      };
    }
  }
  
  return null;
};

// Función para detectar prioridad en el texto
export const detectPriority = (text) => {
  if (!text) return null;
  
  const lowPriorityTerms = ['baja', 'poco', 'después', 'cuando pueda', 'si hay tiempo'];
  const mediumPriorityTerms = ['media', 'normal', 'estándar', 'regular'];
  const highPriorityTerms = ['alta', 'urgente', 'importante', 'crítico', 'prioritario', 'inmediato', 'necesario'];
  
  const normalizedText = text.toLowerCase();
  
  if (highPriorityTerms.some(term => normalizedText.includes(term))) {
    return 'alta';
  } else if (mediumPriorityTerms.some(term => normalizedText.includes(term))) {
    return 'media';
  } else if (lowPriorityTerms.some(term => normalizedText.includes(term))) {
    return 'baja';
  }
  
  return null;
};

// Función para calcular similitud entre textos (para encontrar tareas relacionadas)
export const calculateTextSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  const keywords1 = extractKeywords(text1);
  const keywords2 = extractKeywords(text2);
  
  // Contar palabras comunes
  const commonWords = keywords1.filter(word => keywords2.includes(word));
  
  // Calcular coeficiente de Jaccard
  const similarity = commonWords.length / (keywords1.length + keywords2.length - commonWords.length);
  
  return similarity;
}; 
