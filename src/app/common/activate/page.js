'use client';
// app/portal/activate/page.js

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import apiService from '../../../services/axiosService';
import config from '../../../services/config';

const PortalActivation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  useEffect(() => {
    if (token) {
      verifyInvite();
    } else {
      setLoading(false);
      setError('Invalid activation link. Please request a new invitation.');
    }
  }, [token]);
  
  const verifyInvite = async () => {
    try {
      const response = await apiService({
        method: 'GET',
        url: `/api/v1/verify-invite?token=${token}`,
        customBaseUrl: config.PO_Base_url,
      });
      
      if (response.status) {
        setSuccess(true);
        setUserDetails(response.data);
      } else {
        setError(response.message || 'Failed to verify invitation');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify invitation. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiService({
        method: 'POST',
        url: '/api/v1/portal/setup-account',
        data: {
          token,
          password,
          email: userDetails.email,
          contact_id: userDetails.contactId
        }
      });
      
      if (response.status) {
        router.push('/portal/login?activated=true');
      } else {
        setError(response.message || 'Failed to setup account');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error setting up account:', err);
      setError(err.response?.data?.message || 'Failed to setup your account');
      setLoading(false);
    }
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Verifying your invitation...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper sx={{ p: 4, width: '100%', maxWidth: 500, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
          <Typography variant="h5" gutterBottom>Activation Failed</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>{error}</Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => router.push('/portal/login')}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }
  
  if (success && userDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper sx={{ p: 4, width: '100%', maxWidth: 500 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
            <Typography variant="h5" gutterBottom>Invitation Accepted!</Typography>
            <Typography variant="body1">
              Welcome to the portal, your account has been activated. You can now set up your password.
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Your username is: <strong>{userDetails.email}</strong>
            </Alert>
            
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                required
              />
            </FormControl>
            
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
              <OutlinedInput
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirm Password"
                required
              />
            </FormControl>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Complete Setup'}
            </Button>
          </form>
        </Paper>
      </Box>
    );
  }
  
  return null;
};

export default PortalActivation;