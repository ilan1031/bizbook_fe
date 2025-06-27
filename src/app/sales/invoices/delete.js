import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * ConfirmationDialog - A reusable confirmation dialog component
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Function} props.onConfirm - Function to call when action is confirmed
 * @param {Object} props.dialogData - Data to be displayed in the dialog
 * @param {string} props.dialogData.title - Title of the dialog
 * @param {string} props.dialogData.message - Message to display
 * @param {string} props.dialogData.confirmText - Text for confirm button
 * @param {string} props.dialogData.cancelText - Text for cancel button
 */
const ConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  dialogData = {
    title: 'Delete invoice?',
    message: 'Invoice will be deleted and cannot be retrieved later. Are you sure about deleting it?',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  }
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <Box sx={{ p: 2 }}>
        <DialogTitle id="confirmation-dialog-title" sx={{ p: 0, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" />
          <Typography variant="h6" component="span">
            {dialogData.title}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, pb: 2 }}>
          <Typography variant="body1">
            {dialogData.message}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 0 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onConfirm}
            sx={{ borderRadius: 1 }}
          >
            {dialogData.confirmText}
          </Button>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ borderRadius: 1 }}
          >
            {dialogData.cancelText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

// Example page component showing how to use the dialog
export default function InvoicePage() {
  const [open, setOpen] = React.useState(false);
  const [dialogData, setDialogData] = React.useState({
    title: 'Delete invoice?',
    message: 'Invoice will be deleted and cannot be retrieved later. Are you sure about deleting it?',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  });

  const handleOpenDialog = (data = {}) => {
    // You can override default dialog data when opening
    setDialogData({ ...dialogData, ...data });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmAction = () => {
    console.log('Confirmed action with data:', dialogData);
    // Perform delete action here
    setOpen(false);
  };

  return (
    <div>
      <h1>Invoice Management</h1>
      
      {/* Example button to trigger dialog */}
      <Button 
        variant="contained" 
        color="error" 
        onClick={() => handleOpenDialog({ 
          invoiceId: '12345',
          // You can pass any additional data needed for the deletion process
        })}
      >
        Delete Invoice
      </Button>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={open}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        dialogData={dialogData}
      />
    </div>
  );
}