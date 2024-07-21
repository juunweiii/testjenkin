import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useAlert } from './AlertProvider';
import './FloatingAlert.css';

const FloatingAlert = () => {
  const { alert, closeAlert } = useAlert();

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        closeAlert();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert.message, closeAlert]);

  if (!alert.message) return null;

  return (
    <div className="floating-alert-container">
      <Alert variant={alert.variant} onClose={closeAlert} dismissible>
        {alert.message}
      </Alert>
    </div>
  );
};

export default FloatingAlert;
