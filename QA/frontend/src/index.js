import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './components/Shared/UserProvider/UserProvider';
import { TopicsProvider } from './components/Shared/TopicsProvider/TopicsProvider';
import { AlertProvider } from './components/Shared/ErrorHandling/AlertProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <AlertProvider>
        <TopicsProvider>
          <App />
        </TopicsProvider>
      </AlertProvider>   
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
