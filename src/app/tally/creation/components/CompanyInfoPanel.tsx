import React from "react";
import { Box, Typography } from "@mui/material";

const CompanyInfoPanel = (_props?: any) => {
  return (
    <Box
      sx={{
        width: "50%",
        height: "100%",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderTop: "none",
        borderRight: "none",
        display: "flex" as const,
        flexDirection: "column" as const,
      }}
    >
      {/* Current Period and Date Section */}
      <Box
        sx={{
          display: "flex" as const,
          borderBottom: "1px solid #ccc",
          padding: "8px 16px",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#0066cc",
              fontWeight: "bold" as const,
            }}
          >
            CURRENT PERIOD
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>
            1-Apr-24 to 31-Mar-25
          </Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: "right" as const }}>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#0066cc",
              fontWeight: "bold" as const,
            }}
          >
            CURRENT DATE
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>
            Monday, 1-Apr-2024
          </Typography>
        </Box>
      </Box>

      {/* Company Name and Last Entry Date headers */}
      <Box
        sx={{
          display: "flex" as const,
          padding: "16px 16px 0",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#0066cc",
              fontWeight: "bold" as const,
            }}
          >
            NAME OF COMPANY
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#0066cc",
              fontWeight: "bold" as const,
            }}
          >
            DATE OF LAST ENTRY
          </Typography>
        </Box>
      </Box>

      {/* Company Name and Last Entry Date values */}
      <Box
        sx={{
          display: "flex" as const,
          padding: "8px 16px 16px",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "14px" }}>lhub</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "14px" }}>1-Apr-24</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyInfoPanel;