"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const PaymentTermsConfig = () => {
  const [open, setOpen] = useState(true);
  const [terms, setTerms] = useState([
    { name: "Net 15", days: "15", isDefault: false },
    { name: "Net 30", days: "30", isDefault: false },
    { name: "Net 45", days: "45", isDefault: false },
    { name: "Net 60", days: "60", isDefault: false },
  ]);
  const [hoverIndex, setHoverIndex] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddNew = () => {
    setTerms([...terms, { name: "", days: "", isDefault: false }]);
  };

  const handleDeleteTerm = (index) => {
    const newTerms = [...terms];
    newTerms.splice(index, 1);
    setTerms(newTerms);
  };

  const handleSetDefault = (index) => {
    const newTerms = terms.map((term, i) => ({
      ...term,
      isDefault: i === index,
    }));
    setTerms(newTerms);
  };

  const handleTermChange = (index, field, value) => {
    const newTerms = [...terms];
    newTerms[index][field] = value;
    setTerms(newTerms);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          width: "600px",
          borderRadius: "8px",
          marginTop: -20,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 24px",
          fontSize: "18px",
          fontWeight: 500,
          marginBottom: "30px",
          borderBottom: "1px solid lightgray",
        }}
      >
        Configure Payment Terms
        <IconButton onClick={handleClose} size="small" sx={{ color: "red" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "0 24px" }}>
        <Box
          sx={{
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
            paddingBottom: "8px",
            marginBottom: "16px",
            width: "500px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingRight: "40px",
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                color: "#6B7280",
                fontSize: "14px",
                // width: "30%",
              }}
            >
              TERM NAME
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                color: "#6B7280",
                fontSize: "14px",
                width: "60%",
              }}
            >
              NUMBER OF DAYS
            </Typography>
          </Box>
        </Box>

        {terms.map((term, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              borderBottom:
                index === terms.length - 1
                  ? "none"
                  : "1px solid rgba(224, 224, 224, 1)",
              paddingBottom: "16px",
              marginBottom: "16px",
              width: "500px",
              position: "relative",
            }}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <Box sx={{ width: "50%", paddingRight: "8px" }}>
              <TextField
                fullWidth
                variant="outlined"
                value={term.name}
                onChange={(e) =>
                  handleTermChange(index, "name", e.target.value)
                }
                size="small"
                InputProps={{
                  sx: {
                    fontSize: "14px",
                    borderRadius: "4px",
                    width: "150px",
                  },
                }}
              />
            </Box>
            <Box sx={{ width: "50%", paddingRight: "8px" }}>
              <TextField
                fullWidth
                variant="outlined"
                value={term.days}
                onChange={(e) =>
                  handleTermChange(index, "days", e.target.value)
                }
                size="small"
                InputProps={{
                  sx: {
                    fontSize: "14px",
                    borderRadius: "4px",
                    width: "150px",
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                // marginLeft: "auto",
                visibility:
                  hoverIndex === index || term.isDefault ? "visible" : "hidden",
              }}
            >
              {term.isDefault ? (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#4CAF50",
                    borderRadius: "4px",
                    textTransform: "none",
                    fontSize: "13px",
                    padding: "4px 10px",
                    width: "120px",
                    // minWidth: "80px",
                    "&:hover": {
                      backgroundColor: "#43A047",
                    },
                  }}
                >
                  Default
                </Button>
              ) : (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleSetDefault(index)}
                  sx={{
                    color: "#3B82F6",
                    textTransform: "none",
                    fontSize: "12px",
                    padding: "4px 10px",
                    width: "120px",
                  }}
                >
                  Mark as Default
                </Button>
              )}
              <IconButton
                size="small"
                onClick={() => handleDeleteTerm(index)}
                sx={{
                  color: "#EF4444",
                  padding: "4px",
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{
            color: "#3B82F6",
            textTransform: "none",
            fontSize: "14px",
            marginTop: "8px",
            padding: "4px 0",
            fontWeight: 500,
          }}
        >
          Add New
        </Button>
      </DialogContent>

      <DialogActions
        sx={{ padding: "16px 24px", justifyContent: "flex-start" }}
      >
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            backgroundColor: "#3B82F6",
            textTransform: "none",
            borderRadius: "4px",
            padding: "6px 16px",
            fontSize: "14px",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#2563EB",
            },
          }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderColor: "#D1D5DB",
            color: "#374151",
            textTransform: "none",
            borderRadius: "4px",
            padding: "6px 16px",
            fontSize: "14px",
            fontWeight: 500,
            marginLeft: "8px",
            "&:hover": {
              borderColor: "#9CA3AF",
              backgroundColor: "transparent",
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentTermsConfig;
