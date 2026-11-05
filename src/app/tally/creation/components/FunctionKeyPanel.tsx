import React from "react";
import { Box, Typography } from "@mui/material";

const FunctionKeysPanel = ({ onFunctionKeyClick }: any) => {
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
        display: "flex" as const,
        flexDirection: "column" as const,
      }}
    >
      <Box
        sx={{
          display: "flex" as const,
          flexDirection: "column" as const,
          height: "100%",
          borderTop: "1px solid #a0a0a0",
        }}
      >
        {functionKeys.map((item, index) => (
          <Box
            key={item.key}
            sx={{
              display: "flex" as const,
              padding: "2px 4px",
              alignItems: "center" as const,
              borderBottom: "1px solid #a0a0a0",
              bgcolor: (item as any).highlighted ? "#1976d2" : "transparent",
              color: (item as any).highlighted ? "white" : "inherit",
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
                fontWeight: "bold" as const,
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
            display: "flex" as const,
            padding: "2px 4px",
            alignItems: "center" as const,
            borderTop: "1px solid #a0a0a0",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold" as const,
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