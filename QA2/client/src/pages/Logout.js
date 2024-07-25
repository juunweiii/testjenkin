// src/pages/Logout.js
import { useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return null;
};

export default Logout;
