import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  return (
    <UserContext.Provider value={{ user, setUser,loading,setLoading}}>
      {children}
    </UserContext.Provider>
  );
};