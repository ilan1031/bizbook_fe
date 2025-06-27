// components/ImportPreviewStep.js
'use client';
import React, { useState, useEffect } from 'react';
import { useImport } from '../../context/ImportContext';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Container,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import apiService from '../../../src/services/axiosService';
import config from '../../services/config';

const ImportPreviewStep = () => {
  const {
    activeStep,
    setActiveStep,
    entityType,
    fileName,
    mappedFields,
    unmappedFields,
    importId,
    getImportEndpoint,
    resetState
  } = useImport();
  
  const [expandedReady, setExpandedReady] = useState(false);
  const [expandedUnmapped, setExpandedUnmapped] = useState(true);
  const [expandedSkipped, setExpandedSkipped] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [fetchingPreview, setFetchingPreview] = useState(true);

  // Fetch preview data on component mount
  useEffect(() => {
    const fetchPreviewData = async () => {
      if (!importId) {
        setFetchingPreview(false);
        setError("Import session not found. Please restart the import process.");
        return;
      }

      try {
        // Fetch preview data from API using the importId
        const response = await apiService({
          method: 'get',
          url: `/api/v1/import/preview`,
          customBaseUrl: config.PO_Base_url,
          data: { importId }
        });

        console.log("Preview data response:", response);

        if (response.data?.status === 'OK' || response.statusCode === 200) {
          const data = response.data?.data || response.data;
          
          setPreviewData({
            readyCount: data.validRecordCount || 0,
            skippedCount: data.invalidRecordCount + (data.duplicateCount || 0),
            unmappedCount: (data.unmappedFields || []).length,
            skippedRecords: data.invalidRecords || [],
            duplicateRecords: data.duplicates || [],
            unmappedFields: data.unmappedFields || unmappedFields || [],
            fileName: data.fileName || fileName
          });
        } else {
          setError(response.data?.message || 'Failed to fetch preview data.');
          
          // For development, set some dummy data
          if (process.env.NODE_ENV === 'development') {
            setPreviewData({
              readyCount: 3,
              skippedCount: 4,
              unmappedCount: (unmappedFields || []).length,
              skippedRecords: [],
              duplicateRecords: [],
              unmappedFields: unmappedFields || [],
              fileName: fileName
            });
          }
        }
      } catch (err) {
        console.error("Error fetching preview data:", err);
        setError(err.message || 'Failed to fetch preview data.');
        
        // For development, set some dummy data
        if (process.env.NODE_ENV === 'development') {
          setPreviewData({
            readyCount: 3,
            skippedCount: 4,
            unmappedCount: (unmappedFields || []).length,
            skippedRecords: [],
            duplicateRecords: [],
            unmappedFields: unmappedFields || [],
            fileName: fileName
          });
        }
      } finally {
        setFetchingPreview(false);
      }
    };

    fetchPreviewData();
  }, [importId, unmappedFields, fileName]);
  
  const handlePrevious = () => {
    setActiveStep(1);
  };
  
  const handleCancel = () => {
    resetState();
    window.history.back();
  };
  
  const handleImport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Process the import using the import ID
      const response = await apiService({
        method: 'post',
        url: `${config.PO_Base_url}api/v1/import/process`, 
        customBaseUrl: config.PO_Base_url,
        // Using the specific URL you provided
        data: { importId }
      });
      
      console.log("Import process response:", response);
      
      if (response.data?.status === 'OK' || response.statusCode === 200) {
        const importedCount = response.data?.data?.importedCount || 0;
        setSuccess(`Successfully imported ${importedCount} records.`);
        
        // Optional: Make a direct import to the specific entity endpoint
        try {
          const entityEndpoint = getImportEndpoint();
          
          // Import to entity endpoint
          await apiService({
            method: 'post',
            url: entityEndpoint,
            data: { data: response.data?.data?.validRecords || [] }
          });
          
        } catch (entityErr) {
          console.error('Error importing to entity endpoint:', entityErr);
          // Continue even if this fails, as the main import was successful
        }
      } else {
        setError(response.data?.message || 'Failed to import data. Please try again.');
      }
    } catch (err) {
      console.error("Error in import process:", err);
      setError(err.response?.data?.message || err.message || 'An error occurred during import. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadSkipped = () => {
    if (!previewData || !previewData.skippedRecords || previewData.skippedRecords.length === 0) return;
    
    // Determine headers based on the structure of skipped records
    const sampleRecord = previewData.skippedRecords[0];
    const headers = Object.keys(sampleRecord).filter(key => key !== '_id' && key !== '__v');
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    previewData.skippedRecords.forEach(record => {
      const row = headers.map(header => {
        const value = record[header] || '';
        // Wrap values with commas in quotes
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',');
      csvContent += row + '\n';
    });
    
    // Download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `skipped_rows_${entityType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (fetchingPreview) {
    return (
      <Container maxWidth="md" sx={{ 
        py: 5, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress sx={{ mb: 3 }} />
        <Typography variant="h6">Loading preview data...</Typography>
      </Container>
    );
  }
  
  if (!previewData) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Failed to load preview data. Please try again."}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={handlePrevious}
            sx={{ mr: 2 }}
          >
            Go Back
          </Button>
          <Button 
            variant="outlined"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 2, maxHeight: '90vh', overflowY: 'auto' }}>
      {/* Header with Close Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        borderBottom: '1px solid #e0e0e0',
        pb: 2
      }}>
        <Typography variant="h6">Preview</Typography>
        <IconButton aria-label="close" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Progress Steps */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step key="configure" completed>
          <StepLabel StepIconComponent={() => (
            <CheckCircleIcon sx={{ color: '#4CAF50' }} />
          )}>
            <Typography sx={{ color: 'text.secondary' }}>Configure</Typography>
          </StepLabel>
        </Step>
        <Step key="map-fields" completed>
          <StepLabel StepIconComponent={() => (
            <CheckCircleIcon sx={{ color: '#4CAF50' }} />
          )}>
            <Typography sx={{ color: 'text.secondary' }}>Map Fields</Typography>
          </StepLabel>
        </Step>
        <Step key="preview">
          <StepLabel>
            <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>Preview</Typography>
          </StepLabel>
        </Step>
      </Stepper>

      {/* Info Alert */}
      <Alert 
        icon={<InfoIcon fontSize="inherit" />} 
        severity="info" 
        sx={{ 
          backgroundColor: '#e3f2fd', 
          mb: 3,
          '& .MuiAlert-icon': {
            color: '#2196f3'
          }
        }}
      >
        {previewData.readyCount} of {previewData.readyCount + previewData.skippedCount} records in your file are ready to be imported.
      </Alert>

      {/* Ready Records Section */}
      <Box sx={{ mb: 3 }}>
        <Box 
          onClick={() => setExpandedReady(!expandedReady)}
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            mb: 1
          }}
        >
          <Typography color="text.secondary">
            Records that are ready to be imported - {previewData.readyCount}
          </Typography>
          {expandedReady ? (
            <KeyboardArrowDownIcon sx={{ color: '#2196f3' }} />
          ) : (
            <KeyboardArrowRightIcon sx={{ color: '#2196f3' }} />
          )}
        </Box>
        
        <Collapse in={expandedReady}>
          <Paper variant="outlined" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
              These records will be imported when you click the Import button.
            </Typography>
          </Paper>
        </Collapse>
      </Box>

      {/* Skipped Records */}
      {previewData.skippedCount > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box 
            onClick={() => setExpandedSkipped(!expandedSkipped)}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              mb: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />
              <Typography>Records skipped - {previewData.skippedCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {previewData.skippedRecords?.length > 0 && (
                <Button
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSkipped();
                  }}
                  size="small"
                  sx={{ mr: 1, textTransform: 'none' }}
                >
                  Download
                </Button>
              )}
              {expandedSkipped ? (
                <KeyboardArrowDownIcon sx={{ color: '#ff9800' }} />
              ) : (
                <KeyboardArrowRightIcon sx={{ color: '#ff9800' }} />
              )}
            </Box>
          </Box>

          <Collapse in={expandedSkipped}>
            {previewData.skippedRecords?.length > 0 ? (
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      {Object.keys(previewData.skippedRecords[0])
                        .filter(key => key !== '_id' && key !== '__v') // Filter out MongoDB fields
                        .map((header, idx) => (
                          <TableCell key={idx}>{header}</TableCell>
                        ))
                      }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewData.skippedRecords.map((record, index) => (
                      <TableRow key={index}>
                        {Object.entries(record)
                          .filter(([key]) => key !== '_id' && key !== '__v') // Filter out MongoDB fields
                          .map(([key, value], idx) => (
                            <TableCell key={idx}>{value}</TableCell>
                          ))
                        }
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper variant="outlined" sx={{ mb: 3, p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No detailed information available for skipped records.
                </Typography>
              </Paper>
            )}
          </Collapse>
        </Box>
      )}

      {/* Unmapped Fields */}
      {previewData.unmappedFields?.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box 
            onClick={() => setExpandedUnmapped(!expandedUnmapped)}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              mb: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />
              <Typography>Unmapped Fields - {previewData.unmappedCount}</Typography>
            </Box>
            {expandedUnmapped ? (
              <KeyboardArrowDownIcon sx={{ color: '#ff9800' }} />
            ) : (
              <KeyboardArrowRightIcon sx={{ color: '#ff9800' }} />
            )}
          </Box>

          <Collapse in={expandedUnmapped}>
            <Box sx={{ pl: 4, mb: 3 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                The following fields in your import file have not been mapped to any system field. The data in these fields will be ignored during the import.
              </Typography>
              <List>
                {previewData.unmappedFields.map((field, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>• {field}</ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </Box>
      )}

      {/* Bottom Info Alert */}
      <Alert 
        icon={<InfoIcon fontSize="inherit" />} 
        severity="info" 
        sx={{ 
          backgroundColor: '#e3f2fd', 
          mb: 4,
          '& .MuiAlert-icon': {
            color: '#2196f3'
          }
        }}
      >
        Click the Previous button if you want to match the above column header(s) or click the Import button to continue with the import.
      </Alert>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Footer Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 4 }}>
        <Button 
          variant="outlined" 
          startIcon={<NavigateBeforeIcon />}
          sx={{ 
            color: '#757575',
            borderColor: '#e0e0e0',
            textTransform: 'none'
          }}
          onClick={handlePrevious}
          disabled={loading}
        >
          Previous
        </Button>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mr: 2, textTransform: 'none' }}
            onClick={handleImport}
            disabled={loading || success}
          >
            {loading ? 'Processing...' : 'Import'}
          </Button>
          <Button 
            variant="outlined"
            sx={{ textTransform: 'none' }}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ImportPreviewStep;