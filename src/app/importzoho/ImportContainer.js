// components/ImportContainer.js
'use client';
import React, { useEffect } from 'react';
import { useImport } from '../../context/ImportContext';
import ImportConfigureStep from './ImportConfigureStep';
import ImportMapFieldsStep from './ImportMapFieldsStep';
import ImportPreviewStep from './ImportPreviewStep';
import { Paper, Box } from '@mui/material';

const ImportContainer = () => {
  const { activeStep, resetState } = useImport();
  
  // Clean up when component unmounts
  useEffect(() => {
    // Only need to return the cleanup function
    return () => {
      resetState();
    };
  }, [resetState]); // resetState is now memoized with useCallback

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <ImportConfigureStep />;
      case 1:
        return <ImportMapFieldsStep />;
      case 2:
        return <ImportPreviewStep />;
      default:
        return <ImportConfigureStep />;
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#f4f6f8'
      }}
    >
      <Paper 
        elevation={2} 
        sx={{ 
          width: '100%', 
          maxWidth: 'md', 
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {renderStep()}
      </Paper>
    </Box>
  );
};

export default ImportContainer;