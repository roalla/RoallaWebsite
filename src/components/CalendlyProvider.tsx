'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  const openCalendly = () => {
    setIsOpen(true);
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
      {isOpen && (
        <PopupWidget
          url="https://calendly.com/steven-robin-roalla"
          onModalClose={() => setIsOpen(false)}
          open={isOpen}
          rootElement={document.body}
          prefill={prefill}
        />
      )}
    </CalendlyContext.Provider>
  );
}; 