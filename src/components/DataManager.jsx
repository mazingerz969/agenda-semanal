import React from 'react';
import { Download, Upload } from 'lucide-react';

function DataManager({ tasks, setTasks }) {
  const exportData = () => {
    const data = JSON.stringify(tasks);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenda-semanal-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        setTasks(importedTasks);
        alert(`Se importaron ${importedTasks.length} tareas correctamente`);
      } catch (error) {
        alert('Error al importar: formato de archivo inválido');
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="flex gap-2 p-2">
      <button 
        onClick={exportData}
        className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      >
        <Download size={16} />
        Exportar datos
      </button>
      
      <label className="flex items-center gap-1 px-3 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 cursor-pointer">
        <Upload size={16} />
        Importar datos
        <input 
          type="file" 
          accept=".json" 
          onChange={importData} 
          className="hidden" 
        />
      </label>
    </div>
  );
}

export default DataManager; 