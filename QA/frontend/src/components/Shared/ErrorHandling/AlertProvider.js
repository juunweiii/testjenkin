import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: '', variant: 'info' });

  const showAlert = (message, variant = 'info') => {
    setAlert({ message, variant });
  };

  const closeAlert = () => {
    setAlert({ message: '', variant: 'info' });
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
