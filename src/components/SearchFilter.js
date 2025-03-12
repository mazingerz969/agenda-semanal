import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'all',
    tags: [],
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateFilters({ ...filters, searchTerm: value });
  };

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    updateFilters({ ...newFilters, searchTerm });
  };

  const toggleTag = (tagId) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...filters.tags, tagId];
    
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: 'all',
      priority: 'all',
      status: 'all',
      tags: [],
    };
    setFilters(resetFilters);
    updateFilters({ ...resetFilters, searchTerm });
  };

  const updateFilters = (newFilters) => {
    onFilterChange(newFilters);
  };

  // Datos de ejemplo para categorías y etiquetas
  const categories = ['Trabajo', 'Personal', 'Estudio', 'Salud', 'Finanzas'];
  const priorities = ['Alta', 'Media', 'Baja'];
  const statuses = ['Pendiente', 'En progreso', 'Completada'];
  const tags = [
    { id: 1, name: 'Importante', color: '#ef4444' },
    { id: 2, name: 'Personal', color: '#3b82f6' },
    { id: 3, name: 'Trabajo', color: '#f59e0b' },
    { id: 4, name: 'Estudio', color: '#10b981' },
  ];

  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar tareas..."
          className="w-full p-3 pl-10 pr-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <Filter className={`h-5 w-5 ${showFilters ? 'text-indigo-600' : 'text-gray-400'}`} />
        </button>
      </div>

      {showFilters && (
        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Filtros</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
            >
              <X size={16} className="mr-1" /> Limpiar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoría
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prioridad
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">Todas</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority.toLowerCase()}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">Todos</option>
                {statuses.map((status) => (
                  <option key={status} value={status.toLowerCase()}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Etiquetas */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    filters.tags.includes(tag.id) ? 'ring-2 ring-offset-2 ring-gray-300' : ''
                  }`}
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter; 
