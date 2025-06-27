import React from "react";
import { Dialog, DialogContent, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const VoucherDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ m: 0, p: 2, bgcolor: "#3b71c6", color: "white", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Other Vouchers</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Box sx={{ bgcolor: "#e6f0ff", display: "flex", flexDirection: "column" }}>
          <Box sx={{ padding: "8px 16px", cursor: "pointer", "&:hover": { backgroundColor: "#e0e0e0" } }}>
            <Typography sx={{ fontSize: "14px" }}>Order Vouchers</Typography>
          </Box>
          {/* Add more voucher types as needed */}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VoucherDialog;