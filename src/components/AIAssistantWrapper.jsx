import React from 'react';
import { TaskProvider } from '../contexts/TaskContext';
import { StatsProvider } from '../contexts/StatsContext';
import AIAssistant from './AIAssistant';

const AIAssistantWrapper = () => {
  return (
    <TaskProvider>
      <StatsProvider>
        <AIAssistant />
      </StatsProvider>
    </TaskProvider>
  );
};

export default AIAssistantWrapper; 