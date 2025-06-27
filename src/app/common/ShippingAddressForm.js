
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Country data
import countriesList from 'country-list';
import { State } from 'country-state-city';

const countries = countriesList.getData().map(c => ({
  code: c.code,
  label: c.name
}));

const theme = createTheme();

const ShippingAddressForm = ({ open = false, onClose = () => {} }) => {
  const [formData, setFormData] = useState({
    attention: '',
    country: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
    faxNumber: ''
  });

  const [stateOptions, setStateOptions] = useState([]);

  useEffect(() => {
    if (formData.country) {
      const states = State.getStatesOfCountry(formData.country);
      setStateOptions(states.map(s => ({
        code: s.isoCode,
        label: s.name
      })));
    } else {
      setStateOptions([]);
    }
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onClose();
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Shipping Address</Typography>
            <IconButton edge="end" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Attention Field */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
              Attention
              </Typography>
              <TextField
                fullWidth
                label="Attention"
                name="attention"
                value={formData.attention}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                placeholder="e.g., John Doe"
              />
            </Grid>

            {/* Country Autocomplete */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Country/Region
              </Typography>
              <Autocomplete
                options={countries}
                getOptionLabel={option => option.label}
                value={countries.find(c => c.code === formData.country) || null}
                onChange={(e, newValue) => 
                  setFormData(prev => ({
                    ...prev,
                    country: newValue?.code || '',
                    state: ''
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Country"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                )}
              />
            </Grid>

            {/* Address Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Address Details
              </Typography>
              <TextField
                fullWidth
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                placeholder="Street address, P.O. box, c/o"
                multiline
              />
              <TextField
                fullWidth
                label="Address Line 2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                placeholder="Apartment, suite, unit, building, floor, etc."
                multiline
              />
            </Grid>

            {/* City and State */}
            <Grid item xs={12} >
              <Typography variant="subtitle2" gutterBottom>
                City
              </Typography>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                State/Province
              </Typography>
              <Autocomplete
                options={stateOptions}
                getOptionLabel={option => option.label}
                value={stateOptions.find(s => s.code === formData.state) || null}
                onChange={(e, newValue) => 
                  setFormData(prev => ({
                    ...prev,
                    state: newValue?.code || ''
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search State"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled={!formData.country}
                  />
                )}
              />
            </Grid>

            {/* Postal Code */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Postal Code
              </Typography>
              <TextField
                fullWidth
                label="ZIP/Postal Code"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Phone Number
              </Typography>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                placeholder="+1 555 123 4567"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Fax Number
              </Typography>
              <TextField
                fullWidth
                label="Fax"
                name="faxNumber"
                value={formData.faxNumber}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                placeholder="+1 555 987 6543"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{
                    p: 2,
                    pt: 0,
                    justifyContent: 'flex-start', // Aligns content to the left
                    gap: 2 // Adds consistent spacing between buttons
                }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            sx={{ 
              textTransform: 'none',
              borderRadius: 1,
              backgroundColor: '#408dfb ',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Save 
          </Button>
          <Button 
            onClick={onClose}
            sx={{ textTransform: 'none', borderRadius: 1 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ShippingAddressForm;