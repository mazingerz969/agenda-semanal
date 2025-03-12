import React, { useState, useEffect, useRef } from 'react';
import { virtualizeList, executeInChunks } from '../utils/performanceOptimization';

const VirtualizedTaskList = ({ tasks, renderTask, itemHeight = 60, containerHeight = 400, overscan = 5 }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleItemsCount, setVisibleItemsCount] = useState(
    Math.ceil(containerHeight / itemHeight) + overscan * 2
  );
  const containerRef = useRef(null);
  
  // Calcular el número de elementos visibles cuando cambia el tamaño del contenedor
  useEffect(() => {
    const updateVisibleItemsCount = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        setVisibleItemsCount(Math.ceil(height / itemHeight) + overscan * 2);
      }
    };
    
    updateVisibleItemsCount();
    
    // Observar cambios en el tamaño del contenedor
    const resizeObserver = new ResizeObserver(updateVisibleItemsCount);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [itemHeight, overscan]);
  
  // Manejar el evento de scroll
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const newStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    setStartIndex(newStartIndex);
  };
  
  // Calcular la altura total de la lista
  const totalHeight = tasks.length * itemHeight;
  
  // Obtener solo los elementos visibles
  const visibleTasks = virtualizeList(tasks, visibleItemsCount, startIndex);
  
  // Calcular el desplazamiento superior para posicionar correctamente los elementos visibles
  const offsetY = startIndex * itemHeight;
  
  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
          {visibleTasks.map((task, index) => (
            <div key={task.id} style={{ height: itemHeight }}>
              {renderTask(task, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedTaskList; 
