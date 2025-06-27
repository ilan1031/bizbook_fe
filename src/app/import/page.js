// pages/invoices/import.js
'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Container, 
  Paper, 
  Select, 
  MenuItem, 
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Link,
  FormHelperText,
  Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function InvoiceImport() {
  const [encoding, setEncoding] = useState('UTF-8 (Unicode)');
  const [autoGenerateInvoice, setAutoGenerateInvoice] = useState(false);
  const [linkInvoices, setLinkInvoices] = useState(false);
  const [mapCustomers, setMapCustomers] = useState(false);

  const handleEncodingChange = (event) => {
    setEncoding(event.target.value);
  };

  return (
    <Container maxWidth="md" sx={{ 
      width: '100%', py: 1,
      position: 'relative',
      borderRadius: 1,
      maxHeight: '90vh', // Set max height for scrollable area
      // overflowY: 'auto',  // Enable vertical scrolling
    }}>
      <Paper 
        elevation={0} 
      
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" component="h1">
            Invoices - Select File
          </Typography>
          <IconButton aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ width: '100%', px: 2, py: 3 }}>
          <Stepper activeStep={0} sx={{ mb: 4 }}>
            <Step key="configure">
              <StepLabel>
                <Typography 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#1976d2'
                  }}
                >
                  Configure
                </Typography>
              </StepLabel>
            </Step>
            <Step key="map-fields">
              <StepLabel>
                <Typography sx={{ color: '#9e9e9e' }}>Map Fields</Typography>
              </StepLabel>
            </Step>
            <Step key="preview">
              <StepLabel>
                <Typography sx={{ color: '#9e9e9e' }}>Preview</Typography>
              </StepLabel>
            </Step>
          </Stepper>

          <Paper 
            variant="outlined" 
            sx={{ 
              p: 4, 
              mb: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              borderRadius: 1
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: '#9e9e9e', mb: 2 }} />
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              Drag and drop file to import
            </Typography>
            
            <Button 
              variant="contained" 
              component="label"
              sx={{ 
                mb: 2,
                textTransform: 'none'
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Choose Files
              <input
                type="file"
                hidden
              />
            </Button>
            
            <Typography variant="body2" color="text.secondary">
              Maximum File Size: 25 MB • File Format: CSV or TSV or XLS
            </Typography>
          </Paper>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2">
              Download a <Link href="#" underline="hover">sample csv file</Link> or <Link href="#" underline="hover">sample xls file</Link> and compare it to your import file to ensure you have the file perfect for the import.
            </Typography>
          </Box>

          {/* <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Character Encoding
            </Typography>
            <InfoOutlinedIcon fontSize="small" color="action" />
            <Box sx={{ flexGrow: 1 }} />
            <Select
              value={encoding}
              onChange={handleEncodingChange}
              displayEmpty
              sx={{ 
                minWidth: 250,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                }
              }}
            >
              <MenuItem value="UTF-8 (Unicode)">UTF-8 (Unicode)</MenuItem>
              <MenuItem value="ASCII">ASCII</MenuItem>
              <MenuItem value="ISO-8859-1">ISO-8859-1</MenuItem>
            </Select>
          </Box> */}

          {/* <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={autoGenerateInvoice}
                  onChange={(e) => setAutoGenerateInvoice(e.target.checked)}
                />
              }
              label={
                <Typography variant="body1" fontWeight="medium">
                  Auto-generate Invoice Numbers
                </Typography>
              }
            />
            <Box sx={{ pl: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Invoice numbers will be generated automatically according to your settings. Any invoice 
                numbers in the import file will be ignored.
              </Typography>
            </Box>
          </Box> */}

          {/* <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={linkInvoices}
                  onChange={(e) => setLinkInvoices(e.target.checked)}
                />
              }
              label={
                <Typography variant="body1" fontWeight="medium">
                  Link Invoices to its corresponding Sales Orders.
                </Typography>
              }
            />
            <Box sx={{ pl: 4 }}>
              <Typography variant="body2" color="text.secondary">
                If you enable this option, you must map the Sales Order field with the appropriate column
                containing the Sales Order Number in the next page.
              </Typography>
            </Box>
          </Box> */}

          {/* <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={mapCustomers}
                  onChange={(e) => setMapCustomers(e.target.checked)}
                />
              }
              label={
                <Typography variant="body1" fontWeight="medium">
                  Map the customers addresses in the import file to their
                  customer record in Zoho Books.
                </Typography>
              }
            />
            <Box sx={{ pl: 4 }}>
              <Typography variant="body2" color="text.secondary">
                If you enable this option, your customer`s name from the import file will be used to check if the same customer
                already exists in Zoho Books. If the customer exists in Zoho Books, the address from the invoice will be mapped
                to their customer record. If the customer does not exist, a new customer record will be created using the
                corresponding address from the import file.
              </Typography>
            </Box>
          </Box> */}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: '#f9f9f9',
              border: '1px solid #e0e0e0',
              borderRadius: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbOutlinedIcon sx={{ color: '#f9a825', mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Page Tips
              </Typography>
            </Box>
            
            <Box component="ul" sx={{ pl: 2, mb: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Import data with the details of GST Treatment by referring these <Link href="#" underline="hover">accepted formats</Link>.
              </Typography>
              
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                You can download the <Link href="#" underline="hover">sample xls file</Link> to get detailed information about the data fields used
                while importing.
              </Typography>
              
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                If you have files in other formats, you can convert it to an accepted file format using any
                online/offline converter.
              </Typography>
              
              <Typography component="li" variant="body2">
                You can configure your import settings and save them for future too!
              </Typography>
            </Box>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ textTransform: 'none' }}
            >
              Next
            </Button>
            
            <Button 
              variant="text" 
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}