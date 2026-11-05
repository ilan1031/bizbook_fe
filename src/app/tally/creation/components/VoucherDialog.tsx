import React from "react";
import { Dialog, DialogContent, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const VoucherDialog = ({ open, onClose }: any) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ m: 0, p: 2, bgcolor: "#3b71c6", color: "white", fontWeight: "bold" as const, display: "flex" as const, justifyContent: "space-between" as const, alignItems: "center" as const }}>
        <Typography variant="h6">Other Vouchers</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Box sx={{ bgcolor: "#e6f0ff", display: "flex" as const, flexDirection: "column" as const }}>
          <Box sx={{ padding: "8px 16px", cursor: "pointer" as const, "&:hover": { backgroundColor: "#e0e0e0" } }}>
            <Typography sx={{ fontSize: "14px" }}>Order Vouchers</Typography>
          </Box>
          {/* Add more voucher types as needed */}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VoucherDialog;