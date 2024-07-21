// TopicsProvider.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TopicsContext = createContext();

export const TopicsProvider = ({ children }) => {
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(true);


  return (
    <TopicsContext.Provider value={{ topics, setTopics, loading, setLoading }}>
      {children}
    </TopicsContext.Provider>
  );
};
