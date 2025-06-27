'use client';
import React, { useState } from 'react';
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
  Collapse
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DownloadIcon from '@mui/icons-material/Download';

const ImportPreviewScreen = () => {
  const [expandedQuotes, setExpandedQuotes] = useState(false);
  const [expandedUnmapped, setExpandedUnmapped] = useState(false);

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 2, position: 'relative',maxHeight: '90vh', // Set max height for scrollable area
     }}>
      {/* Header with Close Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Preview
        </Typography>
        <IconButton aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Progress Steps */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mx: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
          <Typography sx={{ color: '#4caf50', fontWeight: 'medium' }}>Configure</Typography>
        </Box>
        <Divider sx={{ flexGrow: 1, mx: 2, borderColor: '#4caf50' }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
          <Typography sx={{ color: '#4caf50', fontWeight: 'medium' }}>Map Fields</Typography>
        </Box>
        <Divider sx={{ flexGrow: 1, mx: 2, borderColor: '#4caf50' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#3f51b5', borderRadius: '50%', width: 24, height: 24, justifyContent: 'center', mr: 1 }}>
          <Typography sx={{ color: 'white' }}>3</Typography>
        </Box>
        <Typography sx={{ color: '#3f51b5', fontWeight: 'medium' }}>Preview</Typography>
      </Box>

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
        3 of 7 Quotes in your file are ready to be imported.
      </Alert>

      {/* Ready Quotes Section */}
      <Box sx={{ mb: 3 }}>
        <Box 
          onClick={() => setExpandedQuotes(!expandedQuotes)}
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            mb: 1
          }}
        >
          <Typography color="text.secondary">
            Quotes that are ready to be imported - 3
          </Typography>
          <KeyboardArrowRightIcon sx={{ color: '#2196f3' }} />
        </Box>
      </Box>

      {/* Skipped Records */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />
            <Typography>No. of Records skipped - 4</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#2196f3' }}>
            <Typography color="primary">Download skipped rows</Typography>
            <DownloadIcon sx={{ ml: 1, color: '#2196f3' }} />
            <KeyboardArrowDownIcon sx={{ color: '#2196f3' }} />
          </Box>
        </Box>

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell width={50}>Row</TableCell>
                <TableCell width={150}>Quote No.</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>QT-000003</TableCell>
                <TableCell>You are not allowed to create tax invoice in GST Regime, as youre not registered for GST.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5</TableCell>
                <TableCell>QT-000004</TableCell>
                <TableCell>You are not allowed to create tax invoice in GST Regime, as youre not registered for GST.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>7</TableCell>
                <TableCell>QT-000006</TableCell>
                <TableCell>Invalid tax group.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>8</TableCell>
                <TableCell>QT-000007</TableCell>
                <TableCell>Tax Exemption cannot be created or edited under the current tax settings.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Unmapped Fields */}
      <Box sx={{ mb: 4 }}>
        <Box 
          onClick={() => setExpandedUnmapped(!expandedUnmapped)}
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />
            <Typography>Unmapped Fields - 12</Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ color: '#ff9800' }} />
        </Box>

        <Collapse in={true}>
          <Box sx={{ pl: 4, mb: 3 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              The following fields in your import file have not been mapped to any Zoho Books field. The data in these fields will be ignored during the import.
            </Typography>
            <List>
              <ListItem sx={{ py: 0.5 }}>• Branch Name</ListItem>
              <ListItem sx={{ py: 0.5 }}>• GST Identification Number (GSTIN)</ListItem>
              <ListItem sx={{ py: 0.5 }}>• GST Treatment</ListItem>
              <ListItem sx={{ py: 0.5 }}>• HSN/SAC</ListItem>
              <ListItem sx={{ py: 0.5 }}>• Item Tax Exemption Reason</ListItem>
              <ListItem sx={{ py: 0.5 }}>• Place of Supply</ListItem>
              <ListItem sx={{ py: 0.5 }}>• Reverse Charge Tax Name</ListItem>
              <ListItem sx={{ py: 0.5 }}>• Reverse Charge Tax Rate</ListItem>
              <ListItem sx={{ py: 0.5 }}>• Reverse Charge Tax Type</ListItem>
              <ListItem sx={{ py: 0.5 }}>• Shipping Charge SAC Code</ListItem>
              <ListItem sx={{ py: 0.5 }}>• SKU</ListItem>
              <ListItem sx={{ py: 0.5 }}>• Supply Type</ListItem>
            </List>
          </Box>
        </Collapse>
      </Box>

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

      {/* Footer Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          variant="outlined" 
          startIcon={<KeyboardArrowRightIcon sx={{ transform: 'rotate(180deg)' }} />}
        >
          Previous
        </Button>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mr: 2 }}
          >
            Import
          </Button>
          <Button variant="outlined">Cancel</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ImportPreviewScreen;