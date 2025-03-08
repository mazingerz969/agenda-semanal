import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
];

const CustomTagSelector = ({ selectedTags = [], onTagsChange }) => {
  const [tags, setTags] = useState([
    { id: 1, name: 'Importante', color: '#ef4444' },
    { id: 2, name: 'Personal', color: '#3b82f6' },
    { id: 3, name: 'Trabajo', color: '#f59e0b' },
    { id: 4, name: 'Estudio', color: '#10b981' },
  ]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(COLORS[0]);

  const addTag = () => {
    if (newTagName.trim()) {
      const newTag = {
        id: Date.now(),
        name: newTagName.trim(),
        color: newTagColor,
      };
      setTags([...tags, newTag]);
      setNewTagName('');
      setNewTagColor(COLORS[0]);
      setIsAddingTag(false);
    }
  };

  const removeTag = (tagId) => {
    setTags(tags.filter(tag => tag.id !== tagId));
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    }
  };

  const toggleTagSelection = (tagId) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Etiquetas</h3>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <div 
            key={tag.id}
            className={`flex items-center px-3 py-1 rounded-full text-white text-sm ${
              selectedTags.includes(tag.id) ? 'ring-2 ring-offset-2 ring-gray-300' : ''
            }`}
            style={{ backgroundColor: tag.color }}
          >
            <span 
              className="cursor-pointer"
              onClick={() => toggleTagSelection(tag.id)}
            >
              {tag.name}
            </span>
            <button 
              onClick={() => removeTag(tag.id)}
              className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        <button 
          onClick={() => setIsAddingTag(true)}
          className="flex items-center px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <Plus size={16} className="mr-1" /> Nueva etiqueta
        </button>
      </div>

      {isAddingTag && (
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
          <div className="flex mb-2">
            <input 
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Nombre de etiqueta"
              className="flex-grow p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600"
            />
            <button 
              onClick={addTag}
              className="bg-indigo-600 text-white p-2 rounded-r hover:bg-indigo-700"
            >
              <Check size={20} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {COLORS.map(color => (
              <div 
                key={color}
                onClick={() => setNewTagColor(color)}
                className={`w-6 h-6 rounded-full cursor-pointer ${
                  newTagColor === color ? 'ring-2 ring-offset-2 ring-gray-500' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTagSelector; 