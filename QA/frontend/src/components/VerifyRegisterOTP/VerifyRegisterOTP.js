import * as React from 'react';
import { useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit">
                Threadhub
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

    export default function VerifyLoginOTP({ setAuthStatus }) {
        const backgroundImg = `${process.env.PUBLIC_URL}/images/threadhub_bg.jpg`;
        const email = localStorage.getItem('email');
        const [otp, setOTP] = useState('');
        const [error, setError] = useState('');
        
        const defaultTheme = createTheme();
    
        const handleVerifyLoginOtp = async (e) => {
            e.preventDefault();
            const params = {
                email: email,
                otp: otp,
            };
            try {
                axios.get(`${process.env.REACT_APP_HTTP_URL}/api/auth/v1/registerOTP`, { params })
                .then(response => {
                    // Handle the response data
                    
                    localStorage.removeItem('email');
                    setAuthStatus("REGISTER_SUCCESS");
                    window.location.href = "/login";
                })
                .catch(error => {
                    if (error.response.status === 400)
                        setError("Incorrect OTP. Please check your email and try again.");
                    // Handle the error
                    console.error('There was an error making the request:', error);
                });

            } catch (error) {
                console.error('OTP verification failed', error);
            }
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
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Verify OTP
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                An One Time Password (OTP) has been sent to your email <br></br><br></br>
                                <strong>{email}</strong> <br></br><br></br>
                                Please check your email or spam folder and enter the OTP below.
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleVerifyLoginOtp} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="otp"
                                    label="OTP"
                                    type="text"
                                    id="otp"
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10}}
                                onChange={(e) => {
                                    setOTP(e.target.value) 
                                    setError('')
                                }}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                />
                                {error && <Typography color="error">{error}</Typography>}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={!otp || otp.length < 3}
                                >
                                    Verify OTP
                                </Button>
                                <Copyright sx={{ mt: 5 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }