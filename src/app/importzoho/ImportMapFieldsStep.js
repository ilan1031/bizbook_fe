// components/ImportMapFieldsStep.js
'use client';
import React, { useState, useEffect } from 'react';
import { useImport } from '../../context/ImportContext';
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
  Divider,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Define field sections based on entity type
const getFieldSections = (entityType) => {
  // Common sections
  const common = [
    {
      title: "Basic Information",
      required: true,
      fields: []
    },
    {
      title: "Contact Details",
      required: true,
      fields: [
        { label: "Customer/Vendor Name*", id: "name", inputType: "select", required: true },
        { label: "Email", id: "email", inputType: "select" },
        { label: "Phone", id: "phone", inputType: "select" },
      ]
    },
    {
      title: "Date Information",
      required: true,
      fields: []
    },
    {
      title: "Amount Details",
      required: true,
      fields: [
        { label: "Amount", id: "amount", inputType: "select", required: true },
        { label: "Currency", id: "currency", inputType: "select" },
        { label: "Exchange Rate", id: "exchange_rate", inputType: "select" },
      ]
    }
  ];
  
  // Add entity-specific fields
  switch (entityType) {
    case 'expense':
      common[0].fields = [
        { label: "Expense Number*", id: "expense_number", inputType: "select", required: true },
        { label: "Expense Category*", id: "category", inputType: "select", required: true },
        { label: "Description", id: "description", inputType: "select" },
        { label: "Reference Number", id: "reference_number", inputType: "select" },
      ];
      common[2].fields = [
        { label: "Expense Date*", id: "expense_date", inputType: "select", required: true, hasDateFormat: true },
        { label: "Payment Date", id: "payment_date", inputType: "select", hasDateFormat: true },
      ];
      break;
      
    case 'purchaseorder':
      common[0].fields = [
        { label: "PO Number*", id: "po_number", inputType: "select", required: true },
        { label: "Subject", id: "subject", inputType: "select" },
        { label: "Reference Number", id: "reference", inputType: "select" },
        { label: "Status", id: "status", inputType: "select" },
      ];
      common[2].fields = [
        { label: "PO Date*", id: "po_date", inputType: "select", required: true, hasDateFormat: true },
        { label: "Expected Delivery Date", id: "delivery_date", inputType: "select", hasDateFormat: true },
      ];
      break;
      
    case 'bill':
      common[0].fields = [
        { label: "Bill Number*", id: "bill_number", inputType: "select", required: true },
        { label: "Reference Number", id: "reference", inputType: "select" },
        { label: "Notes", id: "notes", inputType: "select" },
      ];
      common[2].fields = [
        { label: "Bill Date*", id: "bill_date", inputType: "select", required: true, hasDateFormat: true },
        { label: "Due Date", id: "due_date", inputType: "select", hasDateFormat: true },
      ];
      break;
      
    default:
      // Default to expense fields
      common[0].fields = [
        { label: "Expense Number*", id: "expense_number", inputType: "select", required: true },
        { label: "Description", id: "description", inputType: "select" },
      ];
      common[2].fields = [
        { label: "Date*", id: "date", inputType: "select", required: true, hasDateFormat: true },
      ];
  }
  
  // Add Item Details section
  common.push({
    title: "Item Details",
    required: true,
    fields: [
      { label: "Item Name", id: "item_name", inputType: "select" },
      { label: "Quantity", id: "quantity", inputType: "select" },
      { label: "Price", id: "price", inputType: "select" },
      { label: "Description", id: "item_description", inputType: "select" },
    ]
  });
  
  // Add Tax Details section
  common.push({
    title: "Tax Details",
    required: false,
    fields: [
      { label: "Tax Name", id: "tax_name", inputType: "select" },
      { label: "Tax Rate", id: "tax_rate", inputType: "select" },
      { label: "Tax Amount", id: "tax_amount", inputType: "select" },
      { label: "Is Inclusive Tax", id: "is_inclusive_tax", inputType: "select" },
    ]
  });
  
  return common;
};

const ImportMapFieldsStep = () => {
  const {
    activeStep,
    setActiveStep,
    entityType,
    fileName,
    availableFields,
    mappedFields,
    setMappedFields,
    unmappedFields,
    setUnmappedFields,
    dateFormat,
    setDateFormat,
    saveMapping,
    setSaveMapping,
  } = useImport();
  
  const [fieldSections, setFieldSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileHeaders, setFileHeaders] = useState([]);
  
  // Set up field sections based on entity type
  useEffect(() => {
    setFieldSections(getFieldSections(entityType));
    
    // Set up file headers based on mapped and unmapped fields
    const headers = [...Object.keys(mappedFields || {}), ...unmappedFields || []];
    setFileHeaders(headers);
  }, [entityType, mappedFields, unmappedFields]);
  
  const handleFieldMapping = (fieldId, value) => {
    setMappedFields(prev => ({
      ...prev,
      [value]: fieldId
    }));
  };
  
  const handleDateFormatChange = (event) => {
    setDateFormat(event.target.value);
  };
  
  const handlePrevious = () => {
    setActiveStep(0);
  };
  
  const handleNext = () => {
    // Validate required fields are mapped
    const requiredFields = [];
    fieldSections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          requiredFields.push(field.id);
        }
      });
    });
    
    const missingFields = requiredFields.filter(field => {
      return !Object.values(mappedFields || {}).includes(field);
    });
    
    if (missingFields.length > 0) {
      setError(`Please map the following required fields: ${missingFields.map(f => {
        const field = fieldSections.flatMap(s => s.fields).find(field => field.id === f);
        return field ? field.label.replace('*', '') : f;
      }).join(', ')}`);
      return;
    }
    
    // Proceed to next step
    setError(null);
    setActiveStep(2);
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 2, maxHeight: '90vh', overflowY: 'auto' }}>
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

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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
        Your Selected File - {fileName}
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
        </Box>
        
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4} md={2}>
              <Typography variant="body2" fontWeight="medium">
                Date
              </Typography>
            </Grid>
            <Grid item xs={8} md={4}>
              <Select
                fullWidth
                size="small"
                value={dateFormat}
                onChange={handleDateFormatChange}
                sx={{ 
                  backgroundColor: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  }
                }}
              >
                <MenuItem value="YYYY-MM-dd">YYYY-MM-dd</MenuItem>
                <MenuItem value="MM/dd/YYYY">MM/dd/YYYY</MenuItem>
                <MenuItem value="dd-MM-YYYY">dd-MM-YYYY</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={4} md={2}>
              <Typography variant="body2" fontWeight="medium">
                Decimal Format
              </Typography>
            </Grid>
            <Grid item xs={8} md={4}>
              <Typography variant="body2" color="text.secondary">
                123456789.00
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Field Mapping Sections */}
      {fieldSections.map((section, sectionIndex) => (
        <Paper key={sectionIndex} sx={{ mb: 4, overflow: 'hidden' }}>
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5'
          }}>
            <Typography variant="subtitle1" fontWeight="medium">
              {section.title}
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
                  SYSTEM FIELD
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium" color="text.secondary">
                  IMPORTED FILE HEADERS
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {section.fields.map((field, fieldIndex) => (
            <Box 
              key={fieldIndex}
              sx={{
                p: 2,
                borderBottom: fieldIndex < section.fields.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6} md={3}>
                  <Typography 
                    variant="body2" 
                    color={field.required ? "error" : "text.primary"}
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
                        value={Object.entries(mappedFields || {}).find(([k, v]) => v === field.id)?.[0] || ""}
                        onChange={(e) => handleFieldMapping(field.id, e.target.value)}
                        sx={{ 
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                          }
                        }}
                      >
                        <MenuItem value="">Select</MenuItem>
                        {fileHeaders.map((header, idx) => (
                          <MenuItem key={idx} value={header}>{header}</MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    
                    {field.hasDateFormat && (
                      <Grid item xs={6}>
                        <Select
                          fullWidth
                          size="small"
                          value={dateFormat}
                          onChange={handleDateFormatChange}
                          sx={{ 
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e0e0e0',
                            }
                          }}
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
      ))}

      {/* Customer Address Details Section */}
      <Paper sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Address Details
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            The address details will be obtained from their record in the system if it exists.
          </Typography>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={saveMapping}
              onChange={(e) => setSaveMapping(e.target.checked)}
              size="small" 
            />
          }
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
          onClick={handlePrevious}
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
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Next'}
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
};

export default ImportMapFieldsStep;