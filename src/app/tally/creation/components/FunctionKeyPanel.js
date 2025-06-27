import React from "react";
import { Box, Typography } from "@mui/material";

const FunctionKeysPanel = ({ onFunctionKeyClick }) => {
  const functionKeys = [
    { key: "F2", label: "Date"},
    { key: "F3", label: "Company" },
    { key: "F4", label: "Contra" },
    { key: "F5", label: "Payment" },
    { key: "F6", label: "Receipt" },
    { key: "F7", label: "Journal" },
    { key: "F8", label: "Sales" },
    { key: "F9", label: "Purchase" },
    { key: "F10", label: "Other Vouchers", clickable: true },
    { key: "I", label: "More Details" },
    { key: "O", label: "Related Reports" },
    { key: "L", label: "Optional" },
    { key: "W", label: "Pre-Close Order" },
  ];

  return (
    <Box
      sx={{
        width: "20%", 
        height: "100%",
        backgroundColor: "#e6f2ff",
        borderLeft: "1px solid #a0a0a0",
        borderTop: "none",
        borderRight: "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderTop: "1px solid #a0a0a0",
        }}
      >
        {functionKeys.map((item, index) => (
          <Box
            key={item.key}
            sx={{
              display: "flex",
              padding: "2px 4px",
              alignItems: "center",
              borderBottom: "1px solid #a0a0a0",
              bgcolor: item.highlighted ? "#1976d2" : "transparent",
              color: item.highlighted ? "white" : "inherit",
              cursor: item.clickable ? "pointer" : "default",
              "&:hover": {
                backgroundColor: item.clickable ? "#f5f5f5" : "inherit",
              },
            }}
            onClick={() => item.clickable && onFunctionKeyClick && onFunctionKeyClick(item.key)}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "bold",
                marginRight: "8px",
              }}
            >
              {item.key}:
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>{item.label}</Typography>
          </Box>
        ))}
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box
          sx={{
            display: "flex",
            padding: "2px 4px",
            alignItems: "center",
            borderTop: "1px solid #a0a0a0",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              marginRight: "8px",
            }}
          >
            F12:
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>Configure</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FunctionKeysPanel;