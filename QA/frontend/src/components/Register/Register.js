import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaUserPlus } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">Threadhub</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function RegisterSide({ setAuthStatus, setOtpExpires }) {
  const navigate = useNavigate();
  const backgroundImg = `${process.env.PUBLIC_URL}/images/threadhub_bg.jpg`;
  const [email, setEmail] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewProfilePicture, setPreviewProfilePicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // For Modal
  const [show, setShow] = useState(false);
  const [editedProfilePicture, setEditedProfilePicture] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleProfilePictureInputChange = (e) => setEditedProfilePicture(e.target.value);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const defaultProfilePicture = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';

  const navigateToVerifyRegisterOTP = () => {
    navigate('/verifyRegisterOTP');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfilePictureFile(editedProfilePicture);
    setPreviewProfilePicture(editedProfilePicture || defaultProfilePicture);
    handleClose();
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedUsername = DOMPurify.sanitize(username);
    const sanitizedProfilePictureURL = DOMPurify.sanitize(profilePictureFile);
    const sanitizedDefaultProfilePicture = DOMPurify.sanitize(defaultProfilePicture);

    if (!validateEmail(sanitizedEmail)) {
      setError('Invalid email format');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_HTTP_URL}/api/auth/v1/register`, 
        {
          username: sanitizedUsername,
          email: sanitizedEmail,
          password: password,
          profilePicture: sanitizedProfilePictureURL || sanitizedDefaultProfilePicture
        }
      , {
      });

      if (res.data.statusCode === 200) {
        setAuthStatus('REGISTER_OTP_PENDING');
        setOtpExpires(Date.now() + 10 * 60 * 1000); // 10 minutes
        toast('Registered Successfully', { duration: 3000 });

        localStorage.setItem('email', email);
        setTimeout(() => {
          navigateToVerifyRegisterOTP();
        }, 3000);

        // Reset after successful registration
        setEmail('');
        setUserName('');
        setPassword('');
        setConfirmPassword('');
        setProfilePictureFile(null);
        setPreviewProfilePicture(null);
      } else {
        setError('User registration failed: ' + res.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError('Email or username already exists, please login or use another email/username');
      } else {
        setError('Registration failed. Please try again later.');
      }

    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownConfirmPassword = (event) => event.preventDefault();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordsMatch(newPassword === confirmPassword);
    setError(''); // Reset error message
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(password === newConfirmPassword);
    setError(''); // Reset error message
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <FaUserPlus />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
              Create an Account
            </Typography>
            <Avatar sx={{ width: 100, height: 100, mt: 2 }}>
              <img src={previewProfilePicture || defaultProfilePicture} alt="Profile Preview" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            </Avatar>
            <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <label htmlFor="profile-picture-input" style={{ cursor: 'pointer' }}>
                  <Button variant="contained" component="span" style={{ backgroundColor: '#38A3A5' }} onClick={handleShow}>
                    Choose Profile Picture
                  </Button>
                </label>
              </Box>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="UserName"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => {
                  setUserName(e.target.value);
                  setError(''); // Reset error message
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(''); // Reset error message
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="current-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {!passwordsMatch && confirmPassword && (
                <Typography color="error">Passwords do not match</Typography>
              )}
              {error && <Typography color="error">{error}</Typography>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!email || !password || !username || !confirmPassword || !validateEmail(email) || !passwordsMatch}
              >
                Create a Free Account
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/login" variant="body2">
                    {'Already have an account? Log In'}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Modal show={show} onHide={handleClose} className="edit-profile-picture-modal" size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Change Profile Picture</Modal.Title>
          </Modal.Header>
          <div className="edited-preview-container">
            <img src={editedProfilePicture || defaultProfilePicture} alt="profile-picture" className="profile-page-preview-img" />
          </div>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Edit Profile Picture Link</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder={defaultProfilePicture} value={editedProfilePicture} onChange={handleProfilePictureInputChange} />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" className="modal-btn" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" className="modal-btn" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Toaster />
    </ThemeProvider>
  );
}
