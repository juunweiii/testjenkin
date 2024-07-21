import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import TopicPage from './components/TopicPage/TopicPage';
import VerifyLoginOTP from './components/VerifyLoginOTP/VerifyLoginOTP';
import VerifyRegisterOTP from './components/VerifyRegisterOTP/VerifyRegisterOTP';
import ResetPasswordEmail from './components/ResetPasswordEmail/ResetPasswordEmail';
import ResetPassword from './components/ResetPassword/ResetPassword';
import UserProfile from './components/UserProfile/UserProfile';
import SubtopicPage from './components/SubtopicPage/SubtopicPage';
import './App.css';
import SearchResult from './components/SearchResult/SearchResult';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ModeratorDashboard from './components/ModeratorDashboard/ModeratorDashboard';
import axios from 'axios';
import { UserProvider, UserContext } from './components/Shared/UserProvider/UserProvider';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import CodeOfConduct from './components/CodeOfConduct/CodeOfConduct.';
import { TopicsContext } from './components/Shared/TopicsProvider/TopicsProvider';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const authCheck = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/authCheck`, { withCredentials: true });
        if (response.status === 200) {
          setAuthChecked(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    authCheck();
  }, [navigate]);

  if (!authChecked) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return <Component {...rest} />;
};

function App() {
  const [authStatus, setAuthStatus] = useState(localStorage.getItem('authStatus') || 'LOGGED_OUT');
  const [otpExpires, setOtpExpires] = useState(parseInt(localStorage.getItem('otpExpires')) || null);
  const [fpStatus, setFpStatus] = useState(localStorage.getItem('fpStatus') || 'FPOTP_NOT_SENT');
  const [fpOtpExpires, setFpOtpExpires] = useState(parseInt(localStorage.getItem('fpOtpExpires')) || null);
  const { user ,setUser} = useContext(UserContext);
  const { topics ,setTopics} = useContext(TopicsContext);
  const [loading , setLoading] = useState(true)
  const [message, setMessage] = useState('');




  useEffect(() => {
    const fetchAllTopics = async () => {
      ("fetchuser")
      setLoading(true)
      try {
        if (authStatus === 'LOGGED_OUT' || authStatus === 'LOGIN_OTP_PENDING' || authStatus === 'REGISTER_OTP_PENDING') {
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/topics/v1/getAllTopics`, {
          withCredentials: true,
        });
        setTopics(response.data.data.result);
      } 
      
      catch (error) {
        if (error.response) {
          console.error('Error fetching user data:', error.response.data);
          setMessage(`Error fetching user data: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          setMessage('No response from server');
        } else {
          console.error('Error setting up request:', error.message);
          setMessage(`Error user data: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllTopics();
  }, [setTopics, setLoading]);


  useEffect(() => {
    const fetchUserData = async () => {
      ("fetchuser")
      setLoading(true)
      try {
        if (authStatus === 'LOGGED_OUT' || authStatus === 'LOGIN_OTP_PENDING' || authStatus === 'REGISTER_OTP_PENDING') {
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/selfUsersProfile`, {
          withCredentials: true,
        });
  
        setUser(response.data.data)
      } catch (error) {
        if (error.response) {
          console.error('Error fetching user data:', error.response.data);
          setMessage(`Error fetching user data: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          setMessage('No response from server');
        } else {
          console.error('Error setting up request:', error.message);
          setMessage(`Error user data: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUser, setLoading]);

  useEffect(() => {
    localStorage.setItem('authStatus', authStatus);
  }, [authStatus]);

  useEffect(() => {
    localStorage.setItem('otpExpires', otpExpires);
  }, [otpExpires]);

  useEffect(() => {
    localStorage.setItem('fpStatus', fpStatus);
  }, [fpStatus]);

  useEffect(() => {
    localStorage.setItem('fpOtpExpires', fpOtpExpires);
  }, [fpOtpExpires]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (otpExpires && Date.now() > otpExpires) {
        setAuthStatus('LOGGED_OUT');
        setOtpExpires(null);
        localStorage.removeItem('authStatus');
        localStorage.removeItem('otpExpires');
      }
      if (fpOtpExpires && Date.now() > fpOtpExpires) {
        setFpStatus('FPOTP_NOT_SENT');
        setFpOtpExpires(null);
        localStorage.removeItem('fpStatus');
        localStorage.removeItem('fpOtpExpires');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpExpires, fpOtpExpires]);

  useEffect(() => {
    const authCheck = async () => {
      if (authStatus === 'LOGGED_OUT' || authStatus === 'LOGIN_OTP_PENDING' || authStatus === 'REGISTER_OTP_PENDING') {
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/authCheck`, { withCredentials: true });
        if (response.status === 200) {
          setAuthStatus('LOGGED_IN');
        }
      } catch (error) {
        setAuthStatus('LOGGED_OUT');
      }
    };

    authCheck();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or any loading indicator
  }else{

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          authStatus === 'LOGIN_OTP_PENDING' ? <Navigate to="/verifyLoginOTP" /> :
            authStatus === 'LOGGED_IN' ? <Navigate to="/home" /> :
              <Login setAuthStatus={setAuthStatus} setOtpExpires={setOtpExpires} />
        } />
        <Route path="/verifyLoginOTP" element={
          authStatus === 'LOGIN_OTP_PENDING' ? <VerifyLoginOTP setAuthStatus={setAuthStatus} /> :
            authStatus === 'LOGGED_IN' ? <Navigate to="/home" /> :
              <Navigate to="/login" />
        } />
        <Route path="/register" element={
          authStatus === 'REGISTER_OTP_PENDING' ? <Navigate to="/verifyRegisterOTP" /> :
            authStatus === 'LOGGED_IN' ? <Navigate to="/home" /> :
              <Register setAuthStatus={setAuthStatus} setOtpExpires={setOtpExpires} />}
        />
        <Route path="/verifyRegisterOTP" element={
          authStatus === 'REGISTER_OTP_PENDING' ? <VerifyRegisterOTP setAuthStatus={setAuthStatus} /> :
            authStatus === 'LOGGED_IN' ? <Navigate to="/home" /> :
              <Navigate to="/register" />
        } />
        <Route path="/resetPasswordEmail" element={
          fpStatus === 'FPOTP_PENDING' ? <Navigate to='/resetPassword' /> :
            <ResetPasswordEmail setFpStatus={setFpStatus} setFpOtpExpires={setFpOtpExpires} />
        } />
        <Route path="/resetPassword" element={
          fpStatus === 'FPOTP_PENDING' ? <ResetPassword setFpStatus={setFpStatus} /> :
            <Navigate to="/resetPasswordEmail" />
        } />

        <Route path="/home" element={
          <ProtectedRoute element={Home} />
        } />
        <Route path="/profile/:userid" element={
          <ProtectedRoute element={UserProfile} />
        } />
        <Route path="/topic/:topic_title" element={
          <ProtectedRoute element={TopicPage} />
        } />
        <Route path="/admindashboard" element={
          <ProtectedRoute element={AdminDashboard} />
        } />
        <Route path="/moderatordashboard" element={
          <ProtectedRoute element={ModeratorDashboard} />
        } />
        <Route path="/searchresult/:searchOption/:query" element={
          <ProtectedRoute element={SearchResult} />
        } />
        <Route path="/subtopic/:subtopic_id" element={
            <ProtectedRoute element={SubtopicPage} />
          } />
        <Route path="/privacypolicy" element={
            <ProtectedRoute element={PrivacyPolicy} />
          } />
        <Route path="/codeofconduct" element={
            <ProtectedRoute element={CodeOfConduct} />
          } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );}
}

export default App;
