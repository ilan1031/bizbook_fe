
"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
  Popover,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

// Tax Preferences Component as a Popover/Tooltip
const TaxPreferencesPopover = ({ anchorEl, open, onClose, customerData, onUpdate }) => {
  const [gstin, setGstin] = useState(customerData?.gst_no || "33AAACB2902M1Z0");
  const [gstTreatment, setGstTreatment] = useState(customerData?.gst_treatment || "Registered Business - Composition");
  const [isPermanent, setIsPermanent] = useState(true);

  // Options array with labels and descriptions
  const options = [
    {
      label: "Registered Business - Regular",
      desc: "Business registered under GST",
    },
    {
      label: "Registered Business - Composition",
      desc: "Business under composition scheme",
    },
    {
      label: "Unregistered Business",
      desc: "Business not registered under GST",
    },
    {
      label: "Consumer",
      desc: "Individual consumer or end user",
    },
    {
      label: "Overseas",
      desc: "Business or individual located outside India",
    },
    {
      label: "Special Economic Zone",
      desc: "Business operating in SEZ",
    },
    {
      label: "Deemed Export",
      desc: "Supplies to export oriented units",
    },
  ];

  const handleGstinChange = (event) => {
    setGstin(event.target.value);
  };

  const handleGstTreatmentChange = (event) => {
    setGstTreatment(event.target.value);
  };

  const handlePermanentChange = (event) => {
    setIsPermanent(event.target.checked);
  };

  const handleGetTaxpayerDetails = () => {
    console.log("Getting taxpayer details for GSTIN:", gstin);
  };

  const handleUpdate = () => {
    onUpdate && onUpdate({
      gst_treatment: gstTreatment,
      gst_no: gstin
    });
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          width: '320px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Box sx={{ width: '100%' }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          height: '46px',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <Typography variant="h6" sx={{
            fontWeight: 500,
            fontSize: '16px',
            color: '#333',
          }}>
            Configure Tax Preferences
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon sx={{ color: '#666' }} />
          </IconButton>
        </Box>

        {/* Content Section */}
        <Box sx={{ padding: '24px' }}>
          {/* GST Treatment Dropdown */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{
              fontSize: '14px', // Increased font size for the label
              color: '#333',
              fontWeight: 500,
              mb: 1,
            }}>
              GST Treatment
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={gstTreatment}
                onChange={handleGstTreatmentChange}
                sx={{
                  borderRadius: '4px',
                  fontSize: '20px', // Increased font size for the selected label
                  height: '36px', // Slightly taller input box for better visibility
                  backgroundColor: 'white',
                  overflow: 'hidden',
                  '& .MuiOutlinedInput-input': {
                    padding: '8px', // Reduced padding for smaller height
                    textOverflow: 'ellipsis', // Truncate text with ellipsis
                    whiteSpace: 'nowrap', // Prevent text wrapping
                    overflow: 'hidden', // Hide overflow text
                  },
                }}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Maximum height of the dropdown
                      overflowY: 'auto', // Enable vertical scrolling
                      width: '280px', // Limit the width of the dropdown
                    },
                  },
                }}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={index}
                    value={option.label}
                    sx={{
                      minHeight: '32px', // Reduced height for each MenuItem
                      padding: '4px 12px', // Adjusted padding for compactness
                      '& .MuiTypography-root': {
                        fontSize: '12px', // Reduced font size for compactness
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '12px' }}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                        {option.desc}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* GSTIN Input Field */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{
              fontSize: '14px',
              color: '#f44336',
              fontWeight: 500,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
            }}>
              GSTIN<Typography component="span" color="#f44336">*</Typography>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <TextField
                value={gstin}
                onChange={handleGstinChange}
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    fontSize: '12px', // Reduced font size
                    height: '32px', // Fixed height for compactness
                    '& fieldset': {
                      borderColor: '#ccc', // Customize border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#aaa', // Customize hover border color
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2', // Customize focus border color
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: '6px 8px', // Reduced padding for compactness
                    lineHeight: '1.2', // Adjust line height for better alignment
                    textOverflow: 'ellipsis', // Add ellipsis for overflow text
                    whiteSpace: 'nowrap', // Prevent text wrapping
                    overflow: 'hidden', // Hide overflow text
                  },
                }}
              />
            </Box>
            <Button
              onClick={handleGetTaxpayerDetails}
              sx={{
                mt: 1,
                p: 0,
                textTransform: 'none',
                color: '#1976d2',
                fontSize: '14px',
                fontWeight: 'normal',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Get Taxpayer details
            </Button>
          </Box>

          {/* Permanent Settings Checkbox */}
          <Box>
            <Typography sx={{
              fontSize: '14px',
              color: '#333',
              fontWeight: 500,
              mb: 1,
            }}>
              Make it permanent?
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPermanent}
                  onChange={handlePermanentChange}
                  sx={{
                    '&.Mui-checked': {
                      color: '#1976d2',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '18px', // Reduce checkbox size
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '12px', color: '#666' }}> {/* Reduced font size for label */}
                  Use these settings for all future transactions of this customer.
                </Typography>
              }
              sx={{ margin: 0 }}
            />
          </Box>
        </Box>

        {/* Footer Buttons */}
        <Box sx={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'flex-start',
          borderTop: '1px solid #e0e0e0',
          gap: '8px',
        }}>
          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              textTransform: 'none',
              fontSize: '14px',
              borderRadius: '4px',
              padding: '6px 16px',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: '#666',
              color: '#333',
              textTransform: 'none',
              fontSize: '14px',
              borderRadius: '4px',
              padding: '6px 16px',
              '&:hover': {
                borderColor: '#333',
                backgroundColor: 'transparent',
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

// Export the TaxPreferencesPopover component as the default export
export default TaxPreferencesPopover;
