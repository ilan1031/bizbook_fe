// pages/map-fields.js
'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Container,
  Paper,
  Grid,
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Alert,
  AlertTitle,
  Divider,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export default function MapFields() {
  // State for the date format selectors
  const [dateFormat, setDateFormat] = useState('YYYY-MM-dd');

  // Invoice and contact field mappings
  const invoiceFields = [
    { id: "invoice_number", label: "Invoice Number*", required: true, redLabel: true },
    { id: "invoice_date", label: "Invoice Date*", required: true, redLabel: true, hasDateFormat: true },
    { id: "quote_number", label: "Quote Number" },
    { id: "invoice_status", label: "Invoice Status" },
    { id: "due_date", label: "Due Date", hasDateFormat: true },
    { id: "expected_payment_date", label: "Expected Payment Date", hasDateFormat: true },
    { id: "subject", label: "Subject" },
    { id: "notes", label: "Notes" },
    { id: "terms_conditions", label: "Terms & Conditions" },
    { id: "currency_code", label: "Currency Code" },
    { id: "exchange_rate", label: "Exchange Rate" },
    { id: "purchase_order", label: "PurchaseOrder" },
    { id: "template_name", label: "Template Name" },
    { id: "paypal", label: "PayPal" },
    { id: "authorize_net", label: "Authorize.Net" },
    { id: "google_checkout", label: "Google Checkout" },
    { id: "payflow_pro", label: "Payflow Pro" },
    { id: "stripe", label: "Stripe" },
    { id: "paytm", label: "Paytm" },
    { id: "2checkout", label: "2Checkout" },
    { id: "braintree", label: "Braintree" },
    { id: "forte", label: "Forte" },
    { id: "worldpay", label: "WorldPay" },
    { id: "payments_pro", label: "Payments Pro" },
    { id: "square", label: "Square" },
    { id: "wepay", label: "WePay" },
    { id: "razorpay", label: "Razorpay" },
    { id: "icici_eazypay", label: "ICICI EazyPay" },
    { id: "gocardless", label: "GoCardless" },
    { id: "partial_payments", label: "Partial Payments" },
    { id: "sales_person", label: "Sales person" },
    { id: "adjustment", label: "Adjustment" },
    { id: "adjustment_description", label: "Adjustment Description" },
    { id: "discount_type", label: "Discount Type" },
    { id: "is_discount_before_tax", label: "Is Discount Before Tax" },
    { id: "entity_discount_percent", label: "Entity Discount Percent" },
    { id: "entity_discount_amount", label: "Entity Discount Amount" },
    { id: "total", label: "Total" },
    { id: "payment_terms", label: "Payment Terms" },
    { id: "payment_terms_label", label: "Payment Terms Label" },
    { id: "attachment_ids", label: "Attachment IDs" },
    { id: "sales_order_number", label: "Sales Order Number" },
  ];

  const contactFields = [
    { id: "customer_name", label: "Customer Name*", required: true, redLabel: true },
    { id: "salutation", label: "Salutation" },
    { id: "first_name", label: "First Name" },
    { id: "last_name", label: "Last Name" },
    { id: "email", label: "Email" },
  ];

  const itemFields = [
    { id: "project_name", label: "Project Name" },
    { id: "item_tax", label: "Item Tax" },
    { id: "item_tax_type", label: "Item Tax Type" },
    { id: "item_tax_perc", label: "Item Tax %" },
  ];

  // Sample formats
  const dataFormats = [
    { label: "Date", format: "Select format at field level" },
    { label: "Decimal Format", format: "123456789" },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 2,maxHeight: '90vh', // Set max height for scrollable area
      }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        borderBottom: '1px solid #e0e0e0',
        pb: 2
      }}>
        <Typography variant="h6">Map Fields</Typography>
        <IconButton aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      <Stepper activeStep={1} sx={{ mb: 4 }}>
        <Step key="configure" completed>
          <StepLabel StepIconComponent={() => (
            <CheckCircleIcon sx={{ color: '#4CAF50' }} />
          )}>
            <Typography sx={{ color: 'text.secondary' }}>Configure</Typography>
          </StepLabel>
        </Step>
        <Step key="map-fields">
          <StepLabel>
            <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>Map Fields</Typography>
          </StepLabel>
        </Step>
        <Step key="preview">
          <StepLabel>
            <Typography sx={{ color: 'text.secondary' }}>Preview</Typography>
          </StepLabel>
        </Step>
      </Stepper>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Your Selected File - sample_quotes.xls
      </Typography>

      <Alert severity="info" icon={false} sx={{ 
        mb: 3, 
        backgroundColor: '#e3f2fd', 
        color: '#0d47a1', 
        borderRadius: '4px',
        '& .MuiAlert-message': { p: 0 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5, px: 1 }}>
          <InfoOutlinedIcon sx={{ mr: 1, color: '#2196f3' }} />
          <Typography variant="body2">
            The best match to each field on the selected file have been auto-selected.
          </Typography>
        </Box>
      </Alert>

      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Default Data Formats
          </Typography>
          <Button 
            startIcon={<EditIcon />} 
            size="small" 
            sx={{ color: '#2196f3', textTransform: 'none' }}
          >
            Edit
          </Button>
        </Box>
        
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {dataFormats.map((format, index) => (
              <React.Fragment key={index}>
                <Grid item xs={4} md={2}>
                  <Typography variant="body2" fontWeight="medium">
                    {format.label}
                  </Typography>
                </Grid>
                <Grid item xs={8} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    {format.format}
                  </Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Invoice Details Section */}
      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Invoice Details
          </Typography>
        </Box>

        <Box sx={{ 
          p: 2, 
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="medium" color="text.secondary">
                ZOHO BOOKS FIELD
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="medium" color="text.secondary">
                IMPORTED FILE HEADERS
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {invoiceFields.map((field, index) => (
          <Box 
            key={index}
            sx={{
              p: 2,
              borderBottom: index < invoiceFields.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} md={3}>
                <Typography 
                  variant="body2" 
                  color={field.redLabel ? "error" : "text.primary"}
                >
                  {field.label}
                </Typography>
              </Grid>
              <Grid item xs={6} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={field.hasDateFormat ? 6 : 12}>
                    <Select
                      fullWidth
                      displayEmpty
                      size="small"
                      value=""
                      renderValue={() => field.id === "sales_person" ? "Sales person" : "Select"}
                      sx={{ 
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0',
                        }
                      }}
                      endAdornment={
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <MenuItem value="">Select</MenuItem>
                    </Select>
                  </Grid>
                  
                  {field.hasDateFormat && (
                    <Grid item xs={6}>
                      <Select
                        fullWidth
                        size="small"
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        sx={{ 
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                          }
                        }}
                        endAdornment={
                          <IconButton size="small" sx={{ mr: 1 }}>
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        <MenuItem value="YYYY-MM-dd">YYYY-MM-dd</MenuItem>
                        <MenuItem value="MM/dd/YYYY">MM/dd/YYYY</MenuItem>
                        <MenuItem value="dd-MM-YYYY">dd-MM-YYYY</MenuItem>
                      </Select>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Paper>

      {/* Contact Details Section */}
      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Contact Details
          </Typography>
        </Box>

        <Box sx={{ 
          p: 2, 
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="medium" color="text.secondary">
                ZOHO BOOKS FIELD
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="medium" color="text.secondary">
                IMPORTED FILE HEADERS
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {contactFields.map((field, index) => (
          <Box 
            key={index}
            sx={{
              p: 2,
              borderBottom: index < contactFields.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} md={3}>
                <Typography 
                  variant="body2" 
                  color={field.redLabel ? "error" : "text.primary"}
                >
                  {field.label}
                </Typography>
              </Grid>
              <Grid item xs={6} md={9}>
                <Select
                  fullWidth
                  displayEmpty
                  size="small"
                  value=""
                  renderValue={() => field.id === "customer_name" ? "Customer Name" : "Select"}
                  sx={{ 
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                    }
                  }}
                  endAdornment={
                    <IconButton size="small" sx={{ mr: 1 }}>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <MenuItem value="">Select</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Paper>

      {/* Item Fields Section */}
      {itemFields.map((field, index) => (
        <Box 
          key={index}
          sx={{
            p: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                {field.label}
              </Typography>
            </Grid>
            <Grid item xs={6} md={9}>
              <Select
                fullWidth
                displayEmpty
                size="small"
                value=""
                renderValue={() => field.id === "project_name" ? "Project Name" : field.id === "item_tax" ? "Item Tax" : field.id === "item_tax_type" ? "Item Tax Type" : "Item Tax %"}
                sx={{ 
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  }
                }}
                endAdornment={
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                }
              >
                <MenuItem value="">Select</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>
      ))}

      {/* Customer Address Details Section */}
      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Customer Address Details
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={<Checkbox size="small" />}
          label={
            <Typography variant="body2">
              Save these selections for use during future imports.
            </Typography>
          }
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 4 }}>
        <Button 
          variant="outlined"
          startIcon={<NavigateBeforeIcon />}
          sx={{ 
            color: '#757575',
            borderColor: '#e0e0e0',
            textTransform: 'none'
          }}
        >
          Previous
        </Button>
        
        <Box>
          <Button 
            variant="contained" 
            color="primary"
            sx={{ 
              backgroundColor: '#2196f3',
              textTransform: 'none',
              mr: 2
            }}
          >
            Next
          </Button>
          
          <Button 
            variant="text"
            sx={{ 
              color: '#757575',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
}