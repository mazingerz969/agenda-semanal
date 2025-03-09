import React, { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';

const COLORS = [
  { name: 'Rojo', bg: 'bg-red-100', text: 'text-red-800', dark: 'dark:bg-red-900/20 dark:text-red-300' },
  { name: 'Naranja', bg: 'bg-orange-100', text: 'text-orange-800', dark: 'dark:bg-orange-900/20 dark:text-orange-300' },
  { name: 'Amarillo', bg: 'bg-yellow-100', text: 'text-yellow-800', dark: 'dark:bg-yellow-900/20 dark:text-yellow-300' },
  { name: 'Verde', bg: 'bg-green-100', text: 'text-green-800', dark: 'dark:bg-green-900/20 dark:text-green-300' },
  { name: 'Azul', bg: 'bg-blue-100', text: 'text-blue-800', dark: 'dark:bg-blue-900/20 dark:text-blue-300' },
  { name: 'Índigo', bg: 'bg-indigo-100', text: 'text-indigo-800', dark: 'dark:bg-indigo-900/20 dark:text-indigo-300' },
  { name: 'Púrpura', bg: 'bg-purple-100', text: 'text-purple-800', dark: 'dark:bg-purple-900/20 dark:text-purple-300' },
  { name: 'Rosa', bg: 'bg-pink-100', text: 'text-pink-800', dark: 'dark:bg-pink-900/20 dark:text-pink-300' },
];

function TagSelector({ selectedTags = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem('agenda-tags');
    return savedTags ? JSON.parse(savedTags) : [
      { id: 1, name: 'Trabajo', color: 0 },
      { id: 2, name: 'Personal', color: 4 },
      { id: 3, name: 'Urgente', color: 0 },
      { id: 4, name: 'Proyecto', color: 5 }
    ];
  });
  const [newTag, setNewTag] = useState({ name: '', color: 0 });
  const [editingTag, setEditingTag] = useState(null);

  // Guardar tags en localStorage cuando cambian
  React.useEffect(() => {
    localStorage.setItem('agenda-tags', JSON.stringify(tags));
  }, [tags]);

  const handleToggleTag = (tagId) => {
    const isSelected = selectedTags.includes(tagId);
    const newSelectedTags = isSelected
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onChange(newSelectedTags);
  };

  const handleAddTag = () => {
    if (!newTag.name.trim()) return;
    
    if (editingTag) {
      // Editar etiqueta existente
      setTags(tags.map(tag => 
        tag.id === editingTag.id ? { ...tag, name: newTag.name, color: newTag.color } : tag
      ));
    } else {
      // Añadir nueva etiqueta
      const tagToAdd = {
        id: Date.now(),
        name: newTag.name,
        color: newTag.color
      };
      setTags([...tags, tagToAdd]);
    }
    
    setNewTag({ name: '', color: 0 });
    setEditingTag(null);
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setNewTag({ name: tag.name, color: tag.color });
  };

  const handleDeleteTag = (tagId) => {
    setTags(tags.filter(tag => tag.id !== tagId));
    onChange(selectedTags.filter(id => id !== tagId));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tagId => {
          const tag = tags.find(t => t.id === tagId);
          if (!tag) return null;
          
          const color = COLORS[tag.color];
          return (
            <span 
              key={tag.id} 
              className={inline-flex items-center px-2 py-1 rounded-md text-xs font-medium   }
            >
              {tag.name}
              <button 
                onClick={() => handleToggleTag(tag.id)}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </span>
          );
        })}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        >
          <Tag size={14} className="mr-1" />
          {isOpen ? 'Cerrar' : 'Etiquetas'}
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          <h4 className="text-sm font-medium mb-2">Seleccionar etiquetas</h4>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(tag => {
              const color = COLORS[tag.color];
              const isSelected = selectedTags.includes(tag.id);
              
              return (
                <div key={tag.id} className="flex items-center">
                  <button
                    onClick={() => handleToggleTag(tag.id)}
                    className={inline-flex items-center px-2 py-1 rounded-md text-xs font-medium    }
                  >
                    {tag.name}
                  </button>
                  <div className="flex ml-1">
                    <button
                      onClick={() => handleEditTag(tag)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="ml-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <h4 className="text-sm font-medium mb-2">
              {editingTag ? 'Editar etiqueta' : 'Añadir nueva etiqueta'}
            </h4>
            
            <div className="flex items-center">
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nombre de etiqueta"
              />
              
              <div className="flex ml-2">
                {COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setNewTag({ ...newTag, color: index })}
                    className={w-5 h-5 rounded-full   mr-1}
                  />
                ))}
              </div>
              
              <button
                onClick={handleAddTag}
                disabled={!newTag.name.trim()}
                className="ml-2 p-1 rounded-md bg-indigo-600 text-white disabled:opacity-50"
              >
                {editingTag ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Plus size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TagSelector;
