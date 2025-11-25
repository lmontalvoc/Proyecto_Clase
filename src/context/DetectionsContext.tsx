import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Detection } from '../types/detection';

interface DetectionsContextValue {
  detections: Detection[];
  addDetection: (detection: Detection) => void;
}

const DetectionsContext = createContext<DetectionsContextValue | undefined>(undefined);

export const DetectionsProvider = ({ children }: { children: ReactNode }) => {
  const [detections, setDetections] = useState<Detection[]>([]);

  const addDetection = (d: Detection) => {
    setDetections(prev => [d, ...prev]);
  };

  return (
    <DetectionsContext.Provider value={{ detections, addDetection }}>
      {children}
    </DetectionsContext.Provider>
  );
};

export const useDetections = () => {
  const ctx = useContext(DetectionsContext);
  if (!ctx) throw new Error('useDetections must be used within DetectionsProvider');
  return ctx;
};
