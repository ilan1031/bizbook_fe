"use client";
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function AccountingVoucher() {
  const router = useRouter(); // Initialize the router
  const [openDialog, setOpenDialog] = useState(true);

  const handleDialogClose = (generate) => {
    if (generate) {
      router.push('/tally/preview'); // Navigate to the "preview" page
    }
    else setOpenDialog(router.push('/tally/creation')); // Close the dialog
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100%', bgcolor: '#e6e6e6' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#3a6ea5', height: '40px' }}>
        <Toolbar variant="dense" sx={{ minHeight: '40px', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" component="div" sx={{ color: 'white' }}>
            Accounting Voucher Creation
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ color: 'white' }}>
            National Enterprises
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Bottom Controls */}
      <Box sx={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: '#555', mr: 2 }}>Generate e-Invoice?</Typography>
          <Typography sx={{ color: '#555' }}>Yes</Typography>
        </Box>
        
        <Box>
          <Button variant="contained" sx={{ mr: 2, bgcolor: '#3a6ea5' }}>Save</Button>
          <Button variant="contained" sx={{ bgcolor: '#3a6ea5' }}>Cancel</Button>
        </Box>
      </Box>
      
      {/* Dialog for e-Invoice */}
      <Dialog
        open={openDialog}
        onClose={() => handleDialogClose(false)} // Close without action
        aria-labelledby="e-invoice-dialog"
        PaperProps={{
          sx: {
            borderRadius: '4px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            width: '350px',
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', pt: 4, pb: 3 }}>
          <Typography>Do you want to generate e-Invoice?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => handleDialogClose(true)} // Navigate to preview on Yes
            sx={{ 
              minWidth: '80px',
              bgcolor: '#3a6ea5',
              color: 'white',
              '&:hover': {
                bgcolor: '#2d5b8b',
              }
            }}
          >
            Yes
          </Button>
          <Typography sx={{ mx: 1 }}>or</Typography>
          <Button 
            onClick={() => handleDialogClose(false)} // Close dialog on No
            sx={{ 
              minWidth: '80px',
              bgcolor: '#3a6ea5',
              color: 'white',
              '&:hover': {
                bgcolor: '#2d5b8b',
              }
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Function Key Help */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        bgcolor: '#e2e8f0', 
        p: 1, 
        border: '1px solid #cbd5e0',
        width: '150px'
      }}>
        <Typography variant="body2" sx={{ color: '#4a5568', mb: 0.5 }}>F2:Date</Typography>
        <Typography variant="body2" sx={{ color: '#4a5568' }}>F3:Company</Typography>
      </Box>
      
      {/* Footer */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        bgcolor: '#3a6ea5', 
        color: 'white',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        pl: 2
      }}>
        <Typography variant="body2">TallyPrime Release 1.1</Typography>
      </Box>
    </Box>
  );
}