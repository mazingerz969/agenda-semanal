import React, { useState, useEffect } from 'react';

const RichNotes = ({ taskId, initialNote = '', onSave }) => {
  const [note, setNote] = useState(initialNote);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    // Convertir el texto con formato simple a HTML para la vista previa
    const formattedText = note
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrita
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Cursiva
      .replace(/\~\~(.*?)\~\~/g, '<del>$1</del>') // Tachado
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>') // Enlaces
      .replace(/\n/g, '<br />'); // Saltos de línea
    
    setPreview(formattedText);
  }, [note]);

  const handleSave = () => {
    onSave(taskId, note);
    setIsEditing(false);
  };

  const insertFormat = (format) => {
    const textarea = document.getElementById(`note-editor-${taskId}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = note.substring(start, end);
    let formattedText = '';
    let cursorPosition = 0;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorPosition = start + 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorPosition = start + 1;
        break;
      case 'strike':
        formattedText = `~~${selectedText}~~`;
        cursorPosition = start + 2;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        cursorPosition = start + selectedText.length + 3;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        cursorPosition = start + 3;
        break;
      default:
        return;
    }

    const newNote = note.substring(0, start) + formattedText + note.substring(end);
    setNote(newNote);

    // Establecer el foco y la posición del cursor después de la actualización
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + formattedText.length);
      } else {
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Notas</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEditing ? 'Vista previa' : 'Editar'}
        </button>
      </div>

      {isEditing ? (
        <div>
          <div className="flex space-x-1 mb-2">
            <button
              onClick={() => insertFormat('bold')}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              title="Negrita"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => insertFormat('italic')}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              title="Cursiva"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => insertFormat('strike')}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              title="Tachado"
            >
              <del>S</del>
            </button>
            <button
              onClick={() => insertFormat('link')}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              title="Enlace"
            >
              🔗
            </button>
            <button
              onClick={() => insertFormat('list')}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              title="Lista"
            >
              •
            </button>
          </div>
          
          <textarea
            id={`note-editor-${taskId}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-40 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Escribe tus notas aquí... Usa **negrita**, *cursiva*, ~~tachado~~ y [enlaces](url)"
          ></textarea>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <p>Formato: <strong>**negrita**</strong>, <em>*cursiva*</em>, <del>~~tachado~~</del>, [texto del enlace](url)</p>
          </div>
          
          <button
            onClick={handleSave}
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Guardar
          </button>
        </div>
      ) : (
        <div>
          {note ? (
            <div 
              className="prose dark:prose-invert p-3 bg-gray-50 dark:bg-gray-700 rounded min-h-[100px] max-h-[300px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: preview }}
            ></div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded min-h-[100px]">
              No hay notas para esta tarea. Haz clic en "Editar" para añadir notas.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RichNotes;
