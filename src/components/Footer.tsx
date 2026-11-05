"use client";
import { Box, Typography } from "@mui/material";

const Footer = (_props?: any) => {
  return (
    <Box 
    sx={{ textAlign: "center" as const, p: 2, backgroundColor: "#f5f5f5" }}>
      <Typography variant="body2">© 2025 My Company</Typography>
    </Box>
  );
};

export default Footer;
