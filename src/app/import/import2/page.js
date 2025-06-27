// pages/form-mapping.js
'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Divider,
  Button,
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Breadcrumbs,
  Link as MuiLink,
  InputAdornment
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function FormMapping() {
  const fieldSections = [
    {
      title: "Fields",
      required: false,
      fields: [
        { label: "WordPay", inputType: "select" },
        { label: "Payments Pro", inputType: "select" },
        { label: "Square", inputType: "select" },
        { label: "RazPay", inputType: "select" },
        { label: "Razorpay", inputType: "select" },
        { label: "ICICI AxisPay", inputType: "select" },
        { label: "QwiikSilver", inputType: "select" },
        { label: "Partial Payments", inputType: "select" },
        { label: "Sales person", inputType: "select", value: "sales.edit.form" },
        { label: "Adjustment", inputType: "text" },
        { label: "Adjustment Description", inputType: "text" },
        { label: "Discount Type", inputType: "text" },
        { label: "Is Discount Before Tax", inputType: "text" },
        { label: "Entity Discount Percent", inputType: "text" },
        { label: "Entity Discount Amount", inputType: "text" },
        { label: "Total", inputType: "text" },
        { label: "Payment Terms", inputType: "select" },
        { label: "Payment Terms Label", inputType: "select" },
        { label: "Attachment IDs", inputType: "select" },
        { label: "Sales Order Number", inputType: "select" }
      ]
    },
    {
      title: "Contact Details",
      required: true,
      fields: [
        { label: "Customer Name*", inputType: "text", required: true },
        { label: "Salutation", inputType: "select" },
        { label: "First Name", inputType: "select" },
        { label: "Last Name", inputType: "select" },
        { label: "Email", inputType: "select" }
      ]
    },
    {
      title: "Tax Details",
      required: true,
      fields: [
        { label: "Is Inclusive Tax", inputType: "text" },
        { label: "Item Type", inputType: "select" }
      ]
    },
    {
      title: "TDS Details",
      required: true,
      fields: [
        { label: "TDS Name", inputType: "select" },
        { label: "TDS Percentage", inputType: "select" },
        { label: "TDS Section Code", inputType: "select" },
        { label: "TDS Amount", inputType: "select" },
        { label: "Non TDS Reason", inputType: "select" },
        { label: "Non TDS Percentage", inputType: "select" },
        { label: "Non TDS Section Code", inputType: "select" }
      ]
    },
    {
      title: "TCS Details",
      required: true,
      fields: [
        { label: "TCS Tax Name", inputType: "select" },
        { label: "TCS Percentage", inputType: "select" },
        { label: "Nature Of Collection", inputType: "select" },
        { label: "TCS Amount", inputType: "select" }
      ]
    },
    {
      title: "Shipping Charge Details",
      required: true,
      fields: [
        { label: "Shipping Charge", inputType: "text" },
        { label: "Shipping Charge Tax Name", inputType: "text" },
        { label: "Shipping Charge Tax Type", inputType: "text" },
        { label: "Shipping Charge Tax %", inputType: "text" },
        { label: "Shipping Charge Tax Amount", inputType: "text" },
        { label: "Shipping Charge Tax Exemption Code", inputType: "text" }
      ]
    },
    {
      title: "Item Details",
      required: true,
      fields: [
        { label: "Item Price", inputType: "text" },
        { label: "Account", inputType: "text" },
        { label: "Usage unit", inputType: "text" },
        { label: "Item Open", inputType: "text" },
        { label: "Item Name", inputType: "text" },
        { label: "Quantity", inputType: "text" },
        { label: "Discount", inputType: "text" },
        { label: "Discount Amount", inputType: "text" },
        { label: "External Reference ID", inputType: "select" },
        { label: "Project Name", inputType: "text" },
        { label: "Item Tax", inputType: "text" },
        { label: "Item Tax Type", inputType: "text" },
        { label: "Item Tax %", inputType: "text" }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 2,maxHeight: '90vh', // Set max height for scrollable area
      }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <MuiLink href="#" underline="hover" color="inherit">Home</MuiLink>
          <Typography color="text.primary">Map Fields</Typography>
        </Breadcrumbs>
      </Box>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          * Fields marked with a star are required fields that must be mapped.
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2">Default Format</Typography>
          <Typography variant="body2" color="text.secondary">JSON format of API Data</Typography>
        </Box>
      </Paper>
      
      {fieldSections.map((section, sectionIndex) => (
        <Paper key={sectionIndex} sx={{ mb: 3 }}>
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#f5f7fa', 
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="subtitle1" fontWeight="medium">
              {section.title}
            </Typography>
            {section.required && (
              <Typography variant="caption" color="text.secondary">
                MAPPING FIELDS REQUIRED
              </Typography>
            )}
          </Box>
          
          {section.fields.map((field, fieldIndex) => (
            <Box 
              key={fieldIndex}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderBottom: fieldIndex < section.fields.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4} md={3}>
                  <Typography 
                    variant="body2" 
                    color={field.required ? "error" : "text.primary"}
                  >
                    {field.label}
                  </Typography>
                </Grid>
                <Grid item xs={7} md={8}>
                  {field.inputType === 'select' ? (
                    <FormControl fullWidth size="small">
                      <Select
                        displayEmpty
                        defaultValue=""
                        value={field.value || ""}
                        sx={{ 
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                          }
                        }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {field.value && <MenuItem value={field.value}>{field.value}</MenuItem>}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      defaultValue={field.value || field.label}
                      sx={{ 
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0',
                        }
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={1} md={1} sx={{ textAlign: 'right' }}>
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Paper>
      ))}
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ 
          borderBottom: '1px solid #e0e0e0',
          p: 2,
          backgroundColor: '#f5f7fa',
        }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Customer Address Details
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            The customer`s billing and shipping address details will be obtained from their customer profile in Zoho Books.
          </Typography>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 5 }}>
        <Button 
          variant="contained" 
          color="primary"
          sx={{ 
            backgroundColor: '#2563eb',
            textTransform: 'none',
            mr: 2
          }}
        >
          Next
        </Button>
        <Button 
          variant="outlined"
          sx={{ 
            color: '#6b7280',
            borderColor: '#d1d5db',
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
}