'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { PopupWidget } from 'react-calendly';

interface CalendlyContextType {
  openCalendly: () => void;
}

const CalendlyContext = createContext<CalendlyContextType | undefined>(undefined);

export const useCalendly = () => {
  const context = useContext(CalendlyContext);
  if (!context) {
    throw new Error('useCalendly must be used within a CalendlyProvider');
  }
  return context;
};

interface CalendlyProviderProps {
  children: ReactNode;
}

export const CalendlyProvider = ({ children }: CalendlyProviderProps) => {
  const openCalendly = () => {
    // The PopupWidget will handle its own state
    // We just need to render it
  };

  const prefill = {
    name: '',
    email: '',
    customAnswers: {
      a1: '',
      a2: '',
      a3: '',
      a4: '',
      a5: ''
    }
  };

  return (
    <CalendlyContext.Provider value={{ openCalendly }}>
      {children}
      <PopupWidget
        url="https://calendly.com/steven-robin-roalla"
        rootElement={document.body}
        prefill={prefill}
        text="Schedule a meeting"
      />
    </CalendlyContext.Provider>
  );
}; 